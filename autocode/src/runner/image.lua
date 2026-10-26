-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The job of one image build. The builder resolves the identity the build
-- was requested under and reads the image's recipe under it, builds the
-- reference from its Dockerfile or makes a registry reference available
-- locally, probes which agent CLIs the image contains, records the build log
-- and settles the image's public status through the trusted runtime meta
-- write, so a build that cannot proceed still ends visibly.
local repo = require("repo")
local drivers = require("drivers")
local docker = require("docker")
local execution_identity = require("execution_identity")
local job_outcome = require("job_outcome")
local component = require("component")
local transport = require("transport")

local MAX_LOG = 65536
local DEFERRED_OWNER = "chestor.autocode:images"
local RECIPE = "chestor.autocode.runner:image_recipe"

type Log = {lines: {string}, size: integer}
type Recipe = transport.Recipe
type Outcome = job_outcome.Outcome

local function add(log: Log, line: string)
    if #line > MAX_LOG then line = line:sub(1, MAX_LOG) end
    log.lines[#log.lines + 1] = line
    log.size = log.size + #line + 1
    while log.size > MAX_LOG and #log.lines > 1 do
        log.size = log.size - #log.lines[1] - 1
        table.remove(log.lines, 1)
    end
end

-- fetch makes the image reference available; nil means it is.
local function fetch(ref: string, dockerfile: string, mode: repo.BuildMode, log: Log): string?
    local function step(args: {string}, stdin: string?): integer?
        local code, err = docker.run(args, {stdin = stdin, on_line = function(line: string) add(log, line) end})
        if err then add(log, tostring(err)) end
        return code
    end
    if dockerfile ~= "" then
        add(log, "$ docker build -t " .. ref .. " -")
        if step({"build", "-t", ref, "-"}, dockerfile) ~= 0 then return "build failed" end
        return nil
    end
    if mode == "initial" and step({"image", "inspect", "--format", "{{.Id}}", ref}) == 0 then return nil end
    add(log, "$ docker pull " .. ref)
    if step({"pull", ref}) ~= 0 then return "pull failed" end
    return nil
end

local function runtime(recipe: Recipe, log: Log): string?
    local probe = [[set -eu
for tool in dirname mkdir git timeout; do command -v "$tool" >/dev/null || exit 127; done
mkdir -p "$1/work"
test -w "$1" && test -w "$1/work"
timeout -k 1 1 sh -c ':'
]]
    local code, err = docker.run({"run", "--rm", "--network", "none", "--entrypoint", "sh", recipe.ref,
        "-c", probe, "probe", recipe.home}, {on_line = function(line: string) add(log, line) end})
    if err or code ~= 0 then return "runtime prerequisites: require dirname, mkdir, git, timeout -k, and a writable configured HOME/work: " .. tostring(err or code) end
    return nil
end

-- contained lists the activated drivers whose CLI is on the image's PATH.
local function contained(ref: string, log: Log): ({string}?, error?)
    local list, list_err = drivers.list()
    if not list then return nil, list_err end
    local by_executable: {[string]: {string}} = {}
    local names: {string} = {}
    for _, driver in ipairs(list) do
        if not by_executable[driver.executable] then
            by_executable[driver.executable] = {}
            names[#names + 1] = driver.executable
        end
        table.insert(by_executable[driver.executable], driver.id)
    end
    local found: {string} = {}
    local probe = 'for e in "$@"; do command -v "$e" >/dev/null 2>&1 && echo "$e"; done; exit 0'
    local args: {string} = {"run", "--rm", "--network", "none", "--entrypoint", "sh", ref, "-c", probe, "probe"}
    for _, name in ipairs(names) do args[#args + 1] = name end
    local code, probe_err = docker.run(args, {on_line = function(line: string)
        for _, id in ipairs(by_executable[line] or {}) do found[#found + 1] = id end
    end})
    if probe_err then return nil, probe_err end
    if code ~= 0 then return nil, errors.new({kind = errors.UNAVAILABLE, message = "agent probe exited with code " .. tostring(code)}) end
    table.sort(found)
    add(log, "agents: " .. (#found > 0 and table.concat(found, ", ") or "none"))
    return found, nil
end

local failure = job_outcome.failure

local function project(image_id: string, build_id: string): Outcome?
    local err = repo.project_image_build(image_id, build_id, function(build: repo.ImageBuild): error?
        local _, write_err = component.set_runtime_meta(image_id, {status = build.status, agents = build.agents, last_error = build.last_error})
        return write_err
    end)
    if err then return failure("image status: " .. tostring(err), errors.UNAVAILABLE) end
    return nil
end

local function refused(image_id: string, build_id: string, problem: string): Outcome
    local log_err = repo.finish_image_build(image_id, problem, build_id, "failed", {}, problem)
    if log_err then return failure("image build log write: " .. tostring(log_err), errors.UNAVAILABLE) end
    return project(image_id, build_id) or {ok = true, output = {image_id = image_id, status = "failed"}}
end

local function main(input: {[string]: unknown}): Outcome
    local payload = type(input.payload) == "table" and input.payload or {}
    local image_id = type(payload.image_id) == "string" and payload.image_id or ""
    local build_id = type(payload.build_id) == "string" and payload.build_id or ""
    local build, build_err = repo.image_build(image_id)
    if build_err then return failure("image build read: " .. tostring(build_err), errors.UNAVAILABLE) end
    if not build then return failure("image build " .. image_id .. " not found", errors.NOT_FOUND) end
    if build.build_id ~= build_id then return failure("stale image build generation", errors.CONFLICT) end
    if build.finished_at ~= "" then return project(image_id, build_id) or {ok = true, output = {image_id = image_id, status = build.status}} end
    local projection_failure = project(image_id, build_id)
    if projection_failure then return projection_failure end

    local stored, row_err = execution_identity.from_row(build.identity.actor_id, build.identity.actor_context)
    if not stored then return refused(image_id, build_id, "image build identity: " .. tostring(row_err)) end
    local requester, bind_err = execution_identity.bind(stored, {deferred_owner = DEFERRED_OWNER})
    if not requester then
        return refused(image_id, build_id, "the build requester can no longer manage images: " .. tostring(bind_err))
    end
    local result, recipe_err = requester:call(RECIPE, {image_id = image_id})
    if not result then return refused(image_id, build_id, tostring(recipe_err)) end
    local recipe, decode_err = transport.recipe(result)
    if not recipe then return refused(image_id, build_id, tostring(decode_err)) end

    local log: Log = {lines = {}, size = 0}
    local status = "failed"
    local agents: {string} = {}
    local problem = fetch(recipe.ref, recipe.dockerfile, build.mode, log)
    if not problem then problem = runtime(recipe, log) end
    if problem then
        add(log, problem)
    else
        local found, probe_err = contained(recipe.ref, log)
        if found then
            status, agents = "ready", found
        else
            problem = "agent probe: " .. tostring(probe_err)
            add(log, problem)
        end
    end
    local log_err = repo.finish_image_build(image_id, table.concat(log.lines, "\n"), build_id, status, agents, problem or "",
        {ref = recipe.ref, home = recipe.home, settings = recipe.settings})
    if log_err then return failure("image build log write: " .. tostring(log_err), errors.UNAVAILABLE) end
    return project(image_id, build_id) or {ok = true, output = {image_id = image_id, status = status}}
end

return { main = main }

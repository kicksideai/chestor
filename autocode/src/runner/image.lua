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
local job_types = require("job_types")
local component = require("component")

local MAX_LOG = 65536
local DEFERRED_OWNER = "chestor.autocode:images"
local RECIPE = "chestor.autocode.runner:image_recipe"

type Log = {lines: {string}, size: integer}
type Recipe = {ref: string, dockerfile: string}
type Outcome = {ok: boolean, output: {[string]: unknown}?, error_native: unknown?}

local function add(log: Log, line: string)
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

local function failure(message: string, kind: string): Outcome
    return {ok = false, error_native = job_types.error_to_data(errors.new({kind = kind, message = message}))}
end

local function settle(image_id: string, status: string, agents: {string}, problem: string): Outcome?
    local _, err = component.set_runtime_meta(image_id, {status = status, agents = agents, last_error = problem})
    if err then return failure("image status: " .. tostring(err), errors.UNAVAILABLE) end
    return nil
end

-- refused settles an image whose build cannot start.
local function refused(image_id: string, problem: string): Outcome
    local log_err = repo.finish_image_build(image_id, problem)
    if log_err then return failure("image build log write: " .. tostring(log_err), errors.UNAVAILABLE) end
    return settle(image_id, "failed", {}, problem) or {ok = true, output = {image_id = image_id, status = "failed"}}
end

local function main(input: {[string]: unknown}): Outcome
    local payload = type(input.payload) == "table" and input.payload or {}
    local image_id = type(payload.image_id) == "string" and payload.image_id or ""
    local build, build_err = repo.image_build(image_id)
    if build_err then return failure("image build read: " .. tostring(build_err), errors.UNAVAILABLE) end
    if not build then return failure("image build " .. image_id .. " not found", errors.NOT_FOUND) end
    if build.finished_at ~= "" then return {ok = true, output = {image_id = image_id}} end

    local stored, row_err = execution_identity.from_row(build.identity.actor_id, build.identity.actor_context)
    if not stored then return refused(image_id, "image build identity: " .. tostring(row_err)) end
    local requester, bind_err = execution_identity.bind(stored, {deferred_owner = DEFERRED_OWNER})
    if not requester then
        return refused(image_id, "the build requester can no longer manage images: " .. tostring(bind_err))
    end
    local result, recipe_err = requester:call(RECIPE, {image_id = image_id})
    if not result then return refused(image_id, tostring(recipe_err)) end
    local recipe = result :: Recipe

    local log: Log = {lines = {}, size = 0}
    local status = "failed"
    local agents: {string} = {}
    local problem = fetch(recipe.ref, recipe.dockerfile, build.mode, log)
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
    local log_err = repo.finish_image_build(image_id, table.concat(log.lines, "\n"))
    if log_err then return failure("image build log write: " .. tostring(log_err), errors.UNAVAILABLE) end
    return settle(image_id, status, agents, problem or "") or {ok = true, output = {image_id = image_id, status = status}}
end

return { main = main }

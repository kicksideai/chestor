-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The job of one image build. The builder resolves the identity the build
-- was requested under and reads the image's recipe under it, builds the
-- reference from its Dockerfile or makes a registry reference available
-- locally, probes which agent CLIs the image contains, records the build log
-- and settles the image's public status through the trusted runtime meta
-- write, so a build that cannot proceed still ends visibly.
local image_state = require("image_state")
local repo = require("repo")
local drivers = require("drivers")
local docker = require("docker")
local image_tags = require("image_tags")
local execution_identity = require("execution_identity")
local job_outcome = require("job_outcome")
local component = require("component")
local transport = require("transport")
local container = require("container")

local MAX_LOG = 65536
local DEFERRED_OWNER = "chestor.autocode:images"
local RECIPE = "chestor.autocode.service:image_recipe"

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

-- fetch pins the resolved image under the generation tag before any probe.
local function fetch(ref: string, tag: string, dockerfile: string, mode: repo.BuildMode, log: Log, deadline: string?): (string?, error?)
    local function step(args: {string}, stdin: string?, on_line: ((string) -> ())?): (integer?, error?)
        local code, err = docker.run(args, {deadline = deadline, stdin = stdin, on_line = function(line: string)
            add(log, line)
            if on_line then on_line(line) end
        end})
        if err then add(log, tostring(err)) end
        return code, err
    end
    if dockerfile ~= "" then
        add(log, "$ docker build -t " .. tag .. " -")
        local code, err = step({"build", "-t", tag, "-"}, dockerfile)
        if err or code ~= 0 then return "build failed", err end
        return nil
    end
    local resolved = ""
    local digests: number? = nil
    local code, inspect_err = docker.run({"image", "inspect", "--format", "{{.Id}} {{len .RepoDigests}}", ref},
        {deadline = deadline, on_line = function(line: string)
            local id, count = line:match("^(sha256:[a-f0-9]+) (%d+)$")
            if id and #id == 71 then resolved, digests = id, tonumber(count) end
        end})
    if inspect_err then add(log, tostring(inspect_err)); return "image inspection failed", inspect_err end
    if code == 0 then
        if not digests then return "image inspection returned an invalid ID or RepoDigests count" end
        if mode == "refresh" and digests == 0 then add(log, "local-only image: re-probing without pulling") end
    end
    if code ~= 0 or (mode == "refresh" and digests ~= 0) then
        add(log, "$ docker pull " .. ref)
        local digest = ""
        local pulled, pull_err = step({"pull", ref}, nil, function(line: string)
            local value = line:match("^Digest: (sha256:[a-f0-9]+)$")
            if value and #value == 71 then digest = value end
        end)
        if pull_err or pulled ~= 0 then return "pull failed", pull_err end
        if digest == "" then return "pull returned no immutable digest" end
        local repository = ref:gsub("@.*$", ""):gsub(":[^/:]+$", "")
        resolved = repository .. "@" .. digest
    end
    local tagged, tag_err = step({"image", "tag", resolved, tag})
    if tag_err or tagged ~= 0 then return "generation tagging failed", tag_err end
    return nil
end

local function probe_args(recipe: Recipe, image_id: string, build_id: string, deadline: string?): ({string}?, error?)
    local name = "autocode-probe-" .. build_id
    local err = docker.ensure_removed(name, deadline)
    if err then return nil, err end
    local args: {string} = {"create", "--cap-drop=NET_RAW", "--cgroupns=private", "--name", name, "--label", "chestor.autocode", "--label", "chestor.autocode.probe=" .. build_id,
        "--label", "chestor.autocode.image=" .. image_id, "--entrypoint", "sh"}
    for _, arg in ipairs(container.limits(recipe.settings)) do args[#args + 1] = arg end
    if recipe.settings.network ~= "" then args[#args + 1] = "--network"; args[#args + 1] = recipe.settings.network end
    if recipe.settings.gpus ~= "" then args[#args + 1] = "--gpus"; args[#args + 1] = recipe.settings.gpus end
    for _, argument in ipairs(recipe.settings.extra_args) do args[#args + 1] = argument end
    args[#args + 1] = recipe.ref
    return args, nil
end

local function probe(recipe: Recipe, args: {string}, build_id: string, deadline: string?, on_line: (string) -> ()): (integer?, error?)
    local name = "autocode-probe-" .. build_id
    local lines: {string} = {}
    local code, err = docker.run(args, {deadline = deadline,
        isolation = {name = name, image = recipe.ref, network = recipe.settings.network, gpus = recipe.settings.gpus ~= "",
            mounts = {}, limits = recipe.settings},
        on_line = function(line: string)
            lines[#lines + 1] = line
            if line:match("^WARNING: ") then on_line(line) end
        end})
    if not err and code == 0 then
        code, err = docker.run({"start", "-a", name}, {deadline = deadline, on_line = on_line})
    else
        for _, line in ipairs(lines) do if not line:match("^WARNING: ") then on_line(line) end end
    end
    local clean_err = docker.ensure_removed(name, deadline)
    return code, err or clean_err
end

local function runtime(recipe: Recipe, log: Log, image_id: string, build_id: string, deadline: string?): (string?, error?)
    local script = [[set -eu
for tool in dirname mkdir git timeout; do command -v "$tool" >/dev/null || exit 127; done
mkdir -p "$1/work"
test -w "$1" && test -w "$1/work"
timeout -k 1 1 sh -c ':'
]]
    local args, clean_err = probe_args(recipe, image_id, build_id, deadline)
    if not args then return "probe cleanup: " .. tostring(clean_err), clean_err end
    for _, arg in ipairs({"-c", script, "probe", recipe.home}) do args[#args + 1] = arg end
    local code, err = probe(recipe, (args :: {string}), build_id, deadline, function(line: string) add(log, line) end)
    if err or code ~= 0 then return "runtime prerequisites: require dirname, mkdir, git, timeout -k, and a writable configured HOME/work: " .. tostring(err or code), err end
    return nil
end

-- contained lists the activated drivers whose CLI is on the image's PATH.
local function contained(recipe: Recipe, log: Log, image_id: string, build_id: string, deadline: string?): ({string}?, error?)
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
    local script = 'for e in "$@"; do command -v "$e" >/dev/null 2>&1 && echo "$e"; done; exit 0'
    local args, clean_err = probe_args(recipe, image_id, build_id, deadline)
    if not args then return nil, clean_err end
    for _, arg in ipairs({"-c", script, "probe"}) do args[#args + 1] = arg end
    for _, name in ipairs(names) do args[#args + 1] = name end
    local code, probe_err = probe(recipe, (args :: {string}), build_id, deadline, function(line: string)
        if line:match("^WARNING: ") then add(log, line) end
        for _, id in ipairs(by_executable[line] or {}) do found[#found + 1] = id end
    end)
    if probe_err then return nil, probe_err end
    if code ~= 0 then return nil, errors.new({kind = errors.UNAVAILABLE, message = "agent probe exited with code " .. tostring(code)}) end
    table.sort(found)
    add(log, "agents: " .. (#found > 0 and table.concat(found, ", ") or "none"))
    return found, nil
end

local failure = job_outcome.failure

local function project(image_id: string, build_id: string, settled: boolean, deadline: string?): Outcome?
    local err = repo.project_image_build(image_id, build_id, function(build: repo.ImageBuild): error?
        if build.status == "ready" then
            local identity, identity_err = execution_identity.from_row(build.identity.actor_id, build.identity.actor_context)
            if not identity then return job_outcome.native(identity_err) end
            local requester, bind_err = execution_identity.bind(identity, {deferred_owner = DEFERRED_OWNER})
            if not requester then return job_outcome.native(bind_err) end
            local _, ready_err = requester:call("chestor.autocode.service:image_ready", {image_id = image_id, build_id = build_id})
            if ready_err then return job_outcome.native(ready_err) end
            return image_tags.retire(image_id, image_tags.name(image_id, build_id), deadline)
        end
        if build.status == "failed" then
            local clean_err = docker.ensure_removed("autocode-probe-" .. build_id, deadline)
            if clean_err then return clean_err end
            local tag_err = image_tags.remove(image_tags.name(image_id, build_id), deadline)
            if tag_err then return tag_err end
        end
        local _, write_err = component.set_runtime_meta(image_id, image_state.fields(build))
        return write_err
    end)
    if err then return failure("image status", errors.UNAVAILABLE, err) end
    -- The final wake follows the projection commit and repeats on job retry.
    if settled then
        local notified, notify_err = component.notify_access(image_id, nil, {event = "autocode.image.changed"})
        if notify_err or not notified or notified.success ~= true then
            return failure("image notification refused", errors.UNAVAILABLE, notify_err)
        end
    end
    return nil
end

local function refused(image_id: string, build_id: string, problem: string, deadline: string?, cause: error?): Outcome
    local native = cause and job_outcome.data(cause) or nil
    local log_err = repo.finish_image_build(image_id, problem, build_id, "failed", {}, problem, nil, native)
    if log_err then return failure("image build log write", errors.UNAVAILABLE, log_err) end
    return project(image_id, build_id, true, deadline) or {ok = true, output = {image_id = image_id, status = "failed", error_native = native}}
end

local function main(input: {[string]: unknown}): Outcome
    local job = type(input.job) == "table" and input.job or {}
    local deadline = type(job.deadline) == "string" and job.deadline or nil
    local payload = type(input.payload) == "table" and input.payload or {}
    local image_id = type(payload.image_id) == "string" and payload.image_id or ""
    local build_id = type(payload.build_id) == "string" and payload.build_id or ""
    local build, build_err = repo.image_build(image_id)
    if build_err then return failure("image build read", errors.UNAVAILABLE, build_err) end
    if not build then return failure("image build " .. image_id .. " not found", errors.NOT_FOUND) end
    if build.build_id ~= build_id then return failure("stale image build generation", errors.CONFLICT) end
    if build.finished_at ~= "" then return project(image_id, build_id, true, deadline) or {ok = true, output = {image_id = image_id, status = build.status, error_native = build.error_native}} end
    local projection_failure = project(image_id, build_id, false, deadline)
    if projection_failure then return projection_failure end

    local stored, row_err = execution_identity.from_row(build.identity.actor_id, build.identity.actor_context)
    if not stored then return refused(image_id, build_id, "image build identity: " .. tostring(row_err), deadline, job_outcome.native(row_err)) end
    local requester, bind_err = execution_identity.bind(stored, {deferred_owner = DEFERRED_OWNER})
    if not requester then
        return refused(image_id, build_id, "the build requester can no longer manage images: " .. tostring(bind_err), deadline, job_outcome.native(bind_err))
    end
    local result, recipe_err = requester:call(RECIPE, {image_id = image_id})
    if recipe_err or not result then return refused(image_id, build_id, tostring(recipe_err), deadline, job_outcome.native(recipe_err)) end
    local recipe, decode_err = transport.recipe(result)
    if not recipe then return refused(image_id, build_id, tostring(decode_err), deadline, decode_err) end

    local log: Log = {lines = {}, size = 0}
    local status = "failed"
    local agents: {string} = {}
    local tag = image_tags.name(image_id, build_id)
    local approved = ""
    local user_ref = recipe.ref
    local problem, cause = fetch(recipe.ref, tag, recipe.dockerfile or "", build.mode, log, deadline)
    if not problem then
        local ids: {string} = {}
        local code, inspect_err = docker.run({"image", "inspect", "--format", "{{.Id}}", tag},
            {deadline = deadline, on_line = function(line: string) ids[#ids + 1] = line end})
        local id = table.concat(ids, "")
        if inspect_err or code ~= 0 or not id:match("^sha256:[a-f0-9]+$") or #id ~= 71 then
            problem, cause = "image ID inspection failed: " .. tostring(inspect_err or code), inspect_err
        else approved, recipe.ref = id, tag end
    end
    if not problem then problem, cause = runtime(recipe, log, image_id, build_id, deadline) end
    if problem then
        add(log, problem)
    else
        local found, probe_err = contained(recipe, log, image_id, build_id, deadline)
        if found then
            status, agents = "ready", found
        else
            problem, cause = "agent probe: " .. tostring(probe_err), probe_err
            add(log, problem)
        end
    end
    if status == "ready" and recipe.dockerfile ~= "" then
        local code, tag_err = docker.run({"image", "tag", tag, user_ref}, {deadline = deadline})
        if tag_err or code ~= 0 then
            status, problem, cause = "failed", "reference tagging failed: " .. tostring(tag_err or code), tag_err
            add(log, problem)
        end
    end
    recipe.ref = approved ~= "" and approved or recipe.ref
    local log_err = repo.finish_image_build(image_id, table.concat(log.lines, "\n"), build_id, status, agents, problem or "",
        recipe, cause and job_outcome.data(cause) or nil)
    if log_err then return failure("image build log write", errors.UNAVAILABLE, log_err) end
    return project(image_id, build_id, true, deadline) or {ok = true, output = {image_id = image_id, status = status, error_native = cause and job_outcome.data(cause) or nil}}
end

return { main = main }

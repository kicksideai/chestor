-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local M = {state = {}, ACCESS = {READ = 1, WRITE = 2, DELETE = 4, ADMIN = 8}}
function M.reset()
    M.state = {resumes = 0, projects = 0, fetches = 0, stopped = 0, removed = 0, events = {},
        run = {id = "run", owner_id = "owner", account_id = "account", identity = {actor_id = "owner", actor_context = "{}"},
            status = "queued", cancel_requested = false, repo_url = "", timeout_ms = 60000, started_at = ""},
        build = {build_id = "generation", identity = {actor_id = "owner", actor_context = "{}"}, mode = "initial",
            finished_at = "", status = "preparing", agents = {}, last_error = "", projected = false}}
    return M.state
end
function M.stored_run()
    if M.state.read_error then return nil, errors.new({kind = errors.UNAVAILABLE, message = "read failed"}) end
    return M.state.run
end
function M.acknowledge_delivery() M.state.delivered = true; return nil end
function M.call()
    M.state.resumes = M.state.resumes + 1
    if M.state.resume_error then return nil, errors.new({kind = errors.UNAVAILABLE, message = "signal unavailable"}) end
    return true
end
function M.image_build() return M.state.build end
function M.finish_image_build(_, log, generation, status, agents, problem)
    local build = M.state.build
    build.finished_at, build.status, build.agents, build.last_error = "finished", status, agents, problem
end
function M.project_image_build(_, _, project)
    local build = M.state.build
    if build.projected then return nil end
    local err = project(build)
    if err then return err end
    build.projected = build.finished_at ~= ""
end
function M.set_runtime_meta(_, fields)
    M.state.projects = M.state.projects + 1
    if M.state.projection_error then return false, errors.new({kind = errors.UNAVAILABLE, message = "projection failed"}) end
    M.state.public = fields
    return true
end
function M.from_row() return {} end
function M.bind()
    return {call = function(_, entry)
        if M.state.malformed then return {bad = true} end
        if entry:find("image_recipe", 1, true) then return {ref = "image", dockerfile = "", home = "/home/agent", settings = {}} end
        return M.state.prepared
    end}
end
function M.list() return {} end
function M.run(args, opts)
    if type(args) == "string" then return M.state.run end
    opts = opts or {}
    if args[1] == "create" then
        if M.state.cancel_on_create then M.state.run.cancel_requested = true end
        return 0
    elseif args[1] == "start" then
        M.state.attached = true
        if M.state.cancel_on_attach then M.state.run.cancel_requested = true end
        if M.state.cancel_silently then
            M.state.run.cancel_requested = true
            time.sleep("500ms")
        elseif opts.on_line then opts.on_line("log line") end
        return 0
    end
    if args[1] == "run" and M.state.runtime_missing then return 127 end
    M.state.fetches = M.state.fetches + 1
    return 0
end
function M.now() return "now" end
function M.record_account_error() end
function M.next_seq() return 1 end
function M.append_event(_, _, kind, text) table.insert(M.state.events, {kind = kind, text = text}) end
function M.finish_run(_, status) M.state.run.status = status; return true end
function M.start_run()
    if M.state.cancel_on_reserve then M.state.run.cancel_requested = true end
    if M.state.run.cancel_requested then return false end
    M.state.run.status = "running"
    return true
end
function M.stop() M.state.stopped = M.state.stopped + 1 end
function M.remove() M.state.removed = M.state.removed + 1 end
function M.container_name() return "container" end
function M.notify() end
function M.account(id)
    M.state.health_topics = M.state.health_topics or {}
    table.insert(M.state.health_topics, "component." .. id)
end
M.RUNS_TOPIC = "runs"
function M.run_topic() return "run" end
function M.nudge() return errors.new({kind = errors.UNAVAILABLE, message = "pool unavailable"}) end
function M.enqueue(job) M.state.enqueued = job; return function() end end
function M.check() return nil end
function M.capture() return {actor_id = "owner", actor_context = "{}"} end
function M.request_image_build(id, identity, mode, work, generation)
    M.state.requested_build = {image_id = id, identity = identity, mode = mode, build_id = generation}
    if M.state.admission_error then return errors.new({kind = errors.UNAVAILABLE, message = "queue unavailable"}) end
    if not generation then return errors.new({kind = errors.INVALID, message = "generation required"}) end
    return nil
end
function M.settle_account() end
function M.get(id, resource_id)
    if id == "image" and resource_id then return {id = resource_id, meta = {ref = "image"}, access = 15, owner = "owner"} end
    if id == "account_cooldown" then return M.state.cooldown or "1m" end
    if id == "run_retention" then return M.state.retention or "1m" end
    if id == "account" then return M.state.account end
    if id == "claude" and M.state.missing_driver then return nil, errors.new({kind = errors.NOT_FOUND, message = "driver removed"}) end
    if id == "claude" then return {id = "claude", credentials = {files = {{path = ".login.json", content_format = "json", write_back = true, initialize = {}}}, variables = {}, subscriptions = {}}} end
    if id == "chestor.autocode:runtime_config" then
        if M.state.registry_error then return nil, M.state.registry_error end
        return {meta = {workspace_roots = M.state.roots, docker_executor = M.state.executor or "chestor.autocode:docker", docker_context = M.state.docker_context or ""}}
    end
    if id ~= "chestor.autocode:docker" and id ~= M.state.executor then return "1m" end
    M.state.executor_id = id
    return {release = function() end, exec = function(_, command, options)
        M.state.command = command
        M.state.command_env = options.env
        local index = 0
        return {stdout_stream = function() return {close = function() end, read = function()
            index = index + 1
            return M.state.chunks[index]
        end} end, start = function() return true end, close_stdin = function() return true end,
            wait = function() return 0 end, close = function() end}
    end}
end
function M.reader()
    return {feed = function() return {problems = {}, observations = {}} end,
        finish = function() return {problems = {}, observations = {}, terminal = M.state.terminal or {outcome = "succeeded"}} end}
end
function M.prepared(value) return value end
function M.recipe(value) return value end
function M.text(value) return type(value) == "string" and value or "" end
function M.patch_context()
    if M.state.patch_conflict then return errors.new({kind = errors.CONFLICT, message = "revision conflict"}) end
    M.state.patched = true
end
function M.prune_runs(before) M.state.before = before; return 0 end
function M.register(_, meta, private)
    M.state.registered = {meta = meta, private = private}
    return "created"
end
function M.context() return {values = {}, revision = 7, access = 15} end
function M.set_meta() M.state.meta_written = true end
function M.replace(id, fields, patch, revision) M.state.replaced = {id = id, fields = fields, patch = patch, revision = revision} end
function M.has(access, required) return math.floor(access / required) % 2 == 1 end

function M.submit(request) M.state.submitted = request; return "existing-run" end

function M.new()
    return {with_actor = function(self) M.state.resume_actor_bound = true; return self end,
        with_scope = function(self) M.state.resume_scope_bound = true; return self end,
        call = function(_, ...) return M.call(...) end}
end

return M

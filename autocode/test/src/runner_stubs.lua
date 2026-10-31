-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local uuid = require("uuid")
local M = {state = {}}
local repo = {}
local component = {}
local execution_identity = {}
local drivers = {}
local registry = {}
local docker = {}
local function record_deadline(command, deadline)
    M.state.deadline_calls = M.state.deadline_calls or {}
    table.insert(M.state.deadline_calls, {command = command, deadline = deadline})
end
local jobs = {}
local runs = {}
local live = {}
local deferred = {}
local resources = {}
local funcs = {}
local exec = {}
local settings = {MAX_RUN_TIMEOUT_MS = 604800000}
function M.reset()
    M.state = {commands = {}, resumes = 0, projects = 0, fetches = 0, stopped = 0, removed = 0, events = {},
        run = {agent = "claude", image_id = "image", id = "run", owner_id = "owner", account_id = "account", identity = {actor_id = "owner", actor_context = "{}"},
            status = "queued", cancel_requested = false, repo_url = "", timeout_ms = 60000, started_at = ""},
        build = {build_id = "generation", job_id = "build-job", identity = {actor_id = "owner", actor_context = "{}"}, mode = "initial",
            finished_at = "", status = "preparing", agents = {}, last_error = "", projected = false}}
    return M.state
end
function repo.stored_run(id)
    if M.state.streaming then M.state.full_reads_during_stream = (M.state.full_reads_during_stream or 0) + 1 end
    if M.state.read_error then return nil, errors.new({kind = errors.UNAVAILABLE, message = "read failed"}) end
    if M.state.runs then return M.state.runs[id] end
    return M.state.run
end
function repo.request_cancel()
    M.state.run.cancel_requested = true
    return true
end
function repo.cancel_requested()
    M.state.cancel_reads = (M.state.cancel_reads or 0) + 1
    return M.state.run.cancel_requested
end
function repo.acknowledge_delivery() M.state.delivered = true; return nil end
function funcs.call(entry, args)
    if entry == "chestor.autocode.persist:project_account" then return true, M.state.account_projection_error end
    if entry ~= "kickside.blocks:resume" then error("unexpected function call: " .. entry) end
    M.state.resumes = M.state.resumes + 1
    M.state.resume_args = args
    if M.state.resume_error then return nil, errors.new({kind = M.state.resume_kind or errors.UNAVAILABLE, message = "signal unavailable", retryable = true, details = {code = "signal.failure"}}) end
    return true
end
function repo.image_build() return M.state.build end
function repo.finish_image_build(_, log, generation, status, agents, problem, recipe)
    local build = M.state.build
    build.log = log
    build.recipe = recipe
    build.finished_at, build.status, build.agents, build.last_error = "finished", status, agents, problem
end
function repo.project_image_build(_, _, project)
    local build = M.state.build
    if build.projected then return nil end
    local err = project(build)
    if err then return err end
    build.projected = build.finished_at ~= ""
    if build.projected and build.status == "ready" then build.approved_recipe, build.approved_agents = build.recipe, build.agents end
end
function component.set_runtime_meta(_, fields)
    M.state.projects = M.state.projects + 1
    if M.state.projection_error then return false, errors.new({kind = errors.UNAVAILABLE, message = "projection failed"}) end
    M.state.public = fields
    if M.state.on_meta then M.state.on_meta() end
    return true
end
function component.notify_access(id)
    M.state.image_notifies = (M.state.image_notifies or 0) + 1
    if M.state.on_image_notify then M.state.on_image_notify() end
    if M.state.image_notify_error then return nil, errors.new({kind = errors.UNAVAILABLE, message = "notify unavailable"}) end
    return {success = true}
end
function execution_identity.from_row() return {} end
function execution_identity.bind()
    return {call = function(_, entry)
        if entry == "chestor.autocode.service:image_ready" then return component.set_runtime_meta("image", {status = "ready"}) end
        if entry == "chestor.autocode.service:image_recipe" then return M.state.recipe or M.recipe_fixture() end
        if entry ~= "chestor.autocode.service:prepare" then error("unexpected owner call: " .. entry) end
        return M.state.prepared
    end}
end
function drivers.list() return M.state.drivers or {} end
function registry.find(filter)
    M.state.discovery_filter = filter
    if filter[".kind"] == "contract.binding" then return {} end
    return {{meta = {driver_id = "claude", icon = "wrong-kind"}}}
end
function docker.run(args, opts)
    table.insert(M.state.commands, table.concat(args, " "))
    opts = opts or {}
    record_deadline(args[1], opts.deadline)
    if args[1] == "image" and args[2] == "ls" and args[4] == "{{.Repository}}:{{.Tag}}" then
        for _, tag in ipairs(M.state.generation_tags or {}) do opts.on_line(tag) end
        return 0
    end
    if M.state.docker_steps then
        local step = table.remove(M.state.docker_steps, 1)
        if not step then error("unexpected Docker command: " .. table.concat(args, " ")) end
        M.state.docker_commands = M.state.docker_commands or {}
        table.insert(M.state.docker_commands, table.concat(args, " "))
        for _, line in ipairs(step.lines or {}) do if opts.on_line then opts.on_line(line) end end
        return step.code or 0, step.err
    end
    if args[1] == "image" and args[2] == "inspect" and args[4] == "{{.Id}} {{len .RepoDigests}}" then
        opts.on_line("sha256:" .. string.rep("a", 64) .. " 0")
        return 0
    end
    if args[1] == "image" and args[2] == "inspect" and args[4] == "{{.Id}}" then
        if opts.on_line then opts.on_line("sha256:" .. string.rep(M.state.interleave_build and args[5] == "shared:latest" and "b" or "a", 64)) end
        return 0
    end
    if args[1] == "ps" then
        if args[2] == "-aq" and M.state.remove_error and not M.state.remove_absent then
            if opts.on_line then opts.on_line("container") end
            return 0
        end
        local probe = table.concat(args, " "):find("label=chestor.autocode.probe", 1, true)
        for _, line in ipairs((probe and M.state.probes or (not probe and M.state.containers)) or {}) do opts.on_line(line) end
        return 0
    elseif args[1] == "container" and args[2] == "prune" then
        M.state.blanket_prune = true
        return 0
    elseif args[1] == "create" then
        if M.state.cancel_on_create then M.state.run.cancel_requested = true end
        if M.state.create_error then return nil, M.state.create_error end
        return 0
    elseif args[1] == "start" then
        M.state.attached = true
        M.state.streaming = true
        if M.state.cancel_on_attach then M.state.run.cancel_requested = true end
        if M.state.cancel_silently then
            M.state.run.cancel_requested = true
            for i = 1, M.state.output_lines or 0 do if opts.on_line then opts.on_line("line " .. tostring(i)) end end
            time.sleep("750ms")
        elseif opts.on_line then opts.on_line("log line"); time.sleep("300ms") end
        M.state.streaming = false
        return 0
    end
    if args[1] == "run" and M.state.runtime_missing then return 127 end
    if args[1] ~= "run" and args[1] ~= "build" and args[1] ~= "pull"
        and not ((args[1] == "image" or args[1] == "builder") and args[2] == "prune")
        and not (args[1] == "image" and (args[2] == "tag" or args[2] == "rm")) then
        error("unexpected Docker command: " .. table.concat(args, " "))
    end
    M.state.fetches = M.state.fetches + 1
    return 0
end
function repo.now() return "now" end
function repo.record_account_error() end
function repo.next_seq() if M.state.seq_error then return nil, M.state.seq_error end; return 1 end
function repo.append_event(_, _, kind, text) table.insert(M.state.events, {kind = kind, text = text}) end
function repo.finish_run(_, status, result, reason, usage)
    M.state.run.status, M.state.run.result, M.state.run.error, M.state.run.usage = status, result, reason, usage
    M.state.settlements = (M.state.settlements or 0) + 1
    return true
end
function repo.record_run_outcome(_, status, result, reason, usage)
    if not M.state.run.pending_status then
        M.state.run.pending_status, M.state.run.result, M.state.run.error, M.state.run.usage = status, result, reason, usage
    end
end
function repo.start_run()
    if M.state.cancel_on_reserve then M.state.run.cancel_requested = true end
    if M.state.run.cancel_requested then return false end
    M.state.run.status = "running"
    return true
end
function docker.stop(_, deadline) record_deadline("stop", deadline); M.state.stopped = M.state.stopped + 1 end
function docker.remove(name, deadline)
    record_deadline("remove", deadline)
    M.state.removed = M.state.removed + 1
    M.state.removed_names = M.state.removed_names or {}
    table.insert(M.state.removed_names, name)
    if M.state.remove_error then return errors.new({kind = errors.UNAVAILABLE, message = "Docker unavailable"}) end
end
function jobs.get_job(id)
    M.state.checked_job = id
    if M.state.job_error then return nil, errors.new({kind = errors.UNAVAILABLE, message = "Jobs unavailable"}) end
    return M.state.jobs and M.state.jobs[id] or M.state.job
end
function jobs.enqueue_tx(_, _, job)
    M.state.enqueued = job
    if job.key == "run" or job.key == "resume" then return {id = M.state.job_id or uuid.v7()} end
    return {id = M.state.job_id or "build-job"}
end
function jobs.cancel(id) M.state.cancelled_job = id; return {canceled = true, job_id = id} end
function runs.container_name() return "container" end
function live.notify(owner, topic)
    M.state.notifications = M.state.notifications or {}
    table.insert(M.state.notifications, {owner = owner, topic = topic, committed = M.state.created ~= nil})
    return M.state.notify_error
end
function live.account(id)
    M.state.health_topics = M.state.health_topics or {}
    table.insert(M.state.health_topics, "component." .. id)
    return M.state.notify_error
end
live.RUNS_TOPIC = "runs"
function live.run_topic() return "run" end
function deferred.nudge()
    M.state.nudges = (M.state.nudges or 0) + 1
    return errors.new({kind = errors.UNAVAILABLE, message = "pool unavailable"})
end
function deferred.check() return nil end
function deferred.capture() return {actor_id = "owner", actor_context = "{}"} end
function repo.request_image_build(id, identity, mode, generation, replaces)
    M.state.requested_build = {image_id = id, identity = identity, mode = mode, build_id = generation, replaces = replaces}
    if M.state.admission_error then return errors.new({kind = errors.UNAVAILABLE, message = "queue unavailable"}) end
    if not generation then return errors.new({kind = errors.INVALID, message = "generation required"}) end
    return nil
end
function repo.clear_cooldown()
    M.state.clears = (M.state.clears or 0) + 1
    if not M.state.clear_error then M.state.cooldown = "" end
    return M.state.clear_error
end
function runs.admit() return {candidates = {"account"}, driver = {id = "claude"}, spec = {}} end
function repo.create_run(owner, _, spec)
    if M.state.create_run_error then return nil, M.state.create_run_error end
    M.state.created = {owner = owner, spec = spec}
    return "queued-run"
end
function repo.settle_account() end
function component.query(options)
    M.state.query_options = options
    if M.state.query_error then return nil, M.state.query_error end
    return M.state.rows or {}
end
function repo.delete_image_build() return M.state.teardown_error end
function repo.run() return M.state.run end
function registry.get(id)
    if id ~= "chestor.autocode:runtime_config" then error("unexpected registry entry: " .. id) end
    if M.state.registry_error then return nil, M.state.registry_error end
    return {meta = {workspace_roots = M.state.roots, docker_executor = M.state.executor or "chestor.autocode:docker", docker_context = M.state.docker_context or ""}}
end
function resources.get(kind, id)
    if kind == "account" then return M.state.account end
    if kind ~= "image" then error("unexpected component kind: " .. kind) end
    return {id = id, meta = {ref = M.state.image_ref or "image", home = M.state.image_home or "/opt/agent", status = M.state.image_status or "ready"}, access = 15, owner = "owner"}
end
function settings.get(id)
    if id == "image_build_timeout" then return M.state.build_timeout or "30m" end
    if id == "account_cooldown" then return M.state.cooldown or "1m" end
    if id == "build_cache_retention" then return M.state.cache_retention or "24h" end
    if id == "run_retention" then return M.state.retention or "1m" end
    error("unexpected setting: " .. id)
end
function drivers.get(id)
    if id ~= "claude" then error("unexpected driver: " .. id) end
    if M.state.missing_driver then return nil, errors.new({kind = errors.NOT_FOUND, message = "driver removed"}) end
    return {id = "claude", credentials = {files = {{path = ".login.json", content_format = "json", write_back = true, initialize = {}}}, variables = {}, subscriptions = {}}}
end
function exec.get(id)
    if id ~= "chestor.autocode:docker" and id ~= M.state.executor then error("unexpected executor: " .. id) end
    M.state.executor_id = id
    return {release = function() M.state.executor_released = true end, exec = function(_, command, options)
        M.state.command = command
        M.state.command_env = options.env
        M.state.exec_commands = M.state.exec_commands or {}
        table.insert(M.state.exec_commands, command)
        local step = M.state.exec_steps and table.remove(M.state.exec_steps, 1)
        if M.state.exec_steps and not step then error("unexpected executor call: " .. command) end
        local chunks = step and step.chunks or M.state.chunks or {}
        local index = 0
        return {stdout_stream = function() return {close = function() end, read = function()
            if M.state.read_delay then time.sleep(M.state.read_delay) end
            index = index + 1
            return chunks[index]
        end} end, start = function() return true end, close_stdin = function() return true end,
            wait = function() return step and step.code or 0, step and step.err end, close = function() M.state.process_closed = true end}
    end}
end
function drivers.reader()
    return {feed = function() return {problems = {}, observations = {}} end,
        finish = function() return {problems = {}, observations = {}, terminal = M.state.terminal or {outcome = "succeeded"}} end}
end
function resources.text(value) return type(value) == "string" and value or "" end
function resources.patch_context(_, values, revision)
    if M.state.patch_conflict then return errors.new({kind = errors.CONFLICT, message = "revision conflict"}) end
    M.state.patched = true
    M.state.patched_values, M.state.patched_revision = values, revision
end
function repo.prune_runs(before) M.state.before = before; return 0 end
function resources.register(_, meta, private)
    M.state.registered = {meta = meta, private = private}
    return "created"
end
function resources.context()
    if M.state.change_on_context then M.state.image_home = "/new-home" end
    return {values = {dockerfile = "", settings = {memory = "4g", cpus = "2", pids_limit = 1024, gpus = "", network = "bridge", extra_args = {}, allows = {}}}, revision = 7, access = 15} end
function resources.snapshot(kind, id, access)
    local context = resources.context(kind, id, access)
    return {resource = resources.get(kind, id, access), context = context}
end
function resources.image_recipe(id, access)
    local snapshot = resources.snapshot("image", id, access)
    local value = M.recipe_fixture()
    value.ref, value.home, value.revision = snapshot.resource.meta.ref, snapshot.resource.meta.home, snapshot.context.revision
    value.settings, value.dockerfile = snapshot.context.values.settings, snapshot.context.values.dockerfile
    return value
end
function resources.delete(id)
    if M.state.on_delete then M.state.on_delete() end
    if M.state.delete_error then return M.state.delete_error end
    M.state.deleted = id
    return nil
end
function component.set_meta() M.state.meta_written = true end
function resources.replace(id, fields, patch, revision)
    M.state.replaced = {id = id, fields = fields, patch = patch, revision = revision}
    if M.state.replace_conflict then return errors.new({kind = errors.CONFLICT, message = "revision changed"}) end
    if patch and patch.credential then M.state.credential = patch.credential end
    if M.state.on_replace then M.state.on_replace() end
end
function resources.has(access, required) return math.floor(access / required) % 2 == 1 end

function repo.find_submission(_, submission) M.state.submission = submission; return "existing" end
function runs.submit(request) M.state.submitted = request; return "existing-run" end

function funcs.new()
    return {with_actor = function(self) M.state.resume_actor_bound = true; return self end,
        with_scope = function(self) M.state.resume_scope_bound = true; return self end,
        call = function(_, ...) return funcs.call(...) end}
end

function docker.ensure_removed(name, deadline)
    local err = docker.remove(name, deadline)
    if M.state.remove_absent then return nil end
    return err
end
local function context_get(key)
    if key ~= "component_id" then error("unexpected context key: " .. key) end
    return M.state.component_id or "image"
end
resources.ACCESS = {READ = 1, WRITE = 2, DELETE = 4, ADMIN = 8}
M.context = {get = context_get}
function M.preparation(run)
    return {agent = run.agent, account_id = run.account_id, kind = {id = "env:ANTHROPIC_API_KEY"},
        secret = "secret", revision = 1, image = {id = run.image_id, ref = "image", home = "/home/agent",
            memory = "", cpus = "", pids_limit = 0, gpus = "", network = "none", extra_args = {}},
        workdir = "/work", launch = {executable = "agent", argv = {}, environment = {}, files = {}, readiness = "none"}}
end
function M.recipe_fixture()
    return {ref = "image", home = "/home/agent", dockerfile = "", revision = 1,
        settings = {memory = "", cpus = "", pids_limit = 0, gpus = "", network = "none", extra_args = {}, allows = {}}}
end
M.repo = repo
M.component = component
M.execution_identity = execution_identity
M.drivers = drivers
M.registry = registry
M.docker = docker
M.jobs = jobs
M.runs = runs
M.live = live
M.deferred = deferred
M.resources = resources
M.funcs = funcs
M.exec = exec
M.settings = settings
return M

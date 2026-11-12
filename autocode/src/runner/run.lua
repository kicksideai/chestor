-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The job of one run. The runner resolves the identity the run was submitted
-- under, admits the run again under it and reads the account credential,
-- creates the container, starts it unless the run was cancelled, folds its
-- output into run events, keeps a credential the CLI refreshed, removes the
-- container and settles the run. A run a workflow node waits on enqueues the
-- node's resume in the transaction that settles it. A later attempt of the
-- job completes cleanup and applies the recorded outcome, or records an
-- interruption when execution has no durable outcome.
local repo = require("repo")
local event_log = require("event_log")
local runs = require("runs")
local container = require("container")
local records = require("records")
local redact = require("redact")
local docker = require("docker")
local live = require("live")
local run_io = require("run_io")
local account_health = require("account_health")
local execution_identity = require("execution_identity")
local deferred = require("deferred")
local job_outcome = require("job_outcome")
local logger = require("logger")
local transport = require("transport")
local worktrees = require("worktrees")

-- The resource whose kickside.execution.defer grant lets the runner resolve
-- a run owner's stored identity.
local DEFERRED_OWNER = "chestor.autocode:runs"
local PREPARE = "chestor.autocode.service:prepare"
-- The exit code coreutils and busybox timeout report for a run past its limit.
local TIMED_OUT = 124

type Outcome = job_outcome.Outcome
-- Preparation carries the launch, image, workspace, account credential
-- and context revision for credential refresh.
type Prepared = transport.Prepared

local failure = job_outcome.failure

type Caller = {call: (self: Caller, string, {[string]: unknown}) -> (unknown, error?)}
local function prepare(run: repo.Run): (Prepared?, Caller?, error?)
    local stored, row_err = execution_identity.from_row(run.identity.actor_id, run.identity.actor_context)
    if not stored then return nil, nil, job_outcome.native(row_err) end
    local owner, bind_err = execution_identity.bind(stored, {deferred_owner = DEFERRED_OWNER})
    if not owner then return nil, nil, job_outcome.native(bind_err) end
    if (type(owner) ~= "table" and type(owner) ~= "userdata") or type(owner.call) ~= "function" then
        return nil, nil, errors.new({kind = errors.INTERNAL, message = "run identity has no call method"})
    end
    local result, prepare_err = owner:call(PREPARE, {run_id = run.id})
    if prepare_err then return nil, nil, job_outcome.native(prepare_err) end
    if not run.account_pinned then
        local current, read_err = repo.stored_run(run.id)
        if not current then return nil, nil, read_err or errors.new({kind = errors.NOT_FOUND, message = "run not found"}) end
        run.account_id = current.account_id
    end
    local prepared, decode_err = transport.prepared(result, run)
    if not prepared then return nil, nil, decode_err end
    return prepared, owner :: Caller, nil
end

local function execute(run: repo.Run, job: {[string]: unknown}, trace_context: {[string]: unknown}?): Outcome
    local deadline = type(job.deadline) == "string" and job.deadline or nil
    local run_id = run.id
    local health = run.account_health
    local event_error: error? = nil
    local persist_err: string? = nil
    local redactor = redact.new("")
    local notification_err: error? = nil
    local function changed(topic: string)
        local notify_err = live.notify(run.owner_id, topic)
        if notify_err then notification_err = notification_err or errors.wrap(notify_err, "run notification") end
    end
    local function emit(kind: string, text: string)
        if persist_err then return end
        local err, notify_err = event_log.record(run_id, run.owner_id, kind, text, redactor)
        notification_err = notification_err or notify_err
        if err then
            event_error = err
            persist_err = "event log write failed: " .. tostring(err)
            return
        end
    end
    local function cleanup(): Outcome?
        local name = runs.container_name(run_id)
        local remove_err = docker.ensure_removed(name, deadline)
        if remove_err then
            emit("system", "container cleanup: " .. tostring(remove_err))
            return failure("container cleanup", errors.UNAVAILABLE, remove_err)
        end
        if run.worktree and not run.worktree.removed then
            local tree_err = worktrees.remove(run.worktree)
            if tree_err then return failure("worktree cleanup", errors.UNAVAILABLE, tree_err) end
            run.worktree.removed = true
            local clear_err = repo.set_worktree(run_id, run.worktree)
            if clear_err then return failure("worktree cleanup record", errors.UNAVAILABLE, clear_err) end
        end
        return nil
    end

    local function finish(status: repo.RunStatus, answer: string, reason: string, usage: {[string]: unknown}): Outcome
        if event_error then return failure("run events", errors.UNAVAILABLE, event_error) end
        local shown_answer, shown_reason = redact.apply(redactor, answer), redact.apply(redactor, reason)
        if run.pending_status then
            status, shown_answer, shown_reason, usage = run.pending_status, run.result, run.error, run.usage
        else
            local record_err = repo.record_run_outcome(run_id, status, shown_answer, shown_reason, usage, health)
            if record_err then return failure("run outcome write", errors.UNAVAILABLE, record_err) end
            run.pending_status, run.result, run.error, run.usage = status, shown_answer, shown_reason, usage
        end
        if health and next(health) ~= nil then
            local health_err = account_health.apply(run, health :: account_health.Intent)
            if health_err then return failure("account health settlement", errors.UNAVAILABLE, health_err) end
        end
        local cleanup_failure = cleanup()
        if cleanup_failure then return cleanup_failure end
        local settled, err = repo.finish_run(run_id, status, shown_answer, shown_reason, usage, trace_context)
        if err then return failure("run status write", errors.UNAVAILABLE, err) end
        if not settled then return {ok = true, output = {run_id = run_id, status = status}} end
        changed(live.run_topic(run_id))
        changed(live.RUNS_TOPIC)
        local account_err = live.account(run.account_id)
        notification_err = notification_err or account_err
        if run.flow then
            local nudge_err = deferred.nudge()
            if nudge_err then logger:warn("autocode workflow delivery awaits jobs reconciliation", {run_id = run_id, error = tostring(nudge_err)}) end
        end
        if notification_err then return failure("committed run notification", errors.UNAVAILABLE, notification_err) end
        return {ok = true, output = {run_id = run_id, status = status}}
    end
    local function fail(reason: string): Outcome
        emit("error", reason)
        return finish("failed", "", reason, {})
    end

    -- An attempt after the first finds the run its predecessor left behind.
    local attempt = tonumber(job.attempt_no) or 1
    if run.pending_status then return finish(run.pending_status, run.result, run.error, run.usage) end
    if attempt > 1 then return fail("the runner stopped before the run settled") end

    local prepared, owner, prepare_err = prepare(run)
    if not prepared or not owner then return fail(tostring(prepare_err)) end
    if run.isolation == "worktree" and prepared.workspace then
        local tree, tree_err = worktrees.plan(prepared.workspace.host_path, run_id)
        if not tree then return fail(tostring(tree_err)) end
        local store_err = repo.set_worktree(run_id, tree)
        if store_err then return fail(tostring(store_err)) end
        run.worktree = tree
        local create_err = worktrees.create(tree, run.repo_ref)
        if create_err then return fail(tostring(create_err)) end
        prepared.workspace.host_path = tree.path
        prepared.workspace.gitdir = tree.gitdir
    end
    local secret = prepared.secret
    redactor = redact.new(secret)
    if prepared.gateway_token then
        for _, needle in ipairs(redact.new(prepared.gateway_token).needles) do redactor.needles[#redactor.needles + 1] = needle end
    end
    local script, script_err = container.script(prepared.kind, secret, prepared.image.home, prepared.workdir,
        run.repo_url, prepared.launch, math.floor(run.timeout_ms / 1000), run.repo_ref)
    if not script then return fail(tostring(script_err)) end
    if prepared.gateway_token then script.env.AUTOCODE_GATEWAY_TOKEN = prepared.gateway_token end
    local box = run_io.build(run_id, prepared, script.env)

    local function cancelled(): (boolean?, error?)
        return repo.cancel_requested(run_id)
    end
    local initial_cancel, initial_err = cancelled()
    if initial_err then return fail("cancellation read: " .. tostring(initial_err)) end
    if initial_cancel then return finish("cancelled", "", "cancelled by user", {}) end
    local inspected, inspect_err = docker.run({"image", "inspect", "--format", "{{.Id}}", prepared.image.ref}, {deadline = deadline})
    if inspect_err then return fail("recorded image ID inspection failed: " .. tostring(inspect_err)) end
    if inspected ~= 0 then return fail("recorded image ID is no longer available in Docker; prepare the image again: " .. prepared.image.ref) end
    local create_output: {string} = {}
    local created, create_err = docker.run(box.create, {deadline = deadline, env = box.env, on_line = function(line: string) create_output[#create_output + 1] = line end})
    if create_err or created ~= 0 then
        return fail(create_err and tostring(create_err) or ("container create failed: " .. table.concat(create_output, "\n")))
    end
    local requested, cancel_err = cancelled()
    if cancel_err then return fail("cancellation read: " .. tostring(cancel_err)) end
    if requested then
        emit("system", "cancelled")
        return finish("cancelled", "", "cancelled by user", {})
    end
    local started, start_err = repo.start_run(run_id)
    if not started then
        local requested, read_err = cancelled()
        if read_err then return fail("cancellation read: " .. tostring(read_err)) end
        if requested then return finish("cancelled", "", "cancelled by user", {}) end
        return fail(start_err and ("run start write failed: " .. tostring(start_err)) or "run is no longer queued")
    end
    local health_notify_err = live.account(run.account_id)
    notification_err = notification_err or health_notify_err
    run.started_at = repo.now()
    changed(live.run_topic(run_id))
    changed(live.RUNS_TOPIC)
    emit("system", "starting " .. prepared.agent .. " in " .. prepared.image.ref)

    local streamed, stream_failure = run_io.stream(prepared, box, redactor, emit, cancelled, function(): string? return persist_err end, deadline)
    if not streamed then return fail(tostring(stream_failure)) end
    local terminal, folder = streamed.terminal, streamed.folder
    local stream_err, docker_err, code = streamed.stream_error, streamed.docker_error, streamed.code
    local last_log = streamed.last_log

    local was_cancelled, final_read_err = cancelled()
    if final_read_err then stream_err = stream_err or ("cancellation read: " .. tostring(final_read_err)) end
    was_cancelled = was_cancelled or streamed.cancel_seen
    local refresh_error = run_io.keep_credential(run_id, owner, prepared, box, emit, deadline)
    health = account_health.capture(terminal, refresh_error, redactor, records.limits(folder, terminal))
    local health_notify_err = live.account(run.account_id)
    notification_err = notification_err or health_notify_err
    local fault = terminal and terminal.error
    local answer = records.result(folder, terminal)
    local usage = records.usage(terminal)
    if was_cancelled then
        emit("system", "cancelled")
        return finish("cancelled", answer, "cancelled by user", usage)
    elseif persist_err or docker_err or stream_err then
        local reason = persist_err or (docker_err and tostring(docker_err)) or stream_err or "stream failed"
        emit("error", reason)
        return finish("failed", answer, reason, usage)
    elseif terminal and terminal.outcome == "succeeded" and code == 0 then
        return finish("succeeded", answer, "", usage)
    elseif code == TIMED_OUT and (not terminal or terminal.outcome ~= "succeeded") then
        return finish("failed", answer, "the run exceeded its timeout of " .. tostring(math.floor(run.timeout_ms / 60000)) .. " minutes", usage)
    elseif code ~= 0 and (not terminal or terminal.outcome == "uncertain") then
        -- The container stopped before the CLI reported a result: its exit
        -- code and last log line say why.
        return finish("failed", answer, "container exited with code " .. tostring(code) .. (last_log ~= "" and (": " .. last_log) or ""), usage)
    end
    return finish("failed", answer, fault and fault.message or ("agent exited with code " .. tostring(code)), usage)
end

local function main(input: {[string]: unknown}): Outcome
    local payload = type(input.payload) == "table" and input.payload or {}
    local job = type(input.job) == "table" and input.job or {}
    local run_id = type(payload.run_id) == "string" and payload.run_id or ""
    local run, run_err = repo.stored_run(run_id)
    if run_err then return failure("run read", errors.UNAVAILABLE, run_err) end
    if not run then return failure("run " .. run_id .. " not found", errors.NOT_FOUND) end
    if run.status ~= "queued" and run.status ~= "running" then
        local notify_err = live.notify(run.owner_id, live.run_topic(run_id)) or live.notify(run.owner_id, live.RUNS_TOPIC) or live.account(run.account_id)
        if notify_err then return failure("committed run notification", errors.UNAVAILABLE, notify_err) end
        return {ok = true, output = {run_id = run_id, status = run.status}}
    end
    return execute(run :: repo.Run, job, type(input.trace_context) == "table" and input.trace_context or nil)
end

return { main = main }

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The job of one run. The runner resolves the identity the run was submitted
-- under, admits the run again under it and reads the account credential,
-- creates the container, starts it unless the run was cancelled, folds its
-- output into run events, keeps a credential the CLI refreshed, removes the
-- container and settles the run. A run a workflow node waits on enqueues the
-- node's resume in the transaction that settles it. A later attempt of the
-- job finds the run its interrupted predecessor left: it removes the
-- container and settles the run as failed.
local repo = require("repo")
local runs = require("runs")
local container = require("container")
local records = require("records")
local redact = require("redact")
local docker = require("docker")
local live = require("live")
local run_io = require("run_io")
local execution_identity = require("execution_identity")
local deferred = require("deferred")
local job_outcome = require("job_outcome")
local logger = require("logger")
local transport = require("transport")

-- The resource whose kickside.execution.defer grant lets the runner resolve
-- a run owner's stored identity.
local DEFERRED_OWNER = "chestor.autocode:runs"
local PREPARE = "chestor.autocode.runner:prepare"
local RESUME_JOB = "chestor.autocode.blocks:resume"
-- The exit code coreutils and busybox timeout report for a run past its limit.
local TIMED_OUT = 124

type Outcome = job_outcome.Outcome
-- What the run owner's admission returns: the admitted run, the account
-- credential and the context revision a refreshed credential expects.
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
    local prepared, decode_err = transport.prepared(result, run)
    if not prepared then return nil, nil, decode_err end
    return prepared, owner :: Caller, nil
end

local function account_changed(account_id: string)
    local err = live.account(account_id)
    if err then logger:warn("autocode account notification failed", {account_id = account_id, error = tostring(err)}) end
end

local function execute(run: repo.Run, job: {[string]: unknown}): Outcome
    local run_id = run.id
    local seq_start, seq_err = repo.next_seq(run_id)
    if not seq_start then return failure("run events: " .. tostring(seq_err), errors.UNAVAILABLE) end
    local seq = seq_start - 1
    local persist_err: string? = nil
    local redactor = redact.new("")
    local function changed(topic: string)
        local notify_err = live.notify(run.owner_id, topic)
        if notify_err then logger:warn("autocode live update failed", {run_id = run_id, topic = topic, error = tostring(notify_err)}) end
    end
    local function emit(kind: string, text: string)
        if persist_err then return end
        seq = seq + 1
        local err = repo.append_event(run_id, seq, kind, redact.apply(redactor, text))
        if err then
            persist_err = "event log write failed: " .. tostring(err)
            return
        end
        changed(live.run_topic(run_id))
    end
    local function finish(status: repo.RunStatus, answer: string, reason: string, usage: {[string]: unknown}): Outcome
        local shown_answer, shown_reason = redact.apply(redactor, answer), redact.apply(redactor, reason)
        local resume: repo.Transactional? = nil
        if run.flow then
            resume = deferred.enqueue({scope = run_id, key = "resume", owner_id = run.owner_id, job_type = RESUME_JOB,
                max_attempts = 5, payload = {run_id = run_id}})
        end
        local settled, err = repo.finish_run(run_id, status, shown_answer, shown_reason, usage, resume)
        if err then return failure("run status write: " .. tostring(err), errors.UNAVAILABLE) end
        if not settled then return {ok = true, output = {run_id = run_id, status = status}} end
        changed(live.run_topic(run_id))
        changed(live.RUNS_TOPIC)
        account_changed(run.account_id)
        if run.flow then
            local nudge_err = deferred.nudge()
            if nudge_err then logger:warn("autocode workflow delivery awaits jobs reconciliation", {run_id = run_id, error = tostring(nudge_err)}) end
        end
        return {ok = true, output = {run_id = run_id, status = status}}
    end
    local function fail(reason: string): Outcome
        emit("error", reason)
        return finish("failed", "", reason, {})
    end

    -- An attempt after the first finds the run its predecessor left behind.
    local attempt = tonumber(job.attempt_no) or 1
    if attempt > 1 then
        local remove_err = docker.remove(runs.container_name(run_id))
        if remove_err then emit("system", "container cleanup: " .. tostring(remove_err)) end
        return fail("the runner stopped before the run settled")
    end

    local prepared, owner, prepare_err = prepare(run)
    if not prepared or not owner then return fail(tostring(prepare_err)) end
    local admitted = prepared.admitted
    local secret = prepared.secret
    redactor = redact.new(secret)
    local script, script_err = container.script(admitted.account.kind, secret, admitted.image.home, admitted.workdir,
        run.repo_url, admitted.launch, math.floor(run.timeout_ms / 1000))
    if not script then return fail(tostring(script_err)) end
    local box = run_io.build(run_id, admitted, script.env)

    local function cancelled(): (boolean?, error?)
        local current, read_err = repo.stored_run(run_id)
        if read_err then return nil, read_err end
        if not current then return nil, errors.new({kind = errors.NOT_FOUND, message = "run disappeared during execution"}) end
        return current.cancel_requested, nil
    end
    local initial_cancel, initial_err = cancelled()
    if initial_err then return fail("cancellation read: " .. tostring(initial_err)) end
    if initial_cancel then return finish("cancelled", "", "cancelled by user", {}) end
    local create_output: {string} = {}
    local created, create_err = docker.run(box.create, {env = box.env, on_line = function(line: string) create_output[#create_output + 1] = line end})
    if create_err or created ~= 0 then
        return fail(create_err and tostring(create_err) or ("container create failed: " .. table.concat(create_output, "\n")))
    end
    local function cleanup()
        local remove_err = docker.remove(box.name)
        if remove_err then emit("system", "container cleanup: " .. tostring(remove_err)) end
    end
    local requested, cancel_err = cancelled()
    if cancel_err then cleanup(); return fail("cancellation read: " .. tostring(cancel_err)) end
    if requested then
        cleanup()
        emit("system", "cancelled")
        return finish("cancelled", "", "cancelled by user", {})
    end
    local started, start_err = repo.start_run(run_id)
    if not started then
        cleanup()
        local requested, read_err = cancelled()
        if read_err then return fail("cancellation read: " .. tostring(read_err)) end
        if requested then return finish("cancelled", "", "cancelled by user", {}) end
        return fail(start_err and ("run start write failed: " .. tostring(start_err)) or "run is no longer queued")
    end
    account_changed(run.account_id)
    run.started_at = repo.now()
    changed(live.run_topic(run_id))
    changed(live.RUNS_TOPIC)
    emit("system", "starting " .. admitted.driver.id .. " in " .. admitted.image.ref)

    local streamed, stream_failure = run_io.stream(admitted, box, redactor, emit, cancelled, function(): string? return persist_err end)
    if not streamed then cleanup(); return fail(tostring(stream_failure)) end
    local terminal, folder = streamed.terminal, streamed.folder
    local stream_err, docker_err, code = streamed.stream_error, streamed.docker_error, streamed.code
    local last_log = streamed.last_log

    local was_cancelled, final_read_err = cancelled()
    if final_read_err then stream_err = stream_err or ("cancellation read: " .. tostring(final_read_err)) end
    was_cancelled = was_cancelled or streamed.cancel_seen
    local refresh_error = run_io.keep_credential(run_id, owner, prepared, box, emit)
    cleanup()

    run_io.settle_account(run, terminal, refresh_error, redactor, emit)
    account_changed(run.account_id)
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
    if run_err then return failure("run read: " .. tostring(run_err), errors.UNAVAILABLE) end
    if not run then return failure("run " .. run_id .. " not found", errors.NOT_FOUND) end
    if run.status ~= "queued" and run.status ~= "running" then return {ok = true, output = {run_id = run_id, status = run.status}} end
    return execute(run, job)
end

return { main = main }

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
local drivers = require("drivers")
local records = require("records")
local redact = require("redact")
local docker = require("docker")
local live = require("live")
local settings = require("settings")
local execution_identity = require("execution_identity")
local deferred = require("deferred")
local job_types = require("job_types")
local logger = require("logger")
local time = require("time")

-- The largest credential file copied back out of a finished container.
local MAX_CREDENTIAL_BYTES = 1048576
-- The resource whose kickside.execution.defer grant lets the runner resolve
-- a run owner's stored identity.
local DEFERRED_OWNER = "chestor.autocode:runs"
local PREPARE = "chestor.autocode.runner:prepare"
local KEEP_CREDENTIAL = "chestor.autocode.runner:keep_credential"
local RESUME_JOB = "chestor.autocode.blocks:resume"
-- The exit code coreutils and busybox timeout report for a run past its limit.
local TIMED_OUT = 124

type Container = {name: string, create: {string}, env: {[string]: string}, stdin: string?}
type Outcome = {ok: boolean, output: {[string]: unknown}?, error_native: unknown?}
-- What the run owner's admission returns: the admitted run, the account
-- credential and the context revision a refreshed credential expects.
type Prepared = {admitted: runs.Admitted, secret: string, revision: integer}

-- Image run settings: limits, GPU access, network, then the administrator's
-- docker run arguments, all placed before the image reference.
local function settings_args(image: runs.Image): {string}
    local args: {string} = {}
    local function add(flag: string, value: string)
        if value ~= "" then
            args[#args + 1] = flag
            args[#args + 1] = value
        end
    end
    add("--memory", image.memory)
    add("--cpus", image.cpus)
    if image.pids_limit > 0 then add("--pids-limit", tostring(image.pids_limit)) end
    add("--gpus", image.gpus)
    add("--network", image.network)
    for _, arg in ipairs(image.extra_args) do args[#args + 1] = arg end
    return args
end

local function build(run_id: string, admitted: runs.Admitted, env: {[string]: string}): Container
    local name = runs.container_name(run_id)
    local args: {string} = {"create", "-i", "--name", name, "--label", "chestor.autocode.run=" .. run_id,
        "--add-host", "host.docker.internal:host-gateway"}
    local workspace = admitted.workspace
    if workspace then
        args[#args + 1] = "--mount"
        args[#args + 1] = "type=bind,source=" .. workspace.host_path .. ",target=" .. admitted.workdir .. (workspace.writable and "" or ",readonly")
    end
    for _, arg in ipairs(settings_args(admitted.image)) do args[#args + 1] = arg end
    local names: {string} = {}
    for variable in pairs(env) do names[#names + 1] = variable end
    table.sort(names)
    for _, variable in ipairs(names) do
        args[#args + 1] = "-e"
        args[#args + 1] = variable
    end
    for _, arg in ipairs({"--entrypoint", "sh", admitted.image.ref, "-c", 'eval "$AUTOCODE_SCRIPT"'}) do args[#args + 1] = arg end
    return {name = name, create = args, env = env, stdin = admitted.launch.stdin}
end

local function failure(message: string, kind: string): Outcome
    return {ok = false, error_native = job_types.error_to_data(errors.new({kind = kind, message = message}))}
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
        if run.flow then
            local nudge_err = deferred.nudge()
            if nudge_err then return failure("workflow resume wake: " .. tostring(nudge_err), errors.UNAVAILABLE) end
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

    local stored, row_err = execution_identity.from_row(run.identity.actor_id, run.identity.actor_context)
    if not stored then return fail("run identity: " .. tostring(row_err)) end
    local owner, bind_err = execution_identity.bind(stored, {deferred_owner = DEFERRED_OWNER})
    if not owner then return fail("the run owner can no longer run tasks: " .. tostring(bind_err)) end
    local result, prepare_err = owner:call(PREPARE, {run_id = run_id})
    if not result then return fail(tostring(prepare_err)) end
    local prepared = result :: Prepared
    local admitted = prepared.admitted
    local secret = prepared.secret
    redactor = redact.new(secret)
    local script, script_err = container.script(admitted.account.kind, secret, admitted.image.home, admitted.workdir,
        run.repo_url, admitted.launch, math.floor(run.timeout_ms / 1000))
    if not script then return fail(tostring(script_err)) end
    local box = build(run_id, admitted, script.env)

    local create_output: {string} = {}
    local created, create_err = docker.run(box.create, {env = box.env, on_line = function(line: string) create_output[#create_output + 1] = line end})
    if create_err or created ~= 0 then
        return fail(create_err and tostring(create_err) or ("container create failed: " .. table.concat(create_output, "\n")))
    end
    local function cancelled(): boolean
        local current = repo.stored_run(run_id)
        return current ~= nil and current.cancel_requested
    end
    -- From here the container exists: a cancellation stops it, so start
    -- either runs it or finds it stopped.
    if cancelled() then
        docker.remove(box.name)
        emit("system", "cancelled")
        return finish("cancelled", "", "cancelled by user", {})
    end
    local started, start_err = repo.start_run(run_id)
    if not started then
        docker.remove(box.name)
        return fail(start_err and ("run start write failed: " .. tostring(start_err)) or "run is no longer queued")
    end
    changed(live.run_topic(run_id))
    changed(live.RUNS_TOPIC)
    emit("system", "starting " .. admitted.driver.id .. " in " .. admitted.image.ref)

    local reader, reader_err = drivers.reader(admitted.driver.id, false)
    if not reader then
        docker.remove(box.name)
        return fail(tostring(reader_err))
    end
    local folder = records.new(function(text: string): string return redact.apply(redactor, text) end)
    local terminal: drivers.Terminal? = nil
    local stream_err: string? = nil
    local stopped = false
    local last_log = ""
    local function settle(step: drivers.Step?, err: error?)
        if not step then
            stream_err = stream_err or tostring(err)
            return
        end
        for _, event in ipairs(records.step(folder, step)) do emit(event.kind, event.text) end
        if step.terminal then terminal = step.terminal end
        if persist_err and not stopped then
            stopped = true
            docker.stop(box.name)
        end
    end
    local code, docker_err = docker.run({"start", "-a", "-i", box.name}, {
        stdin = box.stdin,
        on_line = function(line: string)
            if line:match("^%s*{") then
                settle(reader:feed(line .. "\n"))
            elseif line ~= "" then
                last_log = records.clip(redact.apply(redactor, line))
                emit("log", last_log)
            end
        end,
        on_overflow = function(bytes: integer)
            emit("system", "dropped an output line of " .. tostring(bytes) .. " bytes, over the " .. tostring(docker.MAX_LINE_BYTES) .. "-byte bound")
        end,
    })
    settle(reader:finish())
    for _, event in ipairs(records.terminal(folder, terminal)) do emit(event.kind, event.text) end

    local was_cancelled = cancelled()
    local file = admitted.account.kind.file
    if file and file.write_back then
        local content, copy_err = docker.copy_file(box.name, admitted.image.home .. "/" .. file.path, MAX_CREDENTIAL_BYTES)
        if not content then
            emit("error", "credential copy: " .. tostring(copy_err))
        elseif content ~= secret then
            local kept, keep_err = owner:call(KEEP_CREDENTIAL, {account_id = admitted.account.id, credential = content, revision = prepared.revision})
            if keep_err then
                emit("error", "credential update: " .. tostring(keep_err))
            elseif not kept then
                emit("system", "the CLI refreshed its credential, but the account changed during the run; the newer stored credential is kept")
            end
        end
    end
    local remove_err = docker.remove(box.name)
    if remove_err then emit("system", "container cleanup: " .. tostring(remove_err)) end

    -- A success clears the account's last refusal; a retryable provider fault
    -- cools it down. Other failures belong to the task, not the account.
    local fault = terminal and terminal.error
    local account_err: error? = nil
    if terminal and terminal.outcome == "succeeded" then
        account_err = repo.settle_account(run.account_id, "", "")
    elseif fault and fault.retryable then
        local cooldown, cooldown_err = settings.get("account_cooldown")
        if not cooldown then
            account_err = cooldown_err
        else
            account_err = repo.settle_account(run.account_id, redact.apply(redactor, fault.code .. ": " .. fault.message),
                time.now():add(cooldown):utc():format_rfc3339())
        end
    end
    if account_err then emit("error", "account status: " .. tostring(account_err)) end

    local answer = terminal and terminal.answer or ""
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

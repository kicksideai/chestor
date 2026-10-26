-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local runs = require("runs")
local repo = require("repo")
local records = require("records")
local drivers = require("drivers")
local redact = require("redact")
local docker = require("docker")
local settings = require("settings")
local time = require("time")
local transport = require("transport")
local MAX_CREDENTIAL_BYTES = 65536
local KEEP_CREDENTIAL = "chestor.autocode.runner:keep_credential"
type Container = {name: string, create: {string}, env: {[string]: string}, stdin: string?}
type Caller = {call: (self: Caller, string, {[string]: unknown}) -> (unknown, error?)}
type Prepared = transport.Prepared
type Emit = (string, string) -> ()
type Streamed = {folder: records.Folder, terminal: drivers.Terminal?, stream_error: string?, docker_error: error?,
    code: integer?, last_log: string, cancel_seen: boolean}

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
    local args: {string} = {"create", "-i", "--name", name, "--label", "chestor.autocode.run=" .. run_id}
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

local function stream(admitted: runs.Admitted, box: Container, redactor: redact.Redactor, emit: Emit,
    cancelled: () -> (boolean?, error?), persist_error: () -> string?): (Streamed?, error?)
    local reader, reader_err = drivers.reader(admitted.driver.id, false)
    if not reader then
        return nil, reader_err
    end
    local folder = records.new(function(text: string): string return redact.apply(redactor, text) end)
    local terminal: drivers.Terminal? = nil
    local stream_err: string? = nil
    local stopped = false
    local cancel_seen = false
    local function check_cancel()
        local requested, read_err = cancelled()
        if read_err then stream_err = stream_err or ("cancellation read: " .. tostring(read_err)) end
        if requested then cancel_seen = true end
        if requested or read_err or persist_error() then
            local stop_err = docker.stop(box.name)
            if stop_err then emit("system", "container stop: " .. tostring(stop_err)) end
        end
    end
    local last_log = ""
    local function settle(step: drivers.Step?, err: error?)
        if not step then
            stream_err = stream_err or tostring(err)
            return
        end
        for _, event in ipairs(records.step(folder, step)) do emit(event.kind, event.text) end
        if step.terminal then terminal = step.terminal end
        if persist_error() and not stopped then
            stopped = true
            local stop_err = docker.stop(box.name)
            if stop_err then emit("system", "container stop: " .. tostring(stop_err)) end
        end
    end
    local watching = true
    local watch_done = channel.new(1)
    coroutine.spawn(function()
        while watching do
            check_cancel()
            time.sleep("250ms")
        end
        watch_done:send(true)
    end)
    local code, docker_err = docker.run({"start", "-a", "-i", box.name}, {
        stdin = box.stdin,
        on_line = function(line: string)
            check_cancel()
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
    watching = false
    watch_done:receive()
    settle(reader:finish())
    for _, event in ipairs(records.terminal(folder, terminal)) do emit(event.kind, event.text) end

    return {folder = folder, terminal = terminal, stream_error = stream_err, docker_error = docker_err,
        code = code, last_log = last_log, cancel_seen = cancel_seen}, nil
end

local function keep_credential(run_id: string, owner: Caller, prepared: Prepared, box: Container, emit: Emit): string?
    local refresh_error: string? = nil
    local admitted, secret = prepared.admitted, prepared.secret
    local file = admitted.account.kind.file
    if file and file.write_back then
        local content, copy_err = docker.copy_file(box.name, admitted.image.home .. "/" .. file.path, MAX_CREDENTIAL_BYTES)
        if not content then
            refresh_error = "credential refresh cannot be saved; re-add the account login: " .. tostring(copy_err)
            emit("system", refresh_error)
        elseif content ~= secret then
            local kept, keep_err = owner:call(KEEP_CREDENTIAL, {run_id = run_id, account_id = admitted.account.id, credential_kind = admitted.account.kind.id, credential = content, revision = prepared.revision})
            if keep_err then
                refresh_error = "credential refresh cannot be saved; re-add the account login: " .. tostring(keep_err)
                emit("system", refresh_error)
            elseif type(kept) ~= "boolean" then
                refresh_error = "credential updater returned malformed data; re-add the account login"
                emit("system", refresh_error)
            elseif not kept then
                emit("system", "the CLI refreshed its credential, but the account changed during the run; the newer stored credential is kept")
            end
        end
    end
    return refresh_error
end

local function settle_account(run: repo.Run, terminal: drivers.Terminal?, refresh_error: string?, redactor: redact.Redactor, emit: Emit)
    -- A success clears the account's last refusal; a retryable provider fault
    -- cools it down. Other failures belong to the task, not the account.
    local fault = terminal and terminal.error
    local account_err: error? = nil
    if terminal and terminal.outcome == "succeeded" then
        account_err = repo.settle_account(run.account_id, "", "", run.started_at)
    elseif fault and fault.retryable then
        local cooldown, cooldown_err = settings.get("account_cooldown")
        if not cooldown then
            account_err = cooldown_err
        else
            local duration, duration_err = time.parse_duration(cooldown)
            if not duration or duration:nanoseconds() <= 0 then
                account_err = duration_err or errors.new({kind = errors.INVALID, message = "account cooldown must be a positive duration"})
            else
                account_err = repo.settle_account(run.account_id, redact.apply(redactor, fault.code .. ": " .. fault.message),
                    time.now():add(duration):utc():format_rfc3339(), run.started_at)
            end
        end
    end
    if account_err then emit("system", "account status: " .. tostring(account_err)) end
    if refresh_error then
        local health_err = repo.record_account_error(run.account_id, redact.apply(redactor, refresh_error))
        if health_err then emit("system", "account health write: " .. tostring(health_err)) end
    end

end

return {build = build, stream = stream, keep_credential = keep_credential, settle_account = settle_account}

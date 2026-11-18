-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local credentials = require("credentials")
local runs = require("runs")
local records = require("records")
local settings = require("settings")
local drivers = require("drivers")
local redact = require("redact")
local docker = require("docker")
local events = require("events")
local transport = require("transport")
local quote = require("quote")
local container = require("container")
local MAX_CREDENTIAL_BYTES = credentials.MAX_BYTES
local KEEP_CREDENTIAL = "chestor.autocode.service:keep_credential"
type Container = {name: string, create: {string}, env: {[string]: string}, stdin: string?,
    isolation: {name: string, image: string, network: string, gpus: boolean, limits: transport.Image, mounts: {{source: string, target: string, readonly: boolean}}}}
type Caller = {call: (self: Caller, string, {[string]: unknown}) -> (unknown, error?)}
type Prepared = transport.Prepared
type Emit = (string, string) -> ()
type Streamed = {folder: records.Folder, terminal: drivers.Terminal?, stream_error: string?, docker_error: error?,
    code: integer?, last_log: string, error_native: error?, cancel_seen: boolean}

-- Image run settings: limits, GPU access, network, then the administrator's
-- docker run arguments, all placed before the image reference.
local function settings_args(image: transport.Image): {string}
    local args = container.limits(image)
    local function add(flag: string, value: string)
        if value ~= "" then
            args[#args + 1] = flag
            args[#args + 1] = value
        end
    end
    add("--gpus", image.gpus)
    add("--network", image.network)
    for _, arg in ipairs(image.extra_args) do args[#args + 1] = arg end
    return args
end

local function build(run_id: string, prepared: Prepared, env: {[string]: string}): Container
    local name = runs.container_name(run_id)
    local args: {string} = {"create", "--cap-drop=NET_RAW", "--cgroupns=private", "--pull=never", "-i", "--name", name, "--label", "chestor.autocode.run=" .. run_id}
    local workspace = prepared.workspace
    if workspace then
        args[#args + 1] = "--mount"
        args[#args + 1] = "type=bind,source=" .. workspace.host_path .. ",target=" .. prepared.workdir .. ",bind-recursive=disabled" .. (workspace.writable and "" or ",readonly")

    end
    for _, arg in ipairs(settings_args(prepared.image)) do args[#args + 1] = arg end
    local mounts: {[string]: boolean} = {}
    local function memory_file(path: string)
        local parent = path:match("^(.*)/[^/]+$")
        local target = prepared.image.home .. (parent and ("/" .. parent) or "")
        if mounts[target] then return end
        mounts[target] = true
        args[#args + 1] = "--tmpfs"
        args[#args + 1] = target .. ":rw,mode=1777"
    end
    if prepared.kind.file then memory_file(prepared.kind.file.path) end
    for _, file in ipairs(prepared.launch.files) do
        if file.secret_fields and #file.secret_fields > 0 then memory_file(file.path) end
    end
    for _, arg in ipairs({"--entrypoint", "sleep", prepared.image.ref, "infinity"}) do args[#args + 1] = arg end
    local names: {string} = {}
    for variable in pairs(env) do names[#names + 1] = variable end
    table.sort(names)
    local bootstrap: {string} = {"set -e"}
    for _, variable in ipairs(names) do
        bootstrap[#bootstrap + 1] = "export " .. variable .. "=" .. quote.posix(env[variable])
    end
    bootstrap[#bootstrap + 1] = "AUTOCODE_INPUT=" .. quote.posix(prepared.launch.stdin or "")
    bootstrap[#bootstrap + 1] = 'printf %s "$AUTOCODE_INPUT" | eval "$AUTOCODE_SCRIPT"'
    return {name = name, create = args, env = {}, stdin = table.concat(bootstrap, "\n") .. "\n",
        isolation = {name = name, image = prepared.image.ref, network = prepared.image.network, gpus = prepared.image.gpus ~= "",
            limits = prepared.image,
            mounts = workspace and {{source = workspace.host_path, target = prepared.workdir, readonly = not workspace.writable}} or {}}}
end

local function stream(prepared: Prepared, box: Container, redactor: redact.Redactor, emit: Emit,
    cancelled: () -> (boolean?, error?), persist_error: () -> string?, keep_credential: () -> (), deadline: string?): (Streamed?, error?)
    local started, start_err = docker.run({"start", box.name}, {deadline = deadline})
    if start_err then return nil, start_err end
    if started ~= 0 then
        return nil, errors.new({kind = errors.UNAVAILABLE, message = "container start failed"})
    end
    local reader, reader_err = drivers.reader(prepared.agent, false)
    if not reader then
        return nil, reader_err
    end
    local result_bytes, result_err = settings.integer("result_bytes")
    if not result_bytes then return nil, result_err end
    local event_bytes, event_err = settings.integer("event_text_bytes")
    if not event_bytes then return nil, event_err end
    local folder = records.new(function(text: string): string return redact.apply(redactor, text) end, result_bytes, event_bytes)
    local terminal: drivers.Terminal? = nil
    local stream_err: string? = nil
    local native: error? = nil
    local stopped = false
    local cancel_seen = false
    local function stop()
        stopped = true
        keep_credential()
        local stop_err = docker.stop(box.name, deadline)
        if stop_err then native = native or stop_err; emit("system", "container stop: " .. tostring(stop_err)) end
    end
    local function check_cancel()
        local requested, read_err = cancelled()
        if read_err then native = native or read_err; stream_err = stream_err or ("cancellation read: " .. tostring(read_err)) end
        if requested then cancel_seen = true end
        if not stopped and (requested or read_err or persist_error()) then
            stop()
        end
    end
    local last_log = ""
    local function settle(step: drivers.Step?, err: error?)
        if not step then
            native = native or err
            stream_err = stream_err or tostring(err)
            return
        end
        for _, event in ipairs(records.step(folder, step)) do emit(event.kind, event.text) end
        if step.terminal then terminal = step.terminal end

    end
    local subscription, subscribe_err = events.subscribe("chestor.autocode", "cancel." .. box.name)
    if not subscription then return nil, subscribe_err end
    local signals = subscription:channel()
    local done, watch_done = channel.new(1), channel.new(1)
    -- Subscribe before the catch-up read so a concurrent committed cancel cannot be missed.
    check_cancel()
    coroutine.spawn(function()
        while true do
            local selected = channel.select({done:case_receive(), signals:case_receive()})
            if selected.channel == done then break end
            check_cancel()
        end
        watch_done:send(true)
    end)
    local code, docker_err = docker.run({"exec", "-i", box.name, "sh", "-s"}, {
        deadline = deadline,
        stdin = box.stdin,
        on_line = function(line: string)
            if line:match("^%s*{") then
                settle(reader:feed(line .. "\n"))
            elseif line ~= "" then
                last_log = records.clip(redact.apply(redactor, line), event_bytes)
                emit("log", last_log)
            end
            if not stopped and persist_error() then
                stop()
            end
        end,
        on_overflow = function(bytes: integer)
            emit("system", "dropped an output line of " .. tostring(bytes) .. " bytes, over the " .. tostring(docker.MAX_LINE_BYTES) .. "-byte bound")
        end,
    })
    done:send(true)
    watch_done:receive()
    subscription:close()
    settle(reader:finish())
    for _, event in ipairs(records.terminal(folder, terminal)) do emit(event.kind, event.text) end
    if not stopped then keep_credential() end

    return {folder = folder, terminal = terminal, stream_error = stream_err, docker_error = docker_err,
        code = code, last_log = last_log, error_native = native, cancel_seen = cancel_seen}, nil
end

local function keep_credential(run_id: string, owner: Caller, prepared: Prepared, box: Container, emit: Emit, deadline: string?): string?
    local refresh_error: string? = nil
    local secret = prepared.secret
    local file = prepared.kind.file
    if file and file.write_back then
        local content, copy_err = docker.read_file(box.name, prepared.image.home .. "/" .. file.path, MAX_CREDENTIAL_BYTES, deadline)
        if not content then
            refresh_error = "credential refresh cannot be saved; re-add the account login: " .. tostring(copy_err)
            emit("system", refresh_error)
        elseif content ~= secret then
            local kept, keep_err = owner:call(KEEP_CREDENTIAL, {run_id = run_id, account_id = prepared.account_id, credential_kind = prepared.kind.id, credential = content, revision = prepared.revision})
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

return {build = build, stream = stream, keep_credential = keep_credential}

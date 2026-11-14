-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs the docker CLI on the host executor. Output is one merged stream
-- delivered line by line; container secrets arrive only through an inherited pipe.
local exec = require("exec")
local registry = require("registry")
local stream = require("stream")
local quote = require("quote")
local time = require("time")
local json = require("json")

type Mount = {source: string, target: string, readonly: boolean}
type Network = {Id: string, Name: string}
type Limits = {memory: string, cpus: string, pids_limit: integer}
type Isolation = {name: string, image: string, network: string, mounts: {Mount}, gpus: boolean?, limits: Limits?}
type Options = {
    deadline: string?,
    isolation: Isolation?,
    env: {[string]: string}?,
    stdin: string?,
    on_line: ((string) -> ())?,
    -- A line longer than MAX_LINE_BYTES is dropped; this reports its size.
    on_overflow: ((integer) -> ())?,
}

type Child = {proc: exec.Process, stdout: stream.Stream, executor: exec.Executor, expired: boolean, done: channel.Channel?, joined: channel.Channel?, timer: time.Timer?}

local M = {}

-- The longest line delivered: the drivers' frame bound, so every output
-- frame a reader accepts reaches it whole.
M.MAX_LINE_BYTES = 1048576

local function fail(message: string, cause: error?): error
    if cause then return errors.wrap(cause, message) end
    return errors.new({kind = errors.UNAVAILABLE, message = message})
end

local function stop_watch(child: Child)
    if child.done then
        child.done:send(true)
        if child.joined then child.joined:receive() end
        if child.timer then child.timer:stop() end
        child.done, child.joined, child.timer = nil, nil, nil
    end
end

local function timeout(): error
    return errors.new({kind = errors.TIMEOUT, message = "Docker execution deadline exceeded", retryable = true})
end

local function close(child: Child)
    stop_watch(child)
    child.stdout:close()
    child.proc:close(true)
    child.executor:release()
end

local CLIENT = [=[
context=$AUTOCODE_DOCKER_CONTEXT
payload_count=$AUTOCODE_DOCKER_PAYLOAD_COUNT
eval "set -- $AUTOCODE_DOCKER_ARGS"
unset AUTOCODE_DOCKER_CLIENT AUTOCODE_DOCKER_ARGS AUTOCODE_DOCKER_CONTEXT AUTOCODE_DOCKER_PAYLOAD_COUNT
launch() {
    if test -n "$context"; then set -- --context "$context" "$@"; fi
    exec docker "$@"
}
if test "$payload_count" -gt 0; then
    operation=$1; shift
    set -- "$operation" --env-file /dev/fd/3 "$@"
    exec 4<&0
    (
        exec 4<&-
        index=0
        while test "$index" -lt "$payload_count"; do
            eval 'part=${AUTOCODE_DOCKER_PAYLOAD_'"$index"'}'
            printf '%s' "$part"
            index=$((index + 1))
        done
    ) | (
        exec 3<&0 0<&4 4<&-
        index=0
        while test "$index" -lt "$payload_count"; do
            unset "AUTOCODE_DOCKER_PAYLOAD_$index"
            index=$((index + 1))
        done
        launch "$@"
    )
else
    launch "$@"
fi
]=]

local function start(args: {string}, opts: Options): (Child?, error?)
    local ceiling: time.Time? = nil
    if opts.deadline then
        local deadline, parse_err = time.parse("2006-01-02T15:04:05.999999999Z07:00", opts.deadline)
        if not deadline then return nil, parse_err and errors.wrap(parse_err, "Docker execution deadline") or fail("invalid Docker execution deadline") end
        ceiling = deadline
        if deadline:sub(time.now()):nanoseconds() <= 0 then return nil, timeout() end
    end
    local config, config_err = registry.get("chestor.autocode:runtime_config")
    if not config then return nil, fail("docker configuration", config_err) end
    local executor_id = config.meta.docker_executor
    local context = config.meta.docker_context
    if type(executor_id) ~= "string" or executor_id == "" or type(context) ~= "string" then return nil, fail("docker executor and context must be host-bound strings") end
    local encoded_args = quote.line(args)
    local environment: {[string]: string} = {AUTOCODE_DOCKER_CLIENT = CLIENT, AUTOCODE_DOCKER_ARGS = encoded_args,
        AUTOCODE_DOCKER_CONTEXT = context}
    local names: {string} = {}
    local payload: {string} = {}
    local container_env = (args[1] == "create" or args[1] == "run") and opts.env or nil
    for name, value in pairs(container_env or {}) do
        if not name:match("^[%a_][%w_]*$") then return nil, fail("invalid container environment name") end
        local item = #names
        names[#names + 1] = name
        local octal = value:gsub(".", function(byte: string): string return string.format("\\0%03o", byte:byte()) end)
        local count = math.ceil(#octal / 32768)
        payload[#payload + 1] = "AUTOCODE_PAYLOAD_" .. tostring(item) .. "_COUNT=" .. tostring(count)
        for index = 0, count - 1 do
            payload[#payload + 1] = "AUTOCODE_PAYLOAD_" .. tostring(item) .. "_" .. tostring(index) .. "=" .. octal:sub(index * 32768 + 1, (index + 1) * 32768)
        end
    end
    local content = #names > 0 and ("AUTOCODE_TRANSFER_NAMES=" .. table.concat(names, " ") .. "\n" .. table.concat(payload, "\n") .. "\n") or ""
    local count = math.ceil(#content / 32768)
    environment.AUTOCODE_DOCKER_PAYLOAD_COUNT = tostring(count)
    for index = 0, count - 1 do
        environment["AUTOCODE_DOCKER_PAYLOAD_" .. tostring(index)] = content:sub(index * 32768 + 1, (index + 1) * 32768)
    end
    local executor, err = exec.get(executor_id)
    if not executor then return nil, fail("docker executor", err) end
    local command = quote.line({"/bin/sh", "-c", 'exec /bin/sh -ec "$AUTOCODE_DOCKER_CLIENT" 2>&1'})
    local proc, proc_err = executor:exec(command, {env = environment})
    if not proc then
        executor:release()
        return nil, fail("docker exec", proc_err)
    end
    local stdout, stream_err = proc:stdout_stream()
    if not stdout then
        proc:close(true)
        executor:release()
        return nil, fail("docker stdout", stream_err)
    end
    local child: Child = {proc = proc, stdout = stdout :: stream.Stream, executor = executor, expired = false}
    if ceiling then
        local done, joined = channel.new(1), channel.new(1)
        local timer, timer_err = time.timer(ceiling:sub(time.now()))
        if not timer then close(child); return nil, fail("Docker deadline timer", timer_err) end
        child.done, child.joined, child.timer = done, joined, timer
        local fired = timer:response()
        coroutine.spawn(function()
            local result = channel.select({done:case_receive(), fired:case_receive()})
            if result.channel == fired then
                child.expired = true
                child.stdout:close()
                child.proc:close(true)
            end
            joined:send(true)
        end)
    end
    local _, start_err = proc:start()
    if start_err then
        close(child)
        return nil, child.expired and timeout() or fail("docker start", start_err)
    end
    if opts.stdin then
        local _, write_err = proc:write_stdin(opts.stdin)
        if write_err then
            close(child)
            return nil, child.expired and timeout() or fail("docker stdin", write_err)
        end
    end
    local _, close_err = proc:close_stdin()
    if close_err then
        close(child)
        return nil, fail("docker stdin close", close_err)
    end
    return child, nil
end

local function finish(child: Child): (integer?, error?)
    local code, wait_err = child.proc:wait()
    stop_watch(child)
    child.stdout:close()
    child.executor:release()
    if child.expired then return nil, timeout() end
    if wait_err then return nil, fail("docker wait", wait_err) end
    if type(code) ~= "number" then return nil, fail("docker wait returned no exit code") end
    return math.floor(code), nil
end

function M.run(args: {string}, options: Options?): (integer?, error?)
    local opts = options or {}
    local child, start_err = start(args, opts)
    if not child then return nil, start_err end

    local buffer = ""
    local dropped = 0
    local created_id: string? = nil
    local function deliver(line: string)
        if dropped > 0 or #line > M.MAX_LINE_BYTES then
            if opts.on_overflow then opts.on_overflow(dropped + #line) end
            dropped = 0
            return
        end
        line = line:gsub("\r$", "")
        if args[1] == "create" then
            if #line == 64 and line:match("^[a-f0-9]+$") then created_id = line end
        end
        if opts.on_line then opts.on_line(line) end
    end
    while true do
        local chunk, read_err = child.stdout:read(4096)
        if read_err then
            close(child)
            return nil, child.expired and timeout() or fail("docker output", read_err)
        end
        if chunk == nil then break end
        buffer = buffer .. chunk
        while true do
            local newline = buffer:find("\n", 1, true)
            if not newline then break end
            deliver(buffer:sub(1, newline - 1))
            buffer = buffer:sub(newline + 1)
        end
        if #buffer > M.MAX_LINE_BYTES then
            dropped = dropped + #buffer
            buffer = ""
        end
    end
    if buffer ~= "" or dropped > 0 then deliver(buffer) end
    local code, err = finish(child)
    if code == 0 and opts.isolation then
        if not created_id then return nil, fail("Docker create returned no container ID") end
        local problem = M.inspect_created(created_id, opts.isolation, opts.deadline)
        if problem then
            local remove_err = M.ensure_removed(created_id, time.now():add("30s"):utc():format("2006-01-02T15:04:05.999999999Z07:00"))
            if remove_err then
                return nil, errors.new({kind = errors.UNAVAILABLE, message = tostring(problem) .. "; container removal failed: " .. tostring(remove_err)})
            end
            return nil, problem
        end
    end
    return code, err
end

-- output runs a docker command and returns its lines when it succeeds.
local function output(args: {string}, deadline: string?): ({string}?, error?)
    local lines: {string} = {}
    local code, err = M.run(args, {deadline = deadline, on_line = function(line) lines[#lines + 1] = line end})
    if err then return nil, err end
    if code ~= 0 then return nil, fail("docker " .. args[1] .. " exited with code " .. tostring(code) .. ": " .. table.concat(lines, "\n")) end
    return lines, nil
end

-- capture returns the whole output of a docker command, refusing more than
-- limit bytes.
local function capture(args: {string}, limit: integer, deadline: string?): (string?, integer?, error?)
    local child, start_err = start(args, {deadline = deadline})
    if not child then return nil, nil, start_err end
    local parts: {string} = {}
    local size = 0
    while true do
        local chunk, read_err = child.stdout:read(65536)
        if read_err then
            close(child)
            return nil, nil, child.expired and timeout() or fail("docker output", read_err)
        end
        if chunk == nil then break end
        size = size + #chunk
        if size > limit then
            close(child)
            return nil, nil, fail("docker output exceeds " .. tostring(limit) .. " bytes")
        end
        parts[#parts + 1] = chunk
    end
    local code, wait_err = finish(child)
    if not code then return nil, nil, wait_err end
    return table.concat(parts), code, nil
end

local function empty(value: unknown): boolean
    return value == nil or (type(value) == "table" and next(value) == nil)
end

-- Moby v26.1.3 oci/defaults.go: accept additional protection, never less.
local PROTECTED_PATHS = {
    MaskedPaths = {"/proc/asound", "/proc/acpi", "/proc/kcore", "/proc/keys", "/proc/latency_stats", "/proc/timer_list",
        "/proc/timer_stats", "/proc/sched_debug", "/proc/scsi", "/sys/firmware", "/sys/devices/virtual/powercap"},
    ReadonlyPaths = {"/proc/bus", "/proc/fs", "/proc/irq", "/proc/sys", "/proc/sysrq-trigger"},
}

-- Docker owns option parsing. Only the resulting container grants authority.
local function mismatch(value: unknown, expected: Isolation, runtime: string, network: Network): string?
    if type(value) ~= "table" or type(value.HostConfig) ~= "table" or type(value.Config) ~= "table" then return "HostConfig/Config" end
    local host, config = value.HostConfig, value.Config
    local limits = expected.limits
    if limits then
        if limits.memory ~= "" and (type(host.Memory) ~= "number" or host.Memory <= 0) then return "Memory" end
        if limits.cpus ~= "" and (type(host.NanoCpus) ~= "number" or host.NanoCpus <= 0) then return "NanoCpus" end
        if limits.pids_limit ~= 0 and (type(host.PidsLimit) ~= "number" or host.PidsLimit <= 0) then return "PidsLimit" end
    end
    if value.Name ~= "/" .. expected.name then return "Name" end
    if config.Image ~= expected.image then return "Config.Image" end
    if type(value.State) ~= "table" or value.State.Status ~= "created" then return "State.Status" end
    if network.Name == "host" or (host.NetworkMode ~= network.Name and host.NetworkMode ~= network.Id and host.NetworkMode ~= expected.network
        and not (network.Name == "bridge" and host.NetworkMode == "default")) then return "NetworkMode" end
    if type(value.NetworkSettings) ~= "table" or type(value.NetworkSettings.Networks) ~= "table" then return "NetworkSettings.Networks" end
    local attached = 0
    for name, endpoint in pairs(value.NetworkSettings.Networks) do
        attached = attached + 1
        if name ~= network.Name and name ~= network.Id then return "NetworkSettings.Networks" end
        if type(endpoint) ~= "table" or (endpoint.NetworkID ~= nil and endpoint.NetworkID ~= "" and endpoint.NetworkID ~= network.Id) then return "NetworkSettings.Networks" end
    end
    if attached ~= 1 then return "NetworkSettings.Networks" end
    for _, field in ipairs({"PidMode", "IpcMode", "UTSMode", "UsernsMode", "CgroupnsMode"}) do
        if host[field] ~= "" and host[field] ~= "private" then return field end
    end
    if host.CgroupnsMode ~= "private" then return "CgroupnsMode" end
    if host.Privileged ~= false then return "Privileged" end
    if host.OomScoreAdj ~= nil and (type(host.OomScoreAdj) ~= "number" or host.OomScoreAdj < 0) then return "OomScoreAdj" end
    if host.OomKillDisable == true then return "OomKillDisable" end
    for _, field in ipairs({"CpuRealtimePeriod", "CpuRealtimeRuntime"}) do
        if host[field] ~= nil and host[field] ~= 0 then return field end
    end
    if host.RestartPolicy ~= nil then
        local policy = host.RestartPolicy
        if type(policy) ~= "table" or (policy.Name ~= "no" and policy.Name ~= "")
            or (policy.MaximumRetryCount ~= nil and policy.MaximumRetryCount ~= 0) then return "RestartPolicy" end
    end
    for _, field in ipairs({"Devices", "DeviceCgroupRules", "CapAdd", "VolumesFrom", "Sysctls",
        "BlkioWeightDevice", "BlkioDeviceReadBps", "BlkioDeviceWriteBps", "BlkioDeviceReadIOps", "BlkioDeviceWriteIOps",
        "Links", "PortBindings"}) do
        if not empty(host[field]) then return field end
    end
    local raw_dropped = false
    if type(host.CapDrop) == "table" then
        for _, cap in ipairs(host.CapDrop) do
            -- Moby v28.0.4 client/container_create.go normalizes names with CAP_; ALL stays unprefixed.
            if cap == "NET_RAW" or cap == "CAP_NET_RAW" or cap == "ALL" then raw_dropped = true end
        end
    end
    if not raw_dropped then return "CapDrop" end
    if expected.gpus then
        if type(host.DeviceRequests) ~= "table" or #host.DeviceRequests ~= 1 then return "DeviceRequests" end
    elseif not empty(host.DeviceRequests) then return "DeviceRequests" end
    if host.PublishAllPorts ~= false then return "PublishAllPorts" end
    for _, field in ipairs({"CgroupParent", "Cgroup", "ContainerIDFile", "Isolation", "VolumeDriver"}) do
        if host[field] ~= nil and host[field] ~= "" then return field end
    end
    if host.Runtime ~= runtime then return "Runtime" end
    if not empty(host.Annotations) then return "Annotations" end
    if not empty(config.Volumes) then return "Config.Volumes" end
    for _, field in ipairs({"MaskedPaths", "ReadonlyPaths"}) do
        local paths = PROTECTED_PATHS[field]
        if type(host[field]) ~= "table" then return field end
        for _, path in ipairs(paths) do
            local found = false
            for _, actual in ipairs(host[field]) do if actual == path then found = true end end
            if not found then return field end
        end
    end
    if not empty(host.SecurityOpt) then
        if type(host.SecurityOpt) ~= "table" then return "SecurityOpt" end
        for _, option in ipairs(host.SecurityOpt) do
            if option ~= "no-new-privileges" and option ~= "no-new-privileges=true" and option ~= "no-new-privileges:true" then return "SecurityOpt" end
        end
    end
    if not empty(host.Binds) then return "Binds" end
    local mounts = host.Mounts or {}
    if type(mounts) ~= "table" or #mounts ~= #expected.mounts then return "Mounts" end
    for index, wanted in ipairs(expected.mounts) do
        local mount = mounts[index]
        if type(mount) ~= "table" or mount.Type ~= "bind" or mount.Source ~= wanted.source or mount.Target ~= wanted.target
            or (mount.ReadOnly == true) ~= wanted.readonly or type(mount.BindOptions) ~= "table"
            or mount.BindOptions.NonRecursive ~= true or (mount.BindOptions.Propagation ~= nil and mount.BindOptions.Propagation ~= "rprivate") then return "Mounts" end
    end
    local effective = value.Mounts
    if type(effective) ~= "table" or #effective ~= #expected.mounts then return "Mounts" end
    for _, mount in ipairs(effective) do
        local found = false
        for _, wanted in ipairs(expected.mounts) do
            if mount.Type == "bind" and mount.Source == wanted.source and mount.Destination == wanted.target
                and mount.RW == not wanted.readonly and mount.Propagation == "rprivate" then found = true end
        end
        if not found then return "Mounts" end
    end
    -- Docker tmpfs targets are container paths; no host source is permitted.
    if not empty(host.Tmpfs) then
        if type(host.Tmpfs) ~= "table" then return "Tmpfs" end
        for target, options in pairs(host.Tmpfs) do
            if type(target) ~= "string" or target:sub(1, 1) ~= "/" or type(options) ~= "string" then return "Tmpfs" end
        end
    end
    return nil
end

local function resolve_network(reference: string, deadline: string?): (Network?, error?)
    if reference == "" or reference == "default" then reference = "bridge" end
    local content, code, err = capture({"network", "inspect", "--format", '{"Id":{{json .Id}},"Name":{{json .Name}}}', reference}, 65536, deadline)
    if err then return nil, err end
    if code ~= 0 then return nil, fail("Docker recipe network inspection failed") end
    local network, decode_err = json.decode(content or "")
    if decode_err then return nil, fail("Docker recipe network inspection returned invalid JSON", decode_err) end
    if type(network) ~= "table" or type(network.Id) ~= "string" or network.Id == "" or type(network.Name) ~= "string" or network.Name == "" then
        return nil, fail("Docker recipe network inspection returned no ID/name")
    end
    return network :: Network, nil
end

function M.inspect_created(id: string, expected: Isolation, deadline: string?): error?
    local content, code, err = capture({"inspect", "--type", "container", "--format", "{{json .}}", id}, 16777216, deadline)
    local problem: error? = err
    if not problem then
        if code ~= 0 then problem = fail("Docker isolation inspection failed")
        else
            local value, decode_err = json.decode(content or "")
            if decode_err then problem = fail("Docker isolation inspection returned invalid JSON", decode_err)
            else
                local defaults, info_err = output({"info", "--format", "{{.DefaultRuntime}}"}, deadline)
                if not defaults or #defaults ~= 1 or defaults[1] == "" then problem = info_err or fail("Docker default Runtime inspection failed")
                else
                    local network, network_err = resolve_network(expected.network, deadline)
                    local field = network and mismatch(value, expected, defaults[1], network)
                    if not network then problem = network_err
                    elseif field then problem = fail("Docker isolation mismatch: " .. field)
                    end
                end
            end
        end
    end
    return problem
end

-- archived_file returns the content of the regular file in a tar stream.
local function archived_file(archive: string, limit: integer): (string?, error?)
    local offset = 1
    while offset + 511 <= #archive do
        local header = archive:sub(offset, offset + 511)
        if header:match("^%z*$") then return nil, fail("docker cp returned no regular file") end
        local size = tonumber((header:sub(125, 136):gsub("[%z%s]", "")), 8)
        if not size or size < 0 then return nil, fail("invalid tar entry size") end
        local content_start = offset + 512
        local type_flag = header:sub(157, 157)
        if content_start + size - 1 > #archive then return nil, fail("truncated tar entry") end
        if type_flag == "0" or type_flag == "\0" then
            if size > limit then return nil, fail("copied file exceeds " .. tostring(limit) .. " bytes") end
            return archive:sub(content_start, content_start + size - 1), nil
        end
        offset = content_start + math.ceil(size / 512) * 512
    end
    return nil, fail("docker cp returned no regular file")
end

-- copy_file reads one file out of a container, running or stopped.
function M.copy_file(container: string, path: string, limit: integer, deadline: string?): (string?, error?)
    local archive, code, err = capture({"cp", container .. ":" .. path, "-"}, limit + 65536, deadline)
    if not archive then return nil, err end
    if code ~= 0 then return nil, fail("docker cp exited with code " .. tostring(code)) end
    local content, archive_err = archived_file(archive, limit)
    if not content then return nil, archive_err end
    return content, nil
end

-- Keep started containers readable; remove a created container so it cannot launch after cancellation.
function M.stop(name: string, deadline: string?): error?
    local listed, list_err = output({"ps", "-a", "--format", "{{.State}}", "--filter", "name=^" .. name .. "$"}, deadline)
    if not listed then return list_err end
    if #listed == 0 or listed[1] == "" then return nil end
    if listed[1] == "created" then return M.ensure_removed(name, deadline) end
    local _, stop_err = output({"stop", "-t", "5", name}, deadline)
    return stop_err
end

-- Forcefully remove a run container; one that already exited is fine.
function M.remove(name: string, deadline: string?): error?
    local _, err = output({"rm", "-f", name}, deadline)
    return err
end

-- A failed removal succeeds only when Docker confirms exact-name absence.
function M.ensure_removed(name: string, deadline: string?): error?
    local err = M.remove(name, deadline)
    if not err then return nil end
    local present = false
    local filter = (#name == 64 and name:match("^[a-f0-9]+$")) and ("id=" .. name) or ("name=^" .. name .. "$")
    local code, inspect_err = M.run({"ps", "-aq", "--filter", filter},
        {deadline = deadline, on_line = function(line: string) if line ~= "" then present = true end end})
    if not inspect_err and code == 0 and not present then return nil end
    return err
end

return M

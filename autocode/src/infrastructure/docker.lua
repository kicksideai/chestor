-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs the docker CLI on the host executor. Output is one merged stream
-- delivered line by line; secrets arrive only through `env`.
local exec = require("exec")
local registry = require("registry")
local stream = require("stream")
local quote = require("quote")
local time = require("time")

type Options = {
    deadline: string?,
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

-- `sh -c 'exec docker "$@" 2>&1'` folds docker's stderr into stdout so a
-- single reader drains the child and a full stderr pipe cannot stall it.
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
    local environment: {[string]: string} = {}
    for key, value in pairs(opts.env or {}) do environment[key] = value end
    if context ~= "" then environment.DOCKER_CONTEXT = context end
    local executor, err = exec.get(executor_id)
    if not executor then return nil, fail("docker executor", err) end
    local argv = {"/bin/sh", "-c", 'exec docker "$@" 2>&1', "sh"}
    for _, arg in ipairs(args) do argv[#argv + 1] = arg end
    local proc, proc_err = executor:exec(quote.line(argv), {env = environment})
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
    local function deliver(line: string)
        if dropped > 0 or #line > M.MAX_LINE_BYTES then
            if opts.on_overflow then opts.on_overflow(dropped + #line) end
            dropped = 0
            return
        end
        if opts.on_line then opts.on_line((line:gsub("\r$", ""))) end
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
    return finish(child)
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

-- Stop a run container if it exists, keeping it for the runner to read.
function M.stop(name: string, deadline: string?): error?
    local listed, list_err = output({"ps", "-q", "--filter", "name=^" .. name .. "$"}, deadline)
    if not listed then return list_err end
    if #listed == 0 or listed[1] == "" then return nil end
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
    local code, inspect_err = M.run({"ps", "-aq", "--filter", "name=^" .. name .. "$"},
        {deadline = deadline, on_line = function(line: string) if line ~= "" then present = true end end})
    if not inspect_err and code == 0 and not present then return nil end
    return err
end

return M

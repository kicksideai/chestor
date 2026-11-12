-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stream = require("stream")
local exec = require("exec")
local registry = require("registry")
local quote = require("quote")
local function run(args: {string}): (string?, error?)
    local config, config_err = registry.get("chestor.autocode:runtime_config")
    if not config then return nil, config_err end
    local executor_id: unknown = config.meta.docker_executor
    if type(executor_id) ~= "string" or executor_id == "" then return nil, errors.new({kind = errors.INVALID, message = "host executor must be a host-bound string", details = {code = "autocode.invalid_executor"}}) end
    local executor, get_err = exec.get(executor_id)
    if not executor then return nil, get_err end
    local command = quote.line({"/bin/sh", "-c", 'exec timeout -k 2 30 /bin/sh -c "$AUTOCODE_HOST_COMMAND" 2>&1'})
    local proc, proc_err = executor:exec(command, {env = {GIT_TERMINAL_PROMPT = "0", AUTOCODE_HOST_COMMAND = "exec " .. quote.line(args)}})
    if not proc then executor:release(); return nil, proc_err end
    local raw_output, output_err = proc:stdout_stream()
    local output = raw_output :: stream.Stream?
    if not output then proc:close(true); executor:release(); return nil, output_err end
    local _, start_err = proc:start()
    if start_err then output:close(); proc:close(true); executor:release(); return nil, start_err end
    proc:close_stdin()
    local text = ""
    while true do
        local chunk, read_err = output:read(4096)
        if read_err or (chunk and #text + #chunk > 65536) then
            output:close(); proc:close(true); executor:release()
            return nil, read_err or errors.new({kind = errors.INVALID, message = "host output exceeds its bound", details = {code = "autocode.host_output_limit"}})
        end
        if not chunk then break end
        text = text .. chunk
    end
    local code, wait_err = proc:wait()
    output:close(); proc:close(); executor:release()
    if wait_err then return nil, wait_err end
    -- Host diagnostics can contain private paths; they remain outside the error.
    if code == 124 or code == 137 then return nil, errors.new({kind = errors.TIMEOUT, message = "host command timed out", retryable = true,
        details = {code = "autocode.host_timeout", exit_code = code}}) end
    if code ~= 0 then return nil, errors.new({kind = errors.INVALID, message = "host command failed", details = {code = "autocode.host_command_failed", exit_code = code}}) end
    return (text:gsub("\n$", "")), nil
end
return {run = run}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stream = require("stream")
local exec = require("exec")
local registry = require("registry")
local uuid = require("uuid")
local function probe(path: string): (string?, error?)
    local config, config_err = registry.get("chestor.autocode:runtime_config")
    if not config then return nil, config_err end
    local executor_id: unknown = config.meta.docker_executor
    if type(executor_id) ~= "string" or executor_id == "" then return nil, errors.new({kind = errors.INVALID, message = "host executor must be a host-bound string", details = {code = "autocode.invalid_executor"}}) end
    local executor, get_err = exec.get(executor_id)
    if not executor then return nil, get_err end
    local marker = "AUTOCODE_HOST_DEADLINE_" .. uuid.v7()
    local command = "/bin/sh -c 'PATH=/usr/bin:/bin; export PATH; exec timeout -k 2 30 /bin/sh -c '\"'\"'marker=$AUTOCODE_HOST_TIMEOUT_MARKER\ntrap '\"'\"'\"'\"'\"'\"'\"'\"'printf \"\\n%s\\n\" \"$marker\"; trap \"\" TERM; wait; exit 124'\"'\"'\"'\"'\"'\"'\"'\"' TERM\n/bin/sh -ec '\"'\"'\"'\"'\"'\"'\"'\"'\nfail() { printf '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'%s\\n'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"' \"$*\" >&2; exit 1; }\nclean_path() {\n    newline='\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\n'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\n    carriage=$(printf '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\\r'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"')\n    case \"$1\" in *\"$newline\"*|*\"$carriage\"*) fail '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'control character in path'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"';; esac\n    case \"$1\" in /*) ;; *) fail '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'absolute path required'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"';; esac\n    case \"$1\" in *//*|*/./*|*/../*|*/.|*/..|*'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"','\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'*|*'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'='\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'*) fail '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'unclean path'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"';; esac\n}\nwalk() (\n    clean_path \"$1\"\n    remaining=${1#/}; current=\n    while test -n \"$remaining\"; do\n        part=${remaining%%/*}\n        if test \"$remaining\" = \"$part\"; then remaining=; else remaining=${remaining#*/}; fi\n        current=$current/$part\n        test ! -L \"$current\" || fail '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'symlink traversal refused'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\n        cd -P \"$current\" || exit\n        test \"$PWD\" = \"$current\" || fail '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'directory identity changed'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\n    done\n)\nno_mounts() {\n    AUTOCODE_CHECK_PATH=$1 awk '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\n    BEGIN { path=ENVIRON[\"AUTOCODE_CHECK_PATH\"] }\n    function decode(v) {\n        gsub(/\\\\040/, \" \", v); gsub(/\\\\011/, \"\\t\", v); gsub(/\\\\012/, \"\\n\", v); gsub(/\\\\134/, \"\\\\\", v); return v\n    }\n    { device[NR]=$3; root[NR]=decode($4); point[NR]=decode($5); count[$3 SUBSEP root[NR]]++ }\n    END {\n        for(i=1;i<=NR;i++) {\n            alias=(root[i]!=\"/\" || count[device[i] SUBSEP root[i]]>1)\n            if(path!=\"/\" && alias && (point[i]==path || index(path,point[i] \"/\")==1)) exit 1\n        }\n    }'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"' /proc/self/mountinfo || fail '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'path crosses a mount alias'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\n}\n\nwalk \"$AUTOCODE_WORKSPACE_PATH\"; no_mounts \"$AUTOCODE_WORKSPACE_PATH\"; printf '\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'%s\\n'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"'\"' \"$AUTOCODE_WORKSPACE_PATH\"'\"'\"'\"'\"'\"'\"'\"'\"' &\nwait $!\n'\"'\"' 2>&1'"
    local env = {AUTOCODE_WORKSPACE_PATH = path, AUTOCODE_HOST_TIMEOUT_MARKER = marker}
    local proc, proc_err = executor:exec(command, {env = env})
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
    if text:find("\n" .. marker .. "\n", 1, true) then return nil, errors.new({kind = errors.TIMEOUT, message = "host command timed out", retryable = true,
        details = {code = "autocode.host_timeout", exit_code = code}}) end
    if code ~= 0 then return nil, errors.new({kind = errors.INVALID, message = "host command failed", details = {code = "autocode.host_command_failed", exit_code = code}}) end
    return (text:gsub("\n$", "")), nil
end
return {probe = probe}

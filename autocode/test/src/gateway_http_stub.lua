-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {state = {}}
M.CONTENT = {JSON = "application/json"}
function M.request()
    return {header = function() return "Bearer fixture-bearer-value" end, body = function() return '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' end,
        param = function() return "run" end}
end
function M.response()
    return {set_content_type = function() end, set_status = function(_, status) M.state.status = status end,
        write_json = function(_, body) M.state.body = body end}
end
function M.handle() return nil, M.state.error, "fixture:tool" end
function M:error(message, fields)
    M.state.logs = M.state.logs or {}
    M.state.logs[#M.state.logs + 1] = {message = message, fields = fields}
end
return M

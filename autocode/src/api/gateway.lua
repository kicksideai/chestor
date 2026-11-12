-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local json = require("json")
local gateway = require("gateway")
local logger = require("logger")
local redact = require("redact")
local function serve(hook: boolean)
    local req, req_err = http.request({max_body = 524288})
    local res = http.response()
    if not req or not res then return end
    res:set_content_type(http.CONTENT.JSON)
    local token = (req:header("Authorization") or ""):match("^Bearer (%S+)$") or ""
    local raw, read_err = req:body()
    local body, decode_err = json.decode(raw or "")
    if read_err or decode_err or type(body) ~= "table" then res:set_status(400); res:write_json({error = "request body must be a JSON object"}); return end
    local reply, err, tool_id = gateway.handle(req:param("action_id") or "", token, body, hook)
    if not reply then
        local credential = err and errors.is(err, errors.PERMISSION_DENIED) and err:details().code == "autocode.gateway_credential_invalid"
        if not credential then
            local redactor = redact.new(token)
            logger:error("autocode gateway unavailable", {
                kind = err and err:kind(),
                code = err and redact.apply(redactor, tostring(err:details().code or "")),
                message = redact.apply(redactor, err and err:message() or "gateway returned no response"),
                run_id = redact.apply(redactor, req:param("action_id") or ""),
                tool_id = tool_id and redact.apply(redactor, tool_id),
            })
        end
        res:set_status(credential and 401 or 500)
        res:write_json({error = credential and "invalid run credential" or "run gateway unavailable",
            code = credential and "autocode.gateway_credential_invalid" or "autocode.gateway_unavailable"})
        return
    end
    if not hook and body.id == nil then res:set_status(202); return end
    res:write_json(reply)
end
return {mcp = function() serve(false) end, hook = function() serve(true) end}

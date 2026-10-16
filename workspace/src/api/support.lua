local http = require("http")
local http_errors = require("http_errors")
local json = require("json")

local M = {}

function M.context(): (any?, any?)
    local req = http.request()
    local res = http.response()
    if res then res:set_content_type(http.CONTENT.JSON) end
    return req, res
end

function M.fail(res: any, err: any)
    res:set_status((http_errors.classify(err)))
    res:write_json({ success = false, error = tostring(err) })
end

function M.respond_error(res: any, status: number, message: string)
    res:set_status(status)
    res:write_json({ success = false, error = message })
end

function M.body(req: any): (any?, string?)
    local raw = req:body()
    if not raw or raw == "" then return {}, nil end
    if type(raw) ~= "string" then return nil, "invalid request body" end
    local decoded, err = json.decode(raw)
    if err or type(decoded) ~= "table" then return nil, "invalid json" end
    return decoded, nil
end

return M

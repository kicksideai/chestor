local http = require("http")
local http_errors = require("http_errors")

local M = {}

function M.context(): (any?, any?)
    local req = http.request()
    local res = http.response()
    if res then res:set_content_type(http.CONTENT.JSON) end
    return req, res
end

function M.options(req: any): any
    local options: any = {}
    for _, key in ipairs({ "id", "table_id", "search", "limit" }) do
        local value = req:query(key)
        if value ~= nil and value ~= "" then options[key] = value end
    end
    return options
end

function M.write(res: any, key: string, value: any, err: any)
    if err then
        res:set_status((http_errors.classify(err)))
        res:write_json({ success = false, error = tostring(err) })
    else
        res:write_json({ success = true, [key] = value })
    end
end

return M

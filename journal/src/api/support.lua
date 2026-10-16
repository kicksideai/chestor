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

function M.body(req: any): (any?, any?)
    local decoded, err = json.decode(req:body() or "{}")
    if err or type(decoded) ~= "table" then return nil, errors.new({ message = "invalid json", kind = errors.INVALID }) end
    return decoded, nil
end

function M.journal_id(req: any): (string?, any?)
    local id = tostring(req and req:param("id") or "")
    if id == "" then return nil, errors.new({ message = "journal id is required", kind = errors.INVALID }) end
    return id, nil
end

-- Collects the named query parameters a read view accepts. An absent or empty
-- parameter is left out so the view keeps its own default rather than being
-- pinned to a value the caller never sent.
function M.query_opts(req: any, names: { string }): any
    local opts: any = {}
    for _, name in ipairs(names) do
        local value = req:query(name)
        if value ~= nil and tostring(value) ~= "" then opts[name] = value end
    end
    return opts
end

function M.write(res: any, key: string, value: any, err: any)
    if err then
        local message = tostring(err)
        res:set_status((http_errors.classify(err)))
        res:write_json({ success = false, error = message })
    elseif type(value) == "table" and value.success ~= nil then
        res:write_json(value)
    else
        res:write_json({ success = true, [key] = value })
    end
end

return M

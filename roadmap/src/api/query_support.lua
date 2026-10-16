local http = require("http")
local http_errors = require("http_errors")

local M = {}

-- Query keys the roadmap read endpoints accept. An absent or empty parameter is
-- left out so the engine keeps its own default rather than being pinned to a
-- value the caller never sent.
local QUERY_KEYS = {
    "layer", "outcome", "status", "horizon", "period_from", "period_to",
    "of", "direction",
}


function M.context(): (any?, any?)
    local req = http.request()
    local res = http.response()
    if res then res:set_content_type(http.CONTENT.JSON) end
    return req, res
end

function M.entry_id(req: any): string
    return tostring(req:param("id") or "")
end

function M.options(req: any): any
    local options: any = {}
    for _, key in ipairs(QUERY_KEYS) do
        local value = req:query(key)
        if value ~= nil and value ~= "" then options[key] = value end
    end
    local transitive = req:query("transitive")
    if transitive == "1" or transitive == "true" then options.transitive = true end
    return options
end


function M.write(res: any, key: string, value: any, err: any)
    if err then
        local message = tostring(err)
        res:set_status((http_errors.classify(err)))
        res:write_json({ success = false, error = message })
        return
    end
    res:write_json({ success = true, [key] = value })
end

return M

local http = require("http")
local graph = require("graph")

local M = {}

function M.undo()
    local res = http.response()
    local req = http.request()
    if not res then return nil, "no http context" end
    res:set_content_type(http.CONTENT.JSON)
    local saved, err = graph.undo(tostring(req:param("id") or ""))
    if err then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = tostring(err) })
        return
    end
    res:write_json({ success = true, graph = saved })
end

return M

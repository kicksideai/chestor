local http = require("http")
local graph = require("graph")
local materializer = require("materializer")
local thread_access = require("thread_access")

local M = {}

function M.get()
    local res = http.response()
    local req = http.request()
    if not res then return nil, "no http context" end
    res:set_content_type(http.CONTENT.JSON)
    local id = tostring(req:param("id") or "")
    local db, db_err = materializer.open_db()
    if not db then
        res:set_status(http.STATUS.INTERNAL_SERVER_ERROR)
        res:write_json({ success = false, error = tostring(db_err) })
        return
    end
    local allowed, status, access_err = thread_access.gate_thread_access(db, id, thread_access.READ)
    db:release()
    if not allowed then
        res:set_status(status)
        res:write_json({ success = false, error = tostring(access_err) })
        return
    end
    local state, err = graph.state(id)
    if err then
        res:set_status(http.STATUS.INTERNAL_SERVER_ERROR)
        res:write_json({ success = false, error = tostring(err) })
        return
    end
    res:write_json({ success = true, graph = state })
end

return M

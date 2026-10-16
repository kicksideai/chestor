local http = require("http")
local schema_state = require("schema_state")
local support = require("support")
local materializer = require("materializer")
local thread_access = require("thread_access")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
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
    local state, err = schema_state.state(id)
    if err then
        res:set_status(http.STATUS.INTERNAL_SERVER_ERROR)
        res:write_json({ success = false, error = tostring(err) })
        return
    end
    res:write_json({ success = true, schema = state })
end

return { handler = handler }

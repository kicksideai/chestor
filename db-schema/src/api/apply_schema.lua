local http = require("http")
local json = require("json")
local schema_state = require("schema_state")
local materializer = require("materializer")
local thread_access = require("thread_access")
local support = require("support")

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
    local allowed, status, access_err = thread_access.gate_thread_access(db, id, thread_access.WRITE)
    db:release()
    if not allowed then
        res:set_status(status)
        res:write_json({ success = false, error = tostring(access_err) })
        return
    end
    local raw, read_err = req:body()
    if read_err then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = tostring(read_err) })
        return
    end
    local body, decode_err = json.decode(raw or "")
    if decode_err or type(body) ~= "table" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = "invalid json" })
        return
    end
    local saved, err = schema_state.apply(id, body.commands or {})
    if err then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = tostring(err) })
        return
    end
    res:write_json({ success = true, schema = saved })
end

return { handler = handler }

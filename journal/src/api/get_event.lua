local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "event", nil, id_err) end
    local event_id = tostring(req:param("event_id") or "")
    local value, err = queries.event(id, event_id)
    support.write(res, "event", value, err)
end

return { handler = handler }

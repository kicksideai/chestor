local graph = require("graph")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then support.write(res, "graphs", nil, id_err); return end
    local event_id = tostring(req:param("event_id") or "")
    if event_id == "" then support.write(res, "graphs", nil, errors.new({ message = "event id is required", kind = errors.INVALID })); return end
    local value, err = graph.event_graphs(id, event_id)
    support.write(res, "graphs", value, err)
end

return { handler = handler }

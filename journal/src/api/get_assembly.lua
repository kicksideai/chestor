local graph = require("graph")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then support.write(res, "assembly", nil, id_err); return end
    local graph_id = tostring(req:param("graph_id") or "")
    local value, err = graph.assembly_status(id, graph_id)
    support.write(res, "assembly", value, err)
end

return { handler = handler }

local graph = require("graph")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then support.write(res, "window", nil, id_err); return end
    local graph_id = tostring(req:param("graph_id") or "")
    local value, err = graph.query(id, graph_id, {
        mode = req:query("mode"), query = req:query("query"),
        root_id = req:query("root_id"), node_id = req:query("node_id"),
        event_id = req:query("event_id"), target_type = req:query("target_type"),
        target_id = req:query("target_id"), levels = req:query("levels"),
        limit = req:query("limit"), edge_limit = req:query("edge_limit"),
        node_limit = req:query("node_limit"), node_offset = req:query("node_offset"),
        edge_offset = req:query("edge_offset"), offset = req:query("offset"),
        since_revision = req:query("since_revision"),
        node_kind = req:query("node_kind"), status = req:query("status"),
        entity_type = req:query("entity_type"), from_time = req:query("from_time"),
        to_time = req:query("to_time"), validity = req:query("validity"),
    })
    support.write(res, "result", value, err)
end

return { handler = handler }

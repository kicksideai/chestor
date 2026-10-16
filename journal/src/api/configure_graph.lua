local graph = require("graph")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then support.write(res, "result", nil, id_err); return end
    local body, body_err = support.body(req)
    if not body then support.write(res, "result", nil, body_err); return end
    body.graph_id = tostring(req:param("graph_id") or body.graph_id or "")
    local value, err = graph.configure(id, body)
    support.write(res, "result", value, err)
end

return { handler = handler }

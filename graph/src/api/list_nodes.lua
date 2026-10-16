local graph = require("graph")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local value, err = graph.nodes(tostring(req:param("id") or ""), support.options(req))
    support.write(res, "nodes", value, err)
end

return { handler = handler }

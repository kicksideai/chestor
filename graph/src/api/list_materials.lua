local graph = require("graph")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local value, err = graph.materials(tostring(req:param("id") or ""), support.options(req))
    support.write(res, "materials", value, err)
end

return { handler = handler }

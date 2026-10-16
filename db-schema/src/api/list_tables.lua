local schema_state = require("schema_state")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local value, err = schema_state.tables(tostring(req:param("id") or ""), support.options(req))
    support.write(res, "tables", value, err)
end

return { handler = handler }

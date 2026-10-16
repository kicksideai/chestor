local handlers = require("handlers")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    res:write_json({ success = true, breadcrumbs = handlers.breadcrumbs(req:param("id")) })
end

return { handler = handler }

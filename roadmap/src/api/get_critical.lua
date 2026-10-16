local roadmap = require("roadmap")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local value, err = roadmap.critical(support.entry_id(req), req:query("top"))
    support.write(res, "critical", value, err)
end

return { handler = handler }

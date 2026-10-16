local roadmap = require("roadmap")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local value, err = roadmap.undo(support.entry_id(req))
    support.write(res, "roadmap", value, err)
end

return { handler = handler }

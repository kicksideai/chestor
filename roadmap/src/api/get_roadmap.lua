local roadmap = require("roadmap")
local support = require("support")

-- The renderer's whole read: one snapshot serves every lens, because a lens is
-- view state and never changes what is stored.
local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local value, err = roadmap.state(support.entry_id(req))
    support.write(res, "roadmap", value, err)
end

return { handler = handler }

local roadmap = require("roadmap")
local support = require("support")

-- The vocabularies are module constants, but the route names a roadmap and the
-- engine gates on it, so an anonymous caller cannot enumerate the surface.
local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local value, err = roadmap.schema_for(support.entry_id(req))
    support.write(res, "schema", value, err)
end

return { handler = handler }

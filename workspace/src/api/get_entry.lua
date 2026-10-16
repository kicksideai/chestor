local http = require("http")
local handlers = require("handlers")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local entry, err = handlers.get(req:param("id"))
    if err then return support.fail(res, err) end
    if not entry then return support.respond_error(res, http.STATUS.NOT_FOUND, "entry not found") end
    res:write_json({ success = true, entry = entry })
end

return { handler = handler }

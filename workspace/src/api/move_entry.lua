local http = require("http")
local handlers = require("handlers")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local input, body_err = support.body(req)
    if not input then return support.respond_error(res, http.STATUS.BAD_REQUEST, body_err) end
    local entry, err = handlers.move(req:param("id"), input.parent_id)
    if err then return support.fail(res, err) end
    res:write_json({ success = true, entry = entry })
end

return { handler = handler }

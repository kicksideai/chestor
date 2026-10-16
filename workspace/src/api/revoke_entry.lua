local http = require("http")
local handlers = require("handlers")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local input, body_err = support.body(req)
    if not input then return support.respond_error(res, http.STATUS.BAD_REQUEST, body_err) end
    local subject = { subject_id = input.subject_id, subject_type = input.subject_type or "user" }
    local _, err = handlers.revoke_access(req:param("id"), subject)
    if err then return support.fail(res, err) end
    res:write_json({ success = true })
end

return { handler = handler }

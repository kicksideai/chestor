local http = require("http")
local handlers = require("handlers")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local result, err = handlers.delete(req:param("id"))
    if err then return support.fail(res, err) end
    res:set_status(result.in_progress == true and http.STATUS.ACCEPTED or http.STATUS.OK)
    res:write_json({ success = true, deleted = result.deleted == true, in_progress = result.in_progress == true,
        status = result.status, cleanup_pending = result.cleanup_pending, kind = result.kind,
        retryable = result.retryable, details = result.details })
end

return { handler = handler }

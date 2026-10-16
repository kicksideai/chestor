local recall = require("recall")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "events", nil, id_err) end
    local body, body_err = support.body(req)
    if not body then return support.write(res, "events", nil, body_err) end
    local value, err = recall.search(id, tostring(body.query or ""), {
        limit = body.limit,
        offset = body.offset,
        from_time = body.from_time,
        to_time = body.to_time,
        validity = body.validity,
    })
    if err then return support.write(res, "events", nil, err) end
    support.write(res, "events", {
        success = true,
        events = value and value.events or {},
        semantic_available = value and value.semantic_available == true,
        temporal = value and value.temporal or nil,
        validity = value and value.validity or "current",
        offset = value and value.offset or 0,
        limit = value and value.limit or 20,
        has_more = value and value.has_more == true,
    }, nil)
end

return { handler = handler }

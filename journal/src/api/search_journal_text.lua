local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "events", nil, id_err) end
    local body, body_err = support.body(req)
    if not body then return support.write(res, "events", nil, body_err) end
    local value, err = queries.search_text(id, tostring(body.query or ""), {
        limit = body.limit,
        from_time = body.from_time,
        to_time = body.to_time,
        validity = body.validity,
    })
    support.write(res, "events", value, err)
end

return { handler = handler }

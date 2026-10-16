local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "updates", nil, id_err) end
    local value, err = queries.updates(id, {
        after_seq = req:query("after_seq"),
        limit = req:query("limit"),
    })
    support.write(res, "updates", value, err)
end

return { handler = handler }

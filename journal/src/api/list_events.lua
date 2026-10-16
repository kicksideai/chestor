local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "page", nil, id_err) end
    local value, err = queries.events(id, {
        limit = req:query("limit"),
        before_seq = req:query("before_seq"),
    })
    support.write(res, "page", value, err)
end

return { handler = handler }

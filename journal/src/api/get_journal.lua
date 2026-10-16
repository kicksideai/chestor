local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "journal", nil, id_err) end
    local value, err = queries.state(id, support.query_opts(req, queries.STATE_PARAMS))
    support.write(res, "journal", value, err)
end

return { handler = handler }

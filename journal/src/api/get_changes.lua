local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "changes", nil, id_err) end
    local value, err = queries.changes(id, {
        since_seq = req:query("since_seq"),
        since_checkpoint = req:query("since_checkpoint"),
        scope = req:query("scope"),
        task_id = req:query("task_id"),
        limit = req:query("limit"),
    })
    support.write(res, "changes", value, err)
end

return { handler = handler }

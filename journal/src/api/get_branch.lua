local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "branch", nil, id_err) end
    local value, err = queries.branch(id, req:query("task_id"), {
        fact_limit = req:query("fact_limit"),
        lease_id = req:query("lease_id"),
        roots = tostring(req:query("roots") or "") == "1",
    })
    support.write(res, "branch", value, err)
end

return { handler = handler }

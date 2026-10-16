local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "tree", nil, id_err) end
    local value, err = queries.tree(id, req:query("task_id"), req:query("depth"), req:query("limit"))
    support.write(res, "tree", value, err)
end

return { handler = handler }

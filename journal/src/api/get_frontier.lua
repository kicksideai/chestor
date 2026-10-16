local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "frontier", nil, id_err) end
    local value, err = queries.frontier(id, {
        drill = req:query("drill"),
        root_task_id = req:query("task_id"),
        limit = req:query("limit"),
    })
    support.write(res, "frontier", value, err)
end

return { handler = handler }

local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "cursors", nil, id_err) end
    local value, err = queries.cursors(id, {
        limit = req:query("limit"),
        after_updated_at = req:query("after_updated_at"),
        after_cursor_id = req:query("after_cursor_id"),
    })
    support.write(res, "cursors", value, err)
end

return { handler = handler }

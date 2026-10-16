local graph = require("graph")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then support.write(res, "graphs", nil, id_err); return end
    local page, err = graph.catalog(id, {
        query = req:query("query"),
        lifecycle = req:query("lifecycle"),
        limit = req:query("limit"),
        after_rank = req:query("after_rank"),
        after_updated_at = req:query("after_updated_at"),
        after_graph_id = req:query("after_graph_id"),
    })
    if not page then support.write(res, "graphs", nil, err); return end
    support.write(res, "graphs", {
        success = true,
        graphs = (page :: any).items,
        limit = (page :: any).limit,
        has_more = (page :: any).has_more,
        next_cursor = (page :: any).next_cursor,
    }, nil)
end

return { handler = handler }

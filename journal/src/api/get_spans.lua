local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "spans", nil, id_err) end
    local value, err = queries.spans(id, {
        state = req:query("state"),
        agent_id = req:query("agent_id"),
        cursor_id = req:query("cursor_id"),
        task_id = req:query("task_id"),
        since = req:query("since"),
        limit = req:query("limit"),
        after_activity_at = req:query("after_activity_at"),
        after_span_id = req:query("after_span_id"),
    })
    support.write(res, "spans", value, err)
end

return { handler = handler }

local queries = require("queries")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "activity", nil, id_err) end
    local value, err = queries.activity(id, {
        bucket = req:query("bucket"),
        agent_id = req:query("agent_id"),
        since = req:query("since"),
        until_ts = req:query("until"),
        limit = req:query("limit"),
        after_bucket_at = req:query("after_bucket_at"),
        after_agent_id = req:query("after_agent_id"),
    })
    support.write(res, "activity", value, err)
end

return { handler = handler }

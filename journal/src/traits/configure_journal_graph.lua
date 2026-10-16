local graph = require("graph")
local support = require("support")

local function handler(input: any): (any?, error?)
    local journal_id, id_err = support.journal_id(input)
    if not journal_id then return { success = false, error = id_err } end
    local value, err = graph.configure(journal_id, input or {})
    if err then return nil, err end
    return value
end

return { handler = handler }

local context = require("context")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "context_pack", nil, id_err) end
    local value, err = context.pack(id, {
        tail_limit = tonumber(req:query("tail_limit")),
    })
    support.write(res, "context_pack", value, err)
end

return { handler = handler }

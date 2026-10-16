local support = require("support")
local transitions = require("transitions")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "transition", nil, id_err) end
    local body, body_err = support.body(req)
    if not body then return support.write(res, "transition", nil, body_err) end
    local value, err = transitions.apply(id, req:param("task_id"), body)
    support.write(res, "transition", value, err)
end

return { handler = handler }

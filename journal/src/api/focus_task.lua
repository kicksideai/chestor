local commands = require("commands")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "result", nil, id_err) end
    local body, body_err = support.body(req)
    if not body then return support.write(res, "result", nil, body_err) end
    local value, err = commands.focus_task(id, body)
    support.write(res, "result", value, err)
end

return { handler = handler }

local json = require("json")
local roadmap = require("roadmap")
local support = require("support")

-- Whole-batch semantics: the engine refuses the batch on the first invalid
-- command and appends nothing, so a partial write is never observable.
local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local body, decode_err = json.decode(tostring(req:body() or ""))
    if decode_err or type(body) ~= "table" then
        support.write(res, "roadmap", nil, errors.new({ message = "invalid json body", kind = errors.INVALID }))
        return
    end
    local value, err = roadmap.apply(support.entry_id(req), (body :: any).commands)
    support.write(res, "roadmap", value, err)
end

return { handler = handler }

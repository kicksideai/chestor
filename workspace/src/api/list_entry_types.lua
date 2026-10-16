local http = require("http")
local entry_types = require("entry_types")
local support = require("support")

local function handler()
    local _, res = support.context()
    if not res then return nil, "no http context" end
    local types, err = entry_types.list()
    if err then return support.fail(res, err) end
    res:write_json({ success = true, types = types })
end

return { handler = handler }

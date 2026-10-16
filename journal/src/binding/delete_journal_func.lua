local ctx = require("ctx")
local writer = require("writer")

local function handler(): (any?, error?)
    local id = ctx.get("component_id")
    if id and id ~= "" then
        local ok, err = writer.destroy(tostring(id))
        if not ok then return nil, err end
    end
    return { success = true }
end

return { handler = handler }

local ctx = require("ctx")
local schema_state = require("schema_state")

local function handler()
    local id = ctx.get("component_id")
    if id and id ~= "" then
        local ok, err = schema_state.destroy(tostring(id))
        if not ok then return nil, err end
    end
    return { success = true }
end

return { handler = handler }

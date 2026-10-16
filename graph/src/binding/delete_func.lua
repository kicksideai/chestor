local ctx = require("ctx")
local graph = require("graph")

local function delete()
    local id = ctx.get("component_id")
    if id and id ~= "" then
        local ok, err = graph.destroy(tostring(id))
        if not ok then return nil, err end
    end
    return { success = true }
end

return { delete = delete }

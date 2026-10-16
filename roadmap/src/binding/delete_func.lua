local ctx = require("ctx")
local roadmap = require("roadmap")

local function delete(): (any?, any?)
    local id = ctx.get("component_id")
    if id and id ~= "" then
        local ok, err = roadmap.destroy(tostring(id))
        if not ok then return nil, err end
    end
    return { success = true }
end

return { delete = delete }

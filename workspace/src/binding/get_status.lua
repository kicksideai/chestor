local ctx = require("ctx")
local time = require("time")

local function handler()
    local meta = ctx.get("meta") or {}
    local title = meta.title
    local entry_type = meta.type or "entry"
    return {
        description = title and (tostring(entry_type) .. ": " .. tostring(title)) or "workspace entry",
        updated_at = time.now():format(time.RFC3339),
    }
end

return { handler = handler }

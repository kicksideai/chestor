local ctx = require("ctx")
local time = require("time")

local function handler()
    local meta = ctx.get("meta") or {}
    return {
        description = "database: " .. tostring(meta.title or "schema"),
        updated_at = time.now():format(time.RFC3339),
    }
end

return { handler = handler }

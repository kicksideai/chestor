local ctx = require("ctx")
local time = require("time")

local function get_status()
    local meta = ctx.get("meta") or {}
    return {
        description = "roadmap: " .. tostring((meta :: any).title or "plan"),
        updated_at = time.now():format(time.RFC3339),
    }
end

return { get_status = get_status }

local ctx = require("ctx")

local function handler()
    local meta = ctx.get("meta") or {}
    return {
        description = "journal: " .. tostring(meta.title or "agent work"),
        status = tostring(meta.status or "ready"),
        updated_at = tostring(meta.last_event_at or meta.updated_at or ""),
        event_count = tonumber(meta.event_count) or 0,
        open_task_count = tonumber(meta.open_task_count) or 0,
    }
end

return { handler = handler }

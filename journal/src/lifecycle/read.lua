local queries = require("queries")
local context = require("context")

local function handler(input)
    local entry = input and input.entry
    if not entry then return { success = false, error = "entry required" } end
    local entry_id = tostring((entry :: any).id or "")
    if entry_id == "" then return { success = false, error = "entry id required" } end
    local state, err = queries.state(entry_id)
    if err then return nil, err end
    local lines = { "# " .. tostring(entry.name or "Journal"), "Type: agent journal", "" }
    local pack = context.pack(entry_id, { tail_limit = 8 })
    if pack and pack.current_digest then
        lines[#lines + 1] = "## Current Digest"
        lines[#lines + 1] = tostring((pack.current_digest :: any).body or "")
        lines[#lines + 1] = ""
    end
    lines[#lines + 1] = "## Active Tasks"
    for _, task in ipairs((state :: any).tasks or {}) do
        lines[#lines + 1] = "- [" .. tostring((task :: any).status or "open") .. "] " .. tostring((task :: any).title or (task :: any).id)
    end
    lines[#lines + 1] = ""
    lines[#lines + 1] = "## Recent Events"
    for _, ev in ipairs((state :: any).events or {}) do
        lines[#lines + 1] = "- #" .. tostring((ev :: any).seq) .. " " .. tostring((ev :: any).event_type) .. ": " .. tostring((ev :: any).title or (ev :: any).body or "")
    end
    return { success = true, type = "journal", text = table.concat(lines, "\n") }
end

return { handler = handler }

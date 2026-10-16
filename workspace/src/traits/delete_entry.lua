local handlers = require("handlers")

-- DeleteWorkspaceEntry tool: delete an entry and its component-owned thread.
-- Access-checked (ACCESS.DELETE) and refused for pinned entries or subtrees
-- containing a pinned entry; irreversible.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local id = trim(args.id)
    if id == "" then return { success = false, error = "id is required" } end
    local _, err = handlers.delete(id)
    if err then return nil, err end
    return { success = true }
end

return { handle = handle }

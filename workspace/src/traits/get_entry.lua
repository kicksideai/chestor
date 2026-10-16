local handlers = require("handlers")

-- GetWorkspaceEntry tool: one entry by id (access-checked read).
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local id = trim(args.id)
    if id == "" then return { success = false, error = "id is required" } end
    local entry, err = handlers.get(id)
    if err then return nil, err end
    return { success = true, entry = entry }
end

return { handle = handle }

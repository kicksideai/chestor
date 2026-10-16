local handlers = require("handlers")

-- UpdateWorkspaceEntry tool: partial upsert of an entry's render meta
-- (name/icon/status). An empty icon clears the override back to the kind default.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local id = trim(args.id)
    if id == "" then return { success = false, error = "id is required" } end

    local fields = {}
    if args.name ~= nil then fields.name = trim(args.name) end
    if args.icon ~= nil then fields.icon = args.icon end
    if args.status ~= nil then fields.status = trim(args.status) end
    if next(fields) == nil then return { success = false, error = "nothing to update: provide name, icon, or status" } end

    local entry, err = handlers.update(id, fields)
    if err then return nil, err end
    return { success = true, entry = entry }
end

return { handle = handle }

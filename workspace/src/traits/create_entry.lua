local handlers = require("handlers")

-- CreateWorkspaceEntry tool: registers a new workspace entry through the same
-- creatable-gated path as the "+" picker. `type` is the kind class (see
-- ListWorkspaceEntryTypes); omitting parent_id places the entry at the root.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local etype = trim(args.type)
    if etype == "" then return { success = false, error = "type is required (an entry kind class from ListWorkspaceEntryTypes)" } end
    local name = trim(args.name)
    if name == "" then return { success = false, error = "name is required" } end

    local input = { type = etype, name = name }
    if trim(args.parent_id) ~= "" then input.parent_id = trim(args.parent_id) end
    if trim(args.icon) ~= "" then input.icon = trim(args.icon) end
    if type(args.meta) == "table" then input.meta = args.meta end

    local entry, err = handlers.create(input)
    if err then return nil, err end
    return { success = true, entry = entry }
end

return { handle = handle }

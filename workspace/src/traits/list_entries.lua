local handlers = require("handlers")

-- ListWorkspaceEntries tool: access-filtered children of a parent folder, or the
-- workspace root when parent_id is omitted. Pages with limit and an opaque cursor.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local parent = nil
    if trim(args.parent_id) ~= "" then parent = trim(args.parent_id) end
    local limit = args.limit == nil and 25 or args.limit
    if type(limit) ~= "number" or limit % 1 ~= 0 or limit < 1 then
        return { success = false, error = "limit must be a positive integer" }
    end
    local cursor = trim(args.cursor)
    if cursor ~= "" and not cursor:match("^%d+$") then
        return { success = false, error = "invalid cursor" }
    end
    local page, err = handlers.list(parent, { limit = math.min(limit, 100), cursor = cursor })
    if err then return nil, err end
    for _, entry in ipairs(page.entries) do
        entry.owner = entry.meta and entry.meta.owner
        entry.meta = nil
    end
    return { success = true, entries = page.entries, next_cursor = page.next_cursor }
end

return { handle = handle }

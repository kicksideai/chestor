local entry_types = require("entry_types")

-- ListWorkspaceEntryTypes tool: the kinds the workspace can create. Each row's
-- `value` is the class string CreateWorkspaceEntry takes as `type`.
local function handle(args)
    args = type(args) == "table" and args or {}
    local limit = args.limit == nil and 25 or args.limit
    if type(limit) ~= "number" or limit % 1 ~= 0 or limit < 1 then
        return { success = false, error = "limit must be a positive integer" }
    end
    limit = math.min(limit, 100)
    local cursor = args.cursor or "0"
    if type(cursor) ~= "string" or not cursor:match("^%d+$") then
        return { success = false, error = "invalid cursor" }
    end
    local offset = tonumber(cursor)
    if not offset then return { success = false, error = "invalid cursor" } end
    local creatable_only = args.creatable_only ~= false
    local types, err = entry_types.list({ creatable_only = creatable_only })
    if err then return nil, err end
    local rows = {}
    for index = offset + 1, math.min(#types, offset + limit) do
        local row = types[index]
        rows[#rows + 1] = { value = row.value, label = row.label, icon = row.icon,
            creatable = row.creatable, container = row.container }
    end
    return { success = true, types = rows,
        next_cursor = offset + #rows < #types and tostring(offset + #rows) or nil }
end

return { handle = handle }

local graph = require("graph")

-- GetGraph tool: returns a graph workspace entry's current read model (nodes,
-- edges, materials, layout) -- the projection-folded state, access-gated by the
-- entry's component thread under the calling actor.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local entry_id = trim(args.entry_id)
    if entry_id == "" then return { success = false, error = "entry_id is required" } end
    local state, err = graph.state(entry_id)
    if err then return nil, err end
    return { success = true, graph = state }
end

return { handle = handle }

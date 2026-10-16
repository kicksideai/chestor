local roadmap = require("roadmap")

-- GetRoadmap: the entry's current read model. With a lens the response also
-- carries the frame that lens draws, so an agent reasons about the plan the way
-- the person looking at it does.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local entry_id = trim(args.entry_id)
    if entry_id == "" then return { success = false, error = "entry_id is required" } end
    local state, err = roadmap.snapshot(entry_id, {
        lens = trim(args.lens),
        filter = type(args.filter) == "table" and args.filter or nil,
    })
    if err then return nil, err end
    return { success = true, roadmap = state }
end

return { handle = handle }

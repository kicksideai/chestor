local roadmap = require("roadmap")

-- ApplyRoadmap: a batch of typed roadmap COMMANDS. Each command appends a typed
-- event onto the entry's thread (the source of truth); the projection folds them
-- into the read model. The same canonical flow the renderer uses, so an agent
-- edits a roadmap exactly as a person does. The batch is validated whole and
-- appends nothing on the first refusal.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local entry_id = trim(args.entry_id)
    if entry_id == "" then return { success = false, error = "entry_id is required" } end
    local commands = type(args.commands) == "table" and args.commands or nil
    if not commands or #commands == 0 then
        return { success = false, error = "commands must be a non-empty array of { type, body }" }
    end
    local state, err = roadmap.apply(entry_id, commands)
    if err then return nil, err end
    return { success = true, roadmap = state }
end

return { handle = handle }

local schema_state = require("schema_state")

-- EditDatabaseSchema tool: applies a batch of typed schema COMMANDS to a db-schema
-- entry. Each command appends a typed event onto the entry's thread (the source of
-- truth); the projection folds them into the read model. Same canonical flow the
-- renderer uses, so an agent edits a schema exactly as a person does. Returns the
-- resulting read model. Command shape: { type, body } where type is a canonical
-- chestor.db_schema.events:* value validated against the kind's meta.events.
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
    local state, err = schema_state.apply(entry_id, commands)
    if err then return nil, err end
    return { success = true, schema = state }
end

return { handle = handle }

-- Lifecycle: agent-facing read formatter. Folds the entry's thread to the current
-- schema and renders markdown. Receives { entry }.

local schema_state = require("schema_state")

local function handler(input)
    local entry = input and input.entry
    if not entry then return { success = false, error = "entry required" } end
    local schema, err = schema_state.state(entry.id)
    if err then return nil, err end
    local lines = { "# " .. tostring(entry.name), "Type: database schema", "" }
    for _, t in ipairs(schema.tables or {}) do
        lines[#lines + 1] = "## " .. tostring(t.name)
        for _, col in ipairs(t.columns or {}) do
            local flags = {}
            if col.primary_key then flags[#flags + 1] = "PK" end
            if col.unique_col then flags[#flags + 1] = "UQ" end
            local suffix = #flags > 0 and (" [" .. table.concat(flags, ",") .. "]") or ""
            lines[#lines + 1] = "  - " .. tostring(col.name) .. " : " .. tostring(col.col_type or "?") .. suffix
        end
        lines[#lines + 1] = ""
    end
    for _, r in ipairs(schema.relations or {}) do
        lines[#lines + 1] = "- relation: " .. tostring(r.from_table_id) .. " -> " .. tostring(r.to_table_id) .. " (" .. tostring(r.relation_type) .. ")"
    end
    return { success = true, type = "database", text = table.concat(lines, "\n") }
end

return { handler = handler }

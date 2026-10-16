local M = {}

local function exec(db: any, statement: string): string?
    local _, err = db:execute(statement, {})
    if err then return tostring(err) end
    return nil
end

function M.up(db: any, db_type: string?): string?
    if db_type == "postgres" then
        return exec(db, [[
            UPDATE chestor_journal_graphs
               SET parent_graph_id = COALESCE(parent_graph_id,
                       NULLIF(config_json::jsonb #>> '{workspace,parent_graph_id}', '')),
                   anchor_graph_id = COALESCE(anchor_graph_id,
                       NULLIF(config_json::jsonb #>> '{workspace,anchor_graph_id}', '')),
                   anchor_node_id = COALESCE(anchor_node_id,
                       NULLIF(config_json::jsonb #>> '{workspace,anchor_node_id}', ''))
        ]])
    end
    return exec(db, [[
        UPDATE chestor_journal_graphs
           SET parent_graph_id = COALESCE(parent_graph_id,
                   NULLIF(json_extract(config_json, '$.workspace.parent_graph_id'), '')),
               anchor_graph_id = COALESCE(anchor_graph_id,
                   NULLIF(json_extract(config_json, '$.workspace.anchor_graph_id'), '')),
               anchor_node_id = COALESCE(anchor_node_id,
                   NULLIF(json_extract(config_json, '$.workspace.anchor_node_id'), ''))
    ]])
end

function M.down(_db: any, _db_type: string?): string?
    -- Historical JSON remains authoritative for old rows, so a reversible
    -- down migration does not erase values that newer configurations may have
    -- written directly into the indexed columns.
    return nil
end

return M

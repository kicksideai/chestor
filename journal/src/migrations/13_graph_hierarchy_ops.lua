local M = {}

local function exec(db: any, statement: string): string?
    local _, err = db:execute(statement, {})
    if err then return tostring(err) end
    return nil
end

local function add_column(db_type: string?, column: string): string
    if db_type == "postgres" then
        return "ALTER TABLE chestor_journal_graphs ADD COLUMN IF NOT EXISTS " .. column .. " TEXT"
    end
    return "ALTER TABLE chestor_journal_graphs ADD COLUMN " .. column .. " TEXT"
end

local function drop_column(db_type: string?, column: string): string
    if db_type == "postgres" then
        return "ALTER TABLE chestor_journal_graphs DROP COLUMN IF EXISTS " .. column
    end
    return "ALTER TABLE chestor_journal_graphs DROP COLUMN " .. column
end

function M.up(db: any, db_type: string?): string?
    for _, statement in ipairs({
        add_column(db_type, "parent_graph_id"),
        add_column(db_type, "anchor_graph_id"),
        add_column(db_type, "anchor_node_id"),
        "CREATE INDEX IF NOT EXISTS idx_cjournal_graphs_parent ON chestor_journal_graphs(journal_id, parent_graph_id, lifecycle, updated_at)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_graphs_anchor ON chestor_journal_graphs(journal_id, anchor_graph_id, anchor_node_id)",
    }) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    for _, statement in ipairs({
        "DROP INDEX IF EXISTS idx_cjournal_graphs_anchor",
        "DROP INDEX IF EXISTS idx_cjournal_graphs_parent",
        drop_column(db_type, "anchor_node_id"),
        drop_column(db_type, "anchor_graph_id"),
        drop_column(db_type, "parent_graph_id"),
    }) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

return M

local M = {}

local function exec(db: any, sql: string): string?
    local _, err = db:execute(sql, {})
    if err then return tostring(err) end
    return nil
end

local function add_column(db_type: string?, column: string): string
    if db_type == "postgres" then
        return "ALTER TABLE chestor_journal_cursors ADD COLUMN IF NOT EXISTS " .. column .. " TEXT"
    end
    return "ALTER TABLE chestor_journal_cursors ADD COLUMN " .. column .. " TEXT"
end

local function drop_column(db_type: string?, column: string): string
    if db_type == "postgres" then
        return "ALTER TABLE chestor_journal_cursors DROP COLUMN IF EXISTS " .. column
    end
    return "ALTER TABLE chestor_journal_cursors DROP COLUMN " .. column
end

function M.up(db: any, db_type: string?): string?
    for _, statement in ipairs({
        add_column(db_type, "current_graph_id"),
        add_column(db_type, "current_node_id"),
        "CREATE INDEX IF NOT EXISTS idx_cjournal_cursors_address ON chestor_journal_cursors(journal_id, current_graph_id, current_node_id, state)",
    }) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    for _, statement in ipairs({
        "DROP INDEX IF EXISTS idx_cjournal_cursors_address",
        drop_column(db_type, "current_node_id"),
        drop_column(db_type, "current_graph_id"),
    }) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

return M

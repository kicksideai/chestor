local M = {}

local function exec(db: any, statement: string): string?
    local _, err = db:execute(statement, {})
    if err then return tostring(err) end
    return nil
end

local function run(db: any, statements: { string }): string?
    for _, statement in ipairs(statements) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.add_sqlite(db: any): string?
    return run(db, {
        "ALTER TABLE chestor_graph_history ADD COLUMN stack_seq INTEGER NOT NULL DEFAULT 0",
        "UPDATE chestor_graph_history SET stack_seq = rowid",
        "CREATE UNIQUE INDEX idx_cgraph_history_order ON chestor_graph_history(graph_id, stack, stack_seq)",
    })
end

function M.add_postgres(db: any): string?
    return run(db, {
        "ALTER TABLE chestor_graph_history ADD COLUMN stack_seq BIGINT NOT NULL DEFAULT 0",
        [[
            WITH ranked AS (
                SELECT id, ROW_NUMBER() OVER (
                    PARTITION BY graph_id, stack
                    ORDER BY updated_at ASC, created_at ASC, id ASC
                ) AS position
                FROM chestor_graph_history
            )
            UPDATE chestor_graph_history AS history
            SET stack_seq = ranked.position
            FROM ranked
            WHERE history.id = ranked.id
        ]],
        "CREATE UNIQUE INDEX idx_cgraph_history_order ON chestor_graph_history(graph_id, stack, stack_seq)",
    })
end

function M.drop_sqlite(db: any): string?
    return run(db, {
        "DROP INDEX IF EXISTS idx_cgraph_history_order",
        "ALTER TABLE chestor_graph_history DROP COLUMN stack_seq",
    })
end

function M.drop_postgres(db: any): string?
    return run(db, {
        "DROP INDEX IF EXISTS idx_cgraph_history_order",
        "ALTER TABLE chestor_graph_history DROP COLUMN stack_seq",
    })
end

return M

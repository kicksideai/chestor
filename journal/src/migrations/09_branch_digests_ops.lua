local M = {}

local function exec(db: any, sql: string, params: any): string?
    local _, err = db:execute(sql, params or {})
    if err then return tostring(err) end
    return nil
end

local function add_column(db_type: string?, table_name: string, column: string, coltype: string): string
    if db_type == "postgres" then
        return "ALTER TABLE " .. table_name .. " ADD COLUMN IF NOT EXISTS " .. column .. " " .. coltype
    end
    return "ALTER TABLE " .. table_name .. " ADD COLUMN " .. column .. " " .. coltype
end

local function drop_column(db_type: string?, table_name: string, column: string): string
    if db_type == "postgres" then
        return "ALTER TABLE " .. table_name .. " DROP COLUMN IF EXISTS " .. column
    end
    return "ALTER TABLE " .. table_name .. " DROP COLUMN " .. column
end

-- Per-branch digest state (X7): one row per task branch carrying the distilled
-- digest, its provenance, the source seq it folded through, and the generator
-- version. Tasks gain the waiver annotation consumed by T2 so the lens can
-- report receipt_status waived/accepted_risk from the read model.
function M.up(db: any, db_type: string?): string?
    local statements = {
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_branch_digests (
                journal_id TEXT NOT NULL,
                task_id TEXT NOT NULL,
                digest TEXT,
                source_seq INTEGER NOT NULL DEFAULT 0,
                generator_version TEXT,
                computed_at INTEGER,
                stale INTEGER NOT NULL DEFAULT 0,
                provenance_json TEXT,
                PRIMARY KEY (journal_id, task_id)
            )
        ]],
        add_column(db_type, "chestor_journal_tasks", "waiver_kind", "TEXT"),
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    local statements = {
        drop_column(db_type, "chestor_journal_tasks", "waiver_kind"),
        "DROP TABLE IF EXISTS chestor_journal_branch_digests",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

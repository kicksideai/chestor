local M = {}

local function exec(db: any, sql: string, params: any): string?
    local _, err = db:execute(sql, params or {})
    if err then return tostring(err) end
    return nil
end

local function drop_column(db_type: string?, table_name: string, column: string): string
    if db_type == "postgres" then
        return "ALTER TABLE " .. table_name .. " DROP COLUMN IF EXISTS " .. column
    end
    return "ALTER TABLE " .. table_name .. " DROP COLUMN " .. column
end

function M.drop_sessions(db: any, db_type: string?): string?
    local statements = {
        "DROP INDEX IF EXISTS idx_cjournal_events_session",
        "DROP INDEX IF EXISTS idx_cjournal_sessions_status",
        "DROP INDEX IF EXISTS idx_cjournal_artifacts_session",
        "DROP TABLE IF EXISTS chestor_journal_sessions",
        drop_column(db_type, "chestor_journal_events", "session_id"),
        drop_column(db_type, "chestor_journal_tasks", "session_id"),
        drop_column(db_type, "chestor_journal_artifacts", "session_id"),
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.restore_sessions(db: any): string?
    local statements = {
        "ALTER TABLE chestor_journal_events ADD COLUMN session_id TEXT",
        "ALTER TABLE chestor_journal_tasks ADD COLUMN session_id TEXT",
        "ALTER TABLE chestor_journal_artifacts ADD COLUMN session_id TEXT",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_sessions (
                journal_id TEXT NOT NULL,
                id TEXT NOT NULL,
                parent_session_id TEXT,
                task_id TEXT,
                agent_id TEXT,
                actor_id TEXT,
                goal TEXT,
                scope TEXT,
                status TEXT NOT NULL DEFAULT 'active',
                started_seq INTEGER,
                last_event_seq INTEGER,
                latest_checkpoint_seq INTEGER,
                current_digest TEXT,
                digest_updated_at INTEGER,
                lease_expires_at INTEGER,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_session ON chestor_journal_events(journal_id, session_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_sessions_status ON chestor_journal_sessions(journal_id, status)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_artifacts_session ON chestor_journal_artifacts(journal_id, session_id)",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

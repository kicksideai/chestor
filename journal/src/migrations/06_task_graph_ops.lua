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

-- The task graph makes tasks the spine. Every fact (entry/checkpoint/artifact)
-- attaches to a task branch via events.task_id; a task carries a completion
-- result; and task-to-task dependency edges live in their own table, separate
-- from the parent_task_id branch tree (a task has one parent but may depend on
-- many). One journal-scoped state row owns the durable active-task pointer and
-- the current digest read model.
function M.up(db: any, db_type: string?): string?
    local statements = {
        add_column(db_type, "chestor_journal_events", "task_id", "TEXT"),
        add_column(db_type, "chestor_journal_tasks", "result", "TEXT"),
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_task ON chestor_journal_events(journal_id, task_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_tasks_parent ON chestor_journal_tasks(journal_id, parent_task_id)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_state (
                journal_id TEXT PRIMARY KEY,
                active_task_id TEXT,
                digest TEXT,
                digest_updated_at INTEGER,
                updated_at INTEGER NOT NULL
            )
        ]],
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_task_deps (
                journal_id TEXT NOT NULL,
                from_task_id TEXT NOT NULL,
                to_task_id TEXT NOT NULL,
                kind TEXT NOT NULL DEFAULT 'blocks',
                evidence_event_id TEXT,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, from_task_id, to_task_id, kind)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_task_deps_to ON chestor_journal_task_deps(journal_id, to_task_id)",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    local statements = {
        "DROP TABLE IF EXISTS chestor_journal_state",
        "DROP INDEX IF EXISTS idx_cjournal_task_deps_to",
        "DROP TABLE IF EXISTS chestor_journal_task_deps",
        "DROP INDEX IF EXISTS idx_cjournal_tasks_parent",
        "DROP INDEX IF EXISTS idx_cjournal_events_task",
        drop_column(db_type, "chestor_journal_tasks", "result"),
        drop_column(db_type, "chestor_journal_events", "task_id"),
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

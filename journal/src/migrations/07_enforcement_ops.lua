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

-- The enforcement layer stores capability leases with per-task fencing grants,
-- append-only verification receipts, and a command idempotency ledger. Tasks
-- gain a revision counter (bumped on title/contract/policy change), gate and
-- passed flags, the pinned verifier policy hash, and the declared claim.
-- Dependency edges gain tombstone columns so removal is an audited event, never
-- a delete. All additions default so existing journals keep working unchanged.
function M.up(db: any, db_type: string?): string?
    local statements = {
        add_column(db_type, "chestor_journal_tasks", "revision", "INTEGER NOT NULL DEFAULT 1"),
        add_column(db_type, "chestor_journal_tasks", "gate", "INTEGER NOT NULL DEFAULT 0"),
        add_column(db_type, "chestor_journal_tasks", "passed", "INTEGER NOT NULL DEFAULT 0"),
        add_column(db_type, "chestor_journal_tasks", "verifier_policy_hash", "TEXT"),
        add_column(db_type, "chestor_journal_tasks", "claim", "TEXT"),
        add_column(db_type, "chestor_journal_task_deps", "tombstoned", "INTEGER NOT NULL DEFAULT 0"),
        add_column(db_type, "chestor_journal_task_deps", "tombstone_decision_id", "TEXT"),
        add_column(db_type, "chestor_journal_task_deps", "tombstoned_at", "INTEGER"),
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_leases (
                journal_id TEXT NOT NULL,
                lease_id TEXT NOT NULL,
                agent_id TEXT NOT NULL,
                task_id TEXT NOT NULL,
                capability TEXT NOT NULL,
                fencing_token BIGINT NOT NULL,
                issued_at INTEGER NOT NULL,
                ttl_s INTEGER NOT NULL,
                expires_at INTEGER NOT NULL,
                revoked INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY (journal_id, lease_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_leases_task ON chestor_journal_leases(journal_id, task_id, revoked, expires_at)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_task_fencing (
                journal_id TEXT NOT NULL,
                task_id TEXT NOT NULL,
                highest_granted BIGINT NOT NULL DEFAULT 0,
                PRIMARY KEY (journal_id, task_id)
            )
        ]],
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_receipts (
                journal_id TEXT NOT NULL,
                receipt_id TEXT NOT NULL,
                task_id TEXT NOT NULL,
                task_revision INTEGER,
                work_revision INTEGER,
                claim_hash TEXT,
                policy_hash TEXT,
                verifier_type TEXT,
                verifier_version TEXT,
                verdict TEXT,
                result_hash TEXT,
                raw_output_hash TEXT,
                artifact_hash TEXT,
                environment TEXT,
                author TEXT,
                created_at INTEGER NOT NULL,
                stale INTEGER NOT NULL DEFAULT 0,
                stale_reason TEXT,
                PRIMARY KEY (journal_id, receipt_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_receipts_task ON chestor_journal_receipts(journal_id, task_id, stale)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_commands (
                journal_id TEXT NOT NULL,
                command_id TEXT NOT NULL,
                event_id TEXT,
                result_json TEXT,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, command_id)
            )
        ]],
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    local statements = {
        "DROP TABLE IF EXISTS chestor_journal_commands",
        "DROP INDEX IF EXISTS idx_cjournal_receipts_task",
        "DROP TABLE IF EXISTS chestor_journal_receipts",
        "DROP TABLE IF EXISTS chestor_journal_task_fencing",
        "DROP INDEX IF EXISTS idx_cjournal_leases_task",
        "DROP TABLE IF EXISTS chestor_journal_leases",
        drop_column(db_type, "chestor_journal_task_deps", "tombstoned_at"),
        drop_column(db_type, "chestor_journal_task_deps", "tombstone_decision_id"),
        drop_column(db_type, "chestor_journal_task_deps", "tombstoned"),
        drop_column(db_type, "chestor_journal_tasks", "claim"),
        drop_column(db_type, "chestor_journal_tasks", "verifier_policy_hash"),
        drop_column(db_type, "chestor_journal_tasks", "passed"),
        drop_column(db_type, "chestor_journal_tasks", "gate"),
        drop_column(db_type, "chestor_journal_tasks", "revision"),
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

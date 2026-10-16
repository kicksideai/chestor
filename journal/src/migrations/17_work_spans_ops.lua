local M = {}

local function exec(db: any, sql: string): string?
    local _, err = db:execute(sql, {})
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

-- A work span is one episode of an identity's activity: it opens on that
-- identity's first write, every fact it writes carries the span id, and
-- inactivity seals it at its last activity time. The durable cursor stays the
-- identity's single position row; spans are the many episodes that position
-- lived through, so they reference the cursor rather than duplicating it.
-- purpose keeps the caller's raw working_on text alongside the task or graph
-- node it resolved to when it names one.
function M.up(db: any, db_type: string?): string?
    local statements = {
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_spans (
                journal_id TEXT NOT NULL,
                span_id TEXT NOT NULL,
                agent_id TEXT NOT NULL,
                cursor_id TEXT NOT NULL,
                origin TEXT NOT NULL DEFAULT 'auto',
                state TEXT NOT NULL DEFAULT 'open',
                purpose TEXT,
                purpose_kind TEXT NOT NULL DEFAULT 'none',
                purpose_task_id TEXT,
                purpose_graph_id TEXT,
                purpose_node_id TEXT,
                started_seq BIGINT NOT NULL DEFAULT 0,
                last_seq BIGINT NOT NULL DEFAULT 0,
                fact_count BIGINT NOT NULL DEFAULT 0,
                started_at INTEGER NOT NULL,
                last_activity_at INTEGER NOT NULL,
                ended_at INTEGER,
                closed_reason TEXT,
                PRIMARY KEY (journal_id, span_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_spans_activity ON chestor_journal_spans(journal_id, state, last_activity_at, span_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_spans_agent ON chestor_journal_spans(journal_id, agent_id, last_activity_at, span_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_spans_cursor ON chestor_journal_spans(journal_id, cursor_id, state, last_activity_at)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_spans_task ON chestor_journal_spans(journal_id, purpose_task_id, state)",
        add_column(db_type, "chestor_journal_events", "span_id", "TEXT"),
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_span ON chestor_journal_events(journal_id, span_id, seq)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_task_span ON chestor_journal_events(journal_id, task_id, span_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_ts ON chestor_journal_events(journal_id, ts)",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    local statements = {
        "DROP INDEX IF EXISTS idx_cjournal_events_ts",
        "DROP INDEX IF EXISTS idx_cjournal_events_task_span",
        "DROP INDEX IF EXISTS idx_cjournal_events_span",
        drop_column(db_type, "chestor_journal_events", "span_id"),
        "DROP INDEX IF EXISTS idx_cjournal_spans_task",
        "DROP INDEX IF EXISTS idx_cjournal_spans_cursor",
        "DROP INDEX IF EXISTS idx_cjournal_spans_agent",
        "DROP INDEX IF EXISTS idx_cjournal_spans_activity",
        "DROP TABLE IF EXISTS chestor_journal_spans",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

return M

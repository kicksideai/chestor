local M = {}

local function exec(db: any, sql: string, params: any): string?
    local _, err = db:execute(sql, params or {})
    if err then return tostring(err) end
    return nil
end

function M.create_tables(db: any, db_type: string?): string?
    local statements = {
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_events (
                journal_id TEXT NOT NULL,
                id TEXT NOT NULL,
                seq INTEGER NOT NULL,
                ts INTEGER NOT NULL,
                event_type TEXT NOT NULL,
                title TEXT,
                body TEXT,
                actor_id TEXT,
                actor_type TEXT,
                session_id TEXT,
                tags TEXT NOT NULL DEFAULT '[]',
                linked_component_ids TEXT NOT NULL DEFAULT '[]',
                linked_upload_ids TEXT NOT NULL DEFAULT '[]',
                linked_file_paths TEXT NOT NULL DEFAULT '[]',
                linked_task_ids TEXT NOT NULL DEFAULT '[]',
                metadata TEXT NOT NULL DEFAULT '{}',
                supersedes_event_id TEXT,
                embedding_status TEXT NOT NULL DEFAULT 'pending',
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, id),
                UNIQUE (journal_id, seq)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_seq ON chestor_journal_events(journal_id, seq)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_type ON chestor_journal_events(journal_id, event_type)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_session ON chestor_journal_events(journal_id, session_id)",
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
        "CREATE INDEX IF NOT EXISTS idx_cjournal_sessions_status ON chestor_journal_sessions(journal_id, status)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_tasks (
                journal_id TEXT NOT NULL,
                id TEXT NOT NULL,
                parent_task_id TEXT,
                session_id TEXT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL DEFAULT 'open',
                priority TEXT,
                assignee TEXT,
                agent_id TEXT,
                sort_order INTEGER NOT NULL DEFAULT 0,
                metadata TEXT NOT NULL DEFAULT '{}',
                created_event_id TEXT,
                updated_event_id TEXT,
                closed_event_id TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                closed_at INTEGER,
                PRIMARY KEY (journal_id, id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_tasks_status ON chestor_journal_tasks(journal_id, status, sort_order)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_artifacts (
                journal_id TEXT NOT NULL,
                id TEXT NOT NULL,
                event_id TEXT,
                session_id TEXT,
                kind TEXT NOT NULL DEFAULT 'artifact',
                title TEXT,
                summary TEXT,
                component_id TEXT,
                upload_id TEXT,
                file_path TEXT,
                url TEXT,
                mime_type TEXT,
                metadata TEXT NOT NULL DEFAULT '{}',
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_artifacts_session ON chestor_journal_artifacts(journal_id, session_id)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_embeddings (
                journal_id TEXT NOT NULL,
                event_id TEXT NOT NULL,
                embedding TEXT NOT NULL,
                model TEXT NOT NULL,
                dimensions INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, event_id)
            )
        ]],
    }
    if db_type == "sqlite" then
        statements[#statements + 1] = [[
            CREATE VIRTUAL TABLE IF NOT EXISTS chestor_journal_fts USING fts5(
                event_id UNINDEXED,
                journal_id UNINDEXED,
                event_type UNINDEXED,
                title,
                body,
                tags,
                tokenize = 'porter'
            )
        ]]
    else
        statements[#statements + 1] = [[
            CREATE TABLE IF NOT EXISTS chestor_journal_fts (
                event_id TEXT NOT NULL,
                journal_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                title TEXT,
                body TEXT,
                tags TEXT,
                PRIMARY KEY (journal_id, event_id)
            )
        ]]
        statements[#statements + 1] = "CREATE INDEX IF NOT EXISTS idx_cjournal_fts_journal ON chestor_journal_fts(journal_id)"
    end
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.drop_tables(db: any): string?
    local statements = {
        "DROP TABLE IF EXISTS chestor_journal_fts",
        "DROP TABLE IF EXISTS chestor_journal_embeddings",
        "DROP INDEX IF EXISTS idx_cjournal_artifacts_session",
        "DROP TABLE IF EXISTS chestor_journal_artifacts",
        "DROP INDEX IF EXISTS idx_cjournal_tasks_status",
        "DROP TABLE IF EXISTS chestor_journal_tasks",
        "DROP INDEX IF EXISTS idx_cjournal_sessions_status",
        "DROP TABLE IF EXISTS chestor_journal_sessions",
        "DROP INDEX IF EXISTS idx_cjournal_events_session",
        "DROP INDEX IF EXISTS idx_cjournal_events_type",
        "DROP INDEX IF EXISTS idx_cjournal_events_seq",
        "DROP TABLE IF EXISTS chestor_journal_events",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

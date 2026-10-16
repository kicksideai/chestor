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

-- Cursor and episode rows are deterministic projections of cursor.updated
-- events. They intentionally do not replace task mutation leases: a cursor is
-- durable location and consumption state, while a lease is authority.
function M.up(db: any, db_type: string?): string?
    local statements = {
        add_column(db_type, "chestor_journal_events", "cursor_id", "TEXT"),
        add_column(db_type, "chestor_journal_events", "episode_id", "TEXT"),
        add_column(db_type, "chestor_journal_events", "correlation_id", "TEXT"),
        add_column(db_type, "chestor_journal_events", "causation_id", "TEXT"),
        add_column(db_type, "chestor_journal_tasks", "work_kind", "TEXT NOT NULL DEFAULT 'task'"),
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_cursor ON chestor_journal_events(journal_id, cursor_id, seq)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_events_supersedes ON chestor_journal_events(journal_id, supersedes_event_id)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_cursors (
                journal_id TEXT NOT NULL,
                cursor_id TEXT NOT NULL,
                agent_id TEXT NOT NULL,
                parent_cursor_id TEXT,
                current_task_id TEXT,
                state TEXT NOT NULL DEFAULT 'active',
                revision INTEGER NOT NULL DEFAULT 1,
                last_seen_seq BIGINT NOT NULL DEFAULT 0,
                checkpoint_seq BIGINT NOT NULL DEFAULT 0,
                current_episode_id TEXT,
                purpose TEXT,
                assignment TEXT,
                why TEXT,
                close_requirements_json TEXT NOT NULL DEFAULT '[]',
                checkpoint_json TEXT NOT NULL DEFAULT '{}',
                created_event_id TEXT NOT NULL,
                updated_event_id TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, cursor_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_cursors_agent ON chestor_journal_cursors(journal_id, agent_id, state, updated_at)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_cursors_task ON chestor_journal_cursors(journal_id, current_task_id, state)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_episodes (
                journal_id TEXT NOT NULL,
                episode_id TEXT NOT NULL,
                cursor_id TEXT NOT NULL,
                agent_id TEXT NOT NULL,
                state TEXT NOT NULL DEFAULT 'active',
                goal TEXT,
                started_seq BIGINT NOT NULL DEFAULT 0,
                ended_seq BIGINT,
                started_at INTEGER NOT NULL,
                deadline_at INTEGER NOT NULL,
                ended_at INTEGER,
                checkpoint_json TEXT NOT NULL DEFAULT '{}',
                PRIMARY KEY (journal_id, episode_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_episodes_cursor ON chestor_journal_episodes(journal_id, cursor_id, started_at)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_audit_coverage (
                journal_id TEXT NOT NULL,
                audit_task_id TEXT NOT NULL,
                unit_key TEXT NOT NULL,
                status TEXT NOT NULL,
                method TEXT,
                evidence_event_ids_json TEXT NOT NULL DEFAULT '[]',
                cursor_id TEXT,
                episode_id TEXT,
                source_revision TEXT,
                gap_decision_id TEXT,
                recorded_event_id TEXT NOT NULL,
                recorded_seq BIGINT NOT NULL,
                recorded_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, audit_task_id, unit_key)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_audit_status ON chestor_journal_audit_coverage(journal_id, audit_task_id, status)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_integrations (
                journal_id TEXT NOT NULL,
                receipt_id TEXT NOT NULL,
                parent_cursor_id TEXT NOT NULL,
                child_cursor_id TEXT NOT NULL,
                task_id TEXT,
                disposition TEXT NOT NULL,
                source_from_seq BIGINT,
                source_to_seq BIGINT,
                evidence_event_ids_json TEXT NOT NULL DEFAULT '[]',
                coverage_json TEXT NOT NULL DEFAULT '{}',
                unresolved_json TEXT NOT NULL DEFAULT '[]',
                summary TEXT,
                created_event_id TEXT NOT NULL,
                disposition_event_id TEXT,
                recorded_event_id TEXT NOT NULL,
                recorded_seq BIGINT NOT NULL,
                recorded_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, receipt_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_integrations_parent ON chestor_journal_integrations(journal_id, parent_cursor_id, disposition)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_integrations_child ON chestor_journal_integrations(journal_id, child_cursor_id)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_references (
                journal_id TEXT NOT NULL,
                ref_id TEXT NOT NULL,
                uri TEXT NOT NULL,
                ref_kind TEXT NOT NULL DEFAULT 'resource',
                title TEXT,
                version TEXT NOT NULL DEFAULT '',
                content_hash TEXT,
                attrs_json TEXT NOT NULL DEFAULT '{}',
                created_event_id TEXT NOT NULL,
                updated_event_id TEXT NOT NULL,
                created_seq BIGINT NOT NULL,
                updated_seq BIGINT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, ref_id),
                UNIQUE (journal_id, uri, version)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_refs_uri ON chestor_journal_references(journal_id, uri)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_node_refs (
                journal_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                ref_id TEXT NOT NULL,
                relation TEXT NOT NULL,
                state TEXT NOT NULL DEFAULT 'active',
                attrs_json TEXT NOT NULL DEFAULT '{}',
                created_event_id TEXT NOT NULL,
                updated_event_id TEXT NOT NULL,
                removed_event_id TEXT,
                created_seq BIGINT NOT NULL,
                updated_seq BIGINT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, graph_id, node_id, ref_id, relation)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_node_refs_node ON chestor_journal_node_refs(journal_id, graph_id, node_id, state, relation)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_node_refs_ref ON chestor_journal_node_refs(journal_id, ref_id, state)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_embedding_documents (
                journal_id TEXT NOT NULL,
                document_id TEXT NOT NULL,
                source_type TEXT NOT NULL,
                source_id TEXT NOT NULL,
                graph_id TEXT,
                node_id TEXT,
                source_revision BIGINT NOT NULL DEFAULT 0,
                content_hash TEXT NOT NULL,
                chunk_index INTEGER NOT NULL DEFAULT 0,
                content TEXT NOT NULL,
                model TEXT NOT NULL,
                model_version TEXT NOT NULL,
                provider_version TEXT,
                dimensions INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                attempts INTEGER NOT NULL DEFAULT 0,
                next_retry_at INTEGER,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, document_id, model, model_version)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_embed_docs_scope ON chestor_journal_embedding_documents(journal_id, source_type, graph_id, node_id, status)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_embed_docs_source ON chestor_journal_embedding_documents(journal_id, source_type, source_id)",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end

    if db_type == "postgres" then
        local vector_statements = {
            "CREATE EXTENSION IF NOT EXISTS vector",
            [[
                CREATE TABLE IF NOT EXISTS chestor_journal_embedding_vectors (
                    vector_id TEXT NOT NULL,
                    index_key TEXT NOT NULL,
                    journal_id TEXT NOT NULL,
                    document_id TEXT NOT NULL,
                    model TEXT NOT NULL,
                    model_version TEXT NOT NULL,
                    embedding vector(512) NOT NULL,
                    PRIMARY KEY (vector_id),
                    UNIQUE (journal_id, document_id, model, model_version)
                )
            ]],
            "CREATE INDEX IF NOT EXISTS idx_cjournal_embed_vec_scope ON chestor_journal_embedding_vectors(index_key)",
            "CREATE INDEX IF NOT EXISTS idx_cjournal_embed_vec_hnsw ON chestor_journal_embedding_vectors USING hnsw (embedding vector_cosine_ops)",
        }
        for _, statement in ipairs(vector_statements) do
            local err = exec(db, statement, {})
            if err then return err end
        end
    else
        local err = exec(db, [[
            CREATE VIRTUAL TABLE IF NOT EXISTS chestor_journal_embedding_vectors USING vec0(
                vector_id TEXT PRIMARY KEY,
                index_key TEXT PARTITION KEY,
                journal_id TEXT,
                document_id TEXT,
                model TEXT,
                model_version TEXT,
                embedding float[512]
            )
        ]], {})
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    local statements = {
        "DROP TABLE IF EXISTS chestor_journal_embedding_vectors",
        "DROP INDEX IF EXISTS idx_cjournal_embed_docs_source",
        "DROP INDEX IF EXISTS idx_cjournal_embed_docs_scope",
        "DROP TABLE IF EXISTS chestor_journal_embedding_documents",
        "DROP INDEX IF EXISTS idx_cjournal_node_refs_ref",
        "DROP INDEX IF EXISTS idx_cjournal_node_refs_node",
        "DROP TABLE IF EXISTS chestor_journal_node_refs",
        "DROP INDEX IF EXISTS idx_cjournal_refs_uri",
        "DROP TABLE IF EXISTS chestor_journal_references",
        "DROP INDEX IF EXISTS idx_cjournal_integrations_child",
        "DROP INDEX IF EXISTS idx_cjournal_integrations_parent",
        "DROP TABLE IF EXISTS chestor_journal_integrations",
        "DROP INDEX IF EXISTS idx_cjournal_audit_status",
        "DROP TABLE IF EXISTS chestor_journal_audit_coverage",
        "DROP INDEX IF EXISTS idx_cjournal_episodes_cursor",
        "DROP TABLE IF EXISTS chestor_journal_episodes",
        "DROP INDEX IF EXISTS idx_cjournal_cursors_task",
        "DROP INDEX IF EXISTS idx_cjournal_cursors_agent",
        "DROP TABLE IF EXISTS chestor_journal_cursors",
        "DROP INDEX IF EXISTS idx_cjournal_events_supersedes",
        "DROP INDEX IF EXISTS idx_cjournal_events_cursor",
        drop_column(db_type, "chestor_journal_events", "causation_id"),
        drop_column(db_type, "chestor_journal_events", "correlation_id"),
        drop_column(db_type, "chestor_journal_events", "episode_id"),
        drop_column(db_type, "chestor_journal_events", "cursor_id"),
        drop_column(db_type, "chestor_journal_tasks", "work_kind"),
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

local M = {}

local function exec(db: any, statement: string): string?
    local _, err = db:execute(statement, {})
    if err then return tostring(err) end
    return nil
end

function M.create_tables(db: any): string?
    local statements = {
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graphs (
                journal_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                graph_kind TEXT NOT NULL DEFAULT 'automatic',
                lifecycle TEXT NOT NULL DEFAULT 'active',
                config_json TEXT NOT NULL DEFAULT '{}',
                config_revision INTEGER NOT NULL DEFAULT 1,
                graph_revision INTEGER NOT NULL DEFAULT 0,
                node_count INTEGER NOT NULL DEFAULT 0,
                edge_count INTEGER NOT NULL DEFAULT 0,
                last_source_seq INTEGER NOT NULL DEFAULT 0,
                health TEXT NOT NULL DEFAULT 'ready',
                attention_error TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, graph_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_graphs_active ON chestor_journal_graphs(journal_id, lifecycle, updated_at)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_nodes (
                journal_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                id TEXT NOT NULL,
                semantic_key TEXT,
                label TEXT NOT NULL,
                node_kind TEXT NOT NULL DEFAULT 'concept',
                summary TEXT,
                status TEXT,
                ref_id TEXT,
                parent_id TEXT,
                child_count INTEGER NOT NULL DEFAULT 0,
                x REAL,
                y REAL,
                origin TEXT NOT NULL DEFAULT 'projector',
                manual INTEGER NOT NULL DEFAULT 0,
                pinned INTEGER NOT NULL DEFAULT 0,
                locked INTEGER NOT NULL DEFAULT 0,
                metadata TEXT NOT NULL DEFAULT '{}',
                created_revision INTEGER NOT NULL,
                updated_revision INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, graph_id, id),
                UNIQUE (journal_id, graph_id, semantic_key)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gnodes_kind ON chestor_journal_graph_nodes(journal_id, graph_id, node_kind, status)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gnodes_parent ON chestor_journal_graph_nodes(journal_id, graph_id, parent_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gnodes_ref ON chestor_journal_graph_nodes(journal_id, ref_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gnodes_time ON chestor_journal_graph_nodes(journal_id, graph_id, updated_at, id)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_edges (
                journal_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                id TEXT NOT NULL,
                from_node_id TEXT NOT NULL,
                to_node_id TEXT NOT NULL,
                edge_kind TEXT NOT NULL DEFAULT 'related',
                label TEXT,
                origin TEXT NOT NULL DEFAULT 'projector',
                manual INTEGER NOT NULL DEFAULT 0,
                locked INTEGER NOT NULL DEFAULT 0,
                metadata TEXT NOT NULL DEFAULT '{}',
                created_revision INTEGER NOT NULL,
                updated_revision INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, graph_id, id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gedges_from ON chestor_journal_graph_edges(journal_id, graph_id, from_node_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gedges_to ON chestor_journal_graph_edges(journal_id, graph_id, to_node_id)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gedges_time ON chestor_journal_graph_edges(journal_id, graph_id, updated_at, id)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_evidence (
                journal_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                target_type TEXT NOT NULL,
                target_id TEXT NOT NULL,
                event_id TEXT NOT NULL,
                source_seq INTEGER,
                relationship TEXT NOT NULL DEFAULT 'supports',
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, graph_id, target_type, target_id, event_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gevidence_event ON chestor_journal_graph_evidence(journal_id, event_id)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_requests (
                journal_id TEXT NOT NULL,
                request_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                request_kind TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                status TEXT NOT NULL,
                error TEXT,
                graph_revision INTEGER,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, request_id)
            )
        ]],
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_changes (
                journal_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                revision INTEGER NOT NULL,
                operation TEXT NOT NULL,
                target_type TEXT NOT NULL,
                target_id TEXT NOT NULL,
                payload_json TEXT NOT NULL DEFAULT '{}',
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, graph_id, revision, operation, target_type, target_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gchanges_revision ON chestor_journal_graph_changes(journal_id, graph_id, revision)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_jobs (
                journal_id TEXT NOT NULL,
                job_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                source_from_seq INTEGER NOT NULL,
                source_to_seq INTEGER NOT NULL,
                config_revision INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'queued',
                execution_identity TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, job_id),
                UNIQUE (journal_id, graph_id, source_from_seq, source_to_seq, config_revision)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gjobs_pending ON chestor_journal_graph_jobs(journal_id, status, created_at)",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.drop_tables(db: any): string?
    for _, table_name in ipairs({
        "chestor_journal_graph_jobs",
        "chestor_journal_graph_changes",
        "chestor_journal_graph_requests",
        "chestor_journal_graph_evidence",
        "chestor_journal_graph_edges",
        "chestor_journal_graph_nodes",
        "chestor_journal_graphs",
    }) do
        local err = exec(db, "DROP TABLE IF EXISTS " .. table_name)
        if err then return err end
    end
    return nil
end

return M

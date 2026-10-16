local M = {}

local function exec(db: any, sql: string, params: any): string?
    local _, err = db:execute(sql, params or {})
    if err then return tostring(err) end
    return nil
end

function M.create_tables(db: any): string?
    local statements = {
        [[
            CREATE TABLE chestor_graph_nodes (
                graph_id TEXT NOT NULL,
                id TEXT NOT NULL,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                parent_id TEXT,
                properties TEXT NOT NULL DEFAULT '{}',
                tags TEXT NOT NULL DEFAULT '[]',
                status TEXT NOT NULL DEFAULT 'active',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (graph_id, id)
            )
        ]],
        "CREATE INDEX idx_cgraph_nodes_parent ON chestor_graph_nodes(graph_id, parent_id, sort_order)",
        "CREATE INDEX idx_cgraph_nodes_type ON chestor_graph_nodes(graph_id, type)",
        [[
            CREATE TABLE chestor_graph_edges (
                graph_id TEXT NOT NULL,
                id TEXT NOT NULL,
                type TEXT NOT NULL,
                source_id TEXT NOT NULL,
                target_id TEXT NOT NULL,
                label TEXT,
                properties TEXT NOT NULL DEFAULT '{}',
                status TEXT NOT NULL DEFAULT 'active',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (graph_id, id)
            )
        ]],
        "CREATE INDEX idx_cgraph_edges_source ON chestor_graph_edges(graph_id, source_id)",
        "CREATE INDEX idx_cgraph_edges_target ON chestor_graph_edges(graph_id, target_id)",
        [[
            CREATE TABLE chestor_graph_materials (
                graph_id TEXT NOT NULL,
                id TEXT NOT NULL,
                target_type TEXT NOT NULL,
                target_id TEXT NOT NULL DEFAULT '',
                kind TEXT NOT NULL,
                title TEXT,
                summary TEXT,
                source TEXT NOT NULL DEFAULT '{}',
                source_type TEXT,
                source_component_id TEXT,
                source_upload_id TEXT,
                source_url TEXT,
                meta TEXT NOT NULL DEFAULT '{}',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (graph_id, id)
            )
        ]],
        "CREATE INDEX idx_cgraph_materials_target ON chestor_graph_materials(graph_id, target_type, target_id, sort_order)",
        "CREATE INDEX idx_cgraph_materials_kind ON chestor_graph_materials(graph_id, kind)",
        "CREATE INDEX idx_cgraph_materials_source_component ON chestor_graph_materials(graph_id, source_component_id)",
        "CREATE INDEX idx_cgraph_materials_source_upload ON chestor_graph_materials(graph_id, source_upload_id)",
        "CREATE INDEX idx_cgraph_materials_source_type ON chestor_graph_materials(graph_id, source_type)",
        [[
            CREATE TABLE chestor_graph_types (
                graph_id TEXT NOT NULL,
                kind TEXT NOT NULL,
                id TEXT NOT NULL,
                title TEXT NOT NULL,
                definition TEXT NOT NULL DEFAULT '{}',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (graph_id, kind, id)
            )
        ]],
        "CREATE INDEX idx_cgraph_types_kind ON chestor_graph_types(graph_id, kind, title)",
        [[
            CREATE TABLE chestor_graph_layout (
                graph_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                x REAL,
                y REAL,
                width REAL,
                height REAL,
                pinned INTEGER NOT NULL DEFAULT 0,
                meta TEXT NOT NULL DEFAULT '{}',
                PRIMARY KEY (graph_id, node_id)
            )
        ]],
        [[
            CREATE TABLE chestor_graph_settings (
                graph_id TEXT PRIMARY KEY,
                settings TEXT NOT NULL DEFAULT '{}',
                updated_at INTEGER NOT NULL
            )
        ]],
        [[
            CREATE TABLE chestor_graph_history (
                id TEXT PRIMARY KEY,
                graph_id TEXT NOT NULL,
                stack TEXT NOT NULL,
                forward_events TEXT NOT NULL,
                inverse_events TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )
        ]],
        "CREATE INDEX idx_cgraph_history_stack ON chestor_graph_history(graph_id, stack, updated_at)",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.drop_tables(db: any): string?
    local statements = {
        "DROP INDEX IF EXISTS idx_cgraph_history_stack",
        "DROP TABLE IF EXISTS chestor_graph_history",
        "DROP TABLE IF EXISTS chestor_graph_settings",
        "DROP TABLE IF EXISTS chestor_graph_layout",
        "DROP INDEX IF EXISTS idx_cgraph_types_kind",
        "DROP TABLE IF EXISTS chestor_graph_types",
        "DROP INDEX IF EXISTS idx_cgraph_materials_source_type",
        "DROP INDEX IF EXISTS idx_cgraph_materials_source_upload",
        "DROP INDEX IF EXISTS idx_cgraph_materials_source_component",
        "DROP INDEX IF EXISTS idx_cgraph_materials_kind",
        "DROP INDEX IF EXISTS idx_cgraph_materials_target",
        "DROP TABLE IF EXISTS chestor_graph_materials",
        "DROP INDEX IF EXISTS idx_cgraph_edges_target",
        "DROP INDEX IF EXISTS idx_cgraph_edges_source",
        "DROP TABLE IF EXISTS chestor_graph_edges",
        "DROP INDEX IF EXISTS idx_cgraph_nodes_type",
        "DROP INDEX IF EXISTS idx_cgraph_nodes_parent",
        "DROP TABLE IF EXISTS chestor_graph_nodes",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

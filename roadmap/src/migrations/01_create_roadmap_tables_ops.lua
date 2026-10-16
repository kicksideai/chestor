local M = {}

local function exec(db: any, sql: string, params: any): string?
    local _, err = db:execute(sql, params or {})
    if err then return tostring(err) end
    return nil
end

local function run(db: any, statements: { string }): string?
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.create_tables(db: any): string?
    return run(db, {
        [[
            CREATE TABLE chestor_roadmap_layers (
                roadmap_id TEXT NOT NULL,
                id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                color TEXT NOT NULL DEFAULT '',
                icon TEXT NOT NULL DEFAULT '',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (roadmap_id, id)
            )
        ]],
        "CREATE INDEX idx_croadmap_layers_order ON chestor_roadmap_layers(roadmap_id, sort_order)",
        [[
            CREATE TABLE chestor_roadmap_outcomes (
                roadmap_id TEXT NOT NULL,
                id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (roadmap_id, id)
            )
        ]],
        "CREATE INDEX idx_croadmap_outcomes_order ON chestor_roadmap_outcomes(roadmap_id, sort_order)",
        [[
            CREATE TABLE chestor_roadmap_initiatives (
                roadmap_id TEXT NOT NULL,
                id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                layer_id TEXT NOT NULL DEFAULT '',
                outcome_id TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'planned',
                confidence TEXT NOT NULL DEFAULT 'med',
                size TEXT NOT NULL DEFAULT 'M',
                start_period TEXT NOT NULL DEFAULT '',
                span INTEGER NOT NULL DEFAULT 1,
                progress REAL NOT NULL DEFAULT 0,
                owner TEXT NOT NULL DEFAULT '',
                tags TEXT NOT NULL DEFAULT '[]',
                properties TEXT NOT NULL DEFAULT '{}',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (roadmap_id, id)
            )
        ]],
        "CREATE INDEX idx_croadmap_initiatives_layer ON chestor_roadmap_initiatives(roadmap_id, layer_id, sort_order)",
        "CREATE INDEX idx_croadmap_initiatives_outcome ON chestor_roadmap_initiatives(roadmap_id, outcome_id)",
        "CREATE INDEX idx_croadmap_initiatives_status ON chestor_roadmap_initiatives(roadmap_id, status)",
        "CREATE INDEX idx_croadmap_initiatives_period ON chestor_roadmap_initiatives(roadmap_id, start_period)",
        [[
            CREATE TABLE chestor_roadmap_dependencies (
                roadmap_id TEXT NOT NULL,
                id TEXT NOT NULL,
                from_id TEXT NOT NULL,
                to_id TEXT NOT NULL,
                kind TEXT NOT NULL DEFAULT 'requires',
                note TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                PRIMARY KEY (roadmap_id, id)
            )
        ]],
        "CREATE INDEX idx_croadmap_dependencies_from ON chestor_roadmap_dependencies(roadmap_id, from_id)",
        "CREATE INDEX idx_croadmap_dependencies_to ON chestor_roadmap_dependencies(roadmap_id, to_id)",
        [[
            CREATE TABLE chestor_roadmap_milestones (
                roadmap_id TEXT NOT NULL,
                id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                period TEXT NOT NULL DEFAULT '',
                layer_id TEXT NOT NULL DEFAULT '',
                initiative_ids TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (roadmap_id, id)
            )
        ]],
        "CREATE INDEX idx_croadmap_milestones_period ON chestor_roadmap_milestones(roadmap_id, period)",
        [[
            CREATE TABLE chestor_roadmap_settings (
                roadmap_id TEXT PRIMARY KEY,
                period_kind TEXT NOT NULL DEFAULT 'quarter',
                origin TEXT NOT NULL DEFAULT '',
                columns INTEGER NOT NULL DEFAULT 5,
                default_lens TEXT NOT NULL DEFAULT 'timeline',
                lens_state TEXT NOT NULL DEFAULT '{}',
                updated_at TEXT NOT NULL
            )
        ]],
        [[
            CREATE TABLE chestor_roadmap_history (
                id TEXT PRIMARY KEY,
                roadmap_id TEXT NOT NULL,
                stack TEXT NOT NULL,
                stack_seq INTEGER NOT NULL DEFAULT 0,
                forward_events TEXT NOT NULL,
                inverse_events TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        ]],
        "CREATE INDEX idx_croadmap_history_stack ON chestor_roadmap_history(roadmap_id, stack, updated_at)",
        "CREATE UNIQUE INDEX idx_croadmap_history_order ON chestor_roadmap_history(roadmap_id, stack, stack_seq)",
    })
end

function M.drop_tables(db: any): string?
    return run(db, {
        "DROP INDEX IF EXISTS idx_croadmap_history_order",
        "DROP INDEX IF EXISTS idx_croadmap_history_stack",
        "DROP TABLE IF EXISTS chestor_roadmap_history",
        "DROP TABLE IF EXISTS chestor_roadmap_settings",
        "DROP INDEX IF EXISTS idx_croadmap_milestones_period",
        "DROP TABLE IF EXISTS chestor_roadmap_milestones",
        "DROP INDEX IF EXISTS idx_croadmap_dependencies_to",
        "DROP INDEX IF EXISTS idx_croadmap_dependencies_from",
        "DROP TABLE IF EXISTS chestor_roadmap_dependencies",
        "DROP INDEX IF EXISTS idx_croadmap_initiatives_period",
        "DROP INDEX IF EXISTS idx_croadmap_initiatives_status",
        "DROP INDEX IF EXISTS idx_croadmap_initiatives_outcome",
        "DROP INDEX IF EXISTS idx_croadmap_initiatives_layer",
        "DROP TABLE IF EXISTS chestor_roadmap_initiatives",
        "DROP INDEX IF EXISTS idx_croadmap_outcomes_order",
        "DROP TABLE IF EXISTS chestor_roadmap_outcomes",
        "DROP INDEX IF EXISTS idx_croadmap_layers_order",
        "DROP TABLE IF EXISTS chestor_roadmap_layers",
    })
end

return M

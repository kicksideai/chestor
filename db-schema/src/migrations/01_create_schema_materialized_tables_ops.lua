local M = {}

local function exec(db: any, sql: string, params: any): string?
    local _, err = db:execute(sql, params or {})
    if err then return tostring(err) end
    return nil
end

function M.create_tables(db: any): string?
    local statements = {
        [[
            CREATE TABLE chestor_schema_tables (
                schema_id TEXT NOT NULL,
                id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                properties TEXT NOT NULL DEFAULT '{}',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (schema_id, id)
            )
        ]],
        "CREATE INDEX idx_cschema_tables_order ON chestor_schema_tables(schema_id, sort_order)",
        [[
            CREATE TABLE chestor_schema_columns (
                schema_id TEXT NOT NULL,
                id TEXT NOT NULL,
                table_id TEXT NOT NULL,
                name TEXT NOT NULL,
                col_type TEXT NOT NULL,
                nullable INTEGER NOT NULL DEFAULT 0,
                primary_key INTEGER NOT NULL DEFAULT 0,
                unique_col INTEGER NOT NULL DEFAULT 0,
                default_value TEXT,
                description TEXT,
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (schema_id, id)
            )
        ]],
        "CREATE INDEX idx_cschema_columns_table ON chestor_schema_columns(schema_id, table_id, sort_order)",
        [[
            CREATE TABLE chestor_schema_relations (
                schema_id TEXT NOT NULL,
                id TEXT NOT NULL,
                name TEXT,
                from_table_id TEXT NOT NULL,
                from_column_id TEXT,
                to_table_id TEXT NOT NULL,
                to_column_id TEXT,
                relation_type TEXT NOT NULL,
                on_delete TEXT NOT NULL DEFAULT 'no_action',
                on_update TEXT NOT NULL DEFAULT 'no_action',
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (schema_id, id)
            )
        ]],
        "CREATE INDEX idx_cschema_relations_from ON chestor_schema_relations(schema_id, from_table_id)",
        "CREATE INDEX idx_cschema_relations_to ON chestor_schema_relations(schema_id, to_table_id)",
        [[
            CREATE TABLE chestor_schema_indexes (
                schema_id TEXT NOT NULL,
                id TEXT NOT NULL,
                table_id TEXT NOT NULL,
                name TEXT NOT NULL,
                columns TEXT NOT NULL DEFAULT '[]',
                unique_idx INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (schema_id, id)
            )
        ]],
        "CREATE INDEX idx_cschema_indexes_table ON chestor_schema_indexes(schema_id, table_id)",
        [[
            CREATE TABLE chestor_schema_layout (
                schema_id TEXT NOT NULL,
                table_id TEXT NOT NULL,
                x REAL,
                y REAL,
                width REAL,
                height REAL,
                meta TEXT NOT NULL DEFAULT '{}',
                PRIMARY KEY (schema_id, table_id)
            )
        ]],
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.drop_tables(db: any): string?
    local statements = {
        "DROP TABLE IF EXISTS chestor_schema_layout",
        "DROP INDEX IF EXISTS idx_cschema_indexes_table",
        "DROP TABLE IF EXISTS chestor_schema_indexes",
        "DROP INDEX IF EXISTS idx_cschema_relations_to",
        "DROP INDEX IF EXISTS idx_cschema_relations_from",
        "DROP TABLE IF EXISTS chestor_schema_relations",
        "DROP INDEX IF EXISTS idx_cschema_columns_table",
        "DROP TABLE IF EXISTS chestor_schema_columns",
        "DROP INDEX IF EXISTS idx_cschema_tables_order",
        "DROP TABLE IF EXISTS chestor_schema_tables",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

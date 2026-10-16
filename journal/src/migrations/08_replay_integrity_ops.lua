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

-- Canonical replay scope columns (F5) and projection health state (X12/X7):
-- events carry the canonical payload hash so corrupted fact payloads fail
-- replay equality, tasks record the fold outcome tombstone badge (F4), and the
-- journal state row tracks digest provenance plus the projection input hash
-- the read model was last folded with.
function M.up(db: any, db_type: string?): string?
    local statements = {
        add_column(db_type, "chestor_journal_events", "payload_sha256", "TEXT"),
        add_column(db_type, "chestor_journal_tasks", "folded_outcome", "TEXT"),
        add_column(db_type, "chestor_journal_state", "digest_source_seq", "INTEGER"),
        add_column(db_type, "chestor_journal_state", "projection_input_hash", "TEXT"),
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    local statements = {
        drop_column(db_type, "chestor_journal_state", "projection_input_hash"),
        drop_column(db_type, "chestor_journal_state", "digest_source_seq"),
        drop_column(db_type, "chestor_journal_tasks", "folded_outcome"),
        drop_column(db_type, "chestor_journal_events", "payload_sha256"),
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement, {})
        if err then return err end
    end
    return nil
end

return M

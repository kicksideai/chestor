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

-- revision is the revision the projection has folded; claimed_revision is the
-- revision a command has handed out and appended an event for. The two differ
-- only while that event is in flight to the asynchronous fold, and the gap is
-- exactly where two commands holding the same expected_revision used to both
-- answer success. Claiming is a guarded UPDATE against the greater of the two,
-- so the database decides the winner at the moment the command runs rather
-- than the projector discovering it much later.
function M.up(db: any, db_type: string?): string?
    local statements = {
        add_column(db_type, "chestor_journal_cursors", "claimed_revision", "INTEGER NOT NULL DEFAULT 0"),
        "UPDATE chestor_journal_cursors SET claimed_revision = revision WHERE claimed_revision < revision",
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    return exec(db, drop_column(db_type, "chestor_journal_cursors", "claimed_revision"))
end

return M

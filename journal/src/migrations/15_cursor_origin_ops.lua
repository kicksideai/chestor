local M = {}

local function exec(db: any, sql: string): string?
    local _, err = db:execute(sql, {})
    if err then return tostring(err) end
    return nil
end

-- origin records how a cursor came to exist: 'explicit' for one an agent
-- opened through the cursor protocol, 'auto' for one the journal allocated the
-- first time an identified agent recorded or read without a handle.
function M.up(db: any, db_type: string?): string?
    local statement
    if db_type == "postgres" then
        statement = "ALTER TABLE chestor_journal_cursors ADD COLUMN IF NOT EXISTS origin TEXT NOT NULL DEFAULT 'explicit'"
    else
        statement = "ALTER TABLE chestor_journal_cursors ADD COLUMN origin TEXT NOT NULL DEFAULT 'explicit'"
    end
    return exec(db, statement)
end

function M.down(db: any, db_type: string?): string?
    if db_type == "postgres" then
        return exec(db, "ALTER TABLE chestor_journal_cursors DROP COLUMN IF EXISTS origin")
    end
    return exec(db, "ALTER TABLE chestor_journal_cursors DROP COLUMN origin")
end

return M

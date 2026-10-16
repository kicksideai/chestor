local M = {}

local function exec(db: any, sql: string): string?
    local _, err = db:execute(sql, {})
    if err then return tostring(err) end
    return nil
end

function M.up(db: any, db_type: string?): string?
    local statement
    if db_type == "postgres" then
        statement = "ALTER TABLE chestor_journal_cursors ADD COLUMN IF NOT EXISTS context_refs_json TEXT NOT NULL DEFAULT '[]'"
    else
        statement = "ALTER TABLE chestor_journal_cursors ADD COLUMN context_refs_json TEXT NOT NULL DEFAULT '[]'"
    end
    return exec(db, statement)
end

function M.down(db: any, db_type: string?): string?
    if db_type == "postgres" then
        return exec(db, "ALTER TABLE chestor_journal_cursors DROP COLUMN IF EXISTS context_refs_json")
    end
    return exec(db, "ALTER TABLE chestor_journal_cursors DROP COLUMN context_refs_json")
end

return M

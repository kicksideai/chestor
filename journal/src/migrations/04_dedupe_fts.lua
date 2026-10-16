local migration_module = require("migration")

local function dedupe(db: any)
    local _, err = db:execute([[
        DELETE FROM chestor_journal_fts
         WHERE rowid NOT IN (
            SELECT MAX(rowid)
              FROM chestor_journal_fts
             GROUP BY journal_id, event_id
         )
    ]], {})
    if err then error(tostring(err)) end
end

return migration_module.define(function()
    migration("Deduplicate Chestor journal FTS rows", function()
        database("sqlite", function()
            up(dedupe)
            down(function(_db) end)
        end)
        database("postgres", function()
            up(function(_db) end)
            down(function(_db) end)
        end)
    end)
end)

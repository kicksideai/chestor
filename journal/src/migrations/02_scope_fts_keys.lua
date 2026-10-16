local migration_module = require("migration")

local function execute(db: any, statement: string)
    local _, exec_err = db:execute(statement, {})
    if exec_err then error(tostring(exec_err)) end
end

return migration_module.define(function()
    migration("Scope Chestor journal FTS keys by journal", function()
        database("postgres", function()
            up(function(db)
                execute(db, "ALTER TABLE chestor_journal_fts DROP CONSTRAINT IF EXISTS chestor_journal_fts_pkey")
                execute(db, "ALTER TABLE chestor_journal_fts ADD PRIMARY KEY (journal_id, event_id)")
            end)
            down(function(db)
                execute(db, "ALTER TABLE chestor_journal_fts DROP CONSTRAINT IF EXISTS chestor_journal_fts_pkey")
                execute(db, "ALTER TABLE chestor_journal_fts ADD PRIMARY KEY (event_id)")
            end)
        end)

        database("sqlite", function()
            up(function(_db) end)
            down(function(_db) end)
        end)
    end)
end)

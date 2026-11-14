-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
return require("migration").define(function()
    migration("Index active workspace checks, admission budgets and queued expiry", function()
        for _, engine in ipairs({"sqlite", "postgres"}) do
            database(engine, function()
                up(function(db: sql.DB)
                    for _, statement in ipairs({
                        "CREATE INDEX IF NOT EXISTS chestor_autocode_runs_workspace_active ON chestor_autocode_runs (workspace_id) WHERE status IN ('queued', 'running')",
                        "CREATE INDEX IF NOT EXISTS chestor_autocode_runs_pending ON chestor_autocode_runs (owner_id) WHERE status IN ('queued', 'running')",
                        "CREATE INDEX IF NOT EXISTS chestor_autocode_runs_queued ON chestor_autocode_runs (created_at, id) WHERE status = 'queued' AND started_at = ''",
                    }) do
                        local _, err = db:execute(statement)
                        if err then error(err) end
                    end
                end)
                down(function(db: sql.DB)
                    for _, name in ipairs({"workspace_active", "pending", "queued"}) do
                        local _, err = db:execute("DROP INDEX IF EXISTS chestor_autocode_runs_" .. name)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)

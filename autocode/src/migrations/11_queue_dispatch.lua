-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
return require("migration").define(function()
    migration("Fence queued expiry against container creation", function()
        for _, engine in ipairs({"sqlite", "postgres"}) do
            database(engine, function()
                up(function(db: sql.DB)
                    for _, statement in ipairs({
                        "ALTER TABLE chestor_autocode_runs ADD COLUMN dispatch_state TEXT NOT NULL DEFAULT 'waiting'",
                        -- Released active rows cannot prove absence of a container.
                        "UPDATE chestor_autocode_runs SET dispatch_state = 'creating' WHERE status IN ('queued', 'running')",
                        "DROP INDEX IF EXISTS chestor_autocode_runs_queued",
                        [[CREATE INDEX chestor_autocode_runs_queued ON chestor_autocode_runs (created_at, id)
                            WHERE status = 'queued' AND dispatch_state IN ('waiting', 'expiring') AND pending_status = '']],
                    }) do
                        local _, err = db:execute(statement)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)

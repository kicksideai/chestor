-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")

local function apply(db: sql.DB)
    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS chestor_autocode_runs_retention
        ON chestor_autocode_runs (finished_at, id)
        WHERE finished_at > '' AND (flow_dataflow_id = '' OR workflow_delivered = 1)]])
    if err then error(errors.wrap(err, "autocode retention index")) end
end

local function remove(db: sql.DB)
    local _, err = db:execute("DROP INDEX IF EXISTS chestor_autocode_runs_retention")
    if err then error(errors.wrap(err, "autocode retention index removal")) end
end

return require("migration").define(function()
    migration("Index settled autocode run retention pages", function()
        database("postgres", function() up(apply); down(remove) end)
        database("sqlite", function() up(apply); down(remove) end)
    end)
end)

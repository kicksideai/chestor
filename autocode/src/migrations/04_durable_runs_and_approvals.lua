-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")

local function apply(db: sql.DB)
    for _, statement in ipairs({
        "ALTER TABLE chestor_autocode_runs ADD COLUMN account_pinned INTEGER NOT NULL DEFAULT 1",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN repo_ref TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN input TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN pending_status TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN job_id TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN approved_recipe TEXT NOT NULL DEFAULT '{}'",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN approved_agents TEXT NOT NULL DEFAULT '[]'",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN job_id TEXT NOT NULL DEFAULT ''",
        "CREATE INDEX chestor_autocode_submissions_run ON chestor_autocode_submissions (run_id)",
    }) do
        local _, err = db:execute(statement)
        if err then error(errors.wrap(err, "autocode durable runs migration")) end
    end
end

local function revert(db: sql.DB)
    for _, statement in ipairs({
        "DROP INDEX chestor_autocode_submissions_run",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN job_id",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN approved_agents",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN approved_recipe",
        "ALTER TABLE chestor_autocode_runs DROP COLUMN job_id",
        "ALTER TABLE chestor_autocode_runs DROP COLUMN pending_status",
        "ALTER TABLE chestor_autocode_runs DROP COLUMN input",
        "ALTER TABLE chestor_autocode_runs DROP COLUMN repo_ref",
        "ALTER TABLE chestor_autocode_runs DROP COLUMN account_pinned",
    }) do
        local _, err = db:execute(statement)
        if err then error(errors.wrap(err, "autocode durable runs rollback")) end
    end
end

return require("migration").define(function()
    migration("Store durable run jobs and approved image generations", function()
        database("postgres", function() up(apply); down(revert) end)
        database("sqlite", function() up(apply); down(revert) end)
    end)
end)

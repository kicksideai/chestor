-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local function apply(db: sql.DB)
    for _, statement in ipairs({
        "ALTER TABLE chestor_autocode_runs ADD COLUMN workflow_delivered INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE chestor_autocode_account_state ADD COLUMN reservation_order INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE chestor_autocode_account_state ADD COLUMN settled_at TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN build_id TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN status TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN agents TEXT NOT NULL DEFAULT '[]'",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN projected INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE chestor_autocode_image_builds ADD COLUMN last_error TEXT NOT NULL DEFAULT ''",
        "UPDATE chestor_autocode_image_builds SET projected = 1 WHERE finished_at <> ''",
        [[CREATE TABLE chestor_autocode_submissions (
            owner_id TEXT NOT NULL, key TEXT NOT NULL, canonical TEXT NOT NULL, run_id TEXT NOT NULL,
            PRIMARY KEY (owner_id, key))]],
        "CREATE TABLE chestor_autocode_admission_lock (id INTEGER PRIMARY KEY, generation INTEGER NOT NULL)",
        "INSERT INTO chestor_autocode_admission_lock (id, generation) VALUES (1, 0)",
    }) do
        local _, err = db:execute(statement)
        if err then error("autocode migration: " .. tostring(err)) end
    end
end
local function revert(db: sql.DB)
    for _, statement in ipairs({
        "DROP TABLE chestor_autocode_admission_lock",
        "DROP TABLE chestor_autocode_submissions",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN last_error",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN projected",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN agents",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN status",
        "ALTER TABLE chestor_autocode_image_builds DROP COLUMN build_id",
        "ALTER TABLE chestor_autocode_account_state DROP COLUMN settled_at",
        "ALTER TABLE chestor_autocode_account_state DROP COLUMN reservation_order",
        "ALTER TABLE chestor_autocode_runs DROP COLUMN workflow_delivered",
    }) do
        local _, err = db:execute(statement)
        if err then error("autocode rollback: " .. tostring(err)) end
    end
end
return require("migration").define(function()
    migration("Fence builds and retain undelivered workflow results", function()
        database("postgres", function() up(apply); down(revert) end)
        database("sqlite", function() up(apply); down(revert) end)
    end)
end)

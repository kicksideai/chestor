-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local function apply(db: sql.DB, postgres: boolean)
    local bytes = postgres and "OCTET_LENGTH(kind) + OCTET_LENGTH(text)" or "LENGTH(CAST(kind AS BLOB)) + LENGTH(CAST(text AS BLOB))"
    for _, statement in ipairs({
        "ALTER TABLE chestor_autocode_runs ADD COLUMN event_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN event_bytes BIGINT NOT NULL DEFAULT 0",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN event_notice_seq INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE chestor_autocode_admission_lock ADD COLUMN retention_finished_at TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE chestor_autocode_admission_lock ADD COLUMN retention_id TEXT NOT NULL DEFAULT ''",
        [[UPDATE chestor_autocode_runs SET event_count = (SELECT COUNT(*) FROM chestor_autocode_run_events WHERE run_id = chestor_autocode_runs.id),
            event_bytes = COALESCE((SELECT SUM(]] .. bytes .. [[) FROM chestor_autocode_run_events WHERE run_id = chestor_autocode_runs.id), 0)]],
        "DROP INDEX IF EXISTS chestor_autocode_runs_retention",
        [[CREATE INDEX chestor_autocode_runs_retention ON chestor_autocode_runs (finished_at, id)
            WHERE finished_at > '' AND (flow_dataflow_id = '' OR workflow_delivered IN (1, 2))]],
    }) do
        local _, err = db:execute(statement)
        if err then error(err) end
    end
end
return require("migration").define(function()
    migration("Bound run event accounting and advance retention fairly", function()
        database("postgres", function() up(function(db: sql.DB) apply(db, true) end) end)
        database("sqlite", function() up(function(db: sql.DB) apply(db, false) end) end)
    end)
end)

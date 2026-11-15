-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
-- Module-owned rows beside the account, image and workspace components: the
-- balancing state of each account, the latest build of each image with the
-- identity it was requested under, runs with the execution identity they were
-- submitted under, and each run's event log.
-- Both dialects share the statements; only the timestamp default differs.
local function statements(now: string): {string}
    return {
        [[CREATE TABLE chestor_autocode_account_state (
            account_id TEXT PRIMARY KEY,
            last_used_at TEXT NOT NULL DEFAULT '',
            cooldown_until TEXT NOT NULL DEFAULT '',
            last_error TEXT NOT NULL DEFAULT '',
            reservation_order INTEGER NOT NULL DEFAULT 0,
            settled_at TEXT NOT NULL DEFAULT '',
            rate_limits TEXT NOT NULL DEFAULT '{}'
        )]],
        [[CREATE TABLE chestor_autocode_image_builds (
            image_id TEXT PRIMARY KEY,
            actor_id TEXT NOT NULL,
            actor_context TEXT NOT NULL,
            mode TEXT NOT NULL,
            build_id TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT '',
            agents TEXT NOT NULL DEFAULT '[]',
            projected INTEGER NOT NULL DEFAULT 0,
            last_error TEXT NOT NULL DEFAULT '',
            recipe TEXT NOT NULL DEFAULT '{}',
            approved_recipe TEXT NOT NULL DEFAULT '{}',
            approved_agents TEXT NOT NULL DEFAULT '[]',
            job_id TEXT NOT NULL DEFAULT '',
            log TEXT NOT NULL DEFAULT '',
            requested_at TEXT NOT NULL,
            finished_at TEXT NOT NULL DEFAULT ''
        )]],
        [[CREATE TABLE chestor_autocode_runs (
            id TEXT PRIMARY KEY,
            owner_id TEXT NOT NULL,
            actor_id TEXT NOT NULL,
            actor_context TEXT NOT NULL,
            agent TEXT NOT NULL,
            account_id TEXT NOT NULL,
            account_pinned INTEGER NOT NULL DEFAULT 1,
            image_id TEXT NOT NULL,
            workspace_id TEXT NOT NULL DEFAULT '',
            options TEXT NOT NULL DEFAULT '{}',
            unattended INTEGER NOT NULL DEFAULT 1,
            repo_url TEXT NOT NULL DEFAULT '',
            repo_ref TEXT NOT NULL DEFAULT '',
            input TEXT NOT NULL DEFAULT '',
            prompt TEXT NOT NULL,
            timeout_ms INTEGER NOT NULL,
            flow_dataflow_id TEXT NOT NULL DEFAULT '',
            flow_signal_id TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL,
            result TEXT NOT NULL DEFAULT '',
            error TEXT NOT NULL DEFAULT '',
            usage TEXT NOT NULL DEFAULT '{}',
            cancel_requested INTEGER NOT NULL DEFAULT 0,
            workflow_delivered INTEGER NOT NULL DEFAULT 0,
            pending_status TEXT NOT NULL DEFAULT '',
            job_id TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT ]] .. now .. [[,
            started_at TEXT NOT NULL DEFAULT '',
            finished_at TEXT NOT NULL DEFAULT '',
            account_pool TEXT NOT NULL DEFAULT '[]',
            endpoint TEXT NOT NULL DEFAULT '{}',
            resolved INTEGER NOT NULL DEFAULT 0,
            tools TEXT NOT NULL DEFAULT '{}',
            gateway TEXT NOT NULL DEFAULT '{}',
            account_health TEXT NOT NULL DEFAULT '{}',
            event_count INTEGER NOT NULL DEFAULT 0,
            event_bytes BIGINT NOT NULL DEFAULT 0,
            event_notice_seq INTEGER NOT NULL DEFAULT 0,
            dispatch_state TEXT NOT NULL DEFAULT 'waiting'
        )]],
        "CREATE INDEX chestor_autocode_runs_owner ON chestor_autocode_runs (owner_id, created_at)",
        "CREATE INDEX chestor_autocode_runs_account ON chestor_autocode_runs (account_id, created_at)",
        "CREATE INDEX chestor_autocode_runs_finished ON chestor_autocode_runs (finished_at)",
        [[CREATE INDEX chestor_autocode_runs_retention ON chestor_autocode_runs (finished_at, id)
            WHERE finished_at > '' AND (flow_dataflow_id = '' OR workflow_delivered IN (1, 2))]],
        "CREATE INDEX chestor_autocode_runs_workspace_active ON chestor_autocode_runs (workspace_id) WHERE status IN ('queued', 'running')",
        "CREATE INDEX chestor_autocode_runs_pending ON chestor_autocode_runs (owner_id) WHERE status IN ('queued', 'running')",
        [[CREATE INDEX chestor_autocode_runs_queued ON chestor_autocode_runs (created_at, id)
            WHERE status = 'queued' AND dispatch_state IN ('waiting', 'expiring') AND pending_status = '']],
        [[CREATE TABLE chestor_autocode_submissions (
            owner_id TEXT NOT NULL, key TEXT NOT NULL, canonical TEXT NOT NULL, run_id TEXT NOT NULL,
            PRIMARY KEY (owner_id, key))]],
        "CREATE INDEX chestor_autocode_submissions_run ON chestor_autocode_submissions (run_id)",
        [[CREATE TABLE chestor_autocode_admission_lock (
            id INTEGER PRIMARY KEY, generation INTEGER NOT NULL,
            retention_finished_at TEXT NOT NULL DEFAULT '', retention_id TEXT NOT NULL DEFAULT ''
        )]],
        "INSERT INTO chestor_autocode_admission_lock (id, generation) VALUES (1, 0)",
        [[CREATE TABLE chestor_autocode_workspaces (
            component_id TEXT PRIMARY KEY, host_path TEXT NOT NULL, provenance TEXT NOT NULL DEFAULT '{}'
        )]],
        [[CREATE TABLE chestor_autocode_run_events (
            run_id TEXT NOT NULL,
            seq INTEGER NOT NULL,
            kind TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT ]] .. now .. [[,
            PRIMARY KEY (run_id, seq)
        )]],
    }
end

local TABLES = {
    "chestor_autocode_workspaces",
    "chestor_autocode_admission_lock",
    "chestor_autocode_submissions",
    "chestor_autocode_run_events",
    "chestor_autocode_runs",
    "chestor_autocode_image_builds",
    "chestor_autocode_account_state",
}

local function apply(db: sql.DB, now: string)
    for _, statement in ipairs(statements(now)) do
        local _, err = db:execute(statement)
        if err then error(errors.wrap(err, "autocode migration")) end
    end
end

local function drop(db: sql.DB)
    for _, name in ipairs(TABLES) do
        local _, err = db:execute("DROP TABLE " .. name)
        if err then error(errors.wrap(err, "autocode rollback")) end
    end
end

return require("migration").define(function()
    migration("Create autocode tables", function()
        database("postgres", function()
            up(function(db: sql.DB) apply(db, [[(to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))]]) end)
            down(drop)
        end)
        database("sqlite", function()
            up(function(db: sql.DB) apply(db, [[(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))]]) end)
            down(drop)
        end)
    end)
end)

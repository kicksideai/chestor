-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Populate the released schema during boot, before dispatch migrations and
-- before Jobs workers start. The upgrade profile selects 0.1.5 or 0.1.6.
local registry = require("registry")
local jobs = require("jobs")
local docker = require("docker")
local uuid = require("uuid")
local framework = require("migration")
return function(options)
    local config = assert(registry.get("app:upgrade_fixture"))
    local selected = config.meta.release
    local stage = options.id:match("upgrade_fixture_(%d+)")
    return framework.run(function()
        migration("Populate released approval-parked and possibly-created runs", function()
            for _, engine in ipairs({"sqlite", "postgres"}) do
                database(engine, function()
                    up(function(tx)
                        if selected ~= stage then return end
                        for _, kind in ipairs({"parked", "created", "started", "pending", "running", "approved"}) do
                            local id = uuid.v7()
                            local _, err = tx:execute([[INSERT INTO chestor_autocode_runs
                                (id, owner_id, actor_id, actor_context, agent, account_id, image_id,
                                 workspace_id, prompt, timeout_ms, status, created_at)
                                VALUES ($1, 'upgrade-owner', 'upgrade-owner', '{}', 'claude', 'account', 'image',
                                    $2, $3, 60000, 'queued', '2026-01-01T00:00:00Z')]],
                                {id, kind == "approved" and "approved-upgrade-workspace" or (kind == "created" and "" or "unapproved-upgrade-workspace"), "upgrade-" .. stage .. "-" .. kind})
                            if err then error(err) end
                            local job, job_err = jobs.enqueue_tx(tx, engine, {namespace = "chestor.autocode", scope = id, key = "run",
                                owner_locator = {kind = "user", id = "upgrade-owner"}, job_type = "chestor.autocode.runner:run",
                                slot = true, parked = true, max_attempts = 2,
                                immutable_payload = {run_id = id, max_execution_ms = 660000}})
                            if not job then error(job_err) end
                            local _, write_err = tx:execute("UPDATE chestor_autocode_runs SET job_id = $1 WHERE id = $2", {job.id, id})
                            if write_err then error(write_err) end
                            if stage == "017" then
                                assert(tx:execute("UPDATE chestor_autocode_runs SET dispatch_state = 'creating' WHERE id = $1", {id}))
                            end
                            -- Exact published approval-park result: pending, no schedule,
                            -- and wake disabled. SQL here only constructs the old fixture.
                            local _, park_err = tx:execute("UPDATE kickside_job SET wake_enabled = FALSE WHERE id = $1", {job.id})
                            if park_err then error(park_err) end
                            if kind == "approved" then
                                assert(tx:execute("INSERT INTO chestor_autocode_workspaces (component_id, host_path) VALUES ('approved-upgrade-workspace', '/upgrade-approved')"))
                            elseif kind == "started" then
                                assert(tx:execute("UPDATE chestor_autocode_runs SET started_at = '2026-01-01T00:01:00Z' WHERE id = $1", {id}))
                            elseif kind == "pending" then
                                assert(tx:execute("UPDATE chestor_autocode_runs SET pending_status = 'cancelled', result = 'kept 界🙂', error = 'saved cancellation' WHERE id = $1", {id}))
                            elseif kind == "running" then
                                assert(tx:execute("UPDATE chestor_autocode_runs SET status = 'running' WHERE id = $1", {id}))
                            end
                            if kind ~= "parked" then
                                -- The released runner could crash after Docker create and before start_run.
                                local name = "chestor-autocode-" .. id
                                local code, create_err = docker.run({"create", "--cap-drop=NET_RAW", "--name", name, "--network", "none", "node:22-bookworm-slim", "true"},
                                    {isolation = {name = name, image = "node:22-bookworm-slim", network = "none", mounts = {}}})
                                if create_err or code ~= 0 then error(create_err or "fixture container create failed") end
                            end
                        end
                    end)
                end)
            end
        end)
    end, options)
end

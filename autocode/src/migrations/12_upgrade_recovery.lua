-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local jobs = require("jobs")
return require("migration").define(function()
    migration("Classify legacy dispatch and enroll container cleanup recovery", function()
        for _, engine in ipairs({"sqlite", "postgres"}) do
            database(engine, function()
                up(function(tx)
                    -- In 0.1.5/0.1.6 preparation required this immutable approval;
                    -- deletion was fenced by active runs. No start or outcome
                    -- plus a missing named approval therefore proves no create.
                    local _, classify_err = tx:execute([[UPDATE chestor_autocode_runs SET dispatch_state = 'waiting'
                        WHERE dispatch_state = 'creating' AND status = 'queued' AND started_at = '' AND pending_status = ''
                            AND workspace_id <> '' AND NOT EXISTS (
                                SELECT 1 FROM chestor_autocode_workspaces w WHERE w.component_id = workspace_id)]])
                    if classify_err then error(classify_err) end
                    local rows, read_err = tx:query([[SELECT id, owner_id, timeout_ms FROM chestor_autocode_runs
                        WHERE status IN ('queued', 'running') AND dispatch_state = 'creating' ORDER BY id]])
                    if read_err then error(read_err) end
                    for _, row in ipairs(rows) do
                        -- Demand repairs parked slots through Jobs' control wake,
                        -- including its running-lease fence. It commits with the
                        -- migration; the booting pool consumes it without a nudge.
                        local job, job_err = jobs.enqueue_tx(tx, engine, {namespace = "chestor.autocode", scope = row.id, key = "run",
                            owner_locator = {kind = "user", id = row.owner_id}, job_type = "chestor.autocode.runner:run",
                            slot = true, demand = true, max_attempts = 2,
                            immutable_payload = {run_id = row.id, max_execution_ms = row.timeout_ms + 600000}})
                        if not job then error(job_err) end
                        local _, write_err = tx:execute("UPDATE chestor_autocode_runs SET job_id = $1 WHERE id = $2", {job.id, row.id})
                        if write_err then error(write_err) end
                    end
                end)
            end)
        end
    end)
end)

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local jobs = require("jobs")
return require("migration").define(function()
    migration("Recover inherited runs using Docker evidence", function()
        for _, engine in ipairs({"sqlite", "postgres"}) do
            database(engine, function()
                up(function(tx)
                    -- Approval absence cannot exclude creation before 0.1.5.
                    -- Only Docker recovery can establish that an inherited run is parked.
                    local _, mark_err = tx:execute([[UPDATE chestor_autocode_runs SET dispatch_state = 'creating'
                        WHERE status IN ('queued', 'running')]])
                    if mark_err then error(mark_err) end
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

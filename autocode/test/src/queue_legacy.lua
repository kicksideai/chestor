-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local jobs = require("jobs")
local deferred = require("deferred")
local security = require("security")
local uuid = require("uuid")
local function queue(spec)
    local stored, err = deferred.capture()
    if not stored then return nil, err end
    local id, owner = uuid.v7(), security.actor():id()
    -- Seed released persisted state directly: current submission must refuse an unapproved workspace.
    local write_err = database.transaction({}, function(tx, engine)
        local _, insert_err = tx:execute([[INSERT INTO chestor_autocode_runs
            (id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id,
             prompt, timeout_ms, status, flow_dataflow_id, flow_signal_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'queued', $11, $12)]],
            {id, owner, stored.actor_id, stored.actor_context, spec.agent, spec.account_id, spec.image_id,
             spec.workspace_id, spec.prompt, spec.timeout_ms, spec.flow and spec.flow.dataflow_id or "", spec.flow and spec.flow.signal_id or ""})
        if insert_err then return insert_err end
        local job, job_err = jobs.enqueue_tx(tx, engine, {namespace = "chestor.autocode", scope = id, key = "run",
            owner_locator = {kind = "user", id = owner}, job_type = "chestor.autocode.runner:run", slot = true,
            max_attempts = 2, immutable_payload = {run_id = id, max_execution_ms = spec.timeout_ms + 600000}})
        if not job then return job_err end
        local _, update_err = tx:execute("UPDATE chestor_autocode_runs SET job_id = $1 WHERE id = $2", {job.id, id})
        return update_err
    end)
    if write_err then return nil, write_err end
    local wake_err = deferred.nudge()
    if wake_err then return nil, wake_err end
    return {run_id = id}
end
return {queue = queue}

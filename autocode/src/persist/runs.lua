-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")
local sql = require("sql")
local uuid = require("uuid")
local jobs = require("jobs")
local trace = require("trace")
local slot_purge = require("slot_purge")

type Object = db.Object
type Columns = db.Columns
type Identity = db.Identity
type Submission = db.Submission
type RunSpec = db.RunSpec
type RunStatus = db.RunStatus
type Run = db.Run
type FlowSignal = db.FlowSignal
local fail = db.fail
local query = db.query
local execute = db.execute
local mismatch = db.mismatch
local text = db.text
local int = db.int
local flag = db.flag
local object = db.object
local optional = db.optional
local decode = db.decode
local first = db.first
local encode_object = db.encode_object
local transaction = db.transaction
local repo = {}
local RUN_JOB = "chestor.autocode.runner:run"
local SETTLE_MARGIN_MS = 600000

-- Runs. Status moves queued -> running -> one terminal status; each
-- transition names the status it moves from.

local RUN_COLUMNS = [[id, owner_id, actor_id, actor_context, agent, account_id, account_pinned, input, repo_ref, image_id, workspace_id, flow_dataflow_id,
    flow_signal_id, options, unattended, repo_url, prompt, timeout_ms, status, result, error, usage, cancel_requested,
    created_at, started_at, finished_at, pending_status, job_id]]

local function run(row: Columns): Run
    local status = text(row, "status")
    local dataflow_id = text(row, "flow_dataflow_id")
    local flow: FlowSignal? = nil
    if dataflow_id ~= "" then flow = {dataflow_id = dataflow_id, signal_id = text(row, "flow_signal_id")} end
    if status ~= "queued" and status ~= "running" and status ~= "succeeded" and status ~= "failed" and status ~= "cancelled" then
        mismatch(row, "status", "a run status")
        status = "failed"
    end
    local pending = text(row, "pending_status")
    local pending_status: RunStatus? = nil
    if pending == "succeeded" or pending == "failed" or pending == "cancelled" then pending_status = pending
    elseif pending ~= "" then mismatch(row, "pending_status", "a terminal run status") end
    return {account_pinned = flag(row, "account_pinned"), input = text(row, "input"), repo_ref = text(row, "repo_ref"), pending_status = pending_status, job_id = text(row, "job_id"), id = text(row, "id"), owner_id = text(row, "owner_id"),
        identity = {actor_id = text(row, "actor_id"), actor_context = text(row, "actor_context")},
        agent = text(row, "agent"), account_id = text(row, "account_id"), image_id = text(row, "image_id"),
        workspace_id = optional(row, "workspace_id"), flow = flow, options = object(row, "options"),
        unattended = flag(row, "unattended"), repo_url = text(row, "repo_url"), prompt = text(row, "prompt"),
        timeout_ms = int(row, "timeout_ms"), status = status, result = text(row, "result"), error = text(row, "error"),
        usage = object(row, "usage"), cancel_requested = flag(row, "cancel_requested"), created_at = text(row, "created_at"),
        started_at = text(row, "started_at"), finished_at = text(row, "finished_at")}
end

type RunSummary = {id: string, agent: string, account_id: string, image_id: string, workspace_id: string?,
    status: RunStatus, workflow: boolean, cancel_requested: boolean, created_at: string, started_at: string, finished_at: string,
    prompt_summary: string}
function repo.run_summaries(owner_id: string, limit: integer, before: string, before_id: string): ({RunSummary}?, error?)
    local rows, err = query([[SELECT id, agent, account_id, image_id, workspace_id, status, flow_dataflow_id,
        cancel_requested, created_at, started_at, finished_at, SUBSTR(prompt, 1, 300) AS prompt_summary
        FROM chestor_autocode_runs WHERE owner_id = $1
        AND ($2 = '' OR created_at < $2 OR (created_at = $2 AND id < $3))
        ORDER BY created_at DESC, id DESC LIMIT $4]], {owner_id, before, before_id, limit})
    return decode(rows, err, function(row: Columns): RunSummary
        local status = text(row, "status")
        if status ~= "queued" and status ~= "running" and status ~= "succeeded" and status ~= "failed" and status ~= "cancelled" then
            mismatch(row, "status", "a run status")
            status = "failed"
        end
        return {id = text(row, "id"), agent = text(row, "agent"), account_id = text(row, "account_id"), image_id = text(row, "image_id"),
            workspace_id = optional(row, "workspace_id"), status = status, workflow = text(row, "flow_dataflow_id") ~= "",
            cancel_requested = flag(row, "cancel_requested"), created_at = text(row, "created_at"), started_at = text(row, "started_at"),
            finished_at = text(row, "finished_at"), prompt_summary = text(row, "prompt_summary")}
    end)
end

-- run reads one of the owner's runs.
function repo.run(owner_id: string, id: string): (Run?, error?)
    local rows, err = query("SELECT " .. RUN_COLUMNS .. " FROM chestor_autocode_runs WHERE owner_id = $1 AND id = $2", {owner_id, id})
    return first(rows, err, run)
end

-- stored_run reads a run by id for the trusted workers that act on it.
function repo.stored_run(id: string): (Run?, error?)
    local rows, err = query("SELECT " .. RUN_COLUMNS .. " FROM chestor_autocode_runs WHERE id = $1", {id})
    return first(rows, err, run)
end

function repo.find_submission(owner_id: string, submission: Submission): (string?, error?)
    local rows, err = query("SELECT run_id, canonical FROM chestor_autocode_submissions WHERE owner_id = $1 AND key = $2",
        {owner_id, submission.key})
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return nil, nil end
    if row.canonical ~= submission.canonical then return nil, errors.new({kind = errors.CONFLICT, message = "idempotency key has a different request"}) end
    if type(row.run_id) ~= "string" then return nil, fail("submission has no run id") end
    return row.run_id, nil
end

local function reserve_account(tx: sql.Transaction, candidates: {string}, now: string): (string?, error?)
    local best: string? = nil
    local best_order = 0
    for _, account_id in ipairs(candidates) do
        local _, seed_err = tx:execute([[INSERT INTO chestor_autocode_account_state (account_id) VALUES ($1) ON CONFLICT (account_id) DO NOTHING]], {account_id})
        if seed_err then return nil, seed_err end
        local rows, read_err = tx:query("SELECT reservation_order, cooldown_until FROM chestor_autocode_account_state WHERE account_id = $1", {account_id})
        if read_err then return nil, read_err end
        local state = rows and rows[1]
        if not state or type(state.reservation_order) ~= "number" or type(state.cooldown_until) ~= "string" then return nil, fail("invalid account reservation state") end
        if state.cooldown_until <= now and (not best or state.reservation_order < best_order or (state.reservation_order == best_order and account_id < best)) then
            best, best_order = account_id, state.reservation_order
        end
    end
    if not best then return nil, errors.new({kind = errors.CONFLICT, message = "no account is available outside its cooldown"}) end
    local _, reserve_err = tx:execute("UPDATE chestor_autocode_account_state SET reservation_order = (SELECT generation FROM chestor_autocode_admission_lock WHERE id = 1) WHERE account_id = $1", {best})
    if reserve_err then return nil, reserve_err end
    return best, nil
end

-- create_run reserves an account and records the run and its job in one transaction.
function repo.create_run(owner_id: string, identity: Identity, spec: RunSpec, submission: Submission?, candidates: {string}?): (string?, error?)
    local trace_context, trace_err = trace.normalize(spec.trace_context)
    if trace_err then return nil, trace_err end
    trace_context = trace_context or trace.begin("autocode.run")
    local id = uuid.v7()
    local options, options_err = encode_object(spec.options, "options")
    if not options then return nil, options_err end
    local now = db.now()
    -- This write acquires the same admission lock before any eligibility
    -- read on both SQLite and PostgreSQL.
    local err = transaction({{statement = "UPDATE chestor_autocode_admission_lock SET generation = generation + 1 WHERE id = 1", params = {}}},
        function(tx: sql.Transaction, dbtype: string): error?
            if submission then
                local rows, read_err = tx:query("SELECT run_id, canonical FROM chestor_autocode_submissions WHERE owner_id = $1 AND key = $2", {owner_id, submission.key})
                if read_err then return read_err end
                local row = rows and rows[1]
                if row then
                    if row.canonical ~= submission.canonical then return errors.new({kind = errors.CONFLICT, message = "idempotency key has a different request"}) end
                    if type(row.run_id) ~= "string" then return fail("submission has no run id") end
                    id = row.run_id
                    return nil
                end
            end
            local best, reserve_err = reserve_account(tx, candidates or {spec.account_id}, now)
            if not best then return reserve_err end
            local _, insert_err = tx:execute([[INSERT INTO chestor_autocode_runs
                (id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id, flow_dataflow_id, flow_signal_id,
                 options, unattended, repo_url, prompt, timeout_ms, status, created_at, account_pinned, input, repo_ref)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'queued', $16, $17, $18, $19)]],
                {id, owner_id, identity.actor_id, identity.actor_context, spec.agent, best, spec.image_id,
                    spec.workspace_id or "", spec.flow and spec.flow.dataflow_id or "", spec.flow and spec.flow.signal_id or "",
                    options, spec.unattended and 1 or 0, spec.repo_url, spec.prompt, spec.timeout_ms, now, spec.account_pinned == false and 0 or 1, spec.input or "", spec.repo_ref or ""})
            if insert_err then return insert_err end
            if submission then
                local _, key_err = tx:execute("INSERT INTO chestor_autocode_submissions (owner_id, key, canonical, run_id) VALUES ($1, $2, $3, $4)",
                    {owner_id, submission.key, submission.canonical, id})
                if key_err then return key_err end
            end
            -- A run owns its reusable job until retention; cleanup retries have no attempt ceiling.
            local job, job_err = jobs.enqueue_tx(tx, dbtype, {namespace = "chestor.autocode", scope = id, key = "run",
                owner_locator = {kind = "user", id = owner_id}, job_type = RUN_JOB, slot = true,
                max_attempts = 2, trace_context = trace_context, immutable_payload = {run_id = id, max_execution_ms = spec.timeout_ms + SETTLE_MARGIN_MS}})
            if job_err then return job_err end
            if not job or type(job.id) ~= "string" then return fail("run enqueue returns no job ID") end
            local _, write_err = tx:execute("UPDATE chestor_autocode_runs SET job_id = $1 WHERE id = $2", {job.id, id})
            return write_err
        end)
    if err then return nil, err end
    return id, nil
end

-- Only an unpinned queued run can change its reserved account.
function repo.rebalance_run(id: string, candidates: {string}): (string?, error?)
    local selected: string? = nil
    local err = transaction({{statement = "UPDATE chestor_autocode_admission_lock SET generation = generation + 1 WHERE id = 1", params = {}}},
        function(tx: sql.Transaction): error?
            local best, reserve_err = reserve_account(tx, candidates, db.now())
            if not best then return reserve_err end
            local changed, write_err = tx:execute([[UPDATE chestor_autocode_runs SET account_id = $1
                WHERE id = $2 AND account_pinned = 0 AND status = 'queued']], {best, id})
            if write_err then return write_err end
            if not changed or changed.rows_affected ~= 1 then return errors.new({kind = errors.CONFLICT, message = "run no longer allows account balancing"}) end
            selected = best
            return nil
        end)
    return selected, err
end

function repo.cancel_requested(id: string): (boolean?, error?)
    local rows, err = query("SELECT cancel_requested FROM chestor_autocode_runs WHERE id = $1", {id})
    local requested, read_err = first(rows, err, function(row: Columns): boolean return flag(row, "cancel_requested") end)
    if read_err then return nil, read_err end
    if requested == nil then return nil, errors.new({kind = errors.NOT_FOUND, message = "run disappeared during execution"}) end
    return requested, nil
end

function repo.acknowledge_delivery(id: string): error?
    local _, err = execute("UPDATE chestor_autocode_runs SET workflow_delivered = 1 WHERE id = $1 AND status IN ('succeeded', 'failed', 'cancelled')", {id})
    return err
end

function repo.start_run(id: string): (boolean?, error?)
    local started = false
    local now = db.now()
    local err = transaction({}, function(tx: sql.Transaction): error?
        local changed, write_err = tx:execute([[UPDATE chestor_autocode_runs SET status = 'running', started_at = $1
            WHERE id = $2 AND status = 'queued' AND cancel_requested = 0]], {now, id})
        if write_err then return write_err end
        started = changed ~= nil and changed.rows_affected == 1
        if not started then return nil end
        local _, stamp_err = tx:execute([[UPDATE chestor_autocode_account_state SET last_used_at = $1
            WHERE account_id = (SELECT account_id FROM chestor_autocode_runs WHERE id = $2)]], {now, id})
        return stamp_err
    end)
    if err then return nil, err end
    return started, nil
end

-- The pending outcome survives cleanup retries while the run remains unsettled.
function repo.record_run_outcome(id: string, status: RunStatus, result: string, error_text: string, usage: Object): error?
    local usage_json, usage_err = encode_object(usage, "usage")
    if not usage_json then return usage_err end
    local _, err = execute([[UPDATE chestor_autocode_runs SET pending_status = $1, result = $2, error = $3, usage = $4
        WHERE id = $5 AND status IN ('queued', 'running') AND pending_status = '']], {status, result, error_text, usage_json, id})
    return err
end

-- finish_run settles a queued or running run and enrolls workflow delivery
-- in the same transaction; false means the run already has a terminal status.
function repo.finish_run(id: string, status: RunStatus, result: string, error_text: string, usage: Object, trace_context: Object?): (boolean?, error?)
    local usage_json, usage_err = encode_object(usage, "usage")
    if not usage_json then return nil, usage_err end
    local settled = false
    local err = transaction({}, function(tx: sql.Transaction, dbtype: string): error?
        local changed, execute_err = tx:execute([[UPDATE chestor_autocode_runs SET status = $1, result = $2, error = $3, usage = $4,
            finished_at = $5 WHERE id = $6 AND status IN ('queued', 'running')]], {status, result, error_text, usage_json, db.now(), id})
        if execute_err then return execute_err end
        settled = changed ~= nil and changed.rows_affected == 1
        if not settled then return nil end
        local rows, read_err = tx:query("SELECT owner_id, flow_dataflow_id FROM chestor_autocode_runs WHERE id = $1", {id})
        if read_err then return read_err end
        local row = rows and rows[1]
        if row and row.flow_dataflow_id ~= "" then
            local _, enqueue_err = jobs.enqueue_tx(tx, dbtype, {namespace = "chestor.autocode", scope = id, key = "resume",
                owner_locator = {kind = "user", id = row.owner_id}, job_type = "chestor.autocode.blocks:resume",
                slot = true, max_attempts = 5, trace_context = trace_context, immutable_payload = {run_id = id}})
            if enqueue_err then return enqueue_err end
        end
        return nil
    end)
    if err then return nil, err end
    return settled, nil
end

-- request_cancel marks an unsettled run; false means it already settled.
function repo.request_cancel(owner_id: string, id: string): (boolean?, error?)
    local changed, err = execute([[UPDATE chestor_autocode_runs SET cancel_requested = 1
        WHERE owner_id = $1 AND id = $2 AND status IN ('queued', 'running')]], {owner_id, id})
    if err then return nil, err end
    return changed == 1, nil
end

-- prune_runs deletes up to `limit` runs that settled before `before`, with
-- their events, and reports how many runs it deleted.
function repo.prune_runs(before: string, limit: integer): (integer?, error?)
    local rows, err = query([[SELECT id, job_id FROM chestor_autocode_runs WHERE finished_at <> '' AND finished_at < $1 AND (flow_dataflow_id = '' OR workflow_delivered = 1)
        ORDER BY finished_at LIMIT $2]], {before, limit})
    if err then return nil, err end
    local deleted = 0
    for _, row in ipairs(rows or {}) do
        local active = false
        if type(row.job_id) == "string" and row.job_id ~= "" then
            local _, cancel_err = jobs.cancel(row.job_id)
            if cancel_err then return nil, cancel_err end
            local job, job_err = jobs.get_job(row.job_id)
            if job_err then return nil, job_err end
            if job and (job.status == "pending" or job.status == "running") then
                active = true
            end
        end
        if not active then
            for _, key in ipairs({"resume", "run"}) do
                local _, purge_err = slot_purge.purge_slot({namespace = "chestor.autocode", scope = row.id, key = key})
                if purge_err then
                    if errors.is(purge_err, errors.CONFLICT) and purge_err:details().cleanup_pending == true then
                        active = true
                        break
                    end
                    return nil, purge_err
                end
            end
            if not active then
                local prune_err = transaction({
                    {statement = "DELETE FROM chestor_autocode_run_events WHERE run_id = $1", params = {row.id}},
                    {statement = "DELETE FROM chestor_autocode_submissions WHERE run_id = $1", params = {row.id}},
                    {statement = "DELETE FROM chestor_autocode_runs WHERE id = $1", params = {row.id}},
                }, nil)
                if prune_err then return nil, prune_err end
                deleted = deleted + 1
            end
        end
    end
    return deleted, nil
end

return repo

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local job_outcome = require("job_outcome")
local db = require("database")
local limits = require("limits")
local sql = require("sql")
local uuid = require("uuid")
local jobs = require("jobs")
local trace = require("trace")

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

local RUN_COLUMNS = [[workflow_delivered, account_health, tools, gateway, id, owner_id, actor_id, actor_context, agent, account_id, account_pinned, input, repo_ref, image_id, workspace_id, flow_dataflow_id,
    flow_signal_id, account_pool, endpoint, resolved, options, unattended, repo_url, prompt, timeout_ms, status, result, error, usage, cancel_requested,
    created_at, started_at, finished_at, pending_status, job_id]]

local function run(row: Columns): Run
    local status = text(row, "status")
    local dataflow_id = text(row, "flow_dataflow_id")
    local signal_id = text(row, "flow_signal_id")
    local flow: FlowSignal? = nil
    if (dataflow_id == "") ~= (signal_id == "") then mismatch(row, "flow_dataflow_id", "a complete workflow destination") end
    if dataflow_id ~= "" then flow = {dataflow_id = dataflow_id, signal_id = signal_id} end
    if status ~= "queued" and status ~= "running" and status ~= "succeeded" and status ~= "failed" and status ~= "cancelled" then
        mismatch(row, "status", "a run status")
        status = "failed"
    end
    local pending = text(row, "pending_status")
    local pending_status: RunStatus? = nil
    if pending == "succeeded" or pending == "failed" or pending == "cancelled" then pending_status = pending
    elseif pending ~= "" then mismatch(row, "pending_status", "a terminal run status") end
    local reach = object(row, "endpoint")
    local pool = db.strings(row, "account_pool")
    local tools = object(row, "tools")
    local gateway = object(row, "gateway")
    local endpoint: {protocol: string, base_url: string, model: string?}? = nil
    if reach.protocol ~= nil or reach.base_url ~= nil or reach.model ~= nil or (next(reach) ~= nil and reach.account_endpoint ~= true) then
        if type(reach.protocol) ~= "string" or reach.protocol == "" or type(reach.base_url) ~= "string" or reach.base_url == ""
            or (reach.model ~= nil and type(reach.model) ~= "string") then
            mismatch(row, "endpoint", "a complete endpoint")
        else endpoint = {protocol = reach.protocol, base_url = reach.base_url, model = reach.model :: string?} end
    end
    local message, native, error_err = job_outcome.read_error(text(row, "error"))
    if error_err then row.problem = error_err end
    return {workflow_delivered = int(row, "workflow_delivered"), error_native = native, account_health = object(row, "account_health"), account_endpoint = reach.account_endpoint == true, tools = next(tools) and tools or nil, gateway = next(gateway) and gateway or nil, account_pool = pool,
        endpoint = endpoint,
        resolved = flag(row, "resolved"), account_pinned = flag(row, "account_pinned"), input = text(row, "input"), repo_ref = text(row, "repo_ref"), pending_status = pending_status, job_id = text(row, "job_id"), id = text(row, "id"), owner_user_id = text(row, "owner_id"), owner_id = text(row, "owner_id"),
        identity = {actor_id = text(row, "actor_id"), actor_context = text(row, "actor_context")},
        agent = text(row, "agent"), account_id = text(row, "account_id"), image_id = text(row, "image_id"),
        workspace_id = optional(row, "workspace_id"), flow = flow, options = object(row, "options"),
        unattended = flag(row, "unattended"), repo_url = text(row, "repo_url"), prompt = text(row, "prompt"),
        timeout_ms = int(row, "timeout_ms"), status = status, result = text(row, "result"), error = message or "",
        usage = object(row, "usage"), cancel_requested = flag(row, "cancel_requested"), created_at = text(row, "created_at"),
        started_at = text(row, "started_at"), finished_at = text(row, "finished_at")}
end

type RunSummary = {id: string, agent: string, account_id: string, image_id: string, workspace_id: string?,
    status: RunStatus, workflow: boolean, cancel_requested: boolean, created_at: string, started_at: string, finished_at: string,
    prompt_summary: string, usage: Object}
function repo.run_summaries(owner_user_id: string, limit: integer, before: string, before_id: string): ({RunSummary}?, error?)
    local rows, err = query([[SELECT id, agent, account_id, image_id, workspace_id, status, flow_dataflow_id,
        cancel_requested, created_at, started_at, finished_at, usage, SUBSTR(prompt, 1, 300) AS prompt_summary
        FROM chestor_autocode_runs WHERE owner_id = $1
        AND ($2 = '' OR created_at < $2 OR (created_at = $2 AND id < $3))
        ORDER BY created_at DESC, id DESC LIMIT $4]], {owner_user_id, before, before_id, limit})
    return decode(rows, err, function(row: Columns): RunSummary
        local status = text(row, "status")
        if status ~= "queued" and status ~= "running" and status ~= "succeeded" and status ~= "failed" and status ~= "cancelled" then
            mismatch(row, "status", "a run status")
            status = "failed"
        end
        return {id = text(row, "id"), agent = text(row, "agent"), account_id = text(row, "account_id"), image_id = text(row, "image_id"),
            workspace_id = optional(row, "workspace_id"), status = status, workflow = text(row, "flow_dataflow_id") ~= "",
            cancel_requested = flag(row, "cancel_requested"), created_at = text(row, "created_at"), started_at = text(row, "started_at"),
            finished_at = text(row, "finished_at"), prompt_summary = text(row, "prompt_summary"), usage = object(row, "usage")}
    end)
end

function repo.bind_gateway(id: string, binding: Object): error?
    local encoded, err = encode_object(binding, "gateway binding")
    if not encoded then return err end
    local changed, write_err = execute("UPDATE chestor_autocode_runs SET gateway = $1 WHERE id = $2 AND status IN ('queued', 'running') AND pending_status = '' AND gateway = '{}'", {encoded, id})
    if write_err then return write_err end
    if changed ~= 1 then return errors.new({kind = errors.CONFLICT, message = "run gateway is already issued or settled"}) end
    return nil
end

-- run reads one of the owner's runs.
function repo.run(owner_user_id: string, id: string): (Run?, error?)
    local rows, err = query("SELECT " .. RUN_COLUMNS .. " FROM chestor_autocode_runs WHERE owner_id = $1 AND id = $2", {owner_user_id, id})
    return first(rows, err, run)
end

-- stored_run reads a run by id for the trusted workers that act on it.
function repo.stored_run(id: string): (Run?, error?)
    local rows, err = query("SELECT " .. RUN_COLUMNS .. " FROM chestor_autocode_runs WHERE id = $1", {id})
    return first(rows, err, run)
end

function repo.find_submission(owner_user_id: string, submission: Submission): (string?, error?)
    local rows, err = query("SELECT run_id, canonical FROM chestor_autocode_submissions WHERE owner_id = $1 AND key = $2",
        {owner_user_id, submission.key})
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
        local rows, read_err = tx:query("SELECT reservation_order, cooldown_until, rate_limits FROM chestor_autocode_account_state WHERE account_id = $1", {account_id})
        if read_err then return nil, read_err end
        local state = rows and rows[1]
        if not state or type(state.reservation_order) ~= "number" or type(state.cooldown_until) ~= "string" then return nil, fail("invalid account reservation state") end
        local columns: Columns = {row = state, problem = nil}
        local reported = object(columns, "rate_limits")
        if columns.problem then return nil, columns.problem end
        if state.cooldown_until <= now and not limits.blocked(reported, now) and (not best or state.reservation_order < best_order or (state.reservation_order == best_order and account_id < best)) then
            best, best_order = account_id, state.reservation_order
        end
    end
    if not best then return nil, errors.new({kind = errors.CONFLICT, message = "no account is available outside its cooldown"}) end
    local _, reserve_err = tx:execute("UPDATE chestor_autocode_account_state SET reservation_order = (SELECT generation FROM chestor_autocode_admission_lock WHERE id = 1) WHERE account_id = $1", {best})
    if reserve_err then return nil, reserve_err end
    return best, nil
end

-- create_run reserves an account and records the run and its job in one transaction.
function repo.create_run(owner_user_id: string, identity: Identity, spec: RunSpec, submission: Submission?, candidates: {string}?): (string?, error?)
    local trace_context, trace_err = trace.normalize(spec.trace_context)
    if trace_err then return nil, trace_err end
    trace_context = trace_context or trace.begin("autocode.run")
    local id = uuid.v7()
    local options, options_err = encode_object(spec.options, "options")
    if not options then return nil, options_err end
    local reach, endpoint_err = encode_object(spec.endpoint or {}, "endpoint")
    if not reach then return nil, endpoint_err end
    local pool, pool_err = db.encoded(spec.account_pool or {}, "account pool")
    if not pool then return nil, pool_err end
    local surface, surface_err = encode_object(spec.tools or {}, "tool surface")
    if not surface then return nil, surface_err end
    local now = db.now()
    -- This write acquires the same admission lock before any eligibility
    -- read on both SQLite and PostgreSQL.
    local err = transaction({{statement = "UPDATE chestor_autocode_admission_lock SET generation = generation + 1 WHERE id = 1", params = {}}},
        function(tx: sql.Transaction, dbtype: string): error?
            if submission then
                local rows, read_err = tx:query("SELECT run_id, canonical FROM chestor_autocode_submissions WHERE owner_id = $1 AND key = $2", {owner_user_id, submission.key})
                if read_err then return read_err end
                local row = rows and rows[1]
                if row then
                    if row.canonical ~= submission.canonical then return errors.new({kind = errors.CONFLICT, message = "idempotency key has a different request"}) end
                    if type(row.run_id) ~= "string" then return fail("submission has no run id") end
                    id = row.run_id
                    return nil
                end
            end
            if spec.workspace_id and spec.workspace_id ~= "" then
                local lock_err = db.lock_workspaces(tx, dbtype)
                if lock_err then return lock_err end
                local rows, read_err = tx:query("SELECT component_id FROM chestor_autocode_workspaces WHERE component_id = $1", {spec.workspace_id})
                if not rows then return read_err end
                if #rows == 0 then return errors.new({kind = errors.CONFLICT, message = "workspace approval was removed before submission"}) end
            end
            local best, reserve_err = reserve_account(tx, candidates or {spec.account_id}, now)
            if not best then return reserve_err end
            if not spec.endpoint and spec.account_endpoints then
                local snapshot: Object = {account_endpoint = true}
                for key, value in pairs(spec.account_endpoints[best] or {}) do snapshot[key] = value end
                local encoded, encode_err = encode_object(snapshot, "account endpoint")
                if not encoded then return encode_err end
                reach = encoded
            end
            local _, insert_err = tx:execute([[INSERT INTO chestor_autocode_runs
                (id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id, flow_dataflow_id, flow_signal_id,
                 options, unattended, repo_url, prompt, timeout_ms, status, created_at, account_pinned, input, repo_ref, account_pool, endpoint, resolved, tools)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'queued', $16, $17, $18, $19, $20, $21, $22, $23)]],
                {id, owner_user_id, identity.actor_id, identity.actor_context, spec.agent, best, spec.image_id,
                    spec.workspace_id or "", spec.flow and spec.flow.dataflow_id or "", spec.flow and spec.flow.signal_id or "",
                    options, spec.unattended and 1 or 0, spec.repo_url, spec.prompt, spec.timeout_ms, now, spec.account_pinned == false and 0 or 1, spec.input or "", spec.repo_ref or "", pool, reach, spec.resolved and 1 or 0, surface})
            if insert_err then return insert_err end
            if submission then
                local _, key_err = tx:execute("INSERT INTO chestor_autocode_submissions (owner_id, key, canonical, run_id) VALUES ($1, $2, $3, $4)",
                    {owner_user_id, submission.key, submission.canonical, id})
                if key_err then return key_err end
            end
            -- A run owns its reusable job until retention; cleanup retries have no attempt ceiling.
            local job, job_err = jobs.enqueue_tx(tx, dbtype, {namespace = "chestor.autocode", scope = id, key = "run",
                owner_locator = {kind = "user", id = owner_user_id}, job_type = RUN_JOB, slot = true,
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
function repo.rebalance_run(id: string, candidates: {string}, endpoints: {[string]: Object}?): (string?, error?)
    local selected: string? = nil
    local err = transaction({{statement = "UPDATE chestor_autocode_admission_lock SET generation = generation + 1 WHERE id = 1", params = {}}},
        function(tx: sql.Transaction): error?
            local best, reserve_err = reserve_account(tx, candidates, db.now())
            if not best then return reserve_err end
            local statement = "UPDATE chestor_autocode_runs SET account_id = $1"
            local params: {unknown} = {best, id}
            if endpoints then
                local snapshot: Object = {account_endpoint = true}
                for key, value in pairs(endpoints[best] or {}) do snapshot[key] = value end
                local encoded, encode_err = encode_object(snapshot, "account endpoint")
                if not encoded then return encode_err end
                statement = statement .. ", endpoint = $2"
                params = {best, encoded, id}
            end
            local changed, write_err = tx:execute(statement .. " WHERE id = $" .. tostring(#params) .. " AND account_pinned = 0 AND status = 'queued'", params)
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

function repo.expire_delivery(id: string): error?
    local _, err = execute("UPDATE chestor_autocode_runs SET workflow_delivered = 2 WHERE id = $1 AND workflow_delivered = 0 AND status IN ('succeeded', 'failed', 'cancelled')", {id})
    return err
end

function repo.acknowledge_delivery(id: string): error?
    local _, err = execute("UPDATE chestor_autocode_runs SET workflow_delivered = 1 WHERE id = $1 AND workflow_delivered = 0 AND status IN ('succeeded', 'failed', 'cancelled')", {id})
    if err then return err end
    return nil
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
function repo.record_run_outcome(id: string, status: RunStatus, result: string, error_text: string, usage: Object, health: Object?, native: Object?): error?
    local usage_json, usage_err = encode_object(usage, "usage")
    if not usage_json then return usage_err end
    local stored_error, error_err = job_outcome.store_error(error_text, native)
    if not stored_error then return error_err end
    local health_json, health_err = encode_object(health or {}, "account health")
    if not health_json then return health_err end
    local _, err = execute([[UPDATE chestor_autocode_runs SET pending_status = $1, result = $2, error = $3, usage = $4, account_health = $5
        WHERE id = $6 AND status IN ('queued', 'running') AND pending_status = '']], {status, result, stored_error, usage_json, health_json, id})
    return err
end

-- finish_run settles a queued or running run and enrolls workflow delivery
-- in the same transaction; false means the run already has a terminal status.
function repo.finish_run(id: string, status: RunStatus, result: string, error_text: string, usage: Object, trace_context: Object?, native: Object?): (boolean?, error?)
    local usage_json, usage_err = encode_object(usage, "usage")
    if not usage_json then return nil, usage_err end
    local stored_error, error_err = job_outcome.store_error(error_text, native)
    if not stored_error then return nil, error_err end
    local settled = false
    local err = transaction({}, function(tx: sql.Transaction, dbtype: string): error?
        local changed, execute_err = tx:execute([[UPDATE chestor_autocode_runs SET status = $1, result = $2, error = $3, usage = $4,
            finished_at = $5 WHERE id = $6 AND status IN ('queued', 'running')]], {status, result, stored_error, usage_json, db.now(), id})
        if execute_err then return execute_err end
        settled = changed ~= nil and changed.rows_affected == 1
        if not settled then return nil end
        local rows, read_err = tx:query("SELECT owner_id AS owner_user_id, flow_dataflow_id FROM chestor_autocode_runs WHERE id = $1", {id})
        if read_err then return read_err end
        local row = rows and rows[1]
        if row and row.flow_dataflow_id ~= "" then
            local _, enqueue_err = jobs.enqueue_tx(tx, dbtype, {namespace = "chestor.autocode", scope = id, key = "resume",
                owner_locator = {kind = "user", id = row.owner_user_id}, job_type = "chestor.autocode.blocks:resume",
                slot = true, max_attempts = 5, trace_context = trace_context, immutable_payload = {run_id = id}})
            if enqueue_err then return enqueue_err end
        end
        return nil
    end)
    if err then return nil, err end
    return settled, nil
end

-- request_cancel marks an unsettled run; false means it already settled.
function repo.request_cancel(owner_user_id: string, id: string): (boolean?, error?)
    local marked = false
    local err = transaction({}, function(tx: sql.Transaction, engine: string): error?
        local changed, mark_err = tx:execute([[UPDATE chestor_autocode_runs SET cancel_requested = 1
            WHERE owner_id = $1 AND id = $2 AND status IN ('queued', 'running')]], {owner_user_id, id})
        if mark_err then return mark_err end
        marked = changed ~= nil and changed.rows_affected == 1
        if not marked then return nil end
        local rows, read_err = tx:query("SELECT timeout_ms FROM chestor_autocode_runs WHERE id = $1", {id})
        if not rows then return read_err end
        local columns: Columns = {row = rows[1] :: {[string]: unknown}}
        local timeout_ms = int(columns, "timeout_ms")
        if columns.problem then return columns.problem end
        local _, enqueue_err = jobs.enqueue_tx(tx, engine, {namespace = "chestor.autocode", scope = id, key = "run",
            owner_locator = {kind = "user", id = owner_user_id}, job_type = RUN_JOB, slot = true, demand = true,
            max_attempts = 2, immutable_payload = {run_id = id, max_execution_ms = timeout_ms + SETTLE_MARGIN_MS}})
        return enqueue_err
    end)
    if err then return nil, err end
    return marked, nil
end

return repo

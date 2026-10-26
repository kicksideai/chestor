-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")
local sql = require("sql")
local uuid = require("uuid")

type Object = db.Object
type Columns = db.Columns
type Identity = db.Identity
type Submission = db.Submission
type RunSpec = db.RunSpec
type RunStatus = db.RunStatus
type Run = db.Run
type Transactional = db.Transactional
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

-- Runs. Status moves queued -> running -> one terminal status; each
-- transition names the status it moves from.

local RUN_COLUMNS = [[id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id, flow_dataflow_id,
    flow_signal_id, options, unattended, repo_url, prompt, timeout_ms, status, result, error, usage, cancel_requested,
    created_at, started_at, finished_at]]

local function run(row: Columns): Run
    local status = text(row, "status")
    local dataflow_id = text(row, "flow_dataflow_id")
    local flow: FlowSignal? = nil
    if dataflow_id ~= "" then flow = {dataflow_id = dataflow_id, signal_id = text(row, "flow_signal_id")} end
    if status ~= "queued" and status ~= "running" and status ~= "succeeded" and status ~= "failed" and status ~= "cancelled" then
        mismatch(row, "status", "a run status")
        status = "failed"
    end
    return {id = text(row, "id"), owner_id = text(row, "owner_id"),
        identity = {actor_id = text(row, "actor_id"), actor_context = text(row, "actor_context")},
        agent = text(row, "agent"), account_id = text(row, "account_id"), image_id = text(row, "image_id"),
        workspace_id = optional(row, "workspace_id"), flow = flow, options = object(row, "options"),
        unattended = flag(row, "unattended"), repo_url = text(row, "repo_url"), prompt = text(row, "prompt"),
        timeout_ms = int(row, "timeout_ms"), status = status, result = text(row, "result"), error = text(row, "error"),
        usage = object(row, "usage"), cancel_requested = flag(row, "cancel_requested"), created_at = text(row, "created_at"),
        started_at = text(row, "started_at"), finished_at = text(row, "finished_at")}
end

function repo.runs(owner_id: string, limit: integer): ({Run}?, error?)
    local rows, err = query("SELECT " .. RUN_COLUMNS .. [[ FROM chestor_autocode_runs
        WHERE owner_id = $1 ORDER BY created_at DESC LIMIT $2]], {owner_id, limit})
    return decode(rows, err, run)
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

-- create_run reserves an account and records the run and its job in one transaction.
function repo.create_run(owner_id: string, identity: Identity, spec: RunSpec, work: (string) -> Transactional,
    submission: Submission?, candidates: {string}?): (string?, error?)
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
            local best: string? = nil
            local best_order = 0
            for _, account_id in ipairs(candidates or {spec.account_id}) do
                local _, seed_err = tx:execute([[INSERT INTO chestor_autocode_account_state (account_id) VALUES ($1) ON CONFLICT (account_id) DO NOTHING]], {account_id})
                if seed_err then return seed_err end
                local rows, read_err = tx:query("SELECT reservation_order, cooldown_until FROM chestor_autocode_account_state WHERE account_id = $1", {account_id})
                if read_err then return read_err end
                local state = rows and rows[1]
                if not state or type(state.reservation_order) ~= "number" or type(state.cooldown_until) ~= "string" then return fail("invalid account reservation state") end
                if state.cooldown_until <= now and (not best or state.reservation_order < best_order or (state.reservation_order == best_order and account_id < best)) then
                    best, best_order = account_id, state.reservation_order
                end
            end
            if not best then return errors.new({kind = errors.CONFLICT, message = "no account is available outside its cooldown"}) end
            local _, reserve_err = tx:execute("UPDATE chestor_autocode_account_state SET reservation_order = (SELECT generation FROM chestor_autocode_admission_lock WHERE id = 1) WHERE account_id = $1", {best})
            if reserve_err then return reserve_err end
            local _, insert_err = tx:execute([[INSERT INTO chestor_autocode_runs
                (id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id, flow_dataflow_id, flow_signal_id,
                 options, unattended, repo_url, prompt, timeout_ms, status, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'queued', $16)]],
                {id, owner_id, identity.actor_id, identity.actor_context, spec.agent, best, spec.image_id,
                    spec.workspace_id or "", spec.flow and spec.flow.dataflow_id or "", spec.flow and spec.flow.signal_id or "",
                    options, spec.unattended and 1 or 0, spec.repo_url, spec.prompt, spec.timeout_ms, now})
            if insert_err then return insert_err end
            if submission then
                local _, key_err = tx:execute("INSERT INTO chestor_autocode_submissions (owner_id, key, canonical, run_id) VALUES ($1, $2, $3, $4)",
                    {owner_id, submission.key, submission.canonical, id})
                if key_err then return key_err end
            end
            return work(id)(tx, dbtype)
        end)
    if err then return nil, err end
    return id, nil
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

-- finish_run settles a queued or running run in one transaction with `work`,
-- which enqueues the resume of a waiting workflow node; false means the run
-- had already settled and nothing was written.
function repo.finish_run(id: string, status: RunStatus, result: string, error_text: string, usage: Object,
    work: Transactional?): (boolean?, error?)
    local usage_json, usage_err = encode_object(usage, "usage")
    if not usage_json then return nil, usage_err end
    local settled = false
    local err = transaction({}, function(tx: sql.Transaction, dbtype: string): error?
        local changed, execute_err = tx:execute([[UPDATE chestor_autocode_runs SET status = $1, result = $2, error = $3, usage = $4,
            finished_at = $5 WHERE id = $6 AND status IN ('queued', 'running')]], {status, result, error_text, usage_json, db.now(), id})
        if execute_err then return execute_err end
        settled = changed ~= nil and changed.rows_affected == 1
        if settled and work then return work(tx, dbtype) end
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
    local rows, err = query([[SELECT id FROM chestor_autocode_runs WHERE finished_at <> '' AND finished_at < $1 AND (flow_dataflow_id = '' OR workflow_delivered = 1)
        ORDER BY finished_at LIMIT $2]], {before, limit})
    if err then return nil, err end
    local deleted = 0
    for _, row in ipairs(rows or {}) do
        local prune_err = transaction({
            {statement = "DELETE FROM chestor_autocode_run_events WHERE run_id = $1", params = {row.id}},
            {statement = "DELETE FROM chestor_autocode_submissions WHERE run_id = $1", params = {row.id}},
            {statement = "DELETE FROM chestor_autocode_runs WHERE id = $1", params = {row.id}},
        }, nil)
        if prune_err then return nil, prune_err end
        deleted = deleted + 1
    end
    return deleted, nil
end

return repo

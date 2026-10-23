-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Autocode storage: the module rows beside the account, image and workspace
-- components. Rows are decoded into named records where they leave the
-- database: JSON columns become lists and objects, integer flags become
-- booleans. Runs are scoped by owner_id; account state and image builds are
-- keyed by their component id.
local sql = require("sql")
local json = require("json")
local registry = require("registry")
local uuid = require("uuid")
local time = require("time")

-- The target_db requirement writes the host database resource ID here.
local DB_CONFIG = "chestor.autocode.persist:db_config"

type Object = {[string]: unknown}
type Row = {[string]: any}
type RunStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled"

-- An execution identity row (execution_identity.to_row): who submitted a run
-- or requested an image build; the worker resolves it again before it acts.
type Identity = {actor_id: string, actor_context: string}
-- The balancing state of an account: when a run last started on it, until
-- when a provider refusal keeps it out of balancing, and that refusal; the day
-- counts cover the last 24 hours of runs on it.
type AccountState = {last_used_at: string, cooldown_until: string, last_error: string, runs_day: integer, failures_day: integer}
-- "initial" uses a local copy of a registry reference when one exists;
-- "refresh" pulls it again.
type BuildMode = "initial" | "refresh"
type ImageBuild = {identity: Identity, mode: BuildMode, log: string, requested_at: string, finished_at: string}
-- flow: the workflow Flow and signal a run started by an agent task Block resumes.
type FlowSignal = {dataflow_id: string, signal_id: string}
type RunSpec = {agent: string, account_id: string, image_id: string, workspace_id: string?, flow: FlowSignal?,
    options: Object, unattended: boolean, repo_url: string, prompt: string, timeout_ms: integer}
type Run = {id: string, owner_id: string, identity: Identity, agent: string, account_id: string, image_id: string,
    workspace_id: string?, flow: FlowSignal?, options: Object, unattended: boolean, repo_url: string, prompt: string,
    timeout_ms: integer, status: RunStatus, result: string, error: string, usage: Object, cancel_requested: boolean,
    created_at: string, started_at: string, finished_at: string}
type RunEvent = {seq: integer, kind: string, text: string, created_at: string}
-- Work a write commits together with its rows, such as enqueueing a job.
type Transactional = (sql.Transaction, string) -> error?

local repo = {}

-- One page of a run's events after a sequence number.
repo.EVENTS_PAGE = 500

local function fail(message: string): error
    return errors.new({message = message, kind = errors.INTERNAL})
end

local function db_id(): (string?, error?)
    local entry, err = registry.get(DB_CONFIG)
    if err then return nil, err end
    local meta = entry and entry.meta
    local id = type(meta) == "table" and meta.db_id or nil
    if type(id) ~= "string" or id == "" then
        return nil, errors.new({message = DB_CONFIG .. " has no db_id; bind the target_db requirement", kind = errors.INVALID})
    end
    return id, nil
end

local function connect(): (sql.DB?, error?)
    local id, id_err = db_id()
    if not id then return nil, id_err end
    return sql.get(id)
end

local function query(statement: string, params: {unknown}): ({Row}?, error?)
    local db, err = connect()
    if not db then return nil, err end
    local rows, query_err = db:query(statement, params)
    db:release()
    return rows, query_err
end

-- execute reports how many rows a statement changed.
local function execute(statement: string, params: {unknown}): (integer?, error?)
    local db, err = connect()
    if not db then return nil, err end
    local result, execute_err = db:execute(statement, params)
    db:release()
    if execute_err then return nil, execute_err end
    return result and result.rows_affected or 0, nil
end

-- Column decoders read one row; the first value that is not what the schema
-- stores is recorded on the reader and fails the whole decode.
type Columns = {row: Row, problem: string?}

local function mismatch(columns: Columns, column: string, expected: string)
    if not columns.problem then columns.problem = "column " .. column .. " is not " .. expected end
end

local function text(columns: Columns, column: string): string
    local value = columns.row[column]
    if type(value) == "string" then return value end
    if value ~= nil then mismatch(columns, column, "text") end
    return ""
end

local function int(columns: Columns, column: string): integer
    local value = columns.row[column]
    if type(value) == "number" and value == math.floor(value) then return math.floor(value) end
    mismatch(columns, column, "an integer")
    return 0
end

local function flag(columns: Columns, column: string): boolean
    return int(columns, column) == 1
end

local function object(columns: Columns, column: string): Object
    local result: Object = {}
    local decoded = json.decode(text(columns, column))
    if type(decoded) ~= "table" then
        mismatch(columns, column, "a JSON object")
        return result
    end
    for key, value in pairs(decoded) do
        if type(key) == "string" then result[key] = value end
    end
    return result
end

local function optional(columns: Columns, column: string): string?
    local value = text(columns, column)
    if value == "" then return nil end
    return value
end

local function decode<T>(rows: {Row}?, err: error?, decoder: (Columns) -> T): ({T}?, error?)
    if err then return nil, err end
    local result: {T} = {}
    for _, row in ipairs(rows or {}) do
        local columns: Columns = {row = row, problem = nil}
        local record = decoder(columns)
        if columns.problem then return nil, fail(columns.problem) end
        result[#result + 1] = record
    end
    return result, nil
end

local function first<T>(rows: {Row}?, err: error?, decoder: (Columns) -> T): (T?, error?)
    local list, decode_err = decode(rows, err, decoder)
    if not list then return nil, decode_err end
    return list[1], nil
end

-- encode stores a list or object as JSON; an empty object stays an object.
local function encoded(value: unknown, column: string): (string?, error?)
    local result, err = json.encode(value)
    if type(result) ~= "string" then return nil, fail(column .. " is not JSON-encodable: " .. tostring(err)) end
    return result, nil
end

local function encode_object(value: Object, column: string): (string?, error?)
    if next(value) == nil then return "{}", nil end
    return encoded(value, column)
end

function repo.now(): string
    return time.now():utc():format_rfc3339()
end

function repo.db_id(): (string?, error?)
    return db_id()
end

-- transaction runs statements and `work` in one transaction.
local function transaction(statements: {{statement: string, params: {unknown}}}, work: Transactional?): error?
    local db, err = connect()
    if not db then return err end
    local dbtype, type_err = db:type()
    if type_err then db:release(); return type_err end
    local tx, begin_err = db:begin()
    if begin_err or not tx then db:release(); return begin_err end
    local function abort(cause: error?): error?
        local _, rollback_err = tx:rollback()
        db:release()
        if rollback_err then return errors.wrap(rollback_err, "autocode transaction rollback after " .. tostring(cause)) end
        return cause
    end
    for _, item in ipairs(statements) do
        local _, execute_err = tx:execute(item.statement, item.params)
        if execute_err then return abort(execute_err) end
    end
    if work then
        local work_err = work(tx, tostring(dbtype))
        if work_err then return abort(work_err) end
    end
    local _, commit_err = tx:commit()
    db:release()
    return commit_err
end

-- Account state.

local function account_state(row: Columns): AccountState
    return {last_used_at = text(row, "last_used_at"), cooldown_until = text(row, "cooldown_until"),
        last_error = text(row, "last_error"), runs_day = int(row, "runs_day"), failures_day = int(row, "failures_day")}
end

local function day_ago(): string
    return time.now():add("-24h"):utc():format_rfc3339()
end

-- account_states returns the state of each listed account; an account no run
-- has used yet has an empty state.
function repo.account_states(ids: {string}): ({[string]: AccountState}?, error?)
    local result: {[string]: AccountState} = {}
    if #ids == 0 then return result, nil end
    local marks: {string} = {}
    local params: {unknown} = {day_ago()}
    for index, id in ipairs(ids) do
        marks[#marks + 1] = "$" .. tostring(index + 1)
        params[#params + 1] = id
        result[id] = {last_used_at = "", cooldown_until = "", last_error = "", runs_day = 0, failures_day = 0}
    end
    local list = table.concat(marks, ", ")
    local rows, err = query([[SELECT ids.account_id, COALESCE(s.last_used_at, '') AS last_used_at,
        COALESCE(s.cooldown_until, '') AS cooldown_until, COALESCE(s.last_error, '') AS last_error,
        COALESCE(r.runs_day, 0) AS runs_day, COALESCE(r.failures_day, 0) AS failures_day
        FROM (SELECT account_id FROM chestor_autocode_account_state UNION SELECT account_id FROM chestor_autocode_runs) ids
        LEFT JOIN chestor_autocode_account_state s ON s.account_id = ids.account_id
        LEFT JOIN (SELECT account_id, COUNT(*) AS runs_day, SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failures_day
            FROM chestor_autocode_runs WHERE created_at >= $1 GROUP BY account_id) r ON r.account_id = ids.account_id
        WHERE ids.account_id IN (]] .. list .. ")", params)
    if err then return nil, err end
    for _, row in ipairs(rows or {}) do
        local columns: Columns = {row = row, problem = nil}
        local state = account_state(columns)
        if columns.problem then return nil, fail(columns.problem) end
        result[text(columns, "account_id")] = state
    end
    return result, nil
end

local UPSERT_STATE = [[INSERT INTO chestor_autocode_account_state (account_id, last_used_at, cooldown_until, last_error)
    VALUES ($1, $2, $3, $4) ON CONFLICT (account_id) DO UPDATE SET ]]

-- settle_account records how a run on the account ended: an empty refusal
-- clears the account's error; a cooldown keeps it out of balancing until then.
function repo.settle_account(account_id: string, refusal: string, cooldown_until: string): error?
    local _, err = execute(UPSERT_STATE .. "cooldown_until = excluded.cooldown_until, last_error = excluded.last_error",
        {account_id, "", cooldown_until, refusal})
    return err
end

-- clear_cooldown takes an account back into balancing.
function repo.clear_cooldown(account_id: string): error?
    local _, err = execute("UPDATE chestor_autocode_account_state SET cooldown_until = '' WHERE account_id = $1", {account_id})
    return err
end

function repo.delete_account_state(account_id: string): error?
    local _, err = execute("DELETE FROM chestor_autocode_account_state WHERE account_id = $1", {account_id})
    return err
end

-- Image builds. One row holds the latest build of an image: the identity and
-- mode it was requested with, then its log once it finished.

local function image_build(row: Columns): ImageBuild
    return {identity = {actor_id = text(row, "actor_id"), actor_context = text(row, "actor_context")},
        mode = text(row, "mode") == "refresh" and "refresh" or "initial", log = text(row, "log"),
        requested_at = text(row, "requested_at"), finished_at = text(row, "finished_at")}
end

function repo.image_build(image_id: string): (ImageBuild?, error?)
    local rows, err = query([[SELECT actor_id, actor_context, mode, log, requested_at, finished_at
        FROM chestor_autocode_image_builds WHERE image_id = $1]], {image_id})
    return first(rows, err, image_build)
end

-- request_image_build records a build request under `identity` in one
-- transaction with `work`, which enqueues the build job.
function repo.request_image_build(image_id: string, identity: Identity, mode: BuildMode, work: Transactional): error?
    return transaction({{statement = [[INSERT INTO chestor_autocode_image_builds
        (image_id, actor_id, actor_context, mode, log, requested_at, finished_at) VALUES ($1, $2, $3, $4, '', $5, '')
        ON CONFLICT (image_id) DO UPDATE SET actor_id = excluded.actor_id, actor_context = excluded.actor_context,
        mode = excluded.mode, log = '', requested_at = excluded.requested_at, finished_at = '']],
        params = {image_id, identity.actor_id, identity.actor_context, mode, repo.now()}}}, work)
end

function repo.finish_image_build(image_id: string, log: string): error?
    local _, err = execute("UPDATE chestor_autocode_image_builds SET log = $1, finished_at = $2 WHERE image_id = $3",
        {log, repo.now(), image_id})
    return err
end

function repo.delete_image_build(image_id: string): error?
    local _, err = execute("DELETE FROM chestor_autocode_image_builds WHERE image_id = $1", {image_id})
    return err
end

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

-- create_run records a queued run and marks its account used in one
-- transaction with `work`, which enqueues the run's job.
function repo.create_run(owner_id: string, identity: Identity, spec: RunSpec, work: (string) -> Transactional): (string?, error?)
    local id = uuid.v7()
    local options, options_err = encode_object(spec.options, "options")
    if not options then return nil, options_err end
    local now = repo.now()
    local err = transaction({
        {statement = [[INSERT INTO chestor_autocode_runs
            (id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id, flow_dataflow_id, flow_signal_id,
             options, unattended, repo_url, prompt, timeout_ms, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'queued', $16)]],
         params = {id, owner_id, identity.actor_id, identity.actor_context, spec.agent, spec.account_id, spec.image_id,
            spec.workspace_id or "", spec.flow and spec.flow.dataflow_id or "", spec.flow and spec.flow.signal_id or "",
            options, spec.unattended and 1 or 0, spec.repo_url, spec.prompt, spec.timeout_ms, now}},
        {statement = UPSERT_STATE .. "last_used_at = excluded.last_used_at", params = {spec.account_id, now, "", ""}},
    }, work(id))
    if err then return nil, err end
    return id, nil
end

function repo.start_run(id: string): (boolean?, error?)
    local changed, err = execute("UPDATE chestor_autocode_runs SET status = 'running', started_at = $1 WHERE id = $2 AND status = 'queued'",
        {repo.now(), id})
    if err then return nil, err end
    return changed == 1, nil
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
            finished_at = $5 WHERE id = $6 AND status IN ('queued', 'running')]], {status, result, error_text, usage_json, repo.now(), id})
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
    local rows, err = query([[SELECT id FROM chestor_autocode_runs WHERE finished_at <> '' AND finished_at < $1
        ORDER BY finished_at LIMIT $2]], {before, limit})
    if err then return nil, err end
    local deleted = 0
    for _, row in ipairs(rows or {}) do
        local prune_err = transaction({
            {statement = "DELETE FROM chestor_autocode_run_events WHERE run_id = $1", params = {row.id}},
            {statement = "DELETE FROM chestor_autocode_runs WHERE id = $1", params = {row.id}},
        }, nil)
        if prune_err then return nil, prune_err end
        deleted = deleted + 1
    end
    return deleted, nil
end

-- Run events: an append-only, per-run ordered log.

local function event(row: Columns): RunEvent
    return {seq = int(row, "seq"), kind = text(row, "kind"), text = text(row, "text"), created_at = text(row, "created_at")}
end

function repo.append_event(run_id: string, seq: integer, kind: string, body: string): error?
    local _, err = execute("INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text, created_at) VALUES ($1, $2, $3, $4, $5)",
        {run_id, seq, kind, body, repo.now()})
    return err
end

-- next_seq is the sequence number after the run's last event, so a later
-- runner attempt appends after what an earlier one recorded.
function repo.next_seq(run_id: string): (integer?, error?)
    local rows, err = query("SELECT COALESCE(MAX(seq), 0) AS seq FROM chestor_autocode_run_events WHERE run_id = $1", {run_id})
    if err then return nil, err end
    local value = rows and rows[1] and tonumber(rows[1].seq) or 0
    return math.floor(value) + 1, nil
end

function repo.events(run_id: string, after_seq: integer): ({RunEvent}?, error?)
    local rows, err = query([[SELECT seq, kind, text, created_at FROM chestor_autocode_run_events
        WHERE run_id = $1 AND seq > $2 ORDER BY seq LIMIT $3]], {run_id, after_seq, repo.EVENTS_PAGE})
    return decode(rows, err, event)
end

return repo

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Autocode storage: the module rows beside the account, image and workspace
-- components. Rows are decoded into named records where they leave the
-- database: JSON columns become lists and objects, integer flags become
-- booleans. Runs are scoped by owner_id; account state and image builds are
-- keyed by their component id.
local sql = require("sql")
local json = require("json")
local registry = require("registry")
local time = require("time")

-- The target_db requirement writes the host database resource ID here.
local DB_CONFIG = "chestor.autocode.persist:db_config"

type Object = {[string]: unknown}
type Row = {[string]: unknown}
type RunStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled"

-- An execution identity row (execution_identity.to_row): who submitted a run
-- or requested an image build; the worker resolves it again before it acts.
type Identity = {actor_id: string, actor_context: string}
-- The balancing state of an account: when a run last started on it, until
-- when a provider refusal keeps it out of balancing, and that refusal; the day
-- counts cover the last 24 hours of runs on it.
type AccountState = {reservation_order: integer, last_used_at: string, cooldown_until: string, last_error: string, runs_day: integer, failures_day: integer}
-- "initial" uses a local copy of a registry reference when one exists;
-- "refresh" pulls it again.
type BuildMode = "initial" | "refresh"
type ImageBuild = {identity: Identity, mode: BuildMode, log: string, requested_at: string, finished_at: string,
    build_id: string, status: string, agents: {string}, last_error: string, projected: boolean}
type Submission = {key: string, canonical: string}
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
    mismatch(columns, column, "text")
    return ""
end

local function int(columns: Columns, column: string): integer
    local value = columns.row[column]
    if type(value) == "number" and value == math.floor(value) then return math.floor(value) end
    mismatch(columns, column, "an integer")
    return 0
end

local function flag(columns: Columns, column: string): boolean
    local value = int(columns, column)
    if value ~= 0 and value ~= 1 then mismatch(columns, column, "a boolean flag") end
    return value == 1
end

local function object(columns: Columns, column: string): Object
    local result: Object = {}
    local decoded = json.decode(text(columns, column))
    if type(decoded) ~= "table" then
        mismatch(columns, column, "a JSON object")
        return result
    end
    for key, value in pairs(decoded) do
        if type(key) ~= "string" then mismatch(columns, column, "a JSON object")
        else result[key] = value end
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
    if begin_err or not tx then db:release(); return begin_err or fail("database returned no transaction") end
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


repo.fail = fail
repo.query = query
repo.execute = execute
repo.mismatch = mismatch
repo.text = text
repo.int = int
repo.flag = flag
repo.object = object
repo.optional = optional
repo.decode = decode
repo.first = first
repo.encoded = encoded
repo.encode_object = encode_object
repo.transaction = transaction
return repo

local db = require("db")
local json = require("json")

-- The assembly ledger. One row per on-demand recompute, carrying the same
-- queued/dispatched vocabulary the graph maintenance intents use plus the
-- accounting a reader needs to see what the run changed.
local M = {}

M.STATUS = {
    QUEUED = "queued",
    DISPATCHED = "dispatched",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
}

M.ACTIVE_STATUS = {
    [M.STATUS.QUEUED] = true,
    [M.STATUS.DISPATCHED] = true,
    [M.STATUS.RUNNING] = true,
}

local function decode(row: any): any
    if not row then return nil end
    local value = row :: any
    return {
        run_id = tostring(value.run_id),
        graph_id = tostring(value.graph_id),
        status = tostring(value.status),
        events_replayed = tonumber(value.events_replayed) or 0,
        edges_added = tonumber(value.edges_added) or 0,
        edges_removed = tonumber(value.edges_removed) or 0,
        suggested_added = tonumber(value.suggested_added) or 0,
        suggested_removed = tonumber(value.suggested_removed) or 0,
        candidates_judged = tonumber(value.candidates_judged) or 0,
        model = value.model,
        refine_error = value.refine_error,
        error = value.error,
        started_at = tonumber(value.started_at) or 0,
        finished_at = tonumber(value.finished_at),
        running = M.ACTIVE_STATUS[tostring(value.status)] == true,
    }
end

function M.enqueue(handle: any, journal_id: string, graph_id: string, run_id: string,
    execution_identity: any): error?
    local now = db.now()
    return db.exec(handle, [[
        INSERT INTO chestor_journal_graph_assembly
            (journal_id, run_id, graph_id, status, execution_identity, started_at, updated_at)
        VALUES (?, ?, ?, 'queued', ?, ?, ?)
        ON CONFLICT(journal_id, run_id) DO NOTHING
    ]], { journal_id, run_id, graph_id, db.encode(execution_identity, {}), now, now })
end

function M.get(handle: any, journal_id: string, run_id: string): (any?, error?)
    local rows, err = db.query(handle,
        "SELECT * FROM chestor_journal_graph_assembly WHERE journal_id = ? AND run_id = ?",
        { journal_id, run_id })
    if err then return nil, err end
    return decode(rows and rows[1]), nil
end

-- The run a reader means when they ask what the map's last assembly did: the
-- newest one for this graph, running or finished.
function M.latest(handle: any, journal_id: string, graph_id: string): (any?, error?)
    local rows, err = db.query(handle, [[
        SELECT * FROM chestor_journal_graph_assembly
         WHERE journal_id = ? AND graph_id = ?
         ORDER BY started_at DESC, run_id DESC LIMIT 1
    ]], { journal_id, graph_id })
    if err then return nil, err end
    return decode(rows and rows[1]), nil
end

function M.active(handle: any, journal_id: string, graph_id: string): (any?, error?)
    local rows, err = db.query(handle, [[
        SELECT * FROM chestor_journal_graph_assembly
         WHERE journal_id = ? AND graph_id = ? AND status IN ('queued', 'dispatched', 'running')
         ORDER BY started_at DESC, run_id DESC LIMIT 1
    ]], { journal_id, graph_id })
    if err then return nil, err end
    return decode(rows and rows[1]), nil
end

function M.identity(handle: any, journal_id: string, run_id: string): (any?, error?)
    local rows, err = db.query(handle,
        "SELECT graph_id, execution_identity FROM chestor_journal_graph_assembly WHERE journal_id = ? AND run_id = ?",
        { journal_id, run_id })
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return nil, errors.new({ kind = errors.NOT_FOUND, message = "assembly run not found" }) end
    local identity, decode_err = json.decode(tostring(row.execution_identity or ""))
    if decode_err or type(identity) ~= "table" then
        return nil, errors.new({ kind = errors.INVALID, message = "invalid assembly execution identity: " .. tostring(decode_err) })
    end
    return { graph_id = tostring(row.graph_id), row = identity }, nil
end

function M.mark(handle: any, journal_id: string, run_id: string, status: string): error?
    local previous: string
    if status == M.STATUS.DISPATCHED then previous = "status = 'queued'"
    elseif status == M.STATUS.RUNNING then previous = "status IN ('queued', 'dispatched')"
    else return errors.new({ kind = errors.INVALID, message = "unsupported assembly transition: " .. status }) end
    return db.exec(handle, [[
        UPDATE chestor_journal_graph_assembly SET status = ?, updated_at = ?
         WHERE journal_id = ? AND run_id = ? AND ]] .. previous,
        { status, db.now(), journal_id, run_id })
end

function M.complete(handle: any, journal_id: string, run_id: string, summary: any): error?
    local value = type(summary) == "table" and summary or {}
    local now = db.now()
    return db.exec(handle, [[
        UPDATE chestor_journal_graph_assembly
           SET status = 'completed', events_replayed = ?, edges_added = ?, edges_removed = ?,
               suggested_added = ?, suggested_removed = ?, candidates_judged = ?,
               model = ?, refine_error = ?, error = NULL, finished_at = ?, updated_at = ?
         WHERE journal_id = ? AND run_id = ?
    ]], {
        math.floor(tonumber((value :: any).events_replayed) or 0),
        math.floor(tonumber((value :: any).edges_added) or 0),
        math.floor(tonumber((value :: any).edges_removed) or 0),
        math.floor(tonumber((value :: any).suggested_added) or 0),
        math.floor(tonumber((value :: any).suggested_removed) or 0),
        math.floor(tonumber((value :: any).candidates_judged) or 0),
        (value :: any).model, (value :: any).refine_error, now, now, journal_id, run_id,
    })
end

function M.fail(handle: any, journal_id: string, run_id: string, message: string): error?
    local now = db.now()
    return db.exec(handle, [[
        UPDATE chestor_journal_graph_assembly
           SET status = 'failed', error = ?, finished_at = ?, updated_at = ?
         WHERE journal_id = ? AND run_id = ?
    ]], { message, now, now, journal_id, run_id })
end

return M

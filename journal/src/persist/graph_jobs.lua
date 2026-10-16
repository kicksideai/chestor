local db = require("db")

local M = {}

function M.enqueue(tx: any, journal_id: string, graph_id: string, source_from_seq: number,
    source_to_seq: number, config_revision: number, trigger_key: string, execution_identity: any): error?
    local job_id = "graph-maint:" .. graph_id .. ":" .. tostring(config_revision) .. ":" .. trigger_key
    local now = db.now()
    -- The job identity IS the trigger band (job_id carries trigger_key): a
    -- re-trigger of the same pressure band over a newer seq window is the same
    -- job and must dedupe on the primary key; conflicting on the seq-window
    -- constraint lets the same band violate the PK and kill the projection.
    return db.exec(tx, [[
        INSERT INTO chestor_journal_graph_jobs
            (journal_id, job_id, graph_id, source_from_seq, source_to_seq, config_revision,
             status, execution_identity, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'queued', ?, ?, ?)
        ON CONFLICT(journal_id, job_id) DO NOTHING
    ]], {
        journal_id, job_id, graph_id, source_from_seq, source_to_seq, config_revision,
        db.encode(execution_identity, {}), now, now,
    })
end

function M.latest_source_seq(handle: any, journal_id: string, graph_id: string): (number?, error?)
    local rows, err = db.query(handle, [[
        SELECT MAX(source_to_seq) AS source_to_seq FROM chestor_journal_graph_jobs
         WHERE journal_id = ? AND graph_id = ?
    ]], { journal_id, graph_id })
    if err then return nil, err end
    return tonumber(rows and rows[1] and rows[1].source_to_seq) or 0, nil
end

function M.get(handle: any, journal_id: string, job_id: string): (any?, error?)
    local rows, err = db.query(handle,
        "SELECT * FROM chestor_journal_graph_jobs WHERE journal_id = ? AND job_id = ?",
        { journal_id, job_id })
    if err then return nil, err end
    local row = rows and rows[1]
    if row then row.execution_identity = db.decode(row.execution_identity, {}) end
    return row, nil
end

function M.pending(handle: any, journal_id: string, limit: number): (any?, error?)
    local rows, err = db.query(handle, [[
        SELECT * FROM chestor_journal_graph_jobs
         WHERE journal_id = ? AND status = 'queued'
         ORDER BY created_at ASC LIMIT ?
    ]], { journal_id, math.max(1, math.min(limit, 100)) })
    if err then return nil, err end
    for _, row in ipairs(rows or {}) do row.execution_identity = db.decode(row.execution_identity, {}) end
    return rows or {}, nil
end

function M.counts(handle: any, journal_id: string): (any?, error?)
    local rows, err = db.query(handle, [[
        SELECT status, COUNT(*) AS n FROM chestor_journal_graph_jobs
         WHERE journal_id = ? GROUP BY status
    ]], { journal_id })
    if err then return nil, err end
    local out: any = { queued = 0, dispatched = 0, completed = 0 }
    for _, row in ipairs(rows or {}) do
        out[tostring((row :: any).status)] = tonumber((row :: any).n) or 0
    end
    return out, nil
end

function M.mark_dispatched(handle: any, journal_id: string, job_id: string): error?
    return db.exec(handle, [[
        UPDATE chestor_journal_graph_jobs
           SET status = 'dispatched', updated_at = ?
         WHERE journal_id = ? AND job_id = ?
           AND status = 'queued'
    ]], { db.now(), journal_id, job_id })
end

function M.complete(handle: any, journal_id: string, job_id: string): error?
    return db.exec(handle, [[
        UPDATE chestor_journal_graph_jobs
           SET status = 'completed', updated_at = ?
         WHERE journal_id = ? AND job_id = ?
    ]], { db.now(), journal_id, job_id })
end

return M

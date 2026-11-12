-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")

type Columns = db.Columns
type RunEvent = db.RunEvent
local query = db.query
local text = db.text
local int = db.int
local decode = db.decode
local repo = {}

-- Run events: an append-only, per-run ordered log.

local function event(row: Columns): RunEvent
    return {seq = int(row, "seq"), kind = text(row, "kind"), text = text(row, "text"), created_at = text(row, "created_at")}
end

function repo.append_event(run_id: string, kind: string, body: string): error?
    return db.transaction({}, function(tx: sql.Transaction): error?
        local _, lock_err = tx:execute("UPDATE chestor_autocode_runs SET id = id WHERE id = $1", {run_id})
        if lock_err then return lock_err end
        local _, insert_err = tx:execute([[INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text, created_at)
            SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM chestor_autocode_run_events WHERE run_id = $1]], {run_id, kind, body, db.now()})
        return insert_err
    end)
end

function repo.events(run_id: string, after_seq: integer, limit: integer?, before_seq: integer?): ({RunEvent}?, error?)
    if before_seq ~= nil then
        local rows, err = query([[SELECT seq, kind, text, created_at FROM chestor_autocode_run_events
            WHERE run_id = $1 AND ($2 = 0 OR seq < $2) ORDER BY seq DESC LIMIT $3]], {run_id, before_seq, limit or db.EVENTS_PAGE})
        return decode(rows, err, event)
    end
    local rows, err = query([[SELECT seq, kind, text, created_at FROM chestor_autocode_run_events
        WHERE run_id = $1 AND seq > $2 ORDER BY seq LIMIT $3]], {run_id, after_seq, limit or db.EVENTS_PAGE})
    return decode(rows, err, event)
end

return repo

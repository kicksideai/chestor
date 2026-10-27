-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")

type Columns = db.Columns
type RunEvent = db.RunEvent
local fail = db.fail
local query = db.query
local execute = db.execute
local text = db.text
local int = db.int
local decode = db.decode
local repo = {}

-- Run events: an append-only, per-run ordered log.

local function event(row: Columns): RunEvent
    return {seq = int(row, "seq"), kind = text(row, "kind"), text = text(row, "text"), created_at = text(row, "created_at")}
end

function repo.append_event(run_id: string, seq: integer, kind: string, body: string): error?
    local _, err = execute("INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text, created_at) VALUES ($1, $2, $3, $4, $5)",
        {run_id, seq, kind, body, db.now()})
    return err
end

-- next_seq is the sequence number after the run's last event, so a later
-- runner attempt appends after what an earlier one recorded.
function repo.next_seq(run_id: string): (integer?, error?)
    local rows, err = query("SELECT COALESCE(MAX(seq), 0) AS seq FROM chestor_autocode_run_events WHERE run_id = $1", {run_id})
    if err then return nil, err end
    local value = rows and rows[1] and rows[1].seq or 0
    if type(value) ~= "number" then return nil, fail("invalid event sequence") end
    return math.floor(value) + 1, nil
end

function repo.events(run_id: string, after_seq: integer, limit: integer?): ({RunEvent}?, error?)
    local rows, err = query([[SELECT seq, kind, text, created_at FROM chestor_autocode_run_events
        WHERE run_id = $1 AND seq > $2 ORDER BY seq LIMIT $3]], {run_id, after_seq, limit or db.EVENTS_PAGE})
    return decode(rows, err, event)
end

return repo

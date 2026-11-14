-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")
local settings = require("settings")

type Columns = db.Columns
type RunEvent = db.RunEvent
local query = db.query
local text = db.text
local int = db.int
local decode = db.decode
local repo = {}

-- Run events keep their first line and a rolling tail; surviving sequences never change.

local function event(row: Columns): RunEvent
    return {seq = int(row, "seq"), kind = text(row, "kind"), text = text(row, "text"), created_at = text(row, "created_at")}
end

local NOTICE = "Run event history truncated: keeping the first event and a rolling tail. The run result and usage are retained separately."

-- Do not cut a multi-byte UTF-8 character at the byte ceiling.
local function clip(value: string, limit: integer): string
    if #value <= limit then return value end
    while limit > 0 do
        local next_byte = value:byte(limit + 1)
        if not next_byte or next_byte < 128 or next_byte >= 192 then break end
        limit = limit - 1
    end
    return value:sub(1, limit)
end

function repo.append_event(run_id: string, kind: string, body: string): error?
    local max_count, max_bytes, setting_err = settings.event_limits()
    if not max_count or not max_bytes then return setting_err end
    kind = clip(kind, 64)
    body = clip(body, math.min(8192, max_bytes // 4) - #kind)
    return db.transaction({}, function(tx: sql.Transaction, engine: string): error?
        local locked, lock_err = tx:execute("UPDATE chestor_autocode_runs SET id = id WHERE id = $1", {run_id})
        if lock_err then return lock_err end
        if not locked or locked.rows_affected == 0 then
            return errors.new({kind = errors.NOT_FOUND, message = "run no longer exists"})
        end
        local rows, read_err = tx:query("SELECT event_count, event_bytes, event_notice_seq FROM chestor_autocode_runs WHERE id = $1", {run_id})
        if not rows then return read_err end
        local columns: Columns = {row = rows[1]}
        local count, bytes = int(columns, "event_count"), int(columns, "event_bytes")
        local notice = int(columns, "event_notice_seq")
        if columns.problem then return columns.problem end
        if notice == 0 and (count + 1 > max_count or bytes + #kind + #body > max_bytes) then
            local sequence, seq_err = tx:query("SELECT COALESCE(MAX(seq), 0) + 1 AS seq FROM chestor_autocode_run_events WHERE run_id = $1", {run_id})
            if not sequence then return seq_err end
            local next_seq: Columns = {row = sequence[1]}
            notice = int(next_seq, "seq")
            if next_seq.problem then return next_seq.problem end
            local _, notice_err = tx:execute("INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text, created_at) VALUES ($1, $2, 'system', $3, $4)", {run_id, notice, NOTICE, db.now()})
            if notice_err then return notice_err end
            count, bytes = count + 1, bytes + #NOTICE + #"system"
        end
        local _, insert_err = tx:execute([[INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text, created_at)
            SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM chestor_autocode_run_events WHERE run_id = $1]], {run_id, kind, body, db.now()})
        if insert_err then return insert_err end
        count, bytes = count + 1, bytes + #kind + #body
        if count > max_count or bytes > max_bytes then
            -- Keep the first event and the single permanent notice.
            -- Release an eighth of the budget per rollover to amortize metadata reads.
            local head, head_err = tx:query("SELECT text, kind FROM chestor_autocode_run_events WHERE run_id = $1 AND seq = 1", {run_id})
            if not head then return head_err end
            local first: Columns = {row = head[1]}
            local head_kind = clip(text(first, "kind"), 64)
            local head_text = clip(text(first, "text"), max_bytes // 4 - #head_kind)
            if first.problem then return first.problem end
            local _, head_write_err = tx:execute("UPDATE chestor_autocode_run_events SET kind = $1, text = $2 WHERE run_id = $3 AND seq = 1", {head_kind, head_text, run_id})
            if head_write_err then return head_write_err end
            local size = engine == "postgres" and "OCTET_LENGTH(kind) + OCTET_LENGTH(text)" or "LENGTH(CAST(kind AS BLOB)) + LENGTH(CAST(text AS BLOB))"
            local tail, tail_err = tx:query("SELECT seq, " .. size .. " AS bytes FROM chestor_autocode_run_events WHERE run_id = $1 AND seq > 1 AND seq <> $2 ORDER BY seq DESC LIMIT $3", {run_id, notice, math.max(1, max_count * 7 // 8 - 2)})
            if not tail then return tail_err end
            local room = max_bytes * 7 // 8 - #head_kind - #head_text - #NOTICE - #"system"
            local cutoff = 0
            for _, row in ipairs(tail) do
                local item: Columns = {row = row}
                local length, seq = int(item, "bytes"), int(item, "seq")
                if item.problem then return item.problem end
                if length > room then break end
                room, cutoff = room - length, seq
            end
            if cutoff == 0 then return db.fail("run event tail does not fit the budget") end
            local _, trim_err = tx:execute("DELETE FROM chestor_autocode_run_events WHERE run_id = $1 AND seq > 1 AND seq <> $2 AND seq < $3", {run_id, notice, cutoff})
            if trim_err then return trim_err end
            local totals, totals_err = tx:query("SELECT COUNT(*) AS count, COALESCE(SUM(" .. size .. "), 0) AS bytes FROM chestor_autocode_run_events WHERE run_id = $1", {run_id})
            if not totals then return totals_err end
            local total: Columns = {row = totals[1]}
            count, bytes = int(total, "count"), int(total, "bytes")
            if total.problem then return total.problem end
        end
        local _, count_err = tx:execute("UPDATE chestor_autocode_runs SET event_count = $1, event_bytes = $2, event_notice_seq = $3 WHERE id = $4", {count, bytes, notice, run_id})
        return count_err
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

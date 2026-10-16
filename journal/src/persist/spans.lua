local db = require("db")
local types = require("types")

-- Work spans are the episodes an identity's durable position lived through.
-- The cursor row stays the single position per identity; a span is one bounded
-- stretch of that identity's activity, opened by its first write, extended by
-- every fact it stamps, and sealed at its last activity once it goes quiet.
-- Every read here is keyset-paginated on (last_activity_at, span_id) so a
-- journal with hundreds of agents and thousands of spans pages truthfully.
local M = {}

local STATE = { open = true, sealed = true }

local function bounded(value: any, fallback: number, maximum: number): number
    return math.max(1, math.min(math.floor(tonumber(value) or fallback), maximum))
end

local function decode_row(row: any): any
    if type(row) ~= "table" then return row end
    row.started_seq = tonumber(row.started_seq) or 0
    row.last_seq = tonumber(row.last_seq) or 0
    row.fact_count = tonumber(row.fact_count) or 0
    row.started_at = tonumber(row.started_at) or 0
    row.last_activity_at = tonumber(row.last_activity_at) or 0
    row.ended_at = tonumber(row.ended_at)
    return row
end

function M.get(dbh: any, journal_id: string, span_id: string): (any?, error?)
    local id = db.trim(span_id)
    if id == "" then return nil, nil end
    local rows, err = db.query(dbh,
        "SELECT * FROM chestor_journal_spans WHERE journal_id = ? AND span_id = ? LIMIT 1",
        { journal_id, id })
    if err then return nil, err end
    return rows and rows[1] and decode_row(rows[1]) or nil, nil
end

-- The open span a cursor is currently inside. Concurrent first writes can race
-- two rows open; the newest one wins and the idle sweep seals the loser, so a
-- span never blocks the write it belongs to.
function M.open_for_cursor(dbh: any, journal_id: string, cursor_id: string): (any?, error?)
    local rows, err = db.query(dbh, [[
        SELECT * FROM chestor_journal_spans
         WHERE journal_id = ? AND cursor_id = ? AND state = 'open'
         ORDER BY last_activity_at DESC, span_id DESC LIMIT 1
    ]], { journal_id, db.trim(cursor_id) })
    if err then return nil, err end
    return rows and rows[1] and decode_row(rows[1]) or nil, nil
end

-- The open span behind each cursor on a page, in one query, so a presence roll
-- costs the same whether it carries three positions or two hundred.
function M.open_for_cursors(dbh: any, journal_id: string, cursor_ids: { string }): (any?, error?)
    local wanted: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, value in ipairs(cursor_ids or {}) do
        local id = db.trim(value)
        if id ~= "" and not seen[id] then
            seen[id] = true
            wanted[#wanted + 1] = id
        end
    end
    local out: any = {}
    if #wanted == 0 then return out, nil end
    local marks: { string } = {}
    local params: { any } = { journal_id }
    for _, id in ipairs(wanted) do
        marks[#marks + 1] = "?"
        params[#params + 1] = id
    end
    local rows, err = db.query(dbh, [[
        SELECT * FROM chestor_journal_spans
         WHERE journal_id = ? AND cursor_id IN (]] .. table.concat(marks, ",") .. [[)
           AND state = 'open'
         ORDER BY last_activity_at ASC, span_id ASC
    ]], params)
    if err then return nil, err end
    for _, row in ipairs(rows or {}) do
        out[db.trim((row :: any).cursor_id)] = decode_row(row)
    end
    return out, nil
end

function M.insert(dbh: any, journal_id: string, span: any): error?
    local now = db.now()
    return db.exec(dbh, [[
        INSERT INTO chestor_journal_spans
            (journal_id, span_id, agent_id, cursor_id, origin, state, purpose, purpose_kind,
             purpose_task_id, purpose_graph_id, purpose_node_id, started_seq, last_seq,
             fact_count, started_at, last_activity_at, ended_at, closed_reason)
        VALUES (?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NULL, NULL)
        ON CONFLICT(journal_id, span_id) DO NOTHING
    ]], {
        journal_id, db.trim((span :: any).span_id), db.trim((span :: any).agent_id),
        db.trim((span :: any).cursor_id),
        db.trim((span :: any).origin) ~= "" and db.trim((span :: any).origin) or "auto",
        db.trim((span :: any).purpose) ~= "" and db.trim((span :: any).purpose) or nil,
        db.trim((span :: any).purpose_kind) ~= "" and db.trim((span :: any).purpose_kind) or "none",
        db.trim((span :: any).purpose_task_id) ~= "" and db.trim((span :: any).purpose_task_id) or nil,
        db.trim((span :: any).purpose_graph_id) ~= "" and db.trim((span :: any).purpose_graph_id) or nil,
        db.trim((span :: any).purpose_node_id) ~= "" and db.trim((span :: any).purpose_node_id) or nil,
        math.max(0, math.floor(tonumber((span :: any).started_seq) or 0)),
        math.max(0, math.floor(tonumber((span :: any).started_seq) or 0)),
        now, now,
    })
end

-- An identity that names what it is working on while its span is already open
-- records the purpose on the span it is in; the first purpose stands unless a
-- later write names a different one.
function M.set_purpose(dbh: any, journal_id: string, span_id: string, purpose: any): error?
    return db.exec(dbh, [[
        UPDATE chestor_journal_spans
           SET purpose = ?, purpose_kind = ?, purpose_task_id = ?, purpose_graph_id = ?, purpose_node_id = ?
         WHERE journal_id = ? AND span_id = ? AND state = 'open'
    ]], {
        db.trim((purpose :: any).purpose) ~= "" and db.trim((purpose :: any).purpose) or nil,
        db.trim((purpose :: any).purpose_kind) ~= "" and db.trim((purpose :: any).purpose_kind) or "none",
        db.trim((purpose :: any).purpose_task_id) ~= "" and db.trim((purpose :: any).purpose_task_id) or nil,
        db.trim((purpose :: any).purpose_graph_id) ~= "" and db.trim((purpose :: any).purpose_graph_id) or nil,
        db.trim((purpose :: any).purpose_node_id) ~= "" and db.trim((purpose :: any).purpose_node_id) or nil,
        journal_id, db.trim(span_id),
    })
end

-- Activity, like position, only moves forward. The counted fact is the append
-- that earned a new watermark, so replayed or position-only touches at the
-- same seq extend the span's clock without inflating its fact count.
function M.touch(dbh: any, journal_id: string, span_id: string, seq: number): error?
    local watermark = math.max(0, math.floor(tonumber(seq) or 0))
    return db.exec(dbh, [[
        UPDATE chestor_journal_spans
           SET last_seq = CASE WHEN ? > last_seq THEN ? ELSE last_seq END,
               fact_count = CASE WHEN ? > last_seq THEN fact_count + 1 ELSE fact_count END,
               last_activity_at = ?
         WHERE journal_id = ? AND span_id = ? AND state = 'open'
    ]], { watermark, watermark, watermark, db.now(), journal_id, db.trim(span_id) })
end

-- The spans a sweep would close, oldest activity first. Reading the candidates
-- and closing them are two statements with a gap between them, so they are two
-- functions: the gap is where a write revives a span, and seal_candidates
-- carries the idle predicate that decides the revived one is no longer its
-- business.
function M.idle_candidates(dbh: any, journal_id: string, idle_before: number,
    requested_limit: number?): (any?, error?)
    local limit = bounded(requested_limit, types.SPAN.SWEEP_LIMIT, 1000)
    local rows, err = db.query(dbh, [[
        SELECT span_id FROM chestor_journal_spans
         WHERE journal_id = ? AND state = 'open' AND last_activity_at <= ?
         ORDER BY last_activity_at ASC, span_id ASC LIMIT ?
    ]], { journal_id, math.floor(tonumber(idle_before) or 0), limit })
    if err then return nil, err end
    local candidates: { string } = {}
    for _, row in ipairs(rows or {}) do
        local span_id = db.trim((row :: any).span_id)
        if span_id ~= "" then candidates[#candidates + 1] = span_id end
    end
    return { candidates = candidates, limit = limit }, nil
end

function M.seal_candidates(dbh: any, journal_id: string, idle_before: number,
    candidates: { string }, limit: number): (any?, error?)
    local threshold = math.floor(tonumber(idle_before) or 0)
    local marks: { string } = {}
    for _ in ipairs(candidates or {}) do marks[#marks + 1] = "?" end
    if #marks == 0 then return { sealed = {}, count = 0, saturated = false }, nil end
    local list = table.concat(marks, ",")
    local seal_params: { any } = { journal_id, threshold }
    for _, span_id in ipairs(candidates) do seal_params[#seal_params + 1] = span_id end
    local seal_err = db.exec(dbh, [[
        UPDATE chestor_journal_spans
           SET state = 'sealed', ended_at = last_activity_at, closed_reason = 'idle'
         WHERE journal_id = ? AND state = 'open' AND last_activity_at <= ?
           AND span_id IN (]] .. list .. [[)
    ]], seal_params)
    if seal_err then return nil, seal_err end
    local confirm_params: { any } = { journal_id, threshold }
    for _, span_id in ipairs(candidates) do confirm_params[#confirm_params + 1] = span_id end
    local closed, closed_err = db.query(dbh, [[
        SELECT span_id FROM chestor_journal_spans
         WHERE journal_id = ? AND state = 'sealed' AND closed_reason = 'idle'
           AND ended_at <= ? AND span_id IN (]] .. list .. [[)
         ORDER BY ended_at ASC, span_id ASC
    ]], confirm_params)
    if closed_err then return nil, closed_err end
    local sealed: { string } = {}
    for _, row in ipairs(closed or {}) do sealed[#sealed + 1] = db.trim((row :: any).span_id) end
    return { sealed = sealed, count = #sealed, saturated = #candidates >= limit }, nil
end

-- Idle spans seal themselves at the time they last saw work, never at the time
-- the sweep noticed. Bounded per call so one heartbeat's sweep stays cheap;
-- the caller re-runs while it keeps finding a full page.
--
-- The idle predicate rides the seal itself. Selecting stale spans and then
-- sealing them on state alone let a write land between the two: the span was
-- alive again, and the sweep closed it anyway at a timestamp it had already
-- passed. A revived span no longer matches the guarded update, so it stays
-- open, and the report names the spans this sweep actually closed.
function M.seal_idle(dbh: any, journal_id: string, idle_before: number, requested_limit: number?): (any?, error?)
    local found, found_err = M.idle_candidates(dbh, journal_id, idle_before, requested_limit)
    if not found then return nil, found_err end
    local candidates = (found :: any).candidates :: { string }
    local limit = tonumber((found :: any).limit) or 0
    return M.seal_candidates(dbh, journal_id, idle_before, candidates, limit)
end

function M.counts(dbh: any, journal_id: string): (any?, error?)
    local rows, err = db.query(dbh,
        "SELECT state, COUNT(*) AS n FROM chestor_journal_spans WHERE journal_id = ? GROUP BY state",
        { journal_id })
    if err then return nil, err end
    local out: any = { open = 0, sealed = 0, total = 0 }
    for _, row in ipairs(rows or {}) do
        local state = db.trim((row :: any).state)
        local count = tonumber((row :: any).n) or 0
        if STATE[state] then out[state] = count end
        out.total = out.total + count
    end
    return out, nil
end

-- One keyset page of spans, newest activity first. state, agent_id, and
-- task_id narrow the same page; task_id answers which spans touched a task
-- through the span stamp every fact carries.
function M.page(dbh: any, journal_id: string, opts: any): (any?, error?)
    local limit = bounded(opts and (opts :: any).limit, 50, 200)
    local state = db.trim(opts and (opts :: any).state)
    local agent_id = db.trim(opts and (opts :: any).agent_id)
    local cursor_id = db.trim(opts and (opts :: any).cursor_id)
    local task_id = db.trim(opts and (opts :: any).task_id)
    local since = math.max(0, math.floor(tonumber(opts and (opts :: any).since) or 0))
    local after_activity_at = tonumber(opts and (opts :: any).after_activity_at)
    local after_span_id = db.trim(opts and (opts :: any).after_span_id)
    if state ~= "" and not STATE[state] then return nil, errors.new({ kind = errors.INVALID, message = "span state must be open or sealed" }) end
    local where = { "s.journal_id = ?" }
    local params: { any } = { journal_id }
    if state ~= "" then
        where[#where + 1] = "s.state = ?"
        params[#params + 1] = state
    end
    if agent_id ~= "" then
        where[#where + 1] = "s.agent_id = ?"
        params[#params + 1] = agent_id
    end
    if cursor_id ~= "" then
        where[#where + 1] = "s.cursor_id = ?"
        params[#params + 1] = cursor_id
    end
    if since > 0 then
        where[#where + 1] = "s.last_activity_at >= ?"
        params[#params + 1] = since
    end
    if task_id ~= "" then
        where[#where + 1] = [[(s.purpose_task_id = ? OR EXISTS (
            SELECT 1 FROM chestor_journal_events e
             WHERE e.journal_id = s.journal_id AND e.task_id = ? AND e.span_id = s.span_id))]]
        params[#params + 1] = task_id
        params[#params + 1] = task_id
    end
    if after_activity_at ~= nil then
        where[#where + 1] = "(s.last_activity_at < ? OR (s.last_activity_at = ? AND s.span_id < ?))"
        params[#params + 1] = math.floor(after_activity_at)
        params[#params + 1] = math.floor(after_activity_at)
        params[#params + 1] = after_span_id
    end
    params[#params + 1] = limit + 1
    local rows, err = db.query(dbh, "SELECT s.* FROM chestor_journal_spans s WHERE "
        .. table.concat(where, " AND ")
        .. " ORDER BY s.last_activity_at DESC, s.span_id DESC LIMIT ?", params)
    if err then return nil, err end
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        items[#items + 1] = decode_row(row)
    end
    local has_more = #(rows or {}) > limit
    local last = items[#items]
    return {
        items = items,
        limit = limit,
        has_more = has_more,
        next_cursor = has_more and last and {
            after_activity_at = (last :: any).last_activity_at,
            after_span_id = tostring((last :: any).span_id),
        } or nil,
    }, nil
end

-- The newest non-protocol fact each span on a page carries, resolved in one
-- query so the page cost stays flat in the number of spans it returned.
function M.last_facts(dbh: any, journal_id: string, span_ids: { string }): (any?, error?)
    local wanted: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, value in ipairs(span_ids or {}) do
        local id = db.trim(value)
        if id ~= "" and not seen[id] then
            seen[id] = true
            wanted[#wanted + 1] = id
        end
    end
    local out: any = {}
    if #wanted == 0 then return out, nil end
    local marks: { string } = {}
    local params: { any } = { journal_id }
    for _, id in ipairs(wanted) do
        marks[#marks + 1] = "?"
        params[#params + 1] = id
    end
    for _, event_type in ipairs(types.PROTOCOL_EVENT_TYPES) do params[#params + 1] = event_type end
    local exclusions: { string } = {}
    for _ in ipairs(types.PROTOCOL_EVENT_TYPES) do exclusions[#exclusions + 1] = "?" end
    params[#params + 1] = journal_id
    local rows, err = db.query(dbh, [[
        SELECT e.span_id AS span_id, e.seq AS seq, e.id AS event_id, e.event_type AS event_type,
               e.title AS title, e.ts AS ts, e.task_id AS task_id
          FROM chestor_journal_events e
          JOIN (
            SELECT span_id, MAX(seq) AS seq FROM chestor_journal_events
             WHERE journal_id = ? AND span_id IN (]] .. table.concat(marks, ",") .. [[)
               AND event_type NOT IN (]] .. table.concat(exclusions, ",") .. [[)
             GROUP BY span_id
          ) m ON m.span_id = e.span_id AND m.seq = e.seq
         WHERE e.journal_id = ?
    ]], params)
    if err then return nil, err end
    for _, row in ipairs(rows or {}) do
        out[db.trim((row :: any).span_id)] = {
            seq = tonumber((row :: any).seq) or 0,
            event_id = (row :: any).event_id,
            event_type = (row :: any).event_type,
            title = (row :: any).title,
            ts = tonumber((row :: any).ts),
            task_id = db.trim((row :: any).task_id) ~= "" and (row :: any).task_id or nil,
        }
    end
    return out, nil
end

return M

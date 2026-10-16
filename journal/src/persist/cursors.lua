local db = require("db")
local types = require("types")

local M = {}

local function decode_row(row: any): any
    if type(row) ~= "table" then return row end
    row.close_requirements = db.decode(row.close_requirements_json, {})
    row.close_requirements_json = nil
    row.checkpoint = db.decode(row.checkpoint_json, {})
    row.checkpoint_json = nil
    row.context_refs = db.decode(row.context_refs_json, {})
    row.context_refs_json = nil
    row.revision = tonumber(row.revision) or 0
    row.claimed_revision = tonumber(row.claimed_revision) or 0
    -- The revision a caller must hold to act on this cursor: the folded one,
    -- or the higher one a command already claimed and appended an event for
    -- while that event is still in flight to the projection.
    row.held_revision = math.max(row.revision, row.claimed_revision)
    row.last_seen_seq = tonumber(row.last_seen_seq) or 0
    row.checkpoint_seq = tonumber(row.checkpoint_seq) or 0
    row.created_at = tonumber(row.created_at)
    row.updated_at = tonumber(row.updated_at)
    return row
end

-- Cursor ids are normally generated as compact, typed handles and therefore
-- resolve globally. Caller-selected mnemonic handles are allowed to collide;
-- consumers then receive the bounded candidate set and can add journal_id.
function M.resolve(dbh: any, cursor_id: string, requested_limit: number?): (any?, error?)
    local limit = math.max(1, math.min(math.floor(tonumber(requested_limit) or 8), 32))
    local rows, err = db.query(dbh, [[
        SELECT * FROM chestor_journal_cursors
         WHERE cursor_id = ?
         ORDER BY state = 'active' DESC, updated_at DESC, journal_id ASC
         LIMIT ?
    ]], { cursor_id, limit + 1 })
    if err then return nil, err end
    local out: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        out[#out + 1] = decode_row(row)
    end
    return { items = out, has_more = #(rows or {}) > limit }, nil
end

local function placeholders(count: number): string
    local parts: { string } = {}
    for _ = 1, count do parts[#parts + 1] = "?" end
    return table.concat(parts, ",")
end

-- One journal's presence roll, newest movement first. Automatic and explicit
-- cursors share the table and therefore the page; the caller decides how to
-- present the difference. The page is keyset-continued on (updated_at,
-- cursor_id), so a journal with hundreds of agents pages without an offset
-- scan and without hiding the rows past the window.
function M.list(dbh: any, journal_id: string, opts: any): (any?, error?)
    local source: any = type(opts) == "table" and opts or { limit = opts }
    local limit = math.max(1, math.min(math.floor(tonumber(source.limit) or 50), 200))
    local after_updated_at = tonumber(source.after_updated_at)
    local after_cursor_id = db.trim(source.after_cursor_id)
    local statement = [[
        SELECT * FROM chestor_journal_cursors
         WHERE journal_id = ?
    ]]
    local params: { any } = { journal_id }
    if after_updated_at ~= nil then
        statement = statement .. " AND (updated_at < ? OR (updated_at = ? AND cursor_id > ?))"
        params[#params + 1] = math.floor(after_updated_at)
        params[#params + 1] = math.floor(after_updated_at)
        params[#params + 1] = after_cursor_id
    end
    statement = statement .. " ORDER BY updated_at DESC, cursor_id ASC LIMIT ?"
    params[#params + 1] = limit + 1
    local rows, err = db.query(dbh, statement, params)
    if err then return nil, err end
    local count_rows, count_err = db.query(dbh,
        "SELECT COUNT(*) AS n FROM chestor_journal_cursors WHERE journal_id = ?", { journal_id })
    if count_err then return nil, count_err end
    local total = count_rows and count_rows[1] and tonumber((count_rows[1] :: any).n) or 0
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        items[#items + 1] = decode_row(row)
    end
    local has_more = #(rows or {}) > limit
    local last = items[#items]
    return {
        items = items,
        total = total,
        limit = limit,
        omitted = math.max(0, total - #items),
        has_more = has_more,
        next_cursor = has_more and last and {
            after_updated_at = tonumber((last :: any).updated_at),
            after_cursor_id = tostring((last :: any).cursor_id),
        } or nil,
    }, nil
end

local function protocol_exclusion(params: { any }): string
    local marks: { string } = {}
    for _, event_type in ipairs(types.PROTOCOL_EVENT_TYPES) do
        marks[#marks + 1] = "?"
        params[#params + 1] = event_type
    end
    return table.concat(marks, ",")
end

-- The work record a consumption watermark stands on. A projected fact carries
-- its own event id as the graph node's ref_id, so one indexed join answers the
-- whole page. Protocol events are the journal's own bookkeeping and are never
-- what an agent was last seen doing, so a watermark sitting on one resolves
-- back to the newest work fact at or below it.
local function touch_rows(dbh: any, journal_id: string, seqs: { number }): (any?, error?)
    local params: { any } = { journal_id }
    for _, seq in ipairs(seqs) do params[#params + 1] = seq end
    local exclusions = protocol_exclusion(params)
    return db.query(dbh, [[
        SELECT e.seq AS seq, e.id AS event_id, e.event_type AS event_type, e.title AS title, e.ts AS ts,
               n.graph_id AS graph_id, n.id AS node_id, n.label AS node_label
          FROM chestor_journal_events e
          LEFT JOIN chestor_journal_graph_nodes n
            ON n.journal_id = e.journal_id AND n.ref_id = e.id
         WHERE e.journal_id = ? AND e.seq IN (]] .. placeholders(#seqs) .. [[)
           AND e.event_type NOT IN (]] .. exclusions .. [[)
         ORDER BY e.seq ASC, n.graph_id ASC, n.id ASC
    ]], params)
end

-- The newest work fact at or below one watermark, for a watermark whose own
-- event is protocol noise or was never projected here.
local function preceding_touch(dbh: any, journal_id: string, seq: number): (any?, error?)
    local params: { any } = { journal_id, seq }
    local exclusions = protocol_exclusion(params)
    local rows, err = db.query(dbh, [[
        SELECT e.seq AS seq, e.id AS event_id, e.event_type AS event_type, e.title AS title, e.ts AS ts,
               n.graph_id AS graph_id, n.id AS node_id, n.label AS node_label
          FROM chestor_journal_events e
          LEFT JOIN chestor_journal_graph_nodes n
            ON n.journal_id = e.journal_id AND n.ref_id = e.id
         WHERE e.journal_id = ? AND e.seq <= ?
           AND e.event_type NOT IN (]] .. exclusions .. [[)
         ORDER BY e.seq DESC, n.graph_id ASC, n.id ASC LIMIT 4
    ]], params)
    if err then return nil, err end
    return rows, nil
end

local function fold_touch(out: any, key: number, row: any)
    local touch: any = out[key]
    if not touch then
        touch = {
            seq = tonumber((row :: any).seq) or 0,
            event_id = (row :: any).event_id,
            event_type = (row :: any).event_type,
            title = (row :: any).title,
            ts = tonumber((row :: any).ts),
            positions = {},
        }
        out[key] = touch
    end
    if tonumber((row :: any).seq) ~= touch.seq then return end
    local graph_id = db.trim((row :: any).graph_id)
    local node_id = db.trim((row :: any).node_id)
    if graph_id ~= "" and node_id ~= "" and #(touch.positions :: { any }) < 4 then
        (touch.positions :: { any })[#(touch.positions :: { any }) + 1] = {
            graph_id = graph_id, node_id = node_id, label = (row :: any).node_label,
        }
    end
end

function M.touches(dbh: any, journal_id: string, seqs: { number }): (any?, error?)
    local wanted: { number } = {}
    local seen: { [number]: boolean } = {}
    for _, value in ipairs(seqs or {}) do
        local seq = math.floor(tonumber(value) or 0)
        if seq > 0 and not seen[seq] then
            seen[seq] = true
            wanted[#wanted + 1] = seq
        end
    end
    local out: any = {}
    if #wanted == 0 then return out, nil end
    local rows, err = touch_rows(dbh, journal_id, wanted)
    if not rows then return nil, err end
    for _, row in ipairs(rows :: { any }) do
        fold_touch(out, tonumber((row :: any).seq) or 0, row)
    end
    for _, seq in ipairs(wanted) do
        if not out[seq] then
            local preceding, preceding_err = preceding_touch(dbh, journal_id, seq)
            if not preceding then return nil, preceding_err end
            for _, row in ipairs(preceding :: { any }) do fold_touch(out, seq, row) end
        end
    end
    return out, nil
end

function M.get(dbh: any, journal_id: string, cursor_id: string): (any?, error?)
    local rows, err = db.query(dbh,
        "SELECT * FROM chestor_journal_cursors WHERE journal_id = ? AND cursor_id = ? LIMIT 1",
        { journal_id, cursor_id }
    )
    if err then return nil, err end
    return rows and rows[1] and decode_row(rows[1]) or nil, nil
end

-- The cursor an identity's automatic position lands on. origin narrows the
-- search to cursors of that provenance: the automatic path asks for 'auto' so
-- it can never adopt a cursor an agent opened through the explicit protocol -
-- several agents behind one shared actor identity would otherwise all fold
-- into that one opened cursor and silently move a position its owner is
-- coordinating with.
function M.latest_for_agent(dbh: any, journal_id: string, agent_id: string, origin: string?): (any?, error?)
    local wanted = db.trim(origin)
    local statement = [[
        SELECT * FROM chestor_journal_cursors
         WHERE journal_id = ? AND agent_id = ? AND state = 'active'
    ]]
    local params: { any } = { journal_id, agent_id }
    if wanted ~= "" then
        statement = statement .. " AND COALESCE(NULLIF(origin, ''), 'explicit') = ?"
        params[#params + 1] = wanted
    end
    local rows, err = db.query(dbh, statement .. " ORDER BY updated_at DESC, cursor_id DESC LIMIT 1", params)
    if err then return nil, err end
    return rows and rows[1] and decode_row(rows[1]) or nil, nil
end

-- The revision an agent holding expected_revision is allowed to take, decided
-- inside the database. The guard compares against the greater of the folded
-- and claimed revisions, so the second of two commands carrying one
-- expected_revision matches nothing and learns it lost - rather than appending
-- an event the projector will silently drop and answering success anyway.
-- Returns whether the claim was taken, plus the revision that is held now.
function M.claim_revision(dbh: any, journal_id: string, cursor_id: string,
    expected: number): (any?, error?)
    local held = math.max(0, math.floor(tonumber(expected) or 0))
    local affected, claim_err = db.exec_affected(dbh, [[
        UPDATE chestor_journal_cursors
           SET claimed_revision = ?
         WHERE journal_id = ? AND cursor_id = ?
           AND (CASE WHEN claimed_revision > revision THEN claimed_revision ELSE revision END) = ?
    ]], { held + 1, journal_id, cursor_id, held })
    if affected == nil then return nil, claim_err end
    if (affected :: number) > 0 then return { claimed = true, revision = held + 1 }, nil end
    local current, get_err = M.get(dbh, journal_id, cursor_id)
    if get_err then return nil, get_err end
    return {
        claimed = false,
        revision = current and tonumber((current :: any).held_revision) or 0,
    }, nil
end

-- Position is consumption state, not a claim about the world: it only ever
-- moves forward, it is commutative between concurrent writers, and it stays
-- outside the expected_revision protocol so maintaining it can never
-- invalidate the revision an agent is holding. The guarded update folds
-- concurrent advances of the same row inside the database; the insert claims a
-- row for an identified agent that has no cursor here yet. An identity holds
-- one automatic position per journal, so a first-write race loses its insert to
-- the partial unique index and adopts the winner's row instead of splitting the
-- agent's watermark across two handles.
function M.advance(dbh: any, journal_id: string, cursor_id: string, agent_id: string,
    seq: number, origin: string): (any?, error?)
    local watermark = math.max(0, math.floor(tonumber(seq) or 0))
    local now = db.now()
    local function move_forward(id: string): (any?, error?)
        local rows, update_err = db.query(dbh, [[
            UPDATE chestor_journal_cursors
               SET last_seen_seq = CASE WHEN ? > last_seen_seq THEN ? ELSE last_seen_seq END,
                   updated_at = ?
             WHERE journal_id = ? AND cursor_id = ?
             RETURNING *
        ]], { watermark, watermark, now, journal_id, id })
        if update_err then return nil, update_err end
        return rows and rows[1] and decode_row(rows[1]) or nil, nil
    end
    local existing, existing_err = move_forward(cursor_id)
    if existing_err then return nil, existing_err end
    if existing then return existing, nil end
    local rows, insert_err = db.query(dbh, [[
        INSERT INTO chestor_journal_cursors
            (journal_id, cursor_id, agent_id, state, revision, claimed_revision, last_seen_seq, checkpoint_seq,
             close_requirements_json, checkpoint_json, context_refs_json, origin,
             created_event_id, updated_event_id, created_at, updated_at)
        VALUES (?, ?, ?, 'active', 1, 1, ?, 0, '[]', '{}', '[]', ?, '', '', ?, ?)
        ON CONFLICT DO NOTHING
        RETURNING *
    ]], { journal_id, cursor_id, agent_id, watermark, origin, now, now })
    if insert_err then return nil, insert_err end
    if rows and rows[1] then return decode_row(rows[1]), nil end
    local claimed, claimed_err = move_forward(cursor_id)
    if claimed_err then return nil, claimed_err end
    if claimed then return claimed, nil end
    local winner, winner_err = M.latest_for_agent(dbh, journal_id, agent_id, origin)
    if winner_err then return nil, winner_err end
    if not winner then
        return nil, errors.new({ kind = errors.INTERNAL, message = "journal cursor " .. cursor_id .. " lost its allocation with no position to adopt" })
    end
    return move_forward(db.trim((winner :: any).cursor_id))
end

function M.episode(dbh: any, journal_id: string, episode_id: string): (any?, error?)
    if db.trim(episode_id) == "" then return nil, nil end
    local rows, err = db.query(dbh,
        "SELECT * FROM chestor_journal_episodes WHERE journal_id = ? AND episode_id = ? LIMIT 1",
        { journal_id, episode_id }
    )
    if err then return nil, err end
    local row = rows and rows[1] or nil
    if row then
        row.started_seq = tonumber(row.started_seq) or 0
        row.ended_seq = tonumber(row.ended_seq)
        row.started_at = tonumber(row.started_at)
        row.deadline_at = tonumber(row.deadline_at)
        row.ended_at = tonumber(row.ended_at)
        row.checkpoint = db.decode(row.checkpoint_json, {})
        row.checkpoint_json = nil
    end
    return row, nil
end

function M.audit_coverage(dbh: any, journal_id: string, task_id: string, requested_limit: number?): (any?, error?)
    local limit = math.max(1, math.min(math.floor(tonumber(requested_limit) or 100), 500))
    local rows, err = db.query(dbh, [[
        SELECT * FROM chestor_journal_audit_coverage
         WHERE journal_id = ? AND audit_task_id = ?
         ORDER BY unit_key ASC LIMIT ?
    ]], { journal_id, task_id, limit + 1 })
    if err then return nil, err end
    local grouped, grouped_err = db.query(dbh, [[
        SELECT status, COUNT(*) AS n FROM chestor_journal_audit_coverage
         WHERE journal_id = ? AND audit_task_id = ? GROUP BY status
    ]], { journal_id, task_id })
    if grouped_err then return nil, grouped_err end
    local counts: any = { finding = 0, checked_clean = 0, gap = 0, not_applicable = 0 }
    local total = 0
    for _, row in ipairs(grouped or {}) do
        local count = tonumber((row :: any).n) or 0
        counts[db.trim((row :: any).status)] = count
        total = total + count
    end
    local units: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        row.evidence_event_ids = db.decode(row.evidence_event_ids_json, {})
        row.evidence_event_ids_json = nil
        row.recorded_seq = tonumber(row.recorded_seq) or 0
        units[#units + 1] = row
    end
    return {
        units = units,
        counts = counts,
        total = total,
        omitted = math.max(0, total - #units),
        has_more = total > #units,
    }, nil
end

function M.integrations_page(dbh: any, journal_id: string, cursor_id: string, requested_limit: number?): (any?, error?)
    local limit = math.max(1, math.min(math.floor(tonumber(requested_limit) or 100), 500))
    local rows, err = db.query(dbh, [[
        SELECT * FROM chestor_journal_integrations
         WHERE journal_id = ? AND (parent_cursor_id = ? OR child_cursor_id = ?)
         ORDER BY recorded_seq DESC, receipt_id DESC LIMIT ?
    ]], { journal_id, cursor_id, cursor_id, limit + 1 })
    if err then return nil, err end
    local count_rows, count_err = db.query(dbh, [[
        SELECT COUNT(*) AS n FROM chestor_journal_integrations
         WHERE journal_id = ? AND (parent_cursor_id = ? OR child_cursor_id = ?)
    ]], { journal_id, cursor_id, cursor_id })
    if count_err then return nil, count_err end
    local total = count_rows and count_rows[1] and tonumber((count_rows[1] :: any).n) or 0
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        row.evidence_event_ids = db.decode(row.evidence_event_ids_json, {})
        row.coverage = db.decode(row.coverage_json, {})
        row.unresolved = db.decode(row.unresolved_json, {})
        row.recorded_seq = tonumber(row.recorded_seq) or 0
        row.evidence_event_ids_json = nil
        row.coverage_json = nil
        row.unresolved_json = nil
        items[#items + 1] = row
    end
    return {
        items = items,
        total = total,
        omitted = math.max(0, total - #items),
        has_more = total > #items,
    }, nil
end

function M.integrations(dbh: any, journal_id: string, cursor_id: string): (any?, error?)
    local page, err = M.integrations_page(dbh, journal_id, cursor_id, 100)
    if not page then return nil, err end
    return (page :: any).items, nil
end

return M

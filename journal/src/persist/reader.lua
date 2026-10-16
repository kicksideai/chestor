local db_ops = require("db")
local types = require("types")
local retrieval_state = require("retrieval_state")

local M = {}

local function bounded(value: any, fallback: number, maximum: number): number
    return math.max(1, math.min(math.floor(tonumber(value) or fallback), maximum))
end

local function placeholders(count: number): string
    local parts: { string } = {}
    for _ = 1, count do parts[#parts + 1] = "?" end
    return table.concat(parts, ",")
end

-- Protocol events are the journal's own position and graph-maintenance
-- bookkeeping. They stay durable and addressable by id, but a stream a person
-- or an agent reads as "what happened here" excludes them by the one declared
-- vocabulary; include_protocol asks for the unfiltered log.
local function protocol_clause(column: string, params: { any }, include_protocol: any): string
    if include_protocol == true then return "" end
    local marks: { string } = {}
    for _, event_type in ipairs(types.PROTOCOL_EVENT_TYPES) do
        marks[#marks + 1] = "?"
        params[#params + 1] = event_type
    end
    if #marks == 0 then return "" end
    return " AND " .. column .. " NOT IN (" .. table.concat(marks, ",") .. ")"
end

function M.decode_event(row: any): any
    local metadata = db_ops.decode(row.metadata, {})
    local lifecycle = string.lower(db_ops.trim(type(metadata) == "table" and (metadata :: any).lifecycle or ""))
    if lifecycle == "" then lifecycle = "active" end
    return {
        id = row.id,
        seq = tonumber(row.seq) or 0,
        ts = tonumber(row.ts) or 0,
        event_type = row.event_type,
        title = row.title,
        body = row.body,
        actor_id = row.actor_id,
        actor_type = row.actor_type,
        tags = db_ops.decode(row.tags, {}),
        linked_component_ids = db_ops.decode(row.linked_component_ids, {}),
        linked_upload_ids = db_ops.decode(row.linked_upload_ids, {}),
        linked_file_paths = db_ops.decode(row.linked_file_paths, {}),
        linked_task_ids = db_ops.decode(row.linked_task_ids, {}),
        task_id = row.task_id,
        cursor_id = row.cursor_id,
        episode_id = row.episode_id,
        span_id = row.span_id,
        correlation_id = row.correlation_id,
        causation_id = row.causation_id,
        metadata = metadata,
        lifecycle = lifecycle,
        effective_state = db_ops.trim(row.effective_state) ~= "" and row.effective_state or lifecycle,
        superseded_by_event_id = row.superseded_by_event_id,
        supersedes_event_id = row.supersedes_event_id,
        embedding_status = row.embedding_status,
        distance = tonumber(row.distance),
    }
end

function M.governing_facts(db: any, journal_id: string, ancestors: { string }, limit: number): (any?, any?)
    if #ancestors == 0 then return { facts = {}, total = 0 }, nil end
    local dialect, type_err = db:type()
    if type_err then return nil, type_err end
    local lineage
    local scope
    local lifecycle
    if tostring(dialect) == "postgres" then
        lineage = "SELECT value AS task_id, ordinality AS depth FROM jsonb_array_elements_text(CAST(? AS jsonb)) WITH ORDINALITY"
        scope = "lower(COALESCE(e.metadata::jsonb ->> 'scope', ''))"
        lifecycle = "lower(COALESCE(e.metadata::jsonb ->> 'lifecycle', 'active'))"
    else
        lineage = "SELECT value AS task_id, CAST(key AS INTEGER) + 1 AS depth FROM json_each(?)"
        scope = "lower(COALESCE(json_extract(e.metadata, '$.scope'), ''))"
        lifecycle = "lower(COALESCE(json_extract(e.metadata, '$.lifecycle'), 'active'))"
    end
    local rows, query_err = db_ops.query(db, [[
        WITH ancestors AS (]] .. lineage .. [[)
        SELECT e.*, COUNT(*) OVER () AS governing_total
          FROM chestor_journal_events e JOIN ancestors a ON a.task_id = e.task_id
         WHERE e.journal_id = ?
           AND lower(e.event_type) IN ('decision','constraint','assumption','observation','blocker','risk')
           AND (]] .. scope .. [[ IN ('subtree','project')
                OR lower(e.event_type) IN ('decision','constraint','assumption'))
           AND ]] .. lifecycle .. [[ NOT IN ('retracted','superseded')
           AND NOT EXISTS (
               SELECT 1 FROM chestor_journal_events s
                WHERE s.journal_id = e.journal_id AND s.supersedes_event_id IS NOT NULL
                  AND s.supersedes_event_id = e.id)
         ORDER BY a.depth DESC, e.seq DESC LIMIT ?
    ]], { db_ops.encode(ancestors, {}), journal_id, bounded(limit, 24, 100) })
    if query_err then return nil, query_err end
    local facts = {}
    for _, row in ipairs(rows or {}) do
        local item = M.decode_event(row)
        item.inherited_from_task_id = row.task_id
        facts[#facts + 1] = item
    end
    return { facts = facts, total = rows and rows[1] and tonumber(rows[1].governing_total) or 0 }, nil
end

function M.list_events(db: any, journal_id: string, opts: any): (any?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_events WHERE journal_id = ? ORDER BY seq DESC LIMIT ?",
        { journal_id, bounded(opts and opts.limit, 100, 500) }
    )
    if query_err then return nil, query_err end
    local out = {}
    for _, row in ipairs(rows or {}) do out[#out + 1] = M.decode_event(row) end
    return out, nil
end

function M.event_page(db: any, journal_id: string, opts: any): (any?, any?)
    local limit = bounded(opts and opts.limit, 60, 200)
    local before_seq = math.max(0, math.floor(tonumber(opts and opts.before_seq) or 0))
    local statement = "SELECT * FROM chestor_journal_events WHERE journal_id = ?"
    local params: { any } = { journal_id }
    if before_seq > 0 then
        statement = statement .. " AND seq < ?"
        params[#params + 1] = before_seq
    end
    statement = statement .. protocol_clause("event_type", params, opts and (opts :: any).include_protocol)
    statement = statement .. " ORDER BY seq DESC LIMIT ?"
    params[#params + 1] = limit + 1
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    local has_more = #(rows or {}) > limit
    local events = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then events[#events + 1] = M.decode_event(row) end
    end
    local last = events[#events]
    return {
        events = events,
        limit = limit,
        before_seq = before_seq > 0 and before_seq or nil,
        next_before_seq = has_more and last and last.seq or nil,
        has_more = has_more,
    }, nil
end

-- Returns only projection rows committed after the caller's watermark. Events are
-- ascending so clients can advance monotonically without rebuilding their page.
function M.event_delta(db: any, journal_id: string, opts: any): (any?, any?)
    local limit = bounded(opts and opts.limit, 100, 200)
    local after_seq = math.max(0, math.floor(tonumber(opts and opts.after_seq) or 0))
    local params: { any } = { journal_id, after_seq }
    local statement = "SELECT * FROM chestor_journal_events WHERE journal_id = ? AND seq > ?"
        .. protocol_clause("event_type", params, opts and (opts :: any).include_protocol)
        .. " ORDER BY seq ASC LIMIT ?"
    params[#params + 1] = limit + 1
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    local has_more = #(rows or {}) > limit
    local events = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then events[#events + 1] = M.decode_event(row) end
    end
    local last = events[#events]
    local next_after_seq = last and last.seq or after_seq
    -- A window whose remaining rows were all protocol noise still consumed
    -- them: the watermark moves to the head so the feed never re-reads a
    -- stretch it has already skipped.
    if not has_more then
        local head, head_err = M.last_seq(db, journal_id)
        if head == nil then return nil, head_err end
        if (head :: number) > next_after_seq then next_after_seq = head :: number end
    end
    return {
        events = events,
        limit = limit,
        after_seq = after_seq,
        next_after_seq = next_after_seq,
        has_more = has_more,
    }, nil
end

function M.get_event(db: any, journal_id: string, event_id: string): (any?, any?)
    local id = db_ops.trim(event_id)
    if id == "" then return nil, errors.new({ message = "event id is required", kind = errors.INVALID }) end
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_events WHERE journal_id = ? AND id = ? LIMIT 1",
        { journal_id, id }
    )
    if query_err then return nil, query_err end
    if not rows or not rows[1] then return nil, errors.new({ message = "journal event not found", kind = errors.INVALID }) end
    return M.decode_event(rows[1]), nil
end

function M.latest_event_type(db: any, journal_id: string, event_type: string): (any?, any?)
    local rows, query_err = db_ops.query(db, [[
        SELECT * FROM chestor_journal_events
         WHERE journal_id = ? AND event_type = ?
         ORDER BY seq DESC LIMIT 1
    ]], { journal_id, event_type })
    if query_err then return nil, query_err end
    if not rows or not rows[1] then return nil, nil end
    return M.decode_event(rows[1]), nil
end

-- The journal state row is the single read-model owner of the active-task
-- pointer and the current digest.
function M.journal_state(db: any, journal_id: string): (any?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_state WHERE journal_id = ? LIMIT 1",
        { journal_id }
    )
    if query_err then return nil, query_err end
    return rows and rows[1] or nil, nil
end

function M.list_tasks(db: any, journal_id: string, opts: any): (any?, any?)
    local status = string.lower(db_ops.trim(opts and opts.status))
    local query = db_ops.trim(opts and opts.query)
    local limit = bounded(opts and opts.limit, 200, 500)
    local rows, query_err
    if status == "active" then
        rows, query_err = db_ops.query(db, [[
            SELECT * FROM chestor_journal_tasks
             WHERE journal_id = ?
               AND lower(status) NOT IN ('done','closed','canceled','cancelled','folded')
               AND (? = '' OR lower(id || ' ' || title || ' ' || COALESCE(description, '') || ' ' || COALESCE(assignee, '') || ' ' || COALESCE(agent_id, '')) LIKE lower(?))
             ORDER BY sort_order ASC, updated_at DESC LIMIT ?
        ]], { journal_id, query, "%" .. query .. "%", limit })
    elseif status ~= "" and status ~= "all" then
        rows, query_err = db_ops.query(db, [[
            SELECT * FROM chestor_journal_tasks
             WHERE journal_id = ? AND lower(status) = ?
               AND (? = '' OR lower(id || ' ' || title || ' ' || COALESCE(description, '') || ' ' || COALESCE(assignee, '') || ' ' || COALESCE(agent_id, '')) LIKE lower(?))
             ORDER BY sort_order ASC, updated_at DESC LIMIT ?
        ]], { journal_id, status, query, "%" .. query .. "%", limit })
    else
        rows, query_err = db_ops.query(db, [[
            SELECT * FROM chestor_journal_tasks
             WHERE journal_id = ?
               AND (? = '' OR lower(id || ' ' || title || ' ' || COALESCE(description, '') || ' ' || COALESCE(assignee, '') || ' ' || COALESCE(agent_id, '')) LIKE lower(?))
             ORDER BY sort_order ASC, updated_at DESC LIMIT ?
        ]], { journal_id, query, "%" .. query .. "%", limit })
    end
    if query_err then return nil, query_err end
    for _, row in ipairs(rows or {}) do (row :: any).metadata = db_ops.decode((row :: any).metadata, {}) end
    return rows, nil
end

-- The same task listing as one keyset page. The order is the listing's own
-- (sort_order, then newest movement) with the task id as the final tiebreak,
-- so a continuation resumes exactly where the page ended instead of counting
-- rows it already returned.
function M.task_page(db: any, journal_id: string, opts: any): (any?, any?)
    local status = string.lower(db_ops.trim(opts and (opts :: any).status))
    local query = db_ops.trim(opts and (opts :: any).query)
    local limit = bounded(opts and (opts :: any).limit, 200, 500)
    local after_sort_order = tonumber(opts and (opts :: any).after_sort_order)
    local after_updated_at = tonumber(opts and (opts :: any).after_updated_at)
    local after_id = db_ops.trim(opts and (opts :: any).after_id)
    local statement = [[SELECT * FROM chestor_journal_tasks WHERE journal_id = ?
        AND (? = '' OR lower(id || ' ' || title || ' ' || COALESCE(description, '') || ' ' ||
            COALESCE(assignee, '') || ' ' || COALESCE(agent_id, '')) LIKE lower(?))]]
    local params: { any } = { journal_id, query, "%" .. query .. "%" }
    if status == "active" then
        statement = statement .. " AND lower(status) NOT IN ('done','closed','canceled','cancelled','folded')"
    elseif status ~= "" and status ~= "all" then
        statement = statement .. " AND lower(status) = ?"
        params[#params + 1] = status
    end
    if after_sort_order ~= nil and after_updated_at ~= nil then
        statement = statement .. [[ AND (sort_order > ?
            OR (sort_order = ? AND updated_at < ?)
            OR (sort_order = ? AND updated_at = ? AND id > ?))]]
        params[#params + 1] = math.floor(after_sort_order)
        params[#params + 1] = math.floor(after_sort_order)
        params[#params + 1] = math.floor(after_updated_at)
        params[#params + 1] = math.floor(after_sort_order)
        params[#params + 1] = math.floor(after_updated_at)
        params[#params + 1] = after_id
    end
    statement = statement .. " ORDER BY sort_order ASC, updated_at DESC, id ASC LIMIT ?"
    params[#params + 1] = limit + 1
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        (row :: any).metadata = db_ops.decode((row :: any).metadata, {})
        items[#items + 1] = row
    end
    local has_more = #(rows or {}) > limit
    local last = items[#items]
    return {
        items = items,
        limit = limit,
        has_more = has_more,
        next_cursor = has_more and last and {
            after_sort_order = tonumber((last :: any).sort_order) or 0,
            after_updated_at = tonumber((last :: any).updated_at) or 0,
            after_id = tostring((last :: any).id),
        } or nil,
    }, nil
end

function M.task(db: any, journal_id: string, task_id: string): (any?, any?)
    local id = db_ops.trim(task_id)
    if id == "" then return nil, errors.new({ message = "task id is required", kind = errors.INVALID }) end
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_tasks WHERE journal_id = ? AND id = ? LIMIT 1",
        { journal_id, id }
    )
    if query_err then return nil, query_err end
    if not rows or not rows[1] then return nil, nil end
    local row = rows[1] :: any
    row.metadata = db_ops.decode(row.metadata, {})
    return row, nil
end

function M.task_children(db: any, journal_id: string, parent_task_id: string?, limit: number): (any?, any?)
    local parent = db_ops.trim(parent_task_id)
    local rows, query_err
    if parent == "" then
        rows, query_err = db_ops.query(db, [[
            SELECT * FROM chestor_journal_tasks
             WHERE journal_id = ? AND (parent_task_id IS NULL OR parent_task_id = '')
             ORDER BY sort_order ASC, created_at ASC LIMIT ?
        ]], { journal_id, bounded(limit, 50, 500) })
    else
        rows, query_err = db_ops.query(db, [[
            SELECT * FROM chestor_journal_tasks
             WHERE journal_id = ? AND parent_task_id = ?
             ORDER BY sort_order ASC, created_at ASC LIMIT ?
        ]], { journal_id, parent, bounded(limit, 50, 500) })
    end
    if query_err then return nil, query_err end
    for _, row in ipairs(rows or {}) do (row :: any).metadata = db_ops.decode((row :: any).metadata, {}) end
    return rows, nil
end

-- Walks parent_task_id from the task's immediate parent up to the root and
-- returns the chain root-first. The seen set stops a cyclic parent pointer from
-- looping past max_depth.
function M.task_ancestors(db: any, journal_id: string, task_id: string, max_depth: number?): (any?, any?)
    local depth = bounded(max_depth, 32, 32)
    local start, start_err = M.task(db, journal_id, task_id)
    if start_err then return nil, start_err end
    local chain: { any } = {}
    local seen: any = {}
    seen[db_ops.trim(task_id)] = true
    local current = start and db_ops.trim((start :: any).parent_task_id) or ""
    while current ~= "" and #chain < depth do
        if seen[current] then break end
        seen[current] = true
        local row, row_err = M.task(db, journal_id, current)
        if row_err then return nil, row_err end
        if not row then break end
        chain[#chain + 1] = row
        current = db_ops.trim((row :: any).parent_task_id)
    end
    local out = {}
    for index = #chain, 1, -1 do out[#out + 1] = chain[index] end
    return out, nil
end

function M.task_facts(db: any, journal_id: string, task_id: string, limit: number): (any?, any?)
    local id = db_ops.trim(task_id)
    if id == "" then return {}, nil end
    local rows, query_err = db_ops.query(db, [[
        SELECT * FROM chestor_journal_events
         WHERE journal_id = ? AND task_id = ?
         ORDER BY seq DESC LIMIT ?
    ]], { journal_id, id, bounded(limit, 12, 200) })
    if query_err then return nil, query_err end
    local out = {}
    for _, row in ipairs(rows or {}) do out[#out + 1] = M.decode_event(row) end
    return out, nil
end

-- Live edges only (D1): tombstoned dependencies stay reachable through the
-- event log and Find, never through the lens.
function M.task_deps(db: any, journal_id: string, task_id: string, requested_limit: number?): (any?, any?)
    local id = db_ops.trim(task_id)
    if id == "" then return { outgoing = {}, incoming = {} }, nil end
    local limit = bounded(requested_limit, 100, 500)
    local outgoing, out_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_task_deps WHERE journal_id = ? AND from_task_id = ? AND tombstoned = 0 ORDER BY created_at ASC LIMIT ?",
        { journal_id, id, limit + 1 }
    )
    if out_err then return nil, out_err end
    local incoming, in_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_task_deps WHERE journal_id = ? AND to_task_id = ? AND tombstoned = 0 ORDER BY created_at ASC LIMIT ?",
        { journal_id, id, limit + 1 }
    )
    if in_err then return nil, in_err end
    local counts, count_err = db_ops.query(db, [[
        SELECT
          (SELECT COUNT(*) FROM chestor_journal_task_deps
            WHERE journal_id = ? AND from_task_id = ? AND tombstoned = 0) AS outgoing,
          (SELECT COUNT(*) FROM chestor_journal_task_deps
            WHERE journal_id = ? AND to_task_id = ? AND tombstoned = 0) AS incoming
    ]], { journal_id, id, journal_id, id })
    if count_err then return nil, count_err end
    local totals = counts and counts[1] or {}
    local function page(rows: any): any
        local result: { any } = {}
        for index, row in ipairs(rows or {}) do
            if index <= limit then result[#result + 1] = row end
        end
        return result
    end
    local outgoing_total = tonumber((totals :: any).outgoing) or 0
    local incoming_total = tonumber((totals :: any).incoming) or 0
    return {
        outgoing = page(outgoing),
        incoming = page(incoming),
        counts = { outgoing = outgoing_total, incoming = incoming_total },
        omitted = {
            outgoing = math.max(0, outgoing_total - math.min(outgoing_total, limit)),
            incoming = math.max(0, incoming_total - math.min(incoming_total, limit)),
        },
    }, nil
end

function M.last_seq(db: any, journal_id: string): (number?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
        { journal_id }
    )
    if query_err then return nil, query_err end
    return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
end

-- Seq of the acting agent's last checkpoint; journal-level (any actor) when
-- no actor is given. Zero when the journal has no checkpoint yet.
function M.latest_checkpoint_seq(db: any, journal_id: string, actor_id: any): (number?, any?)
    local actor = db_ops.trim(actor_id)
    local rows, query_err
    if actor == "" then
        rows, query_err = db_ops.query(db,
            "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ? AND event_type = 'checkpoint'",
            { journal_id }
        )
    else
        rows, query_err = db_ops.query(db,
            "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ? AND event_type = 'checkpoint' AND actor_id = ?",
            { journal_id, actor }
        )
    end
    if query_err then return nil, query_err end
    return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
end

-- Newest checkpoint as a lens pointer {event_id, title, ts, seq}, scoped to a
-- task-id set when one is given and journal-wide otherwise. Nil when no
-- checkpoint exists in scope.
function M.latest_checkpoint(db: any, journal_id: string, task_ids: any): (any?, any?)
    local statement = "SELECT id, title, ts, seq FROM chestor_journal_events"
        .. " WHERE journal_id = ? AND event_type = 'checkpoint'"
    local params: { any } = { journal_id }
    if type(task_ids) == "table" then
        if #(task_ids :: { string }) == 0 then return nil, nil end
        statement = statement .. " AND task_id IN (" .. placeholders(#(task_ids :: { string })) .. ")"
        for _, id in ipairs(task_ids :: { string }) do params[#params + 1] = id end
    end
    statement = statement .. " ORDER BY seq DESC LIMIT 1"
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    if not (rows and rows[1]) then return nil, nil end
    local row = rows[1] :: any
    return {
        event_id = row.id,
        title = row.title,
        ts = tonumber(row.ts) or 0,
        seq = tonumber(row.seq) or 0,
    }, nil
end

-- Subtree event reads stay inside the database. Materializing descendant ids
-- into a Lua array both imposed a hidden 512-node boundary and eventually
-- exceeded SQL parameter limits on long projects.
function M.event_window_summary_subtree(db: any, journal_id: string, task_id: string,
    after_seq: number): (any?, any?)
    local rows, query_err = db_ops.query(db, [[
        WITH RECURSIVE sub(id) AS (
            SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?
            UNION
            SELECT t.id FROM chestor_journal_tasks t JOIN sub s ON t.parent_task_id = s.id
             WHERE t.journal_id = ?
        )
        SELECT COUNT(*) AS n, MIN(e.seq) AS first_seq, MAX(e.seq) AS last_seq
          FROM chestor_journal_events e JOIN sub s ON s.id = e.task_id
         WHERE e.journal_id = ? AND e.seq > ?
    ]], { journal_id, db_ops.trim(task_id), journal_id, journal_id, after_seq })
    if query_err then return nil, query_err end
    local row = rows and rows[1] or {}
    local count = tonumber((row :: any).n) or 0
    return {
        count = count,
        first_seq = count > 0 and tonumber((row :: any).first_seq) or nil,
        last_seq = count > 0 and tonumber((row :: any).last_seq) or nil,
    }, nil
end

function M.latest_checkpoint_subtree(db: any, journal_id: string, task_id: string): (any?, any?)
    local rows, query_err = db_ops.query(db, [[
        WITH RECURSIVE sub(id) AS (
            SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?
            UNION
            SELECT t.id FROM chestor_journal_tasks t JOIN sub s ON t.parent_task_id = s.id
             WHERE t.journal_id = ?
        )
        SELECT e.id, e.title, e.ts, e.seq
          FROM chestor_journal_events e JOIN sub s ON s.id = e.task_id
         WHERE e.journal_id = ? AND e.event_type = 'checkpoint'
         ORDER BY e.seq DESC LIMIT 1
    ]], { journal_id, db_ops.trim(task_id), journal_id, journal_id })
    if query_err then return nil, query_err end
    if not (rows and rows[1]) then return nil, nil end
    local row = rows[1] :: any
    return {
        event_id = row.id,
        title = row.title,
        ts = tonumber(row.ts) or 0,
        seq = tonumber(row.seq) or 0,
    }, nil
end

function M.event_index_page_subtree(db: any, journal_id: string, task_id: string, opts: any): (any?, any?)
    local limit = bounded(opts and opts.limit, 100, 200)
    local after_seq = math.max(0, math.floor(tonumber(opts and opts.after_seq) or 0))
    local rows, query_err = db_ops.query(db, [[
        WITH RECURSIVE sub(id) AS (
            SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?
            UNION
            SELECT t.id FROM chestor_journal_tasks t JOIN sub s ON t.parent_task_id = s.id
             WHERE t.journal_id = ?
        )
        SELECT e.id, e.seq, e.ts, e.event_type, e.title, e.task_id, e.actor_id
          FROM chestor_journal_events e JOIN sub s ON s.id = e.task_id
         WHERE e.journal_id = ? AND e.seq > ?
         ORDER BY e.seq ASC LIMIT ?
    ]], { journal_id, db_ops.trim(task_id), journal_id, journal_id, after_seq, limit + 1 })
    if query_err then return nil, query_err end
    local has_more = #(rows or {}) > limit
    local events: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then
            local event = row :: any
            events[#events + 1] = {
                id = event.id,
                seq = tonumber(event.seq) or 0,
                ts = tonumber(event.ts) or 0,
                event_type = event.event_type,
                title = event.title,
                task_id = db_ops.trim(event.task_id) ~= "" and event.task_id or nil,
                actor_id = event.actor_id,
            }
        end
    end
    local last = events[#events]
    return {
        events = events,
        limit = limit,
        after_seq = after_seq,
        next_cursor = last and (last :: any).seq or after_seq,
        has_more = has_more,
    }, nil
end

-- D1 open_count per child rollup: descendants of each direct child with
-- status in {open, in_progress, blocked}. Computed here, never client-side.
function M.children_open_counts(db: any, journal_id: string, parent_task_id: string?): (any?, any?)
    local parent = db_ops.trim(parent_task_id)
    local seed
    local params: { any }
    if parent == "" then
        seed = "SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND (parent_task_id IS NULL OR parent_task_id = '')"
        params = { journal_id, journal_id, journal_id, journal_id }
    else
        seed = "SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND parent_task_id = ?"
        params = { journal_id, journal_id, parent, journal_id, journal_id }
    end
    local rows, query_err = db_ops.query(db, [[
        WITH RECURSIVE sub(id, top) AS (
            SELECT c.id, c.parent_task_id FROM chestor_journal_tasks c
             WHERE c.journal_id = ? AND c.parent_task_id IN (]] .. seed .. [[)
            UNION
            SELECT t.id, s.top FROM chestor_journal_tasks t JOIN sub s ON t.parent_task_id = s.id
             WHERE t.journal_id = ?
        )
        SELECT s.top AS top, COUNT(*) AS n FROM sub s
          JOIN chestor_journal_tasks t ON t.journal_id = ? AND t.id = s.id
         WHERE lower(t.status) IN ('open', 'in_progress', 'blocked')
         GROUP BY s.top
    ]], params)
    if query_err then return nil, query_err end
    local out: any = {}
    for _, row in ipairs(rows or {}) do
        out[db_ops.trim((row :: any).top)] = tonumber((row :: any).n) or 0
    end
    return out, nil
end

-- Count and seq bounds of events after a watermark, optionally scoped to a
-- task-id set; feeds changed_since_checkpoint on the lens.
function M.event_window_summary(db: any, journal_id: string, after_seq: number, task_ids: any): (any?, any?)
    local statement = "SELECT COUNT(*) AS n, MIN(seq) AS first_seq, MAX(seq) AS last_seq"
        .. " FROM chestor_journal_events WHERE journal_id = ? AND seq > ?"
    local params: { any } = { journal_id, after_seq }
    if type(task_ids) == "table" and #(task_ids :: { string }) > 0 then
        statement = statement .. " AND task_id IN (" .. placeholders(#(task_ids :: { string })) .. ")"
        for _, id in ipairs(task_ids :: { string }) do params[#params + 1] = id end
    end
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    local row = rows and rows[1] or {}
    local count = tonumber((row :: any).n) or 0
    return {
        count = count,
        first_seq = count > 0 and tonumber((row :: any).first_seq) or nil,
        last_seq = count > 0 and tonumber((row :: any).last_seq) or nil,
    }, nil
end

-- Change-feed page: index fields plus titles only, ascending so the newest
-- event lands last and next_cursor advances monotonically.
function M.event_index_page(db: any, journal_id: string, opts: any): (any?, any?)
    local limit = bounded(opts and opts.limit, 100, 200)
    local after_seq = math.max(0, math.floor(tonumber(opts and opts.after_seq) or 0))
    local statement = "SELECT id, seq, ts, event_type, title, task_id, actor_id"
        .. " FROM chestor_journal_events WHERE journal_id = ? AND seq > ?"
    local params: { any } = { journal_id, after_seq }
    local excluded = opts and opts.exclude_event_types
    if type(excluded) == "table" and #(excluded :: { string }) > 0 then
        statement = statement .. " AND event_type NOT IN (" .. placeholders(#(excluded :: { string })) .. ")"
        for _, kind in ipairs(excluded :: { string }) do params[#params + 1] = kind end
    end
    statement = statement .. protocol_clause("event_type", params, opts and (opts :: any).include_protocol)
    local task_ids = opts and opts.task_ids
    if type(task_ids) == "table" and #(task_ids :: { string }) > 0 then
        statement = statement .. " AND task_id IN (" .. placeholders(#(task_ids :: { string })) .. ")"
        for _, id in ipairs(task_ids :: { string }) do params[#params + 1] = id end
    end
    statement = statement .. " ORDER BY seq ASC LIMIT ?"
    params[#params + 1] = limit + 1
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    local has_more = #(rows or {}) > limit
    local events = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then
            local event = row :: any
            events[#events + 1] = {
                id = event.id,
                seq = tonumber(event.seq) or 0,
                ts = tonumber(event.ts) or 0,
                event_type = event.event_type,
                title = event.title,
                task_id = db_ops.trim(event.task_id) ~= "" and event.task_id or nil,
                actor_id = event.actor_id,
            }
        end
    end
    local last = events[#events]
    local next_cursor = last and last.seq or after_seq
    if not has_more then
        local head, head_err = M.last_seq(db, journal_id)
        if head == nil then return nil, head_err end
        if (head :: number) > next_cursor then next_cursor = head :: number end
    end
    return {
        events = events,
        limit = limit,
        after_seq = after_seq,
        next_cursor = next_cursor,
        has_more = has_more,
    }, nil
end

function M.task_counts(db: any, journal_id: string, task_id: string): (any?, any?)
    local id = db_ops.trim(task_id)
    if id == "" then return { children = 0, open_children = 0, facts = 0 }, nil end
    local rows, query_err = db_ops.query(db, [[
        SELECT
            (SELECT COUNT(*) FROM chestor_journal_tasks WHERE journal_id = ? AND parent_task_id = ?) AS children,
            (SELECT COUNT(*) FROM chestor_journal_tasks WHERE journal_id = ? AND parent_task_id = ?
                AND lower(status) NOT IN ('done','closed','canceled','cancelled','folded')) AS open_children,
            (SELECT COUNT(*) FROM chestor_journal_events WHERE journal_id = ? AND task_id = ?) AS facts
    ]], { journal_id, id, journal_id, id, journal_id, id })
    if query_err then return nil, query_err end
    local row = rows and rows[1] or {}
    return {
        children = tonumber((row :: any).children) or 0,
        open_children = tonumber((row :: any).open_children) or 0,
        facts = tonumber((row :: any).facts) or 0,
    }, nil
end

function M.related_delta(db: any, journal_id: string, after_seq: number, through_seq: number): (any?, any?)
    if through_seq <= after_seq then return { tasks = {}, artifacts = {} }, nil end
    local tasks, task_err = db_ops.query(db, [[
        SELECT t.* FROM chestor_journal_tasks t
          JOIN chestor_journal_events e
            ON e.journal_id = t.journal_id AND e.id = t.updated_event_id
         WHERE t.journal_id = ? AND e.seq > ? AND e.seq <= ?
         ORDER BY e.seq ASC
    ]], { journal_id, after_seq, through_seq })
    if task_err then return nil, task_err end
    for _, row in ipairs(tasks or {}) do (row :: any).metadata = db_ops.decode((row :: any).metadata, {}) end

    local artifacts, artifact_err = db_ops.query(db, [[
        SELECT a.* FROM chestor_journal_artifacts a
          JOIN chestor_journal_events e
            ON e.journal_id = a.journal_id AND e.id = a.event_id
         WHERE a.journal_id = ? AND e.seq > ? AND e.seq <= ?
         ORDER BY e.seq ASC
    ]], { journal_id, after_seq, through_seq })
    if artifact_err then return nil, artifact_err end
    for _, row in ipairs(artifacts or {}) do (row :: any).metadata = db_ops.decode((row :: any).metadata, {}) end
    return { tasks = tasks or {}, artifacts = artifacts or {} }, nil
end

function M.list_artifacts(db: any, journal_id: string, opts: any): (any?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_artifacts WHERE journal_id = ? ORDER BY created_at DESC LIMIT ?",
        { journal_id, bounded(opts and opts.limit, 100, 300) }
    )
    if query_err then return nil, query_err end
    for _, row in ipairs(rows or {}) do (row :: any).metadata = db_ops.decode((row :: any).metadata, {}) end
    return rows, nil
end

-- Artifacts as one keyset page, newest first, continued on (created_at, id).
function M.artifact_page(db: any, journal_id: string, opts: any): (any?, any?)
    local limit = bounded(opts and (opts :: any).limit, 100, 300)
    local after_created_at = tonumber(opts and (opts :: any).after_created_at)
    local after_id = db_ops.trim(opts and (opts :: any).after_id)
    local statement = "SELECT * FROM chestor_journal_artifacts WHERE journal_id = ?"
    local params: { any } = { journal_id }
    if after_created_at ~= nil then
        statement = statement .. " AND (created_at < ? OR (created_at = ? AND id > ?))"
        params[#params + 1] = math.floor(after_created_at)
        params[#params + 1] = math.floor(after_created_at)
        params[#params + 1] = after_id
    end
    statement = statement .. " ORDER BY created_at DESC, id ASC LIMIT ?"
    params[#params + 1] = limit + 1
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        (row :: any).metadata = db_ops.decode((row :: any).metadata, {})
        items[#items + 1] = row
    end
    local has_more = #(rows or {}) > limit
    local last = items[#items]
    return {
        items = items,
        limit = limit,
        has_more = has_more,
        next_cursor = has_more and last and {
            after_created_at = tonumber((last :: any).created_at) or 0,
            after_id = tostring((last :: any).id),
        } or nil,
    }, nil
end

-- Server-side time buckets: how much work landed per interval, per agent,
-- inside one bounded window. The agent behind a fact is the span that stamped
-- it; facts written before an identity had a span, and protocol noise, are
-- reported honestly rather than attributed to someone. The window itself is
-- the keyset: a caller walks time forward with next_since.
function M.activity_buckets(db: any, journal_id: string, opts: any): (any?, any?)
    local width = math.max(60, math.floor(tonumber(opts and (opts :: any).width_s) or 3600))
    local limit = bounded(opts and (opts :: any).limit, 500, 2000)
    local since = math.max(0, math.floor(tonumber(opts and (opts :: any).since) or 0))
    local until_ts = math.floor(tonumber(opts and (opts :: any).until_ts) or 0)
    local agent_id = db_ops.trim(opts and (opts :: any).agent_id)
    -- The bucket key is integer arithmetic on the stored epoch second, so the
    -- width is written into the statement rather than bound: a bound numeric
    -- parameter is a float in this runtime, and float division would give
    -- every event a bucket of its own.
    local bucket_expr = "(e.ts / " .. string.format("%d", width) .. ") * " .. string.format("%d", width)
    local params: { any } = { journal_id, since }
    local statement = [[
        SELECT ]] .. bucket_expr .. [[ AS bucket_at,
               COALESCE(s.agent_id, '') AS agent_id,
               COUNT(*) AS n,
               MIN(e.seq) AS first_seq,
               MAX(e.seq) AS last_seq,
               MAX(e.ts) AS last_ts
          FROM chestor_journal_events e
          LEFT JOIN chestor_journal_spans s
            ON s.journal_id = e.journal_id AND s.span_id = e.span_id
         WHERE e.journal_id = ? AND e.ts >= ?]]
    if until_ts > 0 then
        statement = statement .. " AND e.ts < ?"
        params[#params + 1] = until_ts
    end
    local after_bucket_at = tonumber(opts and (opts :: any).after_bucket_at)
    if after_bucket_at ~= nil then
        -- The bucket key is a row-level expression, so the continuation is a
        -- true keyset over (bucket, agent) and never re-serves a bucket it
        -- already finished, however many agents shared it.
        statement = statement .. " AND (" .. bucket_expr .. " > ?"
            .. " OR (" .. bucket_expr .. " = ? AND COALESCE(s.agent_id, '') > ?))"
        local floor_bucket = math.floor(after_bucket_at)
        params[#params + 1] = floor_bucket
        params[#params + 1] = floor_bucket
        params[#params + 1] = db_ops.trim(opts and (opts :: any).after_agent_id)
    end
    statement = statement .. protocol_clause("e.event_type", params, opts and (opts :: any).include_protocol)
    if agent_id ~= "" then
        statement = statement .. " AND s.agent_id = ?"
        params[#params + 1] = agent_id
    end
    statement = statement .. [[ GROUP BY bucket_at, COALESCE(s.agent_id, '')
        ORDER BY bucket_at ASC, agent_id ASC LIMIT ?]]
    params[#params + 1] = limit + 1
    local rows, query_err = db_ops.query(db, statement, params)
    if query_err then return nil, query_err end
    local buckets: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        buckets[#buckets + 1] = {
            bucket_at = tonumber((row :: any).bucket_at) or 0,
            agent_id = db_ops.trim((row :: any).agent_id) ~= "" and (row :: any).agent_id or nil,
            events = tonumber((row :: any).n) or 0,
            first_seq = tonumber((row :: any).first_seq) or 0,
            last_seq = tonumber((row :: any).last_seq) or 0,
            last_ts = tonumber((row :: any).last_ts) or 0,
        }
    end
    local has_more = #(rows or {}) > limit
    local last = buckets[#buckets]
    return {
        buckets = buckets,
        width_s = width,
        limit = limit,
        since = since,
        until_ts = until_ts > 0 and until_ts or nil,
        has_more = has_more,
        next_cursor = has_more and last and {
            after_bucket_at = (last :: any).bucket_at,
            after_agent_id = (last :: any).agent_id or "",
        } or nil,
    }, nil
end

function M.references(db: any, journal_id: string, opts: any): (any?, any?)
    local graph_id = db_ops.trim(opts and opts.graph_id)
    local node_id = db_ops.trim(opts and opts.node_id)
    local ref_id = db_ops.trim(opts and opts.ref_id)
    local query = db_ops.trim(opts and opts.query)
    local include_removed = opts and (opts :: any).include_removed == true
    local limit = bounded(opts and opts.limit, 100, 500)
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local where = [[ FROM chestor_journal_node_refs nr
        JOIN chestor_journal_references r
          ON r.journal_id = nr.journal_id AND r.ref_id = nr.ref_id
       WHERE nr.journal_id = ?
         AND (? = '' OR nr.graph_id = ?)
         AND (? = '' OR nr.node_id = ?)
         AND (? = '' OR nr.ref_id = ?)
         AND (? = 1 OR nr.state = 'active')
         AND (? = '' OR lower(r.uri || ' ' || COALESCE(r.title, '') || ' ' ||
                   r.ref_kind || ' ' || nr.relation) LIKE lower(?))]]
    local params: { any } = { journal_id, graph_id, graph_id, node_id, node_id, ref_id, ref_id,
        include_removed and 1 or 0, query, "%" .. query .. "%" }
    local page_params: { any } = {}
    for _, value in ipairs(params) do page_params[#page_params + 1] = value end
    page_params[#page_params + 1] = limit + 1
    page_params[#page_params + 1] = offset
    local rows, rows_err = db_ops.query(db, [[
        SELECT nr.*, r.uri, r.ref_kind, r.title, r.version, r.content_hash,
               r.attrs_json AS ref_attrs_json
    ]] .. where .. [[
         ORDER BY nr.updated_seq DESC, nr.graph_id ASC, nr.node_id ASC, nr.ref_id ASC, nr.relation ASC
         LIMIT ? OFFSET ?
    ]], page_params)
    if rows_err then return nil, rows_err end
    local counts, count_err = db_ops.query(db, "SELECT COUNT(*) AS n" .. where, params)
    if count_err then return nil, count_err end
    local total = counts and counts[1] and tonumber((counts[1] :: any).n) or 0
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then
            local item = row :: any
            item.attrs = db_ops.decode(item.attrs_json, {})
            item.ref_attrs = db_ops.decode(item.ref_attrs_json, {})
            item.attrs_json = nil
            item.ref_attrs_json = nil
            item.created_seq = tonumber(item.created_seq) or 0
            item.updated_seq = tonumber(item.updated_seq) or 0
            items[#items + 1] = item
        end
    end
    return {
        items = items,
        total = total,
        offset = offset,
        limit = limit,
        has_more = total > offset + #items,
        next_offset = total > offset + #items and offset + #items or nil,
    }, nil
end

function M.stats(db: any, journal_id: string): (any?, any?)
    local grouped, grouped_err = db_ops.query(db,
        "SELECT event_type, COUNT(*) AS count FROM chestor_journal_events WHERE journal_id = ? GROUP BY event_type",
        { journal_id }
    )
    if grouped_err then return nil, grouped_err end
    local by_type = {}
    local total = 0
    for _, row in ipairs(grouped or {}) do
        local count = tonumber((row :: any).count) or 0
        by_type[tostring((row :: any).event_type or "")] = count
        total = total + count
    end
    local summary, summary_err = db_ops.query(db, [[
        SELECT
            (SELECT MAX(seq) FROM chestor_journal_events WHERE journal_id = ?) AS last_seq,
            (SELECT MAX(ts) FROM chestor_journal_events WHERE journal_id = ?) AS last_ts,
            (SELECT COUNT(*) FROM chestor_journal_tasks WHERE journal_id = ?) AS task_count,
            (SELECT COUNT(*) FROM chestor_journal_tasks WHERE journal_id = ? AND lower(status) NOT IN ('done','closed','canceled','cancelled','folded')) AS open_task_count,
            (SELECT COUNT(*) FROM chestor_journal_artifacts WHERE journal_id = ?) AS artifact_count
    ]], { journal_id, journal_id, journal_id, journal_id, journal_id })
    if summary_err then return nil, summary_err end
    local row = summary and summary[1] or {}
    return {
        total = total,
        by_type = by_type,
        last_seq = tonumber((row :: any).last_seq) or 0,
        last_ts = tonumber((row :: any).last_ts) or 0,
        task_count = tonumber((row :: any).task_count) or 0,
        open_task_count = tonumber((row :: any).open_task_count) or 0,
        artifact_count = tonumber((row :: any).artifact_count) or 0,
    }, nil
end

local function search_terms(text: string): { string }
    local terms: { string } = {}
    for raw in text:gmatch("%S+") do
        if #terms >= 32 then break end
        local term = raw:sub(1, 128)
        if term ~= "" then terms[#terms + 1] = term end
    end
    return terms
end

function M.search_text(db: any, journal_id: string, text: string, limit: number, opts: any?): (any?, any?)
    local query_text = db_ops.trim(text)
    if query_text == "" then return {}, nil end
    local terms = search_terms(query_text)
    local from_time = math.max(0, math.floor(tonumber(opts and opts.from_time) or 0))
    local to_time = math.max(0, math.floor(tonumber(opts and opts.to_time) or 0))
    local dialect, dialect_err = db:type()
    if dialect_err then return nil, errors.new({ message = "could not determine search database type: " .. tostring(dialect_err), kind = errors.INVALID }) end
    local validity, validity_err = retrieval_state.normalize(opts and opts.validity)
    if not validity then return nil, validity_err end
    local state_expr = retrieval_state.event_expression(tostring(dialect), "e")
    local state_clause, state_params = retrieval_state.filter(state_expr, validity)
    local successor_expr = retrieval_state.successor_expression("e")
    local rows, query_err
    if tostring(dialect) == "sqlite" then
        local match_terms = {}
        for _, term in ipairs(terms) do
            match_terms[#match_terms + 1] = '"' .. term:gsub('"', '""') .. '"'
        end
        local params: { any } = { journal_id, table.concat(match_terms, " AND "),
            from_time, from_time, to_time, to_time }
        for _, value in ipairs(state_params) do params[#params + 1] = value end
        params[#params + 1] = math.max(1, math.floor(tonumber(limit) or 20))
        params[#params + 1] = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
        rows, query_err = db_ops.query(db, [[
            SELECT e.*, 0 AS distance, ]] .. state_expr .. [[ AS effective_state,
                   ]] .. successor_expr .. [[ AS superseded_by_event_id
              FROM chestor_journal_fts f
              JOIN chestor_journal_events e
                ON e.journal_id = f.journal_id AND e.id = f.event_id
             WHERE f.journal_id = ?
               AND chestor_journal_fts MATCH ?
               AND (? = 0 OR e.ts >= ?)
               AND (? = 0 OR e.ts <= ?)
               ]] .. state_clause .. [[
             ORDER BY e.seq DESC
             LIMIT ? OFFSET ?
        ]], params)
    else
        local clauses = {}
        local params = { journal_id }
        local document = "lower(COALESCE(f.event_type, '') || ' ' || COALESCE(f.title, '') || ' ' || COALESCE(f.body, '') || ' ' || COALESCE(f.tags, ''))"
        for _, term in ipairs(terms) do
            clauses[#clauses + 1] = document .. " LIKE lower(?) ESCAPE '\\'"
            local escaped = term:gsub("\\", "\\\\"):gsub("%%", "\\%%"):gsub("_", "\\_")
            params[#params + 1] = "%" .. escaped .. "%"
        end
        params[#params + 1] = from_time
        params[#params + 1] = from_time
        params[#params + 1] = to_time
        params[#params + 1] = to_time
        for _, value in ipairs(state_params) do params[#params + 1] = value end
        params[#params + 1] = math.max(1, math.floor(tonumber(limit) or 20))
        params[#params + 1] = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
        rows, query_err = db_ops.query(db, [[
            WITH matches AS MATERIALIZED (
                SELECT f.journal_id, f.event_id
                  FROM chestor_journal_fts f
                 WHERE f.journal_id = ? AND ]] .. table.concat(clauses, " AND ") .. [[
            )
            SELECT e.*, 0 AS distance, ]] .. state_expr .. [[ AS effective_state,
                   ]] .. successor_expr .. [[ AS superseded_by_event_id
              FROM matches f
              JOIN chestor_journal_events e
                ON e.journal_id = f.journal_id AND e.id = f.event_id
             WHERE (? = 0 OR e.ts >= ?)
               AND (? = 0 OR e.ts <= ?)
               ]] .. state_clause .. [[
             ORDER BY e.seq DESC
             LIMIT ? OFFSET ?
        ]], params)
    end
    if query_err then return nil, query_err end
    local out = {}
    for _, row in ipairs(rows or {}) do out[#out + 1] = M.decode_event(row) end
    return out, nil
end

function M.pending_embeddings(db: any, journal_id: string, limit: number, model: string?, model_version: string?): (any?, any?)
    local wanted = bounded(limit, 16, 64)
    if db_ops.trim(model) ~= "" and db_ops.trim(model_version) ~= "" then
        local events, event_err = db_ops.query(db, [[
            SELECT e.*, 'event' AS source_type, e.id AS source_id,
                   NULL AS graph_id, NULL AS node_id
              FROM chestor_journal_events e
             LEFT JOIN chestor_journal_embedding_documents d
               ON d.journal_id = e.journal_id
              AND d.source_type = 'event' AND d.source_id = e.id
              AND d.model = ? AND d.model_version = ?
             WHERE e.journal_id = ? AND e.embedding_status <> 'skipped'
               AND (d.document_id IS NULL OR d.status <> 'embedded')
             ORDER BY e.seq ASC LIMIT ?
        ]], { model, model_version, journal_id, wanted })
        if event_err then return nil, event_err end
        local out: { any } = {}
        for _, event in ipairs(events or {}) do out[#out + 1] = event end
        if #out >= wanted then return out, nil end
        local nodes, node_err = db_ops.query(db, [[
            SELECT n.id, n.id AS source_id, 'node' AS source_type,
                   n.graph_id, n.id AS node_id, n.updated_revision AS seq,
                   n.updated_at AS ts, n.node_kind AS event_type,
                   n.label AS title, n.summary AS body, n.metadata AS metadata
              FROM chestor_journal_graph_nodes n
              LEFT JOIN chestor_journal_embedding_documents d
                ON d.journal_id = n.journal_id
               AND d.source_type = 'node' AND d.source_id = n.id
               AND d.graph_id = n.graph_id AND d.node_id = n.id
               AND d.model = ? AND d.model_version = ?
             WHERE n.journal_id = ? AND (d.document_id IS NULL
                OR d.status <> 'embedded'
                OR d.source_revision < n.updated_revision)
             ORDER BY n.updated_at ASC, n.graph_id ASC, n.id ASC LIMIT ?
        ]], { model, model_version, journal_id, wanted - #out })
        if node_err then return nil, node_err end
        for _, node in ipairs(nodes or {}) do out[#out + 1] = node end
        return out, nil
    end
    return db_ops.query(db,
        "SELECT * FROM chestor_journal_events WHERE journal_id = ? AND embedding_status IN ('pending','failed') ORDER BY seq ASC LIMIT ?",
        { journal_id, bounded(limit, 16, 64) }
    )
end

function M.embedding_backlog(db: any, journal_id: string, model: string?, model_version: string?): (number?, any?)
    local rows, err
    if db_ops.trim(model) ~= "" and db_ops.trim(model_version) ~= "" then
        rows, err = db_ops.query(db, [[
            SELECT SUM(n) AS n FROM (
            SELECT COUNT(*) AS n FROM chestor_journal_events e
             LEFT JOIN chestor_journal_embedding_documents d
               ON d.journal_id = e.journal_id
              AND d.source_type = 'event' AND d.source_id = e.id
              AND d.model = ? AND d.model_version = ?
             WHERE e.journal_id = ? AND e.embedding_status <> 'skipped'
               AND (d.document_id IS NULL OR d.status <> 'embedded')
            UNION ALL
            SELECT COUNT(*) AS n FROM chestor_journal_graph_nodes g
             LEFT JOIN chestor_journal_embedding_documents d
               ON d.journal_id = g.journal_id
              AND d.source_type = 'node' AND d.source_id = g.id
              AND d.graph_id = g.graph_id AND d.node_id = g.id
              AND d.model = ? AND d.model_version = ?
             WHERE g.journal_id = ? AND (d.document_id IS NULL OR d.status <> 'embedded'
                OR d.source_revision < g.updated_revision)
            ) pending
        ]], { model, model_version, journal_id, model, model_version, journal_id })
    else
        rows, err = db_ops.query(db,
            "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND embedding_status IN ('pending','failed')",
            { journal_id }
        )
    end
    if err then return nil, err end
    return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
end

return M

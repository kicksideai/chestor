local types = require("types")
local thread_log = require("thread_log")
local db_ops = require("db")
local reader = require("reader")
local cursors = require("cursors")
local spans = require("spans")
local graph_reader = require("graph_reader")
local enforcement = require("enforcement")
local branch_digests = require("branch_digests")
local health_status = require("health_status")

local M = {}

local function bounded(value: any, fallback: number, maximum: number): number
    return math.max(1, math.min(math.floor(tonumber(value) or fallback), maximum))
end

local function trim(value: any): string
    return db_ops.trim(value)
end

local function placeholders(count: number): string
    local parts: { string } = {}
    for _ = 1, count do parts[#parts + 1] = "?" end
    return table.concat(parts, ",")
end

local function with_db(fn: (any) -> (any?, any?)): (any?, any?)
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local value, err = fn(db)
    db:release()
    if err then return nil, err end
    return value, nil
end

-- A checkpoint is the recovery state an agent stored for itself. Presence
-- needs its shape and one readable line, so the blob stays where it was
-- written and the roll carries a summary of it.
local function checkpoint_summary(checkpoint: any): any
    local keys: { string } = {}
    if type(checkpoint) ~= "table" then return { keys = keys, entries = 0 } end
    for key in pairs(checkpoint :: any) do keys[#keys + 1] = tostring(key) end
    table.sort(keys)
    local headline = ""
    for _, key in ipairs(keys) do
        local value = (checkpoint :: any)[key]
        if type(value) == "string" then
            headline = trim(value)
        elseif type(value) == "table" and type((value :: any)[1]) == "string" then
            headline = trim((value :: any)[1])
        end
        if headline ~= "" then break end
    end
    if #headline > 200 then headline = headline:sub(1, 199) .. "…" end
    local named: { string } = {}
    for index, key in ipairs(keys) do
        if index > 12 then break end
        named[#named + 1] = key
    end
    return {
        keys = named,
        entries = #keys,
        headline = headline ~= "" and headline or nil,
    }
end

-- The presence view of one cursor row: identity, consumption watermark, the
-- graph address it holds when it has one, and the record its watermark last
-- landed on. Protocol state an agent negotiates - revision, close
-- requirements, context refs - stays on the cursor lens that owns it.
local function cursor_view(row: any, touches: any): any
    local graph_id = trim((row :: any).current_graph_id)
    local node_id = trim((row :: any).current_node_id)
    local parent_id = trim((row :: any).parent_cursor_id)
    local purpose = trim((row :: any).purpose)
    local last_seen_seq = tonumber((row :: any).last_seen_seq) or 0
    local view: any = {
        cursor_id = (row :: any).cursor_id,
        agent_id = (row :: any).agent_id,
        origin = trim((row :: any).origin) ~= "" and trim((row :: any).origin) or "explicit",
        state = (row :: any).state,
        last_seen_seq = last_seen_seq,
        checkpoint_seq = tonumber((row :: any).checkpoint_seq) or 0,
        created_at = tonumber((row :: any).created_at),
        updated_at = tonumber((row :: any).updated_at),
        checkpoint = checkpoint_summary((row :: any).checkpoint),
    }
    if purpose ~= "" then view.purpose = purpose end
    if parent_id ~= "" then view.parent_cursor_id = parent_id end
    if graph_id ~= "" and node_id ~= "" then
        view.position = { graph_id = graph_id, node_id = node_id }
    end
    local touch = (touches :: any)[last_seen_seq]
    if touch then view.last_touch = touch end
    return view
end

-- The work span a position is currently inside, as the presence roll needs it:
-- what the agent said it is working on and how much it has done there.
local function span_view(row: any, last_fact: any): any
    local view: any = {
        span_id = (row :: any).span_id,
        agent_id = (row :: any).agent_id,
        cursor_id = (row :: any).cursor_id,
        origin = trim((row :: any).origin) ~= "" and trim((row :: any).origin) or "auto",
        state = (row :: any).state,
        started_seq = tonumber((row :: any).started_seq) or 0,
        last_seq = tonumber((row :: any).last_seq) or 0,
        fact_count = tonumber((row :: any).fact_count) or 0,
        started_at = tonumber((row :: any).started_at) or 0,
        last_activity_at = tonumber((row :: any).last_activity_at) or 0,
        ended_at = tonumber((row :: any).ended_at),
        closed_reason = trim((row :: any).closed_reason) ~= "" and (row :: any).closed_reason or nil,
    }
    view.duration_s = math.max(0,
        (tonumber((row :: any).ended_at) or tonumber((row :: any).last_activity_at) or 0)
            - (tonumber((row :: any).started_at) or 0))
    local purpose_kind = trim((row :: any).purpose_kind)
    if purpose_kind ~= "" and purpose_kind ~= "none" then
        view.working_on = {
            text = (row :: any).purpose,
            kind = purpose_kind,
            task_id = trim((row :: any).purpose_task_id) ~= "" and (row :: any).purpose_task_id or nil,
            address = trim((row :: any).purpose_graph_id) ~= "" and trim((row :: any).purpose_node_id) ~= "" and {
                graph_id = (row :: any).purpose_graph_id,
                node_id = (row :: any).purpose_node_id,
            } or nil,
        }
    end
    if last_fact then view.last_fact = last_fact end
    return view
end

-- One keyset page of spans with each span's newest work fact attached.
local function span_page(db: any, thread_id: string, opts: any): (any?, any?)
    local page, page_err = spans.page(db, thread_id, opts)
    if not page then return nil, page_err end
    local ids: { string } = {}
    for _, row in ipairs((page :: any).items or {}) do
        ids[#ids + 1] = tostring((row :: any).span_id)
    end
    local facts, facts_err = spans.last_facts(db, thread_id, ids)
    if not facts then return nil, facts_err end
    local items: { any } = {}
    for _, row in ipairs((page :: any).items or {}) do
        items[#items + 1] = span_view(row, (facts :: any)[tostring((row :: any).span_id)])
    end
    return {
        items = items,
        limit = (page :: any).limit,
        has_more = (page :: any).has_more,
        next_cursor = (page :: any).next_cursor,
    }, nil
end

-- The journal's presence roll on one open connection, so the aggregate
-- snapshot and the dedicated read answer with the same rows. Each position
-- carries the open span it is inside, so a presence read answers who is here,
-- how far they have read, and what they are working on in one request.
local function cursor_page(db: any, thread_id: string, opts: any): (any?, any?)
    local page, page_err = cursors.list(db, thread_id, opts)
    if not page then return nil, page_err end
    local seqs: { number } = {}
    for _, row in ipairs((page :: any).items or {}) do
        seqs[#seqs + 1] = tonumber((row :: any).last_seen_seq) or 0
    end
    local touches, touch_err = cursors.touches(db, thread_id, seqs)
    if not touches then return nil, touch_err end
    local ids: { string } = {}
    for _, row in ipairs((page :: any).items or {}) do
        ids[#ids + 1] = tostring((row :: any).cursor_id)
    end
    local open_spans, open_err = spans.open_for_cursors(db, thread_id, ids)
    if not open_spans then return nil, open_err end
    local items: { any } = {}
    for _, row in ipairs((page :: any).items or {}) do
        local view = cursor_view(row, touches)
        local open = (open_spans :: any)[tostring((row :: any).cursor_id)]
        if open then (view :: any).span = span_view(open, nil) end
        items[#items + 1] = view
    end
    return {
        items = items,
        total = (page :: any).total,
        limit = (page :: any).limit,
        omitted = (page :: any).omitted,
        has_more = (page :: any).has_more,
        next_cursor = (page :: any).next_cursor,
    }, nil
end

-- Who holds a durable position in this journal, how far each has consumed, and
-- the record that watermark last landed on. Access is the same gate every
-- other read passes through.
function M.cursors(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        local page, page_err = cursor_page(db, thread_id, {
            limit = bounded(opts and opts.limit, 50, 200),
            after_updated_at = opts and (opts :: any).after_updated_at,
            after_cursor_id = opts and (opts :: any).after_cursor_id,
        })
        if not page then return nil, page_err end
        (page :: any).journal_id = journal_id
        return page, nil
    end)
end

-- Work spans: who has been working here, on what, and when. state narrows to
-- open or sealed episodes, agent_id to one identity, task_id to the spans that
-- touched one task. Every page is keyset-continued on (last_activity_at,
-- span_id) and carries the open count the journal has right now.
function M.spans(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        local page, page_err = span_page(db, thread_id, {
            state = opts and (opts :: any).state,
            agent_id = opts and (opts :: any).agent_id,
            cursor_id = opts and (opts :: any).cursor_id,
            task_id = opts and (opts :: any).task_id,
            since = opts and (opts :: any).since,
            limit = bounded(opts and (opts :: any).limit, 50, 200),
            after_activity_at = opts and (opts :: any).after_activity_at,
            after_span_id = opts and (opts :: any).after_span_id,
        })
        if not page then return nil, page_err end
        local counts, counts_err = spans.counts(db, thread_id)
        if not counts then return nil, counts_err end
        (page :: any).journal_id = journal_id;
        (page :: any).counts = counts;
        (page :: any).idle_s = types.span_idle_s()
        return page, nil
    end)
end

-- Server-side activity buckets for agent lanes: one row per interval per
-- agent, over a bounded window, continued by keyset. bucket picks the interval
-- width; the caller never folds the event log to draw a timeline.
function M.activity(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local bucket = string.lower(trim(opts and (opts :: any).bucket))
    if bucket == "" then bucket = "hour" end
    local width = bucket == "day" and 86400 or (bucket == "minute" and 60 or 3600)
    if bucket ~= "day" and bucket ~= "hour" and bucket ~= "minute" then
        return nil, errors.new({ message = "activity bucket must be minute, hour, or day", kind = errors.INVALID })
    end
    return with_db(function(db)
        local page, page_err = reader.activity_buckets(db, thread_id, {
            width_s = width,
            since = opts and (opts :: any).since,
            until_ts = opts and (opts :: any).until_ts,
            agent_id = opts and (opts :: any).agent_id,
            after_bucket_at = opts and (opts :: any).after_bucket_at,
            after_agent_id = opts and (opts :: any).after_agent_id,
            limit = opts and (opts :: any).limit,
        })
        if not page then return nil, page_err end
        (page :: any).journal_id = journal_id;
        (page :: any).bucket = bucket
        return page, nil
    end)
end

-- The options M.state accepts, named once so the surfaces that carry them -
-- the journal endpoint's query string above all - forward the whole vocabulary
-- instead of a subset that leaves a page unreachable. Every collection in the
-- snapshot contributes its limit and the continuation keys its next_cursor
-- hands back.
M.STATE_PARAMS = {
    "limit", "before_seq",
    "task_limit", "task_after_sort_order", "task_after_updated_at", "task_after_id",
    "artifact_limit", "artifact_after_created_at", "artifact_after_id",
    "graph_limit", "graph_after_rank", "graph_after_updated_at", "graph_after_id",
    "cursor_limit", "cursor_after_updated_at", "cursor_after_id",
    "span_limit", "span_after_activity_at", "span_after_id",
    "work_limit",
}

-- Concurrency authority is not presence and it is not task lifecycle. This
-- bounded control roll makes that distinction visible: live leases say who may
-- mutate now, while an in_progress task without one is explicitly resumable.
-- Expired rows never masquerade as active merely because the reaper has not
-- consumed them yet.
local function work_control(db: any, thread_id: string, limit: number, offset: number?): (any?, any?)
    local now = db_ops.now()
    local skipped = math.max(0, math.floor(tonumber(offset) or 0))
    local live, live_err = db_ops.query(db, [[
        SELECT l.lease_id, l.agent_id, l.task_id, l.capability,
               l.fencing_token, l.issued_at, l.ttl_s, l.expires_at,
               t.title AS task_title, t.status AS task_status,
               t.updated_at AS task_updated_at
          FROM chestor_journal_leases l
          LEFT JOIN chestor_journal_tasks t
            ON t.journal_id = l.journal_id AND t.id = l.task_id
         WHERE l.journal_id = ? AND l.revoked = 0 AND l.expires_at > ?
         ORDER BY l.expires_at ASC, l.lease_id ASC LIMIT ? OFFSET ?
    ]], { thread_id, now, limit + 1, skipped })
    if live_err then return nil, live_err end
    local resumable, resumable_err = db_ops.query(db, [[
        SELECT t.id AS task_id, t.title AS task_title, t.status AS task_status,
               t.updated_at AS task_updated_at
          FROM chestor_journal_tasks t
          LEFT JOIN chestor_journal_leases l
            ON l.journal_id = t.journal_id AND l.task_id = t.id
           AND l.revoked = 0 AND l.expires_at > ?
         WHERE t.journal_id = ? AND lower(t.status) = 'in_progress'
           AND l.lease_id IS NULL
         ORDER BY t.updated_at DESC, t.id ASC LIMIT ? OFFSET ?
    ]], { now, thread_id, limit + 1, skipped })
    if resumable_err then return nil, resumable_err end

    local live_rows = (live or {}) :: { any }
    local resumable_rows = (resumable or {}) :: { any }
    local live_more = #live_rows > limit
    local resumable_more = #resumable_rows > limit
    while #live_rows > limit do table.remove(live_rows) end
    while #resumable_rows > limit do table.remove(resumable_rows) end
    local write_count = 0
    local planning_count = 0
    local leases: { any } = {}
    for _, raw in ipairs(live_rows) do
        local row = raw :: any
        local capability = tostring(row.capability or "PLANNING")
        if capability == enforcement.CAPABILITY.WRITE then write_count = write_count + 1
        else planning_count = planning_count + 1 end
        leases[#leases + 1] = {
            lease_id = row.lease_id,
            agent_id = row.agent_id,
            task_id = row.task_id,
            task_title = row.task_title,
            task_status = row.task_status,
            capability = capability,
            fencing_token = tonumber(row.fencing_token),
            issued_at = tonumber(row.issued_at),
            expires_at = tonumber(row.expires_at),
            remaining_s = math.max(0, (tonumber(row.expires_at) or now) - now),
            task_updated_at = tonumber(row.task_updated_at),
        }
    end
    local resumable_tasks: { any } = {}
    for _, raw in ipairs(resumable_rows) do
        local row = raw :: any
        resumable_tasks[#resumable_tasks + 1] = {
            task_id = row.task_id,
            task_title = row.task_title,
            task_status = row.task_status,
            task_updated_at = tonumber(row.task_updated_at),
            next = { tool = "ActOnJournal", verb = "open_branch", task_id = row.task_id },
        }
    end
    return {
        now = now,
        leases = leases,
        resumable = resumable_tasks,
        counts = {
            active = #leases,
            write = write_count,
            planning = planning_count,
            resumable = #resumable_tasks,
        },
        limit = limit,
        has_more = live_more or resumable_more,
        next_cursor = (live_more or resumable_more) and { offset = skipped + limit } or nil,
    }, nil
end

-- Focused agent/operator read of the same control roll the UI snapshot embeds.
function M.authority(journal_id: string, opts: any?): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        local value, err = work_control(db, thread_id,
            bounded(opts and (opts :: any).limit, 100, 200), tonumber(opts and opts.offset))
        if not value then return nil, err end
        (value :: any).journal_id = journal_id
        return value, nil
    end)
end

-- State serves the latest committed read-model snapshot. It deliberately never
-- calls catch_up_projection; the background projection runner owns its cursor.
-- opts.limit bounds the event tail: a caller asking for the last two records
-- receives two, newest first, not the whole log.
function M.state(journal_id: string, opts: any?): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local source: any = type(opts) == "table" and opts or {}
    local event_limit = bounded(source.limit, 60, 200)
    local task_limit = bounded(source.task_limit, 200, 500)
    local artifact_limit = bounded(source.artifact_limit, 200, 300)
    local graph_limit = bounded(source.graph_limit, 200, 200)
    local cursor_limit = bounded(source.cursor_limit, 50, 200)
    local span_limit = bounded(source.span_limit, 50, 200)
    local work_limit = bounded(source.work_limit, 100, 200)
    return with_db(function(db)
        local event_page, event_err = reader.event_page(db, thread_id, {
            limit = event_limit, before_seq = source.before_seq,
        })
        if event_err then return nil, event_err end
        -- Every collection this snapshot carries is a keyset page: the caller
        -- gets a window it can continue, never a silently truncated fold.
        local task_page, task_err = reader.task_page(db, thread_id, {
            limit = task_limit,
            after_sort_order = source.task_after_sort_order,
            after_updated_at = source.task_after_updated_at,
            after_id = source.task_after_id,
        })
        if not task_page then return nil, task_err end
        local artifact_page, artifact_err = reader.artifact_page(db, thread_id, {
            limit = artifact_limit,
            after_created_at = source.artifact_after_created_at,
            after_id = source.artifact_after_id,
        })
        if not artifact_page then return nil, artifact_err end
        local stats, stats_err = reader.stats(db, thread_id)
        if stats_err then return nil, stats_err end
        local graph_page, graphs_err = graph_reader.catalog_page(db, thread_id, {
            limit = graph_limit,
            after_rank = source.graph_after_rank,
            after_updated_at = source.graph_after_updated_at,
            after_graph_id = source.graph_after_id,
        })
        if not graph_page then return nil, graphs_err end
        local journal_state, journal_state_err = reader.journal_state(db, thread_id)
        if journal_state_err then return nil, journal_state_err end
        local cursor_roll, cursor_err = cursor_page(db, thread_id, {
            limit = cursor_limit,
            after_updated_at = source.cursor_after_updated_at,
            after_cursor_id = source.cursor_after_id,
        })
        if not cursor_roll then return nil, cursor_err end
        local open_spans, span_err = span_page(db, thread_id, {
            state = "open",
            limit = span_limit,
            after_activity_at = source.span_after_activity_at,
            after_span_id = source.span_after_id,
        })
        if not open_spans then return nil, span_err end
        local authority, authority_err = work_control(db, thread_id, work_limit)
        if not authority then return nil, authority_err end
        return {
            journal_id = journal_id,
            thread_id = thread_id,
            projection_kind = types.PROJECTION_KIND,
            events = event_page.events,
            event_page = {
                limit = event_page.limit,
                next_before_seq = event_page.next_before_seq,
                has_more = event_page.has_more,
            },
            tasks = (task_page :: any).items,
            task_page = {
                limit = (task_page :: any).limit,
                next_cursor = (task_page :: any).next_cursor,
                has_more = (task_page :: any).has_more,
            },
            artifacts = (artifact_page :: any).items,
            artifact_page = {
                limit = (artifact_page :: any).limit,
                next_cursor = (artifact_page :: any).next_cursor,
                has_more = (artifact_page :: any).has_more,
            },
            stats = stats,
            graphs = (graph_page :: any).items,
            graph_page = {
                limit = (graph_page :: any).limit,
                next_cursor = (graph_page :: any).next_cursor,
                has_more = (graph_page :: any).has_more,
            },
            journal_state = journal_state,
            cursors = cursor_roll,
            spans = open_spans,
            work_control = authority,
        }, nil
    end)
end

-- The journal state row carries the active-task pointer and current digest.
function M.journal_state(journal_id: string): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db) return reader.journal_state(db, thread_id) end)
end

-- Brief is the phase-boundary read path. Keep every query independently bounded
-- so agents can recover without constructing the broader UI/state snapshot.
function M.brief(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local event_limit = bounded(opts and opts.limit, 6, 12)
    local graph_limit = 12
    return with_db(function(db)
        local event_page, event_err = reader.event_page(db, thread_id, { limit = event_limit })
        if not event_page then return nil, event_err end
        local tasks, task_err = reader.list_tasks(db, thread_id, { status = "active", limit = 10 })
        if not tasks then return nil, task_err end
        local journal_state, journal_state_err = reader.journal_state(db, thread_id)
        if journal_state_err then return nil, journal_state_err end
        local digest = nil
        if journal_state and db_ops.trim((journal_state :: any).digest) ~= "" then
            digest = {
                body = (journal_state :: any).digest,
                ts = tonumber((journal_state :: any).digest_updated_at),
            }
        end
        local checkpoint, checkpoint_err = reader.latest_event_type(db, thread_id, "checkpoint")
        if checkpoint_err then return nil, checkpoint_err end
        local stats, stats_err = reader.stats(db, thread_id)
        if not stats then return nil, stats_err end
        local catalog, graph_err = graph_reader.catalog_page(db, thread_id, { limit = graph_limit })
        if not catalog then return nil, graph_err end

        local graphs = (catalog :: any).items
        local graph_revisions = {}
        for _, item in ipairs(graphs) do
            local graph = item :: any
            graph_revisions[tostring(graph.id)] = {
                status = graph.health or graph.lifecycle,
                lifecycle = graph.lifecycle,
                config_revision = graph.config_revision,
                revision = graph.revision,
                source_seq = graph.last_source_seq,
            }
        end
        local last_seq = tonumber((stats :: any).last_seq) or 0
        local health_snapshot, health_err = health_status.snapshot_meta(thread_id)
        if health_err then return nil, health_err end
        local health = health_status.derive(health_snapshot, nil)
        return {
            current_digest = digest,
            latest_checkpoint = checkpoint,
            recent_events = event_page.events,
            active_tasks = tasks,
            graphs = graphs,
            graphs_truncated = (catalog :: any).has_more == true,
            graphs_next_cursor = (catalog :: any).next_cursor,
            health = {
                status = (health :: any).status,
                summary = health_status.summary(health),
            },
            stats = {
                total = (stats :: any).total,
                last_seq = last_seq,
                last_ts = (stats :: any).last_ts,
                open_task_count = (stats :: any).open_task_count,
                artifact_count = (stats :: any).artifact_count,
            },
            cursor = { last_seq = last_seq },
            projection = {
                journal = { status = "ready", last_seq = last_seq },
                graphs = graph_revisions,
            },
            resume_prompt = "Resume from the digest and checkpoint, verify active tasks, then record durable decisions, blockers, and completion updates.",
        }, nil
    end)
end

-- Health-of-health read path (X6/D5): the stored heartbeat snapshot from the
-- workspace component meta plus reader-computed staleness. unknown when the
-- heartbeat is older than two intervals or was never written; degraded when
-- any component the writer measured is degraded, with the reason surfaced.
-- opts.now injects the reader clock for tests.
function M.health(journal_id: string, opts: any?): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local snapshot, meta_err = health_status.snapshot_meta(thread_id)
    if meta_err then return nil, meta_err end
    local health: any = health_status.derive(snapshot, opts and opts.now)
    health.journal_id = journal_id
    return health, nil
end

function M.events(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        return reader.event_page(db, thread_id, {
            limit = bounded(opts and opts.limit, 60, 200),
            before_seq = opts and opts.before_seq,
        })
    end)
end

function M.updates(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        local page, page_err = reader.event_delta(db, thread_id, {
            limit = bounded(opts and opts.limit, 100, 200),
            after_seq = opts and opts.after_seq,
        })
        if not page then return nil, page_err end
        local related, related_err = reader.related_delta(db, thread_id,
            tonumber(page.after_seq) or 0, tonumber(page.next_after_seq) or 0)
        if not related then return nil, related_err end
        return {
            events = page.events,
            tasks = related.tasks,
            artifacts = related.artifacts,
            limit = page.limit,
            after_seq = page.after_seq,
            next_after_seq = page.next_after_seq,
            has_more = page.has_more,
        }, nil
    end)
end

function M.tasks(journal_id: string, opts: any): (any?, any?, any?, boolean?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local page, page_err = with_db(function(db)
        return reader.task_page(db, thread_id, opts or {})
    end)
    if not page then return nil, page_err end
    return page.items, nil, page.next_cursor, page.has_more
end

function M.event(journal_id: string, event_id: string): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db) return reader.get_event(db, thread_id, event_id) end)
end

function M.search_text(journal_id: string, query_text: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        return reader.search_text(db, thread_id, query_text,
            math.max(1, math.floor(tonumber(opts and opts.limit) or 20)), opts)
    end)
end

function M.references(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        return reader.references(db, thread_id, opts or {})
    end)
end

-- "Root > Parent > Task" spine text for frontier and cross-exception entries.
local function title_path(db: any, thread_id: string, task: any): (string?, any?)
    local ancestors, ancestors_err = reader.task_ancestors(db, thread_id, trim((task :: any).id), 32)
    if not ancestors then return nil, ancestors_err end
    local parts: { string } = {}
    for _, row in ipairs(ancestors :: { any }) do
        local title = trim((row :: any).title)
        parts[#parts + 1] = title ~= "" and title or trim((row :: any).id)
    end
    local own = trim((task :: any).title)
    parts[#parts + 1] = own ~= "" and own or trim((task :: any).id)
    return table.concat(parts, " > "), nil
end

-- Attaches per-branch digest state (X7): digest text plus digest_age_seq =
-- journal last_seq - digest source_seq. Rows without a computed digest keep
-- both fields nil.
local function attach_digests(db: any, thread_id: string, rows: any, last_seq: number): error?
    local ids: { string } = {}
    for _, row in ipairs(rows :: { any }) do ids[#ids + 1] = trim((row :: any).id) end
    local digests, digests_err = branch_digests.for_tasks(db, thread_id, ids)
    if not digests then return digests_err end
    for _, row in ipairs(rows :: { any }) do
        local entry = row :: any
        local digest = (digests :: any)[trim(entry.id)]
        if digest then
            entry.digest = (digest :: any).digest
            entry.digest_age_seq = math.max(0, last_seq - (tonumber((digest :: any).source_seq) or 0))
            entry.digest_stale = tonumber((digest :: any).stale) == 1 or nil
        end
    end
    return nil
end

-- Child rollups per D1: open_count over descendants, digest state, and the
-- collapsed tombstone {outcome} for folded experiments (I10.5).
local function decorate_children(db: any, thread_id: string, parent_id: string?, children: any, last_seq: number): error?
    local open_counts, counts_err = reader.children_open_counts(db, thread_id, parent_id)
    if not open_counts then return counts_err end
    for _, row in ipairs(children :: { any }) do
        local child = row :: any
        child.open_count = (open_counts :: any)[trim(child.id)] or 0
        if string.lower(trim(child.status)) == "folded" then
            child.folded = { outcome = trim(child.folded_outcome) ~= "" and child.folded_outcome or nil }
        end
    end
    return attach_digests(db, thread_id, children, last_seq)
end

-- D2 predicate fold into the D1 enum: waived/accepted_risk come from the T12
-- annotation the projector materialized, valid/stale from the newest stored
-- receipt through the enforcement predicates, missing when evidence is
-- pinned but absent, nil when the task carries no verification story. The
-- second return is the superseding work fact's seq when staleness comes from
-- D2 freshness, so the lens can say "superseded by seq N".
local function receipt_status(db: any, thread_id: string, task: any): (any?, any?, any?)
    local waiver = string.lower(trim((task :: any).waiver_kind))
    if waiver == "accepted_risk" then return "accepted_risk", nil, nil end
    if waiver ~= "" then return "waived", nil, nil end
    local rows, query_err = db_ops.query(db, [[
        SELECT * FROM chestor_journal_receipts WHERE journal_id = ? AND task_id = ?
         ORDER BY created_at DESC, receipt_id DESC LIMIT 1
    ]], { thread_id, trim((task :: any).id) })
    if query_err then return nil, nil, query_err end
    if rows and rows[1] then
        local predicates, predicate_err = enforcement.receipt_predicates(db, thread_id, rows[1], task)
        if not predicates then return nil, nil, predicate_err end
        if (predicates :: any).valid and (predicates :: any).fresh then return "valid", nil, nil end
        local checks = (predicates :: any).checks
        return "stale", type(checks) == "table" and tonumber((checks :: any).superseded_by_seq) or nil, nil
    end
    if trim((task :: any).verifier_policy_hash) ~= "" or trim((task :: any).claim) ~= "" then
        return "missing", nil, nil
    end
    return nil, nil, nil
end

-- D1 cross_exceptions: live cross-subtree blocks-deps touching this task or
-- its ancestors, unsatisfied only, one line each. Relevance = dep depth
-- proximity of the touched spine node (0 = the task itself). Bounded at 5.
local function cross_exceptions(db: any, thread_id: string, task: any, ancestors: any): (any?, any?, any?)
    local task_id = trim((task :: any).id)
    local spine: { string } = { task_id }
    local proximity: any = { [task_id] = 0 }
    local titles: any = { [task_id] = trim((task :: any).title) }
    -- Ancestors arrive root-first; walk backwards so the parent sits at 1.
    local depth = 1
    for index = #(ancestors :: { any }), 1, -1 do
        local row = (ancestors :: { any })[index] :: any
        local id = trim(row.id)
        spine[#spine + 1] = id
        proximity[id] = depth
        titles[id] = trim(row.title)
        depth = depth + 1
    end
    local cte = [[WITH RECURSIVE sub(id) AS (
        SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?
        UNION
        SELECT t.id FROM chestor_journal_tasks t JOIN sub s ON t.parent_task_id = s.id
         WHERE t.journal_id = ?
    ) ]]
    local where = [[ FROM chestor_journal_task_deps d
        JOIN chestor_journal_tasks b ON b.journal_id = d.journal_id AND b.id = d.from_task_id
       WHERE d.journal_id = ? AND d.kind = 'blocks' AND d.tombstoned = 0
         AND d.to_task_id IN (]] .. placeholders(#spine) .. [[)
         AND d.from_task_id NOT IN (SELECT id FROM sub)
         AND ((COALESCE(b.gate, 0) = 1 AND COALESCE(b.passed, 0) <> 1)
           OR (COALESCE(b.gate, 0) <> 1 AND lower(COALESCE(b.status, '')) NOT IN ('done','closed')))]]
    local params: { any } = { thread_id, task_id, thread_id, thread_id }
    for _, id in ipairs(spine) do params[#params + 1] = id end
    local count_rows, count_err = db_ops.query(db, cte .. "SELECT COUNT(*) AS n" .. where, params)
    if count_err then return nil, nil, count_err end
    local total = count_rows and count_rows[1] and tonumber((count_rows[1] :: any).n) or 0
    local order: { string } = {}
    local edge_params: { any } = {}
    for _, value in ipairs(params) do edge_params[#edge_params + 1] = value end
    for index, id in ipairs(spine) do
        order[#order + 1] = "WHEN d.to_task_id = ? THEN " .. tostring(index - 1)
        edge_params[#edge_params + 1] = id
    end
    local edges, edge_err = db_ops.query(db,
        cte .. "SELECT b.id, d.from_task_id, d.to_task_id, b.title, b.status, b.gate, b.passed"
            .. where .. " ORDER BY CASE " .. table.concat(order, " ")
            .. " ELSE " .. tostring(#spine) .. " END, d.from_task_id ASC LIMIT 6",
        edge_params)
    if edge_err then return nil, nil, edge_err end
    local entries: { any } = {}
    for _, edge in ipairs(edges or {}) do
        local from_id = trim((edge :: any).from_task_id)
        if from_id ~= "" then
            local touched_id = trim((edge :: any).to_task_id)
            local path, path_err = title_path(db, thread_id, edge)
            if path == nil then return nil, nil, path_err end
            local blocker_title = trim((edge :: any).title) ~= "" and trim((edge :: any).title) or from_id
            local touched_title = trim(titles[touched_id]) ~= "" and titles[touched_id] or touched_id
            entries[#entries + 1] = {
                task_id = from_id,
                path = path,
                kind = "blocks",
                relevance = proximity[touched_id] or #spine,
                one_line = blocker_title .. " (" .. string.lower(trim((edge :: any).status))
                    .. ") blocks " .. touched_title,
            }
        end
    end
    table.sort(entries, function(a: any, b: any): boolean
        if (a :: any).relevance ~= (b :: any).relevance then return (a :: any).relevance < (b :: any).relevance end
        return tostring((a :: any).task_id) < tostring((b :: any).task_id)
    end)
    local out: { any } = {}
    for index = 1, math.min(#entries, 5) do out[#out + 1] = entries[index] end
    return out, { total = total, returned = #out, omitted = math.max(0, total - #out) }, nil
end

-- Events since the acting agent's last checkpoint, scoped to the open subtree
-- when one is given; journal-level when the agent is absent (X5).
local function changed_since_checkpoint(db: any, thread_id: string, root_task_id: any, agent_id: any): (any?, any?)
    local seq, seq_err = reader.latest_checkpoint_seq(db, thread_id, agent_id)
    if seq == nil then return nil, seq_err end
    local root_id = trim(root_task_id)
    local summary, summary_err
    if root_id ~= "" then
        summary, summary_err = reader.event_window_summary_subtree(db, thread_id, root_id, seq :: number)
    else
        summary, summary_err = reader.event_window_summary(db, thread_id, seq :: number, nil)
    end
    if not summary then return nil, summary_err end
    (summary :: any).since_seq = seq
    return summary, nil
end

-- Lease block for the lens plus the X5 stale-pointer determination: a lease
-- that is revoked, expired, or fenced out by a newer grant is a stale pointer
-- the agent must re-focus before writing (I5.1 refuses regardless).
local function lease_view(db: any, thread_id: string, lease_id: string): (any?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_leases WHERE journal_id = ? AND lease_id = ? LIMIT 1",
        { thread_id, trim(lease_id) }
    )
    if query_err then return nil, query_err end
    if not (rows and rows[1]) then return { missing = true }, nil end
    local row = rows[1] :: any
    local stale = tonumber(row.revoked) == 1 or (tonumber(row.expires_at) or 0) <= db_ops.now()
    if not stale then
        local grants, grant_err = db_ops.query(db,
            "SELECT highest_granted FROM chestor_journal_task_fencing WHERE journal_id = ? AND task_id = ? LIMIT 1",
            { thread_id, trim(row.task_id) }
        )
        if grant_err then return nil, grant_err end
        local highest = grants and grants[1] and tonumber((grants[1] :: any).highest_granted) or 0
        if (tonumber(row.fencing_token) or 0) < highest then stale = true end
    end
    return {
        block = {
            lease_id = row.lease_id,
            capability = row.capability,
            fencing_token = tonumber(row.fencing_token),
            ttl_s = tonumber(row.ttl_s),
            expires_at = tonumber(row.expires_at),
        },
        agent_id = trim(row.agent_id),
        task_id = trim(row.task_id),
        stale = stale,
    }, nil
end

-- The lens `next` pointer: the first Frontier-actionable task inside the
-- subtree, with the rationale for why it is next.
local function next_pointer(db: any, thread_id: string, root_id: string?): (any?, any?)
    local frontier, frontier_err = M.frontier_scan(db, thread_id,
        { root_task_id = root_id, limit = 1, stop_after_first = true })
    if not frontier then return nil, frontier_err end
    local first = (frontier :: any).actionable[1]
    if not first then return nil, nil end
    return {
        task_id = (first :: any).task_id,
        rationale = "first in sequence order (frontier position " .. tostring((first :: any).position)
            .. "): " .. tostring((first :: any).why_now),
    }, nil
end

-- Branch context is the task-tree read path and the D1 visibility lens: an id
-- opens one branch with its ancestor spine (digest + freshness each), child
-- rollups (open_count, digest, folded tombstones), recent facts, live
-- dependency edges, receipt status, bounded cross-subtree exceptions, the
-- changed-since-checkpoint delta, and one authoritative next action.
-- opts.lease_id attaches the caller's lease block; a revoked, expired, or
-- fenced-out lease resolves as stale_pointer (X5). A nil task_id lands on the
-- journal's active task when one is focused and on the roots otherwise;
-- opts.roots forces the journal-level roots lens even while a task is focused.
function M.branch(journal_id: string, task_id: any, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local fact_limit = bounded(opts and opts.fact_limit, 12, 100)
    local child_limit = bounded(opts and opts.child_limit, 50, 500)
    local lease_id = trim(opts and opts.lease_id)
    local want_roots = opts and (opts :: any).roots == true
    return with_db(function(db)
        local state, state_err = reader.journal_state(db, thread_id)
        if state_err then return nil, state_err end
        local active_task_id = trim(state and (state :: any).active_task_id)
        local id = trim(task_id)
        local resolved = "task"
        if want_roots then
            id = ""
            resolved = "roots"
        elseif id == "" then
            if active_task_id ~= "" then
                id = active_task_id
                resolved = "active"
            else
                resolved = "roots"
            end
        end
        local last_seq, last_seq_err = reader.last_seq(db, thread_id)
        if last_seq == nil then return nil, last_seq_err end
        local lease_block: any = nil
        local agent_id: any = nil
        if lease_id ~= "" then
            local lease_info, lease_err = lease_view(db, thread_id, lease_id)
            if not lease_info then return nil, lease_err end
            if not (lease_info :: any).missing then
                lease_block = (lease_info :: any).block
                agent_id = (lease_info :: any).agent_id
                if (lease_info :: any).stale then resolved = "stale_pointer" end
            end
        end
        if id == "" then
            local children, children_err = reader.task_children(db, thread_id, nil, child_limit)
            if not children then return nil, children_err end
            local decorate_err = decorate_children(db, thread_id, nil, children, last_seq :: number)
            if decorate_err then return nil, decorate_err end
            local changed, changed_err = changed_since_checkpoint(db, thread_id, nil, agent_id)
            if not changed then return nil, changed_err end
            local pointer, pointer_err = next_pointer(db, thread_id, nil)
            if pointer_err then return nil, pointer_err end
            local checkpoint, checkpoint_err = reader.latest_checkpoint(db, thread_id, nil)
            if checkpoint_err then return nil, checkpoint_err end
            return {
                task = nil,
                ancestors = {},
                children = children,
                deps = nil,
                facts = {},
                counts = { children = #children },
                active_task_id = want_roots and active_task_id ~= "" and active_task_id or nil,
                resolved = resolved,
                lease = lease_block,
                receipt_status = nil,
                latest_checkpoint = checkpoint,
                cross_exceptions = {},
                changed_since_checkpoint = changed,
                next = pointer,
            }, nil
        end
        local task, task_err = reader.task(db, thread_id, id)
        if task_err then return nil, task_err end
        local ancestors, ancestors_err = reader.task_ancestors(db, thread_id, id, 32)
        if not ancestors then return nil, ancestors_err end
        local children, children_err = reader.task_children(db, thread_id, id, child_limit)
        if not children then return nil, children_err end
        local facts, facts_err = reader.task_facts(db, thread_id, id, fact_limit)
        if not facts then return nil, facts_err end
        local deps, deps_err = reader.task_deps(db, thread_id, id, tonumber(opts and opts.dep_limit))
        if not deps then return nil, deps_err end
        local counts, counts_err = reader.task_counts(db, thread_id, id)
        if not counts then return nil, counts_err end
        local ancestor_digest_err = attach_digests(db, thread_id, ancestors, last_seq :: number)
        if ancestor_digest_err then return nil, ancestor_digest_err end
        local child_decorate_err = decorate_children(db, thread_id, id, children, last_seq :: number)
        if child_decorate_err then return nil, child_decorate_err end
        local status: any = nil
        local stale_seq: any = nil
        local crosses: any = {}
        local changed: any = nil
        local pointer: any = nil
        local checkpoint: any = nil
        local cross_counts: any = { total = 0, returned = 0, omitted = 0 }
        if task then
            local receipt_state, superseded_by_seq, receipt_err = receipt_status(db, thread_id, task)
            if receipt_err then return nil, receipt_err end
            status = receipt_state
            stale_seq = superseded_by_seq
            local cross, counts_value, cross_err = cross_exceptions(db, thread_id, task, ancestors)
            if not cross then return nil, cross_err end
            crosses = cross
            cross_counts = counts_value
            local changed_value, changed_err = changed_since_checkpoint(db, thread_id, id, agent_id)
            if not changed_value then return nil, changed_err end
            changed = changed_value
            local next_value, next_err = next_pointer(db, thread_id, id)
            if next_err then return nil, next_err end
            pointer = next_value
            local checkpoint_value, checkpoint_err = reader.latest_checkpoint_subtree(db, thread_id, id)
            if checkpoint_err then return nil, checkpoint_err end
            checkpoint = checkpoint_value
        end
        return {
            task = task,
            ancestors = ancestors,
            children = children,
            facts = facts,
            deps = deps,
            counts = counts,
            active_task_id = active_task_id ~= "" and active_task_id or nil,
            resolved = resolved,
            lease = lease_block,
            receipt_status = status,
            receipt_stale_seq = stale_seq,
            latest_checkpoint = checkpoint,
            cross_exceptions = crosses,
            cross_exception_counts = cross_counts,
            changed_since_checkpoint = changed,
            next = pointer,
        }, nil
    end)
end

-- One keyset page of the open set, in frontier order. The startability
-- predicates are per-task and cannot be expressed in this statement, so the
-- open set is walked a page at a time and the predicates run over the page -
-- the scan never holds the whole open set, and neither does the caller.
-- Exposed so a test can drive the walk over several pages of a small open set
-- and prove the keyset covers every task exactly once.
M.FRONTIER_PAGE = 200

-- The subtree scope every frontier statement shares: three bound journal ids
-- then the root task id, in that order.
local SUBTREE_CTE = [[WITH RECURSIVE sub(id) AS (
    SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?
    UNION
    SELECT t.id FROM chestor_journal_tasks t JOIN sub s ON t.parent_task_id = s.id
     WHERE t.journal_id = ?
) ]]

local function open_task_page(db: any, thread_id: string, root_id: string,
    after: any, size: number): (any?, any?)
    local statement
    local params: { any }
    if root_id ~= "" then
        statement = SUBTREE_CTE .. [[SELECT t.* FROM chestor_journal_tasks t JOIN sub s ON s.id = t.id
            WHERE t.journal_id = ? AND lower(t.status) IN ('open', '')]]
        params = { thread_id, root_id, thread_id, thread_id }
    else
        statement = "SELECT * FROM chestor_journal_tasks t WHERE t.journal_id = ? AND lower(t.status) IN ('open', '')"
        params = { thread_id }
    end
    if after ~= nil then
        statement = statement .. [[ AND (t.sort_order > ?
            OR (t.sort_order = ? AND t.created_at > ?)
            OR (t.sort_order = ? AND t.created_at = ? AND t.id > ?))]]
        local sort_order = math.floor(tonumber((after :: any).sort_order) or 0)
        local created_at = math.floor(tonumber((after :: any).created_at) or 0)
        local id = trim((after :: any).id)
        params[#params + 1] = sort_order
        params[#params + 1] = sort_order
        params[#params + 1] = created_at
        params[#params + 1] = sort_order
        params[#params + 1] = created_at
        params[#params + 1] = id
    end
    statement = statement .. " ORDER BY t.sort_order ASC, t.created_at ASC, t.id ASC LIMIT ?"
    params[#params + 1] = size
    return db_ops.query(db, statement, params)
end

-- D1 Frontier over the T1 guard predicates: actionable work with path and
-- why_now, every exclusion as a categorized count, and per-category drillable
-- reasons on demand - an empty frontier always explains itself. Folded tasks
-- never appear (I10.5); they exist only as the excluded.folded bucket.
-- opts.root_task_id scopes the scan to a subtree, opts.drill names the
-- category to expand.
--
-- The open set is walked in keyset pages under an explicit scan budget, so a
-- project with a hundred thousand open tasks costs one page of memory and a
-- bounded number of predicate evaluations. A scan that stops on the budget
-- says so: scan_complete is false and the counts describe the tasks it
-- reached, never the whole open set silently.
function M.frontier_scan(db: any, thread_id: string, opts: any): (any?, any?)
    local actionable_limit = bounded(opts and opts.limit, 50, 200)
    local scan_limit = bounded(opts and (opts :: any).scan_limit, 5000, 50000)
    local root_id = trim(opts and opts.root_task_id)
    local actionable: { any } = {}
    local truncated = false
    local excluded: any = { behind_gate = 0, blocked_by = 0, leased = 0, folded = 0 }
    local drill: any = { behind_gate = {}, blocked_by = {}, leased = {} }
    local position = 0
    local scanned = 0
    local scan_complete = true
    local after: any = opts and opts.cursor
    local last_action: any = nil
    local last_drill: any = nil
    local drill_more = false
    local drill_category = trim(opts and opts.drill)
    while true do
        local size = math.min(math.max(1, math.floor(tonumber(M.FRONTIER_PAGE) or 200)),
            scan_limit - scanned)
        if size < 1 then
            scan_complete = false
            break
        end
        local rows, query_err = open_task_page(db, thread_id, root_id, after, size)
        if not rows then return nil, query_err end
        local page = rows :: { any }
        for _, row in ipairs(page) do
            local task = row :: any
            scanned = scanned + 1
            after = { sort_order = task.sort_order, created_at = task.created_at, id = task.id }
            local verdict, verdict_err = enforcement.startability(db, thread_id, task)
            if verdict_err then return nil, verdict_err end
            if (verdict :: any).startable then
                position = position + 1
                if #actionable < actionable_limit then
                    local path, path_err = title_path(db, thread_id, task)
                    if path == nil then return nil, path_err end
                    actionable[#actionable + 1] = {
                        task_id = trim(task.id),
                        path = path,
                        position = position,
                        why_now = "startable per T1: no unpassed gate, blocking deps satisfied, no live mutation lease",
                    }
                    last_action = after
                    if opts and (opts :: any).stop_after_first == true then
                        return {
                            actionable = actionable,
                            actionable_truncated = false,
                            excluded = excluded,
                            scanned = scanned,
                            scan_complete = false,
                            scan_short_circuited = true,
                        }, nil
                    end
                else
                    truncated = true
                end
            else
                local category = tostring((verdict :: any).category)
                excluded[category] = (tonumber(excluded[category]) or 0) + 1
                local bucket = drill[category]
                if type(bucket) == "table" and #(bucket :: { any }) < actionable_limit then
                    (bucket :: { any })[#(bucket :: { any }) + 1] = {
                        task_id = trim(task.id),
                        reason = (verdict :: any).reason,
                    }
                    if category == drill_category then last_drill = after end
                elseif category == drill_category then
                    drill_more = true
                end
            end
        end
        if #page < size then break end
    end
    local folded_statement
    local folded_params: { any }
    if root_id ~= "" then
        folded_statement = SUBTREE_CTE .. [[SELECT COUNT(*) AS n FROM chestor_journal_tasks t
            JOIN sub s ON s.id = t.id WHERE t.journal_id = ? AND lower(t.status) = 'folded']]
        folded_params = { thread_id, root_id, thread_id, thread_id }
    else
        folded_statement = "SELECT COUNT(*) AS n FROM chestor_journal_tasks WHERE journal_id = ? AND lower(status) = 'folded'"
        folded_params = { thread_id }
    end
    local folded_rows, folded_err = db_ops.query(db, folded_statement, folded_params)
    if folded_err then return nil, folded_err end
    excluded.folded = folded_rows and folded_rows[1] and tonumber((folded_rows[1] :: any).n) or 0
    local result: any = {
        actionable = actionable,
        actionable_truncated = truncated,
        excluded = excluded,
        scanned = scanned,
        -- False when the budget stopped the walk: the counts below then cover
        -- the tasks reached, not the whole open set.
        scan_complete = scan_complete,
        has_more = truncated or drill_more or not scan_complete,
        next_cursor = (truncated or drill_more or not scan_complete)
            and (drill_category ~= "" and (last_drill or after) or (last_action or after)) or nil,
    }
    if drill_category ~= "" then
        if drill_category == "folded" then
            local items_statement
            local items_params: { any }
            if root_id ~= "" then
                items_statement = SUBTREE_CTE .. [[SELECT t.id, t.folded_outcome, t.created_at
                    FROM chestor_journal_tasks t JOIN sub s ON s.id = t.id
                    WHERE t.journal_id = ? AND lower(t.status) = 'folded']]
                items_params = { thread_id, root_id, thread_id, thread_id }
            else
                items_statement = "SELECT id, folded_outcome, created_at FROM chestor_journal_tasks"
                    .. " WHERE journal_id = ? AND lower(status) = 'folded'"
                items_params = { thread_id }
            end
            local cursor = opts and opts.cursor
            if cursor then
                items_statement = items_statement .. " AND (created_at > ? OR (created_at = ? AND id > ?))"
                items_params[#items_params + 1] = tonumber(cursor.created_at) or 0
                items_params[#items_params + 1] = tonumber(cursor.created_at) or 0
                items_params[#items_params + 1] = trim(cursor.id)
            end
            items_statement = items_statement .. " ORDER BY created_at ASC, id ASC LIMIT ?"
            items_params[#items_params + 1] = actionable_limit + 1
            local items, items_err = db_ops.query(db, items_statement, items_params)
            if items_err then return nil, items_err end
            local entries: { any } = {}
            for index, item in ipairs(items or {}) do
                if index > actionable_limit then break end
                entries[#entries + 1] = {
                    task_id = trim((item :: any).id),
                    reason = "folded(" .. trim((item :: any).folded_outcome) .. ")",
                }
            end
            result.drill = entries
            result.has_more = #(items or {}) > actionable_limit
            local last = items and items[#entries]
            result.next_cursor = result.has_more and last and {
                created_at = tonumber(last.created_at), id = last.id,
            } or nil
        elseif type(drill[drill_category]) == "table" then
            result.drill = drill[drill_category]
        else
            return nil, errors.new({ message = "unknown frontier drill category: " .. drill_category, kind = errors.INVALID })
        end
        result.drill_category = drill_category
    end
    return result, nil
end

function M.frontier(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db) return M.frontier_scan(db, thread_id, opts) end)
end

-- Attaches the "Root > Parent > Task" spine path to each bounded change row.
-- Resolve only the task ids present in the page; reading the complete task
-- table here made a 100-item change page grow with total project size.
local function attach_task_paths(db: any, thread_id: string, rows: any): error?
    local wanted: any = {}
    local any_wanted = false
    for _, row in ipairs(type(rows) == "table" and rows or {}) do
        local task_id = trim((row :: any).task_id)
        if task_id ~= "" then
            wanted[task_id] = true
            any_wanted = true
        end
    end
    if not any_wanted then return nil end
    local paths: any = {}
    for raw_task_id, _ in pairs(wanted) do
        local task_id = tostring(raw_task_id)
        local task, task_err = reader.task(db, thread_id, task_id)
        if task_err then return task_err end
        if task then
            local path, path_err = title_path(db, thread_id, task)
            if path == nil then return path_err end
            paths[task_id] = path
        end
    end
    for _, row in ipairs(rows :: { any }) do
        local task_id = trim((row :: any).task_id)
        if task_id ~= "" and paths[task_id] then (row :: any).path = paths[task_id] end
    end
    return nil
end

-- Change feed: bounded event index page (ids, seqs, types, titles - never
-- payloads), newest last, with a monotonic next_cursor. The watermark is
-- since_seq, or the named agent's last checkpoint when since_checkpoint is
-- given; scope is the whole journal or one task subtree. Rows carrying a
-- task_id also carry the spine path for that task.
function M.changes(journal_id: string, opts: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    return with_db(function(db)
        local task_id = trim(opts and opts.task_id)
        local scope = string.lower(trim(opts and opts.scope))
        if scope == "" then scope = task_id ~= "" and "subtree" or "journal" end
        if scope ~= "journal" and scope ~= "subtree" then
            return nil, errors.new({ message = "unknown changes scope: " .. scope, kind = errors.INVALID })
        end
        if scope == "subtree" and task_id == "" then
            return nil, errors.new({ message = "subtree scope requires task_id", kind = errors.INVALID })
        end
        local since = tonumber(opts and opts.since_seq)
        local agent = trim(opts and opts.since_checkpoint)
        local checkpoint_seq: number? = nil
        if since == nil then
            if agent ~= "" then
                local seq, seq_err = reader.latest_checkpoint_seq(db, thread_id, agent)
                if seq == nil then return nil, seq_err end
                since = seq
                checkpoint_seq = seq
            else
                since = 0
            end
        end
        local page, page_err
        if scope == "subtree" then
            page, page_err = reader.event_index_page_subtree(db, thread_id, task_id, {
                after_seq = since, limit = opts and opts.limit,
            })
        else
            page, page_err = reader.event_index_page(db, thread_id, {
                after_seq = since, limit = opts and opts.limit,
                exclude_event_types = opts and opts.exclude_event_types,
            })
        end
        if not page then return nil, page_err end
        local path_err = attach_task_paths(db, thread_id, (page :: any).events)
        if path_err then return nil, path_err end
        return {
            scope = scope,
            task_id = task_id ~= "" and task_id or nil,
            since_seq = since,
            since_checkpoint = agent ~= "" and agent or nil,
            checkpoint_seq = checkpoint_seq,
            events = (page :: any).events,
            limit = (page :: any).limit,
            next_cursor = (page :: any).next_cursor,
            has_more = (page :: any).has_more,
        }, nil
    end)
end

function M.tree(journal_id: string, root_task_id: any, depth: any, limit: any): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local max_depth = bounded(depth, 2, 4)
    local per_level = bounded(limit, 50, 200)
    return with_db(function(db)
        local function build(parent_id: string?, level: number): (any?, any?)
            local children, children_err = reader.task_children(db, thread_id, parent_id, per_level)
            if not children then return nil, children_err end
            local nodes = {}
            for _, child in ipairs(children :: { any }) do
                local node = child :: any
                if level < max_depth then
                    local sub, sub_err = build(tostring(node.id), level + 1)
                    if not sub then return nil, sub_err end
                    node.children = sub
                else
                    node.children = {}
                end
                nodes[#nodes + 1] = node
            end
            return nodes, nil
        end
        local root_id = db_ops.trim(root_task_id)
        if root_id == "" then
            local roots, roots_err = build(nil, 1)
            if not roots then return nil, roots_err end
            return { task = nil, children = roots }, nil
        end
        local task, task_err = reader.task(db, thread_id, root_id)
        if task_err then return nil, task_err end
        local children, children_err = build(root_id, 1)
        if not children then return nil, children_err end
        local node = (task :: any) or { id = root_id }
        node.children = children
        return node, nil
    end)
end

return M

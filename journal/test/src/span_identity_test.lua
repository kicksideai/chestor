-- Implicit work spans and the identity rule every write passes through. An
-- agent's first write opens a span, every fact it writes carries that span's
-- id, and inactivity seals the span at the moment it last saw work. The same
-- seam decides whose position moves: a cursor handle, then the agent's own
-- agent_id, then the transport connection, then the security actor - and the
-- automatic path never adopts a cursor an agent opened for itself.
local test = require("test")
local sql = require("sql")
local json = require("json")
local funcs = require("funcs")
local crypto = require("crypto")
local security = require("security")
local contract = require("contract")
local time = require("time")
local registry = require("registry")
local types = require("types")
local ops = require("ops")

local THREADS = "kickside.core:threads"
local STATE_PROJECTION = "chestor.journal:state"
local GRAPH_PROJECTION = "chestor.journal:graph_state"
local READ_BRIDGE = "app:journal_read"
local HEALTH_WRITER = "chestor.journal.health:writer"
local REBUILD_BRIDGE = "app:journal_rebuild"

local TOOL = {
    act = "chestor.journal.traits:act_journal",
    context = "chestor.journal.traits:journal_context",
    record = "chestor.journal.traits:record_journal",
    read = "chestor.journal.traits:read_journal",
}

local function uuid()
    local value, err = crypto.random.uuid()
    test.is_nil(err)
    return tostring(value)
end

local function actor(user_id)
    return security.new_actor(user_id, { security_groups = { "journal_test" } })
end

local function scope()
    return security.named_scope("wippy.security:process")
end

local function executor(user_id)
    return funcs.new():with_actor(actor(user_id)):with_scope(scope())
end

local function connection_executor(user_id, connection_id)
    return executor(user_id):with_context({ connection_id = connection_id })
end

local function threads(user_id)
    local definition, get_err = contract.get(THREADS)
    test.is_nil(get_err)
    local opened, open_err = definition:with_actor(actor(user_id)):with_scope(scope()):open()
    test.is_nil(open_err)
    return opened
end

local function create_journal(user_id)
    local created, err = threads(user_id):create({
        impl_id = types.JOURNAL_IMPL,
        thread_class = types.THREAD_CLASS,
        title = "work spans " .. uuid(),
    })
    test.is_nil(err)
    return tostring(created.component_id or created.thread_id)
end

local function invoke(runner, ref, input)
    local value, err = runner:call(ref, input)
    test.is_nil(err, tostring(ref) .. ": " .. tostring(err))
    test.not_nil(value)
    return value
end

local function call(user_id, ref, input)
    return invoke(executor(user_id), ref, input)
end

local function sync_kind(user_id, journal_id, kind)
    local detail = "projection cursor not registered"
    for _ = 1, 500 do
        local listed, err = threads(user_id):list_projections({ thread_id = journal_id })
        test.is_nil(err)
        local required_seq = tonumber(listed and listed.event_count) or 0
        for _, cursor in ipairs((listed and listed.cursors) or {}) do
            if tostring(cursor.kind) == kind then
                local status = tostring(cursor.status or "")
                detail = status .. ": " .. tostring(cursor.last_error or "")
                test.is_false(status == "invalid" or status == "paused", kind .. " projection stopped: " .. detail)
                if (tonumber(cursor.last_seq) or 0) >= required_seq then return end
            end
        end
        time.sleep("20ms")
    end
    test.is_true(false, kind .. " projection did not reach the thread head: " .. detail)
end

local function sync(user_id, journal_id)
    sync_kind(user_id, journal_id, STATE_PROJECTION)
end

local function query(statement, params)
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    local rows, query_err = ops.query(db, statement, params or {})
    db:release()
    test.is_nil(query_err)
    return rows or {}
end

local function exec(statement, params)
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    local exec_err = ops.exec(db, statement, params or {})
    db:release()
    test.is_nil(exec_err)
end

local function cursor_rows(journal_id)
    return query(
        "SELECT * FROM chestor_journal_cursors WHERE journal_id = ? ORDER BY cursor_id ASC",
        { journal_id })
end

local function cursor_row(journal_id, cursor_id)
    local rows = query(
        "SELECT * FROM chestor_journal_cursors WHERE journal_id = ? AND cursor_id = ?",
        { journal_id, cursor_id })
    test.not_nil(rows[1], "cursor " .. tostring(cursor_id) .. " is missing")
    return rows[1]
end

local function span_rows(journal_id)
    return query(
        "SELECT * FROM chestor_journal_spans WHERE journal_id = ? ORDER BY started_at ASC, span_id ASC",
        { journal_id })
end

local function span_row(journal_id, span_id)
    local rows = query(
        "SELECT * FROM chestor_journal_spans WHERE journal_id = ? AND span_id = ?",
        { journal_id, span_id })
    test.not_nil(rows[1], "span " .. tostring(span_id) .. " is missing")
    return rows[1]
end

local function accepted(result, label)
    local at = label and (" [" .. label .. "]") or ""
    test.not_nil(result, "expected a result" .. at)
    test.is_true(result.refused ~= true and result.success ~= false,
        "expected success" .. at .. ", got " .. json.encode(result))
    test.is_nil(result.cursor_error, "position maintenance failed" .. at)
    test.is_nil(result.span_error, "span maintenance failed" .. at)
    return result
end

local function observe(runner, journal_id, title, extra)
    local input = { journal_id = journal_id, kind = "observation",
        data = { title = title, body = title .. " recorded" } }
    for key, value in pairs(extra or {}) do
        if key == "agent_id" then input.agent_id = value else input.data[key] = value end
    end
    return accepted(invoke(runner, TOOL.record, input), title)
end

local function read_view(user_id, journal_id, view, args)
    local out, err = executor(user_id):call(READ_BRIDGE, {
        view = view, journal_id = journal_id, args = args or {},
    })
    test.is_nil(err)
    test.not_nil(out)
    test.is_true(out.success == true, tostring(out.error))
    return out.value
end

local function span_item(page, span_id)
    for _, item in ipairs(page.items or {}) do
        if tostring(item.span_id) == tostring(span_id) then return item end
    end
    test.is_true(false, "span " .. tostring(span_id) .. " is missing from the page: " .. json.encode(page))
    return nil
end

local function define_tests()
    test.describe("Journal writer identity", function()
        test.it("never advances a cursor its owner opened, even under the same identity", function()
            local user = "census-" .. uuid()
            local journal_id = create_journal(user)

            -- The census shape: one explicit cursor whose agent_id is exactly
            -- the account every unidentified writer falls back to.
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "shared-work", title = "Shared work" },
            }), "seed task")
            sync(user, journal_id)
            accepted(call(user, TOOL.act, {
                journal_id = journal_id, verb = "cursor_open",
                data = { cursor_id = "owned", task_id = "shared-work", agent_id = user,
                    purpose = "Own the protocol cursor" },
            }), "explicit cursor open")
            sync(user, journal_id)
            local owned_before = cursor_row(journal_id, "owned")
            test.eq(tostring(owned_before.origin), "explicit")

            -- Three agents behind that one account, none of them carrying a
            -- handle. Each keeps its own automatic cursor and none of them
            -- touches the cursor the protocol owns.
            local written = {}
            for index = 1, 3 do
                local agent = "agent-" .. tostring(index) .. "-" .. uuid()
                written[index] = observe(executor(user), journal_id,
                    "work from " .. agent, { agent_id = agent })
                test.eq(tostring(cursor_row(journal_id, written[index].cursor_id).agent_id), agent)
                test.eq(tostring(cursor_row(journal_id, written[index].cursor_id).origin), "auto")
                test.is_true(tostring(written[index].cursor_id) ~= "owned",
                    "an automatic writer must never adopt an opened cursor")
            end
            -- And the unidentified account writer itself, whose identity is
            -- the very agent_id the opened cursor carries.
            local fallback = observe(executor(user), journal_id, "work from the bare account")
            test.eq(tostring(cursor_row(journal_id, fallback.cursor_id).agent_id), user)
            test.eq(tostring(cursor_row(journal_id, fallback.cursor_id).origin), "auto")
            test.is_true(tostring(fallback.cursor_id) ~= "owned",
                "the fallback identity must not fold into the opened cursor")

            local owned_after = cursor_row(journal_id, "owned")
            test.eq(tonumber(owned_after.last_seen_seq), tonumber(owned_before.last_seen_seq))
            test.eq(tonumber(owned_after.revision), tonumber(owned_before.revision))
            -- one opened cursor, three agent cursors, one account cursor
            test.eq(#cursor_rows(journal_id), 5)

            -- The same agent writing again reuses its own automatic cursor.
            local repeated = observe(executor(user), journal_id, "more from the bare account")
            test.eq(tostring(repeated.cursor_id), tostring(fallback.cursor_id))
            test.eq(#cursor_rows(journal_id), 5)
        end)

        test.it("resolves the writer in the declared identity priority order", function()
            local user = "priority-" .. uuid()
            local journal_id = create_journal(user)
            local connection = "conn-" .. uuid()
            local declared = "declared-" .. uuid()

            -- actor, when nothing else identifies the caller
            local by_actor = observe(executor(user), journal_id, "actor write")
            test.eq(tostring(cursor_row(journal_id, by_actor.cursor_id).agent_id), user)

            -- connection identity outranks the shared account
            local by_connection = observe(connection_executor(user, connection), journal_id, "connection write")
            test.eq(tostring(cursor_row(journal_id, by_connection.cursor_id).agent_id), connection)
            test.is_true(tostring(by_connection.cursor_id) ~= tostring(by_actor.cursor_id))

            -- a self-declared agent_id outranks the bound connection
            local by_agent = observe(connection_executor(user, connection), journal_id,
                "declared write", { agent_id = declared })
            test.eq(tostring(cursor_row(journal_id, by_agent.cursor_id).agent_id), declared)
            test.is_true(tostring(by_agent.cursor_id) ~= tostring(by_connection.cursor_id))

            -- an explicit handle outranks everything the caller is
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "pinned-work", title = "Pinned work" },
            }), "seed task")
            sync(user, journal_id)
            accepted(call(user, TOOL.act, {
                journal_id = journal_id, verb = "cursor_open",
                data = { cursor_id = "pinned", task_id = "pinned-work", agent_id = "pin-agent",
                    purpose = "Own the pinned protocol" },
            }), "pinned cursor open")
            sync(user, journal_id)
            local pinned = accepted(invoke(connection_executor(user, connection), TOOL.record, {
                journal_id = journal_id, agent_id = declared, kind = "observation",
                data = { cursor_id = "pinned", title = "Through the handle", body = "Recorded while pinned." },
            }), "handle write")
            test.eq(tostring(pinned.cursor_id), "pinned")
            test.eq(tostring(cursor_row(journal_id, "pinned").agent_id), "pin-agent")
        end)
    end)

    test.describe("Journal work spans", function()
        test.it("opens a span on the first write, stamps every fact, and seals it when work goes quiet", function()
            local user = "span-" .. uuid()
            local journal_id = create_journal(user)
            local agent = "span-agent-" .. uuid()

            accepted(invoke(executor(user), TOOL.record, {
                journal_id = journal_id, agent_id = agent, kind = "task",
                data = { id = "span-work", title = "Span work" },
            }), "seed task")
            sync(user, journal_id)

            local first = observe(executor(user), journal_id, "first span fact",
                { agent_id = agent, working_on = "span-work" })
            test.is_true(tostring(first.span_id or "") ~= "",
                "a record must report the span it belongs to: " .. json.encode(first))
            local second = observe(executor(user), journal_id, "second span fact", { agent_id = agent })
            test.eq(tostring(second.span_id), tostring(first.span_id))
            sync(user, journal_id)

            local opened = span_row(journal_id, first.span_id)
            test.eq(tostring(opened.agent_id), agent)
            test.eq(tostring(opened.state), "open")
            test.eq(tostring(opened.origin), "auto")
            test.eq(tostring(opened.cursor_id), tostring(first.cursor_id))
            -- working_on that names a task keeps both the words and the task
            test.eq(tostring(opened.purpose), "span-work")
            test.eq(tostring(opened.purpose_kind), "task")
            test.eq(tostring(opened.purpose_task_id), "span-work")
            test.eq(tonumber(opened.fact_count), 3, "every write in the span is counted")
            test.is_true(tonumber(opened.last_seq) >= tonumber(second.cursor_seq))

            -- Every fact carries the stamp, so span membership survives replay.
            local stamped = query(
                "SELECT id, span_id FROM chestor_journal_events WHERE journal_id = ? AND span_id = ?",
                { journal_id, first.span_id })
            test.eq(#stamped, 3, "each fact this identity wrote carries the span stamp")

            -- The read surface answers who is working and on what.
            local page = read_view(user, journal_id, "spans", {})
            test.eq(#page.items, 1)
            test.eq(tonumber(page.counts.open), 1)
            test.eq(tonumber(page.idle_s), types.SPAN.IDLE_S)
            local view = span_item(page, first.span_id)
            test.eq(tostring(view.agent_id), agent)
            test.eq(tostring(view.state), "open")
            test.eq(tostring(view.working_on.kind), "task")
            test.eq(tostring(view.working_on.task_id), "span-work")
            test.eq(tostring(view.last_fact.title), "second span fact")

            -- Inactivity seals the span at the time it last saw work, and the
            -- maintainer heartbeat is what notices.
            local quiet_at = os.time() - (types.SPAN.IDLE_S + 600)
            exec("UPDATE chestor_journal_spans SET last_activity_at = ? WHERE journal_id = ? AND span_id = ?",
                { quiet_at, journal_id, first.span_id })
            local beat, beat_err = executor(user):call(HEALTH_WRITER, { journal_id = journal_id })
            test.is_nil(beat_err, "health writer: " .. tostring(beat_err))
            test.is_true(beat.success == true, json.encode(beat))
            test.eq(tonumber(beat.health.components.spans.sealed), 1)
            test.eq(tonumber(beat.health.components.spans.open), 0)

            local sealed = span_row(journal_id, first.span_id)
            test.eq(tostring(sealed.state), "sealed")
            test.eq(tonumber(sealed.ended_at), quiet_at, "a span seals at its last activity, not at the sweep")
            test.eq(tostring(sealed.closed_reason), "idle")

            -- Coming back opens a new span rather than resurrecting the old one.
            local resumed = observe(executor(user), journal_id, "after the quiet stretch",
                { agent_id = agent, task_id = "span-work" })
            test.is_true(tostring(resumed.span_id) ~= tostring(first.span_id),
                "work after the idle bound belongs to a new span")
            test.eq(tostring(span_row(journal_id, resumed.span_id).state), "open")
            test.eq(#span_rows(journal_id), 2)
            sync(user, journal_id)

            -- Spans per task, per agent, and by state all answer from the same page.
            -- One span named the task as its purpose, the other stamped a fact
            -- under it; the task read finds both.
            local by_task = read_view(user, journal_id, "spans", { task_id = "span-work" })
            test.eq(#by_task.items, 2, "both spans touched the task")
            local by_agent = read_view(user, journal_id, "spans", { agent_id = agent })
            test.eq(#by_agent.items, 2)
            local open_only = read_view(user, journal_id, "spans", { state = "open" })
            test.eq(#open_only.items, 1)
            test.eq(tostring(open_only.items[1].span_id), tostring(resumed.span_id))
            local sealed_only = read_view(user, journal_id, "spans", { state = "sealed" })
            test.eq(#sealed_only.items, 1)
            test.eq(tostring(sealed_only.items[1].span_id), tostring(first.span_id))

            -- The agent-facing tool serves the same page.
            local tool_page = call(user, TOOL.read, { journal_id = journal_id, view = "spans", span_state = "open" })
            test.is_true(tool_page.success, tostring(tool_page.error))
            test.eq(#tool_page.spans.items, 1)
            test.eq(tostring(tool_page.spans.items[1].span_id), tostring(resumed.span_id))
        end)

        test.it("keeps free-text purpose exactly as written and stamps a protocol verb's span", function()
            local user = "purpose-" .. uuid()
            local journal_id = create_journal(user)
            local agent = "purpose-agent-" .. uuid()

            local free = observe(executor(user), journal_id, "free purpose",
                { agent_id = agent, working_on = "tracing the projection stall" })
            local row = span_row(journal_id, free.span_id)
            test.eq(tostring(row.purpose), "tracing the projection stall")
            test.eq(tostring(row.purpose_kind), "text")
            test.eq(ops.trim(row.purpose_task_id), "")

            accepted(invoke(executor(user), TOOL.record, {
                journal_id = journal_id, agent_id = agent, kind = "task",
                data = { id = "verb-work", title = "Verb work" },
            }), "seed task")
            sync(user, journal_id)
            local lease = accepted(invoke(executor(user), TOOL.act, {
                journal_id = journal_id, agent_id = agent, verb = "open_branch",
                data = { task_id = "verb-work", agent_id = agent },
            }), "open branch").lease
            local started = accepted(invoke(executor(user), TOOL.act, {
                journal_id = journal_id, agent_id = agent, verb = "start",
                data = { task_id = "verb-work", lease_id = lease.lease_id,
                    fencing_token = lease.fencing_token },
            }), "start")
            test.eq(tostring(started.span_id), tostring(free.span_id))
            sync(user, journal_id)
            local transitions = query([[
                SELECT id FROM chestor_journal_events
                 WHERE journal_id = ? AND span_id = ? AND event_type = 'task.transitioned'
            ]], { journal_id, free.span_id })
            test.eq(#transitions, 1, "a protocol verb's transition carries the acting span")
        end)

        test.it("pages spans, positions, and the journal snapshot by keyset", function()
            local user = "keyset-" .. uuid()
            local journal_id = create_journal(user)
            local ids = {}
            for index = 1, 3 do
                local agent = "keyset-agent-" .. tostring(index) .. "-" .. uuid()
                ids[index] = tostring(observe(executor(user), journal_id,
                    "keyset work " .. tostring(index), { agent_id = agent }).span_id)
            end
            sync(user, journal_id)
            test.eq(#span_rows(journal_id), 3)

            -- Activity time is second-granular, so the page is given three
            -- distinct times to assert the order and the continuation.
            local base = os.time()
            for index, span_id in ipairs(ids) do
                exec("UPDATE chestor_journal_spans SET last_activity_at = ? WHERE journal_id = ? AND span_id = ?",
                    { base + index, journal_id, span_id })
            end

            local first = read_view(user, journal_id, "spans", { limit = 2 })
            test.eq(#first.items, 2)
            test.is_true(first.has_more)
            test.eq(tostring(first.items[1].span_id), ids[3])
            test.eq(tostring(first.items[2].span_id), ids[2])
            test.not_nil(first.next_cursor)
            local second = read_view(user, journal_id, "spans", {
                limit = 2,
                after_activity_at = first.next_cursor.after_activity_at,
                after_span_id = first.next_cursor.after_span_id,
            })
            test.eq(#second.items, 1, "the continuation returns the rest exactly once")
            test.eq(tostring(second.items[1].span_id), ids[1])
            test.is_false(second.has_more)
            test.is_nil(second.next_cursor)

            -- Positions page the same way.
            local positions = read_view(user, journal_id, "cursors", { limit = 2 })
            test.eq(#positions.items, 2)
            test.is_true(positions.has_more)
            test.not_nil(positions.next_cursor)
            local rest = read_view(user, journal_id, "cursors", {
                limit = 10,
                after_updated_at = positions.next_cursor.after_updated_at,
                after_cursor_id = positions.next_cursor.after_cursor_id,
            })
            test.is_true(#rest.items >= 1)
            for _, item in ipairs(rest.items) do
                for _, seen in ipairs(positions.items) do
                    test.is_true(tostring(item.cursor_id) ~= tostring(seen.cursor_id),
                        "a keyset page must not repeat a row it already served")
                end
            end
            -- Presence carries what each position is working on right now.
            local with_span = nil
            for _, item in ipairs(positions.items) do
                if item.span then with_span = item end
            end
            test.not_nil(with_span, "the presence roll must carry the open span behind a position")

            -- Every collection the journal snapshot folds is a keyset page.
            for index = 1, 3 do
                accepted(call(user, TOOL.record, {
                    journal_id = journal_id, kind = "task",
                    data = { id = "keyset-task-" .. tostring(index), title = "Keyset task " .. tostring(index),
                        sort_order = index },
                }), "snapshot task")
            end
            sync(user, journal_id)
            local snapshot = read_view(user, journal_id, "state", { task_limit = 2, cursor_limit = 2, span_limit = 2 })
            test.eq(#snapshot.tasks, 2)
            test.is_true(snapshot.task_page.has_more, "a bounded task fold must say there is more")
            test.not_nil(snapshot.task_page.next_cursor)
            test.not_nil(snapshot.artifact_page)
            test.not_nil(snapshot.graph_page)
            test.is_true(snapshot.cursors.has_more)
            test.not_nil(snapshot.cursors.next_cursor)
            test.eq(#snapshot.spans.items, 2)
            local continued = read_view(user, journal_id, "state", {
                task_limit = 2,
                task_after_sort_order = snapshot.task_page.next_cursor.after_sort_order,
                task_after_updated_at = snapshot.task_page.next_cursor.after_updated_at,
                task_after_id = snapshot.task_page.next_cursor.after_id,
            })
            for _, task in ipairs(continued.tasks) do
                for _, seen in ipairs(snapshot.tasks) do
                    test.is_true(tostring(task.id) ~= tostring(seen.id),
                        "the task continuation must not repeat a page it already served")
                end
            end
        end)

        test.it("buckets activity per interval and agent and pages it by keyset", function()
            local user = "buckets-" .. uuid()
            local journal_id = create_journal(user)
            local left = "bucket-left-" .. uuid()
            local right = "bucket-right-" .. uuid()

            observe(executor(user), journal_id, "left one", { agent_id = left })
            observe(executor(user), journal_id, "left two", { agent_id = left })
            observe(executor(user), journal_id, "right one", { agent_id = right })
            sync(user, journal_id)

            local activity = read_view(user, journal_id, "activity", { bucket = "day" })
            test.eq(tostring(activity.bucket), "day")
            test.eq(tonumber(activity.width_s), 86400)
            -- One row per agent per interval: the whole point of a bucket is
            -- that facts inside the same interval fold into one aligned key.
            test.eq(#activity.buckets, 2, "three facts by two agents fold into two lanes of one bucket")
            local counted = {}
            local width = tonumber(activity.width_s)
            if width == nil then error("activity width must be numeric") end
            for _, bucket in ipairs(activity.buckets) do
                local bucket_at = tonumber(bucket.bucket_at)
                if bucket_at == nil then error("bucket timestamp must be numeric") end
                test.eq(bucket_at % width, 0,
                    "a bucket key must be aligned to the interval width")
                if bucket.agent_id then
                    counted[tostring(bucket.agent_id)] = (counted[tostring(bucket.agent_id)] or 0) + bucket.events
                end
            end
            test.eq(counted[left], 2)
            test.eq(counted[right], 1)

            local bounded = read_view(user, journal_id, "activity", { bucket = "day", limit = 1 })
            test.eq(#bounded.buckets, 1)
            test.is_true(bounded.has_more)
            test.not_nil(bounded.next_cursor)
            local next_page = read_view(user, journal_id, "activity", {
                bucket = "day", limit = 10,
                after_bucket_at = bounded.next_cursor.after_bucket_at,
                after_agent_id = bounded.next_cursor.after_agent_id,
            })
            test.is_true(#next_page.buckets >= 1)
            for _, bucket in ipairs(next_page.buckets) do
                test.is_true(tostring(bucket.agent_id) ~= tostring(bounded.buckets[1].agent_id),
                    "the bucket continuation must not repeat an agent lane it already served")
            end

            -- One agent's lane alone.
            local lane = read_view(user, journal_id, "activity", { bucket = "day", agent_id = left })
            local lane_total = 0
            for _, bucket in ipairs(lane.buckets) do lane_total = lane_total + bucket.events end
            test.eq(lane_total, 2)
        end)

        test.it("keeps protocol events out of user-facing streams and out of last_touch", function()
            local user = "noise-" .. uuid()
            local journal_id = create_journal(user)

            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "noise-work", title = "Noise work" },
            }), "seed task")
            sync(user, journal_id)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "decision",
                data = { title = "The decision that stands", body = "This is the work fact." },
            }), "work fact")
            sync(user, journal_id)
            accepted(call(user, TOOL.act, {
                journal_id = journal_id, verb = "cursor_open",
                data = { cursor_id = "noisy", task_id = "noise-work", agent_id = "noise-agent",
                    purpose = "Generate protocol noise" },
            }), "cursor open")
            sync(user, journal_id)

            -- The protocol event is durable and addressable, never deleted.
            local stored = query(
                "SELECT id, seq FROM chestor_journal_events WHERE journal_id = ? AND event_type = ?",
                { journal_id, "cursor.updated" })
            test.is_true(#stored >= 1, "protocol events stay in the durable index")

            local tail = call(user, TOOL.read, { journal_id = journal_id, view = "tail", limit = 50 })
            test.is_true(tail.success, tostring(tail.error))
            for _, event in ipairs(tail.events or {}) do
                test.is_false(types.is_protocol_event_type(event.event_type),
                    "a user-facing stream must not carry " .. tostring(event.event_type))
            end
            local changes = call(user, TOOL.read, { journal_id = journal_id, view = "changes", since_seq = 0 })
            test.is_true(changes.success, tostring(changes.error))
            for _, event in ipairs(changes.changes.events or {}) do
                test.is_false(types.is_protocol_event_type(event.event_type),
                    "the change feed must not carry " .. tostring(event.event_type))
            end
            -- A feed that filtered its whole window still reports how far it read.
            test.is_true(tonumber(changes.changes.next_cursor) >= tonumber(stored[#stored].seq),
                "a filtered feed must still advance past the rows it skipped")

            -- The opened cursor's watermark sits on its own cursor.updated
            -- event; presence resolves it back to the last real work fact.
            local roll = read_view(user, journal_id, "cursors", {})
            local owner = nil
            for _, item in ipairs(roll.items) do
                if tostring(item.cursor_id) == "noisy" then owner = item end
            end
            test.not_nil(owner, "the opened cursor is missing from the roll")
            test.not_nil(owner.last_touch, "a watermark must still resolve to the work behind it")
            test.is_false(types.is_protocol_event_type(owner.last_touch.event_type),
                "last_touch must never be protocol noise: " .. tostring(owner.last_touch.event_type))
            test.eq(tostring(owner.last_touch.title), "The decision that stands")
        end)

        test.it("keeps spans and their stamps across Core projection catch-up", function()
            local user = "catch-up-" .. uuid()
            local journal_id = create_journal(user)
            local agent = "catch-up-agent-" .. uuid()

            local first = observe(executor(user), journal_id, "before catch-up", { agent_id = agent })
            observe(executor(user), journal_id, "also before catch-up", { agent_id = agent })
            sync(user, journal_id)
            local before = span_row(journal_id, first.span_id)

            local reset = call(user, REBUILD_BRIDGE, { op = "reset", journal_id = journal_id })
            test.is_true(reset.success == true, tostring(reset.error))
            sync(user, journal_id)

            local after = span_row(journal_id, first.span_id)
            test.eq(tostring(after.agent_id), agent)
            test.eq(tostring(after.state), "open")
            test.eq(tonumber(after.fact_count), tonumber(before.fact_count))
            test.eq(#span_rows(journal_id), 1)
            local stamped = query(
                "SELECT id FROM chestor_journal_events WHERE journal_id = ? AND span_id = ?",
                { journal_id, first.span_id })
            test.eq(#stamped, 2, "the refolded facts still carry their span")
        end)

        test.it("counts the agents reaching into each graph and bounds the tail by limit", function()
            local user = "presence-" .. uuid()
            local journal_id = create_journal(user)
            local left = "graph-left-" .. uuid()
            local right = "graph-right-" .. uuid()

            observe(executor(user), journal_id, "left graph work", { agent_id = left })
            observe(executor(user), journal_id, "right graph work", { agent_id = right })
            observe(executor(user), journal_id, "more right graph work", { agent_id = right })
            sync(user, journal_id)
            sync_kind(user, journal_id, GRAPH_PROJECTION)

            local catalog = call(user, TOOL.read, { journal_id = journal_id, view = "graphs" })
            test.is_true(catalog.success, tostring(catalog.error))
            local map = nil
            for _, graph in ipairs(catalog.graphs or {}) do
                if tostring(graph.id) == "map" then map = graph end
            end
            test.not_nil(map, "the map graph is missing from the catalog")
            test.eq(tonumber(map.agent_count), 2, "the catalog counts the agents working in this graph")
            test.is_true(tonumber(map.last_agent_activity_at) > 0)

            -- The tail view returns the window the caller asked for, not the log.
            local tail = call(user, TOOL.read, { journal_id = journal_id, view = "tail", limit = 2 })
            test.is_true(tail.success, tostring(tail.error))
            test.eq(#tail.events, 2, "the tail view honours its limit")
            local wider = call(user, TOOL.read, { journal_id = journal_id, view = "tail", limit = 3 })
            test.eq(#wider.events, 3)
        end)

        test.it("serves spans and activity on their own bounded journal endpoints", function()
            for _, name in ipairs({ "get_spans", "get_activity" }) do
                local handler = registry.get("chestor.journal.api:" .. name)
                test.not_nil(handler, "the " .. name .. " handler must be registered")
                local endpoint = registry.get("chestor.journal.api:" .. name .. ".endpoint")
                test.not_nil(endpoint, "the " .. name .. " endpoint must be registered")
                local data = (endpoint or {}).data or {}
                test.eq(tostring(data.method), "GET")
                test.eq(tostring(data.func), name)
            end
            test.eq(tostring(((registry.get("chestor.journal.api:get_spans.endpoint") or {}).data or {}).path),
                "/workspace/journals/{id}/spans")
            test.eq(tostring(((registry.get("chestor.journal.api:get_activity.endpoint") or {}).data or {}).path),
                "/workspace/journals/{id}/activity")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

-- The guards that decide races and bound folds. A journal grows without limit,
-- and several agents write into it at once, so every claim this suite makes is
-- about one of two things: who wins when two writers reach the same state at
-- the same moment, and what a read costs when the journal is enormous.
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
local cursors = require("cursors")
local spans = require("spans")
local projector = require("projector")

local THREADS = "kickside.core:threads"
local STATE_PROJECTION = "chestor.journal:state"
local GRAPH_PROJECTION = "chestor.journal:graph_state"
local CMD_BRIDGE = "app:journal_cmd"
local READ_BRIDGE = "app:journal_read"
local REBUILD_BRIDGE = "app:journal_rebuild"

local TOOL = {
    read = "chestor.journal.traits:read_journal",
    record = "chestor.journal.traits:record_journal",
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
        title = "guards " .. uuid(),
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

local function cmd(user_id, op, journal_id, args)
    return invoke(executor(user_id), CMD_BRIDGE,
        { op = op, journal_id = journal_id, args = args or {} })
end

local function read_view(user_id, journal_id, view, args)
    local out = invoke(executor(user_id), READ_BRIDGE,
        { view = view, journal_id = journal_id, args = args or {} })
    test.is_true(out.success == true, tostring(out.error))
    return out.value
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

local function with_db(fn)
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    local value = fn(db)
    db:release()
    return value
end

local function query(statement, params)
    return with_db(function(db)
        local rows, query_err = ops.query(db, statement, params or {})
        test.is_nil(query_err)
        return rows or {}
    end)
end

local function exec(statement, params)
    with_db(function(db)
        test.is_nil(ops.exec(db, statement, params or {}))
    end)
end

local function accepted(result, label)
    local at = label and (" [" .. label .. "]") or ""
    test.not_nil(result, "expected a result" .. at)
    test.is_true(result.refused ~= true and result.success ~= false,
        "expected success" .. at .. ", got " .. json.encode(result))
    return result
end

local function refused(result, code, label)
    local at = label and (" [" .. label .. "]") or ""
    test.not_nil(result, "expected a result" .. at)
    test.is_true(result.refused == true,
        "expected a refusal" .. at .. ", got " .. json.encode(result))
    test.eq(tostring(result.code), code,
        "expected refusal code " .. code .. at .. ", got " .. json.encode(result))
    return result
end

local function make_task(user_id, journal_id, title)
    local id = "task-" .. uuid()
    accepted(cmd(user_id, "upsert_task", journal_id,
        { id = id, title = title, command_id = uuid() }), title)
    return id
end

-- The canonical read model the rebuild has to reproduce byte for byte.
local function canonical_read_model(journal_id)
    return with_db(function(db)
        local events, event_err = ops.query(db, [[
            SELECT id, seq, task_id, event_type, payload_sha256
              FROM chestor_journal_events WHERE journal_id = ? ORDER BY seq ASC
        ]], { journal_id })
        test.is_nil(event_err)
        local tasks, task_err = ops.query(db, [[
            SELECT id, title, status, revision, created_at, updated_at
              FROM chestor_journal_tasks WHERE journal_id = ? ORDER BY id ASC
        ]], { journal_id })
        test.is_nil(task_err)
        local cursor_rows, cursor_err = ops.query(db, [[
            SELECT cursor_id, agent_id, state, revision, claimed_revision, last_seen_seq, origin
              FROM chestor_journal_cursors WHERE journal_id = ? ORDER BY cursor_id ASC
        ]], { journal_id })
        test.is_nil(cursor_err)
        return ops.canonical({ events = events or {}, tasks = tasks or {}, cursors = cursor_rows or {} })
    end)
end

local function canonical_projection_model(journal_id)
    return with_db(function(db)
        local events, event_err = ops.query(db, [[
            SELECT id, seq, task_id, event_type, payload_sha256
              FROM chestor_journal_events WHERE journal_id = ? ORDER BY seq ASC
        ]], { journal_id })
        test.is_nil(event_err)
        local tasks, task_err = ops.query(db, [[
            SELECT id, title, status, revision, created_at, updated_at
              FROM chestor_journal_tasks WHERE journal_id = ? ORDER BY id ASC
        ]], { journal_id })
        test.is_nil(task_err)
        return ops.canonical({ events = events or {}, tasks = tasks or {} })
    end)
end

local function durable_events(user_id, journal_id)
    local out, list_err = threads(user_id):list_events({ thread_id = journal_id, ascending = true, limit = 1000 })
    test.is_nil(list_err)
    local events = {}
    for _, raw in ipairs((out :: any).events or {}) do
        local body = (raw :: any).body
        if type(body) ~= "table" then
            local decoded, decode_err = json.decode(tostring((raw :: any).body_json or body or "{}"))
            test.is_nil(decode_err)
            body = decoded
        end
        events[#events + 1] = { type = (raw :: any).type, seq = tonumber((raw :: any).seq), body = body }
    end
    return events
end

local function fold_in_chunks(journal_id, events, page_size)
    local component = { set_meta = function() return true, nil end }
    for first = 1, #events, page_size do
        local last = math.min(first + page_size - 1, #events)
        local batch = {}
        for index = first, last do batch[#batch + 1] = events[index] end
        local result, fold_err = projector.run({
            thread_id = journal_id,
            projection = { body = {} },
            events = batch,
            range = { to_seq = tonumber((events[last] :: any).seq) },
        }, component)
        test.is_nil(fold_err)
        test.not_nil(result)
    end
end

local function define_tests()
    test.describe("Journal cursor protocol guards", function()
        test.it("refuses to move, checkpoint, or close a cursor that never opened", function()
            local user = "ghost-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, "Real work")
            sync(user, journal_id)
            local ghost = "jc_GHOST" .. string.upper(string.sub(uuid():gsub("-", ""), 1, 8))

            refused(cmd(user, "move_cursor", journal_id,
                { cursor_id = ghost, task_id = task_id, reason = "focus changed" }),
                "cursor_not_found", "move")
            refused(cmd(user, "checkpoint_cursor", journal_id,
                { cursor_id = ghost, task_id = task_id, checkpoint = { note = "state" } }),
                "cursor_not_found", "checkpoint")
            refused(cmd(user, "close_cursor", journal_id, { cursor_id = ghost }),
                "cursor_not_found", "close")

            -- A refusal names the handle it could not resolve, and manufactures
            -- neither a cursor row nor the episode a real open would have begun.
            local ghosted = cmd(user, "move_cursor", journal_id,
                { cursor_id = ghost, task_id = task_id, reason = "focus changed" })
            test.is_true(tostring(ghosted.detail):find(ghost, 1, true) ~= nil,
                "the refusal must name the cursor: " .. json.encode(ghosted))
            sync(user, journal_id)
            test.eq(#query("SELECT cursor_id FROM chestor_journal_cursors WHERE journal_id = ? AND cursor_id = ?",
                { journal_id, ghost }), 0, "a refused move must not create a cursor")
            test.eq(#query("SELECT episode_id FROM chestor_journal_episodes WHERE journal_id = ? AND cursor_id = ?",
                { journal_id, ghost }), 0, "a refused move must not create an episode")
            test.eq(#query([[SELECT id FROM chestor_journal_events
                 WHERE journal_id = ? AND cursor_id = ?]], { journal_id, ghost }), 0,
                "a refused cursor operation appends nothing")
        end)

        test.it("gives one cursor revision to exactly one writer, and refuses the other", function()
            local user = "revision-" .. uuid()
            local journal_id = create_journal(user)
            local first_task = make_task(user, journal_id, "First")
            local second_task = make_task(user, journal_id, "Second")
            sync(user, journal_id)

            local handle = "jc_RACE" .. string.upper(string.sub(uuid():gsub("-", ""), 1, 9))
            accepted(cmd(user, "open_cursor", journal_id,
                { cursor_id = handle, agent_id = user, task_id = first_task, purpose = "race" }), "open")
            sync(user, journal_id)
            test.eq(tonumber(query(
                "SELECT revision FROM chestor_journal_cursors WHERE journal_id = ? AND cursor_id = ?",
                { journal_id, handle })[1].revision), 1)

            -- Two writers read revision 1 and both move. The projection fold is
            -- asynchronous, so nothing downstream can tell the loser in time;
            -- the claim decides it here, before either event is appended.
            local winner = accepted(cmd(user, "move_cursor", journal_id, {
                cursor_id = handle, agent_id = user, task_id = second_task,
                expected_revision = 1, reason = "the winner moves",
            }), "winner")
            test.eq(tonumber(winner.revision), 2)

            local loser = refused(cmd(user, "move_cursor", journal_id, {
                cursor_id = handle, agent_id = user, task_id = first_task,
                expected_revision = 1, reason = "the loser moves",
            }), "cursor_revision_stale", "loser")
            test.eq(tonumber(loser.current_revision), 2,
                "the refusal must carry the revision that was taken")

            -- The loser appended nothing, so the log never carries two events
            -- at one cursor revision and the fold has no phantom to discard.
            sync(user, journal_id)
            local moves = query([[
                SELECT id FROM chestor_journal_events
                 WHERE journal_id = ? AND cursor_id = ? AND event_type = 'cursor.updated'
            ]], { journal_id, handle })
            test.eq(#moves, 2, "exactly the open and the winning move reached the log")
            local settled = query(
                "SELECT * FROM chestor_journal_cursors WHERE journal_id = ? AND cursor_id = ?",
                { journal_id, handle })[1]
            test.eq(tonumber(settled.revision), 2)
            test.eq(tostring(settled.current_task_id), second_task,
                "the cursor stands where the winner put it")
        end)

        test.it("keeps one automatic position per identity when two first writes race", function()
            local user = "auto-race-" .. uuid()
            local journal_id = create_journal(user)
            local agent = "agent-" .. uuid()

            -- Both writers found no position and allocated their own handle.
            -- Only one of those inserts can exist; the other adopts the winner
            -- rather than splitting the identity's watermark across two rows.
            local first = with_db(function(db)
                local row, err = cursors.advance(db, journal_id, "jc_RACEONE", agent, 4, "auto")
                test.is_nil(err)
                return row
            end)
            test.eq(tostring(first.cursor_id), "jc_RACEONE")

            local second = with_db(function(db)
                local row, err = cursors.advance(db, journal_id, "jc_RACETWO", agent, 9, "auto")
                test.is_nil(err)
                return row
            end)
            test.eq(tostring(second.cursor_id), "jc_RACEONE",
                "the losing allocation must adopt the position the identity already holds")
            test.eq(tonumber(second.last_seen_seq), 9,
                "the adopted position carries the watermark the loser had reached")

            local held = query([[
                SELECT cursor_id FROM chestor_journal_cursors
                 WHERE journal_id = ? AND agent_id = ? AND origin = 'auto' AND state = 'active'
            ]], { journal_id, agent })
            test.eq(#held, 1, "an identity holds one automatic position: " .. json.encode(held))

            -- A cursor the agent opened through the explicit protocol is a
            -- different provenance and is not folded into the automatic one.
            with_db(function(db)
                local row, err = cursors.advance(db, journal_id, "jc_EXPLICIT", agent, 3, "explicit")
                test.is_nil(err)
                test.eq(tostring(row.cursor_id), "jc_EXPLICIT")
            end)
            test.eq(#query([[
                SELECT cursor_id FROM chestor_journal_cursors
                 WHERE journal_id = ? AND agent_id = ? AND state = 'active'
            ]], { journal_id, agent }), 2)
        end)
    end)

    test.describe("Journal sweep and fold bounds", function()
        test.it("leaves a span the sweep had picked but a write revived", function()
            local user = "sweep-" .. uuid()
            local journal_id = create_journal(user)
            local idle_s = types.span_idle_s()
            local now = ops.now()
            local stale_at = now - (idle_s * 4)

            for _, span_id in ipairs({ "js_REVIVED", "js_QUIET" }) do
                with_db(function(db)
                    test.is_nil(spans.insert(db, journal_id, {
                        span_id = span_id, agent_id = "sweeper", cursor_id = "jc_SWEEP",
                        origin = "auto", started_seq = 1,
                    }))
                end)
                exec([[UPDATE chestor_journal_spans SET started_at = ?, last_activity_at = ?
                        WHERE journal_id = ? AND span_id = ?]],
                    { stale_at, stale_at, journal_id, span_id })
            end

            -- The sweep picks both, then a write lands on one of them before
            -- the seal statement runs. This is the exact interleaving the
            -- guarded update exists for.
            local idle_before = now - idle_s
            local found = with_db(function(db)
                local page, err = spans.idle_candidates(db, journal_id, idle_before, nil)
                test.is_nil(err)
                return page
            end)
            test.eq(#found.candidates, 2, "both spans were idle when the sweep looked")

            with_db(function(db)
                test.is_nil(spans.touch(db, journal_id, "js_REVIVED", 7))
            end)

            local swept = with_db(function(db)
                local result, err = spans.seal_candidates(db, journal_id, idle_before,
                    found.candidates, found.limit)
                test.is_nil(err)
                return result
            end)
            test.eq(swept.count, 1, "only the span that stayed quiet is sealed: " .. json.encode(swept))
            test.eq(tostring(swept.sealed[1]), "js_QUIET")

            local revived = query(
                "SELECT * FROM chestor_journal_spans WHERE journal_id = ? AND span_id = ?",
                { journal_id, "js_REVIVED" })[1]
            test.eq(tostring(revived.state), "open", "a revived span must survive the sweep it raced")
            test.is_nil(revived.ended_at)
            test.is_true(tonumber(revived.last_activity_at) > idle_before,
                "the write that revived the span stands")

            local quiet = query(
                "SELECT * FROM chestor_journal_spans WHERE journal_id = ? AND span_id = ?",
                { journal_id, "js_QUIET" })[1]
            test.eq(tostring(quiet.state), "sealed")
            test.eq(tonumber(quiet.ended_at), stale_at,
                "an idle span seals at the moment it last saw work")
        end)

        test.it("bounds the frontier scan and reports when the budget stopped it", function()
            local user = "frontier-" .. uuid()
            local journal_id = create_journal(user)
            local created = {}
            for index = 1, 7 do
                created[#created + 1] = make_task(user, journal_id, "Open work " .. tostring(index))
            end
            sync(user, journal_id)

            local full = read_view(user, journal_id, "frontier", {})
            test.is_true(full.scan_complete, "a small open set is scanned to the end")
            test.eq(tonumber(full.scanned), 7)
            test.eq(#full.actionable, 7)

            -- Every task is reached exactly once however many keyset pages the
            -- walk takes; the page boundary carries nothing across it.
            local paged = invoke(executor(user), REBUILD_BRIDGE, {
                op = "frontier", journal_id = journal_id, frontier_page = 2, args = {},
            })
            test.is_true(paged.success == true, tostring(paged.error))
            test.eq(tonumber(paged.result.scanned), 7)
            test.is_true(paged.result.scan_complete)
            local seen = {}
            for _, item in ipairs(paged.result.actionable) do
                test.is_nil(seen[tostring(item.task_id)],
                    "the keyset walk served " .. tostring(item.task_id) .. " twice")
                seen[tostring(item.task_id)] = true
            end
            for _, task_id in ipairs(created) do
                test.not_nil(seen[task_id], "the keyset walk skipped " .. task_id)
            end

            -- A budget that cannot cover the open set stops, and says so rather
            -- than publishing counts that quietly describe a fraction of it.
            local bounded_scan = read_view(user, journal_id, "frontier", { scan_limit = 3 })
            test.eq(tonumber(bounded_scan.scanned), 3)
            test.is_false(bounded_scan.scan_complete,
                "a budget-stopped scan must not claim it saw the whole open set")
            test.eq(#bounded_scan.actionable, 3)
        end)

        test.it("preserves the journal model across chunked folds and Core reset catch-up", function()
            local user = "catch-up-" .. uuid()
            local journal_id = create_journal(user)
            for index = 1, 5 do
                make_task(user, journal_id, "Catch-up work " .. tostring(index))
                accepted(cmd(user, "append_entry", journal_id, {
                    event_type = "note", title = "note " .. tostring(index), body = "text",
                }), "entry " .. tostring(index))
            end
            sync(user, journal_id)
            local before = canonical_read_model(journal_id)
            local events = durable_events(user, journal_id)
            test.is_true(#events > 4, "the fold needs a log longer than one chunk")
            local chunked = nil
            for _, page_size in ipairs({ 1, 2, 3, #events, #events + 5 }) do
                local folded_id = uuid()
                fold_in_chunks(folded_id, events, page_size)
                local model = canonical_projection_model(folded_id)
                if chunked == nil then chunked = model
                else
                    test.eq(model, chunked, "page_size " .. tostring(page_size) .. " folded a different model")
                end
            end
            local reset = call(user, REBUILD_BRIDGE, { op = "reset", journal_id = journal_id })
            test.is_true(reset.success == true, tostring(reset.error))
            sync(user, journal_id)
            test.eq(canonical_read_model(journal_id), before,
                "Core reset/catch-up must restore the reached Journal read model")
        end)
    end)

    test.describe("Journal read continuations", function()
        test.it("declares every continuation its bounded views hand back", function()
            local tool = registry.get("chestor.journal.traits:read_journal")
            test.not_nil(tool, "the read tool must be registered")
            local schema = ((tool or {}).meta or {}).input_schema or {}
            local properties = (schema :: any).properties or {}
            -- A view that emits a continuation the closed input schema does not
            -- accept has published a page nobody can turn.
            for _, name in ipairs({
                "after_activity_at", "after_span_id",
                "after_bucket_at", "after_agent_id",
                "after_rank", "after_updated_at", "after_graph_id",
            }) do
                test.not_nil((properties :: any)[name],
                    "the read tool must accept the " .. name .. " continuation it returns")
            end
            test.eq(tostring((schema :: any).additionalProperties), "false",
                "the input schema stays closed, so every continuation has to be declared")

            local endpoint = registry.get("chestor.journal.api:get_cursors.endpoint")
            test.not_nil(endpoint, "the cursors endpoint must be registered")
            test.eq(tostring(((endpoint or {}).data or {}).path), "/workspace/journals/{id}/cursors")
        end)

        test.it("reaches every cursor page through the continuation the roll returns", function()
            local user = "roll-" .. uuid()
            local journal_id = create_journal(user)
            for index = 1, 3 do
                local agent = string.format("roller-%02d-%s", index, uuid())
                accepted(invoke(executor(user), TOOL.record, {
                    journal_id = journal_id, agent_id = agent, kind = "observation",
                    data = { title = "roll " .. tostring(index), body = "recorded" },
                }), "roll " .. tostring(index))
            end
            sync(user, journal_id)

            local seen = {}
            local page = read_view(user, journal_id, "cursors", { limit = 1 })
            test.eq(#page.items, 1)
            test.is_true(page.has_more, "three positions do not fit one row")
            local guard = 0
            while true do
                for _, item in ipairs(page.items) do seen[tostring(item.cursor_id)] = true end
                if not page.has_more then break end
                test.not_nil(page.next_cursor, "a page with more must carry its continuation")
                guard = guard + 1
                test.is_true(guard < 10, "the continuation never terminated")
                page = read_view(user, journal_id, "cursors", {
                    limit = 1,
                    after_updated_at = page.next_cursor.after_updated_at,
                    after_cursor_id = page.next_cursor.after_cursor_id,
                })
            end
            local count = 0
            for _ in pairs(seen) do count = count + 1 end
            test.eq(count, 3, "every position is reachable by paging the roll")
        end)

        test.it("carries the activity continuation through the read tool", function()
            local user = "activity-" .. uuid()
            local journal_id = create_journal(user)
            for index = 1, 3 do
                accepted(invoke(executor(user), TOOL.record, {
                    journal_id = journal_id, agent_id = string.format("lane-%02d", index),
                    kind = "observation",
                    data = { title = "lane " .. tostring(index), body = "recorded" },
                }), "lane " .. tostring(index))
            end
            sync(user, journal_id)

            local first = call(user, TOOL.read, {
                journal_id = journal_id, view = "activity", bucket = "day", limit = 1,
            })
            test.is_true(first.success, tostring(first.error))
            test.eq(#first.activity.buckets, 1)
            test.is_true(first.activity.has_more, "three agent lanes do not fit one bucket row")
            test.not_nil(first.activity.next_cursor)

            local second = call(user, TOOL.read, {
                journal_id = journal_id, view = "activity", bucket = "day", limit = 1,
                after_bucket_at = first.activity.next_cursor.after_bucket_at,
                after_agent_id = first.activity.next_cursor.after_agent_id,
            })
            test.is_true(second.success, tostring(second.error))
            test.eq(#second.activity.buckets, 1)
            test.is_true(
                tostring(second.activity.buckets[1].agent_id) ~= tostring(first.activity.buckets[1].agent_id),
                "the continuation must advance past the row it was cut on")
        end)

        test.it("publishes the graph catalog continuation instead of a silently short list", function()
            local user = "catalog-" .. uuid()
            local journal_id = create_journal(user)
            accepted(invoke(executor(user), TOOL.record, {
                journal_id = journal_id, kind = "observation",
                data = { title = "catalog seed", body = "recorded", tags = { "architecture" } },
            }), "seed")
            for _, name in ipairs({ "architecture", "risks" }) do
                local configured = call(user, "chestor.journal.traits:configure_journal_graph", {
                    journal_id = journal_id,
                    graph_id = name,
                    request_id = "config:" .. uuid(),
                    title = name,
                    description = "Catalog paging fixture.",
                    kind = "curated",
                    sources = { tags = { name } },
                    maintainer = { mode = "deterministic" },
                })
                test.is_true(configured.success == true, name .. ": " .. tostring(configured.error))
            end
            sync(user, journal_id)
            sync_kind(user, journal_id, GRAPH_PROJECTION)

            local full = call(user, TOOL.read, { journal_id = journal_id, view = "graphs" })
            test.is_true(full.success, tostring(full.error))
            test.is_true(#full.graphs >= 3,
                "the fixture journal carries the map plus both configured graphs: " .. json.encode(full.graphs))
            test.is_false(full.has_more, "a whole catalog reports no continuation")
            test.is_nil(full.next_cursor)

            -- The wrapper used to hand back the rows and drop the fact that the
            -- catalog went on past them, so nothing downstream could tell a
            -- short page from a whole catalog.
            local seen = {}
            local page = call(user, TOOL.read, { journal_id = journal_id, view = "graphs", limit = 1 })
            test.is_true(page.success, tostring(page.error))
            test.eq(#page.graphs, 1)
            test.is_true(page.has_more, "a truncated catalog must say so")
            local guard = 0
            while true do
                test.eq(#page.graphs, 1)
                test.is_nil(seen[tostring(page.graphs[1].id)],
                    "the catalog served " .. tostring(page.graphs[1].id) .. " twice")
                seen[tostring(page.graphs[1].id)] = true
                if page.has_more ~= true then break end
                test.not_nil(page.next_cursor, "a truncated catalog must carry its continuation")
                guard = guard + 1
                test.is_true(guard < 20, "the catalog continuation never terminated")
                page = call(user, TOOL.read, {
                    journal_id = journal_id, view = "graphs", limit = 1,
                    after_rank = page.next_cursor.after_rank,
                    after_updated_at = page.next_cursor.after_updated_at,
                    after_graph_id = page.next_cursor.after_graph_id,
                })
                test.is_true(page.success, tostring(page.error))
            end
            local count = 0
            for _ in pairs(seen) do count = count + 1 end
            test.eq(count, #full.graphs, "every graph is reachable one page at a time")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

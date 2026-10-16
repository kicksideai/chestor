-- Automatic agent-cursor maintenance and the read surface that publishes it.
-- Recording and reading both move the calling agent's durable position, so the
-- journal answers where every agent last was without that agent carrying a
-- handle. Position is tracking only: it allocates no episode, pins no fact, and
-- leaves the explicit cursor protocol - owner, revision, and episode deadline -
-- exactly as it was. The bounded roll publishes every cursor, automatic and
-- explicit, on one access-gated read.
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

-- The MCP dispatcher binds one identity per transport connection; the harness
-- reproduces it with the same context value the tools read.
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
        title = "cursor position " .. uuid(),
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

local function accepted(result, label)
    local at = label and (" [" .. label .. "]") or ""
    test.not_nil(result, "expected a result" .. at)
    test.is_true(result.refused ~= true and result.success ~= false,
        "expected success" .. at .. ", got " .. json.encode(result))
    test.is_nil(result.cursor_error, "position maintenance failed" .. at)
    return result
end

local function refused(result, code, label)
    local at = label and (" [" .. label .. "]") or ""
    test.not_nil(result, "expected a result" .. at)
    test.is_true(result.refused == true, "expected a refusal" .. at .. ", got " .. json.encode(result))
    test.eq(tostring(result.code), code,
        "expected refusal code " .. code .. at .. ", got " .. json.encode(result))
    return result
end

local function read_cursors(user_id, journal_id, args)
    local out, err = executor(user_id):call(READ_BRIDGE, {
        view = "cursors", journal_id = journal_id, args = args or {},
    })
    test.is_nil(err)
    test.not_nil(out)
    return out
end

local function cursor_item(page, cursor_id)
    for _, item in ipairs(page.items or {}) do
        if tostring(item.cursor_id) == tostring(cursor_id) then return item end
    end
    test.is_true(false, "cursor " .. tostring(cursor_id) .. " is missing from the roll: " .. json.encode(page))
    return nil
end

local function observe(runner, journal_id, title)
    return accepted(invoke(runner, TOOL.record, {
        journal_id = journal_id, kind = "observation",
        data = { title = title, body = title .. " recorded" },
    }), title)
end

local function define_tests()
    test.describe("Journal automatic cursor position", function()
        test.it("allocates the writing agent's cursor on first record and advances it after", function()
            local user = "auto-" .. uuid()
            local journal_id = create_journal(user)

            local first = observe(executor(user), journal_id, "first observation")
            test.is_true(tostring(first.cursor_id or "") ~= "",
                "a record must report the maintained cursor: " .. json.encode(first))
            test.is_true(tonumber(first.cursor_seq) > 0)

            local created = cursor_row(journal_id, first.cursor_id)
            test.eq(tostring(created.agent_id), user)
            test.eq(tostring(created.origin), "auto")
            test.eq(tostring(created.state), "active")
            test.eq(tonumber(created.last_seen_seq), tonumber(first.cursor_seq))
            -- Position only: an automatic cursor pins no work and opens no
            -- episode, so it can never refuse a write.
            test.eq(ops.trim(created.current_task_id), "")
            test.eq(ops.trim(created.current_episode_id), "")
            test.eq(#query(
                "SELECT episode_id FROM chestor_journal_episodes WHERE journal_id = ? AND cursor_id = ?",
                { journal_id, first.cursor_id }), 0)

            local second = observe(executor(user), journal_id, "second observation")
            test.eq(tostring(second.cursor_id), tostring(first.cursor_id))
            test.is_true(tonumber(second.cursor_seq) > tonumber(first.cursor_seq),
                "the second record must advance the position")
            test.eq(tonumber(cursor_row(journal_id, first.cursor_id).last_seen_seq),
                tonumber(second.cursor_seq))
            test.eq(#cursor_rows(journal_id), 1, "one agent keeps one cursor")

            -- The cursor lens resolves a tracked position by agent identity
            -- and reports it as unplaced rather than failing.
            local lens = call(user, TOOL.read, {
                journal_id = journal_id, view = "cursor", agent_id = user,
            })
            test.is_true(lens.success, tostring(lens.error))
            test.eq(tostring(lens.context.cursor.cursor_id), tostring(first.cursor_id))
            test.eq(tostring(lens.context.cursor.agent_id), user)
            test.eq(tostring(lens.context.cursor.origin), "auto")
            test.eq(tostring(lens.context.position.resolved), "stale_pointer")
        end)

        test.it("gives two connection identities in one journal their own cursors", function()
            local user = "shared-" .. uuid()
            local journal_id = create_journal(user)
            local left = "conn-left-" .. uuid()
            local right = "conn-right-" .. uuid()

            local left_first = observe(connection_executor(user, left), journal_id, "left work")
            local right_first = observe(connection_executor(user, right), journal_id, "right work")
            test.is_true(tostring(left_first.cursor_id) ~= tostring(right_first.cursor_id),
                "two connection identities must not share one cursor")

            -- The bound connection identity wins over the security actor, so
            -- neither cursor is filed under the shared account.
            test.eq(tostring(cursor_row(journal_id, left_first.cursor_id).agent_id), left)
            test.eq(tostring(cursor_row(journal_id, right_first.cursor_id).agent_id), right)
            test.eq(#cursor_rows(journal_id), 2)

            local left_second = observe(connection_executor(user, left), journal_id, "left again")
            test.eq(tostring(left_second.cursor_id), tostring(left_first.cursor_id))
            test.is_true(tonumber(left_second.cursor_seq) > tonumber(right_first.cursor_seq))
            test.eq(tonumber(cursor_row(journal_id, right_first.cursor_id).last_seen_seq),
                tonumber(right_first.cursor_seq), "another agent's write must not move this position")
            test.eq(#cursor_rows(journal_id), 2)
        end)

        test.it("tracks a pinned cursor's position without touching its revision or episode contract", function()
            local user = "pinned-" .. uuid()
            local journal_id = create_journal(user)
            -- The setup write carries no handle, so the account itself gets a
            -- tracked cursor; the pinned cursor below is a second, separate one.
            local setup = accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "work", title = "Pinned work", work_kind = "task" },
            }))
            sync(user, journal_id)
            local untouched = tonumber(cursor_row(journal_id, setup.cursor_id).last_seen_seq)

            local opened = accepted(call(user, TOOL.act, {
                journal_id = journal_id, verb = "cursor_open",
                data = { cursor_id = "pinned", task_id = "work", agent_id = "pin-agent",
                    purpose = "Own the pinned protocol" },
            }))
            sync(user, journal_id)
            local before = cursor_row(journal_id, "pinned")
            test.eq(tostring(before.origin), "explicit")
            test.eq(tonumber(before.revision), 1)

            local pinned = accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "observation",
                data = { cursor_id = "pinned", title = "Through the cursor",
                    body = "Recorded while pinned." },
            }))
            test.eq(tostring(pinned.cursor_id), "pinned")
            sync(user, journal_id)
            local tracked = cursor_row(journal_id, "pinned")
            -- The fact still pins to the cursor's task and episode, and the
            -- revision an agent holds is untouched by position maintenance.
            test.eq(tostring(pinned.task_id), "work")
            test.eq(tonumber(tracked.revision), 1)
            test.eq(ops.trim(tracked.current_task_id), "work")
            test.eq(ops.trim(tracked.current_episode_id), ops.trim(opened.episode_id))
            test.is_true(tonumber(tracked.last_seen_seq) >= tonumber(pinned.cursor_seq))
            test.is_true(tonumber(tracked.last_seen_seq) > tonumber(before.last_seen_seq),
                "a pinned record must still advance the position")
            -- A pinned write maintains the pinned cursor only.
            test.eq(#cursor_rows(journal_id), 2)
            test.eq(tonumber(cursor_row(journal_id, setup.cursor_id).last_seen_seq), untouched)

            local db, db_err = sql.get(types.db_id())
            test.is_nil(db_err)
            local expiry_err = ops.exec(db, [[
                UPDATE chestor_journal_episodes SET deadline_at = ?
                 WHERE journal_id = ? AND episode_id = ?
            ]], { os.time() - 1, journal_id, opened.episode_id })
            db:release()
            test.is_nil(expiry_err)

            local blocked = refused(call(user, TOOL.record, {
                journal_id = journal_id, kind = "observation",
                data = { cursor_id = "pinned", title = "Too late", body = "Must rotate first." },
            }), "episode_rotation_required", "work after the episode deadline")
            test.is_nil(blocked.cursor_seq, "a refused write maintains no position")
            test.eq(tonumber(cursor_row(journal_id, "pinned").last_seen_seq),
                tonumber(tracked.last_seen_seq))

            -- The revision protocol still holds the number the agent was given.
            accepted(call(user, TOOL.act, {
                journal_id = journal_id, verb = "cursor_checkpoint",
                data = { cursor_id = "pinned", agent_id = "pin-agent", task_id = "work",
                    expected_revision = 1,
                    checkpoint = { completed = { "pinned observation" } } },
            }), "checkpoint at the revision the agent holds")
        end)

        test.it("advances the acting agent's position on a protocol verb that appends", function()
            local user = "verb-" .. uuid()
            local journal_id = create_journal(user)
            local agent = "conn-verb-" .. uuid()
            local runner = connection_executor(user, agent)

            local created = accepted(invoke(runner, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "verb-work", title = "Verb work" },
            }))
            sync(user, journal_id)
            local tracked = tostring(created.cursor_id)
            local before = tonumber(cursor_row(journal_id, tracked).last_seen_seq)

            local lease = accepted(invoke(runner, TOOL.act, {
                journal_id = journal_id, verb = "open_branch",
                data = { task_id = "verb-work", agent_id = agent },
            })).lease
            local started = accepted(invoke(runner, TOOL.act, {
                journal_id = journal_id, verb = "start",
                data = { task_id = "verb-work", lease_id = lease.lease_id,
                    fencing_token = lease.fencing_token },
            }))
            test.eq(tostring(started.cursor_id), tracked)
            test.is_true(tonumber(started.cursor_seq) > before,
                "a transition must advance the acting agent's position")
            sync(user, journal_id)

            local after = cursor_row(journal_id, tracked)
            test.eq(tonumber(after.last_seen_seq), tonumber(started.cursor_seq))
            test.eq(tostring(after.agent_id), agent)
            test.eq(tostring(after.origin), "auto")
            -- Position only: a transition pins nothing to the tracked cursor.
            test.eq(ops.trim(after.current_task_id), "")
            test.eq(ops.trim(after.current_episode_id), "")
            test.eq(#cursor_rows(journal_id), 1, "a verb allocates no extra cursor")
        end)

        test.it("leaves the cursor protocol to move its own position", function()
            local user = "protocol-" .. uuid()
            local journal_id = create_journal(user)
            local agent = "conn-protocol-" .. uuid()
            local runner = connection_executor(user, agent)

            local created = accepted(invoke(runner, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "protocol-work", title = "Protocol work" },
            }))
            sync(user, journal_id)
            local tracked = tostring(created.cursor_id)
            local tracked_seq = tonumber(cursor_row(journal_id, tracked).last_seen_seq)
            test.eq(#cursor_rows(journal_id), 1)

            local opened = accepted(invoke(runner, TOOL.act, {
                journal_id = journal_id, verb = "cursor_open",
                data = { cursor_id = "protocol", task_id = "protocol-work",
                    agent_id = "protocol-agent", purpose = "Own the protocol" },
            }))
            test.is_nil(opened.cursor_seq, "a cursor verb reports no maintained position")
            sync(user, journal_id)
            test.eq(#cursor_rows(journal_id), 2)
            test.eq(tonumber(cursor_row(journal_id, tracked).last_seen_seq), tracked_seq,
                "a cursor verb must not move the acting agent's tracked position")
            local protocol_before = cursor_row(journal_id, "protocol")

            local resumed = invoke(runner, TOOL.context, {
                journal_id = journal_id, handle = "protocol",
            })
            test.is_true(resumed.success, tostring(resumed.error))
            test.is_nil(resumed.cursor_error)
            local after_resume = cursor_row(journal_id, "protocol")
            test.eq(tonumber(after_resume.last_seen_seq), tonumber(protocol_before.last_seen_seq),
                "resume must not consume the delta it exists to show")
            test.eq(tonumber(after_resume.revision), tonumber(protocol_before.revision))
            test.eq(tonumber(cursor_row(journal_id, tracked).last_seen_seq), tracked_seq)
            test.eq(#cursor_rows(journal_id), 2)

            accepted(invoke(runner, TOOL.context, {
                journal_id = journal_id, handle = "protocol", op = "checkpoint",
                expected_revision = tonumber(protocol_before.revision),
                checkpoint = { completed = { "protocol pass" } },
            }), "protocol checkpoint")
            sync(user, journal_id)
            test.eq(#cursor_rows(journal_id), 2, "the protocol allocates no extra cursor")
            test.eq(tonumber(cursor_row(journal_id, tracked).last_seen_seq), tracked_seq)
        end)

        test.it("keeps a maintained position across Core projection catch-up", function()
            local user = "catch-up-" .. uuid()
            local journal_id = create_journal(user)
            observe(executor(user), journal_id, "before catch-up")
            local latest = observe(executor(user), journal_id, "also before catch-up")
            sync(user, journal_id)
            local before = cursor_row(journal_id, latest.cursor_id)

            local reset = call(user, REBUILD_BRIDGE, { op = "reset", journal_id = journal_id })
            test.is_true(reset.success == true, tostring(reset.error))
            sync(user, journal_id)

            local after = cursor_row(journal_id, latest.cursor_id)
            test.eq(tostring(after.agent_id), user)
            test.eq(tostring(after.origin), "auto")
            test.eq(tonumber(after.last_seen_seq), tonumber(before.last_seen_seq))
            test.eq(#cursor_rows(journal_id), 1)
        end)

        test.it("advances a reader to the head it received and never backwards", function()
            local user = "reader-" .. uuid()
            local journal_id = create_journal(user)
            local writer = "conn-writer-" .. uuid()
            local reader = "conn-reader-" .. uuid()

            observe(connection_executor(user, writer), journal_id, "one")
            observe(connection_executor(user, writer), journal_id, "two")
            local last_write = observe(connection_executor(user, writer), journal_id, "three")
            sync(user, journal_id)

            -- A metadata read carries no event rows, so it moves nothing and
            -- allocates nothing.
            local health = invoke(connection_executor(user, reader), TOOL.read, {
                journal_id = journal_id, view = "health",
            })
            test.is_true(health.success)
            test.is_nil(health.cursor_id, "a read without events maintains no position")
            test.eq(#cursor_rows(journal_id), 1)

            local tail = invoke(connection_executor(user, reader), TOOL.read, {
                journal_id = journal_id, view = "tail",
            })
            test.is_true(health.success, tostring(tail.error))
            test.is_nil(tail.cursor_error)
            local highest = 0
            for _, event in ipairs(tail.events or {}) do
                if (tonumber(event.seq) or 0) > highest then highest = tonumber(event.seq) end
            end
            test.is_true(highest > 0, "the tail view must return event rows")
            test.eq(tonumber(tail.cursor_seq), highest)

            local reader_row = cursor_row(journal_id, tail.cursor_id)
            test.eq(tostring(reader_row.agent_id), reader)
            test.eq(tostring(reader_row.origin), "auto")
            test.is_true(tostring(tail.cursor_id) ~= tostring(last_write.cursor_id),
                "the reader keeps its own cursor")
            test.eq(#cursor_rows(journal_id), 2)

            -- Reading older history is still consumption of what it returned,
            -- and a watermark only moves forward.
            local older = invoke(connection_executor(user, reader), TOOL.read, {
                journal_id = journal_id, view = "changes", since_seq = 0, limit = 1,
            })
            test.is_true(older.success, tostring(older.error))
            test.eq(#older.changes.events, 1)
            test.is_true(tonumber(older.changes.events[1].seq) < highest,
                "this window must be older than the reader's position")
            test.eq(tonumber(older.cursor_seq), highest)
            test.eq(tonumber(cursor_row(journal_id, tail.cursor_id).last_seen_seq), highest)
            test.eq(#cursor_rows(journal_id), 2)
        end)

        test.it("publishes automatic and explicit cursors on one journal read", function()
            local user = "roll-" .. uuid()
            local journal_id = create_journal(user)
            local left = "conn-roll-left-" .. uuid()
            local right = "conn-roll-right-" .. uuid()

            local task = accepted(invoke(connection_executor(user, left), TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "roll-work", title = "Roll work" },
            }))
            local decision = accepted(invoke(connection_executor(user, right), TOOL.record, {
                journal_id = journal_id, kind = "decision",
                data = { title = "Roll decision", body = "Right settled the approach." },
            }))
            sync(user, journal_id)
            sync_kind(user, journal_id, GRAPH_PROJECTION)

            accepted(call(user, TOOL.context, {
                journal_id = journal_id, op = "open", cursor_id = "roll-explicit",
                agent_id = "roll-agent", purpose = "Own the roll",
                address = { graph_id = "map", node_id = "task:roll-work" },
            }), "explicit cursor open")
            sync(user, journal_id)
            accepted(call(user, TOOL.context, {
                journal_id = journal_id, handle = "roll-explicit", op = "checkpoint",
                expected_revision = 1,
                checkpoint = { completed = { "opened the roll" }, next_action = "verify the roll" },
            }), "explicit cursor checkpoint")
            sync(user, journal_id)

            local page = read_cursors(user, journal_id)
            test.is_true(page.success, tostring(page.error))
            local roll = page.value
            test.eq(tostring(roll.journal_id), journal_id)
            test.eq(roll.total, 3)
            test.eq(#roll.items, 3)
            test.is_false(roll.has_more)
            test.eq(roll.omitted, 0)

            local writer = cursor_item(roll, task.cursor_id)
            test.eq(tostring(writer.agent_id), left)
            test.eq(tostring(writer.origin), "auto")
            test.eq(tostring(writer.state), "active")
            test.eq(tonumber(writer.last_seen_seq), tonumber(task.cursor_seq))
            test.eq(tonumber(writer.checkpoint_seq), 0)
            test.is_true(tonumber(writer.created_at) > 0)
            test.is_true(tonumber(writer.updated_at) > 0)
            test.is_nil(writer.position, "an automatic cursor holds no graph address")

            -- The watermark of the agent that recorded a projected fact
            -- resolves to the record standing for it.
            local reader = cursor_item(roll, decision.cursor_id)
            test.eq(tostring(reader.agent_id), right)
            test.eq(tostring(reader.origin), "auto")
            test.not_nil(reader.last_touch, "a projected watermark must carry its record")
            test.eq(tonumber(reader.last_touch.seq), tonumber(decision.cursor_seq))
            test.eq(tostring(reader.last_touch.positions[1].graph_id), "map")
            test.eq(tostring(reader.last_touch.positions[1].node_id),
                "event:" .. tostring(reader.last_touch.event_id))

            local explicit = cursor_item(roll, "roll-explicit")
            test.eq(tostring(explicit.agent_id), "roll-agent")
            test.eq(tostring(explicit.origin), "explicit")
            test.eq(tostring(explicit.purpose), "Own the roll")
            test.eq(tostring(explicit.position.graph_id), "map")
            test.eq(tostring(explicit.position.node_id), "task:roll-work")
            test.is_true(tonumber(explicit.checkpoint_seq) > 0)
            -- The stored recovery blob answers by shape and one readable line.
            test.eq(explicit.checkpoint.entries, 2)
            test.eq(explicit.checkpoint.keys[1], "completed")
            test.eq(explicit.checkpoint.keys[2], "next_action")
            test.eq(tostring(explicit.checkpoint.headline), "opened the roll")
            test.is_nil(explicit.checkpoint.completed, "the roll carries no checkpoint blob")

            -- The same roll is folded into the journal snapshot, so a reader
            -- of the aggregate needs no second request.
            local state = executor(user):call(READ_BRIDGE, { view = "state", journal_id = journal_id })
            test.not_nil(state)
            test.is_true(state.success, tostring(state.error))
            test.eq(state.value.cursors.total, 3)
            test.eq(#state.value.cursors.items, 3)
        end)

        test.it("bounds and orders the roll by movement, and refuses a reader without access", function()
            local user = "bound-" .. uuid()
            local journal_id = create_journal(user)
            local ids = {}
            for index = 1, 3 do
                local connection = "conn-bound-" .. tostring(index) .. "-" .. uuid()
                ids[index] = tostring(observe(connection_executor(user, connection), journal_id,
                    "bounded observation " .. tostring(index)).cursor_id)
            end
            sync(user, journal_id)
            test.eq(#cursor_rows(journal_id), 3)

            -- Movement time is second-granular, so the roll is given three
            -- distinct times to assert the ordering it promises.
            local base = os.time()
            for index, cursor_id in ipairs(ids) do
                local db, db_err = sql.get(types.db_id())
                test.is_nil(db_err)
                local update_err = ops.exec(db,
                    "UPDATE chestor_journal_cursors SET updated_at = ? WHERE journal_id = ? AND cursor_id = ?",
                    { base + index, journal_id, cursor_id })
                db:release()
                test.is_nil(update_err)
            end

            local full = read_cursors(user, journal_id).value
            test.eq(#full.items, 3)
            test.eq(tostring(full.items[1].cursor_id), ids[3])
            test.eq(tostring(full.items[2].cursor_id), ids[2])
            test.eq(tostring(full.items[3].cursor_id), ids[1])

            local bounded = read_cursors(user, journal_id, { limit = 2 }).value
            test.eq(#bounded.items, 2)
            test.eq(bounded.limit, 2)
            test.eq(bounded.total, 3)
            test.eq(bounded.omitted, 1)
            test.is_true(bounded.has_more)
            test.eq(tostring(bounded.items[1].cursor_id), ids[3])
            test.eq(tostring(bounded.items[2].cursor_id), ids[2])

            -- The limit is clamped by the reader, never by the caller.
            local clamped = read_cursors(user, journal_id, { limit = 5000 }).value
            test.eq(clamped.limit, 200)

            local denied = read_cursors("stranger-" .. uuid(), journal_id)
            test.is_false(denied.success)
            test.not_nil(denied.error)
        end)

        test.it("serves the roll on its own bounded journal endpoint", function()
            local handler = registry.get("chestor.journal.api:get_cursors")
            test.not_nil(handler, "the cursor read handler must be registered")
            local endpoint = registry.get("chestor.journal.api:get_cursors.endpoint")
            test.not_nil(endpoint, "the cursor read endpoint must be registered")
            local data = (endpoint or {}).data or {}
            test.eq(tostring(data.method), "GET")
            test.eq(tostring(data.path), "/workspace/journals/{id}/cursors")
            test.eq(tostring(data.func), "get_cursors")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

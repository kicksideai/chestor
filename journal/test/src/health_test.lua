-- B4 health surface: the 60s health writer publishes per-component states to
-- the workspace component meta (the out-of-band channel per X6/D5), the reader
-- computes staleness from heartbeat age with an injected clock (I6.1), a dead
-- paused or invalid projection cursor reads as degraded with the error surfaced
-- (F6), legacy projection-input stamps do not become a second health detector,
-- and the digest SLA degrades without re-emitting per beat
-- (I7.3), and the lease reaper is wired operationally (I9.4). Commands run
-- through app:journal_cmd, the writer through its function entry, reads
-- through app:journal_read and the ReadJournal tool, all actor-framed.
local test = require("test")
local sql = require("sql")
local json = require("json")
local funcs = require("funcs")
local crypto = require("crypto")
local security = require("security")
local contract = require("contract")
local time = require("time")
local types = require("types")
local ops = require("ops")

local THREADS = "kickside.core:threads"
local STATE_PROJECTION = "chestor.journal:state"
local READ_TOOL = "chestor.journal.traits:read_journal"
local WRITER = "chestor.journal.health:writer"
local READ_BRIDGE = "app:journal_read"

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
        title = "B4 health " .. uuid(),
    })
    test.is_nil(err)
    return tostring(created.component_id or created.thread_id)
end

local function cmd(user_id, op, journal_id, args)
    local out, err = executor(user_id):call("app:journal_cmd", {
        op = op, journal_id = journal_id, args = args or {},
    })
    test.is_nil(err, "command op " .. tostring(op) .. ": " .. tostring(err))
    test.not_nil(out)
    return out
end

local function sync(user_id, journal_id)
    local detail = "projection cursor not registered"
    for _ = 1, 500 do
        local listed, err = threads(user_id):list_projections({ thread_id = journal_id })
        test.is_nil(err)
        local required_seq = tonumber(listed and listed.event_count) or 0
        for _, cursor in ipairs((listed and listed.cursors) or {}) do
            if tostring(cursor.kind) == STATE_PROJECTION then
                local status = tostring(cursor.status or "")
                detail = status .. ": " .. tostring(cursor.last_error or "")
                test.is_false(status == "invalid" or status == "paused", "state projection stopped: " .. detail)
                if (tonumber(cursor.last_seq) or 0) >= required_seq then return end
            end
        end
        time.sleep("20ms")
    end
    test.is_true(false, "state projection did not reach the thread head: " .. detail)
end

local function with_db(fn)
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    test.not_nil(db)
    fn(db)
    db:release()
end

local function db_exec(statement, params)
    with_db(function(db)
        local exec_err = ops.exec(db, statement, params or {})
        test.is_nil(exec_err)
    end)
end

local function db_one(statement, params)
    local row = nil
    with_db(function(db)
        local rows, query_err = ops.query(db, statement, params or {})
        test.is_nil(query_err)
        row = rows and rows[1] or nil
    end)
    return row
end

local function accepted(result)
    test.not_nil(result)
    test.is_true(result.refused ~= true and result.success ~= false,
        "expected success, got " .. json.encode(result))
    return result
end

local function run_writer(user, journal_id)
    local out, err = executor(user):call(WRITER, { journal_id = journal_id })
    test.is_nil(err, "health writer: " .. tostring(err))
    local snapshot = accepted(out).health
    test.not_nil(snapshot, "writer returned no snapshot")
    return snapshot
end

local function read_health(user, journal_id, args)
    local out, err = executor(user):call(READ_BRIDGE, { view = "health", journal_id = journal_id, args = args })
    test.is_nil(err)
    return accepted(out).value
end

local function read_view(user, input)
    local out, err = executor(user):call(READ_TOOL, input)
    test.is_nil(err)
    test.not_nil(out)
    test.is_true(out.success == true, tostring(out.error))
    return out
end

local function make_task(user, journal_id, args)
    args = args or {}
    args.id = args.id or ("task-" .. uuid())
    args.title = args.title or args.id
    args.status = args.status or "open"
    args.command_id = uuid()
    accepted(cmd(user, "upsert_task", journal_id, args))
    sync(user, journal_id)
    return args.id
end

local function append_fact(user, journal_id, title)
    accepted(cmd(user, "append_entry", journal_id, {
        event_type = "progress", title = title, body = title,
    }))
end

local function stored_meta_snapshot(journal_id)
    local row = db_one(
        "SELECT value FROM kickside_component_meta WHERE component_id = ? AND key = 'health'",
        { journal_id })
    test.not_nil(row, "health snapshot missing from the component meta channel")
    local decoded, decode_err = json.decode(tostring(row.value))
    test.is_nil(decode_err)
    test.eq(type(decoded), "table")
    return decoded
end

local function define_tests()
    test.describe("Journal B4 health surface", function()

        test.it("writer publishes every component state to the out-of-band component meta", function()
            local user = "b4-" .. uuid()
            local journal_id = create_journal(user)
            make_task(user, journal_id, {})
            append_fact(user, journal_id, "healthy work")
            sync(user, journal_id)

            local snapshot = run_writer(user, journal_id)
            test.is_true(tonumber(snapshot.heartbeat_at) > 0)
            test.eq(tonumber(snapshot.interval_s), types.HEALTH.INTERVAL_S)
            test.is_true(snapshot.active == true, "test journal should be active")

            local components = snapshot.components
            test.not_nil(components)
            -- projection cursor states for the journal thread
            test.is_true(#components.projections.cursors >= 1)
            local state_cursor = nil
            for _, cursor in ipairs(components.projections.cursors) do
                if tostring(cursor.cursor_key) == "state" then state_cursor = cursor end
            end
            test.not_nil(state_cursor, "state projection cursor missing from the snapshot")
            test.eq(tostring(state_cursor.status), "active", "state projection cursor should be active")
            test.eq(tonumber(state_cursor.lag), 0)
            test.is_true(components.projections.degraded ~= true, "projection component should be healthy")
            -- embedding backlog, maintainer queue, digest SLA, leases
            test.eq(type(components.embeddings.pending), "number")
            test.eq(type(components.maintainer.queued), "number")
            test.eq(type(components.maintainer.dead), "number")
            test.eq(components.maintainer.dead, 0)
            test.is_nil(components.drift, "Core owns projection declaration convergence")
            test.is_true(components.digest_sla.violated ~= true, "digest SLA should not be violated")
            test.eq(type(components.digest_sla.lag), "number")
            test.eq(type(components.leases.active), "number")
            test.eq(tonumber(components.leases.reaped), 0)

            -- the snapshot lands on the workspace component meta (X6/D5), not
            -- inside the journal read models
            local stored = stored_meta_snapshot(journal_id)
            test.eq(tonumber(stored.heartbeat_at), tonumber(snapshot.heartbeat_at))
            test.not_nil(stored.components.digest_sla)

            -- the writer chains its next beat through the jobs engine
            local chained = db_one(
                "SELECT COUNT(*) AS n FROM kickside_job WHERE thread_id = ? AND job_type = ?",
                { journal_id, types.HEALTH.JOB_TYPE })
            test.is_true(tonumber(chained.n) >= 1,
                "health writer should chain a job; found " .. tostring(chained.n))

            -- reader surfaces: ReadJournal health view and the brief one-liner
            local health = read_view(user, { journal_id = journal_id, view = "health" }).health
            test.eq(tostring(health.status), "ok")
            test.eq(type(health.age_s), "number")
            test.not_nil(health.components)
            local brief = read_view(user, { journal_id = journal_id, view = "brief" }).brief
            test.not_nil(brief.health)
            test.eq(tostring(brief.health.status), "ok")
            test.is_true(tostring(brief.health.summary):find("health ok", 1, true) ~= nil)
        end)

        test.it("paused or invalid projection cursor reads degraded with the error surfaced", function()
            local user = "b4-" .. uuid()
            local journal_id = create_journal(user)
            append_fact(user, journal_id, "before the cursor dies")
            sync(user, journal_id)

            db_exec([[
                UPDATE kickside_projection_cursor SET status = 'paused', last_error = 'worker exploded'
                 WHERE thread_id = ? AND cursor_key = 'state'
            ]], { journal_id })
            run_writer(user, journal_id)
            local paused = read_health(user, journal_id)
            test.eq(tostring(paused.status), "degraded")
            test.is_true(paused.components.projections.degraded == true)
            test.is_true(tostring(paused.reasons[1]):find("worker exploded", 1, true) ~= nil)
            test.is_true(tostring(paused.reasons[1]):find("paused", 1, true) ~= nil)

            db_exec([[
                UPDATE kickside_projection_cursor SET status = 'invalid'
                 WHERE thread_id = ? AND cursor_key = 'state'
            ]], { journal_id })
            run_writer(user, journal_id)
            local invalid = read_health(user, journal_id)
            test.eq(tostring(invalid.status), "degraded")
            test.is_true(tostring(invalid.reasons[1]):find("invalid", 1, true) ~= nil)
        end)

        test.it("reader computes unknown from heartbeat age with an injected clock", function()
            local user = "b4-" .. uuid()
            local journal_id = create_journal(user)

            -- a journal the writer never beat for reads unknown by pure absence
            local never = read_health(user, journal_id)
            test.eq(tostring(never.status), "unknown")
            test.is_nil(never.heartbeat_at)

            append_fact(user, journal_id, "wake the journal")
            sync(user, journal_id)
            local snapshot = run_writer(user, journal_id)
            local beat = tonumber(snapshot.heartbeat_at)
            if beat == nil then error("heartbeat_at must be numeric") end

            local fresh = read_health(user, journal_id, { now = beat + (2 * types.HEALTH.INTERVAL_S) - 1 })
            test.eq(tostring(fresh.status), "ok")
            test.eq(tonumber(fresh.heartbeat_at), beat)

            local stale = read_health(user, journal_id, { now = beat + (2 * types.HEALTH.INTERVAL_S) })
            test.eq(tostring(stale.status), "unknown")
            test.eq(tonumber(stale.age_s), 2 * types.HEALTH.INTERVAL_S)
            test.eq(tonumber(stale.heartbeat_at), beat)
        end)

        test.it("legacy projection-input stamps do not affect writer or reader health", function()
            local user = "b4-" .. uuid()
            local journal_id = create_journal(user)
            append_fact(user, journal_id, "seed fact")
            sync(user, journal_id)

            db_exec([[INSERT INTO chestor_journal_state (journal_id, projection_input_hash, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(journal_id) DO UPDATE SET projection_input_hash = excluded.projection_input_hash]],
                { journal_id, "legacy-module-hash", time.now():unix() })
            local snapshot = run_writer(user, journal_id)
            test.is_nil((snapshot.components or {}).drift,
                "Journal has no second projection drift detector")
            test.eq(tostring(read_health(user, journal_id).status), "ok")

            append_fact(user, journal_id, "subsequent fact")
            sync(user, journal_id)
            local after = run_writer(user, journal_id)
            test.is_nil((after.components or {}).drift)
            test.eq(tostring(read_health(user, journal_id).status), "ok")
            local state = db_one(
                "SELECT projection_input_hash FROM chestor_journal_state WHERE journal_id = ?", { journal_id })
            test.eq(tostring(state.projection_input_hash), "legacy-module-hash")
        end)

        test.it("writer run releases an expired lease without abandoning its resumable task", function()
            local user = "b4-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            local lease = accepted(cmd(user, "open_branch", journal_id, {
                task_id = task_id, agent_id = user, command_id = uuid(),
            })).lease
            accepted(cmd(user, "start_task", journal_id, {
                task_id = task_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token, command_id = uuid(),
            }))
            sync(user, journal_id)
            db_exec("UPDATE chestor_journal_leases SET expires_at = ? WHERE journal_id = ? AND lease_id = ?",
                { os.time() - 10, journal_id, lease.lease_id })

            local snapshot = run_writer(user, journal_id)
            test.eq(tonumber(snapshot.components.leases.reaped), 1)
            test.eq(tonumber(snapshot.components.leases.abandoned), 0)
            test.eq(tonumber(snapshot.components.leases.snapshots), 1)

            sync(user, journal_id)
            local task_row = db_one(
                "SELECT status FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?",
                { journal_id, task_id })
            test.eq(tostring(task_row.status), "in_progress")
            local auto = db_one(
                "SELECT id FROM chestor_journal_events WHERE journal_id = ? AND id = ?",
                { journal_id, "reaper-snapshot:" .. lease.lease_id })
            test.not_nil(auto, "reaper auto-snapshot missing after the writer run")

            -- consumed lease: the next beat has nothing left to reap
            local second = run_writer(user, journal_id)
            test.eq(tonumber(second.components.leases.reaped), 0)
        end)

        test.it("digest SLA violation degrades health once without re-emitting per beat", function()
            local user = "b4-" .. uuid()
            local journal_id = create_journal(user)
            local events = {}
            for index = 1, 25 do
                events[#events + 1] = {
                    type = types.EVENT.ENTRY_APPENDED,
                    body = { event_type = "progress", title = "fact " .. index, body = "work item " .. index },
                }
            end
            accepted(cmd(user, "apply", journal_id, events))
            sync(user, journal_id)

            local snapshot = run_writer(user, journal_id)
            test.is_true(snapshot.components.digest_sla.violated == true)
            test.is_true(tonumber(snapshot.components.digest_sla.lag) >= 25)
            local degraded = read_health(user, journal_id)
            test.eq(tostring(degraded.status), "degraded")
            test.is_true(tostring(degraded.reasons[1]):find("digest SLA", 1, true) ~= nil)
            sync(user, journal_id)
            local first = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND event_type = 'health'",
                { journal_id })
            test.eq(tonumber(first.n), 1)

            -- the violation stays visible on the next beat without another fact
            local second = run_writer(user, journal_id)
            test.is_true(second.components.digest_sla.violated == true)
            sync(user, journal_id)
            local after = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND event_type = 'health'",
                { journal_id })
            test.eq(tonumber(after.n), 1)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

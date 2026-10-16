-- B2 adversarial suite: one test per B0 invariant catalog entry
-- (journal-spec-b0.md D6 entries 1-28 and C9 entries 29-34), each SETUP ->
-- ADVERSARIAL ACTION -> EXPECTED refusal code or state predicate, plus the
-- catalog count assertion. Commands run through app:journal_cmd so the
-- command library executes under a real actor frame; the projection is
-- observed between commands through the framework-owned supervised cursor
-- because guards read the projected model.
local test = require("test")
local sql = require("sql")
local json = require("json")
local funcs = require("funcs")
local crypto = require("crypto")
local security = require("security")
local contract = require("contract")
local time = require("time")
local types = require("types")
local enforcement = require("enforcement")
local queries = require("queries")
local context = require("context")
local projector = require("projector")
local reader = require("reader")
local ops = require("ops")

local THREADS = "kickside.core:threads"
local STATE_PROJECTION = "chestor.journal:state"
local RUNNER = "runner:test"
local REBUILD_BRIDGE = "app:journal_rebuild"

local CATALOG = {
    "I10_1", "I10_2", "I10_3", "I10_4", "I10_5", "I10_6", "I10_7",
    "I9_1", "I9_2", "I9_3", "I9_4",
    "I8_1", "I8_2",
    "I12_1", "I12_2",
    "I1_1", "I1_2",
    "I3_1", "I3_2",
    "I4_1", "I5_1", "I6_1",
    "I7_1", "I7_2", "I7_3",
    "I11_1", "I11_2",
    "IF4_1",
    "C9_29_F6_triggers", "C9_30_I10_6_completeness", "C9_31_I9_4_branches",
    "C9_32_C1_claim", "C9_33_C2_gate_stale", "C9_34_C6_descendants",
}

local covered = {}

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
        title = "B2 adversarial " .. uuid(),
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
    local progress, err = threads(user_id):catch_up_projection({
        thread_id = journal_id,
        kind = STATE_PROJECTION,
        max_ticks = 500,
        deadline = time.now():add(10 * time.SECOND):utc():format(time.RFC3339),
    })
    test.is_nil(err, tostring(err))
    test.not_nil(progress)
    test.is_true(progress.done, "state projection did not reach the thread head")
    test.eq(progress.status, "active")
    test.is_true(progress.last_seq >= progress.event_count)
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

local function refused(result, code, label)
    local at = label and (" [" .. label .. "]") or ""
    test.not_nil(result, "expected a command result" .. at)
    test.is_true(result.refused == true, "expected a refusal" .. at .. ", got " .. json.encode(result))
    test.eq(tostring(result.code), code,
        "expected refusal code " .. code .. at .. ", got " .. json.encode(result))
end

local function accepted(result)
    test.not_nil(result)
    test.is_true(result.refused ~= true and result.success ~= false,
        "expected success, got " .. json.encode(result))
    return result
end

-- Creates a task through the command path (command_id present, no lease).
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

local function open_branch(user, journal_id, task_id, agent_id)
    local out = accepted(cmd(user, "open_branch", journal_id, {
        task_id = task_id, agent_id = agent_id or ("agent-" .. uuid()), command_id = uuid(),
    }))
    test.not_nil(out.lease, "open_branch returned no lease: " .. json.encode(out))
    return out.lease
end

local function start_task(user, journal_id, task_id, lease)
    local out = accepted(cmd(user, "start_task", journal_id, {
        task_id = task_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token, command_id = uuid(),
    }))
    sync(user, journal_id)
    return out
end

-- Runner-recorded receipt; the projection is driven so the receipts row the
-- complete guard reads exists.
local function record_receipt(user, journal_id, task_id, overrides)
    local args = {
        task_id = task_id,
        principal = RUNNER,
        verdict = "pass",
        verifier_type = "test-run",
        verifier_version = "1",
        artifact_hash = "sha256:artifact",
        command_id = uuid(),
    }
    for key, value in pairs(overrides or {}) do args[key] = value end
    local out = accepted(cmd(user, "record_receipt", journal_id, args))
    sync(user, journal_id)
    return tostring(out.receipt_id)
end

local function complete_task(user, journal_id, task_id, lease, receipt_id, extra)
    local args = {
        task_id = task_id,
        lease_id = lease and lease.lease_id or nil,
        fencing_token = lease and lease.fencing_token or nil,
        result = "completed",
        receipt_id = receipt_id,
        command_id = uuid(),
    }
    for key, value in pairs(extra or {}) do args[key] = value end
    return cmd(user, "complete_task", journal_id, args)
end

local function make_done(user, journal_id, task_id)
    local lease = open_branch(user, journal_id, task_id)
    start_task(user, journal_id, task_id, lease)
    local receipt_id = record_receipt(user, journal_id, task_id)
    accepted(complete_task(user, journal_id, task_id, lease, receipt_id))
    sync(user, journal_id)
    return lease, receipt_id
end

local function task_row(journal_id, task_id)
    return db_one("SELECT * FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?", { journal_id, task_id })
end

local function expire_lease(journal_id, lease_id)
    db_exec("UPDATE chestor_journal_leases SET expires_at = ? WHERE journal_id = ? AND lease_id = ?",
        { os.time() - 10, journal_id, lease_id })
end

local function link_tasks(user, journal_id, from_id, to_id)
    accepted(cmd(user, "link_tasks", journal_id, {
        from_task_id = from_id, to_task_id = to_id, kind = "blocks", command_id = uuid(),
    }))
    sync(user, journal_id)
end

-- Raw thread log read; journal read-model probes cannot verify what the
-- durable log itself carries.
local function thread_events(user, journal_id)
    local out, err = threads(user):list_events({ thread_id = journal_id, ascending = true, limit = 1000 })
    test.is_nil(err)
    local events = {}
    for _, raw in ipairs(out.events or {}) do
        local body = raw.body
        if type(body) ~= "table" then
            local text = raw.body_json or body
            if type(text) == "string" and text ~= "" then
                local decoded = json.decode(text)
                body = type(decoded) == "table" and decoded or {}
            else
                body = {}
            end
        end
        events[#events + 1] = { type = raw.type, seq = tonumber(raw.seq), body = body }
    end
    return events
end

local function fold(journal_id, events)
    local component = { set_meta = function() return true, nil end }
    return projector.run({
        thread_id = journal_id,
        projection = { body = {} },
        events = events,
        range = { to_seq = #events },
    }, component)
end

-- F5 canonical read model: tasks (all columns), task_deps live+tombstones,
-- events index (id, seq, task_id, type, payload_sha256), journal_state active
-- pointer. journal_id is excluded so a shadow fold under another id compares.
local function canonical_read_model(journal_id)
    local model = nil
    with_db(function(db)
        local tasks, task_err = ops.query(db, [[
            SELECT id, parent_task_id, title, description, status, priority, assignee, agent_id,
                   sort_order, metadata, result, revision, gate, passed, claim, verifier_policy_hash,
                   folded_outcome, waiver_kind, created_event_id, updated_event_id, closed_event_id,
                   created_at, updated_at, closed_at
              FROM chestor_journal_tasks WHERE journal_id = ? ORDER BY id ASC
        ]], { journal_id })
        test.is_nil(task_err)
        local deps, dep_err = ops.query(db, [[
            SELECT from_task_id, to_task_id, kind, evidence_event_id, created_at,
                   tombstoned, tombstone_decision_id, tombstoned_at
              FROM chestor_journal_task_deps WHERE journal_id = ?
             ORDER BY from_task_id ASC, to_task_id ASC, kind ASC
        ]], { journal_id })
        test.is_nil(dep_err)
        local events, event_err = ops.query(db, [[
            SELECT id, seq, task_id, event_type, payload_sha256
              FROM chestor_journal_events WHERE journal_id = ? ORDER BY seq ASC
        ]], { journal_id })
        test.is_nil(event_err)
        local state, state_err = ops.query(db,
            "SELECT active_task_id FROM chestor_journal_state WHERE journal_id = ?", { journal_id })
        test.is_nil(state_err)
        model = ops.canonical({
            tasks = tasks or {},
            deps = deps or {},
            events = events or {},
            journal_state = { active_task_id = state and state[1] and state[1].active_task_id or nil },
        })
    end)
    return model
end

local function it_inv(invariant, name, fn)
    covered[invariant] = true
    test.it(invariant .. " " .. name, fn)
end

local function define_tests()
    test.describe("Journal B2 adversarial catalog", function()

        it_inv("I10_1", "write with expired lease refused lease_expired", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            local lease = open_branch(user, journal_id, task_id)
            expire_lease(journal_id, lease.lease_id)
            refused(cmd(user, "start_task", journal_id, {
                task_id = task_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token, command_id = uuid(),
            }), "lease_expired")
        end)

        it_inv("I10_2", "complete without receipt refused receipt_missing; no done row without evidence", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "it works", verifier_policy_hash = "policy-1" })
            local lease = open_branch(user, journal_id, task_id)
            start_task(user, journal_id, task_id, lease)
            refused(complete_task(user, journal_id, task_id, lease, nil), "receipt_missing")
            -- Born-done through the command path is equally unrepresentable.
            refused(cmd(user, "upsert_task", journal_id, {
                id = "born-done-" .. uuid(), title = "born done", status = "done", command_id = uuid(),
            }), "invalid_transition")
            sync(user, journal_id)
            local row = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_tasks WHERE journal_id = ? AND id = ? AND lower(status) = 'done'",
                { journal_id, task_id })
            test.eq(tonumber(row.n), 0)
        end)

        it_inv("I10_3", "start behind unpassed gate by direct id refused behind_gate", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            -- WRITE lease granted while startable; the gate lands afterwards,
            -- so the refusal is the gate guard itself, not lease capability.
            local lease = open_branch(user, journal_id, task_id)
            local gate_id = make_task(user, journal_id, { gate = true, verifier_policy_hash = "gate-policy" })
            link_tasks(user, journal_id, gate_id, task_id)
            refused(cmd(user, "start_task", journal_id, {
                task_id = task_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token, command_id = uuid(),
            }), "behind_gate")
        end)

        it_inv("I10_4", "reopen(done) marks all its receipts stale", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "shippable", verifier_policy_hash = "policy-1" })
            make_done(user, journal_id, task_id)
            test.eq(tostring(task_row(journal_id, task_id).status), "done")
            accepted(cmd(user, "reopen_task", journal_id, {
                task_id = task_id, decision_id = "dec-" .. uuid(), command_id = uuid(),
            }))
            sync(user, journal_id)
            test.eq(tostring(task_row(journal_id, task_id).status), "open")
            local stale = db_one([[
                SELECT COUNT(*) AS n, SUM(CASE WHEN stale = 1 THEN 1 ELSE 0 END) AS stale_n
                  FROM chestor_journal_receipts WHERE journal_id = ? AND task_id = ?
            ]], { journal_id, task_id })
            test.is_true(tonumber(stale.n) > 0)
            test.eq(tonumber(stale.n), tonumber(stale.stale_n))
        end)

        it_inv("I10_5", "folded task leaves Frontier and open counts, stays a lens tombstone", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local parent_id = make_task(user, journal_id, {})
            local child_id = make_task(user, journal_id, {
                parent_task_id = parent_id, metadata = { experiment = true },
            })
            local lease = open_branch(user, journal_id, child_id)
            start_task(user, journal_id, child_id, lease)
            accepted(cmd(user, "fold_task", journal_id, {
                task_id = child_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token,
                outcome = "adopted", distilled = "distilled learning", command_id = uuid(),
            }))
            sync(user, journal_id)
            with_db(function(db)
                local frontier, frontier_err = queries.frontier_scan(db, journal_id, {})
                test.is_nil(frontier_err)
                for _, entry in ipairs(frontier.actionable) do
                    test.is_false(entry.task_id == child_id, "folded task appeared in Frontier")
                end
                test.eq(frontier.excluded.folded, 1)
                local stats, stats_err = reader.stats(db, journal_id)
                test.is_nil(stats_err)
                test.eq(stats.open_task_count, 1)
                local counts, counts_err = reader.task_counts(db, journal_id, parent_id)
                test.is_nil(counts_err)
                test.eq(counts.children, 1)
                test.eq(counts.open_children, 0)
                local children, children_err = reader.task_children(db, journal_id, parent_id, 10)
                test.is_nil(children_err)
                test.eq(#children, 1)
                test.eq(tostring(children[1].status), "folded")
                test.eq(tostring(children[1].folded_outcome), "adopted")
            end)
        end)

        it_inv("I10_6", "duplicate command_id replays the stored result and appends no second event", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            local lease = open_branch(user, journal_id, task_id)
            local command_id = uuid()
            local args = {
                task_id = task_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token, command_id = command_id,
            }
            accepted(cmd(user, "start_task", journal_id, args))
            local replayed = cmd(user, "start_task", journal_id, args)
            test.is_true(replayed.duplicate == true, "expected replay marker: " .. json.encode(replayed))
            sync(user, journal_id)
            local row = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND id = ?",
                { journal_id, command_id })
            test.eq(tonumber(row.n), 1)
            local transitions = 0
            for _, event in ipairs(thread_events(user, journal_id)) do
                if event.type == types.EVENT.TASK_TRANSITIONED and event.body.task_id == task_id then
                    transitions = transitions + 1
                end
            end
            test.eq(transitions, 1)
        end)

        it_inv("I10_7", "replaying the event log reproduces the canonical read model byte-equal", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local a = make_task(user, journal_id, { claim = "a done", verifier_policy_hash = "policy-a" })
            local b = make_task(user, journal_id, {})
            link_tasks(user, journal_id, a, b)
            make_done(user, journal_id, a)
            accepted(cmd(user, "focus_task", journal_id, { task_id = b }))
            sync(user, journal_id)
            local lease_b = open_branch(user, journal_id, b)
            start_task(user, journal_id, b, lease_b)
            accepted(cmd(user, "append_entry", journal_id, {
                event_type = "progress", title = "worked on b", body = "b progress", task_id = b, tags = { "work" },
            }))
            accepted(cmd(user, "unlink_tasks", journal_id, {
                from_task_id = a, to_task_id = b, decision_id = "dec-replay", command_id = uuid(),
            }))
            sync(user, journal_id)
            local experiment = make_task(user, journal_id, {
                parent_task_id = b, metadata = { experiment = true },
            })
            local lease_e = open_branch(user, journal_id, experiment)
            start_task(user, journal_id, experiment, lease_e)
            accepted(cmd(user, "fold_task", journal_id, {
                task_id = experiment, lease_id = lease_e.lease_id, fencing_token = lease_e.fencing_token,
                outcome = "abandoned", distilled = "dead end", command_id = uuid(),
            }))
            sync(user, journal_id)

            -- payload_sha256 must be materialized, or a corrupted payload
            -- could never fail equality (F5).
            local unhashed = db_one([[
                SELECT COUNT(*) AS n FROM chestor_journal_events
                 WHERE journal_id = ? AND (payload_sha256 IS NULL OR payload_sha256 = '')
            ]], { journal_id })
            test.eq(tonumber(unhashed.n), 0)
            local live = canonical_read_model(journal_id)
            local replay_id = journal_id .. ":replay"
            local out, fold_err = fold(replay_id, thread_events(user, journal_id))
            test.is_nil(fold_err)
            test.not_nil(out)
            local replayed = canonical_read_model(replay_id)
            test.eq(replayed, live)
        end)

        it_inv("I9_1", "planning-capability start attempt refused capability", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local blocker = make_task(user, journal_id, {})
            local task_id = make_task(user, journal_id, {})
            link_tasks(user, journal_id, blocker, task_id)
            local lease = open_branch(user, journal_id, task_id)
            test.eq(tostring(lease.capability), "PLANNING")
            refused(cmd(user, "start_task", journal_id, {
                task_id = task_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token, command_id = uuid(),
            }), "capability")
        end)

        test.it("planning capability can perform the governed reopen and then reacquire WRITE", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            local lease = open_branch(user, journal_id, task_id, "agent-recovery")
            start_task(user, journal_id, task_id, lease)
            accepted(cmd(user, "abandon_task", journal_id, {
                task_id = task_id,
                lease_id = lease.lease_id,
                fencing_token = lease.fencing_token,
                command_id = uuid(),
            }))
            sync(user, journal_id)

            local planning = open_branch(user, journal_id, task_id, "agent-recovery")
            test.eq(tostring(planning.capability), "PLANNING")
            test.eq(tostring(planning.next.verb), "reopen")
            accepted(cmd(user, "reopen_task", journal_id, {
                task_id = task_id,
                lease_id = planning.lease_id,
                fencing_token = planning.fencing_token,
                decision_id = uuid(),
                command_id = uuid(),
            }))
            sync(user, journal_id)

            local writable = open_branch(user, journal_id, task_id, "agent-recovery")
            test.eq(tostring(writable.capability), "WRITE")
            test.eq(tostring(writable.state), "start")
        end)

        it_inv("I9_2", "second mutation lease on a leased task refused leased", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            open_branch(user, journal_id, task_id, "agent-alice")
            local second = cmd(user, "open_branch", journal_id, {
                task_id = task_id, agent_id = "agent-bob", command_id = uuid(),
            })
            refused(second, "leased")
            test.eq(tostring(second.holder), "agent-alice")
        end)

        it_inv("I9_3", "lease-less task writes retain their documented ungated path", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            accepted(cmd(user, "start_task", journal_id, { task_id = task_id, command_id = uuid() }))
        end)

        it_inv("I9_4", "expired lease releases authority, snapshots recovery, and leaves work resumable", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {})
            local lease = open_branch(user, journal_id, task_id)
            start_task(user, journal_id, task_id, lease)
            expire_lease(journal_id, lease.lease_id)
            local out = accepted(cmd(user, "reap_expired", journal_id, {}))
            test.eq(#out.reaped, 1)
            test.is_true(out.reaped[1].released)
            test.is_false(out.reaped[1].abandoned)
            test.is_true(out.reaped[1].resumable)
            test.is_true(out.reaped[1].snapshot)
            sync(user, journal_id)
            test.eq(tostring(task_row(journal_id, task_id).status), "in_progress")
            local snapshot = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND id = ?",
                { journal_id, "reaper-snapshot:" .. lease.lease_id })
            test.eq(tonumber(snapshot.n), 1)
            local resumed = open_branch(user, journal_id, task_id)
            test.eq(tostring(resumed.capability), "WRITE")
            test.eq(tostring(resumed.state), "resume")
        end)

        it_inv("I8_1", "receipt rebind attempt refused append_only", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "bind once", verifier_policy_hash = "policy-1" })
            local receipt_id = record_receipt(user, journal_id, task_id)
            refused(cmd(user, "record_receipt", journal_id, {
                task_id = task_id, receipt_id = receipt_id, principal = RUNNER, verdict = "fail",
                artifact_hash = "sha256:forged", command_id = uuid(),
            }), "append_only")
            sync(user, journal_id)
            local row = db_one(
                "SELECT artifact_hash, verdict FROM chestor_journal_receipts WHERE journal_id = ? AND receipt_id = ?",
                { journal_id, receipt_id })
            test.eq(tostring(row.artifact_hash), "sha256:artifact")
            test.eq(tostring(row.verdict), "pass")
        end)

        it_inv("I8_2", "work fact after the receipt makes complete refuse receipt_stale", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "fresh only", verifier_policy_hash = "policy-1" })
            local lease = open_branch(user, journal_id, task_id)
            start_task(user, journal_id, task_id, lease)
            local receipt_id = record_receipt(user, journal_id, task_id)
            accepted(cmd(user, "append_entry", journal_id, {
                event_type = "progress", title = "more work", body = "changed after verification",
                task_id = task_id, tags = { "work" },
            }))
            sync(user, journal_id)
            refused(complete_task(user, journal_id, task_id, lease, receipt_id), "receipt_stale")
        end)

        it_inv("I12_1", "Core catch-up materializes every declared journal event", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_a = make_task(user, journal_id, {})
            local task_b = make_task(user, journal_id, {})
            link_tasks(user, journal_id, task_a, task_b)
            accepted(cmd(user, "append_entry", journal_id, {
                event_type = "note", title = "note", body = "text", task_id = task_b,
            }))
            sync(user, journal_id)

            -- An installation updated from an older declaration can retain a
            -- filter that omits a later Journal event. The next ensure=true
            -- registration must refresh this stored declaration in place.
            local projection = db_one(
                "SELECT id, body FROM kickside_projection WHERE thread_id = ? AND kind = ?",
                { journal_id, STATE_PROJECTION })
            test.not_nil(projection, "journal thread has no state projection row")
            local cursor = db_one(
                "SELECT id FROM kickside_projection_cursor WHERE projection_id = ? AND cursor_key = 'state'",
                { projection.id })
            test.not_nil(cursor, "journal state projection has no cursor")
            local declared_body_json = tostring(projection.body)
            local body, decode_err = json.decode(tostring(projection.body))
            test.is_nil(decode_err)
            local stripped = {}
            for _, shape in ipairs((body :: any).events.input or {}) do
                if tostring((shape :: any).type) ~= types.EVENT.TASK_LINKED then stripped[#stripped + 1] = shape end
            end
            (body :: any).events.input = stripped
            db_exec("UPDATE kickside_projection SET body = ? WHERE id = ?",
                { json.encode(body), projection.id })

            local declaration, declaration_err = json.decode(declared_body_json)
            test.is_nil(declaration_err)
            local meta = (declaration :: any).meta or {}
            local ensured, ensure_err = threads(user):register_projection({
                thread_id = journal_id,
                kind = STATE_PROJECTION,
                projection_key = "state",
                cursor_key = "state",
                worker_ref = meta.worker_ref,
                worker_input_mode = meta.worker_input_mode,
                worker_config = (declaration :: any).worker_config,
                events = (declaration :: any).events,
                ensure = true,
            })
            test.is_nil(ensure_err)
            test.not_nil(ensured)
            test.eq(tostring((ensured :: any).projection_id), tostring(projection.id))

            local task_c = make_task(user, journal_id, {})
            accepted(cmd(user, "link_tasks", journal_id, {
                from_task_id = task_c, to_task_id = task_b, kind = "blocks", command_id = uuid(),
            }))
            sync(user, journal_id)
            local delivered = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_task_deps WHERE journal_id = ? AND tombstoned = 0",
                { journal_id })
            test.eq(tonumber(delivered.n), 2, "Core catch-up must deliver both task links")
            local refreshed = db_one("SELECT id, body FROM kickside_projection WHERE id = ?", { projection.id })
            test.not_nil(refreshed)
            test.eq(tostring(refreshed.id), tostring(projection.id))
            local refreshed_cursor = db_one(
                "SELECT id FROM kickside_projection_cursor WHERE projection_id = ? AND cursor_key = 'state'",
                { projection.id })
            test.not_nil(refreshed_cursor)
            test.eq(tostring(refreshed_cursor.id), tostring(cursor.id))
            local carries_linked = false
            for _, shape in ipairs((json.decode(tostring(refreshed.body)) :: any).events.input or {}) do
                if tostring((shape :: any).type) == types.EVENT.TASK_LINKED then carries_linked = true end
            end
            test.is_true(carries_linked, "ensure=true must refresh the persisted event filter")
            local reached = canonical_read_model(journal_id)
            local reset, reset_err = executor(user):call(REBUILD_BRIDGE, { op = "reset", journal_id = journal_id })
            test.is_nil(reset_err)
            test.is_true((reset :: any).success == true, tostring((reset :: any).error))
            sync(user, journal_id)
            test.eq(canonical_read_model(journal_id), reached,
                "Core reset/catch-up must restore the reached Journal read model")
            local fresh_id = uuid()
            test.is_nil(select(2, fold(fresh_id, thread_events(user, journal_id))))
            test.eq(canonical_read_model(journal_id), canonical_read_model(fresh_id),
                "Core catch-up must equal a direct fold of the durable event log")
        end)

        it_inv("I12_2", "legacy projection-input stamps do not affect journal health", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            make_task(user, journal_id, {})
            db_exec([[INSERT INTO chestor_journal_state (journal_id, projection_input_hash, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(journal_id) DO UPDATE SET projection_input_hash = excluded.projection_input_hash]],
                { journal_id, "legacy-module-hash", time.now():unix() })
            local wrote, write_err = executor(user):call("chestor.journal.health:writer", { journal_id = journal_id })
            test.is_nil(write_err)
            accepted(wrote)
            local read, read_err = executor(user):call("app:journal_read", { view = "health", journal_id = journal_id })
            test.is_nil(read_err)
            local health = accepted(read).value
            test.eq(tostring((health :: any).status), "ok")
            test.is_nil(((health :: any).components or {}).drift,
                "Journal health must not carry a retired drift detector")
            local state = db_one(
                "SELECT projection_input_hash FROM chestor_journal_state WHERE journal_id = ?", { journal_id })
            test.eq(tostring(state.projection_input_hash), "legacy-module-hash")
        end)

        it_inv("I1_1", "agent-authored verdict fact refused author_not_runner on every door", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "verified", verifier_policy_hash = "policy-1" })
            refused(cmd(user, "record_receipt", journal_id, {
                task_id = task_id, principal = "agent-bob", verdict = "pass",
                artifact_hash = "sha256:x", command_id = uuid(),
            }), "author_not_runner")
            -- The generic event door refuses the same forgery.
            local forged = cmd(user, "apply", journal_id, { {
                type = types.EVENT.VERIFICATION_RECEIPT,
                body = { receipt_id = uuid(), task_id = task_id, verdict = "pass", author = "agent-bob" },
            } })
            test.is_true(forged.success == false, json.encode(forged))
            test.is_true(tostring(forged.error):find("runner", 1, true) ~= nil)
            -- Forged transitions are refused at the same door.
            local forged_transition = cmd(user, "apply", journal_id, { {
                type = types.EVENT.TASK_TRANSITIONED,
                body = { task_id = task_id, verb = "complete", from_status = "open", to_status = "done" },
            } })
            test.is_true(forged_transition.success == false)
        end)

        it_inv("I1_2", "receipt with mismatched policy hash is invalid per D2", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "policy pinned", verifier_policy_hash = "policy-A" })
            local lease = open_branch(user, journal_id, task_id)
            start_task(user, journal_id, task_id, lease)
            local receipt_id = record_receipt(user, journal_id, task_id, { policy_hash = "policy-B" })
            with_db(function(db)
                local receipt = select(1, enforcement.receipt(db, journal_id, receipt_id))
                local task = select(1, enforcement.task(db, journal_id, task_id))
                local predicates, predicate_err = enforcement.receipt_predicates(db, journal_id, receipt, task)
                test.is_nil(predicate_err)
                test.is_false(predicates.valid)
                test.is_false(predicates.checks.policy_match)
            end)
            refused(complete_task(user, journal_id, task_id, lease, receipt_id), "receipt_invalid")
        end)

        it_inv("I3_1", "complete with schema-invalid output refused contract", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {
                claim = "typed output", verifier_policy_hash = "policy-1",
                metadata = { contract = { output_schema = {
                    type = "object", required = { "ok" }, properties = { ok = { type = "boolean" } },
                } } },
            })
            local lease = open_branch(user, journal_id, task_id)
            start_task(user, journal_id, task_id, lease)
            local receipt_id = record_receipt(user, journal_id, task_id)
            refused(complete_task(user, journal_id, task_id, lease, receipt_id, {
                result = '{"ok":"yes"}',
            }), "contract")
        end)

        it_inv("I3_2", "high-impact task with validator == executor refused independence", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, {
                priority = "P1", claim = "high impact", verifier_policy_hash = "policy-1",
            })
            local lease = open_branch(user, journal_id, task_id, "runner:mallory")
            start_task(user, journal_id, task_id, lease)
            local receipt_id = record_receipt(user, journal_id, task_id, { principal = "runner:mallory" })
            refused(complete_task(user, journal_id, task_id, lease, receipt_id), "independence")
        end)

        it_inv("I4_1", "listed transition without decision_id refused decide_required", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "audited", verifier_policy_hash = "policy-1" })
            make_done(user, journal_id, task_id)
            refused(cmd(user, "reopen_task", journal_id, { task_id = task_id, command_id = uuid() }),
                "decide_required")
        end)

        it_inv("I5_1", "write through a stale pointer refused via fencing", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_x = make_task(user, journal_id, {})
            local task_y = make_task(user, journal_id, {})
            local lease_y = open_branch(user, journal_id, task_y)
            refused(cmd(user, "start_task", journal_id, {
                task_id = task_x, lease_id = lease_y.lease_id, fencing_token = lease_y.fencing_token, command_id = uuid(),
            }), "fencing_stale")
        end)

        it_inv("I6_1", "dead heartbeat writer reads as unknown within two intervals", function()
            local ok = context.heartbeat_status(1000, 60, 1060)
            test.eq(tostring(ok.status), "ok")
            local unknown = context.heartbeat_status(1000, 60, 1120)
            test.eq(tostring(unknown.status), "unknown")
            test.eq(unknown.since, 1000)
            local never = context.heartbeat_status(nil, 60, 5000)
            test.eq(tostring(never.status), "unknown")
        end)

        it_inv("I7_1", "digest source_seq regression refused monotonic", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            accepted(cmd(user, "append_entry", journal_id, { event_type = "note", title = "seed", body = "seed" }))
            accepted(cmd(user, "append_entry", journal_id, { event_type = "note", title = "seed2", body = "seed2" }))
            sync(user, journal_id)
            accepted(cmd(user, "update_digest", journal_id, {
                digest = "digest v1", source_seq = 2, command_id = uuid(),
            }))
            sync(user, journal_id)
            refused(cmd(user, "update_digest", journal_id, {
                digest = "digest v0", source_seq = 1, command_id = uuid(),
            }), "monotonic")
        end)

        it_inv("I7_2", "digest claiming an unfolded seq refused provenance", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            accepted(cmd(user, "append_entry", journal_id, { event_type = "note", title = "seed", body = "seed" }))
            sync(user, journal_id)
            refused(cmd(user, "update_digest", journal_id, {
                digest = "premature", source_seq = 999, command_id = uuid(),
            }), "provenance")
        end)

        it_inv("I7_3", "25 facts with no digest emit a health event", function()
            local user = "b2-" .. uuid()
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
            local out = accepted(cmd(user, "digest_sla_check", journal_id, {}))
            test.is_true(out.violated)
            test.is_true(out.lag >= 25)
            sync(user, journal_id)
            local row = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND event_type = 'health'",
                { journal_id })
            test.eq(tonumber(row.n), 1)
        end)

        it_inv("I11_1", "dependency insert closing a cycle refused cycle", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local a = make_task(user, journal_id, {})
            local b = make_task(user, journal_id, {})
            local c = make_task(user, journal_id, {})
            link_tasks(user, journal_id, a, b)
            link_tasks(user, journal_id, b, c)
            refused(cmd(user, "link_tasks", journal_id, {
                from_task_id = c, to_task_id = a, kind = "blocks", command_id = uuid(),
            }), "cycle")
        end)

        it_inv("I11_2", "dependency removal without decision refused; with decision it tombstones", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local a = make_task(user, journal_id, {})
            local b = make_task(user, journal_id, {})
            link_tasks(user, journal_id, a, b)
            refused(cmd(user, "unlink_tasks", journal_id, {
                from_task_id = a, to_task_id = b, command_id = uuid(),
            }), "decide_required")
            accepted(cmd(user, "unlink_tasks", journal_id, {
                from_task_id = a, to_task_id = b, decision_id = "dec-remove", command_id = uuid(),
            }))
            sync(user, journal_id)
            local row = db_one([[
                SELECT tombstoned, tombstone_decision_id FROM chestor_journal_task_deps
                 WHERE journal_id = ? AND from_task_id = ? AND to_task_id = ?
            ]], { journal_id, a, b })
            test.eq(tonumber(row.tombstoned), 1)
            test.eq(tostring(row.tombstone_decision_id), "dec-remove")
            local unlink_events = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND event_type = 'task.unlinked'",
                { journal_id })
            test.eq(tonumber(unlink_events.n), 1)
        end)

        it_inv("IF4_1", "folded child stays enumerable under its parent as a tombstone", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local parent_id = make_task(user, journal_id, {})
            local child_id = make_task(user, journal_id, {
                parent_task_id = parent_id, metadata = { experiment = true },
            })
            local lease = open_branch(user, journal_id, child_id)
            start_task(user, journal_id, child_id, lease)
            accepted(cmd(user, "fold_task", journal_id, {
                task_id = child_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token,
                outcome = "adopted", distilled = "keep approach A", command_id = uuid(),
            }))
            sync(user, journal_id)
            with_db(function(db)
                local children, children_err = reader.task_children(db, journal_id, parent_id, 10)
                test.is_nil(children_err)
                test.eq(#children, 1)
                test.eq(tostring(children[1].id), child_id)
                test.eq(tostring(children[1].status), "folded")
                test.eq(tostring(children[1].folded_outcome), "adopted")
                test.eq(tostring(children[1].result), "keep approach A")
            end)
        end)

        it_inv("C9_29_F6_triggers", "every F6 trigger row without decision_id refused", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)

            -- (1) T6 reopen(abandoned)
            local abandoned = make_task(user, journal_id, {})
            local lease_a = open_branch(user, journal_id, abandoned)
            start_task(user, journal_id, abandoned, lease_a)
            accepted(cmd(user, "abandon_task", journal_id, {
                task_id = abandoned, lease_id = lease_a.lease_id, fencing_token = lease_a.fencing_token, command_id = uuid(),
            }))
            sync(user, journal_id)
            refused(cmd(user, "reopen_task", journal_id, { task_id = abandoned, command_id = uuid() }), "decide_required")

            -- (2) T7 reopen(done)
            local done = make_task(user, journal_id, { claim = "done claim", verifier_policy_hash = "policy-1" })
            make_done(user, journal_id, done)
            refused(cmd(user, "reopen_task", journal_id, { task_id = done, command_id = uuid() }), "decide_required")

            -- (3) T9 cancel over children
            local parent_id = make_task(user, journal_id, {})
            local child_id = make_task(user, journal_id, {
                parent_task_id = parent_id, claim = "child claim", verifier_policy_hash = "policy-1",
            })
            make_done(user, journal_id, child_id)
            refused(cmd(user, "cancel_task", journal_id, { task_id = parent_id, command_id = uuid() }), "decide_required")

            -- (4) T12 waive
            local waived = make_task(user, journal_id, {})
            local lease_w = open_branch(user, journal_id, waived)
            start_task(user, journal_id, waived, lease_w)
            refused(complete_task(user, journal_id, waived, lease_w, nil, {
                waiver = { kind = "waived" },
            }), "decide_required")

            -- (5) gate policy change
            local gate_id = make_task(user, journal_id, { gate = true, verifier_policy_hash = "gate-policy-a" })
            refused(cmd(user, "upsert_task", journal_id, {
                id = gate_id, title = gate_id, verifier_policy_hash = "gate-policy-b", command_id = uuid(),
            }), "decide_required", "gate policy change")

            -- (6) breaking contract change
            local contracted = make_task(user, journal_id, {
                metadata = { contract = { output_schema = { type = "object" } } },
            })
            refused(cmd(user, "upsert_task", journal_id, {
                id = contracted, title = contracted,
                metadata = { contract = { output_schema = { type = "string" } } }, command_id = uuid(),
            }), "decide_required", "contract change")

            -- (7) dependency removal
            local from_id = make_task(user, journal_id, {})
            local to_id = make_task(user, journal_id, {})
            link_tasks(user, journal_id, from_id, to_id)
            refused(cmd(user, "unlink_tasks", journal_id, {
                from_task_id = from_id, to_task_id = to_id, command_id = uuid(),
            }), "decide_required")

            -- (8) T4 unblock with uncleared condition
            local blocked = make_task(user, journal_id, {})
            local lease_b = open_branch(user, journal_id, blocked)
            start_task(user, journal_id, blocked, lease_b)
            accepted(cmd(user, "block_task", journal_id, {
                task_id = blocked, lease_id = lease_b.lease_id, fencing_token = lease_b.fencing_token,
                reason = "waiting on upstream", command_id = uuid(),
            }))
            sync(user, journal_id)
            local blocker = make_task(user, journal_id, {})
            link_tasks(user, journal_id, blocker, blocked)
            refused(cmd(user, "unblock_task", journal_id, {
                task_id = blocked, lease_id = lease_b.lease_id, fencing_token = lease_b.fencing_token, command_id = uuid(),
            }), "decide_required")
        end)

        it_inv("C9_30_I10_6_completeness", "transition events carry full command identity; a rolled-back fold leaves nothing", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "identity", verifier_policy_hash = "policy-1" })
            local lease = open_branch(user, journal_id, task_id)
            start_task(user, journal_id, task_id, lease)
            local receipt_id = record_receipt(user, journal_id, task_id)
            accepted(complete_task(user, journal_id, task_id, lease, receipt_id, { expected_revision = 1 }))
            local complete_event = nil
            for _, event in ipairs(thread_events(user, journal_id)) do
                if event.type == types.EVENT.TASK_TRANSITIONED and event.body.verb == "complete" then
                    complete_event = event.body
                end
            end
            test.not_nil(complete_event)
            test.is_true(tostring(complete_event.command_id) ~= "")
            test.eq(tostring(complete_event.lease_id), tostring(lease.lease_id))
            test.eq(tonumber(complete_event.expected_revision), 1)
            test.eq(type(complete_event.guard), "table")
            test.is_true(complete_event.guard.receipt_valid)
            test.is_true(complete_event.guard.receipt_fresh)

            -- One command = one transaction: writes folded through a rolled
            -- back transaction leave no partial read model.
            local rollback_id = "b2-rollback-" .. uuid()
            with_db(function(db)
                local tx, begin_err = db:begin()
                test.is_nil(begin_err)
                local project_err = projector.project_events(tx, rollback_id, {
                    { type = types.EVENT.TASK_UPSERTED, seq = 1, body = { event_id = "r1", id = "rt1", task_id = "rt1", title = "partial", status = "open", ts = 1000 } },
                })
                test.is_nil(project_err)
                tx:rollback()
            end)
            local row = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_tasks WHERE journal_id = ?", { rollback_id })
            test.eq(tonumber(row.n), 0)
            local events_row = db_one(
                "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ?", { rollback_id })
            test.eq(tonumber(events_row.n), 0)
        end)

        it_inv("C9_31_I9_4_branches", "reaper snapshots only uncovered work and leaves both branches resumable", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)

            local bare = make_task(user, journal_id, {})
            local lease_bare = open_branch(user, journal_id, bare)
            start_task(user, journal_id, bare, lease_bare)

            local covered_task = make_task(user, journal_id, {})
            local lease_covered = open_branch(user, journal_id, covered_task)
            start_task(user, journal_id, covered_task, lease_covered)
            accepted(cmd(user, "create_checkpoint", journal_id, {
                task_id = covered_task, title = "agent checkpoint", body = "state saved by the agent",
            }))
            sync(user, journal_id)

            expire_lease(journal_id, lease_bare.lease_id)
            expire_lease(journal_id, lease_covered.lease_id)
            local out = accepted(cmd(user, "reap_expired", journal_id, {}))
            sync(user, journal_id)
            test.eq(#out.reaped, 2)
            local by_task = {}
            for _, entry in ipairs(out.reaped) do by_task[tostring(entry.task_id)] = entry end
            test.is_false(by_task[bare].abandoned)
            test.is_true(by_task[bare].resumable)
            test.is_true(by_task[bare].snapshot)
            test.is_false(by_task[covered_task].abandoned)
            test.is_true(by_task[covered_task].resumable)
            test.is_false(by_task[covered_task].snapshot)
            test.eq(tostring(task_row(journal_id, bare).status), "in_progress")
            test.eq(tostring(task_row(journal_id, covered_task).status), "in_progress")
            test.eq(tostring(open_branch(user, journal_id, bare).capability), "WRITE")
            test.eq(tostring(open_branch(user, journal_id, covered_task).capability), "WRITE")
        end)

        it_inv("C9_32_C1_claim", "receipt bound to a different claim refused claim_mismatch", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, { claim = "the real claim", verifier_policy_hash = "policy-1" })
            local lease = open_branch(user, journal_id, task_id)
            start_task(user, journal_id, task_id, lease)
            local receipt_id = record_receipt(user, journal_id, task_id, {
                claim_hash = enforcement.hash_claim("some other claim"),
            })
            refused(complete_task(user, journal_id, task_id, lease, receipt_id), "claim_mismatch")
        end)

        it_inv("C9_33_C2_gate_stale", "stale receipt cannot pass a gate", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)
            local gate_id = make_task(user, journal_id, {
                gate = true, claim = "gate holds", verifier_policy_hash = "gate-policy",
            })
            local receipt_id = record_receipt(user, journal_id, gate_id)
            accepted(cmd(user, "append_entry", journal_id, {
                event_type = "progress", title = "post-receipt work", body = "supersedes the receipt",
                task_id = gate_id, tags = { "work" },
            }))
            sync(user, journal_id)
            refused(cmd(user, "gate_pass", journal_id, {
                task_id = gate_id, principal = RUNNER, receipt_id = receipt_id, command_id = uuid(),
            }), "receipt_stale")
        end)

        it_inv("C9_34_C6_descendants", "complete, cancel, and fold refuse over non-terminal descendants", function()
            local user = "b2-" .. uuid()
            local journal_id = create_journal(user)

            local parent_c = make_task(user, journal_id, {})
            local lease_c = open_branch(user, journal_id, parent_c)
            start_task(user, journal_id, parent_c, lease_c)
            local child_c = make_task(user, journal_id, { parent_task_id = parent_c })
            local child_lease = open_branch(user, journal_id, child_c)
            start_task(user, journal_id, child_c, child_lease)
            refused(complete_task(user, journal_id, parent_c, lease_c, nil), "descendants")

            local parent_x = make_task(user, journal_id, {})
            local child_x = make_task(user, journal_id, { parent_task_id = parent_x })
            local child_x_lease = open_branch(user, journal_id, child_x)
            start_task(user, journal_id, child_x, child_x_lease)
            refused(cmd(user, "cancel_task", journal_id, {
                task_id = parent_x, decision_id = "dec-cancel", command_id = uuid(),
            }), "descendants")

            local parent_f = make_task(user, journal_id, { metadata = { experiment = true } })
            local lease_f = open_branch(user, journal_id, parent_f)
            start_task(user, journal_id, parent_f, lease_f)
            local child_f = make_task(user, journal_id, { parent_task_id = parent_f })
            local child_f_lease = open_branch(user, journal_id, child_f)
            start_task(user, journal_id, child_f, child_f_lease)
            refused(cmd(user, "fold_task", journal_id, {
                task_id = parent_f, lease_id = lease_f.lease_id, fencing_token = lease_f.fencing_token,
                outcome = "adopted", distilled = "learning", command_id = uuid(),
            }), "descendants")
        end)

        test.it("catalog count: every invariant has exactly its adversarial test, 34 total", function()
            test.eq(#CATALOG, 34)
            local seen = {}
            for _, invariant in ipairs(CATALOG) do
                test.is_true(covered[invariant] == true, "invariant without a test: " .. invariant)
                test.is_true(seen[invariant] == nil, "duplicate catalog entry: " .. invariant)
                seen[invariant] = true
            end
            local extra = 0
            for _ in pairs(covered) do extra = extra + 1 end
            test.eq(extra, 34)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

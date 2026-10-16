-- B3 read models: the D1 visibility lens (field-for-field against the wire
-- schema, including folded tombstone children, cross-subtree exceptions, and
-- stale receipt status), the categorized Frontier with drillable exclusions,
-- the scoped change feed with its cursor, and per-branch digest triggers with
-- the I7 monotonic/provenance guards. Commands run through app:journal_cmd,
-- reads through the ReadJournal tool, both actor-framed.
local test = require("test")
local sql = require("sql")
local json = require("json")
local funcs = require("funcs")
local crypto = require("crypto")
local security = require("security")
local contract = require("contract")
local time = require("time")
local types = require("types")
local branch_digests = require("branch_digests")
local ops = require("ops")

local THREADS = "kickside.core:threads"
local STATE_PROJECTION = "chestor.journal:state"
local READ_TOOL = "chestor.journal.traits:read_journal"
local RUNNER = "runner:test"

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
        title = "B3 read models " .. uuid(),
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

local function read_view(user_id, input)
    local out, err = executor(user_id):call(READ_TOOL, input)
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

local function fold_experiment(user, journal_id, task_id, outcome)
    local lease = open_branch(user, journal_id, task_id)
    start_task(user, journal_id, task_id, lease)
    accepted(cmd(user, "fold_task", journal_id, {
        task_id = task_id, lease_id = lease.lease_id, fencing_token = lease.fencing_token,
        outcome = outcome, distilled = "distilled " .. outcome, command_id = uuid(),
    }))
    sync(user, journal_id)
end

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

local function append_fact(user, journal_id, task_id, title, tags)
    accepted(cmd(user, "append_entry", journal_id, {
        event_type = "progress", title = title, body = title, task_id = task_id, tags = tags,
    }))
end

local function link_tasks(user, journal_id, from_id, to_id)
    accepted(cmd(user, "link_tasks", journal_id, {
        from_task_id = from_id, to_task_id = to_id, kind = "blocks", command_id = uuid(),
    }))
    sync(user, journal_id)
end

local function expire_lease(journal_id, lease_id)
    db_exec("UPDATE chestor_journal_leases SET expires_at = ? WHERE journal_id = ? AND lease_id = ?",
        { os.time() - 10, journal_id, lease_id })
end

local function find_child(children, task_id)
    for _, child in ipairs(children or {}) do
        if tostring(child.id) == task_id then return child end
    end
    return nil
end

local function define_tests()
    test.describe("Journal B3 read models", function()

        test.it("lens carries every D1 field on a real branch scenario", function()
            local user = "b3-" .. uuid()
            local journal_id = create_journal(user)
            local parent = make_task(user, journal_id, { claim = "parent claim", verifier_policy_hash = "policy-p" })
            local child_a = make_task(user, journal_id, { parent_task_id = parent, sort_order = 1 })
            local child_a1 = make_task(user, journal_id, { parent_task_id = child_a, sort_order = 5 })
            local experiment = make_task(user, journal_id, {
                parent_task_id = parent, sort_order = 2, metadata = { experiment = true },
            })
            local blocker = make_task(user, journal_id, { title = "External blocker" })
            local removed = make_task(user, journal_id, {})
            link_tasks(user, journal_id, blocker, parent)
            link_tasks(user, journal_id, removed, parent)
            accepted(cmd(user, "unlink_tasks", journal_id, {
                from_task_id = removed, to_task_id = parent, decision_id = "dec-remove", command_id = uuid(),
            }))
            sync(user, journal_id)

            fold_experiment(user, journal_id, experiment, "adopted")
            record_receipt(user, journal_id, parent)
            append_fact(user, journal_id, parent, "post-receipt work", { "work" })
            sync(user, journal_id)

            local lease = open_branch(user, journal_id, parent, user)
            test.eq(tostring(lease.capability), "PLANNING")
            accepted(cmd(user, "create_checkpoint", journal_id, {
                task_id = parent, title = "parent checkpoint", body = "state saved",
            }))
            sync(user, journal_id)
            append_fact(user, journal_id, parent, "delta one")
            append_fact(user, journal_id, child_a1, "delta two")
            sync(user, journal_id)

            local branch = read_view(user, {
                journal_id = journal_id, view = "branch", task_id = parent, lease_id = lease.lease_id,
            }).branch

            test.eq(tostring(branch.resolved), "task")
            -- lease block
            test.not_nil(branch.lease)
            test.eq(tostring(branch.lease.lease_id), tostring(lease.lease_id))
            test.eq(tostring(branch.lease.capability), "PLANNING")
            test.eq(type(branch.lease.fencing_token), "number")
            test.eq(type(branch.lease.ttl_s), "number")
            test.eq(type(branch.lease.expires_at), "number")
            -- task per the D1 Task shape
            test.eq(tostring(branch.task.id), parent)
            test.eq(tostring(branch.task.status), "open")
            test.eq(tonumber(branch.task.revision), 1)
            test.not_nil(branch.task.created_at)
            test.not_nil(branch.task.updated_at)
            -- children rollups with folded tombstone and open_count
            test.eq(#branch.children, 2)
            local rolled_a = find_child(branch.children, child_a)
            test.not_nil(rolled_a)
            test.eq(tonumber(rolled_a.open_count), 1)
            test.is_nil(rolled_a.folded)
            local rolled_e = find_child(branch.children, experiment)
            test.not_nil(rolled_e)
            test.eq(tostring(rolled_e.status), "folded")
            test.not_nil(rolled_e.folded)
            test.eq(tostring(rolled_e.folded.outcome), "adopted")
            test.eq(tonumber(rolled_e.open_count), 0)
            test.eq(type(rolled_e.digest), "string")
            test.is_true(tonumber(rolled_e.digest_age_seq) >= 0)
            -- receipt_status: work fact after the receipt makes it stale
            test.eq(tostring(branch.receipt_status), "stale")
            -- cross exception from the other subtree, tombstoned edge excluded
            test.eq(#branch.cross_exceptions, 1)
            local exception = branch.cross_exceptions[1]
            test.eq(tostring(exception.task_id), blocker)
            test.eq(tostring(exception.kind), "blocks")
            test.eq(tonumber(exception.relevance), 0)
            test.is_true(tostring(exception.one_line):find("External blocker", 1, true) ~= nil)
            test.is_true(tostring(exception.path) ~= "")
            for _, edge in ipairs(branch.deps.incoming or {}) do
                test.is_false(tostring(edge.from_task_id) == removed, "tombstoned dep leaked into the lens")
            end
            -- changed since the acting agent's checkpoint, subtree scoped
            test.eq(tonumber(branch.changed_since_checkpoint.count), 2)
            test.is_true(tonumber(branch.changed_since_checkpoint.first_seq)
                <= tonumber(branch.changed_since_checkpoint.last_seq))
            -- one authoritative next action: the first startable child in order
            test.not_nil(branch.next)
            test.eq(tostring(branch.next.task_id), child_a)
            test.is_true(tostring(branch.next.rationale) ~= "")
            -- baseline fields stay intact
            test.not_nil(branch.facts)
            test.not_nil(branch.counts)
            test.not_nil(branch.ancestors)

            -- ancestor spine carries the per-branch digest state
            local deep = read_view(user, {
                journal_id = journal_id, view = "branch", task_id = child_a1,
            }).branch
            test.eq(#deep.ancestors, 2)
            test.eq(tostring(deep.ancestors[1].id), parent)
            test.eq(tostring(deep.ancestors[2].id), child_a)
            test.eq(type(deep.ancestors[1].digest), "string")
            test.is_true(tonumber(deep.ancestors[1].digest_age_seq) >= 0)

            -- X5: a superseded lease resolves as a stale pointer
            expire_lease(journal_id, lease.lease_id)
            local stale = read_view(user, {
                journal_id = journal_id, view = "branch", task_id = parent, lease_id = lease.lease_id,
            }).branch
            test.eq(tostring(stale.resolved), "stale_pointer")
        end)

        test.it("frontier categorizes every exclusion and drills each category", function()
            local user = "b3-" .. uuid()
            local journal_id = create_journal(user)
            local gate = make_task(user, journal_id, { gate = true, verifier_policy_hash = "gate-policy" })
            local gated = make_task(user, journal_id, {})
            link_tasks(user, journal_id, gate, gated)
            local dep = make_task(user, journal_id, {})
            local blocked = make_task(user, journal_id, {})
            link_tasks(user, journal_id, dep, blocked)
            local leased = make_task(user, journal_id, {})
            open_branch(user, journal_id, leased, "agent-holder")
            local experiment = make_task(user, journal_id, { metadata = { experiment = true } })
            fold_experiment(user, journal_id, experiment, "abandoned")
            local free = make_task(user, journal_id, { title = "Free task" })

            local frontier = read_view(user, { journal_id = journal_id, view = "frontier" }).frontier
            test.eq(tonumber(frontier.excluded.behind_gate), 1)
            test.eq(tonumber(frontier.excluded.blocked_by), 1)
            test.eq(tonumber(frontier.excluded.leased), 1)
            test.eq(tonumber(frontier.excluded.folded), 1)
            local free_entry = nil
            for _, entry in ipairs(frontier.actionable) do
                test.is_false(tostring(entry.task_id) == experiment, "folded task appeared in Frontier")
                if tostring(entry.task_id) == free then free_entry = entry end
            end
            test.not_nil(free_entry)
            test.eq(tostring(free_entry.path), "Free task")
            test.is_true(tostring(free_entry.why_now):find("startable per T1", 1, true) ~= nil)

            local expectations = {
                { category = "behind_gate", task_id = gated, fragment = gate },
                { category = "blocked_by", task_id = blocked, fragment = dep },
                { category = "leased", task_id = leased, fragment = "agent-holder" },
                { category = "folded", task_id = experiment, fragment = "abandoned" },
            }
            for _, expected in ipairs(expectations) do
                local drilled = read_view(user, {
                    journal_id = journal_id, view = "frontier", category = expected.category,
                }).frontier
                test.eq(tostring(drilled.drill_category), expected.category)
                test.eq(#drilled.drill, 1, expected.category)
                test.eq(tostring(drilled.drill[1].task_id), expected.task_id)
                test.is_true(tostring(drilled.drill[1].reason):find(expected.fragment, 1, true) ~= nil,
                    expected.category .. " reason: " .. tostring(drilled.drill[1].reason))
            end
        end)

        test.it("changes scope by journal and subtree and page by cursor", function()
            local user = "b3-" .. uuid()
            local journal_id = create_journal(user)
            local parent = make_task(user, journal_id, {})
            local child = make_task(user, journal_id, { parent_task_id = parent })
            local other = make_task(user, journal_id, {})
            append_fact(user, journal_id, parent, "on parent")
            append_fact(user, journal_id, child, "on child")
            append_fact(user, journal_id, other, "elsewhere")
            append_fact(user, journal_id, nil, "journal level")
            sync(user, journal_id)

            local all = read_view(user, { journal_id = journal_id, view = "changes" }).changes
            test.eq(tostring(all.scope), "journal")
            test.eq(all.since_seq, 0)
            test.eq(#all.events, 7)
            for index = 2, #all.events do
                test.is_true(all.events[index].seq > all.events[index - 1].seq, "feed must be newest last")
            end
            test.eq(all.next_cursor, all.events[#all.events].seq)
            test.is_false(all.has_more)
            test.not_nil(all.events[1].id)
            test.not_nil(all.events[1].event_type)
            test.is_nil(all.events[1].body, "change feed carries index fields only")

            local subtree = read_view(user, {
                journal_id = journal_id, view = "changes", task_id = parent,
            }).changes
            test.eq(tostring(subtree.scope), "subtree")
            test.eq(#subtree.events, 4)
            for _, event in ipairs(subtree.events) do
                local task_id = tostring(event.task_id)
                test.is_true(task_id == parent or task_id == child,
                    "subtree feed leaked " .. json.encode(event))
            end

            local page = read_view(user, { journal_id = journal_id, view = "changes", limit = 2 }).changes
            test.eq(#page.events, 2)
            test.is_true(page.has_more)
            test.eq(page.next_cursor, page.events[2].seq)
            local rest = read_view(user, {
                journal_id = journal_id, view = "changes", since_seq = page.next_cursor,
            }).changes
            test.eq(#rest.events, 5)
            test.is_true(rest.events[1].seq > page.next_cursor)

            accepted(cmd(user, "create_checkpoint", journal_id, { title = "agent checkpoint", body = "saved" }))
            sync(user, journal_id)
            append_fact(user, journal_id, parent, "after checkpoint one")
            append_fact(user, journal_id, other, "after checkpoint two")
            sync(user, journal_id)
            local since_checkpoint = read_view(user, {
                journal_id = journal_id, view = "changes", agent = user,
            }).changes
            test.eq(#since_checkpoint.events, 2)
            test.eq(since_checkpoint.checkpoint_seq, since_checkpoint.since_seq)
            test.is_true(since_checkpoint.since_seq > 0)
        end)

        test.it("roots flag opens the journal lens past the focus and the lens carries the subtree checkpoint", function()
            local user = "b3-" .. uuid()
            local journal_id = create_journal(user)
            local parent = make_task(user, journal_id, {})
            local child = make_task(user, journal_id, { parent_task_id = parent })
            local other = make_task(user, journal_id, {})
            accepted(cmd(user, "focus_task", journal_id, { task_id = parent, command_id = uuid() }))
            sync(user, journal_id)

            local focused = read_view(user, { journal_id = journal_id, view = "branch" }).branch
            test.eq(tostring(focused.resolved), "active")
            test.eq(tostring(focused.task.id), parent)

            local roots = read_view(user, { journal_id = journal_id, view = "branch", roots = true }).branch
            test.eq(tostring(roots.resolved), "roots")
            test.is_nil(roots.task)
            test.eq(tostring(roots.active_task_id), parent)
            test.not_nil(find_child(roots.children, parent), "roots lens must list the root tasks")
            test.not_nil(find_child(roots.children, other))

            accepted(cmd(user, "create_checkpoint", journal_id, {
                task_id = child, title = "child checkpoint", body = "child state saved",
            }))
            sync(user, journal_id)
            local checkpoint_row = db_one([[
                SELECT id, seq, ts FROM chestor_journal_events
                 WHERE journal_id = ? AND event_type = 'checkpoint' AND task_id = ?
            ]], { journal_id, child })

            -- The checkpoint on the child is visible from the parent's subtree
            -- lens and from the journal-level roots lens, not from a sibling.
            local parent_lens = read_view(user, {
                journal_id = journal_id, view = "branch", task_id = parent,
            }).branch
            test.not_nil(parent_lens.latest_checkpoint, "subtree checkpoint missing from the lens")
            test.eq(tostring(parent_lens.latest_checkpoint.event_id), tostring(checkpoint_row.id))
            test.eq(tostring(parent_lens.latest_checkpoint.title), "child checkpoint")
            test.eq(tonumber(parent_lens.latest_checkpoint.seq), tonumber(checkpoint_row.seq))
            test.eq(tonumber(parent_lens.latest_checkpoint.ts), tonumber(checkpoint_row.ts))
            local other_lens = read_view(user, {
                journal_id = journal_id, view = "branch", task_id = other,
            }).branch
            test.is_nil(other_lens.latest_checkpoint, "sibling lens must not see the checkpoint")
            local roots_again = read_view(user, { journal_id = journal_id, view = "branch", roots = true }).branch
            test.not_nil(roots_again.latest_checkpoint)
            test.eq(tostring(roots_again.latest_checkpoint.event_id), tostring(checkpoint_row.id))
        end)

        test.it("stale receipt status carries the superseding seq and change rows carry the spine path", function()
            local user = "b3-" .. uuid()
            local journal_id = create_journal(user)
            local parent = make_task(user, journal_id, { title = "Spine root" })
            local child = make_task(user, journal_id, {
                parent_task_id = parent, title = "Spine leaf",
                claim = "leaf claim", verifier_policy_hash = "policy-leaf",
            })
            record_receipt(user, journal_id, child)
            append_fact(user, journal_id, child, "post-receipt work", { "work" })
            sync(user, journal_id)
            local superseding = db_one([[
                SELECT MAX(seq) AS seq FROM chestor_journal_events
                 WHERE journal_id = ? AND task_id = ? AND event_type = 'progress'
            ]], { journal_id, child })

            local lens = read_view(user, {
                journal_id = journal_id, view = "branch", task_id = child,
            }).branch
            test.eq(tostring(lens.receipt_status), "stale")
            test.eq(tonumber(lens.receipt_stale_seq), tonumber(superseding.seq))
            local fresh = make_task(user, journal_id, {
                claim = "fresh claim", verifier_policy_hash = "policy-fresh",
            })
            record_receipt(user, journal_id, fresh)
            local fresh_lens = read_view(user, {
                journal_id = journal_id, view = "branch", task_id = fresh,
            }).branch
            test.eq(tostring(fresh_lens.receipt_status), "valid")
            test.is_nil(fresh_lens.receipt_stale_seq)

            local changes = read_view(user, { journal_id = journal_id, view = "changes" }).changes
            local pathed = 0
            for _, event in ipairs(changes.events) do
                if tostring(event.task_id) == child then
                    test.eq(tostring(event.path), "Spine root > Spine leaf")
                    pathed = pathed + 1
                elseif tostring(event.task_id) == parent then
                    test.eq(tostring(event.path), "Spine root")
                    pathed = pathed + 1
                elseif event.task_id == nil then
                    test.is_nil(event.path, "path belongs only to rows with a task_id")
                end
            end
            test.is_true(pathed >= 3, "expected pathed change rows, got " .. json.encode(changes.events))
        end)

        test.it("branch digests recompute on fold, checkpoint, and the 25th fact under the I7 guards", function()
            local user = "b3-" .. uuid()
            local journal_id = create_journal(user)
            local parent = make_task(user, journal_id, {})
            local experiment = make_task(user, journal_id, {
                parent_task_id = parent, metadata = { experiment = true },
            })
            fold_experiment(user, journal_id, experiment, "adopted")

            local fold_seq = db_one([[
                SELECT seq FROM chestor_journal_events
                 WHERE journal_id = ? AND task_id = ? AND event_type = 'task.transitioned'
                 ORDER BY seq DESC LIMIT 1
            ]], { journal_id, experiment })
            local row = db_one(
                "SELECT * FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id = ?",
                { journal_id, experiment })
            test.not_nil(row, "fold must trigger a branch digest")
            test.eq(tostring(row.generator_version), "det-1")
            test.eq(tonumber(row.stale), 0)
            test.eq(tonumber(row.source_seq), tonumber(fold_seq.seq))
            test.is_true(tostring(row.digest):find("folded(adopted)", 1, true) ~= nil)
            test.eq(type(json.decode(tostring(row.provenance_json))), "table")

            accepted(cmd(user, "create_checkpoint", journal_id, {
                task_id = parent, title = "parent checkpoint", body = "saved",
            }))
            sync(user, journal_id)
            local checkpoint_seq = db_one([[
                SELECT seq FROM chestor_journal_events
                 WHERE journal_id = ? AND task_id = ? AND event_type = 'checkpoint'
                 ORDER BY seq DESC LIMIT 1
            ]], { journal_id, parent })
            local parent_row = db_one(
                "SELECT * FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id = ?",
                { journal_id, parent })
            test.not_nil(parent_row, "checkpoint must trigger a branch digest")
            test.eq(tonumber(parent_row.source_seq), tonumber(checkpoint_seq.seq))

            -- 25-fact trigger: the task.upserted event is fact 1 under the task.
            local busy = make_task(user, journal_id, {})
            for index = 1, 5 do append_fact(user, journal_id, busy, "fact " .. index) end
            sync(user, journal_id)
            test.is_nil(db_one(
                "SELECT task_id FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id = ?",
                { journal_id, busy }), "no digest before the 25th fact")
            for index = 6, 24 do append_fact(user, journal_id, busy, "fact " .. index) end
            sync(user, journal_id)
            local busy_facts = db_one(
                "SELECT COUNT(*) AS n, MAX(seq) AS last FROM chestor_journal_events WHERE journal_id = ? AND task_id = ?",
                { journal_id, busy })
            test.eq(tonumber(busy_facts.n), 25)
            local busy_row = db_one(
                "SELECT * FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id = ?",
                { journal_id, busy })
            test.not_nil(busy_row, "the 25th fact must trigger a branch digest")
            test.eq(tonumber(busy_row.source_seq), tonumber(busy_facts.last))
            test.is_true(tostring(busy_row.digest):find("facts: 25", 1, true) ~= nil)

            -- I7.1/I7.2 guards on the write path
            with_db(function(db)
                local regression, regression_err = branch_digests.upsert(db, journal_id, parent, {
                    digest = "regressed", source_seq = 1, computed_at = os.time(),
                })
                test.is_nil(regression_err)
                test.is_true(regression.refused == true)
                test.eq(tostring(regression.code), "monotonic")
                local beyond, beyond_err = branch_digests.upsert(db, journal_id, parent, {
                    digest = "beyond the log", source_seq = 999999, computed_at = os.time(),
                })
                test.is_nil(beyond_err)
                test.is_true(beyond.refused == true)
                test.eq(tostring(beyond.code), "provenance")
                local last_rows, last_err = ops.query(db,
                    "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
                    { journal_id })
                test.is_nil(last_err)
                local advanced, advanced_err = branch_digests.upsert(db, journal_id, parent, {
                    digest = "advanced", source_seq = tonumber(last_rows[1].n), computed_at = os.time(),
                })
                test.is_nil(advanced_err)
                test.is_true(advanced.success == true, json.encode(advanced))
            end)
            local advanced_row = db_one(
                "SELECT digest FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id = ?",
                { journal_id, parent })
            test.eq(tostring(advanced_row.digest), "advanced")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

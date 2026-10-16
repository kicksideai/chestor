-- B4.5 protocol usability walk: one honest agent runs the whole loop through
-- the trait handlers - the same surface MCP serves. open_branch -> plan wide
-- and deep (decompose with gate, contract, and a blocks-chain) -> start ->
-- facts through the lease -> request_verify -> runner receipt -> complete ->
-- gate flow -> experiment fold -> checkpoint -> refusal ergonomics. Frontier
-- and the change feed are read after each phase so the walk proves the lens
-- tracks the protocol, not just the write path.
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
local RUNNER = "runner:walk"
local AGENT = "agent-walker"

local TOOL = {
    act = "chestor.journal.traits:act_journal",
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
        title = "B4.5 protocol walk " .. uuid(),
    })
    test.is_nil(err)
    return tostring(created.component_id or created.thread_id)
end

local function call(user_id, ref, input)
    local value, err = executor(user_id):call(ref, input)
    test.is_nil(err, tostring(ref) .. ": " .. tostring(err))
    test.not_nil(value)
    return value
end

local function act(user_id, journal_id, verb, data)
    return call(user_id, TOOL.act, { journal_id = journal_id, verb = verb, data = data or {} })
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

local function db_one(statement, params)
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    local rows, query_err = ops.query(db, statement, params or {})
    db:release()
    test.is_nil(query_err)
    return rows and rows[1] or nil
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
    test.is_true(result.refused == true, "expected a refusal" .. at .. ", got " .. json.encode(result))
    test.eq(tostring(result.code), code,
        "expected refusal code " .. code .. at .. ", got " .. json.encode(result))
    test.is_true(tostring(result.detail or "") ~= "", "refusal without detail" .. at)
    return result
end

local function frontier(user_id, journal_id, opts)
    local out = call(user_id, TOOL.read, {
        journal_id = journal_id,
        view = "frontier",
        task_id = opts and opts.task_id,
        category = opts and opts.category,
    })
    test.is_true(out.success, tostring(out.error))
    return out.frontier
end

local function actionable_ids(view)
    local ids = {}
    for _, entry in ipairs(view.actionable or {}) do ids[tostring(entry.task_id)] = true end
    return ids
end

local function record_receipt(user_id, journal_id, task_id, overrides)
    local args = {
        task_id = task_id,
        principal = RUNNER,
        verdict = "pass",
        verifier_type = "test-run",
        verifier_version = "1",
        artifact_hash = "sha256:walk-artifact",
        command_id = uuid(),
    }
    for key, value in pairs(overrides or {}) do args[key] = value end
    local out = call(user_id, "app:journal_cmd", {
        op = "record_receipt", journal_id = journal_id, args = args,
    })
    accepted(out, "record_receipt " .. task_id)
    sync(user_id, journal_id)
    return tostring(out.receipt_id)
end

local function define_tests()
    test.describe("Journal B4.5 protocol walk", function()
        test.it("runs the honest agent loop through the trait surface", function()
            local user = "walk-" .. uuid()
            local journal_id = create_journal(user)

            -- Root plan node through the fact surface, then enter it.
            accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = { id = "root", title = "Ship regex search", command_id = uuid() },
            }), "root task")
            sync(user, journal_id)

            local entered = accepted(act(user, journal_id, "open_branch", {
                task_id = "root", agent_id = AGENT,
            }), "open_branch root")
            local root_lease = entered.lease
            test.not_nil(root_lease, "open_branch returned no lease")
            test.eq(tostring(root_lease.capability), "WRITE")
            test.is_true(tostring(entered.command_id) ~= "", "open_branch returned no command_id")
            test.not_nil(entered.lens, "open_branch returned no lens")
            test.eq(tostring(entered.lens.resolved), "task")
            test.eq(tostring(entered.lens.task.id), "root")
            test.eq(tostring(entered.lens.lease.lease_id), tostring(root_lease.lease_id))

            -- Plan ahead, wide and deep: three levels, a gate, a contract.
            local level1 = accepted(act(user, journal_id, "decompose", {
                parent_task_id = "root",
                lease_id = root_lease.lease_id,
                fencing_token = root_lease.fencing_token,
                subtasks = {
                    { id = "design", title = "Design the query model", sort_order = 1,
                      claim = "design approved", verifier_policy_hash = "policy-review" },
                    { id = "build", title = "Build the search path", sort_order = 2 },
                    { id = "ship", title = "Ship to the workspace", sort_order = 3 },
                    { id = "quality-gate", title = "End-to-end quality gate", sort_order = 4,
                      gate = true, claim = "build verified end to end", verifier_policy_hash = "policy-e2e" },
                },
            }), "decompose root")
            test.eq(#level1.task_ids, 4)
            test.is_true(tostring(level1.command_id) ~= "", "decompose returned no command_id")
            sync(user, journal_id)
            accepted(act(user, journal_id, "decompose", {
                parent_task_id = "build",
                lease_id = root_lease.lease_id,
                fencing_token = root_lease.fencing_token,
                subtasks = {
                    { id = "api", title = "Search API",
                      contract = { output_schema = {
                          type = "object", required = { "ok" }, properties = { ok = { type = "boolean" } },
                      } } },
                    { id = "ui", title = "Search UI" },
                },
            }), "decompose build")
            sync(user, journal_id)
            accepted(act(user, journal_id, "decompose", {
                parent_task_id = "api",
                lease_id = root_lease.lease_id,
                fencing_token = root_lease.fencing_token,
                subtasks = {
                    { id = "api-impl", title = "Implement matching" },
                    { id = "api-tests", title = "API test suite" },
                },
            }), "decompose api")
            sync(user, journal_id)

            -- The typed plan landed: gate flag, pinned policy, and the F3
            -- contract are on the read model without a second patch call.
            local gate_row = db_one(
                "SELECT gate, claim, verifier_policy_hash FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?",
                { journal_id, "quality-gate" })
            test.eq(tonumber(gate_row.gate), 1)
            test.eq(tostring(gate_row.claim), "build verified end to end")
            test.eq(tostring(gate_row.verifier_policy_hash), "policy-e2e")
            local api_row = db_one(
                "SELECT metadata FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?",
                { journal_id, "api" })
            test.is_true(tostring(api_row.metadata):find("output_schema", 1, true) ~= nil,
                "decompose dropped the contract: " .. tostring(api_row.metadata))

            -- The blocks-chain, linked ahead through the planning lease.
            for _, edge in ipairs({
                { from = "design", to = "build" },
                { from = "quality-gate", to = "ship" },
                { from = "api-impl", to = "api-tests" },
            }) do
                accepted(act(user, journal_id, "link", {
                    from = edge.from, to = edge.to, kind = "blocks",
                    lease_id = root_lease.lease_id, fencing_token = root_lease.fencing_token,
                }), "link " .. edge.from .. " -> " .. edge.to)
            end
            sync(user, journal_id)

            -- Frontier explains the whole plan before any work starts.
            local before = frontier(user, journal_id)
            local before_ids = actionable_ids(before)
            test.is_true(before_ids["design"] == true, "design not actionable: " .. json.encode(before))
            test.is_true(before_ids["api-impl"] == true)
            test.is_true(before_ids["build"] == nil, "build should wait on design")
            test.eq(before.excluded.behind_gate, 1)
            test.eq(before.excluded.blocked_by, 2)
            test.eq(before.excluded.leased, 1)
            test.eq(before.excluded.folded, 0)
            local gate_drill = frontier(user, journal_id, { category = "behind_gate" })
            test.eq(tostring(gate_drill.drill[1].task_id), "ship")
            test.is_true(tostring(gate_drill.drill[1].reason):find("quality%-gate") ~= nil)

            -- The trait is the strict surface: no lease, no transition.
            refused(act(user, journal_id, "start", { task_id = "design" }), "lease_required", "lease-less start")

            -- Work the first task: enter, start, record under the lease.
            local design_lease = accepted(act(user, journal_id, "open_branch", {
                task_id = "design", agent_id = AGENT,
            }), "open_branch design").lease
            test.eq(tostring(design_lease.capability), "WRITE")
            local started = accepted(act(user, journal_id, "start", {
                task_id = "design", lease_id = design_lease.lease_id, fencing_token = design_lease.fencing_token,
            }), "start design")
            test.eq(tostring(started.to_status), "in_progress")
            test.is_true(tostring(started.command_id) ~= "")
            sync(user, journal_id)

            local fact = accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "entry",
                data = {
                    lease_id = design_lease.lease_id,
                    event_type = "progress",
                    title = "Drafted the query model",
                    body = "Anchors, classes, and bounded quantifiers only.",
                    tags = { "work" },
                },
            }), "fact through lease")
            test.eq(tostring(fact.task_id), "design", "fact did not attach through the lease")
            sync(user, journal_id)
            local fact_row = db_one(
                "SELECT task_id FROM chestor_journal_events WHERE journal_id = ? AND id = ?",
                { journal_id, tostring(fact.event_id) })
            test.eq(tostring(fact_row.task_id), "design")

            -- Verification: agent requests, the runner authors the verdict.
            local requested = accepted(act(user, journal_id, "request_verify", {
                task_id = "design", lease_id = design_lease.lease_id, fencing_token = design_lease.fencing_token,
            }), "request_verify design")
            test.is_true(tostring(requested.request_id) ~= "")
            sync(user, journal_id)
            local design_receipt = record_receipt(user, journal_id, "design", {
                request_id = requested.request_id,
            })

            local completed = accepted(act(user, journal_id, "complete", {
                task_id = "design", lease_id = design_lease.lease_id, fencing_token = design_lease.fencing_token,
                result = "Design approved", receipt_id = design_receipt, expected_revision = 1,
            }), "complete design")
            test.eq(tostring(completed.to_status), "done")
            test.is_true(completed.guard.receipt_valid == true)
            test.is_true(completed.guard.receipt_fresh == true)
            sync(user, journal_id)

            -- Completing design unlocks build on the frontier.
            local after_design = frontier(user, journal_id)
            test.is_true(actionable_ids(after_design)["build"] == true,
                "build still blocked after design done: " .. json.encode(after_design))
            test.eq(after_design.excluded.blocked_by, 1)

            -- The gate holds ship: entry grants PLANNING, start refuses.
            local ship_planning = accepted(act(user, journal_id, "open_branch", {
                task_id = "ship", agent_id = AGENT,
            }), "open_branch ship behind gate")
            test.eq(tostring(ship_planning.lease.capability), "PLANNING")
            refused(act(user, journal_id, "start", {
                task_id = "ship", lease_id = ship_planning.lease.lease_id,
                fencing_token = ship_planning.lease.fencing_token,
            }), "capability", "start behind gate")

            -- Agents cannot pass gates; the runner can, on fresh evidence.
            refused(act(user, journal_id, "gate_pass", {
                task_id = "quality-gate", receipt_id = "forged",
            }), "author_not_runner", "agent gate_pass")
            local gate_receipt = record_receipt(user, journal_id, "quality-gate", {})
            accepted(act(user, journal_id, "gate_pass", {
                task_id = "quality-gate", receipt_id = gate_receipt, principal = RUNNER,
            }), "runner gate_pass")
            sync(user, journal_id)
            local passed_row = db_one(
                "SELECT passed FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?",
                { journal_id, "quality-gate" })
            test.eq(tonumber(passed_row.passed), 1)

            -- Re-opening the own branch after the gate passed upgrades the
            -- capability under a fresh fencing grant.
            local ship_write = accepted(act(user, journal_id, "open_branch", {
                task_id = "ship", agent_id = AGENT,
            }), "re-open ship").lease
            test.eq(tostring(ship_write.capability), "WRITE")
            test.is_true(tonumber(ship_write.fencing_token) > tonumber(ship_planning.lease.fencing_token))
            local ship_start_command = uuid()
            accepted(act(user, journal_id, "start", {
                task_id = "ship", lease_id = ship_write.lease_id, fencing_token = ship_write.fencing_token,
                command_id = ship_start_command,
            }), "start ship")
            sync(user, journal_id)

            -- Retrying the same command replays the stored result, no second
            -- transition.
            local replay = act(user, journal_id, "start", {
                task_id = "ship", lease_id = ship_write.lease_id, fencing_token = ship_write.fencing_token,
                command_id = ship_start_command,
            })
            test.is_true(replay.duplicate == true, "expected replay marker: " .. json.encode(replay))

            -- Done still rests on evidence: no receipt, no completion.
            refused(act(user, journal_id, "complete", {
                task_id = "ship", lease_id = ship_write.lease_id, fencing_token = ship_write.fencing_token,
                result = "shipped",
            }), "receipt_missing", "complete without receipt")

            -- Experiment branch: opened under the plan, folded with the
            -- distilled learning, visible only as a tombstone afterwards.
            accepted(act(user, journal_id, "decompose", {
                parent_task_id = "build",
                lease_id = root_lease.lease_id, fencing_token = root_lease.fencing_token,
                subtasks = { { id = "exp-rg", title = "Try ripgrep backend", experiment = true } },
            }), "decompose experiment")
            sync(user, journal_id)
            local exp_lease = accepted(act(user, journal_id, "open_branch", {
                task_id = "exp-rg", agent_id = AGENT,
            }), "open_branch experiment").lease
            accepted(act(user, journal_id, "start", {
                task_id = "exp-rg", lease_id = exp_lease.lease_id, fencing_token = exp_lease.fencing_token,
            }), "start experiment")
            sync(user, journal_id)
            local folded = accepted(act(user, journal_id, "fold", {
                task_id = "exp-rg", lease_id = exp_lease.lease_id, fencing_token = exp_lease.fencing_token,
                outcome = "adopted", distilled = "ripgrep wins on cold caches; adopt as the scan backend",
            }), "fold experiment")
            test.eq(tostring(folded.to_status), "folded")
            sync(user, journal_id)

            local build_lens = call(user, TOOL.read, {
                journal_id = journal_id, view = "branch", task_id = "build",
            })
            test.is_true(build_lens.success, tostring(build_lens.error))
            local tombstone = nil
            for _, child in ipairs(build_lens.branch.children) do
                if tostring(child.id) == "exp-rg" then tombstone = child end
            end
            test.not_nil(tombstone, "folded experiment missing from the lens children")
            test.eq(tostring(tombstone.folded.outcome), "adopted")
            test.eq(tostring(build_lens.branch.ancestors[1].id), "root")
            test.eq(frontier(user, journal_id).excluded.folded, 1)

            -- Checkpoint through the lease before leaving the branch.
            local checkpoint = accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "checkpoint",
                data = {
                    lease_id = ship_write.lease_id,
                    title = "Walk checkpoint",
                    body = "Design done with receipt; gate passed; ship in progress; experiment folded.",
                },
            }), "checkpoint through lease")
            test.eq(tostring(checkpoint.task_id), "ship")
            sync(user, journal_id)

            -- Reopen is an audited transition: refused bare, accepted with a
            -- decision, and the receipts go stale with it.
            refused(act(user, journal_id, "reopen", {
                task_id = "design", lease_id = design_lease.lease_id, fencing_token = design_lease.fencing_token,
            }), "decide_required", "reopen without decision")
            local decision = accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "entry",
                data = {
                    task_id = "design", event_type = "decision",
                    title = "Reopen design", body = "Anchor semantics changed; the approved design no longer holds.",
                },
            }), "reopen decision")
            sync(user, journal_id)
            accepted(act(user, journal_id, "reopen", {
                task_id = "design", lease_id = design_lease.lease_id, fencing_token = design_lease.fencing_token,
                decision_id = decision.event_id,
            }), "reopen with decision")
            sync(user, journal_id)
            local stale = db_one(
                "SELECT COUNT(*) AS n, SUM(CASE WHEN stale = 1 THEN 1 ELSE 0 END) AS stale_n"
                    .. " FROM chestor_journal_receipts WHERE journal_id = ? AND task_id = ?",
                { journal_id, "design" })
            test.eq(tonumber(stale.n), tonumber(stale.stale_n))

            -- Shared focus nominated through the lease.
            local focused = accepted(act(user, journal_id, "focus", {
                lease_id = root_lease.lease_id, fencing_token = root_lease.fencing_token,
            }), "focus via lease")
            test.eq(tostring(focused.task_id), "root")
            sync(user, journal_id)
            local active = call(user, TOOL.read, { journal_id = journal_id, view = "branch" })
            test.eq(tostring(active.branch.resolved), "active")
            test.eq(tostring(active.branch.task.id), "root")

            -- The change feed replays the whole walk.
            local changes = call(user, TOOL.read, {
                journal_id = journal_id, view = "changes", since_seq = 0, limit = 100,
            })
            test.is_true(changes.success, tostring(changes.error))
            local kinds = {}
            for _, event in ipairs(changes.changes.events) do
                kinds[tostring(event.event_type)] = (kinds[tostring(event.event_type)] or 0) + 1
            end
            test.is_true((kinds["task.transitioned"] or 0) >= 6, json.encode(kinds))
            test.is_true((kinds["task.linked"] or 0) >= 3)
            test.is_true((kinds["verification.receipt"] or 0) >= 2)
            test.is_true((kinds["checkpoint"] or 0) >= 1)
            test.is_true((kinds["task.focused"] or 0) >= 1)
            test.is_true(changes.changes.next_cursor > 0)
            test.is_false(changes.changes.has_more)
        end)

        test.it("keeps the second agent visible, not silently blocked", function()
            local user = "walk-" .. uuid()
            local journal_id = create_journal(user)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = { id = "contested", title = "Contested task", command_id = uuid() },
            }))
            sync(user, journal_id)
            accepted(act(user, journal_id, "open_branch", { task_id = "contested", agent_id = "agent-a" }))
            local second = act(user, journal_id, "open_branch", { task_id = "contested", agent_id = "agent-b" })
            refused(second, "leased", "second agent open_branch")
            test.eq(tostring(second.holder), "agent-a")
            test.not_nil(second.lens, "leased refusal lost the read lens")
            test.eq(tostring(second.lens.task.id), "contested")
        end)

        test.it("refuses lease-carried facts on a dead lease with the exact code", function()
            local user = "walk-" .. uuid()
            local journal_id = create_journal(user)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = { id = "solo", title = "Solo task", command_id = uuid() },
            }))
            sync(user, journal_id)
            local lease = accepted(act(user, journal_id, "open_branch", {
                task_id = "solo", agent_id = AGENT,
            })).lease
            local db, db_err = sql.get(types.db_id())
            test.is_nil(db_err)
            local exec_err = ops.exec(db,
                "UPDATE chestor_journal_leases SET expires_at = ? WHERE journal_id = ? AND lease_id = ?",
                { os.time() - 10, journal_id, lease.lease_id })
            db:release()
            test.is_nil(exec_err)
            refused(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "entry",
                data = { lease_id = lease.lease_id, event_type = "progress", title = "late", body = "late" },
            }), "lease_expired", "fact on expired lease")
        end)

        test.it("distinguishes a missing fencing token from a stale one", function()
            local user = "walk-" .. uuid()
            local journal_id = create_journal(user)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = { id = "fenced", title = "Fenced task", command_id = uuid() },
            }))
            sync(user, journal_id)
            local lease = accepted(act(user, journal_id, "open_branch", {
                task_id = "fenced", agent_id = AGENT,
            })).lease
            refused(act(user, journal_id, "start", {
                task_id = "fenced", lease_id = lease.lease_id,
            }), "fencing_missing", "start without fencing_token")
            local fencing_token = tonumber(lease.fencing_token)
            if fencing_token == nil then error("fencing_token must be numeric") end
            refused(act(user, journal_id, "start", {
                task_id = "fenced", lease_id = lease.lease_id,
                fencing_token = fencing_token + 999,
            }), "fencing_stale", "start with mismatched fencing_token")
            accepted(act(user, journal_id, "start", {
                task_id = "fenced", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
            }), "start with the granted token")
        end)

        test.it("refuses a waiver whose decision_id is not a decision fact", function()
            local user = "walk-" .. uuid()
            local journal_id = create_journal(user)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = { id = "waivable", title = "Waivable task", command_id = uuid() },
            }))
            sync(user, journal_id)
            local lease = accepted(act(user, journal_id, "open_branch", {
                task_id = "waivable", agent_id = AGENT,
            })).lease
            accepted(act(user, journal_id, "start", {
                task_id = "waivable", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
            }))
            local note = accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "entry",
                data = { task_id = "waivable", event_type = "note", title = "just a note", body = "not a decision" },
            }))
            sync(user, journal_id)
            refused(act(user, journal_id, "complete", {
                task_id = "waivable", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
                result = "done anyway", waiver = { kind = "waived", decision_id = tostring(note.event_id) },
            }), "decision_kind", "waiver over a note fact")
            refused(act(user, journal_id, "complete", {
                task_id = "waivable", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
                result = "done anyway", waiver = { kind = "waived", decision_id = "no-such-fact" },
            }), "decision_kind", "waiver over a missing fact")
            local decision = accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "entry",
                data = { task_id = "waivable", event_type = "decision",
                    title = "Waive verification", body = "No runner covers this environment yet." },
            }))
            sync(user, journal_id)
            local completed = accepted(act(user, journal_id, "complete", {
                task_id = "waivable", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
                result = "done under waiver", waiver = { kind = "waived", decision_id = tostring(decision.event_id) },
            }), "complete with a decision-backed waiver")
            test.is_true(completed.guard.waived == true)
            test.eq(tostring(completed.guard.waiver_decision_id), tostring(decision.event_id))
        end)

        test.it("warns request_verify when no runner has ever recorded a receipt", function()
            local user = "walk-" .. uuid()
            local journal_id = create_journal(user)
            -- The runnerless-deployment precondition: no receipt anywhere.
            local db, db_err = sql.get(types.db_id())
            test.is_nil(db_err)
            local wipe_err = ops.exec(db, "DELETE FROM chestor_journal_receipts", {})
            db:release()
            test.is_nil(wipe_err)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = { id = "unverified", title = "Unverifiable task", command_id = uuid() },
            }))
            sync(user, journal_id)
            local lease = accepted(act(user, journal_id, "open_branch", {
                task_id = "unverified", agent_id = AGENT,
            })).lease
            local requested = accepted(act(user, journal_id, "request_verify", {
                task_id = "unverified", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
            }), "request_verify in a runnerless deployment")
            test.is_true(tostring(requested.warning):find("no verifier runner", 1, true) ~= nil,
                "runnerless request must warn: " .. json.encode(requested))
            record_receipt(user, journal_id, "unverified", {})
            local verified = accepted(act(user, journal_id, "request_verify", {
                task_id = "unverified", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
                command_id = uuid(),
            }), "request_verify with a runner on record")
            test.is_nil(verified.warning, "warning must clear once a runner has recorded a receipt")
        end)

        test.it("resumes through a durable cursor, enforces episode rotation, audit coverage, and parent integration", function()
            local user = "cursor-" .. uuid()
            local journal_id = create_journal(user)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "project", title = "Two month project", work_kind = "project" },
            }))
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = {
                    id = "audit", parent_task_id = "project", title = "Deep runtime audit",
                    work_kind = "audit", claim = "Every declared unit is accounted for",
                    metadata = { required_coverage = { "parser", "runtime" } },
                },
            }))
            sync(user, journal_id)
            local decision = accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "decision",
                data = { task_id = "project", title = "Runtime gaps need an explicit decision",
                    body = "Never erase an uninspectable audit surface.", metadata = { scope = "subtree" } },
            }))
            sync(user, journal_id)

            local parent_cursor = accepted(act(user, journal_id, "cursor_open", {
                cursor_id = "parent-cursor", task_id = "project", agent_id = "parent-agent",
                purpose = "Integrate delegated audit results", assignment = "Accept or reject child evidence",
                why = "Own the project rollup", close_requirements = { "child receipt disposed" },
            }))
            sync(user, journal_id)
            local child_cursor = accepted(act(user, journal_id, "cursor_open", {
                cursor_id = "child-cursor", parent_cursor_id = "parent-cursor", task_id = "audit",
                agent_id = "child-agent", purpose = "Audit parser and runtime",
                assignment = "Return findings, clean coverage, gaps, and evidence",
                why = "Delegated by the project cursor", close_requirements = { "parser", "runtime" },
                episode_ttl_s = 28800,
            }))
            test.eq(child_cursor.parent_cursor_id, parent_cursor.cursor_id)
            sync(user, journal_id)

            local resumed = call(user, TOOL.read, {
                journal_id = journal_id, view = "cursor", cursor_id = child_cursor.cursor_id,
            })
            test.eq(resumed.context.position.task.id, "audit")
            test.eq(resumed.context.position.ancestors[1].id, "project")
            test.eq(resumed.context.assignment.parent_cursor_id, "parent-cursor")
            test.eq(resumed.context.governing[1].id, tostring(decision.event_id))
            test.eq(resumed.context.episode.effective_state, "active")

            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "observation",
                data = { cursor_id = child_cursor.cursor_id, title = "Parser paths enumerated",
                    body = "All parser entry points are in the coverage inventory." },
            }))
            sync(user, journal_id)
            local db, db_err = sql.get(types.db_id())
            test.is_nil(db_err)
            local expiry_err = ops.exec(db, [[
                UPDATE chestor_journal_episodes SET deadline_at = ?
                 WHERE journal_id = ? AND episode_id = ?
            ]], { os.time() - 1, journal_id, child_cursor.episode_id })
            db:release()
            test.is_nil(expiry_err)
            refused(call(user, TOOL.record, {
                journal_id = journal_id, kind = "observation",
                data = { cursor_id = child_cursor.cursor_id, title = "Too late", body = "Must rotate first." },
            }), "episode_rotation_required", "work after the episode deadline")

            accepted(act(user, journal_id, "cursor_checkpoint", {
                cursor_id = child_cursor.cursor_id, agent_id = "child-agent", task_id = "audit",
                expected_revision = 1, checkpoint = {
                    completed = { "parser inventory" }, blockers = { "runtime unavailable" },
                    unverified = { "runtime behavior" }, next_actions = { "record coverage and rotate" },
                },
            }))
            sync(user, journal_id)
            refused(act(user, journal_id, "cursor_move", {
                cursor_id = child_cursor.cursor_id, agent_id = "child-agent", task_id = "audit",
                expected_revision = 1, reason = "stale process tries to move",
            }), "cursor_revision_stale", "stale cursor revision")
            local rotated = accepted(act(user, journal_id, "cursor_open", {
                cursor_id = child_cursor.cursor_id, agent_id = "child-agent", task_id = "audit",
                expected_revision = 2, purpose = "Finish audit evidence",
            }))
            test.is_true(tonumber(rotated.episode_deadline) <= os.time() + 28800)
            sync(user, journal_id)

            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "audit.coverage",
                data = { cursor_id = child_cursor.cursor_id, audit_task_id = "audit", unit_key = "parser",
                    status = "checked_clean", method = "enumeration and tests", source_revision = "rev-a" },
            }))
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "audit.coverage",
                data = { cursor_id = child_cursor.cursor_id, audit_task_id = "audit", unit_key = "runtime",
                    status = "gap", method = "runtime unavailable", source_revision = "rev-a",
                    decision_id = tostring(decision.event_id) },
            }))
            sync(user, journal_id)

            local lease = accepted(act(user, journal_id, "open_branch", {
                task_id = "audit", agent_id = "child-agent",
            })).lease
            accepted(act(user, journal_id, "start", {
                task_id = "audit", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
            }))
            sync(user, journal_id)
            local completed = accepted(act(user, journal_id, "complete", {
                task_id = "audit", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
                result = "Parser checked clean; runtime retained as a decision-backed gap.",
                waiver = { kind = "waived", decision_id = tostring(decision.event_id) },
            }))
            test.eq(completed.guard.audit_coverage.checked_clean, 1)
            test.eq(completed.guard.audit_coverage.gap, 1)
            sync(user, journal_id)

            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "integration",
                data = { cursor_id = child_cursor.cursor_id, receipt_id = "audit-integration",
                    parent_cursor_id = parent_cursor.cursor_id, child_cursor_id = child_cursor.cursor_id,
                    disposition = "pending", source_from_seq = 1,
                    source_to_seq = tonumber(completed.receipt.max_seq) or 0,
                    coverage = { checked_clean = 1, gap = 1 }, unresolved = { "runtime" },
                    summary = "Audit result awaiting parent disposition" },
            }))
            sync(user, journal_id)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "integration",
                data = { cursor_id = parent_cursor.cursor_id, receipt_id = "audit-integration",
                    parent_cursor_id = parent_cursor.cursor_id, child_cursor_id = child_cursor.cursor_id,
                    disposition = "accepted", summary = "Accepted with the explicit runtime gap" },
            }))
            sync(user, journal_id)
            local parent_context = call(user, TOOL.read, {
                journal_id = journal_id, view = "cursor", cursor_id = parent_cursor.cursor_id,
            })
            test.eq(parent_context.context.coordination.integrations[1].disposition, "accepted")
            test.eq(parent_context.context.coordination.integrations[1].receipt_id, "audit-integration")
            test.eq(parent_context.context.coordination.integrations[1].coverage.checked_clean, 1)
            test.eq(parent_context.context.coordination.integrations[1].unresolved[1], "runtime")
            test.is_true(parent_context.context.coordination.integrations[1].created_event_id ~= nil)
            test.is_true(parent_context.context.coordination.integrations[1].disposition_event_id ~= nil)
            test.is_true(parent_context.context.coordination.integrations[1].created_event_id
                ~= parent_context.context.coordination.integrations[1].disposition_event_id)

            local closed_child = accepted(act(user, journal_id, "cursor_close", {
                cursor_id = child_cursor.cursor_id, agent_id = "child-agent",
                expected_revision = 3,
            }))
            test.eq(closed_child.parent_cursor_id, parent_cursor.cursor_id)
            test.eq(closed_child.return_to.op, "resume")
            test.eq(closed_child.return_to.handle, parent_cursor.cursor_id)
        end)

        test.it("keeps a Pechka-shaped 100k-event project behind a bounded cursor envelope", function()
            local user = "scale-" .. uuid()
            local journal_id = create_journal(user)
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "scale-project", title = "Go-Lua project", work_kind = "project" },
            }))
            accepted(call(user, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "scale-work", parent_task_id = "scale-project",
                    title = "Long Go-Lua workstream", work_kind = "workstream" },
            }))
            sync(user, journal_id)
            local opened = accepted(act(user, journal_id, "cursor_open", {
                cursor_id = "scale-cursor", task_id = "scale-work", agent_id = "scale-agent",
                purpose = "Continue a multi-month runtime project",
                assignment = "Resume without loading the complete history",
                why = "The prior orchestrator was rotated",
            }))
            sync(user, journal_id)
            local head = db_one(
                "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
                { journal_id })
            local base = tonumber(head and head.n) or 0
            local db, db_err = sql.get(types.db_id())
            test.is_nil(db_err)
            local database_type, type_err = db:type()
            test.is_nil(type_err)
            test.is_true(database_type == "sqlite" or database_type == "postgres")
            local generated = [[WITH RECURSIVE generated(n) AS (
                SELECT 1 UNION ALL SELECT n + 1 FROM generated WHERE n < 100000
            )]]
            if database_type == "postgres" then
                generated = "WITH generated(n) AS (SELECT generate_series(1, 100000))"
            end
            local seed_err = ops.exec(db, generated .. [[
                INSERT INTO chestor_journal_events
                    (journal_id, id, seq, ts, event_type, title, body, actor_id,
                     actor_type, tags, linked_component_ids, linked_upload_ids,
                     linked_file_paths, linked_task_ids, task_id, cursor_id,
                     episode_id, metadata, payload_sha256, embedding_status, created_at)
                SELECT ?, 'scale-' || n, ? + n, 1700000000 + n,
                       CASE WHEN n <= 150 THEN 'decision'
                            WHEN n <= 1224 THEN 'checkpoint' ELSE 'observation' END,
                       CASE WHEN n = 99999 THEN 'scaleuniqueneedle' ELSE 'Long project fact ' || n END,
                       CASE WHEN n <= 150 THEN 'Governing project decision ' || n
                            WHEN n <= 1224 THEN 'Pechka checkpoint ' || n ELSE 'Runtime observation ' || n END,
                       'scale-agent', 'user', '[]', '[]', '[]', '[]', '[]',
                       CASE WHEN n <= 150 THEN 'scale-project' ELSE 'scale-work' END,
                       'scale-cursor', ?,
                       CASE WHEN n <= 150 THEN '{"scope":"subtree","lifecycle":"active"}' ELSE '{}' END,
                       'fixture', 'skipped', 1700000000 + n
                  FROM generated
            ]], { journal_id, base, opened.episode_id })
            test.is_nil(seed_err)
            local fts_err = ops.exec(db, [[
                INSERT INTO chestor_journal_fts(event_id, journal_id, event_type, title, body, tags)
                SELECT id, journal_id, event_type, title, body, tags
                  FROM chestor_journal_events
                 WHERE journal_id = ? AND id LIKE 'scale-%'
            ]], { journal_id })
            db:release()
            test.is_nil(fts_err)

            local resumed = call(user, TOOL.read, {
                journal_id = journal_id, view = "cursor", cursor_id = "scale-cursor",
                limit = 24, inherited_limit = 24, delta_limit = 100,
            })
            test.eq(resumed.context.position.task.id, "scale-work")
            test.eq(#resumed.context.local_work.facts, 24)
            test.is_true(resumed.context.omissions.local_facts.omitted > 0)
            test.eq(resumed.context.omissions.local_facts.total,
                resumed.context.omissions.local_facts.returned + resumed.context.omissions.local_facts.omitted)
            test.eq(#resumed.context.governing, 24)
            test.eq(resumed.context.omissions.governing.omitted, 126)
            test.eq(#resumed.context.delta.events, 100)
            test.eq(resumed.context.delta.scope, "journal")
            test.is_true(resumed.context.delta.has_more)
            test.is_true(resumed.context.omissions.delta.continuation ~= nil)
            local exact = call(user, TOOL.read, {
                journal_id = journal_id, view = "search", query = "scaleuniqueneedle", limit = 5,
            })
            test.eq(#exact.events, 1)
            test.eq(exact.events[1].id, "scale-99999")
        end)

        test.it("finds changes and the next task beyond legacy subtree and ancestor caps", function()
            local user = "deep-" .. uuid()
            local journal_id = create_journal(user)
            local db, db_err = sql.get(types.db_id())
            test.is_nil(db_err)
            local root_err = ops.exec(db, [[
                INSERT INTO chestor_journal_tasks
                    (journal_id, id, parent_task_id, title, status, sort_order,
                     metadata, created_at, updated_at)
                VALUES (?, 'deep-root', NULL, 'Deep project', 'done', 0, '{}', 1, 1)
            ]], { journal_id })
            test.is_nil(root_err)
            local tasks_err = ops.exec(db, [[
                WITH RECURSIVE generated(n) AS (
                    SELECT 1 UNION ALL SELECT n + 1 FROM generated WHERE n < 600
                )
                INSERT INTO chestor_journal_tasks
                    (journal_id, id, parent_task_id, title, status, sort_order,
                     metadata, created_at, updated_at)
                SELECT ?, 'deep-' || n,
                       CASE WHEN n = 1 THEN 'deep-root' ELSE 'deep-' || (n - 1) END,
                       'Deep task ' || n,
                       CASE WHEN n = 600 THEN 'open' ELSE 'done' END,
                       n, '{}', n + 1, n + 1
                  FROM generated
            ]], { journal_id })
            test.is_nil(tasks_err)
            local event_err = ops.exec(db, [[
                INSERT INTO chestor_journal_events
                    (journal_id, id, seq, ts, event_type, title, body, actor_id,
                     actor_type, tags, linked_component_ids, linked_upload_ids,
                     linked_file_paths, linked_task_ids, task_id, metadata,
                     payload_sha256, embedding_status, created_at)
                VALUES (?, 'deep-event', 1, 1, 'observation', 'Deep change',
                        'Visible beyond the old subtree cap', 'deep-agent', 'user',
                        '[]', '[]', '[]', '[]', '[]', 'deep-600', '{}',
                        'deep-fixture', 'skipped', 1)
            ]], { journal_id })
            db:release()
            test.is_nil(event_err)

            local frontier = call(user, TOOL.read, {
                journal_id = journal_id, view = "frontier", task_id = "deep-root", limit = 5,
            })
            test.eq(frontier.frontier.actionable[1].task_id, "deep-600")
            local changes = call(user, TOOL.read, {
                journal_id = journal_id, view = "changes", scope = "subtree",
                task_id = "deep-root", since_seq = 0, limit = 5,
            })
            test.eq(changes.changes.events[1].id, "deep-event")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

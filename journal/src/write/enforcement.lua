local crypto = require("crypto")
local hash = require("hash")
local types = require("types")
local db_ops = require("db")
local reader = require("reader")
local work_classification = require("work_classification")

-- Single owner of the journal enforcement model: capability leases with
-- per-task fencing grants (F1/X9/C5), the T1-T12 transition guard table (F2),
-- gate blocking via blocks-paths (F3), receipt validity and freshness (D2/C1),
-- dependency mutation rules (X11), and the command idempotency ledger (F2).
-- commands.lua is the only mutation caller; queries.lua reuses the guard
-- predicates read-only for Frontier and lens shaping. Guard logic is never
-- duplicated elsewhere.
--
-- Lease-state storage choice: leases, fencing grants, and the command ledger
-- are table state written here at command time, not journal events. Leases are
-- ephemeral server-time capability state that must be checked and granted
-- race-free at the command boundary; the projection fold is asynchronous, so
-- an event-sourced lease could not refuse the second writer in time. F5
-- excludes lease state from the canonical replay scope, so table-only storage
-- keeps I10.7 intact. The projector still folds a ledger backstop row from
-- every transition event so replay rebuilds command identity.
local M = {}

M.DEFAULT_TTL_S = 1800

M.CAPABILITY = { WRITE = "WRITE", PLANNING = "PLANNING", READ = "READ" }

-- Closed enumerated set of system principals (C4).
M.SYSTEM_PRINCIPALS = { reaper = true, scheduler = true, runner = true }

-- C6 terminal set: statuses a descendant may hold under complete/cancel/fold.
local TERMINAL = { done = true, closed = true, canceled = true, cancelled = true, folded = true }

-- Verbs a PLANNING capability permits (F1, C5: request_verify and gate-pass
-- requests stay operable without a WRITE lease).
local PLANNING_VERBS = {
    decompose = true, link = true, unlink = true, record = true, checkpoint = true,
    unblock = true, reopen = true, request_verify = true, gate_pass = true,
}

local VERB_TO = {
    start = "in_progress", complete = "done", block = "blocked", unblock = "in_progress",
    abandon = "abandoned", reopen = "open", close = "closed", cancel = "canceled", fold = "folded",
}

local VERB_FROM = {
    start = { open = true },
    complete = { in_progress = true },
    block = { in_progress = true },
    unblock = { blocked = true },
    abandon = { in_progress = true },
    reopen = { done = true, abandoned = true, canceled = true, cancelled = true },
    close = { done = true },
    cancel = { open = true },
    fold = { in_progress = true },
    gate_pass = { open = true, in_progress = true, blocked = true, done = true },
}

local function trim(value: any): string
    return db_ops.trim(value)
end

local function lower(value: any): string
    return string.lower(trim(value))
end

local function new_id(): (string?, any?)
    local id, id_err = crypto.random.uuid()
    if id_err or not id then return nil, errors.new({ message = "could not generate id: " .. tostring(id_err), kind = errors.INVALID }) end
    return tostring(id), nil
end

function M.refusal(code: string, detail: string?): any
    return { success = false, refused = true, code = code, detail = detail }
end

function M.is_system_principal(name: any): boolean
    return M.SYSTEM_PRINCIPALS[lower(name)] == true
end

-- D3/C8: runner identity is the runtime-trusted `runner` system principal;
-- typed runner identities carry a `runner:` or `runner.` prefix.
function M.is_runner(author: any): boolean
    local id = lower(author)
    return id == "runner" or id:match("^runner[:%.]") ~= nil
end

function M.hash_claim(claim: any): string
    local text = trim(claim)
    if text == "" then return "" end
    return tostring(hash.sha256(text))
end

-- D2 work classification over projected event rows: explicit tags win, then
-- entry kinds outside the non-work set count as work; task/digest/graph/
-- verification machinery events never do.
function M.is_work_fact(event_type: any, tags: any): boolean
    return work_classification.is_work_fact(event_type, tags)
end

-- Maps a read-model status change to the transition verb it represents so
-- upsert_task status edits pass through the same guard table.
function M.verb_for(from_status: any, to_status: any): (string?, any?)
    local from = lower(from_status)
    local to = lower(to_status)
    if from == "" then from = "open" end
    for verb, target in pairs(VERB_TO) do
        if target == to and VERB_FROM[verb] and VERB_FROM[verb][from] then
            return verb, nil
        end
    end
    return nil, errors.new({ message = "no transition maps " .. from .. " -> " .. to, kind = errors.INVALID })
end

function M.task(db: any, journal_id: string, task_id: string): (any?, any?)
    return reader.task(db, journal_id, task_id)
end

function M.receipt(db: any, journal_id: string, receipt_id: string): (any?, any?)
    local id = trim(receipt_id)
    if id == "" then return nil, nil end
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_receipts WHERE journal_id = ? AND receipt_id = ? LIMIT 1",
        { journal_id, id }
    )
    if query_err then return nil, query_err end
    return rows and rows[1] or nil, nil
end

-- X8: work_revision is the journal seq of the last fact under the task.
function M.work_revision(db: any, journal_id: string, task_id: string): (number?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ? AND task_id = ?",
        { journal_id, trim(task_id) }
    )
    if query_err then return nil, query_err end
    return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
end

local function placeholders(count: number): string
    local parts: { string } = {}
    for _ = 1, count do parts[#parts + 1] = "?" end
    return table.concat(parts, ",")
end

local function edge_step(db: any, journal_id: string, ids: { string }, incoming: boolean): (any?, any?)
    local column = incoming and "to_task_id" or "from_task_id"
    local wanted = incoming and "from_task_id" or "to_task_id"
    local params: { any } = { journal_id }
    for _, id in ipairs(ids) do params[#params + 1] = id end
    return db_ops.query(db,
        "SELECT " .. wanted .. " AS next_id FROM chestor_journal_task_deps"
            .. " WHERE journal_id = ? AND kind = 'blocks' AND tombstoned = 0 AND "
            .. column .. " IN (" .. placeholders(#ids) .. ")",
        params
    )
end

-- Bounded BFS over live blocks edges. incoming=true walks toward blockers
-- (edge sources), incoming=false walks toward dependents (edge targets).
local function reachable(db: any, journal_id: string, seeds: { string }, incoming: boolean): (any?, any?)
    local visited: any = {}
    local frontier: { string } = {}
    for _, id in ipairs(seeds) do
        if not visited[id] then
            visited[id] = true
            frontier[#frontier + 1] = id
        end
    end
    local found: { string } = {}
    local budget = 2048
    while #frontier > 0 and budget > 0 do
        local rows, step_err = edge_step(db, journal_id, frontier, incoming)
        if step_err then return nil, step_err end
        frontier = {}
        for _, row in ipairs(rows or {}) do
            local next_id = trim((row :: any).next_id)
            if next_id ~= "" and not visited[next_id] then
                visited[next_id] = true
                found[#found + 1] = next_id
                frontier[#frontier + 1] = next_id
                budget = budget - 1
            end
        end
    end
    return found, nil
end

-- F3: task T is behind gate G iff a live blocks-path G => T exists, or T
-- descends from a task behind G. Seeds are the task plus its ancestor chain;
-- any transitively reachable blocker that is an unpassed gate blocks.
function M.behind_gate(db: any, journal_id: string, task: any): (any?, any?)
    local rows, query_err = db_ops.query(db, [[
        WITH RECURSIVE
        ancestors(id) AS (
            SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?
            UNION
            SELECT t.parent_task_id FROM chestor_journal_tasks t
              JOIN ancestors a ON t.id = a.id
             WHERE t.journal_id = ? AND t.parent_task_id IS NOT NULL AND t.parent_task_id <> ''
        ),
        blockers(id) AS (
            SELECT d.from_task_id FROM chestor_journal_task_deps d
              JOIN ancestors a ON d.to_task_id = a.id
             WHERE d.journal_id = ? AND d.kind = 'blocks' AND d.tombstoned = 0
            UNION
            SELECT d.from_task_id FROM chestor_journal_task_deps d
              JOIN blockers b ON d.to_task_id = b.id
             WHERE d.journal_id = ? AND d.kind = 'blocks' AND d.tombstoned = 0
        )
        SELECT t.id FROM blockers b JOIN chestor_journal_tasks t
          ON t.journal_id = ? AND t.id = b.id
         WHERE t.gate = 1 AND COALESCE(t.passed, 0) = 0
         ORDER BY t.sort_order ASC, t.created_at ASC LIMIT 1
    ]], { journal_id, trim((task :: any).id), journal_id,
        journal_id, journal_id, journal_id })
    if query_err then return nil, query_err end
    if rows and rows[1] then return trim((rows[1] :: any).id), nil end
    return nil, nil
end

-- T1 deps rule: each live incoming blocks edge is satisfied when its source
-- is a passed gate, or a done/closed non-gate task.
function M.deps_satisfied(db: any, journal_id: string, task_id: string): (any?, any?)
    local rows, query_err = db_ops.query(db, [[
        SELECT d.from_task_id, t.status, t.gate, t.passed
          FROM chestor_journal_task_deps d
          LEFT JOIN chestor_journal_tasks t
            ON t.journal_id = d.journal_id AND t.id = d.from_task_id
         WHERE d.journal_id = ? AND d.to_task_id = ? AND d.kind = 'blocks' AND d.tombstoned = 0
    ]], { journal_id, trim(task_id) })
    if query_err then return nil, query_err end
    local open: { string } = {}
    for _, row in ipairs(rows or {}) do
        local dep = row :: any
        local satisfied
        if tonumber(dep.gate) == 1 then
            satisfied = tonumber(dep.passed) == 1
        else
            local status = lower(dep.status)
            satisfied = status == "done" or status == "closed"
        end
        if not satisfied then open[#open + 1] = trim(dep.from_task_id) end
    end
    return { satisfied = #open == 0, open = open }, nil
end

-- C6: complete/cancel/fold refuse while any descendant holds a non-terminal
-- status (outside done/closed/canceled/folded).
function M.non_terminal_descendants(db: any, journal_id: string, task_id: string): (number?, any?)
    local rows, query_err = db_ops.query(db, [[
        WITH RECURSIVE sub(id) AS (
            SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND parent_task_id = ?
            UNION
            SELECT t.id FROM chestor_journal_tasks t JOIN sub s ON t.parent_task_id = s.id
             WHERE t.journal_id = ?
        )
        SELECT COUNT(*) AS n FROM chestor_journal_tasks
         WHERE journal_id = ? AND id IN (SELECT id FROM sub)
           AND lower(status) NOT IN ('done','closed','canceled','cancelled','folded')
    ]], { journal_id, trim(task_id), journal_id, journal_id })
    if query_err then return nil, query_err end
    return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
end

function M.child_count(db: any, journal_id: string, task_id: string): (number?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT COUNT(*) AS n FROM chestor_journal_tasks WHERE journal_id = ? AND parent_task_id = ?",
        { journal_id, trim(task_id) }
    )
    if query_err then return nil, query_err end
    return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
end

-- D2 + C1 validity predicate over a stored receipt and the current task row.
-- Artifact availability reduces to artifact_hash presence in B1; the managed
-- artifact store lands with the verifier runners.
function M.receipt_predicates(db: any, journal_id: string, receipt: any, task: any): (any?, any?)
    local checks: any = {}
    local code: string? = nil
    local function fail(check: string, refusal_code: string)
        checks[check] = false
        if code == nil then code = refusal_code end
    end
    if trim(receipt.task_id) == trim(task.id) then checks.task_match = true
    else fail("task_match", "receipt_invalid") end
    local task_revision = tonumber(task.revision) or 1
    if tonumber(receipt.task_revision) == task_revision then checks.revision_match = true
    else fail("revision_match", "receipt_stale") end
    if trim(receipt.policy_hash) == trim(task.verifier_policy_hash) then checks.policy_match = true
    else fail("policy_match", "receipt_invalid") end
    if lower(receipt.verdict) == "pass" then checks.verdict_pass = true
    else fail("verdict_pass", "receipt_invalid") end
    if M.is_runner(receipt.author) then checks.author_runner = true
    else fail("author_runner", "author_not_runner") end
    if trim(receipt.artifact_hash) ~= "" then checks.artifact_available = true
    else fail("artifact_available", "receipt_invalid") end
    -- C1: the receipt's claim hash must equal the hash of the completing
    -- task's declared claim; a receipt for a different claim never completes.
    if trim(receipt.claim_hash) == M.hash_claim(task.claim) then checks.claim_match = true
    else fail("claim_match", "claim_mismatch") end
    if tonumber(receipt.stale) == 1 then fail("not_marked_stale", "receipt_stale")
    else checks.not_marked_stale = true end

    -- fresh(receipt, task): no work-tagged fact under the task after the
    -- receipt's work_revision (I8.2 evaluates this at transition time).
    local work_revision = tonumber(receipt.work_revision) or 0
    local rows, query_err = db_ops.query(db, [[
        SELECT event_type, tags, seq FROM chestor_journal_events
         WHERE journal_id = ? AND task_id = ? AND seq > ?
         ORDER BY seq ASC LIMIT 200
    ]], { journal_id, trim(task.id), work_revision })
    if query_err then return nil, query_err end
    checks.fresh = true
    for _, row in ipairs(rows or {}) do
        local event = row :: any
        if M.is_work_fact(event.event_type, db_ops.decode(event.tags, {})) then
            checks.fresh = false
            checks.superseded_by_seq = tonumber(event.seq)
            if code == nil then code = "receipt_stale" end
            break
        end
    end

    local valid = checks.task_match == true and checks.revision_match == true
        and checks.policy_match == true and checks.verdict_pass == true
        and checks.author_runner == true and checks.artifact_available == true
        and checks.claim_match == true and checks.not_marked_stale == true
    return { valid = valid, fresh = checks.fresh == true, code = code, checks = checks }, nil
end

-- X3 executable output validation: a deliberately small JSON Schema subset
-- (type, required, properties, items, enum) — enough to refuse structurally
-- invalid declared outputs; semantic validation stays with verifier policy.
function M.validate_schema(schema: any, value: any): (boolean, any?)
    if type(schema) ~= "table" then return true, nil end
    local spec = schema :: any
    local wanted = trim(spec.type)
    if wanted ~= "" then
        local actual = type(value)
        local matches
        if wanted == "object" then
            matches = actual == "table"
        elseif wanted == "array" then
            matches = actual == "table"
        elseif wanted == "string" then
            matches = actual == "string"
        elseif wanted == "boolean" then
            matches = actual == "boolean"
        elseif wanted == "number" then
            matches = actual == "number"
        elseif wanted == "integer" then
            matches = actual == "number" and value == math.floor(value :: number)
        elseif wanted == "null" then
            matches = value == nil
        else
            matches = true
        end
        if not matches then return false, "expected " .. wanted .. ", got " .. actual end
    end
    if type(spec.enum) == "table" then
        local found = false
        for _, allowed in ipairs(spec.enum :: { any }) do
            if allowed == value then found = true end
        end
        if not found then return false, "value not in enum" end
    end
    if type(value) == "table" then
        local record = value :: any
        if type(spec.required) == "table" then
            for _, key in ipairs(spec.required :: { any }) do
                if record[tostring(key)] == nil then return false, "missing required field " .. tostring(key) end
            end
        end
        if type(spec.properties) == "table" then
            for key, sub in pairs(spec.properties :: any) do
                if record[key] ~= nil then
                    local ok, reason = M.validate_schema(sub, record[key])
                    if not ok then return false, tostring(key) .. ": " .. tostring(reason) end
                end
            end
        end
        if type(spec.items) == "table" then
            for index, item in ipairs(record :: { any }) do
                local ok, reason = M.validate_schema(spec.items, item)
                if not ok then return false, "[" .. tostring(index) .. "]: " .. tostring(reason) end
            end
        end
    end
    return true, nil
end

local function guard_receipt(db: any, journal_id: string, task: any, args: any, evaluations: any): (any?, any?)
    local receipt_id = trim(args.receipt_id)
    if receipt_id == "" then return M.refusal("receipt_missing", "receipt_id is required"), nil end
    local receipt, receipt_err = M.receipt(db, journal_id, receipt_id)
    if receipt_err then return nil, receipt_err end
    if not receipt then return M.refusal("receipt_missing", "no receipt " .. receipt_id), nil end
    local predicates, predicate_err = M.receipt_predicates(db, journal_id, receipt, task)
    if predicate_err then return nil, predicate_err end
    local evaluated = predicates :: any
    evaluations.receipt_id = receipt_id
    evaluations.receipt_valid = evaluated.valid
    evaluations.receipt_fresh = evaluated.fresh
    evaluations.receipt_checks = evaluated.checks
    evaluations.receipt_author = trim((receipt :: any).author)
    if not (evaluated.valid and evaluated.fresh) then
        return M.refusal(tostring(evaluated.code or "receipt_invalid"),
            "receipt " .. receipt_id .. " fails valid∧fresh"), nil
    end
    return nil, nil
end

-- The T1-T12 guard table (F2, amended by C1/C2/C3/C6, F6, F7). Returns
-- { ok, to_status, evaluations } or a refusal; evaluations are recorded on the
-- transition event so done-at-commit is replayable without re-evaluation (C3).
function M.guard_transition(db: any, journal_id: string, task: any, verb: string, args: any): (any?, any?)
    args = type(args) == "table" and args or {}
    local evaluations: any = { verb = verb }
    local status = lower((task :: any).status)
    if status == "" then status = "open" end
    local from_set = VERB_FROM[verb]
    if not from_set then return M.refusal("invalid_transition", "unknown verb: " .. verb), nil end
    if not from_set[status] then
        return M.refusal("invalid_transition", verb .. " is not valid from " .. status), nil
    end
    evaluations.from_status = status
    local revision = tonumber((task :: any).revision) or 1
    if args.expected_revision ~= nil and tonumber(args.expected_revision) ~= revision then
        return M.refusal("revision_stale",
            "expected revision " .. tostring(args.expected_revision) .. ", task is at " .. tostring(revision)), nil
    end
    evaluations.revision = revision
    local task_id = trim((task :: any).id)

    if verb == "start" then
        local gate_id, gate_err = M.behind_gate(db, journal_id, task)
        if gate_err then return nil, gate_err end
        if gate_id then return M.refusal("behind_gate", "unpassed gate " .. tostring(gate_id) .. " blocks this task"), nil end
        evaluations.not_behind_gate = true
        local deps, deps_err = M.deps_satisfied(db, journal_id, task_id)
        if deps_err then return nil, deps_err end
        if not (deps :: any).satisfied then
            return M.refusal("blocked_by", "open blocking deps: " .. table.concat((deps :: any).open, ", ")), nil
        end
        evaluations.deps_satisfied = true
    elseif verb == "complete" then
        if trim(args.result) == "" then return M.refusal("result_required", "complete requires a result"), nil end
        evaluations.result_present = true
        local open_descendants, desc_err = M.non_terminal_descendants(db, journal_id, task_id)
        if desc_err then return nil, desc_err end
        if (open_descendants :: number) > 0 then
            return M.refusal("descendants", tostring(open_descendants) .. " non-terminal descendants"), nil
        end
        evaluations.no_open_descendants = true
        local deps, deps_err = M.deps_satisfied(db, journal_id, task_id)
        if deps_err then return nil, deps_err end
        if not (deps :: any).satisfied then
            return M.refusal("blocked_by", "late blocking deps: " .. table.concat((deps :: any).open, ", ")), nil
        end
        evaluations.deps_satisfied = true
        -- I3.1: the declared output must satisfy the task contract's output
        -- schema before evidence is even considered.
        local metadata = db_ops.decode((task :: any).metadata, {})
        local contract = type(metadata) == "table" and (metadata :: any).contract or nil
        if type(contract) == "table" and type((contract :: any).output_schema) == "table" then
            local output: any = args.result
            if type(output) == "string" then
                local decoded = db_ops.decode(output, nil)
                if decoded ~= nil then output = decoded end
            end
            local schema_ok, schema_reason = M.validate_schema((contract :: any).output_schema, output)
            if not schema_ok then
                return M.refusal("contract", "output fails contract schema: " .. tostring(schema_reason)), nil
            end
            evaluations.contract_valid = true
        end
        -- Audit coverage is proof of what was inspected, including negative
        -- findings. A declared audit surface cannot close through a polished
        -- summary while units are absent; gaps require their recorded decision.
        local required = type(metadata) == "table"
            and ((metadata :: any).required_coverage or (metadata :: any).coverage_units) or nil
        if type(required) == "table" and #required > 0 then
            local coverage_rows, coverage_err = db_ops.query(db, [[
                SELECT unit_key, status, gap_decision_id
                  FROM chestor_journal_audit_coverage
                 WHERE journal_id = ? AND audit_task_id = ?
            ]], { journal_id, task_id })
            if coverage_err then return nil, coverage_err end
            local covered: any = {}
            local counts: any = { finding = 0, checked_clean = 0, gap = 0, not_applicable = 0 }
            for _, row in ipairs(coverage_rows or {}) do
                local key = trim((row :: any).unit_key)
                local coverage_status = lower((row :: any).status)
                if coverage_status ~= "gap" or trim((row :: any).gap_decision_id) ~= "" then
                    covered[key] = true
                    counts[coverage_status] = (tonumber(counts[coverage_status]) or 0) + 1
                end
            end
            local missing: { string } = {}
            for _, raw in ipairs(required :: { any }) do
                local key = type(raw) == "table" and trim((raw :: any).unit_key or (raw :: any).key)
                    or trim(raw)
                if key ~= "" and not covered[key] then missing[#missing + 1] = key end
            end
            if #missing > 0 then
                local refusal = M.refusal("coverage_incomplete",
                    "audit coverage missing: " .. table.concat(missing, ", "))
                refusal.missing_units = missing
                return refusal, nil
            end
            evaluations.audit_coverage = counts
        end
        if type(args.waiver) == "table" then
            -- T12: waiver/accepted-risk is an annotation consumed here, and
            -- F6 hard-requires an attached decision.
            local waiver_decision_id = trim((args.waiver :: any).decision_id)
            if waiver_decision_id == "" then
                return M.refusal("decide_required", "waiver requires decision_id"), nil
            end
            -- F6: the waiver's decision_id must resolve to a decision-kind
            -- fact; any other event id cannot authorize skipping evidence.
            local decision_rows, decision_err = db_ops.query(db,
                "SELECT event_type FROM chestor_journal_events WHERE journal_id = ? AND id = ? LIMIT 1",
                { journal_id, waiver_decision_id }
            )
            if decision_err then return nil, decision_err end
            local decision = decision_rows and decision_rows[1]
            if not decision then
                return M.refusal("decision_kind",
                    "waiver decision_id " .. waiver_decision_id .. " resolves to no fact"), nil
            end
            if lower((decision :: any).event_type) ~= "decision" then
                return M.refusal("decision_kind",
                    "waiver decision_id " .. waiver_decision_id .. " is a "
                        .. lower((decision :: any).event_type) .. " fact, not a decision"), nil
            end
            evaluations.waived = true
            evaluations.waiver_kind = lower((args.waiver :: any).kind) == "accepted_risk" and "accepted_risk" or "waived"
            evaluations.waiver_decision_id = waiver_decision_id
        else
            local refusal, receipt_err = guard_receipt(db, journal_id, task, args, evaluations)
            if receipt_err then return nil, receipt_err end
            if refusal then return refusal, nil end
            -- I3.2/D4: a high-impact task (gate or P0/P1) requires a validator
            -- identity independent of the executor and of the parent-branch
            -- assignee.
            local priority = lower((task :: any).priority)
            local high_impact = tonumber((task :: any).gate) == 1 or priority == "p0" or priority == "p1"
            if high_impact then
                local validator = tostring(evaluations.receipt_author or "")
                local executor = trim(args.acting_agent)
                local parent_assignee = ""
                local parent_id = trim((task :: any).parent_task_id)
                if parent_id ~= "" then
                    local parent, parent_err = M.task(db, journal_id, parent_id)
                    if parent_err then return nil, parent_err end
                    if parent then parent_assignee = trim((parent :: any).assignee) end
                end
                if validator ~= "" and ((executor ~= "" and validator == executor)
                    or (parent_assignee ~= "" and validator == parent_assignee)) then
                    return M.refusal("independence",
                        "high-impact validator must differ from the executor and the parent assignee"), nil
                end
                evaluations.independent_validator = true
            end
        end
    elseif verb == "block" then
        if trim(args.reason) == "" then return M.refusal("reason_required", "block requires a recorded reason"), nil end
        evaluations.reason_present = true
    elseif verb == "unblock" then
        local deps, deps_err = M.deps_satisfied(db, journal_id, task_id)
        if deps_err then return nil, deps_err end
        evaluations.deps_satisfied = (deps :: any).satisfied
        if not (deps :: any).satisfied and trim(args.decision_id) == "" then
            return M.refusal("decide_required", "unblock with uncleared condition requires decision_id"), nil
        end
    elseif verb == "abandon" then
        evaluations.authority = trim(args.principal) ~= "" and trim(args.principal) or "lease_owner"
    elseif verb == "reopen" then
        if trim(args.decision_id) == "" then return M.refusal("decide_required", "reopen requires decision_id"), nil end
        evaluations.decision_id = trim(args.decision_id)
        evaluations.receipts_marked_stale = status == "done"
    elseif verb == "close" then
        local parent_id = trim((task :: any).parent_task_id)
        if parent_id ~= "" then
            local parent, parent_err = M.task(db, journal_id, parent_id)
            if parent_err then return nil, parent_err end
            if parent and not TERMINAL[lower((parent :: any).status)] then
                return M.refusal("parent_open", "close requires the parent rollup consumed"), nil
            end
        end
        evaluations.parent_rollup_consumed = true
    elseif verb == "cancel" then
        local open_descendants, desc_err = M.non_terminal_descendants(db, journal_id, task_id)
        if desc_err then return nil, desc_err end
        if (open_descendants :: number) > 0 then
            return M.refusal("descendants", tostring(open_descendants) .. " non-terminal descendants"), nil
        end
        evaluations.no_open_descendants = true
        local children, child_err = M.child_count(db, journal_id, task_id)
        if child_err then return nil, child_err end
        if (children :: number) > 0 and trim(args.decision_id) == "" then
            return M.refusal("decide_required", "cancel over children requires decision_id"), nil
        end
        evaluations.children = children
    elseif verb == "fold" then
        local metadata = db_ops.decode((task :: any).metadata, {})
        if not (type(metadata) == "table" and (metadata :: any).experiment) then
            return M.refusal("not_experiment", "fold applies to experiment tasks only"), nil
        end
        if trim(args.outcome) == "" or trim(args.distilled) == "" then
            return M.refusal("fold_incomplete", "fold requires outcome and distilled result"), nil
        end
        evaluations.outcome = lower(args.outcome)
        local open_descendants, desc_err = M.non_terminal_descendants(db, journal_id, task_id)
        if desc_err then return nil, desc_err end
        if (open_descendants :: number) > 0 then
            return M.refusal("descendants", tostring(open_descendants) .. " non-terminal descendants"), nil
        end
        evaluations.no_open_descendants = true
    elseif verb == "gate_pass" then
        if tonumber((task :: any).gate) ~= 1 then
            return M.refusal("not_gate", "gate-pass applies to gate tasks only"), nil
        end
        if not M.is_runner(args.principal) then
            return M.refusal("author_not_runner", "gate-pass is runner-verified"), nil
        end
        evaluations.author = trim(args.principal)
        -- C2: a gate passes only on a valid AND fresh receipt.
        local refusal, receipt_err = guard_receipt(db, journal_id, task, args, evaluations)
        if receipt_err then return nil, receipt_err end
        if refusal then return refusal, nil end
    end

    return { ok = true, to_status = VERB_TO[verb], evaluations = evaluations }, nil
end

-- X11: append-only edges; add validation runs against live edges only.
function M.validate_dep_add(db: any, journal_id: string, from_id: string, to_id: string, kind: string): (any?, any?)
    if trim(from_id) == trim(to_id) then return M.refusal("self_dependency", "a task cannot depend on itself"), nil end
    for _, id in ipairs({ trim(from_id), trim(to_id) }) do
        local task, task_err = M.task(db, journal_id, id)
        if task_err then return nil, task_err end
        if task and lower((task :: any).status) == "folded" then
            return M.refusal("folded", "dependencies on folded task " .. id .. " are refused; depend on the parent fact"), nil
        end
    end
    if lower(kind) == "blocks" then
        -- I11.1: adding from->to creates a cycle iff `from` is already
        -- reachable from `to` over live blocks edges.
        local downstream, reach_err = reachable(db, journal_id, { trim(to_id) }, false)
        if reach_err then return nil, reach_err end
        for _, id in ipairs(downstream :: { string }) do
            if id == trim(from_id) then
                return M.refusal("cycle", "edge " .. from_id .. " -> " .. to_id .. " closes a dependency cycle"), nil
            end
        end
    end
    return { ok = true }, nil
end

-- I11.2: removal is a tombstone event and hard-requires a decision (F6).
function M.validate_dep_remove(db: any, journal_id: string, from_id: string, to_id: string, kind: string, decision_id: any): (any?, any?)
    if trim(decision_id) == "" then
        return M.refusal("decide_required", "dependency removal requires decision_id"), nil
    end
    local rows, query_err = db_ops.query(db, [[
        SELECT 1 AS present FROM chestor_journal_task_deps
         WHERE journal_id = ? AND from_task_id = ? AND to_task_id = ? AND kind = ? AND tombstoned = 0 LIMIT 1
    ]], { journal_id, trim(from_id), trim(to_id), lower(kind) ~= "" and lower(kind) or "blocks" })
    if query_err then return nil, query_err end
    if not (rows and rows[1]) then return M.refusal("dep_not_found", "no live dependency to remove"), nil end
    return { ok = true }, nil
end

-- F1: WRITE when the task is startable or resumable, PLANNING otherwise. C5:
-- at most one mutation lease (WRITE or PLANNING) per task; the fencing grant
-- is per task, monotonic, and fixed for the lease lifetime (X9).
function M.lease_issue(db: any, journal_id: string, agent_id: string, task_id: string): (any?, any?)
    local task, task_err = M.task(db, journal_id, task_id)
    if task_err then return nil, task_err end
    if not task then return nil, errors.new({ message = "task not found: " .. task_id, kind = errors.NOT_FOUND }) end
    local now = db_ops.now()
    local tx, tx_err = db:begin()
    if tx_err or not tx then return nil, errors.new({ message = "lease transaction failed: " .. tostring(tx_err), kind = errors.INVALID }) end
    local live, live_err = db_ops.query(tx, [[
        SELECT lease_id, agent_id, expires_at FROM chestor_journal_leases
         WHERE journal_id = ? AND task_id = ? AND revoked = 0 AND expires_at > ? LIMIT 1
    ]], { journal_id, trim(task_id), now })
    if live_err then tx:rollback(); return nil, live_err end
    if live and live[1] then
        local holder = live[1] :: any
        if trim(holder.agent_id) ~= trim(agent_id) then
            tx:rollback()
            local refusal = M.refusal("leased",
                "leased by " .. tostring(holder.agent_id) .. ", expires " .. tostring(holder.expires_at))
            local annotated = refusal :: any
            annotated.holder = holder.agent_id
            annotated.expires_at = tonumber(holder.expires_at)
            return refusal, nil
        end
        -- X5 reconciliation: the holding agent re-opening its own branch gets a
        -- fresh lease with a recomputed capability and a higher fencing grant;
        -- any zombie carrying the old lease is fenced out by the new token.
        local revoke_err = db_ops.exec(tx,
            "UPDATE chestor_journal_leases SET revoked = 1 WHERE journal_id = ? AND lease_id = ?",
            { journal_id, trim(holder.lease_id) }
        )
        if revoke_err then tx:rollback(); return nil, revoke_err end
    end

    local status = lower((task :: any).status)
    local capability = M.CAPABILITY.PLANNING
    local lease_state = "planning"
    local reason = "task_" .. (status ~= "" and status or "unknown")
    local next_action: any = nil
    -- A lease is concurrency authority, not task lifecycle. Once a task has
    -- started, losing or deliberately refreshing that authority must leave it
    -- directly resumable; requiring an open-only grant strands every
    -- in_progress task behind a PLANNING lease.
    if status == "in_progress" then
        capability = M.CAPABILITY.WRITE
        lease_state = "resume"
        reason = "task_in_progress"
        next_action = { tool = "JournalFact", task_id = trim(task_id) }
    elseif status == "open" then
        local gate_id, gate_err = M.behind_gate(tx, journal_id, task)
        if gate_err then tx:rollback(); return nil, gate_err end
        if not gate_id then
            local deps, deps_err = M.deps_satisfied(tx, journal_id, trim(task_id))
            if deps_err then tx:rollback(); return nil, deps_err end
            if (deps :: any).satisfied then
                capability = M.CAPABILITY.WRITE
                lease_state = "start"
                reason = "task_startable"
                next_action = { tool = "ActOnJournal", verb = "start", task_id = trim(task_id) }
            else
                reason = "blocked_by_dependency"
                next_action = { tool = "ReadJournal", view = "frontier", category = "blocked_by", task_id = trim(task_id) }
            end
        else
            reason = "behind_gate"
            next_action = { tool = "ActOnJournal", verb = "gate_pass", task_id = tostring(gate_id) }
        end
    elseif status == "blocked" then
        next_action = { tool = "ActOnJournal", verb = "unblock", task_id = trim(task_id) }
    elseif status == "abandoned" or status == "done" or status == "canceled" or status == "cancelled" then
        -- PLANNING is deliberately enough for the decision-backed reopen. The
        -- caller then opens the now-open branch once more to receive WRITE.
        next_action = {
            tool = "ActOnJournal", verb = "reopen", task_id = trim(task_id),
            requires = { "decision_id" },
            then_next = { tool = "ActOnJournal", verb = "open_branch", task_id = trim(task_id) },
        }
    end

    local grant_rows, grant_err = db_ops.query(tx,
        "SELECT highest_granted FROM chestor_journal_task_fencing WHERE journal_id = ? AND task_id = ? LIMIT 1",
        { journal_id, trim(task_id) }
    )
    if grant_err then tx:rollback(); return nil, grant_err end
    local fencing_token = (grant_rows and grant_rows[1] and tonumber((grant_rows[1] :: any).highest_granted) or 0) + 1
    local grant_write_err = db_ops.exec(tx, [[
        INSERT INTO chestor_journal_task_fencing (journal_id, task_id, highest_granted)
        VALUES (?, ?, ?)
        ON CONFLICT(journal_id, task_id) DO UPDATE SET highest_granted = excluded.highest_granted
    ]], { journal_id, trim(task_id), fencing_token })
    if grant_write_err then tx:rollback(); return nil, grant_write_err end

    local lease_id, id_err = new_id()
    if not lease_id then tx:rollback(); return nil, id_err end
    local expires_at = now + M.DEFAULT_TTL_S
    local insert_err = db_ops.exec(tx, [[
        INSERT INTO chestor_journal_leases
            (journal_id, lease_id, agent_id, task_id, capability, fencing_token, issued_at, ttl_s, expires_at, revoked)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    ]], { journal_id, lease_id, trim(agent_id), trim(task_id), capability, fencing_token, now, M.DEFAULT_TTL_S, expires_at })
    if insert_err then tx:rollback(); return nil, insert_err end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.new({ message = "lease commit failed: " .. tostring(commit_err), kind = errors.INVALID }) end
    return {
        success = true,
        lease_id = lease_id,
        agent_id = trim(agent_id),
        task_id = trim(task_id),
        capability = capability,
        fencing_token = fencing_token,
        issued_at = now,
        ttl_s = M.DEFAULT_TTL_S,
        expires_at = expires_at,
        state = lease_state,
        reason = reason,
        next = next_action,
    }, nil
end

-- Lease liveness shared by transitions and fact attachment: the lease must
-- exist, be unrevoked and unexpired (server clock only), and still be the
-- highest grant for its task (zombie fencing). fencing_token is optional
-- here: fact attachment resolves by lease_id alone, while lease_check always
-- supplies the token. Returns the lease row or a coded refusal.
function M.lease_resolve(db: any, journal_id: string, lease_id: string, fencing_token: any): (any?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_leases WHERE journal_id = ? AND lease_id = ? LIMIT 1",
        { journal_id, trim(lease_id) }
    )
    if query_err then return nil, query_err end
    local lease = rows and rows[1]
    if not lease then return M.refusal("lease_expired", "no such lease: " .. trim(lease_id)), nil end
    local row = lease :: any
    if tonumber(row.revoked) == 1 then
        local refusal = M.refusal("lease_revoked", "lease was revoked; open the branch again to resume")
        refusal.recoverable = true
        refusal.task_id = trim(row.task_id)
        refusal.next = { tool = "ActOnJournal", verb = "open_branch", task_id = trim(row.task_id) }
        return refusal, nil
    end
    if (tonumber(row.expires_at) or 0) <= db_ops.now() then
        local refusal = M.refusal("lease_expired",
            "lease expired at " .. tostring(row.expires_at) .. "; the task is resumable through open_branch")
        refusal.recoverable = true
        refusal.task_id = trim(row.task_id)
        refusal.next = { tool = "ActOnJournal", verb = "open_branch", task_id = trim(row.task_id) }
        return refusal, nil
    end
    if fencing_token ~= nil and tonumber(fencing_token) ~= tonumber(row.fencing_token) then
        return M.refusal("fencing_stale", "fencing token does not match the lease grant"), nil
    end
    local grant_rows, grant_err = db_ops.query(db,
        "SELECT highest_granted FROM chestor_journal_task_fencing WHERE journal_id = ? AND task_id = ? LIMIT 1",
        { journal_id, trim(row.task_id) }
    )
    if grant_err then return nil, grant_err end
    local highest = grant_rows and grant_rows[1] and tonumber((grant_rows[1] :: any).highest_granted) or 0
    if (tonumber(row.fencing_token) or 0) < highest then
        local refusal = M.refusal("fencing_stale",
            "a newer grant (" .. tostring(highest) .. ") supersedes this lease; open the branch again")
        refusal.recoverable = true
        refusal.task_id = trim(row.task_id)
        refusal.next = { tool = "ActOnJournal", verb = "open_branch", task_id = trim(row.task_id) }
        return refusal, nil
    end
    return lease, nil
end

-- X9 lease validation: server clock only; the token must match the lease's
-- own grant and still be the highest granted for the task (zombie fencing).
-- task_id, when given, pins the write to the lease's own task: a lease for
-- another task is a stale pointer and refuses via fencing (I5.1).
function M.lease_check(db: any, journal_id: string, lease_id: string, fencing_token: any, verb: string, task_id: any): (any?, any?)
    -- An absent token is a distinct refusal from a mismatched one: the caller
    -- forgot to carry the grant, not lost a race to a newer one.
    if fencing_token == nil then
        return M.refusal("fencing_missing", "fencing_token from open_branch is required"), nil
    end
    if tonumber(fencing_token) == nil then
        return M.refusal("fencing_stale", "fencing token does not match the lease grant"), nil
    end
    local lease, resolve_err = M.lease_resolve(db, journal_id, lease_id, fencing_token)
    if resolve_err then return nil, resolve_err end
    if (lease :: any).refused then return lease, nil end
    local row = lease :: any
    if trim(task_id) ~= "" and trim(row.task_id) ~= trim(task_id) then
        return M.refusal("fencing_stale",
            "stale pointer: lease is bound to task " .. tostring(row.task_id) .. ", not " .. trim(task_id)), nil
    end
    if row.capability ~= M.CAPABILITY.WRITE then
        if row.capability ~= M.CAPABILITY.PLANNING or not PLANNING_VERBS[verb] then
            return M.refusal("capability", tostring(row.capability) .. " capability does not permit " .. verb), nil
        end
    end
    return lease, nil
end

-- T1 startability over the guard predicates, shared by the Frontier scan and
-- the lens `next` pointer (queries owns the read shaping; the guards live
-- here). Returns { startable = true } or { category, reason } naming the
-- Frontier exclusion bucket.
function M.startability(db: any, journal_id: string, task: any): (any?, any?)
    local gate_id, gate_err = M.behind_gate(db, journal_id, task)
    if gate_err then return nil, gate_err end
    if gate_id then
        return { category = "behind_gate", reason = "behind unpassed gate " .. tostring(gate_id) }, nil
    end
    local deps, deps_err = M.deps_satisfied(db, journal_id, trim((task :: any).id))
    if deps_err then return nil, deps_err end
    if not (deps :: any).satisfied then
        return { category = "blocked_by", reason = "blocked by open deps: " .. table.concat((deps :: any).open, ", ") }, nil
    end
    local leases, lease_err = db_ops.query(db, [[
        SELECT agent_id, expires_at FROM chestor_journal_leases
         WHERE journal_id = ? AND task_id = ? AND revoked = 0 AND expires_at > ? LIMIT 1
    ]], { journal_id, trim((task :: any).id), db_ops.now() })
    if lease_err then return nil, lease_err end
    if leases and leases[1] then
        local holder = leases[1] :: any
        return { category = "leased",
            reason = "leased by " .. tostring(holder.agent_id) .. ", expires " .. tostring(holder.expires_at) }, nil
    end
    return { startable = true }, nil
end

-- Any successful write renews the lease (X9).
function M.lease_renew(db: any, journal_id: string, lease_id: string): error?
    local now = db_ops.now()
    return db_ops.exec(db, [[
        UPDATE chestor_journal_leases SET expires_at = ? + ttl_s
         WHERE journal_id = ? AND lease_id = ? AND revoked = 0
    ]], { now, journal_id, trim(lease_id) })
end

local function command_lookup(db: any, journal_id: string, command_id: string): (any?, any?)
    local rows, query_err = db_ops.query(db,
        "SELECT result_json FROM chestor_journal_commands WHERE journal_id = ? AND command_id = ? LIMIT 1",
        { journal_id, command_id }
    )
    if query_err then return nil, query_err end
    if not (rows and rows[1]) then return nil, nil end
    return db_ops.decode((rows[1] :: any).result_json, { success = true, replayed = true }), nil
end

local function command_store(db: any, journal_id: string, command_id: string, result: any): error?
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_commands (journal_id, command_id, event_id, result_json, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, command_id) DO NOTHING
    ]], { journal_id, command_id, trim((result :: any).event_id) ~= "" and (result :: any).event_id or nil,
        db_ops.encode(result, {}), db_ops.now() })
end

-- F2 idempotency boundary: a duplicate command_id returns the stored result
-- and appends nothing. Refusals are results too - a retry after fixing state
-- must carry a fresh command_id.
function M.with_command(journal_id: string, command_id: any, fn: any): (any?, any?)
    local id = trim(command_id)
    if id == "" then
        local generated, id_err = new_id()
        if not generated then return nil, id_err end
        id = generated
    end
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local stored, lookup_err = command_lookup(db, journal_id, id)
    if lookup_err then db:release(); return nil, lookup_err end
    if stored then
        db:release()
        local replayed = stored :: any
        replayed.duplicate = true
        return stored, nil
    end
    local result, run_err = fn(db, id)
    if run_err or result == nil then
        db:release()
        return nil, run_err or "command produced no result"
    end
    local annotated = result :: any
    annotated.command_id = id
    local store_err = command_store(db, journal_id, id, result)
    db:release()
    if store_err then return nil, store_err end
    return result, nil
end

return M

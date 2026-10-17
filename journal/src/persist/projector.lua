local time = require("time")
local hash = require("hash")
local types = require("types")
local db_ops = require("db")
local reader = require("reader")
local search_text = require("search_text")
local work_classification = require("work_classification")
local branch_digests = require("branch_digests")

local M = {}

local function copy_table(value: any): any
    local out = {}
    if type(value) ~= "table" then return out end
    for key, item in pairs(value :: any) do out[key] = item end
    return out
end

local function event_body(event: any): any
    local body = type(event) == "table" and (event :: any).body or {}
    if type(body) == "string" then return copy_table(db_ops.decode(body, {})) end
    return copy_table(body)
end

local function next_seq(db: any, journal_id: string): number
    local rows = db_ops.query(db,
        "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
        { journal_id }
    )
    return type(rows) == "table" and rows[1] and (tonumber((rows[1] :: any).n) or 0) + 1 or 1
end

local function write_fts(db: any, journal_id: string, rows: { any }): error?
    if #rows == 0 then return nil end
    local dialect, dialect_err = db_ops.database_type(db)
    if not dialect then return dialect_err end
    local suffix = "ON CONFLICT(journal_id, event_id) DO UPDATE SET event_type = excluded.event_type, "
        .. "title = excluded.title, body = excluded.body, tags = excluded.tags"
    if dialect == "sqlite" then
        suffix = ""
        for offset = 1, #rows, 100 do
            local marks: { string } = {}
            local params: { any } = { journal_id }
            for index = offset, math.min(#rows, offset + 99) do
                marks[#marks + 1] = "?"
                params[#params + 1] = rows[index][1]
            end
            local reset_err = db_ops.exec(db,
                "DELETE FROM chestor_journal_fts WHERE journal_id = ? AND event_id IN ("
                    .. table.concat(marks, ",") .. ")", params)
            if reset_err then return reset_err end
        end
    end
    return db_ops.insert_rows(db,
        "INSERT INTO chestor_journal_fts(event_id, journal_id, event_type, title, body, tags)",
        rows, 6, suffix)
end

local function stale_receipts(db: any, journal_id: string, task_id: string, reason: string): error?
    return db_ops.exec(db, [[
        UPDATE chestor_journal_receipts SET stale = 1, stale_reason = ?
         WHERE journal_id = ? AND task_id = ? AND stale = 0
    ]], { reason, journal_id, task_id })
end

-- Derived rows carry the event's own timestamp, never projection wall time:
-- I10.7 requires replaying the log at any later moment to reproduce the read
-- model byte-equal.
local function upsert_task(db: any, journal_id: string, event_id: string, body: any, timestamp: number, seq: number): error?
    local task_id = db_ops.trim(body.task_id or body.id)
    if task_id == "" then return nil end
    local status = db_ops.trim(body.status)
    if status == "" then status = "open" end
    local terminal = types.TERMINAL_TASK_STATUS[string.lower(status)] == true
    local existing_rows, existing_err = db_ops.query(db,
        [[SELECT t.title, t.claim, t.verifier_policy_hash, t.revision, t.gate, t.work_kind, e.seq
            FROM chestor_journal_tasks t
            LEFT JOIN chestor_journal_events e ON e.journal_id = t.journal_id AND e.id = t.updated_event_id
           WHERE t.journal_id = ? AND t.id = ? LIMIT 1]],
        { journal_id, task_id }
    )
    if existing_err then return existing_err end
    local existing = existing_rows and existing_rows[1] or nil
    if existing and (tonumber((existing :: any).seq) or 0) >= seq then return nil end
    -- X8 trigger (b): title/contract/policy change bumps the task revision
    -- and marks existing receipts stale.
    local revision = 1
    local revision_bumped = false
    if existing then
        local row = existing :: any
        revision = tonumber(row.revision) or 1
        local title_changed = db_ops.trim(body.title) ~= "" and tostring(row.title or "") ~= tostring(body.title)
        local claim_changed = body.claim ~= nil and tostring(row.claim or "") ~= tostring(body.claim)
        local policy_changed = body.verifier_policy_hash ~= nil
            and tostring(row.verifier_policy_hash or "") ~= tostring(body.verifier_policy_hash)
        if title_changed or claim_changed or policy_changed then
            revision = revision + 1
            revision_bumped = true
        end
    end
    local gate_flag = 0
    if body.gate ~= nil then
        gate_flag = (body.gate == true or tonumber(body.gate) == 1) and 1 or 0
    elseif existing then
        gate_flag = tonumber((existing :: any).gate) or 0
    end
    local work_kind = string.lower(db_ops.trim(body.work_kind))
    if work_kind == "" and existing then work_kind = string.lower(db_ops.trim((existing :: any).work_kind)) end
    if work_kind == "" then work_kind = gate_flag == 1 and "gate" or "task" end
    local values_tail = terminal and "?, ?, ?, ?" or "NULL, ?, ?, NULL"
    local params = {
        journal_id, task_id, body.parent_task_id, work_kind, tostring(body.title or task_id), body.description,
        status, body.priority, body.assignee, body.agent_id, tonumber(body.sort_order) or 0,
        db_ops.canonical(type(body.metadata) == "table" and body.metadata or {}), body.result, revision, gate_flag,
        body.claim, body.verifier_policy_hash, event_id, event_id,
    }
    if terminal then params[#params + 1] = event_id end
    params[#params + 1] = timestamp
    params[#params + 1] = timestamp
    if terminal then params[#params + 1] = timestamp end
    params[#params + 1] = seq
    local applied, upsert_err = db_ops.query(db, [[
        INSERT INTO chestor_journal_tasks
            (journal_id, id, parent_task_id, work_kind, title, description, status, priority, assignee, agent_id, sort_order, metadata, result, revision, gate, claim, verifier_policy_hash, created_event_id, updated_event_id, closed_event_id, created_at, updated_at, closed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ]] .. values_tail .. [[)
        ON CONFLICT(journal_id, id) DO UPDATE SET
            parent_task_id = COALESCE(excluded.parent_task_id, chestor_journal_tasks.parent_task_id),
            work_kind = excluded.work_kind,
            title = COALESCE(excluded.title, chestor_journal_tasks.title),
            description = COALESCE(excluded.description, chestor_journal_tasks.description),
            status = excluded.status,
            priority = COALESCE(excluded.priority, chestor_journal_tasks.priority),
            assignee = COALESCE(excluded.assignee, chestor_journal_tasks.assignee),
            agent_id = COALESCE(excluded.agent_id, chestor_journal_tasks.agent_id),
            sort_order = excluded.sort_order,
            metadata = excluded.metadata,
            result = COALESCE(excluded.result, chestor_journal_tasks.result),
            revision = excluded.revision,
            gate = excluded.gate,
            claim = COALESCE(excluded.claim, chestor_journal_tasks.claim),
            verifier_policy_hash = COALESCE(excluded.verifier_policy_hash, chestor_journal_tasks.verifier_policy_hash),
            updated_event_id = excluded.updated_event_id,
            closed_event_id = COALESCE(excluded.closed_event_id, chestor_journal_tasks.closed_event_id),
            updated_at = excluded.updated_at,
            closed_at = COALESCE(excluded.closed_at, chestor_journal_tasks.closed_at)
        WHERE ? > COALESCE((SELECT seq FROM chestor_journal_events
                            WHERE journal_id = chestor_journal_tasks.journal_id
                              AND id = chestor_journal_tasks.updated_event_id), 0)
        RETURNING updated_event_id
    ]], params)
    if upsert_err then return upsert_err end
    if not applied or not applied[1] then return nil end
    if revision_bumped then
        return stale_receipts(db, journal_id, task_id, "task revision " .. tostring(revision))
    end
    return nil
end

-- Folds a transition event: gate_pass flips the passed flag with the state
-- unchanged (T11); every other verb moves status. Reopen marks the task's
-- receipts stale in the same transaction (I10.4). A ledger backstop row keeps
-- command identity reconstructible from replay; result payloads live only in
-- the synchronous command ledger.
local function apply_transition(db: any, journal_id: string, event_id: string, body: any, timestamp: number, seq: number): error?
    local task_id = db_ops.trim(body.task_id)
    if task_id == "" then return nil end
    local verb = db_ops.trim(body.verb)
    local command_id = db_ops.trim(body.command_id)
    if command_id ~= "" then
        local command_err = db_ops.exec(db, [[
            INSERT INTO chestor_journal_commands (journal_id, command_id, event_id, result_json, created_at)
            VALUES (?, ?, ?, NULL, ?)
            ON CONFLICT(journal_id, command_id) DO NOTHING
        ]], { journal_id, command_id, event_id, timestamp })
        if command_err then return command_err end
    end
    local current, current_err = db_ops.query(db, [[
        SELECT e.seq FROM chestor_journal_tasks t
        JOIN chestor_journal_events e ON e.journal_id = t.journal_id AND e.id = t.updated_event_id
        WHERE t.journal_id = ? AND t.id = ?
    ]], { journal_id, task_id })
    if current_err then return current_err end
    if current and current[1] and (tonumber((current[1] :: any).seq) or 0) >= seq then return nil end
    local result_text: string? = nil
    if body.result ~= nil then
        result_text = type(body.result) == "table" and db_ops.canonical(body.result) or tostring(body.result)
    end
    local update_err: error? = nil
    local applied: any = nil
    local sequence_guard = [[
        AND ? > COALESCE((SELECT seq FROM chestor_journal_events
                          WHERE journal_id = chestor_journal_tasks.journal_id
                            AND id = chestor_journal_tasks.updated_event_id), 0)
        RETURNING updated_event_id
    ]]
    if verb == "gate_pass" then
        applied, update_err = db_ops.query(db, [[
            UPDATE chestor_journal_tasks SET passed = 1, updated_event_id = ?, updated_at = ?
             WHERE journal_id = ? AND id = ?
        ]] .. sequence_guard, { event_id, timestamp, journal_id, task_id, seq })
    elseif verb == "fold" then
        -- F4: the fold event is the tombstone; the distilled result and the
        -- outcome badge land on the collapsed spine entry in the same fold.
        applied, update_err = db_ops.query(db, [[
            UPDATE chestor_journal_tasks
               SET status = 'folded', result = COALESCE(?, result), folded_outcome = ?,
                   updated_event_id = ?, updated_at = ?, closed_event_id = ?, closed_at = ?
             WHERE journal_id = ? AND id = ?
        ]] .. sequence_guard, { result_text or db_ops.trim(body.distilled), db_ops.trim(body.outcome),
            event_id, timestamp, event_id, timestamp, journal_id, task_id, seq })
    else
        local to_status = db_ops.trim(body.to_status)
        if to_status == "" then return nil end
        if types.TERMINAL_TASK_STATUS[string.lower(to_status)] then
            applied, update_err = db_ops.query(db, [[
                UPDATE chestor_journal_tasks
                   SET status = ?, result = COALESCE(?, result), updated_event_id = ?, updated_at = ?,
                       closed_event_id = ?, closed_at = ?
                 WHERE journal_id = ? AND id = ?
            ]] .. sequence_guard, { to_status, result_text, event_id, timestamp, event_id, timestamp, journal_id, task_id, seq })
        else
            applied, update_err = db_ops.query(db, [[
                UPDATE chestor_journal_tasks
                   SET status = ?, result = COALESCE(?, result), updated_event_id = ?, updated_at = ?,
                       closed_event_id = NULL, closed_at = NULL
                 WHERE journal_id = ? AND id = ?
            ]] .. sequence_guard, { to_status, result_text, event_id, timestamp, journal_id, task_id, seq })
        end
    end
    if update_err then return update_err end
    if not applied or not applied[1] then return nil end
    -- T12 annotation: complete consumed a waiver/accepted-risk instead of a
    -- receipt; the lens reports it as receipt_status waived/accepted_risk.
    if verb == "complete" then
        local guard = type(body.guard) == "table" and body.guard or {}
        local waiver_kind = db_ops.trim((guard :: any).waiver_kind)
        if waiver_kind == "" and type(body.waiver) == "table" then
            waiver_kind = string.lower(db_ops.trim((body.waiver :: any).kind)) == "accepted_risk"
                and "accepted_risk" or "waived"
        end
        local waiver_err = db_ops.exec(db,
            "UPDATE chestor_journal_tasks SET waiver_kind = ? WHERE journal_id = ? AND id = ?",
            { waiver_kind ~= "" and waiver_kind or nil, journal_id, task_id }
        )
        if waiver_err then return waiver_err end
    end
    if verb == "reopen" then
        local stale_err = stale_receipts(db, journal_id, task_id, "task reopened")
        if stale_err then return stale_err end
        local waiver_err = db_ops.exec(db,
            "UPDATE chestor_journal_tasks SET waiver_kind = NULL WHERE journal_id = ? AND id = ?",
            { journal_id, task_id }
        )
        if waiver_err then return waiver_err end
    end
    return nil
end

-- I8.1: the receipt store is append-only; a duplicate receipt_id never
-- rebinds an existing row.
local function insert_receipt(db: any, journal_id: string, event_id: string, body: any, timestamp: number): error?
    local receipt_id = db_ops.trim(body.receipt_id)
    local task_id = db_ops.trim(body.task_id)
    if receipt_id == "" or task_id == "" then return nil end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_receipts
            (journal_id, receipt_id, task_id, task_revision, work_revision, claim_hash, policy_hash,
             verifier_type, verifier_version, verdict, result_hash, raw_output_hash, artifact_hash,
             environment, author, created_at, stale, stale_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL)
        ON CONFLICT(journal_id, receipt_id) DO NOTHING
    ]], {
        journal_id, receipt_id, task_id, tonumber(body.task_revision), tonumber(body.work_revision),
        body.claim_hash, body.policy_hash, body.verifier_type, body.verifier_version,
        db_ops.trim(body.verdict), body.result_hash, body.raw_output_hash, body.artifact_hash,
        body.environment, body.author, timestamp,
    })
end

local function project_cursor(db: any, journal_id: string, event_id: string, body: any, timestamp: number, seq: number): error?
    local cursor_id = db_ops.trim(body.cursor_id)
    local agent_id = db_ops.trim(body.agent_id)
    if cursor_id == "" or agent_id == "" then return errors.new({ kind = errors.INVALID, message = "cursor_id and agent_id are required" }) end
    local op = string.lower(db_ops.trim(body.op))
    local revision = tonumber(body.revision)
    if not revision or revision < 1 then return errors.new({ kind = errors.INVALID, message = "cursor revision must be positive" }) end
    local state = op == "close" and "closed" or "active"
    local checkpoint = type(body.checkpoint) == "table" and body.checkpoint or {}
    local checkpoint_seq = op == "checkpoint" and seq or tonumber(body.checkpoint_seq) or 0
    local upsert_err = db_ops.exec(db, [[
        INSERT INTO chestor_journal_cursors
            (journal_id, cursor_id, agent_id, parent_cursor_id, current_task_id,
             current_graph_id, current_node_id,
             state, revision, claimed_revision, last_seen_seq, checkpoint_seq, current_episode_id,
             purpose, assignment, why, close_requirements_json, checkpoint_json, context_refs_json,
             origin, created_event_id, updated_event_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'explicit', ?, ?, ?, ?)
        ON CONFLICT(journal_id, cursor_id) DO UPDATE SET
            agent_id = excluded.agent_id,
            parent_cursor_id = COALESCE(NULLIF(excluded.parent_cursor_id, ''), chestor_journal_cursors.parent_cursor_id),
            current_task_id = excluded.current_task_id,
            current_graph_id = excluded.current_graph_id,
            current_node_id = excluded.current_node_id,
            state = excluded.state,
            revision = excluded.revision,
            -- A rebuild folds the same events without the command claim ever
            -- happening, so the claim converges on the folded revision and the
            -- refolded read model matches the live one.
            claimed_revision = CASE WHEN excluded.revision > chestor_journal_cursors.claimed_revision
                                    THEN excluded.revision ELSE chestor_journal_cursors.claimed_revision END,
            last_seen_seq = CASE WHEN excluded.last_seen_seq > chestor_journal_cursors.last_seen_seq
                                 THEN excluded.last_seen_seq ELSE chestor_journal_cursors.last_seen_seq END,
            checkpoint_seq = CASE WHEN excluded.checkpoint_seq > 0
                                  THEN excluded.checkpoint_seq ELSE chestor_journal_cursors.checkpoint_seq END,
            current_episode_id = COALESCE(excluded.current_episode_id, chestor_journal_cursors.current_episode_id),
            purpose = COALESCE(excluded.purpose, chestor_journal_cursors.purpose),
            assignment = COALESCE(excluded.assignment, chestor_journal_cursors.assignment),
            why = COALESCE(excluded.why, chestor_journal_cursors.why),
            close_requirements_json = CASE WHEN excluded.close_requirements_json <> '[]'
                                           THEN excluded.close_requirements_json ELSE chestor_journal_cursors.close_requirements_json END,
            checkpoint_json = CASE WHEN excluded.checkpoint_json <> '{}'
                                   THEN excluded.checkpoint_json ELSE chestor_journal_cursors.checkpoint_json END,
            context_refs_json = excluded.context_refs_json,
            updated_event_id = excluded.updated_event_id,
            updated_at = excluded.updated_at
        WHERE excluded.revision > chestor_journal_cursors.revision
          AND ? > COALESCE((SELECT seq FROM chestor_journal_events
                             WHERE journal_id = chestor_journal_cursors.journal_id
                               AND id = chestor_journal_cursors.updated_event_id), 0)
    ]], {
        journal_id, cursor_id, agent_id, body.parent_cursor_id, body.task_id,
        body.graph_id, body.node_id,
        state, revision, revision, tonumber(body.last_seen_seq) or 0, checkpoint_seq,
        body.episode_id, body.purpose, body.assignment, body.why,
        db_ops.canonical(type(body.close_requirements) == "table" and body.close_requirements or {}),
        db_ops.canonical(checkpoint),
        db_ops.canonical(type(body.context_refs) == "table" and body.context_refs or {}),
        event_id, event_id, timestamp, timestamp, seq,
    })
    if upsert_err then return upsert_err end
    local applied_rows, applied_err = db_ops.query(db, [[
        SELECT updated_event_id FROM chestor_journal_cursors
         WHERE journal_id = ? AND cursor_id = ? AND revision = ? LIMIT 1
    ]], { journal_id, cursor_id, revision })
    if applied_err then return applied_err end
    if not applied_rows or not applied_rows[1]
        or db_ops.trim((applied_rows[1] :: any).updated_event_id) ~= event_id then
        -- First event at a revision wins. A concurrent/stale event remains in
        -- the immutable timeline but cannot regress or fork cursor state.
        return nil
    end

    if op == "open" or op == "rotate" then
        local episode_id = db_ops.trim(body.episode_id)
        if episode_id == "" then return errors.new({ kind = errors.INVALID, message = "cursor open requires episode_id" }) end
        local rotate_err = db_ops.exec(db, [[
            UPDATE chestor_journal_episodes
               SET state = 'rotated', ended_seq = ?, ended_at = ?
             WHERE journal_id = ? AND cursor_id = ? AND state = 'active' AND episode_id <> ?
        ]], { seq, timestamp, journal_id, cursor_id, episode_id })
        if rotate_err then return rotate_err end
        return db_ops.exec(db, [[
            INSERT INTO chestor_journal_episodes
                (journal_id, episode_id, cursor_id, agent_id, state, goal,
                 started_seq, started_at, deadline_at, checkpoint_json)
            VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, '{}')
            ON CONFLICT(journal_id, episode_id) DO NOTHING
        ]], { journal_id, episode_id, cursor_id, agent_id, body.episode_goal or body.purpose,
            seq, timestamp, tonumber(body.episode_deadline) or timestamp })
    elseif op == "checkpoint" then
        local episode_id = db_ops.trim(body.episode_id)
        if episode_id ~= "" then
            return db_ops.exec(db, [[
                UPDATE chestor_journal_episodes SET checkpoint_json = ?
                 WHERE journal_id = ? AND episode_id = ?
            ]], { db_ops.canonical(checkpoint), journal_id, episode_id })
        end
    elseif op == "close" then
        return db_ops.exec(db, [[
            UPDATE chestor_journal_episodes SET state = 'closed', ended_seq = ?, ended_at = ?
             WHERE journal_id = ? AND cursor_id = ? AND state = 'active'
        ]], { seq, timestamp, journal_id, cursor_id })
    end
    return nil
end

local COVERAGE_STATUS = { finding = true, checked_clean = true, gap = true, not_applicable = true }

local function project_audit_coverage(db: any, journal_id: string, event_id: string, body: any, timestamp: number, seq: number): error?
    local task_id = db_ops.trim(body.audit_task_id or body.task_id)
    local unit_key = db_ops.trim(body.unit_key)
    local status = string.lower(db_ops.trim(body.status))
    if task_id == "" or unit_key == "" then return errors.new({ kind = errors.INVALID, message = "audit_task_id and unit_key are required" }) end
    if not COVERAGE_STATUS[status] then return errors.new({ kind = errors.INVALID, message = "invalid audit coverage status" }) end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_audit_coverage
            (journal_id, audit_task_id, unit_key, status, method,
             evidence_event_ids_json, cursor_id, episode_id, source_revision, gap_decision_id,
             recorded_event_id, recorded_seq, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, audit_task_id, unit_key) DO UPDATE SET
            status = excluded.status,
            method = excluded.method,
            evidence_event_ids_json = excluded.evidence_event_ids_json,
            cursor_id = excluded.cursor_id,
            episode_id = excluded.episode_id,
            source_revision = excluded.source_revision,
            gap_decision_id = excluded.gap_decision_id,
            recorded_event_id = excluded.recorded_event_id,
            recorded_seq = excluded.recorded_seq,
            recorded_at = excluded.recorded_at
        WHERE excluded.recorded_seq > chestor_journal_audit_coverage.recorded_seq
    ]], { journal_id, task_id, unit_key, status, body.method,
        db_ops.canonical(type(body.evidence_event_ids) == "table" and body.evidence_event_ids or {}),
        body.cursor_id, body.episode_id, body.source_revision, body.decision_id, event_id, seq, timestamp })
end

local INTEGRATION_DISPOSITION = { pending = true, accepted = true, rejected = true, superseded = true }

local function project_integration(db: any, journal_id: string, event_id: string, body: any, timestamp: number, seq: number): error?
    local receipt_id = db_ops.trim(body.receipt_id)
    local parent_cursor_id = db_ops.trim(body.parent_cursor_id)
    local child_cursor_id = db_ops.trim(body.child_cursor_id)
    local disposition = string.lower(db_ops.trim(body.disposition))
    if receipt_id == "" or parent_cursor_id == "" or child_cursor_id == "" then
        return errors.new({ kind = errors.INVALID, message = "integration receipt_id, parent_cursor_id, and child_cursor_id are required" })
    end
    if not INTEGRATION_DISPOSITION[disposition] then return errors.new({ kind = errors.INVALID, message = "invalid integration disposition" }) end
    local evidence = type(body.evidence_event_ids) == "table" and body.evidence_event_ids or {}
    local coverage = type(body.coverage) == "table" and body.coverage or {}
    local unresolved = type(body.unresolved) == "table" and body.unresolved or {}
    local has_coverage = false
    for _, _ in pairs(coverage) do has_coverage = true; break end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_integrations
            (journal_id, receipt_id, parent_cursor_id, child_cursor_id, task_id,
             disposition, source_from_seq, source_to_seq, evidence_event_ids_json,
             coverage_json, unresolved_json, summary, created_event_id,
             disposition_event_id, recorded_event_id, recorded_seq, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, receipt_id) DO UPDATE SET
            disposition = excluded.disposition,
            evidence_event_ids_json = CASE WHEN ? = 1
                THEN excluded.evidence_event_ids_json ELSE chestor_journal_integrations.evidence_event_ids_json END,
            coverage_json = CASE WHEN ? = 1
                THEN excluded.coverage_json ELSE chestor_journal_integrations.coverage_json END,
            unresolved_json = CASE WHEN ? = 1
                THEN excluded.unresolved_json ELSE chestor_journal_integrations.unresolved_json END,
            summary = COALESCE(excluded.summary, chestor_journal_integrations.summary),
            disposition_event_id = excluded.recorded_event_id,
            recorded_event_id = excluded.recorded_event_id,
            recorded_seq = excluded.recorded_seq,
            recorded_at = excluded.recorded_at
        WHERE excluded.recorded_seq > chestor_journal_integrations.recorded_seq
          AND (chestor_journal_integrations.disposition = 'pending'
               OR excluded.disposition = 'superseded')
    ]], { journal_id, receipt_id, parent_cursor_id, child_cursor_id, body.task_id,
        disposition, tonumber(body.source_from_seq), tonumber(body.source_to_seq),
        db_ops.canonical(evidence), db_ops.canonical(coverage), db_ops.canonical(unresolved),
        body.summary, event_id, disposition ~= "pending" and event_id or nil,
        event_id, seq, timestamp,
        #evidence > 0 and 1 or 0, has_coverage and 1 or 0, #unresolved > 0 and 1 or 0 })
end

local function project_reference_link(db: any, journal_id: string, event_id: string,
    body: any, timestamp: number, seq: number): error?
    local ref_id = db_ops.trim(body.ref_id)
    local graph_id = db_ops.trim(body.graph_id)
    local node_id = db_ops.trim(body.node_id)
    local uri = db_ops.trim(body.uri)
    local relation = string.lower(db_ops.trim(body.relation))
    if ref_id == "" or graph_id == "" or node_id == "" or uri == "" or relation == "" then
        return errors.new({ kind = errors.INVALID, message = "reference link requires ref_id, graph_id, node_id, uri, and relation" })
    end
    local existing, existing_err = db_ops.query(db, [[
        SELECT uri FROM chestor_journal_references
         WHERE journal_id = ? AND ref_id = ? LIMIT 1
    ]], { journal_id, ref_id })
    if existing_err then return existing_err end
    if existing and existing[1] and db_ops.trim((existing[1] :: any).uri) ~= uri then
        return errors.new({ kind = errors.CONFLICT, message = "reference id collision for " .. ref_id .. ": uri differs" })
    end
    local ref_err = db_ops.exec(db, [[
        INSERT INTO chestor_journal_references
            (journal_id, ref_id, uri, ref_kind, title, version, content_hash,
             attrs_json, created_event_id, updated_event_id, created_seq,
             updated_seq, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, ref_id) DO UPDATE SET
            ref_kind = excluded.ref_kind,
            title = COALESCE(excluded.title, chestor_journal_references.title),
            version = excluded.version,
            content_hash = COALESCE(excluded.content_hash, chestor_journal_references.content_hash),
            attrs_json = excluded.attrs_json,
            updated_event_id = excluded.updated_event_id,
            updated_seq = excluded.updated_seq,
            updated_at = excluded.updated_at
        WHERE excluded.updated_seq > chestor_journal_references.updated_seq
    ]], { journal_id, ref_id, uri,
        db_ops.trim(body.ref_kind) ~= "" and body.ref_kind or "resource",
        body.title, db_ops.trim(body.version), body.content_hash,
        db_ops.canonical(type(body.ref_attrs) == "table" and body.ref_attrs or {}),
        event_id, event_id, seq, seq, timestamp, timestamp })
    if ref_err then return ref_err end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_node_refs
            (journal_id, graph_id, node_id, ref_id, relation, state, attrs_json,
             created_event_id, updated_event_id, removed_event_id,
             created_seq, updated_seq, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, NULL, ?, ?, ?, ?)
        ON CONFLICT(journal_id, graph_id, node_id, ref_id, relation) DO UPDATE SET
            state = 'active',
            attrs_json = excluded.attrs_json,
            updated_event_id = excluded.updated_event_id,
            removed_event_id = NULL,
            updated_seq = excluded.updated_seq,
            updated_at = excluded.updated_at
        WHERE excluded.updated_seq > chestor_journal_node_refs.updated_seq
    ]], { journal_id, graph_id, node_id, ref_id, relation,
        db_ops.canonical(type(body.edge_attrs) == "table" and body.edge_attrs or {}),
        event_id, event_id, seq, seq, timestamp, timestamp })
end

local function project_reference_unlink(db: any, journal_id: string, event_id: string,
    body: any, timestamp: number, seq: number): error?
    local ref_id = db_ops.trim(body.ref_id)
    local graph_id = db_ops.trim(body.graph_id)
    local node_id = db_ops.trim(body.node_id)
    local relation = string.lower(db_ops.trim(body.relation))
    if ref_id == "" or graph_id == "" or node_id == "" or relation == "" then
        return errors.new({ kind = errors.INVALID, message = "reference unlink requires ref_id, graph_id, node_id, and relation" })
    end
    return db_ops.exec(db, [[
        UPDATE chestor_journal_node_refs
           SET state = 'removed', removed_event_id = ?, updated_event_id = ?,
               updated_seq = ?, updated_at = ?
         WHERE journal_id = ? AND graph_id = ? AND node_id = ? AND ref_id = ? AND relation = ?
           AND updated_seq < ?
    ]], { event_id, event_id, seq, timestamp, journal_id, graph_id, node_id, ref_id, relation, seq })
end

local function tombstone_task_dep(db: any, journal_id: string, event_id: string, body: any, timestamp: number, seq: number): error?
    local from_task_id = db_ops.trim(body.from_task_id)
    local to_task_id = db_ops.trim(body.to_task_id)
    if from_task_id == "" or to_task_id == "" then return nil end
    local kind = db_ops.trim(body.kind)
    if kind == "" then kind = "blocks" end
    return db_ops.exec(db, [[
        UPDATE chestor_journal_task_deps
           SET tombstoned = 1, tombstone_decision_id = ?, tombstoned_at = ?
         WHERE journal_id = ? AND from_task_id = ? AND to_task_id = ? AND kind = ? AND tombstoned = 0
           AND ? > COALESCE((SELECT seq FROM chestor_journal_events
                              WHERE journal_id = chestor_journal_task_deps.journal_id
                                AND id = chestor_journal_task_deps.evidence_event_id), 0)
    ]], { db_ops.trim(body.decision_id), timestamp, journal_id, from_task_id, to_task_id, kind, seq })
end

local function upsert_artifact(db: any, journal_id: string, event_id: string, body: any, seq: number): error?
    local artifact_id = db_ops.trim(body.artifact_id or body.id)
    if artifact_id == "" then artifact_id = event_id end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_artifacts
            (journal_id, id, event_id, kind, title, summary, component_id, upload_id, file_path, url, mime_type, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, id) DO UPDATE SET
            event_id = excluded.event_id,
            kind = excluded.kind,
            title = excluded.title,
            summary = excluded.summary,
            component_id = excluded.component_id,
            upload_id = excluded.upload_id,
            file_path = excluded.file_path,
            url = excluded.url,
            mime_type = excluded.mime_type,
            metadata = excluded.metadata
        WHERE ? > COALESCE((SELECT seq FROM chestor_journal_events
                             WHERE journal_id = chestor_journal_artifacts.journal_id
                               AND id = chestor_journal_artifacts.event_id), 0)
    ]], {
        journal_id, artifact_id, event_id, tostring(body.kind or "artifact"),
        body.title, body.summary or body.body, body.component_id, body.upload_id, body.file_path,
        body.url, body.mime_type, db_ops.encode(body.metadata, {}), db_ops.now(), seq,
    })
end

local function upsert_active_task(db: any, journal_id: string, body: any, timestamp: number, seq: number): error?
    local task_id = db_ops.trim(body.task_id)
    if task_id == "" then return nil end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_state (journal_id, active_task_id, active_task_seq, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(journal_id) DO UPDATE SET
            active_task_id = excluded.active_task_id,
            active_task_seq = excluded.active_task_seq,
            updated_at = CASE WHEN excluded.active_task_seq > COALESCE(chestor_journal_state.digest_event_seq, 0)
                              THEN excluded.updated_at ELSE chestor_journal_state.updated_at END
        WHERE excluded.active_task_seq > COALESCE(chestor_journal_state.active_task_seq, 0)
    ]], { journal_id, task_id, seq, timestamp })
end

local function upsert_digest(db: any, journal_id: string, body: any, timestamp: number, seq: number): error?
    local digest = db_ops.trim(body.digest or body.body)
    if digest == "" then return nil end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_state (journal_id, digest, digest_updated_at, digest_source_seq, digest_event_seq, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id) DO UPDATE SET
            digest = excluded.digest,
            digest_updated_at = excluded.digest_updated_at,
            digest_source_seq = COALESCE(excluded.digest_source_seq, chestor_journal_state.digest_source_seq),
            digest_event_seq = excluded.digest_event_seq,
            updated_at = CASE WHEN excluded.digest_event_seq > COALESCE(chestor_journal_state.active_task_seq, 0)
                              THEN excluded.updated_at ELSE chestor_journal_state.updated_at END
        WHERE excluded.digest_event_seq > COALESCE(chestor_journal_state.digest_event_seq, 0)
    ]], { journal_id, digest, timestamp, tonumber(body.source_seq), seq, timestamp })
end

local function upsert_task_dep(db: any, journal_id: string, event_id: string, body: any, timestamp: number): error?
    local from_task_id = db_ops.trim(body.from_task_id)
    local to_task_id = db_ops.trim(body.to_task_id)
    if from_task_id == "" or to_task_id == "" then return nil end
    local kind = db_ops.trim(body.kind)
    if kind == "" then kind = "blocks" end
    return db_ops.exec(db, [[
        INSERT INTO chestor_journal_task_deps
            (journal_id, from_task_id, to_task_id, kind, evidence_event_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, from_task_id, to_task_id, kind) DO NOTHING
    ]], { journal_id, from_task_id, to_task_id, kind, event_id, timestamp })
end

local function projection_inputs(db: any, journal_id: string, events: any): (any?, error?)
    local ids: { string } = {}
    local tasks: { string } = {}
    local seen_ids: any = {}
    local seen_tasks: any = {}
    for _, event in ipairs(type(events) == "table" and events or {}) do
        if types.EVENT_SET[tostring((event :: any).type or "")] then
            local body = event_body(event)
            local id = db_ops.trim(body.event_id or body.id)
            if id ~= "" and not seen_ids[id] then ids[#ids + 1] = id; seen_ids[id] = true end
            local task = db_ops.trim(body.task_id)
            if task ~= "" and not seen_tasks[task] then tasks[#tasks + 1] = task; seen_tasks[task] = true end
        end
    end
    local hashes: any = {}
    local counts: any = {}
    for _, task in ipairs(tasks) do counts[task] = 0 end
    for _, batch in ipairs({ { values = ids, select = "id, payload_sha256", column = "id" },
        { values = tasks, select = "task_id, COUNT(*) AS n", column = "task_id", group = " GROUP BY task_id" } }) do
        for offset = 1, #batch.values, 100 do
            local marks: { string } = {}
            local params: { any } = { journal_id }
            for index = offset, math.min(#batch.values, offset + 99) do
                marks[#marks + 1] = "?"
                params[#params + 1] = batch.values[index]
            end
            local rows, err = db_ops.query(db, "SELECT " .. batch.select ..
                " FROM chestor_journal_events WHERE journal_id = ? AND " .. batch.column ..
                " IN (" .. table.concat(marks, ",") .. ")" .. (batch.group or ""), params)
            if err then return nil, err end
            for _, row in ipairs(rows or {}) do
                if batch.column == "id" then hashes[row.id] = db_ops.trim(row.payload_sha256)
                else counts[row.task_id] = tonumber(row.n) or 0 end
            end
        end
    end
    return { hashes = hashes, counts = counts }, nil
end

function M.project_events(db: any, journal_id: string, events: any): error?
    local inputs, input_err = projection_inputs(db, journal_id, events)
    if input_err then return errors.wrap(input_err, "projection batch read") end
    if not inputs then return errors.new({ kind = errors.INTERNAL, message = "projection batch read returned no inputs" }) end
    local search_rows: { any } = {}
    for _, raw_event in ipairs(type(events) == "table" and events or {}) do
        local kind = tostring((raw_event :: any).type or "")
        if types.EVENT_SET[kind] then
            local body = event_body(raw_event)
            local event_id = db_ops.trim(body.event_id or body.id)
            if event_id == "" then event_id = tostring(journal_id) .. ":" .. tostring(next_seq(db, journal_id)) end
            local seq = tonumber((raw_event :: any).seq) or tonumber(body.seq) or next_seq(db, journal_id)
            local timestamp = tonumber(body.ts) or db_ops.now()
            local record = search_text.record(kind, body)
            local event_type = record.event_type
            -- F5: the canonical payload hash rides the events index so a lost
            -- or corrupted fact payload fails replay equality.
            local payload_sha256 = tostring(hash.sha256(db_ops.canonical(body)))
            local stored_hash = inputs.hashes[event_id]
            if db_ops.trim(body.event_id or body.id) == "" and stored_hash == nil then
                local rows, read_err = db_ops.query(db,
                    "SELECT payload_sha256 FROM chestor_journal_events WHERE journal_id = ? AND id = ? LIMIT 1",
                    { journal_id, event_id })
                if read_err then return errors.wrap(read_err, "event dedupe " .. kind) end
                if rows and rows[1] then stored_hash = db_ops.trim(rows[1].payload_sha256) end
            end
            if stored_hash ~= nil then
                if stored_hash ~= "" and stored_hash ~= payload_sha256 then
                    return errors.new({ kind = errors.CONFLICT, message = "event id collision for " .. event_id .. ": canonical payload differs" })
                end
                goto next_event
            end
            do
            local insert_err = db_ops.exec(db, [[
                INSERT INTO chestor_journal_events
                    (journal_id, id, seq, ts, event_type, title, body, actor_id, actor_type, tags, linked_component_ids, linked_upload_ids, linked_file_paths, linked_task_ids, task_id, cursor_id, episode_id, span_id, correlation_id, causation_id, metadata, supersedes_event_id, payload_sha256, embedding_status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(journal_id, id) DO NOTHING
            ]], {
                journal_id, event_id, seq, timestamp, event_type, record.title, record.body,
                body.actor_id, (raw_event :: any).role or body.actor_type,
                db_ops.encode(body.tags, {}), db_ops.encode(body.linked_component_ids, {}),
                db_ops.encode(body.linked_upload_ids, {}), db_ops.encode(body.linked_file_paths, {}),
                db_ops.encode(body.linked_task_ids, {}),
                db_ops.trim(body.task_id) ~= "" and body.task_id or nil,
                db_ops.trim(body.cursor_id) ~= "" and body.cursor_id or nil,
                db_ops.trim(body.episode_id) ~= "" and body.episode_id or nil,
                db_ops.trim(body.span_id) ~= "" and body.span_id or nil,
                db_ops.trim(body.correlation_id) ~= "" and body.correlation_id or nil,
                db_ops.trim(body.causation_id) ~= "" and body.causation_id or nil,
                db_ops.encode(body.metadata, {}),
                body.supersedes_event_id, payload_sha256, body.embed == false and "skipped" or "pending", timestamp,
            })
            if insert_err then return errors.wrap(insert_err, "event insert " .. kind) end
            inputs.hashes[event_id] = payload_sha256
            local fact_task_id = db_ops.trim(body.task_id)
            if fact_task_id ~= "" then inputs.counts[fact_task_id] = (inputs.counts[fact_task_id] or 0) + 1 end
            search_rows[#search_rows + 1] = { event_id, journal_id, record.event_type,
                record.title, record.document, db_ops.encode(body.tags, {}) }

            local derived_err = nil
            if kind == types.EVENT.TASK_UPSERTED or kind == types.EVENT.TASK_CLOSED then
                derived_err = upsert_task(db, journal_id, event_id, body, timestamp, seq)
            elseif kind == types.EVENT.TASK_FOCUSED then
                derived_err = upsert_active_task(db, journal_id, body, timestamp, seq)
            elseif kind == types.EVENT.DIGEST_UPDATED then
                derived_err = upsert_digest(db, journal_id, body, timestamp, seq)
            elseif kind == types.EVENT.ARTIFACT_LINKED or event_type == "artifact" then
                derived_err = upsert_artifact(db, journal_id, event_id, body, seq)
            elseif kind == types.EVENT.TASK_LINKED then
                derived_err = upsert_task_dep(db, journal_id, event_id, body, timestamp)
            elseif kind == types.EVENT.TASK_UNLINKED then
                derived_err = tombstone_task_dep(db, journal_id, event_id, body, timestamp, seq)
            elseif kind == types.EVENT.TASK_TRANSITIONED then
                derived_err = apply_transition(db, journal_id, event_id, body, timestamp, seq)
            elseif kind == types.EVENT.VERIFICATION_RECEIPT then
                derived_err = insert_receipt(db, journal_id, event_id, body, timestamp)
            elseif kind == types.EVENT.CURSOR_UPDATED then
                derived_err = project_cursor(db, journal_id, event_id, body, timestamp, seq)
            elseif kind == types.EVENT.AUDIT_COVERAGE_RECORDED then
                derived_err = project_audit_coverage(db, journal_id, event_id, body, timestamp, seq)
            elseif kind == types.EVENT.INTEGRATION_RECORDED then
                derived_err = project_integration(db, journal_id, event_id, body, timestamp, seq)
            elseif kind == types.EVENT.REFERENCE_LINKED then
                derived_err = project_reference_link(db, journal_id, event_id, body, timestamp, seq)
            elseif kind == types.EVENT.REFERENCE_UNLINKED then
                derived_err = project_reference_unlink(db, journal_id, event_id, body, timestamp, seq)
            end
            if derived_err then return errors.wrap(derived_err, "derived projection " .. kind) end

            -- X8 trigger (a): a work-tagged fact under a task supersedes any
            -- receipt whose work_revision it passes (D2 freshness).
            if fact_task_id ~= "" and work_classification.is_work_fact(event_type, body.tags) then
                local stale_err = db_ops.exec(db, [[
                    UPDATE chestor_journal_receipts SET stale = 1, stale_reason = ?
                     WHERE journal_id = ? AND task_id = ? AND stale = 0 AND COALESCE(work_revision, 0) < ?
                ]], { "superseded by seq " .. tostring(seq), journal_id, fact_task_id, seq })
                if stale_err then return errors.wrap(stale_err, "receipt staleness " .. kind) end
            end

            -- X7 recompute triggers: checkpoint, complete, fold, gate-pass,
            -- and every 25th fact on a branch refresh that branch's digest at
            -- the triggering event's seq.
            local digest_task = ""
            if kind == types.EVENT.CHECKPOINT_CREATED then
                digest_task = fact_task_id
            elseif kind == types.EVENT.TASK_TRANSITIONED then
                local verb = db_ops.trim(body.verb)
                if verb == "complete" or verb == "fold" or verb == "gate_pass" then
                    digest_task = fact_task_id
                end
            elseif fact_task_id ~= "" then
                local fact_count = inputs.counts[fact_task_id] or 0
                if fact_count > 0 and fact_count % 25 == 0 then digest_task = fact_task_id end
            end
            if digest_task ~= "" then
                local digest_err = branch_digests.recompute(db, journal_id, digest_task, seq, timestamp, inputs.counts[digest_task])
                if digest_err then return errors.wrap(digest_err, "branch digest " .. kind) end
            end
            end
            ::next_event::
        end
    end
    local search_err = write_fts(db, journal_id, search_rows)
    if search_err then return errors.wrap(search_err, "FTS batch") end
    return nil
end

function M.public_meta(stats: any): any
    local last_ts = tonumber(stats and stats.last_ts) or 0
    local updated_at = last_ts > 0 and time.unix(last_ts, 0):utc():format(time.RFC3339) or ""
    return {
        status = "ready",
        event_count = tonumber(stats and stats.total) or 0,
        task_count = tonumber(stats and stats.task_count) or 0,
        open_task_count = tonumber(stats and stats.open_task_count) or 0,
        artifact_count = tonumber(stats and stats.artifact_count) or 0,
        last_seq = tonumber(stats and stats.last_seq) or 0,
        last_event_at = updated_at,
    }
end

function M.run(input: any, component: any): (any?, error?)
    input = type(input) == "table" and input or {}
    local projection = type(input.projection) == "table" and input.projection or {}
    local journal_id = db_ops.trim(input.thread_id)
    if journal_id == "" then journal_id = db_ops.trim((projection :: any).thread_id) end
    if journal_id == "" then return nil, errors.new({ kind = errors.INTERNAL, message = "journal projection input missing thread_id" }) end
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local tx, tx_err = db:begin()
    if tx_err then db:release(); return nil, errors.wrap(tx_err, "journal projection transaction failed") end
    if not tx then db:release(); return nil, errors.new({ kind = errors.INTERNAL, message = "journal projection transaction did not open" }) end
    local project_err = M.project_events(tx, journal_id, input.events)
    local stats = nil
    if not project_err then stats, project_err = reader.stats(tx, journal_id) end
    if project_err then tx:rollback(); db:release(); return nil, project_err end
    local _, commit_err = tx:commit()
    db:release()
    if commit_err then return nil, errors.wrap(commit_err, "journal projection commit failed") end
    local meta_ok, meta_err = component.set_meta(journal_id, M.public_meta(stats or {}))
    if meta_err then return nil, errors.wrap(meta_err, "journal component meta update failed") end
    if meta_ok ~= true then return nil, errors.new({ kind = errors.INTERNAL, message = "journal component meta update was not applied" }) end
    local range = type(input.range) == "table" and input.range or {}
    return {
        body = { materialized = "chestor_journal_tables", stats = stats or {} },
        last_seq = tonumber(range.to_seq),
    }, nil
end

return M

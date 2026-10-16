local structural = require("structural")
local deriver = require("deriver")
local refine = require("refine")
local db = require("db")
local types = require("types")
local facts = require("facts")
local ledger = require("ledger")
local reader = require("reader")
local writer = require("writer")
local thread_log = require("thread_log")

-- On-demand map assembly. The deterministic tier replays the durable log
-- through the same deriver the live projection uses and reconciles the result
-- against what the map already holds: a derived edge whose rule still produces
-- it stays, one whose rule no longer produces it is retired, and an authored
-- edge is never touched. The refine tier then asks a small model about a
-- bounded shortlist of candidate pairs the rules cannot reach.
local M = {}

local PAGE_SIZE = 500
local NODE_CHUNK = 40
local function trim(value: any): string
    return db.trim(value)
end

local function load_log(journal_id: string): (any?, error?)
    local events: { any } = {}
    local from_seq = 0
    while true do
        local page, page_err = thread_log.events(journal_id, from_seq, PAGE_SIZE)
        if not page then return nil, page_err end
        local rows = page :: { any }
        for _, row in ipairs(rows) do
            local raw = row :: any
            events[#events + 1] = { type = raw.type, seq = tonumber(raw.seq), role = raw.role, body = raw.body }
            from_seq = (tonumber(raw.seq) or from_seq) + 1
        end
        if #rows < PAGE_SIZE then break end
    end
    return events, nil
end

local function pair_key(left: string, right: string): string
    if left <= right then return left .. "\1" .. right end
    return right .. "\1" .. left
end

-- Every edge the current rules produce for one graph from the full log, keyed
-- by edge id. Node projection is untouched: the live projection owns nodes and
-- this pass only re-derives the relations between them.
local function desired_edges(tx: any, journal_id: string, graph_id: string, events: any): (any?, error?)
    local clear_err = facts.clear(tx, journal_id, graph_id)
    if clear_err then return nil, clear_err end
    local port: any = {
        node_for_event = function(event_id: string): (string?, error?)
            return writer.node_for_event(tx, journal_id, graph_id, event_id)
        end,
        previous = function(key_type: string, key_value: string, seq: number, exclude: string): (string?, error?)
            return facts.previous(tx, journal_id, graph_id, key_type, key_value, seq, exclude)
        end,
    }
    local wanted: any = {}
    local order: { string } = {}
    local linked: any = {}
    local replayed = 0
    for _, raw_event in ipairs(type(events) == "table" and events or {}) do
        local kind = tostring((raw_event :: any).type or "")
        if types.EVENT_SET[kind]
            and kind ~= types.EVENT.GRAPH_CONFIG_REQUESTED
            and kind ~= types.EVENT.GRAPH_OPS_REQUESTED then
            replayed = replayed + 1
            local changes, _, body, event_id, seq = structural.default_changes(raw_event)
            local derived, derive_err = deriver.derive(port, graph_id, changes, body, event_id, seq)
            if not derived then return nil, derive_err end
            for _, item in ipairs(derived :: { any }) do changes[#changes + 1] = item end
            for _, item in ipairs(changes) do
                local change = item :: any
                if trim(change.graph_id) == graph_id and type(change.edge) == "table" then
                    local edge = change.edge :: any
                    local id = trim(edge.id)
                    if id ~= "" then
                        if wanted[id] == nil then order[#order + 1] = id end
                        wanted[id] = { edge = edge, evidence = change.evidence, seq = change.seq }
                        linked[pair_key(tostring(edge.from), tostring(edge.to))] = true
                    end
                end
            end
            local nodes = deriver.map_nodes(changes, graph_id)
            local keys = facts.keys_for(body, trim(body.task_id))
            for _, node in ipairs(nodes :: { any }) do
                local record_err = facts.record(tx, journal_id, graph_id, tostring((node :: any).id), seq, keys)
                if record_err then return nil, record_err end
            end
        end
    end
    return { wanted = wanted, order = order, linked = linked, replayed = replayed }, nil
end

local function edge_ids(tx: any, journal_id: string, graph_id: string, origin: string): (any?, error?)
    local rows, err = db.query(tx, [[
        SELECT id FROM chestor_journal_graph_edges
         WHERE journal_id = ? AND graph_id = ? AND origin = ?
         ORDER BY id ASC
    ]], { journal_id, graph_id, origin })
    if err then return nil, err end
    local out: any = {}
    for _, row in ipairs(rows or {}) do out[tostring((row :: any).id)] = true end
    return out, nil
end

-- Writes one reconciled set of edges under a single revision. Endpoints the
-- live projection has not materialized are skipped rather than failed: the
-- rule stays correct, the relation simply has nothing to connect yet.
local function reconcile(tx: any, journal_id: string, graph_id: string, origin: string,
    wanted: any, order: any, existing: any): (any?, error?)
    local revision, revision_err = writer.next_revision(tx, journal_id, graph_id, nil)
    if not revision then return nil, revision_err end
    local added = 0
    local kept = 0
    for _, raw_id in ipairs(order :: { any }) do
        local id = tostring(raw_id)
        local item = (wanted :: any)[id]
        local upsert_err = writer.upsert_edge(tx, journal_id, graph_id, (item :: any).edge, revision :: number, origin)
        if upsert_err then
            if not writer.is_error(upsert_err, errors.NOT_FOUND, writer.ERROR.ENDPOINTS_MISSING) then return nil, upsert_err end
        else
            if (existing :: any)[id] == true then kept = kept + 1 else added = added + 1 end
            local evidence = trim((item :: any).evidence)
            if evidence ~= "" then
                local evidence_err = writer.add_evidence(tx, journal_id, graph_id, "edge", id,
                    evidence, tonumber((item :: any).seq))
                if evidence_err then return nil, evidence_err end
            end
        end
    end
    local stale: { string } = {}
    for id, _ in pairs(existing :: any) do
        if (wanted :: any)[id] == nil then stale[#stale + 1] = tostring(id) end
    end
    table.sort(stale)
    local removed = 0
    for _, id in ipairs(stale) do
        local remove_err = writer.remove_edge(tx, journal_id, graph_id, id, true)
        if remove_err then
            if not writer.is_error(remove_err, errors.PERMISSION_DENIED, writer.ERROR.PROTECTED_EDGE) then return nil, remove_err end
        else
            removed = removed + 1
        end
    end
    local finish_err = writer.finish_revision(tx, journal_id, graph_id, revision :: number, nil)
    if finish_err then return nil, finish_err end
    return { added = added, removed = removed, kept = kept, revision = revision }, nil
end

local function with_transaction(fn: (any) -> (any?, error?)): (any?, error?)
    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local tx, begin_err = handle:begin()
    if begin_err or not tx then
        handle:release()
        return nil, errors.wrap(begin_err, "failed to begin journal assembly transaction")
    end
    local value, err = fn(tx)
    if err then
        tx:rollback()
        handle:release()
        return nil, err
    end
    local _, commit_err = tx:commit()
    handle:release()
    if commit_err then return nil, errors.wrap(commit_err, "failed to commit journal assembly") end
    return value, nil
end

-- The deterministic tier, start to finish, in one transaction.
function M.derive_all(journal_id: string, graph_id: string, events: any): (any?, error?)
    return with_transaction(function(tx: any): (any?, error?)
        local graph, graph_err = reader.graph(tx, journal_id, graph_id)
        if not graph then return nil, graph_err end
        if tostring((graph :: any).lifecycle) == "archived" then
            return nil, errors.new({ kind = errors.INVALID, message = "archived graph rejects assembly" })
        end
        local plan, plan_err = desired_edges(tx, journal_id, graph_id, events)
        if not plan then return nil, plan_err end
        local existing, existing_err = edge_ids(tx, journal_id, graph_id, deriver.EDGE_ORIGIN)
        if not existing then return nil, existing_err end
        local result, reconcile_err = reconcile(tx, journal_id, graph_id, deriver.EDGE_ORIGIN,
            (plan :: any).wanted, (plan :: any).order, existing)
        if not result then return nil, reconcile_err end
        return {
            events_replayed = (plan :: any).replayed,
            edges_added = (result :: any).added,
            edges_removed = (result :: any).removed,
            edges_kept = (result :: any).kept,
            linked = (plan :: any).linked,
            config = (graph :: any).config,
        }, nil
    end)
end

local function node_summaries(handle: any, journal_id: string, graph_id: string, ids: { string }): (any?, error?)
    local out: any = {}
    local index = 1
    while index <= #ids do
        local chunk: { any } = { journal_id, graph_id }
        local marks: { string } = {}
        local last = math.min(index + NODE_CHUNK - 1, #ids)
        for position = index, last do
            marks[#marks + 1] = "?"
            chunk[#chunk + 1] = ids[position]
        end
        local rows, err = db.query(handle,
            "SELECT id, label, node_kind, summary FROM chestor_journal_graph_nodes"
            .. " WHERE journal_id = ? AND graph_id = ? AND id IN (" .. table.concat(marks, ", ") .. ")",
            chunk)
        if err then return nil, err end
        for _, raw in ipairs(rows or {}) do
            local row = raw :: any
            out[tostring(row.id)] = { id = tostring(row.id), label = row.label,
                kind = row.node_kind, summary = row.summary }
        end
        index = last + 1
    end
    return out, nil
end

-- Candidate pairs, materialized with the labels the judge needs. Pairs whose
-- endpoints a deterministic rule already connects are dropped here, so the
-- model is never asked about a relation the map already states.
function M.candidates(journal_id: string, graph_id: string, options: any, linked: any): (any?, error?)
    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local pairs_found, pairs_err = facts.candidate_pairs(handle, journal_id, graph_id,
        tonumber((options :: any).max_candidates) or 120)
    if not pairs_found then handle:release(); return nil, pairs_err end
    local ids: { string } = {}
    local seen: any = {}
    for _, raw in ipairs(pairs_found :: { any }) do
        for _, id in ipairs({ (raw :: any).left_id, (raw :: any).right_id }) do
            if not seen[tostring(id)] then
                seen[tostring(id)] = true
                ids[#ids + 1] = tostring(id)
            end
        end
    end
    local summaries, summary_err = node_summaries(handle, journal_id, graph_id, ids)
    handle:release()
    if not summaries then return nil, summary_err end
    local out: { any } = {}
    for _, raw in ipairs(pairs_found :: { any }) do
        local candidate = raw :: any
        local left = (summaries :: any)[candidate.left_id]
        local right = (summaries :: any)[candidate.right_id]
        local key = pair_key(tostring(candidate.left_id), tostring(candidate.right_id))
        if left and right and (linked :: any)[key] ~= true then
            out[#out + 1] = {
                left_id = candidate.left_id, right_id = candidate.right_id,
                reason = candidate.reason, left = left, right = right,
            }
        end
    end
    return out, nil
end

-- The refine tier. It owns its own reconciliation over the suggested-edge
-- origin, so a re-run replaces last run's suggestions wholesale while leaving
-- deterministic and authored edges alone.
function M.refine_all(journal_id: string, graph_id: string, options: any, linked: any, judge: any): (any?, error?)
    local candidates, candidate_err = M.candidates(journal_id, graph_id, options, linked)
    if not candidates then return nil, candidate_err end
    local plan, plan_err = refine.plan(candidates :: { any }, options, judge)
    if not plan then return nil, plan_err end
    return with_transaction(function(tx: any): (any?, error?)
        local wanted: any = {}
        local order: { string } = {}
        for _, raw in ipairs((plan :: any).edges) do
            local edge = raw :: any
            if wanted[tostring(edge.id)] == nil then order[#order + 1] = tostring(edge.id) end
            wanted[tostring(edge.id)] = { edge = edge }
        end
        local existing, existing_err = edge_ids(tx, journal_id, graph_id, deriver.EDGE_ORIGIN_LLM)
        if not existing then return nil, existing_err end
        local result, reconcile_err = reconcile(tx, journal_id, graph_id, deriver.EDGE_ORIGIN_LLM,
            wanted, order, existing)
        if not result then return nil, reconcile_err end
        return {
            suggested_added = (result :: any).added,
            suggested_removed = (result :: any).removed,
            candidates_judged = (plan :: any).judged,
            candidates_rejected = (plan :: any).rejected,
        }, nil
    end)
end

local function assembly_options(config: any): any
    local value = type(config) == "table" and (config :: any).assembly or nil
    local options = type(value) == "table" and value or {}
    return {
        refine = (options :: any).refine ~= false,
        model = trim((options :: any).model) ~= "" and trim((options :: any).model) or "class:nano",
        minimum_confidence = tonumber((options :: any).minimum_confidence) or 0.6,
        max_edges_per_node = math.floor(tonumber((options :: any).max_edges_per_node) or 3),
        max_candidates = math.floor(tonumber((options :: any).max_candidates) or 120),
        batch_size = math.floor(tonumber((options :: any).batch_size) or 12),
    }
end

M.options = assembly_options

-- One complete run. judge_for(model) returns the model seam the refine tier
-- calls; a run whose refine tier fails still reports its deterministic result
-- and names the reason, because a missing model class is not a reason to lose
-- an assembled map.
function M.run(journal_id: string, graph_id: string, run_id: string, judge_for: any): (any?, error?)
    local id = trim(graph_id) ~= "" and trim(graph_id) or "map"
    local events, log_err = load_log(journal_id)
    if not events then return nil, log_err end

    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local mark_err = ledger.mark(handle, journal_id, run_id, ledger.STATUS.RUNNING)
    handle:release()
    if mark_err then return nil, mark_err end

    local deterministic, deterministic_err = M.derive_all(journal_id, id, events)
    if not deterministic then return nil, deterministic_err end

    local options = assembly_options((deterministic :: any).config)
    local summary: any = {
        graph_id = id,
        events_replayed = (deterministic :: any).events_replayed,
        edges_added = (deterministic :: any).edges_added,
        edges_removed = (deterministic :: any).edges_removed,
        suggested_added = 0,
        suggested_removed = 0,
        candidates_judged = 0,
        model = (options :: any).model,
    }
    if (options :: any).refine == true and type(judge_for) == "function" then
        local refined, refine_err = M.refine_all(journal_id, id, options,
            (deterministic :: any).linked, judge_for((options :: any).model))
        if refined then
            summary.suggested_added = (refined :: any).suggested_added
            summary.suggested_removed = (refined :: any).suggested_removed
            summary.candidates_judged = (refined :: any).candidates_judged
        else
            summary.refine_error = tostring(refine_err)
        end
    end

    local finish_handle, finish_open_err = db.open()
    if not finish_handle then return nil, finish_open_err end
    local complete_err = ledger.complete(finish_handle, journal_id, run_id, summary)
    finish_handle:release()
    if complete_err then return nil, complete_err end
    return summary, nil
end

return M

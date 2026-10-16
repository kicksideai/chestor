local db = require("db")

-- Deterministic relation derivation. Facts already carry the relations they
-- stand in - a parent task, the task they were recorded under, the fact that
-- caused them, the correlation they belong to, what they supersede, what they
-- cite, what a decision chose and refused. This library turns those stored
-- fields into map edges, so a map assembles itself instead of arriving as
-- unconnected records.
--
-- Every edge it produces is marked: attrs.origin is "derived" and attrs.rule
-- names the rule that produced it, so an authored relation and a derived one
-- stay distinguishable forever, and the recompute pass can retire a derived
-- edge its rule no longer produces without ever touching an authored one.
local M = {}

M.ORIGIN = "derived"
M.ORIGIN_LLM = "derived-llm"
M.EDGE_ORIGIN = "projector"
M.EDGE_ORIGIN_LLM = "derived_llm"

M.RULE = {
    TASK_PARENT = "task_parent",
    FACT_TASK = "fact_task",
    CAUSATION = "causation",
    CORRELATION = "correlation",
    SUPERSEDES = "supersedes",
    EVIDENCE = "evidence",
    SELECTED = "selection_selected",
    REJECTED = "selection_rejected",
    CANDIDATE = "selection_candidate",
}

local RELATION: any = {
    task_parent = { kind = "part_of", label = "part of" },
    fact_task = { kind = "part_of", label = "part of" },
    causation = { kind = "causes", label = "causes" },
    correlation = { kind = "precedes", label = "then" },
    supersedes = { kind = "supersedes", label = "supersedes" },
    evidence = { kind = "cites", label = "cites" },
    selection_selected = { kind = "selects", label = "selects" },
    selection_rejected = { kind = "rejects", label = "rejects" },
    selection_candidate = { kind = "candidate_for", label = "candidate for" },
}

local MAX_EVIDENCE = 16
local MAX_SELECTION = 32

function M.relation(rule: string): any
    return RELATION[rule] or { kind = "related", label = "related" }
end

-- Edge identity is the rule plus its endpoints, so re-deriving the same
-- relation from the same facts always lands on the same row.
function M.edge_id(rule: string, from: string, to: string): string
    return "derived:" .. rule .. ":" .. from .. ":" .. to
end

-- A suggestion is symmetric, so its identity is its endpoints in a fixed order.
-- The order is chosen explicitly rather than by swapping two locals: the typed
-- dialect assigns a multiple assignment left to right, so `a, b = b, a` writes
-- the same value into both names.
function M.suggested_edge_id(from: string, to: string): string
    if from <= to then return "derived-llm:" .. from .. ":" .. to end
    return "derived-llm:" .. to .. ":" .. from
end

local function change(graph_id: string, rule: string, from: string, to: string,
    event_id: string, seq: number): any
    local relation = M.relation(rule)
    return {
        graph_id = graph_id,
        edge = {
            id = M.edge_id(rule, from, to),
            from = from,
            to = to,
            kind = relation.kind,
            label = relation.label,
            metadata = { origin = M.ORIGIN, rule = rule, source_event_id = event_id },
        },
        evidence = event_id,
        seq = seq,
        optional = true,
        edge_origin = M.EDGE_ORIGIN,
    }
end

M.change = change

-- The map nodes one event projected, in the order structural produced them.
-- The primary node is the fact's own record: the event node when the fact
-- projected one, otherwise the entity node it upserted.
function M.map_nodes(changes: any, graph_id: string): (any, string?)
    local nodes: { any } = {}
    local primary: string? = nil
    for _, raw in ipairs(type(changes) == "table" and changes or {}) do
        local item = raw :: any
        if db.trim(item.graph_id) == graph_id and type(item.node) == "table" then
            local node = item.node :: any
            local id = db.trim(node.id)
            if id ~= "" then
                nodes[#nodes + 1] = node
                if primary == nil or id:find("event:", 1, true) == 1 then primary = id end
            end
        end
    end
    return nodes, primary
end

-- A decision states its selection either directly or under its metadata; both
-- shapes are the same block.
local function selection_of(body: any): any
    if type(body) ~= "table" then return nil end
    local direct = (body :: any).selection
    if type(direct) == "table" then return direct end
    local metadata = (body :: any).metadata
    if type(metadata) == "table" then
        local nested = (metadata :: any).selection
        if type(nested) == "table" then return nested end
    end
    return nil
end

local function bounded_ids(value: any, maximum: number): { string }
    local out: { string } = {}
    if type(value) ~= "table" then return out end
    for _, raw in ipairs(value :: { any }) do
        local id = db.trim(raw)
        if id ~= "" and #out < maximum then out[#out + 1] = id end
        if #out >= maximum then break end
    end
    return out
end

-- port answers the two lookups a derivation cannot read off the fact itself:
--   node_for_event(event_id) -> (node_id?, err?)  the map node another event
--                                                  projected, if it projected one
--   previous(key_type, key_value, seq, exclude) -> (node_id?, err?)  the most
--                                                  recent node indexed under a key
function M.derive(port: any, graph_id: string, changes: any, body: any,
    event_id: string, seq: number): (any?, error?)
    local nodes, primary = M.map_nodes(changes, graph_id)
    local derived: { any } = {}

    -- Containment: the projector already resolved where each node belongs -
    -- a subtask under its parent task, a fact under the task it was recorded
    -- against or under the fact it refines. That resolution becomes an edge.
    for _, raw in ipairs(nodes) do
        local node = raw :: any
        local id = db.trim(node.id)
        local parent = db.trim(node.parent_id)
        if id ~= "" and parent ~= "" and parent ~= id then
            local rule = (id:find("task:", 1, true) == 1 and parent:find("task:", 1, true) == 1)
                and M.RULE.TASK_PARENT or M.RULE.FACT_TASK
            derived[#derived + 1] = change(graph_id, rule, id, parent, event_id, seq)
        end
    end

    if primary ~= nil then
        local self_id = primary :: string
        local causation = db.trim(body.causation_id)
        if causation ~= "" then
            local cause_node, cause_err = port.node_for_event(causation)
            if cause_err then return nil, cause_err end
            if cause_node and tostring(cause_node) ~= self_id then
                derived[#derived + 1] = change(graph_id, M.RULE.CAUSATION,
                    tostring(cause_node), self_id, event_id, seq)
            end
        end

        local correlation = db.trim(body.correlation_id)
        if correlation ~= "" then
            local previous, previous_err = port.previous("correlation", correlation, seq, self_id)
            if previous_err then return nil, previous_err end
            if previous and tostring(previous) ~= self_id then
                derived[#derived + 1] = change(graph_id, M.RULE.CORRELATION,
                    tostring(previous), self_id, event_id, seq)
            end
        end

        local supersedes = db.trim(body.supersedes_event_id)
        if supersedes ~= "" then
            local superseded, superseded_err = port.node_for_event(supersedes)
            if superseded_err then return nil, superseded_err end
            if superseded and tostring(superseded) ~= self_id then
                derived[#derived + 1] = change(graph_id, M.RULE.SUPERSEDES,
                    self_id, tostring(superseded), event_id, seq)
            end
        end

        for _, evidence_id in ipairs(bounded_ids(body.evidence_event_ids, MAX_EVIDENCE)) do
            local evidence_node, evidence_err = port.node_for_event(evidence_id)
            if evidence_err then return nil, evidence_err end
            if evidence_node and tostring(evidence_node) ~= self_id then
                derived[#derived + 1] = change(graph_id, M.RULE.EVIDENCE,
                    self_id, tostring(evidence_node), event_id, seq)
            end
        end

        local selection = selection_of(body)
        if selection ~= nil then
            local block = selection :: any
            local selection_graph_id = db.trim(block.graph_id)
            if selection_graph_id == "" then selection_graph_id = graph_id end
            local selected_ids = bounded_ids(block.selected_node_ids, MAX_SELECTION)
            local rejected_ids = bounded_ids(block.rejected_node_ids, MAX_SELECTION)
            local candidate_ids = bounded_ids(block.candidate_node_ids, MAX_SELECTION)
            local disposed: any = {}
            for _, selected in ipairs(selected_ids) do
                disposed[selected] = true
                derived[#derived + 1] = change(selection_graph_id, M.RULE.SELECTED,
                    self_id, selected, event_id, seq)
            end
            for _, rejected in ipairs(rejected_ids) do
                disposed[rejected] = true
                derived[#derived + 1] = change(selection_graph_id, M.RULE.REJECTED,
                    self_id, rejected, event_id, seq)
            end
            -- A candidate that was neither chosen nor refused is still part of
            -- the decision's record: it was considered.
            for _, candidate in ipairs(candidate_ids) do
                if disposed[candidate] ~= true then
                    derived[#derived + 1] = change(selection_graph_id, M.RULE.CANDIDATE,
                        candidate, self_id, event_id, seq)
                end
            end
        end
    end

    return derived, nil
end

return M

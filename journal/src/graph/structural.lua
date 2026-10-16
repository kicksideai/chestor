local db = require("db")
local types = require("types")

local M = {}

local function copy(value: any): any
    local out = {}
    if type(value) ~= "table" then return out end
    for key, item in pairs(value :: any) do out[key] = item end
    return out
end

function M.body(event: any): any
    local value = type(event) == "table" and (event :: any).body or {}
    if type(value) == "string" then return copy(db.decode(value, {})) end
    return copy(value)
end

function M.public_type(kind: string, body: any): string
    if kind == types.EVENT.TASK_UPSERTED then return "task.updated" end
    if kind == types.EVENT.TASK_CLOSED then return "task.closed" end
    if kind == types.EVENT.TASK_FOCUSED then return "task.focused" end
    if kind == types.EVENT.DIGEST_UPDATED then return "digest.updated" end
    if kind == types.EVENT.CHECKPOINT_CREATED then return "checkpoint" end
    if kind == types.EVENT.ARTIFACT_LINKED then return "artifact" end
    if kind == types.EVENT.REFERENCE_LINKED then return "reference.linked" end
    if kind == types.EVENT.REFERENCE_UNLINKED then return "reference.unlinked" end
    return tostring(body.event_type or "note")
end

local function label(body: any, fallback: string): string
    local value = db.trim(body.title or body.goal or body.summary or body.body)
    if value == "" then return fallback end
    if #value > 120 then return value:sub(1, 117) .. "..." end
    return value
end

-- Entity updates are sparse: closing a task normally carries only its identity
-- and status. Returning nil here lets the projector preserve the existing label
-- instead of replacing it with a generic fallback.
local function entity_label(body: any): string?
    local value = db.trim(body.title)
    if value == "" then return nil end
    if #value > 120 then return value:sub(1, 117) .. "..." end
    return value
end

local function contains(value: string, needle: string): boolean
    return string.lower(value):find(needle, 1, true) ~= nil
end

local function has_tag(body: any, wanted: string): boolean
    for _, tag in ipairs(type(body.tags) == "table" and body.tags or {}) do
        if string.lower(tostring(tag)) == wanted then return true end
    end
    return false
end

local function event_parent(body: any, fallback: any): string?
    local parent = db.trim(body.parent_event_id or body.parent_id or fallback)
    if parent == "" then return nil end
    return "event:" .. parent
end

-- A fact hangs under the task branch it informs when it carries a task_id;
-- otherwise it falls back to the event parent chain.
local function task_or_event_parent(body: any, fallback: any): string?
    local task_id = db.trim(body.task_id)
    if task_id ~= "" then return "task:" .. task_id end
    return event_parent(body, fallback)
end

function M.default_changes(event: any): (any, string, any, string, number)
    local kind = tostring((event :: any).type or "")
    local body = M.body(event)
    local seq = tonumber((event :: any).seq) or tonumber(body.seq) or 0
    local event_id = db.trim(body.event_id or body.id)
    if event_id == "" then event_id = "seq:" .. tostring(seq) end
    local event_type = M.public_type(kind, body)
    local changes = {}

    if kind == types.EVENT.TASK_UPSERTED or kind == types.EVENT.TASK_CLOSED then
        local id = db.trim(body.task_id or body.id)
        if id ~= "" then
            local blocked = string.lower(tostring(body.status or "")) == "blocked"
            local closing = kind == types.EVENT.TASK_CLOSED
                or types.TERMINAL_TASK_STATUS[string.lower(tostring(body.status or ""))] == true
            local result = db.trim(body.result)
            local summary = body.description
            if closing and result ~= "" then
                summary = db.trim(summary) ~= "" and (tostring(summary) .. "\n\nResult: " .. result) or ("Result: " .. result)
            end
            -- The single task node carries risk state directly: a blocked task
            -- projects kind "risk" with the blocked status, and a later
            -- non-blocked update returns the same node to "work". The unified
            -- map needs no shadow node for resolution.
            local node = {
                id = "task:" .. id, semantic_key = "task:" .. id,
                label = entity_label(body), kind = blocked and "risk" or "work",
                summary = summary, status = body.status or "open", ref_id = event_id,
                parent_id = db.trim(body.parent_task_id) ~= "" and ("task:" .. tostring(body.parent_task_id)) or nil,
            }
            changes[#changes + 1] = { graph_id = "map", node = node, evidence = event_id, seq = seq, merge_existing = true }
            for _, dependency in ipairs(type(body.dependencies) == "table" and body.dependencies or {}) do
                local dep = db.trim(dependency)
                if dep ~= "" then
                    changes[#changes + 1] = { graph_id = "map", edge = {
                        id = "unblocks:task:" .. dep .. ":task:" .. id,
                        from = "task:" .. dep, to = "task:" .. id, kind = "unblocks", label = "unblocks",
                    }, evidence = event_id, seq = seq, optional = true }
                end
            end
        end
    elseif kind == types.EVENT.ARTIFACT_LINKED then
        local id = db.trim(body.artifact_id or body.id)
        if id ~= "" then
            changes[#changes + 1] = { graph_id = "map", node = {
                id = "artifact:" .. id, semantic_key = "artifact:" .. id,
                label = label(body, id), kind = "evidence", summary = body.summary or body.body,
                status = "recorded", ref_id = event_id,
                parent_id = task_or_event_parent(body, nil),
            }, evidence = event_id, seq = seq }
        end
    elseif kind == types.EVENT.TASK_LINKED then
        local from_task_id = db.trim(body.from_task_id)
        local to_task_id = db.trim(body.to_task_id)
        if from_task_id ~= "" and to_task_id ~= "" then
            local dep_kind = db.trim(body.kind) ~= "" and body.kind or "blocks"
            changes[#changes + 1] = { graph_id = "map", edge = {
                id = "dep:" .. tostring(dep_kind) .. ":" .. from_task_id .. ":" .. to_task_id,
                from = "task:" .. from_task_id, to = "task:" .. to_task_id,
                kind = dep_kind, label = dep_kind,
            }, evidence = event_id, seq = seq, optional = true }
        end
    elseif kind == types.EVENT.REFERENCE_LINKED then
        local ref_id = db.trim(body.ref_id)
        local graph_id = db.trim(body.graph_id)
        local source_node_id = db.trim(body.node_id)
        if ref_id ~= "" then
            local node_id = "ref:" .. ref_id
            changes[#changes + 1] = { graph_id = graph_id, node = {
                id = node_id, semantic_key = node_id,
                label = label(body, body.uri or ref_id), kind = "reference",
                summary = body.uri, status = "active", ref_id = ref_id,
                metadata = { uri = body.uri, ref_kind = body.ref_kind,
                    version = body.version, content_hash = body.content_hash },
            }, evidence = event_id, seq = seq, merge_existing = true }
            if graph_id ~= "" and source_node_id ~= "" then
                local relation = db.trim(body.relation) ~= "" and body.relation or "about"
                changes[#changes + 1] = { graph_id = graph_id, edge = {
                    id = "ref:" .. source_node_id .. ":" .. ref_id .. ":" .. relation,
                    from = source_node_id, to = node_id,
                    kind = relation, label = relation,
                }, evidence = event_id, seq = seq, optional = true }
            end
        end
    end

    local is_decision = contains(event_type, "decision") or has_tag(body, "decision")
    if is_decision then
        local node_id = "event:" .. event_id
        changes[#changes + 1] = { graph_id = "map", node = {
            id = node_id, semantic_key = node_id, label = label(body, "Decision"), kind = "decision",
            summary = body.body, status = body.status or "accepted", ref_id = event_id,
            parent_id = task_or_event_parent(body, body.supersedes_event_id),
        }, evidence = event_id, seq = seq }
        -- The decision's supersession and its selection dispositions are
        -- relations, and every relation this module derives from stored fields
        -- has one owner: chestor.journal.graph:deriver. Only the decision's
        -- presence on a separate selection graph is structural.
        local selection = type(body.selection) == "table" and body.selection
            or (type(body.metadata) == "table" and (body.metadata :: any).selection or nil)
        if type(selection) == "table" then
            local selection_graph_id = db.trim((selection :: any).graph_id)
            if selection_graph_id ~= "" and selection_graph_id ~= "map" then
                changes[#changes + 1] = { graph_id = selection_graph_id, node = {
                    id = node_id, semantic_key = node_id, label = label(body, "Decision"),
                    kind = "decision", summary = body.body,
                    status = body.status or "accepted", ref_id = event_id,
                }, evidence = event_id, seq = seq, merge_existing = true }
            end
        end
    end


    local is_observation = contains(event_type, "observation") or contains(event_type, "finding")
        or contains(event_type, "insight") or contains(event_type, "lesson")
        or has_tag(body, "observation") or has_tag(body, "finding") or has_tag(body, "insight")
    if is_observation then
        local node_id = "event:" .. event_id
        changes[#changes + 1] = { graph_id = "map", node = {
            id = node_id, semantic_key = node_id, label = label(body, "Observation"), kind = "observation",
            summary = body.body, status = body.status or "recorded", ref_id = event_id,
            parent_id = task_or_event_parent(body, nil),
        }, evidence = event_id, seq = seq }
    end

    local is_risk = contains(event_type, "blocker") or contains(event_type, "risk") or contains(event_type, "error")
        or has_tag(body, "blocker") or has_tag(body, "risk")
    if is_risk then
        local node_id = "event:" .. event_id
        changes[#changes + 1] = { graph_id = "map", node = {
            id = node_id, semantic_key = node_id, label = label(body, "Risk"), kind = "risk",
            summary = body.body, status = body.status or "open", ref_id = event_id,
            parent_id = db.trim(body.task_id) ~= "" and ("task:" .. db.trim(body.task_id)) or nil,
        }, evidence = event_id, seq = seq }
    end

    return changes, event_type, body, event_id, seq
end

function M.configured_change(graph: any, event_type: string, body: any, event_id: string, seq: number): any
    return {
        graph_id = graph.graph_id,
        node = {
            id = "event:" .. event_id,
            semantic_key = "event:" .. event_id,
            label = label(body, event_type),
            kind = tostring(body.node_kind or "concept"),
            summary = body.body or body.summary,
            status = body.status,
            ref_id = event_id,
        },
        evidence = event_id,
        seq = seq,
    }
end

return M

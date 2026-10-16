local db = require("db")
local types = require("types")

local M = {}

-- Long design records are chunked by the embedding seam. Keep a hard bound to
-- prevent pathological attributes from becoming unbounded model input, while
-- allowing substantial specifications and multi-document nodes.
local MAX_DOCUMENT_BYTES = 1024 * 1024

local function trim(value: any): string
    return db.trim(value)
end

local function add(parts: { string }, seen: any, value: any)
    local text = trim(value)
    if text == "" or seen[text] then return end
    seen[text] = true
    parts[#parts + 1] = text
end

local function value_text(value: any): string
    if type(value) == "table" then return db.encode(value, {}) end
    return trim(value)
end

local function sorted_keys(value: any): { string }
    local keys: { string } = {}
    if type(value) ~= "table" then return keys end
    for key, _ in pairs(value :: any) do keys[#keys + 1] = tostring(key) end
    table.sort(keys)
    return keys
end

local function fields_text(value: any): string
    local parts: { string } = {}
    for _, key in ipairs(sorted_keys(value)) do
        local item = (value :: any)[key]
        local text = value_text(item)
        if text ~= "" then parts[#parts + 1] = key .. ": " .. text end
    end
    return table.concat(parts, "\n")
end

function M.public_event_type(kind: string, body: any): string
    if kind == types.EVENT.TASK_UPSERTED then
        return types.TERMINAL_TASK_STATUS[string.lower(tostring(body.status or ""))] and "task.closed" or "task.updated"
    end
    if kind == types.EVENT.TASK_CLOSED then return "task.closed" end
    if kind == types.EVENT.TASK_FOCUSED then return "task.focused" end
    if kind == types.EVENT.TASK_LINKED then return "task.linked" end
    if kind == types.EVENT.TASK_UNLINKED then return "task.unlinked" end
    if kind == types.EVENT.TASK_TRANSITIONED then return "task.transitioned" end
    if kind == types.EVENT.VERIFICATION_REQUESTED then return "verification.requested" end
    if kind == types.EVENT.VERIFICATION_RECEIPT then return "verification.receipt" end
    if kind == types.EVENT.CURSOR_UPDATED then return "cursor.updated" end
    if kind == types.EVENT.AUDIT_COVERAGE_RECORDED then return "audit.coverage" end
    if kind == types.EVENT.INTEGRATION_RECORDED then return "integration" end
    if kind == types.EVENT.DIGEST_UPDATED then return "digest.updated" end
    if kind == types.EVENT.CHECKPOINT_CREATED then return "checkpoint" end
    if kind == types.EVENT.ARTIFACT_LINKED then return "artifact" end
    if kind == types.EVENT.GRAPH_CONFIG_REQUESTED then return "graph.configuration.requested" end
    if kind == types.EVENT.GRAPH_OPS_REQUESTED then return "graph.operations.requested" end
    return trim(body.event_type) ~= "" and trim(body.event_type) or "note"
end

function M.display_title(event_type: string, body: any): string
    local title = trim(body.title)
    if title ~= "" then return title end
    if event_type == "graph.operations.requested" then
        local graph_id = trim(body.graph_id)
        return graph_id ~= "" and "Graph update: " .. graph_id or "Graph update"
    end
    if event_type == "task.linked" or event_type == "task.unlinked" then
        local from_task_id = trim(body.from_task_id)
        local to_task_id = trim(body.to_task_id)
        if from_task_id ~= "" and to_task_id ~= "" then
            return from_task_id .. " " .. trim(body.kind or "blocks") .. " " .. to_task_id
        end
    end
    if event_type == "task.transitioned" then
        local verb = trim(body.verb)
        local task_id = trim(body.task_id)
        if verb ~= "" and task_id ~= "" then return verb .. " " .. task_id end
    end
    return trim(body.goal or body.summary or body.description)
end

function M.display_body(body: any): string
    local parts: { string } = {}
    local seen: any = {}
    for _, key in ipairs({ "body", "summary", "description", "goal", "digest", "current_digest", "scope" }) do
        add(parts, seen, body[key])
    end
    return table.concat(parts, "\n\n")
end

-- This is deliberately the one canonical text representation for persisted
-- Journal facts. It keeps free-form text, ids, links, tags, and structured
-- payload fields together without asking readers or embedders to know every
-- event shape.
function M.document(event: any): string
    local parts: { string } = {}
    local seen: any = {}
    for _, key in ipairs({
        "event_type", "title", "body", "actor_id", "actor_type",
        "supersedes_event_id", "id", "event_id",
    }) do
        add(parts, seen, event[key])
    end
    for _, key in ipairs({
        "tags", "linked_component_ids", "linked_upload_ids", "linked_file_paths", "linked_task_ids",
    }) do
        local values = type(event[key]) == "table" and event[key] or {}
        for _, value in ipairs(values) do add(parts, seen, value) end
    end
    add(parts, seen, fields_text(event.fields))
    add(parts, seen, fields_text(event.metadata))
    local document = table.concat(parts, "\n")
    return #document > MAX_DOCUMENT_BYTES and document:sub(1, MAX_DOCUMENT_BYTES) or document
end

function M.record(kind: string, body: any): any
    local event_type = M.public_event_type(kind, body)
    local title = M.display_title(event_type, body)
    local text = M.display_body(body)
    return {
        event_type = event_type,
        title = title,
        body = text,
        document = M.document({
            event_type = event_type,
            title = title,
            body = text,
            actor_id = body.actor_id,
            actor_type = body.actor_type,
            supersedes_event_id = body.supersedes_event_id,
            id = body.event_id or body.id,
            tags = body.tags,
            linked_component_ids = body.linked_component_ids,
            linked_upload_ids = body.linked_upload_ids,
            linked_file_paths = body.linked_file_paths,
            linked_task_ids = body.linked_task_ids,
            fields = body,
            metadata = body.metadata,
        }),
    }
end

return M

local db = require("db")
local cursors = require("cursors")
local commands = require("commands")
local thread_log = require("thread_log")

local M = {}

function M.trim(value: any): string
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

function M.summary_rows(rows: any, fields: any?): { any }
    local selected = fields or { "title", "label", "name", "event_type", "kind", "status", "state",
        "summary", "ts", "created_at", "updated_at", "actor_id", "owner", "parent_id", "ref_id",
        "entity_type", "target_type", "target_id", "operation", "revision", "source_seq",
        "from_node_id", "to_node_id", "child_count", "effective_state", "superseded_by_event_id",
        "distance", "recall", "node_count", "edge_count", "agent_count", "last_agent_activity_at",
        "health", "lifecycle", "parent_graph_id", "uri", "ref_kind", "relation", "version", "assignee", "agent_id" }
    local out: { any } = {}
    for _, source in ipairs(rows or {}) do
        local row: any = { id = source.id, seq = source.seq, graph_id = source.graph_id,
            event_id = source.event_id, task_id = source.task_id, node_id = source.node_id }
        for _, key in ipairs(selected) do row[key] = source[key] end
        out[#out + 1] = row
    end
    return out
end

function M.journal_id(params: any): (string?, string?)
    local source = type(params) == "table" and params or {}
    local id = M.trim(source.journal_id or source.id)
    if id == "" then return nil, "journal_id is required" end
    return id, nil
end

function M.cursor_handle(params: any, fallback: any?): string
    local source = type(params) == "table" and params or {}
    return M.trim(source.handle or source.cursor_id or fallback)
end

-- Make a continuation independently executable.  The compact tools normally
-- prefer one globally resolvable cursor handle; journal_id is retained as the
-- fallback for cursorless catalog and graph reads.
function M.route_continuation(value: any, handle: any, journal_id: any): any
    if type(value) ~= "table" then return value end
    if M.cursor_handle(value) == "" and M.trim((value :: any).journal_id) == "" then
        local routed_handle = M.trim(handle)
        if routed_handle ~= "" then
            (value :: any).handle = routed_handle
        elseif M.trim(journal_id) ~= "" then
            (value :: any).journal_id = M.trim(journal_id)
        end
    end
    return value
end

-- Query results may contain continuations at several bounded layers (for
-- example bundle node and edge pages). Route all of them at the tool boundary
-- so a caller can persist or delegate any page token directly.
function M.bind_continuations(value: any, handle: any, journal_id: any): any
    local seen: any = {}
    local function visit(item: any)
        if type(item) ~= "table" or seen[item] then return end
        seen[item] = true
        for key, child in pairs(item) do
            if key == "continuation" and type(child) == "table" then
                M.route_continuation(child, handle, journal_id)
            end
            visit(child)
        end
    end
    visit(value)
    return value
end

-- Resolve the durable cursor handle to its journal boundary. Explicit
-- journal_id remains the disambiguator for caller-selected mnemonic handles.
function M.resolve_journal(params: any, fallback_handle: any?): (string?, any?, any?, error?)
    local source = type(params) == "table" and params or {}
    local explicit = M.trim(source.journal_id or source.id)
    local handle = M.cursor_handle(source, fallback_handle)
    if explicit ~= "" then
        if handle == "" then return explicit, nil, nil end
        local connection, open_err = db.open()
        if not connection then
            return nil, nil, nil, open_err
        end
        local cursor, cursor_err = cursors.get(connection, explicit, handle)
        connection:release()
        if cursor_err then
            return nil, nil, nil, cursor_err
        end
        -- A missing handle is valid for JournalContext(open): the caller may
        -- be allocating a mnemonic cursor. Existing handles, including an
        -- explicitly disambiguated mnemonic, always hydrate their position.
        return explicit, cursor, nil
    end
    if handle == "" then
        return nil, nil, { success = false, code = "address_required",
            error = "journal_id is required for a new workspace; otherwise pass one cursor handle" }
    end
    local connection, open_err = db.open()
    if not connection then
        return nil, nil, nil, open_err
    end
    local page, resolve_err = cursors.resolve(connection, handle, 8)
    connection:release()
    if not page then
        return nil, nil, nil, resolve_err
    end
    local items: { any } = {}
    for _, item in ipairs((page :: any).items or {}) do
        local _, resolved_id, thread_err = thread_log.resolve(M.trim((item :: any).journal_id))
        if thread_err and not errors.is(thread_err, errors.NOT_FOUND) then
            return nil, nil, nil, thread_err
        end
        if resolved_id then items[#items + 1] = item end
    end
    if #items == 1 then return M.trim((items[1] :: any).journal_id), items[1], nil end
    if #items == 0 then
        return nil, nil, { success = false, refused = true, code = "handle_not_found",
            handle = handle, error = "cursor handle not found" }
    end
    local candidates: { any } = {}
    for _, item in ipairs(items) do
        candidates[#candidates + 1] = {
            journal_id = (item :: any).journal_id,
            address = { graph_id = (item :: any).current_graph_id, node_id = (item :: any).current_node_id },
            agent_id = (item :: any).agent_id,
            state = (item :: any).state,
        }
    end
    return nil, nil, { success = false, refused = true, code = "handle_ambiguous",
        handle = handle, candidates = candidates,
        error = "this mnemonic handle exists in multiple journals; add journal_id" }
end

-- The highest journal sequence an answer actually carried. An event row is the
-- only shape that pairs a bare seq with an event identity, so watermarks,
-- continuations, digest ages, and graph revisions - all named *_seq - never
-- move a reader's position. The walk is bounded so a large answer stays cheap.
function M.max_event_seq(value: any): number
    local seen: any = {}
    local highest = 0
    local function visit(item: any, depth: number)
        if type(item) ~= "table" or seen[item] or depth > 12 then return end
        seen[item] = true
        local seq = tonumber((item :: any).seq)
        if seq and seq > highest
            and ((item :: any).id ~= nil or (item :: any).event_id ~= nil) then
            highest = seq
        end
        for _, child in pairs(item) do visit(child, depth + 1) end
    end
    visit(value, 0)
    return highest
end

-- The journal head an append reported for itself.
local function receipt_seq(out: any): number
    local receipt = type((out :: any).receipt) == "table" and (out :: any).receipt or {}
    return math.max(tonumber((out :: any).max_seq) or 0, tonumber((receipt :: any).max_seq) or 0)
end

-- The one position seam every tool surface shares. Appending and reading move
-- a position by the same rule - the higher of what the append receipt reported
-- and what the answer actually carried - so an agent's cursor tracks what it
-- has done and what it has seen without it ever asking. An answer that carries
-- neither leaves the position alone, and an explicit handle keeps its own
-- cursor rather than the caller's. The answer itself is the contract: a
-- position that cannot be maintained is reported beside it, never in place
-- of it, and never fails the operation that earned it.
function M.maintain_position(journal_id: string, options: any, out: any): any
    if type(out) ~= "table" then return out end
    local source = type(options) == "table" and options or {}
    local identity = commands.resolve_identity(source) :: any
    local handle = M.trim(identity.cursor_id)
    local agent_id = M.trim(identity.agent_id)
    if handle == "" and agent_id == "" then return out end
    local seq = math.max(receipt_seq(out), M.max_event_seq(out))
    if seq <= 0 then return out end
    local span_id = M.trim((source :: any).span_id)
    local advanced, advance_err = commands.advance_cursor(journal_id, {
        cursor_id = handle, agent_id = agent_id, seq = seq, span_id = span_id,
    })
    if advance_err then
        (out :: any).cursor_error = tostring(advance_err)
        return out
    end
    if not advanced then return out end
    (out :: any).cursor_id = (advanced :: any).cursor_id;
    (out :: any).cursor_seq = (advanced :: any).cursor_seq
    if span_id ~= "" then (out :: any).span_id = span_id end
    return out
end

-- The write-side half of the same seam: the work span the fact about to be
-- written belongs to. It answers nil when no identity can be resolved, and a
-- span failure is reported beside the write rather than in place of it, so
-- span bookkeeping can never refuse work.
function M.begin_span(journal_id: string, options: any, data: any): (string?, string?)
    local source = type(options) == "table" and options or {}
    local attached, attach_err = commands.attach_span(journal_id, {
        cursor_id = (source :: any).cursor_id,
        agent_id = (source :: any).agent_id,
        working_on = (source :: any).working_on,
    })
    if attach_err then return nil, tostring(attach_err) end
    if not attached then return nil, nil end
    local span_id = M.trim((attached :: any).span_id)
    if span_id == "" then return nil, nil end
    if type(data) == "table" then (data :: any).span_id = span_id end
    return span_id, nil
end

function M.input(params: any): (string, any)
    local source = type(params) == "table" and params or {}
    local out = {}
    for key, value in pairs(source) do
        if key ~= "journal_id" then out[key] = value end
    end
    return tostring(source.journal_id or source.id or ""), out
end

function M.join(values: any): string
    local out = {}
    for _, value in ipairs(type(values) == "table" and values or {}) do out[#out + 1] = tostring(value) end
    return table.concat(out, "; ")
end

return M

local crypto = require("crypto")
local ctx = require("ctx")
local security = require("security")
local types = require("types")
local thread_log = require("thread_log")
local enforcement = require("enforcement")
local db_ops = require("db")
local cursors = require("cursors")
local spans = require("spans")

local M = {}

local WORK_KIND = {
    project = true, goal = true, workstream = true, task = true,
    gate = true, experiment = true, audit = true,
}

local function trim(value: any): string
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

local function copy_table(value: any): any
    local out = {}
    if type(value) ~= "table" then return out end
    for key, item in pairs(value :: any) do out[key] = item end
    return out
end

local function copy_array(value: any): any
    local out = {}
    if type(value) ~= "table" then return out end
    for _, item in ipairs(value :: any) do out[#out + 1] = item end
    return out
end

local function new_id(): (string?, any?)
    local id, id_err = crypto.random.uuid()
    if id_err or not id then return nil, errors.new({ message = "could not generate journal event id: " .. tostring(id_err), kind = errors.INVALID }) end
    return tostring(id), nil
end

local function ensure_event_id(body: any): error?
    if trim(body.event_id) ~= "" then return nil end
    local generated, id_err = new_id()
    if not generated then return id_err end
    body.event_id = generated
    return nil
end

local function actor_id(): string?
    local actor = security.actor()
    if not actor then return nil end
    local id = trim(actor:id())
    return id ~= "" and id or nil
end

local function event(kind: string, body: any): any
    return { type = kind, role = "user", body = body }
end

local function normalize_event(raw: any, index: number, trusted: boolean?): (any?, any?)
    if type(raw) ~= "table" then return nil, errors.new({ message = "events[" .. tostring(index) .. "] must be an object", kind = errors.INVALID }) end
    local kind = trim((raw :: any).type)
    if not types.EVENT_SET[kind] then
        return nil, errors.new({ message = "unknown journal event type at [" .. tostring(index) .. "]: " .. kind, kind = errors.INVALID })
    end
    local body = copy_table((raw :: any).body)
    if not trusted then
        -- I10.6: transitions exist only as the output of their commands; the
        -- generic event door never accepts one.
        if kind == types.EVENT.TASK_TRANSITIONED then
            return nil, errors.new({ message = "task transitions are appended by their commands, not the generic event path", kind = errors.INVALID })
        end
        -- I1.1: a verdict-bearing verification fact must be runner-authored
        -- even through the generic event path.
        if kind == types.EVENT.VERIFICATION_RECEIPT and trim(body.verdict) ~= ""
            and not enforcement.is_runner(body.author) then
            return nil, errors.new({ message = "verification verdicts are appended by the verifier runner", kind = errors.INVALID })
        end
    end
    if trim(body.event_id) == "" then
        local generated, id_err = new_id()
        if not generated then return nil, id_err end
        body.event_id = generated
    end
    if body.ts == nil then body.ts = os.time() end
    -- Actor identity is always derived from the ambient security context; callers
    -- cannot spoof another author through the generic event endpoint.
    body.actor_id = actor_id()
    return event(kind, body), nil
end

local function append(journal_id: string, events: any, trusted: boolean?): (any?, any?)
    if type(events) ~= "table" or #events == 0 then return nil, errors.new({ message = "events array required", kind = errors.INVALID }) end
    local normalized: { any } = {}
    for index, raw in ipairs(events :: { any }) do
        local item, item_err = normalize_event(raw, index, trusted)
        if not item then return nil, item_err end
        normalized[#normalized + 1] = item
    end
    return thread_log.append(journal_id, normalized)
end

function M.apply(journal_id: string, events: any): (any?, any?)
    return append(journal_id, events)
end

local MAX_EPISODE_S = 8 * 60 * 60

local function with_db(fn: (any) -> (any?, any?)): (any?, any?)
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local value, err = fn(db)
    db:release()
    return value, err
end

local CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

local function compact_random_handle(uuid: string, prefix: string?): string?
    local hex = tostring(uuid):gsub("-", "")
    if #hex < 16 then return nil end
    local out: { string } = {}
    local accumulator, bits = 0, 0
    for index = 1, 16, 2 do
        local byte = tonumber(hex:sub(index, index + 1), 16)
        if not byte then return nil end
        accumulator = accumulator * 256 + byte
        bits = bits + 8
        while bits >= 5 do
            local divisor = 2 ^ (bits - 5)
            local value = math.floor(accumulator / divisor)
            accumulator = accumulator % divisor
            bits = bits - 5
            out[#out + 1] = CROCKFORD:sub(value + 1, value + 1)
        end
    end
    if bits > 0 then
        local value = math.floor(accumulator * (2 ^ (5 - bits)))
        out[#out + 1] = CROCKFORD:sub(value + 1, value + 1)
    end
    return (prefix or "jc_") .. table.concat(out)
end

local function new_cursor_handle(): (string?, any?)
    for _ = 1, 8 do
        local generated, id_err = new_id()
        if not generated then return nil, id_err end
        local candidate = compact_random_handle(generated)
        if candidate then
            local exists, lookup_err = with_db(function(db)
                local rows, err = db_ops.query(db,
                    "SELECT cursor_id FROM chestor_journal_cursors WHERE cursor_id = ? LIMIT 1",
                    { candidate })
                if err then return nil, err end
                return rows and rows[1] ~= nil, nil
            end)
            if lookup_err then return nil, lookup_err end
            if not exists then return candidate, nil end
        end
    end
    return nil, errors.new({ message = "could not allocate a unique compact cursor handle", kind = errors.INVALID })
end

-- The one identity rule every tool surface shares, in priority order: a cursor
-- handle names the position outright; an agent_id is the agent identifying
-- itself, which is how several agents behind one account stay separate; the
-- MCP dispatcher's per-connection identity distinguishes two transports on one
-- account; and a caller reached any other way is its security actor. ctx.get
-- answers nil when the dispatcher bound nothing, and that absence is the
-- answer, not a failure.
function M.resolve_identity(input: any): any
    local source = type(input) == "table" and input or {}
    local cursor_id = trim((source :: any).cursor_id)
    if cursor_id ~= "" then return { cursor_id = cursor_id, source = "cursor_id" } end
    local agent_id = trim((source :: any).agent_id)
    if agent_id ~= "" then return { agent_id = agent_id, source = "agent_id" } end
    local connection = trim(ctx.get("connection_id"))
    if connection ~= "" then return { agent_id = connection, source = "connection_id" } end
    local actor = actor_id()
    if actor then return { agent_id = actor, source = "actor" } end
    return {}
end

-- Identity for automatic position maintenance when the caller named none.
function M.writer_identity(): string?
    local identity = M.resolve_identity({}) :: any
    local agent_id = trim(identity.agent_id)
    return agent_id ~= "" and agent_id or nil
end

-- The cursor an identity's automatic position lives on, allocated on first
-- contact. The automatic path only ever considers automatic cursors: a cursor
-- an agent opened through the explicit protocol belongs to that protocol, and
-- adopting it here is how three agents behind one shared actor identity all
-- ended up moving one opened cursor's position in a live journal.
local function auto_cursor_for(journal_id: string, agent_id: string): (string?, any?)
    local current, current_err = with_db(function(db)
        return cursors.latest_for_agent(db, journal_id, agent_id, "auto")
    end)
    if current_err then return nil, current_err end
    if current then return trim((current :: any).cursor_id), nil end
    return new_cursor_handle()
end

-- Automatic position maintenance: recording and reading both move the calling
-- agent's durable position to what it has now seen. This is position only - it
-- never pins a fact to a task or episode and never applies the episode
-- deadline, which remain the explicit cursor protocol's contract. input.seq is
-- the watermark; input.span_id extends that identity's open work span with the
-- same movement, so position and span never drift apart.
function M.advance_cursor(journal_id: string, input: any): (any?, any?)
    local cursor_id = trim(input and input.cursor_id)
    local agent_id = trim(input and input.agent_id)
    if cursor_id == "" and agent_id == "" then return nil, nil end
    local seq = math.max(0, math.floor(tonumber(input and input.seq) or 0))
    local origin = "explicit"
    if cursor_id == "" then
        local resolved, resolve_err = auto_cursor_for(journal_id, agent_id)
        if not resolved then return nil, resolve_err end
        cursor_id = resolved :: string
        origin = "auto"
    end
    if agent_id == "" then
        local existing, existing_err = with_db(function(db)
            return cursors.get(db, journal_id, cursor_id)
        end)
        if existing_err then return nil, existing_err end
        if not existing then return nil, errors.new({ message = "journal cursor not found: " .. cursor_id, kind = errors.NOT_FOUND }) end
        agent_id = trim((existing :: any).agent_id)
    end
    local advanced, advance_err = with_db(function(db)
        local row, row_err = cursors.advance(db, journal_id, cursor_id, agent_id, seq, origin)
        if not row then return nil, row_err end
        local span_id = trim(input and (input :: any).span_id)
        if span_id ~= "" then
            local touch_err = spans.touch(db, journal_id, span_id, seq)
            if touch_err then return nil, touch_err end
        end
        return row, nil
    end)
    if not advanced then return nil, advance_err end
    -- A first-write race loses its handle to the one automatic position the
    -- identity already holds, so the caller is told the cursor it landed on.
    local landed = trim((advanced :: any).cursor_id)
    return {
        cursor_id = landed ~= "" and landed or cursor_id,
        agent_id = agent_id,
        cursor_seq = tonumber((advanced :: any).last_seen_seq) or 0,
        origin = trim((advanced :: any).origin),
        span_id = trim(input and (input :: any).span_id) ~= "" and trim((input :: any).span_id) or nil,
    }, nil
end

local function new_span_id(): (string?, any?)
    local generated, id_err = new_id()
    if not generated then return nil, id_err end
    local candidate = compact_random_handle(generated, "js_")
    if not candidate then return nil, errors.new({ message = "could not allocate a compact span id", kind = errors.INVALID }) end
    return candidate, nil
end

-- working_on is free text that may also name work. A task id or a
-- graph_id/node_id address resolves to the thing itself; anything else stays
-- exactly the words the agent wrote. The raw text is kept either way, so a
-- purpose is never rewritten into something the agent did not say.
local function resolve_working_on(journal_id: string, working_on: any): (any?, any?)
    local raw = trim(working_on)
    if raw == "" then return { purpose_kind = "none" }, nil end
    local purpose: any = { purpose = raw, purpose_kind = "text" }
    local graph_id, node_id = raw:match("^([^/%s]+)/([^/%s]+)$")
    local resolved, resolve_err = with_db(function(db)
        local task_rows, task_err = db_ops.query(db,
            "SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ? LIMIT 1",
            { journal_id, raw })
        if task_err then return nil, task_err end
        if task_rows and task_rows[1] then
            return { purpose_kind = "task", purpose_task_id = raw }, nil
        end
        if graph_id and node_id then
            local node_rows, node_err = db_ops.query(db, [[
                SELECT id FROM chestor_journal_graph_nodes
                 WHERE journal_id = ? AND graph_id = ? AND id = ? LIMIT 1
            ]], { journal_id, graph_id, node_id })
            if node_err then return nil, node_err end
            if node_rows and node_rows[1] then
                return { purpose_kind = "node", purpose_graph_id = graph_id, purpose_node_id = node_id }, nil
            end
        end
        return {}, nil
    end)
    if not resolved then return nil, resolve_err end
    for key, value in pairs(resolved :: any) do purpose[key] = value end
    return purpose, nil
end

-- The write-side identity seam. It resolves who is writing, makes sure that
-- identity holds a durable position in this journal, and answers the work span
-- the fact about to be appended belongs to - opening one when the identity has
-- none or its last span already went quiet. Called before the append so the
-- span id rides the immutable fact body exactly as cursor_id and episode_id
-- do; the append's receipt then extends the same span through advance_cursor.
function M.attach_span(journal_id: string, input: any): (any?, any?)
    local identity = M.resolve_identity(input) :: any
    local cursor_id = trim(identity.cursor_id)
    local agent_id = trim(identity.agent_id)
    if cursor_id == "" and agent_id == "" then return nil, nil end
    if cursor_id == "" then
        local resolved, resolve_err = auto_cursor_for(journal_id, agent_id)
        if not resolved then return nil, resolve_err end
        cursor_id = resolved :: string
    end
    local purpose, purpose_err = resolve_working_on(journal_id, input and (input :: any).working_on)
    if not purpose then return nil, purpose_err end
    local idle_before = os.time() - types.span_idle_s()
    return with_db(function(db)
        if agent_id == "" then
            local existing, existing_err = cursors.get(db, journal_id, cursor_id)
            if existing_err then return nil, existing_err end
            if not existing then return nil, errors.new({ message = "journal cursor not found: " .. cursor_id, kind = errors.NOT_FOUND }) end
            agent_id = trim((existing :: any).agent_id)
        else
            -- The span references a cursor, so the position row exists before
            -- the span does; the watermark itself moves only after the append.
            local _, claim_err = cursors.advance(db, journal_id, cursor_id, agent_id, 0,
                trim(identity.cursor_id) ~= "" and "explicit" or "auto")
            if claim_err then return nil, claim_err end
        end
        local open, open_err = spans.open_for_cursor(db, journal_id, cursor_id)
        if open_err then return nil, open_err end
        -- A span that already went quiet is sealed at its last activity before
        -- this write starts a fresh one, so the same idle rule holds whether
        -- the sweep or the returning agent notices first.
        if open and (tonumber((open :: any).last_activity_at) or 0) <= idle_before then
            local _, seal_err = spans.seal_idle(db, journal_id, idle_before, nil)
            if seal_err then return nil, seal_err end
            open = nil
        end
        if open then
            local span_id = trim((open :: any).span_id)
            if (purpose :: any).purpose_kind ~= "none"
                and trim((open :: any).purpose) ~= trim((purpose :: any).purpose) then
                local set_err = spans.set_purpose(db, journal_id, span_id, purpose)
                if set_err then return nil, set_err end
            end
            return { span_id = span_id, cursor_id = cursor_id, agent_id = agent_id, opened = false }, nil
        end
        local generated, span_err = new_span_id()
        if not generated then return nil, span_err end
        local head_rows, head_err = db_ops.query(db,
            "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
            { journal_id })
        if head_err then return nil, head_err end
        local started_seq = head_rows and head_rows[1] and tonumber((head_rows[1] :: any).n) or 0
        local insert_err = spans.insert(db, journal_id, {
            span_id = generated,
            agent_id = agent_id,
            cursor_id = cursor_id,
            origin = trim(identity.cursor_id) ~= "" and "explicit" or "auto",
            purpose = (purpose :: any).purpose,
            purpose_kind = (purpose :: any).purpose_kind,
            purpose_task_id = (purpose :: any).purpose_task_id,
            purpose_graph_id = (purpose :: any).purpose_graph_id,
            purpose_node_id = (purpose :: any).purpose_node_id,
            started_seq = started_seq,
        })
        if insert_err then return nil, insert_err end
        return { span_id = generated, cursor_id = cursor_id, agent_id = agent_id, opened = true }, nil
    end)
end

-- The periodic seal: every span that has been quiet longer than the configured
-- idle bound closes at the time it last saw work. The maintainer heartbeat owns
-- the cadence; this call is bounded and idempotent, so a saturated sweep simply
-- continues on the next beat.
function M.sweep_spans(journal_id: string, opts: any): (any?, any?)
    local idle_s = math.max(60, math.floor(tonumber(opts and (opts :: any).idle_s) or types.span_idle_s()))
    local now = math.floor(tonumber(opts and (opts :: any).now) or os.time())
    return with_db(function(db)
        local sealed, seal_err = spans.seal_idle(db, journal_id, now - idle_s,
            tonumber(opts and (opts :: any).limit))
        if not sealed then return nil, seal_err end
        local counts, counts_err = spans.counts(db, journal_id)
        if not counts then return nil, counts_err end
        return {
            sealed = (sealed :: any).count,
            saturated = (sealed :: any).saturated,
            open = (counts :: any).open,
            total = (counts :: any).total,
            idle_s = idle_s,
        }, nil
    end)
end

local CONTEXT_LOAD = { pointer = true, summary = true, full = true }

local function normalize_context_refs(values: any): (any?, any?)
    if values ~= nil and type(values) ~= "table" then return nil, errors.new({ message = "context_refs must be an array", kind = errors.INVALID }) end
    local out: { any } = {}
    local positions: any = {}
    for index, raw in ipairs(type(values) == "table" and values or {}) do
        if #out >= 32 then return nil, errors.new({ message = "context_refs is limited to 32 nodes", kind = errors.INVALID }) end
        if type(raw) ~= "table" then return nil, errors.new({ message = "context_refs[" .. tostring(index) .. "] must be an object", kind = errors.INVALID }) end
        local address = type((raw :: any).address) == "table" and (raw :: any).address or raw
        local graph_id = trim((address :: any).graph_id)
        local node_id = trim((address :: any).node_id)
        if graph_id == "" or node_id == "" then
            return nil, errors.new({ message = "context_refs[" .. tostring(index) .. "] requires graph_id and node_id", kind = errors.INVALID })
        end
        local load = string.lower(trim((raw :: any).load))
        if load == "" then load = "summary" end
        if not CONTEXT_LOAD[load] then return nil, errors.new({ message = "context_refs load must be pointer, summary, or full", kind = errors.INVALID }) end
        local item: any = {
            graph_id = graph_id,
            node_id = node_id,
            load = load,
            reason = trim((raw :: any).reason) ~= "" and trim((raw :: any).reason) or nil,
            required = (raw :: any).required == true,
        }
        local key = graph_id .. "\0" .. node_id
        local prior = positions[key]
        if prior then out[prior] = item else out[#out + 1] = item; positions[key] = #out end
    end
    return out, nil
end

local function merge_context_refs(base: any, additions: any): (any?, any?)
    local combined: { any } = {}
    for _, item in ipairs(type(base) == "table" and base or {}) do combined[#combined + 1] = item end
    for _, item in ipairs(type(additions) == "table" and additions or {}) do combined[#combined + 1] = item end
    return normalize_context_refs(combined)
end

local function validate_context_refs(journal_id: string, refs: any): error?
    local _, err = with_db(function(db)
        for _, item in ipairs(refs or {}) do
            local rows, err = db_ops.query(db, [[
                SELECT id FROM chestor_journal_graph_nodes
                 WHERE journal_id = ? AND graph_id = ? AND id = ? LIMIT 1
            ]], { journal_id, (item :: any).graph_id, (item :: any).node_id })
            if err then return nil, err end
            if not rows or not rows[1] then
                return nil, errors.new({ message = "attached context node does not exist: "
                    .. tostring((item :: any).graph_id) .. "/" .. tostring((item :: any).node_id), kind = errors.INVALID })
            end
        end
        return true, nil
    end)
    return err
end

local function cursor_event(journal_id: string, input: any, op: string): (any?, any?)
    local body = copy_table(input)
    local cursor_id = trim(body.cursor_id)
    local current: any = nil
    if cursor_id ~= "" then
        local found, current_err = with_db(function(db)
            return cursors.get(db, journal_id, cursor_id)
        end)
        if current_err then return nil, current_err end
        current = found
    end
    -- Only open brings a cursor into existence. Moving, checkpointing, or
    -- closing a handle that names nothing would manufacture state - an
    -- episode-less active cursor, or a closed cursor that never opened - so
    -- every other operation refuses and names the handle it could not resolve.
    if not current and op ~= "open" then
        return { success = false, refused = true, code = "cursor_not_found",
            cursor_id = cursor_id ~= "" and cursor_id or nil,
            detail = cursor_id ~= ""
                and ("journal cursor does not exist: " .. cursor_id)
                or "a cursor handle is required; open a cursor before moving, checkpointing, or closing it" }, nil
    end
    if cursor_id == "" then
        local generated, id_err = new_cursor_handle()
        if not generated then return nil, id_err end
        cursor_id = generated
    end
    local caller = actor_id()
    local agent_id = trim(body.agent_id)
    if agent_id == "" and current then agent_id = trim((current :: any).agent_id) end
    if agent_id == "" then agent_id = caller or "" end
    if agent_id == "" then return nil, errors.new({ message = "agent_id is required when no actor identity is available", kind = errors.INVALID }) end
    if current and trim((current :: any).agent_id) ~= agent_id then
        return { success = false, refused = true, code = "cursor_owner_mismatch",
            detail = "cursor belongs to " .. trim((current :: any).agent_id) }, nil
    end
    if current and trim((current :: any).state) ~= "active" and op ~= "open" then
        return { success = false, refused = true, code = "cursor_closed",
            detail = "the cursor is closed; open it to begin a new episode" }, nil
    end
    local expected = tonumber(body.expected_revision)
    local revision = current and (tonumber((current :: any).revision) or 0) or 0
    if current and expected == nil then
        return { success = false, refused = true, code = "cursor_revision_required",
            detail = "expected_revision is required for an existing cursor", current_revision = revision }, nil
    end
    if current and expected ~= revision then
        return { success = false, refused = true, code = "cursor_revision_stale",
            detail = "cursor revision changed", expected_revision = expected, current_revision = revision }, nil
    end
    if not current and expected ~= nil and expected ~= 0 then
        return { success = false, refused = true, code = "cursor_not_found",
            detail = "new cursor expected_revision must be 0" }, nil
    end
    local explicit_graph = trim(body.graph_id)
    local explicit_node = trim(body.node_id)
    if (explicit_graph == "") ~= (explicit_node == "") then
        return nil, errors.new({ message = "cursor graph_id and node_id must be supplied together", kind = errors.INVALID })
    end
    local has_explicit_address = explicit_graph ~= ""
    local explicit_task = trim(body.task_id)
    local task_id = explicit_task
    -- Moving to a generic address leaves the optional work adapter behind
    -- unless the caller explicitly supplies a task_id for it.
    if task_id == "" and current and not has_explicit_address then
        task_id = trim((current :: any).current_task_id)
    end
    local graph_id = explicit_graph
    local node_id = explicit_node
    if graph_id == "" and current and explicit_task == "" then
        graph_id = trim((current :: any).current_graph_id)
        node_id = trim((current :: any).current_node_id)
    end
    -- Compatibility for the existing work protocol: task-only callers get a
    -- deterministic graph address without making task vocabulary foundational.
    if graph_id == "" and task_id ~= "" then
        graph_id = "map"
        node_id = "task:" .. task_id
    end
    if graph_id == "" and op ~= "close" then
        return nil, errors.new({ message = "cursor position requires graph_id + node_id, or task_id", kind = errors.INVALID })
    end
    if task_id ~= "" then
        local exists, task_err = with_db(function(db)
            local rows, err = db_ops.query(db,
                "SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ? LIMIT 1",
                { journal_id, task_id })
            if err then return nil, err end
            return rows and rows[1] ~= nil, nil
        end)
        if task_err then return nil, task_err end
        if not exists then
            return { success = false, refused = true, code = "cursor_task_missing",
                detail = "cursor target task does not exist: " .. task_id }, nil
        end
    end
    if has_explicit_address then
        local exists, address_err = with_db(function(db)
            local rows, err = db_ops.query(db, [[
                SELECT id FROM chestor_journal_graph_nodes
                 WHERE journal_id = ? AND graph_id = ? AND id = ? LIMIT 1
            ]], { journal_id, graph_id, node_id })
            if err then return nil, err end
            return rows and rows[1] ~= nil, nil
        end)
        if address_err then return nil, address_err end
        if not exists then
            return { success = false, refused = true, code = "cursor_node_missing",
                detail = "cursor target graph node does not exist: " .. graph_id .. "/" .. node_id }, nil
        end
    end
    local parent_cursor_id = trim(body.parent_cursor_id)
    local parent_cursor: any = nil
    if parent_cursor_id ~= "" and not current then
        local parent, parent_err = with_db(function(db)
            return cursors.get(db, journal_id, parent_cursor_id)
        end)
        if parent_err then return nil, parent_err end
        if not parent then
            return { success = false, refused = true, code = "parent_cursor_missing",
                detail = "delegating parent cursor does not exist: " .. parent_cursor_id }, nil
        end
        parent_cursor = parent
    end
    local context_refs: any = nil
    if current and body.context_refs == nil then
        context_refs = (current :: any).context_refs or {}
    else
        local supplied, refs_err = normalize_context_refs(body.context_refs)
        if not supplied then return nil, refs_err end
        context_refs = supplied
        if parent_cursor and body.inherit_context ~= false then
            local inherited, inherited_err = normalize_context_refs((parent_cursor :: any).context_refs or {})
            if not inherited then return nil, inherited_err end
            local parent_graph = trim((parent_cursor :: any).current_graph_id)
            local parent_node = trim((parent_cursor :: any).current_node_id)
            -- Task-adapter cursors may carry the synthesized map/task address
            -- before the optional graph projection catches up. Their governing
            -- work lens already handles inheritance, so only generic cursors
            -- attach the parent's graph position here.
            if parent_graph ~= "" and parent_node ~= ""
                and trim((parent_cursor :: any).current_task_id) == "" then
                inherited[#inherited + 1] = { graph_id = parent_graph, node_id = parent_node,
                    load = "summary", reason = "delegated from parent cursor" }
            end
            context_refs, refs_err = merge_context_refs(inherited, supplied)
            if not context_refs then return nil, refs_err end
        end
    end
    local context_err = validate_context_refs(journal_id, context_refs)
    if context_err then return nil, context_err end
    if not current and op == "open" and body.last_seen_seq == nil then
        local head, head_err = with_db(function(db)
            local rows, err = db_ops.query(db,
                "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
                { journal_id })
            if err then return nil, err end
            return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
        end)
        if head_err then return nil, head_err end
        body.last_seen_seq = tonumber(head) or 0
    end
    local claimed_seen = math.max(0, math.floor(tonumber(body.last_seen_seq) or 0))
    if claimed_seen > 0 then
        local max_seq, max_err = with_db(function(db)
            local rows, err = db_ops.query(db,
                "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
                { journal_id })
            if err then return nil, err end
            return rows and rows[1] and tonumber((rows[1] :: any).n) or 0, nil
        end)
        if max_err then return nil, max_err end
        if claimed_seen > (tonumber(max_seq) or 0) then
            return { success = false, refused = true, code = "cursor_watermark_invalid",
                detail = "last_seen_seq is beyond the folded journal head",
                last_seen_seq = claimed_seen, journal_head = tonumber(max_seq) or 0 }, nil
        end
    end

    local effective_op = op
    if op == "open" and current then effective_op = "rotate" end
    if current and op ~= "checkpoint" and op ~= "open" and op ~= "close" then
        local episode, episode_err = with_db(function(db)
            return cursors.episode(db, journal_id, trim((current :: any).current_episode_id))
        end)
        if episode_err then return nil, episode_err end
        if episode and tonumber((episode :: any).deadline_at) and os.time() > tonumber((episode :: any).deadline_at) then
            return { success = false, refused = true, code = "episode_rotation_required",
                detail = "the eight-hour episode boundary passed; checkpoint then rotate the cursor",
                deadline_at = tonumber((episode :: any).deadline_at) }, nil
        end
    end

    body.cursor_id = cursor_id
    body.agent_id = agent_id
    body.task_id = task_id
    body.graph_id = graph_id
    body.node_id = node_id
    body.context_refs = context_refs
    body.op = effective_op
    body.revision = revision + 1
    body.expected_revision = expected
    body.ts = os.time()
    body.actor_id = caller
    if effective_op == "open" or effective_op == "rotate" then
        local episode_id, episode_err = new_id()
        if not episode_id then return nil, episode_err end
        local requested = math.floor(tonumber(body.episode_ttl_s) or MAX_EPISODE_S)
        local ttl = math.max(60, math.min(requested, MAX_EPISODE_S))
        body.episode_id = episode_id
        body.episode_deadline = body.ts + ttl
        body.episode_ttl_s = ttl
    elseif current then
        body.episode_id = trim((current :: any).current_episode_id)
    end
    if effective_op == "checkpoint" then
        if type(body.checkpoint) ~= "table" then return nil, errors.new({ message = "cursor checkpoint object is required", kind = errors.INVALID }) end
        body.last_seen_seq = math.max(tonumber(body.last_seen_seq) or 0,
            tonumber((current :: any).last_seen_seq) or 0)
    end
    local event_id, event_err = new_id()
    if not event_id then return nil, event_err end
    body.event_id = event_id
    -- The projection fold is asynchronous, so reading the revision above proves
    -- nothing about who else read the same one. This guarded write is where the
    -- winner is decided: the second command holding one expected_revision takes
    -- no claim and is refused, instead of appending an event the fold discards
    -- and being told it succeeded. A claim whose append then fails leaves the
    -- claim standing and the next command builds on it, so the log never
    -- carries two events at one cursor revision.
    if current then
        local claim, claim_err = with_db(function(db)
            return cursors.claim_revision(db, journal_id, cursor_id, revision)
        end)
        if not claim then return nil, claim_err end
        if (claim :: any).claimed ~= true then
            return { success = false, refused = true, code = "cursor_revision_stale",
                detail = "another writer took this cursor revision first",
                expected_revision = expected,
                current_revision = tonumber((claim :: any).revision) or revision }, nil
        end
    end
    local receipt, append_err = append(journal_id, { event(types.EVENT.CURSOR_UPDATED, body) }, true)
    if not receipt then return nil, append_err end
    local return_handle = trim(body.parent_cursor_id)
    if return_handle == "" and current then
        return_handle = trim((current :: any).parent_cursor_id)
    end
    return {
        success = true,
        accepted = true,
        cursor_id = cursor_id,
        agent_id = agent_id,
        task_id = body.task_id,
        graph_id = body.graph_id,
        node_id = body.node_id,
        address = body.graph_id and body.node_id and {
            graph_id = body.graph_id, node_id = body.node_id,
        } or nil,
        operation = effective_op,
        revision = body.revision,
        episode_id = body.episode_id,
        episode_deadline = body.episode_deadline,
        parent_cursor_id = return_handle ~= "" and return_handle or nil,
        return_to = effective_op == "close" and return_handle ~= "" and {
            op = "resume", handle = return_handle,
        } or nil,
        event_id = event_id,
        receipt = receipt,
    }, nil
end

function M.open_cursor(journal_id: string, input: any): (any?, any?)
    return cursor_event(journal_id, input, "open")
end

function M.move_cursor(journal_id: string, input: any): (any?, any?)
    if trim(input and input.reason) == "" then return nil, errors.new({ message = "cursor move reason is required", kind = errors.INVALID }) end
    return cursor_event(journal_id, input, "move")
end

function M.checkpoint_cursor(journal_id: string, input: any): (any?, any?)
    return cursor_event(journal_id, input, "checkpoint")
end

function M.close_cursor(journal_id: string, input: any): (any?, any?)
    return cursor_event(journal_id, input, "close")
end

function M.record_audit_coverage(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local allowed = { finding = true, checked_clean = true, gap = true, not_applicable = true }
    local status = string.lower(trim(body.status))
    if trim(body.audit_task_id or body.task_id) == "" then return nil, errors.new({ message = "audit_task_id is required", kind = errors.INVALID }) end
    if trim(body.unit_key) == "" then return nil, errors.new({ message = "audit unit_key is required", kind = errors.INVALID }) end
    if not allowed[status] then return nil, errors.new({ message = "audit status must be finding, checked_clean, gap, or not_applicable", kind = errors.INVALID }) end
    body.status = status
    body.task_id = trim(body.audit_task_id or body.task_id)
    body.audit_task_id = body.task_id
    local validation, validation_err = with_db(function(db)
        local task_rows, task_err = db_ops.query(db,
            "SELECT id FROM chestor_journal_tasks WHERE journal_id = ? AND id = ? LIMIT 1",
            { journal_id, body.task_id })
        if task_err then return nil, task_err end
        if not task_rows or not task_rows[1] then
            return enforcement.refusal("audit_task_missing", "audit task does not exist: " .. body.task_id), nil
        end
        if status == "gap" then
            local decision_id = trim(body.decision_id)
            if decision_id == "" then
                return enforcement.refusal("decide_required", "an audit coverage gap requires decision_id"), nil
            end
            local decision_rows, decision_err = db_ops.query(db,
                "SELECT event_type FROM chestor_journal_events WHERE journal_id = ? AND id = ? LIMIT 1",
                { journal_id, decision_id })
            if decision_err then return nil, decision_err end
            if not decision_rows or not decision_rows[1]
                or string.lower(trim((decision_rows[1] :: any).event_type)) ~= "decision" then
                return enforcement.refusal("decision_kind", "audit gap decision_id must resolve to a decision fact"), nil
            end
        end
        for _, evidence_id in ipairs(type(body.evidence_event_ids) == "table" and body.evidence_event_ids or {}) do
            local evidence_rows, evidence_err = db_ops.query(db,
                "SELECT id FROM chestor_journal_events WHERE journal_id = ? AND id = ? LIMIT 1",
                { journal_id, tostring(evidence_id) })
            if evidence_err then return nil, evidence_err end
            if not evidence_rows or not evidence_rows[1] then
                return enforcement.refusal("evidence_missing", "audit evidence event does not exist: " .. tostring(evidence_id)), nil
            end
        end
        return { success = true }, nil
    end)
    if validation_err then return nil, validation_err end
    if validation and (validation :: any).refused then return validation, nil end
    body.event_type = "audit.coverage"
    body.title = trim(body.title) ~= "" and body.title or (body.unit_key .. ": " .. status)
    local id_err = ensure_event_id(body)
    if id_err then return nil, id_err end
    local receipt, err = append(journal_id, { event(types.EVENT.AUDIT_COVERAGE_RECORDED, body) })
    if not receipt then return nil, err end
    return { success = true, accepted = true, event_id = body.event_id, receipt = receipt }, nil
end

function M.record_integration(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local allowed = { pending = true, accepted = true, rejected = true, superseded = true }
    local disposition = string.lower(trim(body.disposition))
    if disposition == "" then disposition = "pending" end
    if not allowed[disposition] then return nil, errors.new({ message = "invalid integration disposition", kind = errors.INVALID }) end
    for _, key in ipairs({ "receipt_id", "parent_cursor_id", "child_cursor_id" }) do
        if trim(body[key]) == "" then return nil, key .. " is required" end
    end
    if trim(body.parent_cursor_id) == trim(body.child_cursor_id) then
        return enforcement.refusal("integration_self", "a cursor cannot integrate itself"), nil
    end
    local validation, validation_err = with_db(function(db)
        local parent, parent_err = cursors.get(db, journal_id, trim(body.parent_cursor_id))
        if parent_err then return nil, parent_err end
        local child, child_err = cursors.get(db, journal_id, trim(body.child_cursor_id))
        if child_err then return nil, child_err end
        if not parent then return enforcement.refusal("parent_cursor_missing", "parent cursor does not exist"), nil end
        if not child then return enforcement.refusal("child_cursor_missing", "child cursor does not exist"), nil end
        if trim((child :: any).parent_cursor_id) ~= trim(body.parent_cursor_id) then
            return enforcement.refusal("integration_parent_mismatch",
                "the receipt parent must match the child cursor's delegating parent"), nil
        end
        local acting_cursor_id = trim(body.cursor_id)
        if disposition == "pending" and acting_cursor_id ~= trim(body.child_cursor_id) then
            return enforcement.refusal("integration_actor",
                "a pending integration receipt must be recorded through the child cursor"), nil
        end
        if disposition ~= "pending" and acting_cursor_id ~= trim(body.parent_cursor_id) then
            return enforcement.refusal("integration_actor",
                "an integration disposition must be recorded through the parent cursor"), nil
        end
        local prior_rows, prior_err = db_ops.query(db, [[
            SELECT disposition, parent_cursor_id, child_cursor_id
              FROM chestor_journal_integrations
             WHERE journal_id = ? AND receipt_id = ? LIMIT 1
        ]], { journal_id, body.receipt_id })
        if prior_err then return nil, prior_err end
        local prior = prior_rows and prior_rows[1] or nil
        if not prior and disposition ~= "pending" then
            return enforcement.refusal("integration_pending_required",
                "the child must record a pending integration receipt before parent disposition"), nil
        end
        if prior then
            if trim((prior :: any).parent_cursor_id) ~= trim(body.parent_cursor_id)
                or trim((prior :: any).child_cursor_id) ~= trim(body.child_cursor_id) then
                return enforcement.refusal("integration_rebind", "integration receipt cursor identities are append-only"), nil
            end
            local prior_disposition = string.lower(trim((prior :: any).disposition))
            if prior_disposition ~= "pending" and disposition ~= "superseded" then
                return enforcement.refusal("integration_terminal",
                    "an accepted or rejected integration may only be superseded"), nil
            end
        end
        local from_seq = math.max(0, math.floor(tonumber(body.source_from_seq) or 0))
        local to_seq = math.max(0, math.floor(tonumber(body.source_to_seq) or 0))
        if not prior and from_seq == 0 and to_seq == 0 then
            local episode, episode_err = cursors.episode(db, journal_id,
                trim((child :: any).current_episode_id))
            if episode_err then return nil, episode_err end
            from_seq = episode and math.max(0,
                math.floor(tonumber((episode :: any).started_seq) or 0)) or 0
            to_seq = math.max(0, math.floor(tonumber((child :: any).checkpoint_seq) or 0))
            if from_seq == 0 or to_seq == 0 then
                return enforcement.refusal("integration_checkpoint_required",
                    "checkpoint the child cursor before handing it to the parent"), nil
            end
            body.source_from_seq = from_seq
            body.source_to_seq = to_seq
        end
        if not prior and (from_seq == 0 or to_seq == 0) then
            return enforcement.refusal("integration_range",
                "a pending integration receipt requires a non-empty source range"), nil
        end
        if to_seq > 0 and from_seq > to_seq then
            return enforcement.refusal("integration_range", "source_from_seq exceeds source_to_seq"), nil
        end
        local head_rows, head_err = db_ops.query(db,
            "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
            { journal_id })
        if head_err then return nil, head_err end
        local head = head_rows and head_rows[1] and tonumber((head_rows[1] :: any).n) or 0
        if to_seq > head then
            return enforcement.refusal("integration_range", "source_to_seq exceeds the folded journal head"), nil
        end
        for _, evidence_id in ipairs(type(body.evidence_event_ids) == "table" and body.evidence_event_ids or {}) do
            local evidence_rows, evidence_err = db_ops.query(db, [[
                SELECT seq FROM chestor_journal_events
                 WHERE journal_id = ? AND id = ? LIMIT 1
            ]], { journal_id, tostring(evidence_id) })
            if evidence_err then return nil, evidence_err end
            if not evidence_rows or not evidence_rows[1] then
                return enforcement.refusal("evidence_missing",
                    "integration evidence event does not exist: " .. tostring(evidence_id)), nil
            end
            local evidence_seq = tonumber((evidence_rows[1] :: any).seq) or 0
            if not prior and (evidence_seq < from_seq or evidence_seq > to_seq) then
                return enforcement.refusal("integration_evidence_range",
                    "integration evidence falls outside the declared source range: " .. tostring(evidence_id)), nil
            end
        end
        return { success = true }, nil
    end)
    if validation_err then return nil, validation_err end
    if validation and (validation :: any).refused then return validation, nil end
    body.disposition = disposition
    body.event_type = "integration"
    body.title = trim(body.title) ~= "" and body.title or ("Child result " .. disposition)
    local id_err = ensure_event_id(body)
    if id_err then return nil, id_err end
    local receipt, err = append(journal_id, { event(types.EVENT.INTEGRATION_RECORDED, body) })
    if not receipt then return nil, err end
    return { success = true, accepted = true, event_id = body.event_id, receipt_id = body.receipt_id, receipt = receipt }, nil
end

local function normalize_relation(value: any): (string?, any?)
    local relation = string.lower(trim(value))
    if relation == "" then relation = "about" end
    if #relation > 64 or not relation:match("^[a-z][a-z0-9%._%-]*$") then
        return nil, errors.new({ message = "reference relation must be a lowercase or namespaced identifier", kind = errors.INVALID })
    end
    return relation, nil
end

function M.link_reference(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local graph_id = trim(body.graph_id)
    if graph_id == "" then graph_id = "map" end
    local node_id = trim(body.node_id)
    local uri = trim(body.uri)
    if node_id == "" then return nil, errors.new({ message = "reference node_id is required", kind = errors.INVALID }) end
    if uri == "" or #uri > 4096 then return nil, errors.new({ message = "reference uri is required and must be at most 4096 characters", kind = errors.INVALID }) end
    local relation, relation_err = normalize_relation(body.relation)
    if not relation then return nil, relation_err end
    local ref_id = trim(body.ref_id)
    local version = trim(body.version)
    local resolved, validation_err = with_db(function(db)
        local nodes, node_err = db_ops.query(db, [[
            SELECT id FROM chestor_journal_graph_nodes
             WHERE journal_id = ? AND graph_id = ? AND id = ? LIMIT 1
        ]], { journal_id, graph_id, node_id })
        if node_err then return nil, node_err end
        if not nodes or not nodes[1] then
            return nil, errors.new({ message = "reference node does not exist: " .. graph_id .. "/" .. node_id, kind = errors.INVALID })
        end
        if ref_id == "" then
            local canonical, canonical_err = db_ops.query(db, [[
                SELECT ref_id FROM chestor_journal_references
                 WHERE journal_id = ? AND uri = ? AND version = ? LIMIT 1
            ]], { journal_id, uri, version })
            if canonical_err then return nil, canonical_err end
            return canonical and canonical[1] and trim((canonical[1] :: any).ref_id) or "", nil
        end
        local refs, ref_err = db_ops.query(db,
            "SELECT uri, version FROM chestor_journal_references WHERE journal_id = ? AND ref_id = ? LIMIT 1",
            { journal_id, ref_id })
        if ref_err then return nil, ref_err end
        if refs and refs[1] and (trim((refs[1] :: any).uri) ~= uri
            or trim((refs[1] :: any).version) ~= version) then
            return nil, errors.new({ message = "reference id already names a different uri or version: " .. ref_id, kind = errors.INVALID })
        end
        return ref_id, nil
    end)
    if resolved == nil then return nil, validation_err end
    if trim(resolved) ~= "" then
        ref_id = trim(resolved)
    elseif ref_id == "" then
        local generated, id_err = new_id()
        if not generated then return nil, id_err end
        ref_id = generated
    end
    body.ref_id = ref_id
    body.graph_id = graph_id
    body.node_id = node_id
    body.uri = uri
    body.relation = relation
    body.ref_kind = trim(body.ref_kind) ~= "" and string.lower(trim(body.ref_kind)) or "resource"
    body.version = version
    body.ref_attrs = copy_table(body.ref_attrs or body.attrs or body.ref_metadata or body.metadata)
    body.edge_attrs = copy_table(body.edge_attrs or body.provenance)
    local id_err = ensure_event_id(body)
    if id_err then return nil, id_err end
    local receipt, err = append(journal_id, { event(types.EVENT.REFERENCE_LINKED, body) })
    if not receipt then return nil, err end
    return { success = true, accepted = true, event_id = body.event_id,
        ref_id = ref_id, graph_id = graph_id, node_id = node_id,
        relation = relation, receipt = receipt }, nil
end

function M.unlink_reference(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local graph_id = trim(body.graph_id)
    if graph_id == "" then graph_id = "map" end
    local node_id = trim(body.node_id)
    local ref_id = trim(body.ref_id)
    if node_id == "" or ref_id == "" then return nil, errors.new({ message = "reference node_id and ref_id are required", kind = errors.INVALID }) end
    if trim(body.reason) == "" then return nil, errors.new({ message = "reference unlink reason is required", kind = errors.INVALID }) end
    local relation, relation_err = normalize_relation(body.relation)
    if not relation then return nil, relation_err end
    local active, active_err = with_db(function(db)
        local rows, query_err = db_ops.query(db, [[
            SELECT ref_id FROM chestor_journal_node_refs
             WHERE journal_id = ? AND graph_id = ? AND node_id = ?
               AND ref_id = ? AND relation = ? AND state = 'active' LIMIT 1
        ]], { journal_id, graph_id, node_id, ref_id, relation })
        if query_err then return nil, query_err end
        if not rows or not rows[1] then return nil, errors.new({ message = "active reference edge does not exist", kind = errors.INVALID }) end
        return true, nil
    end)
    if not active then return nil, active_err end
    body.graph_id = graph_id
    body.node_id = node_id
    body.ref_id = ref_id
    body.relation = relation
    local id_err = ensure_event_id(body)
    if id_err then return nil, id_err end
    local receipt, err = append(journal_id, { event(types.EVENT.REFERENCE_UNLINKED, body) })
    if not receipt then return nil, err end
    return { success = true, accepted = true, event_id = body.event_id,
        ref_id = ref_id, graph_id = graph_id, node_id = node_id,
        relation = relation, receipt = receipt }, nil
end

local function validate_selection(journal_id: string, body: any): error?
    local selection = body.selection
    if type(selection) ~= "table" and type(body.metadata) == "table" then
        selection = (body.metadata :: any).selection
    end
    if selection == nil then return nil end
    if type(selection) ~= "table" then return errors.new({ kind = errors.INVALID, message = "decision selection must be an object" }) end
    if string.lower(trim(body.event_type)) ~= "decision" then
        return errors.new({ kind = errors.INVALID, message = "selection is valid only on a decision fact" })
    end
    local graph_id = trim((selection :: any).graph_id or body.graph_id)
    if graph_id == "" then graph_id = "map" end
    local candidates = copy_array((selection :: any).candidate_node_ids)
    local selected = copy_array((selection :: any).selected_node_ids)
    local rejected = copy_array((selection :: any).rejected_node_ids)
    local criteria = copy_array((selection :: any).criteria)
    if #candidates < 2 or #candidates > 32 then return errors.new({ kind = errors.INVALID, message = "selection requires 2 to 32 candidate_node_ids" }) end
    if #selected < 1 then return errors.new({ kind = errors.INVALID, message = "selection requires at least one selected_node_id" }) end
    if #criteria < 1 or #criteria > 32 then return errors.new({ kind = errors.INVALID, message = "selection requires 1 to 32 criteria" }) end
    if trim((selection :: any).rationale or body.body) == "" then return errors.new({ kind = errors.INVALID, message = "selection rationale is required" }) end
    local candidate_set: any = {}
    local normalized_candidates: { string } = {}
    for _, raw in ipairs(candidates) do
        local id = trim(raw)
        if id == "" or candidate_set[id] then return errors.new({ kind = errors.INVALID, message = "selection candidate_node_ids must be unique non-empty ids" }) end
        candidate_set[id] = true
        normalized_candidates[#normalized_candidates + 1] = id
    end
    local disposition: any = {}
    local normalized_selected: { string } = {}
    local normalized_rejected: { string } = {}
    for list_index, list in ipairs({ selected, rejected }) do
        for _, raw in ipairs(list) do
            local id = trim(raw)
            if not candidate_set[id] then return errors.new({ kind = errors.INVALID, message = "selected/rejected node is not a declared candidate: " .. id }) end
            if disposition[id] then return errors.new({ kind = errors.INVALID, message = "selection candidate has more than one disposition: " .. id }) end
            disposition[id] = true
            local target = list_index == 1 and normalized_selected or normalized_rejected
            target[#target + 1] = id
        end
    end
    for id, _ in pairs(candidate_set) do
        if not disposition[id] then return errors.new({ kind = errors.INVALID, message = "selection candidate has no selected/rejected disposition: " .. tostring(id) }) end
    end
    local validation, validation_err = with_db(function(db)
        for id, _ in pairs(candidate_set) do
            local rows, err = db_ops.query(db,
                "SELECT id FROM chestor_journal_graph_nodes WHERE journal_id = ? AND graph_id = ? AND id = ? LIMIT 1",
                { journal_id, graph_id, tostring(id) })
            if err then return nil, err end
            if not rows or not rows[1] then
                return nil, errors.new({ message = "selection candidate node does not exist: " .. graph_id .. "/" .. tostring(id), kind = errors.INVALID })
            end
        end
        return true, nil
    end)
    if not validation then return validation_err end
    local normalized = selection :: any
    normalized.graph_id = graph_id
    normalized.candidate_node_ids = normalized_candidates
    normalized.selected_node_ids = normalized_selected
    normalized.rejected_node_ids = normalized_rejected
    normalized.criteria = criteria
    normalized.rationale = trim(normalized.rationale or body.body)
    body.selection = normalized
    body.metadata = type(body.metadata) == "table" and body.metadata or {}
    local metadata = body.metadata :: any
    metadata.decision_mode = "selection"
    metadata.selection = normalized
    return nil
end

-- Facts attach through the writing agent's lease when one is supplied (§3):
-- the lease must be live and unsuperseded; without an explicit task_id the
-- fact lands on the lease's task. Lease identity stays capability state and
-- never enters the event body. Returns the lease row, a coded refusal, or
-- nil when no lease was supplied.
local function lease_for_fact(journal_id: string, body: any): (any?, any?)
    local lease_id = trim(body.lease_id)
    body.lease_id = nil
    body.fencing_token = nil
    if lease_id == "" then return nil, nil end
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local lease, resolve_err = enforcement.lease_resolve(db, journal_id, lease_id, nil)
    db:release()
    if resolve_err then return nil, resolve_err end
    if (lease :: any).refused then return lease, nil end
    if trim(body.task_id) == "" then body.task_id = trim((lease :: any).task_id) end
    return lease, nil
end

-- Any successful fact write renews the supplying lease (X9).
local function renew_after_write(journal_id: string, lease: any)
    if type(lease) ~= "table" then return end
    local db = db_ops.open()
    if not db then return end
    enforcement.lease_renew(db, journal_id, tostring((lease :: any).lease_id))
    db:release()
end

function M.append_entry(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    body.event_type = trim(body.event_type) ~= "" and body.event_type or "note"
    body.task_id = trim(body.task_id) ~= "" and trim(body.task_id) or nil
    body.tags = copy_array(body.tags)
    body.metadata = copy_table(body.metadata)
    local selection_err = validate_selection(journal_id, body)
    if selection_err then return nil, selection_err end
    local lease, lease_err = lease_for_fact(journal_id, body)
    if lease_err then return nil, lease_err end
    if lease and (lease :: any).refused then return lease, nil end
    local event_id_err = ensure_event_id(body)
    if event_id_err then return nil, event_id_err end
    local receipt, append_err = append(journal_id, { event(types.EVENT.ENTRY_APPENDED, body) })
    if not receipt then return nil, append_err end
    renew_after_write(journal_id, lease)
    local result = copy_table(receipt)
    result.event_id = body.event_id
    result.task_id = body.task_id
    return result, nil
end

function M.update_digest(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    body.body = body.digest or body.body
    if trim(body.body) == "" then return nil, errors.new({ message = "digest is required", kind = errors.INVALID }) end
    local event_id_err = ensure_event_id(body)
    if event_id_err then return nil, event_id_err end
    local source_seq = tonumber(body.source_seq)
    if source_seq == nil then
        return append(journal_id, { event(types.EVENT.DIGEST_UPDATED, body) })
    end
    -- X7: digest provenance guards. source_seq is monotonic per journal
    -- (I7.1) and can never claim a seq beyond the last folded event (I7.2).
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local state, state_err = db_ops.query(db,
            "SELECT digest_source_seq FROM chestor_journal_state WHERE journal_id = ? LIMIT 1",
            { journal_id }
        )
        if state_err then return nil, state_err end
        local stored = state and state[1] and tonumber((state[1] :: any).digest_source_seq) or 0
        if source_seq <= stored then
            return enforcement.refusal("monotonic",
                "digest source_seq " .. tostring(source_seq) .. " does not advance past " .. tostring(stored)), nil
        end
        local seq_rows, seq_err = db_ops.query(db,
            "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
            { journal_id }
        )
        if seq_err then return nil, seq_err end
        local last_seq = seq_rows and seq_rows[1] and tonumber((seq_rows[1] :: any).n) or 0
        if source_seq > last_seq then
            return enforcement.refusal("provenance",
                "digest claims seq " .. tostring(source_seq) .. " beyond last folded event " .. tostring(last_seq)), nil
        end
        body.source_seq = source_seq
        local receipt, append_err = append(journal_id, { event(types.EVENT.DIGEST_UPDATED, body) })
        if not receipt then return nil, append_err end
        local result = copy_table(receipt)
        result.event_id = body.event_id
        result.source_seq = source_seq
        return result, nil
    end)
end

-- X7/I7.3 staleness SLA: a journal whose read model advanced 25 or more
-- events past the digest's source_seq without a fresh digest emits a health
-- fact; staleness beyond the SLA is itself health-visible.
M.DIGEST_SLA_FACTS = 25

-- opts.emit = false reports the SLA state without appending the health fact;
-- the periodic health writer uses it to keep one event per violation episode
-- while still carrying the live lag on every heartbeat.
function M.digest_sla_check(journal_id: string, opts: any): (any?, any?)
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local state, state_err = db_ops.query(db,
        "SELECT digest_source_seq FROM chestor_journal_state WHERE journal_id = ? LIMIT 1",
        { journal_id }
    )
    if state_err then db:release(); return nil, state_err end
    local seq_rows, seq_err = db_ops.query(db,
        "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
        { journal_id }
    )
    db:release()
    if seq_err then return nil, seq_err end
    local stored = state and state[1] and tonumber((state[1] :: any).digest_source_seq) or 0
    local last_seq = seq_rows and seq_rows[1] and tonumber((seq_rows[1] :: any).n) or 0
    local lag = last_seq - stored
    if lag < M.DIGEST_SLA_FACTS then
        return { success = true, violated = false, lag = lag }, nil
    end
    if type(opts) == "table" and (opts :: any).emit == false then
        return { success = true, violated = true, lag = lag }, nil
    end
    local receipt, append_err = append(journal_id, { event(types.EVENT.ENTRY_APPENDED, {
        event_type = "health",
        title = "Digest staleness SLA violated",
        body = "Digest lags the journal by " .. tostring(lag) .. " events (SLA " .. tostring(M.DIGEST_SLA_FACTS) .. ").",
        tags = { "health", "derived" },
        metadata = { lag = lag, digest_source_seq = stored, last_seq = last_seq },
    }) })
    if not receipt then return nil, append_err end
    return { success = true, violated = true, lag = lag, receipt = receipt }, nil
end

function M.create_checkpoint(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    body.body = body.digest or body.body
    body.title = trim(body.title) ~= "" and body.title or "Checkpoint"
    body.task_id = trim(body.task_id) ~= "" and trim(body.task_id) or nil
    if trim(body.body) == "" then return nil, errors.new({ message = "checkpoint body is required", kind = errors.INVALID }) end
    local lease, lease_err = lease_for_fact(journal_id, body)
    if lease_err then return nil, lease_err end
    if lease and (lease :: any).refused then return lease, nil end
    local event_id_err = ensure_event_id(body)
    if event_id_err then return nil, event_id_err end
    local receipt, append_err = append(journal_id, { event(types.EVENT.CHECKPOINT_CREATED, body) })
    if not receipt then return nil, append_err end
    renew_after_write(journal_id, lease)
    local result = copy_table(receipt)
    result.event_id = body.event_id
    result.task_id = body.task_id
    return result, nil
end

function M.upsert_task(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local task_id = trim(body.id or body.task_id)
    if task_id == "" then
        local generated, id_err = new_id()
        if not generated then return nil, id_err end
        task_id = generated
    end
    if trim(body.title) == "" then return nil, errors.new({ message = "task title is required", kind = errors.INVALID }) end
    body.id = task_id
    body.task_id = task_id
    local work_kind = string.lower(trim(body.work_kind or body.kind))
    if work_kind == "" then work_kind = body.gate == true and "gate" or "task" end
    if not WORK_KIND[work_kind] then return nil, errors.new({ message = "invalid work_kind: " .. work_kind, kind = errors.INVALID }) end
    body.work_kind = work_kind
    local event_id_err = ensure_event_id(body)
    if event_id_err then return nil, event_id_err end
    body.metadata = copy_table(body.metadata)
    local lease_id = trim(body.lease_id)
    -- Calls without lease or command identity retain the documented ungated path.
    if lease_id == "" and trim(body.command_id) == "" then
        return append(journal_id, { event(types.EVENT.TASK_UPSERTED, body) })
    end
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local lease: any = nil
        if lease_id ~= "" then
            local checked, check_err = enforcement.lease_check(db, journal_id, lease_id, body.fencing_token, "decompose", task_id)
            if check_err then return nil, check_err end
            if (checked :: any).refused then return checked, nil end
            lease = checked
        end
        local existing, existing_err = enforcement.task(db, journal_id, task_id)
        if existing_err then return nil, existing_err end
        if existing then
            local existing_row = existing :: any
            -- F6: gate policy change hard-requires an attached decision.
            local is_gate = tonumber(existing_row.gate) == 1 or body.gate == true or tonumber(body.gate) == 1
            if is_gate and body.verifier_policy_hash ~= nil
                and trim(existing_row.verifier_policy_hash) ~= trim(body.verifier_policy_hash)
                and trim(body.decision_id) == "" then
                return enforcement.refusal("decide_required", "gate policy change requires decision_id"), nil
            end
            -- F6/C7: every contract change is breaking and requires a decision.
            local existing_contract: any = nil
            if type(existing_row.metadata) == "table" then existing_contract = (existing_row.metadata :: any).contract end
            local new_contract: any = nil
            if type(body.metadata) == "table" then new_contract = (body.metadata :: any).contract end
            if existing_contract ~= nil and new_contract ~= nil
                and db_ops.canonical(existing_contract) ~= db_ops.canonical(new_contract)
                and trim(body.decision_id) == "" then
                return enforcement.refusal("decide_required", "contract change requires decision_id"), nil
            end
        end
        local status = trim(body.status)
        if not existing and status ~= "" and string.lower(status) ~= "open" then
            -- I10.2: a task cannot be born past its guards; creation with a
            -- non-open status is the same transition attempt from open and
            -- runs the same table (open->done has no verb, so pre-done tasks
            -- are unrepresentable on the command path).
            local verb, verb_err = enforcement.verb_for("open", status)
            if not verb then return enforcement.refusal("invalid_transition", verb_err), nil end
            local synthetic = {
                id = task_id,
                status = "open",
                revision = 1,
                parent_task_id = trim(body.parent_task_id) ~= "" and trim(body.parent_task_id) or nil,
                metadata = body.metadata,
                gate = (body.gate == true or tonumber(body.gate) == 1) and 1 or 0,
                priority = body.priority,
                claim = body.claim,
                verifier_policy_hash = body.verifier_policy_hash,
            }
            local guard, guard_err = enforcement.guard_transition(db, journal_id, synthetic, verb, body)
            if guard_err then return nil, guard_err end
            if (guard :: any).refused then return guard, nil end
            body.guard = (guard :: any).evaluations
        end
        if existing and status ~= "" and string.lower(status) ~= string.lower(trim((existing :: any).status)) then
            -- Status edits are transitions: map to the verb and run the guard
            -- table before the event is accepted.
            local verb, verb_err = enforcement.verb_for((existing :: any).status, status)
            if not verb then return enforcement.refusal("invalid_transition", verb_err), nil end
            if lease then
                local verb_check, verb_check_err = enforcement.lease_check(db, journal_id, lease_id, body.fencing_token, verb, task_id)
                if verb_check_err then return nil, verb_check_err end
                if (verb_check :: any).refused then return verb_check, nil end
            end
            local guard, guard_err = enforcement.guard_transition(db, journal_id, existing, verb, body)
            if guard_err then return nil, guard_err end
            if (guard :: any).refused then return guard, nil end
            body.guard = (guard :: any).evaluations
        end
        local receipt, append_err = append(journal_id, { event(types.EVENT.TASK_UPSERTED, body) })
        if not receipt then return nil, append_err end
        if lease then enforcement.lease_renew(db, journal_id, lease_id) end
        local result = copy_table(receipt)
        result.event_id = body.event_id
        result.task_id = task_id
        return result, nil
    end)
end

function M.link_artifact(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local artifact_id = trim(body.artifact_id or body.id)
    if artifact_id == "" then
        local generated, id_err = new_id()
        if not generated then return nil, id_err end
        artifact_id = generated
    end
    body.artifact_id = artifact_id
    body.task_id = trim(body.task_id) ~= "" and trim(body.task_id) or nil
    body.metadata = copy_table(body.metadata)
    local lease, lease_err = lease_for_fact(journal_id, body)
    if lease_err then return nil, lease_err end
    if lease and (lease :: any).refused then return lease, nil end
    local event_id_err = ensure_event_id(body)
    if event_id_err then return nil, event_id_err end
    local receipt, append_err = append(journal_id, { event(types.EVENT.ARTIFACT_LINKED, body) })
    if not receipt then return nil, append_err end
    renew_after_write(journal_id, lease)
    local result = copy_table(receipt)
    result.event_id = body.event_id
    result.artifact_id = artifact_id
    result.task_id = body.task_id
    return result, nil
end

-- Journal-level nominated focus for the shared UI (Q1). One command = one
-- event; a supplied lease is validated, defaults the target to its own task,
-- and renews on success.
function M.focus_task(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local lease: any = nil
        local lease_id = trim(body.lease_id)
        if lease_id ~= "" then
            local resolved, resolve_err = enforcement.lease_resolve(db, journal_id, lease_id, body.fencing_token)
            if resolve_err then return nil, resolve_err end
            if (resolved :: any).refused then return resolved, nil end
            lease = resolved
        end
        local task_id = trim(body.task_id or body.id)
        if task_id == "" and lease then task_id = trim((lease :: any).task_id) end
        if task_id == "" then return nil, errors.new({ message = "task_id is required", kind = errors.INVALID }) end
        local receipt, append_err = append(journal_id, { event(types.EVENT.TASK_FOCUSED, {
            event_id = command_id,
            task_id = task_id,
        }) })
        if not receipt then return nil, append_err end
        if lease then enforcement.lease_renew(db, journal_id, lease_id) end
        local result = copy_table(receipt)
        result.event_id = command_id
        result.task_id = task_id
        return result, nil
    end)
end

function M.link_tasks(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local from_task_id = trim(body.from_task_id)
    local to_task_id = trim(body.to_task_id)
    if from_task_id == "" or to_task_id == "" then return nil, errors.new({ message = "from_task_id and to_task_id are required", kind = errors.INVALID }) end
    local kind = trim(body.kind) ~= "" and trim(body.kind) or "blocks"
    local event_id_err = ensure_event_id(body)
    if event_id_err then return nil, event_id_err end
    -- I11.1: cycle and folded-endpoint checks run on every add, lease or not;
    -- edge soundness is server correctness, not a capability question. A
    -- supplied lease is validated (PLANNING permits link) and renewed.
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local lease_id = trim(body.lease_id)
        if lease_id ~= "" then
            local checked, check_err = enforcement.lease_check(db, journal_id, lease_id, body.fencing_token, "link", nil)
            if check_err then return nil, check_err end
            if (checked :: any).refused then return checked, nil end
        end
        local check, check_err = enforcement.validate_dep_add(db, journal_id, from_task_id, to_task_id, kind)
        if check_err then return nil, check_err end
        if (check :: any).refused then return check, nil end
        local receipt, append_err = append(journal_id, { event(types.EVENT.TASK_LINKED, {
            event_id = body.event_id,
            from_task_id = from_task_id,
            to_task_id = to_task_id,
            kind = kind,
        }) })
        if not receipt then return nil, append_err end
        if lease_id ~= "" then enforcement.lease_renew(db, journal_id, lease_id) end
        local result = copy_table(receipt)
        result.event_id = body.event_id
        result.from_task_id = from_task_id
        result.to_task_id = to_task_id
        result.kind = kind
        return result, nil
    end)
end

function M.unlink_tasks(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local from_task_id = trim(body.from_task_id)
    local to_task_id = trim(body.to_task_id)
    if from_task_id == "" or to_task_id == "" then return nil, errors.new({ message = "from_task_id and to_task_id are required", kind = errors.INVALID }) end
    local kind = trim(body.kind) ~= "" and trim(body.kind) or "blocks"
    local event_id_err = ensure_event_id(body)
    if event_id_err then return nil, event_id_err end
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local lease_id = trim(body.lease_id)
        if lease_id ~= "" then
            local checked, check_err = enforcement.lease_check(db, journal_id, lease_id, body.fencing_token, "unlink", nil)
            if check_err then return nil, check_err end
            if (checked :: any).refused then return checked, nil end
        end
        local check, check_err = enforcement.validate_dep_remove(db, journal_id, from_task_id, to_task_id, kind, body.decision_id)
        if check_err then return nil, check_err end
        if (check :: any).refused then return check, nil end
        local receipt, append_err = append(journal_id, { event(types.EVENT.TASK_UNLINKED, {
            event_id = body.event_id,
            from_task_id = from_task_id,
            to_task_id = to_task_id,
            kind = kind,
            decision_id = trim(body.decision_id),
        }) })
        if not receipt then return nil, append_err end
        if lease_id ~= "" then enforcement.lease_renew(db, journal_id, lease_id) end
        local result = copy_table(receipt)
        result.event_id = body.event_id
        result.from_task_id = from_task_id
        result.to_task_id = to_task_id
        result.kind = kind
        return result, nil
    end)
end

-- Plan-ahead batch (§6 Decompose): subtasks open under one parent with the
-- verification and composition fields carried through - gate flag, claim,
-- verifier_policy_hash, agent contract (F3, folded into metadata.contract),
-- and the experiment marker - so plans are typed at creation, not patched
-- afterwards. Runs under command identity; a supplied lease is validated
-- (PLANNING permits decompose) and renewed.
function M.decompose(journal_id: string, input: any): (any?, any?)
    local data = copy_table(input)
    local parent_task_id = trim(data.parent_task_id)
    if parent_task_id == "" then return nil, errors.new({ message = "parent_task_id is required", kind = errors.INVALID }) end
    local subtasks = type(data.subtasks) == "table" and data.subtasks or {}
    local events: { any } = {}
    local task_ids: { string } = {}
    for index, raw in ipairs(subtasks :: { any }) do
        local sub = copy_table(raw)
        if trim(sub.title) == "" then return nil, errors.new({ message = "subtask title is required at [" .. tostring(index) .. "]", kind = errors.INVALID }) end
        local task_id = trim(sub.id or sub.task_id)
        if task_id == "" then
            local generated, id_err = new_id()
            if not generated then return nil, id_err end
            task_id = generated
        end
        local event_id, event_id_err = new_id()
        if not event_id then return nil, event_id_err end
        task_ids[#task_ids + 1] = task_id
        local metadata = copy_table(sub.metadata)
        if type(sub.contract) == "table" then metadata.contract = copy_table(sub.contract) end
        if sub.experiment == true then metadata.experiment = true end
        local work_kind = string.lower(trim(sub.work_kind or sub.kind))
        if work_kind == "" then
            if sub.gate == true then work_kind = "gate"
            elseif sub.experiment == true then work_kind = "experiment"
            else work_kind = "task" end
        end
        if not WORK_KIND[work_kind] then return nil, errors.new({ message = "invalid subtask work_kind at [" .. tostring(index) .. "]", kind = errors.INVALID }) end
        events[#events + 1] = event(types.EVENT.TASK_UPSERTED, {
            event_id = event_id,
            id = task_id,
            task_id = task_id,
            parent_task_id = parent_task_id,
            status = "open",
            work_kind = work_kind,
            title = sub.title,
            description = sub.description,
            priority = sub.priority,
            assignee = sub.assignee,
            agent_id = sub.agent_id,
            sort_order = sub.sort_order,
            gate = (sub.gate == true or tonumber(sub.gate) == 1) and true or nil,
            claim = trim(sub.claim) ~= "" and sub.claim or nil,
            verifier_policy_hash = trim(sub.verifier_policy_hash) ~= "" and sub.verifier_policy_hash or nil,
            metadata = metadata,
        })
    end
    if #events == 0 then return nil, errors.new({ message = "subtasks are required", kind = errors.INVALID }) end
    return enforcement.with_command(journal_id, data.command_id, function(db: any, command_id: string): (any?, any?)
        local lease_id = trim(data.lease_id)
        if lease_id ~= "" then
            local checked, check_err = enforcement.lease_check(db, journal_id, lease_id, data.fencing_token, "decompose", nil)
            if check_err then return nil, check_err end
            if (checked :: any).refused then return checked, nil end
        end
        local receipt, append_err = append(journal_id, events)
        if not receipt then return nil, append_err end
        if lease_id ~= "" then enforcement.lease_renew(db, journal_id, lease_id) end
        return { success = true, receipt = receipt, parent_task_id = parent_task_id, task_ids = task_ids }, nil
    end)
end

-- One transition = one command = one event (F2). The transition event id IS
-- the command id, so a raced duplicate deduplicates in the thread log even
-- before the ledger row lands. Guard evaluations ride on the event so done
-- rests on the commit-time record, never on re-evaluation at replay (C3).
local function transition(journal_id: string, input: any, verb: string): (any?, any?)
    local body = copy_table(input)
    local task_id = trim(body.task_id or body.id)
    if task_id == "" then return nil, errors.new({ message = "task_id is required", kind = errors.INVALID }) end
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local principal = trim(body.principal)
        local lease: any = nil
        if principal ~= "" then
            -- C4: system transitions carry a registered principal and a
            -- synthetic command identity instead of a lease. Typed runner
            -- identities count as the runner principal.
            if not (enforcement.is_system_principal(principal) or enforcement.is_runner(principal)) then
                return enforcement.refusal("principal_unknown", "unknown system principal: " .. principal), nil
            end
        elseif trim(body.lease_id) ~= "" then
            local checked, check_err = enforcement.lease_check(db, journal_id, trim(body.lease_id), body.fencing_token, verb, task_id)
            if check_err then return nil, check_err end
            if (checked :: any).refused then return checked, nil end
            lease = checked
        end
        local task, task_err = enforcement.task(db, journal_id, task_id)
        if task_err then return nil, task_err end
        if not task then return nil, errors.new({ message = "task not found: " .. task_id, kind = errors.NOT_FOUND }) end
        body.principal = principal ~= "" and principal or nil
        body.acting_agent = lease and tostring((lease :: any).agent_id) or body.principal
        local guard, guard_err = enforcement.guard_transition(db, journal_id, task, verb, body)
        if guard_err then return nil, guard_err end
        if (guard :: any).refused then return guard, nil end
        local from_status = trim((task :: any).status) ~= "" and trim((task :: any).status) or "open"
        local event_body = {
            event_id = command_id,
            task_id = task_id,
            span_id = trim(body.span_id) ~= "" and trim(body.span_id) or nil,
            verb = verb,
            from_status = from_status,
            to_status = (guard :: any).to_status,
            command_id = command_id,
            lease_id = lease and tostring((lease :: any).lease_id) or nil,
            fencing_token = lease and tonumber((lease :: any).fencing_token) or nil,
            principal = body.principal,
            expected_revision = tonumber(body.expected_revision),
            decision_id = trim(body.decision_id) ~= "" and trim(body.decision_id) or nil,
            receipt_id = trim(body.receipt_id) ~= "" and trim(body.receipt_id) or nil,
            result = body.result,
            waiver = type(body.waiver) == "table" and copy_table(body.waiver) or nil,
            reason = body.reason,
            outcome = body.outcome,
            distilled = body.distilled,
            guard = (guard :: any).evaluations,
        }
        local receipt, append_err = append(journal_id, { event(types.EVENT.TASK_TRANSITIONED, event_body) }, true)
        if not receipt then return nil, append_err end
        if lease then enforcement.lease_renew(db, journal_id, tostring((lease :: any).lease_id)) end
        return {
            success = true,
            receipt = receipt,
            event_id = command_id,
            task_id = task_id,
            verb = verb,
            from_status = from_status,
            to_status = event_body.to_status,
            guard = (guard :: any).evaluations,
        }, nil
    end)
end

-- OpenBranch: issues the mutation lease for a task (F1); the capability is
-- WRITE only when the task is startable, PLANNING otherwise.
function M.open_branch(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local task_id = trim(body.task_id or body.id)
    if task_id == "" then return nil, errors.new({ message = "task_id is required", kind = errors.INVALID }) end
    local agent_id = trim(body.agent_id)
    if agent_id == "" then agent_id = trim(actor_id()) end
    if agent_id == "" then return nil, errors.new({ message = "agent_id is required", kind = errors.INVALID }) end
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local lease, issue_err = enforcement.lease_issue(db, journal_id, agent_id, task_id)
        if issue_err then return nil, issue_err end
        if (lease :: any).refused then return lease, nil end
        return { success = true, lease = lease, task_id = task_id }, nil
    end)
end

function M.start_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "start")
end

function M.complete_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "complete")
end

function M.cancel_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "cancel")
end

function M.reopen_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "reopen")
end

function M.block_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "block")
end

function M.unblock_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "unblock")
end

function M.abandon_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "abandon")
end

function M.fold_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "fold")
end

function M.close_task(journal_id: string, input: any): (any?, any?)
    return transition(journal_id, input, "close")
end

-- The protocol verb surface (§6) named once, beside the implementations it
-- dispatches to. Every caller surface - the trait tool and the HTTP endpoints -
-- resolves a verb through this table, so a verb exists in exactly one place.
M.VERB_COMMAND = {
    start = "start_task",
    complete = "complete_task",
    block = "block_task",
    unblock = "unblock_task",
    cancel = "cancel_task",
    reopen = "reopen_task",
    fold = "fold_task",
    close = "close_task",
    gate_pass = "gate_pass",
    request_verify = "request_verify",
    decompose = "decompose",
    focus = "focus_task",
    link = "link_tasks",
    unlink = "unlink_tasks",
    cursor_open = "open_cursor",
    cursor_move = "move_cursor",
    cursor_checkpoint = "checkpoint_cursor",
    cursor_close = "close_cursor",
}

-- The subset that moves one task's status through the guard table, which is
-- what a task transition is. `abandon` is an explicit internal semantic
-- transition and belongs to no caller surface, so it is absent here exactly
-- as it is absent from the trait's verb set.
M.TRANSITION_VERB = {
    start = true, complete = true, block = true, unblock = true, cancel = true,
    reopen = true, fold = true, close = true, gate_pass = true,
}

-- X9/I9.4 reaper scan: expiry releases concurrency authority; it never makes a
-- semantic claim that the work was abandoned. An in_progress task therefore
-- stays resumable through a fresh open_branch. The reaper adds an auto-snapshot
-- only when no agent checkpoint exists inside the lease's final TTL window.
-- The lease is consumed (revoked) so a rescan is a no-op.
function M.reap_expired(journal_id: string): (any?, any?)
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local now = db_ops.now()
    local expired, query_err = db_ops.query(db, [[
        SELECT lease_id, task_id, ttl_s, expires_at FROM chestor_journal_leases
         WHERE journal_id = ? AND revoked = 0 AND expires_at <= ?
    ]], { journal_id, now })
    if query_err then db:release(); return nil, query_err end
    local reaped: { any } = {}
    for _, row in ipairs(expired or {}) do
        local lease = row :: any
        local lease_id = trim(lease.lease_id)
        local task, task_err = enforcement.task(db, journal_id, trim(lease.task_id))
        if task_err then db:release(); return nil, task_err end
        local entry: any = {
            lease_id = lease_id,
            task_id = trim(lease.task_id),
            released = true,
            abandoned = false,
            resumable = task and string.lower(trim((task :: any).status)) == "in_progress" or false,
            snapshot = false,
        }
        if task and string.lower(trim((task :: any).status)) == "in_progress" then
            local window_start = (tonumber(lease.expires_at) or now) - (tonumber(lease.ttl_s) or 0)
            local checkpoints, checkpoint_err = db_ops.query(db, [[
                SELECT 1 AS present FROM chestor_journal_events
                 WHERE journal_id = ? AND task_id = ? AND event_type = 'checkpoint' AND ts >= ? LIMIT 1
            ]], { journal_id, trim(lease.task_id), window_start })
            if checkpoint_err then db:release(); return nil, checkpoint_err end
            if not (checkpoints and checkpoints[1]) then
                local snapshot, snapshot_err = append(journal_id, { event(types.EVENT.CHECKPOINT_CREATED, {
                    event_id = "reaper-snapshot:" .. lease_id,
                    task_id = trim(lease.task_id),
                    title = "Auto snapshot",
                    body = "Lease " .. lease_id .. " expired over in_progress task " .. trim(lease.task_id)
                        .. "; authority was released with no agent checkpoint in the final TTL window. "
                        .. "The task remains in_progress and resumable through open_branch.",
                    tags = { "derived", "snapshot" },
                }) })
                if not snapshot then db:release(); return nil, snapshot_err end
                entry.snapshot = true
            end
        end
        local consume_err = db_ops.exec(db,
            "UPDATE chestor_journal_leases SET revoked = 1 WHERE journal_id = ? AND lease_id = ?",
            { journal_id, lease_id }
        )
        if consume_err then db:release(); return nil, consume_err end
        reaped[#reaped + 1] = entry
    end
    db:release()
    return { success = true, reaped = reaped }, nil
end

-- T11: gate-pass is runner-authored only; the guard re-checks the receipt as
-- valid AND fresh (C2) against the gate's pinned policy hash.
function M.gate_pass(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    if not enforcement.is_runner(body.principal) then
        return enforcement.refusal("author_not_runner", "gate-pass is appended by the verifier runner"), nil
    end
    return transition(journal_id, body, "gate_pass")
end

-- D3: agents request verification; the runner executes and authors the
-- verdict. The request pins the C1 binding tuple.
function M.request_verify(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local task_id = trim(body.task_id or body.id)
    if task_id == "" then return nil, errors.new({ message = "task_id is required", kind = errors.INVALID }) end
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        if trim(body.lease_id) ~= "" then
            local checked, check_err = enforcement.lease_check(db, journal_id, trim(body.lease_id), body.fencing_token, "request_verify", task_id)
            if check_err then return nil, check_err end
            if (checked :: any).refused then return checked, nil end
        end
        local task, task_err = enforcement.task(db, journal_id, task_id)
        if task_err then return nil, task_err end
        if not task then return nil, errors.new({ message = "task not found: " .. task_id, kind = errors.NOT_FOUND }) end
        local work_revision, work_err = enforcement.work_revision(db, journal_id, task_id)
        if work_err then return nil, work_err end
        local receipt, append_err = append(journal_id, { event(types.EVENT.VERIFICATION_REQUESTED, {
            event_id = command_id,
            request_id = command_id,
            task_id = task_id,
            claim_hash = enforcement.hash_claim((task :: any).claim),
            policy_hash = trim((task :: any).verifier_policy_hash) ~= "" and trim((task :: any).verifier_policy_hash) or nil,
            task_revision = tonumber((task :: any).revision) or 1,
            work_revision = work_revision,
            environment = trim(body.environment) ~= "" and trim(body.environment) or nil,
        }) })
        if not receipt then return nil, append_err end
        -- A deployment where no runner has ever recorded a receipt has no one
        -- to answer this request; say so now instead of letting the agent wait.
        local recorded, recorded_err = db_ops.query(db,
            "SELECT 1 AS present FROM chestor_journal_receipts LIMIT 1", {})
        if recorded_err then return nil, recorded_err end
        local warning: string? = nil
        if not (recorded and recorded[1]) then
            warning = "no verifier runner registered — completion will require a waiver"
        end
        return { success = true, receipt = receipt, request_id = command_id, task_id = task_id, warning = warning }, nil
    end)
end

-- Materializes a verification receipt (X8/C1). I1.1: only the runner system
-- principal may author a verdict; the runtime actor model is the trust
-- boundary (C8).
function M.record_receipt(journal_id: string, input: any): (any?, any?)
    local body = copy_table(input)
    local task_id = trim(body.task_id or body.id)
    if task_id == "" then return nil, errors.new({ message = "task_id is required", kind = errors.INVALID }) end
    if trim(body.verdict) == "" then return nil, errors.new({ message = "verdict is required", kind = errors.INVALID }) end
    if not enforcement.is_runner(body.principal) then
        return enforcement.refusal("author_not_runner", "verdicts are appended by the verifier runner"), nil
    end
    return enforcement.with_command(journal_id, body.command_id, function(db: any, command_id: string): (any?, any?)
        local task, task_err = enforcement.task(db, journal_id, task_id)
        if task_err then return nil, task_err end
        if not task then return nil, errors.new({ message = "task not found: " .. task_id, kind = errors.NOT_FOUND }) end
        local work_revision = tonumber(body.work_revision)
        if work_revision == nil then
            local current, work_err = enforcement.work_revision(db, journal_id, task_id)
            if work_err then return nil, work_err end
            work_revision = current
        end
        local receipt_id = trim(body.receipt_id)
        if receipt_id == "" then receipt_id = command_id end
        -- I8.1: the receipt store is append-only; an existing receipt_id can
        -- never be rebound.
        local existing, existing_err = enforcement.receipt(db, journal_id, receipt_id)
        if existing_err then return nil, existing_err end
        if existing then
            return enforcement.refusal("append_only", "receipt " .. receipt_id .. " already exists; bindings are immutable"), nil
        end
        local receipt, append_err = append(journal_id, { event(types.EVENT.VERIFICATION_RECEIPT, {
            event_id = command_id,
            receipt_id = receipt_id,
            request_id = trim(body.request_id) ~= "" and trim(body.request_id) or nil,
            task_id = task_id,
            task_revision = tonumber(body.task_revision) or tonumber((task :: any).revision) or 1,
            work_revision = work_revision,
            claim_hash = trim(body.claim_hash) ~= "" and trim(body.claim_hash) or enforcement.hash_claim((task :: any).claim),
            policy_hash = trim(body.policy_hash) ~= "" and trim(body.policy_hash) or trim((task :: any).verifier_policy_hash),
            verifier_type = body.verifier_type,
            verifier_version = body.verifier_version,
            verdict = string.lower(trim(body.verdict)),
            result_hash = body.result_hash,
            raw_output_hash = body.raw_output_hash,
            artifact_hash = body.artifact_hash,
            environment = body.environment,
            author = trim(body.principal),
        }) })
        if not receipt then return nil, append_err end
        return { success = true, receipt = receipt, receipt_id = receipt_id, task_id = task_id }, nil
    end)
end

return M

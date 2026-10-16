-- Chestor Roadmap is a canonical component: the component row owns identity and
-- access, one component-owned thread owns durable roadmap facts, and one declared
-- projection materializes normalized roadmap tables for scalable reads.

local component = require("component")
local contract = require("contract")
local crypto = require("crypto")
local registry = require("registry")
local security = require("security")
local types = require("types")
local records = require("records")
local state = require("state")
local queries = require("queries")
local history = require("history")
local periods = require("periods")
local materializer = require("materializer")
local util = require("util")

local M = {}

M.EVENT = types.EVENT

local ACCESS = component.ACCESS

local _events = nil

-- The binding's declared output vocabulary is the only list of accepted command
-- types; restating it here would let the two drift.
function M.events(): { [string]: any }
    if _events then return _events end
    local shapes: { [string]: any } = {}
    local entry = registry.get(types.IMPL_ID)
    local meta = entry and ((entry :: any).meta or ((entry :: any).data and (entry :: any).data.meta)) or {}
    local events = type(meta) == "table" and (meta :: any).events or nil
    local output = type(events) == "table" and (events :: any).output or nil
    if type(output) == "table" then
        for _, e in ipairs(output :: { any }) do
            if type(e) == "table" and util.is_non_empty_string((e :: any).type) then
                shapes[(e :: any).type] = type((e :: any).schema) == "table" and (e :: any).schema or {}
            end
        end
    end
    _events = shapes
    return shapes
end

local function threads(): (any?, any?)
    local def, err = contract.get(types.THREADS)
    if err or not def then return nil, errors.wrap(err or errors.new({ message = "no result", kind = errors.INTERNAL }), "threads contract unavailable") end
    local actor = security.actor()
    local scope = security.scope()
    local c, oerr = def:with_actor(actor):with_scope(scope):open()
    if oerr or not c then return nil, errors.wrap(oerr or errors.new({ message = "no result", kind = errors.INTERNAL }), "threads open failed") end
    return c, nil
end

M.threads = threads

local function thread_id_for(c: any, entry_id: string): (string?, any?)
    if not util.is_non_empty_string(entry_id) then return nil, errors.new({ message = "entry_id is required", kind = errors.INVALID }) end
    local found, err = c:find({ thread_id = entry_id })
    if err then return nil, errors.wrap(err or errors.new({ message = "no result", kind = errors.INTERNAL }), "thread resolve failed") end
    if not found then return nil, errors.new({ message = "roadmap thread not found: " .. entry_id, kind = errors.NOT_FOUND }) end
    return entry_id, nil
end

M.thread_id_for = thread_id_for

-- Two gates, both mandatory before any module table is touched: the component
-- grant decides what this actor may do, and thread resolution proves the roadmap
-- exists for them (find returns nil for absent and unreadable alike).
local function open_roadmap(entry_id: string, required_access: integer): (any?, string?, any?)
    if not util.is_non_empty_string(entry_id) then return nil, nil, errors.new({ message = "entry_id is required", kind = errors.INVALID }) end
    local _, access_err = component.validate_access(entry_id, required_access)
    if access_err then
        return nil, nil, errors.new({ message = "roadmap access denied: " .. tostring(access_err),
            kind = access_err:kind(), retryable = access_err:retryable(), details = access_err:details() })
    end
    local c, err = threads()
    if not c then return nil, nil, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then return nil, nil, terr end
    return c, tid, nil
end

local function read_raw(tid: string): (any?, any?)
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local raw, err = materializer.raw_state(db, tid)
    db:release()
    return raw, err
end

local function history_flags(tid: string): (boolean, boolean, any?)
    local db, db_err = materializer.open_db()
    if not db then return false, false, db_err end
    local undo, uerr = materializer.peek_history(db, tid, "undo")
    if uerr then db:release(); return false, false, uerr end
    local redo, rerr = materializer.peek_history(db, tid, "redo")
    db:release()
    if rerr then return false, false, rerr end
    return undo ~= nil, redo ~= nil, nil
end

local function finish(roadmap: any, entry_id: string, tid: string): (any?, any?)
    roadmap.entry_id = entry_id
    roadmap.thread_id = tid
    local can_undo, can_redo, err = history_flags(tid)
    if err then return nil, err end
    roadmap.can_undo = can_undo
    roadmap.can_redo = can_redo
    return roadmap, nil
end

local function build_from_raw(raw: any, entry_id: string, tid: string): (any?, any?)
    local roadmap, err = state.build(raw or records.empty_state())
    if err or not roadmap then return nil, err end
    return finish(roadmap, entry_id, tid)
end

-- Command validation is stateful: a later command may reference facts created by
-- an earlier committed command. Bring the command-side validation snapshot to the
-- thread head before accepting a new batch. Public reads and post-write responses
-- never drive the projection; the background runner remains the sole read-model
-- materializer after append.
local function prepare_command_state(c: any, tid: string): any?
    local result, err = c:catch_up_projection({
        thread_id = tid,
        kind = types.PROJECTION_KIND,
        max_ticks = 1000,
    })
    if err then return errors.wrap(err, "roadmap command state preparation failed") end
    if type(result) ~= "table" then return "roadmap command state preparation returned no result" end
    local last_seq = tonumber((result :: any).last_seq) or 0
    local target_seq = tonumber((result :: any).target_seq) or tonumber((result :: any).event_count) or 0
    if last_seq < target_seq then
        return "roadmap command state is not ready"
            .. ": last_seq=" .. tostring(last_seq)
            .. " target_seq=" .. tostring(target_seq)
            .. " reason=" .. tostring((result :: any).reason or (result :: any).error or "")
    end
    return nil
end

local function normalize_commands(commands: any): ({ any }?, any?)
    if type(commands) ~= "table" or #commands == 0 then return nil, errors.new({ message = "commands array required", kind = errors.INVALID }) end
    local shapes = M.events()
    local events: { any } = {}
    for i, cmd in ipairs(commands :: { any }) do
        local kind = type(cmd) == "table" and (cmd :: any).type or nil
        if not shapes[kind] then return nil, errors.new({ message = "unknown event type at [" .. tostring(i) .. "]: " .. tostring(kind), kind = errors.INVALID }) end
        events[#events + 1] = { type = kind, body = type((cmd :: any).body) == "table" and (cmd :: any).body or {} }
    end
    return events, nil
end

local function append_validated(entry_id: string, events: { any }): (any?, any?, string?, any?, number?)
    local c, tid, err = open_roadmap(entry_id, ACCESS.WRITE)
    if err or not c or not tid then return nil, err end
    local prepare_err = prepare_command_state(c, tid)
    if prepare_err then return nil, prepare_err end
    local raw, rerr = read_raw(tid)
    if rerr then return nil, rerr end
    local pre_raw = raw or records.empty_state()
    local next_raw, verr = state.validate_and_fold(pre_raw, events)
    if verr then return nil, verr end

    local appended, aerr = c:append_events({ thread_id = tid, events = events })
    if aerr then return nil, aerr end
    local stack_seq = tonumber(appended and (appended :: any).max_seq)
    if not stack_seq then return nil, errors.new({ message = "thread append did not return max_seq", kind = errors.INTERNAL }) end
    -- The projection runner owns materialization. A command request must never
    -- compete with that runner for its cursor merely to manufacture read-after-
    -- write consistency. Return the state this validated batch produces; normal
    -- reads independently serve the latest committed projection snapshot.
    local roadmap, berr = build_from_raw(next_raw, entry_id, tid)
    if berr or not roadmap then return nil, berr end
    return roadmap, nil, tid, pre_raw, stack_seq
end

local function history_id(): (string?, any?)
    local id, err = crypto.random.uuid()
    if err or not id then return nil, errors.new({ message = "failed to generate history id: " .. tostring(err), kind = errors.INTERNAL }) end
    return tostring(id), nil
end

function M.apply(entry_id: string, commands: any): (any?, any?)
    local events, nerr = normalize_commands(commands)
    if not events then return nil, nerr end
    local roadmap, err, tid, pre_raw, stack_seq = append_validated(entry_id, events)
    if err or not roadmap or not tid then return nil, err end

    local forward = history.forward_events(events)
    if #forward == 0 then return roadmap, nil end

    local inverse = history.build_inverse(pre_raw or records.empty_state(), events)
    local hid, herr = history_id()
    if not hid then return nil, herr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local record_err = materializer.record_history(db, tid, hid, stack_seq :: number, forward, inverse)
    db:release()
    if record_err then return nil, record_err end

    local can_undo, can_redo, ferr = history_flags(tid)
    if ferr then return nil, ferr end
    roadmap.can_undo = can_undo
    roadmap.can_redo = can_redo
    return roadmap, nil
end

local function apply_history(entry_id: string, from_stack: string, to_stack: string, event_key: string): (any?, any?)
    local _, tid, err = open_roadmap(entry_id, ACCESS.WRITE)
    if err or not tid then return nil, err end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local row, perr = materializer.peek_history(db, tid, from_stack)
    db:release()
    if perr then return nil, perr end
    if not row then return nil, errors.new({ message = "nothing to " .. from_stack, kind = errors.CONFLICT }) end

    local events = (row :: any)[event_key]
    if type(events) ~= "table" or #events == 0 then return nil, errors.new({ message = "history entry is empty", kind = errors.INTERNAL }) end
    local roadmap, aerr, _, _, stack_seq = append_validated(entry_id, events :: { any })
    if aerr or not roadmap then return nil, aerr end

    db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local merr = materializer.move_history(db, util.str((row :: any).id), to_stack, stack_seq :: number)
    db:release()
    if merr then return nil, merr end

    local can_undo, can_redo, ferr = history_flags(tid)
    if ferr then return nil, ferr end
    roadmap.can_undo = can_undo
    roadmap.can_redo = can_redo
    return roadmap, nil
end

function M.undo(entry_id: string): (any?, any?)
    return apply_history(entry_id, "undo", "redo", "inverse_events")
end

function M.redo(entry_id: string): (any?, any?)
    return apply_history(entry_id, "redo", "undo", "forward_events")
end

function M.state(entry_id: string): (any?, any?)
    local _, tid, err = open_roadmap(entry_id, ACCESS.READ)
    if err or not tid then return nil, err end
    local raw, rerr = read_raw(tid)
    if rerr then return nil, rerr end
    return build_from_raw(raw, entry_id, tid)
end

function M.initiatives(entry_id: string, options: any): (any?, any?)
    local roadmap, err = M.state(entry_id)
    if err or not roadmap then return nil, err end
    local rows, ferr = queries.filter_initiatives(roadmap, options)
    if ferr then return nil, ferr end
    return {
        entry_id = (roadmap :: any).entry_id,
        thread_id = (roadmap :: any).thread_id,
        initiatives = rows or {},
    }, nil
end

function M.dependencies(entry_id: string, options: any): (any?, any?)
    options = type(options) == "table" and options or {}
    local roadmap, err = M.state(entry_id)
    if err or not roadmap then return nil, err end

    local of = util.str((options :: any).of)
    local direction = util.str((options :: any).direction)
    if direction == "" then direction = "both" end
    if direction ~= "needs" and direction ~= "unlocks" and direction ~= "both" then
        return nil, errors.new({ message = "dependency direction must be needs, unlocks, or both: " .. direction, kind = errors.INVALID })
    end
    local transitive = (options :: any).transitive == true

    local out: any = {
        entry_id = (roadmap :: any).entry_id,
        thread_id = (roadmap :: any).thread_id,
        of = of,
        direction = direction,
        transitive = transitive,
        dependencies = (roadmap :: any).dependencies,
        needs = {},
        unlocks = {},
        needs_chain = {},
        unlocks_chain = {},
    }
    if of == "" then return out, nil end
    if not queries.initiative(roadmap, of) then return nil, errors.new({ message = "initiative not found: " .. of, kind = errors.INVALID }) end

    if direction == "needs" or direction == "both" then
        out.needs = queries.needs(roadmap, of)
        if transitive then out.needs_chain = queries.transitive(roadmap, of, "needs") end
    end
    if direction == "unlocks" or direction == "both" then
        out.unlocks = queries.unlocks(roadmap, of)
        if transitive then out.unlocks_chain = queries.transitive(roadmap, of, "unlocks") end
    end
    return out, nil
end

function M.critical(entry_id: string, top: any): (any?, any?)
    local roadmap, err = M.state(entry_id)
    if err or not roadmap then return nil, err end
    return {
        entry_id = (roadmap :: any).entry_id,
        thread_id = (roadmap :: any).thread_id,
        critical = queries.critical(roadmap, top),
    }, nil
end

-- The closed vocabularies and period rules editors and agents validate against.
-- They are module constants, not roadmap contents, so nothing here is per-entry.
function M.schema(): (any?, any?)
    local quarter, qerr = periods.current_period(types.PERIOD_QUARTER, nil)
    if qerr or not quarter then return nil, qerr end
    local month, merr = periods.current_period(types.PERIOD_MONTH, nil)
    if merr or not month then return nil, merr end
    return {
        status = types.STATUS,
        confidence = types.CONFIDENCE,
        size = types.SIZE,
        dependency_kind = types.DEP_KIND,
        period_kind = types.PERIOD_KIND,
        lens = types.LENS,
        horizon = { types.HORIZON.PAST, types.HORIZON.NOW, types.HORIZON.NEXT, types.HORIZON.LATER },
        defaults = types.DEFAULTS,
        period_rules = {
            quarter = { pattern = "YYYY-Qn", example = quarter },
            month = { pattern = "YYYY-MM", example = month },
            horizon_later_offset = types.HORIZON_LATER_OFFSET,
        },
        events = types.EVENT,
    }, nil
end

-- The vocabularies are module constants, but a caller reaches them by naming a
-- roadmap, and the gate that answers for that roadmap is the same one every read
-- uses: an actor who cannot read the plan cannot enumerate its surface either.
function M.schema_for(entry_id: string): (any?, any?)
    local _, _, err = open_roadmap(entry_id, ACCESS.READ)
    if err then return nil, err end
    return M.schema()
end

-- One read, optionally reshaped for a lens. The lens is view state, so the
-- snapshot under it is byte-for-byte the snapshot the renderer reads.
function M.snapshot(entry_id: string, options: any): (any?, any?)
    options = type(options) == "table" and options or {}
    local roadmap, err = M.state(entry_id)
    if err or not roadmap then return nil, err end
    local lens = util.str((options :: any).lens)
    if lens == "" then return roadmap, nil end
    local view, verr = queries.lens_view(roadmap, lens, (options :: any).filter)
    if verr or not view then return nil, verr end
    roadmap.view = view
    return roadmap, nil
end

-- Periods ranked by the weight of the work in flight.
function M.load(entry_id: string, top: any): (any?, any?)
    local roadmap, err = M.state(entry_id)
    if err or not roadmap then return nil, err end
    return {
        entry_id = (roadmap :: any).entry_id,
        thread_id = (roadmap :: any).thread_id,
        load = queries.period_load(roadmap, top),
    }, nil
end

-- The derived-question surface. Every branch delegates to the public function that
-- already owns that answer, so a question asked by an agent and the same question
-- asked over HTTP resolve through one code path.
function M.query(entry_id: string, question: any, options: any): (any?, any?)
    options = type(options) == "table" and options or {}
    local name = util.str(question)
    local of = util.str((options :: any).id)

    if name == "needs" or name == "unlocks" then
        if of == "" then return nil, errors.new({ message = "question " .. name .. " requires an initiative id", kind = errors.INVALID }) end
        return M.dependencies(entry_id, { of = of, direction = name, transitive = true })
    end
    if name == "critical" then return M.critical(entry_id, (options :: any).top) end
    if name == "horizon" then
        local horizon = util.str((options :: any).horizon)
        if horizon == "" then return M.initiatives(entry_id, {}) end
        return M.initiatives(entry_id, { horizon = horizon })
    end
    if name == "overloaded" then return M.load(entry_id, (options :: any).top) end
    return nil, errors.new({ message = "unknown question: " .. name .. " (needs, unlocks, critical, horizon, overloaded)", kind = errors.INVALID })
end

-- Teardown is authorized by DELETE, not WRITE: the host gates the cascade on
-- DELETE and then invokes this deletable under that same actor, so a holder of
-- read and delete access must be able to finish the delete the host allowed.
function M.destroy(entry_id: string): (boolean?, any?)
    local c, tid, err = open_roadmap(entry_id, ACCESS.DELETE)
    if err or not c or not tid then return nil, err end
    local _, perr = c:purge({ component_id = entry_id })
    if perr then return nil, perr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local derr = materializer.delete_roadmap_rows(db, tid)
    db:release()
    if derr then return nil, derr end
    return true, nil
end

return M

-- Canonical event-sourced component over threads. The component-owned thread is
-- the durable log; normalized schema tables are the read model. Edits append typed
-- events and reads catch up the declared projection before loading those tables.
--
-- The published event vocabulary (M.events) is the contract a consumer reads to
-- know exactly which events this component emits and their payload shape; it is
-- read off the database KIND binding's meta.events.

local contract = require("contract")
local registry = require("registry")
local json = require("json")
local security = require("security")
local types = require("types")
local materializer = require("materializer")

local M = {}

M.EVENT = types.EVENT

local function is_non_empty_string(v: any): boolean
    return type(v) == "string" and v ~= ""
end

local function table_exists(state: any, id: any): boolean
    return is_non_empty_string(id) and type(state.tables[tostring(id)]) == "table"
end

local function column_exists(state: any, id: any): boolean
    return is_non_empty_string(id) and type(state.columns[tostring(id)]) == "table"
end

local function relation_exists(state: any, id: any): boolean
    return is_non_empty_string(id) and type(state.relations[tostring(id)]) == "table"
end

local function index_exists(state: any, id: any): boolean
    return is_non_empty_string(id) and type(state.indexes[tostring(id)]) == "table"
end

local function column_belongs_to(state: any, column_id: any, table_id: any): boolean
    if not column_exists(state, column_id) then return false end
    local column = state.columns[tostring(column_id)]
    return type(column) == "table" and tostring((column :: any).table_id or "") == tostring(table_id or "")
end

local function remove_from_order(order: any, value: string): any
    local out = {}
    if type(order) ~= "table" then return out end
    for _, id in ipairs(order :: { any }) do
        if tostring(id) ~= value then out[#out + 1] = id end
    end
    return out
end

local function append_unique(order: any, value: string): any
    local out = type(order) == "table" and order or {}
    for _, id in ipairs(out :: { any }) do
        if tostring(id) == value then return out end
    end
    out[#out + 1] = value
    return out
end

-- The event list is declared directly on the database KIND binding as
-- meta.events.output. One binding carries the kind's presentation AND its event
-- vocabulary; consumers read it off the binding the component is an instance of.
local _events = nil
function M.events()
    if _events then return _events end
    local event_shapes = {}
    local entry = registry.get("chestor.db_schema:database")
    local meta = entry and ((entry :: any).meta or (entry.data and entry.data.meta)) or {}
    local events = type(meta) == "table" and (meta :: any).events or nil
    local output = type(events) == "table" and (events :: any).output or nil
    if type(output) == "table" then
        for _, e in ipairs(output :: { any }) do
            if type(e) == "table" and type((e :: any).type) == "string" and (e :: any).type ~= "" then
                event_shapes[(e :: any).type] = type((e :: any).schema) == "table" and (e :: any).schema or {}
            end
        end
    end
    _events = event_shapes
    return event_shapes
end

local function threads()
    local def, err = contract.get(types.THREADS)
    if not def then return nil, err end
    local c, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if not c then return nil, oerr end
    return c
end

local function thread_id_for(c, entry_id)
    if type(entry_id) ~= "string" or entry_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "entry_id is required" }) end
    local found, err = c:find({ thread_id = entry_id })
    if err then return nil, err end
    if not found then return nil, errors.new({ kind = errors.NOT_FOUND, message = "schema thread not found: " .. entry_id }) end
    return entry_id
end

-- ── Fold: replay the log (ascending) into the projection ──
local function apply_event(state, kind, p)
    local T, C, R, I, L = state.tables, state.columns, state.relations, state.indexes, state.layout
    if kind == M.EVENT.TABLE_ADDED then T[p.id] = { id = p.id, name = p.name, description = p.description, properties = p.properties, sort_order = p.sort_order }
    elseif kind == M.EVENT.TABLE_UPDATED then local t = T[p.id]; if t then for _, k in ipairs({ "name", "description", "properties", "sort_order" }) do if p[k] ~= nil then t[k] = p[k] end end end
    elseif kind == M.EVENT.TABLE_REMOVED then T[p.id] = nil
        for cid, c in pairs(C) do if c.table_id == p.id then C[cid] = nil end end
        for rid, r in pairs(R) do if r.from_table_id == p.id or r.to_table_id == p.id then R[rid] = nil end end
        for iid, ix in pairs(I) do if ix.table_id == p.id then I[iid] = nil end end
        L[p.id] = nil
        state.column_order[p.id] = nil
    elseif kind == M.EVENT.COLUMN_ADDED then
        C[p.id] = { id = p.id, table_id = p.table_id, name = p.name, col_type = p.col_type, nullable = p.nullable, primary_key = p.primary_key, unique_col = p.unique_col, default_value = p.default_value }
        -- Track insertion order per table so build() renders columns stably.
        local co = state.column_order[p.table_id]; if type(co) ~= "table" then co = {}; state.column_order[p.table_id] = co end
        local present = false; for _, cid in ipairs(co) do if cid == p.id then present = true; break end end
        if not present then co[#co + 1] = p.id end
    elseif kind == M.EVENT.COLUMN_UPDATED then local c = C[p.id]; if c then local old_table = c.table_id; for _, k in ipairs({ "table_id", "name", "col_type", "nullable", "primary_key", "unique_col", "default_value", "description", "sort_order" }) do if p[k] ~= nil then c[k] = p[k] end end; if p.table_id ~= nil and tostring(old_table or "") ~= tostring(c.table_id or "") then state.column_order[old_table] = remove_from_order(state.column_order[old_table], tostring(p.id)); state.column_order[c.table_id] = append_unique(state.column_order[c.table_id], tostring(p.id)) end end
    elseif kind == M.EVENT.COLUMN_REMOVED then
        local col = C[p.id]
        if col and col.table_id and type(state.column_order[col.table_id]) == "table" then
            local out = {}; for _, cid in ipairs(state.column_order[col.table_id]) do if cid ~= p.id then out[#out + 1] = cid end end
            state.column_order[col.table_id] = out
        end
        C[p.id] = nil
        for rid, r in pairs(R) do if r.from_column_id == p.id or r.to_column_id == p.id then R[rid] = nil end end
        for iid, ix in pairs(I) do
            if type(ix.columns) == "table" then
                for _, cid in ipairs(ix.columns) do
                    if tostring(cid) == tostring(p.id) then I[iid] = nil; break end
                end
            end
        end
    elseif kind == M.EVENT.COLUMNS_REORDERED then state.column_order[p.table_id] = p.order
    elseif kind == M.EVENT.RELATION_ADDED then R[p.id] = { id = p.id, name = p.name, from_table_id = p.from_table_id, from_column_id = p.from_column_id, to_table_id = p.to_table_id, to_column_id = p.to_column_id, relation_type = p.relation_type, on_delete = p.on_delete, on_update = p.on_update }
    elseif kind == M.EVENT.RELATION_UPDATED then local r = R[p.id]; if r then for _, k in ipairs({ "name", "from_table_id", "from_column_id", "to_table_id", "to_column_id", "relation_type", "on_delete", "on_update" }) do if p[k] ~= nil then r[k] = p[k] end end end
    elseif kind == M.EVENT.RELATION_REMOVED then R[p.id] = nil
    elseif kind == M.EVENT.INDEX_ADDED then I[p.id] = { id = p.id, table_id = p.table_id, name = p.name, columns = p.columns, unique_idx = p.unique_idx }
    elseif kind == M.EVENT.INDEX_UPDATED then local ix = I[p.id]; if ix then for _, k in ipairs({ "table_id", "name", "columns", "unique_idx" }) do if p[k] ~= nil then ix[k] = p[k] end end end
    elseif kind == M.EVENT.INDEX_REMOVED then I[p.id] = nil
    elseif kind == M.EVENT.LAYOUT_POSITION_SET then L[p.table_id] = { x = p.x, y = p.y }
    elseif kind == M.EVENT.LAYOUT_POSITION_CLEARED then L[p.table_id] = nil
    elseif kind == M.EVENT.LAYOUT_VIEWPORT_SET then state.viewport = { x = p.x, y = p.y, zoom = p.zoom }
    end
end

-- empty_state is the table-shaped accumulator used for command validation.
-- Runtime reads are backed by the normalized schema tables.
function M.empty_state()
    return { tables = {}, columns = {}, relations = {}, indexes = {}, layout = {}, column_order = {}, viewport = nil }
end

local function validate_relation_endpoint(state: any, table_id: any, column_id: any): string?
    if not table_exists(state, table_id) then return "relation table not found: " .. tostring(table_id) end
    if column_id ~= nil and column_id ~= "" and not column_belongs_to(state, column_id, table_id) then
        return "relation column not found: " .. tostring(column_id)
    end
    return nil
end

local function validate_index_columns(state: any, table_id: any, columns: any): string?
    if type(columns) ~= "table" or #columns == 0 then return "index columns required" end
    local seen: { [string]: boolean } = {}
    for _, column_id in ipairs(columns :: { any }) do
        local id = tostring(column_id or "")
        if id == "" then return "index column id required" end
        if seen[id] then return "duplicate index column: " .. id end
        seen[id] = true
        if not column_belongs_to(state, id, table_id) then return "index column not found: " .. id end
    end
    return nil
end

function M.validate_command(state: any, kind: string, p: any): string?
    state = type(state) == "table" and state or M.empty_state()
    p = type(p) == "table" and p or {}
    local E = M.EVENT
    if kind == E.TABLE_ADDED then
        if not is_non_empty_string(p.id) then return "table id required" end
        if not is_non_empty_string(p.name) then return "table name required" end
        if table_exists(state, p.id) then return "table already exists: " .. tostring(p.id) end
    elseif kind == E.TABLE_UPDATED then
        if not table_exists(state, p.id) then return "table not found: " .. tostring(p.id) end
        if p.name ~= nil and not is_non_empty_string(p.name) then return "table name required" end
    elseif kind == E.TABLE_REMOVED then
        if not table_exists(state, p.id) then return "table not found: " .. tostring(p.id) end
    elseif kind == E.COLUMN_ADDED then
        if not is_non_empty_string(p.id) then return "column id required" end
        if column_exists(state, p.id) then return "column already exists: " .. tostring(p.id) end
        if not table_exists(state, p.table_id) then return "column table not found: " .. tostring(p.table_id) end
        if not is_non_empty_string(p.name) then return "column name required" end
        if not is_non_empty_string(p.col_type) then return "column type required" end
    elseif kind == E.COLUMN_UPDATED then
        if not column_exists(state, p.id) then return "column not found: " .. tostring(p.id) end
        if p.table_id ~= nil and not table_exists(state, p.table_id) then return "column table not found: " .. tostring(p.table_id) end
        if p.name ~= nil and not is_non_empty_string(p.name) then return "column name required" end
        if p.col_type ~= nil and not is_non_empty_string(p.col_type) then return "column type required" end
    elseif kind == E.COLUMN_REMOVED then
        if not column_exists(state, p.id) then return "column not found: " .. tostring(p.id) end
    elseif kind == E.COLUMNS_REORDERED then
        if not table_exists(state, p.table_id) then return "column order table not found: " .. tostring(p.table_id) end
        if type(p.order) ~= "table" then return "column order required" end
        local seen: { [string]: boolean } = {}
        for _, column_id in ipairs(p.order :: { any }) do
            local id = tostring(column_id or "")
            if id == "" then return "column order id required" end
            if seen[id] then return "duplicate column in order: " .. id end
            seen[id] = true
            if not column_belongs_to(state, id, p.table_id) then return "column order column not found: " .. id end
        end
    elseif kind == E.RELATION_ADDED then
        if not is_non_empty_string(p.id) then return "relation id required" end
        if relation_exists(state, p.id) then return "relation already exists: " .. tostring(p.id) end
        local err = validate_relation_endpoint(state, p.from_table_id, p.from_column_id)
        if err then return err end
        err = validate_relation_endpoint(state, p.to_table_id, p.to_column_id)
        if err then return err end
        if not is_non_empty_string(p.relation_type) then return "relation type required" end
    elseif kind == E.RELATION_UPDATED then
        if not relation_exists(state, p.id) then return "relation not found: " .. tostring(p.id) end
        local current = state.relations[tostring(p.id or "")]
        local from_table_id = p.from_table_id or (type(current) == "table" and (current :: any).from_table_id)
        local from_column_id = p.from_column_id ~= nil and p.from_column_id or (type(current) == "table" and (current :: any).from_column_id)
        local to_table_id = p.to_table_id or (type(current) == "table" and (current :: any).to_table_id)
        local to_column_id = p.to_column_id ~= nil and p.to_column_id or (type(current) == "table" and (current :: any).to_column_id)
        local err = validate_relation_endpoint(state, from_table_id, from_column_id)
        if err then return err end
        err = validate_relation_endpoint(state, to_table_id, to_column_id)
        if err then return err end
        if p.relation_type ~= nil and not is_non_empty_string(p.relation_type) then return "relation type required" end
    elseif kind == E.RELATION_REMOVED then
        if not relation_exists(state, p.id) then return "relation not found: " .. tostring(p.id) end
    elseif kind == E.INDEX_ADDED then
        if not is_non_empty_string(p.id) then return "index id required" end
        if index_exists(state, p.id) then return "index already exists: " .. tostring(p.id) end
        if not table_exists(state, p.table_id) then return "index table not found: " .. tostring(p.table_id) end
        if not is_non_empty_string(p.name) then return "index name required" end
        local err = validate_index_columns(state, p.table_id, p.columns)
        if err then return err end
    elseif kind == E.INDEX_UPDATED then
        if not index_exists(state, p.id) then return "index not found: " .. tostring(p.id) end
        local current = state.indexes[tostring(p.id or "")]
        local table_id = p.table_id or (type(current) == "table" and (current :: any).table_id)
        if not table_exists(state, table_id) then return "index table not found: " .. tostring(table_id) end
        if p.name ~= nil and not is_non_empty_string(p.name) then return "index name required" end
        if p.columns ~= nil then
            local err = validate_index_columns(state, table_id, p.columns)
            if err then return err end
        end
    elseif kind == E.INDEX_REMOVED then
        if not index_exists(state, p.id) then return "index not found: " .. tostring(p.id) end
    elseif kind == E.LAYOUT_POSITION_SET then
        if not table_exists(state, p.table_id) then return "layout table not found: " .. tostring(p.table_id) end
    elseif kind == E.LAYOUT_POSITION_CLEARED then
        if not table_exists(state, p.table_id) then return "layout table not found: " .. tostring(p.table_id) end
    elseif kind == E.LAYOUT_VIEWPORT_SET then
        return nil
    else
        return "unknown event type: " .. tostring(kind)
    end
    return nil
end

function M.validate_and_fold(state: any, events: any): (any?, error?)
    state = type(state) == "table" and state or M.empty_state()
    for i, event in ipairs(type(events) == "table" and events or {}) do
        local kind = tostring((event :: any).type or "")
        local b = (event :: any).body or {}
        if type(b) == "string" then b = json.decode(b :: string) end
        local err = M.validate_command(state, kind, b)
        if err then return nil, errors.new({ kind = errors.INVALID, message = "invalid schema event at [" .. tostring(i) .. "]: " .. err }) end
        apply_event(state, kind, b)
    end
    return state, nil
end

-- fold_into applies an event batch to a table-shaped state. Runtime projection
-- writes normalized tables; this remains for command validation and fixtures.
function M.fold_into(state, events)
    for _, e in ipairs(events) do
        local body = (e :: any).body
        if type(body) == "string" then body = json.decode(body :: string) end
        if type(body) == "table" then apply_event(state, tostring((e :: any).type), body) end
    end
    return state
end

-- build: materialize the raw state into the public shape (arrays in stable order
-- for the UI). Read-side only.
function M.build(state)
    state = type(state) == "table" and state or M.empty_state()
    local cols_by_table = type(state.columns) == "table" and state.columns or {}
    local order = type(state.column_order) == "table" and state.column_order or {}
    local layout = type(state.layout) == "table" and state.layout or {}
    local tables = {}
    for _, t in pairs(type(state.tables) == "table" and state.tables or {}) do
        local cols = {}
        for _, c in pairs(cols_by_table) do if c.table_id == t.id then cols[#cols + 1] = c end end
        local ord = order[t.id]
        if ord then
            local byid = {}; for _, c in ipairs(cols) do byid[c.id] = c end
            local sorted = {}; for _, cid in ipairs(ord) do if byid[cid] then sorted[#sorted + 1] = byid[cid] end end
            for _, c in ipairs(cols) do
                local seen = false; for _, s in ipairs(sorted) do if s.id == c.id then seen = true break end end
                if not seen then sorted[#sorted + 1] = c end
            end
            cols = sorted
        end
        tables[#tables + 1] = { id = t.id, name = t.name, description = t.description, columns = cols, layout = layout[t.id] }
    end
    table.sort(tables, function(a, b) return tostring(a.name) < tostring(b.name) end)
    local relations = {}; for _, r in pairs(type(state.relations) == "table" and state.relations or {}) do relations[#relations + 1] = r end
    local indexes = {}; for _, ix in pairs(type(state.indexes) == "table" and state.indexes or {}) do indexes[#indexes + 1] = ix end
    return { tables = tables, relations = relations, indexes = indexes, viewport = state.viewport }
end

local CATCH_UP_TICKS = 1000
local CATCH_UP_CALLS = 20

local function catch_up_error(result: any): error
    if type(result) ~= "table" then
        return errors.new({ kind = errors.INTERNAL, message = "projection catch-up returned no result" })
    end
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "projection catch-up did not reach thread head"
        .. ": last_seq=" .. tostring((result :: any).last_seq)
        .. " target_seq=" .. tostring((result :: any).target_seq)
        .. " event_count=" .. tostring((result :: any).event_count)
        .. " ticks=" .. tostring((result :: any).ticks)
        .. " max_ticks=" .. tostring((result :: any).max_ticks)
        .. " reason=" .. tostring((result :: any).reason or (result :: any).error or "") })
end

local function caught_up(result: any): boolean
    if type(result) ~= "table" then return false end
    local last_seq = tonumber((result :: any).last_seq) or 0
    local target_seq = tonumber((result :: any).target_seq) or tonumber((result :: any).event_count) or 0
    return last_seq >= target_seq
end

local function catch_up(c, tid)
    local last: any = nil
    for _ = 1, CATCH_UP_CALLS do
        local result, err = c:catch_up_projection({
            thread_id = tid,
            kind = types.PROJECTION_KIND,
            max_ticks = CATCH_UP_TICKS,
        })
        if err then return err end
        last = result
        if caught_up(result) then return nil end
        if type(result) == "table" then
            if (result :: any).done == true
                and (result :: any).skipped ~= true
                and (result :: any).stale ~= true
                and (result :: any).obsolete ~= true
                and (result :: any).dead ~= true then
                return nil
            end
            if (result :: any).skipped == true or (result :: any).obsolete == true or (result :: any).dead == true then
                return catch_up_error(result)
            end
        end
    end
    return catch_up_error(last)
end

local function read_raw(tid)
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local raw, err = materializer.raw_state(db, tid)
    db:release()
    return raw, err
end

local function read_materialized(entry_id: string, result_key: string, reader: (any, string) -> (any?, error?)): (any?, error?)
    local c, err = threads()
    if not c then return nil, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then return nil, terr end
    local cerr = catch_up(c, tid)
    if cerr then return nil, cerr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local value, rerr = reader(db, tid)
    db:release()
    if rerr then return nil, rerr end
    local out: any = { entry_id = entry_id, thread_id = tid }
    out[result_key] = value
    return out, nil
end

-- state(entry_id): catch up the component-owned thread projection, then read the
-- normalized tables into the public schema shape.
function M.state(entry_id)
    local empty = M.build(M.empty_state())
    empty.entry_id = entry_id
    local c, err = threads()
    if not c then return empty, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then empty.entry_id = entry_id; return empty, terr end

    local cerr = catch_up(c, tid)
    if cerr then empty.thread_id = tid; return empty, cerr end
    local raw, rerr = read_raw(tid)
    if rerr then empty.thread_id = tid; return empty, rerr end
    local s = M.build(raw or M.empty_state())
    s.entry_id = entry_id
    s.thread_id = tid  -- the realtime topic is kickside.thread.<thread_id>
    return s
end

function M.tables(entry_id: string, options: any): (any?, error?)
    return read_materialized(entry_id, "tables", function(db: any, tid: string)
        return materializer.list_tables(db, tid, options)
    end)
end

function M.relations(entry_id: string, options: any): (any?, error?)
    return read_materialized(entry_id, "relations", function(db: any, tid: string)
        return materializer.list_relations(db, tid, options)
    end)
end

function M.indexes(entry_id: string, options: any): (any?, error?)
    return read_materialized(entry_id, "indexes", function(db: any, tid: string)
        return materializer.list_indexes(db, tid, options)
    end)
end

-- Apply a batch of typed commands: validate each against meta.events, then append
-- them as one ordered batch of events. Realtime + ordering are the engine's.
function M.apply(entry_id, commands)
    if type(commands) ~= "table" or #commands == 0 then return nil, errors.new({ kind = errors.INVALID, message = "commands array required" }) end
    local event_shapes = M.events()
    local events = table.create(#commands, 0)
    for i, cmd in ipairs(commands) do
        local kind = cmd and cmd.type
        if not event_shapes[kind] then
            return nil, errors.new({ kind = errors.INVALID, message = "unknown event type at [" .. i .. "]: " .. tostring(kind) })
        end
        events[#events + 1] = { type = kind, body = cmd.body or {} }
    end
    local c, err = threads()
    if not c then return nil, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then return nil, terr end
    local cerr = catch_up(c, tid)
    if cerr then return nil, cerr end
    local raw, rerr = read_raw(tid)
    if rerr then return nil, rerr end
    local _, verr = M.validate_and_fold(raw or M.empty_state(), events)
    if verr then return nil, verr end
    local _, aerr = c:append_events({ thread_id = tid, events = events })
    if aerr then return nil, aerr end
    cerr = catch_up(c, tid)
    if cerr then return nil, cerr end
    raw, rerr = read_raw(tid)
    if rerr then return nil, rerr end
    local s = M.build(raw)
    s.entry_id = entry_id
    s.thread_id = tid
    return s
end

function M.destroy(entry_id: string): (boolean?, error?)
    local c, err = threads()
    if not c then return nil, err end
    local _, perr = c:purge({ component_id = entry_id })
    if perr then return nil, perr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local derr = materializer.delete_schema_rows(db, entry_id)
    db:release()
    if derr then return nil, derr end
    return true, nil
end

return M

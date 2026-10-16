-- The roadmap read model. Every write goes through the same normalizers the pure
-- fold uses, so a row and a folded record are the same value; every statement is
-- written with ? placeholders and rewritten at the dialect boundary.

local json = require("json")
local sql = require("sql")
local types = require("types")
local records = require("records")
local util = require("util")

local M = {}

local function now(): string
    return tostring(os.date("!%Y-%m-%dT%H:%M:%SZ"))
end

local function decode(raw: any, fallback: any): (any?, any?)
    if raw == nil or raw == "" then return fallback, nil end
    if type(raw) == "table" then return raw, nil end
    local decoded, err = json.decode(tostring(raw))
    if err then return nil, err end
    if type(decoded) ~= "table" then return nil, errors.new({ kind = errors.INVALID, message = "roadmap JSON value must be an object or array" }) end
    return decoded, nil
end

local function decode_history(raw: any, field: string): (any?, error?)
    if raw == nil or raw == "" then return nil, errors.new({ kind = errors.INVALID, message = "history " .. field .. " is empty" }) end
    if type(raw) == "table" then return raw, nil end
    return decode(raw, nil)
end

-- A projected event body may arrive as a JSON string from the thread writer.
local function body(event: any): (any?, any?)
    local b = type(event) == "table" and (event :: any).body or {}
    if type(b) == "string" then return decode(b, {}) end
    return type(b) == "table" and b or {}
end

local function kind(event: any): string
    return util.str(type(event) == "table" and (event :: any).type or "")
end

local function prepare_sql(db: any, statement: string): (string?, error?)
    local db_type, type_err = db:type()
    if type_err then return nil, errors.wrap(type_err, "failed to determine roadmap database type") end
    local dialect = tostring(db_type)
    if dialect == "sqlite" then return statement, nil end
    if dialect ~= "postgres" then return nil, errors.new({ kind = errors.INTERNAL, message = "unsupported roadmap database type: " .. dialect }) end
    local position = 0
    return (statement:gsub("%?", function(): string
        position = position + 1
        return "$" .. tostring(position)
    end)), nil
end

local function exec(db: any, statement: string, params: any): error?
    local prepared, prepare_err = prepare_sql(db, statement)
    if prepare_err then return prepare_err end
    local _, err = db:execute(prepared :: string, params or {})
    if err then return err end
    return nil
end

local function query(db: any, statement: string, params: any): (any, error?)
    local prepared, prepare_err = prepare_sql(db, statement)
    if prepare_err then return nil, prepare_err end
    local rows, err = db:query(prepared :: string, params or {})
    if err then return nil, err end
    return rows or {}
end

local function first_row(db: any, statement: string, params: any): (any?, error?)
    local rows, err = query(db, statement, params)
    if err then return nil, err end
    if type(rows) ~= "table" or #rows == 0 then return nil, nil end
    return rows[1], nil
end

function M.open_db(): (any?, error?)
    local db, err = sql.get(types.db_id())
    if err then return nil, errors.wrap(err, "roadmap materializer db unavailable") end
    if not db then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "roadmap materializer db unavailable" }) end
    return db, nil
end

local function decode_layer(row: any): (any?, any?)
    return records.layer_body({
        id = row.id,
        title = row.title,
        description = row.description,
        color = row.color,
        icon = row.icon,
        sort_order = row.sort_order,
    }, nil), nil
end

local function decode_outcome(row: any): (any?, any?)
    return records.outcome_body({
        id = row.id,
        title = row.title,
        description = row.description,
        sort_order = row.sort_order,
    }, nil), nil
end

local function decode_initiative(row: any): (any?, any?)
    local tags, tags_err = decode(row.tags, {})
    if tags_err then return nil, tags_err end
    local properties, properties_err = decode(row.properties, util.empty_object())
    if properties_err then return nil, properties_err end
    return records.initiative_body({
        id = row.id,
        title = row.title,
        description = row.description,
        layer_id = row.layer_id,
        outcome_id = row.outcome_id,
        status = row.status,
        confidence = row.confidence,
        size = row.size,
        start_period = row.start_period,
        span = row.span,
        progress = row.progress,
        owner = row.owner,
        tags = tags,
        properties = properties,
        sort_order = row.sort_order,
    }, nil)
end

local function decode_dependency(row: any): (any?, any?)
    return records.dependency_body({
        id = row.id,
        from_id = row.from_id,
        to_id = row.to_id,
        kind = row.kind,
        note = row.note,
    }, nil), nil
end

local function decode_milestone(row: any): (any?, any?)
    local initiative_ids, ids_err = decode(row.initiative_ids, {})
    if ids_err then return nil, ids_err end
    return records.milestone_body({
        id = row.id,
        title = row.title,
        description = row.description,
        period = row.period,
        layer_id = row.layer_id,
        initiative_ids = initiative_ids,
    }, nil)
end

local function decode_settings(row: any): (any?, any?)
    local lens_state, lens_err = decode(row.lens_state, util.empty_object())
    if lens_err then return nil, lens_err end
    return records.settings_body({
        period_kind = row.period_kind,
        origin = row.origin,
        columns = row.columns,
        default_lens = row.default_lens,
    }, { lens_state = lens_state })
end

local function layer_upsert(db: any, roadmap_id: string, record: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_roadmap_layers
            (roadmap_id, id, title, description, color, icon, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(roadmap_id, id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            color = excluded.color,
            icon = excluded.icon,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], { roadmap_id, record.id, record.title, record.description, record.color, record.icon, record.sort_order, ts, ts })
end

local function outcome_upsert(db: any, roadmap_id: string, record: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_roadmap_outcomes
            (roadmap_id, id, title, description, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(roadmap_id, id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], { roadmap_id, record.id, record.title, record.description, record.sort_order, ts, ts })
end

local function initiative_upsert(db: any, roadmap_id: string, record: any): any?
    local tags, tags_err = json.encode(record.tags)
    if tags_err then return tags_err end
    local properties, properties_err = json.encode(record.properties)
    if properties_err then return properties_err end
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_roadmap_initiatives
            (roadmap_id, id, title, description, layer_id, outcome_id, status, confidence, size,
             start_period, span, progress, owner, tags, properties, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(roadmap_id, id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            layer_id = excluded.layer_id,
            outcome_id = excluded.outcome_id,
            status = excluded.status,
            confidence = excluded.confidence,
            size = excluded.size,
            start_period = excluded.start_period,
            span = excluded.span,
            progress = excluded.progress,
            owner = excluded.owner,
            tags = excluded.tags,
            properties = excluded.properties,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], {
        roadmap_id, record.id, record.title, record.description, record.layer_id, record.outcome_id,
        record.status, record.confidence, record.size, record.start_period, record.span, record.progress,
        record.owner, tags, properties, record.sort_order, ts, ts,
    })
end

local function dependency_upsert(db: any, roadmap_id: string, record: any): error?
    return exec(db, [[
        INSERT INTO chestor_roadmap_dependencies
            (roadmap_id, id, from_id, to_id, kind, note, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(roadmap_id, id) DO UPDATE SET
            from_id = excluded.from_id,
            to_id = excluded.to_id,
            kind = excluded.kind,
            note = excluded.note
    ]], { roadmap_id, record.id, record.from_id, record.to_id, record.kind, record.note, now() })
end

local function milestone_upsert(db: any, roadmap_id: string, record: any): any?
    local initiative_ids, ids_err = json.encode(record.initiative_ids)
    if ids_err then return ids_err end
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_roadmap_milestones
            (roadmap_id, id, title, description, period, layer_id, initiative_ids, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(roadmap_id, id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            period = excluded.period,
            layer_id = excluded.layer_id,
            initiative_ids = excluded.initiative_ids,
            updated_at = excluded.updated_at
    ]], {
        roadmap_id, record.id, record.title, record.description, record.period, record.layer_id,
        initiative_ids, ts, ts,
    })
end

local function settings_upsert(db: any, roadmap_id: string, record: any): any?
    local lens_state, lens_err = json.encode(record.lens_state)
    if lens_err then return lens_err end
    return exec(db, [[
        INSERT INTO chestor_roadmap_settings
            (roadmap_id, period_kind, origin, columns, default_lens, lens_state, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(roadmap_id) DO UPDATE SET
            period_kind = excluded.period_kind,
            origin = excluded.origin,
            columns = excluded.columns,
            default_lens = excluded.default_lens,
            lens_state = excluded.lens_state,
            updated_at = excluded.updated_at
    ]], {
        roadmap_id, record.period_kind, record.origin, record.columns, record.default_lens,
        lens_state, now(),
    })
end

type EntitySpec = {
    table_name: string,
    decode: (any) -> (any?, any?),
    normalize: (any, any) -> any,
    upsert: (any, string, any) -> any?,
}

local ENTITIES: { [string]: EntitySpec } = {
    layer = { table_name = "chestor_roadmap_layers", decode = decode_layer, normalize = records.layer_body, upsert = layer_upsert },
    outcome = { table_name = "chestor_roadmap_outcomes", decode = decode_outcome, normalize = records.outcome_body, upsert = outcome_upsert },
    initiative = { table_name = "chestor_roadmap_initiatives", decode = decode_initiative, normalize = records.initiative_body, upsert = initiative_upsert },
    dependency = { table_name = "chestor_roadmap_dependencies", decode = decode_dependency, normalize = records.dependency_body, upsert = dependency_upsert },
    milestone = { table_name = "chestor_roadmap_milestones", decode = decode_milestone, normalize = records.milestone_body, upsert = milestone_upsert },
}

local function read_record(db: any, entity: string, roadmap_id: string, id: string): (any?, error?)
    local spec = ENTITIES[entity]
    if not spec then return nil, errors.new({ kind = errors.INVALID, message = "unsupported roadmap entity: " .. entity }) end
    local row, err = first_row(db, "SELECT * FROM " .. spec.table_name .. " WHERE roadmap_id = ? AND id = ?", { roadmap_id, id })
    if err then return nil, err end
    if not row then return nil, nil end
    return spec.decode(row)
end

-- Writing an entity merges the event body onto the stored record through the pure
-- normalizer, so a partial update keeps untouched fields and the read model tracks
-- the fold exactly.
local function write_entity(db: any, entity: string, roadmap_id: string, p: any, require_existing: boolean): error?
    local spec = ENTITIES[entity]
    if not spec then return errors.new({ kind = errors.INVALID, message = "unsupported roadmap entity: " .. entity }) end
    local id = util.str(p.id)
    if id == "" then return errors.new({ kind = errors.INVALID, message = "roadmap " .. entity .. " event is missing an id" }) end
    local previous, err = read_record(db, entity, roadmap_id, id)
    if err then return err end
    if require_existing and not previous then return errors.new({ kind = errors.INVALID, message = "roadmap " .. entity .. " not found for update: " .. id }) end
    return spec.upsert(db, roadmap_id, spec.normalize(p, previous))
end

local function delete_entity(db: any, entity: string, roadmap_id: string, p: any): error?
    local spec = ENTITIES[entity]
    if not spec then return errors.new({ kind = errors.INVALID, message = "unsupported roadmap entity: " .. entity }) end
    return exec(db, "DELETE FROM " .. spec.table_name .. " WHERE roadmap_id = ? AND id = ?", { roadmap_id, util.str(p.id) })
end

local function read_settings(db: any, roadmap_id: string): (any?, error?)
    local row, err = first_row(db, "SELECT * FROM chestor_roadmap_settings WHERE roadmap_id = ?", { roadmap_id })
    if err then return nil, err end
    if not row then return nil, nil end
    return decode_settings(row)
end

local function settings_update(db: any, roadmap_id: string, p: any): error?
    local previous, err = read_settings(db, roadmap_id)
    if err then return err end
    local patch = type(p.settings) == "table" and p.settings or p
    return settings_upsert(db, roadmap_id, records.settings_body(patch, previous))
end

local function lens_state_set(db: any, roadmap_id: string, p: any): error?
    local previous, err = read_settings(db, roadmap_id)
    if err then return err end
    local record = records.settings_body({}, previous)
    local lens = util.str(p.lens)
    if lens == "" then return errors.new({ kind = errors.INVALID, message = "roadmap lens state event is missing a lens" }) end
    record.lens_state[lens] = util.copy_object(p.state)
    return settings_upsert(db, roadmap_id, record)
end

function M.project_event(db: any, roadmap_id: string, event: any): error?
    local E = types.EVENT
    local t = kind(event)
    local p, body_err = body(event)
    if body_err then return body_err end

    if t == E.LAYER_ADDED then return write_entity(db, "layer", roadmap_id, p, false) end
    if t == E.LAYER_UPDATED then return write_entity(db, "layer", roadmap_id, p, true) end
    if t == E.LAYER_REMOVED then return delete_entity(db, "layer", roadmap_id, p) end
    if t == E.OUTCOME_ADDED then return write_entity(db, "outcome", roadmap_id, p, false) end
    if t == E.OUTCOME_UPDATED then return write_entity(db, "outcome", roadmap_id, p, true) end
    if t == E.OUTCOME_REMOVED then return delete_entity(db, "outcome", roadmap_id, p) end
    if t == E.INITIATIVE_ADDED then return write_entity(db, "initiative", roadmap_id, p, false) end
    if t == E.INITIATIVE_UPDATED then return write_entity(db, "initiative", roadmap_id, p, true) end
    if t == E.INITIATIVE_REMOVED then return delete_entity(db, "initiative", roadmap_id, p) end
    if t == E.DEPENDENCY_ADDED then return write_entity(db, "dependency", roadmap_id, p, false) end
    if t == E.DEPENDENCY_UPDATED then return write_entity(db, "dependency", roadmap_id, p, true) end
    if t == E.DEPENDENCY_REMOVED then return delete_entity(db, "dependency", roadmap_id, p) end
    if t == E.MILESTONE_ADDED then return write_entity(db, "milestone", roadmap_id, p, false) end
    if t == E.MILESTONE_UPDATED then return write_entity(db, "milestone", roadmap_id, p, true) end
    if t == E.MILESTONE_REMOVED then return delete_entity(db, "milestone", roadmap_id, p) end
    if t == E.SETTINGS_UPDATED then return settings_update(db, roadmap_id, p) end
    if t == E.LENS_STATE_SET then return lens_state_set(db, roadmap_id, p) end
    return errors.new({ kind = errors.INVALID, message = "unknown roadmap event type: " .. t })
end

function M.project_events(db: any, roadmap_id: string, events: any): error?
    for _, event in ipairs(type(events) == "table" and events or {}) do
        local err = M.project_event(db, roadmap_id, event)
        if err then return err end
    end
    return nil
end

function M.raw_state(db: any, roadmap_id: string): (any?, error?)
    local out: any = records.empty_state()

    local rows, err = query(db, "SELECT * FROM chestor_roadmap_layers WHERE roadmap_id = ? ORDER BY sort_order ASC, title ASC, id ASC", { roadmap_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local record = decode_layer(row)
        out.layers[record.id] = record
    end

    rows, err = query(db, "SELECT * FROM chestor_roadmap_outcomes WHERE roadmap_id = ? ORDER BY sort_order ASC, title ASC, id ASC", { roadmap_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local record = decode_outcome(row)
        out.outcomes[record.id] = record
    end

    rows, err = query(db, "SELECT * FROM chestor_roadmap_initiatives WHERE roadmap_id = ? ORDER BY sort_order ASC, start_period ASC, title ASC, id ASC", { roadmap_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local record, decode_err = decode_initiative(row)
        if decode_err then return nil, decode_err end
        out.initiatives[record.id] = record
    end

    rows, err = query(db, "SELECT * FROM chestor_roadmap_dependencies WHERE roadmap_id = ? ORDER BY created_at ASC, id ASC", { roadmap_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local record = decode_dependency(row)
        out.dependencies[record.id] = record
        out.dependency_order = util.append_unique(out.dependency_order, tostring(record.id))
    end

    rows, err = query(db, "SELECT * FROM chestor_roadmap_milestones WHERE roadmap_id = ? ORDER BY period ASC, title ASC, id ASC", { roadmap_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local record, decode_err = decode_milestone(row)
        if decode_err then return nil, decode_err end
        out.milestones[record.id] = record
    end

    local settings, serr = read_settings(db, roadmap_id)
    if serr then return nil, serr end
    if settings then out.settings = settings end
    return out, nil
end

function M.table_counts(db: any, roadmap_id: string): (any?, error?)
    local counts: any = {}
    for key, table_name in pairs({
        layers = "chestor_roadmap_layers",
        outcomes = "chestor_roadmap_outcomes",
        initiatives = "chestor_roadmap_initiatives",
        dependencies = "chestor_roadmap_dependencies",
        milestones = "chestor_roadmap_milestones",
    }) do
        local row, err = first_row(db, "SELECT COUNT(*) AS count FROM " .. table_name .. " WHERE roadmap_id = ?", { roadmap_id })
        if err then return nil, err end
        counts[key] = tonumber(row and (row :: any).count) or 0
    end
    return counts, nil
end

function M.delete_roadmap_rows(db: any, roadmap_id: string): error?
    for _, statement in ipairs({
        "DELETE FROM chestor_roadmap_history WHERE roadmap_id = ?",
        "DELETE FROM chestor_roadmap_settings WHERE roadmap_id = ?",
        "DELETE FROM chestor_roadmap_milestones WHERE roadmap_id = ?",
        "DELETE FROM chestor_roadmap_dependencies WHERE roadmap_id = ?",
        "DELETE FROM chestor_roadmap_initiatives WHERE roadmap_id = ?",
        "DELETE FROM chestor_roadmap_outcomes WHERE roadmap_id = ?",
        "DELETE FROM chestor_roadmap_layers WHERE roadmap_id = ?",
    }) do
        local err = exec(db, statement, { roadmap_id })
        if err then return err end
    end
    return nil
end

local function encode_history(value: any): (string?, any?)
    if type(value) ~= "table" then return nil, errors.new({ kind = errors.INVALID, message = "history payload must be a table" }) end
    local encoded, err = json.encode(value)
    if err then return nil, err end
    return encoded, nil
end

-- A new branch invalidates everything ahead of the pointer, so recording a batch
-- clears the redo stack before it pushes.
function M.record_history(db: any, roadmap_id: string, id: string, stack_seq: number, forward_events: any, inverse_events: any): error?
    local forward_json, ferr = encode_history(forward_events)
    if ferr then return ferr end
    local inverse_json, ierr = encode_history(inverse_events)
    if ierr then return ierr end
    local ts = now()
    local err = exec(db, "DELETE FROM chestor_roadmap_history WHERE roadmap_id = ? AND stack = 'redo'", { roadmap_id })
    if err then return err end
    return exec(db, [[
        INSERT INTO chestor_roadmap_history
            (id, roadmap_id, stack, stack_seq, forward_events, inverse_events, created_at, updated_at)
        VALUES (?, ?, 'undo', ?, ?, ?, ?, ?)
    ]], { id, roadmap_id, stack_seq, forward_json, inverse_json, ts, ts })
end

function M.peek_history(db: any, roadmap_id: string, stack: string): (any?, error?)
    local row, err = first_row(db, [[
        SELECT id, forward_events, inverse_events
        FROM chestor_roadmap_history
        WHERE roadmap_id = ? AND stack = ?
        ORDER BY stack_seq DESC
        LIMIT 1
    ]], { roadmap_id, stack })
    if err then return nil, err end
    if not row then return nil, nil end
    local forward, ferr = decode_history((row :: any).forward_events, "forward_events")
    if ferr then return nil, ferr end
    local inverse, ierr = decode_history((row :: any).inverse_events, "inverse_events")
    if ierr then return nil, ierr end
    return {
        id = util.str((row :: any).id),
        forward_events = forward,
        inverse_events = inverse,
    }, nil
end

function M.move_history(db: any, id: string, stack: string, stack_seq: number): error?
    return exec(db, "UPDATE chestor_roadmap_history SET stack = ?, stack_seq = ?, updated_at = ? WHERE id = ?", { stack, stack_seq, now(), id })
end

return M

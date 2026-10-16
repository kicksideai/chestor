local json = require("json")
local sql = require("sql")
local types = require("types")

local M = {}

local function now(): number
    return os.time()
end

local function encode(v: any, fallback: any): string
    local raw = type(v) == "table" and v or fallback
    local encoded, err = json.encode(raw)
    if err or not encoded then return json.encode(fallback) end
    return encoded
end

local function decode(raw: any, fallback: any): any
    if raw == nil or raw == "" then return fallback end
    if type(raw) == "table" then return raw end
    local decoded, err = json.decode(tostring(raw))
    if err or type(decoded) ~= "table" then return fallback end
    return decoded
end

local function body(event: any): any
    local b = type(event) == "table" and (event :: any).body or {}
    if type(b) == "string" then return decode(b, {}) end
    return type(b) == "table" and b or {}
end

local function kind(event: any): string
    return tostring(type(event) == "table" and (event :: any).type or "")
end

local function prepare_sql(db: any, statement: string): (string?, error?)
    local db_type, type_err = db:type()
    if type_err then return nil, errors.wrap(type_err, "failed to determine schema database type") end
    local dialect = tostring(db_type)
    if dialect == "sqlite" then return statement, nil end
    if dialect ~= "postgres" then return nil, errors.new({ kind = errors.INTERNAL, message = "unsupported schema database type: " .. dialect }) end
    local position = 0
    return (statement:gsub("%?", function(): string
        position = position + 1
        return "$" .. tostring(position)
    end)), nil
end

local function exec(db: any, query: string, params: any): error?
    local statement, prepare_err = prepare_sql(db, query)
    if prepare_err then return prepare_err end
    local _, err = db:execute(statement :: string, params or {})
    if err then return err end
    return nil
end

local function query(db: any, q: string, params: any): (any, error?)
    local statement, prepare_err = prepare_sql(db, q)
    if prepare_err then return nil, prepare_err end
    local rows, err = db:query(statement :: string, params or {})
    if err then return nil, err end
    return rows or {}
end

local function clamp_limit(value: any, default_value: number, max_value: number): number
    local n = math.floor(tonumber(value) or default_value)
    if n < 1 then return default_value end
    if n > max_value then return max_value end
    return n
end

local function decode_table_row(row: any): any
    return {
        id = tostring(row.id or ""),
        name = row.name,
        description = row.description,
        properties = decode(row.properties, {}),
        sort_order = tonumber(row.sort_order) or 0,
    }
end

local function decode_column_row(row: any): any
    return {
        id = tostring(row.id or ""),
        table_id = row.table_id,
        name = row.name,
        col_type = row.col_type,
        nullable = row.nullable == true or tonumber(row.nullable) == 1,
        primary_key = row.primary_key == true or tonumber(row.primary_key) == 1,
        unique_col = row.unique_col == true or tonumber(row.unique_col) == 1,
        default_value = row.default_value,
        description = row.description,
        sort_order = tonumber(row.sort_order) or 0,
    }
end

local function decode_relation_row(row: any): any
    return {
        id = tostring(row.id or ""),
        name = row.name,
        from_table_id = row.from_table_id,
        from_column_id = row.from_column_id,
        to_table_id = row.to_table_id,
        to_column_id = row.to_column_id,
        relation_type = row.relation_type,
        on_delete = row.on_delete,
        on_update = row.on_update,
    }
end

local function decode_index_row(row: any): any
    return {
        id = tostring(row.id or ""),
        table_id = row.table_id,
        name = row.name,
        columns = decode(row.columns, {}),
        unique_idx = row.unique_idx == true or tonumber(row.unique_idx) == 1,
    }
end

local function decode_layout_row(row: any): any
    return {
        x = tonumber(row.x) or 0,
        y = tonumber(row.y) or 0,
        width = tonumber(row.width),
        height = tonumber(row.height),
        meta = decode(row.meta, {}),
    }
end

function M.open_db(): (any?, error?)
    local db, err = sql.get(types.db_id())
    if err then return nil, errors.wrap(err, "db-schema materializer db unavailable") end
    if not db then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "db-schema materializer db unavailable" }) end
    return db, nil
end

function M.delete_schema_rows(db: any, schema_id: string): error?
    for _, stmt in ipairs({
        "DELETE FROM chestor_schema_layout WHERE schema_id = ?",
        "DELETE FROM chestor_schema_indexes WHERE schema_id = ?",
        "DELETE FROM chestor_schema_relations WHERE schema_id = ?",
        "DELETE FROM chestor_schema_columns WHERE schema_id = ?",
        "DELETE FROM chestor_schema_tables WHERE schema_id = ?",
    }) do
        local err = exec(db, stmt, { schema_id })
        if err then return err end
    end
    return nil
end

local function table_upsert(db: any, schema_id: string, p: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_schema_tables
            (schema_id, id, name, description, properties, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(schema_id, id) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            properties = excluded.properties,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], { schema_id, tostring(p.id or ""), tostring(p.name or p.id or ""), p.description, encode(p.properties, {}), tonumber(p.sort_order) or 0, ts, ts })
end

local function table_update(db: any, schema_id: string, p: any): error?
    local sets: { string } = { "updated_at = ?" }
    local params: { any } = { now() }
    if p.name ~= nil then sets[#sets + 1] = "name = ?"; params[#params + 1] = p.name end
    if p.description ~= nil then sets[#sets + 1] = "description = ?"; params[#params + 1] = p.description end
    if p.properties ~= nil then sets[#sets + 1] = "properties = ?"; params[#params + 1] = encode(p.properties, {}) end
    if p.sort_order ~= nil then sets[#sets + 1] = "sort_order = ?"; params[#params + 1] = tonumber(p.sort_order) or 0 end
    params[#params + 1] = tostring(p.id or "")
    params[#params + 1] = schema_id
    return exec(db, "UPDATE chestor_schema_tables SET " .. table.concat(sets, ", ") .. " WHERE id = ? AND schema_id = ?", params)
end

local function table_remove(db: any, schema_id: string, p: any): error?
    local id = tostring(p.id or "")
    for _, stmt in ipairs({
        "DELETE FROM chestor_schema_indexes WHERE schema_id = ? AND table_id = ?",
        "DELETE FROM chestor_schema_relations WHERE schema_id = ? AND (from_table_id = ? OR to_table_id = ?)",
        "DELETE FROM chestor_schema_columns WHERE schema_id = ? AND table_id = ?",
        "DELETE FROM chestor_schema_layout WHERE schema_id = ? AND table_id = ?",
        "DELETE FROM chestor_schema_tables WHERE schema_id = ? AND id = ?",
    }) do
        local params = stmt:find("from_table_id", 1, true) and { schema_id, id, id } or { schema_id, id }
        local err = exec(db, stmt, params)
        if err then return err end
    end
    return nil
end

local function column_upsert(db: any, schema_id: string, p: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_schema_columns
            (schema_id, id, table_id, name, col_type, nullable, primary_key, unique_col, default_value, description, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(schema_id, id) DO UPDATE SET
            table_id = excluded.table_id,
            name = excluded.name,
            col_type = excluded.col_type,
            nullable = excluded.nullable,
            primary_key = excluded.primary_key,
            unique_col = excluded.unique_col,
            default_value = excluded.default_value,
            description = excluded.description,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], {
        schema_id, tostring(p.id or ""), tostring(p.table_id or ""), tostring(p.name or p.id or ""),
        tostring(p.col_type or "text"), p.nullable == true and 1 or 0,
        p.primary_key == true and 1 or 0, p.unique_col == true and 1 or 0,
        p.default_value, p.description, tonumber(p.sort_order) or 0, ts, ts,
    })
end

local function column_update(db: any, schema_id: string, p: any): error?
    local sets: { string } = { "updated_at = ?" }
    local params: { any } = { now() }
    for _, key in ipairs({ "table_id", "name", "col_type", "default_value", "description" }) do
        if p[key] ~= nil then sets[#sets + 1] = key .. " = ?"; params[#params + 1] = p[key] end
    end
    for _, key in ipairs({ "nullable", "primary_key", "unique_col" }) do
        if p[key] ~= nil then sets[#sets + 1] = key .. " = ?"; params[#params + 1] = p[key] == true and 1 or 0 end
    end
    if p.sort_order ~= nil then sets[#sets + 1] = "sort_order = ?"; params[#params + 1] = tonumber(p.sort_order) or 0 end
    params[#params + 1] = tostring(p.id or "")
    params[#params + 1] = schema_id
    return exec(db, "UPDATE chestor_schema_columns SET " .. table.concat(sets, ", ") .. " WHERE id = ? AND schema_id = ?", params)
end

local function column_remove(db: any, schema_id: string, p: any): error?
    local id = tostring(p.id or "")
    local err = exec(db, "DELETE FROM chestor_schema_relations WHERE schema_id = ? AND (from_column_id = ? OR to_column_id = ?)", { schema_id, id, id })
    if err then return err end
    local rows, qerr = query(db, "SELECT id, columns FROM chestor_schema_indexes WHERE schema_id = ?", { schema_id })
    if qerr then return qerr end
    for _, row in ipairs(rows) do
        local columns = decode((row :: any).columns, {})
        if type(columns) == "table" then
            for _, column_id in ipairs(columns :: { any }) do
                if tostring(column_id) == id then
                    err = exec(db, "DELETE FROM chestor_schema_indexes WHERE schema_id = ? AND id = ?", { schema_id, tostring((row :: any).id or "") })
                    if err then return err end
                    break
                end
            end
        end
    end
    return exec(db, "DELETE FROM chestor_schema_columns WHERE schema_id = ? AND id = ?", { schema_id, id })
end

local function columns_reordered(db: any, schema_id: string, p: any): error?
    for i, id in ipairs(type(p.order) == "table" and p.order or {}) do
        local err = exec(db, "UPDATE chestor_schema_columns SET sort_order = ?, updated_at = ? WHERE schema_id = ? AND table_id = ? AND id = ?", {
            i, now(), schema_id, tostring(p.table_id or ""), tostring(id),
        })
        if err then return err end
    end
    return nil
end

local function relation_upsert(db: any, schema_id: string, p: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_schema_relations
            (schema_id, id, name, from_table_id, from_column_id, to_table_id, to_column_id, relation_type, on_delete, on_update, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(schema_id, id) DO UPDATE SET
            name = excluded.name,
            from_table_id = excluded.from_table_id,
            from_column_id = excluded.from_column_id,
            to_table_id = excluded.to_table_id,
            to_column_id = excluded.to_column_id,
            relation_type = excluded.relation_type,
            on_delete = excluded.on_delete,
            on_update = excluded.on_update,
            updated_at = excluded.updated_at
    ]], {
        schema_id, tostring(p.id or ""), p.name, tostring(p.from_table_id or ""), p.from_column_id,
        tostring(p.to_table_id or ""), p.to_column_id, tostring(p.relation_type or "many_to_one"),
        tostring(p.on_delete or "no_action"), tostring(p.on_update or "no_action"), ts, ts,
    })
end

local function relation_update(db: any, schema_id: string, p: any): error?
    local rows, err = query(db, "SELECT * FROM chestor_schema_relations WHERE schema_id = ? AND id = ?", { schema_id, tostring(p.id or "") })
    if err then return err end
    if #rows == 0 then return nil end
    local merged: any = rows[1]
    for _, key in ipairs({ "name", "from_table_id", "from_column_id", "to_table_id", "to_column_id", "relation_type", "on_delete", "on_update" }) do
        if p[key] ~= nil then merged[key] = p[key] end
    end
    return relation_upsert(db, schema_id, merged)
end

local function index_upsert(db: any, schema_id: string, p: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_schema_indexes
            (schema_id, id, table_id, name, columns, unique_idx, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(schema_id, id) DO UPDATE SET
            table_id = excluded.table_id,
            name = excluded.name,
            columns = excluded.columns,
            unique_idx = excluded.unique_idx,
            updated_at = excluded.updated_at
    ]], {
        schema_id, tostring(p.id or ""), tostring(p.table_id or ""), tostring(p.name or p.id or ""),
        encode(p.columns, {}), p.unique_idx == true and 1 or 0, ts, ts,
    })
end

local function index_update(db: any, schema_id: string, p: any): error?
    local rows, err = query(db, "SELECT * FROM chestor_schema_indexes WHERE schema_id = ? AND id = ?", { schema_id, tostring(p.id or "") })
    if err then return err end
    if #rows == 0 then return nil end
    local merged: any = rows[1]
    for _, key in ipairs({ "table_id", "name", "unique_idx" }) do
        if p[key] ~= nil then merged[key] = p[key] end
    end
    if p.columns ~= nil then merged.columns = p.columns else merged.columns = decode(merged.columns, {}) end
    return index_upsert(db, schema_id, merged)
end

local function layout_set(db: any, schema_id: string, p: any): error?
    return exec(db, [[
        INSERT INTO chestor_schema_layout (schema_id, table_id, x, y, width, height, meta)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(schema_id, table_id) DO UPDATE SET
            x = excluded.x,
            y = excluded.y,
            width = excluded.width,
            height = excluded.height,
            meta = excluded.meta
    ]], { schema_id, tostring(p.table_id or ""), tonumber(p.x) or 0, tonumber(p.y) or 0, tonumber(p.width), tonumber(p.height), encode(p.meta, {}) })
end

local function viewport_set(db: any, schema_id: string, p: any): error?
    return exec(db, [[
        INSERT INTO chestor_schema_layout (schema_id, table_id, x, y, width, height, meta)
        VALUES (?, ?, ?, ?, NULL, NULL, ?)
        ON CONFLICT(schema_id, table_id) DO UPDATE SET x = excluded.x, y = excluded.y, meta = excluded.meta
    ]], { schema_id, types.VIEWPORT_TABLE_ID, tonumber(p.x) or 0, tonumber(p.y) or 0, encode({ zoom = tonumber(p.zoom) or 1 }, {}) })
end

function M.project_event(db: any, schema_id: string, event: any): error?
    local E = types.EVENT
    local t = kind(event)
    local p = body(event)
    if t == E.TABLE_ADDED then return table_upsert(db, schema_id, p) end
    if t == E.TABLE_UPDATED then return table_update(db, schema_id, p) end
    if t == E.TABLE_REMOVED then return table_remove(db, schema_id, p) end
    if t == E.COLUMN_ADDED then return column_upsert(db, schema_id, p) end
    if t == E.COLUMN_UPDATED then return column_update(db, schema_id, p) end
    if t == E.COLUMN_REMOVED then return column_remove(db, schema_id, p) end
    if t == E.COLUMNS_REORDERED then return columns_reordered(db, schema_id, p) end
    if t == E.RELATION_ADDED then return relation_upsert(db, schema_id, p) end
    if t == E.RELATION_UPDATED then return relation_update(db, schema_id, p) end
    if t == E.RELATION_REMOVED then return exec(db, "DELETE FROM chestor_schema_relations WHERE schema_id = ? AND id = ?", { schema_id, tostring(p.id or "") }) end
    if t == E.INDEX_ADDED then return index_upsert(db, schema_id, p) end
    if t == E.INDEX_UPDATED then return index_update(db, schema_id, p) end
    if t == E.INDEX_REMOVED then return exec(db, "DELETE FROM chestor_schema_indexes WHERE schema_id = ? AND id = ?", { schema_id, tostring(p.id or "") }) end
    if t == E.LAYOUT_POSITION_SET then return layout_set(db, schema_id, p) end
    if t == E.LAYOUT_POSITION_CLEARED then return exec(db, "DELETE FROM chestor_schema_layout WHERE schema_id = ? AND table_id = ?", { schema_id, tostring(p.table_id or "") }) end
    if t == E.LAYOUT_VIEWPORT_SET then return viewport_set(db, schema_id, p) end
    return errors.new({ kind = errors.INVALID, message = "unknown db-schema event type: " .. t })
end

function M.project_events(db: any, schema_id: string, events: any): error?
    for _, event in ipairs(type(events) == "table" and events or {}) do
        local err = M.project_event(db, schema_id, event)
        if err then return err end
    end
    return nil
end

function M.list_tables(db: any, schema_id: string, options: any): (any?, error?)
    options = type(options) == "table" and options or {}
    local wheres: { string } = { "schema_id = ?" }
    local params: { any } = { schema_id }
    if options.id ~= nil then wheres[#wheres + 1] = "id = ?"; params[#params + 1] = tostring(options.id) end
    if options.search ~= nil and tostring(options.search) ~= "" then
        local pattern = "%" .. tostring(options.search) .. "%"
        wheres[#wheres + 1] = "(name LIKE ? OR description LIKE ?)"
        params[#params + 1] = pattern
        params[#params + 1] = pattern
    end
    local limit = clamp_limit(options.limit, 200, 1000)
    params[#params + 1] = limit
    local rows, err = query(db, "SELECT * FROM chestor_schema_tables WHERE " .. table.concat(wheres, " AND ") .. " ORDER BY sort_order ASC, created_at ASC, id ASC LIMIT ?", params)
    if err then return nil, err end
    local layouts: any = {}
    local layout_rows, lerr = query(db, "SELECT * FROM chestor_schema_layout WHERE schema_id = ? AND table_id <> ?", { schema_id, types.VIEWPORT_TABLE_ID })
    if lerr then return nil, lerr end
    for _, layout_row in ipairs(layout_rows) do
        layouts[tostring((layout_row :: any).table_id or "")] = decode_layout_row(layout_row)
    end
    local out = {}
    for _, row in ipairs(rows) do
        local table_row = decode_table_row(row)
        local cols, cerr = query(db, "SELECT * FROM chestor_schema_columns WHERE schema_id = ? AND table_id = ? ORDER BY sort_order ASC, created_at ASC, id ASC", { schema_id, table_row.id })
        if cerr then return nil, cerr end
        table_row.columns = {}
        for _, col in ipairs(cols) do table_row.columns[#table_row.columns + 1] = decode_column_row(col) end
        table_row.layout = layouts[tostring(table_row.id or "")]
        out[#out + 1] = table_row
    end
    return out, nil
end

function M.list_relations(db: any, schema_id: string, options: any): (any?, error?)
    options = type(options) == "table" and options or {}
    local wheres: { string } = { "schema_id = ?" }
    local params: { any } = { schema_id }
    if options.id ~= nil then wheres[#wheres + 1] = "id = ?"; params[#params + 1] = tostring(options.id) end
    if options.table_id ~= nil then
        wheres[#wheres + 1] = "(from_table_id = ? OR to_table_id = ?)"
        params[#params + 1] = tostring(options.table_id)
        params[#params + 1] = tostring(options.table_id)
    end
    local limit = clamp_limit(options.limit, 200, 1000)
    params[#params + 1] = limit
    local rows, err = query(db, "SELECT * FROM chestor_schema_relations WHERE " .. table.concat(wheres, " AND ") .. " ORDER BY created_at ASC, id ASC LIMIT ?", params)
    if err then return nil, err end
    local out = {}
    for _, row in ipairs(rows) do out[#out + 1] = decode_relation_row(row) end
    return out, nil
end

function M.list_indexes(db: any, schema_id: string, options: any): (any?, error?)
    options = type(options) == "table" and options or {}
    local wheres: { string } = { "schema_id = ?" }
    local params: { any } = { schema_id }
    if options.id ~= nil then wheres[#wheres + 1] = "id = ?"; params[#params + 1] = tostring(options.id) end
    if options.table_id ~= nil then wheres[#wheres + 1] = "table_id = ?"; params[#params + 1] = tostring(options.table_id) end
    local limit = clamp_limit(options.limit, 200, 1000)
    params[#params + 1] = limit
    local rows, err = query(db, "SELECT * FROM chestor_schema_indexes WHERE " .. table.concat(wheres, " AND ") .. " ORDER BY created_at ASC, id ASC LIMIT ?", params)
    if err then return nil, err end
    local out = {}
    for _, row in ipairs(rows) do out[#out + 1] = decode_index_row(row) end
    return out, nil
end

function M.raw_state(db: any, schema_id: string): (any?, error?)
    local state: any = { tables = {}, columns = {}, relations = {}, indexes = {}, layout = {}, column_order = {}, viewport = nil }
    local rows, err = query(db, "SELECT * FROM chestor_schema_tables WHERE schema_id = ? ORDER BY sort_order ASC, created_at ASC, id ASC", { schema_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        state.tables[tostring(r.id or "")] = {
            id = r.id,
            name = r.name,
            description = r.description,
            properties = decode(r.properties, {}),
            sort_order = tonumber(r.sort_order) or 0,
        }
    end

    rows, err = query(db, "SELECT * FROM chestor_schema_columns WHERE schema_id = ? ORDER BY table_id ASC, sort_order ASC, created_at ASC, id ASC", { schema_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        local id = tostring(r.id or "")
        local table_id = tostring(r.table_id or "")
        state.columns[id] = {
            id = id,
            table_id = table_id,
            name = r.name,
            col_type = r.col_type,
            nullable = r.nullable == true or tonumber(r.nullable) == 1,
            primary_key = r.primary_key == true or tonumber(r.primary_key) == 1,
            unique_col = r.unique_col == true or tonumber(r.unique_col) == 1,
            default_value = r.default_value,
            description = r.description,
            sort_order = tonumber(r.sort_order) or 0,
        }
        state.column_order[table_id] = state.column_order[table_id] or {}
        table.insert(state.column_order[table_id], id)
    end

    rows, err = query(db, "SELECT * FROM chestor_schema_relations WHERE schema_id = ? ORDER BY created_at ASC, id ASC", { schema_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        state.relations[tostring(r.id or "")] = {
            id = r.id,
            name = r.name,
            from_table_id = r.from_table_id,
            from_column_id = r.from_column_id,
            to_table_id = r.to_table_id,
            to_column_id = r.to_column_id,
            relation_type = r.relation_type,
            on_delete = r.on_delete,
            on_update = r.on_update,
        }
    end

    rows, err = query(db, "SELECT * FROM chestor_schema_indexes WHERE schema_id = ? ORDER BY created_at ASC, id ASC", { schema_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        state.indexes[tostring(r.id or "")] = {
            id = r.id,
            table_id = r.table_id,
            name = r.name,
            columns = decode(r.columns, {}),
            unique_idx = r.unique_idx == true or tonumber(r.unique_idx) == 1,
        }
    end

    rows, err = query(db, "SELECT * FROM chestor_schema_layout WHERE schema_id = ? ORDER BY table_id ASC", { schema_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        local meta = decode(r.meta, {})
        if tostring(r.table_id or "") == types.VIEWPORT_TABLE_ID then
            state.viewport = { x = tonumber(r.x) or 0, y = tonumber(r.y) or 0, zoom = tonumber(meta.zoom) or 1 }
        else
            state.layout[tostring(r.table_id or "")] = {
                x = tonumber(r.x) or 0,
                y = tonumber(r.y) or 0,
                width = tonumber(r.width),
                height = tonumber(r.height),
                meta = meta,
            }
        end
    end
    return state, nil
end

function M.table_counts(db: any, schema_id: string): (any?, error?)
    local counts: any = {}
    for key, table_name in pairs({
        tables = "chestor_schema_tables",
        columns = "chestor_schema_columns",
        relations = "chestor_schema_relations",
        indexes = "chestor_schema_indexes",
        layout = "chestor_schema_layout",
    }) do
        local rows, err = query(db, "SELECT COUNT(*) AS count FROM " .. table_name .. " WHERE schema_id = ?", { schema_id })
        if err then return nil, err end
        counts[key] = tonumber(rows[1] and rows[1].count) or 0
    end
    return counts, nil
end

return M

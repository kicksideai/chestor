local json = require("json")
local sql = require("sql")
local types = require("types")

local M = {}

local function now(): number
    return os.time()
end

local function encode(v: any, fallback: any): string
    local raw = v
    if type(raw) ~= "table" then raw = fallback end
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

local function decode_history(raw: any, field: string): (any?, error?)
    if raw == nil or raw == "" then return nil, errors.new({ kind = errors.INVALID, message = "history " .. field .. " is empty" }) end
    if type(raw) == "table" then return raw, nil end
    local decoded, err = json.decode(tostring(raw))
    if err then return nil, errors.new({ kind = errors.INVALID, message = "history " .. field .. " is invalid JSON: " .. tostring(err) }) end
    if type(decoded) ~= "table" then return nil, errors.new({ kind = errors.INVALID, message = "history " .. field .. " must be a JSON array" }) end
    return decoded, nil
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
    if type_err then return nil, errors.wrap(type_err, "failed to determine graph database type") end
    local dialect = tostring(db_type)
    if dialect == "sqlite" then return statement, nil end
    if dialect ~= "postgres" then return nil, errors.new({ kind = errors.INTERNAL, message = "unsupported graph database type: " .. dialect }) end
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

local function append_where(wheres: { string }, params: { any }, clause: string, value: any)
    wheres[#wheres + 1] = clause
    params[#params + 1] = value
end

local function decode_node_row(row: any): any
    return {
        id = tostring(row.id or ""),
        type = row.type,
        name = row.name,
        description = row.description,
        parent_id = row.parent_id,
        properties = decode(row.properties, {}),
        tags = decode(row.tags, {}),
        status = row.status,
        sort_order = tonumber(row.sort_order) or 0,
    }
end

local function decode_edge_row(row: any): any
    return {
        id = tostring(row.id or ""),
        type = row.type,
        source_id = row.source_id,
        target_id = row.target_id,
        label = row.label,
        properties = decode(row.properties, {}),
        status = row.status,
        sort_order = tonumber(row.sort_order) or 0,
    }
end

local function decode_material_row(row: any): any
    local target_type = tostring(row.target_type or "graph")
    local target_id = target_type == "graph" and nil
    if target_type ~= "graph" then target_id = row.target_id end
    return {
        id = tostring(row.id or ""),
        target_type = target_type,
        target_id = target_id,
        kind = row.kind,
        title = row.title,
        summary = row.summary,
        source = decode(row.source, {}),
        source_type = row.source_type,
        source_component_id = row.source_component_id,
        source_upload_id = row.source_upload_id,
        source_url = row.source_url,
        meta = decode(row.meta, {}),
        sort_order = tonumber(row.sort_order) or 0,
    }
end

local function decode_type_row(row: any): any
    local def: any = decode(row.definition, {})
    def.id = def.id or row.id
    def.title = def.title or row.title
    def.kind = row.kind
    return def
end

local function target_key(target_type: string, target_id: any): string
    if target_type == "graph" then return "graph:" end
    return target_type .. ":" .. tostring(target_id or "")
end

local function material_target_id(target_type: any, target_id: any): any
    if target_type == "graph" then return nil end
    return target_id
end

local function parent_id_value(value: any): any
    if value == false or value == "" then return nil end
    return value
end

local function append_unique(list: any, value: string): { any }
    local out: { any } = type(list) == "table" and (list :: { any }) or {}
    for _, v in ipairs(out) do
        if tostring(v) == value then return out end
    end
    out[#out + 1] = value
    return out
end

function M.open_db(): (any?, error?)
    local db, err = sql.get(types.db_id())
    if err then return nil, errors.wrap(err, "graph materializer db unavailable") end
    if not db then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "graph materializer db unavailable" }) end
    return db, nil
end

function M.delete_graph_rows(db: any, graph_id: string): error?
    for _, stmt in ipairs({
        "DELETE FROM chestor_graph_history WHERE graph_id = ?",
        "DELETE FROM chestor_graph_settings WHERE graph_id = ?",
        "DELETE FROM chestor_graph_layout WHERE graph_id = ?",
        "DELETE FROM chestor_graph_types WHERE graph_id = ?",
        "DELETE FROM chestor_graph_materials WHERE graph_id = ?",
        "DELETE FROM chestor_graph_edges WHERE graph_id = ?",
        "DELETE FROM chestor_graph_nodes WHERE graph_id = ?",
    }) do
        local err = exec(db, stmt, { graph_id })
        if err then return err end
    end
    return nil
end

local function node_upsert(db: any, graph_id: string, p: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_graph_nodes
            (graph_id, id, type, name, description, parent_id, properties, tags, status, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(graph_id, id) DO UPDATE SET
            type = excluded.type,
            name = excluded.name,
            description = excluded.description,
            parent_id = excluded.parent_id,
            properties = excluded.properties,
            tags = excluded.tags,
            status = excluded.status,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], {
        graph_id, tostring(p.id or ""), tostring(p.type or "node"), tostring(p.name or p.id or ""),
        p.description, parent_id_value(p.parent_id),
        encode(p.properties, {}), encode(p.tags, {}),
        tostring(p.status or "active"), tonumber(p.sort_order) or 0, ts, ts,
    })
end

local function node_update(db: any, graph_id: string, p: any): error?
    local sets: { string } = { "updated_at = ?" }
    local params: { any } = { now() }
    if p.type ~= nil then sets[#sets + 1] = "type = ?"; params[#params + 1] = p.type end
    if p.name ~= nil then sets[#sets + 1] = "name = ?"; params[#params + 1] = p.name end
    if p.description ~= nil then sets[#sets + 1] = "description = ?"; params[#params + 1] = p.description end
    if p.parent_id ~= nil then
        if p.parent_id == false or p.parent_id == "" then
            sets[#sets + 1] = "parent_id = NULL"
        else
            sets[#sets + 1] = "parent_id = ?"; params[#params + 1] = p.parent_id
        end
    end
    if p.properties ~= nil then sets[#sets + 1] = "properties = ?"; params[#params + 1] = encode(p.properties, {}) end
    if p.tags ~= nil then sets[#sets + 1] = "tags = ?"; params[#params + 1] = encode(p.tags, {}) end
    if p.status ~= nil then sets[#sets + 1] = "status = ?"; params[#params + 1] = p.status end
    if p.sort_order ~= nil then sets[#sets + 1] = "sort_order = ?"; params[#params + 1] = tonumber(p.sort_order) or 0 end
    params[#params + 1] = tostring(p.id or "")
    params[#params + 1] = graph_id
    return exec(db, "UPDATE chestor_graph_nodes SET " .. table.concat(sets, ", ") .. " WHERE id = ? AND graph_id = ?", params)
end

local function descendants(db: any, graph_id: string, root_id: string): ({ string }?, error?)
    local out: { string } = { root_id }
    local seen: { [string]: boolean } = { [root_id] = true }
    local head = 1
    while head <= #out do
        local current = out[head]
        head = head + 1
        local rows, err = query(db, "SELECT id FROM chestor_graph_nodes WHERE graph_id = ? AND parent_id = ?", { graph_id, current })
        if err then return nil, err end
        for _, row in ipairs(rows) do
            local id = tostring((row :: any).id or "")
            if id ~= "" and not seen[id] then
                seen[id] = true
                out[#out + 1] = id
            end
        end
    end
    return out, nil
end

local function node_remove(db: any, graph_id: string, p: any): error?
    local ids, derr = descendants(db, graph_id, tostring(p.id or ""))
    if derr then return derr end
    ids = ids or {}
    for _, id in ipairs(ids) do
        local edge_rows, qerr = query(db, "SELECT id FROM chestor_graph_edges WHERE graph_id = ? AND (source_id = ? OR target_id = ?)", { graph_id, id, id })
        if qerr then return qerr end
        for _, edge in ipairs(edge_rows) do
            local edge_id = tostring((edge :: any).id or "")
            local err = exec(db, "DELETE FROM chestor_graph_materials WHERE graph_id = ? AND target_type = 'edge' AND target_id = ?", { graph_id, edge_id })
            if err then return err end
            err = exec(db, "DELETE FROM chestor_graph_edges WHERE graph_id = ? AND id = ?", { graph_id, edge_id })
            if err then return err end
        end
        for _, stmt in ipairs({
            "DELETE FROM chestor_graph_materials WHERE graph_id = ? AND target_type = 'node' AND target_id = ?",
            "DELETE FROM chestor_graph_layout WHERE graph_id = ? AND node_id = ?",
            "DELETE FROM chestor_graph_nodes WHERE graph_id = ? AND id = ?",
        }) do
            local err = exec(db, stmt, { graph_id, id })
            if err then return err end
        end
    end
    return nil
end

local function edge_upsert(db: any, graph_id: string, p: any): error?
    local ts = now()
    return exec(db, [[
        INSERT INTO chestor_graph_edges
            (graph_id, id, type, source_id, target_id, label, properties, status, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(graph_id, id) DO UPDATE SET
            type = excluded.type,
            source_id = excluded.source_id,
            target_id = excluded.target_id,
            label = excluded.label,
            properties = excluded.properties,
            status = excluded.status,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], {
        graph_id, tostring(p.id or ""), tostring(p.type or "edge"), tostring(p.source_id or ""),
        tostring(p.target_id or ""), p.label, encode(p.properties, {}), tostring(p.status or "active"),
        tonumber(p.sort_order) or 0, ts, ts,
    })
end

local function edge_update(db: any, graph_id: string, p: any): error?
    local sets: { string } = { "updated_at = ?" }
    local params: { any } = { now() }
    if p.type ~= nil then sets[#sets + 1] = "type = ?"; params[#params + 1] = p.type end
    if p.source_id ~= nil then sets[#sets + 1] = "source_id = ?"; params[#params + 1] = p.source_id end
    if p.target_id ~= nil then sets[#sets + 1] = "target_id = ?"; params[#params + 1] = p.target_id end
    if p.label ~= nil then sets[#sets + 1] = "label = ?"; params[#params + 1] = p.label end
    if p.properties ~= nil then sets[#sets + 1] = "properties = ?"; params[#params + 1] = encode(p.properties, {}) end
    if p.status ~= nil then sets[#sets + 1] = "status = ?"; params[#params + 1] = p.status end
    if p.sort_order ~= nil then sets[#sets + 1] = "sort_order = ?"; params[#params + 1] = tonumber(p.sort_order) or 0 end
    params[#params + 1] = tostring(p.id or "")
    params[#params + 1] = graph_id
    return exec(db, "UPDATE chestor_graph_edges SET " .. table.concat(sets, ", ") .. " WHERE id = ? AND graph_id = ?", params)
end

local function edge_remove(db: any, graph_id: string, p: any): error?
    local id = tostring(p.id or "")
    local err = exec(db, "DELETE FROM chestor_graph_materials WHERE graph_id = ? AND target_type = 'edge' AND target_id = ?", { graph_id, id })
    if err then return err end
    return exec(db, "DELETE FROM chestor_graph_edges WHERE graph_id = ? AND id = ?", { graph_id, id })
end

local function material_upsert(db: any, graph_id: string, p: any): error?
    local ts = now()
    local target_type = tostring(p.target_type or "graph")
    local target_id = target_type == "graph" and "" or tostring(p.target_id or "")
    local source = type(p.source) == "table" and p.source or {}
    return exec(db, [[
        INSERT INTO chestor_graph_materials
            (graph_id, id, target_type, target_id, kind, title, summary, source, meta, source_type, source_component_id, source_upload_id, source_url, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(graph_id, id) DO UPDATE SET
            target_type = excluded.target_type,
            target_id = excluded.target_id,
            kind = excluded.kind,
            title = excluded.title,
            summary = excluded.summary,
            source = excluded.source,
            meta = excluded.meta,
            source_type = excluded.source_type,
            source_component_id = excluded.source_component_id,
            source_upload_id = excluded.source_upload_id,
            source_url = excluded.source_url,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
    ]], {
        graph_id, tostring(p.id or ""), target_type, target_id, tostring(p.kind or "material"),
        p.title, p.summary, encode(source, {}), encode(p.meta, {}),
        source.type, source.component_id, source.upload_id, source.url,
        tonumber(p.sort_order) or 0, ts, ts,
    })
end

local function material_update(db: any, graph_id: string, p: any): error?
    local rows, err = query(db, "SELECT * FROM chestor_graph_materials WHERE graph_id = ? AND id = ?", { graph_id, tostring(p.id or "") })
    if err then return err end
    if #rows == 0 then return nil end
    local merged: any = rows[1]
    for _, key in ipairs({ "target_type", "target_id", "kind", "title", "summary", "sort_order" }) do
        if p[key] ~= nil then merged[key] = p[key] end
    end
    if p.source ~= nil then merged.source = p.source else merged.source = decode(merged.source, {}) end
    if p.meta ~= nil then merged.meta = p.meta else merged.meta = decode(merged.meta, {}) end
    return material_upsert(db, graph_id, merged)
end

local function material_remove(db: any, graph_id: string, p: any): error?
    return exec(db, "DELETE FROM chestor_graph_materials WHERE graph_id = ? AND id = ?", { graph_id, tostring(p.id or "") })
end

local function encode_history(value: any): (string?, error?)
    if type(value) ~= "table" then return nil, errors.new({ kind = errors.INVALID, message = "history payload must be a table" }) end
    local encoded, err = json.encode(value)
    if err or not encoded then
        return nil, errors.new({ kind = errors.INVALID, message = "history payload is not JSON serializable: " .. tostring(err) })
    end
    return encoded, nil
end

function M.record_history(db: any, graph_id: string, id: string, stack_seq: number, forward_events: any, inverse_events: any): error?
    local forward_json, ferr = encode_history(forward_events)
    if ferr then return ferr end
    local inverse_json, ierr = encode_history(inverse_events)
    if ierr then return ierr end
    local ts = now()
    local err = exec(db, "DELETE FROM chestor_graph_history WHERE graph_id = ? AND stack = 'redo'", { graph_id })
    if err then return err end
    return exec(db, [[
        INSERT INTO chestor_graph_history
            (id, graph_id, stack, stack_seq, forward_events, inverse_events, created_at, updated_at)
        VALUES (?, ?, 'undo', ?, ?, ?, ?, ?)
    ]], { id, graph_id, stack_seq, forward_json, inverse_json, ts, ts })
end

function M.peek_history(db: any, graph_id: string, stack: string): (any?, error?)
    local rows, err = query(db, [[
        SELECT id, forward_events, inverse_events
        FROM chestor_graph_history
        WHERE graph_id = ? AND stack = ?
        ORDER BY stack_seq DESC
        LIMIT 1
    ]], { graph_id, stack })
    if err then return nil, err end
    if type(rows) ~= "table" or #rows == 0 then return nil, nil end
    local row: any = rows[1]
    local forward, ferr = decode_history(row.forward_events, "forward_events")
    if ferr then return nil, ferr end
    local inverse, ierr = decode_history(row.inverse_events, "inverse_events")
    if ierr then return nil, ierr end
    return {
        id = tostring(row.id or ""),
        forward_events = forward,
        inverse_events = inverse,
    }, nil
end

function M.move_history(db: any, id: string, stack: string, stack_seq: number): error?
    return exec(db, "UPDATE chestor_graph_history SET stack = ?, stack_seq = ?, updated_at = ? WHERE id = ?", { stack, stack_seq, now(), id })
end

local function type_upsert(db: any, graph_id: string, type_kind: string, p: any): error?
    local ts = now()
    local payload = {}
    for k, v in pairs(type(p) == "table" and p or {}) do payload[k] = v end
    payload.id = payload.id or p.id
    return exec(db, [[
        INSERT INTO chestor_graph_types
            (graph_id, kind, id, title, definition, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(graph_id, kind, id) DO UPDATE SET
            title = excluded.title,
            definition = excluded.definition,
            updated_at = excluded.updated_at
    ]], { graph_id, type_kind, tostring(p.id or ""), tostring(p.title or p.id or ""), encode(payload, {}), ts, ts })
end

local function type_remove(db: any, graph_id: string, type_kind: string, p: any): error?
    return exec(db, "DELETE FROM chestor_graph_types WHERE graph_id = ? AND kind = ? AND id = ?", { graph_id, type_kind, tostring(p.id or "") })
end

local function layout_set(db: any, graph_id: string, p: any): error?
    return exec(db, [[
        INSERT INTO chestor_graph_layout (graph_id, node_id, x, y, width, height, pinned, meta)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(graph_id, node_id) DO UPDATE SET
            x = excluded.x,
            y = excluded.y,
            width = excluded.width,
            height = excluded.height,
            pinned = excluded.pinned,
            meta = excluded.meta
    ]], {
        graph_id, tostring(p.node_id or ""), tonumber(p.x) or 0, tonumber(p.y) or 0,
        tonumber(p.width), tonumber(p.height), p.pinned == true and 1 or 0, encode(p.meta, {}),
    })
end

local function viewport_set(db: any, graph_id: string, p: any): error?
    return exec(db, [[
        INSERT INTO chestor_graph_layout (graph_id, node_id, x, y, width, height, pinned, meta)
        VALUES (?, ?, ?, ?, NULL, NULL, 0, ?)
        ON CONFLICT(graph_id, node_id) DO UPDATE SET
            x = excluded.x,
            y = excluded.y,
            meta = excluded.meta
    ]], { graph_id, types.VIEWPORT_NODE_ID, tonumber(p.x) or 0, tonumber(p.y) or 0, encode({ zoom = tonumber(p.zoom) or 1, root_id = p.root_id }, {}) })
end

local function settings_update(db: any, graph_id: string, p: any): error?
    local current = {}
    local rows = query(db, "SELECT settings FROM chestor_graph_settings WHERE graph_id = ?", { graph_id })
    if type(rows) == "table" and #rows > 0 then current = decode((rows[1] :: any).settings, {}) end
    local patch = type(p.settings) == "table" and p.settings or p
    for k, v in pairs(type(patch) == "table" and patch or {}) do current[k] = v end
    return exec(db, [[
        INSERT INTO chestor_graph_settings (graph_id, settings, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(graph_id) DO UPDATE SET settings = excluded.settings, updated_at = excluded.updated_at
    ]], { graph_id, encode(current, {}), now() })
end

function M.project_event(db: any, graph_id: string, event: any): error?
    local E = types.EVENT
    local t = kind(event)
    local p = body(event)
    if t == E.NODE_ADDED then return node_upsert(db, graph_id, p) end
    if t == E.NODE_UPDATED then return node_update(db, graph_id, p) end
    if t == E.NODE_REMOVED then return node_remove(db, graph_id, p) end
    if t == E.EDGE_ADDED then return edge_upsert(db, graph_id, p) end
    if t == E.EDGE_UPDATED then return edge_update(db, graph_id, p) end
    if t == E.EDGE_REMOVED then return edge_remove(db, graph_id, p) end
    if t == E.MATERIAL_ATTACHED then return material_upsert(db, graph_id, p) end
    if t == E.MATERIAL_UPDATED then return material_update(db, graph_id, p) end
    if t == E.MATERIAL_DETACHED then return material_remove(db, graph_id, p) end
    if t == E.NODE_TYPE_REGISTERED or t == E.NODE_TYPE_UPDATED then return type_upsert(db, graph_id, "node", p) end
    if t == E.NODE_TYPE_REMOVED then return type_remove(db, graph_id, "node", p) end
    if t == E.EDGE_TYPE_REGISTERED or t == E.EDGE_TYPE_UPDATED then return type_upsert(db, graph_id, "edge", p) end
    if t == E.EDGE_TYPE_REMOVED then return type_remove(db, graph_id, "edge", p) end
    if t == E.MATERIAL_TYPE_REGISTERED or t == E.MATERIAL_TYPE_UPDATED then return type_upsert(db, graph_id, "material", p) end
    if t == E.MATERIAL_TYPE_REMOVED then return type_remove(db, graph_id, "material", p) end
    if t == E.LAYOUT_POSITION_SET then return layout_set(db, graph_id, p) end
    if t == E.LAYOUT_POSITION_CLEARED then return exec(db, "DELETE FROM chestor_graph_layout WHERE graph_id = ? AND node_id = ?", { graph_id, tostring(p.node_id or "") }) end
    if t == E.LAYOUT_VIEWPORT_SET then return viewport_set(db, graph_id, p) end
    if t == E.GRAPH_SETTINGS_UPDATED then return settings_update(db, graph_id, p) end
    return errors.new({ kind = errors.INVALID, message = "unknown graph event type: " .. t })
end

function M.project_events(db: any, graph_id: string, events: any): error?
    for _, event in ipairs(type(events) == "table" and events or {}) do
        local err = M.project_event(db, graph_id, event)
        if err then return err end
    end
    return nil
end

local CURSOR_SEPARATOR = "\31"

local ORDER_BY = " ORDER BY sort_order ASC, created_at ASC, id ASC"

local function encode_order_cursor(row: any): string
    return table.concat({ tostring(row.sort_order), tostring(row.created_at), tostring(row.id) }, CURSOR_SEPARATOR)
end

local function decode_order_cursor(cursor: string): (any?, error?)
    local sort_order, created_at, id = cursor:match("^(%-?%d+)" .. CURSOR_SEPARATOR .. "(%-?%d+)" .. CURSOR_SEPARATOR .. "([^" .. CURSOR_SEPARATOR .. "]*)$")
    if not sort_order then return nil, errors.new({ kind = errors.INVALID, message = "invalid cursor" }) end
    return { sort_order = tonumber(sort_order), created_at = tonumber(created_at), id = id }, nil
end

-- Nodes, edges and materials are ordered by (sort_order, created_at, id); the
-- cursor is the last returned row's key and the next page starts strictly after it.
local function ordered_page(db: any, table_name: string, wheres: { string }, params: { any }, options: any, decode: (any) -> any): (any?, error?, string?)
    if options.cursor ~= nil and options.cursor ~= "" then
        local after, cursor_err = decode_order_cursor(tostring(options.cursor))
        if not after then return nil, cursor_err end
        wheres[#wheres + 1] = "(sort_order > ? OR (sort_order = ? AND (created_at > ? OR (created_at = ? AND id > ?))))"
        for _, value in ipairs({ after.sort_order, after.sort_order, after.created_at, after.created_at, after.id }) do params[#params + 1] = value end
    end
    local limit = clamp_limit(options.limit, 200, 1000)
    params[#params + 1] = limit + 1
    local rows, err = query(db, "SELECT * FROM " .. table_name .. " WHERE " .. table.concat(wheres, " AND ") .. ORDER_BY .. " LIMIT ?", params)
    if err then return nil, err end
    local next_cursor: string? = nil
    if #rows > limit then
        table.remove(rows)
        next_cursor = encode_order_cursor(rows[#rows])
    end
    local out = {}
    for _, row in ipairs(rows) do out[#out + 1] = decode(row) end
    return out, nil, next_cursor
end

function M.list_nodes(db: any, graph_id: string, options: any): (any?, error?, string?)
    options = type(options) == "table" and options or {}
    local wheres: { string } = { "graph_id = ?" }
    local params: { any } = { graph_id }
    if options.id ~= nil then append_where(wheres, params, "id = ?", tostring(options.id)) end
    if options.type ~= nil then append_where(wheres, params, "type = ?", tostring(options.type)) end
    if options.parent_id ~= nil then
        local parent_id = tostring(options.parent_id or "")
        if parent_id == "" then
            wheres[#wheres + 1] = "parent_id IS NULL"
        else
            append_where(wheres, params, "parent_id = ?", parent_id)
        end
    elseif options.roots_only == true then
        wheres[#wheres + 1] = "parent_id IS NULL"
    end
    if options.search ~= nil and tostring(options.search) ~= "" then
        local pattern = "%" .. tostring(options.search) .. "%"
        wheres[#wheres + 1] = "(name LIKE ? OR description LIKE ? OR tags LIKE ?)"
        params[#params + 1] = pattern
        params[#params + 1] = pattern
        params[#params + 1] = pattern
    end
    return ordered_page(db, "chestor_graph_nodes", wheres, params, options, decode_node_row)
end

function M.list_edges(db: any, graph_id: string, options: any): (any?, error?, string?)
    options = type(options) == "table" and options or {}
    local wheres: { string } = { "graph_id = ?" }
    local params: { any } = { graph_id }
    if options.id ~= nil then append_where(wheres, params, "id = ?", tostring(options.id)) end
    if options.type ~= nil then append_where(wheres, params, "type = ?", tostring(options.type)) end
    if options.source_id ~= nil then append_where(wheres, params, "source_id = ?", tostring(options.source_id)) end
    if options.target_id ~= nil then append_where(wheres, params, "target_id = ?", tostring(options.target_id)) end
    if options.node_id ~= nil then
        wheres[#wheres + 1] = "(source_id = ? OR target_id = ?)"
        params[#params + 1] = tostring(options.node_id)
        params[#params + 1] = tostring(options.node_id)
    end
    return ordered_page(db, "chestor_graph_edges", wheres, params, options, decode_edge_row)
end

function M.list_materials(db: any, graph_id: string, options: any): (any?, error?, string?)
    options = type(options) == "table" and options or {}
    local wheres: { string } = { "graph_id = ?" }
    local params: { any } = { graph_id }
    if options.id ~= nil then append_where(wheres, params, "id = ?", tostring(options.id)) end
    if options.kind ~= nil then append_where(wheres, params, "kind = ?", tostring(options.kind)) end
    if options.target_type ~= nil then append_where(wheres, params, "target_type = ?", tostring(options.target_type)) end
    if options.target_id ~= nil then append_where(wheres, params, "target_id = ?", tostring(options.target_id)) end
    if options.source_type ~= nil then append_where(wheres, params, "source_type = ?", tostring(options.source_type)) end
    if options.source_component_id ~= nil then append_where(wheres, params, "source_component_id = ?", tostring(options.source_component_id)) end
    if options.source_upload_id ~= nil then append_where(wheres, params, "source_upload_id = ?", tostring(options.source_upload_id)) end
    if options.source_url ~= nil then append_where(wheres, params, "source_url = ?", tostring(options.source_url)) end
    return ordered_page(db, "chestor_graph_materials", wheres, params, options, decode_material_row)
end

local function encode_type_cursor(row: any): string
    return table.concat({ tostring(row.kind), tostring(row.title), tostring(row.id) }, CURSOR_SEPARATOR)
end

local function decode_type_cursor(cursor: string): (any?, error?)
    local kind, title, id = cursor:match("^([^" .. CURSOR_SEPARATOR .. "]*)" .. CURSOR_SEPARATOR
        .. "([^" .. CURSOR_SEPARATOR .. "]*)" .. CURSOR_SEPARATOR .. "([^" .. CURSOR_SEPARATOR .. "]*)$")
    if not kind then return nil, errors.new({ kind = errors.INVALID, message = "invalid cursor" }) end
    return { kind = kind, title = title, id = id }, nil
end

-- Type rows are ordered by (kind, title, id); the cursor is the last returned
-- row's key and the next page starts strictly after it.
function M.list_types(db: any, graph_id: string, options: any): (any?, error?, string?)
    options = type(options) == "table" and options or {}
    local wheres: { string } = { "graph_id = ?" }
    local params: { any } = { graph_id }
    if options.kind ~= nil then append_where(wheres, params, "kind = ?", tostring(options.kind)) end
    if options.id ~= nil then append_where(wheres, params, "id = ?", tostring(options.id)) end
    if options.cursor ~= nil and options.cursor ~= "" then
        local after, cursor_err = decode_type_cursor(tostring(options.cursor))
        if not after then return nil, cursor_err end
        wheres[#wheres + 1] = "(kind > ? OR (kind = ? AND (title > ? OR (title = ? AND id > ?))))"
        for _, value in ipairs({ after.kind, after.kind, after.title, after.title, after.id }) do params[#params + 1] = value end
    end
    local limit = clamp_limit(options.limit, 200, 1000)
    params[#params + 1] = limit + 1
    local rows, err = query(db, "SELECT * FROM chestor_graph_types WHERE " .. table.concat(wheres, " AND ") .. " ORDER BY kind ASC, title ASC, id ASC LIMIT ?", params)
    if err then return nil, err end
    local next_cursor: string? = nil
    if #rows > limit then
        table.remove(rows)
        next_cursor = encode_type_cursor(rows[#rows])
    end
    local out = {}
    for _, row in ipairs(rows) do out[#out + 1] = decode_type_row(row) end
    return out, nil, next_cursor
end

function M.raw_state(db: any, graph_id: string): (any?, error?)
    local defaults = {}
    for k, v in pairs(types.DEFAULT_SETTINGS) do defaults[k] = v end
    local state: any = {
        nodes = {},
        edges = {},
        materials = {},
        node_types = {},
        edge_types = {},
        material_types = {},
        child_order = {},
        edge_order = {},
        material_order = {},
        layout = {},
        viewport = nil,
        settings = defaults,
    }

    local rows, err = query(db, "SELECT * FROM chestor_graph_nodes WHERE graph_id = ? ORDER BY sort_order ASC, created_at ASC, id ASC", { graph_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        local id = tostring(r.id or "")
        local node: any = {
            id = id,
            type = r.type,
            name = r.name,
            description = r.description,
            parent_id = r.parent_id,
            properties = decode(r.properties, {}),
            tags = decode(r.tags, {}),
            status = r.status,
            sort_order = tonumber(r.sort_order) or 0,
        }
        state.nodes[id] = node
        state.child_order[tostring(node.parent_id or "")] = append_unique(state.child_order[tostring(node.parent_id or "")], id)
    end

    rows, err = query(db, "SELECT * FROM chestor_graph_edges WHERE graph_id = ? ORDER BY sort_order ASC, created_at ASC, id ASC", { graph_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        local id = tostring(r.id or "")
        state.edges[id] = {
            id = id,
            type = r.type,
            source_id = r.source_id,
            target_id = r.target_id,
            label = r.label,
            properties = decode(r.properties, {}),
            status = r.status,
            sort_order = tonumber(r.sort_order) or 0,
        }
        state.edge_order = append_unique(state.edge_order, id)
    end

    rows, err = query(db, "SELECT * FROM chestor_graph_types WHERE graph_id = ? ORDER BY kind ASC, title ASC, id ASC", { graph_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        local def: any = decode(r.definition, {})
        def.id = def.id or r.id
        def.title = def.title or r.title
        if r.kind == "node" then state.node_types[tostring(r.id)] = def
        elseif r.kind == "edge" then state.edge_types[tostring(r.id)] = def
        elseif r.kind == "material" then state.material_types[tostring(r.id)] = def end
    end

    rows, err = query(db, "SELECT * FROM chestor_graph_materials WHERE graph_id = ? ORDER BY sort_order ASC, created_at ASC, id ASC", { graph_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        local id = tostring(r.id or "")
        local target_type = tostring(r.target_type or "graph")
        local target_id = material_target_id(target_type, r.target_id)
        state.materials[id] = {
            id = id,
            target_type = target_type,
            target_id = target_id,
            kind = r.kind,
            title = r.title,
            summary = r.summary,
            source = decode(r.source, {}),
            meta = decode(r.meta, {}),
            sort_order = tonumber(r.sort_order) or 0,
        }
        local key = target_key(target_type, target_id)
        state.material_order[key] = append_unique(state.material_order[key], id)
    end

    rows, err = query(db, "SELECT * FROM chestor_graph_layout WHERE graph_id = ? ORDER BY node_id ASC", { graph_id })
    if err then return nil, err end
    for _, row in ipairs(rows) do
        local r: any = row
        local meta: any = decode(r.meta, {})
        if tostring(r.node_id or "") == types.VIEWPORT_NODE_ID then
            state.viewport = { root_id = meta.root_id, x = tonumber(r.x) or 0, y = tonumber(r.y) or 0, zoom = tonumber(meta.zoom) or 1 }
        else
            state.layout[tostring(r.node_id or "")] = {
                x = tonumber(r.x) or 0,
                y = tonumber(r.y) or 0,
                width = tonumber(r.width),
                height = tonumber(r.height),
                pinned = r.pinned == true or tonumber(r.pinned) == 1,
                meta = meta,
            }
        end
    end

    rows, err = query(db, "SELECT settings FROM chestor_graph_settings WHERE graph_id = ?", { graph_id })
    if err then return nil, err end
    if type(rows) == "table" and #rows > 0 then
        local stored = decode((rows[1] :: any).settings, {})
        for k, v in pairs(stored) do state.settings[k] = v end
    end
    return state, nil
end

function M.table_counts(db: any, graph_id: string): (any?, error?)
    local counts: any = {}
    for key, table_name in pairs({
        nodes = "chestor_graph_nodes",
        edges = "chestor_graph_edges",
        materials = "chestor_graph_materials",
        types = "chestor_graph_types",
        layout = "chestor_graph_layout",
    }) do
        local rows, err = query(db, "SELECT COUNT(*) AS count FROM " .. table_name .. " WHERE graph_id = ?", { graph_id })
        if err then return nil, err end
        counts[key] = tonumber(rows[1] and rows[1].count) or 0
    end
    return counts, nil
end

return M

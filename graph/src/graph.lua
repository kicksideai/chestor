-- Chestor Graph is a canonical component: component row owns identity/access,
-- one component-owned thread owns durable graph facts, and one declared projection
-- materializes normalized graph tables for scalable reads.

local contract = require("contract")
local crypto = require("crypto")
local registry = require("registry")
local json = require("json")
local security = require("security")
local types = require("types")
local materializer = require("materializer")

local M = {}

M.EVENT = types.EVENT

local _events = nil

local function str(v: any): string
    return tostring(v or "")
end

local function is_non_empty_string(v: any): boolean
    return type(v) == "string" and v ~= ""
end

local function copy_array(v: any): { any }
    local out: { any } = {}
    if type(v) ~= "table" then return out end
    for i, item in ipairs(v :: { any }) do out[i] = item end
    return out
end

local function copy_map(v: any): { [string]: any }
    local out = {}
    if type(v) ~= "table" then return out end
    for k, item in pairs(v :: { [string]: any }) do out[k] = item end
    return out
end

local function copy_tree(v: any): any
    if type(v) ~= "table" then return v end
    local out = {}
    for k, item in pairs(v :: { [any]: any }) do out[k] = copy_tree(item) end
    return out
end

local function has_value(list: any, value: string): boolean
    if type(list) ~= "table" then return false end
    for _, v in ipairs(list :: { any }) do
        if tostring(v) == value then return true end
    end
    return false
end

local function append_unique(list: any, value: string): { any }
    local out: { any } = type(list) == "table" and (list :: { any }) or {}
    if not has_value(out, value) then out[#out + 1] = value end
    return out
end

local function remove_value(list: any, value: string): { any }
    local out: { any } = {}
    if type(list) ~= "table" then return out end
    for _, v in ipairs(list :: { any }) do
        if tostring(v) ~= value then out[#out + 1] = v end
    end
    return out
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

local function normalize_node(p: any, previous: any): any
    local node = type(previous) == "table" and copy_map(previous) or {}
    node.id = p.id
    if p.type ~= nil then node.type = p.type end
    if p.name ~= nil then node.name = p.name end
    if p.description ~= nil then node.description = p.description end
    if p.parent_id ~= nil then node.parent_id = parent_id_value(p.parent_id) end
    if p.properties ~= nil then node.properties = copy_map(p.properties) end
    if p.tags ~= nil then node.tags = copy_array(p.tags) end
    if p.status ~= nil then node.status = p.status end
    if p.sort_order ~= nil then node.sort_order = p.sort_order end
    if node.properties == nil then node.properties = {} end
    if node.tags == nil then node.tags = {} end
    return node
end

local function normalize_edge(p: any, previous: any): any
    local edge = type(previous) == "table" and copy_map(previous) or {}
    edge.id = p.id
    if p.type ~= nil then edge.type = p.type end
    if p.source_id ~= nil then edge.source_id = p.source_id end
    if p.target_id ~= nil then edge.target_id = p.target_id end
    if p.label ~= nil then edge.label = p.label end
    if p.properties ~= nil then edge.properties = copy_map(p.properties) end
    if p.status ~= nil then edge.status = p.status end
    if edge.properties == nil then edge.properties = {} end
    return edge
end

local function normalize_material(p: any, previous: any): any
    local material = type(previous) == "table" and copy_map(previous) or {}
    material.id = p.id
    if p.target_type ~= nil then material.target_type = p.target_type end
    if p.target_id ~= nil then material.target_id = p.target_id end
    material.target_id = material_target_id(material.target_type, material.target_id)
    if p.kind ~= nil then material.kind = p.kind end
    if p.title ~= nil then material.title = p.title end
    if p.summary ~= nil then material.summary = p.summary end
    if p.source ~= nil then material.source = copy_map(p.source) end
    if p.meta ~= nil then material.meta = copy_map(p.meta) end
    if p.sort_order ~= nil then material.sort_order = p.sort_order end
    if material.source == nil then material.source = {} end
    if material.meta == nil then material.meta = {} end
    return material
end

local function merge_patch(existing: any, patch: any): any
    local out = type(existing) == "table" and copy_map(existing) or {}
    if type(patch) ~= "table" then return out end
    for k, v in pairs(patch :: { [string]: any }) do out[k] = v end
    return out
end

local function seed(raw: any): any
    raw = type(raw) == "table" and raw or {}
    local empty = M.empty_state()
    for k, v in pairs(empty) do
        if raw[k] == nil then raw[k] = v end
    end
    return raw
end

local function remove_material_from_target(state: any, material: any)
    if type(material) ~= "table" then return end
    local key = target_key(tostring(material.target_type or ""), material.target_id)
    state.material_order[key] = remove_value(state.material_order[key], tostring(material.id or ""))
end

local function collect_descendants(state: any, root_id: string, removed: { [string]: boolean })
    if removed[root_id] then return end
    removed[root_id] = true
    for id, node in pairs(state.nodes :: { [string]: any }) do
        if type(node) == "table" and tostring((node :: any).parent_id or "") == root_id then
            collect_descendants(state, tostring(id), removed)
        end
    end
end

local function remove_nodes(state: any, root_id: string)
    local removed = {}
    collect_descendants(state, root_id, removed)

    for id in pairs(removed) do
        local node = state.nodes[id]
        if type(node) == "table" then
            local parent_key = tostring((node :: any).parent_id or "")
            state.child_order[parent_key] = remove_value(state.child_order[parent_key], id)
        end
        state.nodes[id] = nil
        state.layout[id] = nil
        state.material_order[target_key("node", id)] = nil
    end

    local removed_edges = {}
    for id, edge in pairs(state.edges :: { [string]: any }) do
        if type(edge) == "table" and (removed[tostring((edge :: any).source_id or "")] or removed[tostring((edge :: any).target_id or "")]) then
            removed_edges[tostring(id)] = true
        end
    end
    for id in pairs(removed_edges) do
        state.edges[id] = nil
        state.edge_order = remove_value(state.edge_order, id)
        state.material_order[target_key("edge", id)] = nil
    end

    local kept_materials = {}
    for id, material in pairs(state.materials :: { [string]: any }) do
        if type(material) == "table" then
            local mt = tostring((material :: any).target_type or "")
            local mid = tostring((material :: any).target_id or "")
            if not ((mt == "node" and (removed[mid] or state.nodes[mid] == nil)) or (mt == "edge" and (removed_edges[mid] or state.edges[mid] == nil))) then
                kept_materials[tostring(id)] = material
            end
        else
            kept_materials[tostring(id)] = material
        end
    end
    state.materials = kept_materials
end

local function apply_event(state: any, kind: string, p: any)
    local E = M.EVENT
    state = seed(state)
    p = type(p) == "table" and p or {}

    if kind == E.NODE_ADDED then
        local prior = state.nodes[p.id]
        local old_parent = type(prior) == "table" and tostring((prior :: any).parent_id or "") or ""
        local node = normalize_node(p, prior)
        local new_parent = tostring(node.parent_id or "")
        state.nodes[p.id] = node
        state.child_order[old_parent] = remove_value(state.child_order[old_parent], tostring(p.id))
        state.child_order[new_parent] = append_unique(state.child_order[new_parent], tostring(p.id))
    elseif kind == E.NODE_UPDATED then
        local prior = state.nodes[p.id]
        if prior then
            local old_parent = tostring((prior :: any).parent_id or "")
            local node = normalize_node(p, prior)
            local new_parent = tostring(node.parent_id or "")
            state.nodes[p.id] = node
            if old_parent ~= new_parent then
                state.child_order[old_parent] = remove_value(state.child_order[old_parent], tostring(p.id))
                state.child_order[new_parent] = append_unique(state.child_order[new_parent], tostring(p.id))
            end
        end
    elseif kind == E.NODE_REMOVED then
        remove_nodes(state, tostring(p.id or ""))
    elseif kind == E.EDGE_ADDED then
        state.edges[p.id] = normalize_edge(p, state.edges[p.id])
        state.edge_order = append_unique(state.edge_order, tostring(p.id))
    elseif kind == E.EDGE_UPDATED then
        if state.edges[p.id] then state.edges[p.id] = normalize_edge(p, state.edges[p.id]) end
    elseif kind == E.EDGE_REMOVED then
        local id = tostring(p.id or "")
        state.edges[id] = nil
        state.edge_order = remove_value(state.edge_order, id)
        state.material_order[target_key("edge", id)] = nil
        for mid, material in pairs(state.materials :: { [string]: any }) do
            if type(material) == "table" and tostring((material :: any).target_type or "") == "edge" and tostring((material :: any).target_id or "") == id then
                state.materials[tostring(mid)] = nil
            end
        end
    elseif kind == E.MATERIAL_ATTACHED then
        local prior = state.materials[p.id]
        if prior then remove_material_from_target(state, prior) end
        local material = normalize_material(p, prior)
        state.materials[p.id] = material
        state.material_order[target_key(tostring(material.target_type or ""), material.target_id)] = append_unique(state.material_order[target_key(tostring(material.target_type or ""), material.target_id)], tostring(p.id))
    elseif kind == E.MATERIAL_UPDATED then
        local prior = state.materials[p.id]
        if prior then
            remove_material_from_target(state, prior)
            local material = normalize_material(p, prior)
            state.materials[p.id] = material
            state.material_order[target_key(tostring(material.target_type or ""), material.target_id)] = append_unique(state.material_order[target_key(tostring(material.target_type or ""), material.target_id)], tostring(p.id))
        end
    elseif kind == E.MATERIAL_DETACHED then
        local prior = state.materials[p.id]
        remove_material_from_target(state, prior)
        state.materials[tostring(p.id or "")] = nil
    elseif kind == E.NODE_TYPE_REGISTERED or kind == E.NODE_TYPE_UPDATED then
        state.node_types[p.id] = merge_patch(state.node_types[p.id], p)
    elseif kind == E.NODE_TYPE_REMOVED then
        state.node_types[tostring(p.id or "")] = nil
    elseif kind == E.EDGE_TYPE_REGISTERED or kind == E.EDGE_TYPE_UPDATED then
        state.edge_types[p.id] = merge_patch(state.edge_types[p.id], p)
    elseif kind == E.EDGE_TYPE_REMOVED then
        state.edge_types[tostring(p.id or "")] = nil
    elseif kind == E.MATERIAL_TYPE_REGISTERED or kind == E.MATERIAL_TYPE_UPDATED then
        state.material_types[p.id] = merge_patch(state.material_types[p.id], p)
    elseif kind == E.MATERIAL_TYPE_REMOVED then
        state.material_types[tostring(p.id or "")] = nil
    elseif kind == E.LAYOUT_POSITION_SET then
        state.layout[p.node_id] = {
            x = tonumber(p.x) or 0,
            y = tonumber(p.y) or 0,
            width = tonumber(p.width),
            height = tonumber(p.height),
            pinned = p.pinned == true,
            meta = copy_map(p.meta),
        }
    elseif kind == E.LAYOUT_POSITION_CLEARED then
        state.layout[tostring(p.node_id or "")] = nil
    elseif kind == E.LAYOUT_VIEWPORT_SET then
        state.viewport = { root_id = p.root_id, x = tonumber(p.x) or 0, y = tonumber(p.y) or 0, zoom = tonumber(p.zoom) or 1 }
    elseif kind == E.GRAPH_SETTINGS_UPDATED then
        state.settings = merge_patch(state.settings, p.settings or p)
    end
end

function M.events()
    if _events then return _events end
    local event_shapes = {}
    local entry = registry.get(types.GRAPH_IMPL)
    local meta = entry and ((entry :: any).meta or ((entry :: any).data and (entry :: any).data.meta)) or {}
    local events = type(meta) == "table" and (meta :: any).events or nil
    local output = type(events) == "table" and (events :: any).output or nil
    if type(output) == "table" then
        for _, e in ipairs(output :: { any }) do
            if type(e) == "table" and is_non_empty_string((e :: any).type) then
                event_shapes[(e :: any).type] = type((e :: any).schema) == "table" and (e :: any).schema or {}
            end
        end
    end
    _events = event_shapes
    return event_shapes
end

local function threads(): (any?, error?)
    local def, err = contract.get(types.THREADS)
    if not def then return nil, err end
    local actor = security.actor()
    local scope = security.scope()
    local c, oerr = def:with_actor(actor):with_scope(scope):open()
    if not c then return nil, oerr end
    return c, nil
end

local function thread_id_for(c: any, entry_id: string): (string?, error?)
    if not is_non_empty_string(entry_id) then return nil, errors.new({ kind = errors.INVALID, message = "entry_id is required" }) end
    local found, err = c:find({ thread_id = entry_id })
    if err then return nil, err end
    if not found then return nil, errors.new({ kind = errors.NOT_FOUND, message = "graph thread not found: " .. entry_id }) end
    return entry_id, nil
end

function M.empty_state()
    return {
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
        settings = copy_map(types.DEFAULT_SETTINGS),
    }
end

function M.fold_into(state: any, events: any): any
    state = seed(state)
    for _, e in ipairs(type(events) == "table" and events or {}) do
        local body = (e :: any).body
        if type(body) == "string" then body = json.decode(body :: string) end
        if type(body) == "table" then apply_event(state, tostring((e :: any).type), body) end
    end
    return state
end

local function sorted_values(map: any, order: any): { any }
    local out: { any } = {}
    local seen = {}
    if type(order) == "table" then
        for _, id in ipairs(order :: { any }) do
            local key = tostring(id)
            if type(map) == "table" and (map :: any)[key] then
                out[#out + 1] = (map :: any)[key]
                seen[key] = true
            end
        end
    end
    if type(map) == "table" then
        for id, v in pairs(map :: { [string]: any }) do
            if not seen[tostring(id)] then out[#out + 1] = v end
        end
    end
    table.sort(out, function(a, b)
        local ao = tonumber(type(a) == "table" and (a :: any).sort_order) or 0
        local bo = tonumber(type(b) == "table" and (b :: any).sort_order) or 0
        if ao ~= bo then return ao < bo end
        return str(type(a) == "table" and ((a :: any).name or (a :: any).title or (a :: any).id)) < str(type(b) == "table" and ((b :: any).name or (b :: any).title or (b :: any).id))
    end)
    return out
end

local function material_list(state: any, target_type: string, target_id: any): { any }
    local ids = state.material_order[target_key(target_type, target_id)]
    if type(ids) ~= "table" then return {} end
    local out: { any } = {}
    for _, id in ipairs(ids :: { any }) do
        local key = tostring(id)
        if type(state.materials) == "table" and state.materials[key] then out[#out + 1] = state.materials[key] end
    end
    table.sort(out, function(a, b)
        local ao = tonumber(type(a) == "table" and (a :: any).sort_order) or 0
        local bo = tonumber(type(b) == "table" and (b :: any).sort_order) or 0
        if ao ~= bo then return ao < bo end
        return str(type(a) == "table" and ((a :: any).title or (a :: any).id)) < str(type(b) == "table" and ((b :: any).title or (b :: any).id))
    end)
    return out
end

local function build_node(state: any, id: string): any
    local node = copy_map(state.nodes[id])
    node.layout = state.layout[id]
    node.materials = material_list(state, "node", id)
    local child_ids = state.child_order[id]
    local children = {}
    if type(child_ids) == "table" then
        for _, child_id in ipairs(child_ids :: { any }) do
            local cid = tostring(child_id)
            if state.nodes[cid] then children[#children + 1] = build_node(state, cid) end
        end
    end
    node.children = children
    node.child_count = #children
    return node
end

function M.build(state: any): any
    state = seed(state)
    local roots = {}
    local root_ids = state.child_order[""]
    if type(root_ids) == "table" then
        for _, id in ipairs(root_ids :: { any }) do
            local sid = tostring(id)
            if state.nodes[sid] then roots[#roots + 1] = build_node(state, sid) end
        end
    end
    local seen = {}
    for _, n in ipairs(roots) do seen[tostring((n :: any).id)] = true end
    for id, node in pairs(state.nodes :: { [string]: any }) do
        if type(node) == "table" and not seen[tostring(id)] and not is_non_empty_string((node :: any).parent_id) then
            roots[#roots + 1] = build_node(state, tostring(id))
        end
    end

    local edges = sorted_values(state.edges, state.edge_order)
    for _, edge in ipairs(edges) do
        if type(edge) == "table" then
            (edge :: any).materials = material_list(state, "edge", (edge :: any).id)
        end
    end

    return {
        nodes = roots,
        edges = edges,
        materials = material_list(state, "graph", nil),
        schema = {
            node_types = sorted_values(state.node_types, nil),
            edge_types = sorted_values(state.edge_types, nil),
            material_types = sorted_values(state.material_types, nil),
        },
        layout = {
            positions = state.layout,
            viewport = state.viewport or { x = 0, y = 0, zoom = 1 },
        },
        settings = state.settings or {},
        counts = {
            nodes = #sorted_values(state.nodes, nil),
            edges = #sorted_values(state.edges, state.edge_order),
            materials = #sorted_values(state.materials, nil),
        },
    }
end

-- Command validation is stateful: a later command may reference facts created by
-- an earlier committed command. Bring the command-side validation snapshot to the
-- thread head before accepting a new batch. Public reads and post-write responses
-- never drive the projection; the background runner remains the sole read-model
-- materializer after append.
local function prepare_command_state(c: any, tid: string): error?
    local result, err = c:catch_up_projection({
        thread_id = tid,
        kind = types.PROJECTION_KIND,
        max_ticks = 1000,
    })
    if err then return err end
    if type(result) ~= "table" then
        return errors.new({ kind = errors.INTERNAL, message = "graph command state preparation returned no result" })
    end
    local last_seq = tonumber((result :: any).last_seq) or 0
    local target_seq = tonumber((result :: any).target_seq) or tonumber((result :: any).event_count) or 0
    if last_seq < target_seq then
        return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "graph command state is not ready"
            .. ": last_seq=" .. tostring(last_seq)
            .. " target_seq=" .. tostring(target_seq)
            .. " reason=" .. tostring((result :: any).reason or (result :: any).error or "") })
    end
    return nil
end

local function read_raw(tid: string): (any?, error?)
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local raw, err = materializer.raw_state(db, tid)
    db:release()
    return raw, err
end

local function read_materialized(entry_id: string, result_key: string, reader: (any, string) -> (any?, error?, string?)): (any?, error?)
    local c, err = threads()
    if not c then return nil, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then return nil, terr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local value, rerr, next_cursor = reader(db, tid)
    db:release()
    if rerr then return nil, rerr end
    local out: any = {
        entry_id = entry_id,
        thread_id = tid,
    }
    out[result_key] = value
    out.next_cursor = next_cursor
    return out, nil
end

local function history_id(): (string?, error?)
    local id, err = crypto.random.uuid()
    if err then return nil, err end
    return tostring(id), nil
end

local function event(kind: string, body: any): any
    return { type = kind, body = body or {} }
end

local function full_node_body(node: any): any
    return {
        id = node.id,
        type = node.type,
        name = node.name,
        description = node.description,
        parent_id = node.parent_id or false,
        properties = copy_map(node.properties),
        tags = copy_array(node.tags),
        status = node.status,
        sort_order = node.sort_order,
    }
end

local function full_edge_body(edge: any): any
    return {
        id = edge.id,
        type = edge.type,
        source_id = edge.source_id,
        target_id = edge.target_id,
        label = edge.label,
        properties = copy_map(edge.properties),
        status = edge.status,
        sort_order = edge.sort_order,
    }
end

local function full_material_body(material: any): any
    return {
        id = material.id,
        target_type = material.target_type,
        target_id = material.target_id,
        kind = material.kind,
        title = material.title,
        summary = material.summary,
        source = copy_map(material.source),
        meta = copy_map(material.meta),
        sort_order = material.sort_order,
    }
end

local function inverse_attach_materials_for(raw: any, target_type: string, target_id: any, out: { any })
    for _, material in pairs(type(raw.materials) == "table" and raw.materials or {}) do
        if type(material) == "table"
            and tostring((material :: any).target_type or "") == target_type
            and tostring((material :: any).target_id or "") == tostring(target_id or "") then
            out[#out + 1] = event(M.EVENT.MATERIAL_ATTACHED, full_material_body(material))
        end
    end
end

local function inverse_recreate_node_tree(raw: any, node_id: string, out: { any }, recreated: { [string]: boolean })
    if recreated[node_id] then return end
    local node = type(raw.nodes) == "table" and raw.nodes[node_id] or nil
    if type(node) ~= "table" then return end
    recreated[node_id] = true
    out[#out + 1] = event(M.EVENT.NODE_ADDED, full_node_body(node))
    local layout = type(raw.layout) == "table" and raw.layout[node_id] or nil
    if type(layout) == "table" then
        local p = copy_map(layout)
        p.node_id = node_id
        out[#out + 1] = event(M.EVENT.LAYOUT_POSITION_SET, p)
    end
    inverse_attach_materials_for(raw, "node", node_id, out)
    for child_id, child in pairs(type(raw.nodes) == "table" and raw.nodes or {}) do
        if type(child) == "table" and tostring((child :: any).parent_id or "") == node_id then
            inverse_recreate_node_tree(raw, tostring(child_id), out, recreated)
        end
    end
end

local function inverse_recreate_removed_node(raw: any, node_id: string, out: { any })
    local removed: { [string]: boolean } = {}
    collect_descendants(raw, node_id, removed)
    local recreated: { [string]: boolean } = {}
    inverse_recreate_node_tree(raw, node_id, out, recreated)
    for _, edge in pairs(type(raw.edges) == "table" and raw.edges or {}) do
        if type(edge) == "table"
            and (removed[tostring((edge :: any).source_id or "")] or removed[tostring((edge :: any).target_id or "")]) then
            out[#out + 1] = event(M.EVENT.EDGE_ADDED, full_edge_body(edge))
            inverse_attach_materials_for(raw, "edge", (edge :: any).id, out)
        end
    end
end

local function type_body(raw: any, kind: string, id: string): any
    local map = kind == "node" and raw.node_types or (kind == "edge" and raw.edge_types or raw.material_types)
    local value = type(map) == "table" and map[id] or nil
    return type(value) == "table" and copy_map(value) or nil
end

local function build_inverse(raw: any, events: any): { any }
    local inverse: { any } = {}
    raw = seed(raw)
    for i = #(events :: { any }), 1, -1 do
        local item = (events :: { any })[i]
        local kind = tostring((item :: any).type or "")
        local p = type((item :: any).body) == "table" and (item :: any).body or {}
        local E = M.EVENT
        if kind == E.NODE_ADDED then
            inverse[#inverse + 1] = event(E.NODE_REMOVED, { id = p.id })
        elseif kind == E.NODE_UPDATED then
            local node = raw.nodes[tostring(p.id or "")]
            if type(node) == "table" then inverse[#inverse + 1] = event(E.NODE_UPDATED, full_node_body(node)) end
        elseif kind == E.NODE_REMOVED then
            inverse_recreate_removed_node(raw, tostring(p.id or ""), inverse)
        elseif kind == E.EDGE_ADDED then
            inverse[#inverse + 1] = event(E.EDGE_REMOVED, { id = p.id })
        elseif kind == E.EDGE_UPDATED then
            local edge = raw.edges[tostring(p.id or "")]
            if type(edge) == "table" then inverse[#inverse + 1] = event(E.EDGE_UPDATED, full_edge_body(edge)) end
        elseif kind == E.EDGE_REMOVED then
            local edge = raw.edges[tostring(p.id or "")]
            if type(edge) == "table" then
                inverse[#inverse + 1] = event(E.EDGE_ADDED, full_edge_body(edge))
                inverse_attach_materials_for(raw, "edge", (edge :: any).id, inverse)
            end
        elseif kind == E.MATERIAL_ATTACHED then
            inverse[#inverse + 1] = event(E.MATERIAL_DETACHED, { id = p.id })
        elseif kind == E.MATERIAL_UPDATED then
            local material = raw.materials[tostring(p.id or "")]
            if type(material) == "table" then
                inverse[#inverse + 1] = event(E.MATERIAL_DETACHED, { id = p.id })
                inverse[#inverse + 1] = event(E.MATERIAL_ATTACHED, full_material_body(material))
            end
        elseif kind == E.MATERIAL_DETACHED then
            local material = raw.materials[tostring(p.id or "")]
            if type(material) == "table" then inverse[#inverse + 1] = event(E.MATERIAL_ATTACHED, full_material_body(material)) end
        elseif kind == E.NODE_TYPE_REGISTERED or kind == E.NODE_TYPE_UPDATED then
            local prior = type_body(raw, "node", tostring(p.id or ""))
            inverse[#inverse + 1] = prior and event(E.NODE_TYPE_UPDATED, prior) or event(E.NODE_TYPE_REMOVED, { id = p.id })
        elseif kind == E.NODE_TYPE_REMOVED then
            local prior = type_body(raw, "node", tostring(p.id or ""))
            if prior then inverse[#inverse + 1] = event(E.NODE_TYPE_REGISTERED, prior) end
        elseif kind == E.EDGE_TYPE_REGISTERED or kind == E.EDGE_TYPE_UPDATED then
            local prior = type_body(raw, "edge", tostring(p.id or ""))
            inverse[#inverse + 1] = prior and event(E.EDGE_TYPE_UPDATED, prior) or event(E.EDGE_TYPE_REMOVED, { id = p.id })
        elseif kind == E.EDGE_TYPE_REMOVED then
            local prior = type_body(raw, "edge", tostring(p.id or ""))
            if prior then inverse[#inverse + 1] = event(E.EDGE_TYPE_REGISTERED, prior) end
        elseif kind == E.MATERIAL_TYPE_REGISTERED or kind == E.MATERIAL_TYPE_UPDATED then
            local prior = type_body(raw, "material", tostring(p.id or ""))
            inverse[#inverse + 1] = prior and event(E.MATERIAL_TYPE_UPDATED, prior) or event(E.MATERIAL_TYPE_REMOVED, { id = p.id })
        elseif kind == E.MATERIAL_TYPE_REMOVED then
            local prior = type_body(raw, "material", tostring(p.id or ""))
            if prior then inverse[#inverse + 1] = event(E.MATERIAL_TYPE_REGISTERED, prior) end
        elseif kind == E.LAYOUT_POSITION_SET then
            local prior = raw.layout[tostring(p.node_id or "")]
            if type(prior) == "table" then
                local body = copy_map(prior)
                body.node_id = p.node_id
                inverse[#inverse + 1] = event(E.LAYOUT_POSITION_SET, body)
            else
                inverse[#inverse + 1] = event(E.LAYOUT_POSITION_CLEARED, { node_id = p.node_id })
            end
        elseif kind == E.LAYOUT_POSITION_CLEARED then
            local prior = raw.layout[tostring(p.node_id or "")]
            if type(prior) == "table" then
                local body = copy_map(prior)
                body.node_id = p.node_id
                inverse[#inverse + 1] = event(E.LAYOUT_POSITION_SET, body)
            end
        elseif kind == E.LAYOUT_VIEWPORT_SET and type(raw.viewport) == "table" then
            inverse[#inverse + 1] = event(E.LAYOUT_VIEWPORT_SET, raw.viewport)
        elseif kind == E.LAYOUT_VIEWPORT_SET then
            inverse[#inverse + 1] = event(E.LAYOUT_VIEWPORT_SET, { x = 0, y = 0, zoom = 1 })
        elseif kind == E.GRAPH_SETTINGS_UPDATED then
            inverse[#inverse + 1] = event(E.GRAPH_SETTINGS_UPDATED, { settings = copy_map(raw.settings) })
        end
    end
    return inverse
end

local function history_flags(tid: string): (boolean, boolean, error?)
    local db, db_err = materializer.open_db()
    if not db then return false, false, db_err end
    local undo, uerr = materializer.peek_history(db, tid, "undo")
    if uerr then db:release(); return false, false, uerr end
    local redo, rerr = materializer.peek_history(db, tid, "redo")
    db:release()
    if rerr then return false, false, rerr end
    return undo ~= nil, redo ~= nil, nil
end

local function attach_history_flags(graph: any, tid: string): error?
    local can_undo, can_redo, err = history_flags(tid)
    if err then return err end
    graph.can_undo = can_undo
    graph.can_redo = can_redo
    return nil
end

local function node_exists(state: any, id: any): boolean
    return is_non_empty_string(id) and state.nodes[id] ~= nil
end

local function edge_exists(state: any, id: any): boolean
    return is_non_empty_string(id) and state.edges[id] ~= nil
end

local function type_map(state: any, kind: string): any
    if kind == "node" then return state.node_types end
    if kind == "edge" then return state.edge_types end
    return state.material_types
end

local function type_exists(state: any, kind: string, id: any): boolean
    local map = type_map(state, kind)
    return is_non_empty_string(id) and type(map) == "table" and map[id] ~= nil
end

local function would_cycle(state: any, id: string, parent_id: string): boolean
    local cursor = parent_id
    while cursor ~= "" do
        if cursor == id then return true end
        local parent = state.nodes[cursor]
        if type(parent) ~= "table" then return false end
        cursor = tostring((parent :: any).parent_id or "")
    end
    return false
end

local function validate_target(state: any, target_type: any, target_id: any): string?
    if target_type == "graph" then return nil end
    if target_type == "node" and node_exists(state, target_id) then return nil end
    if target_type == "edge" and edge_exists(state, target_id) then return nil end
    return "unknown material target: " .. tostring(target_type) .. ":" .. tostring(target_id)
end

function M.validate_command(state: any, kind: string, p: any): string?
    state = seed(state)
    p = type(p) == "table" and p or {}
    local E = M.EVENT

    if kind == E.NODE_ADDED or kind == E.NODE_UPDATED then
        if not is_non_empty_string(p.id) then return "node id required" end
        if kind == E.NODE_ADDED and not is_non_empty_string(p.name) then return "node name required" end
        if kind == E.NODE_UPDATED and p.name ~= nil and not is_non_empty_string(p.name) then return "node name required" end
        if kind == E.NODE_ADDED and node_exists(state, p.id) then return "node already exists: " .. tostring(p.id) end
        if kind == E.NODE_UPDATED and not node_exists(state, p.id) then return "node not found: " .. tostring(p.id) end
        local parent_id = p.parent_id
        if parent_id == false or parent_id == "" then parent_id = nil end
        if is_non_empty_string(parent_id) then
            if not node_exists(state, parent_id) then return "parent node not found: " .. tostring(parent_id) end
            if would_cycle(state, tostring(p.id), tostring(parent_id)) then return "node parent cycle refused" end
        end
    elseif kind == E.NODE_REMOVED then
        if not node_exists(state, p.id) then return "node not found: " .. tostring(p.id) end
    elseif kind == E.EDGE_ADDED or kind == E.EDGE_UPDATED then
        if not is_non_empty_string(p.id) then return "edge id required" end
        if kind == E.EDGE_ADDED and not is_non_empty_string(p.type) then return "edge type required" end
        if kind == E.EDGE_UPDATED and p.type ~= nil and not is_non_empty_string(p.type) then return "edge type required" end
        if kind == E.EDGE_ADDED and not is_non_empty_string(p.source_id) then return "edge source node required" end
        if kind == E.EDGE_ADDED and not is_non_empty_string(p.target_id) then return "edge target node required" end
        if kind == E.EDGE_ADDED and edge_exists(state, p.id) then return "edge already exists: " .. tostring(p.id) end
        if kind == E.EDGE_UPDATED and not edge_exists(state, p.id) then return "edge not found: " .. tostring(p.id) end
        if p.source_id ~= nil and not node_exists(state, p.source_id) then return "edge source node not found: " .. tostring(p.source_id) end
        if p.target_id ~= nil and not node_exists(state, p.target_id) then return "edge target node not found: " .. tostring(p.target_id) end
    elseif kind == E.EDGE_REMOVED then
        if not edge_exists(state, p.id) then return "edge not found: " .. tostring(p.id) end
    elseif kind == E.MATERIAL_ATTACHED then
        if not is_non_empty_string(p.id) then return "material id required" end
        if not is_non_empty_string(p.kind) then return "material kind required" end
        if type(state.materials[tostring(p.id or "")]) == "table" then return "material already exists: " .. tostring(p.id) end
        local err = validate_target(state, p.target_type, p.target_id)
        if err then return err end
    elseif kind == E.MATERIAL_UPDATED then
        if not is_non_empty_string(p.id) then return "material id required" end
        if p.kind ~= nil and not is_non_empty_string(p.kind) then return "material kind required" end
        local previous = state.materials[tostring(p.id or "")]
        if type(previous) ~= "table" then return "material not found: " .. tostring(p.id) end
        if p.target_type ~= nil or p.target_id ~= nil then
            local err = validate_target(state, p.target_type or previous.target_type, p.target_id or previous.target_id)
            if err then return err end
        end
    elseif kind == E.MATERIAL_DETACHED then
        if not is_non_empty_string(p.id) then return "material id required" end
        if type(state.materials[tostring(p.id or "")]) ~= "table" then return "material not found: " .. tostring(p.id) end
    elseif kind == E.NODE_TYPE_REGISTERED or kind == E.NODE_TYPE_UPDATED or kind == E.EDGE_TYPE_REGISTERED or kind == E.EDGE_TYPE_UPDATED or kind == E.MATERIAL_TYPE_REGISTERED or kind == E.MATERIAL_TYPE_UPDATED then
        if not is_non_empty_string(p.id) then return "type id required" end
        if kind:find("%.registered$", 1, false) and not is_non_empty_string(p.title) then return "type title required" end
        if kind:find("%.updated$", 1, false) and p.title ~= nil and not is_non_empty_string(p.title) then return "type title required" end
        if kind == E.NODE_TYPE_REGISTERED and type_exists(state, "node", p.id) then return "type already exists: " .. tostring(p.id) end
        if kind == E.EDGE_TYPE_REGISTERED and type_exists(state, "edge", p.id) then return "type already exists: " .. tostring(p.id) end
        if kind == E.MATERIAL_TYPE_REGISTERED and type_exists(state, "material", p.id) then return "type already exists: " .. tostring(p.id) end
        if kind == E.NODE_TYPE_UPDATED and not type_exists(state, "node", p.id) then return "type not found: " .. tostring(p.id) end
        if kind == E.EDGE_TYPE_UPDATED and not type_exists(state, "edge", p.id) then return "type not found: " .. tostring(p.id) end
        if kind == E.MATERIAL_TYPE_UPDATED and not type_exists(state, "material", p.id) then return "type not found: " .. tostring(p.id) end
    elseif kind == E.NODE_TYPE_REMOVED or kind == E.EDGE_TYPE_REMOVED or kind == E.MATERIAL_TYPE_REMOVED then
        if not is_non_empty_string(p.id) then return "type id required" end
        if kind == E.NODE_TYPE_REMOVED and not type_exists(state, "node", p.id) then return "type not found: " .. tostring(p.id) end
        if kind == E.EDGE_TYPE_REMOVED and not type_exists(state, "edge", p.id) then return "type not found: " .. tostring(p.id) end
        if kind == E.MATERIAL_TYPE_REMOVED and not type_exists(state, "material", p.id) then return "type not found: " .. tostring(p.id) end
    elseif kind == E.LAYOUT_POSITION_SET then
        if not node_exists(state, p.node_id) then return "layout node not found: " .. tostring(p.node_id) end
    elseif kind == E.LAYOUT_POSITION_CLEARED then
        if not is_non_empty_string(p.node_id) then return "layout node id required" end
        if not node_exists(state, p.node_id) then return "layout node not found: " .. tostring(p.node_id) end
    elseif kind == E.LAYOUT_VIEWPORT_SET or kind == E.GRAPH_SETTINGS_UPDATED then
        return nil
    else
        return "unknown event type: " .. tostring(kind)
    end
    return nil
end

function M.validate_and_fold(state: any, events: any): (any?, error?)
    state = seed(state)
    for i, event in ipairs(type(events) == "table" and events or {}) do
        local kind = tostring((event :: any).type or "")
        local body = (event :: any).body or {}
        local reason = M.validate_command(state, kind, body)
        if reason then
            return nil, errors.new({ kind = errors.INVALID, message = "invalid graph event at [" .. tostring(i) .. "]: " .. reason })
        end
        apply_event(state, kind, body)
    end
    return state
end

function M.state(entry_id: string): (any?, error?)
    local c, err = threads()
    if not c then return nil, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then return nil, terr end
    local raw, rerr = read_raw(tid)
    if rerr then return nil, rerr end
    local graph = M.build(raw or M.empty_state())
    graph.entry_id = entry_id
    graph.thread_id = tid
    local herr = attach_history_flags(graph, tid)
    if herr then return nil, herr end
    return graph, nil
end

function M.nodes(entry_id: string, options: any): (any?, error?)
    return read_materialized(entry_id, "nodes", function(db: any, tid: string)
        return materializer.list_nodes(db, tid, options)
    end)
end

function M.edges(entry_id: string, options: any): (any?, error?)
    return read_materialized(entry_id, "edges", function(db: any, tid: string)
        return materializer.list_edges(db, tid, options)
    end)
end

function M.materials(entry_id: string, options: any): (any?, error?)
    return read_materialized(entry_id, "materials", function(db: any, tid: string)
        return materializer.list_materials(db, tid, options)
    end)
end

function M.schema(entry_id: string, options: any): (any?, error?)
    options = type(options) == "table" and options or {}
    local kind = (options :: any).kind
    return read_materialized(entry_id, "schema", function(db: any, tid: string)
        local rows, err, next_cursor = materializer.list_types(db, tid, options)
        if err then return nil, err end
        if kind ~= nil then return rows, nil, next_cursor end
        local grouped: any = { node_types = {}, edge_types = {}, material_types = {} }
        for _, row in ipairs(rows or {}) do
            if tostring((row :: any).kind or "") == "node" then grouped.node_types[#grouped.node_types + 1] = row
            elseif tostring((row :: any).kind or "") == "edge" then grouped.edge_types[#grouped.edge_types + 1] = row
            elseif tostring((row :: any).kind or "") == "material" then grouped.material_types[#grouped.material_types + 1] = row end
        end
        return grouped, nil, next_cursor
    end)
end

local function append_validated(entry_id: string, events: { any }): (any?, error?, string?, any?, number?)
    local c, err = threads()
    if not c then return nil, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then return nil, terr end
    local prepare_err = prepare_command_state(c, tid)
    if prepare_err then return nil, prepare_err end
    local raw, rerr = read_raw(tid)
    if rerr then return nil, rerr end
    raw = raw or M.empty_state()
    local pre_raw = copy_tree(raw)
    local next_raw, verr = M.validate_and_fold(raw, events)
    if verr then return nil, verr end

    local appended, aerr = c:append_events({ thread_id = tid, events = events })
    if aerr then return nil, aerr end
    local stack_seq = tonumber(appended and (appended :: any).max_seq)
    if not stack_seq then return nil, errors.new({ kind = errors.INTERNAL, message = "thread append did not return max_seq" }) end
    -- The projection runner owns materialization. A command request must never
    -- compete with that runner for its cursor merely to manufacture read-after-
    -- write consistency. Return the state this validated batch produces; normal
    -- reads independently serve the latest committed projection snapshot.
    local graph = M.build(next_raw)
    graph.entry_id = entry_id
    graph.thread_id = tid
    local herr = attach_history_flags(graph, tid)
    if herr then return nil, herr end
    return graph, nil, tid, pre_raw, stack_seq
end

local function normalize_commands(commands: any): ({ any }?, error?)
    if type(commands) ~= "table" or #commands == 0 then
        return nil, errors.new({ kind = errors.INVALID, message = "commands array required" })
    end
    local event_shapes = M.events()
    local events: { any } = {}
    for i, cmd in ipairs(commands :: { any }) do
        local kind = type(cmd) == "table" and (cmd :: any).type or nil
        if not event_shapes[kind] then
            return nil, errors.new({ kind = errors.INVALID, message = "unknown event type at [" .. tostring(i) .. "]: " .. tostring(kind) })
        end
        events[#events + 1] = { type = kind, body = (cmd :: any).body or {} }
    end
    return events, nil
end

function M.apply(entry_id: string, commands: any): (any?, error?)
    local events, nerr = normalize_commands(commands)
    if not events then return nil, nerr end
    local graph, err, tid, raw, stack_seq = append_validated(entry_id, events)
    if err or not graph or not tid then return nil, err end
    local inverse = build_inverse(raw or M.empty_state(), events)
    local hid, herr = history_id()
    if not hid then return nil, herr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local record_err = materializer.record_history(db, tid, hid, stack_seq :: number, events, inverse)
    db:release()
    if record_err then return nil, record_err end
    attach_history_flags(graph, tid)
    return graph
end

local function apply_history(entry_id: string, from_stack: string, to_stack: string, event_key: string): (any?, error?)
    local c, err = threads()
    if not c then return nil, err end
    local tid, terr = thread_id_for(c, entry_id)
    if not tid then return nil, terr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local row, perr = materializer.peek_history(db, tid, from_stack)
    db:release()
    if perr then return nil, perr end
    if not row then return nil, errors.new({ kind = errors.CONFLICT, message = "nothing to " .. from_stack }) end
    local events = (row :: any)[event_key]
    if type(events) ~= "table" or #events == 0 then
        return nil, errors.new({ kind = errors.INTERNAL, message = "history entry is empty" })
    end
    local graph, aerr, _, _, stack_seq = append_validated(entry_id, events :: { any })
    if aerr or not graph then return nil, aerr end
    db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local merr = materializer.move_history(db, tostring((row :: any).id or ""), to_stack, stack_seq :: number)
    db:release()
    if merr then return nil, merr end
    attach_history_flags(graph, tid)
    return graph
end

function M.undo(entry_id: string): (any?, error?)
    return apply_history(entry_id, "undo", "redo", "inverse_events")
end

function M.redo(entry_id: string): (any?, error?)
    return apply_history(entry_id, "redo", "undo", "forward_events")
end

function M.destroy(entry_id: string): (boolean?, error?)
    local c, err = threads()
    if not c then return nil, err end
    local _, perr = c:purge({ component_id = entry_id })
    if perr then return nil, perr end
    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local derr = materializer.delete_graph_rows(db, entry_id)
    db:release()
    if derr then return nil, derr end
    return true, nil
end

return M

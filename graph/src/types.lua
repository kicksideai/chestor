type Map = { [string]: any }
type Array = { any }

type GraphEventConstants = {
    NODE_ADDED: string,
    NODE_UPDATED: string,
    NODE_REMOVED: string,
    EDGE_ADDED: string,
    EDGE_UPDATED: string,
    EDGE_REMOVED: string,
    MATERIAL_ATTACHED: string,
    MATERIAL_UPDATED: string,
    MATERIAL_DETACHED: string,
    NODE_TYPE_REGISTERED: string,
    NODE_TYPE_UPDATED: string,
    NODE_TYPE_REMOVED: string,
    EDGE_TYPE_REGISTERED: string,
    EDGE_TYPE_UPDATED: string,
    EDGE_TYPE_REMOVED: string,
    MATERIAL_TYPE_REGISTERED: string,
    MATERIAL_TYPE_UPDATED: string,
    MATERIAL_TYPE_REMOVED: string,
    LAYOUT_POSITION_SET: string,
    LAYOUT_POSITION_CLEARED: string,
    LAYOUT_VIEWPORT_SET: string,
    GRAPH_SETTINGS_UPDATED: string,
}

type GraphTypes = {
    DB_CONFIG: string,
    _registry: any,
    THREADS: string,
    THREAD_CLASS: string,
    GRAPH_IMPL: string,
    PROJECTION_KIND: string,
    db_id: () -> string,
    VIEWPORT_NODE_ID: string,
    EVENT_NS: string,
    EVENT: GraphEventConstants,
    MATERIAL_TARGETS: { [string]: boolean },
    DEFAULT_SETTINGS: Map,
}

local registry = require("registry")
local EVENT_NS = "chestor.graph.events:"

local M: GraphTypes

local function resolve_db_id(): string
    local entry, err = M._registry.get(M.DB_CONFIG)
    if not err and type(entry) == "table" then
        local meta: any = (entry :: any).meta or {}
        if type(meta.db_id) == "string" and meta.db_id ~= "" then
            return meta.db_id
        end
    end
    error("chestor.graph:target_db was not bound by the host application", 2)
end

M = {
    DB_CONFIG = "chestor.graph:db_config",
    _registry = registry,
    db_id = resolve_db_id,
    THREADS = "kickside.core:threads",
    THREAD_CLASS = "workspace.graph",
    GRAPH_IMPL = "chestor.graph:graph_kind",
    PROJECTION_KIND = "chestor.graph:state",
    VIEWPORT_NODE_ID = "__viewport__",
    EVENT_NS = EVENT_NS,
    EVENT = {
        NODE_ADDED = EVENT_NS .. "node.added",
        NODE_UPDATED = EVENT_NS .. "node.updated",
        NODE_REMOVED = EVENT_NS .. "node.removed",
        EDGE_ADDED = EVENT_NS .. "edge.added",
        EDGE_UPDATED = EVENT_NS .. "edge.updated",
        EDGE_REMOVED = EVENT_NS .. "edge.removed",
        MATERIAL_ATTACHED = EVENT_NS .. "material.attached",
        MATERIAL_UPDATED = EVENT_NS .. "material.updated",
        MATERIAL_DETACHED = EVENT_NS .. "material.detached",
        NODE_TYPE_REGISTERED = EVENT_NS .. "node-type.registered",
        NODE_TYPE_UPDATED = EVENT_NS .. "node-type.updated",
        NODE_TYPE_REMOVED = EVENT_NS .. "node-type.removed",
        EDGE_TYPE_REGISTERED = EVENT_NS .. "edge-type.registered",
        EDGE_TYPE_UPDATED = EVENT_NS .. "edge-type.updated",
        EDGE_TYPE_REMOVED = EVENT_NS .. "edge-type.removed",
        MATERIAL_TYPE_REGISTERED = EVENT_NS .. "material-type.registered",
        MATERIAL_TYPE_UPDATED = EVENT_NS .. "material-type.updated",
        MATERIAL_TYPE_REMOVED = EVENT_NS .. "material-type.removed",
        LAYOUT_POSITION_SET = EVENT_NS .. "layout.position-set",
        LAYOUT_POSITION_CLEARED = EVENT_NS .. "layout.position-cleared",
        LAYOUT_VIEWPORT_SET = EVENT_NS .. "layout.viewport-set",
        GRAPH_SETTINGS_UPDATED = EVENT_NS .. "graph.settings-updated",
    },
    MATERIAL_TARGETS = { graph = true, node = true, edge = true },
    DEFAULT_SETTINGS = {
        default_view = "canvas",
        child_render_mode = "collapsed",
        edge_routing = "smoothstep",
    },
}

return M

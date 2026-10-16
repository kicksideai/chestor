local registry = require("registry")

local EVENT_NS = "chestor.db_schema.events:"

local M = {
    DB_CONFIG = "chestor.db_schema:db_config",
    _registry = registry,
    THREADS = "kickside.core:threads",
    THREAD_CLASS = "workspace.schema",
    DB_IMPL = "chestor.db_schema:database",
    PROJECTION_KIND = "chestor.db_schema:state",
    VIEWPORT_TABLE_ID = "__viewport__",
    EVENT_NS = EVENT_NS,
    EVENT = {
        TABLE_ADDED = EVENT_NS .. "table.added",
        TABLE_UPDATED = EVENT_NS .. "table.updated",
        TABLE_REMOVED = EVENT_NS .. "table.removed",
        COLUMN_ADDED = EVENT_NS .. "column.added",
        COLUMN_UPDATED = EVENT_NS .. "column.updated",
        COLUMN_REMOVED = EVENT_NS .. "column.removed",
        COLUMNS_REORDERED = EVENT_NS .. "columns.reordered",
        RELATION_ADDED = EVENT_NS .. "relation.added",
        RELATION_UPDATED = EVENT_NS .. "relation.updated",
        RELATION_REMOVED = EVENT_NS .. "relation.removed",
        INDEX_ADDED = EVENT_NS .. "index.added",
        INDEX_UPDATED = EVENT_NS .. "index.updated",
        INDEX_REMOVED = EVENT_NS .. "index.removed",
        LAYOUT_POSITION_SET = EVENT_NS .. "layout.position-set",
        LAYOUT_POSITION_CLEARED = EVENT_NS .. "layout.position-cleared",
        LAYOUT_VIEWPORT_SET = EVENT_NS .. "layout.viewport-set",
    },
}

function M.db_id(): string
    local entry, err = M._registry.get(M.DB_CONFIG)
    if not err and type(entry) == "table" then
        local meta: any = (entry :: any).meta or {}
        if type(meta.db_id) == "string" and meta.db_id ~= "" then
            return meta.db_id
        end
    end
    error("chestor.db_schema:target_db was not bound by the host application", 2)
end

return M

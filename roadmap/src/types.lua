type Map = { [string]: any }
type Array = { any }

type RoadmapEventConstants = {
    LAYER_ADDED: string,
    LAYER_UPDATED: string,
    LAYER_REMOVED: string,
    OUTCOME_ADDED: string,
    OUTCOME_UPDATED: string,
    OUTCOME_REMOVED: string,
    INITIATIVE_ADDED: string,
    INITIATIVE_UPDATED: string,
    INITIATIVE_REMOVED: string,
    DEPENDENCY_ADDED: string,
    DEPENDENCY_UPDATED: string,
    DEPENDENCY_REMOVED: string,
    MILESTONE_ADDED: string,
    MILESTONE_UPDATED: string,
    MILESTONE_REMOVED: string,
    SETTINGS_UPDATED: string,
    LENS_STATE_SET: string,
}

type RoadmapHorizonConstants = {
    PAST: string,
    NOW: string,
    NEXT: string,
    LATER: string,
}

type RoadmapTypes = {
    DB_CONFIG: string,
    _registry: any,
    db_id: () -> string,
    THREADS: string,
    THREAD_CLASS: string,
    IMPL_ID: string,
    PROJECTION_KIND: string,
    EVENT_NS: string,
    EVENT: RoadmapEventConstants,
    STATUS: Array,
    CONFIDENCE: Array,
    SIZE: Array,
    SIZE_WEIGHT: Map,
    DEP_KIND: Array,
    PERIOD_KIND: Array,
    LENS: Array,
    HORIZON: RoadmapHorizonConstants,
    HORIZON_LATER_OFFSET: number,
    STATUS_DONE: string,
    STATUS_DROPPED: string,
    STATUS_ACTIVE: string,
    DEP_REQUIRES: string,
    PERIOD_QUARTER: string,
    PERIOD_MONTH: string,
    DEFAULTS: Map,
    DEFAULT_SETTINGS: Map,
}

local registry = require("registry")
local EVENT_NS = "chestor.roadmap.events:"

local M: RoadmapTypes

local function resolve_db_id(): string
    local entry, err = M._registry.get(M.DB_CONFIG)
    if not err and type(entry) == "table" then
        local meta: any = (entry :: any).meta or {}
        if type(meta.db_id) == "string" and meta.db_id ~= "" then
            return meta.db_id
        end
    end
    error("chestor.roadmap:target_db was not bound by the host application", 2)
end

M = {
    DB_CONFIG = "chestor.roadmap:db_config",
    _registry = registry,
    db_id = resolve_db_id,
    THREADS = "kickside.core:threads",
    THREAD_CLASS = "workspace.roadmap",
    IMPL_ID = "chestor.roadmap:roadmap_kind",
    PROJECTION_KIND = "chestor.roadmap:state",
    EVENT_NS = EVENT_NS,
    EVENT = {
        LAYER_ADDED = EVENT_NS .. "layer.added",
        LAYER_UPDATED = EVENT_NS .. "layer.updated",
        LAYER_REMOVED = EVENT_NS .. "layer.removed",
        OUTCOME_ADDED = EVENT_NS .. "outcome.added",
        OUTCOME_UPDATED = EVENT_NS .. "outcome.updated",
        OUTCOME_REMOVED = EVENT_NS .. "outcome.removed",
        INITIATIVE_ADDED = EVENT_NS .. "initiative.added",
        INITIATIVE_UPDATED = EVENT_NS .. "initiative.updated",
        INITIATIVE_REMOVED = EVENT_NS .. "initiative.removed",
        DEPENDENCY_ADDED = EVENT_NS .. "dependency.added",
        DEPENDENCY_UPDATED = EVENT_NS .. "dependency.updated",
        DEPENDENCY_REMOVED = EVENT_NS .. "dependency.removed",
        MILESTONE_ADDED = EVENT_NS .. "milestone.added",
        MILESTONE_UPDATED = EVENT_NS .. "milestone.updated",
        MILESTONE_REMOVED = EVENT_NS .. "milestone.removed",
        SETTINGS_UPDATED = EVENT_NS .. "roadmap.settings-updated",
        LENS_STATE_SET = EVENT_NS .. "roadmap.lens-state-set",
    },
    STATUS = { "idea", "planned", "active", "done", "dropped" },
    CONFIDENCE = { "low", "med", "high" },
    SIZE = { "S", "M", "L", "XL" },
    -- Relative cost of a size, used only to rank how loaded a period is; it is a
    -- planning convention, never stored on an initiative.
    SIZE_WEIGHT = { S = 1, M = 2, L = 3, XL = 5 },
    DEP_KIND = { "requires", "informs" },
    PERIOD_KIND = { "quarter", "month" },
    LENS = { "timeline", "horizons", "strata", "outcomes" },
    HORIZON = { PAST = "past", NOW = "now", NEXT = "next", LATER = "later" },
    -- An initiative starting further ahead than this many periods reads as "later";
    -- the boundary is a planning convention, so it lives beside the vocabularies.
    HORIZON_LATER_OFFSET = 2,
    STATUS_DONE = "done",
    STATUS_DROPPED = "dropped",
    STATUS_ACTIVE = "active",
    DEP_REQUIRES = "requires",
    PERIOD_QUARTER = "quarter",
    PERIOD_MONTH = "month",
    DEFAULTS = {
        status = "planned",
        confidence = "med",
        size = "M",
        span = 1,
        progress = 0,
        dependency_kind = "requires",
    },
    -- origin is empty until a roadmap is read: the builder fills it with the
    -- current period so a fresh roadmap opens on today's column.
    DEFAULT_SETTINGS = {
        period_kind = "quarter",
        origin = "",
        columns = 5,
        default_lens = "timeline",
    },
}

return M

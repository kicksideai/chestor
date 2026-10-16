-- The canonical roadmap record shapes. Normalization lives in one place so a
-- folded record and a read-model row are the same value: every writer merges an
-- event body onto the previous record through these functions.

local types = require("types")
local util = require("util")

local M = {}

local function pick_text(patch: any, previous: any, key: string): string
    if patch[key] ~= nil then return util.str(patch[key]) end
    if type(previous) == "table" and (previous :: any)[key] ~= nil then return util.str((previous :: any)[key]) end
    return ""
end

local function pick_number(patch: any, previous: any, key: string, fallback: number): number
    if patch[key] ~= nil then return tonumber(patch[key]) or fallback end
    if type(previous) == "table" and (previous :: any)[key] ~= nil then return tonumber((previous :: any)[key]) or fallback end
    return fallback
end

local function pick_vocabulary(patch: any, previous: any, key: string, fallback: string): string
    local value = pick_text(patch, previous, key)
    if value == "" then return fallback end
    return value
end

function M.layer_body(p: any, previous: any): any
    return {
        id = pick_text(p, previous, "id"),
        title = pick_text(p, previous, "title"),
        description = pick_text(p, previous, "description"),
        color = pick_text(p, previous, "color"),
        icon = pick_text(p, previous, "icon"),
        sort_order = pick_number(p, previous, "sort_order", 0),
    }
end

function M.outcome_body(p: any, previous: any): any
    return {
        id = pick_text(p, previous, "id"),
        title = pick_text(p, previous, "title"),
        description = pick_text(p, previous, "description"),
        sort_order = pick_number(p, previous, "sort_order", 0),
    }
end

-- A done initiative is complete by definition, so progress follows status
-- everywhere an initiative is written: the fold and the read model agree.
function M.initiative_body(p: any, previous: any): any
    local defaults: any = types.DEFAULTS
    local status = pick_vocabulary(p, previous, "status", tostring(defaults.status))
    local progress = pick_number(p, previous, "progress", tonumber(defaults.progress) or 0)
    if status == types.STATUS_DONE then progress = 1 end
    local tags = p.tags ~= nil and p.tags or (type(previous) == "table" and (previous :: any).tags or nil)
    local properties = p.properties ~= nil and p.properties or (type(previous) == "table" and (previous :: any).properties or nil)
    return {
        id = pick_text(p, previous, "id"),
        title = pick_text(p, previous, "title"),
        description = pick_text(p, previous, "description"),
        layer_id = pick_text(p, previous, "layer_id"),
        outcome_id = pick_text(p, previous, "outcome_id"),
        status = status,
        confidence = pick_vocabulary(p, previous, "confidence", tostring(defaults.confidence)),
        size = pick_vocabulary(p, previous, "size", tostring(defaults.size)),
        start_period = pick_text(p, previous, "start_period"),
        span = pick_number(p, previous, "span", tonumber(defaults.span) or 1),
        progress = progress,
        owner = pick_text(p, previous, "owner"),
        tags = util.string_array(tags),
        properties = util.copy_map(properties),
        sort_order = pick_number(p, previous, "sort_order", 0),
    }
end

function M.dependency_body(p: any, previous: any): any
    local defaults: any = types.DEFAULTS
    return {
        id = pick_text(p, previous, "id"),
        from_id = pick_text(p, previous, "from_id"),
        to_id = pick_text(p, previous, "to_id"),
        kind = pick_vocabulary(p, previous, "kind", tostring(defaults.dependency_kind)),
        note = pick_text(p, previous, "note"),
    }
end

function M.milestone_body(p: any, previous: any): any
    local initiative_ids = p.initiative_ids ~= nil and p.initiative_ids
        or (type(previous) == "table" and (previous :: any).initiative_ids or nil)
    return {
        id = pick_text(p, previous, "id"),
        title = pick_text(p, previous, "title"),
        description = pick_text(p, previous, "description"),
        period = pick_text(p, previous, "period"),
        layer_id = pick_text(p, previous, "layer_id"),
        initiative_ids = util.string_array(initiative_ids),
    }
end

function M.settings_body(patch: any, previous: any): any
    local base: any = types.DEFAULT_SETTINGS
    local p = type(patch) == "table" and patch or {}
    local prior = type(previous) == "table" and previous or {}
    return {
        period_kind = pick_vocabulary(p, prior, "period_kind", tostring(base.period_kind)),
        origin = pick_text(p, prior, "origin"),
        columns = pick_number(p, prior, "columns", tonumber(base.columns) or 5),
        default_lens = pick_vocabulary(p, prior, "default_lens", tostring(base.default_lens)),
        lens_state = util.copy_object((prior :: any).lens_state),
    }
end

function M.empty_state(): any
    return {
        layers = {},
        outcomes = {},
        initiatives = {},
        dependencies = {},
        milestones = {},
        dependency_order = {},
        settings = M.settings_body({}, nil),
    }
end

function M.seed(raw: any): any
    raw = type(raw) == "table" and raw or {}
    local empty = M.empty_state()
    for k, v in pairs(empty) do
        if raw[k] == nil then raw[k] = v end
    end
    raw.settings = M.settings_body({}, raw.settings)
    return raw
end

return M

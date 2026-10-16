-- The pure roadmap core: the event fold, the command validator and the public
-- read shape. It touches no database and no host service, so every invariant in
-- the semantics spec is provable without a harness.

local json = require("json")
local types = require("types")
local periods = require("periods")
local records = require("records")
local util = require("util")

local M = {}

M.EVENT = types.EVENT

local function apply_event(state: any, kind: string, p: any)
    local E = M.EVENT
    p = type(p) == "table" and p or {}
    local id = util.str(p.id)

    if kind == E.LAYER_ADDED or kind == E.LAYER_UPDATED then
        state.layers[id] = records.layer_body(p, state.layers[id])
    elseif kind == E.LAYER_REMOVED then
        state.layers[id] = nil
    elseif kind == E.OUTCOME_ADDED or kind == E.OUTCOME_UPDATED then
        state.outcomes[id] = records.outcome_body(p, state.outcomes[id])
    elseif kind == E.OUTCOME_REMOVED then
        state.outcomes[id] = nil
    elseif kind == E.INITIATIVE_ADDED or kind == E.INITIATIVE_UPDATED then
        state.initiatives[id] = records.initiative_body(p, state.initiatives[id])
    elseif kind == E.INITIATIVE_REMOVED then
        state.initiatives[id] = nil
    elseif kind == E.DEPENDENCY_ADDED or kind == E.DEPENDENCY_UPDATED then
        state.dependencies[id] = records.dependency_body(p, state.dependencies[id])
        state.dependency_order = util.append_unique(state.dependency_order, id)
    elseif kind == E.DEPENDENCY_REMOVED then
        state.dependencies[id] = nil
        state.dependency_order = util.remove_value(state.dependency_order, id)
    elseif kind == E.MILESTONE_ADDED or kind == E.MILESTONE_UPDATED then
        state.milestones[id] = records.milestone_body(p, state.milestones[id])
    elseif kind == E.MILESTONE_REMOVED then
        state.milestones[id] = nil
    elseif kind == E.SETTINGS_UPDATED then
        state.settings = records.settings_body(type(p.settings) == "table" and p.settings or p, state.settings)
    elseif kind == E.LENS_STATE_SET then
        local lens_state = util.copy_object(state.settings.lens_state)
        lens_state[util.str(p.lens)] = util.copy_object(p.state)
        state.settings.lens_state = lens_state
    end
end

M.apply_event = apply_event

-- A thread event body may arrive as a JSON string, so the fold decodes before it
-- applies rather than skipping a fact it cannot read.
function M.fold_into(state: any, events: any): any
    state = records.seed(state)
    for _, e in ipairs(type(events) == "table" and events or {}) do
        local body = (e :: any).body
        if type(body) == "string" then body = json.decode(body :: string) end
        if type(body) == "table" then apply_event(state, util.str((e :: any).type), body) end
    end
    return state
end

local function exists(map: any, id: any): boolean
    return util.is_non_empty_string(id) and type(map) == "table" and (map :: any)[id] ~= nil
end

local function requires_adjacency(state: any, override_id: string, override: any): { [string]: { string } }
    local adjacency: { [string]: { string } } = {}
    local function link(edge: any)
        if type(edge) ~= "table" then return end
        if util.str((edge :: any).kind) ~= types.DEP_REQUIRES then return end
        local from = util.str((edge :: any).from_id)
        local to = util.str((edge :: any).to_id)
        if from == "" or to == "" then return end
        adjacency[from] = util.append_unique(adjacency[from], to) :: { string }
    end
    for id, edge in pairs(type(state.dependencies) == "table" and state.dependencies or {}) do
        if util.str(id) ~= override_id then link(edge) end
    end
    link(override)
    return adjacency
end

local function reach_path(adjacency: any, from: string, target: string): { string }?
    local seen: { [string]: boolean } = {}
    local path: { string } = {}
    local function walk(node: string): boolean
        if seen[node] then return false end
        seen[node] = true
        path[#path + 1] = node
        if node == target then return true end
        for _, next_id in ipairs(adjacency[node] or {}) do
            if walk(next_id) then return true end
        end
        path[#path] = nil
        return false
    end
    if walk(from) then return path end
    return nil
end

local function check_acyclic(state: any, edge: any): error?
    if util.str((edge :: any).kind) ~= types.DEP_REQUIRES then return nil end
    local from = util.str((edge :: any).from_id)
    local to = util.str((edge :: any).to_id)
    local adjacency = requires_adjacency(state, util.str((edge :: any).id), edge)
    local path = reach_path(adjacency, to, from)
    if not path then return nil end
    return errors.new({ message = "dependency cycle refused: " .. from .. " -> " .. table.concat(path, " -> "), kind = errors.INVALID })
end

local function check_vocabulary(p: any, key: string, vocabulary: any, label: string): error?
    if p[key] == nil then return nil end
    if util.allows(vocabulary, p[key]) then return nil end
    return errors.new({ message = label .. " must be one of " .. util.vocabulary_text(vocabulary) .. ": " .. tostring(p[key]), kind = errors.INVALID })
end

local function check_period(state: any, p: any, key: string, label: string): error?
    if p[key] == nil then return nil end
    local value = util.str(p[key])
    if value == "" then return nil end
    local err = periods.validate(value, state.settings.period_kind)
    if err then return errors.new({ message = label .. " does not match period kind " .. tostring(state.settings.period_kind) .. ": " .. tostring(err), kind = errors.INVALID }) end
    return nil
end

local function check_initiative_fields(state: any, p: any): error?
    local err = check_vocabulary(p, "status", types.STATUS, "initiative status")
    if err then return err end
    err = check_vocabulary(p, "confidence", types.CONFIDENCE, "initiative confidence")
    if err then return err end
    err = check_vocabulary(p, "size", types.SIZE, "initiative size")
    if err then return err end
    err = check_period(state, p, "start_period", "initiative start_period")
    if err then return err end
    if p.span ~= nil then
        local span = tonumber(p.span)
        if not span or span < 1 or span % 1 ~= 0 then return errors.new({ message = "initiative span must be an integer of at least 1: " .. tostring(p.span), kind = errors.INVALID }) end
    end
    if p.progress ~= nil then
        local progress = tonumber(p.progress)
        if not progress or progress < 0 or progress > 1 then return errors.new({ message = "initiative progress must be between 0 and 1: " .. tostring(p.progress), kind = errors.INVALID }) end
    end
    if p.layer_id ~= nil and not exists(state.layers, p.layer_id) then return errors.new({ message = "layer not found: " .. tostring(p.layer_id), kind = errors.INVALID }) end
    if p.outcome_id ~= nil and util.str(p.outcome_id) ~= "" and not exists(state.outcomes, p.outcome_id) then
        return errors.new({ message = "outcome not found: " .. tostring(p.outcome_id), kind = errors.INVALID })
    end
    return nil
end

local function check_milestone_fields(state: any, p: any): error?
    local err = check_period(state, p, "period", "milestone period")
    if err then return err end
    if p.layer_id ~= nil and util.str(p.layer_id) ~= "" and not exists(state.layers, p.layer_id) then
        return errors.new({ message = "layer not found: " .. tostring(p.layer_id), kind = errors.INVALID })
    end
    if p.initiative_ids ~= nil then
        if type(p.initiative_ids) ~= "table" then return errors.new({ message = "milestone initiative_ids must be an array", kind = errors.INVALID }) end
        for _, initiative_id in ipairs(util.string_array(p.initiative_ids)) do
            if not exists(state.initiatives, initiative_id) then return errors.new({ message = "initiative not found: " .. initiative_id, kind = errors.INVALID }) end
        end
    end
    return nil
end

local function layer_references(state: any, id: string): error?
    for initiative_id, initiative in pairs(state.initiatives :: { [string]: any }) do
        if util.str((initiative :: any).layer_id) == id then return errors.new({ message = "layer is referenced by initiative: " .. util.str(initiative_id), kind = errors.INVALID }) end
    end
    for milestone_id, milestone in pairs(state.milestones :: { [string]: any }) do
        if util.str((milestone :: any).layer_id) == id then return errors.new({ message = "layer is referenced by milestone: " .. util.str(milestone_id), kind = errors.INVALID }) end
    end
    return nil
end

local function outcome_references(state: any, id: string): error?
    for initiative_id, initiative in pairs(state.initiatives :: { [string]: any }) do
        if util.str((initiative :: any).outcome_id) == id then return errors.new({ message = "outcome is referenced by initiative: " .. util.str(initiative_id), kind = errors.INVALID }) end
    end
    return nil
end

local function initiative_references(state: any, id: string): error?
    for dependency_id, dependency in pairs(state.dependencies :: { [string]: any }) do
        if util.str((dependency :: any).from_id) == id or util.str((dependency :: any).to_id) == id then
            return errors.new({ message = "initiative is referenced by dependency: " .. util.str(dependency_id), kind = errors.INVALID })
        end
    end
    for milestone_id, milestone in pairs(state.milestones :: { [string]: any }) do
        if util.has_value((milestone :: any).initiative_ids, id) then
            return errors.new({ message = "initiative is referenced by milestone: " .. util.str(milestone_id), kind = errors.INVALID })
        end
    end
    return nil
end

local function duplicate_pair(state: any, id: string, from_id: string, to_id: string): boolean
    for other_id, edge in pairs(state.dependencies :: { [string]: any }) do
        if util.str(other_id) ~= id
            and util.str((edge :: any).from_id) == from_id
            and util.str((edge :: any).to_id) == to_id then
            return true
        end
    end
    return false
end

local ENTITY_LABEL = { layer = "layer", outcome = "outcome", initiative = "initiative", dependency = "dependency", milestone = "milestone" }

local function check_identity(map: any, p: any, entity: string, adding: boolean): error?
    if not util.is_non_empty_string(p.id) then return errors.new({ message = ENTITY_LABEL[entity] .. " id required", kind = errors.INVALID }) end
    if adding and exists(map, p.id) then return errors.new({ message = ENTITY_LABEL[entity] .. " already exists: " .. tostring(p.id), kind = errors.INVALID }) end
    if not adding and not exists(map, p.id) then return errors.new({ message = ENTITY_LABEL[entity] .. " not found: " .. tostring(p.id), kind = errors.INVALID }) end
    return nil
end

local function check_title(p: any, entity: string, required: boolean): error?
    if required and not util.is_non_empty_string(p.title) then return errors.new({ message = ENTITY_LABEL[entity] .. " title required", kind = errors.INVALID }) end
    if not required and p.title ~= nil and not util.is_non_empty_string(p.title) then return errors.new({ message = ENTITY_LABEL[entity] .. " title required", kind = errors.INVALID }) end
    return nil
end

function M.validate_command(state: any, kind: string, p: any): error?
    state = records.seed(state)
    p = type(p) == "table" and p or {}
    local E = M.EVENT

    if kind == E.LAYER_ADDED or kind == E.LAYER_UPDATED then
        local adding = kind == E.LAYER_ADDED
        return check_identity(state.layers, p, "layer", adding) or check_title(p, "layer", adding)
    elseif kind == E.LAYER_REMOVED then
        return check_identity(state.layers, p, "layer", false) or layer_references(state, util.str(p.id))
    elseif kind == E.OUTCOME_ADDED or kind == E.OUTCOME_UPDATED then
        local adding = kind == E.OUTCOME_ADDED
        return check_identity(state.outcomes, p, "outcome", adding) or check_title(p, "outcome", adding)
    elseif kind == E.OUTCOME_REMOVED then
        return check_identity(state.outcomes, p, "outcome", false) or outcome_references(state, util.str(p.id))
    elseif kind == E.INITIATIVE_ADDED or kind == E.INITIATIVE_UPDATED then
        local adding = kind == E.INITIATIVE_ADDED
        local err = check_identity(state.initiatives, p, "initiative", adding) or check_title(p, "initiative", adding)
        if err then return err end
        if adding and not util.is_non_empty_string(p.layer_id) then return errors.new({ message = "initiative layer_id required", kind = errors.INVALID }) end
        return check_initiative_fields(state, p)
    elseif kind == E.INITIATIVE_REMOVED then
        return check_identity(state.initiatives, p, "initiative", false) or initiative_references(state, util.str(p.id))
    elseif kind == E.DEPENDENCY_ADDED then
        local err = check_identity(state.dependencies, p, "dependency", true)
        if err then return err end
        local from_id = util.str(p.from_id)
        local to_id = util.str(p.to_id)
        if from_id == "" or to_id == "" then return errors.new({ message = "dependency from_id and to_id required", kind = errors.INVALID }) end
        if from_id == to_id then return errors.new({ message = "dependency endpoints must differ: " .. from_id, kind = errors.INVALID }) end
        if not exists(state.initiatives, from_id) then return errors.new({ message = "initiative not found: " .. from_id, kind = errors.INVALID }) end
        if not exists(state.initiatives, to_id) then return errors.new({ message = "initiative not found: " .. to_id, kind = errors.INVALID }) end
        if duplicate_pair(state, util.str(p.id), from_id, to_id) then return errors.new({ message = "dependency already exists between " .. from_id .. " and " .. to_id, kind = errors.INVALID }) end
        err = check_vocabulary(p, "kind", types.DEP_KIND, "dependency kind")
        if err then return err end
        return check_acyclic(state, records.dependency_body(p, nil))
    elseif kind == E.DEPENDENCY_UPDATED then
        local err = check_identity(state.dependencies, p, "dependency", false)
        if err then return err end
        err = check_vocabulary(p, "kind", types.DEP_KIND, "dependency kind")
        if err then return err end
        return check_acyclic(state, records.dependency_body(p, state.dependencies[util.str(p.id)]))
    elseif kind == E.DEPENDENCY_REMOVED then
        return check_identity(state.dependencies, p, "dependency", false)
    elseif kind == E.MILESTONE_ADDED or kind == E.MILESTONE_UPDATED then
        local adding = kind == E.MILESTONE_ADDED
        local err = check_identity(state.milestones, p, "milestone", adding) or check_title(p, "milestone", adding)
        if err then return err end
        if adding and not util.is_non_empty_string(p.period) then return errors.new({ message = "milestone period required", kind = errors.INVALID }) end
        return check_milestone_fields(state, p)
    elseif kind == E.MILESTONE_REMOVED then
        return check_identity(state.milestones, p, "milestone", false)
    elseif kind == E.SETTINGS_UPDATED then
        local patch = type(p.settings) == "table" and p.settings or p
        local err = check_vocabulary(patch, "period_kind", types.PERIOD_KIND, "settings period_kind")
        if err then return err end
        err = check_vocabulary(patch, "default_lens", types.LENS, "settings default_lens")
        if err then return err end
        if patch.columns ~= nil then
            local columns = tonumber(patch.columns)
            if not columns or columns < 1 or columns % 1 ~= 0 then return errors.new({ message = "settings columns must be an integer of at least 1: " .. tostring(patch.columns), kind = errors.INVALID }) end
        end
        if patch.origin ~= nil and util.str(patch.origin) ~= "" then
            local period_kind = patch.period_kind ~= nil and util.str(patch.period_kind) or state.settings.period_kind
            local perr = periods.validate(util.str(patch.origin), period_kind)
            if perr then return errors.new({ message = "settings origin does not match period kind " .. tostring(period_kind) .. ": " .. tostring(perr), kind = errors.INVALID }) end
        end
        return nil
    elseif kind == E.LENS_STATE_SET then
        if not util.allows(types.LENS, p.lens) then
            return errors.new({ message = "lens must be one of " .. util.vocabulary_text(types.LENS) .. ": " .. tostring(p.lens), kind = errors.INVALID })
        end
        if p.state ~= nil and type(p.state) ~= "table" then return errors.new({ message = "lens state must be an object", kind = errors.INVALID }) end
        return nil
    end
    return errors.new({ message = "unknown event type: " .. tostring(kind), kind = errors.INVALID })
end

-- The batch is validated and folded on a private copy so a refusal anywhere in it
-- leaves the caller's snapshot exactly as it was: a partial fold is never observable.
function M.validate_and_fold(state: any, events: any): (any?, error?)
    local work = records.seed(util.copy_tree(state) or util.empty_object())
    for i, entry in ipairs(type(events) == "table" and events or {}) do
        local kind = util.str((entry :: any).type)
        local body = type((entry :: any).body) == "table" and (entry :: any).body or {}
        local err = M.validate_command(work, kind, body)
        if err then return nil, errors.new({ message = "invalid roadmap event at [" .. tostring(i) .. "]: " .. tostring(err), kind = errors.INVALID }) end
        apply_event(work, kind, body)
    end
    return work, nil
end

local function sorted(map: any, compare: (any, any) -> boolean): { any }
    local out: { any } = {}
    for _, value in pairs(type(map) == "table" and map or {}) do out[#out + 1] = value end
    table.sort(out, compare)
    return out
end

local function by_order_then_title(a: any, b: any): boolean
    local ao = tonumber((a :: any).sort_order) or 0
    local bo = tonumber((b :: any).sort_order) or 0
    if ao ~= bo then return ao < bo end
    if util.str((a :: any).title) ~= util.str((b :: any).title) then return util.str((a :: any).title) < util.str((b :: any).title) end
    return util.str((a :: any).id) < util.str((b :: any).id)
end

local function by_initiative_order(a: any, b: any): boolean
    local ao = tonumber((a :: any).sort_order) or 0
    local bo = tonumber((b :: any).sort_order) or 0
    if ao ~= bo then return ao < bo end
    if util.str((a :: any).start_period) ~= util.str((b :: any).start_period) then
        return util.str((a :: any).start_period) < util.str((b :: any).start_period)
    end
    if util.str((a :: any).title) ~= util.str((b :: any).title) then return util.str((a :: any).title) < util.str((b :: any).title) end
    return util.str((a :: any).id) < util.str((b :: any).id)
end

local function by_period_then_title(a: any, b: any): boolean
    if util.str((a :: any).period) ~= util.str((b :: any).period) then return util.str((a :: any).period) < util.str((b :: any).period) end
    if util.str((a :: any).title) ~= util.str((b :: any).title) then return util.str((a :: any).title) < util.str((b :: any).title) end
    return util.str((a :: any).id) < util.str((b :: any).id)
end

local function ordered_dependencies(state: any): { any }
    local out: { any } = {}
    local seen: { [string]: boolean } = {}
    for _, id in ipairs(type(state.dependency_order) == "table" and state.dependency_order or {}) do
        local key = util.str(id)
        if state.dependencies[key] then
            out[#out + 1] = state.dependencies[key]
            seen[key] = true
        end
    end
    for id, edge in pairs(state.dependencies :: { [string]: any }) do
        if not seen[util.str(id)] then out[#out + 1] = edge end
    end
    return out
end

local function count_map(map: any): number
    local total = 0
    for _ in pairs(type(map) == "table" and map or {}) do total = total + 1 end
    return total
end

local function public_settings(settings: any, current_period: string): any
    local lens_state = util.copy_object((settings :: any).lens_state)
    for _, lens in ipairs(types.LENS) do
        lens_state[lens] = util.copy_object(lens_state[lens])
    end
    local origin = util.str((settings :: any).origin)
    if origin == "" then origin = current_period end
    return {
        period_kind = (settings :: any).period_kind,
        origin = origin,
        columns = tonumber((settings :: any).columns) or 5,
        default_lens = (settings :: any).default_lens,
        lens_state = lens_state,
    }
end

-- The public read shape: every collection present, every scalar present, so the
-- renderer never guards on an absent field.
function M.build(state: any): (any?, error?)
    state = records.seed(state)
    local current_period, err = periods.current_period(state.settings.period_kind, nil)
    if err or not current_period then return nil, err end
    local current_position, perr = periods.current_position(state.settings.period_kind, nil)
    if perr or not current_position then return nil, perr end

    local layers = sorted(state.layers, by_order_then_title)
    local outcomes = sorted(state.outcomes, by_order_then_title)
    local initiatives = sorted(state.initiatives, by_initiative_order)
    local dependencies = ordered_dependencies(state)
    local milestones = sorted(state.milestones, by_period_then_title)

    return {
        entry_id = "",
        thread_id = "",
        settings = public_settings(state.settings, current_period),
        current_period = current_period,
        current_position = current_position,
        layers = layers,
        outcomes = outcomes,
        initiatives = initiatives,
        dependencies = dependencies,
        milestones = milestones,
        counts = {
            layers = count_map(state.layers),
            outcomes = count_map(state.outcomes),
            initiatives = count_map(state.initiatives),
            dependencies = count_map(state.dependencies),
            milestones = count_map(state.milestones),
        },
        can_undo = false,
        can_redo = false,
    }, nil
end

return M

-- Inverse construction for the undo stack. Each event's compensating event is
-- captured against the state that event is about to change, then the whole list is
-- reversed, so an inverse batch unwinds a batch in the exact order it was built.
-- Lens state is view state: it is folded but never enters the stack.

local types = require("types")
local records = require("records")
local state = require("state")
local util = require("util")

local M = {}

local function event(kind: string, body: any): any
    return { type = kind, body = body or {} }
end

function M.is_history_event(kind: any): boolean
    return util.str(kind) ~= types.EVENT.LENS_STATE_SET
end

function M.forward_events(events: any): { any }
    local out: { any } = {}
    for _, entry in ipairs(type(events) == "table" and events or {}) do
        if M.is_history_event((entry :: any).type) then out[#out + 1] = entry end
    end
    return out
end

local function settings_patch(settings: any): any
    return {
        period_kind = (settings :: any).period_kind,
        origin = (settings :: any).origin,
        columns = (settings :: any).columns,
        default_lens = (settings :: any).default_lens,
    }
end

local function inverse_for(work: any, kind: string, p: any): any?
    local E = types.EVENT
    local id = util.str(p.id)

    if kind == E.LAYER_ADDED then return event(E.LAYER_REMOVED, { id = id }) end
    if kind == E.OUTCOME_ADDED then return event(E.OUTCOME_REMOVED, { id = id }) end
    if kind == E.INITIATIVE_ADDED then return event(E.INITIATIVE_REMOVED, { id = id }) end
    if kind == E.DEPENDENCY_ADDED then return event(E.DEPENDENCY_REMOVED, { id = id }) end
    if kind == E.MILESTONE_ADDED then return event(E.MILESTONE_REMOVED, { id = id }) end

    if kind == E.LAYER_UPDATED then
        local prior = work.layers[id]
        return prior and event(E.LAYER_UPDATED, util.copy_tree(prior)) or nil
    end
    if kind == E.OUTCOME_UPDATED then
        local prior = work.outcomes[id]
        return prior and event(E.OUTCOME_UPDATED, util.copy_tree(prior)) or nil
    end
    if kind == E.INITIATIVE_UPDATED then
        local prior = work.initiatives[id]
        return prior and event(E.INITIATIVE_UPDATED, util.copy_tree(prior)) or nil
    end
    if kind == E.DEPENDENCY_UPDATED then
        local prior = work.dependencies[id]
        return prior and event(E.DEPENDENCY_UPDATED, util.copy_tree(prior)) or nil
    end
    if kind == E.MILESTONE_UPDATED then
        local prior = work.milestones[id]
        return prior and event(E.MILESTONE_UPDATED, util.copy_tree(prior)) or nil
    end

    if kind == E.LAYER_REMOVED then
        local prior = work.layers[id]
        return prior and event(E.LAYER_ADDED, util.copy_tree(prior)) or nil
    end
    if kind == E.OUTCOME_REMOVED then
        local prior = work.outcomes[id]
        return prior and event(E.OUTCOME_ADDED, util.copy_tree(prior)) or nil
    end
    if kind == E.INITIATIVE_REMOVED then
        local prior = work.initiatives[id]
        return prior and event(E.INITIATIVE_ADDED, util.copy_tree(prior)) or nil
    end
    if kind == E.DEPENDENCY_REMOVED then
        local prior = work.dependencies[id]
        return prior and event(E.DEPENDENCY_ADDED, util.copy_tree(prior)) or nil
    end
    if kind == E.MILESTONE_REMOVED then
        local prior = work.milestones[id]
        return prior and event(E.MILESTONE_ADDED, util.copy_tree(prior)) or nil
    end

    if kind == E.SETTINGS_UPDATED then
        return event(E.SETTINGS_UPDATED, { settings = settings_patch(work.settings) })
    end
    return nil
end

function M.build_inverse(pre_state: any, events: any): { any }
    local work = records.seed(util.copy_tree(pre_state) or util.empty_object())
    local collected: { any } = {}
    for _, entry in ipairs(type(events) == "table" and events or {}) do
        local kind = util.str((entry :: any).type)
        local body = type((entry :: any).body) == "table" and (entry :: any).body or {}
        if M.is_history_event(kind) then
            local inverse = inverse_for(work, kind, body)
            if inverse then collected[#collected + 1] = inverse end
        end
        state.apply_event(work, kind, body)
    end

    local out: { any } = {}
    for i = #collected, 1, -1 do out[#out + 1] = collected[i] end
    return out
end

return M

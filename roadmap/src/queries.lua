-- Derived roadmap queries. They read a built state (the same shape the API returns)
-- and compute nothing that is stored, so a lens and an agent always answer the
-- same question the same way.

local types = require("types")
local periods = require("periods")
local util = require("util")

local M = {}

local function initiative_index(built: any): { [string]: any }
    local index: { [string]: any } = {}
    for _, initiative in ipairs(type(built) == "table" and (built :: any).initiatives or {}) do
        index[util.str((initiative :: any).id)] = initiative
    end
    return index
end

local function edges(built: any): { any }
    local list = type(built) == "table" and (built :: any).dependencies or {}
    return type(list) == "table" and (list :: { any }) or {}
end

-- Upstream neighbours: to needs from, so the things id needs are the from ends of
-- the edges pointing at it.
function M.needs(built: any, id: any): { any }
    local target = util.str(id)
    local out: { any } = {}
    for _, edge in ipairs(edges(built)) do
        if util.str((edge :: any).to_id) == target then
            out[#out + 1] = { id = util.str((edge :: any).from_id), kind = util.str((edge :: any).kind), dependency_id = util.str((edge :: any).id) }
        end
    end
    return out
end

function M.unlocks(built: any, id: any): { any }
    local source = util.str(id)
    local out: { any } = {}
    for _, edge in ipairs(edges(built)) do
        if util.str((edge :: any).from_id) == source then
            out[#out + 1] = { id = util.str((edge :: any).to_id), kind = util.str((edge :: any).kind), dependency_id = util.str((edge :: any).id) }
        end
    end
    return out
end

-- Transitive chains follow requires edges only: an informs edge carries context,
-- never schedule pressure, so it is off the critical path by definition.
function M.transitive(built: any, id: any, direction: string): { string }
    local start = util.str(id)
    local visited: { [string]: boolean } = {}
    visited[start] = true
    local frontier: { string } = { start }
    local out: { string } = {}
    local head = 1
    while head <= #frontier do
        local current = frontier[head]
        head = head + 1
        local step = direction == "needs" and M.needs(built, current) or M.unlocks(built, current)
        for _, neighbour in ipairs(step) do
            if (neighbour :: any).kind == types.DEP_REQUIRES then
                local next_id = util.str((neighbour :: any).id)
                if next_id ~= "" and not visited[next_id] then
                    visited[next_id] = true
                    out[#out + 1] = next_id
                    frontier[#frontier + 1] = next_id
                end
            end
        end
    end
    return out
end

function M.blocking_score(built: any, id: any): number
    return #M.transitive(built, id, "unlocks")
end

function M.critical(built: any, top: any): { any }
    local ranked: { any } = {}
    for _, initiative in ipairs(type(built) == "table" and (built :: any).initiatives or {}) do
        local id = util.str((initiative :: any).id)
        local chain = M.transitive(built, id, "unlocks")
        ranked[#ranked + 1] = {
            id = id,
            title = util.str((initiative :: any).title),
            status = util.str((initiative :: any).status),
            blocking_score = #chain,
            chain = chain,
        }
    end
    table.sort(ranked, function(a: any, b: any): boolean
        if (a :: any).blocking_score ~= (b :: any).blocking_score then return (a :: any).blocking_score > (b :: any).blocking_score end
        if (a :: any).title ~= (b :: any).title then return (a :: any).title < (b :: any).title end
        return (a :: any).id < (b :: any).id
    end)
    local limit = math.floor(tonumber(top) or 0)
    if limit < 1 then return ranked end
    local out: { any } = {}
    for i = 1, math.min(limit, #ranked) do out[i] = ranked[i] end
    return out
end

-- Outcome progress is the mean over the bets filed under it: done counts whole,
-- active counts its own progress, an abandoned bet is not part of the average.
function M.outcome_progress(built: any, outcome_id: any): (number, number)
    local target = util.str(outcome_id)
    local total = 0
    local counted = 0
    for _, initiative in ipairs(type(built) == "table" and (built :: any).initiatives or {}) do
        if util.str((initiative :: any).outcome_id) == target then
            local status = util.str((initiative :: any).status)
            if status ~= types.STATUS_DROPPED then
                counted = counted + 1
                if status == types.STATUS_DONE then
                    total = total + 1
                elseif status == types.STATUS_ACTIVE then
                    total = total + (tonumber((initiative :: any).progress) or 0)
                end
            end
        end
    end
    if counted == 0 then return 0, 0 end
    return total / counted, counted
end

local function in_period_window(initiative: any, options: any, period_kind: string): (boolean, any?)
    local start_period = util.str((initiative :: any).start_period)
    local from = util.str((options :: any).period_from)
    local to = util.str((options :: any).period_to)
    if from == "" and to == "" then return true, nil end
    if start_period == "" then return false, nil end
    local index, err = periods.period_index(start_period, period_kind)
    if err or not index then return false, err end
    if from ~= "" then
        local from_index, ferr = periods.period_index(from, period_kind)
        if ferr or not from_index then return false, ferr end
        if index < from_index then return false, nil end
    end
    if to ~= "" then
        local to_index, terr = periods.period_index(to, period_kind)
        if terr or not to_index then return false, terr end
        if index > to_index then return false, nil end
    end
    return true, nil
end

function M.filter_initiatives(built: any, options: any): ({ any }?, any?)
    options = type(options) == "table" and options or {}
    local settings = type(built) == "table" and (built :: any).settings or {}
    local period_kind = util.str((settings :: any).period_kind)
    local current_period = util.str(type(built) == "table" and (built :: any).current_period or "")
    local out: { any } = {}

    for _, initiative in ipairs(type(built) == "table" and (built :: any).initiatives or {}) do
        local keep = true
        if (options :: any).layer ~= nil and util.str((initiative :: any).layer_id) ~= util.str((options :: any).layer) then keep = false end
        if keep and (options :: any).outcome ~= nil and util.str((initiative :: any).outcome_id) ~= util.str((options :: any).outcome) then keep = false end
        if keep and (options :: any).status ~= nil and util.str((initiative :: any).status) ~= util.str((options :: any).status) then keep = false end
        if keep and (options :: any).horizon ~= nil then
            local horizon, herr = periods.horizon(initiative, current_period, period_kind)
            if herr then return nil, herr end
            if horizon ~= util.str((options :: any).horizon) then keep = false end
        end
        if keep then
            local within, werr = in_period_window(initiative, options, period_kind)
            if werr then return nil, werr end
            keep = within
        end
        if keep then out[#out + 1] = initiative end
    end
    return out, nil
end

function M.initiative(built: any, id: any): any
    return initiative_index(built)[util.str(id)]
end

-- How much work a period carries: an initiative occupies every period its span
-- covers, weighted by its size. Finished and abandoned bets are behind us, so they
-- carry no load. Rows are ranked heaviest first; the caller decides what is too
-- much, because capacity is a team fact this module does not hold.
function M.period_load(built: any, top: any): { any }
    local settings = type(built) == "table" and (built :: any).settings or {}
    local period_kind = util.str((settings :: any).period_kind)
    local weights: any = types.SIZE_WEIGHT
    local cells: { [string]: any } = {}
    local order: { string } = {}

    for _, initiative in ipairs(type(built) == "table" and (built :: any).initiatives or {}) do
        local status = util.str((initiative :: any).status)
        local start_period = util.str((initiative :: any).start_period)
        if start_period ~= "" and status ~= types.STATUS_DONE and status ~= types.STATUS_DROPPED then
            local start_index = periods.period_index(start_period, period_kind)
            if start_index then
                local span = math.max(1, math.floor(tonumber((initiative :: any).span) or 1))
                local weight = tonumber(weights[util.str((initiative :: any).size)]) or 0
                for step = 0, span - 1 do
                    local key = periods.index_to_key((start_index :: number) + step, period_kind)
                    if key then
                        local cell = cells[key :: string]
                        if not cell then
                            cell = { period = key, index = (start_index :: number) + step, count = 0, weight = 0, initiatives = {} }
                            cells[key :: string] = cell
                            order[#order + 1] = key :: string
                        end
                        cell.count = cell.count + 1
                        cell.weight = cell.weight + weight
                        cell.initiatives[#cell.initiatives + 1] = util.str((initiative :: any).id)
                    end
                end
            end
        end
    end

    local rows: { any } = {}
    for _, key in ipairs(order) do rows[#rows + 1] = cells[key] end
    table.sort(rows, function(a: any, b: any): boolean
        if (a :: any).weight ~= (b :: any).weight then return (a :: any).weight > (b :: any).weight end
        return (a :: any).index < (b :: any).index
    end)

    local limit = math.floor(tonumber(top) or 0)
    if limit < 1 then return rows end
    local out: { any } = {}
    for i = 1, math.min(limit, #rows) do out[i] = rows[i] end
    return out
end

local function selected_initiatives(built: any, filter: any): ({ any }?, any?)
    if filter == nil then
        local list = type(built) == "table" and (built :: any).initiatives or {}
        return type(list) == "table" and (list :: { any }) or {}, nil
    end
    return M.filter_initiatives(built, filter)
end

local function id_set(rows: { any }): { [string]: boolean }
    local set: { [string]: boolean } = {}
    for _, row in ipairs(rows) do set[util.str((row :: any).id)] = true end
    return set
end

local function timeline_view(built: any, rows: { any }): (any?, any?)
    local settings = (built :: any).settings
    local period_kind = util.str((settings :: any).period_kind)
    local origin = util.str((settings :: any).origin)
    local origin_index, oerr = periods.period_index(origin, period_kind)
    if oerr or not origin_index then return nil, oerr end

    local columns = math.max(1, math.floor(tonumber((settings :: any).columns) or 1))
    local current_period = util.str((built :: any).current_period)
    local visible: { any } = {}
    for step = 0, columns - 1 do
        local key, kerr = periods.index_to_key((origin_index :: number) + step, period_kind)
        if kerr or not key then return nil, kerr end
        visible[#visible + 1] = {
            key = key,
            index = (origin_index :: number) + step,
            offset = step,
            current = key == current_period,
        }
    end

    local lanes: { any } = {}
    local lane_index: { [string]: any } = {}
    for _, layer in ipairs((built :: any).layers) do
        local lane = { layer = layer, bars = {} }
        lanes[#lanes + 1] = lane
        lane_index[util.str((layer :: any).id)] = lane
    end

    local unscheduled: { any } = {}
    for _, initiative in ipairs(rows) do
        local lane = lane_index[util.str((initiative :: any).layer_id)]
        local start_period = util.str((initiative :: any).start_period)
        if start_period == "" then
            unscheduled[#unscheduled + 1] = initiative
        elseif lane then
            local start_index, serr = periods.period_index(start_period, period_kind)
            if serr or not start_index then return nil, serr end
            lane.bars[#lane.bars + 1] = {
                id = util.str((initiative :: any).id),
                title = util.str((initiative :: any).title),
                status = util.str((initiative :: any).status),
                confidence = util.str((initiative :: any).confidence),
                size = util.str((initiative :: any).size),
                progress = tonumber((initiative :: any).progress) or 0,
                outcome_id = util.str((initiative :: any).outcome_id),
                start_period = start_period,
                span = math.max(1, math.floor(tonumber((initiative :: any).span) or 1)),
                offset = (start_index :: number) - (origin_index :: number),
            }
        end
    end

    local milestones: { any } = {}
    for _, milestone in ipairs((built :: any).milestones) do
        local index, merr = periods.period_index(util.str((milestone :: any).period), period_kind)
        if merr or not index then return nil, merr end
        milestones[#milestones + 1] = {
            id = util.str((milestone :: any).id),
            title = util.str((milestone :: any).title),
            period = util.str((milestone :: any).period),
            layer_id = util.str((milestone :: any).layer_id),
            initiative_ids = util.string_array((milestone :: any).initiative_ids),
            offset = (index :: number) - (origin_index :: number),
        }
    end

    return {
        lens = "timeline",
        period_kind = period_kind,
        origin = origin,
        columns = columns,
        current_period = current_period,
        current_position = tonumber((built :: any).current_position) or 0,
        periods = visible,
        rows = lanes,
        unscheduled = unscheduled,
        milestones = milestones,
    }, nil
end

-- Horizons read now first: the columns are ordered the way a planning conversation
-- runs, with what is already behind us last.
local HORIZON_ORDER = { types.HORIZON.NOW, types.HORIZON.NEXT, types.HORIZON.LATER, types.HORIZON.PAST }

local function horizons_view(built: any, rows: { any }): (any?, any?)
    local settings = (built :: any).settings
    local period_kind = util.str((settings :: any).period_kind)
    local current_period = util.str((built :: any).current_period)

    local buckets: { [string]: any } = {}
    local columns: { any } = {}
    for _, horizon in ipairs(HORIZON_ORDER) do
        local column: any = { horizon = horizon, count = 0, layers = {} }
        buckets[horizon] = { column = column, lanes = {} }
        columns[#columns + 1] = column
    end

    for _, initiative in ipairs(rows) do
        local horizon, herr = periods.horizon(initiative, current_period, period_kind)
        if herr or not horizon then return nil, herr end
        local bucket = buckets[horizon :: string]
        local layer_id = util.str((initiative :: any).layer_id)
        local lane = bucket.lanes[layer_id]
        if not lane then
            lane = { layer_id = layer_id, layer_title = "", initiatives = {} }
            bucket.lanes[layer_id] = lane
            bucket.column.layers[#bucket.column.layers + 1] = lane
        end
        lane.initiatives[#lane.initiatives + 1] = initiative
        bucket.column.count = bucket.column.count + 1
    end

    for _, layer in ipairs((built :: any).layers) do
        for _, horizon in ipairs(HORIZON_ORDER) do
            local lane = buckets[horizon].lanes[util.str((layer :: any).id)]
            if lane then lane.layer_title = util.str((layer :: any).title) end
        end
    end

    return { lens = "horizons", current_period = current_period, columns = columns }, nil
end

local function strata_view(built: any, rows: { any }): (any?, any?)
    local selected = id_set(rows)
    local bands: { any } = {}
    local band_index: { [string]: any } = {}
    for _, layer in ipairs((built :: any).layers) do
        local band = { layer = layer, initiatives = {} }
        bands[#bands + 1] = band
        band_index[util.str((layer :: any).id)] = band
    end

    local layer_of: { [string]: string } = {}
    for _, initiative in ipairs((built :: any).initiatives) do
        layer_of[util.str((initiative :: any).id)] = util.str((initiative :: any).layer_id)
    end

    for _, initiative in ipairs(rows) do
        local band = band_index[util.str((initiative :: any).layer_id)]
        if band then
            band.initiatives[#band.initiatives + 1] = {
                id = util.str((initiative :: any).id),
                title = util.str((initiative :: any).title),
                status = util.str((initiative :: any).status),
                size = util.str((initiative :: any).size),
                confidence = util.str((initiative :: any).confidence),
                blocking_score = M.blocking_score(built, (initiative :: any).id),
            }
        end
    end

    local edge_rows: { any } = {}
    for _, edge in ipairs(edges(built)) do
        local from_id = util.str((edge :: any).from_id)
        local to_id = util.str((edge :: any).to_id)
        if selected[from_id] and selected[to_id] then
            edge_rows[#edge_rows + 1] = {
                id = util.str((edge :: any).id),
                from_id = from_id,
                to_id = to_id,
                kind = util.str((edge :: any).kind),
                from_layer_id = layer_of[from_id] or "",
                to_layer_id = layer_of[to_id] or "",
            }
        end
    end

    return { lens = "strata", bands = bands, edges = edge_rows }, nil
end

local function outcomes_view(built: any, rows: { any }): (any?, any?)
    local ledger: { any } = {}
    local by_outcome: { [string]: any } = {}
    for _, outcome in ipairs((built :: any).outcomes) do
        local progress, counted = M.outcome_progress(built, (outcome :: any).id)
        local entry = { outcome = outcome, progress = progress, counted = counted, initiatives = {} }
        ledger[#ledger + 1] = entry
        by_outcome[util.str((outcome :: any).id)] = entry
    end

    local unfiled: { any } = {}
    for _, initiative in ipairs(rows) do
        local entry = by_outcome[util.str((initiative :: any).outcome_id)]
        if entry then
            entry.initiatives[#entry.initiatives + 1] = initiative
        else
            unfiled[#unfiled + 1] = initiative
        end
    end

    return { lens = "outcomes", ledger = ledger, unfiled = unfiled }, nil
end

-- One model, several lenses: a lens reshapes the state the API already returned
-- and stores nothing, so an agent asked to reason "on the timeline" sees exactly
-- the frame the user sees.
function M.lens_view(built: any, lens: any, filter: any): (any?, any?)
    local name = util.str(lens)
    if not util.allows(types.LENS, name) then
        return nil, errors.new({ message = "lens must be one of " .. util.vocabulary_text(types.LENS) .. ": " .. name, kind = errors.INVALID })
    end
    local rows, ferr = selected_initiatives(built, filter)
    if ferr or not rows then return nil, ferr end
    if name == "timeline" then return timeline_view(built, rows) end
    if name == "horizons" then return horizons_view(built, rows) end
    if name == "strata" then return strata_view(built, rows) end
    return outcomes_view(built, rows)
end

return M

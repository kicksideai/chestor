local roadmap = require("roadmap")
local queries = require("queries")

-- The agent-facing projection of a roadmap: the same state the renderer reads,
-- rendered as the plan a person would write down. Titles carry the meaning, so
-- ids appear only where an agent needs them to address a row.

local function title_index(rows: any): { [string]: string }
    local index: { [string]: string } = {}
    for _, row in ipairs(type(rows) == "table" and rows or {}) do
        index[tostring((row :: any).id or "")] = tostring((row :: any).title or (row :: any).id or "")
    end
    return index
end

local function percent(value: any): string
    return tostring(math.floor((tonumber(value) or 0) * 100 + 0.5)) .. "%"
end

local function schedule(initiative: any): string
    local start_period = tostring((initiative :: any).start_period or "")
    if start_period == "" then return "unscheduled" end
    local span = math.floor(tonumber((initiative :: any).span) or 1)
    if span <= 1 then return start_period end
    return start_period .. " x" .. tostring(span)
end

local function initiative_line(initiative: any, outcomes: { [string]: string }): string
    local parts = {
        "- " .. tostring((initiative :: any).title) .. " (" .. tostring((initiative :: any).id) .. ")",
        "[" .. tostring((initiative :: any).status) .. "]",
        schedule(initiative),
        "size " .. tostring((initiative :: any).size),
        "confidence " .. tostring((initiative :: any).confidence),
        "progress " .. percent((initiative :: any).progress),
    }
    local outcome = outcomes[tostring((initiative :: any).outcome_id or "")]
    if outcome then parts[#parts + 1] = "outcome " .. outcome end
    local owner = tostring((initiative :: any).owner or "")
    if owner ~= "" then parts[#parts + 1] = "owner " .. owner end
    return table.concat(parts, " · ")
end

local function render_settings(lines: { string }, state: any)
    local settings: any = (state :: any).settings or {}
    lines[#lines + 1] = "## Settings"
    lines[#lines + 1] = "- Periods: " .. tostring(settings.period_kind)
        .. ", origin " .. tostring(settings.origin)
        .. ", " .. tostring(settings.columns) .. " columns"
    lines[#lines + 1] = "- Current period: " .. tostring((state :: any).current_period)
    lines[#lines + 1] = "- Default lens: " .. tostring(settings.default_lens)
    lines[#lines + 1] = ""
end

local function render_layers(lines: { string }, state: any, outcomes: { [string]: string })
    lines[#lines + 1] = "## Layers"
    for _, layer in ipairs((state :: any).layers) do
        lines[#lines + 1] = "### " .. tostring((layer :: any).title) .. " (" .. tostring((layer :: any).id) .. ")"
        local description = tostring((layer :: any).description or "")
        if description ~= "" then lines[#lines + 1] = description end
        local filled = false
        for _, initiative in ipairs((state :: any).initiatives) do
            if tostring((initiative :: any).layer_id) == tostring((layer :: any).id) then
                lines[#lines + 1] = initiative_line(initiative, outcomes)
                filled = true
            end
        end
        if not filled then lines[#lines + 1] = "- no initiatives" end
        lines[#lines + 1] = ""
    end
end

local function render_dependencies(lines: { string }, state: any, titles: { [string]: string })
    if #(state :: any).dependencies == 0 then return end
    lines[#lines + 1] = "## Dependencies"
    for _, edge in ipairs((state :: any).dependencies) do
        local from_id = tostring((edge :: any).from_id)
        local to_id = tostring((edge :: any).to_id)
        local line = "- " .. (titles[from_id] or from_id) .. " → " .. (titles[to_id] or to_id)
            .. " (" .. tostring((edge :: any).kind) .. ")"
        local note = tostring((edge :: any).note or "")
        if note ~= "" then line = line .. " — " .. note end
        lines[#lines + 1] = line
    end
    lines[#lines + 1] = ""
end

local function render_milestones(lines: { string }, state: any, titles: { [string]: string })
    if #(state :: any).milestones == 0 then return end
    lines[#lines + 1] = "## Milestones"
    for _, milestone in ipairs((state :: any).milestones) do
        local named: { string } = {}
        for _, id in ipairs((milestone :: any).initiative_ids) do
            named[#named + 1] = titles[tostring(id)] or tostring(id)
        end
        local line = "- " .. tostring((milestone :: any).title) .. " — " .. tostring((milestone :: any).period)
        if #named > 0 then line = line .. ": " .. table.concat(named, ", ") end
        lines[#lines + 1] = line
    end
    lines[#lines + 1] = ""
end

local function render_outcomes(lines: { string }, state: any)
    if #(state :: any).outcomes == 0 then return end
    lines[#lines + 1] = "## Outcomes"
    for _, outcome in ipairs((state :: any).outcomes) do
        local progress, counted = queries.outcome_progress(state, (outcome :: any).id)
        lines[#lines + 1] = "- " .. tostring((outcome :: any).title)
            .. " — " .. percent(progress)
            .. " over " .. tostring(counted) .. " initiatives"
    end
    lines[#lines + 1] = ""
end

local function handler(input)
    local entry = input and input.entry
    if not entry then return { success = false, error = "entry required" } end
    local state, err = roadmap.state(tostring(entry.id))
    if not state then return nil, err end

    local titles = title_index((state :: any).initiatives)
    local outcomes = title_index((state :: any).outcomes)
    local lines = { "# " .. tostring(entry.name or "Roadmap"), "Type: roadmap", "" }
    render_settings(lines, state)
    render_layers(lines, state, outcomes)
    render_dependencies(lines, state, titles)
    render_milestones(lines, state, titles)
    render_outcomes(lines, state)
    return { success = true, type = "roadmap", text = table.concat(lines, "\n") }
end

return { handler = handler }

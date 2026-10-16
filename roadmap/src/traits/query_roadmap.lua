local roadmap = require("roadmap")

-- QueryRoadmap: the derived questions a planner asks — what a bet needs, what it
-- unlocks, what blocks the most, what sits in a horizon, and which periods carry
-- the most work. Every answer is computed from the same state the lenses draw.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local entry_id = trim(args.entry_id)
    if entry_id == "" then return { success = false, error = "entry_id is required" } end
    local question = trim(args.question)
    if question == "" then return { success = false, error = "question is required" } end
    local limit = args.limit == nil and 25 or args.limit
    if type(limit) ~= "number" or limit % 1 ~= 0 or limit < 1 then
        return { success = false, error = "limit must be a positive integer" }
    end
    limit = math.min(limit, 100)
    local cursor = args.cursor or "0"
    if type(cursor) ~= "string" or not cursor:match("^%d+$") then
        return { success = false, error = "invalid cursor" }
    end
    local offset = tonumber(cursor)
    if not offset then return { success = false, error = "invalid cursor" } end
    local answer, err = roadmap.query(entry_id, question, {
        id = trim(args.id),
        horizon = trim(args.horizon),
        top = args.top,
    })
    if err then return nil, err end
    local has_more = false
    for _, key in ipairs({ "initiatives", "dependencies", "needs", "unlocks", "needs_chain", "unlocks_chain", "critical", "load" }) do
        local values = answer[key]
        if type(values) == "table" then
            local rows = {}
            for index = offset + 1, math.min(#values, offset + limit) do
                local item = values[index]
                if type(item) == "table" then
                    local row = {}
                    for _, field in ipairs({ "id", "title", "status", "kind", "from_id", "to_id", "dependency_id", "layer_id", "outcome_id", "start_period", "span", "progress", "owner", "period", "count", "weight", "blocking_score" }) do
                        row[field] = item[field]
                    end
                    rows[#rows + 1] = row
                else rows[#rows + 1] = item end
            end
            if offset + #rows < #values then has_more = true end
            answer[key] = rows
        end
    end
    return { success = true, question = question, answer = answer,
        next_cursor = has_more and tostring(offset + limit) or nil }
end

return { handle = handle }

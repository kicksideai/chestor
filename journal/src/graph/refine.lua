local json = require("json")
local db = require("db")
local deriver = require("deriver")

-- The refine pass. Deterministic rules see only the relations a fact wrote
-- down; refine asks a small model about pairs the rules cannot reach. The
-- candidate pairs come from stored fields alone (a shared subject, a shared
-- correlation, two or more shared tags, adjacency inside one task), so the
-- model never sees an all-pairs comparison - it only arbitrates a bounded
-- shortlist, and it authors nothing on its own: an edge appears only when a
-- judgment clears the confidence floor and both endpoints are under their cap.
local M = {}

M.VOCABULARY = { relates = true, informs = true, contradicts = true, duplicates = true }

local MAX_LABEL = 110
local MAX_SUMMARY = 160

local SYSTEM = table.concat({
    "You judge whether two records from one work journal are actually related.",
    "",
    "Answer with one JSON object per line and no other text, in exactly this shape:",
    '{"pair":1,"related":true,"relation":"relates","confidence":0.82}',
    "",
    'relation must be one of: relates, informs, contradicts, duplicates.',
    "confidence is a number between 0 and 1.",
    'Answer "related":false when two records merely share vocabulary, a tag, or a topic.',
    "Judge every pair exactly once, in order.",
}, "\n")

local function clip(value: any, maximum: number): string
    local text = db.trim(value):gsub("%s+", " ")
    if #text > maximum then return text:sub(1, maximum - 1) .. "…" end
    return text
end

local function describe(node: any): string
    if type(node) ~= "table" then return "(unknown record)" end
    local value = node :: any
    local kind = clip(value.kind, 32)
    local label = clip(value.label, MAX_LABEL)
    local summary = clip(value.summary, MAX_SUMMARY)
    local line = (kind ~= "" and (kind .. ": ") or "") .. (label ~= "" and label or tostring(value.id or "?"))
    if summary ~= "" then line = line .. " — " .. summary end
    return line
end

-- Text only: the small classes this pass runs on answer plain text reliably
-- and quietly ignore strict response formats.
function M.prompt_text(batch: { any }): string
    local lines: { string } = { SYSTEM, "", "Pairs:" }
    for index, raw in ipairs(batch) do
        local pair = raw :: any
        lines[#lines + 1] = tostring(index) .. "."
        lines[#lines + 1] = "  A: " .. describe(pair.left)
        lines[#lines + 1] = "  B: " .. describe(pair.right)
        lines[#lines + 1] = "  shared: " .. clip(pair.reason, 32)
    end
    return table.concat(lines, "\n")
end

local function decode_object(text: string): any
    local decoded, decode_err = json.decode(text)
    if decode_err or type(decoded) ~= "table" then return nil end
    return decoded
end

local function judgment_of(value: any, size: number): any
    if type(value) ~= "table" then return nil end
    local item = value :: any
    local pair = tonumber(item.pair)
    if pair == nil or pair ~= math.floor(pair :: number) or (pair :: number) < 1 or (pair :: number) > size then return nil end
    if type(item.related) ~= "boolean" then return nil end
    local confidence = tonumber(item.confidence)
    if confidence == nil or (confidence :: number) < 0 or (confidence :: number) > 1 then return nil end
    local relation = string.lower(db.trim(item.relation))
    if relation == "" then relation = "relates" end
    if not M.VOCABULARY[relation] then return nil end
    return { pair = math.floor(pair :: number), related = item.related == true,
        relation = relation, confidence = confidence }
end

-- Strict: a judgment is read only when it names a pair in range, says plainly
-- whether the pair is related, uses a relation from the fixed vocabulary, and
-- carries a confidence in [0,1]. Anything else is rejected rather than
-- repaired, and a response that yields nothing readable is a parse failure.
function M.parse(text: any, size: number): (any?, string?)
    local body = db.trim(text)
    if body == "" then return nil, "judge returned no text" end
    local judgments: { any } = {}
    local seen: any = {}
    local rejected = 0
    local whole = decode_object(body)
    local rows: { any } = {}
    if type(whole) == "table" then
        local list = (type((whole :: any).judgments) == "table" and (whole :: any).judgments or whole) :: any
        for _, item in ipairs(list) do rows[#rows + 1] = item end
        if #rows == 0 and (whole :: any).pair ~= nil then rows[#rows + 1] = whole end
    end
    if #rows == 0 then
        for line in (body .. "\n"):gmatch("([^\n]*)\n") do
            local candidate = db.trim(line)
            local start = candidate:find("{", 1, true)
            local finish = candidate:reverse():find("}", 1, true)
            if start and finish then
                local object = decode_object(candidate:sub(start, #candidate - finish + 1))
                if object then rows[#rows + 1] = object else rejected = rejected + 1 end
            elseif candidate ~= "" then
                rejected = rejected + 1
            end
        end
    end
    for _, row in ipairs(rows) do
        local judgment = judgment_of(row, size)
        if judgment == nil then
            rejected = rejected + 1
        elseif not seen[(judgment :: any).pair] then
            seen[(judgment :: any).pair] = true
            judgments[#judgments + 1] = judgment
        end
    end
    if #judgments == 0 then return nil, "judge returned no readable judgment" end
    return { judgments = judgments, rejected = rejected }, nil
end

-- Acceptance is deterministic given the judgments: only related answers at or
-- above the floor, strongest first, and never more than the per-node cap on
-- either endpoint.
function M.accept(batch: { any }, judgments: any, opts: any): { any }
    local options = type(opts) == "table" and opts or {}
    local floor = tonumber((options :: any).minimum_confidence) or 0.6
    local cap = math.max(1, math.floor(tonumber((options :: any).max_edges_per_node) or 3))
    local linked = type((options :: any).linked) == "table" and (options :: any).linked or {}
    local ranked: { any } = {}
    for _, raw in ipairs(judgments :: { any }) do
        local judgment = raw :: any
        local pair = batch[judgment.pair]
        if judgment.related and judgment.confidence >= floor and pair ~= nil then
            ranked[#ranked + 1] = { pair = pair, judgment = judgment }
        end
    end
    table.sort(ranked, function(a: any, b: any): boolean
        if a.judgment.confidence ~= b.judgment.confidence then
            return a.judgment.confidence > b.judgment.confidence
        end
        if a.pair.left_id ~= b.pair.left_id then return a.pair.left_id < b.pair.left_id end
        return a.pair.right_id < b.pair.right_id
    end)
    local degree = type((options :: any).degree) == "table" and (options :: any).degree or {}
    local accepted: { any } = {}
    for _, raw in ipairs(ranked) do
        local item = raw :: any
        local left = tostring(item.pair.left_id)
        local right = tostring(item.pair.right_id)
        local key = left < right and (left .. "\1" .. right) or (right .. "\1" .. left)
        local left_degree = tonumber((degree :: any)[left]) or 0
        local right_degree = tonumber((degree :: any)[right]) or 0
        if (linked :: any)[key] ~= true and left_degree < cap and right_degree < cap then
            (degree :: any)[left] = left_degree + 1;
            (degree :: any)[right] = right_degree + 1;
            (linked :: any)[key] = true
            accepted[#accepted + 1] = {
                id = deriver.suggested_edge_id(left, right),
                from = left,
                to = right,
                kind = tostring(item.judgment.relation),
                label = tostring(item.judgment.relation),
                metadata = {
                    origin = deriver.ORIGIN_LLM,
                    rule = "affinity_judged",
                    reason = tostring(item.pair.reason or ""),
                    confidence = item.judgment.confidence,
                },
            }
        end
    end
    return accepted
end

function M.batches(candidates: { any }, size: number): { any }
    local bound = math.max(1, math.floor(tonumber(size) or 12))
    local out: { any } = {}
    local current: { any } = {}
    for _, candidate in ipairs(candidates) do
        current[#current + 1] = candidate
        if #current >= bound then
            out[#out + 1] = current
            current = {}
        end
    end
    if #current > 0 then out[#out + 1] = current end
    return out
end

-- One refine pass over already-materialized candidate pairs. judge(text) is the
-- model seam: it answers (text, err). A batch that will not parse is retried
-- once and then abandoned, so a failing model costs this pass and nothing else.
function M.plan(candidates: { any }, opts: any, judge: any): (any?, error?)
    local options = type(opts) == "table" and opts or {}
    if type(judge) ~= "function" then return nil, errors.new({ kind = errors.INVALID, message = "refine judge is required" }) end
    local batches = M.batches(candidates, tonumber((options :: any).batch_size) or 12)
    local edges: { any } = {}
    local degree: any = type((options :: any).degree) == "table" and (options :: any).degree or {}
    local linked: any = type((options :: any).linked) == "table" and (options :: any).linked or {}
    local judged = 0
    local rejected = 0
    for _, raw in ipairs(batches) do
        local batch = raw :: { any }
        local text = M.prompt_text(batch)
        local parsed: any = nil
        local last_error: string? = nil
        for _ = 1, 2 do
            local answer, answer_err = judge(text)
            if answer_err then
                last_error = tostring(answer_err)
            else
                local result, parse_err = M.parse(answer, #batch)
                if result then parsed = result; last_error = nil; break end
                last_error = parse_err
            end
        end
        if parsed == nil then
            return nil, errors.new({ kind = errors.UNAVAILABLE, message = last_error or "refine judge failed" })
        end
        judged = judged + #batch
        rejected = rejected + (tonumber((parsed :: any).rejected) or 0)
        local accepted = M.accept(batch, (parsed :: any).judgments, {
            minimum_confidence = (options :: any).minimum_confidence,
            max_edges_per_node = (options :: any).max_edges_per_node,
            degree = degree,
            linked = linked,
        })
        for _, edge in ipairs(accepted) do edges[#edges + 1] = edge end
    end
    return { edges = edges, judged = judged, rejected = rejected }, nil
end

return M

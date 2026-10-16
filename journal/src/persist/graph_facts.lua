local db = require("db")

-- The derivation index. Every map node a fact projects contributes one row per
-- addressable key (its task, its correlation, its subject, each of its tags).
-- Deterministic chaining and bounded affinity candidate generation read only
-- this index, so neither rule needs to re-read event bodies or scan JSON.
local M = {}

M.KEY = {
    TASK = "task",
    CORRELATION = "correlation",
    SUBJECT = "subject",
    TAG = "tag",
}

local MAX_TAGS = 12
local MAX_KEY_LENGTH = 160

local function normalized(value: any): string
    local text = db.trim(value)
    if #text > MAX_KEY_LENGTH then text = text:sub(1, MAX_KEY_LENGTH) end
    return text
end

-- Keys for one projected fact node, in a stable order. Tags are lowercased and
-- deduplicated so "Risk" and "risk" cluster as one key.
function M.keys_for(body: any, task_id: string): { any }
    local out: { any } = {}
    local task = normalized(task_id)
    if task ~= "" then out[#out + 1] = { key_type = M.KEY.TASK, key_value = task } end
    local correlation = normalized(type(body) == "table" and (body :: any).correlation_id or nil)
    if correlation ~= "" then out[#out + 1] = { key_type = M.KEY.CORRELATION, key_value = correlation } end
    local metadata = type(body) == "table" and type((body :: any).metadata) == "table" and (body :: any).metadata or {}
    local subject = normalized(type(body) == "table" and (body :: any).subject or nil)
    if subject == "" then subject = normalized((metadata :: any).subject) end
    if subject ~= "" then out[#out + 1] = { key_type = M.KEY.SUBJECT, key_value = string.lower(subject) } end
    local seen: any = {}
    local tags = type(body) == "table" and type((body :: any).tags) == "table" and (body :: any).tags or {}
    for _, raw in ipairs(tags :: { any }) do
        local tag = string.lower(normalized(raw))
        if tag ~= "" and not seen[tag] and #out < MAX_TAGS + 3 then
            seen[tag] = true
            out[#out + 1] = { key_type = M.KEY.TAG, key_value = tag }
        end
    end
    return out
end

function M.record(tx: any, journal_id: string, graph_id: string, node_id: string,
    source_seq: number, keys: { any }): error?
    local now = db.now()
    local unique: { any } = {}
    local seen: any = {}
    for _, raw in ipairs(keys) do
        local key = raw :: any
        local identity = tostring(key.key_type) .. "\0" .. tostring(key.key_value)
        if not seen[identity] then seen[identity] = true; unique[#unique + 1] = key end
    end
    local rows: { any } = {}
    for _, key in ipairs(unique) do
        rows[#rows + 1] = { journal_id, graph_id, node_id, tostring(key.key_type), tostring(key.key_value),
            math.floor(tonumber(source_seq) or 0), now }
    end
    return db.insert_rows(tx, [[
        INSERT INTO chestor_journal_graph_fact_keys
            (journal_id, graph_id, node_id, key_type, key_value, source_seq, created_at)
    ]], rows, 7, [[
        ON CONFLICT(journal_id, graph_id, node_id, key_type, key_value) DO UPDATE SET
            source_seq = excluded.source_seq
    ]])
end

-- The most recent node indexed under the same key strictly before this fact.
-- Chaining to one predecessor keeps a correlation a readable thread instead of
-- the quadratic clique an all-pairs rule would draw.
function M.previous(tx: any, journal_id: string, graph_id: string, key_type: string,
    key_value: string, before_seq: number, exclude_node_id: string): (string?, error?)
    local value = normalized(key_value)
    if value == "" then return nil, nil end
    local rows, err = db.query(tx, [[
        SELECT node_id FROM chestor_journal_graph_fact_keys
         WHERE journal_id = ? AND graph_id = ? AND key_type = ? AND key_value = ?
           AND source_seq < ? AND node_id <> ?
         ORDER BY source_seq DESC, node_id DESC LIMIT 1
    ]], { journal_id, graph_id, key_type, value, math.floor(tonumber(before_seq) or 0), exclude_node_id })
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return nil, nil end
    return tostring((row :: any).node_id), nil
end

function M.clear(tx: any, journal_id: string, graph_id: string): error?
    return db.exec(tx,
        "DELETE FROM chestor_journal_graph_fact_keys WHERE journal_id = ? AND graph_id = ?",
        { journal_id, graph_id })
end

-- Endpoint order is chosen explicitly rather than by swapping two locals: the
-- typed dialect assigns a multiple assignment left to right, so `a, b = b, a`
-- writes the same value into both names.
local function append_pair(out: { any }, seen: any, left: any, right: any, reason: string, weight: number)
    local first = db.trim(left)
    local second = db.trim(right)
    if first == "" or second == "" or first == second then return end
    local left_id = first <= second and first or second
    local right_id = first <= second and second or first
    local key = left_id .. "\1" .. right_id
    if seen[key] then return end
    seen[key] = true
    out[#out + 1] = { left_id = left_id, right_id = right_id, reason = reason, weight = weight }
end

-- Bounded candidate pairs for the refine pass. Four cheap generators, all
-- indexed and all capped: a shared subject, a shared correlation, two or more
-- shared tags, and temporal adjacency inside one task. Nothing here approaches
-- an all-pairs comparison, and nothing here authors an edge - the judge does.
function M.candidate_pairs(tx: any, journal_id: string, graph_id: string, limit: number): (any?, error?)
    local bound = math.max(1, math.min(math.floor(tonumber(limit) or 120), 600))
    local out: { any } = {}
    local seen: any = {}
    local shared, shared_err = db.query(tx, [[
        SELECT a.node_id AS left_id, b.node_id AS right_id,
               SUM(CASE WHEN a.key_type = ? THEN 1 ELSE 0 END) AS tag_overlap,
               SUM(CASE WHEN a.key_type = ? THEN 1 ELSE 0 END) AS subject_overlap,
               SUM(CASE WHEN a.key_type = ? THEN 1 ELSE 0 END) AS correlation_overlap
          FROM chestor_journal_graph_fact_keys a
          JOIN chestor_journal_graph_fact_keys b
            ON b.journal_id = a.journal_id AND b.graph_id = a.graph_id
           AND b.key_type = a.key_type AND b.key_value = a.key_value
           AND b.node_id > a.node_id
         WHERE a.journal_id = ? AND a.graph_id = ? AND a.key_type <> ?
         GROUP BY a.node_id, b.node_id
        HAVING SUM(CASE WHEN a.key_type = ? THEN 1 ELSE 0 END) >= 2
            OR SUM(CASE WHEN a.key_type <> ? THEN 1 ELSE 0 END) >= 1
         ORDER BY 3 DESC, 1 ASC, 2 ASC
         LIMIT ?
    ]], {
        M.KEY.TAG, M.KEY.SUBJECT, M.KEY.CORRELATION,
        journal_id, graph_id, M.KEY.TASK,
        M.KEY.TAG, M.KEY.TAG, bound,
    })
    if shared_err then return nil, shared_err end
    for _, raw in ipairs(shared or {}) do
        local row = raw :: any
        local subject_overlap = tonumber(row.subject_overlap) or 0
        local correlation_overlap = tonumber(row.correlation_overlap) or 0
        local reason = M.KEY.TAG
        if subject_overlap > 0 then
            reason = M.KEY.SUBJECT
        elseif correlation_overlap > 0 then
            reason = M.KEY.CORRELATION
        end
        local weight = (tonumber(row.tag_overlap) or 0) + 2 * subject_overlap + 2 * correlation_overlap
        append_pair(out, seen, row.left_id, row.right_id, reason, weight)
    end
    local adjacent, adjacent_err = db.query(tx, [[
        SELECT a.node_id AS left_id,
               (SELECT b.node_id FROM chestor_journal_graph_fact_keys b
                 WHERE b.journal_id = a.journal_id AND b.graph_id = a.graph_id
                   AND b.key_type = a.key_type AND b.key_value = a.key_value
                   AND b.source_seq > a.source_seq
                 ORDER BY b.source_seq ASC, b.node_id ASC LIMIT 1) AS right_id
          FROM chestor_journal_graph_fact_keys a
         WHERE a.journal_id = ? AND a.graph_id = ? AND a.key_type = ?
         ORDER BY a.source_seq DESC
         LIMIT ?
    ]], { journal_id, graph_id, M.KEY.TASK, bound })
    if adjacent_err then return nil, adjacent_err end
    for _, raw in ipairs(adjacent or {}) do
        local row = raw :: any
        if #out >= bound then break end
        append_pair(out, seen, row.left_id, row.right_id, "adjacent", 1)
    end
    local page: { any } = {}
    for index = 1, math.min(bound, #out) do page[#page + 1] = out[index] end
    return page, nil
end

return M

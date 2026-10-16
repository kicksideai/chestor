local db = require("db")
local jobs = require("jobs")

local M = {}

local function bounded(value: any, fallback: number, minimum: number, maximum: number): number
    return math.max(minimum, math.min(math.floor(tonumber(value) or fallback), maximum))
end

local function schedule_config(graph: any): any
    local config = type(graph.config) == "table" and graph.config or {}
    local schedule = type(config.schedule) == "table" and config.schedule or {}
    return {
        min_nodes = bounded(schedule.min_nodes, 24, 4, 10000),
        growth_nodes = bounded(schedule.growth_nodes, 16, 1, 10000),
        max_roots = bounded(schedule.max_roots, 12, 2, 1000),
        max_siblings = bounded(schedule.max_siblings, 12, 2, 1000),
    }
end

local function pressure(handle: any, journal_id: string, graph_id: string): (any?, error?)
    local rows, err = db.query(handle, [[
        SELECT
            (SELECT COUNT(*) FROM chestor_journal_graph_nodes
              WHERE journal_id = ? AND graph_id = ? AND (parent_id IS NULL OR parent_id = '')) AS roots,
            COALESCE((SELECT MAX(children) FROM (
                SELECT COUNT(*) AS children FROM chestor_journal_graph_nodes
                 WHERE journal_id = ? AND graph_id = ? AND parent_id IS NOT NULL AND parent_id <> ''
                 GROUP BY parent_id
            ) grouped), 0) AS siblings
    ]], { journal_id, graph_id, journal_id, graph_id })
    if err then return nil, err end
    local row = rows and rows[1] or {}
    return { roots = tonumber(row.roots) or 0, siblings = tonumber(row.siblings) or 0 }, nil
end

function M.evaluate(handle: any, journal_id: string, graph: any, source_seq: number): (any?, error?)
    local policy = schedule_config(graph)
    local nodes = tonumber(graph.node_count) or 0
    if nodes < policy.min_nodes then return nil, nil end
    local shape, shape_err = pressure(handle, journal_id, tostring(graph.id))
    if not shape then return nil, shape_err end

    local growth_band = math.floor((nodes - policy.min_nodes) / policy.growth_nodes) + 1
    local roots: number = tonumber(shape.roots) or 0
    local siblings: number = tonumber(shape.siblings) or 0
    local max_roots: number = tonumber(policy.max_roots) or 12
    local max_siblings: number = tonumber(policy.max_siblings) or 12
    local root_band = math.floor(roots / max_roots)
    local sibling_band = math.floor(siblings / max_siblings)
    local trigger_key = table.concat({ "g" .. tostring(growth_band), "r" .. tostring(root_band), "s" .. tostring(sibling_band) }, "-")
    local last_source, last_err = jobs.latest_source_seq(handle, journal_id, tostring(graph.id))
    if last_err then return nil, last_err end
    return {
        key = trigger_key,
        reason = root_band > 0 and "root pressure" or (sibling_band > 0 and "branch pressure" or "graph growth"),
        source_from_seq = math.max(1, math.min(source_seq, (tonumber(last_source) or math.max(0, source_seq - 100)) + 1)),
        source_to_seq = source_seq,
        metrics = { nodes = nodes, roots = roots, max_siblings = siblings },
        policy = policy,
    }, nil
end

return M

local materializer = require("materializer")

local M = {}

local function trim(v: any): string
    return tostring(v or ""):match("^%s*(.-)%s*$") or ""
end

local function graph_id_from(input: any): string
    if type(input) ~= "table" then return "" end
    local thread_id = trim((input :: any).thread_id)
    if thread_id ~= "" then return thread_id end
    local projection = type((input :: any).projection) == "table" and (input :: any).projection or {}
    return trim((projection :: any).thread_id)
end

function M.run(input: any): (any?, error?)
    input = type(input) == "table" and input or {}
    local graph_id = graph_id_from(input)
    if graph_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "graph projection input missing thread_id" }) end

    local db, db_err = materializer.open_db()
    if not db then return nil, db_err end
    local err = materializer.project_events(db, graph_id, type(input.events) == "table" and input.events or {})
    local counts = nil
    if not err then counts, err = materializer.table_counts(db, graph_id) end
    db:release()
    if err then return nil, err end

    local range = type(input.range) == "table" and input.range or {}
    return {
        body = {
            materialized = "chestor_graph_tables",
            counts = counts or {},
            last_seq = tonumber(range.to_seq) or nil,
        },
        last_seq = tonumber(range.to_seq) or nil,
    }
end

return M

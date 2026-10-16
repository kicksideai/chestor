-- Actor-framed Core-reset and frontier bridge for Journal tests. The reset
-- reuses the persisted declaration and the caller's current actor frame.
local queries = require("queries")
local thread_log = require("thread_log")
local types = require("types")
local sql = require("sql")
local json = require("json")
local ops = require("ops")

local M = {}

local function reset(input: any): any
    local journal_id = tostring((input :: any).journal_id or "")
    local threads, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not threads or not thread_id then return { success = false, error = tostring(resolve_err) } end
    local db, db_err = sql.get(types.db_id())
    if not db then return { success = false, error = tostring(db_err) } end
    local rows, query_err = ops.query(db,
        "SELECT id, body FROM kickside_projection WHERE thread_id = ? AND kind = ? AND projection_key = 'state'",
        { thread_id, "chestor.journal:state" })
    db:release()
    if query_err or not rows or not rows[1] then
        return { success = false, error = tostring(query_err or "state projection not found") }
    end
    local row = rows[1] :: any
    local body, decode_err = json.decode(tostring(row.body))
    if decode_err or type(body) ~= "table" then
        return { success = false, error = tostring(decode_err or "state projection body is invalid") }
    end
    local meta = (body :: any).meta or {}
    local result, reset_err = threads:register_projection({
        thread_id = thread_id,
        kind = "chestor.journal:state",
        projection_key = "state",
        cursor_key = "state",
        worker_ref = meta.worker_ref,
        worker_input_mode = meta.worker_input_mode,
        worker_config = (body :: any).worker_config,
        events = (body :: any).events,
        start_seq = 0,
        reset = true,
    })
    if reset_err or not result then return { success = false, error = tostring(reset_err) } end
    if tostring((result :: any).projection_id) ~= tostring(row.id) then
        return { success = false, error = "Core reset changed the projection identity" }
    end
    return { success = true, projection_id = tostring(row.id) }
end

local function frontier(input: any): any
    local page = tonumber((input :: any).frontier_page)
    local previous = queries.FRONTIER_PAGE
    if page then queries.FRONTIER_PAGE = math.floor(page) end
    local value, err = queries.frontier(tostring((input :: any).journal_id or ""),
        (input :: any).args or {})
    queries.FRONTIER_PAGE = previous
    if err then return { success = false, error = tostring(err) } end
    return { success = true, result = value }
end

function M.handle(input: any): any
    input = type(input) == "table" and input or {}
    local op = tostring((input :: any).op or "frontier")
    if op == "reset" then return reset(input) end
    if op == "frontier" then return frontier(input) end
    return { success = false, error = "unknown test bridge operation: " .. op }
end

return M

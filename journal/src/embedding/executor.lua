local recall = require("recall")
local scheduler = require("scheduler")

local M = {}
M._recall = nil

function M.execute(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if type(args.payload) == "table" then args = args.payload end
    local journal_id = tostring(args.journal_id or "")
    if journal_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "journal_id is required" }) end
    local total = 0
    local last_processed = 0
    local continuation_key = ""
    for _ = 1, 4 do
        local result, err = (M._recall or recall).embed_pending(journal_id, 64)
        if not result then return nil, err end
        if result.status == "unavailable" then
            result.embedded = total
            result.record = { status = "parked", error = result.message }
            return result, nil
        end
        last_processed = tonumber(result.processed) or 0
        continuation_key = tostring(result.continuation_key or continuation_key)
        total = total + (tonumber(result.embedded) or 0)
        if last_processed < 64 then break end
    end
    -- A still-full final batch means the backlog is not drained: chain a
    -- follow-up demand so one trigger clears an arbitrarily large
    -- pending set instead of stalling after 4 batches. Stops when a batch
    -- comes back short (nothing left to embed).
    if last_processed >= 64 then
        local schedule_err, state = scheduler.schedule(journal_id, 0, continuation_key)
        if schedule_err then return nil, schedule_err end
        if state and state.status == "unavailable" then
            state.embedded = total
            state.record = { status = "parked", error = state.message }
            return state, nil
        end
    end
    return { embedded = total }, nil
end

return M

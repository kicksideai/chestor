-- Actor-framed bridge for the adversarial suite: the suite calls this
-- function through funcs with an explicit actor so the journal command
-- library runs with the same ambient identity production callers carry.
local commands = require("commands")

local M = {}

function M.handle(input: any): any
    input = type(input) == "table" and input or {}
    local op = tostring((input :: any).op or "")
    local fn = (commands :: any)[op]
    if type(fn) ~= "function" then
        return { success = false, error = "unknown command op: " .. op }
    end
    local traceback: any = nil
    local ok, result, err = xpcall(function(): (any?, string?)
        return fn((input :: any).journal_id, (input :: any).args or {})
    end, function(raised: any): any
        traceback = debug.traceback(tostring(raised), 2)
        return raised
    end)
    if not ok then
        return { success = false, error = "command op " .. op .. " raised: " .. tostring(traceback or result) }
    end
    if err then return { success = false, error = tostring(err) } end
    if result == nil then return { success = false, error = "command returned no result" } end
    return result
end

return M

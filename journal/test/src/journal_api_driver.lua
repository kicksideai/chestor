-- Actor-framed bridge over the HTTP api adapters: the suite calls this through
-- funcs with an explicit actor, so the adapter runs with the same ambient
-- identity and access gate the endpoint handlers pass through. The handler
-- itself only parses the request and hands the parsed body here, and the
-- harness serves no authenticated HTTP client, so the request contract is
-- asserted on the endpoint declaration instead.
local transitions = require("transitions")

local M = {}

function M.handle(input: any): any
    input = type(input) == "table" and input or {}
    local op = tostring((input :: any).op or "")
    if op ~= "transition" then
        return { success = false, error = "unknown api op: " .. op }
    end
    local value, err = transitions.apply(
        tostring((input :: any).journal_id or ""),
        (input :: any).task_id,
        (input :: any).body or {})
    if err then return { success = false, error = tostring(err) } end
    if value == nil then return { success = false, error = "transition returned no result" } end
    return value
end

return M

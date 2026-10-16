-- Actor-framed bridge to the map assembly surface. The suite triggers and reads
-- one assembly through funcs with an explicit actor, so the service runs behind
-- the same access gate the HTTP endpoints pass through.
local graph = require("graph")

local M = {}

function M.handle(input: any): any
    input = type(input) == "table" and input or {}
    local action = tostring((input :: any).action or "status")
    local journal_id = tostring((input :: any).journal_id or "")
    local graph_id = tostring((input :: any).graph_id or "map")
    local value: any = nil
    local err: string? = nil
    if action == "assemble" then
        value, err = graph.assemble(journal_id, graph_id)
    elseif action == "status" then
        value, err = graph.assembly_status(journal_id, graph_id)
    else
        return { success = false, error = "unknown assembly action: " .. action }
    end
    if err then return { success = false, error = tostring(err) } end
    return { success = true, assembly = value }
end

return M

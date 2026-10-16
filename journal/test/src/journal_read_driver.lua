-- Actor-framed read bridge for the read suites: the suite calls one query view
-- through funcs with an explicit actor, so the read library runs with the same
-- ambient identity and access gate the HTTP handlers pass through. args
-- carries per-view options, including the injected reader clock the public
-- surfaces never expose.
local queries = require("queries")

local M = {}

function M.handle(input: any): any
    input = type(input) == "table" and input or {}
    local view = tostring((input :: any).view or "")
    local fn = (queries :: any)[view]
    if type(fn) ~= "function" then
        return { success = false, error = "unknown read view: " .. view }
    end
    local value, err = fn(tostring((input :: any).journal_id or ""), (input :: any).args or {})
    if err then return { success = false, error = tostring(err) } end
    if value == nil then return { success = false, error = "read view " .. view .. " returned no result" } end
    return { success = true, view = view, value = value }
end

return M

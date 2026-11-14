-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
type Object = {[string]: unknown}
local M = {}
-- Multiple rejected windows block until the last reported reset.
function M.reset(limits: Object?): string?
    local latest: integer? = nil
    if limits and type(limits.windows) == "table" then
        for _, window in ipairs(limits.windows) do
            if type(window) == "table" and window.status == "rejected" and type(window.resets_at) == "number" then
                local stamp = math.floor(window.resets_at)
                if not latest or stamp > latest then latest = stamp end
            end
        end
    end
    return latest and time.unix(latest, 0):utc():format_rfc3339() or nil
end
function M.blocked(value: Object?, now: string): boolean
    local reset = M.reset(value)
    return reset ~= nil and reset > now
end
return M

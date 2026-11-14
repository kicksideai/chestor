-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- All byte ceilings keep complete UTF-8 characters from valid input.
local M = {}
function M.head(value: string, limit: integer): string
    if #value <= limit then return value end
    while limit > 0 do
        local byte = value:byte(limit + 1)
        if not byte or byte < 128 or byte >= 192 then break end
        limit = limit - 1
    end
    return value:sub(1, limit)
end
function M.clipped(value: string, limit: integer, dropped: integer): string
    local head = M.head(value, limit)
    local lost = #value - #head + dropped
    if lost > 0 then return head .. " [truncated " .. tostring(lost) .. " bytes]" end
    return head
end
return M

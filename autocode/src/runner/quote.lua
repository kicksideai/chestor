-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POSIX shell quoting for argv rendered as one line. The runtime executor and
-- the container shell both split such a line with shell-like quoting.
local M = {}

function M.posix(argument: string): string
    if #argument > 0 and not argument:find("[^%w%._/:=@%-]") then return argument end
    return "'" .. argument:gsub("'", "'\\''") .. "'"
end

function M.line(argv: {string}): string
    local parts: {string} = {}
    for index, argument in ipairs(argv) do parts[index] = M.posix(argument) end
    return table.concat(parts, " ")
end

return M

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local canonical_json = require("canonical_json")
local M = {}

function M.json(value: unknown, max_bytes: integer): (string?, error?)
    local encoded, err = canonical_json.encode(value)
    if not encoded then return nil, err end
    if #encoded > max_bytes then return nil, errors.new({kind = errors.INVALID, message = "input exceeds " .. tostring(max_bytes) .. " JSON bytes"}) end
    return encoded, nil
end

function M.text(value: unknown, max: integer): string?
    if type(value) ~= "string" then return nil end
    local trimmed = value:match("^%s*(.-)%s*$")
    if #trimmed > max then return nil end
    return trimmed
end

function M.strings(value: unknown, max_items: integer, max_bytes: integer): {string}?
    if type(value) ~= "table" then return nil end
    local result: {string} = table.create(1, 0)
    for key in pairs(value) do
        if type(key) ~= "number" or key < 1 or key > #value or key ~= math.floor(key) then return nil end
    end
    for _, item in ipairs(value) do
        if type(item) ~= "string" or #item > max_bytes then return nil end
        result[#result + 1] = item
    end
    if #result > max_items then return nil end
    return result
end

function M.object(value: unknown): {[string]: unknown}?
    if type(value) ~= "table" then return nil end
    local result: {[string]: unknown} = (canonical_json.object({}) :: {[string]: unknown})
    for key, item in pairs(value) do
        if type(key) ~= "string" then return nil end
        result[key] = item
    end
    return result
end

function M.array(value: {unknown}): {unknown}
    local result: {unknown} = table.create(1, 0)
    for _, item in ipairs(value) do result[#result + 1] = item end
    return result
end

return M

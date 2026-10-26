-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Removes credentials from text before a run stores it: the account's own
-- values (a login file contributes every long string inside it), and any
-- value under a credential-named JSON field, in a URL's userinfo or after
-- "Bearer", which covers credentials the CLI refreshes or a tool prints
-- during the run.
local json = require("json")

type Redactor = {needles: {string}}

local M = {}

M.MIN_LENGTH = 12
M.MARK = "[redacted]"

local function collect(value: unknown, needles: {string})
    if type(value) == "string" then
        if #value >= M.MIN_LENGTH then needles[#needles + 1] = value end
    elseif type(value) == "table" then
        for _, item in pairs(value) do collect(item, needles) end
    end
end

function M.new(secret: string): Redactor
    local needles: {string} = {}
    if #secret > 0 then needles[1] = secret end
    local decoded = json.decode(secret)
    if type(decoded) == "table" then collect(decoded, needles) end
    table.sort(needles, function(a: string, b: string): boolean return #a > #b end)
    return {needles = needles}
end

local SECRET_FIELD = {"token", "secret", "password", "api_key", "apikey", "authorization", "credential"}

local function secret_field(name: string): boolean
    local lowered = name:lower()
    for _, part in ipairs(SECRET_FIELD) do
        if lowered:find(part, 1, true) then return true end
    end
    return false
end

local function structured(text: string): string
    text = text:gsub('("([%w_%-]+)"%s*:%s*")([^"]*)(")', function(prefix: string, name: string, value: string, suffix: string): string
        if #value >= M.MIN_LENGTH and secret_field(name) then return prefix .. M.MARK .. suffix end
        return prefix .. value .. suffix
    end)
    text = text:gsub("(://)([^/%s@]+)@", function(scheme: string, userinfo: string): string
        return scheme .. M.MARK .. "@"
    end)
    text = text:gsub("([Bb]earer%s+)([%w%-%._~%+/=]+)", function(prefix: string, value: string): string
        if #value >= M.MIN_LENGTH then return prefix .. M.MARK end
        return prefix .. value
    end)
    return text
end

function M.apply(redactor: Redactor, text: string): string
    for _, needle in ipairs(redactor.needles) do
        local parts: {string} = {}
        local position = 1
        while true do
            local first, last = text:find(needle, position, true)
            if not first or not last then break end
            parts[#parts + 1] = text:sub(position, first - 1)
            parts[#parts + 1] = M.MARK
            position = last + 1
        end
        if #parts > 0 then
            parts[#parts + 1] = text:sub(position)
            text = table.concat(parts)
        end
    end
    return structured(text)
end

return M

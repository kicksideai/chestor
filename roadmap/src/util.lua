-- Value helpers shared by the roadmap engine files. They live in one entry so the
-- fold, the inverse builder, the queries and the thread API all copy and compare
-- values by exactly the same rules.

local json = require("json")

local M = {}

-- Lua has one table type, so an empty map and an empty array are the same value
-- and the encoder emits an array unless the table's string dictionary was
-- allocated. Decoding "{}" allocates it, which is the runtime's own marker for an
-- empty object; every map-typed field the read shape declares is built from this
-- so the browser receives the object the contract promises.
function M.empty_object(): { [string]: any }
    local decoded = select(1, json.decode("{}"))
    if type(decoded) == "table" then return decoded :: { [string]: any } end
    return {}
end

function M.str(v: any): string
    return tostring(v or "")
end

function M.is_non_empty_string(v: any): boolean
    return type(v) == "string" and v ~= ""
end

function M.copy_array(v: any): { any }
    local out: { any } = {}
    if type(v) ~= "table" then return out end
    for i, item in ipairs(v :: { any }) do out[i] = item end
    return out
end

function M.copy_map(v: any): { [string]: any }
    local out = M.empty_object()
    if type(v) ~= "table" then return out end
    for k, item in pairs(v :: { [string]: any }) do out[k] = item end
    return out
end

-- An empty source table is copied to a table that encodes the same way it does.
-- A fresh {} would always encode as a list, so a deep copy would silently retype
-- every empty object it walked; the encoder itself is asked instead of guessing,
-- which keeps opaque lens state and a record's own list fields intact.
local function copy_empty(v: any): any
    if select(1, json.encode(v)) == "{}" then return M.empty_object() end
    return {}
end

function M.copy_tree(v: any): any
    if type(v) ~= "table" then return v end
    if next(v :: { [any]: any }) == nil then return copy_empty(v) end
    local out = {}
    for k, item in pairs(v :: { [any]: any }) do out[k] = M.copy_tree(item) end
    return out
end

-- A copy of a value the read shape declares to be an object. Nested shapes are
-- preserved as they were, and an empty result is an object: the field is typed by
-- the contract, so the ambiguous empty table a caller may have sent does not get
-- to decide whether it reaches the browser as {} or [].
function M.copy_object(v: any): { [string]: any }
    local copied = M.copy_tree(v)
    if type(copied) ~= "table" or next(copied :: { [any]: any }) == nil then return M.empty_object() end
    return copied :: { [string]: any }
end

function M.has_value(list: any, value: string): boolean
    if type(list) ~= "table" then return false end
    for _, v in ipairs(list :: { any }) do
        if tostring(v) == value then return true end
    end
    return false
end

function M.append_unique(list: any, value: string): { any }
    local out: { any } = type(list) == "table" and (list :: { any }) or {}
    if not M.has_value(out, value) then out[#out + 1] = value end
    return out
end

function M.remove_value(list: any, value: string): { any }
    local out: { any } = {}
    if type(list) ~= "table" then return out end
    for _, v in ipairs(list :: { any }) do
        if tostring(v) ~= value then out[#out + 1] = v end
    end
    return out
end

function M.string_array(v: any): { string }
    local out: { string } = {}
    if type(v) ~= "table" then return out end
    for _, item in ipairs(v :: { any }) do
        local s = tostring(item or "")
        if s ~= "" then out[#out + 1] = s end
    end
    return out
end

-- Membership over a closed vocabulary declared as an ordered array in types.lua.
function M.allows(vocabulary: any, value: any): boolean
    return M.has_value(vocabulary, tostring(value or ""))
end

function M.vocabulary_text(vocabulary: any): string
    local parts: { string } = {}
    for _, v in ipairs(type(vocabulary) == "table" and vocabulary or {}) do
        parts[#parts + 1] = tostring(v)
    end
    return table.concat(parts, ", ")
end

return M

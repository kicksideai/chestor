local json = require("json")
local sql = require("sql")
local types = require("types")

local M = {}

function M.now(): number
    return os.time()
end

function M.trim(value: any): string
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

function M.encode(value: any, fallback: any): string
    local raw = type(value) == "table" and value or fallback
    local encoded, encode_err = json.encode(raw)
    if encode_err or not encoded then return json.encode(fallback) end
    return encoded
end

function M.decode(value: any, fallback: any): any
    if value == nil or value == "" then return fallback end
    if type(value) == "table" then return value end
    local decoded, decode_err = json.decode(tostring(value))
    if decode_err or type(decoded) ~= "table" then return fallback end
    return decoded
end

local CANONICAL_ESCAPES: { [string]: string } = {
    ['"'] = '\\"', ["\\"] = "\\\\", ["\b"] = "\\b", ["\f"] = "\\f",
    ["\n"] = "\\n", ["\r"] = "\\r", ["\t"] = "\\t",
}

local function canonical_quote(text: string): string
    local escaped = text:gsub('[%z\1-\31"\\]', function(character: string): string
        local mapped = CANONICAL_ESCAPES[character]
        if mapped then return mapped end
        return string.format("\\u%04x", string.byte(character))
    end)
    return '"' .. escaped .. '"'
end

local function canonical_write(value: any, out: { string })
    local kind = type(value)
    if kind == "table" then
        local raw = value :: any
        local count = 0
        local max = 0
        local array = true
        for key, _ in pairs(raw) do
            count = count + 1
            if type(key) == "number" and key == math.floor(key :: number) and (key :: number) >= 1 then
                if (key :: number) > max then max = key :: number end
            else
                array = false
            end
        end
        if array and max == count then
            out[#out + 1] = "["
            for index = 1, max do
                if index > 1 then out[#out + 1] = "," end
                canonical_write(raw[index], out)
            end
            out[#out + 1] = "]"
            return
        end
        local keys: { any } = {}
        for key, _ in pairs(raw) do keys[#keys + 1] = key end
        table.sort(keys, function(a: any, b: any): boolean return tostring(a) < tostring(b) end)
        out[#out + 1] = "{"
        for index, key in ipairs(keys) do
            if index > 1 then out[#out + 1] = "," end
            out[#out + 1] = canonical_quote(tostring(key)) .. ":"
            canonical_write(raw[key], out)
        end
        out[#out + 1] = "}"
    elseif kind == "number" then
        local number = value :: number
        if number == math.floor(number) and math.abs(number) < 2 ^ 53 then
            out[#out + 1] = string.format("%d", number)
        else
            out[#out + 1] = tostring(number)
        end
    elseif kind == "string" then
        out[#out + 1] = canonical_quote(value :: string)
    elseif kind == "boolean" then
        out[#out + 1] = tostring(value)
    else
        out[#out + 1] = "null"
    end
end

-- Canonical JSON per F5: sorted keys, no whitespace, integers as-is. The
-- replay-equality comparison and event payload hashing both serialize through
-- this single function so byte-equality is well defined.
function M.canonical(value: any): string
    local out: { string } = {}
    canonical_write(value, out)
    return table.concat(out)
end

function M.open(): (any?, error?)
    local db, db_err = sql.get(types.db_id())
    if db_err then return nil, errors.wrap(db_err, "journal db unavailable") end
    return db, nil
end

local executor_dialects: any = setmetatable({}, { __mode = "k" })

function M.database_type(db: any): (string?, error?)
    local cached = executor_dialects[db]
    if cached then return cached, nil end
    local dialect, dialect_err
    if type(db.type) == "function" then
        dialect, dialect_err = db:type()
    elseif type(db.db_type) == "function" then
        dialect, dialect_err = db:db_type()
    else
        return nil, errors.new({ kind = errors.INTERNAL, message = "journal database executor does not expose its type" })
    end
    if dialect_err then return nil, errors.wrap(dialect_err, "failed to determine journal database type") end
    if tostring(dialect) ~= "sqlite" and tostring(dialect) ~= "postgres" then
        return nil, errors.new({ kind = errors.INTERNAL, message = "unsupported journal database type: " .. tostring(dialect) })
    end
    executor_dialects[db] = tostring(dialect)
    return tostring(dialect), nil
end

function M.prepare(db: any, statement: string): (string?, error?)
    local dialect, dialect_err = M.database_type(db)
    if not dialect then return nil, dialect_err end
    if dialect == "sqlite" then return statement, nil end
    local position = 0
    return (statement:gsub("%?", function(): string
        position = position + 1
        return "$" .. tostring(position)
    end)), nil
end

function M.exec(db: any, statement: string, params: any): error?
    local prepared, prepare_err = M.prepare(db, statement)
    if prepare_err then return prepare_err end
    local _, exec_err = db:execute(prepared :: string, params or {})
    return exec_err
end

-- The row count a guarded write actually changed. A conditional UPDATE is how
-- this module decides a race inside the database - who claimed a cursor
-- revision, which idle span was still idle when the sweep reached it - and the
-- decision is only readable through the affected-row count the driver returns.
function M.exec_affected(db: any, statement: string, params: any): (number?, error?)
    local prepared, prepare_err = M.prepare(db, statement)
    if prepare_err then return nil, prepare_err end
    local result, exec_err = db:execute(prepared :: string, params or {})
    if exec_err then return nil, exec_err end
    return math.floor(tonumber(type(result) == "table" and (result :: any).rows_affected or 0) or 0), nil
end

function M.query(db: any, statement: string, params: any): (any?, error?)
    local prepared, prepare_err = M.prepare(db, statement)
    if prepare_err then return nil, prepare_err end
    local rows, query_err = db:query(prepared :: string, params or {})
    if query_err then return nil, query_err end
    return rows or {}, nil
end

function M.insert_rows(db: any, prefix: string, rows: { any }, width: number, suffix: string, expressions: { string }?): error?
    if width < 1 or width > 900 or width ~= math.floor(width) then
        return errors.new({ kind = errors.INTERNAL, message = "invalid batch insert width" })
    end
    local batch_size = math.min(100, math.floor(900 / width))
    local marks: { string } = {}
    if expressions and #expressions ~= width then
        return errors.new({ kind = errors.INTERNAL, message = "batch insert expression count does not match width" })
    end
    for index = 1, width do marks[#marks + 1] = expressions and expressions[index] or "?" end
    local tuple = "(" .. table.concat(marks, ",") .. ")"
    for offset = 1, #rows, batch_size do
        local values: { string } = {}
        local params: { any } = {}
        local position = 0
        for index = offset, math.min(#rows, offset + batch_size - 1) do
            values[#values + 1] = tuple
            for column = 1, width do position = position + 1; params[position] = rows[index][column] end
        end
        local err = M.exec(db, prefix .. " VALUES " .. table.concat(values, ",") .. " " .. suffix, params)
        if err then return err end
    end
    return nil
end

-- Independent writes share one PostgreSQL data-modifying CTE statement.
function M.write_group(db: any, writes: { any }): error?
    if #writes == 0 then return nil end
    local dialect, type_err = M.database_type(db)
    if not dialect then return type_err end
    if dialect == "sqlite" or #writes == 1 then
        for _, write in ipairs(writes) do
            local err = M.exec(db, write.statement, write.params)
            if err then return err end
        end
        return nil
    end
    local statements: { string } = {}
    local params: { any } = {}
    local position = 0
    for index, write in ipairs(writes) do
        statements[#statements + 1] = "journal_write_" .. tostring(index) .. " AS (" .. write.statement .. ")"
        local _, count = write.statement:gsub("%?", "")
        for column = 1, count do position = position + 1; params[position] = write.params[column] end
    end
    return M.exec(db, "WITH " .. table.concat(statements, ",") .. " SELECT 1", params)
end

return M

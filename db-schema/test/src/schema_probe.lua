local contract = require("contract")
local security = require("security")
local schema_state = require("schema_state")
local types = require("types")

local M = {}

local function pack(key: string, value: any, err: any): any
    local out: any = { ok = err == nil and value ~= nil, err = err and tostring(err) or nil }
    out[key] = value
    return out
end

local function threads(): (any?, string?)
    local def, err = contract.get(types.THREADS)
    if err or not def then return nil, "threads contract unavailable: " .. tostring(err) end
    local c, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if oerr or not c then return nil, "threads open failed: " .. tostring(oerr) end
    return c
end

function M.handle(req: any): any
    req = type(req) == "table" and req or {}
    local op = tostring(req.op or "")
    local input = type(req.input) == "table" and req.input or {}

    if op == "apply" then
        local value, err = schema_state.apply(tostring(input.entry_id or ""), input.commands)
        return pack("schema", value, err)
    end
    if op == "state" then
        local value, err = schema_state.state(tostring(input.entry_id or ""))
        return pack("schema", value, err)
    end
    if op == "tables" then
        local value, err = schema_state.tables(tostring(input.entry_id or ""), input.options or {})
        return pack("result", value, err)
    end
    if op == "relations" then
        local value, err = schema_state.relations(tostring(input.entry_id or ""), input.options or {})
        return pack("result", value, err)
    end
    if op == "indexes" then
        local value, err = schema_state.indexes(tostring(input.entry_id or ""), input.options or {})
        return pack("result", value, err)
    end
    if op == "list_events" then
        local c, err = threads()
        if not c then return pack("result", nil, err) end
        local value, lerr = c:list_events({ thread_id = tostring(input.thread_id or ""), ascending = true, limit = tonumber(input.limit) or 100 })
        return pack("result", value, lerr)
    end
    if op == "destroy" then
        local ok, derr = schema_state.destroy(tostring(input.entry_id or ""))
        return { ok = ok, err = derr }
    end
    return { ok = false, err = "unknown op: " .. op }
end

return M

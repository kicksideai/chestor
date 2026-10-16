local contract = require("contract")
local security = require("security")
local roadmap = require("roadmap")
local types = require("types")

local M = {}

local function pack(key: string, value: any, err: any): any
    local out: any = {
        ok = err == nil and value ~= nil,
        err = err and tostring(err) or nil,
    }
    out[key] = value
    return out
end

local function threads(): (any?, string?)
    local def, err = contract.get(types.THREADS)
    if err or not def then return nil, "threads contract unavailable: " .. tostring(err) end
    local c, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if oerr or not c then return nil, "threads open failed: " .. tostring(oerr) end
    return c, nil
end

function M.handle(req: any): any
    req = type(req) == "table" and req or {}
    local op = tostring(req.op or "")
    local input = type(req.input) == "table" and req.input or {}
    local entry_id = tostring(input.entry_id or "")

    if op == "apply" then
        local value, err = roadmap.apply(entry_id, input.commands)
        return pack("roadmap", value, err)
    end

    if op == "state" then
        local value, err = roadmap.state(entry_id)
        return pack("roadmap", value, err)
    end

    if op == "undo" then
        local value, err = roadmap.undo(entry_id)
        return pack("roadmap", value, err)
    end

    if op == "redo" then
        local value, err = roadmap.redo(entry_id)
        return pack("roadmap", value, err)
    end

    if op == "initiatives" then
        local value, err = roadmap.initiatives(entry_id, input.options or {})
        return pack("result", value, err)
    end

    if op == "dependencies" then
        local value, err = roadmap.dependencies(entry_id, input.options or {})
        return pack("result", value, err)
    end

    if op == "critical" then
        local value, err = roadmap.critical(entry_id, input.top)
        return pack("result", value, err)
    end

    if op == "schema" then
        local value, err = roadmap.schema()
        return pack("result", value, err)
    end

    if op == "list_events" then
        local c, err = threads()
        if not c then return pack("result", nil, err) end
        local value, lerr = c:list_events({
            thread_id = tostring(input.thread_id or ""),
            ascending = input.ascending ~= false,
            limit = tonumber(input.limit) or 100,
        })
        return pack("result", value, lerr)
    end

    if op == "catch_up" then
        local c, err = threads()
        if not c then return pack("result", nil, err) end
        local value, cerr = c:catch_up_projection({
            thread_id = tostring(input.thread_id or ""),
            kind = types.PROJECTION_KIND,
            max_ticks = tonumber(input.max_ticks) or 50,
        })
        return pack("result", value, cerr)
    end

    if op == "destroy" then
        local ok, derr = roadmap.destroy(entry_id)
        return { ok = ok, err = derr }
    end

    return { ok = false, err = "unknown op: " .. op }
end

return M

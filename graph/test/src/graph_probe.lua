local contract = require("contract")
local security = require("security")
local graph = require("graph")
local types = require("types")
local workspace = require("workspace")

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
    return c
end

function M.handle(req: any): any
    req = type(req) == "table" and req or {}
    local op = tostring(req.op or "")
    local input = type(req.input) == "table" and req.input or {}

    if op == "create" then
        local value, err = workspace.create(input)
        return pack("entry", value, err)
    end

    if op == "apply" then
        local value, err = graph.apply(tostring(input.entry_id or ""), input.commands)
        return pack("graph", value, err)
    end

    if op == "state" then
        local value, err = graph.state(tostring(input.entry_id or ""))
        return pack("graph", value, err)
    end

    if op == "undo" then
        local value, err = graph.undo(tostring(input.entry_id or ""))
        return pack("graph", value, err)
    end

    if op == "redo" then
        local value, err = graph.redo(tostring(input.entry_id or ""))
        return pack("graph", value, err)
    end

    if op == "nodes" then
        local value, err = graph.nodes(tostring(input.entry_id or ""), input.options or {})
        return pack("result", value, err)
    end

    if op == "edges" then
        local value, err = graph.edges(tostring(input.entry_id or ""), input.options or {})
        return pack("result", value, err)
    end

    if op == "materials" then
        local value, err = graph.materials(tostring(input.entry_id or ""), input.options or {})
        return pack("result", value, err)
    end

    if op == "schema" then
        local value, err = graph.schema(tostring(input.entry_id or ""), input.options or {})
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
        local ok, derr = graph.destroy(tostring(input.entry_id or ""))
        return { ok = ok, err = derr }
    end

    return { ok = false, err = "unknown op: " .. op }
end

return M

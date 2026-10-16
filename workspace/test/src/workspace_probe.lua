local handlers = require("handlers")

local M = {}

local function pack(value: any, err: any): any
    return {
        ok = err == nil and value ~= nil,
        entry = value,
        err = err and tostring(err) or nil,
        denied = err ~= nil and errors.is(err, errors.PERMISSION_DENIED),
    }
end

function M.handle(req: any): any
    req = type(req) == "table" and req or {}
    local op = tostring(req.op or "")
    local input = type(req.input) == "table" and req.input or {}

    if op == "create" then
        local value, err = handlers.create(input)
        return pack(value, err)
    end
    if op == "materialize" then
        local value, err = handlers.materialize(input)
        return pack(value, err)
    end
    if op == "get" then
        local value, err = handlers.get(tostring(input.id or ""))
        return pack(value, err)
    end
    if op == "list" then
        local value, err = handlers.list(input.parent_id)
        return {
            ok = err == nil,
            entries = value,
            err = err and tostring(err) or nil,
            denied = err ~= nil and errors.is(err, errors.PERMISSION_DENIED),
        }
    end
    if op == "update" then
        local value, err = handlers.update(tostring(input.id or ""), input)
        return pack(value, err)
    end
    if op == "move" then
        local value, err = handlers.move(tostring(input.id or ""), input.parent_id)
        return pack(value, err)
    end
    if op == "delete" then
        local value, err = handlers.delete(tostring(input.id or ""))
        return pack(value, err)
    end
    if op == "delete_by_upload" then
        return { ok = true, count = handlers.delete_by_upload(tostring(input.upload_id or "")) }
    end
    if op == "find_by_upload" then
        return { ok = true, found = handlers.find_by_upload(tostring(input.upload_id or "")) }
    end

    return { ok = false, err = "unknown op: " .. op }
end

return M

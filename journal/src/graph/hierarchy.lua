local db = require("db")

local M = {}

local function trim(value: any): string
    return db.trim(value)
end

local function stored_parent(tx: any, journal_id: string, graph_id: string, node_id: string): (string?, error?)
    local rows, err = db.query(tx, [[
        SELECT parent_id FROM chestor_journal_graph_nodes
         WHERE journal_id = ? AND graph_id = ? AND id = ?
    ]], { journal_id, graph_id, node_id })
    if err then return nil, err end
    if not rows or not rows[1] then return nil, errors.new({ kind = errors.NOT_FOUND, message = "graph parent node not found: " .. node_id }) end
    local parent = trim(rows[1].parent_id)
    return parent ~= "" and parent or nil, nil
end

function M.validate(tx: any, journal_id: string, graph_id: string, operations: any): error?
    local additions, patches = {}, {}
    for _, raw in ipairs(type(operations) == "table" and operations or {}) do
        local op: any = raw
        local node_id = trim(op.id)
        if op.op == "node.add" then additions[node_id] = true end
        if (op.op == "node.add" or op.op == "node.update") and op.parent_id ~= nil then
            local parent = trim(op.parent_id)
            patches[node_id] = { parent = parent ~= "" and parent or nil }
        end
    end

    for raw_node_id, patch in pairs(patches) do
        local node_id = tostring(raw_node_id)
        local cursor = patch.parent
        local seen = { [node_id] = true }
        local depth = 0
        while cursor do
            cursor = tostring(cursor)
            if seen[cursor] then return errors.new({ kind = errors.INVALID, message = "graph hierarchy cycle detected at node: " .. cursor }) end
            seen[cursor] = true
            depth = depth + 1
            if depth > 64 then return errors.new({ kind = errors.INVALID, message = "graph hierarchy exceeds maximum depth of 64" }) end
            local pending = patches[cursor]
            if pending then
                cursor = pending.parent
            elseif additions[cursor] then
                cursor = nil
            else
                local parent, parent_err = stored_parent(tx, journal_id, graph_id, cursor)
                if parent_err then return parent_err end
                cursor = parent
            end
        end
    end
    return nil
end

return M

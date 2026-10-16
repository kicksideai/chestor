local db = require("db")

local M = {}

local ALLOWED = {
    ["node.add"] = true, ["node.update"] = true, ["node.remove"] = true,
    ["edge.add"] = true, ["edge.update"] = true, ["edge.remove"] = true,
    ["layout.position-set"] = true, ["layout.position-cleared"] = true,
}

local function copy(value: any): any
    local out = {}
    if type(value) ~= "table" then return out end
    for key, item in pairs(value :: any) do out[key] = item end
    return out
end

function M.normalize(input: any): (any?, any?)
    if type(input) ~= "table" then return nil, errors.new({ message = "graph operation request must be an object", kind = errors.INVALID }) end
    local graph_id = db.trim((input :: any).graph_id)
    if graph_id == "" then return nil, errors.new({ message = "graph_id is required", kind = errors.INVALID }) end
    local request_id = db.trim((input :: any).request_id or (input :: any).idempotency_key)
    if request_id == "" then return nil, errors.new({ message = "request_id or idempotency_key is required", kind = errors.INVALID }) end
    local raw_operations = (input :: any).operations
    if type(raw_operations) ~= "table" or #raw_operations == 0 then return nil, errors.new({ message = "operations array required", kind = errors.INVALID }) end
    if #raw_operations > 200 then return nil, errors.new({ message = "operations exceeds maximum of 200", kind = errors.INVALID }) end
    local operations = {}
    for index, raw in ipairs(raw_operations :: { any }) do
        if type(raw) ~= "table" then return nil, errors.new({ message = "operations[" .. tostring(index) .. "] must be an object", kind = errors.INVALID }) end
        local op = db.trim((raw :: any).op or (raw :: any).type)
        if not ALLOWED[op] then return nil, errors.new({ message = "unknown graph operation at [" .. tostring(index) .. "]: " .. op, kind = errors.INVALID }) end
        local item = copy(raw)
        item.op = op
        item.id = db.trim(item.id or item.node_id or item.edge_id)
        if item.id == "" then return nil, errors.new({ message = "operations[" .. tostring(index) .. "].id is required", kind = errors.INVALID }) end
        if op == "node.add" or op == "node.update" then
            if item.metadata == nil and type(item.attrs) == "table" then item.metadata = copy(item.attrs) end
            local declarative: any = {}
            if item.content ~= nil then declarative.content = item.content end
            if item.documents ~= nil then declarative.documents = item.documents end
            if item.presentation ~= nil then declarative.presentation = item.presentation end
            if next(declarative) then
                if op == "node.add" then
                    item.metadata = type(item.metadata) == "table" and copy(item.metadata) or {}
                    for key, value in pairs(declarative) do item.metadata[key] = value end
                else
                    item.attrs_patch = type(item.attrs_patch) == "table" and copy(item.attrs_patch) or {}
                    for key, value in pairs(declarative) do item.attrs_patch[key] = value end
                end
            end
            item.attrs = nil
            item.content = nil
            item.documents = nil
            item.presentation = nil
        end
        if op == "edge.add" or op == "edge.update" then
            item.from = db.trim(item.from or item.from_node_id)
            item.to = db.trim(item.to or item.to_node_id)
            if op == "edge.add" and (item.from == "" or item.to == "") then
                return nil, errors.new({ message = "edge.add requires from and to", kind = errors.INVALID })
            end
        end
        if op == "layout.position-set" then
            item.x = tonumber(item.x)
            item.y = tonumber(item.y)
            if not item.x or not item.y then return nil, errors.new({ message = "layout.position-set requires numeric x and y", kind = errors.INVALID }) end
        end
        operations[#operations + 1] = item
    end
    return {
        graph_id = graph_id,
        request_id = request_id,
        expected_revision = tonumber((input :: any).expected_revision),
        origin = db.trim((input :: any).origin) ~= "" and db.trim((input :: any).origin) or "human",
        source_event_ids = type((input :: any).source_event_ids) == "table" and (input :: any).source_event_ids or {},
        provenance = type((input :: any).provenance) == "table" and (input :: any).provenance or {},
        operations = operations,
    }, nil
end

return M

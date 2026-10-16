local commands = require("commands")
local context = require("context")
local support = require("support")

local COMMAND = {
    open = "open_cursor",
    move = "move_cursor",
    checkpoint = "checkpoint_cursor",
    close = "close_cursor",
    integrate = "record_integration",
}

local function payload(input: any): any
    local out: any = {}
    for key, value in pairs(type(input) == "table" and input or {}) do
        if key ~= "journal_id" and key ~= "op" then out[key] = value end
    end
    if type(out.address) == "table" then
        out.graph_id = out.graph_id or (out.address :: any).graph_id
        out.node_id = out.node_id or (out.address :: any).node_id
        out.address = nil
    end
    if support.trim(out.reason) == "" then out.reason = out.why end
    if support.trim(out.cursor_id) == "" then out.cursor_id = support.cursor_handle(input) end
    local parent_handle = support.trim(input and input.parent_handle)
    if support.trim(out.parent_cursor_id) == "" and parent_handle ~= "" then
        out.parent_cursor_id = parent_handle
    end
    local child_handle = support.trim(input and input.child_handle)
    if support.trim(out.child_cursor_id) == "" and child_handle ~= "" then
        out.child_cursor_id = child_handle
    end
    out.parent_handle = nil
    out.child_handle = nil
    return out
end

local function handler(input: any): (any?, any?)
    local request: any = {}
    for key, item in pairs(type(input) == "table" and input or {}) do request[key] = item end
    if type(request.continuation) == "table" then
        for key, item in pairs(request.continuation) do
            if request[key] == nil then request[key] = item end
        end
        request.continuation = nil
    end
    input = request
    local op = string.lower(support.trim(input and input.op))
    if op == "" then op = "resume" end
    local fallback = op == "open" and support.trim(input and input.parent_handle) or nil
    local journal_id, _, resolution, resolution_err = support.resolve_journal(input, fallback)
    if resolution_err then return nil, resolution_err end
    if not journal_id then return resolution end
    if op == "resume" then
        local value, err = context.cursor(journal_id, payload(input))
        if err then return nil, err end
        value.op = op
        local route_handle = support.cursor_handle(value.cursor, support.cursor_handle(input))
        value.handle = route_handle
        if type(value.next) == "table" then
            support.route_continuation(value.next.checkpoint, route_handle, journal_id)
            support.route_continuation(value.next.rotate, route_handle, journal_id)
        end
        return support.bind_continuations(value, route_handle, journal_id)
    end
    local command = COMMAND[op]
    if not command then
        return { success = false, journal_id = journal_id, op = op,
            error = "op must be resume, open, move, checkpoint, close, or integrate" }
    end
    local value: any, err = (commands :: any)[command](journal_id, payload(input))
    if err then return nil, err end
    value = type(value) == "table" and value or { success = true }
    local result = value :: any
    result.journal_id = journal_id
    result.op = op
    result.handle = result.cursor_id or support.cursor_handle(input)
    result.parent_handle = result.parent_cursor_id
    if result.max_seq == nil and type(result.receipt) == "table" then
        result.max_seq = (result.receipt :: any).max_seq
    end
    return value
end

return { handler = handler }

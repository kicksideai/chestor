local graph = require("graph")
local support = require("support")

local function payload(input: any): any
    local out: any = {}
    for key, value in pairs(type(input) == "table" and input or {}) do
        if key ~= "action" and key ~= "handle" and key ~= "cursor_id" then out[key] = value end
    end
    if type(out.operations) ~= "table" and type(out.operation) == "table" then
        out.operations = { out.operation }
    end
    out.operation = nil
    return out
end

local function handler(input: any): (any?, any?)
    local handle = support.cursor_handle(input)
    local journal_id, cursor, resolution, resolution_err = support.resolve_journal(input, handle)
    if resolution_err then return nil, resolution_err end
    if not journal_id then return resolution end
    local action = string.lower(support.trim(input and input.action))
    if action == "" then action = "apply" end
    local value: any
    local err: any
    if action == "create" or action == "configure" then
        local body = payload(input)
        if cursor and support.trim(body.graph_id) == "" then body.graph_id = (cursor :: any).current_graph_id end
        if body.expected_config_revision == nil then
            if action == "create" then
                -- Create must never silently replace a graph that appeared
                -- after the caller formed its request.
                body.expected_config_revision = 0
            elseif support.trim(body.graph_id) ~= "" then
                local current, current_err = graph.describe(journal_id, tostring(body.graph_id))
                if not current then return nil, current_err end
                body.expected_config_revision = tonumber((current :: any).config_revision) or 0
            end
        end
        value, err = graph.configure(journal_id, body)
    elseif action == "apply" then
        local body = payload(input)
        if cursor and support.trim(body.graph_id) == "" then body.graph_id = (cursor :: any).current_graph_id end
        if body.expected_revision == nil and support.trim(body.graph_id) ~= "" then
            local current, current_err = graph.describe(journal_id, tostring(body.graph_id))
            if not current then return nil, current_err end
            body.expected_revision = tonumber((current :: any).revision) or 0
        end
        value, err = graph.apply(journal_id, body)
    elseif action == "assemble" or action == "status" then
        local graph_id = support.trim(input and input.graph_id)
        if graph_id == "" and cursor then graph_id = support.trim((cursor :: any).current_graph_id) end
        if graph_id == "" then graph_id = "map" end
        if action == "assemble" then value, err = graph.assemble(journal_id, graph_id)
        else value, err = graph.assembly_status(journal_id, graph_id) end
    else
        return { success = false, journal_id = journal_id,
            error = "action must be create, configure, apply, assemble, or status" }
    end
    if err then return nil, err end
    value = type(value) == "table" and value or { success = true }
    local result = value :: any
    result.success = result.success ~= false
    if support.trim(input and input.detail) == "full" then result.action = action; return value end
    local verify = result.request_id and {
        mode = "request", request_id = result.request_id, graph_id = result.graph_id,
    } or nil
    support.route_continuation(verify, handle, journal_id)
    return {
        success = result.success ~= false,
        accepted = result.accepted == false and false or nil,
        action = action,
        handle = handle ~= "" and handle or nil,
        graph_id = result.graph_id,
        request_id = result.request_id,
        status = result.status,
        run_id = result.run_id,
        running = result.running,
        events_replayed = result.events_replayed,
        model = result.model,
        expected_revision = result.expected_revision,
        expected_config_revision = result.expected_config_revision,
        touched = result.touched,
        verify = verify,
        max_seq = result.max_seq,
        error = result.error,
    }
end

return { handler = handler }

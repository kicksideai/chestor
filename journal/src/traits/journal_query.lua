local query_tool = require("query_tool")
local support = require("support")
local queries = require("queries")
local recall = require("recall")

local function handler(input: any): (any?, any?)
    local request: any = {}
    for key, item in pairs(type(input) == "table" and input or {}) do request[key] = item end
    if type(request.continuation) == "table" then
        for key, item in pairs(request.continuation) do
            if request[key] == nil then request[key] = item end
        end
        request.continuation = nil
    end
    local handle = support.cursor_handle(request)
    local journal_id, cursor, resolution, resolution_err = support.resolve_journal(request, handle)
    if resolution_err then return nil, resolution_err end
    if not journal_id then return resolution end
    request.journal_id = journal_id
    if cursor then
        request.graph_id = support.trim(request.graph_id) ~= "" and request.graph_id
            or (cursor :: any).current_graph_id
        local mode = string.lower(support.trim(request.mode))
        if mode == "" then mode = "neighbors"; request.mode = mode end
        if (mode == "node" or mode == "path" or mode == "neighbors" or mode == "context")
            and support.trim(request.node_id) == "" then
            request.node_id = (cursor :: any).current_node_id
        end
        if (mode == "window" or mode == "subtree") and support.trim(request.root_id) == "" then
            request.root_id = (cursor :: any).current_node_id
        end
        if mode == "evidence" and support.trim(request.target_id) == "" then
            request.target_type = "node"
            request.target_id = (cursor :: any).current_node_id
        end
    end
    if string.lower(support.trim(request.mode)) == "events" then
        local result, events_err = queries.changes(journal_id, request)
        if not result then return nil, events_err end
        if (result :: any).has_more == true then
            (result :: any).continuation = {
                mode = "events",
                scope = request.scope or (result :: any).scope,
                task_id = request.task_id or (result :: any).task_id,
                since_seq = tonumber((result :: any).next_cursor) or 0,
                limit = tonumber((result :: any).limit) or tonumber(request.limit) or 100,
            }
        end
        result.events = support.summary_rows(result.events, request.fields)
        if result.continuation then result.continuation.fields = request.fields end
        local value = { success = true, result = result,
            handle = handle ~= "" and handle or nil }
        support.maintain_position(journal_id, { cursor_id = handle }, value)
        return support.bind_continuations(value, handle, journal_id)
    end
    if string.lower(support.trim(request.mode)) == "memory" then
        local result, memory_err = recall.search(journal_id, tostring(request.query or ""), request)
        if not result then return nil, memory_err end
        if (result :: any).has_more == true then
            (result :: any).continuation = {
                mode = "memory", query = request.query,
                from_time = request.from_time, to_time = request.to_time,
                validity = request.validity,
                offset = (tonumber((result :: any).offset) or 0) + #((result :: any).events or {}),
                limit = tonumber((result :: any).limit) or tonumber(request.limit) or 20,
            }
        end
        result.events = support.summary_rows(result.events, request.fields)
        if result.continuation then result.continuation.fields = request.fields end
        local value = { success = true, result = result,
            handle = handle ~= "" and handle or nil }
        support.maintain_position(journal_id, { cursor_id = handle }, value)
        return support.bind_continuations(value, handle, journal_id)
    end
    local value, query_err = query_tool.handle(request)
    if query_err then return nil, query_err end
    if type(value) == "table" and handle ~= "" then (value :: any).handle = handle end
    return support.bind_continuations(value, handle, journal_id)
end

return { handler = handler }

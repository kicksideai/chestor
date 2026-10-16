local record_tool = require("record_tool")
local support = require("support")

local function handler(input: any): (any?, any?)
    local request: any = {}
    for key, item in pairs(type(input) == "table" and input or {}) do request[key] = item end
    local data: any = {}
    for key, item in pairs(type(request.data) == "table" and request.data or {}) do data[key] = item end
    -- The common MCP shape is flat: JournalFact(handle, kind, title, body).
    -- Keep data={} as a backward-compatible escape hatch for advanced event
    -- payloads, with explicit nested fields winning over flat defaults.
    for key, item in pairs(request) do
        if key ~= "journal_id" and key ~= "id" and key ~= "handle"
            and key ~= "kind" and key ~= "detail" and key ~= "data"
            and data[key] == nil then data[key] = item end
    end
    local handle = support.cursor_handle(request, data.cursor_id)
    if support.trim(data.cursor_id) == "" and handle ~= "" then data.cursor_id = handle end
    request.data = data
    local journal_id, cursor, resolution, resolution_err = support.resolve_journal(request, handle)
    if resolution_err then return nil, resolution_err end
    if not journal_id then return resolution end
    request.journal_id = journal_id
    local value, record_err = record_tool.handler(request)
    if record_err then return nil, record_err end
    if type(value) ~= "table" then return value end
    local result = value :: any
    result.handle = result.cursor_id or (handle ~= "" and handle or nil)
    result.kind = request.kind
    local graph_id = support.trim(result.graph_id or (cursor and (cursor :: any).current_graph_id))
    local node_id = support.trim(result.node_id or (cursor and (cursor :: any).current_node_id))
    if result.address == nil and graph_id ~= "" and node_id ~= "" then
        result.address = { graph_id = graph_id, node_id = node_id }
    end
    if result.max_seq == nil and type(result.receipt) == "table" then
        result.max_seq = (result.receipt :: any).max_seq
    end
    return value
end

return { handler = handler }

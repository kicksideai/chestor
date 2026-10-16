local graph = require("graph")
local support = require("support")
local M = {}

function M.handle(input: any): (any?, any?)
    local journal_id, id_err = support.journal_id(input)
    if not journal_id then return { success = false, error = id_err } end
    local value, err = graph.query(journal_id, support.trim(input and input.graph_id), input or {})
    if err then return nil, err end
    local mode = string.lower(support.trim(input and input.mode))
    if mode == "catalog" or mode == "search" or mode == "semantic" or mode == "hybrid"
        or mode == "timeline" or mode == "evidence" or mode == "changes" or mode == "" then
        if value.items then value.items = support.summary_rows(value.items, input and input.fields) end
        if value.changes then value.changes = support.summary_rows(value.changes, input and input.fields) end
        if mode == "changes" and value.graph then
            value.graph = support.summary_rows({ value.graph }, input and input.fields)[1]
        end
    elseif mode == "node" and support.trim(input and input.event_id) ~= "" then
        for _, item in ipairs(value.items or {}) do
            item.node = support.summary_rows({ item.node }, input and input.fields)[1]
        end
    end
    if value.continuation and input and input.fields then value.continuation.fields = input.fields end
    return { success = true, result = value }
end

function M.handler(input: any): (any?, any?)
    return M.handle(input)
end

return M

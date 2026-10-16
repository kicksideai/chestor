local graph = require("graph")

local function render_node(lines: { string }, node: any, depth: integer)
    local indent = string.rep("  ", depth)
    lines[#lines + 1] = indent .. "- " .. tostring(node.name or node.id) .. " [" .. tostring(node.type or "node") .. "]"
    if node.description and node.description ~= "" then lines[#lines + 1] = indent .. "  " .. tostring(node.description) end
    for _, material in ipairs(type(node.materials) == "table" and node.materials or {}) do
        lines[#lines + 1] = indent .. "  material: " .. tostring((material :: any).title or (material :: any).id) .. " (" .. tostring((material :: any).kind or "material") .. ")"
    end
    for _, child in ipairs(type(node.children) == "table" and node.children or {}) do
        render_node(lines, child, depth + 1)
    end
end

local function handler(input)
    local entry = input and input.entry
    if not entry then return { success = false, error = "entry required" } end
    local state, err = graph.state(tostring(entry.id))
    if err then return nil, err end
    local lines = { "# " .. tostring(entry.name or "Graph"), "Type: graph", "" }
    for _, node in ipairs(type((state :: any).nodes) == "table" and (state :: any).nodes or {}) do
        render_node(lines, node, 0)
    end
    if type((state :: any).edges) == "table" and #(state :: any).edges > 0 then
        lines[#lines + 1] = ""
        lines[#lines + 1] = "## Edges"
        for _, edge in ipairs((state :: any).edges) do
            lines[#lines + 1] = "- " .. tostring((edge :: any).source_id) .. " -> " .. tostring((edge :: any).target_id) .. " [" .. tostring((edge :: any).type or "edge") .. "]"
        end
    end
    return { success = true, type = "graph", text = table.concat(lines, "\n") }
end

return { handler = handler }

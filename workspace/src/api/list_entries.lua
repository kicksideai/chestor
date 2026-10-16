local http = require("http")
local handlers = require("handlers")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local entries, err = handlers.list(req:query("parent_id"))
    if err then return support.fail(res, err) end
    local items = {}
    for _, entry in ipairs(entries) do
        table.insert(items, { id = entry.id, label = entry.name ~= "" and entry.name or "Untitled component", icon = entry.icon })
    end
    res:write_json({ success = true, entries = entries, items = items })
end

return { handler = handler }

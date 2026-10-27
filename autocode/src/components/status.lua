-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local component = require("component")

local function status(): {[string]: unknown}
    local id = ctx.get("component_id")
    local rows = type(id) == "string" and id ~= "" and component.list_system({component_ids = {id}, include = {meta = true}, limit = 1}) or nil
    local meta = rows and rows[1] and rows[1].meta
    local value = type(meta) == "table" and meta.status or nil
    if type(value) ~= "string" or value == "" then value = "ready" end
    return {description = value}
end

return { status = status }

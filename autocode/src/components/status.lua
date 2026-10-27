-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local component = require("component")

local function status(): ({[string]: unknown}?, error?)
    local id = ctx.get("component_id")
    if type(id) ~= "string" or id == "" then
        return nil, errors.new({kind = errors.INVALID, message = "component_id is required"})
    end
    local rows, err = component.query({component_ids = {id}, include = {meta = true}, limit = 1})
    if err then return nil, err end
    local meta = rows and rows[1] and rows[1].meta
    local value = type(meta) == "table" and meta.status or nil
    if type(value) ~= "string" or value == "" then value = "ready" end
    return {description = value}, nil
end

return { status = status }

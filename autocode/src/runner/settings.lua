-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reads the autocode settings administrators edit on the Settings page; each
-- one is declared with its default in the module root.
local contract = require("contract")

local SETTINGS = "kickside.settings:settings"
local NAMESPACE = "chestor.autocode"

type Key = "run_timeout" | "account_cooldown" | "run_retention"

local M = {}

-- get returns a duration setting as the string an administrator stored, or
-- its declared default.
function M.get(key: Key): (string?, error?)
    local definition, definition_err = contract.get(SETTINGS)
    if not definition then return nil, definition_err end
    local instance, open_err = definition:open()
    if not instance then return nil, open_err end
    local result, get_err = instance:get({namespace = NAMESPACE, key = key})
    if get_err then return nil, get_err :: error end
    if type(result) ~= "table" or result.success ~= true or type(result.value) ~= "string" then
        return nil, errors.new({kind = errors.INTERNAL, message = "setting " .. NAMESPACE .. "." .. key .. " has no duration value"})
    end
    return result.value, nil
end

return M

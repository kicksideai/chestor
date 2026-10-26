-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local json = require("json")
local security = require("security")

type Object = {[string]: unknown}
local M = {}
function M.error(kind: string, code: string, message: string): error
    return errors.new({kind = kind, message = message, retryable = false, details = {code = code}})
end
function M.native(err: error?): error?
    if not err then return nil end
    local details: {[string]: unknown} = {}
    for key, value in pairs(err:details() or {}) do if type(key) == "string" then details[key] = value end end
    if type(details.code) ~= "string" then details.code = "autocode." .. err:kind() end
    return errors.new({kind = err:kind(), message = err:message(), retryable = err:retryable() == true, details = details})
end
function M.input(contract_id: string, method: string, value: unknown): (Object?, error?)
    if not security.actor() or security.can("access", "chestor.autocode:tasks") ~= true then
        return nil, M.error(errors.PERMISSION_DENIED, "autocode.access_denied", "autocode access required")
    end
    if type(value) ~= "table" then return nil, M.error(errors.INVALID, "autocode.invalid_request", "request must be an object") end
    local definition, err = registry.get(contract_id)
    if not definition then return nil, M.native(err) end
    for _, entry in ipairs(definition.data.methods) do
        if entry.name == method then
            local result: Object = {}
            local schema = entry.input_schemas[1].definition
            local decoded = type(schema) == "string" and json.decode(schema) or schema
            if type(decoded) ~= "table" then return nil, M.error(errors.INTERNAL, "autocode.invalid_schema", "input schema must be an object") end
            for key, item in pairs(value) do
                if type(key) ~= "string" then return nil, M.error(errors.INVALID, "autocode.invalid_request", "request must be an object") end
                local field = type(decoded.properties) == "table" and decoded.properties[key] or nil
                if type(item) == "string" and type(field) == "table" and (field.type == "integer" or field.type == "number") then
                    result[key] = tonumber(item) or item
                else result[key] = item end
            end
            local valid, problem = json.validate(schema, result)
            if valid ~= true then return nil, M.error(errors.INVALID, "autocode.invalid_request", tostring(problem)) end
            return result, nil
        end
    end
    return nil, M.error(errors.INTERNAL, "autocode.missing_method", "contract method is not declared")
end
return M

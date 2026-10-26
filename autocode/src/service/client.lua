-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local boundary = require("boundary")
type Object = {[string]: unknown}
type Service = {[string]: (Service, Object) -> (Object?, error?)}
local M = {}
function M.call(contract_id: string, method: string, input: Object, context: Object?): (Object?, error?)
    local definition, err = contract.get(contract_id)
    if not definition then return nil, boundary.native(err) end
    if context then definition = definition:with_context(context) end
    local instance, open_err = definition:open()
    if not instance then return nil, boundary.native(open_err) end
    if (type(instance) ~= "table" and type(instance) ~= "userdata") or type(instance[method]) ~= "function" then
        return nil, boundary.error(errors.INTERNAL, "autocode.missing_method", "contract method is not bound")
    end
    local service = instance :: Service
    local target = service[method]
    if not target then return nil, boundary.error(errors.INTERNAL, "autocode.missing_method", "contract method is not bound") end
    local result, call_err = target(service, input)
    return result, boundary.native(call_err)
end
return M

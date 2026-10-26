-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local function call(args)
    local definition, err = contract.get(args.contract or "chestor.autocode:tasks")
    if not definition then return nil, err end
    local service, open_err = definition:open()
    if not service then return nil, open_err end
    return service[args.method](service, args.input or {})
end
return {call = call, resume_dispatch = function(input) return funcs.call("chestor.autocode.blocks:resume", input) end}

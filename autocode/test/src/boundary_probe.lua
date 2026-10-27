-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local resources = require("resources")

local function cleanup(args: {kind: resources.Kind, id: string}): (unknown, error?)
    local definition, definition_err = contract.get("kickside.contract:deletable")
    if not definition then return nil, definition_err end
    local instance, open_err = definition:open(resources.KINDS[args.kind], {component_id = args.id})
    if not instance then return nil, open_err end
    return instance:delete({})
end

return {cleanup = cleanup}

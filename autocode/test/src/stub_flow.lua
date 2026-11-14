-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stubs = require("stubs")
return {call = function(target, args)
    stubs.state.arm_target, stubs.state.arm_args = target, args
    return nil, stubs.state.flow_error
end}

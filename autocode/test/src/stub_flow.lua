-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stubs = require("stubs")
return {get = function() return nil, stubs.state.flow_error end}

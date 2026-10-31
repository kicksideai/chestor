-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stubs = require("stubs")
return {get = function()
    return {open = function()
        return {notify = function()
            if stubs.state.realtime_error then return nil, stubs.state.realtime_error end
            return {success = true}
        end}
    end}
end}

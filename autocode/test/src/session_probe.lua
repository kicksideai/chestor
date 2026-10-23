-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reports the actor and scope a call runs under.
local security = require("security")

local function run(endpoint_id: string): {actor: string?, access: boolean}
    local actor = security.actor()
    return {actor = actor and actor:id() or nil, access = security.can("access", endpoint_id) == true}
end

return { run = run }

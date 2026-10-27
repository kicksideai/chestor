-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reports the actor and scope a call runs under.
local security = require("security")

local function run(resource_id: string, action: string?): {actor: string?, access: boolean}
    local actor = security.actor()
    return {actor = actor and actor:id() or nil, access = security.can(action or "access", resource_id) == true}
end

return { run = run }

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local maintenance = require("maintenance")
local function prune(): ()
    local ctx = web.open()
    if not ctx then return end
    local result, err = maintenance.prune()
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
return {prune = prune}

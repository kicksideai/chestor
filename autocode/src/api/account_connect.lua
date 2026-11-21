-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local accounts = require("accounts")
local check = require("check")
local web = require("web")

local function handler(): ()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local saved, err = accounts.add_account(body, check.verify)
    return web.respond(ctx.res, saved, err, web.STATUS.CREATED)
end

return {handler = handler}

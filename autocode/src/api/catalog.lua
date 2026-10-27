-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local catalog = require("catalog")
local function handler()
    local ctx = web.open()
    if not ctx then return end
    local result, err = catalog.get()
    if not result then return web.fail_with(ctx.res, err) end
    result.success = true
    web.reply(ctx.res, web.STATUS.OK, result)
end
return {handler = handler}

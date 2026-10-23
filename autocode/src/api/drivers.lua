-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /autocode/drivers — the activated bee/drivers with their options,
-- capabilities and credentials.
local web = require("web")
local drivers = require("drivers")

local function list()
    local ctx = web.open()
    if not ctx then return end
    local list, err = drivers.list()
    if not list then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true, drivers = list})
end

return { list = list }

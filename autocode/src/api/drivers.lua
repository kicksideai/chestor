-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local client = require("client")
local function list()
    local ctx = web.open()
    if not ctx then return end
    local result, err = client.call("chestor.autocode:tasks", "list_agents", {})
    if not result then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true, drivers = result.agents})
end
return {list = list}

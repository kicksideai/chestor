-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local client = require("client")
type Object = {[string]: unknown}
local function reply(ctx: web.Context, contract_id: string, method: string, input: Object, status: number)
    local result, err = client.call(contract_id, method, input)
    if not result then return web.fail_with(ctx.res, err) end
    result.success = true
    web.reply(ctx.res, status, result)
end
local function list()
    local ctx = web.open()
    if ctx then reply(ctx, "chestor.autocode:tasks", "list_accounts", {include_unavailable = true}, web.STATUS.OK) end
end
local function create()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if body then reply(ctx, "chestor.autocode:accounts", "add_account", body, web.STATUS.CREATED) end
end
local function update()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local body = web.body(ctx)
    if not body then return end
    body.id = id
    reply(ctx, "chestor.autocode:accounts", "update_account", body, web.STATUS.OK)
end
local function delete()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if id then reply(ctx, "chestor.autocode:accounts", "remove_account", {id = id}, web.STATUS.OK) end
end
return {list = list, create = create, update = update, delete = delete}

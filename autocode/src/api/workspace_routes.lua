-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local workspaces = require("workspaces")
type Object = {[string]: unknown}
local function reply(ctx: web.Context, result: Object?, err: error?, status: number)
    if not result then return web.fail_with(ctx.res, err) end
    result.success = true
    web.reply(ctx.res, status, result)
end
local function list()
    local ctx = web.open()
    if not ctx then return end
    local result, err = workspaces.list()
    reply(ctx, result, err, web.STATUS.OK)
end
local function create()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local result, err = workspaces.create(body)
    reply(ctx, result, err, web.STATUS.CREATED)
end
local function delete()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local result, err = workspaces.delete({id = id})
    reply(ctx, result, err, web.STATUS.OK)
end
return {list = list, create = create, delete = delete}

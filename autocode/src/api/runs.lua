-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local client = require("client")
type Object = {[string]: unknown}
local function reply(ctx: web.Context, method: string, input: Object, status: number)
    local result, err = client.call("chestor.autocode:tasks", method, input)
    if not result then return web.fail_with(ctx.res, err) end
    result.success = true
    web.reply(ctx.res, status, result)
end
local function list()
    local ctx = web.open()
    if not ctx then return end
    local limit = ctx.req:query("limit")
    reply(ctx, "list_runs", {limit = limit, cursor = ctx.req:query("cursor")}, web.STATUS.OK)
end
local function get()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local after = ctx.req:query("after")
    local limit = ctx.req:query("limit")
    reply(ctx, "get_run", {run_id = id, after_seq = after,
        limit = limit}, web.STATUS.OK)
end
local function create()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    reply(ctx, "submit_task", body, web.STATUS.CREATED)
end
local function cancel()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    reply(ctx, "cancel_run", {run_id = id}, web.STATUS.OK)
end
return {list = list, get = get, create = create, cancel = cancel}

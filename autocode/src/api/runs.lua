-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local function list(): ()
    local ctx = web.open()
    if not ctx then return end
    local limit = web.number_query(ctx, "limit")
    web.dispatch(ctx, "chestor.autocode:tasks", "list_runs", {limit = limit, cursor = ctx.req:query("cursor")}, web.STATUS.OK)
end
local function get(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local after = web.number_query(ctx, "after_seq")
    local limit = web.number_query(ctx, "limit")
    local before = web.number_query(ctx, "before_seq")
    web.dispatch(ctx, "chestor.autocode:tasks", "get_run", {run_id = id, after_seq = after, before_seq = before,
        limit = limit}, web.STATUS.OK)
end
local function create(): ()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    web.dispatch(ctx, "chestor.autocode:tasks", "submit_task", body, web.STATUS.CREATED)
end
local function cancel(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    web.dispatch(ctx, "chestor.autocode:tasks", "cancel_run", {run_id = id}, web.STATUS.OK)
end
return {list = list, get = get, create = create, cancel = cancel}

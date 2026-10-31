-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local images = require("images")
local function list(): ()
    local ctx = web.open()
    if not ctx then return end
    web.dispatch(ctx, "chestor.autocode:tasks", "list_images", {ready_only = false}, web.STATUS.OK)
end
local function get(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local result, err = images.get({id = id})
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
local function create(): ()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local result, err = images.create(body)
    web.respond(ctx.res, result, err, web.STATUS.CREATED)
end
local function update(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local body = web.body(ctx)
    if not body then return end
    body.id = id
    local result, err = images.update(body)
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
local function prepare(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local result, err = images.prepare({id = id})
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
local function delete(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local result, err = images.delete({id = id, remove = ctx.req:query("remove") == "1"})
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
return {list = list, get = get, create = create, update = update, prepare = prepare, delete = delete}

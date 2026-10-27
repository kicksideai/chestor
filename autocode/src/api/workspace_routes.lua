-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local workspaces = require("workspaces")
local function list(): ()
    local ctx = web.open()
    if not ctx then return end
    local result, err = workspaces.list()
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
local function create(): ()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local result, err = workspaces.create(body)
    web.respond(ctx.res, result, err, web.STATUS.CREATED)
end
local function delete(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local result, err = workspaces.delete({id = id})
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
return {list = list, create = create, delete = delete}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- /autocode/workspaces — workspace components: host directories runs mount
-- at /workspace, read-write for callers with WRITE and read-only for callers
-- with READ. Listing shows the workspaces the caller can see, with the host
-- path only to those who may share them; creating and deleting are
-- management endpoints.
local web = require("web")
local resources = require("resources")
local workspaces = require("workspaces")
local security = require("security")

-- host_path: present for callers who may share the workspace.
type View = {id: string, name: string, writable: boolean, deletable: boolean, shareable: boolean, host_path: string?}

local function list()
    local ctx = web.open()
    if not ctx then return end
    local all, err = resources.list("workspace")
    if not all then return web.fail_with(ctx.res, err) end
    local views: {View} = {}
    for _, workspace in ipairs(all) do
        local shareable = resources.has(workspace.access, resources.ACCESS.ADMIN)
        local host_path: string? = nil
        if shareable then
            local context, context_err = resources.context("workspace", workspace.id, resources.ACCESS.ADMIN)
            if not context then return web.fail_with(ctx.res, context_err) end
            host_path = type(context.values.host_path) == "string" and context.values.host_path or ""
        end
        views[#views + 1] = {id = workspace.id, name = type(workspace.meta.title) == "string" and workspace.meta.title or "",
            writable = resources.has(workspace.access, resources.ACCESS.WRITE),
            deletable = resources.has(workspace.access, resources.ACCESS.DELETE), shareable = shareable, host_path = host_path}
    end
    local body: {[string]: unknown} = {success = true, workspaces = views}
    if security.can("access", "chestor.autocode.api:workspaces_create.endpoint") == true then
        body.roots = workspaces.roots()
    end
    web.reply(ctx.res, web.STATUS.OK, body)
end

local function create()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local name = web.text(body.name, 120)
    if not name or name == "" then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "name is required") end
    local path = web.text(body.host_path, 1000)
    if not path then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "host_path is required") end
    local normalized = path:gsub("/+$", "")
    local allowed, path_err = workspaces.admit(normalized)
    if not allowed then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, path_err or "path not allowed") end
    local id, err = resources.register("workspace", {title = name}, {host_path = normalized})
    if not id then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.CREATED, {success = true, id = id})
end

local function delete()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local workspace, find_err = resources.get("workspace", id, resources.ACCESS.DELETE)
    if not workspace then return web.fail_with(ctx.res, find_err) end
    local err = resources.delete(id)
    if err then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true})
end

return { list = list, create = create, delete = delete }

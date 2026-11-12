-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local values = require("values")
local endpoint_url = require("endpoint_url")
local resource_dto = require("resource_dto")
local resources = require("resources")
local workspaces = require("workspaces")
local security = require("security")
local client = require("client")
local worktrees = require("worktrees")
local boundary = require("boundary")
type Object = {[string]: unknown}
type WorkspaceList = {workspaces: {resource_dto.Workspace}, roots: {string}?}
local function list(): (WorkspaceList?, error?)
    local result, err = client.call("chestor.autocode:tasks", "list_workspaces", {})
    if not result then return nil, boundary.native(err) end
    if security.can("access", "chestor.autocode.api:workspaces_create.endpoint") == true then
        local roots, roots_err = workspaces.roots()
        if not roots then return nil, boundary.native(roots_err) end
        result.roots = roots
    end
    return result :: WorkspaceList, nil
end

local function create(body: Object): ({id: string}?, error?)
    local name = values.text(body.name, 120)
    if not name or name == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", "name is required") end
    local path = values.text(body.host_path, 1000)
    if not path then return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", "host_path is required") end
    local normalized = #path > 1 and path:gsub("/+$", "") or path
    local allowed, path_err, config_err = workspaces.admit(normalized)
    if config_err then return nil, boundary.native(config_err) end
    if not allowed then return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", path_err or "path not allowed") end
    local endpoint = body.gateway_endpoint
    if endpoint ~= nil and (type(endpoint) ~= "string" or (endpoint ~= "" and not endpoint_url.valid_authority(endpoint))) then
        return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", "gateway_endpoint must be a host and port")
    end
    local isolation = body.isolation or "shared"
    if isolation ~= "shared" and isolation ~= "worktree" then return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", "isolation must be shared or worktree") end
    if isolation == "worktree" then
        local tree, git_err = worktrees.plan(normalized, "validation")
        if not tree then return nil, boundary.native(git_err) end
    end
    local id, err = resources.register("workspace", {title = name, isolation = isolation}, {host_path = normalized, isolation = isolation, gateway_endpoint = endpoint})
    if not id then return nil, boundary.native(err) end
    return {id = id}, nil
end

local function delete(args: Object): (Object?, error?)
    local id = values.text(args.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "workspace id is required") end
    local workspace, find_err = resources.get("workspace", id, resources.ACCESS.DELETE)
    if not workspace then return nil, boundary.native(find_err) end
    local err, result = resources.delete(id)
    if err then return nil, boundary.native(err) end
    return result, nil
end

return {list = list, create = create, delete = delete}

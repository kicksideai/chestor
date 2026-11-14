-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local values = require("values")
local resource_dto = require("resource_dto")
local resources = require("resources")
local workspaces = require("workspaces")
local security = require("security")
local client = require("client")
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

type Admission = {path: string}
local function validate(path_value: unknown): (Admission?, error?)
    local path = values.text(path_value, 1000)
    if not path or path == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", "host_path is required") end
    local normalized = #path > 1 and path:gsub("/+$", "") or path
    local allowed, path_err, config_err = workspaces.admit(normalized)
    if config_err then return nil, boundary.native(config_err) end
    if not allowed then return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", path_err or "path not allowed") end
    local overlap_err = repo.workspace_overlap(normalized)
    if overlap_err then return nil, boundary.native(overlap_err) end
    return {path = normalized}, nil
end
local function create(body: Object): ({id: string}?, error?)
    local name = values.text(body.name, 120)
    if not name or name == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_workspace", "name is required") end
    local admitted, validation_err = validate(body.host_path)
    if not admitted then return nil, validation_err end
    local id, err = resources.register("workspace", {title = name}, {host_path = admitted.path})
    if not id then return nil, boundary.native(err) end
    local actor = security.actor()
    if not actor then return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.access_denied", "authentication required") end
    local approval_err = repo.approve_workspace(id, admitted.path, {actor_id = actor:id(), approved_at = repo.now(), context_revision = 0})
    if approval_err then return nil, boundary.native(approval_err) end
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

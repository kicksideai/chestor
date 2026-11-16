-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local json = require("json")
local registry = require("registry")
local boundary = require("boundary")
local images = require("images")
local workspaces = require("workspaces")
local maintenance = require("maintenance")

type Object = {[string]: unknown}
local function admit(tool: string, endpoint: string, input: Object): error?
    if not security.actor() or security.can("access", "chestor.autocode:tasks") ~= true
        or security.can("access", "chestor.autocode.traits:" .. tool) ~= true
        or security.can("access", "chestor.autocode.api:" .. endpoint) ~= true then
        return boundary.error(errors.PERMISSION_DENIED, "autocode.tool_access_denied", "autocode tool and management access required")
    end
    local entry, err = registry.get("chestor.autocode.traits:" .. tool)
    if not entry then return boundary.native(err) end
    local valid, problem = json.validate(entry.meta.input_schema, input)
    if not valid then return boundary.error(errors.INVALID, "autocode.invalid_request", tostring(problem)) end
    return nil
end

local function read_coding_image(input: Object): (Object?, error?)
    local err = admit("read_coding_image", "images_get.user.endpoint", input)
    if err then return nil, err end
    return images.get(input)
end

local function create_coding_image(input: Object): (Object?, error?)
    local err = admit("create_coding_image", "images_create.endpoint", input)
    if err then return nil, err end
    return images.create(input)
end

local function update_coding_image(input: Object): (Object?, error?)
    local err = admit("update_coding_image", "images_update.endpoint", input)
    if err then return nil, err end
    return images.update(input)
end

local function prepare_coding_image(input: Object): (Object?, error?)
    local err = admit("prepare_coding_image", "images_prepare.endpoint", input)
    if err then return nil, err end
    return images.prepare(input)
end

local function delete_coding_image(input: Object): (Object?, error?)
    local err = admit("delete_coding_image", "images_delete.endpoint", input)
    if err then return nil, err end
    return images.delete(input)
end

local function create_coding_workspace(input: Object): (Object?, error?)
    local err = admit("create_coding_workspace", "workspaces_create.endpoint", input)
    if err then return nil, err end
    return workspaces.create(input)
end

local function delete_coding_workspace(input: Object): (Object?, error?)
    local err = admit("delete_coding_workspace", "workspaces_delete.endpoint", input)
    if err then return nil, err end
    return workspaces.delete(input)
end

local function prune_coding_images(input: Object): (Object?, error?)
    local err = admit("prune_coding_images", "maintenance_prune.endpoint", input)
    if err then return nil, err end
    return maintenance.prune()
end

return {read_coding_image = read_coding_image, create_coding_image = create_coding_image, update_coding_image = update_coding_image, prepare_coding_image = prepare_coding_image, delete_coding_image = delete_coding_image, create_coding_workspace = create_coding_workspace, delete_coding_workspace = delete_coding_workspace, prune_coding_images = prune_coding_images}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local images = require("images")
local accounts = require("accounts")
local registry = require("registry")
local security = require("security")
local boundary = require("boundary")

type Object = {[string]: unknown}
local function allowed(endpoints: {string}): boolean
    for _, endpoint in ipairs(endpoints) do
        if security.can("access", "chestor.autocode.api:" .. endpoint .. ".endpoint") ~= true then return false end
    end
    return true
end
local function get(): (Object?, error?)
    local result, err = client.call("chestor.autocode:tasks", "list_agents", {})
    if not result then return nil, err end
    local defaults, defaults_err = images.defaults()
    if not defaults then return nil, defaults_err end
    local tab, tab_err = registry.get("chestor.autocode:settings_tab")
    if not tab then return nil, boundary.native(tab_err) end
    local settings_path = type(tab.data.path) == "string" and tab.data.path ~= "" and tab.data.path or nil
    return {agents = result.agents, default_image = defaults, account_limits = accounts.LIMITS, settings_path = settings_path,
        can_images = allowed({"images_create", "images_update", "images_delete", "images_prepare"}),
        can_workspaces = allowed({"workspaces_create", "workspaces_delete"}), can_prune = allowed({"maintenance_prune"})}, nil
end
return {get = get}

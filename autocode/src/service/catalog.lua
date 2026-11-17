-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local gateway_surface = require("gateway_surface")
local configuration = require("configuration")
local client = require("client")
local images = require("images")
local accounts = require("accounts")
local registry = require("registry")
local security = require("security")
local maintenance = require("maintenance")
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
    local limits_path = type(tab.data.limits_path) == "string" and tab.data.limits_path ~= "" and tab.data.limits_path or nil
    local retention, retention_err = maintenance.cache_retention()
    if not retention then return nil, retention_err end
    return {build_cache_retention = retention, agents = result.agents, default_image = defaults, account_limits = accounts.LIMITS, settings_path = settings_path, limits_path = limits_path,
        can_images = allowed({"images_create", "images_update", "images_delete", "images_prepare"}),
        can_workspaces = allowed({"workspaces_create", "workspaces_delete"}), can_prune = allowed({"maintenance_prune"})}, nil
end
-- Use the submission DTO's field schemas and the admission resolver, without
-- accepting a run or exposing tool descriptors to the browser.
local function preview(input: Object): (Object?, error?)
    local definition, read_err = registry.get("chestor.autocode:tasks")
    if not definition then return nil, read_err end
    for _, method in ipairs(definition.data.methods) do
        if method.name == "submit_task" then
            local declared = method.input_schemas[1].definition
            if type(declared) == "string" then
                local decoded, decode_err = json.decode(declared)
                if not decoded then return nil, decode_err end
                declared = decoded
            end
            local fields = declared.properties
            local schema = {type = "object", additionalProperties = false, required = {"agent", "tools"},
                properties = {agent = fields.agent, tools = fields.tools}}
            local valid, problem = json.validate(schema, input)
            if not valid then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", tostring(problem)) end
            local surface, err = gateway_surface.resolve(input.tools, input.agent :: string)
            if err then return nil, err end
            return {count = surface and #surface.tools or 0, limit = configuration.MAX_GATEWAY_TOOLS}, nil
        end
    end
    return nil, boundary.error(errors.INTERNAL, "autocode.missing_method", "submit_task is not declared")
end
return {get = get, preview = preview}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local security = require("security")
local accounts = require("accounts")
local boundary = require("boundary")
local client = require("client")
local values = require("values")
local web = require("web")

type Object = {[string]: unknown}
local NAMESPACE = "chestor.autocode"

local function limits(): ()
    local ctx = web.open()
    if not ctx then return end
    if security.can("access", "kickside.settings.api:put_settings.endpoint") ~= true then
        return web.fail_with(ctx.res, errors.new({kind = errors.PERMISSION_DENIED, message = "admin settings access is required"}))
    end

    local result, err = client.call("kickside.settings:settings", "get_namespace", {namespace = NAMESPACE})
    if err or not result then return web.fail_with(ctx.res, err) end
    local effective = result.values
    if result.success ~= true or type(effective) ~= "table" or type(result.overridden) ~= "table" then
        return web.fail_with(ctx.res, errors.new({kind = errors.INTERNAL, message = tostring(result.error or "settings read failed")}))
    end
    local overridden: {[string]: boolean} = {}
    for _, key in ipairs(result.overridden) do overridden[key] = true end

    local entries, find_err = registry.find({[".namespace"] = NAMESPACE, ["meta.type"] = "kickside.settings:definition"})
    if find_err then return web.fail_with(ctx.res, boundary.native(find_err)) end
    local settings: {Object} = {}
    for _, entry in ipairs(entries or {}) do
        local d = entry.data
        if d.namespace == NAMESPACE and type(d.key) == "string" then
            settings[#settings + 1] = {key = d.key, title = d.title, category = d.category, order = d.order,
                description = d.description, unit = d.unit, value_type = d.value_type, default = d.default,
                value = effective[d.key], overridden = overridden[d.key] == true}
        end
    end
    return web.respond(ctx.res, {settings = values.array(settings)}, nil, web.STATUS.OK)
end

-- As with Connections, a provider binding points to its registered setup view.
local function editor_tag(meta: Object): (string?, error?)
    local component = meta.component
    local create = type(component) == "table" and component.create or nil
    local view_id = type(create) == "table" and create.view or nil
    if type(view_id) ~= "string" or view_id == "" then return nil, nil end
    local view, err = registry.get(view_id)
    if err then return nil, boundary.native(err) end
    if view and view.meta.type == "view.component" and type(view.meta.tag_name) == "string" then
        return view.meta.tag_name, nil
    end
    return nil, nil
end

local function account_management(): ()
    local ctx = web.open()
    if not ctx then return end
    local agent = ctx.req:query("agent")
    local provider_id = ctx.req:query("provider_id")
    if provider_id then
        local definition, read_err = registry.get(provider_id)
        if read_err then return web.fail_with(ctx.res, boundary.native(read_err)) end
        if not definition or definition.kind ~= "contract.binding" or definition.meta.type ~= "harness.driver"
            or type(definition.meta.driver_id) ~= "string" then
            return web.fail_with(ctx.res, errors.new({kind = errors.NOT_FOUND, message = "driver binding not found"}))
        end
        agent = definition.meta.driver_id
    end
    local result, err = accounts.list({agent = agent, include_unavailable = true}, true)
    if err or not result then return web.fail_with(ctx.res, err) end

    local providers: {Object} = {}
    if agent == nil then
        local catalog, catalog_err = client.call("chestor.autocode:tasks", "list_agents", {})
        if catalog_err or not catalog then return web.fail_with(ctx.res, catalog_err) end
        local entries, find_err = registry.find({[".kind"] = "contract.binding", ["meta.type"] = "harness.driver"})
        if find_err then return web.fail_with(ctx.res, boundary.native(find_err)) end
        local by_driver: {[string]: Object} = {}
        for _, entry in ipairs(entries or {}) do
            local id = entry.meta.driver_id
            if type(id) == "string" then by_driver[id] = {id = entry.id, meta = entry.meta} end
        end
        for _, driver in ipairs(catalog.agents) do
            local definition = by_driver[driver.id]
            if definition then
                local tag, tag_err = editor_tag(definition.meta :: Object)
                if tag_err then return web.fail_with(ctx.res, tag_err) end
                providers[#providers + 1] = {agent = driver.id, title = driver.title, icon = driver.icon,
                    provider_id = definition.id, create_ui_id = tag}
            end
        end
    end
    result.agent = agent
    result.providers = values.array(providers)
    return web.respond(ctx.res, result, nil, web.STATUS.OK)
end

return {limits = limits, accounts = account_management}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local boundary = require("boundary")
local values = require("values")
local resources = require("resources")
local drivers = require("drivers")
local endpoint_url = require("endpoint_url")
local gateway = require("gateway")
local time = require("time")
type Object = {[string]: unknown}
local M = {}
local FIELDS = {"title", "agent", "account_id", "account_pool", "endpoint", "image_id", "workspace_id", "repo_url", "repo_ref", "run_timeout", "options", "unattended", "tools"}
local function invalid(message: string): error
    return boundary.error(errors.INVALID, "autocode.invalid_profile", message)
end
local function config(value: Object): Object
    local result: Object = {}
    for _, name in ipairs(FIELDS) do if value[name] ~= nil then result[name] = value[name] end end
    result.options = values.object(result.options or {})
    result.account_pool = values.array(result.account_pool or {})
    return result
end
function M.validate(body: Object): error?
    local driver, driver_err = drivers.get(resources.text(body.agent))
    if not driver then return driver_err end
    local _, surface_err = gateway.resolve(body.tools, driver.id)
    if surface_err then return surface_err end
    local reach = values.object(body.endpoint)
    if reach and resources.text(reach.base_url) ~= "" then
        if not endpoint_url.valid_endpoint(resources.text(reach.base_url)) then return invalid("endpoint base URL must be an http(s) URL without credentials, query or fragment") end
    end
    if body.account_id and body.account_id ~= "" and type(body.account_pool) == "table" and #body.account_pool > 0 then return invalid("select an account or an account pool") end
    for _, field in ipairs({"title", "agent", "image_id"}) do
        if resources.text(body[field]):match("^%s*$") then return invalid(field .. " is required") end
    end
    if body.run_timeout and body.run_timeout ~= "" then
        local duration = time.parse_duration(resources.text(body.run_timeout))
        if not duration or duration:milliseconds() < 60000 or duration:milliseconds() > 604800000 then return invalid("run timeout must be between one minute and 7 days") end
    end
    local url = values.text(body.repo_url or "", 2000)
    local ref = values.text(body.repo_ref or "", 200)
    if not url or not ref then return invalid("repository fields exceed their byte limits") end
    local repository_err = endpoint_url.repository_problem(url, ref, body.workspace_id ~= nil and body.workspace_id ~= "")
    if repository_err then return invalid(repository_err) end
    for _, field in ipairs({"image_id", "workspace_id", "account_id"}) do
        local id = resources.text(body[field])
        if id ~= "" then
            local kind = field == "image_id" and "image" or (field == "workspace_id" and "workspace" or "account")
            local found, err = resources.get(kind, id, resources.ACCESS.READ)
            if not found then return err end
            if kind == "account" and found.meta.agent ~= body.agent then return invalid("account belongs to another harness") end
        end
    end
    if type(body.account_pool) == "table" then
        for _, id in ipairs(body.account_pool) do
            if type(id) ~= "string" then return invalid("account pool must contain account ids") end
            local found, err = resources.get("account", id, resources.ACCESS.READ)
            if not found then return err end
            if found.meta.agent ~= body.agent then return invalid("account belongs to another harness") end
        end
    end
    local launch, err = drivers.launch(driver.id, {profile_id = "batch", brief = "validate profile", home = "/opt/agent",
        unattended = false, options = values.object(body.options or {}) or {},
        endpoint = reach and resources.text(reach.base_url) ~= "" and reach or nil,
        placement = {kind = "container", network = "bridge", allows = driver.capabilities, mounts = {}}})
    if not launch then return err end
    return nil
end
function M.list_profiles(args: unknown): (Object?, error?)
    local body, err = boundary.input("chestor.autocode:profiles", "list_profiles", args)
    if not body then return nil, err end
    local all, list_err, next_offset = resources.list("profile", body.limit :: integer?, body.offset :: integer?)
    if not all then return nil, boundary.native(list_err) end
    local result: {Object} = table.create(1, 0)
    for _, item in ipairs(all) do
        if not body.agent or item.meta.agent == body.agent then
            local view: Object
            if body.limit then
                view = {title = resources.text(item.meta.title), agent = resources.text(item.meta.agent)}
            else
                local context, context_err = resources.context("profile", item.id, resources.ACCESS.READ)
                if not context then return nil, boundary.native(context_err) end
                view = config(context.values)
            end
            view.id, view.owner_user_id, view.owner = item.id, item.owner_user_id, item.owner_user_id
            view.writable = resources.has(item.access, resources.ACCESS.WRITE)
            view.deletable = resources.has(item.access, resources.ACCESS.DELETE)
            result[#result + 1] = view
        end
    end
    return {profiles = result, next_offset = next_offset}, nil
end
function M.get_profile(args: unknown): (Object?, error?)
    local body, err = boundary.input("chestor.autocode:profiles", "get_profile", args)
    if not body then return nil, err end
    local item, read_err = resources.get("profile", resources.text(body.id), resources.ACCESS.READ)
    if not item then return nil, read_err end
    local context, context_err = resources.context("profile", item.id, resources.ACCESS.READ)
    if not context then return nil, context_err end
    local view = config(context.values)
    view.id, view.owner_user_id, view.owner = item.id, item.owner_user_id, item.owner_user_id
    view.writable = resources.has(item.access, resources.ACCESS.WRITE)
    view.deletable = resources.has(item.access, resources.ACCESS.DELETE)
    return {profile = view}, nil
end
function M.add_profile(args: unknown): (Object?, error?)
    local body, err = boundary.input("chestor.autocode:profiles", "add_profile", args)
    if not body then return nil, err end
    local problem = M.validate(body)
    if problem then return nil, boundary.native(problem) end
    local id, add_err = resources.register("profile", {title = body.title, agent = body.agent}, config(body))
    if not id then return nil, boundary.native(add_err) end
    return {id = id}, nil
end
function M.update_profile(args: unknown): (Object?, error?)
    local body, err = boundary.input("chestor.autocode:profiles", "update_profile", args)
    if not body then return nil, err end
    local id = resources.text(body.id)
    local snapshot, find_err = resources.snapshot("profile", id, resources.ACCESS.WRITE)
    if not snapshot then return nil, boundary.native(find_err) end
    local next_config = config(snapshot.context.values)
    for _, name in ipairs(FIELDS) do if body[name] ~= nil then next_config[name] = body[name] end end
    local problem = M.validate(next_config)
    if problem then return nil, boundary.native(problem) end
    local update_err = resources.replace(id, {title = next_config.title, agent = next_config.agent}, next_config, snapshot.context.revision)
    if update_err then return nil, boundary.native(update_err) end
    return {id = id}, nil
end
function M.remove_profile(args: unknown): (Object?, error?)
    local body, err = boundary.input("chestor.autocode:profiles", "remove_profile", args)
    if not body then return nil, err end
    local id = resources.text(body.id)
    local found, find_err = resources.get("profile", id, resources.ACCESS.DELETE)
    if not found then return nil, boundary.native(find_err) end
    local delete_err, result = resources.delete(id)
    if delete_err then return nil, boundary.native(delete_err) end
    return result, nil
end
-- Only submission resolves a profile. Worker preparation uses the stored snapshot.
function M.defaults(id: string): (Object?, error?)
    local context, err = resources.context("profile", id, resources.ACCESS.READ)
    if not context then return nil, err end
    return config(context.values), nil
end
return M

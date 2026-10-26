-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local boundary = require("boundary")
local values = require("values")
local repo = require("repo")
local resources = require("resources")
local drivers = require("drivers")
local credentials = require("credentials")
local runs = require("runs")
local security = require("security")
local live = require("live")
local logger = require("logger")

type Object = {[string]: unknown}
type Endpoint = {protocol: string, base_url: string, model: string?}
local M = {}
M.LIMITS = {label_bytes = 200, secret_bytes = 65536, endpoint_url_bytes = 512, endpoint_model_bytes = 200}
local text = resources.text
local function invalid(message: string): error
    return boundary.error(errors.INVALID, "autocode.invalid_account", message)
end
local function endpoint(body: Object, driver: drivers.Driver, kind: credentials.Kind): (Endpoint?, error?)
    if body.endpoint == nil then return nil, nil end
    local value = values.object(body.endpoint)
    if not value then return nil, invalid("endpoint must be an object") end
    local base_url = values.text(value.base_url, M.LIMITS.endpoint_url_bytes)
    if not base_url then return nil, invalid("endpoint base URL exceeds its byte limit") end
    if base_url == "" then return nil, nil end
    if kind.subscription or not kind.variable then return nil, invalid("a custom endpoint takes an API key, not a subscription login") end
    if not runs.valid_endpoint(base_url) then return nil, invalid("endpoint base URL must be an http(s) URL without credentials, query or fragment") end
    local protocol = values.text(value.protocol or "", 64)
    if not protocol or protocol == "" then protocol = #driver.endpoints == 1 and driver.endpoints[1] or nil end
    local reachable = false
    for _, candidate in ipairs(driver.endpoints) do if candidate == protocol then reachable = true end end
    if not protocol or not reachable then return nil, invalid(driver.title .. " cannot reach that endpoint protocol") end
    local model = values.text(value.model or "", M.LIMITS.endpoint_model_bytes)
    if not model then return nil, invalid("endpoint model exceeds its byte limit") end
    return {protocol = protocol, base_url = base_url, model = model ~= "" and model or nil}, nil
end
local function secret(kind: credentials.Kind, value: unknown): (string?, error?)
    if type(value) ~= "string" then return nil, invalid("secret must be text") end
    if #value > M.LIMITS.secret_bytes then return nil, invalid("secret exceeds its byte limit") end
    local trimmed = value:match("^%s*(.-)%s*$")
    if not trimmed or trimmed == "" then return nil, invalid("secret is required") end
    local problem = credentials.check(kind, trimmed)
    if problem then return nil, invalid(problem) end
    return trimmed, nil
end
function M.list(request: Object): (Object?, error?)
    local actor = security.actor()
    if not actor then return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.access_denied", "authentication required") end
    local all, err = resources.list("account")
    if not all then return nil, boundary.native(err) end
    local ids: {string} = {}
    for _, account in ipairs(all) do ids[#ids + 1] = account.id end
    local states, state_err = repo.account_states(ids)
    if not states then return nil, boundary.native(state_err) end
    local views: {Object} = table.create(1, 0)
    for _, account in ipairs(all) do
        local meta = account.meta
        local agent = text(meta.agent)
        if request.agent == nil or request.agent == agent then
            local driver, driver_err = drivers.get(agent)
            if driver_err and not errors.is(driver_err, errors.NOT_FOUND) then return nil, boundary.native(driver_err) end
            local admitted, reason = nil, "select an agent"
            if driver then admitted, reason = runs.usable(driver, account, actor:id()) end
            local state = states[account.id]
            if admitted and state.cooldown_until > repo.now() then admitted, reason = nil, "account is cooling down" end
            local base_url = text(meta.endpoint_base_url)
            local model = text(meta.endpoint_model)
            local reach: Endpoint? = nil
            if base_url ~= "" then reach = {protocol = text(meta.endpoint_protocol), base_url = base_url, model = model ~= "" and model or nil} end
            if admitted or request.include_unavailable == true then
                views[#views + 1] = {id = account.id, agent = agent, label = text(meta.title), credential_kind = text(meta.credential_kind),
                    subscription = resources.flag(meta.subscription, false), enabled = resources.flag(meta.enabled, true), endpoint = reach,
                    owner = account.owner, mine = account.owner == actor:id(), usable = admitted ~= nil,
                    unavailable_reason = not admitted and reason or nil, writable = resources.has(account.access, resources.ACCESS.WRITE),
                    deletable = resources.has(account.access, resources.ACCESS.DELETE), last_used_at = state.last_used_at,
                    cooldown_until = state.cooldown_until, last_error = state.last_error, runs_day = state.runs_day, failures_day = state.failures_day}
            end
        end
    end
    return {accounts = views}, nil
end
function M.add_account(args: unknown): (Object?, error?)
    local body, input_err = boundary.input("chestor.autocode:accounts", "add_account", args)
    if not body then return nil, input_err end
    local agent = values.text(body.agent, 64) or ""
    local driver, driver_err = drivers.get(agent)
    if not driver then
        if errors.is(driver_err, errors.NOT_FOUND) then return nil, invalid("select an agent") end
        return nil, boundary.native(driver_err)
    end
    local kind = credentials.kind(driver, values.text(body.credential_kind, 200) or "")
    if not kind then return nil, invalid("select a credential kind for " .. driver.title) end
    local label = values.text(body.label, M.LIMITS.label_bytes)
    if not label or label == "" then return nil, invalid("label is required and must fit its byte limit") end
    local credential, secret_err = secret(kind, body.secret)
    if not credential then return nil, secret_err end
    local reach, reach_err = endpoint(body, driver, kind)
    if reach_err then return nil, reach_err end
    local id, err = resources.register("account", {title = label, agent = driver.id, credential_kind = kind.id,
        subscription = kind.subscription, enabled = true, endpoint_protocol = reach and reach.protocol or "",
        endpoint_base_url = reach and reach.base_url or "", endpoint_model = reach and reach.model or ""}, {credential = credential})
    if not id then return nil, boundary.native(err) end
    return {id = id}, nil
end
function M.update_account(args: unknown): (Object?, error?)
    local body, input_err = boundary.input("chestor.autocode:accounts", "update_account", args)
    if not body then return nil, input_err end
    local id = values.text(body.id, 64) or ""
    local account, find_err = resources.get("account", id, resources.ACCESS.WRITE)
    if not account then return nil, boundary.native(find_err) end
    local fields: Object = {}
    if body.label ~= nil then
        local label = values.text(body.label, M.LIMITS.label_bytes)
        if not label or label == "" then return nil, invalid("label is required and must fit its byte limit") end
        fields.title = label
    end
    if body.enabled ~= nil then fields.enabled = body.enabled end
    local credential: string? = nil
    if body.secret ~= nil or body.endpoint ~= nil then
        local driver, driver_err = drivers.get(text(account.meta.agent))
        if not driver then return nil, boundary.native(driver_err) end
        local kind = credentials.kind(driver, text(account.meta.credential_kind))
        if not kind then return nil, invalid("account credential kind is no longer supported") end
        if body.secret ~= nil then
            local checked, secret_err = secret(kind, body.secret)
            if not checked then return nil, secret_err end
            credential = checked
        end
        if body.endpoint ~= nil then
            local reach, reach_err = endpoint(body, driver, kind)
            if reach_err then return nil, reach_err end
            fields.endpoint_protocol = reach and reach.protocol or ""
            fields.endpoint_base_url = reach and reach.base_url or ""
            fields.endpoint_model = reach and reach.model or ""
        end
    end
    if next(fields) == nil and not credential then return nil, invalid("nothing to change") end
    -- Metadata and credential replacement share the component revision CAS.
    local context, context_err = resources.context("account", id, resources.ACCESS.WRITE)
    if not context then return nil, boundary.native(context_err) end
    local err = resources.replace(id, fields, credential and {credential = credential} or nil, context.revision)
    if err then return nil, boundary.native(err) end
    if credential or fields.enabled == true then
        local clear_err = repo.clear_cooldown(id)
        if clear_err then return nil, boundary.native(clear_err) end
        local notify_err = live.account(id)
        if notify_err then logger:warn("autocode account notification failed", {account_id = id, error = tostring(notify_err)}) end
    end
    return {id = id}, nil
end
function M.remove_account(args: unknown): (Object?, error?)
    local body, input_err = boundary.input("chestor.autocode:accounts", "remove_account", args)
    if not body then return nil, input_err end
    local id = values.text(body.id, 64) or ""
    local account, find_err = resources.get("account", id, resources.ACCESS.DELETE)
    if not account then return nil, boundary.native(find_err) end
    local err = resources.delete(id)
    if err then return nil, boundary.native(err) end
    return {id = id}, nil
end
return M

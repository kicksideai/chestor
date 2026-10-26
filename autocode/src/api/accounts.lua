-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- /autocode/accounts — agent account components the caller can see, with
-- their balancing state. Account HTTP responses omit the credential stored
-- in component private context. A subscription
-- login is personal: it runs only for its owner, whoever else can see it.
local web = require("web")
local repo = require("repo")
local resources = require("resources")
local drivers = require("drivers")
local credentials = require("credentials")

type Endpoint = {protocol: string, base_url: string, model: string?}
-- mine: the caller owns the account; usable: the caller's runs may use it.
type View = {id: string, agent: string, label: string, credential_kind: string, subscription: boolean, enabled: boolean,
    endpoint: Endpoint?, owner: string, mine: boolean, usable: boolean, writable: boolean, deletable: boolean,
    last_used_at: string, cooldown_until: string, last_error: string, runs_day: integer, failures_day: integer}

local function text(value: unknown): string
    return type(value) == "string" and value or ""
end

local function endpoint_of(meta: {[string]: unknown}): Endpoint?
    local base_url = text(meta.endpoint_base_url)
    if base_url == "" then return nil end
    local model = text(meta.endpoint_model)
    return {protocol = text(meta.endpoint_protocol), base_url = base_url, model = model ~= "" and model or nil}
end

local function list()
    local ctx = web.open()
    if not ctx then return end
    local all, err = resources.list("account")
    if not all then return web.fail_with(ctx.res, err) end
    local ids: {string} = {}
    for _, account in ipairs(all) do ids[#ids + 1] = account.id end
    local states, state_err = repo.account_states(ids)
    if not states then return web.fail_with(ctx.res, state_err) end
    local views: {View} = {}
    for _, account in ipairs(all) do
        local meta = account.meta
        local state = states[account.id]
        local subscription = resources.flag(meta.subscription, false)
        local mine = account.owner == ctx.owner_id
        views[#views + 1] = {id = account.id, agent = text(meta.agent), label = text(meta.title),
            credential_kind = text(meta.credential_kind), subscription = subscription, enabled = resources.flag(meta.enabled, true),
            endpoint = endpoint_of(meta), owner = account.owner, mine = mine, usable = mine or not subscription,
            writable = resources.has(account.access, resources.ACCESS.WRITE),
            deletable = resources.has(account.access, resources.ACCESS.DELETE),
            last_used_at = state.last_used_at, cooldown_until = state.cooldown_until, last_error = state.last_error,
            runs_day = state.runs_day, failures_day = state.failures_day}
    end
    web.reply(ctx.res, web.STATUS.OK, {success = true, accounts = views})
end

-- endpoint decodes the optional endpoint an account sends its runs to: an
-- http(s) base URL without credentials in one of the protocols the driver
-- reaches, and the model the endpoint serves. A subscription login reaches
-- its vendor and takes none.
local function endpoint(body: {[string]: unknown}, driver: drivers.Driver, kind: credentials.Kind): (Endpoint?, string?)
    local raw = body.endpoint
    if raw == nil then return nil, nil end
    local value = web.object(raw)
    if not value then return nil, "endpoint must be an object" end
    local base_url = web.text(value.base_url, 512)
    if not base_url or base_url == "" then return nil, nil end
    if kind.subscription or not kind.variable then return nil, "a custom endpoint takes an API key, not a subscription login" end
    if not base_url:match("^https?://[^/?#%s]+[^?#%s]*$") then return nil, "endpoint base URL must be an http(s) URL without a query" end
    if base_url:match("^https?://[^/]*@") then return nil, "endpoint base URL must not contain credentials; the account's key authenticates to it" end
    local protocol = web.text(value.protocol or "", 64)
    if not protocol or protocol == "" then protocol = #driver.endpoints == 1 and driver.endpoints[1] or nil end
    local reachable = false
    for _, candidate in ipairs(driver.endpoints) do if candidate == protocol then reachable = true end end
    if not protocol or not reachable then return nil, driver.title .. " cannot reach that endpoint protocol" end
    local model = web.text(value.model or "", 200)
    if not model then return nil, "endpoint model is too long" end
    return {protocol = protocol, base_url = base_url, model = model ~= "" and model or nil}, nil
end

local function create()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local agent = web.text(body.agent, 64)
    if not agent or agent == "" then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "agent is required") end
    local driver, driver_err = drivers.get(agent)
    if not driver then
        if errors.is(driver_err, errors.NOT_FOUND) then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "unknown agent") end
        return web.fail_with(ctx.res, driver_err)
    end
    local kind = credentials.kind(driver, web.text(body.credential_kind, 200) or "")
    if not kind then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "unknown credential kind for " .. driver.id) end
    local label = web.text(body.label, 200)
    if not label or label == "" then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "label is required") end
    local raw = web.text(body.secret, 65536)
    local secret = raw and raw:match("^%s*(.-)%s*$") or nil
    if not secret or secret == "" then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "secret is required") end
    local problem = credentials.check(kind, secret)
    if problem then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, problem) end
    local reach, reach_problem = endpoint(body, driver, kind)
    if reach_problem then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, reach_problem) end
    local id, err = resources.register("account", {title = label, agent = driver.id, credential_kind = kind.id,
        subscription = kind.subscription, enabled = true, endpoint_protocol = reach and reach.protocol or "",
        endpoint_base_url = reach and reach.base_url or "", endpoint_model = reach and reach.model or ""}, {credential = secret})
    if not id then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.CREATED, {success = true, id = id})
end

-- PUT /autocode/accounts/{id} — rename an account or take it in or out of
-- balancing; enabling it again ends its cooldown.
local function update()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local body = web.body(ctx)
    if not body then return end
    local fields: {[string]: unknown} = {}
    if body.label ~= nil then
        local label = web.text(body.label, 200)
        if not label or label == "" then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "label must be nonempty text") end
        fields.title = label
    end
    if body.enabled ~= nil then
        if type(body.enabled) ~= "boolean" then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "enabled must be a boolean") end
        fields.enabled = body.enabled
    end
    if next(fields) == nil then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "nothing to change") end
    local account, find_err = resources.get("account", id, resources.ACCESS.WRITE)
    if not account then return web.fail_with(ctx.res, find_err) end
    local err = resources.set_meta(id, fields)
    if err then return web.fail_with(ctx.res, err) end
    if fields.enabled == true and not resources.flag(account.meta.enabled, true) then
        local clear_err = repo.clear_cooldown(id)
        if clear_err then return web.fail_with(ctx.res, clear_err) end
    end
    web.reply(ctx.res, web.STATUS.OK, {success = true})
end

local function delete()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local account, find_err = resources.get("account", id, resources.ACCESS.DELETE)
    if not account then return web.fail_with(ctx.res, find_err) end
    local err = resources.delete(account.id)
    if err then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true})
end

return { list = list, create = create, update = update, delete = delete }

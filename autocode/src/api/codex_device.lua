-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local accounts = require("accounts")
local auth = require("auth")
local device = require("device")
local resources = require("resources")
local security = require("security")
local store = require("store")
local time = require("time")
local uuid = require("uuid")
local values = require("values")
local web = require("web")

type Object = {[string]: unknown}
local STORE = "chestor.autocode.drivers:codex_sign_ins"

local function reconnect(id: string, user: string): error?
    local account, err = resources.get("account", id, resources.ACCESS.WRITE)
    if not account then return err end
    if account.meta.agent ~= "codex" or account.meta.credential_kind ~= auth.kind or account.owner_user_id ~= user then
        return errors.new({kind = errors.PERMISSION_DENIED, message = "You can only reconnect your own Codex ChatGPT account."})
    end
    return nil
end

local function handler(): ()
    local ctx = web.open()
    if not ctx then return end
    ctx.res:set_header("Cache-Control", "no-store")
    local body = web.body(ctx)
    if not body then return end
    local action = body.action
    if action ~= "start" and action ~= "poll" and action ~= "cancel" then
        return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "Select a sign-in action.")
    end
    local actor = security.actor()
    if not actor then return end
    local user = actor:id()
    local result, err = auth.lock("chestor.autocode.codex.device." .. user, function(): (Object?, error?)
        local cache, cache_err = store.get(STORE)
        if not cache then return nil, cache_err end
        local now = time.now():unix()
        if action == "start" then
            local label = values.text(body.label, accounts.LIMITS.label_bytes)
            local id = body.account_id ~= nil and values.text(body.account_id, 64) or nil
            if not label or label == "" or (body.account_id ~= nil and (not id or id == "")) then
                return nil, errors.new({kind = errors.INVALID, message = "Enter a valid account name."})
            end
            if id then
                local refused = reconnect(id, user)
                if refused then return nil, refused end
            end
            local session, view = device.start(auth.request, now)
            if not session then return view, nil end
            local ticket = uuid.v4()
            local stored = cache:set(user, {ticket = ticket, session = session, label = label, account_id = id}, session.expires - now + 60)
            if not stored then return nil, errors.new({kind = errors.UNAVAILABLE, message = "Could not start Codex sign-in."}) end
            view.ticket = ticket
            return view, nil
        end
        local current = cache:get(user)
        if type(current) ~= "table" or type(body.ticket) ~= "string" or current.ticket ~= body.ticket then
            return {state = "expired"}, nil
        end
        local session = current.session :: device.Session
        local function save(secret: string): (string?, error?)
            local deleted = cache:delete(user)
            if not deleted then return nil, nil end
            local id, label = current.account_id, current.label
            local saved: Object?, save_err: error?
            if type(id) == "string" then
                local refused = reconnect(id, user)
                if refused then return nil, refused end
                saved, save_err = auth.lock("chestor.autocode.codex.refresh." .. id, function(): (Object?, error?)
                    return accounts.update_account({id = id, secret = secret})
                end, 16000)
            else
                saved, save_err = accounts.add_account({agent = "codex", label = label, credential_kind = auth.kind, secret = secret})
            end
            if not saved or type(saved.id) ~= "string" then return nil, save_err end
            return saved.id, nil
        end
        local view = action == "cancel" and device.cancel(session) or device.poll(session, auth.request, save, now)
        local ttl: integer = session.result and 60 or math.max(1, math.floor(session.expires - now + 60))
        local stored = cache:set(user, current, ttl)
        if not stored and view.state ~= "ready" then
            return nil, errors.new({kind = errors.UNAVAILABLE, message = "Could not check Codex sign-in."})
        end
        return view, nil
    end)
    if errors.is(err, errors.ALREADY_EXISTS) then
        result, err = {state = "busy", retry_after = 1}, nil
    end
    return web.respond(ctx.res, result, err, web.STATUS.OK)
end

return {handler = handler}

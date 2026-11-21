-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base64 = require("base64")
local json = require("json")
local time = require("time")

type Object = {[string]: unknown}
type Request = (string, string) -> (number, Object, Object)
type Save = (string) -> (string?, error?)
type Session = {device_id: string, user_code: string, interval: integer, expires: integer, next_poll: integer, limited: boolean, result: Object?}

local M = {}
M.origin = "https://auth.openai.com"
M.client_id = "app_EMoamEEZ73f0CkXaXp7hrann"
M.token_path = "/oauth/token"
M.kind = "file:.codex/auth.json"
local MAX_AGE = 900

local function word(value: unknown, max: integer): string?
    if type(value) == "string" and #value > 0 and #value <= max and not value:find("[%c%s]") then return value end
    return nil
end

local function claims(token: string): Object
    local payload = token:match("^[^.]+%.([^.]+)%.")
    if not payload then return {} end
    payload = payload:gsub("-", "+"):gsub("_", "/")
    local decoded = base64.decode(payload .. string.rep("=", (4 - #payload % 4) % 4))
    if type(decoded) ~= "string" then return {} end
    local value = json.decode(decoded)
    return type(value) == "table" and value :: Object or {}
end

local function encode_cache(tokens: Object, now: integer, previous: Object?): string?
    local access = word(tokens.access_token, 16000)
    local refresh = word(tokens.refresh_token, 16000) or (previous and word(previous.refresh_token, 16000))
    local id = word(tokens.id_token, 16000) or (previous and word(previous.id_token, 16000))
    if not access or not refresh or not id then return nil end
    local scope = claims(id)["https://api.openai.com/auth"]
    local account = type(scope) == "table" and word(scope.chatgpt_account_id, 256) or nil
    if not account then return nil end
    if previous and previous.account_id ~= account then return nil end
    local encoded, err = json.encode({auth_mode = "chatgpt", last_refresh = time.unix(now, 0):utc():format_rfc3339(),
        tokens = {access_token = access, id_token = id, refresh_token = refresh, account_id = account}})
    return not err and encoded or nil
end

local function bound(value: unknown, default: integer, min: integer, max: integer): integer
    return math.max(min, math.min(max, math.floor(tonumber(value) or default)))
end

local function retry_after(headers: Object, fallback: integer): integer
    return bound(headers["Retry-After"] or headers["retry-after"], fallback, 1, MAX_AGE)
end

function M.start(request: Request, now: integer): (Session?, Object)
    local status, value, headers = request("/api/accounts/deviceauth/usercode", assert(json.encode({client_id = M.client_id})))
    if status == 429 then return nil, {state = "rate_limited", retry_after = retry_after(headers, 30)} end
    if status ~= 200 then return nil, {state = "unavailable"} end
    local device_id, user_code = word(value.device_auth_id, 512), word(value.user_code, 128)
    if not device_id or not user_code then return nil, {state = "unavailable"} end
    local interval = bound(value.interval, 5, 1, 60)
    local expires = now + bound(value.expires_in, MAX_AGE, 1, MAX_AGE)
    return {device_id = device_id, user_code = user_code, expires = expires, interval = interval,
        next_poll = now + interval, limited = false}, {state = "waiting", user_code = user_code,
        verification_url = M.origin .. "/codex/device", expires_at = expires, retry_after = interval}
end

local function terminal(session: Session, state: string, id: string?): Object
    local result: Object = {state = state, account_id = id}
    session.result = result
    session.device_id, session.user_code = "", ""
    return result
end

function M.cancel(session: Session): Object
    return session.result or terminal(session, "cancelled")
end

local function waiting(session: Session, now: integer): Object
    return {state = session.limited and "rate_limited" or "waiting",
        retry_after = math.min(session.expires, session.next_poll) - now}
end

local function escape(value: string): string
    return (value:gsub("([^%w%-._~])", function(char: string): string return string.format("%%%02X", string.byte(char)) end))
end

function M.poll(session: Session, request: Request, save: Save, now: integer): Object
    if session.result then return session.result end
    if now >= session.expires then return terminal(session, "expired") end
    if now < session.next_poll then return waiting(session, now) end
    local status, body, headers = request("/api/accounts/deviceauth/token", assert(json.encode({device_auth_id = session.device_id, user_code = session.user_code})))
    local code = type(body.error) == "table" and body.error.code or body.error
    if code == "access_denied" or code == "authorization_declined" then return terminal(session, "denied") end
    if status == 410 or code == "expired_token" or code == "device_code_expired" then return terminal(session, "expired") end
    session.limited = status == 429 or code == "slow_down"
    session.next_poll = now + (session.limited and retry_after(headers, session.interval + 5) or session.interval)
    if session.limited or status == 403 or status == 404 or code == "authorization_pending" then return waiting(session, now) end
    if status ~= 200 then return terminal(session, "unavailable") end
    local authorization_code, verifier = body.authorization_code, word(body.code_verifier, 512)
    if type(authorization_code) ~= "string" or #authorization_code == 0 or #authorization_code > 4096 or not verifier then
        return terminal(session, "unavailable")
    end
    local exchange_status, tokens = request(M.token_path, "grant_type=authorization_code&code=" .. escape(authorization_code)
        .. "&redirect_uri=" .. escape(M.origin .. "/deviceauth/callback") .. "&client_id=" .. M.client_id .. "&code_verifier=" .. escape(verifier))
    local cache = exchange_status == 200 and encode_cache(tokens, now) or nil
    if not cache then return terminal(session, "unavailable") end
    local id = save(cache)
    if not id then return terminal(session, "save_failed") end
    return terminal(session, "ready", id)
end

-- The runner refreshes the official cache before launching a task whose
-- deadline could outlive it. Imported JSON without this shape stays CLI-owned.
function M.refresh(request: Request, secret: string, now: integer, run_seconds: integer): (string?, error?)
    local cache = json.decode(secret)
    if type(cache) ~= "table" or cache.auth_mode ~= "chatgpt" or type(cache.tokens) ~= "table" then return nil, nil end
    local tokens: Object = cache.tokens
    local access, refresh = word(tokens.access_token, 16000), word(tokens.refresh_token, 16000)
    if not access or not refresh or not word(tokens.account_id, 256) then return nil, nil end
    local expiry = tonumber(claims(access).exp)
    if expiry and expiry > now + run_seconds + 120 then return nil, nil end
    local status, renewed = request(M.token_path, assert(json.encode({grant_type = "refresh_token", client_id = M.client_id, refresh_token = refresh})))
    local encoded = status == 200 and encode_cache(renewed, now, tokens) or nil
    if not encoded then
        local refused = status == 400 or status == 401 or status == 403
        return nil, errors.new({kind = refused and errors.INVALID or errors.UNAVAILABLE,
            message = refused and "Your ChatGPT sign-in expired. Reconnect the Codex account in System settings." or "Codex sign-in could not be refreshed. Try again shortly.",
            details = {code = refused and "autocode.codex_reconnect" or "autocode.codex_refresh_unavailable"}})
    end
    return encoded, nil
end

return M

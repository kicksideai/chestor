-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Real Kickside identities for the autocode suites. Each user is created
-- through kickside/users, assigned to its groups, and signed in through the
-- public login endpoint, so its token, actor and scope are the ones a browser
-- session carries.
local security = require("security")
local funcs = require("funcs")
local http_client = require("http_client")
local json = require("json")
local registry = require("registry")
local uuid = require("uuid")
local contract = require("contract")

type User = {id: string, email: string, groups: {string}, token: string}
type Response = {status: integer, body: string, json: unknown}

local M = {}

-- The platform Members group, which autocode and the platform modules bind their member policies to.
M.MEMBERS = "kickside.security.groups:members"
-- The group every signed-in user holds (kickside.users:user_security_scope).
M.SIGNED_IN = "app.security:user"
-- The administrator group (kickside.users:admin_security_scope).
M.ADMINS = "app.security:admin"

local TOKEN_STORE = "kickside.users.security:tokens"
local PASSWORD = "Autocode-harness-123!"

local function data_of(id: string): {[string]: unknown}
    local entry, err = registry.get(id)
    if not entry then error("harness entry " .. id .. " is missing: " .. tostring(err)) end
    return entry.data or {}
end

local function base_url(): string
    local port = tostring(data_of("app:gateway").addr or ""):match(":(%d+)$")
    if not port then error("app:gateway declares no port") end
    return "http://127.0.0.1:" .. port
end

local function send(method: string, url: string, token: string?, body: unknown?): Response
    local headers: {[string]: string} = {["Content-Type"] = "application/json"}
    if token then headers.Authorization = "Bearer " .. token end
    local options: {[string]: unknown} = {headers = headers}
    if body ~= nil then
        local encoded, encode_err = json.encode(body)
        if encode_err then error("request body: " .. tostring(encode_err)) end
        options.body = encoded
    end
    local response, err = http_client.request(method, url, options)
    if err or not response then error(method .. " " .. url .. ": " .. tostring(err)) end
    local text = tostring(response.body or "")
    local decoded = nil
    if text ~= "" then decoded = json.decode(text) end
    return {status = response.status_code, body = text, json = decoded}
end

local function sign_in(email: string): string
    local prefix = tostring(data_of("app:api.public").prefix or "")
    local response = send("POST", base_url() .. prefix .. "/user/token", nil, {email = email, password = PASSWORD})
    if response.status ~= 200 or type(response.json) ~= "table" or type(response.json.token) ~= "string" then
        error("sign-in of " .. email .. " failed with " .. tostring(response.status) .. ": " .. response.body)
    end
    return response.json.token
end

local bootstrap: {id: string, token: string}? = nil
local active = 0
local function administrator(): {id: string, token: string}
    if bootstrap then return bootstrap end
    local definition, definition_err = contract.get("kickside.users:user_provisioning")
    if not definition then error(tostring(definition_err)) end
    local provisioning, open_err = definition:open()
    if not provisioning then error(tostring(open_err)) end
    local created, create_err = provisioning:create_passwordless_user({email = uuid.v4() .. "@autocode.test.local"})
    if not created or not created.ok then error("bootstrap creation: " .. tostring(create_err or (created and created.error))) end
    local completed, complete_err = provisioning:complete_passwordless_user({identifier = created.user_id,
        source = "autocode-harness", group_ids = {M.SIGNED_IN, M.ADMINS}})
    if not completed or not completed.ok then error("bootstrap groups: " .. tostring(complete_err or (completed and completed.error))) end
    local session, session_err = provisioning:mint_session({identifier = created.user_id})
    if not session or not session.ok then error("bootstrap session: " .. tostring(session_err or (session and session.error))) end
    if type(session.token) ~= "string" or session.token == "" then error("bootstrap session has no token") end
    local store = security.token_store(TOKEN_STORE)
    local actor, scope, token_err = store:validate(session.token)
    store:close()
    if not actor or not scope then error("bootstrap token validation: " .. tostring(token_err)) end
    bootstrap = {id = created.user_id, token = session.token}
    return bootstrap
end
local function manage(method: string, path: string, body: unknown?): Response
    local admin = administrator()
    local prefix = tostring(data_of("app:api").prefix or "")
    return send(method, base_url() .. prefix .. path, admin.token, body)
end
-- Creates an account through HTTP, assigns groups through provisioning and signs in.
function M.user(groups: {string}): User
    local id = uuid.v4()
    local email = id .. "@autocode.test.local"
    local response = manage("POST", "/users", {user_id = id, email = email, password = PASSWORD,
        full_name = "Autocode " .. id:sub(1, 8), status = "active", groups = table.create(1, 0)})
    if response.status ~= 201 then error("could not create user: " .. response.body) end
    local definition, definition_err = contract.get("kickside.users:user_provisioning")
    if not definition then error(tostring(definition_err)) end
    local provisioning, open_err = definition:open()
    if not provisioning then error(tostring(open_err)) end
    for _, group in ipairs(groups) do
        local assigned, assign_err = provisioning:assign_group({identifier = id, group_id = group})
        if not assigned or not assigned.ok then error("could not assign group: " .. tostring(assign_err or (assigned and assigned.error))) end
    end
    active = active + 1
    return {id = id, email = email, groups = groups, token = sign_in(email)}
end

-- A signed-in user in the autocode member group.
function M.member(): User
    return M.user({M.SIGNED_IN, M.MEMBERS})
end

-- A signed-in user outside the autocode member group.
function M.outsider(): User
    return M.user({M.SIGNED_IN})
end

-- A signed-in administrator.
function M.admin(): User
    return M.user({M.SIGNED_IN, M.ADMINS})
end

-- Calls a function under the actor and scope of the user's session token.
function M.call(user: User, function_id: string, ...): (unknown, error?)
    local store = security.token_store(TOKEN_STORE)
    local actor, scope, err = store:validate(user.token)
    store:close()
    if err or not actor or not scope then error("session of " .. user.id .. " is invalid: " .. tostring(err)) end
    return funcs.new():with_actor(actor):with_scope(scope):call(function_id, ...)
end

-- Sends an HTTP request through app:gateway to a path under the app:api
-- router, bearing the user's session token; a nil user sends none.
function M.request(user: User?, method: string, path: string, body: unknown?): Response
    local prefix = tostring(data_of("app:api").prefix or "")
    return send(method, base_url() .. prefix .. path, user and user.token or nil, body)
end

-- Container requests use the same gateway port as the harness HTTP service.
function M.container_url(): string
    return (base_url():gsub("127%.0%.0%.1", "host.docker.internal"))
end

-- Queues user deletion through the Users admin API and revokes its sessions.
function M.release(user: User)
    local response = manage("DELETE", "/users/" .. user.id, nil)
    if response.status ~= 202 then error("could not delete user " .. user.id .. ": " .. response.body) end
    active = active - 1
    if active == 0 and bootstrap then
        local removed = manage("DELETE", "/users/" .. bootstrap.id, nil)
        if removed.status ~= 202 then error("could not delete bootstrap: " .. removed.body) end
        bootstrap = nil
    end
end

return M

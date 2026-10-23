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
local user_repo = require("user_repo")
local user_groups_repo = require("user_groups_repo")
local user_lifecycle_repo = require("user_lifecycle_repo")

type User = {id: string, email: string, groups: {string}, token: string}
type Response = {status: integer, body: string, json: any}

local M = {}

-- The platform Members group, which autocode and the platform modules bind their member policies to.
M.MEMBERS = "kickside.security.groups:members"
-- The group every signed-in user holds (kickside.users:user_security_scope).
M.SIGNED_IN = "app.security:user"
-- The administrator group (kickside.users:admin_security_scope).
M.ADMINS = "app.security:admin"

local TOKEN_STORE = "kickside.users.security:tokens"
local PASSWORD = "Autocode-harness-123!"

local function data_of(id: string): {[string]: any}
    local entry, err = registry.get(id)
    if not entry then error("harness entry " .. id .. " is missing: " .. tostring(err)) end
    return entry.data or {}
end

local function base_url(): string
    local port = tostring(data_of("app:gateway").addr or ""):match(":(%d+)$")
    if not port then error("app:gateway declares no port") end
    return "http://127.0.0.1:" .. port
end

local function send(method: string, url: string, token: string?, body: any?): Response
    local headers: {[string]: string} = {["Content-Type"] = "application/json"}
    if token then headers.Authorization = "Bearer " .. token end
    local options: {[string]: any} = {headers = headers}
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

-- Creates an active user in the given groups and signs it in.
function M.user(groups: {string}): User
    local id = uuid.v4()
    local email = id .. "@autocode.test.local"
    local created, create_err = user_repo.create({user_id = id, email = email, password = PASSWORD,
        full_name = "Autocode " .. id:sub(1, 8), status = "active"})
    if not created then error("could not create user " .. id .. ": " .. tostring(create_err)) end
    for _, group in ipairs(groups) do
        local assigned, assign_err = user_groups_repo.assign_user_to_group(id, group)
        if assign_err or not assigned then
            error("could not assign " .. id .. " to " .. group .. ": " .. tostring(assign_err))
        end
    end
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
function M.call(user: User, function_id: string, ...): (any, any)
    local store = security.token_store(TOKEN_STORE)
    local actor, scope, err = store:validate(user.token)
    store:close()
    if err or not actor or not scope then error("session of " .. user.id .. " is invalid: " .. tostring(err)) end
    return funcs.new():with_actor(actor):with_scope(scope):call(function_id, ...)
end

-- Sends an HTTP request through app:gateway to a path under the app:api
-- router, bearing the user's session token; a nil user sends none.
function M.request(user: User?, method: string, path: string, body: any?): Response
    local prefix = tostring(data_of("app:api").prefix or "")
    return send(method, base_url() .. prefix .. path, user and user.token or nil, body)
end

-- Deletes the user, which revokes its sessions.
function M.release(user: User)
    local _, err = user_lifecycle_repo.delete(user.id)
    if err then error("could not delete user " .. user.id .. ": " .. tostring(err)) end
end

return M

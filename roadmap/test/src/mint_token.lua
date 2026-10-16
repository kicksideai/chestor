local security = require("security")

-- The harness stand-in for a login endpoint: mint a bearer token carrying the same
-- actor and scope the funcs-framed probes use, so an HTTP request and a direct
-- library call reach the roadmap under one identity.
local function mint(input: any): (any?, string?)
    input = type(input) == "table" and input or {}
    local user_id = tostring((input :: any).user_id or "")
    if user_id == "" then return nil, "user_id is required" end
    local groups: { any } = type((input :: any).groups) == "table" and (input :: any).groups or {}

    local actor = security.new_actor(user_id, { security_groups = groups })
    local scope, scope_err = security.named_scope("wippy.security:process")
    if scope_err or not scope then return nil, "scope unavailable: " .. tostring(scope_err) end

    local store, store_err = security.token_store("app:tokens")
    if store_err or not store then return nil, "token store unavailable: " .. tostring(store_err) end

    local token, token_err = store:create(actor, scope, { expiration = "1h", meta = { security_groups = groups } })
    if token_err or not token then return nil, "token mint failed: " .. tostring(token_err) end
    return { token = tostring(token), user_id = user_id }, nil
end

return { mint = mint }

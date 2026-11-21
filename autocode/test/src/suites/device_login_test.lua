-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local device = require("device")
local json = require("json")
local base64 = require("base64")

local function setup()
    local fixture = {now = 100, requests = {}, persisted = 0, poll_status = 403, poll_body = {}}
    fixture.endpoint = function(path, request)
        fixture.requests[#fixture.requests + 1] = {path = path, request = request}
        if path == "/api/accounts/deviceauth/usercode" then
            return 200, {device_auth_id = "private-device-id", user_code = "CODE-123", interval = "5", expires_in = 60}, {}
        end
        if path == "/api/accounts/deviceauth/token" then
            return fixture.poll_status, fixture.poll_body, fixture.poll_headers or {}
        end
        return 200, {access_token = "private-access", refresh_token = "private-refresh",
            id_token = table.concat({"header", base64.encode(assert(json.encode({
                ["https://api.openai.com/auth"] = {chatgpt_account_id = "acct"},
            }))), "signature"}, ".")}, {}
    end
    fixture.save = function(cache)
        fixture.persisted = fixture.persisted + 1
        fixture.cache = assert(json.decode(cache))
        return "account-id"
    end
    return fixture
end

local function cases()
    test.describe("Codex device sign-in", function()
        test.it("keeps the device ID and official cache on the server and persists approval once", function()
            local f = setup()
            local session, shown = device.start(f.endpoint, f.now)
            test.eq(shown.state, "waiting")
            test.eq(shown.user_code, "CODE-123")
            test.eq(shown.verification_url, "https://auth.openai.com/codex/device")
            test.is_nil(shown.device_auth_id)
            test.eq(device.poll(session, f.endpoint, f.save, 101).state, "waiting")
            test.eq(#f.requests, 1)
            test.eq(device.poll(session, f.endpoint, f.save, 105).state, "waiting")
            f.poll_status, f.poll_body = 200, {authorization_code = "auth +/=", code_verifier = "proof"}
            local result = device.poll(session, f.endpoint, f.save, 110)
            test.eq(result.state, "ready")
            test.eq(result.account_id, "account-id")
            test.is_nil(result.tokens)
            test.eq(f.cache.auth_mode, "chatgpt")
            test.eq(f.cache.tokens.account_id, "acct")
            test.eq(f.cache.tokens.refresh_token, "private-refresh")
            test.eq(f.requests[4].path, "/oauth/token")
            test.is_true(string.find(f.requests[4].request, "code=auth%%20%%2B%%2F%%3D") ~= nil)
            test.eq(device.poll(session, f.endpoint, f.save, 120).state, "ready")
            test.eq(f.persisted, 1)
        end)

        test.it("honors poll limits and the provider retry interval", function()
            local f = setup()
            local session = device.start(f.endpoint, f.now)
            f.poll_status, f.poll_headers = 429, {["Retry-After"] = "19"}
            local limited = device.poll(session, f.endpoint, f.save, 105)
            test.eq(limited.state, "rate_limited")
            test.eq(limited.retry_after, 19)
            test.eq(device.poll(session, f.endpoint, f.save, 123).retry_after, 1)
            test.eq(#f.requests, 2)
            f.poll_status = 404
            test.eq(device.poll(session, f.endpoint, f.save, 124).state, "waiting")
        end)

        test.it("distinguishes denial, provider expiry, and locally expired sign-ins", function()
            for _, scenario in ipairs({
                {status = 403, body = {error = {code = "access_denied"}}, now = 105, state = "denied", calls = 2},
                {status = 400, body = {error = "expired_token"}, now = 105, state = "expired", calls = 2},
                {status = 403, body = {}, now = 160, state = "expired", calls = 1},
            }) do
                local f = setup()
                local session = device.start(f.endpoint, f.now)
                f.poll_status, f.poll_body = scenario.status, scenario.body
                test.eq(device.poll(session, f.endpoint, f.save, scenario.now).state, scenario.state)
                test.eq(#f.requests, scenario.calls)
                test.eq(f.persisted, 0)
            end
        end)

        test.it("cancels a pending login without polling or storing credentials", function()
            local f = setup()
            local session = device.start(f.endpoint, f.now)
            test.eq(device.cancel(session).state, "cancelled")
            test.eq(device.poll(session, f.endpoint, f.save, 110).state, "cancelled")
            test.eq(#f.requests, 1)
            test.eq(f.persisted, 0)
        end)
    end)
end

local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

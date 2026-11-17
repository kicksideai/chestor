-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Agent accounts are components: HTTP responses omit their credentials,
-- grants decide who sees and runs on an account, including subscription logins.
local test = require("test")
local deletion_worker = require("deletion_worker")
local identity = require("identity")

local READ = 1

local function cases()
    test.describe("autocode account components", function()
        local users = {}
        local function track(user)
            users[#users + 1] = user
            return user
        end

        -- share grants the platform Members group access through the
        -- component share endpoint, as the share dialog does.
        local function share(user, id, mask)
            local response = identity.request(user, "POST", "/component-access/share/" .. id,
                {subject_id = identity.MEMBERS, subject_type = "group", access_mask = mask})
            if response.status ~= 200 then return response.body end
            return nil
        end

        test.after_each(function()
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)

        local function create(user, agent, kind, label, secret, endpoint)
            return identity.request(user, "POST", "/autocode/accounts",
                {agent = agent, credential_kind = kind, label = label, secret = secret, endpoint = endpoint})
        end

        local function login(user, label, secret, endpoint)
            return create(user, "claude", "env:CLAUDE_CODE_OAUTH_TOKEN", label, secret, endpoint)
        end

        local function listed(user, id)
            local response = identity.request(user, "GET", "/autocode/accounts")
            test.eq(response.status, 200, response.body)
            for _, account in ipairs(response.json.accounts) do
                if account.id == id then return account, response.body end
            end
            return nil, response.body
        end

        test.it("rejects invalid durations before they replace effective settings", function()
            local admin = track(identity.admin())
            for _, pair in ipairs({{"run_timeout", "59s"}, {"run_retention", "0s"}, {"account_cooldown", "-1s"}, {"build_cache_retention", "0s"}, {"build_cache_retention", "-1h"}, {"build_cache_retention", "invalid"}}) do
                local response = identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = pair[1], value = pair[2]})
                identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = pair[1]})
                test.eq(response.status, 400, response.body)
            end
        end)
        test.it("validates event budgets and the workflow delivery window through Settings", function()
            local admin = track(identity.admin())
            for _, setting in ipairs({{key = "run_event_count", good = 4, bad = {3, 100001, 4.5}},
                {key = "run_event_bytes", good = 1024, bad = {1023, 1073741825, 2048.5}},
                {key = "workflow_delivery_timeout", good = "1h", bad = {"0s", "-1s", "invalid"}}}) do
                local accepted = identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = setting.key, value = setting.good})
                identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = setting.key})
                test.eq(accepted.status, 200, accepted.body)
                for _, value in ipairs(setting.bad) do
                    local rejected = identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = setting.key, value = value})
                    identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = setting.key})
                    test.eq(rejected.status, 400, rejected.body)
                end
            end
        end)
        test.it("bounds the run timeout setting at seven days", function()
            local admin = track(identity.admin())
            local accepted = identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = "run_timeout", value = "168h"})
            local rejected = identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = "run_timeout", value = "168h1ms"})
            identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = "run_timeout"})
            test.eq(accepted.status, 200, accepted.body)
            test.eq(rejected.status, 400, rejected.body)
        end)
        test.it("keeps the credential private and lists the account to its owner", function()
            local owner = track(identity.member())
            local secret = "harness-oauth-" .. string.rep("k", 32)
            local created = login(owner, "Owner login", secret)
            test.eq(created.status, 201, created.body)
            local account, body = listed(owner, created.json.id)
            test.not_nil(account, body)
            test.eq(account.mine, true)
            test.eq(account.usable, true)
            test.eq(account.label, "Owner login")
            test.is_nil(body:find(secret, 1, true), "the account listing returns the credential")
        end)

        test.it("hides an account from other members until it is shared", function()
            local owner = track(identity.member())
            local other = track(identity.member())
            local created = login(owner, "Team login", "harness-oauth-" .. string.rep("t", 32))
            test.eq(created.status, 201, created.body)
            local id = created.json.id

            test.is_nil(listed(other, id))
            test.eq(identity.request(other, "PUT", "/autocode/accounts/" .. id, {label = "Taken"}).status, 404)
            test.eq(identity.request(other, "DELETE", "/autocode/accounts/" .. id).status, 404)

            local share_err = share(owner, id, READ)
            test.is_nil(share_err)
            local shared = listed(other, id)
            test.not_nil(shared, "a shared account is not listed")
            test.eq(shared.mine, false)
            test.eq(shared.usable, true)
            test.eq(shared.writable, false)
            test.eq(identity.request(other, "PUT", "/autocode/accounts/" .. id, {label = "Taken"}).status, 404)
        end)

        test.it("makes a shared subscription login usable for grantees", function()
            local owner = track(identity.member())
            local other = track(identity.member())
            local created = login(owner, "Personal login", "harness-oauth-" .. string.rep("s", 32))
            test.eq(created.status, 201, created.body)
            local mine = listed(owner, created.json.id)
            test.eq(mine.subscription, true)
            test.eq(mine.usable, true)
            test.is_nil(mine.shareable)
            local share_err = share(owner, created.json.id, READ)
            test.is_nil(share_err)
            local theirs = listed(other, created.json.id)
            test.not_nil(theirs)
            test.eq(theirs.usable, true)
        end)

        test.it("refuses an endpoint that carries credentials or a subscription login", function()
            local owner = track(identity.member())
            local userinfo = create(owner, "codex", "env:CODEX_API_KEY", "Userinfo", "test-key", {base_url = "http://user:pass@api.example.com:8000/v1"})
            test.eq(userinfo.status, 400, userinfo.body)
            local personal = login(owner, "Personal", "test-subscription", {base_url = "http://api.example.com:8000/v1"})
            test.eq(personal.status, 400, personal.body)
            local own = create(owner, "codex", "env:CODEX_API_KEY", "Own endpoint", "test-key", {base_url = "http://api.example.com:8000/v1", model = "qwen3-coder"})
            test.eq(own.status, 201, own.body)
            local account = listed(owner, own.json.id)
            test.eq(account.endpoint.base_url, "http://api.example.com:8000/v1")
            test.eq(account.endpoint.model, "qwen3-coder")
        end)

        test.it("disables and deletes an account through its owner", function()
            local owner = track(identity.member())
            local created = login(owner, "Short lived", "harness-oauth-" .. string.rep("d", 32))
            test.eq(created.status, 201, created.body)
            local id = created.json.id
            test.eq(identity.request(owner, "PUT", "/autocode/accounts/" .. id, {enabled = false}).status, 200)
            test.eq(listed(owner, id).enabled, false)
            test.eq(identity.request(owner, "DELETE", "/autocode/accounts/" .. id).status, 200)
            local finished, finish_err = deletion_worker.await(id)
            test.is_nil(finish_err, tostring(finish_err))
            test.is_true(finished)
            test.is_nil(listed(owner, id))
        end)

        test.it("reports account DELETE independently of WRITE", function()
            local owner = track(identity.member())
            local other = track(identity.member())
            local created = login(owner, "Grant masks", "harness-oauth-" .. string.rep("g", 32))
            test.eq(created.status, 201, created.body)
            local id = created.json.id
            test.eq(listed(owner, id).deletable, true)
            test.is_nil(listed(owner, id).shareable)
            test.is_nil(share(owner, id, 3))
            test.eq(listed(other, id).writable, true)
            test.eq(listed(other, id).deletable, false)
            test.eq(identity.request(other, "DELETE", "/autocode/accounts/" .. id).status, 404)
            test.is_nil(share(owner, id, 5))
            test.eq(listed(other, id).writable, false)
            test.eq(listed(other, id).deletable, true)
            test.eq(identity.request(other, "DELETE", "/autocode/accounts/" .. id).status, 200)
        end)

        test.it("accepts WRITE-only and DELETE-only grants without requiring READ", function()
            local owner = track(identity.member())
            local other = track(identity.member())
            local created = login(owner, "Independent masks", "harness-oauth-" .. string.rep("i", 32))
            test.eq(created.status, 201, created.body)
            local id = created.json.id
            test.is_nil(share(owner, id, 2))
            test.is_nil(listed(other, id))
            local updated = identity.request(other, "PUT", "/autocode/accounts/" .. id, {label = "Write only"})
            test.eq(updated.status, 200, updated.body)
            test.is_nil(share(owner, id, 4))
            local removed = identity.request(other, "DELETE", "/autocode/accounts/" .. id)
            test.eq(removed.status, 200, removed.body)
        end)

        for _, kind in ipairs({"image", "workspace"}) do
            test.it("reports " .. kind .. " DELETE independently of WRITE", function()
                local admin = track(identity.admin())
                local member = track(identity.member())
                local id, err = identity.call(admin, "app:fixture_register", kind,
                    {title = "Grant masks", ref = "autocode-harness:grant-masks", status = "ready"}, {})
                test.is_nil(err)
                test.not_nil(id)
                local function view()
                    local response = identity.request(member, "GET", "/autocode/" .. kind .. "s")
                    test.eq(response.status, 200, response.body)
                    for _, item in ipairs(response.json[kind .. "s"]) do
                        if item.id == id then return item end
                    end
                    error("shared " .. kind .. " is not listed")
                end
                test.is_nil(share(admin, id, 3))
                test.eq(view().writable, true)
                test.eq(view().deletable, false)
                test.is_nil(share(admin, id, 5))
                test.eq(view().writable, false)
                test.eq(view().deletable, true)
                test.eq(identity.request(member, "DELETE", "/autocode/" .. kind .. "s/" .. id).status, 403)
            end)
        end
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

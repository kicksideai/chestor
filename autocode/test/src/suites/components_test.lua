-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Agent accounts are components: the credential lives in private context
-- and never leaves it, grants decide who sees an account, and a personal
-- subscription login stays its owner's to run on even when shared.
local test = require("test")
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

        -- kinds returns Claude Code's API key and subscription credential ids.
        local function kinds(user)
            local catalog = identity.request(user, "GET", "/autocode/catalog")
            test.eq(catalog.status, 200, catalog.body)
            local key, subscription
            for _, agent in ipairs(catalog.json.agents) do
                if agent.id == "claude" then
                    for _, choice in ipairs(agent.credentials) do
                        if not choice.file and not choice.subscription then key = key or choice.id end
                        if not choice.file and choice.subscription then subscription = subscription or choice.id end
                    end
                end
            end
            test.not_nil(key, "claude offers no API key credential")
            test.not_nil(subscription, "claude offers no subscription token credential")
            return key, subscription
        end

        local function create(user, kind, label, secret, endpoint)
            local response = identity.request(user, "POST", "/autocode/accounts",
                {agent = "claude", credential_kind = kind, label = label, secret = secret, endpoint = endpoint})
            return response
        end

        local function listed(user, id)
            local response = identity.request(user, "GET", "/autocode/accounts")
            test.eq(response.status, 200, response.body)
            for _, account in ipairs(response.json.accounts) do
                if account.id == id then return account, response.body end
            end
            return nil, response.body
        end

        test.it("keeps the credential private and lists the account to its owner", function()
            local owner = track(identity.member())
            local key = kinds(owner)
            local secret = "sk-ant-harness-" .. string.rep("k", 32)
            local created = create(owner, key, "Owner key", secret)
            test.eq(created.status, 201, created.body)
            local account, body = listed(owner, created.json.id)
            test.not_nil(account, body)
            test.eq(account.mine, true)
            test.eq(account.usable, true)
            test.eq(account.label, "Owner key")
            test.is_nil(body:find(secret, 1, true), "the account listing returns the credential")
        end)

        test.it("hides an account from other members until it is shared", function()
            local owner = track(identity.member())
            local other = track(identity.member())
            local key = kinds(owner)
            local created = create(owner, key, "Team key", "sk-ant-harness-" .. string.rep("t", 32))
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

        test.it("keeps a shared subscription login unusable for others", function()
            local owner = track(identity.member())
            local other = track(identity.member())
            local _, subscription = kinds(owner)
            local created = create(owner, subscription, "Personal login", "harness-oauth-" .. string.rep("s", 32))
            test.eq(created.status, 201, created.body)
            local mine = listed(owner, created.json.id)
            test.eq(mine.subscription, true)
            test.eq(mine.usable, true)
            test.eq(mine.shareable, false)
            local share_err = share(owner, created.json.id, READ)
            test.is_nil(share_err)
            local theirs = listed(other, created.json.id)
            test.not_nil(theirs)
            test.eq(theirs.usable, false)
        end)

        test.it("refuses an endpoint that carries credentials or a subscription login", function()
            local owner = track(identity.member())
            local key, subscription = kinds(owner)
            local secret = "sk-ant-harness-" .. string.rep("e", 32)
            local userinfo = create(owner, key, "Userinfo", secret, {base_url = "http://user:pass@api.example.com:8000/v1"})
            test.eq(userinfo.status, 400, userinfo.body)
            local personal = create(owner, subscription, "Personal", secret, {base_url = "http://api.example.com:8000/v1"})
            test.eq(personal.status, 400, personal.body)
            local own = create(owner, key, "Own endpoint", secret, {base_url = "http://api.example.com:8000/v1", model = "qwen3-coder"})
            test.eq(own.status, 201, own.body)
            local account = listed(owner, own.json.id)
            test.eq(account.endpoint.base_url, "http://api.example.com:8000/v1")
            test.eq(account.endpoint.model, "qwen3-coder")
        end)

        test.it("disables and deletes an account through its owner", function()
            local owner = track(identity.member())
            local key = kinds(owner)
            local created = create(owner, key, "Short lived", "sk-ant-harness-" .. string.rep("d", 32))
            test.eq(created.status, 201, created.body)
            local id = created.json.id
            test.eq(identity.request(owner, "PUT", "/autocode/accounts/" .. id, {enabled = false}).status, 200)
            test.eq(listed(owner, id).enabled, false)
            test.eq(identity.request(owner, "DELETE", "/autocode/accounts/" .. id).status, 200)
            test.is_nil(listed(owner, id))
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

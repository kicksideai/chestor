-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local repo = require("repo")
local component = require("component")
local live = require("live")
local function cases()
    test.describe("autocode account contracts", function()
        local fixture = require("contract_fixture").new()
        local users, member, call = fixture.users, fixture.member, fixture.call
        test.after_each(fixture.release)
        test.it("rotates the credential and endpoint, clears health, and keeps sharing absent", function()
            local user = member()
            local contract = "chestor.autocode:accounts"
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "rotate", secret = "old"}, contract)
            repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"}, {agent = "claude", account_id = added.id,
                image_id = "fixture", options = {}, unattended = false, repo_url = "", prompt = "task", timeout_ms = 60000})
            for _, patch in ipairs({{secret = "new"}, {endpoint = {protocol = "anthropic-messages", base_url = "https://example.com/v1", model = "model"}}}) do
                test.is_nil(repo.settle_account(added.id, "stale refusal", "2999-01-01T00:00:00Z"))
                patch.id = added.id
                local result, err = call(user, "update_account", patch, contract)
                test.is_nil(err, tostring(err))
                test.is_nil(result.health_error)
                local states = repo.account_states({added.id})
                test.eq(states[added.id].cooldown_until, "")
                test.eq(states[added.id].last_error, "")
                local listed = call(user, "list_accounts", {})
                local found
                for _, item in ipairs(listed.accounts) do if item.id == added.id then found = item end end
                test.eq(found.last_error, "")
                test.eq(found.cooldown_until, "")
                test.is_nil(found.shareable)
                if patch.endpoint then test.eq(found.endpoint.base_url, patch.endpoint.base_url) end
            end
        end)
        test.it("manages accounts through a separate credential-bearing contract", function()
            local user, other = member(), member()
            local contract = "chestor.autocode:accounts"
            local added, err = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"}, contract)
            test.is_nil(err, tostring(err))
            local _, denied = call(other, "update_account", {id = added.id, secret = "stolen"}, contract)
            test.is_true(errors.is(denied, errors.NOT_FOUND))
            local updated, update_err = call(user, "update_account", {id = added.id, secret = "replacement", label = "renamed"}, contract)
            test.is_nil(update_err, tostring(update_err))
            test.eq(updated.id, added.id)
            local removed, remove_err = call(user, "remove_account", {id = added.id}, contract)
            test.is_nil(remove_err, tostring(remove_err))
            test.eq(removed.id, added.id)
            local outsider = identity.outsider()
            users[#users + 1] = outsider
            for _, method in ipairs({"add_account", "update_account", "remove_account"}) do
                local _, refused = call(outsider, method, {}, contract)
                test.is_true(errors.is(refused, errors.PERMISSION_DENIED))
            end
        end)
        test.it("filters disabled and unsupported accounts with admission's eligibility", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"}, "chestor.autocode:accounts")
            call(user, "update_account", {id = added.id, enabled = false}, "chestor.autocode:accounts")
            local available = call(user, "list_accounts", {})
            for _, account in ipairs(available.accounts) do test.is_true(account.id ~= added.id) end
            local all = call(user, "list_accounts", {include_unavailable = true})
            local found
            for _, account in ipairs(all.accounts) do if account.id == added.id then found = account end end
            test.not_nil(found)
            test.eq(found.usable, false)
            test.not_nil(found.unavailable_reason)
        end)
        test.it("reads card state from component public metadata rather than its internal read model", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"}, "chestor.autocode:accounts")
            local _, err = component.set_runtime_meta(added.id, {last_error = "snapshot", runs_day = 42})
            test.is_nil(err)
            local all = call(user, "list_accounts", {include_unavailable = true})
            local found
            for _, account in ipairs(all.accounts) do if account.id == added.id then found = account end end
            test.eq(found.last_error, "snapshot")
            test.eq(found.runs_day, 42)
        end)
        test.it("separates cooldown from account eligibility in the DTO", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"}, "chestor.autocode:accounts")
            repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"}, {agent = "claude", account_id = added.id,
                image_id = "fixture", options = {}, unattended = false, repo_url = "", prompt = "task", timeout_ms = 60000})
            test.is_nil(repo.settle_account(added.id, "busy", "2999-01-01T00:00:00Z"))
            test.is_nil(live.account(added.id))
            local all = call(user, "list_accounts", {include_unavailable = true})
            local found
            for _, account in ipairs(all.accounts) do if account.id == added.id then found = account end end
            test.not_nil(found)
            test.is_true(found.usable)
            test.eq(found.cooldown_until, "2999-01-01T00:00:00Z")
            test.is_nil(found.unavailable_reason)
        end)
        test.it("explicitly enabling a cooling account clears its cooldown", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"}, "chestor.autocode:accounts")
            repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"}, {agent = "claude", account_id = added.id,
                image_id = "fixture", options = {}, unattended = false, repo_url = "", prompt = "task", timeout_ms = 60000})
            test.is_nil(repo.settle_account(added.id, "busy", "2999-01-01T00:00:00Z"))
            local result, err = call(user, "update_account", {id = added.id, enabled = true}, "chestor.autocode:accounts")
            test.is_nil(err, tostring(err))
            test.not_nil(result)
            local states = repo.account_states({added.id})
            test.eq(states[added.id].cooldown_until, "")
        end)
        test.it("publishes image defaults and authoritative credential metadata", function()
            local response = identity.request(member(), "GET", "/autocode/catalog")
            test.eq(response.status, 200, response.body)
            test.eq(response.json.settings_path, "/system/autocode")
            test.not_nil(response.json.default_image.settings)
            test.eq(response.json.account_limits.secret_bytes, 65536)
            for _, agent in ipairs(response.json.agents) do
                test.not_nil(agent.icon)
                for _, kind in ipairs(agent.credentials) do test.not_nil(kind.format) end
            end
        end)
        test.it("publishes one named Autocode section and its five settings through platform settings", function()
            local admin = identity.admin()
            users[#users + 1] = admin
            local blocks = identity.request(admin, "GET", "/settings/blocks")
            test.eq(blocks.status, 200, blocks.body)
            local count = 0
            for _, block in ipairs(blocks.json.blocks) do
                if block.namespace == "chestor.autocode" then
                    count = count + 1
                    test.eq(block.key, "autocode")
                    test.eq(block.title, "Autocode")
                    test.eq(block.icon, "tabler:robot")
                    test.eq(block.group, "Application")
                    test.eq(block.order, 80)
                end
            end
            test.eq(count, 1)
            local response = identity.request(admin, "GET", "/settings?namespace=chestor.autocode")
            test.eq(response.status, 200, response.body)
            test.eq(#response.json.settings, 5)
            local by_key = {}
            for _, setting in ipairs(response.json.settings) do by_key[setting.key] = setting end
            test.eq(by_key.run_retention.title, "Run and log retention")
            test.eq(by_key.run_retention.category, "Runs")
            test.eq(by_key.image_build_timeout.category, "Images and Docker")
            test.is_true(by_key.image_build_timeout.order < by_key.build_cache_retention.order)
        end)
        test.it("replaces credentials and endpoints in place and rejects malformed endpoint URLs", function()
            local user = member()
            local created = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"})
            test.eq(created.status, 201, created.body)
            local path = "/autocode/accounts/" .. created.json.id
            local updated = identity.request(user, "PUT", path, {secret = "replacement", endpoint = {protocol = "anthropic-messages", base_url = "https://example.com/v1"}})
            test.eq(updated.status, 200, updated.body)
            local invalid = identity.request(user, "PUT", path, {endpoint = {protocol = "anthropic-messages", base_url = "https://:bad"}})
            test.eq(invalid.status, 400, invalid.body)
        end)
        test.it("rejects array request bodies before image settings can change", function()
            local admin = identity.admin()
            users[#users + 1] = admin
            local id, err = identity.call(admin, "app:fixture_register", "image", {title = "Keep", ref = "fixture:keep", home = "/opt/keep"}, {settings = {memory = "8g"}})
            test.is_nil(err)
            for _, body in ipairs({table.create(1, 0), {false}}) do
                local response = identity.request(admin, "PUT", "/autocode/images/" .. id, body)
                test.eq(response.status, 400, response.body)
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

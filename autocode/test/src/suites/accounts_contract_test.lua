-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local repo = require("repo")
local component = require("component")
local live = require("live")
local sql = require("sql")
local function cases()
    test.describe("autocode account contracts", function()
        local fixture = require("contract_fixture").new()
        local users, member, call = fixture.users, fixture.member, fixture.call
        test.after_each(fixture.release)
        test.it("refuses a Claude API-key account with a typed error", function()
            local user = member()
            local added, err = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY",
                label = "Unsupported credential", secret = "test-only"}, "chestor.autocode:accounts")
            test.is_nil(added)
            test.is_true(errors.is(err, errors.INVALID), tostring(err))
            test.eq(err:details().code, "autocode.invalid_account")
        end)
        test.it("publishes rolling account counts on the existing account activity projection", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN", label = "rolling", secret = "test-subscription"}, "chestor.autocode:accounts")
            local id = user.id
            local db = sql.get("app:db")
            test.not_nil(db:execute([[INSERT INTO chestor_autocode_runs
                (id, owner_id, actor_id, actor_context, agent, account_id, image_id, prompt, timeout_ms, status, created_at)
                VALUES ($1, $1, $1, '{}', 'claude', $2, 'fixture', 'task', 60000, 'failed', $3)]], {id, added.id, repo.now()}))
            db:release()
            test.is_nil(live.account(added.id))
            local first = call(user, "list_accounts", {})
            test.eq(first.accounts[1].runs_day, 1)
            test.eq(first.accounts[1].failures_day, 1)
            local snapshots = component.list_system({component_ids = {added.id}, include = {meta = true}, limit = 1})
            test.eq(tonumber(snapshots[1].meta.runs_day), first.accounts[1].runs_day)
            test.eq(tonumber(snapshots[1].meta.failures_day), first.accounts[1].failures_day)
            db = sql.get("app:db")
            test.not_nil(db:execute("UPDATE chestor_autocode_runs SET created_at = '2000-01-01T00:00:00Z' WHERE id = $1", {id}))
            db:release()
            local unchanged = call(user, "list_accounts", {})
            test.eq(unchanged.accounts[1].runs_day, 1)
            test.eq(unchanged.accounts[1].failures_day, 1)
            test.is_nil(live.account(added.id))
            local aged = call(user, "list_accounts", {})
            test.eq(aged.accounts[1].runs_day, 0)
            test.eq(aged.accounts[1].failures_day, 0)
        end)
        test.it("rotates the credential and endpoint, clears health, and keeps sharing absent", function()
            local user = member()
            local contract = "chestor.autocode:accounts"
            local added = call(user, "add_account", {agent = "codex", credential_kind = "env:CODEX_API_KEY", label = "rotate", secret = "old"}, contract)
            repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"}, {agent = "codex", account_id = added.id,
                image_id = "fixture", options = {}, unattended = false, repo_url = "", prompt = "task", timeout_ms = 60000})
            for _, patch in ipairs({{secret = "new"}, {endpoint = {protocol = "openai-responses", base_url = "https://example.com/v1", model = "model"}}}) do
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
        test.it("returns native deletion acceptance through the account contract", function()
            local user = member()
            local contract = "chestor.autocode:accounts"
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN", label = "delete", secret = "test-subscription"}, contract)
            local removed, err = call(user, "remove_account", {id = added.id}, contract)
            test.is_nil(err, tostring(err))
            test.eq(removed.id, added.id)
            if removed.in_progress then
                test.is_false(removed.deleted)
                test.not_nil(removed.job_id)
            else
                test.is_true(removed.deleted)
            end
        end)
        test.it("manages accounts through a separate credential-bearing contract", function()
            local user, other = member(), member()
            local contract = "chestor.autocode:accounts"
            local added, err = call(user, "add_account", {agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN", label = "Login", secret = "test-subscription"}, contract)
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
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN", label = "Login", secret = "test-subscription"}, "chestor.autocode:accounts")
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
        test.it("renders account counts and health from public component snapshots", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN", label = "Login", secret = "test-subscription"}, "chestor.autocode:accounts")
            local _, err = component.set_runtime_meta(added.id, {last_error = "snapshot", runs_day = 42, failures_day = 7})
            test.is_nil(err)
            local all = call(user, "list_accounts", {include_unavailable = true})
            local found
            for _, account in ipairs(all.accounts) do if account.id == added.id then found = account end end
            test.eq(found.last_error, "snapshot")
            test.eq(found.runs_day, 42)
            test.eq(found.failures_day, 7)
        end)
        test.it("separates cooldown from account eligibility in the DTO", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN", label = "Login", secret = "test-subscription"}, "chestor.autocode:accounts")
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
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN", label = "Login", secret = "test-subscription"}, "chestor.autocode:accounts")
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
            local claude
            for _, agent in ipairs(response.json.agents) do
                test.not_nil(agent.icon)
                for _, kind in ipairs(agent.credentials) do test.not_nil(kind.format) end
                if agent.id == "claude" then claude = agent end
            end
            test.not_nil(claude)
            test.eq(#claude.endpoints, 0)
            test.eq(#claude.credentials, 2)
            local choices = {}
            for _, kind in ipairs(claude.credentials) do
                test.is_true(kind.subscription)
                choices[kind.id] = kind.format
            end
            test.eq(choices["file:.claude/.credentials.json"], "json_object")
            test.eq(choices["env:CLAUDE_CODE_OAUTH_TOKEN"], "single_line")
        end)
        test.it("publishes one named Autocode section and its fifteen settings through platform settings", function()
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
            test.eq(#response.json.settings, 15)
            local by_key = {}
            for _, setting in ipairs(response.json.settings) do by_key[setting.key] = setting end
            test.eq(by_key.run_event_count.value_type, "int")
            test.eq(by_key.run_event_bytes.value_type, "int")
            test.eq(by_key.workflow_delivery_timeout.value_type, "duration")
            test.eq(by_key.queue_timeout.value_type, "duration")
            for _, key in ipairs({"pending_runs_per_owner", "pending_runs_global", "result_bytes", "event_text_bytes", "build_log_bytes", "clone_depth"}) do
                test.eq(by_key[key].value_type, "int")
                test.is_true(by_key[key].editable)
            end
            test.eq(by_key.run_retention.title, "Run and log retention")
            test.eq(by_key.run_retention.category, "Runs")
            test.eq(by_key.image_build_timeout.category, "Images and Docker")
            test.is_true(by_key.image_build_timeout.order < by_key.build_cache_retention.order)
        end)
        test.it("replaces credentials and endpoints in place and rejects malformed endpoint URLs", function()
            local user = member()
            local created = identity.request(user, "POST", "/autocode/accounts", {agent = "codex", credential_kind = "env:CODEX_API_KEY", label = "Key", secret = "test-key"})
            test.eq(created.status, 201, created.body)
            local path = "/autocode/accounts/" .. created.json.id
            local updated = identity.request(user, "PUT", path, {secret = "replacement", endpoint = {protocol = "openai-responses", base_url = "https://example.com/v1", model = "model"}})
            test.eq(updated.status, 200, updated.body)
            local invalid = identity.request(user, "PUT", path, {endpoint = {protocol = "openai-responses", base_url = "https://:bad", model = "model"}})
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

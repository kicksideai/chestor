-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local build_fixture = require("build_fixture")
local registry = require("registry")
local repo = require("repo")
local uuid = require("uuid")
local json = require("json")
local sql = require("sql")
local function cases()
    test.describe("autocode task contracts", function()
        local users = {}
        local function member()
            local user = identity.member()
            users[#users + 1] = user
            return user
        end
        local function call(user, method, input, contract)
            local result, err = identity.call(user, "app:task_probe", {method = method, input = input, contract = contract})
            if result then
                local definition = registry.get(contract or "chestor.autocode:tasks")
                for _, declared in ipairs(definition.data.methods) do
                    if declared.name == method then
                        local valid, problem = json.validate(declared.output_schemas[1].definition, result)
                        test.eq(valid, true, tostring(problem))
                    end
                end
            end
            return result, err
        end
        local function image_for(user)
            local admin = identity.admin()
            users[#users + 1] = admin
            local list = call(user, "list_agents", {})
            local allows
            for _, agent in ipairs(list.agents) do if agent.id == "claude" then allows = agent.capabilities end end
            local image, err = identity.call(admin, "app:fixture_register", "image", {title = "fixture", ref = "chestor-autocode-harness:missing", home = "/opt/agent", agents = {"claude"}, status = "ready"}, {settings = {network = "none", allows = allows}})
            test.is_nil(err)
            build_fixture.ready(image, admin.id, "chestor-autocode-harness:missing", "/opt/agent", {network = "none", allows = allows})
            local shared = identity.request(admin, "POST", "/component-access/share/" .. image, {subject_id = user.id, subject_type = "user", access_mask = 1})
            test.eq(shared.status, 200, shared.body)
            return image
        end
        local function flow_for(user)
            local id = uuid.v7()
            local db = sql.get("app:db")
            local _, err = db:execute([[INSERT INTO dataflows
                (dataflow_id, actor_id, type, status, created_at, updated_at)
                VALUES ($1, $2, 'test', 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)]], {id, user.id})
            db:release()
            test.is_nil(err)
            return id
        end
        test.after_each(function()
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)
        test.it("binds every documented method and declares both JSON schemas", function()
            for _, name in ipairs({"tasks", "accounts"}) do
                local definition = registry.get("chestor.autocode:" .. name)
                test.not_nil(definition)
                local binding = registry.get("chestor.autocode:" .. name .. "_binding")
                test.not_nil(binding)
                test.eq(binding.data.contracts[1].default, true)
                for _, method in ipairs(definition.data.methods) do
                    test.eq(method.input_schemas[1].format, "application/schema+json")
                    test.eq(method.output_schemas[1].format, "application/schema+json")
                    test.not_nil(registry.get(binding.data.contracts[1].methods[method.name]))
                end
            end
        end)
        test.it("discovers usable resources as a member through the default binding", function()
            local user = member()
            for _, pair in ipairs({{"list_agents", "agents"}, {"list_accounts", "accounts"}, {"list_images", "images"}, {"list_workspaces", "workspaces"}, {"list_runs", "runs"}}) do
                local result, err = call(user, pair[1])
                test.is_nil(err, tostring(err))
                test.not_nil(result[pair[2]])
                test.is_nil(result.success)
            end
        end)
        test.it("refuses outsiders on every task method", function()
            local user = identity.outsider()
            users[#users + 1] = user
            for _, method in ipairs({"list_agents", "list_accounts", "list_images", "list_workspaces", "submit_task", "get_run", "list_runs", "cancel_run"}) do
                local result, err = call(user, method)
                test.is_nil(result)
                test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            end
        end)
        test.it("uses the same typed task validation for HTTP and the Block", function()
            local user = member()
            local flow_id = flow_for(user)
            for _, config in ipairs({{agent = "claude", image_id = "image", prompt = " "},
                {agent = "claude", image_id = "image", prompt = "task", options = {"bad"}},
                {agent = "claude", image_id = "image", prompt = "task", unattended = "yes"},
                {agent = "claude", image_id = "image", prompt = "task", timeout = "bad"}}) do
                local http = identity.request(user, "POST", "/autocode/runs", config)
                test.eq(http.status, 400, http.body)
                local _, err = identity.call(user, "chestor.autocode.blocks:arm_task", {config = config, idempotency_key = uuid.v7(), dataflow_id = flow_id, signal_id = "signal", include_input = false})
                test.is_true(errors.is(err, errors.INVALID), tostring(err))
                local fields = {details = err:details()}
                test.eq(http.json.details.code, fields.details.code)
                test.eq(http.json.retryable, false)
            end
        end)
        test.it("hides runs across owners and bounds event pages", function()
            local owner, other = member(), member()
            local id = repo.create_run(owner.id, {actor_id = owner.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "task", repo_url = "", timeout_ms = 60000}, function() return function() return nil end end)
            for seq = 1, 3 do test.is_nil(repo.append_event(id, seq, "log", "line")) end
            local page, err = call(owner, "get_run", {run_id = id, limit = 2})
            test.is_nil(err, tostring(err))
            test.eq(#page.events, 2)
            test.eq(page.more, true)
            test.eq(page.next_seq, 2)
            local second = call(owner, "get_run", {run_id = id, after_seq = page.next_seq, limit = 2})
            test.eq(#second.events, 1)
            test.eq(second.more, false)
            local hidden, hidden_err = call(other, "get_run", {run_id = id})
            test.is_nil(hidden)
            test.is_true(errors.is(hidden_err, errors.NOT_FOUND))
        end)
        test.it("paginates summaries with a stable tie breaker and rejects forged identity", function()
            local user = member()
            for i = 1, 3 do
                repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                    {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "task " .. i, repo_url = "", timeout_ms = 60000}, function() return function() return nil end end)
            end
            local first, err = call(user, "list_runs", {limit = 2})
            test.is_nil(err, tostring(err))
            test.eq(#first.runs, 2)
            test.not_nil(first.next_cursor)
            test.is_nil(first.runs[1].options)
            test.not_nil(first.runs[1].prompt_summary)
            local second = call(user, "list_runs", {limit = 2, cursor = first.next_cursor})
            test.eq(#second.runs, 1)
            test.is_true(second.runs[1].id ~= first.runs[2].id)
            local _, denied = call(user, "list_runs", {owner_id = "forged"})
            test.is_true(errors.is(denied, errors.INVALID))
        end)
        test.it("submits and replays caller keys through HTTP and the contract", function()
            local user = member()
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"})
            test.eq(account.status, 201, account.body)
            local image = image_for(user)
            local request = {agent = "claude", account_id = account.json.id, image_id = image, prompt = "task", unattended = false, idempotency_key = " " .. uuid.v7() .. " "}
            local submitted, err = call(user, "submit_task", request)
            test.is_nil(err, tostring(err))
            test.not_nil(submitted.run_id)
            local replay = identity.request(user, "POST", "/autocode/runs", request)
            test.eq(replay.status, 201, replay.body)
            test.eq(replay.json.run_id, submitted.run_id)
            local run = call(user, "get_run", {run_id = submitted.run_id})
            test.eq(run.run.unattended, false)
            request.prompt = "changed"
            local _, conflict = call(user, "submit_task", request)
            test.is_true(errors.is(conflict, errors.CONFLICT), tostring(conflict))
            test.eq(conflict:retryable(), false)
            test.not_nil(conflict:details().code)
        end)
        test.it("refuses another user's dataflow and signal before submission", function()
            local user, other = member(), member()
            local flow_id, signal_id = flow_for(other), uuid.v7()
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"})
            local image = image_for(user)
            local result, err = identity.call(user, "chestor.autocode.blocks:arm_task", {
                config = {agent = "claude", account_id = account.json.id, image_id = image, prompt = "task"},
                idempotency_key = uuid.v7(), dataflow_id = flow_id, signal_id = signal_id})
            test.is_nil(result)
            test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            test.eq(err:details().code, "autocode.flow_access_denied")
            local listed = call(user, "list_runs", {})
            test.eq(#listed.runs, 0)
        end)
        test.it("passes the durable arm key unchanged and records its callback atomically", function()
            local user = member()
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"})
            local image = image_for(user)
            local flow_id = flow_for(user)
            local key = " durable " .. uuid.v7() .. " "
            local args = {config = {agent = "claude", account_id = account.json.id, image_id = image, prompt = "task", unattended = false}, idempotency_key = key, dataflow_id = flow_id, signal_id = "signal"}
            local first, err = identity.call(user, "chestor.autocode.blocks:arm_task", args)
            test.is_nil(err, tostring(err))
            local second, replay_err = identity.call(user, "chestor.autocode.blocks:arm_task", args)
            test.is_nil(replay_err, tostring(replay_err))
            test.eq(first.run_id, second.run_id)
            local stored = repo.run(user.id, first.run_id)
            test.eq(stored.flow.dataflow_id, flow_id)
            test.eq(stored.flow.signal_id, "signal")
            local db = sql.get("app:db")
            local rows, read_err = db:query("SELECT key FROM chestor_autocode_submissions WHERE run_id = $1", {first.run_id})
            db:release()
            test.is_nil(read_err)
            test.eq(rows[1].key, key)
        end)
        test.it("lists only granted, agent-compatible ready images and honors durable builds", function()
            local user, other = member(), member()
            local image = image_for(user)
            local visible = call(user, "list_images", {agent = "claude"})
            local found = false
            for _, item in ipairs(visible.images) do if item.id == image then found = true end end
            test.is_true(found)
            local hidden = call(other, "list_images", {agent = "claude"})
            for _, item in ipairs(hidden.images) do test.is_true(item.id ~= image) end
            local unsupported = call(user, "list_images", {agent = "opencode"})
            for _, item in ipairs(unsupported.images) do test.is_true(item.id ~= image) end
            local err = repo.request_image_build(image, {actor_id = user.id, actor_context = "{}"}, "initial", function() return nil end, uuid.v7())
            test.is_nil(err)
            local ready = call(user, "list_images", {agent = "claude"})
            for _, item in ipairs(ready.images) do test.is_true(item.id ~= image) end
            local all = call(user, "list_images", {agent = "claude", ready_only = false})
            local preparing
            for _, item in ipairs(all.images) do if item.id == image then preparing = item end end
            test.not_nil(preparing)
            test.eq(preparing.status, "preparing")
        end)
        test.it("cancels only the caller's active run and returns a typed settled conflict", function()
            local user, other = member(), member()
            local id = repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "task", repo_url = "", timeout_ms = 60000}, function() return function() return nil end end)
            local hidden, err = call(other, "cancel_run", {run_id = id})
            test.is_nil(hidden)
            test.is_true(errors.is(err, errors.NOT_FOUND))
            local cancelled, cancel_err = call(user, "cancel_run", {run_id = id})
            test.is_nil(cancel_err, tostring(cancel_err))
            test.eq(cancelled.cancel_requested, true)
            repo.finish_run(id, "cancelled", "", "cancelled", {})
            local _, conflict = call(user, "cancel_run", {run_id = id})
            test.is_true(errors.is(conflict, errors.CONFLICT))
        end)
        test.it("decodes HTTP page bounds through shared contract validation", function()
            local user = member()
            local page = identity.request(user, "GET", "/autocode/runs?limit=2")
            test.eq(page.status, 200, page.body)
            for _, value in ipairs({"bad", "0", "2.5", "101"}) do
                local invalid = identity.request(user, "GET", "/autocode/runs?limit=" .. value)
                test.eq(invalid.status, 400, invalid.body)
                test.eq(invalid.json.details.code, "autocode.invalid_request")
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
        test.it("explicitly enabling a cooling account clears its cooldown", function()
            local user = member()
            local added = call(user, "add_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"}, "chestor.autocode:accounts")
            test.is_nil(repo.settle_account(added.id, "busy", "2999-01-01T00:00:00Z"))
            local result, err = call(user, "update_account", {id = added.id, enabled = true}, "chestor.autocode:accounts")
            test.is_nil(err, tostring(err))
            test.not_nil(result)
            local states = repo.account_states({added.id})
            test.eq(states[added.id].cooldown_until, "")
        end)
        test.it("publishes output schemas for both conditional Block routes", function()
            local block = registry.get("chestor.autocode.blocks:block.task").data.block
            for _, port in ipairs(block.ports) do
                if port.id == "then" or port.id == "else" then
                    test.not_nil(port.schema)
                    test.eq(json.encode(port.schema), json.encode(block.output))
                end
            end
        end)
        test.it("rejects invalid page bounds and forged execution fields with typed errors", function()
            local user = member()
            for _, bad in ipairs({{method = "list_runs", input = {limit = 101}}, {method = "get_run", input = {run_id = "id", limit = 0}},
                {method = "get_run", input = {run_id = "id", after_seq = -1}}, {method = "list_runs", input = {cursor = "garbage"}},
                {method = "submit_task", input = {agent = "claude", image_id = "image", prompt = "task", owner_id = user.id}}}) do
                local result, err = call(user, bad.method, bad.input)
                test.is_nil(result)
                test.is_true(errors.is(err, errors.INVALID), tostring(err))
                test.eq(err:retryable(), false)
                test.not_nil(err:details().code)
            end
        end)
        test.it("reads a settled callback through the real synthetic resume entry", function()
            local user = identity.outsider()
            users[#users + 1] = user
            local id = repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "task", repo_url = "", timeout_ms = 60000,
                    flow = {dataflow_id = uuid.v7(), signal_id = "missing-signal"}}, function() return function() return nil end end)
            test.is_true(repo.finish_run(id, "succeeded", "answer", "", {}))
            local result, err = identity.call(user, "app:resume_dispatch", {payload = {run_id = id}})
            test.is_nil(result)
            test.is_true(errors.is(err, errors.UNAVAILABLE), tostring(err))
            test.not_nil(err:message():find("Flow identity unavailable", 1, true), err:message())
            test.not_nil(err:message():find("not found", 1, true), err:message())
            test.is_nil(err:message():find("not allowed", 1, true), err:message())
        end)
        test.it("publishes image defaults and authoritative credential metadata", function()
            local response = identity.request(member(), "GET", "/autocode/catalog")
            test.eq(response.status, 200, response.body)
            test.eq(response.json.settings_path, "/settings?tab=autocode")
            test.not_nil(response.json.default_image.settings)
            test.eq(response.json.account_limits.secret_bytes, 65536)
            for _, agent in ipairs(response.json.agents) do
                test.not_nil(agent.icon)
                for _, kind in ipairs(agent.credentials) do test.not_nil(kind.format) end
            end
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
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

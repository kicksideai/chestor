-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local registry = require("registry")
local repo = require("repo")
local uuid = require("uuid")
local json = require("json")
local sql = require("sql")
local function cases()
    test.describe("autocode task contracts", function()
        local fixture = require("contract_fixture").new()
        local users, member, call, image_for, flow_for = fixture.users, fixture.member, fixture.call, fixture.image_for, fixture.flow_for
        test.after_each(fixture.release)
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
            for _, bad in ipairs({{method = "list_runs", input = {limit = 101}}, {method = "list_runs", input = {limit = "2"}}, {method = "get_run", input = {run_id = "id", limit = 0}},
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
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

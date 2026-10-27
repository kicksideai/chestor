-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local registry = require("registry")
local repo = require("repo")
local uuid = require("uuid")
local json = require("json")
local sql = require("sql")
local component = require("component")
local jobs = require("jobs")
local time = require("time")
local function cases()
    test.describe("autocode task contracts", function()
        local fixture = require("contract_fixture").new()
        local users, member, call, image_for, flow_for = fixture.users, fixture.member, fixture.call, fixture.image_for, fixture.flow_for
        test.after_each(fixture.release)
        test.it("keeps workflow JSON input outside a maximum-sized prompt", function()
            local user = member()
            local image = image_for(user)
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "input", secret = "key"})
            local prompt = string.rep("p", 16384)
            local payload = {value = string.rep("x", 20000)}
            local result, err = identity.call(user, "chestor.autocode.blocks:arm_task", {config = {agent = "claude", account_id = account.json.id,
                image_id = image, prompt = prompt}, input = payload, idempotency_key = uuid.v7(), dataflow_id = flow_for(user), signal_id = "signal"})
            test.is_nil(err, tostring(err))
            local stored = repo.stored_run(result.run_id)
            test.eq(stored.prompt, prompt)
            test.eq(json.decode(stored.input).value, payload.value)
            local _, oversized = call(user, "submit_task", {agent = "claude", image_id = image, prompt = "task", input = string.rep("x", 65537)})
            test.is_true(errors.is(oversized, errors.INVALID), tostring(oversized))
        end)
        test.it("composes the full prompt and bounded JSON input at worker launch", function()
            local user = identity.admin()
            users[#users + 1] = user
            local image = image_for(user)
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "input launch", secret = "key"})
            local prefix = '{"value":"'
            local prompt, input = string.rep("p", 16384), prefix .. string.rep("x", 65536 - #prefix - 2) .. '"}'
            require("stubs").reset()
            local id = require("run_store_subject").create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                {agent = "claude", account_id = account.json.id, account_pinned = true, image_id = image, options = {}, unattended = false,
                    repo_url = "", prompt = prompt, input = input, timeout_ms = 60000})
            local prepared, err = identity.call(user, "chestor.autocode.service:prepare", {run_id = id})
            test.is_nil(err, tostring(err))
            local expected = prompt .. "\n\nInput:\n" .. input
            test.eq(prepared.launch.argv[#prepared.launch.argv], expected)
        end)
        test.it("rebalances unpinned queued accounts and keeps caller-pinned accounts fixed", function()
            for _, unavailable in ipairs({"disabled", "cooldown"}) do
                for _, pinned in ipairs({false, true}) do
                    local user = identity.admin()
                    users[#users + 1] = user
                    local image = image_for(user)
                    local accounts = {}
                    for i = 1, 2 do
                        accounts[i] = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "balance", secret = "key"}).json.id
                    end
                    require("stubs").reset()
                    local id, err = require("run_store_subject").create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                        {agent = "claude", account_id = accounts[1], account_pinned = pinned, image_id = image, options = {}, unattended = false,
                            repo_url = "", prompt = "task", timeout_ms = 60000}, nil, {accounts[1]})
                    test.is_nil(err, tostring(err))
                    local stored = repo.stored_run(id)
                    test.eq(stored.account_pinned, pinned)
                    if unavailable == "disabled" then
                        test.not_nil(call(user, "update_account", {id = stored.account_id, enabled = false}, "chestor.autocode:accounts"))
                    else test.is_nil(repo.settle_account(stored.account_id, "busy", "2999-01-01T00:00:00Z")) end
                    local prepared, prepare_err = identity.call(user, "chestor.autocode.service:prepare", {run_id = stored.id})
                    if pinned then test.is_nil(prepared); test.is_true(errors.is(prepare_err, errors.INVALID), tostring(prepare_err))
                    else
                        test.is_nil(prepare_err, tostring(prepare_err))
                        test.is_true(prepared.account_id ~= stored.account_id)
                        test.eq(repo.stored_run(stored.id).account_id, prepared.account_id)
                    end
                end
            end
        end)
        test.it("keeps object fields as JSON objects through the real HTTP endpoints and contracts", function()
            local user = identity.admin()
            users[#users + 1] = user
            local id = repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false,
                    prompt = "task", repo_url = "", timeout_ms = 60000})
            local catalog = identity.request(user, "GET", "/autocode/catalog")
            test.eq(catalog.status, 200, catalog.body)
            local image = identity.call(user, "app:fixture_register", "image", {title = "object test", ref = "fixture:object", home = "/opt/agent"},
                {settings = catalog.json.default_image.settings})
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "objects", secret = "key"})
            test.eq(account.status, 201, account.body)
            local function objects(schema, value, path)
                if value == nil then return end
                if schema.type == "object" then
                    test.eq(json.encode(value):sub(1, 1), "{", path .. " must encode as an object")
                    for key, field in pairs(schema.properties or {}) do objects(field, value[key], path .. "." .. key) end
                elseif schema.type == "array" then
                    for i, item in ipairs(value) do objects(schema.items or {}, item, path .. "[" .. i .. "]") end
                end
            end
            local definition = registry.get("chestor.autocode:tasks")
            local schemas = {}
            for _, method in ipairs(definition.data.methods) do
                local schema = method.output_schemas[1].definition
                schemas[method.name] = type(schema) == "string" and json.decode(schema) or schema
            end
            for _, endpoint in ipairs({
                {"/runs/" .. id, schemas.get_run}, {"/runs", schemas.list_runs},
                {"/catalog", {type = "object", properties = {agents = schemas.list_agents.properties.agents,
                    default_image = {type = "object", properties = {settings = {type = "object"}}}, account_limits = {type = "object"}}}},
                {"/images/" .. image, {type = "object", properties = {image = {type = "object"}, settings = {type = "object"}}}},
                {"/accounts", schemas.list_accounts},
            }) do
                local response = identity.request(user, "GET", "/autocode" .. endpoint[1])
                test.eq(response.status, 200, response.body)
                objects(endpoint[2], response.json, endpoint[1])
            end
            for _, method in ipairs({"get_run", "list_agents", "list_runs", "list_accounts", "update_account", "remove_account"}) do
                local args = method == "get_run" and {run_id = id} or
                    (method == "update_account" or method == "remove_account") and {id = account.json.id, label = "updated"} or {}
                if method == "remove_account" then args.label = nil end
                local result, err = call(user, method, args, (method == "update_account" or method == "remove_account") and "chestor.autocode:accounts" or nil)
                test.is_nil(err, tostring(err))
                test.eq(json.encode(result):sub(1, 1), "{", method)
                if schemas[method] then objects(schemas[method], result, method) end
            end
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
            require("stubs").reset()
            local id = require("run_store_subject").create_run(owner.id, {actor_id = owner.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "task", repo_url = "", timeout_ms = 60000})
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
        test.it("pages the latest bounded event window backward and continues forward by sequence", function()
            local owner = member()
            require("stubs").reset()
            local id = require("run_store_subject").create_run(owner.id, {actor_id = owner.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "history", repo_url = "", timeout_ms = 60000})
            for seq = 1, 1205 do test.is_nil(repo.append_event(id, seq, "log", "line " .. seq)) end
            local latest, err = call(owner, "get_run", {run_id = id, before_seq = 0})
            test.is_nil(err, tostring(err))
            test.eq(#latest.events, 500)
            test.eq(latest.events[1].seq, 706)
            test.eq(latest.events[500].seq, 1205)
            test.eq(latest.next_seq, 1205)
            test.is_true(latest.more)
            local earlier = call(owner, "get_run", {run_id = id, before_seq = latest.events[1].seq})
            test.eq(#earlier.events, 500)
            test.eq(earlier.events[1].seq, 206)
            test.eq(earlier.events[500].seq, 705)
            test.is_true(earlier.more)
            local oldest = call(owner, "get_run", {run_id = id, before_seq = earlier.events[1].seq})
            test.eq(#oldest.events, 205)
            test.eq(oldest.events[1].seq, 1)
            test.is_false(oldest.more)
            test.is_nil(repo.append_event(id, 1206, "log", "live"))
            local live = call(owner, "get_run", {run_id = id, after_seq = latest.next_seq})
            test.eq(#live.events, 1)
            test.eq(live.events[1].seq, 1206)
            test.eq(live.next_seq, 1206)
            local http = identity.request(owner, "GET", "/autocode/runs/" .. id .. "?before_seq=706&limit=2")
            test.eq(http.status, 200, http.body)
            test.eq(http.json.events[1].seq, 704)
            test.eq(http.json.events[2].seq, 705)
            local _, invalid = call(owner, "get_run", {run_id = id, after_seq = 1, before_seq = 2})
            test.is_true(errors.is(invalid, errors.INVALID))
        end)
        test.it("paginates summaries with a stable tie breaker and rejects forged identity", function()
            local user = member()
            for i = 1, 3 do
                repo.create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                    {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "task " .. i, repo_url = "", timeout_ms = 60000})
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
        test.it("leaves the workflow wait timeout to the platform and maps the run timeout", function()
            local entry = registry.get("chestor.autocode.blocks:block.task")
            local properties = entry.data.block.config.properties
            test.is_nil(properties.timeout)
            test.not_nil(properties.run_timeout)
            local user = member()
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"})
            local image = image_for(user)
            local flow_id = flow_for(user)
            local function arm(run_timeout)
                local config = {agent = "claude", account_id = account.json.id, image_id = image, prompt = "task", unattended = false, run_timeout = run_timeout}
                local armed, err = identity.call(user, "chestor.autocode.blocks:arm_task", {config = config, idempotency_key = uuid.v7(), dataflow_id = flow_id, signal_id = uuid.v7()})
                test.is_nil(err, tostring(err))
                return repo.run(user.id, armed.run_id)
            end
            test.eq(arm("5m").timeout_ms, 300000)
            local direct = call(user, "submit_task", {agent = "claude", account_id = account.json.id, image_id = image, prompt = "task", unattended = false})
            test.eq(arm("").timeout_ms, repo.run(user.id, direct.run_id).timeout_ms)
        end)
        test.it("passes the durable arm key unchanged and records its callback atomically", function()
            local user = member()
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"})
            local image = image_for(user)
            local flow_id = flow_for(user)
            local trace = {trace_id = "block-trace", run_id = "flow-run", caused_by_event_id = "event", correlation_key = "block-key"}
            local key = " durable " .. uuid.v7() .. " "
            local args = {run_context = {trace_context = trace}, config = {agent = "claude", account_id = account.json.id, image_id = image, prompt = "task", unattended = false}, idempotency_key = key, dataflow_id = flow_id, signal_id = "signal"}
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
            local job_db = sql.get("app:db")
            local job_rows = job_db:query("SELECT payload FROM kickside_job WHERE id = $1", {stored.job_id})
            job_db:release()
            local payload = type(job_rows[1].payload) == "string" and json.decode(job_rows[1].payload) or job_rows[1].payload
            for field, value in pairs(trace) do test.eq(payload.trace_context and payload.trace_context[field], value) end
        end)
        test.it("lists only granted, agent-compatible usable images and honors durable builds", function()
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
            local err = repo.request_image_build(image, {actor_id = user.id, actor_context = "{}"}, "initial", uuid.v7())
            test.is_nil(err)
            -- The termination fence keeps the published snapshot stable during list assertions.
            local job_id = repo.image_build(image).job_id
            local _, cancel_err = jobs.cancel(job_id)
            test.is_nil(cancel_err)
            local deadline = time.now():add("15s")
            repeat
                local job, job_err = jobs.get_job(job_id)
                test.is_nil(job_err)
                if job.status ~= "pending" and job.status ~= "running" then break end
                test.is_false(time.now():after(deadline), "image worker termination fence does not settle")
                time.sleep("10ms")
            until false
            local db = sql.get("app:db")
            local _, write_err = db:execute("UPDATE chestor_autocode_image_builds SET status = 'preparing', finished_at = '', projected = 0, last_error = '' WHERE image_id = $1", {image})
            db:release()
            test.is_nil(write_err)
            test.is_nil(select(2, component.set_runtime_meta(image, {status = "ready", agents = {"unapproved"}})))
            local ready = call(user, "list_images", {agent = "claude"})
            local retained = false
            for _, item in ipairs(ready.images) do if item.id == image then retained = true end end
            test.is_true(retained)
            local all = call(user, "list_images", {agent = "claude", ready_only = false})
            local preparing
            for _, item in ipairs(all.images) do if item.id == image then preparing = item end end
            test.not_nil(preparing, json.encode(all))
            test.eq(preparing.status, "preparing")
            test.is_true(preparing.usable)
            test.eq(preparing.agents[1], "claude")
            test.eq(preparing.ref, "chestor-autocode-harness:missing")
            test.eq(preparing.label, "fixture")
            test.is_nil(repo.finish_image_build(image, "pull failed", repo.image_build(image).build_id, "failed", {}, "pull failed"))
            test.is_nil(repo.project_image_build(image, repo.image_build(image).build_id, function() return nil end))
            local failed = call(user, "list_images", {agent = "claude"})
            local retained_failure
            for _, item in ipairs(failed.images) do if item.id == image then retained_failure = item end end
            test.not_nil(retained_failure)
            test.eq(retained_failure.status, "failed")
            test.is_true(retained_failure.usable)
            test.eq(retained_failure.last_error, "pull failed")
            test.eq(retained_failure.agents[1], "claude")
        end)
        test.it("cancels only the caller's active run and returns a typed settled conflict", function()
            local user, other = member(), member()
            require("stubs").reset()
            local id = require("run_store_subject").create_run(user.id, {actor_id = user.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false, prompt = "task", repo_url = "", timeout_ms = 60000})
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
        test.it("publishes Block config and conditional route schemas", function()
            local block = registry.get("chestor.autocode.blocks:block.task").data.block
            local valid, problem = json.validate(block.config, {agent = "claude", image_id = "image", prompt = "task", repo_url = "https://example.com/repo", repo_ref = "release/v1"})
            test.is_true(valid, tostring(problem))
            test.eq(block.config.properties.repo_ref.maxLength, 200)
            local ports = {}
            for _, port in ipairs(block.ports) do ports[port.id] = port end
            for _, id in ipairs({"then", "else"}) do
                test.not_nil(ports[id])
                test.not_nil(ports[id].schema)
                test.eq(json.encode(ports[id].schema), json.encode(block.output))
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
                    flow = {dataflow_id = uuid.v7(), signal_id = "missing-signal"}})
            test.is_true(repo.finish_run(id, "succeeded", "answer", "", {}))
            local result, err = identity.call(user, "app:resume_dispatch", {payload = {run_id = id}})
            test.is_nil(result)
            test.is_true(errors.is(err, errors.INTERNAL), err:kind() .. ": " .. tostring(err))
            test.not_nil(err:message():find("Flow identity unavailable", 1, true), err:message())
            test.not_nil(err:message():find("not found", 1, true), err:message())
            test.is_nil(err:message():find("not allowed", 1, true), err:message())
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

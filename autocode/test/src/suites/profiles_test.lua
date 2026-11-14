-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local repo = require("repo")
local function cases()
    test.describe("autocode profiles", function()
        local f = require("contract_fixture").new()
        test.after_each(f.release)
        local contract = "chestor.autocode:profiles"
        local function add(user, patch)
            local body = {title = "DeepSeek", agent = "claude", image_id = f.image_for(user),
                endpoint = {protocol = "anthropic-messages", base_url = "https://models.example/v1", model = "deepseek"}, options = {model = "sonnet"}}
            for key, value in pairs(patch or {}) do body[key] = value end
            return f.call(user, "add_profile", body, contract), body
        end
        test.it("uses owner_user_id consistently while preserving published ownership aliases", function()
            local user = f.member()
            local profile = add(user)
            local profiles = f.call(user, "list_profiles", {}, contract).profiles
            for _, item in ipairs(profiles) do if item.id == profile.id then test.eq(item.owner_user_id, user.id); test.eq(item.owner, user.id) end end
            local account = f.call(user, "add_account", {agent = "claude", label = "owner", credential_kind = "env:ANTHROPIC_API_KEY", secret = "key"}, "chestor.autocode:accounts")
            local accounts = f.call(user, "list_accounts", {}).accounts
            local own
            for _, item in ipairs(accounts) do if item.id == account.id then own = item end end
            test.not_nil(own); test.eq(own.owner_user_id, user.id); test.eq(own.owner, user.id)
            local image = f.call(user, "list_images", {}).images[1]
            test.not_nil(image.owner_user_id); test.eq(image.owner_user_id, image.owner)
            local submitted = f.call(user, "submit_task", {profile_id = profile.id, account_id = account.id, prompt = "ownership"})
            local run = repo.stored_run(submitted.run_id)
            test.eq(run.owner_user_id, user.id); test.eq(run.owner_id, user.id)
            test.eq(f.call(user, "get_run", {run_id = submitted.run_id}).run.owner_user_id, user.id)
        end)
        test.it("freezes both the presence and absence of the reserved account endpoint", function()
            local user = f.member()
            for _, custom in ipairs({false, true}) do
                local initial = custom and {protocol = "anthropic-messages", base_url = "https://original.example/v1"} or nil
                local account = f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "key", endpoint = initial}, "chestor.autocode:accounts")
                local submitted = f.call(user, "submit_task", {agent = "claude", image_id = f.image_for(user), account_id = account.id, prompt = "snapshot"})
                test.not_nil(f.call(user, "update_account", {id = account.id, endpoint = {protocol = "anthropic-messages", base_url = "https://changed.example/v1"}}, "chestor.autocode:accounts"))
                local prepared, err = identity.call(user, "chestor.autocode.service:prepare", {run_id = submitted.run_id})
                test.is_nil(err, tostring(err))
                test.eq(prepared.launch.environment.ANTHROPIC_BASE_URL, initial and initial.base_url or nil)
            end
        end)
        test.it("clears inherited timeout and ref through the workflow arm", function()
            local user = f.member()
            f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "key"}, "chestor.autocode:accounts")
            local profile = add(user, {run_timeout = "3m", repo_url = "https://example.invalid/repo", repo_ref = "feature"})
            local direct = f.call(user, "submit_task", {agent = "claude", image_id = f.image_for(user), prompt = "default"})
            local armed, err = identity.call(user, "chestor.autocode.blocks:arm_task", {dataflow_id = f.flow_for(user), signal_id = "signal", idempotency_key = "clear-profile-fields",
                config = {profile_id = profile.id, prompt = "clear", run_timeout = "", repo_ref = ""}})
            test.is_nil(err, tostring(err))
            local run = repo.stored_run(armed.run_id)
            test.eq(run.timeout_ms, repo.stored_run(direct.run_id).timeout_ms)
            test.eq(run.repo_ref, "")
        end)
        test.it("rebalances an endpoint snapshot with its account while preserving explicit profile endpoints", function()
            local user = f.member()
            local image = f.image_for(user)
            local endpoints, pool = {}, {}
            for _, label in ipairs({"a", "b"}) do
                local url = "https://" .. label .. ".example/v1"
                local account = f.call(user, "add_account", {agent = "claude", label = label, credential_kind = "env:ANTHROPIC_API_KEY", secret = "key-" .. label,
                    endpoint = {protocol = "anthropic-messages", base_url = url}}, "chestor.autocode:accounts")
                endpoints[account.id] = url
                pool[#pool + 1] = account.id
            end
            for _, explicit in ipairs({false, true}) do
                local profile = explicit and add(user, {account_pool = pool}) or nil
                local run_id, err = identity.call(user, "app:fixture_scheduled_task", profile and {profile_id = profile.id, agent = "", image_id = "", options = {}, repo_url = "", prompt = "task"} or {agent = "claude", image_id = image, account_pool = pool, options = {}, repo_url = "", prompt = "task"})
                test.is_nil(err, tostring(err))
                local original = repo.stored_run(run_id).account_id
                test.is_nil(repo.settle_account(original, "busy", "2999-01-01T00:00:00Z"))
                local prepared, prepare_err = identity.call(user, "chestor.autocode.service:prepare", {run_id = run_id})
                test.is_nil(prepare_err, tostring(prepare_err))
                test.is_true(prepared.account_id ~= original)
                local expected = explicit and "https://models.example/v1" or endpoints[prepared.account_id]
                test.eq(prepared.launch.environment.ANTHROPIC_BASE_URL, expected, "prepared endpoint, explicit=" .. tostring(explicit) .. ", original=" .. original .. ", selected=" .. prepared.account_id)
                test.eq(repo.stored_run(run_id).endpoint.base_url, expected, "stored endpoint, explicit=" .. tostring(explicit))
                test.is_nil(repo.clear_cooldown(original))
            end
        end)
        test.it("refuses reserved transport keys in user tool context", function()
            local user = f.member()
            f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "key"}, "chestor.autocode:accounts")
            local image = f.image_for(user)
            for _, key in ipairs({"autocode_flow", "trace_context", "_execution_identity"}) do
                local result, err = f.call(user, "submit_task", {agent = "claude", image_id = image, prompt = "task",
                    tools = {tools = {"app:gateway_echo"}, context = {[key] = {dataflow_id = "forged", signal_id = "signal"}}}})
                test.is_nil(result)
                test.is_true(errors.is(err, errors.INVALID), tostring(err))
            end
        end)
        test.it("pairs each balanced credential with its own endpoint and preserves explicit overrides", function()
            local user = f.member()
            local image = f.image_for(user)
            local endpoints, pool = {}, {}
            for _, label in ipairs({"a", "b"}) do
                local endpoint = "https://" .. label .. ".example/v1"
                local added, err = f.call(user, "add_account", {agent = "claude", label = label, credential_kind = "env:ANTHROPIC_API_KEY",
                    secret = "key-" .. label, endpoint = {protocol = "anthropic-messages", base_url = endpoint}}, "chestor.autocode:accounts")
                test.is_nil(err, tostring(err))
                endpoints[added.id] = endpoint
                pool[#pool + 1] = added.id
            end
            local selected = {}
            for index = 1, 2 do
                local submitted, err = f.call(user, "submit_task", {agent = "claude", image_id = image, account_pool = pool, prompt = "task"})
                test.is_nil(err, tostring(err))
                local run = repo.stored_run(submitted.run_id)
                selected[run.account_id] = true
                local prepared, prepare_err = identity.call(user, "chestor.autocode.service:prepare", {run_id = run.id})
                test.is_nil(prepare_err, tostring(prepare_err))
                test.eq(prepared.launch.environment.ANTHROPIC_BASE_URL, endpoints[run.account_id])
            end
            local count = 0
            for _ in pairs(selected) do count = count + 1 end
            test.eq(count, 2)
            local profile = add(user)
            local submitted = f.call(user, "submit_task", {profile_id = profile.id, prompt = "override"})
            local prepared, err = identity.call(user, "chestor.autocode.service:prepare", {run_id = submitted.run_id})
            test.is_nil(err, tostring(err))
            test.eq(prepared.launch.environment.ANTHROPIC_BASE_URL, "https://models.example/v1")
        end)
        test.it("accepts a driver tool surface and freezes task context independently of its profile", function()
            local user = f.member()
            f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local profile = add(user, {tools = {tools = {"app:gateway_echo"}, context = {board_id = "default", other = "retained"}}})
            local submitted, err = f.call(user, "submit_task", {profile_id = profile.id, prompt = "task", tools = {context = {board_id = "board-a"}}})
            test.is_nil(err, tostring(err))
            test.eq(repo.stored_run(submitted.run_id).tools.context.board_id, "board-a")
            test.eq(repo.stored_run(submitted.run_id).tools.context.other, "retained")
            test.eq(repo.stored_run(submitted.run_id).tools.tools[1], "app:gateway_echo")
        end)
        test.it("owns profiles and freezes defaults with explicit node overrides before replay", function()
            local user, other = f.member(), f.member()
            local account = f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local profile, body = add(user, {account_id = account.id, run_timeout = "3m"})
            test.not_nil(profile)
            local listed, list_err = f.call(user, "list_profiles", {}, contract)
            test.is_nil(list_err, tostring(list_err))
            test.eq(listed.profiles[1].title, "DeepSeek")
            test.is_nil(listed.profiles[1].secret)
            local hidden = f.call(other, "list_profiles", {}, contract)
            test.eq(#hidden.profiles, 0)
            local _, denied = f.call(other, "update_profile", {id = profile.id, title = "stolen"}, contract)
            test.is_true(errors.is(denied, errors.NOT_FOUND), tostring(denied))
            local submitted, err = f.call(user, "submit_task", {profile_id = profile.id, prompt = "task", options = {model = "haiku"}, idempotency_key = "profile-task"})
            test.is_nil(err, tostring(err))
            local run = repo.stored_run(submitted.run_id)
            test.eq(run.options.model, "haiku")
            test.eq(run.timeout_ms, 180000)
            test.eq(run.endpoint.model, "deepseek")
            test.eq(run.agent, body.agent)
            test.is_nil(f.call(user, "update_profile", {id = profile.id, options = {model = "opus"}, title = "changed"}, contract).error)
            local replayed, replay_err = f.call(user, "submit_task", {profile_id = profile.id, prompt = "task", options = {model = "haiku"}, idempotency_key = "profile-task"})
            test.is_nil(replay_err, tostring(replay_err))
            test.eq(replayed.run_id, submitted.run_id)
            test.eq(repo.stored_run(submitted.run_id).options.model, "haiku")
            local response = identity.request(user, "GET", "/autocode/profiles")
            test.eq(response.status, 200, response.body)
            test.eq(response.json.profiles[1].title, "changed")
            local removed, remove_err = f.call(user, "remove_profile", {id = profile.id}, contract)
            test.is_nil(remove_err, tostring(remove_err))
            test.eq(removed.id, profile.id)
        end)
        test.it("freezes a node account pool and keeps referenced account grants independent", function()
            local user, other = f.member(), f.member()
            local a = f.call(user, "add_account", {agent = "claude", label = "a", credential_kind = "env:ANTHROPIC_API_KEY", secret = "key-a"}, "chestor.autocode:accounts")
            local b = f.call(user, "add_account", {agent = "claude", label = "b", credential_kind = "env:ANTHROPIC_API_KEY", secret = "key-b"}, "chestor.autocode:accounts")
            local profile = add(user, {account_pool = {a.id}})
            local submitted, err = f.call(user, "submit_task", {profile_id = profile.id, prompt = "pool", account_pool = {b.id}})
            test.is_nil(err, tostring(err))
            local run = repo.stored_run(submitted.run_id)
            test.eq(run.account_id, b.id)
            test.eq(run.account_pool[1], b.id)
            test.is_nil(select(2, f.call(user, "update_profile", {id = profile.id, account_pool = {a.id, b.id}}, contract)))
            test.eq(repo.stored_run(submitted.run_id).account_pool[1], b.id)
            local shared = identity.request(user, "POST", "/component-access/share/" .. profile.id,
                {subject_id = other.id, subject_type = "user", access_mask = 1})
            test.eq(shared.status, 200, shared.body)
            local visible = f.call(other, "list_profiles", {}, contract)
            test.eq(visible.profiles[1].id, profile.id)
            local _, denied = f.call(other, "submit_task", {profile_id = profile.id, prompt = "no referenced grants"})
            test.not_nil(denied)
            local _, write_denied = f.call(other, "update_profile", {id = profile.id, title = "denied"}, contract)
            test.is_true(errors.is(write_denied, errors.NOT_FOUND))
        end)
        test.it("preserves literal SCP repository characters in saved profiles and refuses URL fragments", function()
            local user = f.member()
            for _, repository in ipairs({"git@git.example:team/release#1.git", "git@git.example:team/release?1.git"}) do
                local profile, err = add(user, {repo_url = repository})
                test.not_nil(profile, tostring(err))
                local saved = f.call(user, "get_profile", {id = profile.id}, contract)
                test.eq(saved.profile.repo_url, repository)
            end
            for _, repository in ipairs({"https://git.example/team/release.git#1", "https://git.example/team/release.git?1"}) do
                local profile = add(user, {repo_url = repository})
                test.is_nil(profile)
            end
        end)
        test.it("rejects secrets, unknown options and unsupported endpoints before storing a profile", function()
            local user = f.member()
            for _, patch in ipairs({{secret = "leak"}, {repo_ref = "../bad"}, {options = {permission_mode = "invalid"}}, {options = {not_an_option = true}}, {endpoint = {protocol = "openai-responses", base_url = "https://example.com"}},
                {endpoint = {protocol = "anthropic-messages", base_url = "https://key@example.com"}}}) do
                local added = add(user, patch)
                test.is_nil(added)
            end
            local listed, err = f.call(user, "list_profiles", {}, contract)
            test.is_nil(err, tostring(err))
            test.eq(#listed.profiles, 0)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

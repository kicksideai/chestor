-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local registry = require("registry")
local json = require("json")
local repo = require("repo")
local time = require("time")
local deferred = require("deferred")

local TOOLS = "chestor.autocode.traits:"
local function schema(value)
    if type(value) == "string" then return json.decode(value) end
    return value
end
local function cases()
    test.describe("autocode agent tools", function()
        local f = require("contract_fixture").new()
        local users = {}
        local function user(groups)
            local created = identity.user(groups)
            users[#users + 1] = created
            return created
        end
        local function member()
            return user({identity.SIGNED_IN, identity.MEMBERS, "app:coding_tools"})
        end
        test.after_each(function()
            for _, created in ipairs(users) do identity.release(created) end
            users = {}
            f.release()
        end)
        test.it("publishes typed administration tools with exact access grants", function()
            local trait = registry.get(TOOLS .. "coding_admin")
            test.not_nil(trait)
            test.eq(trait.meta.type, "agent.trait")
            test.eq(trait.meta.public, true)
            local expected = {"add_coding_account", "update_coding_account", "remove_coding_account",
                "add_coding_profile", "update_coding_profile", "remove_coding_profile",
                "create_coding_image", "update_coding_image", "prepare_coding_image", "delete_coding_image",
                "create_coding_workspace", "delete_coding_workspace", "prune_coding_images"}
            local policy = registry.get("chestor.autocode.security:tool_access")
            local granted = {}
            for _, id in ipairs(policy.data.policy.resources) do granted[id] = true end
            test.is_true(granted[TOOLS .. "coding_admin"])
            local all = {}
            for _, trait_id in ipairs({"coding_tasks", "coding_admin"}) do
                all[TOOLS .. trait_id] = true
                for _, id in ipairs(registry.get(TOOLS .. trait_id).data.tools) do all[id] = true end
            end
            for id in pairs(granted) do test.is_true(all[id] == true, "extra grant: " .. id) end
            for id in pairs(all) do test.is_true(granted[id] == true, "missing grant: " .. id) end
            for _, name in ipairs(expected) do
                local tool = registry.get(TOOLS .. name)
                test.not_nil(tool, name)
                test.eq(tool.meta.type, "tool")
                test.eq(schema(tool.meta.input_schema).type, "object", name)
                test.eq(schema(tool.meta.input_schema).additionalProperties, false)
                test.not_nil(tool.meta.output_schema)
                test.is_true(granted[TOOLS .. name], name)
                local found = false
                for _, id in ipairs(trait.data.tools) do if id == TOOLS .. name then found = true end end
                test.is_true(found, name)
            end
        end)
        test.it("describes model parameters and recovery instead of requiring source knowledge", function()
            for _, name in ipairs({"submit_coding_task", "read_coding_run", "list_coding_runs", "read_coding_image",
                "add_coding_account", "update_coding_account", "add_coding_profile"}) do
                local tool = registry.get(TOOLS .. name)
                test.not_nil(tool, name)
                for field, schema in pairs(schema(tool.meta.input_schema).properties) do
                    test.is_true(type(schema.description) == "string" and #schema.description > 10, name .. "." .. field)
                end
            end
            local caller = member()
            local _, err = identity.call(caller, TOOLS .. "submit_coding_task", {agent = "unknown-agent", image_id = "missing", prompt = "test"})
            test.is_true(errors.is(err, errors.INVALID), tostring(err))
            test.is_true(err:message():find("unknown-agent", 1, true) ~= nil)
            test.is_true(err:message():find("ListCodingAgents", 1, true) ~= nil)
        end)
        test.it("manages accounts and profiles through their existing contracts and grants", function()
            local caller, other = member(), member()
            local function invoke(name, input)
                local result, err = identity.call(caller, TOOLS .. name, input)
                test.is_nil(err, tostring(err)); test.not_nil(result)
                local valid, problem = json.validate(registry.get(TOOLS .. name).meta.output_schema, result)
                test.is_true(valid, tostring(problem))
                return result
            end
            local account = invoke("add_coding_account", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "tool key", secret = "test-only"})
            invoke("update_coding_account", {id = account.id, label = "renamed", secret = "replacement"})
            local _, denied = identity.call(other, TOOLS .. "update_coding_account", {id = account.id, label = "stolen"})
            test.is_true(errors.is(denied, errors.NOT_FOUND), tostring(denied))
            local image_id = f.image_for(caller)
            local profile = invoke("add_coding_profile", {title = "Tool profile", agent = "claude", image_id = image_id})
            invoke("update_coding_profile", {id = profile.id, title = "Renamed profile"})
            local _, profile_denied = identity.call(other, TOOLS .. "remove_coding_profile", {id = profile.id})
            test.is_true(errors.is(profile_denied, errors.NOT_FOUND), tostring(profile_denied))
            local seeded, seed_err = identity.call(caller, "app:gateway_seed", {account_id = account.id, image_id = image_id,
                tools = {traits = {TOOLS .. "coding_tasks", TOOLS .. "coding_admin"}}})
            test.is_nil(seed_err, tostring(seed_err))
            local prepared, prepare_err = identity.call(caller, "chestor.autocode.service:prepare", {run_id = seeded.run_id})
            test.is_nil(prepare_err, tostring(prepare_err))
            local gateway = require("gateway")
            local listed, list_err = gateway.handle(seeded.run_id, prepared.gateway_token, {jsonrpc = "2.0", id = 1, method = "tools/list"})
            test.is_nil(list_err, tostring(list_err)); test.eq(#listed.result.tools, 24)
            local updated, gateway_err = gateway.handle(seeded.run_id, prepared.gateway_token, {jsonrpc = "2.0", id = 2,
                method = "tools/call", params = {name = "update_coding_profile", arguments = {id = profile.id, title = "Gateway update"}}})
            test.is_nil(gateway_err, tostring(gateway_err)); test.is_false(updated.result.isError, json.encode(updated))
            test.eq(json.decode(updated.result.content[1].text).id, profile.id)
            invoke("remove_coding_profile", {id = profile.id})
            invoke("remove_coding_account", {id = account.id})
        end)
        test.it("keeps image, workspace and prune management checks in addition to tool access", function()
            local caller = member()
            for _, name in ipairs({"create_coding_image", "update_coding_image", "prepare_coding_image", "delete_coding_image",
                "create_coding_workspace", "delete_coding_workspace", "prune_coding_images"}) do
                local result, err = identity.call(caller, TOOLS .. name, {})
                test.is_nil(result)
                test.is_true(errors.is(err, errors.PERMISSION_DENIED), name .. ": " .. tostring(err))
            end
        end)
        test.it("registers and deletes workspaces as a manager while retaining ownership checks", function()
            local caller = user({identity.SIGNED_IN, "app:autocode_managers", "app:coding_tools"})
            local other = user({identity.SIGNED_IN, "app:autocode_managers", "app:coding_tools"})
            local path = identity.directory(caller, "trait-workspace")
            local created, err = identity.call(caller, TOOLS .. "create_coding_workspace", {name = "Tool workspace", host_path = path})
            test.is_nil(err, tostring(err)); test.not_nil(created.id)
            local _, overlap = identity.call(caller, TOOLS .. "create_coding_workspace", {name = "Overlap", host_path = path})
            test.not_nil(overlap)
            local _, denied = identity.call(other, TOOLS .. "delete_coding_workspace", {id = created.id})
            test.is_true(errors.is(denied, errors.NOT_FOUND), tostring(denied))
            local removed, remove_err = identity.call(caller, TOOLS .. "delete_coding_workspace", {id = created.id})
            test.is_nil(remove_err, tostring(remove_err)); test.eq(removed.id, created.id)
        end)
        test.it("requests image builds, reads their log, updates and deletes through management services", function()
            local caller = user({identity.SIGNED_IN, "app:autocode_managers", "app:coding_tools"})
            local other = user({identity.SIGNED_IN, "app:autocode_managers", "app:coding_tools"})
            local created, err = identity.call(caller, TOOLS .. "create_coding_image", {
                ref = "chestor-autocode-trait:" .. caller.id, label = "Tool image", dockerfile = "FROM scratch\n", allows = table.create(1, 0)})
            test.is_nil(err, tostring(err)); test.not_nil(created.id); test.is_nil(created.build_error)
            local function settled()
                local deadline = time.now():add("30s")
                while true do
                    local detail, read_err = identity.call(caller, TOOLS .. "read_coding_image", {id = created.id})
                    test.is_nil(read_err, tostring(read_err))
                    test.eq(detail.dockerfile, "FROM scratch"); test.not_nil(detail.settings)
                    if detail.image.status == "failed" or detail.image.status == "ready" then return detail end
                    if time.now():after(deadline) then error("image build did not settle: " .. detail.build_log) end
                    time.sleep("50ms")
                end
            end
            -- Scratch lacks the runtime probe shell: the real build reports that failure.
            local detail = settled()
            test.eq(detail.image.status, "failed"); test.is_true(#detail.build_log > 0)
            local _, hidden = identity.call(other, TOOLS .. "read_coding_image", {id = created.id})
            test.is_true(errors.is(hidden, errors.NOT_FOUND), tostring(hidden))
            for _, name in ipairs({"update_coding_image", "prepare_coding_image", "delete_coding_image"}) do
                local _, denied = identity.call(other, TOOLS .. name, {id = created.id})
                test.is_true(errors.is(denied, errors.NOT_FOUND), name .. ": " .. tostring(denied))
            end
            local prepared, prepare_err = identity.call(caller, TOOLS .. "prepare_coding_image", {id = created.id})
            test.is_nil(prepare_err, tostring(prepare_err)); test.not_nil(prepared)
            settled()
            local updated, update_err = identity.call(caller, TOOLS .. "update_coding_image", {id = created.id, label = "Renamed", allows = table.create(1, 0)})
            test.is_nil(update_err, tostring(update_err)); test.eq(updated.id, created.id)
            local _, invalid = identity.call(caller, TOOLS .. "update_coding_image", {id = created.id, owner_id = other.id})
            test.is_true(errors.is(invalid, errors.INVALID), tostring(invalid))
            local removed, remove_err = identity.call(caller, TOOLS .. "delete_coding_image", {id = created.id})
            test.is_nil(remove_err, tostring(remove_err)); test.eq(removed.id, created.id)
        end)
        test.it("delegates prune to existing maintenance without caller-supplied Docker commands", function()
            local caller = user({identity.SIGNED_IN, "app:autocode_managers", "app:coding_tools"})
            local result, err = identity.call(caller, "app:prune_tool_subject", {})
            test.is_nil(err, tostring(err)); test.not_nil(result.output)
            test.not_nil(result.output:find("until=48h", 1, true))
            local _, invalid = identity.call(caller, "app:prune_tool_subject", {command = "system prune"})
            test.is_true(errors.is(invalid, errors.INVALID), tostring(invalid))
        end)
        test.it("pages discovery tools with bounded summaries and reads a selected profile", function()
            local caller = member()
            local image_id = f.image_for(caller)
            local detail, detail_err = identity.call(caller, TOOLS .. "read_coding_image", {id = image_id})
            test.is_nil(detail_err, tostring(detail_err)); test.eq(detail.image.id, image_id)
            test.eq(type(detail.build_log), "string"); test.is_nil(detail.dockerfile); test.is_nil(detail.settings)
            for index = 1, 26 do
                f.call(caller, "add_profile", {title = "Profile " .. tostring(index), agent = "claude", image_id = image_id, options = {model = "sonnet"}}, "chestor.autocode:profiles")
            end
            local listed, err = identity.call(caller, TOOLS .. "list_coding_profiles", {})
            test.is_nil(err, tostring(err)); test.eq(#listed.profiles, 25); test.eq(listed.next_offset, 25)
            test.is_nil(listed.profiles[1].options); test.is_nil(listed.profiles[1].tools)
            local next_page, next_err = identity.call(caller, TOOLS .. "list_coding_profiles", {limit = 1, offset = listed.next_offset})
            test.is_nil(next_err, tostring(next_err)); test.eq(#next_page.profiles, 1); test.is_nil(next_page.next_offset)
            test.is_true(listed.profiles[1].id ~= next_page.profiles[1].id)
            local detail, detail_err = identity.call(caller, TOOLS .. "read_coding_profile", {id = listed.profiles[1].id})
            test.is_nil(detail_err, tostring(detail_err)); test.eq(detail.profile.options.model, "sonnet")
            for _, pair in ipairs({{"list_coding_agents", "agents"}, {"list_coding_accounts", "accounts"}, {"list_coding_images", "images"}, {"list_coding_workspaces", "workspaces"}}) do
                local page, page_err = identity.call(caller, TOOLS .. pair[1], {limit = 1, offset = 0})
                test.is_nil(page_err, tostring(page_err)); test.is_true(#page[pair[2]] <= 1)
            end
            local excessive, bounds_err = identity.call(caller, TOOLS .. "list_coding_profiles", {limit = 101})
            test.is_nil(excessive); test.is_true(errors.is(bounds_err, errors.INVALID), tostring(bounds_err))
        end)
        test.it("declares a public trait and tools with the contract's exact DTO schemas", function()
            local trait = registry.get(TOOLS .. "coding_tasks")
            test.eq(trait.meta.type, "agent.trait")
            test.eq(trait.meta.public, true)
            test.eq(#trait.data.tools, 11)
            local definition = registry.get("chestor.autocode:tasks")
            for _, pair in ipairs({{"submit_coding_task", "submit_task", "SubmitCodingTask"},
                {"read_coding_run", "get_run", "ReadCodingRun"}, {"list_coding_agents", "list_agents", "ListCodingAgents"},
                {"list_coding_profiles", "list_profiles", "ListCodingProfiles", "chestor.autocode:profiles"},
                {"read_coding_profile", "get_profile", "ReadCodingProfile", "chestor.autocode:profiles"},
                {"list_coding_accounts", "list_accounts", "ListCodingAccounts"}, {"list_coding_images", "list_images", "ListCodingImages"},
                {"list_coding_workspaces", "list_workspaces", "ListCodingWorkspaces"}, {"cancel_coding_run", "cancel_run", "CancelCodingRun"}}) do
                local tool = registry.get(TOOLS .. pair[1])
                test.eq(tool.meta.type, "tool")
                test.eq(tool.meta.public, true)
                test.eq(tool.meta.llm_alias, pair[3])
                for _, method in ipairs((pair[4] and registry.get(pair[4]) or definition).data.methods) do
                    if method.name == pair[2] then
                        test.eq(tool.meta.input_schema, method.input_schemas[1].definition)
                        test.eq(tool.meta.output_schema, method.output_schemas[1].definition)
                    end
                end
            end
            local policy = registry.get("chestor.autocode.security:tool_access")
            test.eq(policy.meta.intent, "tool_access")
        end)
        test.it("preserves typed validation errors for an allowed member", function()
            local caller = member()
            for _, name in ipairs({"submit_coding_task", "read_coding_run"}) do
                local result, err = identity.call(caller, TOOLS .. name, {})
                test.is_nil(result)
                test.is_true(errors.is(err, errors.INVALID), tostring(err))
                test.eq(err:details().code, "autocode.invalid_request")
                test.eq(err:retryable(), false)
            end
        end)
        test.it("refuses outsiders and members without the separate tool capability", function()
            for _, groups in ipairs({{identity.SIGNED_IN}, {identity.SIGNED_IN, identity.MEMBERS}}) do
                local caller = user(groups)
                for _, name in ipairs({"submit_coding_task", "read_coding_run", "list_coding_agents", "list_coding_profiles", "read_coding_profile", "list_coding_accounts", "list_coding_images", "list_coding_workspaces", "cancel_coding_run", "list_coding_runs", "read_coding_image", "add_coding_account", "update_coding_account", "remove_coding_account", "add_coding_profile", "update_coding_profile", "remove_coding_profile", "create_coding_image", "update_coding_image", "prepare_coding_image", "delete_coding_image", "create_coding_workspace", "delete_coding_workspace", "prune_coding_images"}) do
                    local result, err = identity.call(caller, TOOLS .. name, {})
                    test.is_nil(result)
                    test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
                end
            end
        end)
        test.it("requires module access in addition to tool access", function()
            local caller = user({identity.SIGNED_IN, "app:coding_tools"})
            for _, name in ipairs({"submit_coding_task", "read_coding_run", "list_coding_agents", "list_coding_profiles", "read_coding_profile", "list_coding_accounts", "list_coding_images", "list_coding_workspaces", "cancel_coding_run", "list_coding_runs", "read_coding_image", "add_coding_account", "update_coding_account", "remove_coding_account", "add_coding_profile", "update_coding_profile", "remove_coding_profile", "create_coding_image", "update_coding_image", "prepare_coding_image", "delete_coding_image", "create_coding_workspace", "delete_coding_workspace", "prune_coding_images"}) do
                local result, err = identity.call(caller, TOOLS .. name, {})
                test.is_nil(result)
                test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            end
        end)
        test.it("reads only the execution frame owner's run and preserves event paging", function()
            local owner, other = member(), member()
            local id = repo.create_run(owner.id, {actor_id = owner.id, actor_context = "{}"},
                {agent = "claude", account_id = "account", image_id = "image", options = {}, unattended = false,
                    prompt = "tool task", repo_url = "", timeout_ms = 60000})
            -- The run's real job settles it first, so its events are final before paging.
            test.is_nil(deferred.nudge())
            local deadline = time.now():add("30s")
            while repo.run(owner.id, id).status == "queued" or repo.run(owner.id, id).status == "running" do
                if time.now():after(deadline) then error("run does not settle") end
                time.sleep("50ms")
            end
            local all = identity.call(owner, TOOLS .. "read_coding_run", {run_id = id, limit = 100})
            for offset = 1, 3 do test.is_nil(repo.append_event(id, "log", "line")) end
            local total = #all.events + 3
            local page, err = identity.call(owner, TOOLS .. "read_coding_run", {run_id = id, limit = total - 1})
            test.is_nil(err, tostring(err))
            local schema = registry.get(TOOLS .. "read_coding_run").meta.output_schema
            local valid, problem = json.validate(schema, page)
            test.eq(valid, true, tostring(problem))
            test.eq(#page.events, total - 1)
            test.eq(page.more, true)
            test.eq(page.next_seq, page.events[#page.events].seq)
            test.is_nil(page.run.owner_id)
            local tail = identity.call(owner, TOOLS .. "read_coding_run", {run_id = id, after_seq = page.next_seq, limit = 2})
            test.eq(#tail.events, 1)
            test.eq(tail.more, false)
            local discovered, discover_err = identity.call(owner, TOOLS .. "list_coding_runs", {limit = 1})
            test.is_nil(discover_err, tostring(discover_err)); test.eq(discovered.runs[1].id, id)
            local others, others_err = identity.call(other, TOOLS .. "list_coding_runs", {})
            test.is_nil(others_err, tostring(others_err)); test.eq(#others.runs, 0)
            local _, forged_list = identity.call(owner, TOOLS .. "list_coding_runs", {owner_id = other.id})
            test.is_true(errors.is(forged_list, errors.INVALID), tostring(forged_list))
            local hidden, hidden_err = identity.call(other, TOOLS .. "read_coding_run", {run_id = id})
            test.is_nil(hidden)
            test.is_true(errors.is(hidden_err, errors.NOT_FOUND), tostring(hidden_err))
            local _, forged = identity.call(owner, TOOLS .. "read_coding_run", {run_id = id, owner_id = other.id})
            test.is_true(errors.is(forged, errors.INVALID), tostring(forged))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

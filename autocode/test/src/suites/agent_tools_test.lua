-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local registry = require("registry")
local json = require("json")
local repo = require("repo")
local time = require("time")
local deferred = require("deferred")

local TOOLS = "chestor.autocode.traits:"
local function cases()
    test.describe("autocode agent tools", function()
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
        end)
        test.it("declares a public trait and tools with the contract's exact DTO schemas", function()
            local trait = registry.get(TOOLS .. "coding_tasks")
            test.eq(trait.meta.type, "agent.trait")
            test.eq(trait.meta.public, true)
            test.eq(#trait.data.tools, 7)
            local definition = registry.get("chestor.autocode:tasks")
            for _, pair in ipairs({{"submit_coding_task", "submit_task", "SubmitCodingTask"},
                {"read_coding_run", "get_run", "ReadCodingRun"}, {"list_coding_agents", "list_agents", "ListCodingAgents"},
                {"list_coding_accounts", "list_accounts", "ListCodingAccounts"}, {"list_coding_images", "list_images", "ListCodingImages"},
                {"list_coding_workspaces", "list_workspaces", "ListCodingWorkspaces"}, {"cancel_coding_run", "cancel_run", "CancelCodingRun"}}) do
                local tool = registry.get(TOOLS .. pair[1])
                test.eq(tool.meta.type, "tool")
                test.eq(tool.meta.public, true)
                test.eq(tool.meta.llm_alias, pair[3])
                for _, method in ipairs(definition.data.methods) do
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
                for _, name in ipairs({"submit_coding_task", "read_coding_run", "list_coding_agents", "list_coding_accounts", "list_coding_images", "list_coding_workspaces", "cancel_coding_run"}) do
                    local result, err = identity.call(caller, TOOLS .. name, {})
                    test.is_nil(result)
                    test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
                end
            end
        end)
        test.it("requires module access in addition to tool access", function()
            local caller = user({identity.SIGNED_IN, "app:coding_tools"})
            for _, name in ipairs({"submit_coding_task", "read_coding_run", "list_coding_agents", "list_coding_accounts", "list_coding_images", "list_coding_workspaces", "cancel_coding_run"}) do
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
            local next_seq = #all.events > 0 and all.events[#all.events].seq or 0
            for offset = 1, 3 do test.is_nil(repo.append_event(id, next_seq + offset, "log", "line")) end
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

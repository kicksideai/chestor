local test = require("test")
local registry = require("registry")
local security = require("security")
local function define_tests()
    test.describe("Module access composition", function()
        test.it("admits exactly the listed endpoint identities", function()
            local policy_id = "chestor.journal.security:module_access"
            local declaration, declaration_err = registry.get(policy_id)
            test.is_nil(declaration_err)
            test.not_nil(declaration)
            test.is_nil(declaration.data.policy.conditions)
            local expected = {
                ["chestor.journal.api:append_entry.endpoint"] = true,
                ["chestor.journal.api:apply_events.endpoint"] = true,
                ["chestor.journal.api:apply_graph_ops.endpoint"] = true,
                ["chestor.journal.api:assemble_graph.endpoint"] = true,
                ["chestor.journal.api:configure_graph.endpoint"] = true,
                ["chestor.journal.api:create_checkpoint.endpoint"] = true,
                ["chestor.journal.api:event_graphs.endpoint"] = true,
                ["chestor.journal.api:focus_task.endpoint"] = true,
                ["chestor.journal.api:get_activity.endpoint"] = true,
                ["chestor.journal.api:get_assembly.endpoint"] = true,
                ["chestor.journal.api:get_branch.endpoint"] = true,
                ["chestor.journal.api:get_changes.endpoint"] = true,
                ["chestor.journal.api:get_context_pack.endpoint"] = true,
                ["chestor.journal.api:get_cursors.endpoint"] = true,
                ["chestor.journal.api:get_event.endpoint"] = true,
                ["chestor.journal.api:get_frontier.endpoint"] = true,
                ["chestor.journal.api:get_health.endpoint"] = true,
                ["chestor.journal.api:get_journal.endpoint"] = true,
                ["chestor.journal.api:get_spans.endpoint"] = true,
                ["chestor.journal.api:get_tree.endpoint"] = true,
                ["chestor.journal.api:get_updates.endpoint"] = true,
                ["chestor.journal.api:link_artifact.endpoint"] = true,
                ["chestor.journal.api:list_events.endpoint"] = true,
                ["chestor.journal.api:list_graphs.endpoint"] = true,
                ["chestor.journal.api:query_graph.endpoint"] = true,
                ["chestor.journal.api:search_journal.endpoint"] = true,
                ["chestor.journal.api:search_journal_text.endpoint"] = true,
                ["chestor.journal.api:transition_task.endpoint"] = true,
                ["chestor.journal.api:update_digest.endpoint"] = true,
                ["chestor.journal.api:upsert_task.endpoint"] = true,
            }
            local listed = {}
            for _, id in ipairs(declaration.data.policy.resources) do
                test.is_true(expected[id] == true, id)
                test.is_nil(listed[id], id)
                listed[id] = true
                local entry, err = registry.get(id)
                test.is_nil(err, id)
                test.not_nil(entry, id)
                test.eq(entry.kind, "http.endpoint", id)
            end
            for id in pairs(expected) do test.is_true(listed[id] == true, id) end
            local policy, policy_err = security.policy(policy_id)
            test.is_nil(policy_err)
            local actor = security.new_actor("listed-endpoint-member", {})
            local endpoints, find_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(find_err)
            for _, entry in ipairs(endpoints) do
                local id = tostring(entry.id)
                test.eq(policy:evaluate(actor, "access", id), expected[id] and "allow" or "undefined", id)
            end
            for id in pairs(expected) do
                test.eq(policy:evaluate(actor, "access", id .. ".unlisted"), "undefined", id)
            end
        end)
        test.it("declares a compatible platform Members default for every member requirement", function()
            for _, id in ipairs({"chestor.journal.security:user_security_scope"}) do
                local requirement, err = registry.get(id)
                test.is_nil(err, id)
                test.not_nil(requirement, id)
                test.eq(requirement.meta.value_kind, "security.scope", id)
                test.eq(requirement.data.default, "kickside.security.groups:members", id)
            end
        end)
        test.it("admits owned member endpoints and rejects other modules", function()
            local policy, err = security.policy("chestor.journal.security:module_access")
            test.is_nil(err)
            test.not_nil(policy)
            local actor = security.new_actor("module-member", {})
            for _, id in ipairs({
                "chestor.journal.api:get_journal.endpoint",
                "chestor.journal.api:get_health.endpoint",
                "chestor.journal.api:apply_events.endpoint",
                "chestor.journal.api:append_entry.endpoint",
                "chestor.journal.api:list_events.endpoint",
                "chestor.journal.api:get_event.endpoint",
                "chestor.journal.api:get_updates.endpoint",
                "chestor.journal.api:get_context_pack.endpoint",
                "chestor.journal.api:get_branch.endpoint",
                "chestor.journal.api:get_frontier.endpoint",
                "chestor.journal.api:get_cursors.endpoint",
                "chestor.journal.api:get_spans.endpoint",
                "chestor.journal.api:get_activity.endpoint",
                "chestor.journal.api:get_changes.endpoint",
                "chestor.journal.api:get_tree.endpoint",
                "chestor.journal.api:upsert_task.endpoint",
                "chestor.journal.api:transition_task.endpoint",
                "chestor.journal.api:link_artifact.endpoint",
                "chestor.journal.api:focus_task.endpoint",
                "chestor.journal.api:search_journal.endpoint",
                "chestor.journal.api:search_journal_text.endpoint",
                "chestor.journal.api:update_digest.endpoint",
                "chestor.journal.api:create_checkpoint.endpoint",
                "chestor.journal.api:list_graphs.endpoint",
                "chestor.journal.api:query_graph.endpoint",
                "chestor.journal.api:apply_graph_ops.endpoint",
                "chestor.journal.api:configure_graph.endpoint",
                "chestor.journal.api:event_graphs.endpoint",
                "chestor.journal.api:assemble_graph.endpoint",
                "chestor.journal.api:get_assembly.endpoint",
            }) do
                test.not_nil(registry.get(id), id)
                test.eq(policy:evaluate(actor, "access", id), "allow", id)
                test.eq(policy:evaluate(actor, "access", (id .. ".unlisted")), "undefined", id)
                test.eq(policy:evaluate(actor, "funcs.call", id), "undefined", id)
            end
            for _, id in ipairs({ "unrelated.module:list.endpoint", "chestor.journal_extension:list.endpoint" }) do
                test.eq(policy:evaluate(actor, "access", id), "undefined", id)
            end
        end)
        test.it("includes module discovery without an application blanket grant", function()
            local policies, seen = {}, {}
            local function include(id)
                if seen[id] then return end
                seen[id] = true
                local entry, entry_err = registry.get(id)
                test.is_nil(entry_err, id)
                test.not_nil(entry, id)
                local policy, policy_err = security.policy(id)
                test.is_nil(policy_err, id)
                policies[#policies + 1] = policy
                for _, child in ipairs(entry.meta.includes or {}) do include(child) end
            end
            include("chestor.journal.security:module_access")
            test.is_nil(seen["chestor.journal.security:module_tools"], "Default module access preserves existing tool authority")
            local declaration = registry.get("chestor.journal.security:module_access")
            test.is_true(type(declaration.meta.title) == "string" and declaration.meta.title ~= "")
            test.eq(declaration.meta.intent, "module_access")
            test.eq(declaration.meta.surface, "chestor.journal")
            test.is_true(declaration.meta.private ~= true)
            local scope, scope_err = security.new_scope(policies)
            test.is_nil(scope_err)
            local actor = security.new_actor("module-member", {})
            test.eq(scope:evaluate(actor, "funcs.call", "chestor.journal.security:module_access"), "undefined")
            local tools, tools_err = registry.find({[".kind"] = "function.lua", ["meta.type"] = "tool"})
            test.is_nil(tools_err)
            local tool_policy, tool_policy_err = security.policy("chestor.journal.security:module_tools")
            test.is_nil(tool_policy_err)
            local tool_declaration = registry.get("chestor.journal.security:module_tools")
            test.is_true(tool_declaration.meta.private ~= true)
            test.eq(tool_declaration.meta.intent, "tool_access")
            for _, tool in ipairs(tools or {}) do
                local id = tostring(tool.id)
                if id:match("^chestor%.journal[%.:]") then
                    for _, action in ipairs({ "funcs.call", "funcs.security" }) do
                        test.eq(scope:evaluate(actor, action, id), "undefined", id)
                        test.eq(tool_policy:evaluate(actor, action, id), "allow", id)
                    end
                end
            end
            test.eq(tool_policy:evaluate(actor, "funcs.call", "unrelated.module:tool"), "undefined")
            test.eq(scope:evaluate(actor, "registry.get", "chestor.journal:db_config"), "allow")
            for _, action in ipairs({ "access", "registry.get", "funcs.call" }) do
                test.eq(scope:evaluate(actor, action, "unrelated.module:list.endpoint"), "undefined", action)
            end
        end)
    end)
end
local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }

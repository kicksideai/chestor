local test = require("test")
local registry = require("registry")
local security = require("security")
local function define_tests()
    test.describe("Canonical member endpoint declarations", function()
        test.it("loads the module policy and each member endpoint without aliases", function()
            local policy, err = security.policy("chestor.journal.security:module_access")
            test.is_nil(err)
            test.not_nil(policy)
            local baseline, baseline_err = security.policy("kickside.contract.http:user_endpoint_access")
            test.is_nil(baseline_err)
            test.not_nil(baseline)
            local actor = security.new_actor("module-member", {})
            for _, id in ipairs({
                "chestor.journal.api:append_entry.endpoint",
                "chestor.journal.api:apply_events.endpoint",
                "chestor.journal.api:apply_graph_ops.endpoint",
                "chestor.journal.api:assemble_graph.endpoint",
                "chestor.journal.api:configure_graph.endpoint",
                "chestor.journal.api:create_checkpoint.endpoint",
                "chestor.journal.api:event_graphs.endpoint",
                "chestor.journal.api:focus_task.endpoint",
                "chestor.journal.api:get_activity.endpoint",
                "chestor.journal.api:get_assembly.endpoint",
                "chestor.journal.api:get_branch.endpoint",
                "chestor.journal.api:get_changes.endpoint",
                "chestor.journal.api:get_context_pack.endpoint",
                "chestor.journal.api:get_cursors.endpoint",
                "chestor.journal.api:get_event.endpoint",
                "chestor.journal.api:get_frontier.endpoint",
                "chestor.journal.api:get_health.endpoint",
                "chestor.journal.api:get_journal.endpoint",
                "chestor.journal.api:get_spans.endpoint",
                "chestor.journal.api:get_tree.endpoint",
                "chestor.journal.api:get_updates.endpoint",
                "chestor.journal.api:link_artifact.endpoint",
                "chestor.journal.api:list_events.endpoint",
                "chestor.journal.api:list_graphs.endpoint",
                "chestor.journal.api:query_graph.endpoint",
                "chestor.journal.api:search_journal.endpoint",
                "chestor.journal.api:search_journal_text.endpoint",
                "chestor.journal.api:transition_task.endpoint",
                "chestor.journal.api:update_digest.endpoint",
                "chestor.journal.api:upsert_task.endpoint",
            }) do
                local entry, entry_err = registry.get(id)
                test.is_nil(entry_err, id)
                test.not_nil(entry, id)
                test.eq(entry.kind, "http.endpoint", id)
                test.eq(policy:evaluate(actor, "access", id, nil), "allow", id)
                test.eq(policy:evaluate(actor, "funcs.call", id, nil), "undefined", id)
                test.eq(baseline:evaluate(actor, "access", id, nil), "undefined", id)
                local unmarked = id .. ".unlisted"
                local legacy = registry.get(unmarked)
                test.is_nil(legacy, unmarked)
                test.eq(policy:evaluate(actor, "access", unmarked, nil), "undefined", unmarked)
            end
        end)
    end)
end
local run_cases = test.run_cases(define_tests)
return {run = function(options) return run_cases(options) end}

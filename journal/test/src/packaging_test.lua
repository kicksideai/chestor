local test = require("test")
local registry = require("registry")
local security = require("security")
local types = require("types")
local json = require("json")

local DEPENDENCIES = {
    ["kickside/core"] = "*",
    ["kickside/contract"] = "*",
    ["kickside/component"] = "*",
    ["kickside/jobs"] = "*",
    ["chestor/workspace"] = "*",
    ["wippy/migration"] = "*",
    ["wippy/llm"] = "*",
    ["wippy/agent"] = "*",
}

local function entry_value(entry: any, key: string): any
    if type(entry) ~= "table" then
        return nil
    end
    if type((entry :: any).data) == "table" and (entry :: any).data[key] ~= nil then
        return (entry :: any).data[key]
    end
    return (entry :: any)[key]
end

local function module_dependencies(): any
    local entries, err = registry.find({ [".kind"] = "ns.dependency" })
    test.is_nil(err)
    local found: any = {}
    for _, entry in ipairs(entries or {}) do
        local id = tostring((entry :: any).id or "")
        if id:sub(1, #"chestor.journal:") == "chestor.journal:" then
            local component = tostring(entry_value(entry, "component") or "")
            found[component] = tostring(entry_value(entry, "version") or "")
        end
    end
    return found
end

local function meta(entry: any): any
    return entry and ((entry :: any).meta or ((entry :: any).data and (entry :: any).data.meta)) or {}
end

local function requirement_targets(id: string): any
    local requirement = registry.get(id)
    test.not_nil(requirement)
    local discovery = registry.get("chestor.journal.security:member_discovery")
    test.not_nil(discovery)
    local discovery_data: any = discovery.data or discovery
    test.eq(discovery_data.policy.actions[1], "registry.get")
    test.eq(discovery_data.policy.actions[2], "registry.find")
    local targets: any = {}
    local count = 0
    for _, target in ipairs((((requirement :: any).data or requirement).targets or {}) :: { any }) do
        count = count + 1
        targets[tostring((target :: any).entry)] = tostring((target :: any).path)
    end
    return targets, count
end

-- An empty Lua table is encoded as [] by the runtime JSON bridge. Although an
-- empty JSON object is a valid permissive schema, [] is not a schema in draft
-- 2020-12 and causes Claude to reject the entire MCP tool list. Keep every
-- schema position explicit and recursively check the shapes that MCP exports.
local function assert_json_schema(schema: any, path: string): ()
    if type(schema) == "string" then
        local decoded, decode_err = json.decode(schema)
        test.is_nil(decode_err, path .. " must contain valid JSON")
        schema = decoded
    end
    if type(schema) == "boolean" then return end
    test.eq(type(schema), "table", path .. " must be a JSON Schema object or boolean")
    test.is_true(next(schema) ~= nil, path .. " must not be an ambiguous empty Lua table")

    local properties = (schema :: any).properties
    if properties ~= nil then
        test.eq(type(properties), "table", path .. ".properties must be an object")
        test.is_true(next(properties) ~= nil, path .. ".properties must not encode as []")
        for name, child in pairs(properties) do
            assert_json_schema(child, path .. ".properties." .. tostring(name))
        end
    end

    if (schema :: any).items ~= nil then
        assert_json_schema((schema :: any).items, path .. ".items")
    end
    if type((schema :: any).additionalProperties) == "table" then
        assert_json_schema((schema :: any).additionalProperties, path .. ".additionalProperties")
    end
    for _, keyword in ipairs({ "oneOf", "anyOf", "allOf" }) do
        local variants = (schema :: any)[keyword]
        if variants ~= nil then
            test.eq(type(variants), "table", path .. "." .. keyword .. " must be an array")
            test.is_true(#variants > 0, path .. "." .. keyword .. " must not be empty")
            for index, child in ipairs(variants) do
                assert_json_schema(child, path .. "." .. keyword .. "[" .. tostring(index) .. "]")
            end
        end
    end
    if (schema :: any)["not"] ~= nil then
        assert_json_schema((schema :: any)["not"], path .. ".not")
    end
end

local function define_tests()
    test.describe("Journal Packaging", function()
        test.it("ships an injectable member access policy", function()
            local policy = registry.get("chestor.journal.security:member_access")
            local requirement = registry.get("chestor.journal.security:user_security_scope")
            test.not_nil(policy)
            test.not_nil(requirement)
            local discovery = registry.get("chestor.journal.security:member_discovery")
            test.not_nil(discovery)
            local discovery_data: any = discovery.data or discovery
            test.eq(discovery_data.policy.actions[1], "registry.get")
            test.eq(discovery_data.policy.actions[2], "registry.find")
            local data: any = policy.data or policy
            test.eq(data.policy.actions, "access")
            test.eq(data.policy.effect, "allow")
            test.is_true(#data.policy.resources >= 2)
            local shared = registry.get("kickside.contract.http:user_endpoint_access")
            test.not_nil(shared)
            local http_policy: any = shared.data or shared
            test.eq(http_policy.policy.actions, "access")
            local baseline = assert(security.policy("kickside.contract.http:user_endpoint_access"))
            local member = assert(security.policy("chestor.journal.security:module_access"))
            local actor = security.new_actor("module-member", {})
            test.eq(baseline:evaluate(actor, "access", "kickside.core.threads.api:create_thread.endpoint"), "allow")
            test.eq(member:evaluate(actor, "access", "unrelated.module:read.endpoint"), "undefined")
            local endpoints, endpoints_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(endpoints_err)
            local count = 0
            for _, endpoint in ipairs(endpoints or {}) do
                if endpoint.id:sub(1, #"chestor.journal.api:") == "chestor.journal.api:" then
                    count = count + 1
                    test.eq(baseline:evaluate(actor, "access", endpoint.id), "undefined", endpoint.id)
                    test.eq(member:evaluate(actor, "access", endpoint.id), "allow", endpoint.id)
                    test.eq(member:evaluate(actor, "funcs.call", endpoint.id), "undefined", endpoint.id)
                end
            end
            test.is_true(count > 0, "module endpoint declarations are absent")
            test.is_table(http_policy.policy.resources)
            test.is_nil(http_policy.policy.conditions)
            for _, resource in ipairs(data.policy.resources) do
                test.is_false(tostring(resource):find(".api:", 1, true) ~= nil)
            end
            local scope: any = requirement.data or requirement
            test.eq(scope.targets[1].entry, "chestor.journal.security:member_access")
            test.eq(scope.targets[1].path, ".groups +=")
        end)

        test.it("declares every production dependency without harness-only leakage", function()
            local found = module_dependencies()
            local count = 0
            for component, version in pairs(found) do
                count = count + 1
                test.eq(version, DEPENDENCIES[component], "unexpected production dependency " .. component)
            end
            test.eq(count, 8)
            for component, version in pairs(DEPENDENCIES) do
                test.eq(found[component], version, "missing production dependency " .. component)
            end
        end)

        test.it("declares the backend journal kind, supervised projections, events, and trigger ports coherently", function()
            local binding = registry.get(types.JOURNAL_IMPL)
            test.not_nil(binding)
            local m = meta(binding)
            test.eq(m.class, "journal")
            test.eq(m.thread_class, types.THREAD_CLASS)
            test.eq(m.component.manage.view, "chestor.journal:renderer_view")
            local renderer = registry.get("chestor.journal:renderer_view")
            test.not_nil(renderer)
            local renderer_meta = meta(renderer)
            test.eq(renderer_meta.type, "view.component")
            test.eq(renderer_meta.tag_name, "chestor-journal")
            test.eq(renderer_meta.entry_point, "index.js")
            test.eq(renderer_meta.base_path, "chestor-journal")
            test.eq(renderer_meta.auto_register, false)
            local ui_static, ui_static_err = registry.get("chestor.journal:ui_static")
            test.is_nil(ui_static_err, tostring(ui_static_err))
            test.not_nil(ui_static)

            local event_types = {}
            for _, event in ipairs(((m.events or {}).output or {}) :: { any }) do
                event_types[tostring((event :: any).type)] = true
            end
            test.not_nil(event_types[types.EVENT.ENTRY_APPENDED])
            test.not_nil(event_types[types.EVENT.TASK_UPSERTED])
            test.not_nil(event_types[types.EVENT.TASK_TRANSITIONED])
            test.not_nil(event_types[types.EVENT.VERIFICATION_REQUESTED])
            test.not_nil(event_types[types.EVENT.VERIFICATION_RECEIPT])
            test.not_nil(event_types[types.EVENT.CURSOR_UPDATED])
            test.not_nil(event_types[types.EVENT.AUDIT_COVERAGE_RECORDED])
            test.not_nil(event_types[types.EVENT.INTEGRATION_RECORDED])
            test.not_nil(event_types[types.EVENT.CHECKPOINT_CREATED])
            test.not_nil(event_types[types.EVENT.ARTIFACT_LINKED])
            test.not_nil(event_types[types.EVENT.REFERENCE_LINKED])
            test.not_nil(event_types[types.EVENT.REFERENCE_UNLINKED])
            test.not_nil(event_types[types.EVENT.GRAPH_CONFIG_REQUESTED])
            test.not_nil(event_types[types.EVENT.GRAPH_OPS_REQUESTED])

            local projections: { any } = type(m.projections) == "table" and (m.projections :: { any }) or {}
            local projection_by_kind: any = {}
            for _, projection in ipairs(projections) do
                projection_by_kind[tostring((projection :: any).kind)] = projection
            end
            test.eq(projection_by_kind[types.PROJECTION_KIND].worker_ref, "proc://chestor.journal.persist:journal_projection")
            test.eq(projection_by_kind[types.GRAPH_PROJECTION_KIND].worker_ref, "proc://chestor.journal.graph:projection")
            local state_events: any = {}
            for _, event in ipairs(((projection_by_kind[types.PROJECTION_KIND].events or {}).input or {}) :: { any }) do
                state_events[tostring((event :: any).type)] = true
            end
            for event_type, _ in pairs(types.EVENT_SET) do
                test.eq(state_events[event_type], true, "state projection must materialize " .. tostring(event_type))
            end

            local expected_port_count = 0
            for _, _ in pairs(types.EVENT_SET) do expected_port_count = expected_port_count + 1 end
            local port_count = 0
            for _, port in ipairs((m.ports or {}) :: { any }) do
                port_count = port_count + 1
                test.eq(port.announced, true)
                test.eq(port.class, "journal")
                test.not_nil(event_types[tostring((port :: any).type)])
            end
            test.eq(port_count, expected_port_count)
        end)

        test.it("retains the supervised process workers for both default folds", function()
            for _, id in ipairs({ "chestor.journal.persist:journal_projection", "chestor.journal.graph:projection" }) do
                local entry, err = registry.get(id)
                test.is_nil(err)
                test.not_nil(entry)
                test.eq(entry_value(entry, "kind"), "process.lua")
                test.eq(meta(entry).type, "projection.worker")
                test.eq(entry_value(entry, "method"), "run")
                test.eq(entry_value(entry, "lifecycle"), nil)
            end
        end)

        test.it("routes migrations and runtime SQL through the same target_db requirement", function()
            local targets, count = requirement_targets("chestor.journal:target_db")
            test.eq(count, 21)
            test.eq(targets["chestor.journal.migrations:01_create_journal_tables"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:02_scope_fts_keys"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:03_create_journal_graph_tables"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:04_dedupe_fts"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:05_drop_sessions"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:06_task_graph"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:07_enforcement"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:08_replay_integrity"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:09_branch_digests"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:10_agent_cursors"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:11_generic_cursor_position"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:12_cursor_context_refs"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:13_graph_hierarchy"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:14_backfill_graph_hierarchy"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:15_cursor_origin"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:16_graph_assembly"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:17_work_spans"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:18_cursor_revision_claim"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:19_auto_cursor_identity"], ".meta.target_db")
            test.eq(targets["chestor.journal.migrations:20_state_event_sequence"], ".meta.target_db")
            test.eq(targets[types.DB_CONFIG], ".meta.db_id")

            local previous = types._registry
            local requested = ""
            types._registry = {
                get = function(id: string)
                    requested = id
                    return { meta = { db_id = "tenant:journal-db" } }, nil
                end,
            }
            local resolved = types.db_id()
            types._registry = previous

            test.eq(requested, types.DB_CONFIG)
            test.eq(resolved, "tenant:journal-db")
        end)

        test.it("publishes every Journal trait tool with schemas and explicit scopes", function()
            local trait = registry.get("chestor.journal.traits:journal_trait")
            test.not_nil(trait)
            local tool_ids = entry_value(trait, "tools") or {}
            test.eq(#tool_ids, 4)
            test.eq(type(entry_value(trait, "prompt")), "string")
            test.is_nil(meta(trait).tools, "trait tools belong to registry-entry data, not metadata")
            test.is_nil(meta(trait).prompt, "trait prompt belongs to registry-entry data, not metadata")
            local expected = {
                ["chestor.journal.traits:journal_context"] = true,
                ["chestor.journal.traits:journal_query"] = true,
                ["chestor.journal.traits:journal_fact"] = true,
                ["chestor.journal.traits:journal_graph"] = true,
            }
            for _, id in ipairs(tool_ids) do
                test.eq(expected[tostring(id)], true, "unexpected public Journal tool " .. tostring(id))
                local tool = registry.get(tostring(id))
                test.not_nil(tool, "missing Journal tool " .. tostring(id))
                local tool_meta = meta(tool)
                test.eq(tool_meta.type, "tool", tostring(id) .. " must declare meta.type=tool")
                test.eq(type(tool_meta.title), "string")
                test.eq(type(tool_meta.llm_alias), "string")
                test.eq(type(tool_meta.llm_description), "string")
                test.eq(type(tool_meta.input_schema), "table")
                test.eq(type(tool_meta.output_schema), "table")
                local output_required = tool_meta.output_schema.required or {}
                test.eq(#output_required, 1, tostring(id) .. " output errors must remain schema-valid")
                test.eq(output_required[1], "success")
                local scopes = tool_meta.mcp and tool_meta.mcp.required_scopes or {}
                test.eq(type(scopes), "table")
                test.eq(#scopes >= 1, true, tostring(id) .. " must require at least state.read")
                test.eq(scopes[1], "state.read")
            end

            local work_trait = registry.get("chestor.journal.traits:journal_work_trait")
            test.not_nil(work_trait)
            local work_tools = entry_value(work_trait, "tools") or {}
            test.eq(#work_tools, 3)
            test.eq(type(entry_value(work_trait, "prompt")), "string")
            test.is_nil(meta(work_trait).tools, "work tools belong to registry-entry data, not metadata")
            local expected_work = {
                ["chestor.journal.traits:read_journal"] = true,
                ["chestor.journal.traits:act_journal"] = true,
                ["chestor.journal.traits:journal_fact"] = true,
            }
            for _, id in ipairs(work_tools) do
                test.eq(expected_work[tostring(id)], true, "unexpected work adapter tool " .. tostring(id))
            end

            -- Tool schemas are paid on every model request. Keep the default
            -- four-tool ACI bounded while advanced payloads remain available
            -- through generic objects and self-routing continuations.
            local schema_bytes = 0
            for _, id in ipairs(tool_ids) do
                local tool = registry.get(tostring(id))
                schema_bytes = schema_bytes + #json.encode(meta(tool).input_schema)
            end
            test.is_true(schema_bytes <= 10000,
                "default Journal input schemas exceed the 10k-byte ACI budget: " .. tostring(schema_bytes))

            local fact_schema = meta(registry.get("chestor.journal.traits:journal_fact")).input_schema
            test.not_nil(fact_schema.properties.lease_id,
                "the compact fact tool must carry strict-work evidence through a lease")
            local graph_schema = meta(registry.get("chestor.journal.traits:journal_graph")).input_schema
            local graph_actions: any = {}
            for _, value in ipairs(graph_schema.properties.action.enum or {}) do
                graph_actions[tostring(value)] = true
            end
            test.eq(graph_actions.assemble, true,
                "the compact graph tool must expose the backend's on-demand assembly")
            test.eq(graph_actions.status, true,
                "the compact graph tool must expose assembly status")
            test.not_nil(graph_schema.properties.schedule)
            test.not_nil(graph_schema.properties.maintainer)

            local query_schema = meta(registry.get("chestor.journal.traits:journal_query")).input_schema
            test.not_nil(query_schema.properties.validity,
                "JournalQuery must distinguish fact validity from node status and graph lifecycle")
            test.contains(query_schema.properties.detail.description, "collections are summaries")

            local context_schema = meta(registry.get("chestor.journal.traits:journal_context")).input_schema
            test.eq(context_schema.properties.detail.description,
                "Accepted for existing callers; results always include full records.")

            local fact_schema = meta(registry.get("chestor.journal.traits:journal_fact")).input_schema
            test.eq(fact_schema.properties.detail.description,
                "Accepted for existing callers; results always include full records.")

            local legacy_query_schema = meta(registry.get("chestor.journal.traits:query_journal_graph")).input_schema
            test.contains(legacy_query_schema.properties.detail.description, "collections are summaries")

            local read_schema = meta(registry.get("chestor.journal.traits:read_journal")).input_schema
            local read_views: any = {}
            for _, value in ipairs(read_schema.properties.view.enum or {}) do read_views[tostring(value)] = true end
            test.eq(read_views.tasks, true)
            test.eq(read_views.cursor, true)
            test.not_nil(read_schema.properties.task_status)
            test.is_nil(read_schema.properties.detail,
                "ReadJournal returns full records through one path, with no compact/full lens")
            local act_schema = meta(registry.get("chestor.journal.traits:act_journal")).input_schema
            local act_verbs: any = {}
            for _, value in ipairs(act_schema.properties.verb.enum or {}) do act_verbs[tostring(value)] = true end
            for _, verb in ipairs({
                "open_branch", "decompose", "link", "unlink", "start", "block", "unblock",
                "request_verify", "complete", "cancel", "reopen", "fold", "close", "gate_pass", "focus",
                "cursor_open", "cursor_move", "cursor_checkpoint", "cursor_close",
            }) do
                test.eq(act_verbs[verb], true, "act_journal must publish verb " .. verb)
            end
            test.not_nil(act_schema.properties.data.properties.lease_id)
            test.not_nil(act_schema.properties.data.properties.fencing_token)
            test.not_nil(act_schema.properties.data.properties.command_id)
            test.not_nil(act_schema.properties.data.properties.subtasks.items.properties.contract)

            for _, id in ipairs({
                "chestor.journal.traits:record_journal",
                "chestor.journal.traits:query_journal_graph",
                "chestor.journal.traits:apply_journal_graph_ops",
                "chestor.journal.traits:configure_journal_graph",
                "chestor.journal.traits:migrate_legacy_tool",
            }) do
                local adapter = registry.get(id)
                test.not_nil(adapter)
                test.is_true(meta(adapter).type ~= "tool", id .. " must stay out of agent MCP discovery")
            end
        end)

        test.it("exports draft-2020-12-shaped schemas without Lua empty-map ambiguity", function()
            local entries, err = registry.find({ [".kind"] = "function.lua" })
            test.is_nil(err)
            local checked = 0
            for _, entry in ipairs(entries or {}) do
                local id = tostring((entry :: any).id or "")
                local tool_meta = meta(entry)
                if id:sub(1, #"chestor.journal.traits:") == "chestor.journal.traits:"
                    and tool_meta.type == "tool" then
                    checked = checked + 1
                    assert_json_schema(tool_meta.input_schema, id .. ".input_schema")
                    assert_json_schema(tool_meta.output_schema, id .. ".output_schema")
                end
            end
            test.eq(checked, 6, "the two Journal traits expose six unique MCP tools")
        end)

        test.it("keeps persistence in its child namespace and the root libraries focused", function()
            for _, id in ipairs({
                "chestor.journal:thread_log",
                "chestor.journal.write:commands",
                "chestor.journal.read:queries",
                "chestor.journal.read:context",
                "chestor.journal.read:recall",
                "chestor.journal.persist:ops",
                "chestor.journal.persist:reader",
                "chestor.journal.persist:writer",
                "chestor.journal.persist:search_text",
                "chestor.journal.persist:embeddings",
                "chestor.journal.persist:branch_digests",
                "chestor.journal.persist:cursors",
                "chestor.journal.persist:projector",
                "chestor.journal.persist:journal_projection",
                "chestor.journal.persist:graph_reader",
                "chestor.journal.persist:graph_writer",
                "chestor.journal.persist:graph_jobs",
                "chestor.journal.graph:config",
                "chestor.journal.graph:operations",
                "chestor.journal.graph:structural",
                "chestor.journal.graph:maintenance_policy",
                "chestor.journal.graph:hierarchy",
                "chestor.journal.graph:projector",
                "chestor.journal.graph:scheduler",
                "chestor.journal.graph:projection",
                "chestor.journal.graph:maintainer",
                "chestor.journal.graph:service",
                "chestor.journal.embedding:scheduler",
                "chestor.journal.embedding:worker",
            }) do
                test.not_nil(registry.get(id), "missing focused entry " .. id)
            end
            local materializer = registry.get("chestor.journal:materializer")
            test.is_nil(materializer)
            local projection_worker = registry.get("chestor.journal:projection_worker")
            test.is_nil(projection_worker)
            local journal = registry.get("chestor.journal:journal")
            test.is_nil(journal)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

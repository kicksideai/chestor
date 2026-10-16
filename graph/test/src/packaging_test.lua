local test = require("test")
local registry = require("registry")
local security = require("security")
local types = require("types")

local DEPENDENCIES = {
    ["kickside/core"] = "*",
    ["kickside/contract"] = "*",
    ["wippy/migration"] = "*",
    ["kickside/widgets"] = "*",
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
        if id:sub(1, #"chestor.graph:") == "chestor.graph:" then
            local component = tostring(entry_value(entry, "component") or "")
            found[component] = tostring(entry_value(entry, "version") or "")
        end
    end
    return found
end

local function meta(entry: any): any
    return entry and (entry.meta or (entry.data and entry.data.meta)) or {}
end

local function requirement_targets(id: string): any
    local requirement = registry.get(id)
    test.not_nil(requirement)
    local discovery = registry.get("chestor.graph.security:member_discovery")
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

local function define_tests()
    test.describe("Graph Packaging", function()
        test.it("ships an injectable member access policy", function()
            local policy = registry.get("chestor.graph.security:member_access")
            local requirement = registry.get("chestor.graph.security:user_security_scope")
            test.not_nil(policy)
            test.not_nil(requirement)
            local discovery = registry.get("chestor.graph.security:member_discovery")
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
            local member = assert(security.policy("chestor.graph.security:module_access"))
            local actor = security.new_actor("module-member", {})
            test.eq(baseline:evaluate(actor, "access", "kickside.core.threads.api:create_thread.endpoint"), "allow")
            test.eq(member:evaluate(actor, "access", "unrelated.module:read.endpoint"), "undefined")
            local endpoints, endpoints_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(endpoints_err)
            local count = 0
            for _, endpoint in ipairs(endpoints or {}) do
                if endpoint.id:sub(1, #"chestor.graph.api:") == "chestor.graph.api:" then
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
            test.eq(scope.targets[1].entry, "chestor.graph.security:member_access")
            test.eq(scope.targets[1].path, ".groups +=")
        end)

        test.it("declares the worker consumed by the projection engine", function()
            local entry = registry.get("chestor.graph:projection_worker")
            test.not_nil(entry)
            local data: any = entry.data or entry
            local declared: any = entry.meta or data.meta
            test.not_nil(declared)
            test.eq(declared.type, "projection.worker")
        end)

        test.it("declares every production dependency without harness-only leakage", function()
            local found = module_dependencies()
            local count = 0
            for component, version in pairs(found) do
                count = count + 1
                test.eq(version, DEPENDENCIES[component], "unexpected production dependency " .. component)
            end
            test.eq(count, 4)
            for component, version in pairs(DEPENDENCIES) do
                test.eq(found[component], version, "missing production dependency " .. component)
            end
        end)

        test.it("declares the graph kind, projection, and announced trigger ports coherently", function()
            local binding = registry.get(types.GRAPH_IMPL)
            test.not_nil(binding)
            local m = meta(binding)
            test.eq(m.class, "graph")
            test.eq(m.thread_class, types.THREAD_CLASS)
            test.eq(m.component.manage.view, "chestor.graph:renderer_view")
            local view = registry.get("chestor.graph:renderer_view")
            test.not_nil(view)
            test.eq(meta(view).tag_name, "chestor-graph")

            local event_types = {}
            for _, event in ipairs(((m.events or {}).output or {}) :: { any }) do
                event_types[tostring(event.type)] = true
            end
            for event_type in pairs(event_types) do
                local declaration, err = registry.get(event_type)
                test.is_nil(err, event_type)
                test.not_nil(declaration, event_type)
                test.eq(meta(declaration).type, "kickside.core.threads.event", event_type)
            end
            test.not_nil(event_types[types.EVENT.NODE_ADDED])
            test.not_nil(event_types[types.EVENT.MATERIAL_ATTACHED])

            local projections: { any } = type(m.projections) == "table" and (m.projections :: { any }) or {}
            local projection = projections[1] or {}
            test.eq(projection.kind, types.PROJECTION_KIND)
            test.eq(projection.worker_ref, "func://chestor.graph:projection_worker")

            local port_count = 0
            for _, port in ipairs((m.ports or {}) :: { any }) do
                port_count = port_count + 1
                test.eq(port.announced, true)
                test.not_nil(event_types[tostring(port.type)])
            end
            test.eq(port_count, 9)
        end)

        test.it("routes migrations and runtime SQL through the same target_db requirement", function()
            local targets, count = requirement_targets("chestor.graph:target_db")
            test.eq(count, 3)
            test.eq(targets["chestor.graph.migrations:01_create_graph_materialized_tables"], ".meta.target_db")
            test.eq(targets["chestor.graph.migrations:02_add_history_stack_order"], ".meta.target_db")
            test.eq(targets[types.DB_CONFIG], ".meta.db_id")

            local previous = types._registry
            local requested = ""
            types._registry = {
                get = function(id: string)
                    requested = id
                    return { meta = { db_id = "tenant:graph-db" } }, nil
                end,
            }
            local resolved = types.db_id()
            types._registry = previous

            test.eq(requested, types.DB_CONFIG)
            test.eq(resolved, "tenant:graph-db")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

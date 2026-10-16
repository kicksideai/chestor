local test = require("test")
local registry = require("registry")
local security = require("security")
local types = require("types")

local NS = "chestor.roadmap"
local API_NS = "chestor.roadmap.api:"
local TRAITS_NS = "chestor.roadmap.traits:"
local PORTS_NS = "chestor.roadmap.ports:"
local MIGRATIONS_NS = "chestor.roadmap.migrations:"
local EVENTS_NS = "chestor.roadmap.events:"
local VIEW_ID = "chestor.roadmap:renderer_view"
local ENDPOINT_ACCESS = "chestor.roadmap.security:roadmap_endpoint_access"

local DEPENDENCIES = {
    ["kickside/core"] = "*",
    ["kickside/contract"] = "*",
    ["kickside/component"] = "*",
    ["wippy/migration"] = "*",
}

-- A registry entry presents its fields either directly or under .data, so every
-- read goes through both.
local function entry_value(entry: any, key: string): any
    if type(entry) ~= "table" then return nil end
    if type((entry :: any).data) == "table" and (entry :: any).data[key] ~= nil then
        return (entry :: any).data[key]
    end
    return (entry :: any)[key]
end

local function meta(entry: any): any
    return entry and (entry.meta or (entry.data and entry.data.meta)) or {}
end

local function has_prefix(id: string, prefix: string): boolean
    return id:sub(1, #prefix) == prefix
end

local function find(filter: any): { any }
    local entries, err = registry.find(filter)
    test.is_nil(err)
    return entries or {}
end

local function owned(filter: any, prefix: string): { any }
    local out: { any } = {}
    for _, entry in ipairs(find(filter)) do
        if has_prefix(tostring((entry :: any).id or ""), prefix) then out[#out + 1] = entry end
    end
    return out
end

local function requirement_targets(id: string): (any, number)
    local requirement = registry.get(id)
    test.not_nil(requirement, "missing requirement " .. id)
    local targets: any = {}
    local count = 0
    for _, target in ipairs((((requirement :: any).data or requirement).targets or {}) :: { any }) do
        count = count + 1
        targets[tostring((target :: any).entry)] = tostring((target :: any).path)
    end
    return targets, count
end

local function define_tests()
    test.describe("Roadmap Packaging", function()
        test.it("declares the worker consumed by the projection engine", function()
            local entry = registry.get("chestor.roadmap:projection_worker")
            test.not_nil(entry)
            local data: any = entry.data or entry
            local declared: any = entry.meta or data.meta
            test.not_nil(declared)
            test.eq(declared.type, "projection.worker")
        end)

        test.it("declares every production dependency without harness-only leakage", function()
            local found: any = {}
            local count = 0
            for _, entry in ipairs(owned({ [".kind"] = "ns.dependency" }, NS .. ":")) do
                count = count + 1
                local component = tostring(entry_value(entry, "component") or "")
                local version = tostring(entry_value(entry, "version") or "")
                test.eq(version, DEPENDENCIES[component], "unexpected production dependency " .. component)
                found[component] = version
            end
            test.eq(count, 4)
            for component, version in pairs(DEPENDENCIES) do
                test.eq(found[component], version, "missing production dependency " .. component)
            end
        end)

        test.it("routes every endpoint through the api_router requirement", function()
            local targets, count = requirement_targets(NS .. ":api_router")
            local endpoints = owned({ [".kind"] = "http.endpoint" }, API_NS)
            test.is_true(#endpoints > 0)
            for _, endpoint in ipairs(endpoints) do
                local id = tostring((endpoint :: any).id)
                test.eq(targets[id], ".meta.router", "endpoint not routed: " .. id)
            end
            test.eq(count, #endpoints)
            test.eq(meta(registry.get(NS .. ":api_router")).value_kind, "http.router")
        end)

        test.it("serves every declared endpoint path under the workspace roadmaps prefix", function()
            local paths: { [string]: string } = {}
            for _, endpoint in ipairs(owned({ [".kind"] = "http.endpoint" }, API_NS)) do
                local path = tostring(entry_value(endpoint, "path") or "")
                test.contains(path, "/workspace/roadmaps/{id}")
                paths[tostring(entry_value(endpoint, "method") or "") .. " " .. path] = tostring((endpoint :: any).id)
            end
            test.not_nil(paths["GET /workspace/roadmaps/{id}"])
            test.not_nil(paths["POST /workspace/roadmaps/{id}/apply"])
            test.not_nil(paths["POST /workspace/roadmaps/{id}/undo"])
            test.not_nil(paths["POST /workspace/roadmaps/{id}/redo"])
            test.not_nil(paths["GET /workspace/roadmaps/{id}/initiatives"])
            test.not_nil(paths["GET /workspace/roadmaps/{id}/dependencies"])
            test.not_nil(paths["GET /workspace/roadmaps/{id}/critical"])
            test.not_nil(paths["GET /workspace/roadmaps/{id}/schema"])
        end)

        test.it("routes migrations and runtime SQL through the same target_db requirement", function()
            local targets, count = requirement_targets(NS .. ":target_db")
            local migrations = owned({ ["meta.type"] = "migration" }, MIGRATIONS_NS)
            test.is_true(#migrations > 0)
            for _, migration in ipairs(migrations) do
                local id = tostring((migration :: any).id)
                test.eq(targets[id], ".meta.target_db", "migration not routed to target_db: " .. id)
            end
            test.eq(targets[types.DB_CONFIG], ".meta.db_id")
            test.eq(count, #migrations + 1)

            local previous = types._registry
            local requested = ""
            types._registry = {
                get = function(id: string)
                    requested = id
                    return { meta = { db_id = "tenant:roadmap-db" } }, nil
                end,
            }
            local resolved = types.db_id()
            types._registry = previous

            test.eq(requested, types.DB_CONFIG)
            test.eq(resolved, "tenant:roadmap-db")
        end)

        test.it("declares the roadmap kind, its thread class, its view, and its projection coherently", function()
            local binding = registry.get(types.IMPL_ID)
            test.not_nil(binding)
            local m = meta(binding)
            test.eq(m.class, "roadmap")
            test.eq(m.thread_class, types.THREAD_CLASS)
            test.eq((m.thread or {}).class, types.THREAD_CLASS)
            test.eq(m.component.manage.view, VIEW_ID)
            test.not_nil(m.component.create)
            test.eq(m.read, "chestor.roadmap.binding:read")

            local view = registry.get(VIEW_ID)
            test.not_nil(view)
            test.eq(meta(view).tag_name, "chestor-roadmap")
            test.eq(meta(view).type, "view.component")

            local projections: { any } = type(m.projections) == "table" and (m.projections :: { any }) or {}
            test.eq(#projections, 1)
            test.eq((projections[1] :: any).kind, types.PROJECTION_KIND)
            test.eq((projections[1] :: any).worker_ref, "func://chestor.roadmap:projection_worker")
        end)

        test.it("publishes an event face for every declared output event", function()
            local m = meta(registry.get(types.IMPL_ID))
            local outputs: { any } = ((m.events or {}).output or {}) :: { any }
            test.is_true(#outputs > 0)
            local declared: { [string]: boolean } = {}
            for _, event in ipairs(outputs) do
                local id = tostring((event :: any).type)
                declared[id] = true
                test.is_true(has_prefix(id, EVENTS_NS), "event type outside the events namespace: " .. id)
                local face = registry.get(id)
                test.not_nil(face, "missing event face " .. id)
                test.eq(meta(face).type, "kickside.core.threads.event")
                local schema = entry_value(face, "schema")
                test.is_table(schema, "event face without a schema: " .. id)
                test.eq((schema :: any).type, "object")
                test.not_nil((schema :: any).properties)
            end
            for _, constant in pairs(types.EVENT) do
                test.is_true(declared[tostring(constant)], "event constant not declared as an output: " .. tostring(constant))
            end
        end)

        test.it("projects every declared output event into the read model", function()
            local m = meta(registry.get(types.IMPL_ID))
            local projected: { [string]: boolean } = {}
            local inputs: { any } = (((m.projections :: { any })[1].events or {}).input or {}) :: { any }
            for _, event in ipairs(inputs) do projected[tostring((event :: any).type)] = true end
            for _, event in ipairs(((m.events or {}).output or {}) :: { any }) do
                test.is_true(projected[tostring((event :: any).type)], "output event never projected: " .. tostring((event :: any).type))
            end
        end)

        test.it("points every automation port at this binding and a declared event", function()
            local ports = owned({ ["meta.type"] = "kickside.automation.port" }, PORTS_NS)
            test.eq(#ports, 5)
            local m = meta(registry.get(types.IMPL_ID))
            local declared: { [string]: boolean } = {}
            for _, event in ipairs(((m.events or {}).output or {}) :: { any }) do
                declared[tostring((event :: any).type)] = true
            end
            for _, port in ipairs(ports) do
                local id = tostring((port :: any).id)
                test.eq(tostring(entry_value(port, "binding")), types.IMPL_ID, "port bound elsewhere: " .. id)
                local event = tostring(entry_value(port, "event"))
                test.is_true(declared[event], "port references an undeclared event: " .. id)
                test.not_nil(registry.get(event), "port references an event with no face: " .. id)
                test.not_nil(meta(port).title)
            end
        end)

        test.it("covers every handler namespace with the endpoint access policy", function()
            local policy = registry.get(ENDPOINT_ACCESS)
            test.not_nil(policy)
            local resources: { any } = (entry_value(policy, "policy") or {}).resources or {}
            local covered: { [string]: boolean } = {}
            for _, resource in ipairs(resources) do covered[tostring(resource)] = true end
            test.is_nil(covered[API_NS .. "*"], "HTTP admission belongs to the module grant")
            local shared = registry.get("kickside.contract.http:user_endpoint_access")
            test.not_nil(shared)
            test.eq(entry_value(shared, "policy").actions, "access")
            local baseline = assert(security.policy("kickside.contract.http:user_endpoint_access"))
            local member = assert(security.policy("chestor.roadmap.security:module_access"))
            local actor = security.new_actor("module-member", {})
            test.eq(baseline:evaluate(actor, "access", "kickside.core.threads.api:create_thread.endpoint"), "allow")
            test.eq(member:evaluate(actor, "access", "unrelated.module:read.endpoint"), "undefined")
            local endpoints, endpoints_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(endpoints_err)
            local count = 0
            for _, endpoint in ipairs(endpoints or {}) do
                if endpoint.id:sub(1, #"chestor.roadmap.api:") == "chestor.roadmap.api:" then
                    count = count + 1
                    test.eq(baseline:evaluate(actor, "access", endpoint.id), "undefined", endpoint.id)
                    test.eq(member:evaluate(actor, "access", endpoint.id), "allow", endpoint.id)
                    test.eq(member:evaluate(actor, "funcs.call", endpoint.id), "undefined", endpoint.id)
                end
            end
            test.is_true(count > 0, "module endpoint declarations are absent")
            test.is_nil(entry_value(shared, "policy").conditions)
            test.is_true(covered[TRAITS_NS .. "*"], "trait namespace not covered")
            test.eq(entry_value(policy, "policy").actions, "access")
            test.eq(entry_value(policy, "policy").effect, "allow")

            local groups = entry_value(policy, "groups")
            test.is_table(groups)

            local scope_targets, scope_count = requirement_targets("chestor.roadmap.security:user_security_scope")
            test.eq(scope_count, 3)
            test.is_nil(scope_targets["chestor.roadmap.security:module_tools"], "Optional tools require explicit group composition")
            test.eq(scope_targets["chestor.roadmap.security:module_access"], ".groups +=")
            test.eq(scope_targets["chestor.roadmap.security:member_discovery"], ".groups +=")
            local discovery = registry.get("chestor.roadmap.security:member_discovery")
            test.not_nil(discovery)
            test.eq(entry_value(discovery, "policy").actions[1], "registry.get")
            test.eq(entry_value(discovery, "policy").actions[2], "registry.find")
            test.eq(scope_targets[ENDPOINT_ACCESS], ".groups +=")
            test.eq(meta(registry.get("chestor.roadmap.security:user_security_scope")).value_kind, "security.scope")

            -- Every namespace that backs an endpoint or an agent tool must be named
            -- by the policy, or the slice grants reachability it does not cover.
            local namespaces: { [string]: boolean } = {}
            for _, endpoint in ipairs(owned({ [".kind"] = "http.endpoint" }, NS)) do
                test.is_true(baseline:evaluate(actor, "access", tostring((endpoint :: any).id)) == "undefined")
                test.is_true(member:evaluate(actor, "access", tostring((endpoint :: any).id)) == "allow")
            end
            for _, tool in ipairs(owned({ ["meta.type"] = "tool" }, NS)) do
                namespaces[tostring((tool :: any).id):match("^(.-):") or ""] = true
            end
            for namespace in pairs(namespaces) do
                test.is_true(covered[namespace .. ":*"], "handler namespace not covered by the policy: " .. namespace)
            end
        end)

        test.it("declares the agent traits and scopes every tool they surface", function()
            local traits = owned({ ["meta.type"] = "agent.trait" }, TRAITS_NS)
            test.eq(#traits, 2)
            local by_id: { [string]: any } = {}
            for _, trait in ipairs(traits) do
                by_id[tostring((trait :: any).id)] = trait
                test.eq(meta(trait).public, true)
                test.is_string(entry_value(trait, "prompt"))
            end

            local model = by_id[TRAITS_NS .. "roadmap_model"]
            test.not_nil(model)
            test.eq(meta(model).icon, "tabler:map-2")
            local tags: { any } = meta(model).tags or {}
            local tagged: { [string]: boolean } = {}
            for _, tag in ipairs(tags) do tagged[tostring(tag)] = true end
            for _, expected in ipairs({ "roadmap", "workspace", "planning", "state", "editor" }) do
                test.is_true(tagged[expected], "missing trait tag " .. expected)
            end

            local tools: { any } = entry_value(model, "tools") or {}
            test.eq(#tools, 3)
            for _, tool_id in ipairs(tools) do
                local tool = registry.get(tostring(tool_id))
                test.not_nil(tool, "missing tool " .. tostring(tool_id))
                local tm = meta(tool)
                test.eq(tm.type, "tool")
                test.is_string(tm.llm_alias)
                test.is_string(tm.llm_description)
                test.is_string(tm.input_schema)
                test.is_string(tm.output_schema)
                local scopes: { any } = (tm.mcp or {}).required_scopes or {}
                test.is_true(#scopes > 0, "tool without required scopes: " .. tostring(tool_id))
                test.eq(tostring(scopes[1]), "state.read")
            end

            local planning = by_id[TRAITS_NS .. "roadmap_planning"]
            test.not_nil(planning)
            test.is_nil(entry_value(planning, "tools"))
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

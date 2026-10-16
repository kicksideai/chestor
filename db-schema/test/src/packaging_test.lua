local test = require("test")
local registry = require("registry")
local security = require("security")
local types = require("types")

-- Module declarations never pin a version; the application lock resolves them.
local DEPENDENCIES = {
    ["kickside/core"] = "*",
    ["kickside/contract"] = "*",
    ["wippy/migration"] = "*",
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
        if id:sub(1, #"chestor.db_schema:") == "chestor.db_schema:" then
            local component = tostring(entry_value(entry, "component") or "")
            found[component] = tostring(entry_value(entry, "version") or "")
        end
    end
    return found
end

local function targets_for(id: string): any
    local requirement = registry.get(id)
    test.not_nil(requirement)
            local discovery = registry.get("chestor.db_schema.security:member_discovery")
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
    test.describe("Database Schema Packaging", function()
        test.it("ships an injectable member access policy", function()
            local policy = registry.get("chestor.db_schema.security:member_access")
            local requirement = registry.get("chestor.db_schema.security:user_security_scope")
            test.not_nil(policy)
            test.not_nil(requirement)
            local discovery = registry.get("chestor.db_schema.security:member_discovery")
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
            local member = assert(security.policy("chestor.db_schema.security:module_access"))
            local actor = security.new_actor("module-member", {})
            test.eq(baseline:evaluate(actor, "access", "kickside.core.threads.api:create_thread.endpoint"), "allow")
            test.eq(member:evaluate(actor, "access", "unrelated.module:read.endpoint"), "undefined")
            local endpoints, endpoints_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(endpoints_err)
            local count = 0
            for _, endpoint in ipairs(endpoints or {}) do
                if endpoint.id:sub(1, #"chestor.db_schema.api:") == "chestor.db_schema.api:" then
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
            test.eq(scope.targets[1].entry, "chestor.db_schema.security:member_access")
            test.eq(scope.targets[1].path, ".groups +=")
        end)

        test.it("declares the worker consumed by the projection engine", function()
            local entry = registry.get("chestor.db_schema:projection_worker")
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
            test.eq(count, 3)
            for component, version in pairs(DEPENDENCIES) do
                test.eq(found[component], version, "missing production dependency " .. component)
            end
        end)

        test.it("registers every database output as a thread event", function()
            local binding, err = registry.get(types.DB_IMPL)
            test.is_nil(err)
            test.not_nil(binding)
            local data = binding.data or binding
            local meta = binding.meta or data.meta
            for _, event in ipairs(meta.events.output) do
                local declaration, derr = registry.get(event.type)
                test.is_nil(derr, event.type)
                test.not_nil(declaration, event.type)
                local d = declaration.data or declaration
                test.eq((declaration.meta or d.meta).type, "kickside.core.threads.event", event.type)
            end
        end)

        test.it("routes migrations and runtime SQL through the same target_db requirement", function()
            local targets, count = targets_for("chestor.db_schema:target_db")
            test.eq(count, 2)
            test.eq(targets["chestor.db_schema.migrations:01_create_schema_materialized_tables"], ".meta.target_db")
            test.eq(targets[types.DB_CONFIG], ".meta.db_id")

            local previous = types._registry
            local requested = ""
            types._registry = {
                get = function(id: string)
                    requested = id
                    return { meta = { db_id = "tenant:schema-db" } }, nil
                end,
            }
            local resolved = types.db_id()
            types._registry = previous

            test.eq(requested, types.DB_CONFIG)
            test.eq(resolved, "tenant:schema-db")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

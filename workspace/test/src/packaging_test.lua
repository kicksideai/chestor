local test = require("test")
local registry = require("registry")
local security = require("security")

-- Modules never pin dependency versions: every declared dependency floats on
-- "*" and only the consuming app locks. The set itself is the contract.
local DEPENDENCIES = {
    ["kickside/component"] = "*",
    ["kickside/core"] = "*",
    ["kickside/contract"] = "*",
    ["kickside/renderers"] = "*",
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
        if id:sub(1, #"chestor.workspace:") == "chestor.workspace:" then
            local component = tostring(entry_value(entry, "component") or "")
            found[component] = tostring(entry_value(entry, "version") or "")
        end
    end
    return found
end

local function meta(entry: any): any
    return entry and ((entry :: any).meta or ((entry :: any).data and (entry :: any).data.meta)) or {}
end

local function define_tests()
    test.describe("Workspace Packaging", function()
        test.it("ships an injectable member access policy", function()
            local policy = registry.get("chestor.workspace.security:member_access")
            local requirement = registry.get("chestor.workspace.security:user_security_scope")
            test.not_nil(policy)
            test.not_nil(requirement)
            local discovery = registry.get("chestor.workspace.security:member_discovery")
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
            local member = assert(security.policy("chestor.workspace.security:module_access"))
            local actor = security.new_actor("module-member", {})
            test.eq(baseline:evaluate(actor, "access", "kickside.core.threads.api:create_thread.endpoint"), "allow")
            test.eq(member:evaluate(actor, "access", "unrelated.module:read.endpoint"), "undefined")
            local endpoints, endpoints_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(endpoints_err)
            local count = 0
            for _, endpoint in ipairs(endpoints or {}) do
                if endpoint.id:sub(1, #"chestor.workspace.api:") == "chestor.workspace.api:" then
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
            test.eq(scope.targets[1].entry, "chestor.workspace.security:member_access")
            test.eq(scope.targets[1].path, ".groups +=")
        end)

        test.it("declares every production dependency without harness-only leakage", function()
            local found = module_dependencies()
            local count = 0
            for component, version in pairs(found) do
                count = count + 1
                test.eq(version, DEPENDENCIES[component], "unexpected production dependency " .. component)
            end
            test.eq(count, 5)
            for component, version in pairs(DEPENDENCIES) do
                test.eq(found[component], version, "missing production dependency " .. component)
            end
        end)

        test.it("uses one user-facing name across the package and navigation contract", function()
            local definition = registry.get("chestor.workspace:definition")
            local view = registry.get("chestor.workspace:workspace_view")
            local nav = registry.get("chestor.workspace:nav_item")

            test.not_nil(definition)
            test.not_nil(view)
            test.not_nil(nav)
            test.eq(meta(definition).title, "Workspace")
            test.eq(meta(view).title, "Workspace")
            test.eq(meta(nav).title, "Workspace")
            test.eq(meta(view).tag_name, "chestor-workspace")
            test.eq(meta(nav).component_tag, "chestor-workspace")
        end)

        test.it("publishes the generic create renderer as a discoverable component", function()
            local create_view = registry.get("chestor.workspace:entry_create_view")

            test.not_nil(create_view)
            test.eq(meta(create_view).type, "view.component")
            test.eq(meta(create_view).tag_name, "wc-entry-create")
            test.eq(meta(create_view).entry_point, "entry_create.js")
            test.is_true(meta(create_view).announced)
            test.is_true(meta(create_view).auto_register)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- autocode's migrations are applied on app:db and every endpoint its module
-- access policy grants is a registered HTTP endpoint.
local test = require("test")
local registry = require("registry")
local sql = require("sql")

local MEMBER_ENDPOINTS = "chestor.autocode.security:member_endpoints"
local MANAGEMENT = "chestor.autocode.security:module_management"
local TABLES = {
    "chestor_autocode_account_state",
    "chestor_autocode_image_builds",
    "chestor_autocode_runs",
    "chestor_autocode_run_events",
}

local function query(statement: string, args: {unknown}?): {unknown}
    local db, db_err = sql.get("app:db")
    test.is_nil(db_err)
    local rows, err = db:query(statement, args or {})
    db:release()
    test.is_nil(err, statement)
    return rows
end

local function cases()
    test.describe("autocode wiring", function()
        test.it("records every autocode migration as applied", function()
            local migrations, err = registry.find({["meta.type"] = "migration"})
            test.is_nil(err)
            local count = 0
            for _, entry in ipairs(migrations) do
                local id = tostring(entry.id)
                if id:find("^chestor%.autocode%.") then
                    count = count + 1
                    local rows = query("SELECT id FROM _migrations WHERE id = $1", {id})
                    test.eq(#rows, 1, id .. " is not applied")
                end
            end
            test.is_true(count > 0, "autocode declares no migrations")
        end)

        test.it("creates the autocode tables", function()
            for _, name in ipairs(TABLES) do
                local rows = query("SELECT COUNT(*) AS n FROM " .. name)
                test.eq(#rows, 1, name)
            end
        end)

        local function endpoints(policy_id: string): {string}
            local policy, err = registry.get(policy_id)
            test.is_nil(err)
            test.not_nil(policy, policy_id)
            local list = {}
            for _, id in ipairs(policy.data.policy.resources) do
                if tostring(id):find("%.endpoint$") then list[#list + 1] = tostring(id) end
            end
            return list
        end

        test.it("registers every endpoint the member and management policies grant", function()
            for _, policy_id in ipairs({MEMBER_ENDPOINTS, MANAGEMENT}) do
                local list = endpoints(policy_id)
                test.is_true(#list > 0, policy_id .. " grants no endpoint")
                for _, id in ipairs(list) do
                    local entry, entry_err = registry.get(id)
                    test.is_nil(entry_err, id)
                    test.not_nil(entry, id .. " is not registered")
                    test.eq(entry.kind, "http.endpoint", id)
                    test.eq(entry.meta.router, "app:api", id)
                end
            end
        end)

        test.it("grants members only member endpoints and management only the rest", function()
            for _, id in ipairs(endpoints(MEMBER_ENDPOINTS)) do test.is_true(id:find("%.user%.endpoint$") ~= nil, id) end
            for _, id in ipairs(endpoints(MANAGEMENT)) do test.is_nil(id:find("%.user%.endpoint$"), id) end
        end)

        test.it("gives members no execution capability", function()
            local entries, err = registry.find({[".kind"] = "security.policy"})
            test.is_nil(err)
            for _, entry in ipairs(entries) do
                local id = tostring(entry.id)
                local groups = entry.data and entry.data.groups or {}
                local member = false
                for _, group in ipairs(groups) do if group == "kickside.security.groups:members" then member = true end end
                if member and id:find("^chestor%.autocode%.") then
                    local actions = entry.data.policy.actions
                    if type(actions) == "string" then actions = {actions} end
                    for _, action in ipairs(actions) do
                        test.is_true(action ~= "exec.run" and action ~= "exec.get" and action ~= "process.spawn"
                            and action ~= "kickside.execution.defer" and action ~= "security.actor.create", id .. " grants " .. action)
                    end
                end
            end
        end)

        test.it("names callable runtime resources exactly", function()
            for _, id in ipairs({"chestor.autocode.security:module_runtime", "chestor.autocode.security:worker_runtime"}) do
                local entry, err = registry.get(id)
                test.is_nil(err)
                local policy = entry.data.policy
                local callable = false
                for _, action in ipairs(policy.actions) do
                    if action == "funcs.call" or action == "contract.open" or action == "contract.call" then callable = true end
                end
                if callable then
                    for _, resource in ipairs(policy.resources) do
                        test.is_nil(resource:find("*", 1, true), id .. ": " .. resource)
                    end
                end
            end
        end)

        test.it("uses the component service's method names as contract.call resources", function()
            local entry, err = registry.get("chestor.autocode.security:service_calls")
            test.is_nil(err)
            local binding, binding_err = registry.get("kickside.component.binding:component_service_impl")
            test.is_nil(binding_err)
            local methods = binding.data.contracts[1].methods
            for _, method in ipairs(entry.data.policy.resources) do
                test.not_nil(methods[method], "component service has no method " .. method)
                local target, target_err = registry.get(methods[method])
                test.is_nil(target_err)
                test.not_nil(target)
                test.eq(target.kind, "function.lua")
            end
        end)

        test.it("publishes no unused HTTP launch preview", function()
            for _, id in ipairs({"chestor.autocode.api:runs_preview", "chestor.autocode.api:runs_preview.user.endpoint"}) do
                local entry = registry.get(id)
                test.is_nil(entry, id)
            end
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- autocode's migrations are applied on app:db and every endpoint its module
-- access policy grants is a registered HTTP endpoint.
local test = require("test")
local registry = require("registry")
local sql = require("sql")
local json = require("json")
local funcs = require("funcs")

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
        test.it("declares a grouped Autocode settings section for the generic form", function()
            local entry = registry.get("chestor.autocode:settings.block.autocode")
            test.not_nil(entry)
            test.eq(entry.meta.type, "kickside.settings:block")
            test.eq(entry.data.key, "autocode")
            test.eq(entry.data.title, "Autocode")
            test.eq(entry.data.icon, registry.get("chestor.autocode:settings_tab").data.icon)
            test.eq(entry.data.group, "Application")
            test.eq(entry.data.order, 80)
            test.eq(entry.data.namespace, "chestor.autocode")
            test.is_nil(entry.data.component_tag)
        end)
        test.it("groups and orders the published settings for runs then images and Docker", function()
            local expected = {
                {key = "run_timeout", title = "Run timeout", category = "Runs", order = 10},
                {key = "account_cooldown", title = "Account cooldown", category = "Runs", order = 20},
                {key = "run_retention", title = "Run and log retention", category = "Runs", order = 30},
                {key = "image_build_timeout", title = "Image build timeout", category = "Images and Docker", order = 40},
                {key = "build_cache_retention", title = "Build cache retention", category = "Images and Docker", order = 50},
            }
            for _, setting in ipairs(expected) do
                local entry = registry.get("chestor.autocode:setting." .. setting.key)
                test.not_nil(entry)
                test.eq(entry.meta.type, "kickside.settings:definition")
                test.eq(entry.data.namespace, "chestor.autocode")
                test.eq(entry.data.key, setting.key)
                test.eq(entry.data.title, setting.title)
                test.eq(entry.data.category, setting.category)
                test.eq(entry.data.order, setting.order)
                test.eq(entry.data.value_type, "duration")
                test.eq(entry.data.visible, true)
                test.eq(entry.data.editable, true)
                test.eq(entry.data.validate_func, "chestor.autocode:validate_duration")
            end
        end)
        test.it("describes retention of settled runs and their event logs without changing the published key", function()
            local entry = registry.get("chestor.autocode:setting.run_retention")
            test.eq(entry.data.key, "run_retention")
            test.eq(entry.data.default, "720h")
            test.eq(entry.data.description, "Retention deletes settled runs and their event logs older than this duration (for example, `720h`).")
        end)
        test.it("validates the image build timeout at both duration bounds", function()
            for _, duration in ipairs({"1m", "30m", "168h"}) do
                local valid, err = funcs.call("chestor.autocode:validate_duration", {key = "image_build_timeout", value = duration})
                test.is_nil(err, tostring(err))
                test.is_true(valid)
            end
            for _, duration in ipairs({"0s", "59s", "-1m", "168h1ms"}) do
                local valid, err = funcs.call("chestor.autocode:validate_duration", {key = "image_build_timeout", value = duration})
                test.is_nil(valid)
                test.is_true(errors.is(err, errors.INVALID), duration)
            end
        end)
        test.it("indexes retained submission lookups by run id", function()
            local db = sql.get("app:db")
            local dbtype = db:type()
            local statement = dbtype == sql.type.POSTGRES and
                "SELECT indexname AS name FROM pg_indexes WHERE tablename = 'chestor_autocode_submissions'" or
                "SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'chestor_autocode_submissions'"
            local rows, err = db:query(statement, {})
            db:release()
            test.is_nil(err)
            local found = false
            for _, row in ipairs(rows) do if row.name == "chestor_autocode_submissions_run" then found = true end end
            test.is_true(found)
        end)
        test.it("places shared codecs below persistence, service and runner", function()
            for _, name in ipairs({"recipe", "credentials", "live"}) do test.not_nil(registry.get("chestor.autocode.domain:" .. name)) end
            for _, id in ipairs({"chestor.autocode.persist:builds", "chestor.autocode.persist:database"}) do
                local entry = registry.get(id)
                test.eq(entry.data.imports.recipe, "chestor.autocode.domain:recipe")
            end
        end)
        test.it("keeps implementation policies private and capability bundles public", function()
            local entries, err = registry.find({[".kind"] = "security.policy"})
            test.is_nil(err)
            for _, entry in ipairs(entries) do
                local id = tostring(entry.id)
                if id:find("^chestor%.autocode%.security:") then
                    local capability = entry.meta.intent == "module_access" or entry.meta.intent == "module_management" or entry.meta.intent == "tool_access"
                    if capability then test.is_true(entry.meta.private ~= true, id)
                    else test.eq(entry.meta.private, true, id) end
                end
            end
        end)
        test.it("registers a validated image build timeout", function()
            local entry = registry.get("chestor.autocode:setting.image_build_timeout")
            test.not_nil(entry)
            test.eq(entry.data.default, "30m")
            test.eq(entry.data.validate_func, "chestor.autocode:validate_duration")
        end)
        test.it("aligns credential kind limits in the schema and service", function()
            local definition = registry.get("chestor.autocode:accounts")
            for _, method in ipairs(definition.data.methods) do
                if method.name == "add_account" then
                    local definition = method.input_schemas[1].definition
                    local schema = type(definition) == "string" and json.decode(definition) or definition
                    test.eq(schema.properties.credential_kind.maxLength, 200)
                end
            end
        end)
        test.it("exposes run subroutes through the shell's component route bridge", function()
            local nav = registry.get("chestor.autocode:nav_item")
            local view = registry.get("chestor.autocode:autocode_view")
            test.eq(nav.meta.path, "/autocode")
            test.eq(nav.meta.render, "component")
            test.eq(nav.meta.component_tag, view.meta.tag_name)
            test.eq(view.meta.type, "view.component")
            test.eq(view.meta.props.properties.route.type, "string")
            test.eq(view.meta.props.properties.route.default, "")
            for _, id in ipairs({"driver_account_view", "task_config_view"}) do
                local schema = registry.get("chestor.autocode:" .. id).meta.props
                test.eq(schema.type, "object")
                test.eq(schema.properties.config.type, "object")
                test.not_nil(schema.properties.config.default)
            end
        end)

        test.it("binds Docker execution only to a host-owned executor", function()
            test.is_nil(registry.get("chestor.autocode:docker"))
            test.is_nil(registry.get("chestor.autocode:docker_path"))
            local config = registry.get("chestor.autocode:runtime_config")
            test.eq(config.meta.docker_executor, "app:docker")
        end)
        test.it("validates editable duration settings at write time", function()
            for _, key in ipairs({"run_timeout", "run_retention", "account_cooldown", "build_cache_retention"}) do
                local definition = registry.get("chestor.autocode:setting." .. key)
                test.eq(definition.data.validate_func, "chestor.autocode:validate_duration")
            end
        end)
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

    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

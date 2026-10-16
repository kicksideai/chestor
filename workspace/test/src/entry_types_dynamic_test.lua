local test = require("test")
local registry = require("registry")
local entry_types = require("entry_types")
local http_errors = require("http_errors")
local funcs = require("funcs")

local BINDING_ID = "app:late_workspace_kind"
local CLASS = "late_workspace_kind"
local LIST_TOOL = "chestor.workspace.traits:list_entry_types_tool"

local function find_class(types: { any }, class: string): any?
    for _, item in ipairs(types or {}) do
        if item.value == class then return item end
    end
    return nil
end

local function remove_binding()
    local existing = registry.get(BINDING_ID)
    if not existing then return end

    local snapshot, snapshot_err = registry.snapshot()
    test.is_nil(snapshot_err)
    test.not_nil(snapshot)
    local changes = snapshot:changes()
    changes:delete(BINDING_ID)
    local _, apply_err = changes:apply()
    test.is_nil(apply_err)
end

local function define_tests()
    test.describe("workspace kind discovery", function()
        for _, class in ipairs({ "file", "link" }) do
            test.it("rejects user creation of " .. class .. " with INVALID", function()
                local err = entry_types.require_creatable(class)
                test.not_nil(err)
                test.eq(http_errors.classify(err), 400)
                test.is_true(tostring(err):find("kind is not creatable: " .. class, 1, true) ~= nil)
            end)
        end
        test.it("ListWorkspaceEntryTypes pages compact kind summaries", function()
            local expected, expected_err = entry_types.list({ creatable_only = true })
            test.is_nil(expected_err)
            local cursor = nil
            local seen = {}
            local count = 0
            repeat
                local out, err = funcs.call(LIST_TOOL, { limit = 1, cursor = cursor })
                test.is_nil(err)
                test.is_true((out :: any).success)
                test.eq(#(out :: any).types, 1)
                local row = (out :: any).types[1]
                test.is_nil(row.description)
                test.is_nil(row.create)
                test.is_nil(row.manage)
                test.is_nil(seen[row.value])
                seen[row.value] = true
                count = count + 1
                cursor = (out :: any).next_cursor
            until cursor == nil
            test.eq(count, #expected)
        end)

        test.it("observes bindings added after the first list without a process restart", function()
            -- Keep the test repeatable if an earlier interrupted run left the fixture behind.
            remove_binding()

            local before, before_err = entry_types.list()
            test.is_nil(before_err)
            test.is_nil(find_class(before, CLASS))

            local snapshot, snapshot_err = registry.snapshot()
            test.is_nil(snapshot_err)
            test.not_nil(snapshot)
            local changes = snapshot:changes()
            changes:create({
                id = BINDING_ID,
                kind = "contract.binding",
                meta = {
                    class = CLASS,
                    title = "Late Workspace Kind",
                    component = { create = {} },
                },
                data = {
                    -- Use a real harness contract so changeset application exercises the
                    -- same validated contract.binding path as an installed module.
                    contracts = {
                        {
                            contract = "kickside.contract:scope_resolver",
                            methods = { resolve = "chestor.test_support:scope_resolver" },
                        },
                    },
                },
            })
            local _, apply_err = changes:apply()
            test.is_nil(apply_err)

            -- Changeset application advances the registry version synchronously. A second
            -- discovery call must see that version immediately: no polling, sleeps, or
            -- library/process reloads are involved.
            local after, after_err = entry_types.list()
            local discovered = after_err == nil and find_class(after, CLASS) or nil

            remove_binding()
            test.is_nil(after_err)
            test.not_nil(discovered)
            test.is_true(discovered.creatable)
            test.is_true(discovered.create.view == "wc-entry-create")
            test.is_true(discovered.create.surface == "popup")
        end)

        test.it("refuses generic creation of a kind that owns its create flow", function()
            remove_binding()

            local snapshot, snapshot_err = registry.snapshot()
            test.is_nil(snapshot_err)
            test.not_nil(snapshot)
            local changes = snapshot:changes()
            changes:create({
                id = BINDING_ID,
                kind = "contract.binding",
                meta = {
                    class = CLASS,
                    title = "Late Workspace Kind",
                    -- A dedicated create view means the module bootstraps its own
                    -- state on create; the generic path would mint a bare component.
                    component = { create = { view = "app:late_kind_create_view" } },
                },
                data = {
                    contracts = {
                        {
                            contract = "kickside.contract:scope_resolver",
                            methods = { resolve = "chestor.test_support:scope_resolver" },
                        },
                    },
                },
            })
            local _, apply_err = changes:apply()
            test.is_nil(apply_err)

            local gate_err = entry_types.require_creatable(CLASS)

            remove_binding()
            test.not_nil(gate_err)
            test.eq(http_errors.classify(gate_err), 400)
            test.is_true(tostring(gate_err):find("owns its creation flow", 1, true) ~= nil)
        end)

        test.it("permits generic creation of a kind on the generic create dialog", function()
            remove_binding()

            local snapshot, snapshot_err = registry.snapshot()
            test.is_nil(snapshot_err)
            test.not_nil(snapshot)
            local changes = snapshot:changes()
            changes:create({
                id = BINDING_ID,
                kind = "contract.binding",
                meta = {
                    class = CLASS,
                    title = "Late Workspace Kind",
                    component = { create = {} },
                },
                data = {
                    contracts = {
                        {
                            contract = "kickside.contract:scope_resolver",
                            methods = { resolve = "chestor.test_support:scope_resolver" },
                        },
                    },
                },
            })
            local _, apply_err = changes:apply()
            test.is_nil(apply_err)

            local gate_err = entry_types.require_creatable(CLASS)

            remove_binding()
            test.is_nil(gate_err)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }

local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")
local json = require("json")
local contract = require("contract")

local PROBE = "app:workspace_probe"
local GET_TOOL = "chestor.workspace.traits:get_entry_tool"
local LIST_TOOL = "chestor.workspace.traits:list_entries_tool"
local COMPONENT_SERVICE = "kickside.component:component_service"
local GROUPS = { "workspace_test" }

local function uuid(): string
    local id, err = crypto.random.uuid()
    test.is_nil(err)
    return id
end

local function executor(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = GROUPS })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local function call(user_id: string, target: string, input: any): any
    local value, err = executor(user_id):call(target, input)
    test.is_nil(err)
    test.not_nil(value)
    return value
end

local function create(user_id: string, name: string, parent_id: string?): any
    local result = call(user_id, PROBE, {
        op = "create",
        input = { type = "folder", name = name, parent_id = parent_id },
    })
    test.is_true((result :: any).ok, tostring((result :: any).err))
    return (result :: any).entry
end

local function create_non_tree(user_id: string, parent_id: string): any
    local service, service_err = contract.get(COMPONENT_SERVICE)
    test.is_nil(service_err)
    test.not_nil(service)
    local actor: any = security.new_actor(user_id, { security_groups = GROUPS })
    local scope: any = security.named_scope("wippy.security:process")
    local opened, open_err = service:with_actor(actor):with_scope(scope):open()
    test.is_nil(open_err)
    test.not_nil(opened)
    local created, create_err = opened:register({
        impl_id = "kickside.core:thread",
        parent_id = parent_id,
        meta = { title = "Internal thread" },
    })
    test.is_nil(create_err)
    test.not_nil(created)
    test.is_true((created :: any).success, tostring((created :: any).error))
    return created
end

local function define_tests()
    test.describe("workspace trait native bounds", function()
        test.it("GetWorkspaceEntry returns the whole entry and ListWorkspaceEntries pages it with a cursor", function()
            local user_id = "workspace-trait-bounds-" .. uuid()
            local parent = create(user_id, "Trait bounds", nil)
            local fitting = create(user_id, "Fitting entry", tostring(parent.id))
            local oversized_name = string.rep("あ", 1800)
            local oversized = create(user_id, oversized_name, tostring(parent.id))

            local fitting_read = call(user_id, GET_TOOL, { id = tostring(fitting.id) })
            test.is_true((fitting_read :: any).success)
            test.eq((fitting_read :: any).entry.id, fitting.id)
            test.eq((fitting_read :: any).entry.meta.title, "Fitting entry")
            test.eq((fitting_read :: any).entry.meta.status, "active")

            local whole_read = call(user_id, GET_TOOL, { id = tostring(oversized.id) })
            test.is_true((whole_read :: any).success)
            test.eq((whole_read :: any).entry.id, oversized.id)
            test.eq((whole_read :: any).entry.meta.title, oversized_name)
            test.is_nil((whole_read :: any).entry.truncated)
            test.is_nil((whole_read :: any).entry.page)

            local first_list = call(user_id, LIST_TOOL, { parent_id = tostring(parent.id), limit = 1 })
            test.is_true((first_list :: any).success)
            test.eq(#(first_list :: any).entries, 1)
            test.eq((first_list :: any).entries[1].id, fitting.id)
            test.eq((first_list :: any).entries[1].name, "Fitting entry")
            test.is_nil((first_list :: any).entries[1].meta)
            test.not_nil((first_list :: any).next_cursor)

            local second_list = call(user_id, LIST_TOOL, { parent_id = tostring(parent.id), limit = 1, cursor = (first_list :: any).next_cursor })
            test.is_true((second_list :: any).success)
            test.eq(#(second_list :: any).entries, 1)
            test.eq((second_list :: any).entries[1].id, oversized.id)
            test.eq((second_list :: any).entries[1].name, oversized_name)
            test.is_nil((second_list :: any).entries[1].meta)
            test.is_nil((second_list :: any).entries[1].truncated)
            test.is_nil((second_list :: any).next_cursor)

            local bad = call(user_id, LIST_TOOL, { parent_id = tostring(parent.id), cursor = "garbage" })
            test.is_false((bad :: any).success)
        end)

        test.it("continues through filtered component rows without repeats or omissions", function()
            local user_id = "workspace-trait-cursor-" .. uuid()
            local parent = create(user_id, "Cursor parent", nil)
            create_non_tree(user_id, tostring(parent.id))
            local first = create(user_id, "First visible", tostring(parent.id))
            create_non_tree(user_id, tostring(parent.id))
            local second = create(user_id, "Second visible", tostring(parent.id))

            local seen = {}
            local cursor = nil
            while true do
                local page = call(user_id, LIST_TOOL, {
                    parent_id = tostring(parent.id), limit = 1, cursor = cursor,
                })
                test.is_true((page :: any).success, tostring((page :: any).error))
                test.eq(#(page :: any).entries, 1)
                local id = tostring((page :: any).entries[1].id)
                test.is_nil(seen[id], "native cursor repeats a visible workspace entry")
                seen[id] = true
                if not (page :: any).next_cursor then break end
                cursor = (page :: any).next_cursor
            end
            test.is_true(seen[tostring(first.id)])
            test.is_true(seen[tostring(second.id)])
            local count = 0
            for _, _ in pairs(seen) do count = count + 1 end
            test.eq(count, 2)
        end)
    end)
end

return test.run_cases(define_tests)

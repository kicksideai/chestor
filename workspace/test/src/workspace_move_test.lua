local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")

local PROBE = "app:workspace_probe"

local function uuid(): string
    local id, err = crypto.random.uuid()
    test.is_nil(err)
    return id
end

local function executor(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "workspace_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local function call_probe(user_id: string, op: string, input: any): any
    local result, err = executor(user_id):call(PROBE, { op = op, input = input })
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function create_entry(user_id: string, typ: string, name: string, parent_id: string?): any
    local res = call_probe(user_id, "create", { type = typ, name = name, parent_id = parent_id })
    test.is_true(res.ok, tostring(res.err))
    return res.entry
end

local function define_tests()
    test.describe("workspace move placement", function()
        test.it("returns a typed denial when another actor updates a private folder", function()
            local owner = "owner-" .. uuid()
            local folder = create_entry(owner, "folder", "private")
            local result = call_probe("member-" .. uuid(), "update", { id = folder.id, name = "changed" })
            test.is_false(result.ok)
            test.is_true(result.denied, tostring(result.err))
            test.eq(call_probe(owner, "get", { id = folder.id }).entry.name, "private")
        end)

        test.it("moves an entry into a folder and back to root", function()
            local user = "move-" .. uuid() .. "@local.test"
            local folder = create_entry(user, "folder", "dest")
            local entry = create_entry(user, "folder", "wanderer")

            local moved = call_probe(user, "move", { id = entry.id, parent_id = folder.id })
            test.is_true(moved.ok, tostring(moved.err))
            test.eq(moved.entry.parent_id, folder.id)

            -- Root is the explicit empty-string form on the wire: the entry must
            -- actually leave the folder, not silently keep its placement.
            local rooted = call_probe(user, "move", { id = entry.id, parent_id = "" })
            test.is_true(rooted.ok, tostring(rooted.err))
            test.is_nil(rooted.entry.parent_id)

            local fetched = call_probe(user, "get", { id = entry.id })
            test.is_true(fetched.ok, tostring(fetched.err))
            test.is_nil(fetched.entry.parent_id)
        end)

        test.it("keeps placement when parent_id is omitted", function()
            local user = "move-" .. uuid() .. "@local.test"
            local folder = create_entry(user, "folder", "dest")
            local entry = create_entry(user, "folder", "stayer", folder.id)

            local res = call_probe(user, "move", { id = entry.id })
            test.is_true(res.ok, tostring(res.err))
            test.eq(res.entry.parent_id, folder.id)
        end)
    end)
end

return test.run_cases(define_tests)

-- Schema trait tools: input validation. The tools are invoked exactly as the
-- agent runtime invokes them (funcs.call on the registered tool). A missing
-- entry_id and an empty commands array are rejected before any thread write.

local test = require("test")
local funcs = require("funcs")

local GET = "chestor.db_schema.traits:get_schema_tool"
local EDIT = "chestor.db_schema.traits:edit_schema_tool"

local function define_tests()
    test.describe("DB Schema Traits", function()
        test.it("GetDatabaseSchema rejects a missing entry_id", function()
            local out = funcs.call(GET, {})
            test.is_false((out :: any).success)
            test.not_nil((out :: any).error)
        end)

        test.it("EditDatabaseSchema rejects a missing entry_id", function()
            local out = funcs.call(EDIT, { commands = { { type = "chestor.db_schema.events:table.added", body = { id = "t1", name = "t" } } } })
            test.is_false((out :: any).success)
        end)

        test.it("EditDatabaseSchema rejects an empty commands array", function()
            local out = funcs.call(EDIT, { entry_id = "some-id", commands = {} })
            test.is_false((out :: any).success)
            test.not_nil((out :: any).error)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

local funcs = require("funcs")
local test = require("test")
local function define()
    test.describe("Harness scope group", function()
        test.it("retains the module fixture group through the shared resolver", function()
            local value, err = funcs.new():call("chestor.test_support:scope_resolver", { principal = { kind = "user", id = "fixture-user" } })
            test.is_nil(err)
            test.eq(#value.groups, 1)
            test.eq(value.groups[1], "workspace_test")
        end)
    end)
end
return { run = test.run_cases(define) }

local test = require("test")
local worker = require("worker")

local function define_tests()
    test.describe("Projection worker admission", function()
        test.it("admits the read model worker through current core", function()
            local parsed, parse_err = worker.parse("func://chestor.roadmap:projection_worker", true)
            test.is_nil(parse_err)
            test.not_nil(parsed)
            local admitted, err = worker.validate(assert(parsed), false)
            test.is_nil(err, tostring(err))
            test.not_nil(admitted)
        end)
    end)
end

return { run = test.run_cases(define_tests) }

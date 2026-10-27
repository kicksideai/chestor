-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local stubs = require("stubs")
local function cases()
    test.describe("autocode teardown failures", function()
        test.it("releases generation tags through component teardown", function()
            local state = stubs.reset()
            state.generation_tags = {"chestor-autocode/image:old"}
            local result = require("teardown").delete_image()
            test.is_true(result.success)
            test.eq(state.commands[#state.commands], "image rm --force chestor-autocode/image:old")
        end)
        test.it("preserves native teardown errors", function()
            local state = stubs.reset()
            state.teardown_error = errors.new({kind = errors.UNAVAILABLE, message = "drain unavailable", retryable = true, details = {code = "drain_failed"}})
            local result = require("teardown").delete_image()
            test.is_false(result.success)
            test.is_true(errors.is(result.error, errors.UNAVAILABLE))
            test.eq(result.error:details().code, "drain_failed")
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

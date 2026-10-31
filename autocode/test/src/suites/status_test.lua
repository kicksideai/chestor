-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local function cases()
    test.describe("autocode component status", function()
        test.it("propagates lookup failures", function()
            local state = stubs.reset()
            state.query_error = errors.new({kind = errors.UNAVAILABLE, message = "component unavailable", retryable = true})
            local result, err = subject.status()
            test.is_nil(result)
            test.is_true(errors.is(err, errors.UNAVAILABLE))
            test.eq(err:retryable(), true)
        end)
        test.it("reads public metadata under the caller", function()
            local state = stubs.reset()
            state.component_id = "account-1"
            state.rows = {{meta = {status = "preparing"}}}
            local result, err = subject.status()
            test.is_nil(err)
            test.eq(result.description, "preparing")
            test.eq(state.query_options.component_ids[1], "account-1")
            state.rows = {{meta = {}}}
            test.eq(subject.status().description, "ready")
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local time = require("time")
local function cases()
    test.describe("autocode retention durations", function()
        test.it("subtracts a parsed duration with an explicit positive sign", function()
            local state = stubs.reset()
            state.retention = "+1h"
            local started = time.now():unix()
            local result = subject.run()
            test.is_true(result.success)
            local cutoff = time.parse(time.RFC3339, state.before)
            test.is_true(math.abs(cutoff:unix() - (started - 3600)) < 3)
        end)
        test.it("reports the next queue expiry and refuses invalid queue windows", function()
            local state = stubs.reset()
            state.next_queued = time.now():utc():format_rfc3339()
            local result = subject.run()
            test.is_true(result.success)
            local expected = time.parse(time.RFC3339, state.next_queued):unix() * 1000 + 86400000 + 1000
            test.eq(result.deadline_ms, expected)
            test.eq(state.queue_batch, 500)
            for _, value in ipairs({"0s", "-1h", "invalid"}) do
                state = stubs.reset(); state.queue_timeout = value
                test.is_false(subject.run().success)
                test.is_nil(state.queue_before)
            end
        end)
        test.it("rejects zero and negative retention before deleting runs", function()
            for _, value in ipairs({"0s", "-1h"}) do
                local state = stubs.reset()
                state.retention = value
                test.is_false(subject.run().success)
                test.is_nil(state.before)
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

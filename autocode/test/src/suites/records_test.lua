-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- chestor.autocode.runner:records folds reader steps into run events. The
-- answer of a finished run is its stored result, so the event log records
-- how the run ended without repeating the answer.
local test = require("test")
local records = require("records")

local function identity(text: string): string return text end

local function cases()
    test.describe("autocode run records", function()
        test.it("ends a succeeded run's log without repeating its answer", function()
            local answer = "the full answer " .. string.rep("x", 200)
            local events = records.terminal(records.new(identity), {outcome = "succeeded", answer = answer})
            test.eq(#events, 1)
            test.eq(events[1].kind, "system")
            test.eq(events[1].text, "succeeded")
            test.is_nil(events[1].text:find(answer, 1, true))
        end)

        test.it("ends a failed run's log with the fault", function()
            local events = records.terminal(records.new(identity),
                {outcome = "failed", error = {code = "authentication_failed", message = "Invalid API key", retryable = false}})
            test.eq(#events, 1)
            test.eq(events[1].kind, "error")
            test.eq(events[1].text, "failed: Invalid API key")
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

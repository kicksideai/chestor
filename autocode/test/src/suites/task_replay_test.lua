-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local function cases()
    test.describe("autocode submission replay", function()
        test.it("reaches the durable replay before inspecting the current driver or its defaults", function()
            local state = stubs.reset()
            state.missing_driver = true
            local result, err = subject.submit_task({agent = "claude", image_id = "image", prompt = "task", idempotency_key = "key"})
            test.is_nil(err, tostring(err))
            test.eq(result.run_id, "existing-run")
            test.is_nil(state.submitted.unattended)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

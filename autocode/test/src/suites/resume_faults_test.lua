-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local stubs = require("stubs")
local json = require("json")
local resume = require("resume_subject")
local function cases()
    test.describe("autocode resume failures", function()
        test.it("returns a native resume failure and acknowledges only successful delivery", function()
            local state = stubs.reset()
            state.run.status, state.run.flow = "succeeded", {dataflow_id = "flow", signal_id = "signal"}
            state.resume_error = true
            local result, err = resume.run({payload = {run_id = "run"}})
            test.is_nil(result)
            test.is_true(errors.is(err, errors.UNAVAILABLE))
            test.is_nil(state.delivered)
            state.resume_error = false
            local delivered, retry_err = resume.run({payload = {run_id = "run"}})
            test.is_nil(retry_err)
            test.not_nil(delivered)
            test.is_true(state.delivered)
            test.is_true(state.resume_actor_bound)
            test.is_true(state.resume_scope_bound)
        end)
        test.it("delivers empty usage as a JSON object in the workflow resume payload", function()
            local state = stubs.reset()
            state.run.status, state.run.flow, state.run.usage = "cancelled", {dataflow_id = "flow", signal_id = "signal"}, {}
            local delivered, err = resume.run({payload = {run_id = "run"}})
            test.is_nil(err)
            test.not_nil(delivered)
            local encoded = json.encode(state.resume_args.payload.usage)
            test.eq(encoded, "{}")
        end)
        test.it("preserves the resume failure kind, retryability and details", function()
            local state = stubs.reset()
            state.run.status, state.run.flow = "succeeded", {dataflow_id = "flow", signal_id = "signal"}
            state.resume_error, state.resume_kind = true, errors.CONFLICT
            local result, err = resume.run({payload = {run_id = "run"}})
            test.is_nil(result)
            test.is_true(errors.is(err, errors.CONFLICT))
            test.eq(err:retryable(), true)
            test.eq(err:details().code, "signal.failure")
            test.is_nil(state.delivered)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local function cases()
    test.describe("autocode maintenance", function()
        test.it("uses the effective cache retention duration in Docker's filter", function()
            local state = stubs.reset()
            state.cache_retention = "+48h"
            test.not_nil(subject.prune())
            test.not_nil(table.concat(state.commands, "\n"):find("until=48h", 1, true))
        end)
        test.it("refuses invalid cache retention before issuing Docker commands", function()
            for _, value in ipairs({"0s", "-1h", "broken"}) do
                local state = stubs.reset()
                state.cache_retention = value
                local result, err = subject.prune()
                test.is_nil(result)
                test.is_true(errors.is(err, errors.INVALID))
                test.eq(#state.commands, 0)
            end
        end)
        test.it("removes settled and retained-away labelled run containers", function()
            local state = stubs.reset()
            state.containers = {"box-queued queued", "box-running running", "box-success succeeded", "box-failed failed", "box-cancelled cancelled", "box-unknown unknown"}
            state.runs = {queued = {status = "queued"}, running = {status = "running"}, succeeded = {status = "succeeded"}, failed = {status = "failed"}, cancelled = {status = "cancelled"}}
            test.not_nil(subject.prune())
            test.is_nil(state.blanket_prune)
            test.eq(state.removed, 4)
            test.eq(table.concat(state.removed_names, ","), "box-success,box-failed,box-cancelled,box-unknown")
        end)
        test.it("removes probes only after their build generation settles or disappears", function()
            local state = stubs.reset()
            state.probes = {"live image generation", "settled other old-generation"}
            test.not_nil(subject.prune())
            test.eq(table.concat(state.removed_names or {}, ","), "settled")
        end)
        test.it("removes probes when Jobs settles an interrupted build without a finish timestamp", function()
            local state = stubs.reset()
            state.probes = {"interrupted image generation"}
            state.build.job_live = false
            test.not_nil(subject.prune())
            test.eq(table.concat(state.removed_names or {}, ","), "interrupted")
        end)
        test.it("refuses container removal when the run state cannot be read", function()
            local state = stubs.reset()
            state.containers, state.read_error = {"box-running running"}, true
            local result, err = subject.prune()
            test.is_nil(result)
            test.not_nil(err)
            test.eq(state.removed, 0)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

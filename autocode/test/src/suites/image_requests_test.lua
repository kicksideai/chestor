-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local function cases()
    test.describe("autocode image requests", function()
        test.it("normalizes HOME before excluding the workspace mount and root", function()
            stubs.reset()
            for _, home in ipairs({"/", "/workspace", "/workspace/child", "//workspace//child", "/opt/../workspace", "/workspace/../"}) do
                local value, err = subject.decode({home = home})
                test.is_nil(value, home)
                test.is_true(errors.is(err, errors.INVALID), home)
            end
            local value = subject.decode({home = "/opt//agent/./work/.."})
            test.eq(value.home, "/opt/agent")
        end)
        test.it("commits one generation in the build request and job and preserves success after a wake error", function()
            local state = stubs.reset()
            test.is_nil(subject.request_build("image", "initial"))
            test.not_nil(state.requested_build.build_id)
            test.eq(state.requested_build.image_id, "image")
        end)
        test.it("replaces an unfinished build only when its job is no longer live", function()
            for _, status in ipairs({"pending", "running", "dead", "done", "cancelled", "missing"}) do
                local state = stubs.reset()
                state.build.job_id = "build-job"
                state.job = status ~= "missing" and {status = status} or nil
                local err = subject.request_build("image", "refresh")
                if status == "pending" or status == "running" then
                    test.is_true(errors.is(err, errors.CONFLICT))
                    test.is_nil(state.requested_build)
                else
                    test.is_nil(err)
                    test.eq(state.requested_build.replaces, "generation")
                end
                test.eq(state.checked_job, "build-job")
            end
        end)
        test.it("preserves the build slot when Jobs cannot answer", function()
            local state = stubs.reset()
            state.build.job_id, state.job_error = "build-job", true
            test.not_nil(subject.request_build("image", "refresh"))
            test.is_nil(state.requested_build)
        end)
        test.it("uses catalog settings as the decoder's defaults", function()
            stubs.reset()
            local defaults, err = subject.defaults()
            test.is_nil(err)
            local decoded, decode_err = subject.decode({})
            test.is_nil(decode_err)
            for key, value in pairs(defaults.settings) do
                if type(value) == "table" then test.eq(#decoded.settings[key], #value)
                else test.eq(decoded.settings[key], value) end
            end
        end)
        test.it("fences upgraded unfinished builds without a recorded job ID", function()
            local state = stubs.reset()
            state.build.job_id = ""
            test.is_true(errors.is(subject.request_build("image", "refresh"), errors.CONFLICT))
            test.is_nil(state.requested_build)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

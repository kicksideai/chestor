-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local function cases()
    test.describe("autocode image requests", function()
        test.it("commits one generation in the build request and job and preserves success after a wake error", function()
            local state = stubs.reset()
            test.is_nil(subject.request_build("image", "initial"))
            test.not_nil(state.requested_build.build_id)
            test.eq(state.enqueued.payload.build_id, state.requested_build.build_id)
            test.eq(state.enqueued.key, "build:" .. state.requested_build.build_id)
            test.eq(state.requested_build.image_id, "image")
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
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

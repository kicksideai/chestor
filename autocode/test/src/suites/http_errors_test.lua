-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local web = require("web")
local function cases()
    test.describe("autocode HTTP errors", function()
        test.it("maps typed failures to HTTP statuses without losing error metadata", function()
            for _, pair in ipairs({{errors.INVALID, 400}, {errors.NOT_FOUND, 404}, {errors.CONFLICT, 409},
                {errors.PERMISSION_DENIED, 403}, {errors.UNAVAILABLE, 503}, {errors.TIMEOUT, 504},
                {errors.RATE_LIMITED, 429}, {errors.INTERNAL, 500}}) do
                local seen = {}
                local response = {set_status = function(_, status) seen.status = status end,
                    write_json = function(_, body) seen.body = body end}
                web.fail_with(response, errors.new({kind = pair[1], message = "dependency failed", retryable = true,
                    details = {code = "autocode.test_failure"}}))
                test.eq(seen.status, pair[2], pair[1])
                test.eq(seen.body.success, false)
                test.eq(seen.body.kind, pair[1])
                test.eq(seen.body.retryable, true)
                test.eq(seen.body.details.code, "autocode.test_failure")
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

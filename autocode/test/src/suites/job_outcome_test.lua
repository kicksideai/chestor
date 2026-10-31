-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local outcome = require("outcome")
local function cases()
    test.describe("autocode job error transport", function()
        test.it("preserves the decoder's native error kind for malformed data", function()
            local err = outcome.native({bad = true})
            test.is_true(errors.is(err, errors.INVALID), err:kind())
            test.not_nil(err:message():find("invalid fields", 1, true), tostring(err))
        end)
        test.it("preserves native and serialized error metadata", function()
            local native = errors.new({kind = errors.CONFLICT, message = "conflict", retryable = true, details = {code = "test.conflict"}})
            for _, value in ipairs({native, {kind = errors.CONFLICT, message = "conflict", retryable = true, details = {code = "test.conflict"}}}) do
                local err = outcome.native(value)
                test.is_true(errors.is(err, errors.CONFLICT))
                test.eq(err:retryable(), true)
                test.eq(err:details().code, "test.conflict")
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

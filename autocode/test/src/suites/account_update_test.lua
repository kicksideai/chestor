-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local function setup()
    local state = stubs.reset()
    state.account = {id = "account", meta = {agent = "claude", credential_kind = "file:.login.json"}}
    state.credential = '{"token":"original"}'
    return state
end
local function cases()
    test.describe("autocode account update failures", function()
        test.it("keeps the original cooldown when credential replacement is rejected", function()
            local state = setup()
            state.cooldown, state.replace_conflict = "tomorrow", true
            local result, err = subject.update_account({id = "account", secret = '{"token":"replacement"}'})
            test.is_nil(result)
            test.is_true(errors.is(err, errors.CONFLICT), tostring(err))
            test.eq(state.credential, '{"token":"original"}')
            test.eq(state.cooldown, "tomorrow")
            test.is_nil(state.clears)
        end)
        test.it("returns explicit partial success after replacement when cooldown clearing fails", function()
            local state = setup()
            state.cooldown = "tomorrow"
            state.on_replace = function()
                test.eq(state.cooldown, "tomorrow")
                state.clear_error = errors.new({kind = errors.UNAVAILABLE, message = "health unavailable", retryable = true, details = {code = "health_down"}})
                state.credential = '{"token":"refreshed"}'
            end
            local result, err = subject.update_account({id = "account", secret = '{"token":"replacement"}'})
            test.is_nil(err, tostring(err))
            test.eq(result.id, "account")
            test.eq(result.health_error.kind, errors.UNAVAILABLE)
            test.eq(result.health_error.details.code, "health_down")
            test.eq(state.credential, '{"token":"refreshed"}')
            test.eq(state.cooldown, "tomorrow")
            test.eq(state.clears, 1)
        end)
        test.it("reports account notification failure as partial success without inviting a credential retry", function()
            local state = setup()
            state.notify_error = errors.new({kind = errors.UNAVAILABLE, message = "notify unavailable"})
            local result, err = subject.update_account({id = "account", secret = '{"token":"replacement"}'})
            test.is_nil(err, tostring(err))
            test.eq(result.id, "account")
            test.eq(result.health_error.kind, errors.UNAVAILABLE)
            test.eq(state.credential, '{"token":"replacement"}')
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

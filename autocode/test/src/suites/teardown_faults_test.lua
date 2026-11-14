-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local stubs = require("stubs")
local function cases()
    test.describe("autocode teardown failures", function()
        test.it("retains the approved removal target through Docker failure and retries it", function()
            local state = stubs.reset()
            state.build.approved_recipe = {ref = "approved:retry"}
            state.docker_steps = {{err = errors.new({kind = errors.UNAVAILABLE, message = "Docker unavailable"})}}
            local first = require("teardown").delete_image({options = {remove = true}})
            test.is_false(first.success); test.not_nil(state.build)
            test.eq(state.build.approved_recipe.ref, "approved:retry")
            state.docker_steps = {{}}
            local retry = require("teardown").delete_image({options = {remove = true}})
            test.is_true(retry.success); test.is_nil(state.build)
            test.eq(state.commands[#state.commands], "image rm approved:retry")
            test.is_true(require("teardown").delete_image({options = {remove = true}}).success)
        end)
        test.it("retries removal after Docker succeeds but the build deletion fails", function()
            local state = stubs.reset()
            state.build.approved_recipe = {ref = "approved:retry"}
            state.delete_build_error = errors.new({kind = errors.UNAVAILABLE, message = "delete failed"})
            state.docker_steps = {{}}
            local first = require("teardown").delete_image({options = {remove = true}})
            test.is_false(first.success); test.not_nil(state.build)
            test.eq(state.commands[#state.commands], "image rm approved:retry")
            state.delete_build_error = nil
            -- Docker reports failure for the already absent reference, then confirms absence.
            state.docker_steps = {{code = 1}, {lines = {}}}
            local retry = require("teardown").delete_image({options = {remove = true}})
            test.is_true(retry.success); test.is_nil(state.build)
        end)
        test.it("releases generation tags through component teardown", function()
            local state = stubs.reset()
            state.build = nil
            state.generation_tags = {"chestor-autocode/image:old"}
            local result = require("teardown").delete_image()
            test.is_true(result.success)
            test.eq(state.commands[#state.commands], "image rm --force chestor-autocode/image:old")
        end)
        test.it("ignores a foreign remove_ref at the component teardown boundary", function()
            local state = stubs.reset()
            local result = require("teardown").delete_image({options = {remove_ref = "foreign:latest"}})
            test.is_true(result.success)
            for _, command in ipairs(state.commands) do
                test.is_nil(command:find("foreign:latest", 1, true), command)
            end
        end)
        test.it("preserves native teardown errors", function()
            local state = stubs.reset()
            state.teardown_error = errors.new({kind = errors.UNAVAILABLE, message = "drain unavailable", retryable = true, details = {code = "drain_failed"}})
            local result = require("teardown").delete_image()
            test.is_false(result.success)
            test.is_true(errors.is(result.error, errors.UNAVAILABLE))
            test.eq(result.error:details().code, "drain_failed")
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

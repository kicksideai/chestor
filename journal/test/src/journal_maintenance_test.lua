-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local security = require("security")

local TOOL = "chestor.journal.traits:migrate_legacy_tool"

local function call(input)
    local actor = security.new_actor("journal-maintenance-test", { security_groups = { "journal_test" } })
    local scope = security.named_scope("wippy.security:process")
    local result, err = funcs.new():with_actor(actor):with_scope(scope):call(TOOL, input)
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function define_tests()
    test.describe("journal maintenance empty inputs", function()
        test.it("keeps reembed without journal ids as a successful no-op", function()
            for _, input in ipairs({ { action = "reembed" }, { action = "reembed", journal_ids = {} } }) do
                local result = call(input)
                test.is_true(result.success)
                test.eq(result.fired, 0)
                test.eq(#result.report, 0)
            end
        end)

        test.it("retires reconcile after Core owns projection refresh and catch-up", function()
            for _, input in ipairs({ { action = "reconcile" }, { action = "reconcile", journal_ids = {} } }) do
                local result = call(input)
                test.is_false(result.success)
                test.eq(result.error, "action must be reembed")
            end
        end)
    end)
end

return { run = test.run_cases(define_tests) }

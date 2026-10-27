-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local json = require("json")
local function cases()
    test.describe("autocode submission replay", function()
        test.it("discovers driver icons only from driver bindings", function()
            local state = stubs.reset()
            state.drivers = {{id = "claude", title = "Claude", credentials = {files = {}, variables = {}, subscriptions = {}},
                endpoints = {}, capabilities = {}, options = {}}}
            local result, err = subject.list_agents({})
            test.is_nil(err)
            test.eq(result.agents[1].icon, "tabler:terminal-2")
            test.eq(state.discovery_filter[".kind"], "contract.binding")
        end)
        test.it("keeps empty driver object metadata and JSON defaults as objects", function()
            local state = stubs.reset()
            state.drivers = {{id = "claude", title = "Claude", credentials = {files = {}, variables = {}, subscriptions = {}},
                endpoints = {}, capabilities = {}, unattended = {}, options = {
                    {name = "empty_schema", schema = {}},
                    {name = "object_default", schema = {type = "object"}, default = {}},
                    {name = "array_default", schema = {type = "array"}, default = {}},
                }}}
            local result, err = subject.list_agents({})
            test.is_nil(err)
            local driver = result.agents[1]
            test.eq(json.encode(driver.unattended), "{}")
            test.eq(json.encode(driver.options[1].schema), "{}")
            test.eq(json.encode(driver.options[2].default), "{}")
            test.eq(json.encode(driver.options[3].default), "[]")
        end)
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

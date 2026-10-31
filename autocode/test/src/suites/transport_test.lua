-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local transport = require("transport")
local function cases()
    test.describe("autocode transported preparation", function()
        test.it("clones the named branch through a quoted environment variable and named depth", function()
            local container = require("container")
            local launch = {executable = "agent", argv = {}, environment = {}, files = {}, readiness = "none"}
            local script, err = container.script({id = "env:KEY", variable = "KEY"}, "key", "/opt/agent", "/work", "https://example.com/repo", launch, 60, "release/v1")
            test.is_nil(err)
            test.eq(container.CLONE_DEPTH, 50)
            test.eq(script.env.AUTOCODE_REPO_REF, "release/v1")
            test.not_nil(script.env.AUTOCODE_SCRIPT:find('--branch "$AUTOCODE_REPO_REF"', 1, true))
        end)
        test.it("accepts execution fields and rejects mismatched identities and malformed launches", function()
            local run = {agent = "claude", account_id = "account", image_id = "image"}
            local value = require("stubs").preparation(run)
            local prepared, err = transport.prepared(value, run)
            test.is_nil(err)
            test.eq(prepared.agent, "claude")
            test.eq(prepared.kind.variable, "ANTHROPIC_API_KEY")
            test.is_nil(prepared.spec)
            value.account_id = "other"
            test.is_nil(transport.prepared(value, run))
            value.account_id = "account"
            value.launch.readiness = nil
            test.is_nil(transport.prepared(value, run))
        end)
        test.it("rejects malformed recipe settings instead of supplying zero defaults", function()
            local settings = {memory = "4g", cpus = "2", pids_limit = 1024, gpus = "", network = "none", extra_args = {}, allows = {}}
            local recipe = {ref = "image", home = "/home/agent", dockerfile = "", revision = 7, settings = settings}
            test.not_nil(transport.recipe(recipe))
            for _, invalid in ipairs({"1024", -1, 0.5, false}) do
                settings.pids_limit = invalid
                local value, err = transport.recipe(recipe)
                test.is_nil(value)
                test.is_true(errors.is(err, errors.INTERNAL))
            end
            settings.pids_limit = 1024
            settings.allows = {"network", 12}
            test.is_nil(transport.recipe(recipe))
            settings.allows = {}
            settings.extra_args = {unexpected = "--privileged"}
            test.is_nil(transport.recipe(recipe))
            settings.extra_args = {}
            settings.memory = nil
            test.is_nil(transport.recipe(recipe))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

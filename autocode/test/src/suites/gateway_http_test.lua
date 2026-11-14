-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local api = require("api")
local stub = require("stub")
local function cases()
    test.describe("autocode gateway HTTP errors", function()
        test.it("adds the redacted full native envelope to HTTP failures", function()
            stub.state = {logs = {}, error = errors.new({kind = errors.CONFLICT, message = "conflict fixture-bearer-value", retryable = false,
                details = {code = "fixture.conflict", revision = 9, password = "fixture-password-value"}})}
            api.mcp()
            test.eq(stub.state.body.kind, errors.CONFLICT); test.is_false(stub.state.body.retryable)
            test.eq(stub.state.body.details.code, "fixture.conflict"); test.eq(stub.state.body.details.revision, 9)
            test.eq(stub.state.body.details.password, "[redacted]")
        end)
        test.it("never labels non-credential native failures as bad bearer tokens", function()
            for _, kind in ipairs({errors.PERMISSION_DENIED, errors.UNAVAILABLE, errors.INTERNAL, errors.INVALID}) do
                stub.state = {error = errors.new({kind = kind, message = "dependency failed", details = {code = "dependency.failure"}})}
                api.mcp()
                test.eq(stub.state.status, 500, kind)
                test.eq(stub.state.body.code, "autocode.gateway_unavailable")
            end
        end)
        test.it("logs each unavailable response once with native fields and redacted secrets", function()
            for _, serve in ipairs({api.mcp, api.hook}) do
                stub.state = {logs = {}, error = errors.new({kind = errors.UNAVAILABLE,
                    message = 'dependency fixture-bearer-value failed {"password":"fixture-password-value"}',
                    details = {code = "dependency.failure"}})}
                serve()
                test.eq(stub.state.status, 500)
                test.eq(stub.state.body.code, "autocode.gateway_unavailable")
                test.eq(#stub.state.logs, 1)
                local entry = stub.state.logs[1]
                test.eq(entry.fields.kind, errors.UNAVAILABLE)
                test.eq(entry.fields.code, "dependency.failure")
                test.eq(entry.fields.run_id, "run")
                test.eq(entry.fields.tool_id, "fixture:tool")
                test.not_nil(entry.fields.message:find("dependency", 1, true))
                test.is_nil(entry.fields.message:find("fixture-bearer-value", 1, true))
                test.is_nil(entry.fields.message:find("fixture-password-value", 1, true))
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

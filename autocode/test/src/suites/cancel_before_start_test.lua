-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local docker = require("docker")
local uuid = require("uuid")

local function cases()
    test.describe("autocode cancellation before container start", function()
        local name
        test.after_each(function()
            if name then test.is_nil(docker.ensure_removed(name)); name = nil end
        end)
        test.it("prevents a created container from launching after cancellation", function()
            name = "autocode-cancel-" .. uuid.v7()
            local code, err = docker.run({"create", "--name", name, "node:22-bookworm-slim", "true"})
            test.is_nil(err, tostring(err))
            test.eq(code, 0)
            test.is_nil(docker.stop(name))
            local started, start_err = docker.run({"start", "-a", name})
            test.is_nil(start_err, tostring(start_err))
            test.neq(started, 0, "Cancelled container starts after the cancellation completes")
        end)
        test.it("keeps a stopped container available for credential readback", function()
            name = "autocode-cancel-" .. uuid.v7()
            local code, err = docker.run({"create", "--name", name, "node:22-bookworm-slim", "tail", "-f", "/dev/null"})
            test.is_nil(err, tostring(err)); test.eq(code, 0)
            local started, start_err = docker.run({"start", name})
            test.is_nil(start_err, tostring(start_err)); test.eq(started, 0)
            test.is_nil(docker.stop(name))
            local status = {}
            local inspected, inspect_err = docker.run({"inspect", "--format", "{{.State.Status}}", name},
                {on_line = function(line) status[#status + 1] = line end})
            test.is_nil(inspect_err, tostring(inspect_err)); test.eq(inspected, 0)
            test.eq(table.concat(status, ""), "exited")
        end)
    end)
end

return {run = test.run_cases(cases)}

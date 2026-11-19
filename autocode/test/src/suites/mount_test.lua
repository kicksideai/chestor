-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local docker = require("docker")
local io = require("io")
local stubs = require("stubs")
local function cases()
    test.describe("autocode nested mount isolation", function()
        local containers = {}
        test.after_each(function()
            for _, name in ipairs(containers) do test.is_nil(docker.ensure_removed(name)) end
            containers = {}
        end)
        local image_ref = "autocode-mount-test:" .. uuid.v7()
        test.before_all(function()
            local code, err = docker.run({"build", "-t", image_ref, "-"}, {stdin = "FROM debian:bookworm-slim\n"})
            test.is_nil(err); test.eq(code, 0)
        end)
        test.after_all(function() docker.run({"image", "rm", image_ref}) end)
        test.it("excludes nested host mounts from the run bind", function()
            local state = stubs.reset()
            local prepared = stubs.preparation(state.run)
            prepared.image.ref = image_ref
            prepared.workdir = "/workspace"
            prepared.workspace = {id = "mount-test", host_path = "/sys", writable = false}
            local box = io.build(uuid.v7(), prepared, {AUTOCODE_SCRIPT = "stat -f -c %T /workspace/fs/cgroup"})
            containers[#containers + 1] = box.name
            test.eq(docker.run(box.create, {isolation = box.isolation}), 0)
            test.eq(docker.run({"start", box.name}), 0)
            local lines = {}
            local code, err = docker.run({"exec", "-i", box.name, "sh", "-s"}, {stdin = box.stdin, on_line = function(line) lines[#lines + 1] = line end})
            test.is_nil(err); test.eq(code, 0)
            test.eq(table.concat(lines, ""), "sysfs")
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

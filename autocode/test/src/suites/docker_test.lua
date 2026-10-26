-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local docker = require("docker_subject")
local stubs = require("stubs")
local registry = require("registry")
local function tar(content, declared)
    local header = string.rep("\0", 512)
    header = header:sub(1, 124) .. string.format("%011o", declared or #content) .. "\0" .. header:sub(137, 156) .. "0" .. header:sub(158)
    return header .. content
end
local function cases()
    test.describe("autocode Docker bounds", function()
        test.it("keeps the executor wrapper matched by the Docker command policy", function()
            local state = stubs.reset()
            state.chunks = {}
            docker.run({"version"})
            local policy = registry.get("chestor.autocode.security:docker_commands")
            local matches = false
            for _, resource in ipairs(policy.data.policy.resources) do
                local prefix = resource:match("^(.-) %*$")
                if prefix and state.command:sub(1, #prefix + 1) == prefix .. " " then matches = true end
            end
            test.is_true(matches)
        end)
        test.it("drops a completed line that crosses the bound in its last read", function()
            local state = stubs.reset()
            state.chunks = {string.rep("x", docker.MAX_LINE_BYTES - 1), "xx\nshort\n"}
            local lines, overflow = {}, 0
            local code, err = docker.run({"logs"}, {on_line = function(line) lines[#lines + 1] = line end,
                on_overflow = function(bytes) overflow = bytes end})
            test.is_nil(err)
            test.eq(code, 0)
            test.eq(overflow, docker.MAX_LINE_BYTES + 1)
            test.eq(#lines, 1)
            test.eq(lines[1], "short")
        end)
        test.it("applies the credential limit to file bytes rather than tar bytes", function()
            local state = stubs.reset()
            state.chunks = {tar("12345678") .. string.rep("\0", 1024)}
            local content, err = docker.copy_file("container", "/login", 8)
            test.is_nil(err)
            test.eq(content, "12345678")
        end)
        test.it("rejects a truncated regular file and an oversized declaration", function()
            for _, declared in ipairs({9, 999999}) do
                local state = stubs.reset()
                state.chunks = {tar("1234", declared)}
                local content, err = docker.copy_file("container", "/login", 8)
                test.is_nil(content)
                test.not_nil(err)
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

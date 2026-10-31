-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local docker = require("docker_subject")
local stubs = require("stubs")
local time = require("time")
local registry = require("registry")
local function tar(content, declared)
    local header = string.rep("\0", 512)
    header = header:sub(1, 124) .. string.format("%011o", declared or #content) .. "\0" .. header:sub(137, 156) .. "0" .. header:sub(158)
    return header .. content
end
local function cases()
    test.describe("autocode Docker bounds", function()
        test.it("refuses an expired execution deadline before starting Docker", function()
            local state = stubs.reset()
            local code, err = docker.run({"version"}, {deadline = "2000-01-01T00:00:00Z"})
            test.is_nil(code)
            test.is_true(errors.is(err, errors.TIMEOUT))
            test.is_nil(state.command)
        end)
        test.it("interrupts silent output reads and releases the process at the deadline", function()
            local state = stubs.reset()
            state.read_delay = "60ms"
            local deadline = time.now():add("20ms"):utc():format("2006-01-02T15:04:05.999999999Z07:00")
            local code, err = docker.run({"logs"}, {deadline = deadline})
            test.is_nil(code)
            test.is_true(errors.is(err, errors.TIMEOUT))
            test.is_true(state.process_closed)
            test.is_true(state.executor_released)
        end)

        test.it("preserves native configuration error metadata", function()
            local state = stubs.reset()
            state.registry_error = errors.new({kind = errors.PERMISSION_DENIED, message = "denied", retryable = false, details = {code = "host.denied"}})
            local code, err = docker.run({"version"})
            test.is_nil(code)
            test.is_true(errors.is(err, errors.PERMISSION_DENIED))
            test.eq(err:details().code, "host.denied")
            test.eq(err:retryable(), false)
        end)
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
        test.it("uses the host-bound executor and Docker context", function()
            local state = stubs.reset()
            state.executor, state.docker_context, state.chunks = "host:docker", "build-host", {}
            local code, err = docker.run({"version"})
            test.is_nil(err)
            test.eq(code, 0)
            test.eq(state.executor_id, "host:docker")
            test.eq(state.command_env.DOCKER_CONTEXT, "build-host")
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
        test.it("accepts successful removal without another Docker command", function()
            local state = stubs.reset()
            state.exec_steps = {{code = 0}}
            test.is_nil(docker.ensure_removed("container"))
            test.eq(#state.exec_commands, 1)
        end)
        test.it("confirms exact-name absence after failed removal", function()
            local state = stubs.reset()
            state.exec_steps = {{code = 1}, {code = 0}}
            test.is_nil(docker.ensure_removed("container"))
            test.eq(#state.exec_commands, 2)
            test.not_nil(state.exec_commands[2]:find("name=^container$", 1, true))
        end)
        test.it("preserves removal failure when the container remains or verification fails", function()
            for _, verify in ipairs({{code = 0, chunks = {"container-id\n"}}, {code = 1},
                {err = errors.new({kind = errors.UNAVAILABLE, message = "Docker unavailable"})}}) do
                local state = stubs.reset()
                state.exec_steps = {{code = 1}, verify}
                local err = docker.ensure_removed("container")
                test.not_nil(err)
                test.is_true(errors.is(err, errors.UNAVAILABLE))
            end
        end)
        test.it("applies the credential limit to file bytes rather than tar bytes", function()
            local state = stubs.reset()
            state.chunks = {tar("12345678") .. string.rep("\0", 1024)}
            local content, err = docker.copy_file("container", "/login", 8)
            test.is_nil(err)
            test.eq(content, "12345678")
        end)
        test.it("distinguishes truncated credentials from complete oversized files", function()
            for _, case in ipairs({{content = "1234", declared = 8, message = "truncated tar entry"},
                {content = "123456789", declared = 9, message = "copied file exceeds 8 bytes"}}) do
                local state = stubs.reset()
                state.chunks = {tar(case.content, case.declared)}
                local content, err = docker.copy_file("container", "/login", 8)
                test.is_nil(content)
                test.eq(err:message(), case.message)
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

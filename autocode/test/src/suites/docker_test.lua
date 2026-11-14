-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local docker = require("docker_subject")
local stubs = require("stubs")
local time = require("time")
local registry = require("registry")
local json = require("json")
local function tar(content, declared)
    local header = string.rep("\0", 512)
    header = header:sub(1, 124) .. string.format("%011o", declared or #content) .. "\0" .. header:sub(137, 156) .. "0" .. header:sub(158)
    return header .. content
end
local function fixture()
    return {Name = "/expected", State = {Status = "created"}, Config = {Image = "sha256:approved"},
        NetworkSettings = {Networks = {none = {}}}, Mounts = {},
        HostConfig = {NetworkMode = "none", PidMode = "", IpcMode = "private", UTSMode = "", UsernsMode = "",
            MaskedPaths = {"/proc/asound", "/proc/acpi", "/proc/kcore", "/proc/keys", "/proc/latency_stats", "/proc/timer_list",
                "/proc/timer_stats", "/proc/sched_debug", "/proc/scsi", "/sys/firmware", "/sys/devices/virtual/powercap"},
            ReadonlyPaths = {"/proc/bus", "/proc/fs", "/proc/irq", "/proc/sys", "/proc/sysrq-trigger"},
            CapDrop = {"NET_RAW"}, CgroupnsMode = "private", Privileged = false, Runtime = "runc", PublishAllPorts = false}}
end
local function cases()
    test.describe("autocode Docker bounds", function()
        test.it("classifies host failures by the private deadline marker", function()
            local host = require("host")
            for _, status in ipairs({124, 137}) do
                local state = stubs.reset()
                state.exec_steps = {{code = status}}
                local value, err = host.probe("/fixture")
                test.is_nil(value); test.is_true(errors.is(err, errors.INVALID))
                test.eq(err:details().code, "autocode.host_command_failed"); test.eq(err:details().exit_code, status)
            end
            local state = stubs.reset()
            state.exec_steps, state.host_deadline = {{code = 124}}, true
            local value, err = host.probe("/fixture")
            test.is_nil(value); test.is_true(errors.is(err, errors.TIMEOUT))
            test.eq(err:details().code, "autocode.host_timeout"); test.is_true(err:retryable())
        end)
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
                if resource == state.command then matches = true end
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
            test.eq(state.command_env.AUTOCODE_DOCKER_CONTEXT, "build-host")
        end)
        test.it("separates container values from the Docker client environment", function()
            local state = stubs.reset()
            state.chunks = {}
            local container_env = {HOME = "/writable", PATH = "/container/bin", DOCKER_CONFIG = "/writable/config",
                DOCKER_HOST = "unix:///container.sock", DOCKER_CONTEXT = "container-context", DOCKER_CERT_PATH = "/container/certs",
                DOCKER_TLS_VERIFY = "1", TOKEN = "private\nvalue"}
            local code, err = docker.run({"create", "image"}, {env = container_env})
            test.is_nil(err); test.eq(code, 0)
            for name in pairs(container_env) do test.is_nil(state.command_env[name]) end
            test.is_nil(state.command_env.AUTOCODE_RUN_ROOT)
            test.is_nil(state.command_env.AUTOCODE_CONTAINER_TOKEN)
            test.not_nil(state.command_env.AUTOCODE_DOCKER_PAYLOAD_0:find("AUTOCODE_TRANSFER_NAMES=", 1, true))
            test.is_nil(state.command:find("private", 1, true))
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
        test.it("drops NET_RAW on shared and scratch containers while preserving recipe drops", function()
            for _, shared in ipairs({false, true}) do
                local state = stubs.reset()
                local prepared = stubs.preparation(state.run)
                if shared then prepared.workspace = {id = "workspace", host_path = "/fixture", writable = true} end
                prepared.image.extra_args = {"--cap-drop=CHOWN"}
                local box = require("io").build("run", prepared, {})
                local args = table.concat(box.create, " ")
                test.not_nil(args:find("--cap-drop=NET_RAW", 1, true), args)
                test.not_nil(args:find("--cap-drop=CHOWN", 1, true), args)
            end
        end)
        test.it("accepts exactly the Docker 26 and 28 inspected NET_RAW drop forms", function()
            for _, drop in ipairs({"NET_RAW", "CAP_NET_RAW", "ALL"}) do
                local state, value = stubs.reset(), fixture()
                value.HostConfig.CapDrop = {drop}
                local id = string.rep("a", 64)
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                test.is_nil(err, drop .. ": " .. tostring(err)); test.eq(code, 0)
                test.eq(#state.exec_commands, 4)
            end
        end)
        test.it("requires the inspected NET_RAW drop and refuses every added capability", function()
            for _, case in ipairs({
                {drops = {}, field = "CapDrop"}, {drops = {"CHOWN"}, field = "CapDrop"},
                {drops = {"CAP_CHOWN"}, field = "CapDrop"}, {drops = {"CAP_ALL"}, field = "CapDrop"},
                {drops = {"net_raw"}, field = "CapDrop"}, {drops = {"cap_net_raw"}, field = "CapDrop"},
                {drops = {"all"}, field = "CapDrop"}, {drops = {"CAP_CAP_NET_RAW"}, field = "CapDrop"},
                {drops = {"NET_RAW "}, field = "CapDrop"}, {drops = {" CAP_NET_RAW"}, field = "CapDrop"},
                {drops = {"CAP_NET_RAW"}, adds = {"CAP_NET_RAW"}, field = "CapAdd"},
                {drops = {"NET_RAW"}, adds = {"NET_RAW"}, field = "CapAdd"},
                {drops = {"ALL"}, adds = {"CHOWN"}, field = "CapAdd"},
            }) do
                local state, value = stubs.reset(), fixture()
                value.HostConfig.CapDrop, value.HostConfig.CapAdd = case.drops, case.adds
                local id = string.rep("a", 64)
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                test.is_nil(code); test.not_nil(err)
                test.not_nil(tostring(err):find("isolation mismatch: " .. case.field, 1, true), tostring(err))
            end
        end)
        test.it("requires every pinned Docker protected path before starting", function()
            for _, field in ipairs({"MaskedPaths", "ReadonlyPaths"}) do
                for _, mode in ipairs({"empty", "missing-one"}) do
                    local state, value = stubs.reset(), fixture()
                    if mode == "empty" then value.HostConfig[field] = {} else table.remove(value.HostConfig[field]) end
                    local id = string.rep("a", 64)
                    state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}}, {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                    local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                    test.is_nil(code, field .. " " .. mode); test.not_nil(err)
                    test.not_nil(tostring(err):find("isolation mismatch: " .. field, 1, true), tostring(err))
                    test.not_nil(state.command_env.AUTOCODE_DOCKER_ARGS:find("rm -f " .. id, 1, true))
                end
            end
        end)
        for _, case in ipairs({
            {name = "--cpus=0.0", args = {"--cpus=0.0"}, field = "NanoCpus"},
            {name = "--memory=0m", args = {"--memory=0m"}, field = "Memory"},
            {name = "--pids-limit=00", args = {"--pids-limit=00"}, field = "PidsLimit"},
            {name = "--memory-swappiness=00", args = {"--memory-swappiness=00"}, field = "MemorySwappiness"},
            {name = "base CPU 0.0", args = {"--cpus", "0.0"}, field = "NanoCpus"},
            {name = "base memory 0m", args = {"--memory", "0m"}, field = "Memory"},
        }) do
            test.it("accepts Docker zero spelling " .. case.name, function()
                local state, value = stubs.reset(), fixture()
                value.HostConfig[case.field] = 0
                value.HostConfig.MemorySwap = 0
                local id = string.rep("a", 64)
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local args = {"create"}
                for _, arg in ipairs(case.args) do args[#args + 1] = arg end
                args[#args + 1] = "image"
                local code, err = docker.run(args, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                test.is_nil(err, tostring(err)); test.eq(code, 0); test.eq(#state.exec_commands, 4)
            end)
        end
        for _, case in ipairs({
            {name = "unlimited quota", args = {"--cpu-quota=-1"}},
            {name = "period without quota", args = {"--cpu-period=100000"}},
            {name = "positive extra quota", args = {"--cpu-quota=25000", "--cpu-period=100000"}},
            {name = "extra CPU count", args = {"--cpus=0.25"}},
        }) do
            test.it("logs a discarded CFS request and proceeds for " .. case.name, function()
                local state, value = stubs.reset(), fixture()
                value.HostConfig.CpuQuota, value.HostConfig.CpuPeriod, value.HostConfig.NanoCpus = 0, 0, 0
                local id = string.rep("a", 64)
                local warning = "WARNING: Your kernel does not support CPU CFS scheduler. CPU period/quota discarded."
                state.exec_steps = {{chunks = {warning:sub(1, 40), warning:sub(41) .. "\r\n" .. id .. "\n"}},
                    {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local args = {"create"}
                for _, arg in ipairs(case.args) do args[#args + 1] = arg end
                args[#args + 1] = "image"
                local lines = {}
                local code, err = docker.run(args, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {},
                    limits = {memory = "", cpus = "", pids_limit = 0}}, on_line = function(line) lines[#lines + 1] = line end})
                test.eq(lines[1], warning)
                test.is_nil(err, tostring(err)); test.eq(code, 0); test.eq(#state.exec_commands, 4)
                code, err = docker.run({"start", "-a", id})
                test.is_nil(err, tostring(err)); test.eq(code, 0)
            end)
        end
        for _, case in ipairs({
            {field = "Memory", limits = {memory = "64m", cpus = "", pids_limit = 0}},
            {field = "NanoCpus", limits = {memory = "", cpus = "0.25", pids_limit = 0}},
            {field = "PidsLimit", limits = {memory = "", cpus = "", pids_limit = 16}},
        }) do
            test.it("refuses and removes a missing settings limit at inspect: " .. case.field, function()
                for _, missing in ipairs({0, -1, "missing"}) do
                    local state, value = stubs.reset(), fixture()
                    if missing ~= "missing" then value.HostConfig[case.field] = missing end
                    local id = string.rep("a", 64)
                    state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                        {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                    local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}, limits = case.limits}})
                    test.is_nil(code); test.not_nil(err)
                    test.not_nil(tostring(err):find("isolation mismatch: " .. case.field, 1, true), tostring(err))
                    test.eq(#state.exec_commands, 5)
                    test.eq(state.command_env.AUTOCODE_DOCKER_ARGS, "rm -f " .. id)
                end
            end)
        end
        test.it("logs every pinned resource discard warning and still inspects isolation", function()
            -- Moby v26.1.3 daemon/daemon_unix.go run resource bounds.
            for _, message in ipairs({
                "Your kernel does not support memory limit capabilities or the cgroup is not mounted. Limitation discarded.",
                "Your kernel does not support swap limit capabilities or the cgroup is not mounted. Memory limited without swap.",
                "Your kernel does not support PIDs limit capabilities or the cgroup is not mounted. PIDs limit discarded.",
                "linux does not support CPU percent. Percent discarded.",
                "Your kernel does not support CPU CFS scheduler. CPU period/quota discarded.",
                "Your kernel does not support cpuset or the cgroup is not mounted. Cpuset discarded.",
            }) do
                for _, id_first in ipairs({false, true}) do
                    local state, value = stubs.reset(), fixture()
                    local id, warning = string.rep("a", 64), "WARNING: " .. message
                    local response = id_first and (id .. "\n" .. warning .. "\n") or (warning .. "\r\n" .. id .. "\n")
                    state.exec_steps = {{chunks = {response}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                        {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}}
                    local lines = {}
                    local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}},
                        on_line = function(line) lines[#lines + 1] = line end})
                    test.is_nil(err, tostring(err)); test.eq(code, 0)
                    test.eq(lines[id_first and 2 or 1], warning)
                    test.eq(#lines, 2); test.eq(#state.exec_commands, 4)
                end
            end
        end)
        for _, setting in ipairs({"00", "60"}) do
            test.it("runs with a logged daemon swappiness discard for " .. setting, function()
                local state, value = stubs.reset(), fixture()
                local id = string.rep("a", 64)
                local warning = "WARNING: Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded."
                state.exec_steps = {{chunks = {warning:sub(1, 40), warning:sub(41) .. "\r\n" .. id .. "\n"}},
                    {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local lines = {}
                local code, err = docker.run({"create", "--memory-swappiness=" .. setting, "image"},
                    {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}},
                        on_line = function(line) lines[#lines + 1] = line end})
                test.is_nil(err, tostring(err)); test.eq(code, 0)
                test.eq(lines[1], warning); test.eq(#state.exec_commands, 4)
                code, err = docker.run({"start", "-a", id})
                test.is_nil(err, tostring(err)); test.eq(code, 0)
                test.eq(state.command_env.AUTOCODE_DOCKER_ARGS, "start -a " .. id)
            end)
        end
        test.it("reports pinned nonbounding discard warnings and still inspects isolation", function()
            for _, message in ipairs({
                "Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded.",
                "Your kernel does not support memory soft limit capabilities or the cgroup is not mounted. Limitation discarded.",
                "Your kernel does not support kernel memory limit capabilities or the cgroup is not mounted. Limitation discarded.",
                "Your kernel does not support OomKillDisable. OomKillDisable discarded.",
                "Your kernel does not support CPU shares or the cgroup is not mounted. Shares discarded.",
                "Your kernel does not support Block I/O weight or the cgroup is not mounted. Weight discarded.",
                "Your kernel does not support Block I/O weight_device or the cgroup is not mounted. Weight-device discarded.",
                "Your kernel does not support BPS Block I/O read limit or the cgroup is not mounted. Block I/O BPS read limit discarded.",
                "Your kernel does not support BPS Block I/O write limit or the cgroup is not mounted. Block I/O BPS write limit discarded.",
                "Your kernel does not support IOPS Block read limit or the cgroup is not mounted. Block I/O IOPS read limit discarded.",
                "Your kernel does not support IOPS Block write limit or the cgroup is not mounted. Block I/O IOPS write limit discarded.",
                "Your kernel does not support cgroup namespaces.  Cgroup namespace setting discarded.",
            }) do
                for _, id_first in ipairs({false, true}) do
                    local state, value = stubs.reset(), fixture()
                    local id, warning = string.rep("a", 64), "WARNING: " .. message
                    local response = id_first and (id .. "\n" .. warning .. "\n") or (warning .. "\r\n" .. id .. "\n")
                    state.exec_steps = {{chunks = {response}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                        {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}}
                    local lines = {}
                    local code, err = docker.run({"create", "image"},
                        {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}},
                            on_line = function(line) lines[#lines + 1] = line end})
                    test.is_nil(err, warning .. ": " .. tostring(err)); test.eq(code, 0)
                    test.eq(lines[id_first and 2 or 1], warning); test.eq(#state.exec_commands, 4)
                end
            end
        end)
        test.it("keeps resource precedence units boolean arity and flag-looking values", function()
            for _, case in ipairs({
                {args = {"--memory=4g", "--memory", "128m", "-itqm=64MiB", "--memory-swap=-1", "--cpus=0.5", "--cpus=1/4", "--pids-limit=-1", "--init=false", "--label", "--memory=1g", "-l", "--cpus=10", "image", "--memory=1g"},
                    fields = {Memory = 67108864, MemorySwap = -1, NanoCpus = 250000000, PidsLimit = nil}},
                {args = {"--memory=1.5 mB", "--memory=6.4e1m", "--memory-swap=0", "--cpus=0.000000249", "--pids-limit=0", "--memory-swappiness=-1", "--oom-kill-disable", "--oom-kill-disable=false", "image"},
                    fields = {Memory = 67108864, MemorySwap = 134217728, NanoCpus = 249, PidsLimit = -1}},
                {args = {"--memory=0", "--cpus=0", "--cpu-quota=25000", "--cpu-period=100000", "--pids-limit=16", "image"},
                    fields = {Memory = 0, MemorySwap = 0, NanoCpus = 0, CpuQuota = 25000, CpuPeriod = 100000, PidsLimit = 16}},
            }) do
                local state, value = stubs.reset(), fixture()
                for key, field in pairs(case.fields) do value.HostConfig[key] = field end
                local id = string.rep("a", 64)
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}}
                local args = {"create"}
                for _, arg in ipairs(case.args) do args[#args + 1] = arg end
                local code, err = docker.run(args, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                test.is_nil(err, tostring(err)); test.eq(code, 0); test.eq(#state.exec_commands, 4)
            end
        end)
        test.it("retains an inspection mismatch and independent cleanup failure", function()
            local state, value = stubs.reset(), fixture()
            value.HostConfig.Memory = 0
            local id = string.rep("a", 64)
            state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {code = 1}, {chunks = {id .. "\n"}}}
            local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {},
                limits = {memory = "64m", cpus = "", pids_limit = 0}}})
            test.is_nil(code); test.not_nil(err)
            test.not_nil(tostring(err):find("isolation mismatch: Memory", 1, true), tostring(err))
            test.not_nil(tostring(err):find("container removal failed", 1, true), tostring(err))
        end)
        test.it("ignores unrelated create warnings and warning-like output from other commands", function()
            local state, value = stubs.reset(), fixture()
            local id = string.rep("a", 64)
            value.HostConfig.Memory, value.HostConfig.MemorySwap = 67108864, 134217728
            value.HostConfig.NanoCpus, value.HostConfig.PidsLimit = 250000000, 16
            state.exec_steps = {{chunks = {"WARNING: image platform differs from the host\nWARNING: unrelated tuning setting discarded.\n" .. id .. "\n"}},
                {chunks = {json.encode(value)}}, {chunks = {"runc\n"}}, {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}}
            local code, err = docker.run({"create", "--memory=64m", "--cpus=0.25", "--pids-limit=16", "image"},
                {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
            test.is_nil(err, tostring(err)); test.eq(code, 0); test.eq(#state.exec_commands, 4)
            state = stubs.reset()
            state.chunks = {"WARNING: Your kernel does not support PIDs limit capabilities or the cgroup is not mounted. PIDs limit discarded.\n"}
            code, err = docker.run({"logs", "image"})
            test.is_nil(err, tostring(err)); test.eq(code, 0); test.eq(#state.exec_commands, 1)
        end)
        test.it("accepts Docker CPU exponents and base-zero ratios unchanged", function()
            for _, case in ipairs({{text = "1e-1", number = 100000000},
                {text = "1/010", number = 125000000}, {text = "1/0o10", number = 125000000}}) do
                local state, value = stubs.reset(), fixture()
                value.HostConfig.NanoCpus = case.number
                local id = string.rep("a", 64)
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local code, err = docker.run({"create", "--cpus=" .. case.text, "image"},
                    {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                test.is_nil(err, case.text .. ": " .. tostring(err)); test.eq(code, 0)
            end
        end)
        test.it("accepts integer resources with Docker base-zero spellings", function()
            for flag, field in pairs({["pids-limit"] = "PidsLimit", ["cpu-shares"] = "CpuShares",
                ["cpu-period"] = "CpuPeriod", ["cpu-quota"] = "CpuQuota", ["blkio-weight"] = "BlkioWeight",
                ["memory-swappiness"] = "MemorySwappiness"}) do
                for _, spelling in ipairs({"0100", "0o100", "0O100", "0x40", "0X40", "0b1000000", "0B1000000",
                    "0_100", "0x_40", "6_4", "64"}) do
                    local state, value = stubs.reset(), fixture()
                    value.HostConfig[field] = 64
                    local id = string.rep("a", 64)
                    state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                        {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                    local code, err = docker.run({"create", "--" .. flag .. "=" .. spelling, "image"},
                        {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                    test.is_nil(err, flag .. "=" .. spelling .. ": " .. tostring(err)); test.eq(code, 0)
                end
            end
            for _, case in ipairs({{flag = "pids-limit", field = "PidsLimit", text = "1_000", number = 1000},
                {flag = "cpu-shares", field = "CpuShares", text = "02000", number = 1024},
                {flag = "pids-limit", field = "PidsLimit", text = "+0100", number = 64},
                {flag = "cpu-quota", field = "CpuQuota", text = "-0x1", number = -1}}) do
                local state, value = stubs.reset(), fixture()
                value.HostConfig[case.field] = case.number
                local id = string.rep("a", 64)
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local code, err = docker.run({"create", "--" .. case.flag .. "=" .. case.text, "image"},
                    {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                test.is_nil(err, tostring(err)); test.eq(code, 0)
            end
        end)
        test.it("accepts memory resources with Docker units and float spellings", function()
            for flag, field in pairs({memory = "Memory", ["memory-swap"] = "MemorySwap",
                ["memory-reservation"] = "MemoryReservation", ["kernel-memory"] = "KernelMemory"}) do
                for _, case in ipairs({{text = "0100", number = 100}, {text = "1_024", number = 1024},
                    {text = "0x1p+6m", number = 67108864}, {text = "0x1_0p+2MiB", number = 67108864},
                    {text = "6.4e1m", number = 67108864}, {text = "0x1p+0_6m", number = 67108864},
                    {text = "1e0_3", number = 1000}, {text = "+64 MB", number = 67108864},
                    {text = "64mIb", number = 67108864}, {text = "67108864b", number = 67108864},
                    {text = "1.5k", number = 1536}, {text = "1024.9", number = 1024}}) do
                    local state, value = stubs.reset(), fixture()
                    value.HostConfig[field] = case.number
                    if field == "Memory" then value.HostConfig.MemorySwap = case.number * 2 end
                    local id = string.rep("a", 64)
                    state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                        {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                    local code, err = docker.run({"create", "--" .. flag .. "=" .. case.text, "image"},
                        {isolation = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}})
                    test.is_nil(err, flag .. "=" .. case.text .. ": " .. tostring(err)); test.eq(code, 0)
                end
            end
        end)
        test.it("requests private cgroups even when the daemon defaults to the v1 host namespace", function()
            local state = stubs.reset()
            local box = require("io").build("run", stubs.preparation(state.run), {})
            local value = fixture()
            value.Name, value.Config.Image = "/" .. box.name, box.isolation.image
            value.HostConfig.CgroupnsMode = table.concat(box.create, " "):find("--cgroupns=private", 1, true) and "private" or "host"
            local id = string.rep("a", 64)
            state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}}, {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
            local code, err = docker.run(box.create, {isolation = box.isolation})
            test.is_nil(err, tostring(err)); test.eq(code, 0)
        end)
        test.it("matches approved network names IDs and prefixes with Docker's created network name", function()
            local network_id, id = string.rep("b", 64), string.rep("a", 64)
            for _, reference in ipairs({"approved", network_id, network_id:sub(1, 12)}) do
                local state, value = stubs.reset(), fixture()
                value.HostConfig.NetworkMode = reference
                value.NetworkSettings.Networks = {approved = {NetworkID = ""}}
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    {chunks = {json.encode({Id = network_id, Name = "approved"})}}}
                local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = reference, mounts = {}}})
                test.is_nil(err, tostring(err)); test.eq(code, 0); test.eq(#state.exec_commands, 4)
            end
        end)
        test.it("rejects foreign missing or additional network attachments and removes unresolved creations", function()
            local id, network_id = string.rep("a", 64), string.rep("b", 64)
            for _, case in ipairs({
                {mode = "foreign", networks = {approved = {}}},
                {mode = "approved", networks = {foreign = {}}},
                {mode = "approved", networks = {}},
                {mode = "approved", networks = {approved = {}, foreign = {}}},
                {mode = "approved", networks = {approved = {NetworkID = "foreign"}}},
                {mode = "approved", networks = {approved = {}}, resolution = {code = 1}},
                {mode = "approved", networks = {approved = {}}, resolution = {chunks = {"invalid"}}},
                {mode = "approved", networks = {approved = {}}, resolution = {chunks = {"{}"}}},
            }) do
                local state, value = stubs.reset(), fixture()
                value.HostConfig.NetworkMode, value.NetworkSettings.Networks = case.mode, case.networks
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}},
                    case.resolution or {chunks = {json.encode({Id = network_id, Name = "approved"})}}, {}}
                local code, err = docker.run({"create", "image"}, {isolation = {name = "expected", image = "sha256:approved", network = "approved", mounts = {}}})
                test.is_nil(code); test.not_nil(err)
                test.not_nil(state.command_env.AUTOCODE_DOCKER_ARGS:find("rm -f " .. id, 1, true))
            end
        end)
        test.it("checks effective container authority and removes every mismatch by its returned ID", function()
            local policy = {name = "expected", image = "sha256:approved", network = "none", mounts = {}}
            local id = string.rep("a", 64)
            for _, change in ipairs({
                {field = "OomScoreAdj", value = -1000}, {field = "OomKillDisable", value = true},
                {field = "CpuRealtimeRuntime", value = 10000}, {field = "CpuRealtimePeriod", value = 1000000},
                {field = "RestartPolicy", value = {Name = "always", MaximumRetryCount = 0}},
                {field = "Cgroup", value = "host"},
                {field = "PidMode", value = "host"}, {field = "IpcMode", value = "shareable"},
                {field = "UTSMode", value = "host"}, {field = "UsernsMode", value = "host"},
                {field = "CgroupnsMode", value = "host"}, {field = "Privileged", value = true},
                {field = "Devices", value = {{PathOnHost = "/dev/null"}}},
                {field = "DeviceCgroupRules", value = {"a *:* rwm"}},
                {field = "DeviceRequests", value = {{Count = -1}}}, {field = "CapAdd", value = {"SYS_ADMIN"}},
                {field = "SecurityOpt", value = {"no-new-privileges=false"}},
                {field = "Binds", value = {"/:/host"}}, {field = "Mounts", value = {{Type = "volume", Target = "/data"}}},
                {field = "VolumesFrom", value = {"other"}}, {field = "Runtime", value = "custom"},
                {field = "CgroupParent", value = "/host"}, {field = "Sysctls", value = {key = "value"}},
                {field = "BlkioDeviceReadBps", value = {{Path = "/dev/null", Rate = 1}}},
            }) do
                local state, value = stubs.reset(), fixture()
                value.HostConfig[change.field] = change.value
                state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(value)}}, {chunks = {"runc\n"}}, {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}, {}}
                local code, err = docker.run({"create", "image"}, {isolation = policy})
                test.is_nil(code, change.field); test.not_nil(err)
                test.not_nil(tostring(err):find("isolation mismatch: " .. change.field, 1, true), tostring(err))
                test.not_nil(state.command_env.AUTOCODE_DOCKER_ARGS:find("rm -f " .. id, 1, true))
            end
            local state = stubs.reset()
            state.exec_steps = {{chunks = {id .. "\n"}}, {chunks = {json.encode(fixture())}}, {chunks = {"runc\n"}}, {chunks = {json.encode({Id = string.rep("b", 64), Name = "none"})}}}
            local code, err = docker.run({"create", "image"}, {isolation = policy})
            test.is_nil(err, tostring(err)); test.eq(code, 0); test.eq(#state.exec_commands, 4)
        end)
        test.it("removes a created container when inspection fails and retains cleanup failures", function()
            local id = string.rep("a", 64)
            for _, inspection in ipairs({{code = 1}, {chunks = {"invalid json"}},
                {err = errors.new({kind = errors.UNAVAILABLE, message = "inspect unavailable"})}}) do
                local state = stubs.reset()
                state.exec_steps = {{chunks = {id .. "\n"}}, inspection, {}}
                local code, err = docker.run({"create", "image"}, {isolation = {name = "box", image = "image", network = "none", mounts = {}}})
                test.is_nil(code); test.not_nil(err); test.eq(#state.exec_commands, 3)
                test.not_nil(state.command_env.AUTOCODE_DOCKER_ARGS:find("rm -f " .. id, 1, true))
            end
            local state = stubs.reset()
            state.exec_steps = {{chunks = {id .. "\n"}}, {code = 1}, {code = 1}, {chunks = {id .. "\n"}}}
            local code, err = docker.run({"create", "image"}, {isolation = {name = "box", image = "image", network = "none", mounts = {}}})
            test.is_nil(code); test.not_nil(err)
            test.not_nil(err:message():find("container removal failed", 1, true), "outer=" .. err:message() .. "; " .. tostring(err) .. "; calls=" .. tostring(#state.exec_commands))
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
            test.not_nil(state.command_env.AUTOCODE_DOCKER_ARGS:find("name=^container$", 1, true))
        end)
        test.it("verifies removal by container ID rather than by an ID-shaped name", function()
            local state = stubs.reset()
            local id = string.rep("a", 64)
            state.exec_steps = {{code = 1}, {chunks = {id .. "\n"}}}
            test.not_nil(docker.ensure_removed(id))
            test.not_nil(state.command_env.AUTOCODE_DOCKER_ARGS:find("id=" .. id, 1, true))
            test.is_nil(state.command_env.AUTOCODE_DOCKER_ARGS:find("name=", 1, true))
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

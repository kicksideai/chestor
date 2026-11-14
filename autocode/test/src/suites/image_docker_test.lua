-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local docker = require("docker")
local image = require("image")
local maintenance = require("maintenance")
local stubs = require("stubs")
local BASE = "chestor-autocode-harness-base:" .. uuid.v7()
local function output(args, stdin)
    local lines = {}
    local code, err = docker.run(args, {stdin = stdin, on_line = function(line) lines[#lines + 1] = line end})
    test.is_nil(err, tostring(err))
    test.eq(code, 0, table.concat(lines, "\n"))
    return table.concat(lines, "\n")
end
local function cases()
    test.describe("autocode real Docker image ownership", function()
        local containers, references = {}, {}
        test.after_each(function()
            for _, name in ipairs(containers) do docker.remove(name) end
            for _, ref in ipairs(references) do docker.run({"image", "rm", ref}) end
            containers, references = {}, {}
        end)
        -- The suite builds its own small base, so it never depends on images other suites create.
        local base_built = false
        test.after_all(function()
            if base_built then output({"image", "rm", BASE}) end
        end)
        local function base()
            if base_built then return BASE end
            output({"build", "-t", BASE, "-"}, [[FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/agent
]])
            base_built = true
            return BASE
        end
        local function build(component, generation, ref, home, dockerfile, after_build)
            if dockerfile then dockerfile = dockerfile:gsub("^FROM BASE", "FROM " .. base()) end
            references[#references + 1] = "chestor-autocode/" .. component .. ":" .. generation
            local state = stubs.reset()
            state.after_build = after_build
            state.build.build_id = generation
            state.recipe = stubs.recipe_fixture()
            state.recipe.ref, state.recipe.home, state.recipe.dockerfile = ref, home, dockerfile or ""
            state.drivers = {{id = "claude", executable = "sh"}}
            test.is_true(image.main({payload = {image_id = component, build_id = generation}}).ok)
            return state.build
        end
        test.it("checks both real probes with Docker-parsed recipe limits and harmless labels", function()
            local state = stubs.reset()
            local generation = uuid.v7()
            state.build.build_id = generation
            state.recipe = stubs.recipe_fixture()
            state.recipe.ref, state.recipe.home = base(), "/opt/agent"
            state.recipe.settings.memory, state.recipe.settings.cpus, state.recipe.settings.pids_limit = "96m", "1", 128
            state.recipe.settings.extra_args = {"--memory=128m", "-m64m", "--cpus=0.25", "--pids-limit=16",
                "--memory-swap=-1", "--cap-drop=CHOWN", "-c256", "--ulimit=nofile=512:1024", "--oom-kill-disable=false",
                "--label", "--env-file=/definitely-absent/autocode.env"}
            state.drivers = {{id = "claude", executable = "sh"}}
            local probes = 0
            state.after_probe_create = function(args, options)
                probes = probes + 1
                test.not_nil(options.isolation)
                local name = "autocode-probe-" .. generation
                local drops = output({"inspect", "--format", "{{json .HostConfig.CapDrop}}", name})
                for _, cap in ipairs({"NET_RAW", "CHOWN"}) do test.not_nil(drops:find(cap, 1, true), drops) end
                local actual = output({"inspect", "--format", "{{.State.Status}} {{.HostConfig.Memory}} {{.HostConfig.NanoCpus}} {{.HostConfig.PidsLimit}} {{.HostConfig.MemorySwap}} {{.HostConfig.CpuShares}} {{.HostConfig.OomKillDisable}} {{json .HostConfig.Ulimits}}", name})
                test.eq(actual:match("^(.-) %[%{"), "created 67108864 250000000 16 -1 256 false")
                for _, part in ipairs({'"Name":"nofile"', '"Hard":1024', '"Soft":512'}) do test.not_nil(actual:find(part, 1, true), actual) end
            end
            references[#references + 1] = "chestor-autocode/limits:" .. generation
            test.is_true(image.main({payload = {image_id = "limits", build_id = generation}}).ok)
            test.eq(state.build.status, "ready", state.build.log)
            test.eq(probes, 2)
            test.eq(output({"ps", "-aq", "--filter", "name=^autocode-probe-" .. generation .. "$"}), "")
        end)
        for _, option in ipairs({"--cpus=1e-1", "--cpus=1/010", "--cpus=1/0o10", "--pids-limit=0100", "--memory=1g",
            "--cpus=0.0", "--memory=0m", "--pids-limit=00", "--memory-swappiness=00", "--memory-swappiness=60", "empty base settings"}) do
            test.it("runs and probes with identical Docker limits for " .. option, function()
                local state, generation = stubs.reset(), uuid.v7()
                state.build.build_id = generation
                state.recipe = stubs.recipe_fixture()
                state.recipe.ref, state.recipe.home = base(), "/opt/agent"
                state.recipe.settings.memory, state.recipe.settings.cpus, state.recipe.settings.pids_limit = "96m", "0.5", 128
                state.recipe.settings.extra_args = {option}
                if option == "--cpus=0.0" then state.recipe.settings.cpus = "" end
                if option == "--memory=0m" then state.recipe.settings.memory = "" end
                if option == "--pids-limit=00" then state.recipe.settings.pids_limit = 0 end
                if option == "empty base settings" then
                    state.recipe.settings.memory, state.recipe.settings.cpus, state.recipe.settings.pids_limit = "", "", 0
                    state.recipe.settings.extra_args = {}
                end
                local prepared = stubs.preparation(state.run)
                for key, value in pairs(state.recipe.settings) do prepared.image[key] = value end
                prepared.image.ref, prepared.image.home = state.recipe.ref, state.recipe.home
                local format = "{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}} {{.HostConfig.PidsLimit}} {{.HostConfig.MemorySwappiness}}"
                local limits
                local swappiness_discarded = false
                local swappiness_warning = "WARNING: Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded."
                for _, shared in ipairs({false, true}) do
                    if shared then
                        prepared.workdir = "/workspace"
                        prepared.workspace = {id = "limits", host_path = "/sys", writable = false}
                    end
                    local box = require("run_io").build(uuid.v7(), prepared, {})
                    containers[#containers + 1] = box.name
                    local warning_seen = false
                    local code, err = docker.run(box.create, {isolation = box.isolation, on_line = function(line)
                        if line == swappiness_warning then warning_seen = true end
                    end})
                    test.is_nil(err, tostring(err)); test.eq(code, 0)
                    if option:match("^%-%-memory%-swappiness=") then
                        local actual_swappiness = output({"inspect", "--format", "{{json .HostConfig.MemorySwappiness}}", box.name})
                        test.eq(warning_seen, actual_swappiness == "null")
                        swappiness_discarded = warning_seen
                    else
                        test.is_false(warning_seen)
                    end
                    local actual = output({"inspect", "--format", format, box.name})
                    if limits then test.eq(actual, limits) else limits = actual end
                    output({"start", "-a", box.name})
                end
                state.drivers = {{id = "claude", executable = "sh"}}
                local probes = 0
                state.after_probe_create = function()
                    probes = probes + 1
                    test.eq(output({"inspect", "--format", format, "autocode-probe-" .. generation}), limits)
                end
                references[#references + 1] = "chestor-autocode/parity:" .. generation
                test.is_true(image.main({payload = {image_id = "parity", build_id = generation}}).ok)
                test.eq(state.build.status, "ready", state.build.log)
                test.eq(probes, 2)
                if swappiness_discarded then
                    local notices = 0
                    for line in state.build.log:gmatch("[^\n]+") do if line == swappiness_warning then notices = notices + 1 end end
                    test.eq(notices, 2, state.build.log)
                end
            end)
        end
        for _, case in ipairs({
            {name = "base memory zero", field = "Memory", memory = "0m", cpus = "", pids_limit = 0, args = {}},
            {name = "base CPU zero", field = "NanoCpus", memory = "", cpus = "0.0", pids_limit = 0, args = {}},
            {name = "extra memory zero removes settings bound", field = "Memory", memory = "64m", cpus = "", pids_limit = 0, args = {"--memory=0m"}},
            {name = "extra CPU zero removes settings bound", field = "NanoCpus", memory = "", cpus = "0.25", pids_limit = 0, args = {"--cpus=0.0"}},
            {name = "extra PID zero removes settings bound", field = "PidsLimit", memory = "", cpus = "", pids_limit = 16, args = {"--pids-limit=00"}},
        }) do
            test.it("refuses absent settings bounds in runs and probes for " .. case.name, function()
                local state, generation = stubs.reset(), uuid.v7()
                state.build.build_id = generation
                state.recipe = stubs.recipe_fixture()
                state.recipe.ref, state.recipe.home = base(), "/opt/agent"
                state.recipe.settings.memory, state.recipe.settings.cpus, state.recipe.settings.pids_limit = case.memory, case.cpus, case.pids_limit
                state.recipe.settings.extra_args = case.args
                local prepared = stubs.preparation(state.run)
                for key, value in pairs(state.recipe.settings) do prepared.image[key] = value end
                prepared.image.ref = state.recipe.ref
                for _, shared in ipairs({false, true}) do
                    if shared then
                        prepared.workdir = "/workspace"
                        prepared.workspace = {id = "limits", host_path = "/sys", writable = false}
                    end
                    local box = require("run_io").build(uuid.v7(), prepared, {})
                    containers[#containers + 1] = box.name
                    local code, err = docker.run(box.create, {isolation = box.isolation})
                    test.is_nil(code); test.not_nil(err)
                    test.not_nil(tostring(err):find("isolation mismatch: " .. case.field, 1, true), tostring(err))
                    test.eq(output({"ps", "-aq", "--filter", "name=^" .. box.name .. "$"}), "")
                end
                state.drivers = {{id = "claude", executable = "sh"}}
                references[#references + 1] = "chestor-autocode/absent-limits:" .. generation
                test.is_true(image.main({payload = {image_id = "absent-limits", build_id = generation}}).ok)
                test.eq(state.build.status, "failed", state.build.log)
                test.not_nil(state.build.log:find("isolation mismatch: " .. case.field, 1, true), state.build.log)
                test.eq(output({"ps", "-aq", "--filter", "name=^autocode-probe-" .. generation .. "$"}), "")
            end)
        end
        test.it("verifies Docker base-zero integers and Go memory sizes without changing recipes", function()
            for _, case in ipairs({
                {flag = "pids-limit", text = "0100", field = "PidsLimit", number = "64"},
                {flag = "pids-limit", text = "0o100", field = "PidsLimit", number = "64"},
                {flag = "pids-limit", text = "0x40", field = "PidsLimit", number = "64"},
                {flag = "pids-limit", text = "0b1000000", field = "PidsLimit", number = "64"},
                {flag = "pids-limit", text = "1_000", field = "PidsLimit", number = "1000"},
                {flag = "pids-limit", text = "+0x_40", field = "PidsLimit", number = "64"},
                {flag = "cpu-shares", text = "02000", field = "CpuShares", number = "1024"},
                {flag = "memory", text = "64_000_000b", field = "Memory", number = "64000000"},
                {flag = "memory", text = "0x1p+6m", field = "Memory", number = "67108864"},
                {flag = "memory", text = "0x1_0p+2MiB", field = "Memory", number = "67108864"},
                {flag = "memory", text = "0100000000", field = "Memory", number = "100000000"},
                {flag = "memory", text = "6.4e1 mB", field = "Memory", number = "67108864"},
            }) do
                local name, ref = "autocode-numeric-" .. uuid.v7(), base()
                containers[#containers + 1] = name
                local code, err = docker.run({"create", "--name", name, "--cap-drop=NET_RAW", "--cgroupns=private",
                    "--network=none", "--" .. case.flag .. "=" .. case.text, ref, "sh"},
                    {isolation = {name = name, image = ref, network = "none", mounts = {}}})
                test.is_nil(err, case.flag .. "=" .. case.text .. ": " .. tostring(err)); test.eq(code, 0)
                test.eq(output({"inspect", "--format", "{{.State.Status}} {{.HostConfig." .. case.field .. "}}", name}), "created " .. case.number)
                output({"rm", name})
            end
        end)
        test.it("refuses unsafe extra arguments on real image probes before starting them", function()
            for _, args in ipairs({{"--network", "NAME=HOST"}, {"--privileged=true"}, {"--cap-add=SYS_ADMIN"}, {"--cap-add", "NET_RAW"}, {"--security-opt=systempaths=unconfined"}}) do
                local state = stubs.reset()
                local generation = uuid.v7()
                state.build.build_id = generation
                state.recipe = stubs.recipe_fixture()
                state.recipe.ref, state.recipe.home, state.recipe.settings.network = base(), "/opt/agent", ""
                state.recipe.settings.extra_args = args
                state.drivers = {{id = "claude", executable = "sh"}}
                references[#references + 1] = "chestor-autocode/reject:" .. generation
                test.is_true(image.main({payload = {image_id = "reject", build_id = generation}}).ok)
                test.eq(state.build.status, "failed")
                test.not_nil(state.build.log:find("Docker isolation mismatch:", 1, true), state.build.log)
                test.eq(output({"ps", "-aq", "--filter", "name=^autocode-probe-" .. generation .. "$"}), "")
            end
        end)
        test.it("clones branches, tags and the default branch in real containers", function()
            local container = require("container")
            local generation, component = uuid.v7(), uuid.v7()
            local ref = "autocode-test-clone:" .. generation
            references[#references + 1] = ref
            local built = build(component, generation, ref, "/opt/agent", [[FROM BASE
RUN mkdir /opt/agent/source && cd /opt/agent/source && git init -b main && git config user.name fixture && git config user.email fixture@example.com && echo main > chosen && git add chosen && git commit -m main && git checkout -b selected && echo selected > chosen && git commit -am selected && git tag selected-tag && git checkout main
]])
            test.eq(built.status, "ready", built.log)
            for _, branch in ipairs({"", "selected", "selected-tag"}) do
                local name = "autocode-ref-" .. uuid.v7()
                containers[#containers + 1] = name
                local launch = {executable = "sh", argv = {"-c", 'test "$(cat chosen)" = ' .. (branch == "" and "main" or "selected")}, environment = {}, files = {}, readiness = "none"}
                local script = container.script({id = "env:KEY", variable = "KEY"}, "fixture", "/opt/agent", "/opt/agent/work", "/opt/agent/source", launch, 60, branch)
                local args = {"run", "--rm", "--name", name, "--network", "none", "--entrypoint", "sh"}
                for _, arg in ipairs({built.recipe.ref, "-c", container.entrypoint}) do args[#args + 1] = arg end
                local lines = {}
                local code, err = docker.run(args, {env = script.env, on_line = function(line) lines[#lines + 1] = line end})
                test.is_nil(err, tostring(err))
                test.eq(code, 0, table.concat(lines, "\n"))
            end
        end)
        test.it("runs the approved ID after another component replaces the shared tag and fails its probe", function()
            local generation = uuid.v7()
            local ref = "autocode-test-replaced:" .. generation
            references[#references + 1] = ref
            local first = build("a", generation, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=" .. generation .. "\n")
            test.eq(first.status, "ready", first.log)
            references[#references + 1] = first.recipe.ref
            local approved = output({"image", "inspect", "--format", "{{.Id}}", ref})
            local second = build("b", uuid.v7(), ref, "/proc/autocode", "FROM BASE\nLABEL autocode.test.generation=other-" .. generation .. "\n")
            test.eq(second.status, "failed", second.log)
            test.eq(output({"image", "inspect", "--format", "{{.Id}}", ref}), approved)
            local name = "autocode-pin-" .. generation
            containers[#containers + 1] = name
            output({"create", "--name", name, "--entrypoint", "sh", first.recipe.ref, "-c", ":"})
            test.eq(output({"container", "inspect", "--format", "{{.Image}}", name}), approved)
            test.eq(first.recipe.ref, approved)
            output({"start", "-a", name})
        end)
        test.it("approves each generation when B replaces the shared tag between A's build and inspection", function()
            local a, b, ga, gb = uuid.v7(), uuid.v7(), uuid.v7(), uuid.v7()
            local ref = "autocode-test-shared:" .. ga
            references[#references + 1] = ref
            local second
            local first = build(a, ga, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=" .. ga .. "\n", function()
                local saved = stubs.state
                second = build(b, gb, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=" .. gb .. "\n")
                stubs.state = saved
            end)
            test.eq(first.status, "ready", first.log)
            test.eq(second.status, "ready", second.log)
            test.eq(first.recipe.ref, output({"image", "inspect", "--format", "{{.Id}}", "chestor-autocode/" .. a .. ":" .. ga}))
            test.eq(first.recipe.ref, output({"image", "inspect", "--format", "{{.Id}}", ref}))
            test.is_true(first.recipe.ref ~= second.recipe.ref)
        end)
        test.it("keeps approved A launchable after B replaces the tag and dangling images are pruned", function()
            local generation = uuid.v7()
            local ref = "autocode-test-shared:" .. generation
            local a, b = uuid.v7(), uuid.v7()
            references[#references + 1] = ref
            local first = build(a, generation, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=" .. generation .. "\n")
            test.eq(first.status, "ready", first.log)
            local second_generation = uuid.v7()
            local second = build(b, second_generation, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=other-" .. generation .. "\n")
            test.eq(second.status, "ready", second.log)
            test.is_true(first.recipe.ref ~= second.recipe.ref)
            output({"image", "prune", "-f"})
            output({"run", "--rm", "--entrypoint", "sh", first.recipe.ref, "-c", ":"})
        end)
        test.it("releases the previous generation tag on rebuild while its container runs", function()
            local component, ga, gb = uuid.v7(), uuid.v7(), uuid.v7()
            local ref = "autocode-test-shared:" .. ga
            references[#references + 1] = ref
            local first = build(component, ga, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=" .. ga .. "\n")
            test.eq(first.status, "ready", first.log)
            local name = "autocode-retire-" .. ga
            containers[#containers + 1] = name
            output({"run", "-d", "--name", name, "--entrypoint", "sh", first.recipe.ref, "-c", "sleep 300"})
            local second = build(component, gb, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=" .. gb .. "\n")
            test.eq(second.status, "ready", second.log)
            local code = docker.run({"image", "inspect", "chestor-autocode/" .. component .. ":" .. ga})
            test.eq(code, 1)
            test.eq(output({"container", "inspect", "--format", "{{.State.Running}}", name}), "true")
            test.eq(output({"image", "inspect", "--format", "{{.Id}}", "chestor-autocode/" .. component .. ":" .. gb}), second.recipe.ref)
        end)
        test.it("removes repeated failed generation tags before maintenance while preserving approval", function()
            local component, approved_generation = uuid.v7(), uuid.v7()
            local ref = "autocode-test-failed:" .. approved_generation
            references[#references + 1] = ref
            local approved = build(component, approved_generation, ref, "/opt/agent", "FROM BASE\nLABEL autocode.test.generation=" .. approved_generation .. "\n")
            test.eq(approved.status, "ready", approved.log)
            local ids = {[approved.recipe.ref] = true}
            for attempt = 1, 3 do
                local generation = uuid.v7()
                local failed = build(component, generation, ref, "/proc/autocode", "FROM BASE\nLABEL autocode.test.generation=" .. generation .. "\n")
                test.eq(failed.status, "failed", failed.log)
                test.is_nil(ids[failed.recipe.ref])
                ids[failed.recipe.ref] = true
                test.eq(output({"ps", "-aq", "--filter", "name=^autocode-probe-" .. generation .. "$"}), "")
                test.eq(output({"image", "ls", "--format", "{{.Tag}}", "--filter", "reference=chestor-autocode/" .. component .. ":" .. generation}), "")
            end
            test.not_nil(maintenance.prune())
            output({"image", "prune", "-f"})
            test.eq(output({"image", "ls", "--format", "{{.Tag}}", "--filter", "reference=chestor-autocode/" .. component .. ":*"}), approved_generation)
            output({"run", "--rm", "--entrypoint", "sh", approved.recipe.ref, "-c", ":"})
        end)
        test.it("replaces its interrupted probe and prunes running probes of settled builds", function()
            local generation, component = uuid.v7(), uuid.v7()
            local name = "autocode-probe-" .. generation
            containers[#containers + 1] = name
            local function leftover()
                output({"run", "-d", "--name", name, "--label", "chestor.autocode", "--label", "chestor.autocode.probe=" .. generation,
                    "--label", "chestor.autocode.image=" .. component, "--entrypoint", "sh", base(), "-c", "sleep 300"})
            end
            leftover()
            local result = build(component, generation, base(), "/opt/agent")
            test.eq(result.status, "ready", result.log)
            test.eq(output({"ps", "-aq", "--filter", "name=^" .. name .. "$"}), "")
            leftover()
            local pruned, err = maintenance.prune()
            test.is_nil(err, tostring(err))
            test.not_nil(pruned)
            test.eq(output({"ps", "-aq", "--filter", "name=^" .. name .. "$"}), "")
            leftover()
            stubs.state.build.finished_at = ""
            stubs.state.build.job_live = false
            test.not_nil(maintenance.prune())
            test.eq(output({"ps", "-aq", "--filter", "name=^" .. name .. "$"}), "")
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

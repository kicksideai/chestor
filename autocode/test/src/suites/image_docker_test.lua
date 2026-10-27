-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local docker = require("docker")
local image = require("image")
local maintenance = require("maintenance")
local stubs = require("stubs")
local BASE = "chestor-autocode-harness:base"
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
                for variable in pairs(script.env) do args[#args + 1] = "-e"; args[#args + 1] = variable end
                for _, arg in ipairs({built.recipe.ref, "-c", 'eval "$AUTOCODE_SCRIPT"'}) do args[#args + 1] = arg end
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

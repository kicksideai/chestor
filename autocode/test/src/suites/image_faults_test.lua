-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local stubs = require("stubs")
local image = require("image_subject")
local resource_dto = require("resource_dto")
local json = require("json")
local function cases()
    test.describe("autocode image failures", function()
        test.it("uses the job deadline for image preparation, probes and tag cleanup", function()
            local state = stubs.reset()
            state.recipe = {ref = "image", home = "/home/agent", dockerfile = "FROM scratch", revision = 7,
                settings = {memory = "4g", cpus = "2", pids_limit = 1024, gpus = "", network = "none", extra_args = {}, allows = {}}}
            local deadline = "2999-01-01T00:00:00Z"
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}, job = {deadline = deadline}}).ok)
            test.is_true(#state.deadline_calls >= 5)
            for _, call in ipairs(state.deadline_calls) do test.eq(call.deadline, deadline, call.command) end
        end)
        test.it("projects build progress separately from approved generation usability", function()
            local resource = {id = "image", meta = {ref = "new:tag", title = "New label", status = "preparing"}, access = 15, owner = "owner"}
            local created = resource_dto.image(resource, nil)
            test.eq(created.status, "preparing")
            test.is_false(created.usable)
            test.eq(json.encode(created.agents), "[]")
            local state = stubs.reset()
            local function read() return resource_dto.image(resource, state.build) end
            test.eq(read().status, "preparing")
            test.is_false(read().usable)
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(read().status, "ready")
            test.is_true(read().usable)
            local approved = state.build.approved_recipe
            state.build = {build_id = "refresh", job_id = "job", identity = {actor_id = "owner", actor_context = "{}"},
                mode = "refresh", finished_at = "", status = "preparing", agents = {}, last_error = "", projected = false,
                approved_recipe = approved, approved_agents = {"claude"}}
            test.eq(read().status, "preparing")
            test.is_true(read().usable)
            test.eq(read().agents[1], "claude")
            test.eq(read().ref, "new:tag")
            test.eq(read().label, "New label")
            state.on_meta = function() test.eq(state.public.status, state.build.status) end
            test.is_true(image.main({payload = {image_id = "image", build_id = "refresh"}}).ok)
            test.eq(read().status, "ready")
            test.is_true(read().usable)
            approved = state.build.approved_recipe
            state.build.finished_at, state.build.projected, state.build.status = "", false, "preparing"
            state.build.mode = "refresh"
            state.docker_steps = {{lines = {"sha256:" .. string.rep("a", 64) .. " 1"}}, {code = 1}}
            test.is_true(image.main({payload = {image_id = "image", build_id = "refresh"}}).ok)
            test.eq(read().status, "failed")
            test.is_true(read().usable)
            test.eq(read().last_error, "pull failed")
            test.eq(state.build.approved_recipe, approved)
            test.eq(json.encode(read().agents), json.encode(state.build.approved_agents))
        end)
        test.it("repairs a finished build projection without rebuilding", function()
            local state = stubs.reset()
            state.build.finished_at, state.build.status, state.build.agents = "finished", "ready", {"claude"}
            state.projection_error = true
            test.is_false(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            state.projection_error = false
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.public.status, "ready")
            test.eq(state.fetches, 0)
        end)
        test.it("wakes image readers after projection commits and retries a failed wake without republishing", function()
            local state = stubs.reset()
            local seen = {}
            local function read()
                seen[#seen + 1] = resource_dto.image({id = "image", meta = state.public or {}, access = 15, owner = "owner"}, state.build).status
            end
            state.on_meta, state.on_image_notify = read, read
            state.image_notify_error = true
            test.is_false(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.is_true(state.build.projected)
            test.eq(seen[#seen], "ready")
            local projects, commands = state.projects, #state.commands
            state.image_notify_error = false
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(seen[1], "preparing")
            test.eq(seen[#seen], "ready")
            test.eq(state.image_notifies, 2)
            test.eq(state.projects, projects)
            test.eq(#state.commands, commands)
        end)
        test.it("retries failed-generation tag cleanup only after confirming probe termination", function()
            local state = stubs.reset()
            state.build.finished_at, state.build.status = "finished", "failed"
            state.generation_tags = {"chestor-autocode/image:approved", "chestor-autocode/image:generation"}
            state.remove_error = true
            test.is_false(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.is_false(state.build.projected)
            for _, command in ipairs(state.commands) do test.is_nil(command:find("image rm", 1, true)) end
            state.remove_error = false
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.is_true(state.build.projected)
            test.eq(state.commands[#state.commands], "image rm --force chestor-autocode/image:generation")
            for _, command in ipairs(state.commands) do test.is_nil(command:find("image rm --force chestor-autocode/image:approved", 1, true)) end
        end)
        test.it("rejects a stale image job before touching Docker", function()
            local state = stubs.reset()
            image.main({payload = {image_id = "image", build_id = "older"}})
            test.eq(state.fetches, 0)
        end)
        test.it("pins the fetched image ID in the recipe and uses its generation tag in both probes", function()
            local state = stubs.reset()
            state.docker_steps = {{lines = {"sha256:" .. string.rep("a", 64) .. " 0"}}, {}, {lines = {"sha256:" .. string.rep("a", 64)}}, {}, {}}
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.build.recipe.ref, "sha256:" .. string.rep("a", 64))
            test.not_nil(state.commands[4]:find("chestor-autocode/image:generation", 1, true))
            test.not_nil(state.commands[5]:find("chestor-autocode/image:generation", 1, true))
        end)
        test.it("builds and approves its generation tag when another build replaces the shared reference", function()
            local state = stubs.reset()
            state.recipe = stubs.recipe_fixture()
            state.recipe.ref, state.recipe.dockerfile, state.recipe.home = "shared:latest", "FROM base", "/opt/agent"
            state.interleave_build = true
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.build.status, "ready", state.build.log)
            test.eq(state.build.recipe.ref, "sha256:" .. string.rep("a", 64))
            test.not_nil(state.commands[1]:find("-t chestor-autocode/image:generation", 1, true))
            test.is_nil(state.commands[1]:find("-t shared:latest", 1, true))
            test.not_nil(table.concat(state.commands, "\n"):find("image tag chestor-autocode/image:generation shared:latest", 1, true))
            for _, command in ipairs(state.commands) do
                if command:sub(1, 4) == "run " then test.not_nil(command:find("chestor-autocode/image:generation", 1, true)) end
            end
        end)
        test.it("retires only previous tags of the same component after approval", function()
            local state = stubs.reset()
            state.generation_tags = {"chestor-autocode/image:old", "chestor-autocode/image:generation"}
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.commands[#state.commands], "image rm --force chestor-autocode/image:old")
        end)
        test.it("names and labels both probes and removes leftovers before each", function()
            local state = stubs.reset()
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.removed, 2)
            test.eq(state.removed_names[1], "autocode-probe-generation")
            local probes = 0
            for _, command in ipairs(state.commands) do
                if command:sub(1, 4) == "run " then
                    probes = probes + 1
                    test.not_nil(command:find("--name autocode-probe-generation", 1, true))
                    test.not_nil(command:find("--label chestor.autocode", 1, true))
                    test.not_nil(command:find("--label chestor.autocode.probe=generation", 1, true))
                    test.not_nil(command:find("--label chestor.autocode.image=image", 1, true))
                end
            end
            test.eq(probes, 2)
        end)
        test.it("refuses an image missing the base runtime tools", function()
            local state = stubs.reset()
            state.runtime_missing = true
            local outcome = image.main({payload = {image_id = "image", build_id = "generation"}})
            test.is_true(outcome.ok)
            test.eq(state.build.status, "failed")
            test.not_nil(state.build.last_error:find("runtime prerequisites", 1, true))
        end)
        test.it("refreshes a local-only image without pulling and records why", function()
            local state = stubs.reset()
            state.build.mode = "refresh"
            state.docker_steps = {{lines = {"sha256:" .. string.rep("a", 64) .. " 0"}}, {}, {lines = {"sha256:" .. string.rep("a", 64)}}, {}, {}}
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.build.status, "ready", state.build.log)
            test.eq(state.docker_commands[1], "image inspect --format {{.Id}} {{len .RepoDigests}} image")
            test.eq(#state.docker_steps, 0)
            for _, command in ipairs(state.commands) do test.is_nil(command:find("pull", 1, true), command) end
            test.not_nil(state.build.log:find("local-only image: re-probing without pulling", 1, true))
        end)
        test.it("pulls a registry-provenance image before probing it", function()
            local state = stubs.reset()
            state.build.mode = "refresh"
            state.docker_steps = {{lines = {"sha256:" .. string.rep("a", 64) .. " 1"}}, {lines = {"Digest: sha256:" .. string.rep("b", 64)}}, {}, {lines = {"sha256:" .. string.rep("a", 64)}}, {}, {}}
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.build.status, "ready", state.build.log)
            test.eq(state.docker_commands[2], "pull image")
            test.eq(state.docker_commands[3], "image tag image@sha256:" .. string.rep("b", 64) .. " chestor-autocode/image:generation")
            test.eq(#state.docker_steps, 0)
        end)
        test.it("fails a registry refresh when its pull fails", function()
            local state = stubs.reset()
            state.build.mode = "refresh"
            state.docker_steps = {{lines = {"sha256:" .. string.rep("a", 64) .. " 1"}}, {code = 1, lines = {"registry unavailable"}}}
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.build.status, "failed")
            test.eq(state.build.last_error, "pull failed")
            test.eq(state.docker_commands[2], "pull image")
            test.eq(#state.docker_steps, 0)
            test.not_nil(state.build.log:find("registry unavailable", 1, true))
        end)
        test.it("pulls a missing local image on refresh", function()
            local state = stubs.reset()
            state.build.mode = "refresh"
            state.docker_steps = {{code = 1}, {lines = {"Digest: sha256:" .. string.rep("b", 64)}}, {}, {lines = {"sha256:" .. string.rep("a", 64)}}, {}, {}}
            test.is_true(image.main({payload = {image_id = "image", build_id = "generation"}}).ok)
            test.eq(state.build.status, "ready", state.build.log)
            test.eq(state.docker_commands[2], "pull image")
            test.eq(state.docker_commands[3], "image tag image@sha256:" .. string.rep("b", 64) .. " chestor-autocode/image:generation")
            test.eq(#state.docker_steps, 0)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

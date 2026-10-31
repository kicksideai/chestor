-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The durable run path: a member's submission records the run with its job,
-- the runner resolves the member's identity, admits the run again under it
-- and settles it. A local Messages stream supplies a complete result; a
-- missing image settles as failed through the real worker. Runs stay their
-- owner's, and retention removes settled runs with their events.
local test = require("test")
local identity = require("identity")
local build_fixture = require("build_fixture")
local repo = require("repo")
local time = require("time")
local funcs = require("funcs")
local anthropic = require("anthropic")
local docker = require("docker")

local READ = 1
local SECRET = "sk-ant-harness-" .. string.rep("r", 32)

local function cases()
    test.describe("autocode runs", function()
        local users = {}
        local local_images = {}
        local components = {}
        local function track(user)
            users[#users + 1] = user
            return user
        end

        test.after_each(function()
            for _, component in ipairs(components) do
                local removed = identity.request(component.owner, "DELETE", "/autocode/images/" .. component.id)
                test.eq(removed.status, 200, removed.body)
            end
            components = {}
            for _, ref in ipairs(local_images) do
                local code, err = docker.run({"image", "rm", ref})
                test.is_nil(err)
                test.eq(code, 0)
            end
            local_images = {}
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)

        local function share(user, id, mask)
            local response = identity.request(user, "POST", "/component-access/share/" .. id,
                {subject_id = identity.MEMBERS, subject_type = "group", access_mask = mask})
            test.eq(response.status, 200, response.body)
        end

        local function setup(image_ref, endpoint, tools)
            local admin = track(identity.admin())
            local member = track(tools and identity.user({identity.SIGNED_IN, identity.MEMBERS, "app:coding_tools"}) or identity.member())
            local listed = identity.request(admin, "GET", "/autocode/catalog")
            local allows = {}
            for _, driver in ipairs(listed.json.agents) do
                if driver.id == "claude" then allows = driver.capabilities end
            end
            local settings = {network = endpoint and "bridge" or "none", allows = allows,
                extra_args = endpoint and {"--add-host", "host.docker.internal:host-gateway"} or {}}
            local image_id
            if image_ref then
                local created = identity.request(admin, "POST", "/autocode/images", {ref = image_ref, home = "/opt/agent",
                    network = settings.network, allows = settings.allows, extra_args = settings.extra_args})
                test.eq(created.status, 201, created.body)
                image_id = created.json.id
                components[#components + 1] = {owner = admin, id = image_id}
                local deadline = time.now():add("180s")
                while true do
                    local build = repo.image_build(image_id)
                    if build and build.finished_at ~= "" and build.projected then
                        test.eq(build.status, "ready", build.log)
                        break
                    end
                    if time.now():after(deadline) then error("image build does not finish") end
                    time.sleep("100ms")
                end
            else
                local err
                image_id, err = identity.call(admin, "app:fixture_register", "image", {title = "Missing image",
                    ref = "chestor-autocode-harness:missing", home = "/opt/agent", status = "ready", agents = {"claude"}, last_error = ""},
                    {dockerfile = "", settings = settings})
                test.is_nil(err)
                build_fixture.ready(image_id, admin.id, "/opt/agent", settings, identity.call(admin, "app:fixture_image_revision", image_id))
            end
            share(admin, image_id, READ)
            local created = identity.request(member, "POST", "/autocode/accounts",
                {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "Key", secret = SECRET, endpoint = endpoint})
            test.eq(created.status, 201, created.body)
            return member, image_id, created.json.id
        end

        -- settled waits for the runner to settle the run.
        local function settled(member, id, tools)
            local stored = repo.stored_run(id)
            test.not_nil(stored.job_id)
            local deadline = time.now():add("90s")
            while true do
                local response
                if tools then
                    local result, err = identity.call(member, "chestor.autocode.traits:read_coding_run", {run_id = id})
                    test.is_nil(err, tostring(err))
                    response = {json = result, body = "tool run " .. id}
                else
                    response = identity.request(member, "GET", "/autocode/runs/" .. id)
                    test.eq(response.status, 200, response.body)
                end
                local status = response.json.run.status
                if status ~= "queued" and status ~= "running" then
                    local job = require("jobs").get_job(stored.job_id)
                    if job.status ~= "running" then
                        test.eq(job.status, "pending")
                        test.is_nil(job.scheduled_at)
                        return response
                    end
                end
                if time.now():after(deadline) then error("run " .. id .. " did not settle: " .. status) end
                time.sleep("250ms")
            end
        end

        test.it("submits through the agent tool and reads the complete real runner result", function()
            local image_ref = "chestor-autocode-harness:claude"
            local output = {}
            local code, err = docker.run({"build", "-t", image_ref, "-"}, {stdin = [[
FROM node:22-bookworm-slim
RUN npm install -g @anthropic-ai/claude-code@2.1.307
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/agent && chown node:node /opt/agent
USER node
]], on_line = function(line) output[#output + 1] = line end})
            test.is_nil(err)
            test.eq(code, 0, table.concat(output, "\n"))
            local member, image_id, account_id = setup(image_ref, {protocol = "anthropic-messages",
                base_url = "http://invalid.invalid", model = "claude-sonnet-4-6"}, true)
            local changed = identity.request(member, "PUT", "/autocode/accounts/" .. account_id,
                {secret = "stale-credential"})
            test.eq(changed.status, 200, changed.body)
            local rotated = identity.request(member, "PUT", "/autocode/accounts/" .. account_id,
                {secret = SECRET, endpoint = {protocol = "anthropic-messages", base_url = identity.container_url() .. "/mock", model = "claude-sonnet-4-6"}})
            test.eq(rotated.status, 200, rotated.body)
            local submitted, submit_err = identity.call(member, "chestor.autocode.traits:submit_coding_task",
                {agent = "claude", image_id = image_id, account_id = account_id, prompt = "Return the fixture answer."})
            test.is_nil(submit_err, tostring(submit_err))
            local done = settled(member, submitted.run_id, true)
            test.eq(done.json.run.status, "succeeded", done.body)
            test.eq(done.json.run.result, anthropic.answer())
        end)

        test.it("re-prepares local settings under the saving manager and refreshes without a pull", function()
            local owner = track(identity.admin())
            local manager = track(identity.admin())
            local image_ref = "chestor-autocode-harness:local-" .. owner.id
            local_images[#local_images + 1] = image_ref
            local output = {}
            local code, err = docker.run({"build", "-t", image_ref, "-"}, {stdin = [[
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/agent && chown node:node /opt/agent
USER node
]], on_line = function(line) output[#output + 1] = line end})
            test.is_nil(err)
            test.eq(code, 0, table.concat(output, "\n"))
            local inspected = {}
            code, err = docker.run({"image", "inspect", "--format", "{{len .RepoDigests}}", image_ref},
                {on_line = function(line) inspected[#inspected + 1] = line end})
            test.is_nil(err)
            test.eq(code, 0)
            test.eq(table.concat(inspected, ""), "0")
            local created = identity.request(owner, "POST", "/autocode/images", {ref = image_ref})
            test.eq(created.status, 201, created.body)
            test.is_nil(created.json.build_error)
            local image_id = created.json.id
            local function ready(previous)
                local deadline = time.now():add("180s")
                while true do
                    local build = repo.image_build(image_id)
                    if build and build.build_id ~= previous and build.finished_at ~= "" and build.projected then
                        test.eq(build.status, "ready", build.log)
                        test.is_nil(build.log:find("$ docker pull", 1, true), build.log)
                        return build
                    end
                    if time.now():after(deadline) then error("image build does not finish") end
                    time.sleep("100ms")
                end
            end
            local initial_detail = identity.request(owner, "GET", "/autocode/images/" .. image_id)
            test.eq(initial_detail.json.image.status, "preparing", initial_detail.body)
            test.is_false(initial_detail.json.image.usable)
            local initial = ready()
            local ready_detail = identity.request(owner, "GET", "/autocode/images/" .. image_id)
            test.eq(ready_detail.json.image.status, "ready", ready_detail.body)
            test.is_true(ready_detail.json.image.usable)
            local granted = identity.request(owner, "POST", "/component-access/share/" .. image_id,
                {subject_id = manager.id, subject_type = "user", access_mask = 3})
            test.eq(granted.status, 200, granted.body)
            local updated = identity.request(manager, "PUT", "/autocode/images/" .. image_id, {memory = "8g"})
            test.eq(updated.status, 200, updated.body)
            local preparing = repo.image_build(image_id)
            test.is_true(preparing.build_id ~= initial.build_id)
            test.eq(preparing.status, "preparing")
            test.eq(preparing.mode, "initial")
            test.eq(preparing.identity.actor_id, manager.id)
            local refreshing = identity.request(manager, "GET", "/autocode/images/" .. image_id)
            test.eq(refreshing.json.image.status, "preparing", refreshing.body)
            test.is_true(refreshing.json.image.usable)
            test.eq(refreshing.json.image.ref, image_ref)
            local saved = ready(initial.build_id)
            test.eq(saved.recipe.settings.memory, "8g")
            test.eq(saved.recipe.revision, identity.call(manager, "app:fixture_image_revision", image_id))
            test.is_true(saved.recipe.revision > initial.recipe.revision)
            local refreshed = identity.request(manager, "POST", "/autocode/images/" .. image_id .. "/prepare")
            test.eq(refreshed.status, 200, refreshed.body)
            local fresh = ready(saved.build_id)
            test.eq(fresh.mode, "refresh")
            test.not_nil(fresh.log:find("local-only image: re-probing without pulling", 1, true), fresh.log)
            local failed_update = identity.request(manager, "PUT", "/autocode/images/" .. image_id, {ref = image_ref, home = "/proc/autocode"})
            test.eq(failed_update.status, 200, failed_update.body)
            local deadline = time.now():add("180s")
            repeat
                local build = repo.image_build(image_id)
                if build.build_id ~= fresh.build_id and build.finished_at ~= "" and build.projected then
                    test.eq(build.status, "failed", build.log)
                    test.eq(build.approved_recipe.ref, fresh.approved_recipe.ref)
                    break
                end
                test.is_false(time.now():after(deadline), "failed refresh does not settle")
                time.sleep("100ms")
            until false
            local failed_detail = identity.request(manager, "GET", "/autocode/images/" .. image_id)
            test.eq(failed_detail.json.image.status, "failed", failed_detail.body)
            test.is_true(failed_detail.json.image.usable)
            test.is_true(failed_detail.json.image.last_error ~= "")
            test.eq(failed_detail.json.image.agents[1], ready_detail.json.image.agents[1])
            local removed = identity.request(owner, "DELETE", "/autocode/images/" .. image_id .. "?remove=1")
            test.eq(removed.status, 200, removed.body)
            local_images = {}
        end)

        test.it("settles a submitted run through its job under the owner", function()
            local member, image_id = setup()
            local submitted = identity.request(member, "POST", "/autocode/runs",
                {agent = "claude", image_id = image_id, prompt = "say hello"})
            test.eq(submitted.status, 201, submitted.body)
            local done = settled(member, submitted.json.run_id)
            test.eq(done.json.run.status, "failed", done.body)
            test.not_nil(done.json.run.error:find("recorded image ID is no longer available", 1, true), done.json.run.error)
            test.is_nil(done.body:find(SECRET, 1, true), "the run record carries the credential")
            test.is_true(#done.json.events > 0, "the run recorded no events")
        end)

        test.it("keeps a run its owner's", function()
            local member, image_id = setup()
            local other = track(identity.member())
            local submitted = identity.request(member, "POST", "/autocode/runs",
                {agent = "claude", image_id = image_id, prompt = "say hello"})
            test.eq(submitted.status, 201, submitted.body)
            local id = submitted.json.run_id
            test.eq(identity.request(other, "GET", "/autocode/runs/" .. id).status, 404)
            test.eq(identity.request(other, "POST", "/autocode/runs/" .. id .. "/cancel").status, 404)
            settled(member, id)
            test.eq(identity.request(member, "POST", "/autocode/runs/" .. id .. "/cancel").status, 409)
        end)

        test.it("prunes settled runs with their events", function()
            local member, image_id = setup()
            local submitted = identity.request(member, "POST", "/autocode/runs",
                {agent = "claude", image_id = image_id, prompt = "say hello"})
            test.eq(submitted.status, 201, submitted.body)
            settled(member, submitted.json.run_id)
            local deleted, err = funcs.call("app:fixture_prune", time.now():add("1h"):utc():format_rfc3339())
            test.is_nil(err)
            test.is_true(deleted >= 1)
            test.eq(identity.request(member, "GET", "/autocode/runs/" .. submitted.json.run_id).status, 404)
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

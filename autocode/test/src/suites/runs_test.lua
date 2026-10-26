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
local registry = require("registry")

local READ = 1
local SECRET = "sk-ant-harness-" .. string.rep("r", 32)

local function cases()
    test.describe("autocode runs", function()
        local users = {}
        local function track(user)
            users[#users + 1] = user
            return user
        end

        test.after_each(function()
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)

        local function share(user, id, mask)
            local response = identity.request(user, "POST", "/component-access/share/" .. id,
                {subject_id = identity.MEMBERS, subject_type = "group", access_mask = mask})
            test.eq(response.status, 200, response.body)
        end

        local function setup(image_ref, endpoint)
            local admin = track(identity.admin())
            local member = track(identity.member())
            local listed = identity.request(admin, "GET", "/autocode/drivers")
            local allows = {}
            for _, driver in ipairs(listed.json.drivers) do
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
                build_fixture.ready(image_id, admin.id, "chestor-autocode-harness:missing", "/opt/agent", settings)
            end
            share(admin, image_id, READ)
            local created = identity.request(member, "POST", "/autocode/accounts",
                {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "Key", secret = SECRET, endpoint = endpoint})
            test.eq(created.status, 201, created.body)
            return member, image_id, created.json.id
        end

        -- settled waits for the runner to settle the run.
        local function settled(member, id)
            local deadline = time.now():add("90s")
            while true do
                local response = identity.request(member, "GET", "/autocode/runs/" .. id)
                test.eq(response.status, 200, response.body)
                local status = response.json.run.status
                if status ~= "queued" and status ~= "running" then return response end
                if time.now():after(deadline) then error("run " .. id .. " did not settle: " .. status) end
                time.sleep("250ms")
            end
        end

        test.it("runs a management-built image and stores the complete final answer", function()
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
                base_url = identity.container_url() .. "/mock", model = "claude-sonnet-4-6"})
            local submitted = identity.request(member, "POST", "/autocode/runs",
                {agent = "claude", image_id = image_id, account_id = account_id, prompt = "Return the fixture answer."})
            test.eq(submitted.status, 201, submitted.body)
            local done = settled(member, submitted.json.run_id)
            test.eq(done.json.run.status, "succeeded", done.body)
            test.eq(done.json.run.result, anthropic.answer())
        end)

        test.it("settles a submitted run through its job under the owner", function()
            local member, image_id = setup()
            local submitted = identity.request(member, "POST", "/autocode/runs",
                {agent = "claude", image_id = image_id, prompt = "say hello"})
            test.eq(submitted.status, 201, submitted.body)
            local done = settled(member, submitted.json.run_id)
            test.eq(done.json.run.status, "failed", done.body)
            test.not_nil(done.json.run.error:find("container create failed", 1, true), done.json.run.error)
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

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Run admission under the caller's grants: an image or workspace the caller
-- was not granted is unknown, a workspace mounts read-write only with WRITE,
-- admission skips disabled accounts and accepts shared subscription logins,
-- and repository URLs carry no credentials.
local test = require("test")
local identity = require("identity")
local build_fixture = require("build_fixture")
local repo = require("repo")
local sql = require("sql")
local json = require("json")

local READ = 1
local READ_WRITE = 3

local function cases()
    test.describe("autocode run admission", function()
        local users = {}
        local function track(user)
            users[#users + 1] = user
            return user
        end

        -- share grants the platform Members group access through the
        -- component share endpoint, as the share dialog does.
        local function share(user, id, mask)
            local response = identity.request(user, "POST", "/component-access/share/" .. id,
                {subject_id = identity.MEMBERS, subject_type = "group", access_mask = mask})
            if response.status ~= 200 then return response.body end
            return nil
        end

        test.after_each(function()
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)

        local function register(user, kind, meta, private)
            local id, err = identity.call(user, "app:fixture_register", kind, meta, private)
            test.is_nil(err)
            test.not_nil(id)
            return id
        end

        -- image registers a ready image that admits every capability the
        -- Claude Code driver declares, as a default image does.
        local function image(admin)
            local listed = identity.request(admin, "GET", "/autocode/catalog")
            test.eq(listed.status, 200, listed.body)
            local allows = {}
            for _, driver in ipairs(listed.json.agents) do
                if driver.id == "claude" then allows = driver.capabilities end
            end
            local id = register(admin, "image", {title = "Harness image", ref = "autocode-harness:ready", home = "/opt/agent",
                status = "ready", agents = {"claude"}, last_error = ""}, {dockerfile = "", settings = {network = "none", allows = allows}})
            local generation = build_fixture.ready(id, admin.id, "/opt/agent", {network = "none", allows = allows}, identity.call(admin, "app:fixture_image_revision", id))
            return id, generation
        end

        local function account(user, label, kind, enabled)
            return register(user, "account", {title = label, agent = "claude", credential_kind = kind,
                subscription = kind == "env:CLAUDE_CODE_OAUTH_TOKEN", enabled = enabled ~= false},
                {credential = "sk-ant-harness-" .. string.rep("a", 32)})
        end

        local function admit(user, request)
            request.agent = request.agent or "claude"
            return identity.call(user, "app:fixture_admit", request)
        end

        test.it("rejects an unsafe approved HOME at the admission boundary", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Key", "env:ANTHROPIC_API_KEY")
            local approved = repo.image_build(image_id).approved_recipe
            for _, home in ipairs({"/", "/workspace", "/workspace/child", "/opt/../workspace/child"}) do
                approved.home = home
                local db = sql.get("app:db")
                local _, write_err = db:execute("UPDATE chestor_autocode_image_builds SET approved_recipe = $1 WHERE image_id = $2", {json.encode(approved), image_id})
                db:release()
                test.is_nil(write_err)
                local value, err = admit(admin, {image_id = image_id})
                test.is_nil(value, home)
                test.not_nil(err)
            end
        end)
        test.it("refuses a member-registered image with forged ready metadata", function()
            local member = track(identity.member())
            local listed = identity.request(member, "GET", "/autocode/catalog")
            local allows = {}
            for _, driver in ipairs(listed.json.agents) do if driver.id == "claude" then allows = driver.capabilities end end
            local image_id = register(member, "image", {title = "Forged", ref = "forged:ready", home = "/opt/agent",
                status = "ready", agents = {"claude"}}, {settings = {network = "bridge", allows = allows, extra_args = {"--privileged"}}})
            account(member, "Key", "env:ANTHROPIC_API_KEY")
            local admitted, err = admit(member, {image_id = image_id})
            test.is_nil(admitted)
            test.is_true(errors.is(err, errors.INVALID), tostring(err))
        end)

        test.it("keeps the approved settings admitted while a replacement builds", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Key", "env:ANTHROPIC_API_KEY")
            test.not_nil(admit(admin, {image_id = image_id}))
            local edited = identity.request(admin, "PUT", "/autocode/images/" .. image_id, {home = "/opt/agent", memory = "8g"})
            test.eq(edited.status, 200, edited.body)
            local admitted, err = admit(admin, {image_id = image_id})
            test.is_nil(err, tostring(err))
            test.eq(admitted.image.memory, "4g")
        end)
        test.it("rejects a late ready write after a settings save starts a new build", function()
            local admin = track(identity.admin())
            local image_id, generation = image(admin)
            local edited = identity.request(admin, "PUT", "/autocode/images/" .. image_id, {home = "/opt/agent", memory = "8g"})
            test.eq(edited.status, 200, edited.body)
            local projected, err = identity.call(admin, "chestor.autocode.service:image_ready", {image_id = image_id, build_id = generation})
            test.is_nil(projected)
            test.is_true(errors.is(err, errors.CONFLICT), tostring(err))
            local detail = identity.request(admin, "GET", "/autocode/images/" .. image_id)
            test.eq(detail.status, 200, detail.body)
            test.eq(detail.json.image.status, "preparing", detail.body)
            test.is_true(detail.json.image.usable)
        end)
        test.it("keeps label-only edits admitted at the built recipe revision", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Key", "env:ANTHROPIC_API_KEY")
            local detail = identity.request(admin, "GET", "/autocode/images/" .. image_id)
            test.eq(detail.status, 200, detail.body)
            local body = detail.json.settings
            body.label, body.home = "Renamed", detail.json.image.home
            local edited = identity.request(admin, "PUT", "/autocode/images/" .. image_id, body)
            test.eq(edited.status, 200, edited.body)
            local admitted, err = admit(admin, {image_id = image_id})
            test.is_nil(err, tostring(err))
            test.not_nil(admitted)
        end)
        test.it("uses the build's agents, reference, home and settings", function()
            local member = track(identity.member())
            local listed = identity.request(member, "GET", "/autocode/catalog")
            local allows = {}
            for _, driver in ipairs(listed.json.agents) do if driver.id == "claude" then allows = driver.capabilities end end
            local image_id = register(member, "image", {title = "Changed", ref = "changed:untrusted", home = "/changed",
                status = "failed", agents = {}}, {settings = {network = "host", extra_args = {"--privileged"}}})
            build_fixture.ready(image_id, member.id, "/opt/agent", {network = "none", memory = "2g", allows = allows}, identity.call(member, "app:fixture_image_revision", image_id))
            account(member, "Key", "env:ANTHROPIC_API_KEY")
            local admitted, err = admit(member, {image_id = image_id})
            test.is_nil(err, tostring(err))
            test.eq(admitted.image.ref, "sha256:" .. string.rep("a", 64))
            test.eq(admitted.image.home, "/opt/agent")
            test.eq(admitted.image.network, "none")
            test.eq(admitted.image.memory, "2g")
            test.eq(#admitted.image.extra_args, 0)
        end)

        test.it("stores the maximum timeout and rejects the next millisecond", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Key", "env:ANTHROPIC_API_KEY")
            local admitted, err = admit(admin, {image_id = image_id, timeout = "168h"})
            test.is_nil(err, tostring(err))
            test.eq(admitted.timeout_ms, 604800000)
            local submitted = identity.request(admin, "POST", "/autocode/runs", {agent = "claude", image_id = image_id, prompt = "task", timeout = "168h"})
            test.eq(submitted.status, 201, submitted.body)
            local stored = identity.request(admin, "GET", "/autocode/runs/" .. submitted.json.run_id)
            test.eq(stored.json.run.timeout_ms, 604800000)
            local rejected, reject_err = admit(admin, {image_id = image_id, timeout = "168h1ms"})
            test.is_nil(rejected)
            test.is_true(errors.is(reject_err, errors.INVALID), tostring(reject_err))
        end)

        test.it("treats an image the caller was not granted as unknown", function()
            local admin = track(identity.admin())
            local member = track(identity.member())
            local image_id = image(admin)
            account(member, "Key", "env:ANTHROPIC_API_KEY")
            local _, err = admit(member, {image_id = image_id})
            test.not_nil(err)
            test.not_nil(tostring(err):find("select an image", 1, true), tostring(err))
            local share_err = share(admin, image_id, READ)
            test.is_nil(share_err)
            local admitted, admit_err = admit(member, {image_id = image_id})
            test.is_nil(admit_err)
            test.eq(admitted.image_id, image_id)
            test.is_true(admitted.timeout_ms >= 60000)
        end)

        test.it("mounts a workspace by the caller's grant", function()
            local admin = track(identity.admin())
            local member = track(identity.member())
            local image_id = image(admin)
            test.is_nil(share(admin, image_id, READ))
            account(member, "Key", "env:ANTHROPIC_API_KEY")
            local workspace_id = register(admin, "workspace", {title = "Repo"}, {host_path = "/srv/autocode-harness/repo"})

            local _, unknown = admit(member, {image_id = image_id, workspace_id = workspace_id})
            test.not_nil(unknown)
            test.not_nil(tostring(unknown):find("select a workspace", 1, true), tostring(unknown))

            test.is_nil(share(admin, workspace_id, READ))
            local read_only, read_err = admit(member, {image_id = image_id, workspace_id = workspace_id})
            test.is_nil(read_err)
            test.eq(read_only.workspace_writable, false)

            test.is_nil(share(admin, workspace_id, READ_WRITE))
            local writable, write_err = admit(member, {image_id = image_id, workspace_id = workspace_id})
            test.is_nil(write_err)
            test.eq(writable.workspace_writable, true)
        end)

        test.it("balances across enabled accounts the caller may use", function()
            local admin = track(identity.admin())
            local member = track(identity.member())
            local other = track(identity.member())
            local image_id = image(admin)
            test.is_nil(share(admin, image_id, READ))
            local personal = account(other, "Their login", "env:CLAUDE_CODE_OAUTH_TOKEN")
            test.is_nil(share(other, personal, READ))
            account(member, "Disabled", "env:ANTHROPIC_API_KEY", false)
            local enabled = account(member, "Enabled", "env:ANTHROPIC_API_KEY")

            local admitted, err = admit(member, {image_id = image_id})
            test.is_nil(err)
            test.is_true(admitted.account_id == enabled or admitted.account_id == personal)

            local named, named_err = admit(member, {image_id = image_id, account_id = personal})
            test.is_nil(named_err)
            test.eq(named.account_id, personal)
            local submitted = identity.request(member, "POST", "/autocode/runs", {
                agent = "claude", image_id = image_id, account_id = personal, prompt = "shared login"})
            test.eq(submitted.status, 201, submitted.body)
        end)

        test.it("refuses a repository URL with credentials", function()
            local admin = track(identity.admin())
            local member = track(identity.member())
            local image_id = image(admin)
            test.is_nil(share(admin, image_id, READ))
            account(member, "Key", "env:ANTHROPIC_API_KEY")
            local _, err = admit(member, {image_id = image_id, repo_url = "https://user:token@example.com/repo.git"})
            test.not_nil(err)
            test.not_nil(tostring(err):find("must not contain credentials", 1, true), tostring(err))
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

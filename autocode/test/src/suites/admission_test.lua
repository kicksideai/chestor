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
            if kind == "workspace" then
                local response = identity.request(user, "POST", "/autocode/workspaces", {name = meta.title, host_path = private.host_path})
                test.eq(response.status, 201, response.body)
                return response.json.id
            end
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

        local function account(user, label, enabled)
            return register(user, "account", {title = label, agent = "claude", credential_kind = "env:CLAUDE_CODE_OAUTH_TOKEN",
                subscription = true, enabled = enabled ~= false},
                {credential = "harness-oauth-" .. string.rep("a", 32)})
        end

        local function admit(user, request)
            request.agent = request.agent or "claude"
            return identity.call(user, "app:fixture_admit", request)
        end

        test.it("refuses submission and preparation while a workspace component is deleting", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Login")
            local path = identity.directory(admin, "deleting-workspace")
            local id = register(admin, "workspace", {title = "deleting"}, {host_path = path})
            local submitted = identity.request(admin, "POST", "/autocode/runs", {agent = "claude", image_id = image_id, workspace_id = id, prompt = "before deletion"})
            test.eq(submitted.status, 201, submitted.body)
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_components SET deleting_at = '2026-11-13T00:00:00Z' WHERE component_id = $1", {id}))
            db:release()
            local admitted, admit_err = admit(admin, {image_id = image_id, workspace_id = id})
            local prepared, prepare_err = identity.call(admin, "chestor.autocode.service:prepare", {run_id = submitted.json.run_id})
            local response = identity.request(admin, "POST", "/autocode/runs", {agent = "claude", image_id = image_id, workspace_id = id, prompt = "during deletion"})
            db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_components SET deleting_at = NULL WHERE component_id = $1", {id}))
            db:release()
            test.is_nil(admitted); test.not_nil(admit_err)
            test.is_nil(prepared); test.not_nil(prepare_err)
            test.eq(response.status, 409, response.body)
            test.not_nil(repo.admitted_workspace(id))
        end)
        test.it("refuses a member-created workspace without autocode admission provenance", function()
            local admin = track(identity.admin())
            local member = track(identity.member())
            local image_id = image(admin)
            test.is_nil(share(admin, image_id, READ))
            account(member, "Login")
            local path = identity.directory(admin, "forged-workspace")
            local id = identity.call(member, "app:fixture_register", "workspace", {title = "forged"}, {host_path = path})
            local admitted, err = admit(member, {image_id = image_id, workspace_id = id})
            test.is_nil(admitted)
            test.not_nil(err)
            test.eq(err:details().code, "autocode.workspace_approval_required")
            test.eq(err:message(), "workspace is not approved; ask an administrator to re-register it through Autocode")
        end)
        test.it("refuses shared parents before a nested rename and symlink attack can launch", function()
            local admin = track(identity.admin())
            local path = identity.directory(admin, "nested-attack")
            local host = require("host")
            test.not_nil(host.run({"mkdir", "-p", path .. "/child"}))
            local child = register(admin, "workspace", {title = "child"}, {host_path = path .. "/child"})
            local parent = identity.request(admin, "POST", "/autocode/workspaces", {name = "attacking parent", host_path = path})
            test.eq(parent.status, 400, parent.body)
            test.not_nil(parent.json.error:find("overlap", 1, true))
            test.not_nil(host.run({"mv", path .. "/child", path .. "/old"}))
            test.not_nil(host.run({"ln", "-s", "/etc", path .. "/child"}))
            account(admin, "Login")
            local value, err = admit(admin, {image_id = image(admin), workspace_id = child})
            test.is_nil(value); test.not_nil(err)
        end)
        test.it("refuses equal and descendant shared registrations", function()
            local admin = track(identity.admin())
            local path = identity.directory(admin, "shared-overlap")
            test.not_nil(require("host").run({"mkdir", "-p", path .. "/child"}))
            register(admin, "workspace", {title = "parent"}, {host_path = path})
            for _, candidate in ipairs({path, path .. "/child"}) do
                local response = identity.request(admin, "POST", "/autocode/workspaces", {name = "conflict", host_path = candidate})
                test.eq(response.status, 400, response.body)
                test.not_nil(response.json.error:find("overlap", 1, true))
            end
        end)
        test.it("serializes concurrent conflicting workspace approvals for shared paths", function()
            local admin = track(identity.admin())
            local path = identity.directory(admin, "concurrent-approval")
            for index = 1, 3 do
                local done = channel.new(2)
                local base = path .. "/" .. tostring(index)
                for number = 1, 2 do
                    coroutine.spawn(function()
                        local id = base .. tostring(number)
                        done:send({id = id, err = repo.approve_workspace(id, number == 1 and base or base .. "/child")})
                    end)
                end
                local a, b = done:receive(), done:receive()
                local successes = (a.err == nil and 1 or 0) + (b.err == nil and 1 or 0)
                test.is_nil(repo.delete_workspace(a.id)); test.is_nil(repo.delete_workspace(b.id))
                test.eq(successes, 1, "exactly one conflicting approval commits")
            end
        end)
        test.it("admits exactly one concurrent conflicting HTTP registration", function()
            local admin = track(identity.admin())
            local path = identity.directory(admin, "concurrent-registration")
            test.not_nil(require("host").run({"mkdir", "-p", path .. "/child"}))
            local done = channel.new(2)
            for _, candidate in ipairs({path, path .. "/child"}) do
                coroutine.spawn(function()
                    done:send(identity.request(admin, "POST", "/autocode/workspaces", {name = "concurrent", host_path = candidate}))
                end)
            end
            local a, b = done:receive(), done:receive()
            test.eq((a.status == 201 and 1 or 0) + (b.status == 201 and 1 or 0), 1)
            local rejected = a.status == 201 and b or a
            test.eq(rejected.status, 400, rejected.body)
            test.not_nil(rejected.json.error:find("overlap", 1, true))
        end)
        test.it("rechecks the approval set during workspace admission", function()
            local admin = track(identity.admin())
            local path = identity.directory(admin, "admission-overlap")
            local id = register(admin, "workspace", {title = "child"}, {host_path = path})
            local db = sql.get("app:db")
            assert(db:execute("INSERT INTO chestor_autocode_workspaces (component_id, host_path) VALUES ('corrupt-overlap', $1)", {path .. "/child"}))
            db:release()
            account(admin, "Login")
            local value, err = admit(admin, {image_id = image(admin), workspace_id = id})
            test.is_nil(repo.delete_workspace("corrupt-overlap"))
            test.is_nil(value); test.not_nil(err)
            test.not_nil(tostring(err):find("overlap", 1, true))
        end)
        test.it("resolves unset form options from catalog defaults and unattended presets", function()
            local admin = track(identity.admin())
            local catalog = identity.request(admin, "GET", "/autocode/catalog").json
            local default_mode, unattended_mode
            for _, driver in ipairs(catalog.agents) do
                if driver.id == "claude" then
                    unattended_mode = driver.unattended.permission_mode
                    for _, option in ipairs(driver.options) do
                        if option.name == "permission_mode" then default_mode = option.default end
                    end
                end
            end
            test.not_nil(default_mode)
            test.not_nil(unattended_mode)
            test.is_true(default_mode ~= unattended_mode)
            local image_id = image(admin)
            local account_id = account(admin, "Login")
            for _, unattended in ipairs({false, true}) do
                local submitted = identity.request(admin, "POST", "/autocode/runs", {agent = "claude", image_id = image_id,
                    account_id = account_id, prompt = "task", unattended = unattended, options = json.decode("{}")})
                test.eq(submitted.status, 201, submitted.body)
                local run = repo.stored_run(submitted.json.run_id)
                test.eq(run.options.permission_mode, unattended and unattended_mode or default_mode)
                test.eq(run.unattended, unattended)
            end
        end)
        test.it("preserves a saved empty Pi Tools override through admission and launch", function()
            local admin = track(identity.admin())
            local catalog = identity.request(admin, "GET", "/autocode/catalog").json
            local allows = {}
            for _, driver in ipairs(catalog.agents) do if driver.id == "pi" then allows = driver.capabilities end end
            local image_id = register(admin, "image", {title = "Pi", ref = "harness", home = "/opt/agent"}, {settings = {allows = allows}})
            build_fixture.ready(image_id, admin.id, "/opt/agent", {allows = allows}, identity.call(admin, "app:fixture_image_revision", image_id), {"pi"})
            local account_id = register(admin, "account", {title = "Key", agent = "pi", credential_kind = "env:OPENAI_API_KEY", enabled = true}, {credential = "test-key"})
            local added = identity.request(admin, "POST", "/autocode/profiles", {title = "No tools", agent = "pi", image_id = image_id,
                account_id = account_id, options = {tools = ""}})
            test.eq(added.status, 201, added.body)
            local listed = identity.request(admin, "GET", "/autocode/profiles")
            test.eq(listed.status, 200, listed.body)
            local saved
            for _, profile in ipairs(listed.json.profiles) do if profile.id == added.json.id then saved = profile end end
            test.not_nil(saved)
            test.eq(saved.options.tools, "")
            local submitted = identity.request(admin, "POST", "/autocode/runs", {profile_id = saved.id, prompt = "task"})
            test.eq(submitted.status, 201, submitted.body)
            local run = repo.stored_run(submitted.json.run_id)
            test.eq(run.options.tools, "")
            local prepared, err = identity.call(admin, "chestor.autocode.service:prepare", {run_id = run.id})
            test.is_nil(err, tostring(err))
            local no_tools = false
            for _, argument in ipairs(prepared.launch.argv) do if argument == "--no-tools" then no_tools = true end end
            test.is_true(no_tools, "empty Pi Tools must launch without built-in tools")
        end)
        test.it("lets explicit options override unattended presets for two catalog harnesses", function()
            local admin = track(identity.admin())
            local catalog = identity.request(admin, "GET", "/autocode/catalog").json
            for _, example in ipairs({{agent = "claude", kind = "env:CLAUDE_CODE_OAUTH_TOKEN", key = "permission_mode", value = "acceptEdits"},
                {agent = "codex", kind = "env:CODEX_API_KEY", key = "dangerously_bypass_approvals_and_sandbox", value = false}}) do
                local allows = {}
                for _, driver in ipairs(catalog.agents) do if driver.id == example.agent then allows = driver.capabilities end end
                local image_id = register(admin, "image", {title = "Both", ref = "harness", home = "/opt/agent"}, {settings = {allows = allows}})
                build_fixture.ready(image_id, admin.id, "/opt/agent", {allows = allows}, identity.call(admin, "app:fixture_image_revision", image_id), {example.agent})
                local account_id = register(admin, "account", {title = "Account", agent = example.agent, credential_kind = example.kind,
                    subscription = example.agent == "claude", enabled = true}, {credential = "test-credential"})
                local submitted = identity.request(admin, "POST", "/autocode/runs", {agent = example.agent, image_id = image_id,
                    account_id = account_id, prompt = "task", options = {[example.key] = example.value}})
                test.eq(submitted.status, 201, submitted.body)
                local run = repo.stored_run(submitted.json.run_id)
                test.eq(run.options[example.key], example.value)
                test.is_true(run.unattended)
                local prepared, prepare_err = identity.call(admin, "chestor.autocode.service:prepare", {run_id = run.id})
                test.is_nil(prepare_err, tostring(prepare_err))
                test.not_nil(prepared)
            end
        end)
        test.it("rejects an unsafe approved HOME at the admission boundary", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Login")
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
                status = "ready", agents = {"claude"}}, {settings = {network = "bridge", allows = allows, extra_args = {"--add-host", "ignored:127.0.0.1"}}})
            account(member, "Login")
            local admitted, err = admit(member, {image_id = image_id})
            test.is_nil(admitted)
            test.is_true(errors.is(err, errors.INVALID), tostring(err))
        end)

        test.it("keeps the approved settings admitted while a replacement builds", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Login")
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
            account(admin, "Login")
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
                status = "failed", agents = {}}, {settings = {network = "host", extra_args = {"--add-host", "ignored:127.0.0.1"}}})
            build_fixture.ready(image_id, member.id, "/opt/agent", {network = "none", memory = "2g", allows = allows}, identity.call(member, "app:fixture_image_revision", image_id))
            account(member, "Login")
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
            account(admin, "Login")
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
            account(member, "Login")
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
            account(member, "Login")
            local workspace_id = register(admin, "workspace", {title = "Repo"}, {host_path = identity.directory(admin, "repo")})

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
            local personal = account(other, "Their login")
            test.is_nil(share(other, personal, READ))
            account(member, "Disabled", false)
            local enabled = account(member, "Enabled")

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

        test.it("keeps literal query and fragment characters in SCP-style repository paths", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Login")
            for _, repository in ipairs({"git@git.example:team/release#1.git", "git@git.example:team/release?1.git"}) do
                local prepared, err = admit(admin, {image_id = image_id, repo_url = repository})
                test.is_nil(err, tostring(err))
                test.not_nil(prepared)
                local submitted = identity.request(admin, "POST", "/autocode/runs", {agent = "claude", image_id = image_id, repo_url = repository, prompt = "literal repository"})
                test.eq(submitted.status, 201, submitted.body)
                test.eq(repo.stored_run(submitted.json.run_id).repo_url, repository)
            end
        end)
        test.it("continues refusing URL queries and fragments", function()
            local admin = track(identity.admin())
            local image_id = image(admin)
            account(admin, "Login")
            for _, repository in ipairs({"https://git.example/team/release.git#1", "https://git.example/team/release.git?1"}) do
                local prepared, err = admit(admin, {image_id = image_id, repo_url = repository})
                test.is_nil(prepared)
                test.not_nil(tostring(err):find("must not contain query or fragment", 1, true), tostring(err))
            end
        end)
        test.it("refuses a repository URL with credentials", function()
            local admin = track(identity.admin())
            local member = track(identity.member())
            local image_id = image(admin)
            test.is_nil(share(admin, image_id, READ))
            account(member, "Login")
            local _, err = admit(member, {image_id = image_id, repo_url = "https://user:token@example.com/repo.git"})
            test.not_nil(err)
            test.not_nil(tostring(err):find("must not contain credentials", 1, true), tostring(err))
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

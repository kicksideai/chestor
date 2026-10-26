-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Run admission under the caller's grants: an image or workspace the caller
-- was not granted is unknown, a workspace mounts read-write only with WRITE,
-- balancing skips disabled accounts and other people's subscription logins,
-- and repository URLs carry no credentials.
local test = require("test")
local identity = require("identity")

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
            local listed = identity.request(admin, "GET", "/autocode/drivers")
            test.eq(listed.status, 200, listed.body)
            local allows = {}
            for _, driver in ipairs(listed.json.drivers) do
                if driver.id == "claude" then allows = driver.capabilities end
            end
            return register(admin, "image", {title = "Harness image", ref = "autocode-harness:ready", home = "/opt/agent",
                status = "ready", agents = {"claude"}, last_error = ""}, {dockerfile = "", settings = {network = "none", allows = allows}})
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
            test.eq(admitted.account_id, enabled)

            local _, named = admit(member, {image_id = image_id, account_id = personal})
            test.not_nil(named)
            test.not_nil(tostring(named):find("personal subscription login", 1, true), tostring(named))
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

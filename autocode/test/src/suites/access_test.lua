-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Module access through the authenticated router: the endpoint firewall admits
-- members to member endpoints, refuses signed-in users outside the member
-- group, and keeps management endpoints to administrators.
local test = require("test")
local identity = require("identity")

local MEMBER_READS = {"/autocode/catalog", "/autocode/accounts"}
local CATALOG = "chestor.autocode.api:catalog.user.endpoint"

local function cases()
    test.describe("autocode module access", function()
        local users = {}
        local function track(user)
            users[#users + 1] = user
            return user
        end

        test.after_each(function()
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)

        for _, path in ipairs(MEMBER_READS) do
            test.it("admits a member to GET " .. path, function()
                local response = identity.request(track(identity.member()), "GET", path)
                test.eq(response.status, 200, response.body)
                test.eq(response.json.success, true, response.body)
            end)

            test.it("refuses an outsider on GET " .. path, function()
                local response = identity.request(track(identity.outsider()), "GET", path)
                test.eq(response.status, 403, response.body)
            end)

            test.it("refuses an anonymous GET " .. path, function()
                local response = identity.request(nil, "GET", path)
                test.eq(response.status, 401, response.body)
            end)
        end

        test.it("refuses a member on POST /autocode/images", function()
            local response = identity.request(track(identity.member()), "POST", "/autocode/images",
                {ref = "autocode-harness:refused", label = "Refused"})
            test.eq(response.status, 403, response.body)
        end)

        test.it("calls functions under the session actor and scope", function()
            local member = track(identity.member())
            local seen, err = identity.call(member, "app:session_probe", CATALOG)
            test.is_nil(err)
            test.eq(seen.actor, member.id)
            test.eq(seen.access, true)

            local outsider = track(identity.outsider())
            seen, err = identity.call(outsider, "app:session_probe", CATALOG)
            test.is_nil(err)
            test.eq(seen.actor, outsider.id)
            test.eq(seen.access, false)
        end)

        test.it("reports image management to an administrator only", function()
            local member = identity.request(track(identity.member()), "GET", "/autocode/catalog")
            test.eq(member.status, 200, member.body)
            test.eq(member.json.can_images, false)
            test.eq(member.json.can_workspaces, false)
            test.eq(member.json.can_prune, false)
            local admin = identity.request(track(identity.admin()), "GET", "/autocode/catalog")
            test.eq(admin.status, 200, admin.body)
            test.eq(admin.json.can_images, true)
            test.eq(admin.json.can_workspaces, true)
            test.eq(admin.json.can_prune, true)
        end)

        test.it("loads management data without the member group", function()
            local manager = track(identity.user({identity.SIGNED_IN, "app:autocode_managers"}))
            local catalog = identity.request(manager, "GET", "/autocode/catalog")
            test.eq(catalog.status, 200, catalog.body)
            test.eq(catalog.json.can_images, true)
            test.is_true(#catalog.json.agents > 0)
            for _, resource in ipairs({"chestor.autocode:ui_static", "chestor.autocode:settings_tab_view"}) do
                local seen, err = identity.call(manager, "app:session_probe", resource)
                test.is_nil(err)
                test.eq(seen.access, true, resource)
            end
            for _, path in ipairs({"/autocode/images", "/autocode/workspaces"}) do
                local response = identity.request(manager, "GET", path)
                test.eq(response.status, 200, response.body)
            end
            local created = identity.request(manager, "POST", "/autocode/workspaces",
                {name = "Managed workspace", host_path = "/srv/autocode-harness/managed"})
            test.eq(created.status, 201, created.body)
            local deleted = identity.request(manager, "DELETE", "/autocode/workspaces/" .. created.json.id)
            test.eq(deleted.status, 200, deleted.body)
        end)

        test.it("reports workspace management independently of image management", function()
            local manager = track(identity.user({identity.SIGNED_IN, identity.MEMBERS, "app:workspace_managers"}))
            local catalog = identity.request(manager, "GET", "/autocode/catalog")
            test.eq(catalog.status, 200, catalog.body)
            test.eq(catalog.json.can_images, false)
            test.eq(catalog.json.can_workspaces, true)
            test.eq(catalog.json.can_prune, false)
        end)

        test.it("gives members no direct cleanup or credential worker calls", function()
            local member = track(identity.member())
            for _, resource in ipairs({"chestor.autocode.components:delete_account", "chestor.autocode.components:delete_image",
                "chestor.autocode.components:delete_workspace", "chestor.autocode.runner:prepare",
                "chestor.autocode.runner:keep_credential"}) do
                local seen, err = identity.call(member, "app:session_probe", resource, "funcs.call")
                test.is_nil(err)
                test.eq(seen.access, false, resource)
            end
        end)

        test.it("refuses caller-supplied cleanup context", function()
            local member = track(identity.member())
            local id, register_err = identity.call(member, "app:fixture_register", "workspace", {title = "Own workspace"}, {})
            test.is_nil(register_err)
            for _, kind in ipairs({"account", "image", "workspace"}) do
                local result, err = identity.call(member, "app:fixture_cleanup", {kind = kind, id = id})
                test.is_nil(result)
                test.not_nil(err)
                test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            end
        end)

        test.it("shows host workspace roots only to workspace managers", function()
            local member = identity.request(track(identity.member()), "GET", "/autocode/workspaces")
            test.eq(member.status, 200, member.body)
            test.is_nil(member.json.roots)
            local manager = identity.request(track(identity.admin()), "GET", "/autocode/workspaces")
            test.eq(manager.status, 200, manager.body)
            test.is_true(#manager.json.roots > 0)
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

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
        local users, references = {}, {}
        local function track(user)
            users[#users + 1] = user
            return user
        end

        test.after_each(function()
            for _, ref in ipairs(references) do require("docker").run({"image", "rm", ref}) end
            references = {}
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)

        test.it("refuses workspace registration through the module by a member", function()
            local user = track(identity.member())
            local response = identity.request(user, "POST", "/autocode/workspaces", {name = "Bypass", host_path = "/"})
            test.eq(response.status, 403, response.body)
        end)
        for _, kind in ipairs({"workspace", "image"}) do
            test.it("refuses direct member registration of a closed " .. kind .. " kind", function()
                local member = track(identity.member())
                local result, err = identity.call(member, "app:direct_register", kind, {title = "bypass"}, {})
                test.is_nil(result, "members must use Autocode admission for " .. kind)
                test.not_nil(err)
            end)
            test.it("refuses direct member writes to a shared closed " .. kind .. " kind", function()
                local admin, member = track(identity.admin()), track(identity.member())
                local id = assert(identity.call(admin, "app:fixture_register", kind, {title = "managed"}, {}))
                test.eq(identity.request(admin, "POST", "/component-access/share/" .. id,
                    {subject_type = "user", subject_id = member.id, access_mask = 15}).status, 200)
                for _, change in ipairs({{meta = {title = "bypass"}}, {context = {host_path = "/", dockerfile = "FROM scratch"}}}) do
                    change.id, change.kind = id, kind
                    local result, err = identity.call(member, "app:direct_patch", change)
                    test.is_nil(result, "WRITE and ADMIN must not bypass " .. kind .. " admission")
                    test.not_nil(err)
                end
            end)
        end
        test.it("removes fixture directories when their owning identity is released", function()
            local user = identity.admin()
            local path = identity.directory(user, "cleanup")
            identity.release(user)
            local removed, err = require("host").run({"test", "!", "-e", path})
            test.is_nil(err, tostring(err)); test.not_nil(removed)
        end)
        test.it("limits member registry reads to declared execution and discovery entries", function()
        local user = track(identity.member())
        for _, id in ipairs({"chestor.autocode.migrations:01_create_tables", "chestor.autocode.security:worker_runtime", "chestor.autocode.infrastructure:future_entry"}) do
            local result, err = identity.call(user, "app:session_probe", id, "registry.get")
            test.is_nil(err, tostring(err))
            test.is_false(result.access, id)
        end
        local allowed = identity.call(user, "app:session_probe", "chestor.autocode:autocode_view", "registry.get")
        test.is_true(allowed.access)
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
                {name = "Managed workspace", host_path = identity.directory(manager, "managed")})
            test.eq(created.status, 201, created.body)
            local deleted = identity.request(manager, "DELETE", "/autocode/workspaces/" .. created.json.id)
            test.eq(deleted.status, 200, deleted.body)
        end)

        for _, member in ipairs({false, true}) do
            test.it("registers workspaces through the component contract for a " .. (member and "member" or "non-member") .. " manager", function()
                local groups = {identity.SIGNED_IN, "app:autocode_managers"}
                if member then groups[#groups + 1] = identity.MEMBERS end
                local manager = track(identity.user(groups))
                local created = identity.request(manager, "POST", "/autocode/workspaces",
                    {name = "Managed workspace", host_path = identity.directory(manager, "managed")})
                test.eq(created.status, 201, created.body)
                test.not_nil(created.json.id)
                local ambient = identity.call(manager, "app:session_probe", "chestor.autocode.components:workspace", "component.kind.create")
                test.is_false(ambient.access, "kind authority belongs only to the admission entry")
                local deleted = identity.request(manager, "DELETE", "/autocode/workspaces/" .. created.json.id)
                test.eq(deleted.status, 200, deleted.body)
            end)
        end

        test.it("reports workspace management independently of image management", function()
            local manager = track(identity.user({identity.SIGNED_IN, identity.MEMBERS, "app:workspace_managers"}))
            local catalog = identity.request(manager, "GET", "/autocode/catalog")
            test.eq(catalog.status, 200, catalog.body)
            test.eq(catalog.json.can_images, false)
            test.eq(catalog.json.can_workspaces, true)
            test.eq(catalog.json.can_prune, false)
        end)

        test.it("keeps all management handlers in the single declared management capability", function()
            local workspace_only = track(identity.user({identity.SIGNED_IN, identity.MEMBERS, "app:workspace_managers"}))
            for _, resource in ipairs({"chestor.autocode.api:workspaces_create", "chestor.autocode.api:maintenance_prune"}) do
                local seen, err = identity.call(workspace_only, "app:session_probe", resource, "funcs.call")
                test.is_nil(err)
                test.eq(seen.access, false, resource)
            end
            local manager = track(identity.user({identity.SIGNED_IN, "app:autocode_managers"}))
            for _, resource in ipairs({"chestor.autocode.api:images_create.endpoint", "chestor.autocode.api:workspaces_create.endpoint",
                "chestor.autocode.api:maintenance_prune.endpoint", "chestor.autocode:settings_tab_view"}) do
                local seen, err = identity.call(manager, "app:session_probe", resource)
                test.is_nil(err)
                test.eq(seen.access, true, resource)
            end
        end)

        test.it("rechecks image management even when the requester still owns the image", function()
            local member = track(identity.member())
            local id, register_err = identity.call(member, "app:fixture_register", "image", {ref = "owned:latest", home = "/opt/agent"}, {dockerfile = "FROM scratch"})
            test.is_nil(register_err)
            local recipe, err = identity.call(member, "app:image_recipe_probe", {image_id = id})
            test.is_nil(recipe)
            test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            local admin = track(identity.admin())
            local own = identity.call(admin, "app:fixture_register", "image", {ref = "allowed:latest", home = "/opt/agent"}, {dockerfile = "FROM scratch"})
            local allowed, allowed_err = identity.call(admin, "app:image_recipe_probe", {image_id = own})
            test.is_nil(allowed_err)
            test.eq(allowed.dockerfile, "FROM scratch")
        end)
        test.it("member component deletion cannot remove a foreign Docker reference", function()
            local member = track(identity.member())
            local foreign = "autocode-foreign:" .. require("uuid").v7()
            references[#references + 1] = foreign
            local code, tag_err = require("docker").run({"build", "-t", foreign, "-"}, {stdin = "FROM debian:bookworm-slim\n"})
            test.is_nil(tag_err); test.eq(code, 0)
            local id = identity.call(member, "app:fixture_register", "image", {title = "owned", ref = "unbuilt:own", home = "/opt/agent"}, {})
            local deleted, delete_err = identity.call(member, "app:fixture_delete_component", {id = id, options = {remove_ref = foreign}})
            test.is_nil(delete_err, tostring(delete_err)); test.not_nil(deleted)
            local finished, finish_err = require("deletion_worker").await(id)
            test.is_nil(finish_err, tostring(finish_err)); test.is_true(finished)
            local present, inspect_err = require("docker").run({"image", "inspect", foreign})
            test.is_nil(inspect_err); test.eq(present, 0)
        end)
        test.it("gives members no direct cleanup or credential worker calls", function()
            local member = track(identity.member())
            for _, resource in ipairs({"chestor.autocode.components:delete_account", "chestor.autocode.components:delete_image",
                "chestor.autocode.components:delete_workspace", "chestor.autocode.service:prepare",
                "chestor.autocode.service:keep_credential"}) do
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

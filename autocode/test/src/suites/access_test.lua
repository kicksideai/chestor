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
            test.eq(member.json.manage, false)
            local admin = identity.request(track(identity.admin()), "GET", "/autocode/catalog")
            test.eq(admin.status, 200, admin.body)
            test.eq(admin.json.manage, true)
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

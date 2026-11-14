-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local repo = require("repo")
local process = require("process")
local time = require("time")
local channel = require("channel")
local function cases()
    test.describe("autocode idle queue expiry", function()
        local f = require("contract_fixture").new()
        local pid, mailbox, admin
        test.after_each(function()
            if pid then process.terminate(pid); pid = nil end
            if mailbox then process.unlisten(mailbox); mailbox = nil end
            process.registry.unregister("app:idle_queue_probe", process.registry.CONSISTENT)
            if admin then identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = "queue_timeout"}) end
            f.release()
        end)
        test.it("expires an admitted queue on Core's deadline with no later activity", function()
            admin = identity.admin(); f.users[#f.users + 1] = admin
            local member = f.member()
            local account = f.call(member, "add_account", {agent = "claude", label = "idle queue", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local image = f.image_for(member)
            test.eq(identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = "queue_timeout", value = "2s"}).status, 200)
            mailbox = process.listen("idle_queue_pass")
            test.is_true(process.registry.register("app:idle_queue_probe", nil, process.registry.CONSISTENT))
            local spawn_err
            pid, spawn_err = process.spawn("kickside.core.retention.service:sweeper_process", "app:processes")
            test.is_nil(spawn_err, tostring(spawn_err)); test.not_nil(pid)
            local boot = channel.select({mailbox:case_receive(), time.after("10s"):case_receive()})
            test.eq(boot.channel, mailbox, "Core completed its empty Autocode boot scan")
            -- Admission uses the real service and notifier. Its Jobs adapter schedules
            -- execution one hour away, so workers cannot provide the expiry wake.
            local id, err = identity.call(member, "app:fixture_scheduled_task", {agent = "claude", account_id = account.id,
                image_id = image, options = {}, prompt = "idle queue", repo_url = ""})
            test.is_nil(err, tostring(err)); test.not_nil(id)
            local admitted = assert(repo.stored_run(id))
            test.eq(admitted.status, "queued")
            -- The full harness can still be finishing other owners' boot
            -- callbacks when our probe reports its empty Autocode scan.
            local timeout = time.after("10s")
            repeat
                local wake = channel.select({mailbox:case_receive(), timeout:case_receive()})
                test.eq(wake.channel, mailbox, "admission wakes the sleeping Core retention service")
                if wake.value.kind == "autocode_queue" then break end
            until false
            -- No calls, database writes, Jobs nudges or manual retention callbacks.
            time.sleep("4s")
            local expired = assert(repo.stored_run(id))
            test.eq(expired.status, "failed")
            test.eq(expired.error_native.details.code, "autocode.queue_expired")
        end)
    end)
end
return {run = test.run_cases(cases)}

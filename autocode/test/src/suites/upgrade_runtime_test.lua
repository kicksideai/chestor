-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local repo = require("repo")
local jobs = require("jobs")
local sql = require("sql")
local time = require("time")
local process = require("process")
local identity = require("identity")
local docker = require("docker")
local function fixture(kind)
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT id FROM chestor_autocode_runs WHERE prompt LIKE $1", {"upgrade-%-" .. kind}))
    db:release()
    test.eq(#rows, 1)
    return assert(repo.stored_run(rows[1].id))
end
local function cases()
    test.describe("autocode released upgrade through live services", function()
        local admin, pid
        test.after_each(function()
            if pid then process.terminate(pid); pid = nil end
            if admin then
                identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = "queue_timeout"})
                identity.release(admin); admin = nil
            end
        end)
        test.it("expires the upgraded approval-parked run on Core's deadline", function()
            local run = fixture("parked")
            local job = assert(jobs.get_job(run.job_id))
            local recovered_by = time.now():add("10s")
            -- The marker commits before the worker returns its park outcome.
            while (run.dispatch_state ~= "waiting" or job.status ~= "pending" or job.scheduled_at ~= nil
                or job.wake_enabled == true or job.wake_enabled == 1) and time.now():before(recovered_by) do
                time.sleep("100ms")
                run = assert(repo.stored_run(run.id))
                job = assert(jobs.get_job(run.job_id))
            end
            test.eq(run.dispatch_state, "waiting")
            test.eq(run.status, "queued")
            test.is_true(tonumber(job.execution_seq) >= 1, "the real Jobs worker established Docker absence")
            test.eq(job.status, "pending")
            test.is_nil(job.scheduled_at)
            test.is_false(job.wake_enabled == true or job.wake_enabled == 1)
            admin = identity.admin()
            test.eq(identity.request(admin, "PUT", "/settings", {namespace = "chestor.autocode", key = "queue_timeout", value = "3s"}).status, 200)
            -- Set the fixture's clock to now before booting the real Core service.
            local db = assert(sql.get("app:db"))
            local created_at = repo.now()
            local expected_deadline = assert(time.parse(time.RFC3339, created_at)):add("3s")
            assert(db:execute("UPDATE chestor_autocode_runs SET created_at = $1 WHERE id = $2", {created_at, run.id}))
            db:release()
            local err
            pid, err = process.spawn("kickside.core.retention.service:sweeper_process", "app:processes")
            test.is_nil(err, tostring(err)); test.not_nil(pid)
            -- No later write, nudge, retention call or runner invocation.
            time.sleep("6s")
            local expired = assert(repo.stored_run(run.id))
            test.eq(expired.status, "failed")
            test.eq(expired.error_native.details.code, "autocode.queue_expired")
            local finished = assert(time.parse(time.RFC3339, expired.finished_at))
            test.is_false(finished:before(expected_deadline), "settled " .. expired.finished_at
                .. " before queue deadline " .. expected_deadline:format_rfc3339())
            test.eq(#assert(jobs.get_jobs({run.job_id})), 0)
        end)
        test.it("recovers an upgraded possibly-created run through Jobs and removes its container", function()
            for _, kind in ipairs({"inherited", "created", "started", "pending", "running", "approved"}) do
                local run = fixture(kind)
                local deadline = time.now():add("10s")
                while (run.status == "queued" or run.status == "running") and time.now():before(deadline) do
                    time.sleep("100ms")
                    run = assert(repo.stored_run(run.id))
                end
                test.eq(run.dispatch_state, "creating")
                test.eq(run.status, kind == "pending" and "cancelled" or "failed")
                if kind == "pending" then
                    test.eq(run.result, "kept 界🙂")
                    test.eq(run.error, "saved cancellation")
                else test.not_nil(run.error:find("runner stopped", 1, true), run.error) end
                test.eq(run.started_at, kind == "started" and "2026-01-01T00:01:00Z" or "", "recovery must never start execution")
                local job = assert(jobs.get_job(run.job_id))
                test.is_true(tonumber(job.execution_seq) >= 1, "the real Jobs worker dispatched recovery")
                local remaining = {}
                test.eq(docker.run({"ps", "-aq", "--filter", "name=^chestor-autocode-" .. run.id .. "$"},
                    {on_line = function(line) remaining[#remaining + 1] = line end}), 0)
                test.eq(#remaining, 0)
            end
        end)
    end)
end
return {run = test.run_cases(cases)}

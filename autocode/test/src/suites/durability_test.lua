-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local repo = require("repo")
local jobs = require("jobs")
local uuid = require("uuid")
local time = require("time")
local function cases()
    test.describe("autocode real job exhaustion", function()
        local user
        test.after_each(function() if user then require("identity").release(user); user = nil end end)
        test.it("settles a workflow run after its real two-attempt cleanup budget", function()
            user = require("identity").admin()
            local owner = user.id
            local id, err = repo.create_run(owner, {actor_id = owner, actor_context = "{}"},
                {agent = "claude", account_id = uuid.v7(), image_id = uuid.v7(), options = {}, unattended = true,
                    repo_url = "", prompt = "task", timeout_ms = 60000, flow = {dataflow_id = uuid.v7(), signal_id = uuid.v7()}})
            local job_id = id and repo.stored_run(id).job_id
            test.is_nil(err)
            test.not_nil(job_id)
            test.is_nil(require("deferred").nudge())
            local deadline = time.now():add("75s")
            local job
            repeat
                job, err = jobs.get_job(job_id)
                test.is_nil(err)
                local stored = repo.stored_run(id)
                if stored.status == "succeeded" and job.status == "pending" and not job.scheduled_at then break end
                if job.status == "dead" or job.status == "done" then break end
                if time.now():after(deadline) then error("job lifecycle does not complete: " .. tostring(job.status) .. " attempts=" .. tostring(job.attempts) .. " error=" .. tostring(job.last_error)) end
                time.sleep("100ms")
            until false
            test.eq(job.status, "pending")
            test.is_true(job.execution_seq >= 3, "cleanup does not stop at max_attempts")
            local run = repo.stored_run(id)
            test.eq(run.status, "succeeded", "exhausted job is " .. job.status .. " after " .. tostring(job.attempts) .. " attempts")
            test.eq(run.result, "complete answer")
            test.eq(run.usage.input_tokens, 42)
            repeat
                local db = require("sql").get("app:db")
                local rows, read_err = db:query("SELECT workflow_delivered FROM chestor_autocode_runs WHERE id = $1", {id})
                db:release()
                test.is_nil(read_err)
                if rows[1].workflow_delivered == 1 then break end
                if time.now():after(deadline) then error("workflow delivery remains parked") end
                time.sleep("100ms")
            until false
            local db = require("sql").get("app:db")
            local deliveries = db:query("SELECT id, execution_seq, slot FROM kickside_job WHERE job_type = 'app:durability_resume'", {})
            db:release()
            test.eq(#deliveries, 1)
            test.is_true(deliveries[1].execution_seq >= 6, "delivery survives five infrastructure failures")
            local delivery_id = deliveries[1].id
            local deleted, prune_err = repo.prune_runs("2999-01-01T00:00:00Z", 1000)
            test.is_nil(prune_err)
            test.is_true(deleted >= 1)
            test.is_nil(repo.stored_run(id))
            test.is_nil(jobs.get_job(job_id))
            test.is_nil(jobs.get_job(delivery_id))
        end)
        test.it("drains a real active build job before deleting its recovery row", function()
            user = require("identity").admin()
            local image, generation, job_id = uuid.v7(), uuid.v7(), nil
            test.is_nil(repo.request_image_build(image, {actor_id = user.id, actor_context = "{}"}, "initial", generation))
            job_id = repo.image_build(image).job_id
            test.is_nil(require("deferred").nudge())
            local deadline = time.now():add("20s")
            repeat
                local build = repo.image_build(image)
                if build.log == "active" then break end
                if time.now():after(deadline) then error("build worker does not start") end
                time.sleep("100ms")
            until false
            local drain_err = repo.delete_image_build(image)
            if drain_err then
                test.is_true(errors.is(drain_err, errors.UNAVAILABLE), tostring(drain_err))
                test.not_nil(repo.image_build(image))
            end
            repeat
                local job = jobs.get_job(job_id)
                if job.status == "cancelled" then break end
                if time.now():after(deadline) then error("build worker does not terminate") end
                time.sleep("100ms")
            until false
            test.is_nil(repo.delete_image_build(image))
            test.is_nil(repo.image_build(image))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

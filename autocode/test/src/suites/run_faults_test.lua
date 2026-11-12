-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local stubs = require("stubs")
local runner = require("run_subject")
local time = require("time")
local health = require("health")
local redact = require("redact")
local function cases()
    test.describe("autocode run failures", function()
        test.it("preserves every health-write failure and replays the recorded cooldown instant", function()
            for _, field in ipairs({"account_limits_error", "account_health_error", "account_error_write_error"}) do
                local state = stubs.reset()
                local intent = health.capture({outcome = "failed", error = {code = "busy", message = "provider busy", retryable = true}},
                    "refresh failed", redact.new("secret"), {windows = {}})
                intent.observed_at = "2026-11-01T00:00:00Z"
                state[field] = errors.new({kind = errors.UNAVAILABLE, message = "write failed", details = {code = "health.write_failed"}})
                local err = health.apply(state.run, intent)
                test.is_true(errors.is(err, errors.UNAVAILABLE))
                test.eq(err:details().code, "health.write_failed")
                state[field] = nil
                test.is_nil(health.apply(state.run, intent))
                test.eq(state.account_settlement.cooldown, "2026-11-01T00:01:00Z")
                test.eq(state.account_error, "refresh failed")
            end
        end)
        test.it("replays failed account health writes before settling the recorded outcome", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            state.terminal = {outcome = "succeeded", answer = "done"}
            state.account_health_error = errors.new({kind = errors.UNAVAILABLE, message = "health unavailable", details = {code = "health.unavailable"}})
            local first = runner.main({payload = {run_id = "run"}})
            test.is_false(first.ok)
            test.eq(state.run.status, "running")
            test.eq(state.run.pending_status, "succeeded")
            local commands = #state.commands
            state.account_health_error = nil
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}}).ok)
            test.eq(state.run.status, "succeeded")
            test.eq(state.run.result, "done")
            test.eq(state.account_settlement.refusal, "")
            test.eq(#state.commands, commands)
        end)
        test.it("isolates the mounted tree and removes it on every settled outcome", function()
            for _, outcome in ipairs({"succeeded", "failed", "cancelled", "timeout"}) do
                local state = stubs.reset()
                state.run.isolation = "worktree"
                state.run.workspace_id = "workspace"
                state.prepared = stubs.preparation(state.run)
                state.prepared.workdir = "/workspace"
                state.prepared.workspace = {id = "workspace", host_path = "/repo", writable = true}
                state.terminal = {outcome = outcome == "succeeded" and "succeeded" or "failed"}
                if outcome == "cancelled" then state.cancel_on_attach = true end
                if outcome == "timeout" then state.stream_code = 124 end
                test.is_true(runner.main({payload = {run_id = "run"}}).ok)
                test.eq(state.run.status, outcome == "succeeded" and "succeeded" or outcome == "cancelled" and "cancelled" or "failed")
                if outcome == "timeout" then test.not_nil(state.run.error:find("exceeded its timeout", 1, true)) end
                test.eq(state.worktree_created, 1)
                test.eq(state.worktree_removed, 1)
                test.is_true(state.run.worktree.removed)
                test.eq(state.run.worktree.repository, "/repo")
                local mounted = false
                for _, command in ipairs(state.commands) do
                    if command:find("create ", 1, true) then
                        mounted = command:find("source=/repo/.autocode-runs/run,target=/workspace", 1, true) ~= nil
                        test.is_nil(command:find("source=/repo,target=/workspace", 1, true))
                        test.not_nil(command:find("source=/repo/.git,target=/repo/.git,readonly", 1, true), command)
                        test.not_nil(command:find("source=/repo/.autocode-runs/run/.git,target=/workspace/.git,readonly", 1, true), command)
                    end
                end
                test.is_true(mounted, table.concat(state.commands, "\n"))
            end
        end)
        test.it("retries durable worktree cleanup after a crash without preparing again", function()
            local state = stubs.reset()
            state.run.status, state.run.isolation = "running", "worktree"
            state.run.worktree = {repository = "/repo", path = "/repo/.autocode-runs/run", gitdir = "/repo/.git"}
            state.worktree_error = errors.new({kind = errors.UNAVAILABLE, message = "busy"})
            test.is_false(runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}}).ok)
            test.eq(state.run.status, "running")
            state.worktree_error = nil
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 3}}).ok)
            test.eq(state.run.status, "failed")
            test.eq(state.worktree_removed, 2)
            test.is_nil(state.worktree_created)
        end)
        test.it("redacts a gateway token from streamed events and the terminal result", function()
            local state = stubs.reset()
            local token = "opaque-gateway-fixture-value"
            state.prepared = stubs.preparation(state.run)
            state.prepared.gateway_token = token
            state.terminal = {outcome = "succeeded", answer = token}
            state.observations = {{data = {type = "text", channel = "answer", segment_id = "token", operation = "complete", text = token}}}
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.result, "[redacted]")
            test.is_nil(state.run.result:find(token, 1, true))
            for _, event in ipairs(state.events) do test.is_nil(event.text:find(token, 1, true)) end
        end)
        test.it("folds a recorded limit observation and terminal usage into account health and the stored run", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            state.observations = {{type = "rate_limit", event_key = "limit-1", data = {type = "rate_limit", limits = {
                windows = {{window = "seven_day", utilization = 1, status = "rejected", resets_at = 2000000000}},
                overage_status = "rejected", is_using_overage = false}}}}
            state.terminal = {outcome = "failed", usage = {cost_usd = 0.25, cache_write_tokens = 12, models = {model = {cost_usd = 0.25}}},
                error = {code = "rate_limit", message = "limit", retryable = true}}
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.usage.cost_usd, 0.25)
            test.eq(state.account_limits.windows[1].window, "seven_day")
            test.eq(state.account_limits.is_using_overage, false)
            test.eq(state.account_settlement.cooldown, "2033-05-18T03:33:20Z")
        end)
        test.it("uses the configured cooldown when a rate-limit refusal has no reported reset", function()
            local state = stubs.reset()
            state.prepared, state.cooldown = stubs.preparation(state.run), "2m"
            state.terminal = {outcome = "failed", rate_limits = {windows = {}},
                error = {code = "rate_limit", message = "limit", retryable = true}}
            local started = time.now():unix()
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            local reset = time.parse(time.RFC3339, state.account_settlement.cooldown):unix()
            test.is_true(reset >= started + 120 and reset <= started + 125)
        end)
        test.it("polls cancellation by timer and stops a noisy container once", function()
            local state = stubs.reset()
            state.cancel_silently, state.prepared = true, stubs.preparation(state.run)
            state.output_lines = 1000
            runner.main({payload = {run_id = "run"}})
            test.eq(state.stopped, 1)
            test.is_true((state.cancel_reads or 0) < 15)
            test.eq(state.full_reads_during_stream or 0, 0)
        end)
        test.it("uses the job deadline for inspect, create, attached output and cleanup", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            local deadline = "2999-01-01T00:00:00Z"
            test.is_true(runner.main({payload = {run_id = "run"}, job = {deadline = deadline}}).ok)
            test.is_true(#state.deadline_calls >= 4)
            for _, call in ipairs(state.deadline_calls) do test.eq(call.deadline, deadline, call.command) end
        end)
        test.it("preserves native event log errors in the job envelope", function()
            local state = stubs.reset()
            state.event_error = errors.new({kind = errors.PERMISSION_DENIED, message = "denied", retryable = false, details = {code = "events.denied"}})
            local result = runner.main({payload = {run_id = "run"}})
            test.is_false(result.ok)
            test.eq(result.error_native.kind, errors.PERMISSION_DENIED)
            test.eq(result.error_native.details.code, "events.denied")
            test.is_false(result.error_native.retryable)
        end)
        test.it("reports notification failure after settlement and retries only delivery", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            state.notify_error = errors.new({kind = errors.UNAVAILABLE, message = "offline", retryable = true})
            test.is_false(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "succeeded")
            local commands = #state.commands
            state.notify_error = nil
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}}).ok)
            test.eq(#state.commands, commands)
        end)
        test.it("refuses a run when its recorded image ID is no longer local", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            state.docker_steps = {{code = 1}}
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "failed")
            test.not_nil(state.run.error:find("recorded image ID is no longer available", 1, true))
            for _, command in ipairs(state.commands) do test.is_nil(command:find("create ", 1, true)) end
        end)
        test.it("retries interrupted-run cleanup before settling", function()
            local state = stubs.reset()
            state.run.status, state.remove_error = "running", true
            local outcome = runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}})
            test.is_false(outcome.ok)
            test.eq(state.run.status, "running")
            state.remove_error = false
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 3}}).ok)
            test.eq(state.run.status, "failed")
            test.eq(state.removed, 2)
        end)
        test.it("retries normal cleanup before settling or delivering a workflow", function()
            local state = stubs.reset()
            state.prepared, state.remove_error = stubs.preparation(state.run), true
            state.run.flow = {dataflow_id = "flow", signal_id = "signal"}
            test.is_false(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "running")
            test.is_nil(state.enqueued)
            state.remove_error = false
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}}).ok)
            test.eq(state.run.status, "succeeded")
            test.eq(state.run.pending_status, "succeeded")
        end)
        test.it("retries cleanup after cancellation during container creation", function()
            local state = stubs.reset()
            state.prepared, state.cancel_on_create, state.remove_error = stubs.preparation(state.run), true, true
            test.is_false(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "queued")
            test.is_nil(state.attached)
            test.eq(state.run.pending_status, "cancelled")
            state.remove_error = false
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}}).ok)
            test.eq(state.run.status, "cancelled")
        end)
        test.it("settles cancellation before container creation", function()
            local state = stubs.reset()
            state.run.cancel_requested, state.prepared = true, stubs.preparation(state.run)
            runner.main({payload = {run_id = "run"}})
            test.eq(state.run.status, "cancelled")
            test.is_nil(state.attached)
        end)
        test.it("settles cancellation between container creation and starting", function()
            local state = stubs.reset()
            state.cancel_on_reserve, state.prepared = true, stubs.preparation(state.run)
            runner.main({payload = {run_id = "run"}})
            test.eq(state.run.status, "cancelled")
            test.is_nil(state.attached)
        end)
        test.it("checks cancellation during the attached stream", function()
            local state = stubs.reset()
            state.cancel_on_attach, state.prepared = true, stubs.preparation(state.run)
            runner.main({payload = {run_id = "run"}})
            test.is_true(state.stopped > 0)
            test.eq(state.run.status, "cancelled")
        end)
        test.it("stops cancellation while attached without any output line", function()
            local state = stubs.reset()
            state.cancel_silently, state.prepared = true, stubs.preparation(state.run)
            runner.main({payload = {run_id = "run"}})
            test.is_true(state.stopped > 0)
            test.eq(state.run.status, "cancelled")
        end)
        test.it("retains the outcome and reports invalid cooldown configuration before settlement", function()
            local state = stubs.reset()
            state.prepared, state.cooldown = stubs.preparation(state.run), "invalid"
            state.terminal = {outcome = "failed", error = {retryable = true, code = "busy", message = "busy"}}
            local result = runner.main({payload = {run_id = "run"}})
            test.is_false(result.ok)
            test.eq(result.error_native.kind, errors.INVALID)
            test.eq(state.run.status, "running")
            test.eq(state.run.pending_status, "failed")
            state.cooldown = "1m"
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}}).ok)
            test.eq(state.run.status, "failed")
        end)
        test.it("publishes committed account health on its component topic", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.not_nil(state.health_topics)
            test.eq(state.health_topics[1], "component.account")
            test.eq(state.health_topics[#state.health_topics], "component.account")
        end)
        test.it("keeps a committed workflow run successful when the wake fails", function()
            local state = stubs.reset()
            state.run.flow, state.prepared = {dataflow_id = "flow", signal_id = "signal"}, stubs.preparation(state.run)
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "succeeded")
        end)
        test.it("removes the deterministic name after a Docker create transport failure", function()
            local state = stubs.reset()
            state.prepared, state.remove_error = stubs.preparation(state.run), true
            state.create_error = errors.new({kind = errors.UNAVAILABLE, message = "create output lost"})
            test.is_false(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "queued")
            test.eq(state.run.pending_status, "failed")
            test.eq(state.removed_names[1], "container")
            state.remove_error = false
            test.is_true(runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}}).ok)
            test.eq(state.run.status, "failed")
            test.not_nil(state.run.error:find("create output lost", 1, true))
            test.eq(state.settlements, 1)
        end)
        test.it("confirms absence after container removal reports an error", function()
            local state = stubs.reset()
            state.prepared, state.remove_error, state.remove_absent = stubs.preparation(state.run), true, true
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "succeeded")
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

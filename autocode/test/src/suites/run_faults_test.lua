-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local stubs = require("stubs")
local runner = require("run_subject")
local time = require("time")
local health = require("health")
local redact = require("redact")
local function cases()
    test.describe("autocode run failures", function()
        test.it("settles unattached cancellation before preparation or recovery can fail", function()
            for _, status in ipairs({"queued", "running"}) do
                local state = stubs.reset()
                state.run.status = status
                state.run.cancel_requested = true
                state.prepare_error = errors.new({kind = errors.NOT_FOUND, message = "image removed"})
                local result = runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}})
                test.is_true(result.ok)
                test.eq(state.run.status, "cancelled")
                test.is_nil(state.prepared_called)
            end
        end)
        test.it("uses the shared effective recipe limits when creating the main run container", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            state.prepared.image.memory, state.prepared.image.cpus, state.prepared.image.pids_limit = "", "", 0
            state.prepared.image.extra_args = {"-m64m", "--cpus=0.25", "--pids-limit=16", "--oom-kill-disable=false"}
            state.terminal = {outcome = "succeeded"}
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            local creates = 0
            for _, command in ipairs(state.commands) do
                if command:sub(1, 7) == "create " then
                    creates = creates + 1
                    for _, bound in ipairs({"-m64m", "--cpus=0.25", "--pids-limit=16", "--oom-kill-disable=false"}) do
                        test.not_nil(command:find(bound, 1, true), command)
                    end
                end
            end
            test.eq(creates, 1)
        end)
        test.it("keeps tuning discard notices in successful scratch and shared run logs", function()
            for _, shared in ipairs({false, true}) do
                local state = stubs.reset()
                state.prepared = stubs.preparation(state.run)
                if shared then
                    state.run.workspace_id = "workspace"
                    state.prepared.workspace = {id = "workspace", host_path = "/approved", writable = false}
                    state.prepared.workdir = "/workspace"
                end
                state.prepared.image.extra_args = {"--memory-swappiness=60"}
                local warning = "WARNING: Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded."
                state.create_lines = {warning, string.rep("a", 64)}
                state.terminal = {outcome = "succeeded"}
                test.is_true(runner.main({payload = {run_id = "run"}}).ok)
                test.eq(state.run.status, "succeeded", state.run.error)
                local notices = 0
                for _, event in ipairs(state.events) do
                    if event.text == warning then test.eq(event.kind, "system"); notices = notices + 1 end
                    test.is_nil(event.text:find(string.rep("a", 64), 1, true))
                end
                test.eq(notices, 1)
            end
        end)
        test.it("keeps unlimited quota discard notices in successful scratch and shared run logs", function()
            for _, shared in ipairs({false, true}) do
                local state = stubs.reset()
                state.prepared = stubs.preparation(state.run)
                if shared then
                    state.run.workspace_id = "workspace"
                    state.prepared.workspace = {id = "workspace", host_path = "/approved", writable = false}
                    state.prepared.workdir = "/workspace"
                end
                state.prepared.image.extra_args = {"--cpu-quota=-1"}
                local warning = "WARNING: Your kernel does not support CPU CFS scheduler. CPU period/quota discarded."
                state.create_lines = {warning, string.rep("a", 64)}
                state.terminal = {outcome = "succeeded"}
                test.is_true(runner.main({payload = {run_id = "run"}}).ok)
                test.eq(state.run.status, "succeeded", state.run.error)
                local notices = 0
                for _, event in ipairs(state.events) do
                    if event.text == warning then test.eq(event.kind, "system"); notices = notices + 1 end
                    test.is_nil(event.text:find(string.rep("a", 64), 1, true))
                end
                test.eq(notices, 1)
            end
        end)
        test.it("keeps period without quota discard notices in successful scratch and shared run logs", function()
            for _, shared in ipairs({false, true}) do
                local state = stubs.reset()
                state.prepared = stubs.preparation(state.run)
                if shared then
                    state.run.workspace_id = "workspace"
                    state.prepared.workspace = {id = "workspace", host_path = "/approved", writable = false}
                    state.prepared.workdir = "/workspace"
                end
                state.prepared.image.extra_args = {"--cpu-period=100000"}
                local warning = "WARNING: Your kernel does not support CPU CFS scheduler. CPU period/quota discarded."
                state.create_lines = {warning, string.rep("a", 64)}
                state.terminal = {outcome = "succeeded"}
                test.is_true(runner.main({payload = {run_id = "run"}}).ok)
                test.eq(state.run.status, "succeeded", state.run.error)
                local notices = 0
                for _, event in ipairs(state.events) do
                    if event.text == warning then test.eq(event.kind, "system"); notices = notices + 1 end
                    test.is_nil(event.text:find(string.rep("a", 64), 1, true))
                end
                test.eq(notices, 1)
            end
        end)
        test.it("keeps positive extra quota discard notices in successful scratch and shared run logs", function()
            for _, shared in ipairs({false, true}) do
                local state = stubs.reset()
                state.prepared = stubs.preparation(state.run)
                if shared then
                    state.run.workspace_id = "workspace"
                    state.prepared.workspace = {id = "workspace", host_path = "/approved", writable = false}
                    state.prepared.workdir = "/workspace"
                end
                state.prepared.image.extra_args = {"--cpu-quota=25000", "--cpu-period=100000"}
                local warning = "WARNING: Your kernel does not support CPU CFS scheduler. CPU period/quota discarded."
                state.create_lines = {warning, string.rep("a", 64)}
                state.terminal = {outcome = "succeeded"}
                test.is_true(runner.main({payload = {run_id = "run"}}).ok)
                test.eq(state.run.status, "succeeded", state.run.error)
                local notices = 0
                for _, event in ipairs(state.events) do
                    if event.text == warning then test.eq(event.kind, "system"); notices = notices + 1 end
                    test.is_nil(event.text:find(string.rep("a", 64), 1, true))
                end
                test.eq(notices, 1)
            end
        end)
        test.it("binds main-container inspection to its selected workspace image and network", function()
            local state = stubs.reset()
            state.prepared = stubs.preparation(state.run)
            state.run.workspace_id = "workspace"
            state.prepared.workspace = {id = "workspace", host_path = "/approved", writable = false}
            state.prepared.workdir = "/workspace"
            state.on_create = function(options)
                test.eq(options.isolation.name, "container")
                test.eq(options.isolation.image, state.prepared.image.ref)
                test.eq(options.isolation.network, state.prepared.image.network)
                test.eq(options.isolation.limits, state.prepared.image)
                test.eq(#options.isolation.mounts, 1)
                test.eq(options.isolation.mounts[1].source, "/approved")
                test.eq(options.isolation.mounts[1].target, "/workspace")
                test.is_true(options.isolation.mounts[1].readonly)
            end
            state.terminal = {outcome = "succeeded"}
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "succeeded")
        end)
        test.it("does not infer a run timeout from the container exit status", function()
            for _, status in ipairs({124, 137}) do
                local state = stubs.reset()
                state.prepared = stubs.preparation(state.run)
                state.terminal = {outcome = "uncertain"}
                state.stream_code = status
                test.is_true(runner.main({payload = {run_id = "run"}}).ok)
                test.not_nil(state.run.error:find("container exited with code " .. tostring(status), 1, true), state.run.error)
                test.is_nil(state.run.error:find("timeout", 1, true))
            end
        end)
        test.it("keeps unapproved workspace runs queued without creating a container or losing the job", function()
            local state = stubs.reset()
            state.run.workspace_id = "legacy"
            state.workspace_unapproved = true
            state.prepare_error = errors.new({kind = errors.CONFLICT, message = "workspace needs approval", details = {code = "autocode.workspace_approval_required"}})
            local waiting = runner.main({payload = {run_id = "run"}})
            test.is_true(waiting.ok)
            test.is_true(waiting.output.park)
            test.eq(state.run.status, "queued")
            test.is_true(state.prepared_called)
            test.eq(#state.commands, 0)

        end)
        test.it("retains approval waiting across recovery and accepts cancellation while waiting", function()
            local state = stubs.reset()
            state.run.workspace_id = "legacy"
            state.prepare_error = errors.new({kind = errors.CONFLICT, message = "workspace needs approval", details = {code = "autocode.workspace_approval_required"}})
            local waiting = runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}})
            test.is_true(waiting.ok); test.is_true(waiting.output.park); test.eq(state.run.status, "queued")
            state.run.cancel_requested = true
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.run.status, "cancelled")
        end)
        test.it("waits for cancellation signals without reading the database during an idle stream", function()
            local state = stubs.reset()
            state.prepared, state.idle_stream = stubs.preparation(state.run), "700ms"
            test.is_true(runner.main({payload = {run_id = "run"}}).ok)
            test.eq(state.stream_cancel_reads or 0, 0)
        end)
        test.it("retains native preparation errors through terminal outcomes and cleanup replay", function()
            for _, field in ipairs({"prepare_error"}) do
                local state = stubs.reset()
                state.prepared = stubs.preparation(state.run)
                state[field] = errors.new({kind = errors.PERMISSION_DENIED, message = "fixture refusal", retryable = false, details = {code = "fixture.refused", revision = 7}})
                state.remove_error = true
                test.is_false(runner.main({payload = {run_id = "run"}}).ok)
                test.not_nil(state.run.error_native)
                test.eq(state.run.error_native.kind, errors.PERMISSION_DENIED)
                test.is_false(state.run.error_native.retryable); test.eq(state.run.error_native.details.code, "fixture.refused")
                state.remove_error = false
                local replay = runner.main({payload = {run_id = "run"}, job = {attempt_no = 2}})
                test.is_true(replay.ok); test.eq(state.run.status, "failed")
                test.eq(replay.output.error_native.details.revision, 7)
            end
        end)
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
        test.it("mounts the approved shared directory on every settled outcome", function()
            for _, outcome in ipairs({"succeeded", "failed", "cancelled", "exit124"}) do
                local state = stubs.reset()
                state.run.workspace_id = "workspace"
                state.prepared = stubs.preparation(state.run)
                state.prepared.workdir = "/workspace"
                state.prepared.workspace = {id = "workspace", host_path = "/repo", writable = true}
                state.terminal = {outcome = outcome == "succeeded" and "succeeded" or "failed"}
                if outcome == "cancelled" then state.cancel_on_attach = true end
                if outcome == "exit124" then state.stream_code = 124 end
                test.is_true(runner.main({payload = {run_id = "run"}}).ok)
                test.eq(state.run.status, outcome == "succeeded" and "succeeded" or outcome == "cancelled" and "cancelled" or "failed")
                if outcome == "exit124" then test.is_nil(state.run.error:find("timeout", 1, true)) end
                local mounted = false
                for _, command in ipairs(state.commands) do
                    if command:find("create ", 1, true) then
                        mounted = command:find("source=/repo,target=/workspace", 1, true) ~= nil
                        test.is_nil(command:find("source=/repo/.git", 1, true), command)
                        test.not_nil(command:find("bind-recursive=disabled", 1, true), command)
                    end
                end
                test.is_true(mounted, table.concat(state.commands, "\n"))
            end
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
        test.it("receives cancellation signals and stops a noisy container once", function()
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

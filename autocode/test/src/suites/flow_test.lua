-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local fixture = require("contract_fixture")
local sql = require("sql")
local time = require("time")
local json = require("json")
local uuid = require("uuid")
local function query(statement, params)
    local db = sql.get("app:db")
    local rows, err = db:query(statement, params or {})
    db:release()
    test.is_nil(err, tostring(err))
    return rows
end
local function execute(statement, params)
    local db = sql.get("app:db")
    local _, err = db:execute(statement, params or {})
    db:release()
    test.is_nil(err, tostring(err))
end
local function wait_for(read, message)
    local deadline = time.now():add("15s")
    repeat
        local result = read()
        if result then return result end
        test.is_false(time.now():after(deadline), message)
        time.sleep("20ms")
    until false
end
local function cases()
    test.describe("autocode real Flow Block", function()
        local f
        test.before_each(function() f = fixture.new() end)
        test.after_each(function()
            for _, user in ipairs(f.users) do execute("DELETE FROM autocode_test_notify_fault WHERE owner_id = $1", {user.id}) end
            f.release()
        end)
        local function request(user)
            local account = identity.request(user, "POST", "/autocode/accounts", {agent = "claude", credential_kind = "env:ANTHROPIC_API_KEY", label = "key", secret = "key"})
            test.eq(account.status, 201, account.body)
            return {agent = "claude", account_id = account.json.id, image_id = f.image_for(user), prompt = "task", unattended = false}
        end
        local function park(user, config)
            local flow, err = identity.call(user, "app:flow_probe", {config = config})
            test.is_nil(err, tostring(err))
            test.not_nil(flow)
            local node = wait_for(function()
                local row = query("SELECT status, metadata FROM dataflow_nodes WHERE node_id = $1", {flow.node_id})[1]
                local armed = query("SELECT data_id FROM dataflow_data WHERE node_id = $1 AND type = 'node.park.armed'", {flow.node_id})
                if row and (row.status == "failed" or (#armed > 0 and (row.status == "waiting" or row.status == "completed"))) then return row end
            end, "Flow did not finish arming")
            local runs = query("SELECT id, owner_id, actor_id, flow_signal_id, job_id FROM chestor_autocode_runs WHERE flow_dataflow_id = $1", {flow.dataflow_id})
            -- The durable side effect exists even on the original failing node.
            test.eq(#runs, 1)
            test.eq(runs[1].owner_id, user.id)
            test.eq(runs[1].actor_id, user.id)
            test.eq(query("SELECT actor_id FROM dataflows WHERE dataflow_id = $1", {flow.dataflow_id})[1].actor_id, user.id)
            test.is_true(node.status == "waiting" or node.status == "completed", json.encode({metadata = node.metadata,
                errors = query("SELECT content FROM dataflow_data WHERE node_id = $1 AND discriminator = 'result.error'", {flow.node_id}),
                notify = query("SELECT owner_id, actor_id, allowed, user_notify, service_notify FROM autocode_test_notify WHERE owner_id = $1 AND topic = 'chestor.autocode.runs'", {user.id})}))
            test.eq(#query("SELECT id FROM kickside_job WHERE id = $1", {runs[1].job_id}), 1)
            return flow, runs[1]
        end
        local function resume(user, flow, run)
            if query("SELECT status FROM dataflows WHERE dataflow_id = $1", {flow.dataflow_id})[1].status == "completed" then return end
            local _, err = identity.call(user, "app:flow_resume", {dataflow_id = flow.dataflow_id,
                signal_id = run.flow_signal_id, payload = {success = true, result = "done"}})
            test.is_nil(err, tostring(err))
            local status = wait_for(function()
                local row = query("SELECT status FROM dataflows WHERE dataflow_id = $1", {flow.dataflow_id})[1]
                if row and (row.status == "completed" or row.status == "failed") then return row.status end
            end, "Flow did not resume")
            test.eq(status, "completed")
        end
        test.it("cancels a parked legacy job delivers its Flow and releases workspace deletion", function()
            local user = identity.admin()
            f.users[#f.users + 1] = user
            local config = request(user)
            local path = identity.directory(user, "parked-cancellation")
            local workspace = assert(identity.call(user, "app:fixture_register", "workspace", {title = "legacy"}, {host_path = path}))
            local parked = assert(identity.call(user, "app:flow_probe", {config = config, create_only = true}))
            local flow = parked.dataflow_id
            execute("UPDATE dataflow_nodes SET status = 'waiting' WHERE node_id = $1", {parked.node_id})
            local yield_id = uuid.v7()
            execute([[INSERT INTO dataflow_data (data_id, dataflow_id, node_id, type, content, content_type, created_at)
                VALUES ($1, $2, $3, 'node.yield', $4, 'application/json', CURRENT_TIMESTAMP)]],
                {yield_id, flow, parked.node_id, json.encode({yield_id = yield_id, yield_context = {wait_for_signal = true, signal_id = "cancel-parked"}})})
            local submitted, err = identity.call(user, "app:queue_legacy", {agent = "claude", image_id = config.image_id,
                account_id = config.account_id, workspace_id = workspace, prompt = "cancel while parked", repo_url = "", options = {}, timeout_ms = 60000,
                flow = {dataflow_id = flow, signal_id = "cancel-parked"}})
            test.is_nil(err, tostring(err))
            wait_for(function()
                local row = query([[SELECT j.status, j.scheduled_at FROM kickside_job j
                    JOIN chestor_autocode_runs r ON r.job_id = CAST(j.id AS TEXT) WHERE r.id = $1]], {submitted.run_id})[1]
                return row and row.status == "pending" and row.scheduled_at == nil
            end, "legacy job did not park")
            local cancelled = identity.request(user, "POST", "/autocode/runs/" .. submitted.run_id .. "/cancel")
            test.eq(cancelled.status, 200, cancelled.body)
            local done = wait_for(function()
                local row = query("SELECT status, workflow_delivered FROM chestor_autocode_runs WHERE id = $1", {submitted.run_id})[1]
                return row.status == "cancelled" and tonumber(row.workflow_delivered) == 1 and row
            end, "parked cancellation did not settle and deliver its Flow")
            test.eq(done.status, "cancelled")
            wait_for(function()
                return query("SELECT status FROM dataflows WHERE dataflow_id = $1", {flow})[1].status == "completed"
            end, "cancelled run did not resume its Flow")
            local removed = identity.request(user, "DELETE", "/autocode/workspaces/" .. workspace)
            test.eq(removed.status, 200, removed.body)
        end)
        test.it("reopens realtime under each recovered Flow user after warming the arm", function()
            for _ = 1, 2 do
                local user = f.member()
                local flow, run = park(user, request(user))
                local notifications = query([[SELECT * FROM autocode_test_notify
                    WHERE owner_id = $1 AND topic = 'chestor.autocode.runs' AND actor_id = $1]], {user.id})
                test.eq(#notifications, 1)
                test.eq(tonumber(notifications[1].allowed), 1)
                test.eq(tonumber(notifications[1].user_notify), 0)
                test.eq(tonumber(notifications[1].service_notify), 0)
                test.not_nil(notifications[1].policies:find("chestor.autocode.security:flow_context", 1, true))
                resume(user, flow, run)
            end
        end)
        test.it("parks and resumes committed tasks when realtime refuses or delivery fails", function()
            for _, mode in ipairs({"denied", "unavailable"}) do
                local user = f.member()
                local config = request(user)
                execute("INSERT INTO autocode_test_notify_fault (owner_id, mode) VALUES ($1, $2)", {user.id, mode})
                local flow, run = park(user, config)
                resume(user, flow, run)
                -- The public caller must also see its committed submission as done.
                config.idempotency_key = "http-after-notify-fault-" .. user.id
                local submitted = identity.request(user, "POST", "/autocode/runs", config)
                test.eq(submitted.status, 201, submitted.body)
                local replay = identity.request(user, "POST", "/autocode/runs", config)
                test.eq(replay.status, 201, replay.body)
                test.eq(replay.json.run_id, submitted.json.run_id)
            end
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

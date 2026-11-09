-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local time = require("time")
local repo = require("repo")
local retention = require("retention")
local stubs = require("stubs")
local runs = require("runs")
local funcs = require("funcs")
local process = require("process")
local channel = require("channel")
local core_runner = require("core_runner")

local function execute(statement, params)
    local db = sql.get("app:db")
    local _, err = db:execute(statement, params or {})
    db:release()
    test.is_nil(err, tostring(err))
end

local function count(table_name, owner)
    local db = sql.get("app:db")
    local rows, err = db:query("SELECT COUNT(*) AS n FROM " .. table_name ..
        (table_name == "chestor_autocode_runs" and " WHERE owner_id = $1" or " WHERE run_id LIKE $1"),
        {table_name == "chestor_autocode_runs" and owner or owner .. "%"})
    db:release()
    test.is_nil(err, tostring(err))
    return rows[1].n
end

local function seed(owner, n, finished)
    execute([[WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n < $1)
        INSERT INTO chestor_autocode_runs (id, owner_id, actor_id, actor_context, agent, account_id,
            image_id, prompt, timeout_ms, status, finished_at)
        SELECT $2 || CAST(n AS TEXT), $2, 'test:actor', '{}', 'agent', 'account', 'image', '', 60000,
            'succeeded', $3 FROM numbers]], {n, owner, finished})
end

local function drain(before, batch)
    local passes = 0
    repeat
        local _, err, progress = repo.prune_runs(before, batch)
        test.is_nil(err, tostring(err))
        test.not_nil(progress, "retention reports continuation and next expiry")
        passes = passes + 1
        test.is_true(passes < 1000, "bounded retention chain finishes")
        if not progress.needs_continue then return passes end
    until false
end

local function cases()
    test.describe("autocode run history cleanup", function()
        test.it("adds its index idempotently without changing existing run history", function()
            local owner = uuid.v7()
            seed(owner, 3, "2000-01-01T00:00:00Z")
            execute("DROP INDEX chestor_autocode_runs_retention")
            for attempt = 1, 2 do
                local result, err = funcs.call("chestor.autocode.migrations:02_run_retention_index",
                    {database_id = "app:db", direction = "up", id = "test:" .. uuid.v7()})
                test.is_nil(err, tostring(err))
                test.eq(result.status, "complete", tostring(result.error))
                test.eq(count("chestor_autocode_runs", owner), 3)
            end
            drain("2001-01-01T00:00:00Z", 500)
        end)
        test.it("does not rearm on a declined page and seeks past expired deadlines", function()
            local state = stubs.reset()
            local owner = uuid.v7()
            seed(owner, 500, "1999-01-01T00:00:00Z")
            seed(owner .. "future", 1, "2002-01-01T00:00:00Z")
            local job_id = uuid.v7()
            execute("UPDATE chestor_autocode_runs SET job_id = $1 WHERE owner_id = $2", {job_id, owner})
            state.jobs = {[job_id] = {status = "running"}}
            local deleted, err, progress = runs.prune_runs("2001-01-01T00:00:00Z", 500)
            execute("DELETE FROM chestor_autocode_runs WHERE owner_id IN ($1, $2)", {owner, owner .. "future"})
            test.is_nil(err, tostring(err))
            test.eq(deleted, 0)
            test.is_false(progress.needs_continue, "declined rows do not cause immediate continuation")
            test.eq(progress.next_finished_at, "2002-01-01T00:00:00Z")
        end)
        test.it("bounds candidate visits and reaches later runs after the head jobs settle", function()
            local state = stubs.reset()
            local owner = uuid.v7()
            seed(owner .. ":a:", 1001, "1999-01-01T00:00:00Z")
            seed(owner .. ":z:", 1, "2000-01-01T00:00:00Z")
            local job_id = uuid.v7()
            execute("UPDATE chestor_autocode_runs SET job_id = $1 WHERE owner_id = $2", {job_id, owner .. ":a:"})
            state.jobs = {[job_id] = {status = "running"}}
            local visits = 0
            state.on_get_job = function() visits = visits + 1 end
            local deleted, err, progress = runs.prune_runs("2001-01-01T00:00:00Z", 500)
            test.is_nil(err, tostring(err))
            test.eq(visits, 500, "one callback examines at most one candidate page")
            test.eq(state.cancel_calls, 500)
            test.eq(deleted, 0)
            test.is_false(progress.needs_continue)
            test.is_true(progress.next_finished_at == nil or progress.next_finished_at >= "2001-01-01T00:00:00Z",
                "held expired rows supply no deadline")
            test.eq(count("chestor_autocode_runs", owner .. ":z:"), 1)
            state.jobs[job_id].status = "cancelled"
            local passes = 0
            repeat
                visits, state.cancel_calls = 0, 0
                local removed, prune_err, more = runs.prune_runs("2001-01-01T00:00:00Z", 500)
                test.is_nil(prune_err, tostring(prune_err))
                test.is_true(visits <= 500)
                test.eq(state.cancel_calls, visits)
                test.eq(more.needs_continue, removed == 500)
                passes = passes + 1
                test.is_true(passes <= 4, "released head and tail drain within four bounded passes")
                if not more.needs_continue then break end
            until false
            test.eq(count("chestor_autocode_runs", owner .. ":a:"), 0)
            test.eq(count("chestor_autocode_runs", owner .. ":z:"), 0)
        end)
        test.it("wakes Core after settlement and delivery and propagates wake errors", function()
            local state = stubs.reset()
            local owner = uuid.v7()
            seed(owner, 1, "")
            execute("UPDATE chestor_autocode_runs SET status = 'running' WHERE id = $1", {owner .. "1"})
            test.is_true(runs.finish_run(owner .. "1", "succeeded", "", "", {}))
            test.eq(#(state.retention_changes or {}), 1)
            test.is_nil(runs.acknowledge_delivery(owner .. "1"))
            test.eq(#state.retention_changes, 2)
            state.retention_notify_error = errors.new({kind = errors.UNAVAILABLE, message = "notification unavailable"})
            test.not_nil(select(2, runs.finish_run(owner .. "1", "succeeded", "", "", {})))
            test.not_nil(runs.acknowledge_delivery(owner .. "1"))
            execute("DELETE FROM chestor_autocode_runs WHERE owner_id = $1", {owner})
        end)
        test.it("rechecks a refreshed expiry before deleting children", function()
            local state = stubs.reset()
            local owner = uuid.v7()
            seed(owner, 1, "2000-01-01T00:00:00Z")
            execute("UPDATE chestor_autocode_runs SET job_id = $1 WHERE id = $2", {uuid.v7(), owner .. "1"})
            execute("INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text) VALUES ($1, 1, 'log', '')", {owner .. "1"})
            execute("INSERT INTO chestor_autocode_submissions (owner_id, key, canonical, run_id) VALUES ($1, 'key', '{}', $2)", {owner, owner .. "1"})
            state.on_get_job = function()
                execute("UPDATE chestor_autocode_runs SET finished_at = '2002-01-01T00:00:00Z' WHERE id = $1", {owner .. "1"})
            end
            test.is_nil(select(2, runs.prune_runs("2001-01-01T00:00:00Z", 500)))
            for _, name in ipairs({"chestor_autocode_runs", "chestor_autocode_run_events", "chestor_autocode_submissions"}) do
                test.eq(count(name, owner), 1)
            end
            state.on_get_job = nil
            drain("2003-01-01T00:00:00Z", 500)
        end)
        test.it("drains more than one callback page and reports the next expiry", function()
            local state = stubs.reset()
            state.retention = "1h"
            local owner = uuid.v7()
            seed(owner, 1001, "2000-01-01T00:00:00Z")
            local future = time.now():add("-30m"):utc():format_rfc3339()
            seed(owner .. "future", 1, future)
            local passes = 0
            local mailbox = process.listen("kickside.core.retention.changed")
            local db = sql.get("app:db")
            local ok, failure = pcall(function()
                repeat
                    local result, err = core_runner.on_deadline(db, tostring(process.pid()))
                    test.is_nil(err, tostring(err))
                    test.eq(#result.owner_failures, 0)
                    test.not_nil(result.deadline_ms)
                    passes = passes + 1
                    test.is_true(passes < 10)
                    if not result.stats.needs_continue then break end
                    local more = channel.select({mailbox:case_receive(), time.after("5s"):case_receive()})
                    test.eq(more.channel, mailbox, "Core delivers the continuation without another external wake")
                    test.eq(more.value.kind, "continue")
                until false
            end)
            db:release()
            process.unlisten(mailbox)
            if not ok then error(failure) end
            test.is_true(passes > 1)
            test.eq(count("chestor_autocode_runs", owner), 0)
            test.eq(count("chestor_autocode_runs", owner .. "future"), 1)
            local expected = time.parse(time.RFC3339, future):unix() * 1000 + 3600000 + 1000
            test.eq(retention.run().deadline_ms, expected)
            execute("DELETE FROM chestor_autocode_runs WHERE owner_id = $1", {owner .. "future"})
        end)
        test.it("bounds child deletion pages and removes every owned row before the run", function()
            stubs.reset()
            local owner = uuid.v7()
            seed(owner, 1, "2000-01-01T00:00:00Z")
            execute([[WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n < 1201)
                INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text)
                SELECT $1 || '1', n, 'log', '' FROM numbers]], {owner})
            execute([[WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n < 1201)
                INSERT INTO chestor_autocode_submissions (owner_id, key, canonical, run_id)
                SELECT $1, CAST(n AS TEXT), '{}', $1 || '1' FROM numbers]], {owner})
            local deleted, err, progress = repo.prune_runs("2001-01-01T00:00:00Z", 500)
            test.is_nil(err, tostring(err))
            test.eq(deleted, 0)
            test.eq(count("chestor_autocode_run_events", owner), 701)
            test.eq(count("chestor_autocode_submissions", owner), 701)
            test.is_true(progress.needs_continue)
            test.eq(drain("2001-01-01T00:00:00Z", 500), 2)
            for _, name in ipairs({"chestor_autocode_runs", "chestor_autocode_run_events", "chestor_autocode_submissions"}) do
                test.eq(count(name, owner), 0)
            end
        end)
        test.it("keeps unfinished runs and undelivered workflow history", function()
            stubs.reset()
            local owner = uuid.v7()
            seed(owner, 2, "2000-01-01T00:00:00Z")
            execute("UPDATE chestor_autocode_runs SET finished_at = '', status = 'running' WHERE id = $1", {owner .. "1"})
            execute("UPDATE chestor_autocode_runs SET flow_dataflow_id = 'flow' WHERE id = $1", {owner .. "2"})
            drain("2001-01-01T00:00:00Z", 500)
            test.eq(count("chestor_autocode_runs", owner), 2)
            execute("DELETE FROM chestor_autocode_runs WHERE owner_id = $1", {owner})
        end)
        test.it("holds continuous arrivals to rate times the retention window", function()
            stubs.reset()
            local owner = uuid.v7()
            local epoch = time.parse(time.RFC3339, "2000-01-01T00:00:00Z")
            for tick = 1, 25 do
                local stamp = epoch:add(tick * 1000000000):utc():format_rfc3339()
                local arrival_owner = owner .. ":" .. tick .. ":"
                seed(arrival_owner, 60, stamp)
                execute([[INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text)
                    SELECT id, 1, 'log', '' FROM chestor_autocode_runs WHERE owner_id = $1]], {arrival_owner})
                execute([[INSERT INTO chestor_autocode_submissions (owner_id, key, canonical, run_id)
                    SELECT owner_id, id, '{}', id FROM chestor_autocode_runs WHERE owner_id = $1]], {arrival_owner})
                local cutoff = epoch:add((tick - 3) * 1000000000):utc():format_rfc3339()
                drain(cutoff, 50)
                if tick > 4 then
                    for _, table_name in ipairs({"chestor_autocode_runs", "chestor_autocode_run_events", "chestor_autocode_submissions"}) do
                        local db = sql.get("app:db")
                        local column = table_name == "chestor_autocode_runs" and "id" or "run_id"
                        local rows, err = db:query("SELECT COUNT(*) AS n FROM " .. table_name .. " WHERE " .. column .. " LIKE $1", {owner .. "%"})
                        db:release()
                        test.is_nil(err, tostring(err))
                        test.eq(rows[1].n, 60 * 4)
                    end
                end
            end
            drain("2001-01-01T00:00:00Z", 500)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

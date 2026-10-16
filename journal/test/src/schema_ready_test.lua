local test = require("test")
local registry = require("registry")
local sql = require("sql")
local waiter = require("waiter")
local clock = require("clock")
local funcs = require("funcs")

local function define_tests()
    test.describe("Journal migration readiness", function()
        test.it("waits beyond an early table until the last migration commits", function()
            clock.sleeps = 0
            clock.failure = nil
            test.is_true(waiter.run())
            test.eq(clock.sleeps, 1, "setup must wait for the final migration ledger row")
        end)

        test.it("surfaces registry and database failures at the readiness boundary", function()
            for _, failure in ipairs({ "registry", "database" }) do
                clock.sleeps = 0
                clock.failure = failure
                local ok, err = pcall(waiter.run)
                test.is_false(ok)
                test.contains(tostring(err), failure .. " unavailable")
            end
            clock.failure = nil
        end)

        test.it("retains retired session records and references when migration 05 runs", function()
            local db, open_err = sql.get("app:db")
            test.is_nil(open_err)
            local statements = {
                "INSERT INTO chestor_journal_sessions (journal_id, id, goal, current_digest, created_at, updated_at) VALUES ('preservation', 'session', 'Published goal', 'Published digest', 1, 2)",
                "INSERT INTO chestor_journal_events (journal_id, id, seq, ts, event_type, session_id, created_at) VALUES ('preservation', 'event', 1, 1, 'fixture', 'session', 1)",
                "INSERT INTO chestor_journal_tasks (journal_id, id, session_id, title, created_at, updated_at) VALUES ('preservation', 'task', 'session', 'Published task', 1, 2)",
                "INSERT INTO chestor_journal_artifacts (journal_id, id, session_id, title, created_at) VALUES ('preservation', 'artifact', 'session', 'Published artifact', 1)",
            }
            for _, statement in ipairs(statements) do
                local _, err = db:execute(statement)
                test.is_nil(err)
            end
            db:release()
            for _, direction in ipairs({ "down", "up", "up" }) do
                local result, err = funcs.call("chestor.journal.migrations:05_drop_sessions", {
                    database_id = "app:db", id = "chestor.journal.migrations:05_drop_sessions", direction = direction })
                test.is_nil(err)
                test.eq(result.failed, 0)
                db, open_err = sql.get("app:db")
                test.is_nil(open_err)
                local sessions, session_err = db:query("SELECT goal, current_digest FROM chestor_journal_sessions WHERE journal_id = 'preservation'")
                test.is_nil(session_err)
                test.eq(#sessions, 1)
                test.eq(sessions[1].goal, "Published goal")
                test.eq(sessions[1].current_digest, "Published digest")
                for _, name in ipairs({ "events", "tasks", "artifacts" }) do
                    local rows, query_err = db:query("SELECT session_id FROM chestor_journal_" .. name .. " WHERE journal_id = 'preservation'")
                    test.is_nil(query_err)
                    test.eq(#rows, 1)
                    test.eq(rows[1].session_id, "session")
                end
                db:release()
            end
            db, open_err = sql.get("app:db")
            test.is_nil(open_err)
            for _, name in ipairs({ "sessions", "events", "tasks", "artifacts" }) do
                local _, cleanup_err = db:execute("DELETE FROM chestor_journal_" .. name .. " WHERE journal_id = 'preservation'")
                test.is_nil(cleanup_err)
            end
            db:release()
        end)

        test.it("waits for every migration on the harness database", function()
            local entries, find_err = registry.find({ ["meta.type"] = "migration", ["meta.target_db"] = "app:db" })
            test.is_nil(find_err)
            test.is_true(#entries > 0)
            local db, open_err = sql.get("app:db")
            test.is_nil(open_err)
            test.not_nil(db)
            local rows, query_err = db:query("SELECT id FROM _migrations")
            db:release()
            test.is_nil(query_err)
            local applied: { [string]: boolean } = {}
            for _, row in ipairs(rows or {}) do applied[tostring(row.id)] = true end
            for _, entry in ipairs(entries) do
                test.is_true(applied[tostring(entry.id)] == true, "setup returns before " .. tostring(entry.id))
            end
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options: any)
    return run_cases(options)
end

return { run = run }

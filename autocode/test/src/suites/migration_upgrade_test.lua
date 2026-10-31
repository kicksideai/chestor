-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local funcs = require("funcs")

local function migrate(name: string, direction: string?)
    local id = "chestor.autocode.migrations:" .. name
    local result, err = funcs.call(id, {database_id = "app:migration_upgrade_db", id = id, direction = direction or "up"})
    test.is_nil(err, tostring(err))
    test.eq(result.failed, 0, tostring(result.error))
    return result
end

local function execute(db: sql.DB, statement: string)
    local _, err = db:execute(statement)
    test.is_nil(err, tostring(err))
end

local function stored(db: sql.DB)
    local rows, err = db:query("SELECT * FROM chestor_autocode_runs WHERE id = 'upgrade-run'")
    test.is_nil(err, tostring(err))
    test.eq(#rows, 1)
    test.eq(rows[1].result, "retained answer")
    test.eq(rows[1].status, "succeeded")
    return rows[1]
end

local cases = test.run_cases(function()
    test.describe("Autocode installed schema upgrade", function()
        test.it("preserves installed migration IDs and data through upgrade, replay and rollback", function()
            local db, open_err = sql.get("app:migration_upgrade_db")
            test.is_nil(open_err, tostring(open_err))
            local ok, failure = pcall(function()
                for _, name in ipairs({"01_create_tables", "02_delivery_and_generations", "03_image_recipe"}) do
                    test.eq(migrate(name).applied, 1)
                end
                execute(db, [[INSERT INTO chestor_autocode_account_state(account_id, last_error)
                    VALUES ('upgrade-account', 'retained account state')]])
                execute(db, [[INSERT INTO chestor_autocode_image_builds
                    (image_id, actor_id, actor_context, mode, requested_at, finished_at, projected, recipe)
                    VALUES ('upgrade-image', 'owner', '{}', 'initial', '2026-10-27T00:00:00Z',
                        '2026-10-27T00:01:00Z', 1, '{"ref":"old-image:tag"}')]])
                execute(db, [[INSERT INTO chestor_autocode_runs
                    (id, owner_id, actor_id, actor_context, agent, account_id, image_id, prompt, timeout_ms, status, result)
                    VALUES ('upgrade-run', 'owner', 'owner', '{}', 'claude', 'upgrade-account',
                        'upgrade-image', 'retained prompt', 60000, 'succeeded', 'retained answer')]])
                local _, before_err = db:query("SELECT account_pinned FROM chestor_autocode_runs")
                test.not_nil(before_err, "the fixture must have the installed, pre-upgrade schema")

                test.eq(migrate("04_durable_runs_and_approvals").applied, 1)
                local row = stored(db)
                test.eq(row.account_pinned, 1)
                for _, field in ipairs({"repo_ref", "input", "pending_status", "job_id"}) do test.eq(row[field], "") end
                local builds, build_err = db:query("SELECT * FROM chestor_autocode_image_builds WHERE image_id = 'upgrade-image'")
                test.is_nil(build_err, tostring(build_err))
                test.eq(builds[1].recipe, '{"ref":"old-image:tag"}')
                test.eq(builds[1].approved_recipe, "{}", "a mutable old reference must not become an immutable approval")
                test.eq(builds[1].approved_agents, "[]")
                test.eq(builds[1].job_id, "")
                local accounts, account_err = db:query("SELECT last_error FROM chestor_autocode_account_state WHERE account_id = 'upgrade-account'")
                test.is_nil(account_err, tostring(account_err))
                test.eq(accounts[1].last_error, "retained account state")

                for _, name in ipairs({"01_create_tables", "02_delivery_and_generations", "03_image_recipe", "04_durable_runs_and_approvals"}) do
                    test.eq(migrate(name).skipped, 1, "replay must use the existing migration ledger")
                end
                test.eq(migrate("04_durable_runs_and_approvals", "down").applied, 1)
                stored(db)
                local _, reverted_err = db:query("SELECT account_pinned FROM chestor_autocode_runs")
                test.not_nil(reverted_err)
                test.eq(migrate("04_durable_runs_and_approvals").applied, 1)
                test.eq(stored(db).account_pinned, 1)
            end)
            db:release()
            if not ok then error(failure) end
        end)
    end)
end)

return {run = cases}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local repo = require("repo")
local sql = require("sql")
local uuid = require("uuid")
local function cases()
    test.describe("autocode account query bounds", function()
        test.it("returns only requested account states and their last-day aggregates", function()
            local first, second, unrelated, unused = uuid.v7(), uuid.v7(), uuid.v7(), uuid.v7()
            for _, fixture in ipairs({{account = first, status = "failed"}, {account = second, status = "succeeded"},
                {account = unrelated, status = "failed"}, {account = second, status = "failed", old = true}}) do
                local id, err = repo.create_run(uuid.v7(), {actor_id = "test:actor", actor_context = "{}"}, {agent = "claude",
                    account_id = fixture.account, image_id = "image", options = {}, unattended = false, prompt = "task", repo_url = "", timeout_ms = 60000})
                test.is_nil(err, tostring(err))
                test.is_true(repo.finish_run(id, fixture.status, "", "", {}))
                if fixture.old then
                    local db = sql.get("app:db")
                    test.not_nil(db:execute("UPDATE chestor_autocode_runs SET created_at = '2000-01-01T00:00:00Z' WHERE id = $1", {id}))
                    db:release()
                end
            end
            test.is_nil(repo.settle_account(first, "first refusal", "2999-01-01T00:00:00Z"))
            test.is_nil(repo.settle_account(unrelated, "other refusal", "2999-01-01T00:00:00Z"))
            local states, err = repo.account_states({first, second, unused})
            test.is_nil(err, tostring(err))
            test.is_nil(states[unrelated])
            test.eq(states[first].runs_day, 1); test.eq(states[first].failures_day, 1)
            test.eq(states[first].last_error, "first refusal")
            test.eq(states[second].runs_day, 1); test.eq(states[second].failures_day, 0)
            test.eq(states[second].last_error, "")
            test.eq(states[unused].runs_day, 0); test.eq(states[unused].last_error, "")
        end)
        test.it("rejects a malformed account id before inserting a state", function()
            local state = stubs.reset()
            state.account_rows = {{account_id = false, rate_limits = "{}", reservation_order = 0, last_used_at = "", cooldown_until = "", last_error = "", runs_day = 0, failures_day = 0}}
            local states, err = subject.account_states({"one"})
            test.is_nil(states)
            test.is_true(errors.is(err, errors.INTERNAL))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

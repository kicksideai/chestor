-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")
local time = require("time")

type Columns = db.Columns
type AccountState = db.AccountState
local query = db.query
local execute = db.execute
local text = db.text
local int = db.int
local repo = {}

-- Account state.

local function account_state(row: Columns): AccountState
    return {reservation_order = int(row, "reservation_order"), last_used_at = text(row, "last_used_at"), cooldown_until = text(row, "cooldown_until"),
        last_error = text(row, "last_error"), runs_day = int(row, "runs_day"), failures_day = int(row, "failures_day")}
end

local function day_ago(): string
    return time.now():add("-24h"):utc():format_rfc3339()
end

-- account_states returns the state of each listed account; an account no run
-- has used yet has an empty state.
function repo.account_states(ids: {string}): ({[string]: AccountState}?, error?)
    local result: {[string]: AccountState} = {}
    if #ids == 0 then return result, nil end
    local marks: {string} = {}
    local params: {unknown} = {day_ago()}
    for index, id in ipairs(ids) do
        marks[#marks + 1] = "$" .. tostring(index + 1)
        params[#params + 1] = id
        result[id] = {reservation_order = 0, last_used_at = "", cooldown_until = "", last_error = "", runs_day = 0, failures_day = 0}
    end
    local list = table.concat(marks, ", ")
    local rows, err = query([[WITH recent AS (
        SELECT account_id, COUNT(*) AS runs_day, SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failures_day
        FROM chestor_autocode_runs WHERE created_at >= $1 AND account_id IN (]] .. list .. [[) GROUP BY account_id)
        SELECT ids.account_id, COALESCE(s.reservation_order, 0) AS reservation_order, COALESCE(s.last_used_at, '') AS last_used_at,
        COALESCE(s.cooldown_until, '') AS cooldown_until, COALESCE(s.last_error, '') AS last_error,
        COALESCE(r.runs_day, 0) AS runs_day, COALESCE(r.failures_day, 0) AS failures_day
        FROM (SELECT account_id FROM chestor_autocode_account_state WHERE account_id IN (]] .. list .. [[)
            UNION SELECT account_id FROM chestor_autocode_runs WHERE account_id IN (]] .. list .. [[)) ids
        LEFT JOIN chestor_autocode_account_state s ON s.account_id = ids.account_id
        LEFT JOIN recent r ON r.account_id = ids.account_id]], params)
    if err then return nil, err end
    for _, row in ipairs(rows or {}) do
        local columns: Columns = {row = row, problem = nil}
        local state = account_state(columns)
        local account_id = text(columns, "account_id")
        if columns.problem then return nil, columns.problem end
        result[account_id] = state
    end
    return result, nil
end

-- settle_account records how a run on the account ended: an empty refusal
-- clears the account's error; a cooldown keeps it out of balancing until then.
function repo.settle_account(account_id: string, refusal: string, cooldown_until: string, started_at: string?): error?
    local now = db.now()
    local _, err = execute([[UPDATE chestor_autocode_account_state
        SET cooldown_until = $1, last_error = $2, settled_at = $3
        WHERE account_id = $4 AND ((settled_at <= $5 AND ($2 <> '' OR cooldown_until <= $3))
        OR $1 > cooldown_until)]], {cooldown_until, refusal, now, account_id, started_at or now})
    return err
end

function repo.record_account_error(account_id: string, message: string): error?
    local _, err = execute([[UPDATE chestor_autocode_account_state SET last_error = $1, settled_at = $2
        WHERE account_id = $3]], {message, db.now(), account_id})
    return err
end

-- clear_cooldown takes an account back into balancing.
function repo.clear_cooldown(account_id: string): error?
    local _, err = execute("UPDATE chestor_autocode_account_state SET cooldown_until = '', last_error = '' WHERE account_id = $1", {account_id})
    return err
end

function repo.delete_account_state(account_id: string): error?
    local _, err = execute("DELETE FROM chestor_autocode_account_state WHERE account_id = $1", {account_id})
    return err
end

return repo

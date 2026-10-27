-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")
local time = require("time")

type Columns = db.Columns
type AccountState = db.AccountState
local fail = db.fail
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
    local rows, err = query([[SELECT ids.account_id, COALESCE(s.reservation_order, 0) AS reservation_order, COALESCE(s.last_used_at, '') AS last_used_at,
        COALESCE(s.cooldown_until, '') AS cooldown_until, COALESCE(s.last_error, '') AS last_error,
        COALESCE(r.runs_day, 0) AS runs_day, COALESCE(r.failures_day, 0) AS failures_day
        FROM (SELECT account_id FROM chestor_autocode_account_state UNION SELECT account_id FROM chestor_autocode_runs) ids
        LEFT JOIN chestor_autocode_account_state s ON s.account_id = ids.account_id
        LEFT JOIN (SELECT account_id, COUNT(*) AS runs_day, SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failures_day
            FROM chestor_autocode_runs WHERE created_at >= $1 GROUP BY account_id) r ON r.account_id = ids.account_id
        WHERE ids.account_id IN (]] .. list .. ")", params)
    if err then return nil, err end
    for _, row in ipairs(rows or {}) do
        local columns: Columns = {row = row, problem = nil}
        local state = account_state(columns)
        if columns.problem then return nil, fail(columns.problem) end
        result[text(columns, "account_id")] = state
    end
    return result, nil
end

-- settle_account records how a run on the account ended: an empty refusal
-- clears the account's error; a cooldown keeps it out of balancing until then.
function repo.settle_account(account_id: string, refusal: string, cooldown_until: string, started_at: string?): error?
    local now = db.now()
    local _, err = execute([[INSERT INTO chestor_autocode_account_state
        (account_id, last_used_at, cooldown_until, last_error, settled_at) VALUES ($1, '', $2, $3, $4)
        ON CONFLICT (account_id) DO UPDATE SET cooldown_until = excluded.cooldown_until,
        last_error = excluded.last_error, settled_at = excluded.settled_at
        WHERE (chestor_autocode_account_state.settled_at <= $5 AND (excluded.last_error <> '' OR chestor_autocode_account_state.cooldown_until <= $4))
        OR excluded.cooldown_until > chestor_autocode_account_state.cooldown_until]],
        {account_id, cooldown_until, refusal, now, started_at or now})
    return err
end

function repo.record_account_error(account_id: string, message: string): error?
    local _, err = execute([[INSERT INTO chestor_autocode_account_state (account_id, last_error, settled_at) VALUES ($1, $2, $3)
        ON CONFLICT (account_id) DO UPDATE SET last_error = excluded.last_error, settled_at = excluded.settled_at]],
        {account_id, message, db.now()})
    return err
end

-- clear_cooldown takes an account back into balancing.
function repo.clear_cooldown(account_id: string): error?
    local _, err = execute("UPDATE chestor_autocode_account_state SET cooldown_until = '' WHERE account_id = $1", {account_id})
    return err
end

function repo.delete_account_state(account_id: string): error?
    local _, err = execute("DELETE FROM chestor_autocode_account_state WHERE account_id = $1", {account_id})
    return err
end

return repo

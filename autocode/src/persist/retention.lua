-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")
local sql = require("sql")
local query, transaction, fail = db.query, db.transaction, db.fail
local M = {}
type Candidate = {id: string, job_id: string}
function M.candidates(before: string, limit: integer): ({Candidate}?, error?)
    local rows, err = query([[SELECT id, job_id FROM chestor_autocode_runs
        WHERE (worktree = '{}' OR worktree LIKE '%"removed":true%') AND finished_at > '' AND (flow_dataflow_id = '' OR workflow_delivered = 1)
        AND finished_at < $1 ORDER BY finished_at, id LIMIT $2]], {before, limit})
    if err then return nil, err end
    return db.decode(rows, err, function(row: db.Columns): Candidate
        return {id = db.text(row, "id"), job_id = db.text(row, "job_id")}
    end)
end
function M.prune_one(id: string, before: string, limit: integer): (integer?, error?, boolean?)
    local deleted, needs_continue = 0, false
    local err = transaction({}, function(tx: sql.Transaction): error?
        local locked, lock_err = tx:execute([[UPDATE chestor_autocode_runs SET finished_at = finished_at
            WHERE id = $1 AND (worktree = '{}' OR worktree LIKE '%"removed":true%') AND finished_at > '' AND finished_at < $2
            AND (flow_dataflow_id = '' OR workflow_delivered = 1)]], {id, before})
        if lock_err then return lock_err end
        if not locked or locked.rows_affected == 0 then return nil end
        local events, events_err = tx:execute([[DELETE FROM chestor_autocode_run_events
            WHERE run_id = $1 AND seq IN (SELECT seq FROM chestor_autocode_run_events
                WHERE run_id = $1 ORDER BY seq LIMIT $2)
            AND EXISTS (SELECT 1 FROM chestor_autocode_runs WHERE id = $1
                AND finished_at > '' AND finished_at < $3
                AND (flow_dataflow_id = '' OR workflow_delivered = 1))]], {id, limit, before})
        if events_err then return events_err end
        local submissions, submissions_err = tx:execute([[DELETE FROM chestor_autocode_submissions
            WHERE run_id = $1 AND (owner_id, key) IN (SELECT owner_id, key FROM chestor_autocode_submissions
                WHERE run_id = $1 LIMIT $2)
            AND EXISTS (SELECT 1 FROM chestor_autocode_runs WHERE id = $1
                AND finished_at > '' AND finished_at < $3
                AND (flow_dataflow_id = '' OR workflow_delivered = 1))]], {id, limit, before})
        if submissions_err then return submissions_err end
        local removed, remove_err = tx:execute([[DELETE FROM chestor_autocode_runs WHERE id = $1
            AND (worktree = '{}' OR worktree LIKE '%"removed":true%') AND finished_at > '' AND finished_at < $2
            AND (flow_dataflow_id = '' OR workflow_delivered = 1)
            AND NOT EXISTS (SELECT 1 FROM chestor_autocode_run_events WHERE run_id = $1)
            AND NOT EXISTS (SELECT 1 FROM chestor_autocode_submissions WHERE run_id = $1)]], {id, before})
        if remove_err then return remove_err end
        deleted = deleted + (removed and removed.rows_affected or 0)
        needs_continue = needs_continue or (events and events.rows_affected == limit) == true
            or (submissions and submissions.rows_affected == limit) == true
        return nil
    end)
    if err then return nil, err end
    return deleted, nil, needs_continue
end
function M.next_finished(before: string): (string?, error?)
    local remaining, remaining_err = query([[SELECT finished_at FROM chestor_autocode_runs
        WHERE (worktree = '{}' OR worktree LIKE '%"removed":true%') AND finished_at > '' AND (flow_dataflow_id = '' OR workflow_delivered = 1)
        AND finished_at >= $1 ORDER BY finished_at, id LIMIT 1]], {before})
    if remaining_err then return nil, remaining_err end
    local next_finished_at: string? = nil
    if remaining and remaining[1] then
        local stamp = remaining[1].finished_at
        if type(stamp) ~= "string" then return nil, fail("retention run has no finished time") end
        next_finished_at = stamp
    end
    return next_finished_at, nil
end
return M

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local jobs = require("jobs")
local slot_purge = require("slot_purge")
type PruneProgress = {needs_continue: boolean, next_finished_at: string?}

-- Each run transaction removes at most one page from each child table. The
-- run remains until both children drain; its row lock fences a refreshed cutoff.
local function prune_runs(before: string, limit: integer): (integer?, error?, PruneProgress?)
    local deleted = 0
    local needs_continue = false
    local rows, err = store.candidates(before, limit)
    if err then return nil, err end
    local retry_position: {finished_at: string, id: string}? = nil
    local previous = {finished_at = "", id = ""}
    for _, row in ipairs(rows) do
        local active = false
        if type(row.job_id) == "string" and row.job_id ~= "" then
            local _, cancel_err = jobs.cancel(row.job_id)
            if cancel_err then return nil, cancel_err end
            local job, job_err = jobs.get_job(row.job_id)
            if job_err then return nil, job_err end
            if job and (job.status == "pending" or job.status == "running") then
                active = true
            end
        end
        if not active then
            for _, key in ipairs({"resume", "run"}) do
                local _, purge_err = slot_purge.purge_slot({namespace = "chestor.autocode", scope = row.id, key = key})
                if purge_err then
                    if errors.is(purge_err, errors.CONFLICT) and purge_err:details().cleanup_pending == true then
                        needs_continue = needs_continue or purge_err:details().needs_continue == true
                        if purge_err:details().needs_continue == true and not retry_position then retry_position = previous end
                        active = true
                        break
                    end
                    return nil, purge_err
                end
            end
            if not active then
                local count, prune_err, more = store.prune_one(row.id, before, limit)
                if prune_err then return nil, prune_err end
                deleted = deleted + (count :: integer)
                needs_continue = needs_continue or more == true
                if more and not retry_position then retry_position = previous end
            end
        end
        previous = {finished_at = row.finished_at, id = row.id}
    end
    local last = retry_position or (#rows == limit and rows[#rows] or nil)
    local cursor_err = store.advance_cursor(last and last.finished_at or "", last and last.id or "")
    if cursor_err then return nil, cursor_err end
    local next_finished_at, deadline_err = store.next_finished(before)
    if deadline_err then return nil, deadline_err end
    return deleted, nil, {needs_continue = #rows == limit or needs_continue, next_finished_at = next_finished_at}
end

return {prune_runs = prune_runs}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local jobs = require("jobs")
local slot_purge = require("slot_purge")
local runs = require("runs")
local job_outcome = require("job_outcome")
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

-- Purge first: Jobs atomically refuses a running lease. A crash between purge
-- and settlement leaves the queued row eligible for the next callback.
local function expire_queued(before: string, limit: integer): (boolean?, error?, string?)
    local rows, err = store.queued(before, limit)
    if not rows then return nil, err end
    local purged = 0
    local needs_continue = false
    for _, row in ipairs(rows) do
        local claimed, claim_err = store.claim_expiry(row.id, before)
        if claim_err then return nil, claim_err end
        if claimed then
            local _, purge_err = slot_purge.purge_slot({namespace = "chestor.autocode", scope = row.id, key = "run"})
            if purge_err then
                if not errors.is(purge_err, errors.CONFLICT) or purge_err:details().cleanup_pending ~= true then return nil, purge_err end
                needs_continue = needs_continue or purge_err:details().needs_continue == true
            else
                local expired = errors.new({kind = errors.UNAVAILABLE, message = "run queue window expired before execution started",
                    retryable = false, details = {code = "autocode.queue_expired"}})
                -- No lease remains. Preserve an outcome written by a worker that
                -- observed the expiry claim before releasing its lease.
                local current, read_err = runs.stored_run(row.id)
                if read_err then return nil, read_err end
                local status: "failed" | "cancelled" | "succeeded" | "queued" | "running" = "failed"
                local answer, reason, usage, native = "", expired:message(), {}, job_outcome.data(expired)
                if current and current.pending_status then
                    status, answer, reason, usage, native = current.pending_status, current.result, current.error, current.usage, current.error_native
                end
                local _, finish_err = runs.finish_run(row.id, status, answer, reason, usage, nil, native)
                if finish_err then return nil, finish_err end
                purged = purged + 1
            end
        end
    end
    local next_created, next_err = store.next_queued(before)
    if next_err then return nil, next_err end
    -- A page held entirely by leases parks until Jobs activity wakes retention.
    return needs_continue or (#rows == limit and purged > 0), nil, next_created
end
return {prune_runs = prune_runs, expire_queued = expire_queued}

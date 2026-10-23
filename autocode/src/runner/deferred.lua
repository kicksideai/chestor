-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Jobs autocode commits together with its own rows: a run and its job, a
-- settled run and its workflow resume, an image build request and its job.
-- The rows and the jobs share one database, so one transaction holds both.
local repo = require("repo")
local jobs = require("jobs")
local jobs_config = require("jobs_config")
local jobs_wake = require("jobs_wake")
local execution_identity = require("execution_identity")

type Job = {scope: string, key: string, owner_id: string, job_type: string, max_attempts: integer,
    payload: {[string]: unknown}}

local M = {}

-- check refuses work when the autocode tables and the jobs live apart.
function M.check(): error?
    local db_id, err = repo.db_id()
    if not db_id then return err end
    if db_id ~= jobs_config.db_id() then
        return errors.new({kind = errors.INVALID,
            message = "autocode commits its rows with their jobs: bind target_db to the jobs database"})
    end
    return nil
end

-- capture records the caller's execution identity as the row the job's
-- worker resolves again before it acts.
function M.capture(): (repo.Identity?, error?)
    local identity, err = execution_identity.capture()
    if not identity then return nil, err :: error end
    local row, row_err = execution_identity.to_row(identity)
    if not row then return nil, row_err :: error end
    return {actor_id = tostring(row.actor_id), actor_context = tostring(row.actor_context)}, nil
end

-- enqueue returns the transactional step that enqueues `job`.
function M.enqueue(job: Job): repo.Transactional
    local step: repo.Transactional = function(tx, dbtype)
        local _, err = jobs.enqueue_tx(tx, dbtype, {namespace = "chestor.autocode", scope = job.scope, key = job.key,
            owner_locator = {kind = "user", id = job.owner_id}, job_type = job.job_type, max_attempts = job.max_attempts,
            immutable_payload = job.payload})
        return err
    end
    return step
end

-- nudge wakes the jobs pool after a commit that enqueued a job.
function M.nudge(): error?
    local _, err = jobs_wake.nudge_workers(nil, nil)
    return err
end

return M

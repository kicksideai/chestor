-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Jobs autocode commits together with its own rows: a run and its job, a
-- settled run and its workflow resume, an image build request and its job.
-- The rows and the jobs share one database, so one transaction holds both.
local repo = require("repo")
local jobs_config = require("jobs_config")
local jobs_wake = require("jobs_wake")
local execution_identity = require("execution_identity")

local job_outcome = require("job_outcome")

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
    if not identity then return nil, job_outcome.native(err) end
    local row, row_err = execution_identity.to_row(identity)
    if not row then return nil, job_outcome.native(row_err) end
    if type(row.actor_id) ~= "string" or row.actor_id == "" or type(row.actor_context) ~= "string" then
        return nil, errors.new({kind = errors.INTERNAL, message = "execution identity returned malformed row data"})
    end
    return {actor_id = row.actor_id, actor_context = row.actor_context}, nil
end

-- nudge wakes the jobs pool after a commit that enqueued a job.
function M.nudge(): error?
    local _, err = jobs_wake.nudge_workers(nil, nil)
    return err
end

return M

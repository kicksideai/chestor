-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The job that continues the workflow node a run started. The runner
-- enqueues it in the transaction that settles the run; the node's output is
-- the stored run's result, so nothing a caller supplies reaches the Flow.
-- Blocks resumes under the Flow's own identity.
local funcs = require("funcs")
local security = require("security")
local repo = require("repo")
local canonical_json = require("canonical_json")

local RESUME = "kickside.blocks:resume"

local function failure(message: string, kind: string): (nil, error)
    return nil, errors.new({kind = kind, message = message})
end

local function run(input: {[string]: unknown}): ({run_id: string}?, error?)
    local payload = type(input.payload) == "table" and input.payload or {}
    local run_id = type(payload.run_id) == "string" and payload.run_id or ""
    local stored, err = repo.stored_run(run_id)
    if err then return nil, errors.wrap(err, "run read") end
    if not stored then return failure("run " .. run_id .. " not found", errors.NOT_FOUND) end
    local flow = stored.flow
    if not flow then return failure("run " .. run_id .. " was not started by a workflow node", errors.INVALID) end
    if stored.status ~= "succeeded" and stored.status ~= "failed" and stored.status ~= "cancelled" then
        return failure("run " .. run_id .. " has not settled", errors.INVALID)
    end
    local actor, scope = security.actor(), security.scope()
    if not actor or not scope then return failure("workflow resume identity is required", errors.PERMISSION_DENIED) end
    local _, resume_err = funcs.new():with_actor(actor):with_scope(scope):call(RESUME, {dataflow_id = flow.dataflow_id, signal_id = flow.signal_id,
        payload = {run_id = stored.id, status = stored.status, answer = stored.result, error = stored.error, usage = canonical_json.object(stored.usage),
            agent = stored.agent, account_id = stored.account_id}})
    if resume_err then return nil, errors.wrap(resume_err, "workflow resume") end
    local delivery_err = repo.acknowledge_delivery(run_id)
    if delivery_err then return nil, delivery_err end
    return {run_id = run_id}, nil
end

return { run = run }

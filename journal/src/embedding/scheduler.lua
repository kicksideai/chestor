local jobs = require("jobs")
local availability = require("availability")

local M = {}
M._jobs = nil

local function shared_jobs(): any
    return M._jobs or jobs
end

-- Checkpoint, graph and continuation triggers share one reusable Jobs slot.
-- Atomic demand wakes parked work and retains a follow-up while it runs.
function M.schedule(journal_id: string, last_seq: number, nonce: any?): (error?, any?)
    if journal_id == "" then return nil end
    if nonce == nil and last_seq < 1 then return nil end
    local state = availability.state()
    if state.status == "unavailable" then return nil, state end
    local _, err = shared_jobs().enqueue({
        namespace = "thread",
        scope = journal_id,
        key = "journal-embedding:" .. journal_id,
        slot = true,
        parked = true,
        demand = true,
        owner_locator = { kind = "thread", id = journal_id },
        thread_id = journal_id,
        job_type = "chestor.journal.embedding:worker",
        concurrency_key = journal_id .. ":embeddings",
        immutable_payload = { journal_id = journal_id },
        queue_tier = "maintenance",
        max_attempts = 5,
    })
    if err then return err end
    return nil, state
end

return M

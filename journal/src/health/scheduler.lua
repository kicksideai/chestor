local time = require("time")
local jobs = require("jobs")
local clock = require("clock")
local types = require("types")
local db_ops = require("db")

local M = {}
M._jobs = nil

local function shared_jobs(): any
    return M._jobs or jobs
end

-- The scheduled_at string is formatted for the SQL dialect the jobs engine
-- compares it against; the journal and the jobs engine share the app database
-- by wiring, so the journal connection's dialect is the jobs dialect.
local function future(delay_s: number): (string?, error?)
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local dialect, dialect_err
    if type(db.type) == "function" then dialect, dialect_err = db:type() end
    db:release()
    if dialect_err then return nil, errors.wrap(dialect_err, "journal database type unavailable") end
    if dialect == nil then return nil, errors.new({ kind = errors.INTERNAL, message = "journal database type unavailable" }) end
    return tostring(clock.format(time.now():add(delay_s * time.SECOND), tostring(dialect))), nil
end

-- Enqueue the next health writer beat for the journal, one interval out.
-- Idempotency keys by the target interval bucket, so the projection-driven
-- kickoff and the writer's own chain collapse into one job per interval per
-- journal; a dead chain re-primes on the next projected event. One enqueue
-- path (maintenance tier), like the embedding scheduler.
function M.schedule(journal_id: string): error?
    if journal_id == "" then return nil end
    local interval = types.HEALTH.INTERVAL_S
    local bucket = math.floor((os.time() + interval) / interval)
    local scheduled_at, future_err = future(interval)
    if not scheduled_at then return future_err end
    local _, err = shared_jobs().enqueue({
        namespace = "thread",
        scope = journal_id,
        key = "journal-health:" .. journal_id .. ":" .. tostring(bucket),
        owner_locator = { kind = "thread", id = journal_id },
        thread_id = journal_id,
        job_type = types.HEALTH.WORKER_REF:gsub("^func://", ""),
        concurrency_key = journal_id .. ":health",
        immutable_payload = { journal_id = journal_id },
        queue_tier = "maintenance",
        scheduled_at = scheduled_at,
        max_attempts = 3,
    })
    if err then return err end
    return nil
end

return M

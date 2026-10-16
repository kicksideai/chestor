local component = require("component")
local projector = require("projector")
local embedding_scheduler = require("embedding_scheduler")
local health_scheduler = require("health_scheduler")
local logger = require("logger")
local job_types = require("job_types")

local function fail(message: any): error
    local detail = tostring(message)
    logger:error("Journal state projection failed: " .. detail)
    return errors.new({message = detail, kind = errors.INTERNAL}) :: error
end

local function run(input: any): table
    local result, err = projector.run(input, component)
    if not result then
        local native = type(err) == "userdata" and err or fail(err or "projector returned no result")
        return {ok = false, error_native = job_types.error_to_data(native :: error)}
    end
    local projection = type(input) == "table" and type(input.projection) == "table" and input.projection or {}
    local journal_id = tostring(type(input) == "table" and (input.thread_id or projection.thread_id) or "")
    local schedule_err, embedding_state = embedding_scheduler.schedule(journal_id, tonumber(result.last_seq) or 0)
    if schedule_err then return {ok = false, error_native = job_types.error_to_data(fail("failed to schedule Journal embeddings: " .. tostring(schedule_err)))} end
    -- Every projected event primes the journal's health writer chain; the
    -- scheduler dedupes to one beat per interval, so a lapsed chain restarts
    -- on the next fact while a live one keeps its cadence (X6).
    local health_err = health_scheduler.schedule(journal_id)
    if health_err then return {ok = false, error_native = job_types.error_to_data(fail("failed to schedule Journal health beat: " .. tostring(health_err)))} end
    result.body.embeddings = embedding_state
    return result
end

return { run = run }

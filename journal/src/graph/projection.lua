local component = require("component")
local projector = require("projector")
local embedding_scheduler = require("embedding_scheduler")
local logger = require("logger")
local job_types = require("job_types")

local function fail(message: any): error
    local detail = tostring(message)
    logger:error("Journal graph projection failed: " .. detail)
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
    local last_seq = tonumber(result.last_seq) or 0
    local schedule_err, embedding_state = embedding_scheduler.schedule(journal_id, last_seq, "graph:" .. tostring(last_seq))
    if schedule_err then return {ok = false, error_native = job_types.error_to_data(fail("failed to schedule graph node embeddings: " .. tostring(schedule_err)))} end
    result.body.embeddings = embedding_state
    return result
end

return { run = run }

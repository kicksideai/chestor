local config = require("config")
local jobs = require("jobs")
local job_intents = require("job_intents")
local policy = require("policy")
local db = require("db")
local types = require("types")
local reader = require("reader")

local M = {}
M._jobs = nil

local function shared_jobs(): any
    return M._jobs or jobs
end

local function agent_enabled(graph_config: any): boolean
    local maintainer = type(graph_config) == "table" and type((graph_config :: any).maintainer) == "table"
        and (graph_config :: any).maintainer or {}
    local mode = tostring(maintainer.mode or "deterministic")
    return mode == "agent" or mode == "deterministic+agent"
end

function M.schedule(tx: any, journal_id: string, graph: any, event_type: string, tags: any,
    source_seq: number): error?
    local graph_config = graph.config
    if tostring(graph.lifecycle) ~= "active" or not agent_enabled(graph_config) then return nil end
    local builtin = graph.id == "map"
    if not builtin and not config.matches(graph_config, event_type, tags) then return nil end
    local current, current_err = reader.graph(tx, journal_id, tostring(graph.id))
    if not current then return current_err end
    local trigger, trigger_err = policy.evaluate(tx, journal_id, current, source_seq)
    if trigger_err then return trigger_err end
    if not trigger then return nil end
    return job_intents.enqueue(tx, journal_id, tostring(graph.id), tonumber(trigger.source_from_seq) or source_seq,
        tonumber(trigger.source_to_seq) or source_seq, tonumber(graph.config_revision) or 0,
        tostring(trigger.key), (graph_config :: any).execution_identity)
end

function M.dispatch(journal_id: string): error?
    local handle, open_err = db.open()
    if not handle then return open_err end
    local pending, pending_err = job_intents.pending(handle, journal_id, 100)
    if pending_err then handle:release(); return pending_err end
    for _, intent in ipairs(pending or {}) do
        local job_id, enqueue_err = shared_jobs().enqueue({
            namespace = "thread",
            scope = journal_id,
            key = intent.job_id,
            owner_locator = { kind = "thread", id = journal_id },
            thread_id = journal_id,
            job_type = types.GRAPH_MAINTENANCE_JOB_TYPE,
            concurrency_key = journal_id .. ":" .. tostring(intent.graph_id),
            immutable_payload = { journal_id = journal_id, job_id = intent.job_id },
            max_attempts = 5,
        })
        if enqueue_err then handle:release(); return enqueue_err end
        if job_id then
            local mark_err = job_intents.mark_dispatched(handle, journal_id, tostring(intent.job_id))
            if mark_err then handle:release(); return mark_err end
        end
    end
    handle:release()
    return nil
end

return M

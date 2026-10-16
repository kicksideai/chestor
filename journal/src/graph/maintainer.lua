local agent_context = require("agent_context")
local db = require("db")
local graph_reader = require("graph_reader")
local journal_reader = require("journal_reader")
local jobs = require("jobs")
local prompt = require("prompt")
local tool_caller = require("tool_caller")

local M = {}

local DEFAULT_AGENT = "chestor.journal.graph:default_maintainer"
local MAX_SOURCE_EVENTS = 100
local MAX_SOURCE_CHARS = 32000

local function source_events(handle: any, journal_id: string, from_seq: number, to_seq: number): (any?, error?)
    local rows, err = db.query(handle, [[
        SELECT * FROM chestor_journal_events
         WHERE journal_id = ? AND seq >= ? AND seq <= ?
         ORDER BY seq ASC LIMIT ?
    ]], { journal_id, from_seq, to_seq, MAX_SOURCE_EVENTS })
    if err then return nil, err end
    local out = {}
    for _, row in ipairs(rows or {}) do out[#out + 1] = journal_reader.decode_event(row) end
    return out, nil
end

local function compact_sources(events: any): string
    local parts = {}
    local length = 0
    for _, event in ipairs(events or {}) do
        local line = "#" .. tostring(event.seq) .. " " .. tostring(event.event_type)
            .. " [" .. tostring(event.id) .. "] " .. tostring(event.title or "")
            .. "\n" .. tostring(event.body or "")
        if length + #line > MAX_SOURCE_CHARS then break end
        parts[#parts + 1] = line
        length = length + #line
    end
    return table.concat(parts, "\n\n")
end

local function trait_specs(value: any): any
    local out = {}
    for _, id in ipairs(type(value) == "table" and value or {}) do
        if tostring(id) ~= "" then out[#out + 1] = { id = tostring(id) } end
    end
    return out
end

function M.run(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if type(args.payload) == "table" then args = args.payload end
    local journal_id = db.trim(args.journal_id)
    local job_id = db.trim(args.job_id)
    if journal_id == "" or job_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "journal_id and job_id are required" }) end

    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local job, job_err = jobs.get(handle, journal_id, job_id)
    if not job then handle:release(); return nil, job_err or errors.new({ kind = errors.NOT_FOUND, message = "graph maintainer job not found" }) end
    local graph, graph_err = graph_reader.graph(handle, journal_id, tostring(job.graph_id))
    if not graph then handle:release(); return nil, graph_err end
    if tonumber(graph.config_revision) ~= tonumber(job.config_revision) then
        local complete_err = jobs.complete(handle, journal_id, job_id)
        handle:release()
        if complete_err then return nil, complete_err end
        return { skipped = true, reason = "configuration revision changed" }, nil
    end
    if tostring(graph.lifecycle) ~= "active" then
        local complete_err = jobs.complete(handle, journal_id, job_id)
        handle:release()
        if complete_err then return nil, complete_err end
        return { skipped = true, reason = "graph is not active" }, nil
    end
    local events, events_err = source_events(handle, journal_id,
        tonumber(job.source_from_seq) or 0, tonumber(job.source_to_seq) or 0)
    if events_err then handle:release(); return nil, events_err end
    if #(events or {}) == 0 then handle:release(); return nil, errors.new({ kind = errors.UNAVAILABLE, message = "source events are not projected yet" }) end
    local window, window_err = graph_reader.window(handle, journal_id, tostring(job.graph_id), { levels = 2, limit = 80, edge_limit = 200 })
    if not window then handle:release(); return nil, window_err end
    local state, state_err = journal_reader.journal_state(handle, journal_id)
    handle:release()
    if state_err then return nil, state_err end
    local active_task_id = db.trim(state and (state :: any).active_task_id)

    local config = graph.config or {}
    local maintainer = type(config.maintainer) == "table" and config.maintainer or {}
    local requested_agent = db.trim(maintainer.agent_id)
    local selected_agent = requested_agent ~= "" and requested_agent or DEFAULT_AGENT
    local ctx = agent_context.new({ context = { journal_id = journal_id, graph_id = graph.id } })
    ctx:add_tools({
        { id = "chestor.journal.traits:journal_query", context = { journal_id = journal_id, graph_id = graph.id } },
        { id = "chestor.journal.traits:journal_graph", context = { journal_id = journal_id, graph_id = graph.id } },
    })
    local traits = trait_specs(maintainer.trait_ids)
    if #traits > 0 then ctx:set_active_traits(traits) end
    local agent, agent_err = ctx:load_agent(selected_agent, { model = tostring(maintainer.model or "class:fast") })
    if not agent then return nil, agent_err end

    local window_summary = db.encode({
        revision = graph.revision,
        nodes = window.nodes,
        edges = window.edges,
        collapsed_node_count = window.collapsed_node_count,
    }, {})
    local policy_summary = db.encode({
        sources = config.sources,
        shape = config.shape,
        retention = config.retention,
        write_policy = config.write_policy,
        layout = config.layout,
    }, {})
    local message = "Maintain Journal graph `" .. tostring(graph.id) .. "` for journal `" .. journal_id .. "`.\n"
        .. "Current graph revision: " .. tostring(graph.revision) .. ".\n"
        .. "Use request id `" .. job_id .. ":ops`, origin `internal_agent`, and expected_revision " .. tostring(graph.revision) .. " if you apply changes.\n"
        .. "Every semantic change must cite source_event_ids. Prefer no mutation when evidence is uncertain.\n"
        .. "Active task: " .. (active_task_id ~= "" and ("`task:" .. active_task_id .. "`") or "none")
        .. ". Never restructure the subtree rooted at the active task beyond adding facts.\n\n"
    if db.trim(maintainer.prompt) ~= "" then message = message .. "Graph-specific rule:\n" .. tostring(maintainer.prompt) .. "\n\n" end
    message = message .. "Declarative graph policy:\n" .. policy_summary
        .. "\n\nBounded current graph window:\n" .. window_summary
        .. "\n\nSource events:\n" .. compact_sources(events)
    -- The compiled agent runs one LLM turn per step(prompt_builder); tool calls
    -- come back on the response for the caller to execute and fold into the
    -- builder, so the loop below owns the agentic cycle.
    local builder = prompt.new()
    builder:add_user(message)
    local caller = tool_caller.new()

    local maximum = math.max(1, math.min(tonumber(maintainer.maximum_iterations) or 8, 20))
    local iterations = 0
    while iterations < maximum do
        iterations = iterations + 1
        local response, step_err = agent:step(builder, { context = { journal_id = journal_id, graph_id = graph.id } })
        if step_err then return nil, step_err end
        if not response then break end
        local calls = response.tool_calls
        if not calls or #calls == 0 then break end
        for _, call in ipairs(calls) do
            local arguments = call.arguments
            if type(arguments) ~= "string" then arguments = db.encode(arguments, {}) end
            builder:add_function_call(tostring(call.name), tostring(arguments or "{}"), call.id ~= nil and tostring(call.id) or nil)
        end
        local validated, validation_err = caller:validate(calls)
        if validation_err then return nil, validation_err end
        local results = caller:execute({ journal_id = journal_id, graph_id = graph.id }, validated)
        for _, call in ipairs(calls) do
            local exec = type(results) == "table" and (results :: any)[call.id] or nil
            if not exec then return nil, errors.new({ kind = errors.INTERNAL, message = "tool execution returned no result" }) end
            if exec.error then return nil, exec.error end
            builder:add_function_result(tostring(call.name), exec.result, call.id ~= nil and tostring(call.id) or nil)
        end
    end
    local completion_handle, completion_err = db.open()
    if not completion_handle then return nil, completion_err end
    local mark_err = jobs.complete(completion_handle, journal_id, job_id)
    completion_handle:release()
    if mark_err then return nil, mark_err end
    return {
        completed = true,
        graph_id = graph.id,
        starting_revision = graph.revision,
        iterations = iterations,
        agent_id = selected_agent,
        model = maintainer.model or "class:fast",
        trait_ids = maintainer.trait_ids or {},
    }, nil
end

return M

local M: any = {}

function M.reset()
    M.failure = nil
    M.stage = nil
    M.loads = {}
    M.completed = 0
    M.steps = 0
    M.released = 0
    M.agent_id = "selected-agent"
end

function M.trim(value) return tostring(value or ""):match("^%s*(.-)%s*$") end
function M.encode(_value, _default) return "{}" end
function M.open()
    return { release = function() M.released = M.released + 1 end }, nil
end
function M.query(_handle, _statement, _params)
    return {{ id = "event", seq = 1, event_type = "note", body = "Evidence" }}, nil
end
function M.decode_event(row) return row end
function M.get(_handle, _journal_id, _job_id)
    return { graph_id = "graph", config_revision = 1, source_from_seq = 1, source_to_seq = 1 }, nil
end
function M.graph(_handle, _journal_id, _graph_id)
    return { id = "graph", revision = 1, config_revision = 1, lifecycle = "active",
        config = { maintainer = { agent_id = M.agent_id } } }, nil
end
function M.window(_handle, _journal_id, _graph_id, _options) return { nodes = {}, edges = {} }, nil end
function M.journal_state(_handle, _journal_id) return {}, nil end
function M.complete(_handle, _journal_id, _job_id) M.completed = M.completed + 1; return nil end
function M.new(_options) return M end
function M.add_tools(_self, _tools) end
function M.set_active_traits(_self, _traits) end
function M.load_agent(_self, id, _options)
    M.loads[#M.loads + 1] = id
    if M.stage == "load" and #M.loads == 1 then return nil, M.failure end
    return M, nil
end
function M.step(_self, _builder, _options)
    M.steps = M.steps + 1
    if M.stage == "step" then return nil, M.failure end
    if M.steps > 1 then return { result = "Done" }, nil end
    return { tool_calls = {{ id = "call", name = "tool", arguments = "{}" }} }, nil
end
function M.add_user(_self, _message) end
function M.add_function_call(_self, _name, _arguments, _id) end
function M.add_function_result(_self, _name, _content, _id) end
function M.validate(_self, calls)
    if M.stage == "validate" then return nil, M.failure end
    return calls, nil
end
function M.execute(_self, _context, _calls)
    if M.stage == "execute" then return { call = { result = { success = false }, error = M.failure } } end
    return { call = { result = "Applied" } }
end

M.reset()
return M

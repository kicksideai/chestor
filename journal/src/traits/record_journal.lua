local commands = require("commands")
local queries = require("queries")
local support = require("support")
local db_ops = require("db")
local cursors = require("cursors")

local ACTIVE_DEFAULT_KIND = { entry = true, checkpoint = true, artifact = true }
local RECORD_KIND = {
    observation = true, decision = true, assumption = true, constraint = true,
    finding = true, risk = true, question = true, blocker = true, evidence = true,
    handoff = true, reflection = true, milestone = true,
}
local FACT_SCOPE = { ["local"] = true, subtree = true, project = true }
local FACT_LIFECYCLE = { active = true, resolved = true, superseded = true, retracted = true }

local function normalize_fact(data: any, kind: string): string?
    data.metadata = type(data.metadata) == "table" and data.metadata or {}
    local metadata = data.metadata :: any
    local scope = string.lower(support.trim(data.scope or metadata.scope))
    if scope == "" then
        scope = (kind == "decision" or kind == "constraint" or kind == "assumption")
            and "subtree" or "local"
    end
    if not FACT_SCOPE[scope] then return "fact scope must be local, subtree, or project" end
    local lifecycle = string.lower(support.trim(data.lifecycle or metadata.lifecycle))
    if lifecycle == "" then lifecycle = "active" end
    if not FACT_LIFECYCLE[lifecycle] then
        return "fact lifecycle must be active, resolved, superseded, or retracted"
    end
    local confidence = data.confidence
    if confidence == nil then confidence = metadata.confidence end
    if confidence ~= nil then
        confidence = tonumber(confidence)
        if confidence == nil or confidence < 0 or confidence > 1 then
            return "fact confidence must be between 0 and 1"
        end
    end
    local subject = support.trim(data.subject or metadata.subject)
    data.scope = scope
    data.lifecycle = lifecycle
    data.confidence = confidence
    data.subject = subject ~= "" and subject or nil
    metadata.scope = scope
    metadata.lifecycle = lifecycle
    metadata.confidence = confidence
    metadata.subject = subject ~= "" and subject or nil
    return nil
end

local function attach_cursor(journal_id: string, data: any): (any?, error?, string?)
    local cursor_id = support.trim(data.cursor_id)
    if cursor_id == "" then return nil, nil, nil end
    local db, db_err = db_ops.open()
    if not db then return nil, db_err, nil end
    local cursor, cursor_err = cursors.get(db, journal_id, cursor_id)
    if cursor_err then db:release(); return nil, cursor_err, nil end
    if not cursor then db:release(); return nil, errors.new({ kind = errors.NOT_FOUND, message = "journal cursor not found: " .. cursor_id }), nil end
    if support.trim((cursor :: any).state) ~= "active" then
        db:release()
        return { success = false, refused = true, code = "cursor_closed",
            detail = "the journal cursor is closed; reopen it before recording work" }, nil, nil
    end
    local cursor_agent_id = support.trim((cursor :: any).agent_id)
    local current_task_id = support.trim((cursor :: any).current_task_id)
    local requested_task_id = support.trim(data.task_id)
    if requested_task_id ~= "" and current_task_id == "" then
        db:release()
        return { success = false, refused = true, code = "cursor_task_unbound",
            detail = "this generic cursor has no work-task adapter; omit task_id or move it with task_id" }, nil, nil
    end
    if requested_task_id ~= "" and requested_task_id ~= current_task_id then
        db:release()
        return { success = false, refused = true, code = "cursor_task_mismatch",
            detail = "move the cursor before recording work on task " .. requested_task_id,
            cursor_task_id = current_task_id }, nil, nil
    end
    local episode, episode_err = cursors.episode(db, journal_id,
        support.trim((cursor :: any).current_episode_id))
    db:release()
    if episode_err then return nil, episode_err, nil end
    if not episode or support.trim((episode :: any).state) ~= "active" then
        return { success = false, refused = true, code = "episode_rotation_required",
            detail = "the cursor has no active episode; open it to rotate before recording work" }, nil, nil
    end
    local deadline = tonumber((episode :: any).deadline_at) or 0
    if deadline <= 0 or os.time() > deadline then
        return { success = false, refused = true, code = "episode_rotation_required",
            detail = "the eight-hour episode boundary passed; checkpoint and rotate before recording more work",
            deadline_at = deadline }, nil, nil
    end
    data.task_id = current_task_id ~= "" and current_task_id or nil
    data.episode_id = (cursor :: any).current_episode_id
    data.metadata = type(data.metadata) == "table" and data.metadata or {}
    local graph_id = support.trim((cursor :: any).current_graph_id)
    local node_id = support.trim((cursor :: any).current_node_id)
    if graph_id ~= "" and node_id ~= "" then
        (data.metadata :: any).cursor_address = { graph_id = graph_id, node_id = node_id }
    end
    return nil, nil, cursor_agent_id
end

local function handler(input: any): any
    local journal_id, id_err = support.journal_id(input)
    if not journal_id then return { success = false, error = id_err } end
    local kind = support.trim(input and input.kind)
    local data = type(input and input.data) == "table" and input.data or {}
    local self_id = support.trim(input and (input :: any).agent_id)
    local cursor_refusal, cursor_err, cursor_agent_id = attach_cursor(journal_id, data)
    if cursor_err then return nil, cursor_err end
    if cursor_refusal then
        (cursor_refusal :: any).journal_id = journal_id
        return cursor_refusal
    end
    -- The trait is the one layer with both read and write context, so it owns
    -- the active default: facts without an explicit task_id land on the
    -- journal's active task. A supplied lease_id takes precedence - facts
    -- attach through the writing agent's lease (commands resolve and renew
    -- it), never the shared pointer. Commands stay pure append validators.
    if ACTIVE_DEFAULT_KIND[kind] and support.trim(data.task_id) == ""
        and support.trim(data.lease_id) == "" and support.trim(data.cursor_id) == "" then
        local state, state_err = queries.journal_state(journal_id)
        if state_err then return nil, state_err end
        local active_task_id = support.trim(state and (state :: any).active_task_id)
        if active_task_id ~= "" then data.task_id = active_task_id end
    end
    -- The span this fact belongs to is resolved before the append so the span
    -- id rides the immutable fact body; a span that cannot be opened is
    -- reported beside the write and never in place of it.
    local span_id, span_err = support.begin_span(journal_id,
        { cursor_id = data.cursor_id, agent_id = self_id, working_on = data.working_on }, data)
    data.working_on = nil
    local result, err = nil, nil
    if kind == "entry" then result, err = commands.append_entry(journal_id, data)
    elseif RECORD_KIND[kind] then
        data.event_type = kind
        local invalid = normalize_fact(data, kind)
        if invalid then return { success = false, error = invalid, journal_id = journal_id } end
        result, err = commands.append_entry(journal_id, data)
    elseif kind == "task" then result, err = commands.upsert_task(journal_id, data)
    elseif kind == "checkpoint" then result, err = commands.create_checkpoint(journal_id, data)
    elseif kind == "digest" then result, err = commands.update_digest(journal_id, data)
    elseif kind == "artifact" then result, err = commands.link_artifact(journal_id, data)
    elseif kind == "decompose" then result, err = commands.decompose(journal_id, data)
    elseif kind == "task.link" then result, err = commands.link_tasks(journal_id, data)
    elseif kind == "focus" then result, err = commands.focus_task(journal_id, data)
    elseif kind == "audit.coverage" then result, err = commands.record_audit_coverage(journal_id, data)
    elseif kind == "integration" then result, err = commands.record_integration(journal_id, data)
    elseif kind == "ref.link" then result, err = commands.link_reference(journal_id, data)
    elseif kind == "ref.unlink" then result, err = commands.unlink_reference(journal_id, data)
    else return { success = false, error = "unknown Journal record kind", journal_id = journal_id } end
    if err then return nil, err end
    local out = result or { success = true, accepted = true, journal_id = journal_id }
    if (out :: any).refused == true or (out :: any).success == false then return out end
    if span_err then (out :: any).span_error = tostring(span_err) end
    -- A pinned cursor keeps its own protocol and only takes the new watermark;
    -- every other identified writer advances its own cursor, created on first
    -- contact, so the journal can always answer where each agent last was.
    return support.maintain_position(journal_id, {
        cursor_id = data.cursor_id,
        agent_id = support.trim(cursor_agent_id) ~= "" and cursor_agent_id or self_id,
        span_id = span_id,
    }, out)
end

return { handler = handler }

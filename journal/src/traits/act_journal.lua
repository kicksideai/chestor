local commands = require("commands")
local queries = require("queries")
local support = require("support")

-- The protocol verb surface (§6) over the B1 command model. This trait is the
-- strict path by construction: every state-moving verb must carry the lease
-- from open_branch (or a registered system principal). Refusals pass
-- through as their exact enforcement codes; command identity is generated
-- server-side when absent and always returned.
local LEASE_REQUIRED = {
    start = true, complete = true, block = true, unblock = true, cancel = true,
    reopen = true, fold = true, close = true, request_verify = true,
    link = true, unlink = true, decompose = true, focus = true,
}

local VERB_COMMAND = commands.VERB_COMMAND

local VERB_LIST = "open_branch, decompose, link, unlink, start, block, unblock, "
    .. "request_verify, complete, cancel, reopen, fold, close, gate_pass, focus, "
    .. "cursor_open, cursor_move, cursor_checkpoint, cursor_close"

-- The cursor verbs are the explicit position protocol; they own their own
-- revision, episode, and watermark, so automatic maintenance never runs on
-- them and can never move a cursor the agent is coordinating with.
local CURSOR_VERB = {
    cursor_open = true, cursor_move = true, cursor_checkpoint = true, cursor_close = true,
}

local function annotate(result: any, verb: string, journal_id: string): any
    local out = type(result) == "table" and result or { success = false }
    out.verb = verb
    out.journal_id = journal_id
    return out
end

-- Every other verb maintains the acting agent's durable position on the same
-- rule the record and read surfaces use: the higher of what its append receipt
-- reported and what its answer carried. A refusal earns no position, and a
-- verb that neither appends nor returns event rows moves nothing.
local function maintain(journal_id: string, verb: string, identity: any, out: any): any
    if CURSOR_VERB[verb] or type(out) ~= "table" then return out end
    if (out :: any).refused == true or (out :: any).success == false then return out end
    return support.maintain_position(journal_id, identity, out)
end

-- OpenBranch returns the lease plus the D1 lens in one round trip; a task
-- already leased by another agent refuses with code `leased` but still
-- carries the read lens (X9: visible, not a dead end).
local function open_branch(journal_id: string, data: any): (any?, error?)
    local opened, err = commands.open_branch(journal_id, data)
    if err then return nil, err end
    local out = opened :: any
    local lease_id: any = nil
    if type(out.lease) == "table" then lease_id = (out.lease :: any).lease_id end
    local lens, lens_err = queries.branch(journal_id, support.trim(data.task_id or data.id), { lease_id = lease_id })
    if lens then out.lens = lens
    elseif out.refused ~= true and out.success ~= false then
        return nil, lens_err
    end
    return out
end

local function handler(input: any): (any?, error?)
    local journal_id, id_err = support.journal_id(input)
    if not journal_id then return { success = false, error = id_err } end
    local verb = support.trim(input and input.verb)
    local data = type(input and input.data) == "table" and input.data or {}
    -- A protocol verb is work too: it opens or extends the acting identity's
    -- span, and the transition it appends carries that span id. The cursor
    -- verbs own the explicit position protocol and stay outside it.
    local identity: any = { agent_id = support.trim(input and (input :: any).agent_id) }
    if not CURSOR_VERB[verb] then
        local span_id, span_err = support.begin_span(journal_id,
            { agent_id = identity.agent_id, working_on = data.working_on }, data)
        identity.span_id = span_id
        identity.span_error = span_err and tostring(span_err) or nil
    end
    data.working_on = nil
    if verb == "open_branch" then
        local opened, open_err = open_branch(journal_id, data)
        if not opened then return nil, open_err end
        return maintain(journal_id, verb, identity, annotate(opened, verb, journal_id))
    end
    local op = VERB_COMMAND[verb]
    if not op then
        return { success = false, verb = verb, journal_id = journal_id,
            error = "unknown journal verb: " .. verb .. "; valid verbs: " .. VERB_LIST }
    end
    if verb == "link" or verb == "unlink" then
        if support.trim(data.from_task_id) == "" then data.from_task_id = data.from end
        if support.trim(data.to_task_id) == "" then data.to_task_id = data.to end
    end
    if LEASE_REQUIRED[verb] and support.trim(data.lease_id) == "" and support.trim(data.principal) == "" then
        return { success = false, refused = true, code = "lease_required", verb = verb, journal_id = journal_id,
            detail = verb .. " requires the lease_id and fencing_token issued by open_branch" }
    end
    local fn = (commands :: any)[op]
    local result, err = fn(journal_id, data)
    if err then return nil, err end
    local out = annotate(result, verb, journal_id)
    if identity.span_error then (out :: any).span_error = identity.span_error end
    return maintain(journal_id, verb, identity, out)
end

return { handler = handler }

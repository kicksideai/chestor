local commands = require("commands")
local thread_log = require("thread_log")

-- The HTTP adapter over the guarded transition commands. Task state moves only
-- through those commands - this surface adds addressing (path task, or a
-- bounded task list for one subtree fold) and answers what each task did. Every
-- guard, lease conflict, and gate refusal is the command's own answer, carried
-- through unchanged.
local M = {}

-- One request moves a window of tasks, never an unbounded tree.
local MAX_TASKS = 50

-- Routing keys are consumed here; everything else on the body is the command's
-- payload and travels to it untouched.
local ROUTING_KEY = {
    tasks = true, action = true, working_on = true, task_id = true, id = true,
}

local function trim(value: any): string
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

local function verb_list(): string
    local names: { string } = {}
    for verb in pairs(commands.TRANSITION_VERB) do names[#names + 1] = verb end
    table.sort(names)
    return table.concat(names, ", ")
end

local function targets(task_id: any, body: any): ({ string }?, any?)
    local listed = (body :: any).tasks
    if listed == nil then
        local single = trim(task_id)
        if single == "" then return nil, errors.new({ message = "task_id is required", kind = errors.INVALID }) end
        return { single }, nil
    end
    if type(listed) ~= "table" then
        return nil, errors.new({ message = "invalid batch: tasks must be an array of task ids", kind = errors.INVALID })
    end
    local out: { string } = {}
    for index, value in ipairs(listed :: { any }) do
        if type(value) ~= "string" or trim(value) == "" then
            return nil, errors.new({ message = "invalid batch: tasks[" .. tostring(index) .. "] must be a task id", kind = errors.INVALID })
        end
        out[#out + 1] = trim(value)
    end
    if #out == 0 then return nil, errors.new({ message = "invalid batch: tasks must name at least one task", kind = errors.INVALID }) end
    if #out > MAX_TASKS then
        return nil, errors.new({ message = "invalid batch: at most " .. tostring(MAX_TASKS) .. " tasks per request", kind = errors.INVALID })
    end
    return out, nil
end

local function payload(body: any, task_id: string, span_id: any): any
    local out: any = {}
    for key, value in pairs(body :: any) do
        if not ROUTING_KEY[key] then out[key] = value end
    end
    out.task_id = task_id
    if trim(span_id) ~= "" then out.span_id = trim(span_id) end
    return out
end

-- The thread head an applied transition reached; the caller's position moves to
-- the furthest one the request appended.
local function receipt_seq(result: any): number
    local receipt = type((result :: any).receipt) == "table" and (result :: any).receipt or {}
    return tonumber((receipt :: any).max_seq) or 0
end

-- Applies one transition verb to the addressed task, or to each task of a
-- bounded batch. A batch never stops at the first refusal: every task named
-- gets its own answer, and the request reports success only when all of them
-- moved.
function M.apply(journal_id: string, task_id: any, body: any): (any?, any?)
    local source = type(body) == "table" and body or {}
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local action = trim((source :: any).action)
    if action == "" then return nil, errors.new({ message = "action is required", kind = errors.INVALID }) end
    if not commands.TRANSITION_VERB[action] then
        return nil, errors.new({ message = "unknown transition action: " .. action .. "; valid actions: " .. verb_list(), kind = errors.INVALID })
    end
    local tasks, tasks_err = targets(task_id, source)
    if not tasks then return nil, tasks_err end
    -- Both keys address a single attempt: one revision expectation and one
    -- idempotency key cannot describe several tasks at once.
    if #(tasks :: { string }) > 1 then
        if (source :: any).expected_revision ~= nil then
            return nil, errors.new({ message = "invalid batch: expected_revision addresses a single task", kind = errors.INVALID })
        end
        if trim((source :: any).command_id) ~= "" then
            return nil, errors.new({ message = "invalid batch: command_id addresses a single task", kind = errors.INVALID })
        end
    end

    -- A verb is work too: it opens or extends the caller's span exactly as a
    -- fact written over HTTP does, and the transitions carry that span id.
    local attached, attach_err = commands.attach_span(journal_id, {
        cursor_id = (source :: any).cursor_id,
        agent_id = (source :: any).agent_id,
        working_on = (source :: any).working_on,
    })
    local span_id: any = attached and (attached :: any).span_id or nil

    local results: { any } = {}
    local applied = 0
    local refused = 0
    local failed = 0
    local seq = 0
    local run = (commands :: any)[commands.VERB_COMMAND[action]]
    for _, target in ipairs(tasks :: { string }) do
        local result, err = run(journal_id, payload(source, target, span_id))
        local entry: any = nil
        if err then
            entry = { task_id = target, success = false, error = tostring(err) }
            failed = failed + 1
        else
            entry = type(result) == "table" and result or { success = false, error = "command returned no result" }
            entry.task_id = target
            if entry.success == true and entry.refused ~= true then
                applied = applied + 1
                seq = math.max(seq, receipt_seq(entry))
            elseif entry.refused == true then
                refused = refused + 1
            else
                failed = failed + 1
            end
        end
        results[#results + 1] = entry
    end

    local out: any = {
        success = applied == #(tasks :: { string }),
        journal_id = journal_id,
        action = action,
        results = results,
        applied = applied,
        refused = refused,
        failed = failed,
    }
    if attach_err then out.span_error = tostring(attach_err) end
    if span_id then out.span_id = span_id end
    if attached and seq > 0 then
        local advanced, advance_err = commands.advance_cursor(journal_id, {
            cursor_id = (attached :: any).cursor_id,
            agent_id = (attached :: any).agent_id,
            seq = seq,
            span_id = span_id,
        })
        if advance_err then out.cursor_error = tostring(advance_err)
        elseif advanced then
            out.cursor_id = (advanced :: any).cursor_id
            out.cursor_seq = (advanced :: any).cursor_seq
        end
    end
    return out, nil
end

return M

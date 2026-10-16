-- The HTTP surface the Journal renderer drives. Two claims: task state moves
-- over its own endpoint through the very commands the protocol verbs run, with
-- every guard answered rather than swallowed; and the journal snapshot is a
-- page the caller can turn, because the endpoint carries the whole option
-- vocabulary the read view accepts. The harness serves no authenticated HTTP
-- client, so the adapter is driven at the seam the handler calls and the
-- request contract itself is asserted on the endpoint declarations.
local test = require("test")
local sql = require("sql")
local json = require("json")
local funcs = require("funcs")
local crypto = require("crypto")
local security = require("security")
local contract = require("contract")
local time = require("time")
local registry = require("registry")
local types = require("types")
local ops = require("ops")
local commands = require("commands")
local queries = require("queries")

local THREADS = "kickside.core:threads"
local STATE_PROJECTION = "chestor.journal:state"
local CMD_BRIDGE = "app:journal_cmd"
local READ_BRIDGE = "app:journal_read"
local API_BRIDGE = "app:journal_api"
local ACT_TOOL = "chestor.journal.traits:act_journal"
local TRANSITION_ENDPOINT = "chestor.journal.api:transition_task.endpoint"
local JOURNAL_ENDPOINT = "chestor.journal.api:get_journal.endpoint"

local function uuid()
    local value, err = crypto.random.uuid()
    test.is_nil(err)
    return tostring(value)
end

local function actor(user_id)
    return security.new_actor(user_id, { security_groups = { "journal_test" } })
end

local function scope()
    return security.named_scope("wippy.security:process")
end

local function executor(user_id)
    return funcs.new():with_actor(actor(user_id)):with_scope(scope())
end

local function threads(user_id)
    local definition, get_err = contract.get(THREADS)
    test.is_nil(get_err)
    local opened, open_err = definition:with_actor(actor(user_id)):with_scope(scope()):open()
    test.is_nil(open_err)
    return opened
end

local function create_journal(user_id)
    local created, err = threads(user_id):create({
        impl_id = types.JOURNAL_IMPL,
        thread_class = types.THREAD_CLASS,
        title = "api surface " .. uuid(),
    })
    test.is_nil(err)
    return tostring(created.component_id or created.thread_id)
end

local function invoke(runner, ref, input)
    local value, err = runner:call(ref, input)
    test.is_nil(err, tostring(ref) .. ": " .. tostring(err))
    test.not_nil(value)
    return value
end

local function cmd(user_id, op, journal_id, args)
    return invoke(executor(user_id), CMD_BRIDGE,
        { op = op, journal_id = journal_id, args = args or {} })
end

local function read_view(user_id, journal_id, view, args)
    local out = invoke(executor(user_id), READ_BRIDGE,
        { view = view, journal_id = journal_id, args = args or {} })
    test.is_true(out.success == true, tostring(out.error))
    return out.value
end

-- The seam the endpoint handler calls once it has parsed path and body.
local function api(user_id, journal_id, task_id, body)
    return invoke(executor(user_id), API_BRIDGE,
        { op = "transition", journal_id = journal_id, task_id = task_id, body = body or {} })
end

local function sync(user_id, journal_id)
    local detail = "projection cursor not registered"
    for _ = 1, 500 do
        local listed, err = threads(user_id):list_projections({ thread_id = journal_id })
        test.is_nil(err)
        local required_seq = tonumber(listed and listed.event_count) or 0
        for _, cursor in ipairs((listed and listed.cursors) or {}) do
            if tostring(cursor.kind) == STATE_PROJECTION then
                local status = tostring(cursor.status or "")
                detail = status .. ": " .. tostring(cursor.last_error or "")
                test.is_false(status == "invalid" or status == "paused", "state projection stopped: " .. detail)
                if (tonumber(cursor.last_seq) or 0) >= required_seq then return end
            end
        end
        time.sleep("20ms")
    end
    test.is_true(false, "state projection did not reach the thread head: " .. detail)
end

local function query(statement, params)
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    local rows, query_err = ops.query(db, statement, params or {})
    db:release()
    test.is_nil(query_err)
    return rows or {}
end

local function execute(statement, params)
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    local exec_err = ops.exec(db, statement, params or {})
    db:release()
    test.is_nil(exec_err)
end

local function accepted(result, label)
    local at = label and (" [" .. label .. "]") or ""
    test.not_nil(result, "expected a result" .. at)
    test.is_true(result.refused ~= true and result.success ~= false,
        "expected success" .. at .. ", got " .. json.encode(result))
    return result
end

local function make_task(user_id, journal_id, title)
    local id = "task-" .. uuid()
    accepted(cmd(user_id, "upsert_task", journal_id,
        { id = id, title = title, command_id = uuid() }), title)
    return id
end

local function lease_for(user_id, journal_id, task_id, agent_id)
    local branch = accepted(cmd(user_id, "open_branch", journal_id,
        { task_id = task_id, agent_id = agent_id, command_id = uuid() }), "open_branch " .. task_id)
    test.not_nil(branch.lease, "open_branch must issue a lease")
    return branch.lease
end

local function entry_data(id)
    local entry = registry.get(id)
    test.not_nil(entry, id .. " must be registered")
    return ((entry :: any).data or entry) :: any
end

local function entry_meta(id)
    local data = entry_data(id)
    local meta = (data :: any).meta
    if type(meta) ~= "table" then
        local entry = registry.get(id)
        meta = (entry :: any).meta
    end
    test.eq(type(meta), "table", id .. " must carry meta")
    return meta :: any
end

local function sorted(values)
    local out = {}
    for _, value in ipairs(values or {}) do out[#out + 1] = tostring(value) end
    table.sort(out)
    return out
end

local function sorted_keys(map)
    local out = {}
    for key in pairs(map or {}) do out[#out + 1] = tostring(key) end
    table.sort(out)
    return out
end

local function result_for(answer, task_id)
    for _, item in ipairs(answer.results or {}) do
        if tostring(item.task_id) == tostring(task_id) then return item end
    end
    test.is_true(false, "no result for " .. tostring(task_id) .. ": " .. json.encode(answer))
    return {}
end

local function define_tests()
    test.describe("Journal transition endpoint", function()
        test.it("declares the endpoint, its router attachment, and exactly the transition verbs the act tool accepts", function()
            local data = entry_data(TRANSITION_ENDPOINT)
            test.eq(tostring(data.path), "/workspace/journals/{id}/tasks/{task_id}/transition")
            test.eq(string.upper(tostring(data.method)), "POST")

            -- An endpoint the router never receives is unreachable however
            -- correct its handler is.
            local requirement = entry_data("chestor.journal:api_router")
            local attached = false
            for _, target in ipairs((requirement.targets or {}) :: { any }) do
                if tostring((target :: any).entry) == TRANSITION_ENDPOINT then
                    attached = true
                    test.eq(tostring((target :: any).path), ".meta.router")
                end
            end
            test.is_true(attached, "the transition endpoint must attach to the journal api router")

            -- The declared action set, the commands the adapter dispatches to,
            -- and the verbs the tool surface accepts are one set; a verb only
            -- one of them knows is a surface nobody can drive.
            local declared = sorted(entry_meta(TRANSITION_ENDPOINT).actions)
            test.eq(json.encode(declared), json.encode(sorted_keys(commands.TRANSITION_VERB)),
                "the endpoint must declare exactly the transition verbs it accepts")
            local tool_verbs = {}
            for _, verb in ipairs((((entry_meta(ACT_TOOL).input_schema or {}).properties or {}).verb or {}).enum or {}) do
                tool_verbs[tostring(verb)] = true
            end
            for _, action in ipairs(declared) do
                test.is_true(tool_verbs[action] == true,
                    "the act tool must accept the " .. action .. " the endpoint routes")
                test.eq(type((commands :: any)[commands.VERB_COMMAND[action]]), "function",
                    action .. " must resolve to its command implementation")
            end
        end)

        test.it("moves task state through the same guarded command the trait verb runs", function()
            local user = "endpoint-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, "Endpoint work")
            sync(user, journal_id)
            local lease = lease_for(user, journal_id, task_id, "endpoint-agent")

            local moved = api(user, journal_id, task_id, {
                action = "start", lease_id = lease.lease_id, fencing_token = lease.fencing_token,
            })
            test.is_true(moved.success == true, json.encode(moved))
            test.eq(tonumber(moved.applied), 1)
            test.eq(#moved.results, 1)
            local entry = result_for(moved, task_id)
            test.eq(tostring(entry.verb), "start")
            test.eq(tostring(entry.from_status), "open")
            test.eq(tostring(entry.to_status), "in_progress")
            test.is_true(tostring(entry.event_id or "") ~= "", "a transition answers its command id")

            sync(user, journal_id)
            local task = query(
                "SELECT status FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?",
                { journal_id, task_id })
            test.eq(tostring((task[1] or {}).status), "in_progress")

            -- A verb over HTTP is work: it carries the caller's span exactly as
            -- a fact written over HTTP does.
            test.is_true(tostring(moved.span_id or "") ~= "", "the transition must open the caller's span")
            local stamped = query([[SELECT span_id FROM chestor_journal_events
                 WHERE journal_id = ? AND id = ? AND event_type = ?]],
                { journal_id, tostring(entry.event_id), "task.transitioned" })
            test.eq(tostring((stamped[1] or {}).span_id), tostring(moved.span_id))
        end)

        test.it("carries a lease conflict back as the command's own refusal", function()
            local user = "conflict-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, "Contended work")
            sync(user, journal_id)
            local lease = lease_for(user, journal_id, task_id, "holder")

            -- A caller racing the lease holder presents a token the grant has
            -- moved past; the endpoint answers the guard, it does not decide.
            local raced = api(user, journal_id, task_id, {
                action = "start", lease_id = lease.lease_id,
                fencing_token = (tonumber(lease.fencing_token) or 1) + 1,
            })
            test.is_true(raced.success == false, json.encode(raced))
            test.eq(tonumber(raced.refused), 1)
            local entry = result_for(raced, task_id)
            test.is_true(entry.refused == true, json.encode(entry))
            test.eq(tostring(entry.code), "fencing_stale")

            -- A refused transition moved nothing.
            sync(user, journal_id)
            local task = query(
                "SELECT status FROM chestor_journal_tasks WHERE journal_id = ? AND id = ?",
                { journal_id, task_id })
            test.eq(tostring((task[1] or {}).status), "open")
        end)

        test.it("answers one result per task when a batch is partly refused", function()
            local user = "batch-" .. uuid()
            local journal_id = create_journal(user)
            local movable = make_task(user, journal_id, "Dormant leaf")
            local running = make_task(user, journal_id, "Already running")
            sync(user, journal_id)
            local running_lease = lease_for(user, journal_id, running, "runner-agent")
            accepted(cmd(user, "start_task", journal_id, {
                task_id = running, lease_id = running_lease.lease_id,
                fencing_token = running_lease.fencing_token, command_id = uuid(),
            }), "start " .. running)
            sync(user, journal_id)

            -- One subtree, one verb: the task that can move moves, and the one
            -- the guard refuses says so in its own row.
            local answer = api(user, journal_id, movable, {
                action = "start", tasks = { movable, running },
            })
            test.is_true(answer.success == false,
                "a batch carrying a refusal cannot report success: " .. json.encode(answer))
            test.eq(#answer.results, 2)
            test.eq(tonumber(answer.applied), 1)
            test.eq(tonumber(answer.refused), 1)
            test.eq(tonumber(answer.failed), 0)
            local moved = result_for(answer, movable)
            test.is_true(moved.success == true, json.encode(moved))
            test.eq(tostring(moved.to_status), "in_progress")
            local blocked = result_for(answer, running)
            test.is_true(blocked.refused == true, json.encode(blocked))
            test.eq(tostring(blocked.code), "invalid_transition")

            -- The applied half of a partly refused batch is committed, not
            -- rolled back behind the caller's back.
            sync(user, journal_id)
            local rows = query(
                "SELECT id, status FROM chestor_journal_tasks WHERE journal_id = ? ORDER BY id ASC",
                { journal_id })
            local status = {}
            for _, row in ipairs(rows) do status[tostring(row.id)] = tostring(row.status) end
            test.eq(status[movable], "in_progress")
            test.eq(status[running], "in_progress")
        end)

        test.it("refuses an action outside the transition verb set, an unaddressed task, and a batch beyond its bound", function()
            local user = "bounds-" .. uuid()
            local journal_id = create_journal(user)
            local task_id = make_task(user, journal_id, "Bounded work")
            sync(user, journal_id)

            -- focus is a protocol verb, but it is not a task transition; the
            -- endpoint names the set it does accept.
            local unknown = api(user, journal_id, task_id, { action = "focus" })
            test.is_true(unknown.success == false, json.encode(unknown))
            test.is_true(tostring(unknown.error):find("unknown transition action", 1, true) ~= nil,
                tostring(unknown.error))
            test.is_true(tostring(unknown.error):find("fold", 1, true) ~= nil,
                "the refusal must name the valid actions: " .. tostring(unknown.error))

            local actionless = api(user, journal_id, task_id, {})
            test.is_true(tostring(actionless.error):find("action is required", 1, true) ~= nil,
                tostring(actionless.error))

            local unaddressed = api(user, journal_id, "", { action = "start" })
            test.is_true(tostring(unaddressed.error):find("task_id is required", 1, true) ~= nil,
                tostring(unaddressed.error))

            local oversized = {}
            for index = 1, 51 do oversized[index] = "task-" .. tostring(index) end
            local bounded = api(user, journal_id, task_id, { action = "start", tasks = oversized })
            test.is_true(tostring(bounded.error):find("at most 50 tasks", 1, true) ~= nil,
                tostring(bounded.error))

            -- One revision expectation and one idempotency key each address a
            -- single attempt and cannot describe a batch.
            local shared = api(user, journal_id, task_id, {
                action = "start", tasks = { task_id, "task-other" }, expected_revision = 1,
            })
            test.is_true(tostring(shared.error):find("expected_revision addresses a single task", 1, true) ~= nil,
                tostring(shared.error))
            local keyed = api(user, journal_id, task_id, {
                action = "start", tasks = { task_id, "task-other" }, command_id = uuid(),
            })
            test.is_true(tostring(keyed.error):find("command_id addresses a single task", 1, true) ~= nil,
                tostring(keyed.error))
        end)
    end)

    test.describe("Journal snapshot continuations", function()
        test.it("declares on its endpoint every option the snapshot view accepts", function()
            local declared = entry_meta(JOURNAL_ENDPOINT).query
            test.eq(type(declared), "table", "the journal endpoint must declare its query parameters")
            -- The handler forwards this vocabulary whole, so a parameter the
            -- view honours and the endpoint omits is a page nobody can reach.
            local declared_json, declared_err = json.encode(sorted(declared))
            local params_json, params_err = json.encode(sorted(queries.STATE_PARAMS))
            test.is_nil(declared_err, tostring(declared_err))
            test.is_nil(params_err, tostring(params_err))
            test.eq(declared_json, params_json)
            for _, name in ipairs(queries.STATE_PARAMS) do
                test.is_true(tostring(name):find("limit", 1, true) ~= nil
                    or tostring(name):find("after_", 1, true) ~= nil
                    or tostring(name) == "before_seq",
                    "unexpected snapshot parameter " .. tostring(name))
            end
        end)

        test.it("reaches page two of the snapshot through the continuation the page returns", function()
            local user = "paging-" .. uuid()
            local journal_id = create_journal(user)
            local created = {}
            for index = 1, 3 do
                created[index] = make_task(user, journal_id, "Paged work " .. tostring(index))
            end
            sync(user, journal_id)

            -- Query parameters reach the view as the strings a URL carries.
            local seen = {}
            local opts = { task_limit = "1" }
            local guard = 0
            while true do
                guard = guard + 1
                test.is_true(guard <= 5, "the task page did not terminate")
                local snapshot = read_view(user, journal_id, "state", opts)
                test.eq(#snapshot.tasks, 1)
                local task = snapshot.tasks[1]
                test.is_nil(seen[tostring(task.id)],
                    "the keyset walk served " .. tostring(task.id) .. " twice")
                seen[tostring(task.id)] = true
                if not snapshot.task_page.has_more then
                    test.is_nil(snapshot.task_page.next_cursor,
                        "a finished page hands back no continuation")
                    break
                end
                local next_cursor = snapshot.task_page.next_cursor
                opts = {
                    task_limit = "1",
                    task_after_sort_order = tostring(next_cursor.after_sort_order),
                    task_after_updated_at = tostring(next_cursor.after_updated_at),
                    task_after_id = tostring(next_cursor.after_id),
                }
            end
            for _, task_id in ipairs(created) do
                test.not_nil(seen[task_id], "the keyset walk skipped " .. task_id)
            end

            -- The event tail is bounded and continued by the same rule.
            local head = read_view(user, journal_id, "state", { limit = "1" })
            test.eq(#head.events, 1)
            test.is_true(head.event_page.has_more, "a one-event window over this journal has more")
            local older = read_view(user, journal_id, "state",
                { limit = "1", before_seq = tostring(head.event_page.next_before_seq) })
            test.eq(#older.events, 1)
            test.is_true(tonumber(older.events[1].seq) < tonumber(head.events[1].seq),
                "before_seq must move the window back")
        end)

        test.it("separates live mutation authority from resumable in-progress work", function()
            local user = "authority-" .. uuid()
            local journal_id = create_journal(user)
            local live_task = make_task(user, journal_id, "Live authority")
            local resume_task = make_task(user, journal_id, "Resume in place")
            sync(user, journal_id)

            local live = lease_for(user, journal_id, live_task, "live-agent")
            accepted(cmd(user, "start_task", journal_id, {
                task_id = live_task, lease_id = live.lease_id,
                fencing_token = live.fencing_token, command_id = uuid(),
            }))
            local expired = lease_for(user, journal_id, resume_task, "paused-agent")
            accepted(cmd(user, "start_task", journal_id, {
                task_id = resume_task, lease_id = expired.lease_id,
                fencing_token = expired.fencing_token, command_id = uuid(),
            }))
            sync(user, journal_id)
            execute("UPDATE chestor_journal_leases SET expires_at = ? WHERE journal_id = ? AND lease_id = ?",
                { os.time() - 1, journal_id, expired.lease_id })

            local snapshot = read_view(user, journal_id, "state", { work_limit = "10" })
            test.eq(tonumber(snapshot.work_control.counts.active), 1)
            test.eq(tonumber(snapshot.work_control.counts.write), 1)
            test.eq(tonumber(snapshot.work_control.counts.planning), 0)
            test.eq(tonumber(snapshot.work_control.counts.resumable), 1)
            test.eq(tostring(snapshot.work_control.leases[1].task_id), live_task)
            test.eq(tostring(snapshot.work_control.leases[1].agent_id), "live-agent")
            test.eq(tostring(snapshot.work_control.resumable[1].task_id), resume_task)
            test.eq(tostring(snapshot.work_control.resumable[1].next.verb), "open_branch")

            local focused = read_view(user, journal_id, "authority", { limit = "10" })
            test.eq(tostring(focused.leases[1].task_id), live_task)
            test.eq(tostring(focused.resumable[1].task_id), resume_task)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

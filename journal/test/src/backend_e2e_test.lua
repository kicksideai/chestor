local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")
local contract = require("contract")
local time = require("time")
local sql = require("sql")
local json = require("json")
local ledger = require("ledger")

local THREADS = "kickside.core:threads"
local JOURNAL_KIND = "chestor.journal:journal_kind"
local THREAD_CLASS = "workspace.journal"
local STATE_PROJECTION = "chestor.journal:state"
local GRAPH_PROJECTION = "chestor.journal:graph_state"

local ASSEMBLER = "chestor.journal.work:assembler"

local TOOL = {
    read = "chestor.journal.traits:read_journal",
    record = "chestor.journal.traits:record_journal",
    query_graph = "chestor.journal.traits:query_journal_graph",
    apply_graph = "chestor.journal.traits:apply_journal_graph_ops",
    configure_graph = "chestor.journal.traits:configure_journal_graph",
    context = "chestor.journal.traits:journal_context",
    query = "chestor.journal.traits:journal_query",
    fact = "chestor.journal.traits:journal_fact",
    graph = "chestor.journal.traits:journal_graph",
    act = "chestor.journal.traits:act_journal",
}

local function uuid(): string
    local value, err = crypto.random.uuid()
    test.is_nil(err)
    return tostring(value)
end

local function actor(user_id: string, groups: { string }?): any
    return security.new_actor(user_id, { security_groups = groups or { "journal_test" } })
end

local function scope(): any
    return security.named_scope("wippy.security:process")
end

local function executor(user_id: string, groups: { string }?): any
    return funcs.new():with_actor(actor(user_id, groups)):with_scope(scope())
end

local function threads(user_id: string, groups: { string }?): any
    local definition, get_err = contract.get(THREADS)
    test.is_nil(get_err)
    test.not_nil(definition)
    local opened, open_err = definition:with_actor(actor(user_id, groups)):with_scope(scope()):open()
    test.is_nil(open_err)
    test.not_nil(opened)
    return opened
end

local function create_journal(user_id: string): string
    local created, err = threads(user_id):create({
        impl_id = JOURNAL_KIND,
        thread_class = THREAD_CLASS,
        title = "Journal integration " .. uuid(),
    })
    test.is_nil(err)
    test.not_nil(created)
    return tostring((created :: any).component_id or (created :: any).thread_id)
end

local function call(user_id: string, ref: string, input: any, groups: { string }?): any
    local value, err = executor(user_id, groups):call(ref, input)
    test.is_nil(err)
    test.not_nil(value)
    return value
end

local function catch_up(user_id: string, journal_id: string, kind: string): any
    local progress, err = threads(user_id):catch_up_projection({
        thread_id = journal_id,
        kind = kind,
        max_ticks = 500,
        deadline = time.now():add(10 * time.SECOND):utc():format(time.RFC3339),
    })
    test.is_nil(err, tostring(err))
    test.not_nil(progress)
    test.is_true(progress.done, "projection did not reach the thread head")
    test.eq(progress.status, "active")
    test.is_true(progress.last_seq >= progress.event_count)
    return progress
end

local function find_graph(graphs: any, graph_id: string): any
    for _, graph in ipairs(type(graphs) == "table" and graphs or {}) do
        if tostring((graph :: any).id) == graph_id then return graph end
    end
    return nil
end

local function define_tests()
    test.describe("Journal backend E2E", function()
        test.it("continues materializing journals with stored process worker references", function()
            local owner = "journal-process-ref-" .. uuid()
            local journal_id = create_journal(owner)
            catch_up(owner, journal_id, STATE_PROJECTION)
            catch_up(owner, journal_id, GRAPH_PROJECTION)
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            test.not_nil(db)
            local rows, read_err = db:query("SELECT id,kind,body FROM kickside_projection WHERE thread_id=$1 AND kind IN ($2,$3)", { journal_id, STATE_PROJECTION, GRAPH_PROJECTION })
            test.is_nil(read_err)
            test.eq(#rows, 2)
            for _, row in ipairs(rows) do
                local body, decode_err = json.decode(row.body)
                test.is_nil(decode_err)
                body.meta.worker_ref = row.kind == STATE_PROJECTION
                    and "proc://chestor.journal.persist:journal_projection"
                    or "proc://chestor.journal.graph:projection"
                local encoded, encode_err = json.encode(body)
                test.is_nil(encode_err)
                local _, write_err = db:execute("UPDATE kickside_projection SET body=$1 WHERE id=$2", { encoded, row.id })
                test.is_nil(write_err)
            end
            local _, release_err = db:release()
            test.is_nil(release_err)
            local recorded = call(owner, TOOL.record, {
                journal_id = journal_id, kind = "entry",
                data = { event_type = "decision", title = "Stored process fold", body = "Retain the configured worker." },
            })
            test.is_true(recorded.success, tostring(recorded.error))
            catch_up(owner, journal_id, STATE_PROJECTION)
            catch_up(owner, journal_id, GRAPH_PROJECTION)
            local tail = call(owner, TOOL.read, { journal_id = journal_id, view = "tail" })
            test.is_true(tail.success, tostring(tail.error))
            test.eq(#tail.events, 1)
            test.eq(tail.events[1].title, "Stored process fold")
            test.not_nil(find_graph(tail.graphs, "map"))
        end)

        test.it("runs journal health and embedding workers from the Jobs actor", function()
            local owner = "journal-background-" .. uuid()
            local journal_id = create_journal(owner)
            catch_up(owner, journal_id, STATE_PROJECTION)
            for _, ref in ipairs({ "chestor.journal.health:writer", "chestor.journal.embedding:worker" }) do
                local result, err = executor("kickside.core.jobs:worker_runner", {}):call(ref, {
                    payload = { journal_id = journal_id },
                })
                test.is_nil(err, tostring(err))
                test.not_nil(result)
            end
        end)

        test.it("uses the component thread, both projections, and the five public tools", function()
            local user_id = "journal-owner-" .. uuid()
            local journal_id = create_journal(user_id)

            local recorded = call(user_id, TOOL.record, {
                journal_id = journal_id,
                kind = "entry",
                data = {
                    event_type = "decision",
                    title = "Keep graph reads bounded",
                    body = "The canvas queries one branch and never mounts the complete graph.",
                    tags = { "decision", "architecture" },
                },
            })
            test.is_true(recorded.success, tostring(recorded.error))
            test.is_true(recorded.accepted)

            local task = call(user_id, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = {
                    id = "verify-live-deltas",
                    title = "Verify live deltas",
                    description = "Exercise the task-focused MCP read contract.",
                    status = "in_progress",
                    priority = "high",
                },
            })
            test.is_true(task.success, tostring(task.error))

            catch_up(user_id, journal_id, STATE_PROJECTION)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local tail = call(user_id, TOOL.read, { journal_id = journal_id, view = "tail" })
            test.is_true(tail.success, tostring(tail.error))
            test.eq(#tail.events, 2)
            test.eq(tail.events[2].event_type, "decision")
            test.not_nil(find_graph(tail.graphs, "map"))

            local brief = call(user_id, TOOL.read, { journal_id = journal_id, view = "brief", limit = 2 })
            test.is_true(brief.success, tostring(brief.error))
            test.eq(brief.view, "brief")
            test.eq(brief.brief.cursor.last_seq, 2)
            test.eq(#brief.brief.recent_events, 2)
            test.eq(#brief.brief.active_tasks, 1)
            test.not_nil(brief.brief.projection.graphs.map)
            test.is_nil(brief.brief.artifacts)

            local tasks = call(user_id, TOOL.read, {
                journal_id = journal_id,
                view = "tasks",
                task_status = "active",
                query = "live deltas",
            })
            test.is_true(tasks.success, tostring(tasks.error))
            test.eq(#tasks.tasks, 1)
            test.eq(tasks.tasks[1].id, "verify-live-deltas")

            local completed = call(user_id, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = {
                    id = "verify-live-deltas",
                    title = "Verify live deltas",
                    status = "done",
                },
            })
            test.is_true(completed.success, tostring(completed.error))
            catch_up(user_id, journal_id, STATE_PROJECTION)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local completed_tasks = call(user_id, TOOL.read, {
                journal_id = journal_id,
                view = "tasks",
                task_status = "all",
                query = "live deltas",
            })
            test.eq(#completed_tasks.tasks, 1)
            test.eq(completed_tasks.tasks[1].status, "done")
            local updated_tail = call(user_id, TOOL.read, { journal_id = journal_id, view = "tail" })
            test.eq(#updated_tail.events, 3)
            test.eq(updated_tail.events[1].event_type, "task.closed")
            test.eq(updated_tail.events[2].event_type, "task.updated")
            test.is_false(updated_tail.events[1].id == updated_tail.events[2].id)
            test.is_false(updated_tail.events[1].id == "verify-live-deltas")

            -- The tail is a tail: a caller asking for the last two records gets
            -- two, newest first, not the whole log.
            local bounded_tail = call(user_id, TOOL.read, { journal_id = journal_id, view = "tail", limit = 2 })
            test.is_true(bounded_tail.success, tostring(bounded_tail.error))
            test.eq(#bounded_tail.events, 2)
            test.eq(bounded_tail.events[1].seq, updated_tail.events[1].seq)
            test.is_true(bounded_tail.events[1].seq > bounded_tail.events[2].seq,
                "tail did not order newest first")
            test.is_true(bounded_tail.event_page.has_more, "the tail names the older events past its page")
            test.eq(bounded_tail.event_page.next_before_seq, bounded_tail.events[2].seq)
            test.not_nil(bounded_tail.task_page, "the tail carries the task page continuation")
            test.not_nil(bounded_tail.stats, "the tail carries the journal stats")

            local map_window = call(user_id, TOOL.query_graph, {
                journal_id = journal_id,
                graph_id = "map",
                mode = "window",
                levels = 3,
                limit = 160,
            })
            test.is_true(map_window.success, tostring(map_window.error))
            test.eq(map_window.result.limits.nodes, 160)
            local decision_node = nil
            for _, node in ipairs(map_window.result.nodes or {}) do
                if tostring(node.label) == "Keep graph reads bounded" then decision_node = node end
            end
            test.not_nil(decision_node)
            test.eq(decision_node.kind, "decision")

            -- An event id is a stable address into its projected node(s). It
            -- must not be mistaken for a missing graph id and return catalog
            -- configuration, which is both incorrect and token-expensive.
            local resolved_node = call(user_id, TOOL.query, {
                journal_id = journal_id,
                mode = "node",
                event_id = recorded.event_id,
            })
            test.is_true(resolved_node.success, tostring(resolved_node.error))
            test.eq(resolved_node.result.event_id, recorded.event_id)
            test.eq(resolved_node.result.items[1].address.graph_id, "map")
            test.eq(resolved_node.result.items[1].node.id, decision_node.id)
            test.is_nil(resolved_node.result.graph)
            test.is_nil(resolved_node.result.items[1].node.config)

            local configured = call(user_id, TOOL.configure_graph, {
                journal_id = journal_id,
                graph_id = "architecture",
                request_id = "config:" .. uuid(),
                title = "Architecture",
                description = "Architecture facts from tagged Journal events.",
                kind = "curated",
                sources = { tags = { "architecture" } },
                maintainer = { mode = "deterministic" },
            })
            test.is_true(configured.success, "generic configure: " .. tostring(configured.error))
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local operation_id = "ops:" .. uuid()
            local applied = call(user_id, TOOL.apply_graph, {
                journal_id = journal_id,
                graph_id = "architecture",
                request_id = operation_id,
                expected_revision = 0,
                origin = "human",
                operations = {{
                    op = "node.add",
                    id = "bounded-window",
                    semantic_key = "architecture:bounded-window",
                    label = "Bounded graph window",
                    kind = "decision",
                    summary = "The server owns traversal limits.",
                    pinned = true,
                }},
            })
            test.is_true(applied.success, "generic apply: " .. tostring(applied.error))
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local architecture = call(user_id, TOOL.query_graph, {
                journal_id = journal_id,
                graph_id = "architecture",
                mode = "window",
            })
            test.is_true(architecture.success, tostring(architecture.error))
            test.eq(architecture.result.graph.kind, "curated")
            test.eq(architecture.result.graph.revision, 1)
            test.eq(architecture.result.nodes[1].id, "bounded-window")
            test.is_true(architecture.result.nodes[1].manual)
            test.is_true(architecture.result.nodes[1].pinned)

            local repeated = call(user_id, TOOL.apply_graph, {
                journal_id = journal_id,
                graph_id = "architecture",
                request_id = operation_id,
                expected_revision = 0,
                origin = "human",
                operations = {{
                    op = "node.add",
                    id = "bounded-window",
                    semantic_key = "architecture:bounded-window",
                    label = "Bounded graph window",
                    kind = "decision",
                    summary = "The server owns traversal limits.",
                    pinned = true,
                }},
            })
            test.is_true(repeated.success, tostring(repeated.error))
            catch_up(user_id, journal_id, GRAPH_PROJECTION)
            local unchanged = call(user_id, TOOL.query_graph, {
                journal_id = journal_id,
                graph_id = "architecture",
                mode = "window",
            })
            test.eq(unchanged.result.graph.revision, 1)

            local denied, denied_err = executor("journal-denied-" .. uuid(), {}):call(TOOL.read, {
                journal_id = journal_id,
                view = "tail",
            })
            test.is_nil(denied)
            test.is_true(errors.is(denied_err, errors.NOT_FOUND))
        end)

        test.it("continues compact frontier and authority collections", function()
            local user_id = "journal-work-pages-" .. uuid()
            local journal_id = create_journal(user_id)
            for _, id in ipairs({ "one", "two" }) do
                local written = call(user_id, TOOL.record, {
                    journal_id = journal_id, kind = "task", data = { id = id, title = id, status = "open" },
                })
                test.is_true(written.success)
            end
            catch_up(user_id, journal_id, STATE_PROJECTION)
            local first = call(user_id, TOOL.read, { journal_id = journal_id, view = "frontier", limit = 1 }).frontier
            test.eq(#first.actionable, 1)
            test.not_nil(first.next_cursor)
            local second = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "frontier", limit = 1, cursor = first.next_cursor,
            }).frontier
            test.eq(#second.actionable, 1)
            test.is_true(first.actionable[1].task_id ~= second.actionable[1].task_id)
            for _, id in ipairs({ "one", "two" }) do
                local written = call(user_id, TOOL.record, {
                    journal_id = journal_id, kind = "task", data = { id = id, title = id, status = "in_progress" },
                })
                test.is_true(written.success)
            end
            catch_up(user_id, journal_id, STATE_PROJECTION)
            local authority = call(user_id, TOOL.read, { journal_id = journal_id, view = "authority", limit = 1 }).authority
            test.eq(#authority.resumable, 1)
            test.not_nil(authority.next_cursor)
            local continued = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "authority", limit = 1, offset = authority.next_cursor.offset,
            }).authority
            test.eq(#continued.resumable, 1)
            test.is_true(authority.resumable[1].task_id ~= continued.resumable[1].task_id)
            test.is_false(continued.has_more)
        end)

        test.it("returns strict recovery reads as full stored records", function()
            local user_id = "journal-compact-" .. uuid()
            local journal_id = create_journal(user_id)
            local task_id = "long-context"
            local long_title = "Canonical ownership cut\n" .. string.rep(
                "with historical instructions that belong in the branch body, ", 10)
            local long_body = string.rep(
                "The exact proof remains available when the agent deliberately drills to full detail. ", 40)

            local task = call(user_id, TOOL.record, {
                journal_id = journal_id,
                kind = "task",
                data = { id = task_id, title = long_title, status = "in_progress" },
            })
            test.is_true(task.success, tostring(task.error))
            local fact = call(user_id, TOOL.fact, {
                journal_id = journal_id,
                kind = "observation",
                title = "Long proof observation",
                body = long_body,
                data = { task_id = task_id },
            })
            test.is_true(fact.success, tostring(fact.error))
            catch_up(user_id, journal_id, STATE_PROJECTION)

            local authority = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "authority", limit = 5,
            })
            test.is_true(authority.success, tostring(authority.error))
            test.eq(#authority.authority.resumable, 1)
            test.is_nil(authority.authority.resumable[1].task_title_truncated)

            local branch = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "branch", task_id = task_id,
            })
            test.is_true(branch.success, tostring(branch.error))
            test.is_nil(branch.detail)
            test.is_nil(branch.branch.facts_detail)
            local stored_fact = branch.branch.facts[1]
            test.is_nil(stored_fact.body_truncated)
            test.not_nil(stored_fact.embedding_status, "a branch fact keeps its embedding status")
            test.not_nil(stored_fact.actor_type, "a branch fact keeps its actor type")
            local normalized_body = long_body:gsub("%s+$", "")
            test.eq(stored_fact.body:sub(1, #normalized_body), normalized_body)
            test.is_true(#stored_fact.body > #normalized_body,
                "the branch fact retains the stored scope suffix")
            test.is_nil(branch.branch.task.title_truncated)
            test.eq(authority.authority.resumable[1].task_title, branch.branch.task.title)

            local huge_body = string.rep("exact stored body ", 600) .. "tail"
            local huge = call(user_id, TOOL.fact, {
                journal_id = journal_id, kind = "observation", title = "Large proof", body = huge_body,
                data = { task_id = task_id },
            })
            test.is_true(huge.success, tostring(huge.error))
            catch_up(user_id, journal_id, STATE_PROJECTION)
            local huge_branch = call(user_id, TOOL.read, { journal_id = journal_id, view = "branch", task_id = task_id, detail = "full" })
            test.is_true(huge_branch.success, tostring(huge_branch.error))
            local huge_fact = huge_branch.branch.facts[1]
            test.eq(huge_fact.body:sub(1, #huge_body), huge_body)
            test.is_nil(huge_fact.body_truncated)
            test.is_nil(huge_fact.body_page)

            local found = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "search", query = "proof", limit = 1,
            })
            test.eq(#found.events, 1)
            test.is_nil(found.events[1].body)
            test.is_nil(found.events[1].metadata)
            test.not_nil(found.next_cursor)
            local next_found = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "search", query = "proof", limit = 1,
                offset = found.next_cursor.offset, fields = { "body" },
            })
            test.eq(#next_found.events, 1)
            test.is_true(next_found.events[1].id ~= found.events[1].id)
            test.eq(type(next_found.events[1].body), "string")
            local detail = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "event", event_id = next_found.events[1].id,
            })
            test.eq(detail.event.body, next_found.events[1].body)

            local another_task = call(user_id, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "other-task", title = "Other task", description = long_body, status = "open" },
            })
            test.is_true(another_task.success)
            catch_up(user_id, journal_id, STATE_PROJECTION)
            local task_page = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "tasks", task_status = "all", limit = 1,
            })
            test.eq(#task_page.tasks, 1)
            test.is_nil(task_page.tasks[1].description)
            test.is_nil(task_page.tasks[1].metadata)
            test.not_nil(task_page.next_cursor)
            local cursor = task_page.next_cursor
            local next_task = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "tasks", task_status = "all", limit = 1,
                after_sort_order = cursor.after_sort_order, after_updated_at = cursor.after_updated_at,
                after_id = cursor.after_id,
            })
            test.eq(#next_task.tasks, 1)
            test.is_true(next_task.tasks[1].id ~= task_page.tasks[1].id)

            local opened = call(user_id, TOOL.act, {
                journal_id = journal_id, verb = "open_branch",
                data = { task_id = task_id, agent_id = "compact-agent" },
            })
            test.is_true(opened.success, tostring(opened.error))
            test.eq(opened.lease.next.tool, "JournalFact")
        end)

        test.it("continues a truncated brief and context graph catalog", function()
            local user_id = "journal-brief-graphs-" .. uuid()
            local journal_id = create_journal(user_id)
            for index = 1, 51 do
                local created = call(user_id, TOOL.graph, {
                    journal_id = journal_id,
                    action = "create",
                    graph_id = "brief-catalog-" .. tostring(index),
                    request_id = "brief-catalog:" .. uuid(),
                    title = "Brief catalog " .. tostring(index),
                    description = "Complete catalog record",
                    kind = "research",
                    workspace = {
                        detached = true,
                        research_question = "Which record fields survive the brief catalog?",
                        integration_policy = "explicit",
                    },
                })
                test.is_true(created.success, tostring(created.error))
            end
            catch_up(user_id, journal_id, STATE_PROJECTION)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local brief = call(user_id, TOOL.read, { journal_id = journal_id, view = "brief" })
            test.is_true(brief.success, tostring(brief.error))
            test.is_true(brief.brief.graphs_truncated, "brief catalog must expose its continuation")
            test.not_nil(brief.brief.graphs_next_cursor)
            test.not_nil(brief.brief.graphs_next_cursor.after_graph_id)
            test.is_nil(brief.brief.graphs[1].description)
            test.is_nil(brief.brief.graphs[1].config)

            local context = call(user_id, TOOL.read, { journal_id = journal_id, view = "context" })
            test.is_true(context.success, tostring(context.error))
            test.is_true(context.context.graphs_truncated, "context catalog must expose its continuation")
            test.not_nil(context.context.graphs_next_cursor)
            test.not_nil(context.context.graphs_next_cursor.after_graph_id)
            test.is_nil(context.context.graphs[1].description)
            test.is_nil(context.context.graphs[1].config)
            local page = call(user_id, TOOL.query, {
                journal_id = journal_id, mode = "catalog", limit = 1,
            })
            test.eq(#page.result.items, 1)
            test.is_nil(page.result.items[1].description)
            test.is_nil(page.result.items[1].config)
            local cursor = page.result.next_cursor
            test.not_nil(cursor)
            local next_page = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, mode = "catalog", limit = 1,
                after_rank = cursor.after_rank, after_updated_at = cursor.after_updated_at,
                after_graph_id = cursor.after_graph_id,
            })
            test.eq(#next_page.result.items, 1)
            test.is_true(next_page.result.items[1].id ~= page.result.items[1].id)
            local detail = call(user_id, TOOL.query, {
                journal_id = journal_id, mode = "window", graph_id = page.result.items[1].id,
            })
            test.eq(detail.result.graph.description, "Complete catalog record")
            test.eq(detail.result.graph.config.workspace.research_question,
                "Which record fields survive the brief catalog?")
        end)

        test.it("recovers a detached generic workspace with refs, convergence, and temporal reads", function()
            local user_id = "journal-workspace-" .. uuid()
            local journal_id = create_journal(user_id)
            local graph_id = "spec:" .. uuid()

            local configured = call(user_id, TOOL.configure_graph, {
                journal_id = journal_id,
                graph_id = graph_id,
                request_id = "config:" .. uuid(),
                title = "Storage model research",
                description = "Detached investigation before promotion into another graph.",
                kind = "workspace",
                workspace = {
                    detached = true,
                    research_question = "Which model preserves provenance at scale?",
                    expected_outputs = { "comparison", "recommendation" },
                    closure_criteria = { "all candidates evaluated", "sources attached" },
                    integration_policy = "explicit",
                },
                maintainer = { mode = "deterministic" },
            })
            test.is_true(configured.success, "generic configure: " .. tostring(configured.error))
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local applied = call(user_id, TOOL.apply_graph, {
                journal_id = journal_id,
                graph_id = graph_id,
                request_id = "ops:" .. uuid(),
                expected_revision = 0,
                origin = "external_agent",
                provenance = { agent = "researcher", method = "comparative analysis" },
                operations = {
                    { op = "node.add", id = "question:storage", label = "Storage model?", kind = "question" },
                    { op = "node.add", id = "paper:event-sourcing", label = "Event sourcing paper", kind = "paper",
                        parent_id = "question:storage" },
                    { op = "node.add", id = "candidate:relational", label = "Relational projection", kind = "alternative",
                        parent_id = "question:storage" },
                    { op = "node.add", id = "candidate:document", label = "Document projection", kind = "alternative",
                        parent_id = "question:storage" },
                    { op = "node.add", id = "evidence:relational", label = "Relational projection proof", kind = "evidence",
                        parent_id = "candidate:relational",
                        summary = "Evidence that relational projections can retain temporal and provenance fidelity.",
                        content = { title = "Proof detail", format = "markdown", role = "evidence",
                            body = "Immutable provenance and indexed temporal reads share one projection boundary." } },
                    { op = "edge.add", id = "paper:supports:relational", from = "paper:event-sourcing", to = "candidate:relational", kind = "supports" },
                    { op = "edge.add", id = "evidence:verifies:relational", from = "evidence:relational", to = "candidate:relational", kind = "verifies" },
                },
            })
            test.is_true(applied.success, "generic apply: " .. tostring(applied.error))
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local linked = call(user_id, TOOL.record, {
                journal_id = journal_id,
                kind = "ref.link",
                data = {
                    graph_id = graph_id,
                    node_id = "paper:event-sourcing",
                    uri = "https://example.test/papers/event-sourcing",
                    version = "2026-08",
                    ref_kind = "paper",
                    relation = "source",
                    ref_attrs = { publisher = "Example Research" },
                    edge_attrs = { asserted_by = "researcher" },
                },
            })
            test.is_true(linked.success, tostring(linked.error))
            test.eq(linked.graph_id, graph_id)
            test.eq(linked.node_id, "paper:event-sourcing")
            catch_up(user_id, journal_id, STATE_PROJECTION)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local decision = call(user_id, TOOL.record, {
                journal_id = journal_id,
                kind = "decision",
                data = {
                    event_id = "selection:" .. uuid(),
                    title = "Select relational projection",
                    body = "It gives indexed temporal reads while retaining immutable provenance.",
                    graph_id = graph_id,
                    selection = {
                        graph_id = graph_id,
                        candidate_node_ids = { "candidate:relational", "candidate:document" },
                        selected_node_ids = { "candidate:relational" },
                        rejected_node_ids = { "candidate:document" },
                        criteria = { "provenance", "temporal query cost", "projection rebuild" },
                        rationale = "Relational hot projections preserve the immutable ledger boundary.",
                    },
                },
            })
            test.is_true(decision.success, tostring(decision.error))
            catch_up(user_id, journal_id, STATE_PROJECTION)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local refs = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "references",
                graph_id = graph_id, node_id = "paper:event-sourcing",
            })
            test.is_true(refs.success, tostring(refs.error))
            test.eq(refs.references.total, 1)
            test.eq(refs.references.items[1].node_id, "paper:event-sourcing")
            test.is_nil(refs.references.items[1].ref_attrs)
            test.is_nil(refs.references.items[1].attrs)
            local selected_refs = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "references", graph_id = graph_id,
                node_id = "paper:event-sourcing", fields = { "ref_attrs", "attrs" },
            })
            test.eq(selected_refs.references.items[1].ref_attrs.publisher, "Example Research")
            test.eq(selected_refs.references.items[1].attrs.asserted_by, "researcher")

            local bundle = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = graph_id, mode = "bundle",
                node_limit = 100, edge_limit = 100,
            })
            test.is_true(bundle.success, tostring(bundle.error))
            test.is_true(bundle.result.complete)
            test.eq(bundle.result.graph.config.workspace.detached, true)
            test.eq(bundle.result.manifest.by_kind.paper, 1)
            test.eq(bundle.result.manifest.by_kind.alternative, 2)
            local edge_kinds: any = {}
            local edge_labels: { string } = {}
            for _, edge in ipairs(bundle.result.edges or {}) do
                edge_kinds[tostring(edge.kind)] = true
                edge_labels[#edge_labels + 1] = tostring(edge.id) .. "=" .. tostring(edge.kind)
            end
            local seen_edges = table.concat(edge_labels, ", ")
            test.is_true(edge_kinds.supports, "workspace lost the authored support edge; got " .. seen_edges)
            test.is_true(edge_kinds.selects, "selection did not project its selected edge; got " .. seen_edges)
            test.is_true(edge_kinds.rejects, "selection did not project its rejected edge; got " .. seen_edges)
            test.is_true(edge_kinds.source,
                "generic reference did not project its source edge; got " .. seen_edges)

            local paged = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = graph_id, mode = "bundle",
                node_limit = 2, edge_limit = 2,
            })
            test.is_false(paged.result.complete)
            test.not_nil(paged.result.omissions.nodes.continuation)
            test.not_nil(paged.result.omissions.edges.continuation)

            local subtree = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = graph_id, mode = "subtree",
                root_id = "candidate:relational",
                node_limit = 100, edge_limit = 100,
            })
            test.is_true(subtree.success, tostring(subtree.error))
            test.is_true(subtree.result.complete)
            test.eq(subtree.result.root_id, "candidate:relational")
            test.eq(subtree.result.manifest.node_count, 2)
            test.eq(subtree.result.manifest.edge_count, 1)
            test.eq(subtree.result.manifest.max_depth, 1)
            test.eq(subtree.result.nodes[1].id, "candidate:relational")
            test.eq(subtree.result.nodes[1].depth, 0)
            test.eq(subtree.result.nodes[2].id, "evidence:relational")
            test.eq(subtree.result.nodes[2].depth, 1)
            test.eq(subtree.result.nodes[2].metadata.content.body,
                "Immutable provenance and indexed temporal reads share one projection boundary.")

            local subtree_again = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = graph_id, mode = "subtree",
                root_id = "candidate:relational",
                node_limit = 100, edge_limit = 100,
            })
            test.is_true(subtree_again.success, tostring(subtree_again.error))
            test.eq(subtree_again.result.nodes[1].depth, 0)
            test.eq(subtree_again.result.nodes[2].depth, 1)
            test.eq(subtree_again.result.nodes[2].metadata.content.body,
                "Immutable provenance and indexed temporal reads share one projection boundary.")

            local subtree_paged = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = graph_id, mode = "subtree",
                root_id = "question:storage", node_limit = 2, edge_limit = 1,
            })
            test.is_false(subtree_paged.result.complete)
            test.eq(subtree_paged.result.omissions.nodes.continuation.mode, "subtree")
            test.eq(subtree_paged.result.omissions.nodes.continuation.root_id, "question:storage")
            test.eq(subtree_paged.result.omissions.edges.continuation.mode, "subtree")
            test.eq(subtree_paged.result.omissions.edges.continuation.root_id, "question:storage")

            local found = call(user_id, TOOL.query, {
                journal_id = journal_id, graph_id = graph_id, mode = "search", query = "relational", limit = 1,
            })
            test.eq(#found.result.items, 1)
            test.is_nil(found.result.items[1].metadata)
            test.not_nil(found.result.continuation)
            local next_found = call(user_id, TOOL.query, found.result.continuation)
            test.eq(#next_found.result.items, 1)
            test.is_true(next_found.result.items[1].id ~= found.result.items[1].id)
            local selected = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = graph_id, mode = "search", query = "relational", limit = 1,
                fields = { "metadata" },
            })
            test.eq(type(selected.result.items[1].metadata), "table")
            local node_detail = call(user_id, TOOL.query, {
                journal_id = journal_id, graph_id = graph_id, mode = "node", node_id = found.result.items[1].id,
            })
            test.eq(type(node_detail.result.node.metadata), "table")

            local temporal = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = graph_id, mode = "timeline",
                from_time = 1, limit = 100,
            })
            test.is_true(temporal.success, tostring(temporal.error))
            local entity_types: any = {}
            for _, item in ipairs(temporal.result.items or {}) do
                entity_types[tostring(item.entity_type)] = true
                test.is_nil(item.attrs)
            end
            test.is_true(entity_types.node, "timeline omitted nodes")
            test.is_true(entity_types.edge, "timeline omitted edges")
        end)

        test.it("resumes an ontology-neutral graph cursor through full-record tools", function()
            local user_id = "journal-generic-cursor-" .. uuid()
            local journal_id = create_journal(user_id)
            local graph_id = "research:" .. uuid()
            catch_up(user_id, journal_id, GRAPH_PROJECTION)
            local configured = call(user_id, TOOL.graph, {
                journal_id = journal_id, action = "create", graph_id = graph_id,
                request_id = "config:" .. uuid(), title = "Formal design exploration",
                kind = "research", workspace = { detached = true, integration_policy = "explicit",
                    parent_graph_id = "map" },
            })
            test.is_true(configured.success, "generic configure: " .. tostring(configured.error))
            test.eq(configured.expected_config_revision, 0)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)
            local reconfigured = call(user_id, TOOL.graph, {
                journal_id = journal_id, action = "configure", graph_id = graph_id,
                title = "Formal design exploration", kind = "research",
                workspace = { detached = true, integration_policy = "explicit",
                    parent_graph_id = "map" },
            })
            test.is_true(reconfigured.success, "safe generic reconfigure: " .. tostring(reconfigured.error))
            test.eq(reconfigured.expected_config_revision, 1)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)
            local applied = call(user_id, TOOL.graph, {
                journal_id = journal_id, action = "apply", graph_id = graph_id,
                request_id = "ops:" .. uuid(), expected_revision = 0,
                origin = "external_agent", provenance = { agent = "proof-researcher" },
                operations = {
                    { op = "node.add", id = "problem", label = "Proof ownership", kind = "question" },
                    { op = "node.add", id = "candidate:a", label = "Program-owned proofs", kind = "alternative", parent_id = "problem" },
                    { op = "node.add", id = "evidence:a", label = "Unforgeable witness", kind = "evidence", parent_id = "candidate:a" },
                    { op = "edge.add", id = "supports:a", from = "evidence:a", to = "candidate:a", kind = "supports" },
                },
            })
            test.is_true(applied.success, "generic apply: " .. tostring(applied.error))
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local opened = call(user_id, TOOL.context, {
                journal_id = journal_id, op = "open", agent_id = "proof-agent",
                address = { graph_id = graph_id, node_id = "evidence:a" },
                purpose = "Determine proof ownership", close_requirements = { "counterexample audit" },
                context_refs = {
                    { graph_id = graph_id, node_id = "problem", load = "summary",
                        reason = "governing design question", required = true },
                },
            })
            test.is_true(opened.success, "generic open: " .. tostring(opened.error))
            test.eq(opened.handle:sub(1, 3), "jc_")
            test.eq(opened.address.graph_id, graph_id)
            test.eq(opened.address.node_id, "evidence:a")
            catch_up(user_id, journal_id, STATE_PROJECTION)

            local resumed = call(user_id, TOOL.context, {
                handle = opened.handle, op = "resume",
                neighbor_limit = 8, delta_limit = 8,
            })
            test.is_true(resumed.success, "generic resume: " .. tostring(resumed.error))
            test.eq(resumed.position.resolved, "node")
            test.eq(#resumed.position.chain, 3)
            test.eq(resumed.position.chain[1].id, "problem")
            test.eq(resumed.position.chain[3].id, "evidence:a")
            test.eq(resumed.position.node.id, "evidence:a")
            test.eq(resumed.position.node.origin, "external_agent")
            test.eq(#resumed.position.graph_chain, 2)
            test.eq(resumed.position.graph_chain[1].id, "map")
            test.eq(resumed.position.graph_chain[2].id, graph_id)
            test.eq(resumed.position.graph_chain[2].parent_graph_id, "map")
            test.not_nil(resumed.position.graph_chain[2].config,
                "cursor graph path must retain configuration")
            test.eq(#resumed.local_context.edges, 1)
            test.eq(resumed.cursor.current_task_id, "")

            local fact = call(user_id, TOOL.fact, {
                handle = opened.handle, kind = "observation",
                title = "Witness cannot be reconstructed",
                body = "The proof must remain owned by the program boundary.",
                confidence = 0.9,
            })
            test.is_true(fact.success, "generic fact: " .. tostring(fact.error))
            test.not_nil(fact.thread_id, "fact result must retain its thread record")
            test.not_nil(fact.inserted, "fact result must retain its append record")
            test.eq(fact.handle, opened.handle, "fact result must retain its routing handle")
            test.eq(fact.kind, "observation", "fact result must retain its kind")
            test.eq(fact.address.graph_id, graph_id, "fact result must retain its graph address")
            test.eq(fact.address.node_id, "evidence:a", "fact result must retain its node address")
            test.not_nil(fact.max_seq, "fact result must retain its journal watermark")

            local packet = call(user_id, TOOL.query, {
                handle = opened.handle, mode = "context",
            })
            test.is_true(packet.success, "handle-defaulted context: " .. tostring(packet.error))
            test.eq(packet.result.root.id, "evidence:a")

            local mutation = call(user_id, TOOL.graph, {
                handle = opened.handle,
                operation = {
                    op = "node.add", id = "note:ergonomic",
                    label = "One-handle mutation", kind = "observation",
                    summary = "The caller did not carry graph or request identity.",
                    parent_id = "evidence:a",
                },
            })
            test.is_true(mutation.success, "one-handle graph mutation: " .. tostring(mutation.error))
            test.eq(mutation.status, "queued")
            test.eq(mutation.graph_id, graph_id)
            test.is_true(tostring(mutation.request_id):match("^graph%-ops:") ~= nil)
            test.eq(mutation.touched[1].id, "note:ergonomic")
            test.eq(mutation.verify.mode, "request")
            test.eq(mutation.verify.handle, opened.handle)
            test.not_nil(mutation.expected_revision, "graph mutation must retain expected revision")
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local verified = call(user_id, TOOL.query, {
                continuation = mutation.verify,
            })
            test.is_true(verified.success, "graph request verification: " .. tostring(verified.error))
            test.eq(verified.result.status, "applied")
            test.eq(verified.result.graph_id, graph_id)
            test.eq(verified.result.revision, mutation.expected_revision + 1)

            -- The event feed reads the state projection, so wait for the facts
            -- and graph requests appended above to be folded into it.
            catch_up(user_id, journal_id, STATE_PROJECTION)
            local event_page = call(user_id, TOOL.query, {
                handle = opened.handle,
                continuation = { mode = "events", since_seq = 0, scope = "journal", limit = 2 },
            })
            test.is_true(event_page.success, "event continuation: " .. tostring(event_page.error))
            test.eq(#event_page.result.events, 2)
            test.is_true(event_page.result.has_more)
            test.eq(event_page.result.continuation.handle, opened.handle)
            local next_event_page = call(user_id, TOOL.query, {
                continuation = event_page.result.continuation,
            })
            test.is_true(next_event_page.success,
                "self-routed event continuation: " .. tostring(next_event_page.error))
            test.is_true(next_event_page.result.since_seq >= event_page.result.next_cursor)

            local before_checkpoint = call(user_id, TOOL.context, { handle = opened.handle })
            test.is_true(before_checkpoint.success, tostring(before_checkpoint.error))
            test.eq(before_checkpoint.next.checkpoint.expected_revision, opened.revision)
            test.eq(before_checkpoint.next.checkpoint.handle, opened.handle)
            local checkpointed = call(user_id, TOOL.context, {
                continuation = before_checkpoint.next.checkpoint,
                checkpoint = {
                    completed = { "Captured one-handle mutation semantics" },
                    next_safe_actions = { "Continue ownership review" },
                },
            })
            test.is_true(checkpointed.success, "checkpoint continuation: " .. tostring(checkpointed.error))
            test.eq(checkpointed.revision, opened.revision + 1)
            catch_up(user_id, journal_id, STATE_PROJECTION)

            local memory = call(user_id, TOOL.query, {
                handle = opened.handle, mode = "memory", query = "Witness cannot be reconstructed",
            })
            test.is_true(memory.success, "journal-wide associative recall: " .. tostring(memory.error))
            test.is_true(#memory.result.events >= 1)
            test.eq(memory.result.events[1].event_type, "observation")
            test.is_nil(memory.result.events[1].body)
            test.is_nil(memory.result.events[1].metadata)
            local fact_detail = call(user_id, TOOL.read, {
                journal_id = journal_id, view = "event", event_id = memory.result.events[1].id,
            })
            test.contains(fact_detail.event.body, "The proof must remain owned by the program boundary.")

            local bundle = call(user_id, TOOL.query, {
                handle = opened.handle, mode = "bundle",
                node_limit = 20, edge_limit = 20,
            })
            test.is_true(bundle.success, "generic graph query: " .. tostring(bundle.error))
            test.is_nil(bundle.detail)
            test.not_nil(bundle.result.graph.config, "bundle must retain graph configuration")
            test.eq(bundle.result.graph.config.workspace.detached, true,
                "graph lost detached workspace state")
            test.eq(bundle.result.nodes[1].origin, "external_agent")
            test.not_nil(bundle.result.nodes[1].manual, "bundle must retain node provenance")

            local disambiguated = call(user_id, TOOL.query, {
                journal_id = journal_id, handle = opened.handle, mode = "node",
            })
            test.is_true(disambiguated.success,
                "explicit journal + handle did not hydrate cursor: " .. tostring(disambiguated.error))
            test.eq(disambiguated.result.node.id, "evidence:a")

            local graph_path = call(user_id, TOOL.query, {
                journal_id = journal_id, handle = opened.handle, mode = "graph_path",
            })
            test.is_true(graph_path.success, "graph path: " .. tostring(graph_path.error))
            test.eq(graph_path.result.path[1].id, "map")
            test.eq(graph_path.result.path[2].title, "Formal design exploration")
            test.eq(graph_path.result.path[2].parent_graph_id, "map")
            test.is_nil(graph_path.result.path[2].label)

            local moved = call(user_id, TOOL.context, {
                handle = opened.handle, op = "move",
                expected_revision = checkpointed.revision,
                address = { graph_id = graph_id, node_id = "candidate:a" },
                reason = "Evidence evaluated; focus returns to the candidate.",
            })
            test.is_true(moved.success, "generic move: " .. tostring(moved.error)
                .. " code=" .. tostring(moved.code) .. " detail=" .. tostring(moved.detail))
            test.eq(moved.address.node_id, "candidate:a")

            catch_up(user_id, journal_id, STATE_PROJECTION)
            local child = call(user_id, TOOL.context, {
                op = "open", parent_handle = opened.handle, agent_id = "proof-child",
                address = { graph_id = graph_id, node_id = "candidate:a" },
                assignment = "Challenge the selected ownership boundary",
                context_refs = {
                    { graph_id = graph_id, node_id = "evidence:a", load = "pointer",
                        reason = "inspect only if the challenge conflicts" },
                },
            })
            test.is_true(child.success, "child handle open: " .. tostring(child.error))
            test.eq(child.parent_handle, opened.handle)
            catch_up(user_id, journal_id, STATE_PROJECTION)
            local child_context = call(user_id, TOOL.context, { handle = child.handle })
            test.is_true(child_context.success, "child handle resume: " .. tostring(child_context.error))
            test.eq(child_context.parent_context.handle, opened.handle)
            test.eq(#child_context.attached_context, 3)
            test.eq(child_context.attached_context[1].node.id, "problem")

            local checkpointed = call(user_id, TOOL.context, {
                handle = child.handle, op = "checkpoint", expected_revision = child.revision,
                last_seen_seq = child.max_seq,
                checkpoint = { completed = { "recovered delegated context" } },
            })
            test.is_true(checkpointed.success,
                "child checkpoint: " .. tostring(checkpointed.error))
            catch_up(user_id, journal_id, STATE_PROJECTION)
            local after_checkpoint = call(user_id, TOOL.context, {
                handle = child.handle, op = "resume",
            })
            test.is_true(after_checkpoint.success,
                "child resume after checkpoint: " .. tostring(after_checkpoint.error))
            test.eq(after_checkpoint.parent_context.handle, opened.handle)
            test.eq(after_checkpoint.cursor.parent_cursor_id, opened.handle)

            local pending = call(user_id, TOOL.context, {
                handle = child.handle, op = "integrate",
                receipt_id = "proof-child-integration",
                parent_handle = opened.handle,
                child_handle = child.handle,
                disposition = "pending",
                summary = "Delegated context survived checkpoint",
            })
            test.is_true(pending.success,
                "child integration after checkpoint: " .. tostring(pending.detail or pending.error))

            local closed = call(user_id, TOOL.context, {
                handle = child.handle, op = "close", expected_revision = checkpointed.revision,
            })
            test.is_true(closed.success, "child close: " .. tostring(closed.error))
            test.eq(closed.parent_handle, opened.handle)
            test.eq(closed.return_to.op, "resume")
            test.eq(closed.return_to.handle, opened.handle)
        end)

        test.it("keeps a completed run terminal when dispatch bookkeeping arrives late", function()
            local journal_id = uuid()
            local run_id = "assembly-late-" .. uuid()
            local handle, open_err = sql.get("app:db")
            test.is_nil(open_err)
            test.is_nil(ledger.enqueue(handle, journal_id, "map", run_id, {}))
            test.is_nil(ledger.mark(handle, journal_id, run_id, "running"))
            test.is_nil(ledger.complete(handle, journal_id, run_id, { events_replayed = 3 }))
            test.is_nil(ledger.mark(handle, journal_id, run_id, "dispatched"))
            local finished, finished_err = ledger.get(handle, journal_id, run_id)
            handle:release()
            test.is_nil(finished_err)
            test.eq(finished.status, "completed")
            test.eq(finished.events_replayed, 3)
        end)

        test.it("records a malformed stored assembly identity as a terminal failure", function()
            local user_id = "journal-assembly-invalid-" .. uuid()
            local journal_id = create_journal(user_id)
            local run_id = "assembly-invalid-" .. uuid()
            local handle, open_err = sql.get("app:db")
            test.is_nil(open_err)
            test.is_nil(ledger.enqueue(handle, journal_id, "map", run_id, {
                actor_id = user_id, actor_context = "{invalid",
            }))
            handle:release()
            local result, run_err = executor("system:journal-assembly"):call(ASSEMBLER, {
                payload = { journal_id = journal_id, graph_id = "map", run_id = run_id },
            })
            test.is_nil(result)
            test.contains(tostring(run_err), "invalid actor_context json")
            handle, open_err = sql.get("app:db")
            test.is_nil(open_err)
            local finished, finished_err = ledger.get(handle, journal_id, run_id)
            handle:release()
            test.is_nil(finished_err)
            test.not_nil(finished)
            test.eq(finished.status, "failed")
            test.contains(tostring(finished.error), "invalid actor_context json")
        end)

        test.it("assembles the map on demand and reports the run through one address", function()
            local user_id = "journal-assembler-" .. uuid()
            local journal_id = create_journal(user_id)

            local task = call(user_id, TOOL.record, {
                journal_id = journal_id, kind = "task",
                data = { id = "assembly-root", title = "Assemble the map", status = "in_progress" },
            })
            test.is_true(task.success, tostring(task.error))
            local finding = call(user_id, TOOL.record, {
                journal_id = journal_id, kind = "entry",
                data = {
                    event_id = "assembly-finding", event_type = "finding",
                    title = "Confetti has no territories",
                    body = "A map with no relations cannot be read as one.",
                    task_id = "assembly-root", tags = { "finding" },
                },
            })
            test.is_true(finding.success, tostring(finding.error))
            local decision = call(user_id, TOOL.record, {
                journal_id = journal_id, kind = "entry",
                data = {
                    event_id = "assembly-decision", event_type = "decision",
                    title = "Derive relations on projection",
                    body = "Every fact carries the relations it stands in.",
                    task_id = "assembly-root", tags = { "decision" },
                    causation_id = "assembly-finding",
                },
            })
            test.is_true(decision.success, tostring(decision.error))
            catch_up(user_id, journal_id, STATE_PROJECTION)
            catch_up(user_id, journal_id, GRAPH_PROJECTION)

            local triggered = call(user_id, TOOL.graph, {
                action = "assemble", journal_id = journal_id, graph_id = "map",
            })
            test.is_true(triggered.success, tostring(triggered.error))
            local run_id = tostring(triggered.run_id)
            test.is_true(run_id ~= "", "assembly did not answer a work item id")
            test.is_true(triggered.running, "a fresh assembly should report itself as running")

            local queued = call(user_id, TOOL.graph, {
                action = "status", journal_id = journal_id, graph_id = "map",
            })
            test.is_true(queued.success, tostring(queued.error))
            test.eq(tostring(queued.run_id), run_id)
            test.eq(tostring(queued.graph_id), "map")

            -- A second request while one is in flight is the same run, not a
            -- second pass over the log.
            local again = call(user_id, TOOL.graph, {
                action = "assemble", journal_id = journal_id, graph_id = "map",
            })
            test.eq(tostring(again.run_id), run_id)

            local finished: any = nil
            for _ = 1, 500 do
                finished = call(user_id, TOOL.graph, {
                    action = "status", journal_id = journal_id, graph_id = "map",
                })
                if not finished.running then break end
                time.sleep("20ms")
            end
            test.is_true(finished.success, tostring(finished.error))
            test.is_nil(finished.error, "assembly failed: " .. tostring(finished.error))
            test.eq(tostring(finished.status), "completed")
            test.is_false(finished.running)
            test.is_true(tonumber(finished.events_replayed) >= 3,
                "assembly replayed too few events: " .. tostring(finished.events_replayed))
            test.eq(tostring(finished.model), "class:nano")

            local window = call(user_id, TOOL.query_graph, {
                journal_id = journal_id, graph_id = "map", mode = "window", levels = 4, limit = 160,
            })
            test.is_true(window.success, tostring(window.error))
            local derived_kinds: any = {}
            local derived_count = 0
            for _, edge in ipairs(window.result.edges or {}) do
                if tostring((edge.metadata or {}).origin) == "derived" then
                    derived_count = derived_count + 1
                    derived_kinds[tostring(edge.kind)] = true
                end
            end
            test.is_true(derived_count >= 3, "assembled map carries too few relations: " .. tostring(derived_count))
            test.is_true(derived_kinds.part_of == true, "the map lost fact attachment")
            test.is_true(derived_kinds.causes == true, "the map lost causation")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options: any): any
    return run_cases(options)
end

return { run = run }

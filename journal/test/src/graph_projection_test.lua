local test = require("test")
local sql = require("sql")
local ops = require("ops")
local types = require("types")
local projector = require("projector")
local reader = require("reader")
local writer = require("writer")
local jobs = require("jobs")
local scheduler = require("scheduler")
local embeddings = require("embeddings")
local hierarchy_backfill = require("hierarchy_backfill")

local function postgres_graph_spy(): (any, any)
    local calls: any = {}
    local handle: any = {}
    handle["type"] = function(): (string, nil) return "postgres", nil end
    handle.query = function(_: any, statement: string, _params: any): (any, nil)
        calls[#calls + 1] = statement
        if statement:find("SELECT * FROM chestor_journal_graphs", 1, true) then
            return {{
                graph_id = "graph", title = "Graph", description = "",
                graph_kind = "memory", lifecycle = "active", health = "ready",
                config_json = "{}", config_revision = 1, graph_revision = 1,
                node_count = 1, edge_count = 0, last_source_seq = 0, updated_at = 1,
            }}, nil
        end
        if statement:find("SELECT n.*, (SELECT COUNT(*)", 1, true) then
            return {{
                id = "root", semantic_key = "root", label = "Root", node_kind = "root",
                summary = "Root", status = "active", parent_id = nil, metadata = "{}",
                created_revision = 1, updated_revision = 1, created_at = 1, updated_at = 1,
                child_count = 0,
            }}, nil
        end
        if statement:find("SELECT n.*, subtree.depth", 1, true) then
            return {{
                id = "root", semantic_key = "root", label = "Root", node_kind = "root",
                summary = "Root", status = "active", parent_id = nil, metadata = "{}",
                created_revision = 1, updated_revision = 1, created_at = 1, updated_at = 1,
                child_count = 0, depth = 0,
            }}, nil
        end
        if statement:find("SELECT edge.*", 1, true) then return {}, nil end
        if statement:find("COUNT(*) AS node_count", 1, true) then
            return {{ node_count = 1, max_depth = 0 }}, nil
        end
        if statement:find("COUNT(*) AS edge_count", 1, true) then
            return {{ edge_count = 0 }}, nil
        end
        if statement:find("SELECT n.node_kind", 1, true) then
            return {{ node_kind = "root", status = "active", n = 1 }}, nil
        end
        return {}, nil
    end
    return handle, calls
end

local function with_db(fn: (any) -> ())
    local handle, err = sql.get(types.db_id())
    test.is_nil(err)
    test.not_nil(handle)
    fn(handle)
    handle:release()
end

local function project(handle: any, journal_id: string, events: { any }): string?
    local tx, begin_err = handle:begin()
    if begin_err or not tx then
        return "failed to begin graph projection test transaction: " .. tostring(begin_err)
    end
    local project_err = projector.project_events(tx, journal_id, events)
    if project_err then
        tx:rollback()
        return project_err
    end
    local _, commit_err = tx:commit()
    if commit_err then
        return "failed to commit graph projection test transaction: " .. tostring(commit_err)
    end
    return nil
end

local function event(seq: number, kind: string, body: any): any
    return { seq = seq, type = kind, body = body }
end

local function define_tests()
    test.describe("Journal Graph Projection", function()
        test.it("uses the PostgreSQL recursive-subtree cycle predicate", function()
            local handle, calls = postgres_graph_spy()
            local subtree, subtree_err = reader.subtree(handle, "journal", "graph", {
                root_id = "root", node_limit = 10, edge_limit = 10,
            })
            test.is_nil(subtree_err)
            test.not_nil(subtree)
            test.eq(subtree.manifest.node_count, 1)
            test.eq(subtree.nodes[1].depth, 0)

            local cte_calls = 0
            for _, statement in ipairs(calls) do
                if statement:find("WITH RECURSIVE subtree", 1, true) then
                    cte_calls = cte_calls + 1
                    test.contains(statement, "strpos(subtree.visited")
                    local instr = statement:find("instr(", 1, true)
                    test.is_nil(instr)
                end
            end
            test.eq(cte_calls, 5)
        end)

        test.it("derives the unified bounded map from work, decision, observation, and risk facts", function()
            local journal_id = "journal-graph-structural"
            with_db(function(db)
                local err = project(db, journal_id, {
                    event(2, types.EVENT.TASK_UPSERTED, {
                        id = "task-1", title = "Build graph API", status = "blocked",
                        description = "Waiting on projection contract",
                    }),
                    event(3, types.EVENT.ENTRY_APPENDED, {
                        id = "decision-1", event_type = "decision", title = "Reads stay passive",
                        body = "Only the projection worker advances graph state.", tags = { "decision" },
                    }),
                    event(4, types.EVENT.ENTRY_APPENDED, {
                        id = "risk-1", event_type = "risk", title = "Oversized graph",
                        body = "Never mount all nodes.", tags = { "risk" },
                    }),
                    event(5, types.EVENT.ENTRY_APPENDED, {
                        id = "observation-1", event_type = "observation", title = "Branches stay bounded",
                        body = "A focused hierarchy remains usable.", tags = { "observation" },
                    }),
                    event(6, types.EVENT.ENTRY_APPENDED, {
                        id = "observation-2", event_type = "finding", title = "Evidence follows the branch",
                        body = "Nested observations retain provenance.", parent_event_id = "observation-1",
                    }),
                })
                test.is_nil(err)

                local catalog, catalog_err = reader.catalog_page(db, journal_id, { limit = 20 })
                test.is_nil(catalog_err)
                test.eq(#(catalog :: any).items, 1)
                test.is_false((catalog :: any).has_more, "one graph fits inside a twenty-row page")
                test.eq(tostring(((catalog :: any).items[1] :: any).id), "map")

                local map, map_err = reader.window(db, journal_id, "map", { levels = 3, limit = 160 })
                test.is_nil(map_err)
                test.eq(#map.nodes, 5)
                -- The nested finding names the observation it refines, so the
                -- map arrives with that relation already drawn.
                test.eq(#map.edges, 1)
                test.eq(map.edges[1].from, "event:observation-2")
                test.eq(map.edges[1].to, "event:observation-1")
                test.eq(map.edges[1].kind, "part_of")
                test.eq(map.edges[1].metadata.origin, "derived")
                test.eq(map.edges[1].metadata.rule, "fact_task")
                test.eq(map.graph.revision, 5)
                test.eq(map.limits.nodes, 160)
                test.eq(map.limits.edges, 480)
                local by_id: any = {}
                for _, node in ipairs(map.nodes) do by_id[tostring((node :: any).id)] = node end
                test.eq((by_id["task:task-1"] :: any).kind, "risk")
                test.eq((by_id["task:task-1"] :: any).status, "blocked")
                test.eq((by_id["event:decision-1"] :: any).kind, "decision")
                test.eq((by_id["event:decision-1"] :: any).ref_id, "decision-1")
                test.eq((by_id["event:risk-1"] :: any).kind, "risk")
                test.eq((by_id["event:observation-1"] :: any).kind, "observation")
                test.eq((by_id["event:observation-2"] :: any).kind, "observation")
                test.eq((by_id["event:observation-2"] :: any).parent_id, "event:observation-1")

                local related, related_err = reader.event_graphs(db, journal_id, "risk-1", 20)
                test.is_nil(related_err)
                test.eq(#related, 1)
                test.eq(related[1].id, "map")

                local resolved, resolved_err = reader.event_nodes(db, journal_id, "risk-1", nil, 20)
                test.is_nil(resolved_err)
                test.eq(resolved.event_id, "risk-1")
                test.eq(resolved.count, 1)
                test.eq(resolved.items[1].address.graph_id, "map")
                test.eq(resolved.items[1].address.node_id, "event:risk-1")
                test.eq(resolved.items[1].node.label, "Oversized graph")
                local after_resolved = reader.event_nodes(db, journal_id, "risk-1", nil, 20, 1)
                test.eq(after_resolved.count, 0, "event address offset must not repeat a node")
                test.is_nil(resolved.items[1].node.metadata.config,
                    "event-to-node resolution must not leak graph configuration")
            end)
        end)

        test.it("merges sparse entity closes and resolves an existing blocked-task risk", function()
            local journal_id = "journal-graph-entity-updates"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(2, types.EVENT.TASK_UPSERTED, {
                        event_id = "parent-open", id = "parent-1", title = "Parent task", status = "open",
                    }),
                    event(3, types.EVENT.TASK_UPSERTED, {
                        event_id = "task-open", id = "task-1", title = "Fix graph merging", status = "blocked",
                        parent_task_id = "parent-1", description = "Preserve sparse fields",
                    }),
                }))
                test.is_nil(project(db, journal_id, {
                    event(4, types.EVENT.TASK_CLOSED, {
                        event_id = "task-close", id = "task-1", title = "Fix graph merging", status = "done",
                    }),
                }))

                local task, task_err = writer.node(db, journal_id, "map", "task:task-1")
                test.is_nil(task_err)
                test.eq(task.status, "done")
                test.eq(task.summary, "Preserve sparse fields")
                test.eq(task.parent_id, "task:parent-1")
                test.eq(task.ref_id, "task-close")
                -- The single map node carries risk state directly: the blocked
                -- task projected kind risk, and the close returns it to work.
                test.eq(task.node_kind, "work")

                local map, map_err = reader.window(db, journal_id, "map", { levels = 3 })
                test.is_nil(map_err)
                test.eq(map.graph.revision, 3)
                -- The asserted parent is a relation, so the subtask carries one
                -- derived hierarchy edge and the sparse close adds none.
                test.eq(#map.edges, 1)
                test.eq(map.edges[1].from, "task:task-1")
                test.eq(map.edges[1].to, "task:parent-1")
                test.eq(map.edges[1].metadata.rule, "task_parent")
            end)
        end)

        test.it("configures custom projections and records idempotent revisioned graph operations", function()
            local journal_id = "journal-graph-operations"
            with_db(function(db)
                local config_event = event(1, types.EVENT.GRAPH_CONFIG_REQUESTED, {
                    request_id = "cfg-1", graph_id = "protocols", title = "Protocols",
                    kind = "work", lifecycle = "active",
                    sources = { tags = { "protocol" } },
                    maintainer = { mode = "deterministic+agent", model = "class:fast" },
                    schedule = { min_nodes = 4, growth_nodes = 4, max_roots = 4, max_siblings = 4 },
                })
                test.is_nil(project(db, journal_id, { config_event }))
                test.is_nil(project(db, journal_id, { config_event }))
                local config_request, config_request_err = writer.request(db, journal_id, "cfg-1")
                test.is_nil(config_request_err)
                test.is_nil(config_request.error)
                test.eq(config_request.status, "applied")

                local source_events = {}
                for index = 1, 4 do
                    source_events[#source_events + 1] = event(index + 1, types.EVENT.ENTRY_APPENDED, {
                        id = index == 1 and "protocol-event" or ("protocol-event-" .. tostring(index)),
                        event_type = "note", title = "MCP transport " .. tostring(index),
                        body = "Keep transport independent.", tags = { "protocol" },
                    })
                end
                test.is_nil(project(db, journal_id, source_events))
                test.is_nil(project(db, journal_id, source_events))

                local before, before_err = reader.graph(db, journal_id, "protocols")
                test.is_nil(before_err)
                test.eq(before.config_revision, 1)
                test.eq(before.revision, 4)
                local queued, queued_err = jobs.pending(db, journal_id, 20)
                test.is_nil(queued_err)
                test.eq(#queued, 1)
                test.eq(queued[1].job_id, "graph-maint:protocols:1:g1-r1-s0")
                local dispatched: any = nil
                scheduler._jobs = {
                    enqueue = function(payload: any): (any, nil)
                        dispatched = payload
                        return { id = "shared-job-1" }, nil
                    end,
                }
                test.is_nil(scheduler.dispatch(journal_id))
                scheduler._jobs = nil
                test.eq(dispatched.namespace, "thread")
                test.eq(dispatched.scope, journal_id)
                test.eq(dispatched.key, "graph-maint:protocols:1:g1-r1-s0")
                test.eq(dispatched.owner_locator.kind, "thread")
                test.eq(dispatched.owner_locator.id, journal_id)
                test.eq(dispatched.job_type, "chestor.journal.graph:maintainer")
                test.eq(dispatched.immutable_payload.job_id, "graph-maint:protocols:1:g1-r1-s0")
                local intent, intent_err = jobs.get(db, journal_id, "graph-maint:protocols:1:g1-r1-s0")
                test.is_nil(intent_err)
                test.eq(intent.status, "dispatched")

                local ops_event = event(6, types.EVENT.GRAPH_OPS_REQUESTED, {
                    request_id = "ops-1", graph_id = "protocols", expected_revision = 4,
                    origin = "external_agent", source_event_ids = { "protocol-event" },
                    operations = {
                        { op = "node.add", id = "transport:mcp", label = "MCP", kind = "protocol", pinned = true },
                        { op = "edge.add", id = "rel:mcp:event", from = "transport:mcp", to = "event:protocol-event", kind = "implements" },
                    },
                })
                test.is_nil(project(db, journal_id, { ops_event }))
                test.is_nil(project(db, journal_id, { ops_event }))

                local window, window_err = reader.window(db, journal_id, "protocols", {})
                test.is_nil(window_err)
                test.eq(window.graph.revision, 5)
                test.eq(#window.nodes, 5)
                test.eq(#window.edges, 1)
                test.eq(window.nodes[5].pinned, true)

                local first_matches, first_match_err = reader.search(db, journal_id, "protocols", "MCP", { limit = 2, offset = 0 })
                test.is_nil(first_match_err)
                test.eq(#first_matches.items, 2)
                test.is_true(first_matches.has_more)
                local next_matches, next_match_err = reader.search(db, journal_id, "protocols", "MCP", { limit = 2, offset = 2 })
                test.is_nil(next_match_err)
                test.eq(next_matches.offset, 2)
                test.eq(#next_matches.items, 2)

                local changes, changes_err = reader.changes(db, journal_id, "protocols", 4, {})
                test.is_nil(changes_err)
                test.eq(#changes.changes, 2)
                local first_change = reader.changes(db, journal_id, "protocols", 4, { limit = 1 })
                test.eq(#first_change.changes, 1)
                test.is_true(first_change.has_more)
                test.not_nil(first_change.continuation)
                local second_change = reader.changes(db, journal_id, "protocols", 4, first_change.continuation)
                test.eq(#second_change.changes, 1)
                test.is_false(second_change.has_more)
                test.is_true(first_change.changes[1].target_id ~= second_change.changes[1].target_id)

                local rejected = event(7, types.EVENT.GRAPH_OPS_REQUESTED, {
                    request_id = "ops-stale", graph_id = "protocols", expected_revision = 4,
                    origin = "external_agent",
                    operations = { { op = "node.add", id = "stale", label = "Stale" } },
                })
                test.is_nil(project(db, journal_id, { rejected }))
                local after, after_err = reader.graph(db, journal_id, "protocols")
                test.is_nil(after_err)
                test.eq(after.revision, 5)
            end)
        end)

        test.it("projects configured active graphs beyond a catalog page", function()
            local journal_id = "journal-graph-active-page"
            with_db(function(db)
                local events = {}
                for index = 1, 201 do
                    events[#events + 1] = event(index, types.EVENT.GRAPH_CONFIG_REQUESTED, {
                        request_id = "active-page-" .. tostring(index),
                        graph_id = string.format("many:%03d", index),
                        title = "Many " .. tostring(index),
                        kind = "curated",
                        lifecycle = "active",
                        sources = { tags = { "overflow" } },
                    })
                end
                events[#events + 1] = event(202, types.EVENT.ENTRY_APPENDED, {
                    id = "overflow-event", event_type = "note", title = "Project all active maps",
                    body = "Every matching map receives this fact.", tags = { "overflow" },
                })
                test.is_nil(project(db, journal_id, events))

                local last, last_err = reader.graph(db, journal_id, "many:201")
                test.is_nil(last_err)
                test.eq(last.revision, 1)
                local window, window_err = reader.window(db, journal_id, "many:201", {})
                test.is_nil(window_err)
                test.eq(#window.nodes, 1)
                test.eq(window.nodes[1].ref_id, "overflow-event")
            end)
        end)

        test.it("caps every graph window even when callers request an unbounded projection", function()
            local journal_id = "journal-graph-window-cap"
            local operations = {}
            for index = 1, 200 do
                operations[#operations + 1] = {
                    op = "node.add", id = "node:" .. tostring(index), label = "Node " .. tostring(index),
                }
            end
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(1, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "cap-1", graph_id = "map", origin = "external_agent", operations = operations,
                    }),
                }))
                local window, err = reader.window(db, journal_id, "map", { levels = 99, limit = 9999, edge_limit = 9999 })
                test.is_nil(err)
                test.eq(#window.nodes, 160)
                test.eq(window.levels, 4)
                test.eq(window.limits.nodes, 160)
                test.eq(window.limits.edges, 480)
                test.eq(window.collapsed_node_count, 40)
            end)
        end)

        test.it("rejects cyclic nesting before graph operations can mutate a hierarchy", function()
            local journal_id = "journal-graph-cycle"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(1, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "cycle-1", graph_id = "map", origin = "external_agent",
                        operations = {
                            { op = "node.add", id = "branch:a", label = "A", parent_id = "branch:b" },
                            { op = "node.add", id = "branch:b", label = "B", parent_id = "branch:a" },
                        },
                    }),
                }))
                local window, window_err = reader.window(db, journal_id, "map", {})
                test.is_nil(window_err)
                test.eq(window.graph.revision, 0)
                test.eq(#window.nodes, 0)
            end)
        end)

        test.it("resolves ordinary nodes as context packets and retains done-to-reopened history", function()
            local journal_id = "journal-context-packets"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(1, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "packet-create", graph_id = "map", origin = "external_agent",
                        operations = {
                            { op = "node.add", id = "packet:review", label = "Review packet", kind = "context" },
                            { op = "node.add", id = "rule:ownership", label = "Ownership rule", kind = "rule",
                                content = { title = "Rule", format = "markdown", body = "One semantic owner." },
                                presentation = { renderer = "rule" } },
                            { op = "node.add", id = "rule:proof", label = "Proof detail", kind = "evidence",
                                parent_id = "rule:ownership" },
                            { op = "edge.add", id = "packet-includes-rule", from = "packet:review",
                                to = "rule:ownership", kind = "includes", metadata = {
                                    order = 1, load = "full", required = true,
                                    include_descendants = true, descendant_depth = 1,
                                } },
                        },
                    }),
                    event(2, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "rule-done", graph_id = "map", expected_revision = 1,
                        origin = "external_agent", operations = {
                            { op = "node.update", id = "rule:ownership", status = "done" },
                        },
                    }),
                    event(3, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "rule-reopen", graph_id = "map", expected_revision = 2,
                        origin = "external_agent", operations = {
                            { op = "node.update", id = "rule:ownership", status = "active" },
                        },
                    }),
                }))

                local packet, packet_err = reader.context(db, journal_id, "map", {
                    node_id = "packet:review", member_limit = 10, node_limit = 20,
                })
                test.is_nil(packet_err)
                test.eq(#packet.members, 1)
                test.eq(packet.members[1].address.node_id, "rule:ownership")
                test.eq(packet.members[1].node.metadata.content.body, "One semantic owner.")
                test.eq(#packet.nodes, 2)
                test.eq(packet.nodes[1].address.graph_id, "map")
                test.eq(packet.omissions.members.omitted, 0)

                local history, history_err = reader.timeline(db, journal_id, "map", {
                    entity_type = "node", limit = 20,
                })
                test.is_nil(history_err)
                local updates = 0
                for _, item in ipairs(history.items or {}) do
                    if item.id == "rule:ownership" and item.kind == "node.update" then updates = updates + 1 end
                end
                test.eq(updates, 2)
                local current, current_err = reader.node(db, journal_id, "map", "rule:ownership")
                test.is_nil(current_err)
                test.eq(current.node.status, "active")
            end)
        end)

        test.it("indexes nested and detached graph ancestry without imposing graph kinds", function()
            local journal_id = "journal-graph-hierarchy"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(1, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "commission-node", graph_id = "map", origin = "external_agent",
                        operations = {
                            { op = "node.add", id = "goal:engine", label = "Engine research", kind = "goal" },
                        },
                    }),
                    event(2, types.EVENT.GRAPH_CONFIG_REQUESTED, {
                        request_id = "cfg-program", graph_id = "program", title = "Program",
                        kind = "domain-anything", workspace = {
                            anchor_graph_id = "map", anchor_node_id = "goal:engine",
                        },
                    }),
                    event(3, types.EVENT.GRAPH_CONFIG_REQUESTED, {
                        request_id = "cfg-research", graph_id = "research:proofs", title = "Proof research",
                        kind = "research-paper-space", workspace = {
                            detached = true, parent_graph_id = "program",
                            anchor_graph_id = "map", anchor_node_id = "goal:engine",
                            integration_policy = "explicit",
                        },
                    }),
                }))

                local clear_err = ops.exec(db, [[
                    UPDATE chestor_journal_graphs
                       SET parent_graph_id = NULL, anchor_graph_id = NULL, anchor_node_id = NULL
                     WHERE journal_id = ? AND graph_id = ?
                ]], { journal_id, "research:proofs" })
                test.is_nil(clear_err)
                local db_type, type_err = db:type()
                test.is_nil(type_err)
                test.is_nil(hierarchy_backfill.up(db, db_type))

                local child, child_err = reader.graph(db, journal_id, "research:proofs")
                test.is_nil(child_err)
                test.eq(child.kind, "research-paper-space")
                test.eq(child.parent_graph_id, "program")
                test.eq(child.anchor.graph_id, "map")
                test.eq(child.anchor.node_id, "goal:engine")

                local path, path_err = reader.graph_path(db, journal_id, "research:proofs", {})
                test.is_nil(path_err)
                test.eq(#path.path, 2)
                test.eq(path.path[1].id, "program")
                test.eq(path.path[2].id, "research:proofs")

                test.is_nil(project(db, journal_id, {
                    event(4, types.EVENT.GRAPH_CONFIG_REQUESTED, {
                        request_id = "cfg-cycle", graph_id = "program", title = "Program",
                        kind = "domain-anything", expected_config_revision = 1,
                        workspace = { parent_graph_id = "research:proofs" },
                    }),
                }))
                local parent, parent_err = reader.graph(db, journal_id, "program")
                test.is_nil(parent_err)
                test.eq(parent.config_revision, 1)
                test.is_nil(parent.parent_graph_id)
            end)
        end)

        test.it("partitions semantic node recall by graph and preserves temporal entities", function()
            local journal_id = "journal-generic-node-embeddings"
            local left_graph = "research:left"
            local right_graph = "research:right"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(1, types.EVENT.GRAPH_CONFIG_REQUESTED, {
                        request_id = "cfg-left", graph_id = left_graph,
                        title = "Left research", kind = "research",
                    }),
                    event(2, types.EVENT.GRAPH_CONFIG_REQUESTED, {
                        request_id = "cfg-right", graph_id = right_graph,
                        title = "Right research", kind = "research",
                    }),
                    event(3, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "left-nodes", graph_id = left_graph,
                        origin = "external_agent", operations = {
                            { op = "node.add", id = "paper:a", label = "Causal architecture", kind = "paper", summary = "Proof ownership." },
                            { op = "node.add", id = "claim:a", label = "Ownership claim", kind = "claim" },
                            { op = "edge.add", id = "paper-supports-claim", from = "paper:a", to = "claim:a", kind = "supports" },
                        },
                    }),
                    event(4, types.EVENT.GRAPH_OPS_REQUESTED, {
                        request_id = "right-nodes", graph_id = right_graph,
                        origin = "external_agent", operations = {
                            { op = "node.add", id = "paper:a", label = "Unrelated interface", kind = "paper", summary = "Rendering." },
                        },
                    }),
                }))

                local causal, visual = {}, {}
                for index = 1, types.EMBEDDING_DIMENSIONS do
                    causal[index] = index == 1 and 1 or 0
                    visual[index] = index == 2 and 1 or 0
                end
                test.is_nil(embeddings.upsert(db, journal_id, {
                    source_type = "node", source_id = "paper:a", graph_id = left_graph,
                    node_id = "paper:a", id = "paper:a", seq = 2,
                    event_type = "paper", title = "Causal architecture",
                    body = "Proof ownership.", metadata = {},
                }, causal, "node-test", types.EMBEDDING_DIMENSIONS, "v1"))
                test.is_nil(embeddings.upsert(db, journal_id, {
                    source_type = "node", source_id = "paper:a", graph_id = left_graph,
                    node_id = "paper:a", id = "paper:a", seq = 2, chunk_index = 1,
                    content = "A second long-document chunk about proof ownership.",
                    event_type = "paper", title = "Causal architecture", metadata = {},
                }, causal, "node-test", types.EMBEDDING_DIMENSIONS, "v1"))
                test.is_nil(embeddings.upsert(db, journal_id, {
                    source_type = "node", source_id = "paper:a", graph_id = right_graph,
                    node_id = "paper:a", id = "paper:a", seq = 1,
                    event_type = "paper", title = "Unrelated interface",
                    body = "Rendering.", metadata = {},
                }, visual, "node-test", types.EMBEDDING_DIMENSIONS, "v1"))

                test.is_nil(embeddings.upsert(db, journal_id, {
                    source_type = "node", source_id = "claim:a", graph_id = left_graph,
                    node_id = "claim:a", id = "claim:a", seq = 3,
                    event_type = "claim", title = "Ownership claim", metadata = {},
                }, visual, "node-test", types.EMBEDDING_DIMENSIONS, "v1"))
                local matches, match_err = embeddings.search_nodes(db, journal_id,
                    left_graph, causal, 10, "node-test", "v1", {})
                test.is_nil(match_err)
                test.eq(#matches, 2)
                test.eq(matches[1].label, "Causal architecture")
                local after, after_err = embeddings.search_nodes(db, journal_id,
                    left_graph, causal, 1, "node-test", "v1", { offset = 1 })
                test.is_nil(after_err)
                test.eq(#after, 1)
                test.eq(after[1].id, "claim:a", "semantic node offset must continue past the earlier node")
                local wrong_kind, wrong_kind_err = embeddings.search_nodes(db, journal_id,
                    left_graph, causal, 10, "node-test", "v1", { node_kind = "decision" })
                test.is_nil(wrong_kind_err)
                test.eq(#wrong_kind, 0, "semantic node recall ignored node_kind")
                local wrong_status, wrong_status_err = embeddings.search_nodes(db, journal_id,
                    left_graph, causal, 10, "node-test", "v1", { status = "active" })
                test.is_nil(wrong_status_err)
                test.eq(#wrong_status, 0, "semantic node recall ignored status")
                local documents, documents_err = ops.query(db, [[
                    SELECT COUNT(*) AS n FROM chestor_journal_embedding_documents
                     WHERE journal_id = ? AND graph_id = ? AND node_id = ?
                       AND model = ? AND model_version = ?
                ]], { journal_id, left_graph, "paper:a", "node-test", "v1" })
                test.is_nil(documents_err)
                test.eq(tonumber(documents[1].n), 2)

                local timeline, timeline_err = reader.timeline(db, journal_id,
                    left_graph, { from_time = 1, limit = 20 })
                test.is_nil(timeline_err)
                local kinds: any = {}
                for _, item in ipairs(timeline.items or {}) do kinds[tostring(item.entity_type)] = true end
                test.is_true(kinds.node)
                test.is_true(kinds.edge)
            end)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

local test = require("test")
local funcs = require("funcs")
local sql = require("sql")
local graph = require("graph")
local materializer = require("materializer")
local types = require("types")

local WORKER = "chestor.graph:projection_worker"

local function postgres_spy(): (any, any)
    local calls: any = { queries = {}, executions = {} }
    local db: any = {}
    db["type"] = function(): (string, nil) return "postgres", nil end
    db.query = function(_: any, statement: string, params: any): (any, nil)
        calls.queries[#calls.queries + 1] = { statement = statement, params = params }
        return {}, nil
    end
    db.execute = function(_: any, statement: string, params: any): (any, nil)
        calls.executions[#calls.executions + 1] = { statement = statement, params = params }
        return {}, nil
    end
    return db, calls
end

local function ev(etype: string, body: any): any
    return { type = etype, body = body }
end

local function fold(graph_id: string, events: any, to_seq: any): (any?, string?)
    return funcs.call(WORKER, { thread_id = graph_id, projection = { body = {} }, events = events, range = { to_seq = to_seq } })
end

local function raw(graph_id: string): any
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    test.not_nil(db)
    local handle = db :: any
    local state, serr = materializer.raw_state(handle, graph_id)
    handle:release()
    test.is_nil(serr)
    return state
end

local function define_tests()
    test.describe("Graph Projection Worker", function()
        test.it("binds PostgreSQL parameters at the materializer boundary", function()
            local db, calls = postgres_spy()
            local rows, err = materializer.list_nodes(db, "graph", {
                id = "node",
                type = "service",
                search = "worker",
                limit = 25,
            })
            test.is_nil(err)
            test.eq(#rows, 0)
            test.eq(#calls.queries, 1)
            local statement = calls.queries[1].statement
            test.is_nil(statement:find("?", 1, true))
            test.contains(statement, "graph_id = $1")
            test.contains(statement, "id = $2")
            test.contains(statement, "type = $3")
            test.contains(statement, "name LIKE $4 OR description LIKE $5 OR tags LIKE $6")
            test.contains(statement, "LIMIT $7")

            test.is_nil(materializer.delete_graph_rows(db, "graph"))
            test.eq(#calls.executions, 7)
            test.contains(calls.executions[1].statement, "graph_id = $1")
        end)

        test.it("projects type catalogs, nested nodes, an edge, material, and layout into normalized tables", function()
            local graph_id = "projection-full"
            local out = fold(graph_id, {
                ev(graph.EVENT.NODE_TYPE_REGISTERED, { id = "system", title = "System", icon = "tabler:box", color = "#22c55e" }),
                ev(graph.EVENT.EDGE_TYPE_REGISTERED, { id = "depends_on", title = "Depends on", stroke = "#64748b" }),
                ev(graph.EVENT.MATERIAL_TYPE_REGISTERED, { id = "upload", title = "Upload", targets = { "node", "edge" }, display = "panel" }),
                ev(graph.EVENT.NODE_ADDED, { id = "n1", type = "system", name = "Platform" }),
                ev(graph.EVENT.NODE_ADDED, { id = "n2", type = "system", name = "Worker", parent_id = "n1" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e1", type = "depends_on", source_id = "n2", target_id = "n1" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m1", target_type = "node", target_id = "n2", kind = "upload", title = "Spec", source = { type = "upload", upload_id = "u1" } }),
                ev(graph.EVENT.LAYOUT_POSITION_SET, { node_id = "n1", x = 10, y = 20, width = 320, height = 220, pinned = true }),
                ev(graph.EVENT.LAYOUT_VIEWPORT_SET, { root_id = "n1", x = 1, y = 2, zoom = 0.8 }),
            }, 9)

            test.eq((out :: any).last_seq, 9)
            test.eq((out :: any).body.materialized, "chestor_graph_tables")
            test.is_nil((out :: any).body.nodes)

            local built = graph.build(raw(graph_id))
            test.eq(#(built :: any).schema.node_types, 1)
            test.eq(#(built :: any).schema.edge_types, 1)
            test.eq(#(built :: any).schema.material_types, 1)
            test.eq(#(built :: any).nodes, 1)
            test.eq((built :: any).nodes[1].name, "Platform")
            test.eq((built :: any).nodes[1].child_count, 1)
            test.eq((built :: any).nodes[1].children[1].name, "Worker")
            test.eq(#(built :: any).nodes[1].children[1].materials, 1)
            test.eq(#(built :: any).edges, 1)
            test.eq((built :: any).layout.positions.n1.x, 10)
            test.eq((built :: any).layout.viewport.root_id, "n1")
        end)

        test.it("node.removed cascades descendants, connected edges, materials, and layout in tables", function()
            local graph_id = "projection-cascade"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "root", type = "scope", name = "Root" }),
                ev(graph.EVENT.NODE_ADDED, { id = "child", type = "scope", name = "Child", parent_id = "root" }),
                ev(graph.EVENT.NODE_ADDED, { id = "peer", type = "scope", name = "Peer" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e1", type = "rel", source_id = "child", target_id = "peer" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "mn", target_type = "node", target_id = "child", kind = "note" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "me", target_type = "edge", target_id = "e1", kind = "note" }),
                ev(graph.EVENT.LAYOUT_POSITION_SET, { node_id = "child", x = 1, y = 2 }),
            }, 7)

            fold(graph_id, { ev(graph.EVENT.NODE_REMOVED, { id = "root" }) }, 8)
            local state: any = raw(graph_id)
            test.is_nil(state.nodes.root)
            test.is_nil(state.nodes.child)
            test.not_nil(state.nodes.peer)
            test.is_nil(state.edges.e1)
            test.is_nil(state.materials.mn)
            test.is_nil(state.materials.me)
            test.is_nil(state.layout.child)
        end)

        test.it("node.removed keeps graph-level materials", function()
            local graph_id = "projection-remove-keeps-graph-material"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "root", type = "scope", name = "Root" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "graph-note", target_type = "graph", kind = "note", title = "Overview" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "node-note", target_type = "node", target_id = "root", kind = "note", title = "Node note" }),
            }, 3)
            fold(graph_id, { ev(graph.EVENT.NODE_REMOVED, { id = "root" }) }, 4)
            local state: any = raw(graph_id)
            test.not_nil(state.materials["graph-note"])
            test.is_nil(state.materials["node-note"])
            test.eq((graph.build(state) :: any).materials[1].id, "graph-note")
        end)

        test.it("node.updated reparents a node and keeps child order coherent", function()
            local graph_id = "projection-node-reparent"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "p1", type = "scope", name = "Parent 1" }),
                ev(graph.EVENT.NODE_ADDED, { id = "p2", type = "scope", name = "Parent 2" }),
                ev(graph.EVENT.NODE_ADDED, { id = "child", type = "scope", name = "Child", parent_id = "p1" }),
            }, 3)
            fold(graph_id, {
                ev(graph.EVENT.NODE_UPDATED, { id = "child", parent_id = "p2", name = "Moved child" }),
            }, 4)

            local state: any = raw(graph_id)
            test.eq(state.nodes.child.name, "Moved child")
            test.eq(state.nodes.child.parent_id, "p2")
            test.eq(#(state.child_order.p1 or {}), 0)
            test.eq((state.child_order.p2 or {})[1], "child")
        end)

        test.it("node.updated with false parent reroots the node", function()
            local graph_id = "projection-node-reroot"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "p", type = "scope", name = "Parent" }),
                ev(graph.EVENT.NODE_ADDED, { id = "child", type = "scope", name = "Child", parent_id = "p" }),
                ev(graph.EVENT.NODE_UPDATED, { id = "child", parent_id = false }),
            }, 3)
            local state: any = raw(graph_id)
            test.is_nil(state.nodes.child.parent_id)
            test.eq(#(state.child_order.p or {}), 0)
            local roots = state.child_order[""] or {}
            local saw_child = false
            local saw_parent = false
            for _, id in ipairs(roots) do
                if id == "child" then saw_child = true end
                if id == "p" then saw_parent = true end
            end
            test.is_true(saw_child)
            test.is_true(saw_parent)
        end)

        test.it("edge.updated changes endpoints and edge.removed removes edge materials", function()
            local graph_id = "projection-edge-mutate"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                ev(graph.EVENT.NODE_ADDED, { id = "c", type = "service", name = "C" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "b", label = "old" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "edge", target_id = "e", kind = "note" }),
            }, 5)
            fold(graph_id, {
                ev(graph.EVENT.EDGE_UPDATED, { id = "e", target_id = "c", label = "new" }),
            }, 6)
            local state: any = raw(graph_id)
            test.eq(state.edges.e.target_id, "c")
            test.eq(state.edges.e.label, "new")
            test.not_nil(state.materials.m)

            fold(graph_id, { ev(graph.EVENT.EDGE_REMOVED, { id = "e" }) }, 7)
            state = raw(graph_id)
            test.is_nil(state.edges.e)
            test.is_nil(state.materials.m)
        end)

        test.it("material.updated retargets material order and material.detached removes it", function()
            local graph_id = "projection-material-mutate"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "node", target_id = "a", kind = "upload", title = "Old", source = { type = "upload", upload_id = "u1" } }),
            }, 3)
            fold(graph_id, {
                ev(graph.EVENT.MATERIAL_UPDATED, { id = "m", target_type = "node", target_id = "b", title = "New", source = { type = "component", component_id = "c1" } }),
            }, 4)
            local state: any = raw(graph_id)
            test.eq(state.materials.m.target_id, "b")
            test.eq(state.materials.m.title, "New")
            test.eq(state.materials.m.source.component_id, "c1")
            test.eq(#(state.material_order["node:a"] or {}), 0)
            test.eq((state.material_order["node:b"] or {})[1], "m")

            fold(graph_id, { ev(graph.EVENT.MATERIAL_DETACHED, { id = "m" }) }, 5)
            state = raw(graph_id)
            test.is_nil(state.materials.m)
            test.eq(#(state.material_order["node:b"] or {}), 0)
        end)

        test.it("material.updated retargets a node material to the graph without stale target state", function()
            local graph_id = "projection-material-graph-retarget"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "node", target_id = "a", kind = "note", title = "Node note" }),
                ev(graph.EVENT.MATERIAL_UPDATED, { id = "m", target_type = "graph", title = "Graph note" }),
            }, 3)

            local state: any = raw(graph_id)
            test.eq(state.materials.m.target_type, "graph")
            test.is_nil(state.materials.m.target_id)
            test.eq((state.material_order["graph:"] or {})[1], "m")
            test.eq(#(state.material_order["node:a"] or {}), 0)
        end)

        test.it("layout clear removes a node position and viewport updates replace the stored viewport", function()
            local graph_id = "projection-layout-mutate"
            fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "n", type = "scope", name = "N" }),
                ev(graph.EVENT.LAYOUT_POSITION_SET, { node_id = "n", x = 10, y = 20, width = 300, pinned = true }),
                ev(graph.EVENT.LAYOUT_VIEWPORT_SET, { root_id = "n", x = 1, y = 2, zoom = 0.5 }),
                ev(graph.EVENT.LAYOUT_VIEWPORT_SET, { root_id = "n", x = 3, y = 4, zoom = 1.25 }),
            }, 4)
            local state: any = raw(graph_id)
            test.eq(state.layout.n.x, 10)
            test.eq(state.viewport.x, 3)
            test.eq(state.viewport.zoom, 1.25)

            fold(graph_id, { ev(graph.EVENT.LAYOUT_POSITION_CLEARED, { node_id = "n" }) }, 5)
            state = raw(graph_id)
            test.is_nil(state.layout.n)
        end)

        test.it("settings updates merge patches without dropping existing keys", function()
            local graph_id = "projection-settings-merge"
            fold(graph_id, {
                ev(graph.EVENT.GRAPH_SETTINGS_UPDATED, { settings = { default_view = "map", child_render_mode = "expanded" } }),
                ev(graph.EVENT.GRAPH_SETTINGS_UPDATED, { settings = { default_view = "tree" } }),
            }, 2)
            local state: any = raw(graph_id)
            test.eq(state.settings.default_view, "tree")
            test.eq(state.settings.child_render_mode, "expanded")
        end)

        test.it("projection metadata counts reflect normalized rows after each batch", function()
            local graph_id = "projection-counts"
            local out = fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "b" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "edge", target_id = "e", kind = "note" }),
            }, 4)
            test.eq((out :: any).body.counts.nodes, 2)
            test.eq((out :: any).body.counts.edges, 1)
            test.eq((out :: any).body.counts.materials, 1)
            test.eq((out :: any).body.last_seq, 4)
        end)

        test.it("type catalog updates and removals are projected", function()
            local graph_id = "projection-types"
            fold(graph_id, {
                ev(graph.EVENT.NODE_TYPE_REGISTERED, { id = "idea", title = "Idea", color = "#000" }),
                ev(graph.EVENT.NODE_TYPE_UPDATED, { id = "idea", title = "Idea", color = "#fff" }),
                ev(graph.EVENT.EDGE_TYPE_REGISTERED, { id = "supports", title = "Supports" }),
                ev(graph.EVENT.MATERIAL_TYPE_REGISTERED, { id = "doc", title = "Document" }),
            }, 4)
            test.eq((raw(graph_id) :: any).node_types.idea.color, "#fff")

            fold(graph_id, {
                ev(graph.EVENT.NODE_TYPE_REMOVED, { id = "idea" }),
                ev(graph.EVENT.EDGE_TYPE_REMOVED, { id = "supports" }),
                ev(graph.EVENT.MATERIAL_TYPE_REMOVED, { id = "doc" }),
            }, 7)
            local state: any = raw(graph_id)
            test.is_nil(state.node_types.idea)
            test.is_nil(state.edge_types.supports)
            test.is_nil(state.material_types.doc)
        end)

        test.it("pages the type catalog with a cursor and reports every row exactly once", function()
            local graph_id = "projection-type-pages"
            local events = {}
            for index = 1, 201 do
                events[#events + 1] = ev(graph.EVENT.NODE_TYPE_REGISTERED, {
                    id = "type-" .. tostring(index), title = "Type " .. tostring(index),
                })
            end
            fold(graph_id, events, 201)
            local db, err = sql.get(types.db_id())
            test.is_nil(err)
            local seen, count, cursor, pages = {}, 0, nil, 0
            repeat
                local page, list_err, next_cursor = materializer.list_types(db, graph_id, { kind = "node", limit = 50, cursor = cursor })
                test.is_nil(list_err)
                test.is_true(#page <= 50)
                for _, row in ipairs(page) do
                    test.is_nil(seen[row.id])
                    seen[row.id] = true
                    count = count + 1
                end
                cursor = next_cursor
                pages = pages + 1
            until cursor == nil
            local default_page, default_err, default_next = materializer.list_types(db, graph_id, { kind = "node" })
            local _, bad_err = materializer.list_types(db, graph_id, { kind = "node", cursor = "garbage" })
            db:release()
            test.eq(count, 201)
            test.eq(pages, 5)
            test.is_nil(default_err)
            test.eq(#default_page, 200)
            test.not_nil(default_next)
            test.not_nil(bad_err)
        end)

        test.it("pages nodes, edges and materials with a cursor and reports every row exactly once", function()
            local graph_id = "projection-list-pages"
            local events = {}
            for index = 1, 7 do
                events[#events + 1] = ev(graph.EVENT.NODE_ADDED, { id = "n" .. index, type = "system", name = "Node " .. index })
            end
            for index = 1, 7 do
                events[#events + 1] = ev(graph.EVENT.EDGE_ADDED, { id = "e" .. index, type = "rel", source_id = "n1", target_id = "n2" })
                events[#events + 1] = ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m" .. index, target_type = "node", target_id = "n1", kind = "note" })
            end
            fold(graph_id, events, #events)
            local db, err = sql.get(types.db_id())
            test.is_nil(err)
            for _, reader in ipairs({ materializer.list_nodes, materializer.list_edges, materializer.list_materials }) do
                local seen, count, cursor, pages = {}, 0, nil, 0
                repeat
                    local page, list_err, next_cursor = reader(db, graph_id, { limit = 3, cursor = cursor })
                    test.is_nil(list_err)
                    test.is_true(#page <= 3)
                    for _, row in ipairs(page) do
                        test.is_nil(seen[row.id])
                        seen[row.id] = true
                        count = count + 1
                    end
                    cursor = next_cursor
                    pages = pages + 1
                until cursor == nil
                test.eq(count, 7)
                test.eq(pages, 3)
                local _, bad_err = reader(db, graph_id, { cursor = "garbage" })
                test.not_nil(bad_err)
            end
            db:release()
        end)

        test.it("graph.settings-updated patches settings", function()
            local graph_id = "projection-settings"
            fold(graph_id, {
                ev(graph.EVENT.GRAPH_SETTINGS_UPDATED, { settings = { child_render_mode = "expanded", default_view = "tree" } }),
            }, 1)
            local state: any = raw(graph_id)
            test.eq(state.settings.child_render_mode, "expanded")
            test.eq(state.settings.default_view, "tree")
        end)

        test.it("rejects an unknown event type instead of silently skipping it", function()
            local out, err = fold("projection-unknown", { ev("chestor.graph.events:unknown.event", { id = "x" }) }, 12)
            test.is_nil(out)
            test.contains(tostring(err), "unknown graph event type")
            test.eq(#(graph.build(raw("projection-unknown")) :: any).nodes, 0)
        end)

        test.it("projects JSON string event bodies into normalized tables", function()
            local graph_id = "projection-string-body"
            local out = fold(graph_id, {
                ev(graph.EVENT.NODE_ADDED, "{\"id\":\"n\",\"type\":\"scope\",\"name\":\"String body\"}"),
                ev(graph.EVENT.LAYOUT_POSITION_SET, "{\"node_id\":\"n\",\"x\":42,\"y\":24}"),
            }, 2)
            test.eq((out :: any).last_seq, 2)
            local state: any = raw(graph_id)
            test.eq(state.nodes.n.name, "String body")
            test.eq(state.layout.n.x, 42)
        end)

        test.it("requires a thread id instead of silently writing nowhere", function()
            local out, err = funcs.call(WORKER, { events = {}, range = {} })
            test.is_nil(out)
            test.contains(tostring(err), "thread_id")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

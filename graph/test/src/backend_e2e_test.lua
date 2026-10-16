local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")
local contract = require("contract")
local sql = require("sql")
local json = require("json")
local time = require("time")

local PROBE = "app:graph_probe"
local READ = "chestor.graph.binding:read"
local COMPONENT_SERVICE = "kickside.component:component_service"
local GRAPH_KIND = "chestor.graph:graph_kind"
local THREADS = "kickside.core:threads"
local THREAD_CLASS = "workspace.graph"
local GET_TOOL = "chestor.graph.traits:get_graph_tool"
local APPLY_TOOL = "chestor.graph.traits:apply_graph_tool"

local EVENT = {
    NODE_ADDED = "chestor.graph.events:node.added",
    NODE_UPDATED = "chestor.graph.events:node.updated",
    NODE_REMOVED = "chestor.graph.events:node.removed",
    EDGE_ADDED = "chestor.graph.events:edge.added",
    EDGE_UPDATED = "chestor.graph.events:edge.updated",
    EDGE_REMOVED = "chestor.graph.events:edge.removed",
    MATERIAL_ATTACHED = "chestor.graph.events:material.attached",
    MATERIAL_UPDATED = "chestor.graph.events:material.updated",
    MATERIAL_DETACHED = "chestor.graph.events:material.detached",
    NODE_TYPE_REGISTERED = "chestor.graph.events:node-type.registered",
    NODE_TYPE_UPDATED = "chestor.graph.events:node-type.updated",
    NODE_TYPE_REMOVED = "chestor.graph.events:node-type.removed",
    EDGE_TYPE_REGISTERED = "chestor.graph.events:edge-type.registered",
    EDGE_TYPE_REMOVED = "chestor.graph.events:edge-type.removed",
    MATERIAL_TYPE_REGISTERED = "chestor.graph.events:material-type.registered",
    MATERIAL_TYPE_REMOVED = "chestor.graph.events:material-type.removed",
    LAYOUT_POSITION_SET = "chestor.graph.events:layout.position-set",
    LAYOUT_POSITION_CLEARED = "chestor.graph.events:layout.position-cleared",
    LAYOUT_VIEWPORT_SET = "chestor.graph.events:layout.viewport-set",
    GRAPH_SETTINGS_UPDATED = "chestor.graph.events:graph.settings-updated",
}

local function uuid(): string
    local id, err = crypto.random.uuid()
    test.is_nil(err)
    return id
end

local function executor(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "graph_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local function executor_with_groups(user_id: string, groups: { string }): any
    local actor: any = security.new_actor(user_id, { security_groups = groups })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local threads

local function graph_component(user_id: string, title: string, parent_id: string?): string
    local inst = threads(user_id)
    local reg, rerr = inst:create({
        impl_id = GRAPH_KIND,
        thread_class = THREAD_CLASS,
        title = title,
        parent_id = parent_id,
    })
    test.is_nil(rerr)
    test.not_nil(reg)
    test.not_nil((reg :: any).component_id or (reg :: any).thread_id)
    return tostring((reg :: any).component_id or (reg :: any).thread_id)
end

local function list_children(user_id: string, parent_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "graph_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    local svc, cerr = contract.get(COMPONENT_SERVICE)
    test.is_nil(cerr)
    test.not_nil(svc)
    local inst, oerr = svc:with_actor(actor):with_scope(scope):open()
    test.is_nil(oerr)
    test.not_nil(inst)
    local res = inst:list_children({ parent_id = parent_id })
    test.not_nil(res)
    test.is_true(res.success, tostring(res.error))
    return res.components or {}
end

local function settle_projection(user_id: string, thread_id: string)
    local detail = "projection cursor is absent"
    for _ = 1, 500 do
        local listed, err = threads(user_id):list_projections({ thread_id = thread_id })
        test.is_nil(err)
        test.not_nil(listed)
        local target = tonumber((listed :: any).event_count) or 0
        for _, cursor in ipairs((listed :: any).cursors or {}) do
            if tostring(cursor.kind) == "chestor.graph:state" then
                local status = tostring(cursor.status or "")
                detail = status .. ": " .. tostring(cursor.last_error or "")
                test.is_false(status == "invalid" or status == "paused", detail)
                if (tonumber(cursor.last_seq) or 0) >= target then return end
            end
        end
        time.sleep("20ms")
    end
    test.is_true(false, "graph projection does not reach the thread head: " .. detail)
end

local function call_probe(user_id: string, op: string, input: any): any
    -- Production reads serve the latest committed projection and never drive its
    -- cursor. Tests that assert normalized read-model contents advance the async
    -- worker explicitly at the harness boundary first.
    local materialized_read = op == "nodes" or op == "edges" or op == "materials" or op == "schema"
    if materialized_read and type(input) == "table" and tostring((input :: any).entry_id or "") ~= "" then
        local caught, catch_err = threads(user_id):catch_up_projection({
            thread_id = tostring((input :: any).entry_id),
            kind = "chestor.graph:state",
            max_ticks = 1000,
        })
        test.is_nil(catch_err)
        test.not_nil(caught)
    end
    local result, err = executor(user_id):call(PROBE, { op = op, input = input })
    test.is_nil(err)
    test.not_nil(result)
    if (op == "apply" or op == "undo" or op == "redo") and result.ok then
        settle_projection(user_id, tostring(result.graph.thread_id))
    end
    return result
end

local function call_read(user_id: string, entry_id: string, name: string): any
    local result, err = executor(user_id):call(READ, { entry = { id = entry_id, name = name } })
    test.is_nil(err)
    test.not_nil(result)
    return result
end

function threads(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "graph_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    local svc, cerr = contract.get(THREADS)
    test.is_nil(cerr)
    test.not_nil(svc)
    local inst, oerr = svc:with_actor(actor):with_scope(scope):open()
    test.is_nil(oerr)
    test.not_nil(inst)
    return inst
end

local function command(etype: string, body: any): any
    return { type = etype, body = body }
end

local function app_db(): any
    local db, err = sql.get("app:db")
    test.is_nil(err)
    test.not_nil(db)
    return db
end

local function statement_for(db: any, statement: string): string
    local db_type, err = db:type()
    test.is_nil(err)
    if tostring(db_type) ~= "postgres" then return statement end
    local position = 0
    return (statement:gsub("%?", function(): string
        position = position + 1
        return "$" .. tostring(position)
    end))
end

local function count_rows(table_name: string, graph_id: string): number
    local db = app_db()
    local rows, err = db:query(statement_for(db, "SELECT COUNT(*) AS count FROM " .. table_name .. " WHERE graph_id = ?"), { graph_id })
    db:release()
    test.is_nil(err)
    return tonumber(rows and rows[1] and rows[1].count) or 0
end

local function material_row(graph_id: string, material_id: string): any
    local db = app_db()
    local rows, err = db:query(statement_for(db, "SELECT * FROM chestor_graph_materials WHERE graph_id = ? AND id = ?"), { graph_id, material_id })
    db:release()
    test.is_nil(err)
    test.eq(#(rows or {}), 1)
    return (rows :: { any })[1]
end

local function count_history(graph_id: string, stack: string): number
    local db = app_db()
    local rows, err = db:query(statement_for(db, "SELECT COUNT(*) AS count FROM chestor_graph_history WHERE graph_id = ? AND stack = ?"), { graph_id, stack })
    db:release()
    test.is_nil(err)
    return tonumber(rows and rows[1] and rows[1].count) or 0
end

local function exec_db(query_text: string, params: any)
    local db = app_db()
    local _, err = db:execute(statement_for(db, query_text), params or {})
    db:release()
    test.is_nil(err)
end

local function find_node(nodes: any, id: string): any
    for _, node in ipairs(type(nodes) == "table" and nodes or {}) do
        if tostring((node :: any).id or "") == id then return node end
        local found = find_node((node :: any).children, id)
        if found then return found end
    end
    return nil
end

local function projection_body(user_id: string, thread_id: string): any
    local c = threads(user_id)
    local listed, err = c:list_projections({ thread_id = thread_id, limit = 50 })
    test.is_nil(err)
    for _, p in ipairs((listed and listed.projections) or {}) do
        if tostring((p :: any).kind) == "chestor.graph:state" then
            local body = (p :: any).body
            if type(body) == "string" then body = json.decode(body :: string) end
            return body
        end
    end
    return nil
end

local function define_tests()
    test.describe("Graph backend E2E", function()
        test.it("appends through the real thread contract, catches up the projection, and reads the graph", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Architecture Graph", nil)
            local commands = {
                command(EVENT.NODE_ADDED, { id = "root", type = "concept", name = "System", description = string.rep("Architecture boundary. ", 40) }),
                command(EVENT.NODE_ADDED, { id = "child", type = "concept", name = "Worker", parent_id = "root" }),
                command(EVENT.EDGE_ADDED, { id = "edge1", type = "depends_on", source_id = "child", target_id = "root", label = "uses" }),
                command(EVENT.MATERIAL_ATTACHED, { id = "mat1", target_type = "node", target_id = "child", kind = "upload", title = "Worker spec", source = { type = "upload", upload_id = "up1" } }),
                command(EVENT.MATERIAL_ATTACHED, { id = "mat2", target_type = "edge", target_id = "edge1", kind = "note", title = "Reason" }),
                command(EVENT.LAYOUT_POSITION_SET, { node_id = "root", x = 40, y = 80, width = 320, height = 200 }),
            }

            local applied = call_probe(user_id, "apply", { entry_id = entry_id, commands = commands })
            test.is_true(applied.ok, tostring(applied.err))
            test.not_nil(applied.graph.thread_id)
            test.eq((applied.graph.counts :: any).nodes, 2)
            test.eq((applied.graph.counts :: any).edges, 1)
            test.eq((applied.graph.counts :: any).materials, 2)

            local events = call_probe(user_id, "list_events", { thread_id = applied.graph.thread_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, #commands)
            test.eq(events.result.events[1].type, EVENT.NODE_ADDED)
            test.eq(events.result.events[#events.result.events].type, EVENT.LAYOUT_POSITION_SET)

            local caught = call_probe(user_id, "catch_up", { thread_id = applied.graph.thread_id })
            test.is_true(caught.ok, tostring(caught.err))
            test.eq(tonumber(caught.result.event_count), #commands)

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq(state.graph.thread_id, applied.graph.thread_id)
            test.eq(state.graph.nodes[1].name, "System")
            test.eq(state.graph.nodes[1].children[1].name, "Worker")
            test.eq(#state.graph.nodes[1].children[1].materials, 1)
            test.eq(state.graph.edges[1].label, "uses")
            test.eq(#state.graph.edges[1].materials, 1)
            test.eq(state.graph.layout.positions.root.x, 40)
            local read, read_err = executor(user_id):call(GET_TOOL, { entry_id = entry_id })
            test.is_nil(read_err)
            test.is_true((read :: any).success, tostring((read :: any).error))
            local read_graph = (read :: any).graph
            test.eq(#read_graph.nodes, 1)
            test.eq(read_graph.nodes[1].id, "root")
            test.eq(read_graph.nodes[1].description, string.rep("Architecture boundary. ", 40))
            test.eq(#read_graph.edges, 1)
            test.eq(read_graph.edges[1].label, "uses")
            test.eq(read_graph.layout.positions.root.x, 40)
            local thread_id = tostring(applied.graph.thread_id)
            test.eq(count_rows("chestor_graph_nodes", thread_id), 2)
            test.eq(count_rows("chestor_graph_edges", thread_id), 1)
            test.eq(count_rows("chestor_graph_materials", thread_id), 2)
            local mat = material_row(thread_id, "mat1")
            test.eq(mat.source_type, "upload")
            test.eq(mat.source_upload_id, "up1")
            local body = projection_body(user_id, thread_id)
            test.eq(body.materialized, "chestor_graph_tables")
            test.is_nil(body.nodes)
            test.is_nil(body.edges)

            local rendered = call_read(user_id, entry_id, "Architecture Graph")
            test.is_true(rendered.success, tostring(rendered.error))
            test.contains(rendered.text, "# Architecture Graph")
            test.contains(rendered.text, "- System [concept]")
            test.contains(rendered.text, "material: Worker spec (upload)")
            test.contains(rendered.text, "child -> root [depends_on]")

            local denied, denied_err = executor_with_groups("graph-denied-" .. uuid(), {})
                :call(READ, { entry = { id = entry_id, name = "Architecture Graph" } })
            test.is_nil(denied)
            test.is_true(errors.is(denied_err, errors.NOT_FOUND))
        end)

        test.it("returns the applied graph read model from the ApplyGraph tool", function()
            local user_id = "graph-tool-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Agent Graph", nil)
            local mutated, mutate_err = executor(user_id):call(APPLY_TOOL, {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "intake", type = "concept", name = "Intake" }),
                    command(EVENT.NODE_ADDED, { id = "handoff", type = "concept", name = "Agent handoff" }),
                    command(EVENT.EDGE_ADDED, { id = "route", type = "depends_on", source_id = "handoff", target_id = "intake" }),
                },
            })
            test.is_nil(mutate_err)
            test.is_true((mutated :: any).success, tostring((mutated :: any).error))
            local names = {}
            for _, node in ipairs((mutated :: any).graph.nodes) do names[tostring(node.id)] = node.name end
            test.eq(names.handoff, "Agent handoff")
            test.eq(names.intake, "Intake")
            test.eq(#(mutated :: any).graph.edges, 1)
            test.eq((mutated :: any).graph.edges[1].id, "route")
        end)

        test.it("keeps a large graph in normalized tables instead of projection JSON", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Large Graph", nil)
            local commands = {}
            for i = 1, 250 do
                commands[#commands + 1] = command(EVENT.NODE_ADDED, {
                    id = "n" .. tostring(i),
                    type = "concept",
                    name = "Node " .. tostring(i),
                    sort_order = i,
                })
            end

            local applied = call_probe(user_id, "apply", { entry_id = entry_id, commands = commands })
            test.is_true(applied.ok, tostring(applied.err))
            test.eq((applied.graph.counts :: any).nodes, 250)
            local thread_id = tostring(applied.graph.thread_id)
            local caught = call_probe(user_id, "catch_up", { thread_id = thread_id })
            test.is_true(caught.ok, tostring(caught.err))
            test.eq(count_rows("chestor_graph_nodes", thread_id), 250)

            local body = projection_body(user_id, thread_id)
            test.eq(body.materialized, "chestor_graph_tables")
            test.is_nil(body.nodes)
            test.eq(tonumber(body.counts.nodes), 250)
        end)

        test.it("queries graph facts from normalized tables with indexed filters", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Queryable Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_REGISTERED, { id = "service", title = "Service" }),
                    command(EVENT.NODE_ADDED, { id = "root", type = "service", name = "Root" }),
                    command(EVENT.NODE_ADDED, { id = "child", type = "service", name = "Child", parent_id = "root" }),
                    command(EVENT.EDGE_ADDED, { id = "edge1", type = "calls", source_id = "root", target_id = "child" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "mat1", target_type = "node", target_id = "child", kind = "upload", title = "Spec", source = { type = "upload", upload_id = "upload-1" } }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local roots = call_probe(user_id, "nodes", { entry_id = entry_id, options = { roots_only = true } })
            test.is_true(roots.ok, tostring(roots.err))
            test.eq(#roots.result.nodes, 1)
            test.eq(roots.result.nodes[1].id, "root")

            local children = call_probe(user_id, "nodes", { entry_id = entry_id, options = { parent_id = "root" } })
            test.is_true(children.ok, tostring(children.err))
            test.eq(#children.result.nodes, 1)
            test.eq(children.result.nodes[1].id, "child")

            local edges = call_probe(user_id, "edges", { entry_id = entry_id, options = { node_id = "child" } })
            test.is_true(edges.ok, tostring(edges.err))
            test.eq(#edges.result.edges, 1)
            test.eq(edges.result.edges[1].id, "edge1")

            local materials = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_upload_id = "upload-1" } })
            test.is_true(materials.ok, tostring(materials.err))
            test.eq(#materials.result.materials, 1)
            test.eq(materials.result.materials[1].id, "mat1")

            local schema = call_probe(user_id, "schema", { entry_id = entry_id, options = { kind = "node" } })
            test.is_true(schema.ok, tostring(schema.err))
            test.eq(#schema.result.schema, 1)
            test.eq(schema.result.schema[1].id, "service")
        end)

        test.it("queries exact nodes edges materials and schema rows by id", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Exact Query Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_REGISTERED, { id = "service", title = "Service" }),
                    command(EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                    command(EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                    command(EVENT.EDGE_ADDED, { id = "ab", type = "calls", source_id = "a", target_id = "b" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "mat", target_type = "edge", target_id = "ab", kind = "note", title = "Note" }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local node = call_probe(user_id, "nodes", { entry_id = entry_id, options = { id = "b" } })
            test.is_true(node.ok, tostring(node.err))
            test.eq(#node.result.nodes, 1)
            test.eq(node.result.nodes[1].name, "B")

            local edge = call_probe(user_id, "edges", { entry_id = entry_id, options = { id = "ab" } })
            test.is_true(edge.ok, tostring(edge.err))
            test.eq(#edge.result.edges, 1)
            test.eq(edge.result.edges[1].target_id, "b")

            local material = call_probe(user_id, "materials", { entry_id = entry_id, options = { id = "mat" } })
            test.is_true(material.ok, tostring(material.err))
            test.eq(#material.result.materials, 1)
            test.eq(material.result.materials[1].target_id, "ab")

            local schema = call_probe(user_id, "schema", { entry_id = entry_id, options = { kind = "node", id = "service" } })
            test.is_true(schema.ok, tostring(schema.err))
            test.eq(#schema.result.schema, 1)
            test.eq(schema.result.schema[1].title, "Service")
        end)

        test.it("filters normalized nodes by type, search, and limit", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Node Query Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "svc", type = "service", name = "Billing API", description = "Handles invoices", tags = { "money" }, sort_order = 2 }),
                    command(EVENT.NODE_ADDED, { id = "db", type = "database", name = "Ledger DB", description = "Stores invoices", tags = { "money" }, sort_order = 1 }),
                    command(EVENT.NODE_ADDED, { id = "queue", type = "queue", name = "Events", description = "Async work", tags = { "async" }, sort_order = 3 }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local by_type = call_probe(user_id, "nodes", { entry_id = entry_id, options = { type = "database" } })
            test.is_true(by_type.ok, tostring(by_type.err))
            test.eq(#by_type.result.nodes, 1)
            test.eq(by_type.result.nodes[1].id, "db")

            local by_search = call_probe(user_id, "nodes", { entry_id = entry_id, options = { search = "invoice" } })
            test.is_true(by_search.ok, tostring(by_search.err))
            test.eq(#by_search.result.nodes, 2)

            local limited = call_probe(user_id, "nodes", { entry_id = entry_id, options = { limit = 1 } })
            test.is_true(limited.ok, tostring(limited.err))
            test.eq(#limited.result.nodes, 1)
            test.eq(limited.result.nodes[1].id, "db")
        end)

        test.it("filters normalized edges and materials by every external source handle", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Material Query Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                    command(EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                    command(EVENT.EDGE_ADDED, { id = "ab", type = "calls", source_id = "a", target_id = "b" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "upload", target_type = "node", target_id = "a", kind = "upload", title = "Upload", source = { type = "upload", upload_id = "up-1" } }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "component", target_type = "node", target_id = "a", kind = "component", title = "Component", source = { type = "component", component_id = "cmp-1" } }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "url", target_type = "edge", target_id = "ab", kind = "url", title = "URL", source = { type = "url", url = "https://example.test/spec" } }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local by_source = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_component_id = "cmp-1" } })
            test.is_true(by_source.ok, tostring(by_source.err))
            test.eq(#by_source.result.materials, 1)
            test.eq(by_source.result.materials[1].id, "component")

            local by_url = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_url = "https://example.test/spec" } })
            test.is_true(by_url.ok, tostring(by_url.err))
            test.eq(#by_url.result.materials, 1)
            test.eq(by_url.result.materials[1].id, "url")

            local by_target = call_probe(user_id, "materials", { entry_id = entry_id, options = { target_type = "node", target_id = "a" } })
            test.is_true(by_target.ok, tostring(by_target.err))
            test.eq(#by_target.result.materials, 2)

            local outgoing = call_probe(user_id, "edges", { entry_id = entry_id, options = { source_id = "a" } })
            test.is_true(outgoing.ok, tostring(outgoing.err))
            test.eq(#outgoing.result.edges, 1)
            test.eq(outgoing.result.edges[1].id, "ab")
        end)

        test.it("updates material source indexes when source metadata changes", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Material Source Update Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "mat", target_type = "node", target_id = "a", kind = "upload", title = "Spec", source = { type = "upload", upload_id = "up-1" } }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.MATERIAL_UPDATED, { id = "mat", source = { type = "url", url = "https://example.test/spec" } }),
                },
            })
            test.is_true(updated.ok, tostring(updated.err))

            local old = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_upload_id = "up-1" } })
            test.is_true(old.ok, tostring(old.err))
            test.eq(#old.result.materials, 0)

            local fresh = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_url = "https://example.test/spec" } })
            test.is_true(fresh.ok, tostring(fresh.err))
            test.eq(#fresh.result.materials, 1)
            test.eq(fresh.result.materials[1].id, "mat")
            test.eq(fresh.result.materials[1].source_type, "url")
        end)

        test.it("updates edge endpoint indexes when an edge is retargeted", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Edge Retarget Query Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                    command(EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                    command(EVENT.NODE_ADDED, { id = "c", type = "service", name = "C" }),
                    command(EVENT.EDGE_ADDED, { id = "edge", type = "calls", source_id = "a", target_id = "b" }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.EDGE_UPDATED, { id = "edge", target_id = "c" }),
                },
            })
            test.is_true(updated.ok, tostring(updated.err))

            local old = call_probe(user_id, "edges", { entry_id = entry_id, options = { node_id = "b" } })
            test.is_true(old.ok, tostring(old.err))
            test.eq(#old.result.edges, 0)

            local fresh = call_probe(user_id, "edges", { entry_id = entry_id, options = { target_id = "c" } })
            test.is_true(fresh.ok, tostring(fresh.err))
            test.eq(#fresh.result.edges, 1)
            test.eq(fresh.result.edges[1].id, "edge")
        end)

        test.it("updates parent indexes when nodes move between parents and roots", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Parent Retarget Query Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "p1", type = "scope", name = "Parent 1" }),
                    command(EVENT.NODE_ADDED, { id = "p2", type = "scope", name = "Parent 2" }),
                    command(EVENT.NODE_ADDED, { id = "child", type = "scope", name = "Child", parent_id = "p1" }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local moved = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_UPDATED, { id = "child", parent_id = "p2" }) },
            })
            test.is_true(moved.ok, tostring(moved.err))

            local old_parent = call_probe(user_id, "nodes", { entry_id = entry_id, options = { parent_id = "p1" } })
            test.is_true(old_parent.ok, tostring(old_parent.err))
            test.eq(#old_parent.result.nodes, 0)

            local new_parent = call_probe(user_id, "nodes", { entry_id = entry_id, options = { parent_id = "p2" } })
            test.is_true(new_parent.ok, tostring(new_parent.err))
            test.eq(#new_parent.result.nodes, 1)
            test.eq(new_parent.result.nodes[1].id, "child")

            local rerooted = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_UPDATED, { id = "child", parent_id = false }) },
            })
            test.is_true(rerooted.ok, tostring(rerooted.err))

            local roots = call_probe(user_id, "nodes", { entry_id = entry_id, options = { roots_only = true } })
            test.is_true(roots.ok, tostring(roots.err))
            local saw_child = false
            for _, node in ipairs(roots.result.nodes or {}) do
                if tostring((node :: any).id or "") == "child" then saw_child = true end
            end
            test.is_true(saw_child)
        end)

        test.it("undoes and redoes material source updates in normalized indexes", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Material Source History Index Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "mat", target_type = "node", target_id = "a", kind = "upload", title = "Spec", source = { type = "upload", upload_id = "up-1" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.MATERIAL_UPDATED, { id = "mat", source = { type = "url", url = "https://example.test/spec" } }),
                },
            })
            test.is_true(updated.ok, tostring(updated.err))

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            local old = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_upload_id = "up-1" } })
            test.is_true(old.ok, tostring(old.err))
            test.eq(#old.result.materials, 1)
            local no_url = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_url = "https://example.test/spec" } })
            test.is_true(no_url.ok, tostring(no_url.err))
            test.eq(#no_url.result.materials, 0)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            local fresh = call_probe(user_id, "materials", { entry_id = entry_id, options = { source_url = "https://example.test/spec" } })
            test.is_true(fresh.ok, tostring(fresh.err))
            test.eq(#fresh.result.materials, 1)
        end)

        test.it("undoes and redoes edge endpoint updates in normalized indexes", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Edge Endpoint History Index Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                    command(EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                    command(EVENT.NODE_ADDED, { id = "c", type = "service", name = "C" }),
                    command(EVENT.EDGE_ADDED, { id = "edge", type = "calls", source_id = "a", target_id = "b" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.EDGE_UPDATED, { id = "edge", target_id = "c" }) },
            })
            test.is_true(updated.ok, tostring(updated.err))

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            local old = call_probe(user_id, "edges", { entry_id = entry_id, options = { target_id = "b" } })
            test.is_true(old.ok, tostring(old.err))
            test.eq(#old.result.edges, 1)
            local no_new = call_probe(user_id, "edges", { entry_id = entry_id, options = { target_id = "c" } })
            test.is_true(no_new.ok, tostring(no_new.err))
            test.eq(#no_new.result.edges, 0)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            local fresh = call_probe(user_id, "edges", { entry_id = entry_id, options = { target_id = "c" } })
            test.is_true(fresh.ok, tostring(fresh.err))
            test.eq(#fresh.result.edges, 1)
        end)

        test.it("undoes and redoes node parent updates in normalized indexes", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Parent History Index Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "p1", type = "scope", name = "Parent 1" }),
                    command(EVENT.NODE_ADDED, { id = "p2", type = "scope", name = "Parent 2" }),
                    command(EVENT.NODE_ADDED, { id = "child", type = "scope", name = "Child", parent_id = "p1" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_UPDATED, { id = "child", parent_id = "p2" }) },
            })
            test.is_true(updated.ok, tostring(updated.err))

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            local old = call_probe(user_id, "nodes", { entry_id = entry_id, options = { parent_id = "p1" } })
            test.is_true(old.ok, tostring(old.err))
            test.eq(#old.result.nodes, 1)
            local no_new = call_probe(user_id, "nodes", { entry_id = entry_id, options = { parent_id = "p2" } })
            test.is_true(no_new.ok, tostring(no_new.err))
            test.eq(#no_new.result.nodes, 0)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            local fresh = call_probe(user_id, "nodes", { entry_id = entry_id, options = { parent_id = "p2" } })
            test.is_true(fresh.ok, tostring(fresh.err))
            test.eq(#fresh.result.nodes, 1)
        end)

        test.it("undoes and redoes layout clears in the materialized layout table", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Layout Clear History Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "scope", name = "A" }),
                    command(EVENT.LAYOUT_POSITION_SET, { node_id = "a", x = 12, y = 24, width = 300, height = 120, pinned = true }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local cleared = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.LAYOUT_POSITION_CLEARED, { node_id = "a" }) },
            })
            test.is_true(cleared.ok, tostring(cleared.err))
            test.is_nil((cleared.graph.layout.positions :: any).a)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq(undone.graph.layout.positions.a.x, 12)
            test.eq(undone.graph.layout.positions.a.width, 300)
            test.is_true(undone.graph.layout.positions.a.pinned)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.is_nil((redone.graph.layout.positions :: any).a)
        end)

        test.it("undoes and redoes viewport updates in the materialized layout table", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Viewport History Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "root", type = "scope", name = "Root" }),
                    command(EVENT.LAYOUT_VIEWPORT_SET, { root_id = "root", x = 10, y = 20, zoom = 0.5 }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.LAYOUT_VIEWPORT_SET, { root_id = "root", x = 30, y = 40, zoom = 1.5 }) },
            })
            test.is_true(updated.ok, tostring(updated.err))
            test.eq(updated.graph.layout.viewport.x, 30)
            test.eq(updated.graph.layout.viewport.zoom, 1.5)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq(undone.graph.layout.viewport.x, 10)
            test.eq(undone.graph.layout.viewport.y, 20)
            test.eq(undone.graph.layout.viewport.zoom, 0.5)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.eq(redone.graph.layout.viewport.x, 30)
            test.eq(redone.graph.layout.viewport.y, 40)
            test.eq(redone.graph.layout.viewport.zoom, 1.5)
        end)

        test.it("undoes and redoes settings patches without losing existing keys", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Settings History Graph", nil)
            local initial = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.GRAPH_SETTINGS_UPDATED, { settings = { default_view = "map", child_render_mode = "expanded", edge_routing = "straight" } }),
                },
            })
            test.is_true(initial.ok, tostring(initial.err))
            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.GRAPH_SETTINGS_UPDATED, { settings = { default_view = "tree" } }),
                },
            })
            test.is_true(updated.ok, tostring(updated.err))
            test.eq(updated.graph.settings.default_view, "tree")
            test.eq(updated.graph.settings.child_render_mode, "expanded")
            test.eq(updated.graph.settings.edge_routing, "straight")

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq(undone.graph.settings.default_view, "map")
            test.eq(undone.graph.settings.child_render_mode, "expanded")
            test.eq(undone.graph.settings.edge_routing, "straight")

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.eq(redone.graph.settings.default_view, "tree")
            test.eq(redone.graph.settings.child_render_mode, "expanded")
            test.eq(redone.graph.settings.edge_routing, "straight")
        end)

        test.it("filters schema rows by id across materialized type tables", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Schema Id Query Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_REGISTERED, { id = "service", title = "Service" }),
                    command(EVENT.EDGE_TYPE_REGISTERED, { id = "service", title = "Service edge" }),
                    command(EVENT.MATERIAL_TYPE_REGISTERED, { id = "upload", title = "Upload" }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))

            local by_id = call_probe(user_id, "schema", { entry_id = entry_id, options = { id = "service" } })
            test.is_true(by_id.ok, tostring(by_id.err))
            test.eq(#by_id.result.schema.node_types, 1)
            test.eq(by_id.result.schema.node_types[1].id, "service")
            test.eq(#by_id.result.schema.edge_types, 1)
            test.eq(by_id.result.schema.edge_types[1].id, "service")
            test.eq(#by_id.result.schema.material_types, 0)
        end)

        test.it("surfaces graph-level materials in public state and normalized queries", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Graph Material Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.MATERIAL_ATTACHED, { id = "brief", target_type = "graph", kind = "brief", title = "Overview", source = { type = "url", url = "https://example.test/brief" } }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))
            test.eq((applied.graph.counts :: any).materials, 1)
            test.eq(#applied.graph.materials, 1)
            test.eq(applied.graph.materials[1].id, "brief")

            local listed = call_probe(user_id, "materials", { entry_id = entry_id, options = { target_type = "graph" } })
            test.is_true(listed.ok, tostring(listed.err))
            test.eq(#listed.result.materials, 1)
            test.eq(listed.result.materials[1].source_url, "https://example.test/brief")
        end)

        test.it("lets a later write reference facts from an earlier write before async projection lag can matter", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Lag Guard Graph", nil)

            local first = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }),
                    command(EVENT.NODE_ADDED, { id = "b", type = "concept", name = "B" }),
                },
            })
            test.is_true(first.ok, tostring(first.err))

            local second = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.EDGE_ADDED, { id = "ab", type = "relates_to", source_id = "a", target_id = "b" }),
                },
            })
            test.is_true(second.ok, tostring(second.err))
            test.eq((second.graph.counts :: any).edges, 1)

            -- Public reads intentionally do not advance the projection cursor.
            -- Move the async worker at the harness boundary before asserting the
            -- normalized read model produced by the two accepted writes.
            local caught, catch_err = threads(user_id):catch_up_projection({
                thread_id = entry_id,
                kind = "chestor.graph:state",
                max_ticks = 1000,
            })
            test.is_nil(catch_err)
            test.not_nil(caught)
            local fresh = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(fresh.ok, tostring(fresh.err))
            test.eq((fresh.graph.counts :: any).nodes, 2)
            test.eq((fresh.graph.counts :: any).edges, 1)
        end)

        test.it("undoes and redoes the last graph edit batch through durable history", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Undo Graph", nil)

            local first = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }),
                },
            })
            test.is_true(first.ok, tostring(first.err))
            test.eq((first.graph.counts :: any).nodes, 1)
            test.is_true(first.graph.can_undo)
            test.is_false(first.graph.can_redo)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq((undone.graph.counts :: any).nodes, 0)
            test.is_false(undone.graph.can_undo)
            test.is_true(undone.graph.can_redo)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.eq((redone.graph.counts :: any).nodes, 1)
            test.is_true(redone.graph.can_undo)
            test.is_false(redone.graph.can_redo)

            local undone_again = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone_again.ok, tostring(undone_again.err))
            local second = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "b", type = "concept", name = "B" }),
                },
            })
            test.is_true(second.ok, tostring(second.err))
            test.is_true(second.graph.can_undo)
            test.is_false(second.graph.can_redo)

            local redo_empty = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_false(redo_empty.ok)
            test.contains(tostring(redo_empty.err), "nothing to redo")
        end)

        test.it("reports empty undo and redo stacks without mutating the graph", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Empty History Graph", nil)

            local undo = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_false(undo.ok)
            test.contains(tostring(undo.err), "nothing to undo")

            local redo = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_false(redo.ok)
            test.contains(tostring(redo.err), "nothing to redo")

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq((state.graph.counts :: any).nodes, 0)
            test.is_false(state.graph.can_undo)
            test.is_false(state.graph.can_redo)
        end)

        test.it("undoes destructive node removal by restoring subtree edges materials and layout", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Undo Remove Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "root", type = "scope", name = "Root" }),
                    command(EVENT.NODE_ADDED, { id = "child", type = "scope", name = "Child", parent_id = "root" }),
                    command(EVENT.NODE_ADDED, { id = "peer", type = "scope", name = "Peer" }),
                    command(EVENT.EDGE_ADDED, { id = "edge", type = "rel", source_id = "child", target_id = "peer" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "node-mat", target_type = "node", target_id = "child", kind = "note", title = "Node note" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "edge-mat", target_type = "edge", target_id = "edge", kind = "note", title = "Edge note" }),
                    command(EVENT.LAYOUT_POSITION_SET, { node_id = "child", x = 12, y = 34 }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local removed = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_REMOVED, { id = "root" }) },
            })
            test.is_true(removed.ok, tostring(removed.err))
            test.eq((removed.graph.counts :: any).nodes, 1)
            test.eq((removed.graph.counts :: any).edges, 0)
            test.eq((removed.graph.counts :: any).materials, 0)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq((undone.graph.counts :: any).nodes, 3)
            test.eq((undone.graph.counts :: any).edges, 1)
            test.eq((undone.graph.counts :: any).materials, 2)
            local child = find_node(undone.graph.nodes, "child")
            test.not_nil(child)
            test.eq(child.layout.x, 12)
            test.eq(#undone.graph.edges[1].materials, 1)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.eq((redone.graph.counts :: any).nodes, 1)
            test.eq((redone.graph.counts :: any).edges, 0)
            test.eq((redone.graph.counts :: any).materials, 0)
            test.is_nil(find_node(redone.graph.nodes, "child"))
        end)

        test.it("undoes and redoes material detach with source metadata intact", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Material Detach History Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "scope", name = "A" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "mat", target_type = "node", target_id = "a", kind = "upload", title = "Spec", source = { type = "upload", upload_id = "up-1" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local thread_id = tostring(created.graph.thread_id)

            local detached = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.MATERIAL_DETACHED, { id = "mat" }) },
            })
            test.is_true(detached.ok, tostring(detached.err))
            test.eq((detached.graph.counts :: any).materials, 0)
            local caught = call_probe(user_id, "catch_up", { thread_id = thread_id })
            test.is_true(caught.ok, tostring(caught.err))
            test.eq(count_rows("chestor_graph_materials", thread_id), 0)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq((undone.graph.counts :: any).materials, 1)
            caught = call_probe(user_id, "catch_up", { thread_id = thread_id })
            test.is_true(caught.ok, tostring(caught.err))
            local mat = material_row(thread_id, "mat")
            test.eq(mat.source_upload_id, "up-1")

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.eq((redone.graph.counts :: any).materials, 0)
            caught = call_probe(user_id, "catch_up", { thread_id = thread_id })
            test.is_true(caught.ok, tostring(caught.err))
            test.eq(count_rows("chestor_graph_materials", thread_id), 0)
        end)

        test.it("undoes and redoes type removals", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Type Removal History Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_REGISTERED, { id = "service", title = "Service" }),
                    command(EVENT.EDGE_TYPE_REGISTERED, { id = "calls", title = "Calls" }),
                    command(EVENT.MATERIAL_TYPE_REGISTERED, { id = "upload", title = "Upload" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local removed = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_REMOVED, { id = "service" }),
                    command(EVENT.EDGE_TYPE_REMOVED, { id = "calls" }),
                    command(EVENT.MATERIAL_TYPE_REMOVED, { id = "upload" }),
                },
            })
            test.is_true(removed.ok, tostring(removed.err))
            test.eq(#removed.graph.schema.node_types, 0)
            test.eq(#removed.graph.schema.edge_types, 0)
            test.eq(#removed.graph.schema.material_types, 0)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq(undone.graph.schema.node_types[1].id, "service")
            test.eq(undone.graph.schema.edge_types[1].id, "calls")
            test.eq(undone.graph.schema.material_types[1].id, "upload")

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.eq(#redone.graph.schema.node_types, 0)
            test.eq(#redone.graph.schema.edge_types, 0)
            test.eq(#redone.graph.schema.material_types, 0)
        end)

        test.it("undoes a first viewport set back to the default viewport", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Viewport Undo Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "root", type = "scope", name = "Root" }),
                    command(EVENT.LAYOUT_VIEWPORT_SET, { root_id = "root", x = 10, y = 20, zoom = 0.5 }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))
            test.eq(applied.graph.layout.viewport.root_id, "root")
            test.eq(applied.graph.layout.viewport.zoom, 0.5)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.is_nil(undone.graph.layout.viewport.root_id)
            test.eq(undone.graph.layout.viewport.x, 0)
            test.eq(undone.graph.layout.viewport.y, 0)
            test.eq(undone.graph.layout.viewport.zoom, 1)
            test.eq((undone.graph.counts :: any).nodes, 0)
        end)

        test.it("undoes updates to node edge material type settings and layout", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Undo Update Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_REGISTERED, { id = "service", title = "Service", color = "#111" }),
                    command(EVENT.NODE_ADDED, { id = "a", type = "service", name = "A" }),
                    command(EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                    command(EVENT.EDGE_ADDED, { id = "ab", type = "calls", source_id = "a", target_id = "b", label = "old" }),
                    command(EVENT.MATERIAL_ATTACHED, { id = "mat", target_type = "node", target_id = "a", kind = "note", title = "Old" }),
                    command(EVENT.LAYOUT_POSITION_SET, { node_id = "a", x = 1, y = 2 }),
                    command(EVENT.GRAPH_SETTINGS_UPDATED, { settings = { default_view = "map" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_UPDATED, { id = "service", title = "Service", color = "#fff" }),
                    command(EVENT.NODE_UPDATED, { id = "a", name = "A2" }),
                    command(EVENT.EDGE_UPDATED, { id = "ab", label = "new" }),
                    command(EVENT.MATERIAL_UPDATED, { id = "mat", title = "New" }),
                    command(EVENT.LAYOUT_POSITION_SET, { node_id = "a", x = 9, y = 8 }),
                    command(EVENT.GRAPH_SETTINGS_UPDATED, { settings = { default_view = "tree" } }),
                },
            })
            test.is_true(updated.ok, tostring(updated.err))
            local updated_a = find_node(updated.graph.nodes, "a")
            test.not_nil(updated_a)
            test.eq(updated_a.name, "A2")
            test.eq(updated.graph.edges[1].label, "new")
            test.eq(updated_a.materials[1].title, "New")
            test.eq(updated.graph.schema.node_types[1].color, "#fff")
            test.eq(updated.graph.settings.default_view, "tree")

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            local undone_a = find_node(undone.graph.nodes, "a")
            test.not_nil(undone_a)
            test.eq(undone_a.name, "A")
            test.eq(undone.graph.edges[1].label, "old")
            test.eq(undone_a.materials[1].title, "Old")
            test.eq(undone.graph.schema.node_types[1].color, "#111")
            test.eq(undone.graph.layout.positions.a.x, 1)
            test.eq(undone.graph.settings.default_view, "map")
        end)

        test.it("records one history row per successful apply and clears redo on a new branch", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "History Stack Graph", nil)
            local first = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }) },
            })
            test.is_true(first.ok, tostring(first.err))
            local thread_id = tostring(first.graph.thread_id)
            test.eq(count_history(thread_id, "undo"), 1)
            test.eq(count_history(thread_id, "redo"), 0)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq(count_history(thread_id, "undo"), 0)
            test.eq(count_history(thread_id, "redo"), 1)

            local branch = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_ADDED, { id = "b", type = "concept", name = "B" }) },
            })
            test.is_true(branch.ok, tostring(branch.err))
            test.eq(count_history(thread_id, "undo"), 1)
            test.eq(count_history(thread_id, "redo"), 0)
        end)

        test.it("rejects an invalid batch without appending partial events", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Invalid Batch Graph", nil)
            local bad = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }),
                    command(EVENT.EDGE_ADDED, { id = "bad", type = "relates_to", source_id = "a", target_id = "missing" }),
                },
            })
            test.is_false(bad.ok)
            test.contains(tostring(bad.err), "edge target node not found")

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq((state.graph.counts :: any).nodes, 0)

            local events = call_probe(user_id, "list_events", { thread_id = state.graph.thread_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 0)
        end)

        test.it("rejects duplicate create commands without replacing existing facts", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Duplicate Create Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_TYPE_REGISTERED, { id = "concept", title = "Concept" }),
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "Original" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local thread_id = tostring(created.graph.thread_id)

            local duplicate = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "Replacement" }),
                },
            })
            test.is_false(duplicate.ok)
            test.contains(tostring(duplicate.err), "node already exists")

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq((state.graph.counts :: any).nodes, 1)
            test.eq(state.graph.nodes[1].name, "Original")
            local events = call_probe(user_id, "list_events", { thread_id = thread_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 2)
        end)

        test.it("rejects empty and unknown command batches without appending events", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Bad Command Shape Graph", nil)
            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            local thread_id = tostring(state.graph.thread_id)

            local empty = call_probe(user_id, "apply", { entry_id = entry_id, commands = {} })
            test.is_false(empty.ok)
            test.contains(tostring(empty.err), "commands array required")

            local unknown = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command("chestor.graph.events:node.exploded", { id = "a" }) },
            })
            test.is_false(unknown.ok)
            test.contains(tostring(unknown.err), "unknown event type")

            local events = call_probe(user_id, "list_events", { thread_id = thread_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 0)
        end)

        test.it("rejects edges without complete endpoints without appending partial rows", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Incomplete Edge Graph", nil)
            local bad = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }),
                    command(EVENT.EDGE_ADDED, { id = "dangling", type = "relates_to", source_id = "a" }),
                },
            })
            test.is_false(bad.ok)
            test.contains(tostring(bad.err), "edge target node required")

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq((state.graph.counts :: any).nodes, 0)
            test.eq((state.graph.counts :: any).edges, 0)
            local events = call_probe(user_id, "list_events", { thread_id = state.graph.thread_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 0)
        end)

        test.it("rejects update batches that empty required display fields", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Required Field Update Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "Original" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local thread_id = tostring(created.graph.thread_id)

            local bad = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_UPDATED, { id = "a", name = "" }) },
            })
            test.is_false(bad.ok)
            test.contains(tostring(bad.err), "node name required")

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq(state.graph.nodes[1].name, "Original")
            local events = call_probe(user_id, "list_events", { thread_id = thread_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 1)
        end)

        test.it("does not record history for failed writes", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Failed History Graph", nil)
            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            local thread_id = tostring(state.graph.thread_id)

            local bad = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_UPDATED, { id = "missing", name = "Nope" }) },
            })
            test.is_false(bad.ok)
            test.contains(tostring(bad.err), "node not found")
            test.eq(count_history(thread_id, "undo"), 0)
            test.eq(count_history(thread_id, "redo"), 0)
        end)

        test.it("keeps redo history when a new branch fails validation", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Failed Branch Redo Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }) },
            })
            test.is_true(created.ok, tostring(created.err))
            local thread_id = tostring(created.graph.thread_id)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            test.eq(count_history(thread_id, "undo"), 0)
            test.eq(count_history(thread_id, "redo"), 1)

            local bad = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_UPDATED, { id = "missing", name = "Nope" }) },
            })
            test.is_false(bad.ok)
            test.eq(count_history(thread_id, "undo"), 0)
            test.eq(count_history(thread_id, "redo"), 1)

            local redone = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_true(redone.ok, tostring(redone.err))
            test.eq((redone.graph.counts :: any).nodes, 1)
            test.eq(redone.graph.nodes[1].id, "a")
        end)

        test.it("surfaces corrupt undo history instead of reporting a usable stack", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Corrupt Undo History Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }) },
            })
            test.is_true(created.ok, tostring(created.err))
            local thread_id = tostring(created.graph.thread_id)
            exec_db("UPDATE chestor_graph_history SET inverse_events = ? WHERE graph_id = ? AND stack = 'undo'", { "{not-json", thread_id })

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_false(state.ok)
            test.contains(tostring(state.err), "history inverse_events is invalid JSON")

            local undo = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_false(undo.ok)
            test.contains(tostring(undo.err), "history inverse_events is invalid JSON")

            local fresh = call_probe(user_id, "nodes", { entry_id = entry_id, options = { id = "a" } })
            test.is_true(fresh.ok, tostring(fresh.err))
            test.eq(#fresh.result.nodes, 1)
        end)

        test.it("surfaces corrupt redo history instead of reporting a usable stack", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Corrupt Redo History Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }) },
            })
            test.is_true(created.ok, tostring(created.err))
            local thread_id = tostring(created.graph.thread_id)

            local undone = call_probe(user_id, "undo", { entry_id = entry_id })
            test.is_true(undone.ok, tostring(undone.err))
            exec_db("UPDATE chestor_graph_history SET forward_events = ? WHERE graph_id = ? AND stack = 'redo'", { "{not-json", thread_id })

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_false(state.ok)
            test.contains(tostring(state.err), "history forward_events is invalid JSON")

            local redo = call_probe(user_id, "redo", { entry_id = entry_id })
            test.is_false(redo.ok)
            test.contains(tostring(redo.err), "history forward_events is invalid JSON")
            test.eq(count_history(thread_id, "redo"), 1)
        end)

        test.it("rejects a destructive invalid batch without changing persisted rows", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Destructive Invalid Batch Graph", nil)
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "a", type = "concept", name = "A" }),
                    command(EVENT.NODE_ADDED, { id = "b", type = "concept", name = "B" }),
                    command(EVENT.EDGE_ADDED, { id = "ab", type = "relates_to", source_id = "a", target_id = "b" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local thread_id = tostring(created.graph.thread_id)

            local bad = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_REMOVED, { id = "a" }),
                    command(EVENT.EDGE_UPDATED, { id = "ab", label = "should not persist" }),
                },
            })
            test.is_false(bad.ok)
            test.contains(tostring(bad.err), "edge not found", tostring(bad.err))

            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq((state.graph.counts :: any).nodes, 2)
            test.eq((state.graph.counts :: any).edges, 1)
            test.eq(count_rows("chestor_graph_nodes", thread_id), 2)
            test.eq(count_rows("chestor_graph_edges", thread_id), 1)
            local events = call_probe(user_id, "list_events", { thread_id = thread_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 3)
        end)

        test.it("purges the graph thread when the component is destroyed", function()
            local user_id = "graph-owner-" .. uuid()
            local entry_id = graph_component(user_id, "Destroy Graph", nil)
            local applied = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.NODE_ADDED, { id = "root", type = "concept", name = "System" }),
                },
            })
            test.is_true(applied.ok, tostring(applied.err))
            local thread_id = tostring(applied.graph.thread_id)

            local destroyed = call_probe(user_id, "destroy", { entry_id = entry_id })
            test.is_true(destroyed.ok, tostring(destroyed.err))

            local events = call_probe(user_id, "list_events", { thread_id = thread_id })
            test.is_false(events.ok)
            test.contains(tostring(events.err), "thread not found")
            test.eq(count_rows("chestor_graph_nodes", thread_id), 0)
            test.eq(count_history(thread_id, "undo"), 0)
        end)

        for _, nested in ipairs({ false, true }) do
            test.it("registers node types on a graph created " .. (nested and "under a workspace folder" or "at root"), function()
                local user_id = "graph-owner-" .. uuid()
                local parent_id = nil
                if nested then
                    local folder = call_probe(user_id, "create", { type = "folder", name = "Folder" })
                    test.is_true(folder.ok, tostring(folder.err))
                    parent_id = folder.entry.id
                end
                local created = call_probe(user_id, "create", { type = "graph", name = "Graph", parent_id = parent_id })
                test.is_true(created.ok, tostring(created.err))
                test.eq(created.entry.parent_id, parent_id)
                local entry_id = created.entry.id
                local applied = call_probe(user_id, "apply", {
                    entry_id = entry_id,
                    commands = { command(EVENT.NODE_TYPE_REGISTERED, { id = "concept", title = "Concept" }) },
                })
                test.is_true(applied.ok, tostring(applied.err))
                test.eq(applied.graph.thread_id, entry_id)
                local schema = call_probe(user_id, "schema", { entry_id = entry_id })
                test.is_true(schema.ok, tostring(schema.err))
                test.eq(schema.result.schema.node_types[1].id, "concept")
                local events = call_probe(user_id, "list_events", { thread_id = entry_id })
                test.is_true(events.ok, tostring(events.err))
                test.eq(#events.result.events, 1)
                test.eq(events.result.events[1].type, EVENT.NODE_TYPE_REGISTERED)
            end)
        end

        test.it("creates a workspace-placed graph with its primary thread and projection already declared", function()
            local user_id = "graph-owner-" .. uuid()
            local parent_id = graph_component(user_id, "Workspace Folder Stand-in", nil)
            local entry_id = graph_component(user_id, "Placed Graph", parent_id)

            local loaded = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(loaded.ok, tostring(loaded.err))
            test.eq(loaded.graph.thread_id, entry_id)
            test.eq((loaded.graph.counts :: any).nodes, 0)

            local caught = call_probe(user_id, "catch_up", { thread_id = entry_id })
            test.is_true(caught.ok, tostring(caught.err))
            test.eq(tonumber(caught.result.event_count), 0)

            local children = list_children(user_id, entry_id)
            test.eq(#children, 0)
        end)

        test.it("does not create component-owned graph threads on read", function()
            local user_id = "graph-owner-" .. uuid()
            local actor: any = security.new_actor(user_id, { security_groups = { "graph_test" } })
            local scope: any = security.named_scope("wippy.security:process")
            local svc, cerr = contract.get(COMPONENT_SERVICE)
            test.is_nil(cerr)
            test.not_nil(svc)
            local inst, oerr = svc:with_actor(actor):with_scope(scope):open()
            test.is_nil(oerr)
            test.not_nil(inst)
            local reg = inst:register({
                impl_id = GRAPH_KIND,
                meta = { title = "Broken Graph" },
            })
            test.not_nil(reg)
            test.is_true(reg.success, tostring(reg.error))
            local entry_id = tostring(reg.component_id)

            local c = threads(user_id)
            local listed_before, lerr = c:list_projections({ thread_id = entry_id, limit = 50 })
            test.is_nil(lerr)
            test.eq(#(listed_before.projections or {}), 0)

            local loaded = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_false(loaded.ok)
            test.contains(tostring(loaded.err), "graph thread not found")

            local listed_after, aerr = c:list_projections({ thread_id = entry_id, limit = 50 })
            test.is_nil(aerr)
            test.eq(#(listed_after.projections or {}), 0)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

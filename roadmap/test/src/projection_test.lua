local test = require("test")
local funcs = require("funcs")
local sql = require("sql")
local state = require("state")
local materializer = require("materializer")
local types = require("types")

local WORKER = "chestor.roadmap:projection_worker"
local E = types.EVENT

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

local function fold(roadmap_id: string, events: any, to_seq: any): (any?, string?)
    return funcs.call(WORKER, { thread_id = roadmap_id, projection = { body = {} }, events = events, range = { to_seq = to_seq } })
end

local function raw(roadmap_id: string): any
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    test.not_nil(db)
    local handle = db :: any
    local value, serr = materializer.raw_state(handle, roadmap_id)
    handle:release()
    test.is_nil(serr)
    return value
end

local function built(roadmap_id: string): any
    local value, err = state.build(raw(roadmap_id))
    test.is_nil(err)
    return value
end

local function full_batch(): { any }
    return {
        ev(E.LAYER_ADDED, { id = "platform", title = "Platform", color = "#0ea5e9", sort_order = 0 }),
        ev(E.LAYER_ADDED, { id = "product", title = "Product", sort_order = 1 }),
        ev(E.OUTCOME_ADDED, { id = "retention", title = "Retention", description = "Keep them" }),
        ev(E.INITIATIVE_ADDED, { id = "a", title = "Auth", layer_id = "platform", outcome_id = "retention", start_period = "2026-Q3", size = "L", tags = { "security" }, properties = { rice = 12 } }),
        ev(E.INITIATIVE_ADDED, { id = "b", title = "Billing", layer_id = "platform", start_period = "2026-Q4" }),
        ev(E.DEPENDENCY_ADDED, { id = "d1", from_id = "a", to_id = "b", note = "auth first" }),
        ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-Q4", layer_id = "platform", initiative_ids = { "a", "b" } }),
        ev(E.SETTINGS_UPDATED, { settings = { columns = 8, default_lens = "strata" } }),
        ev(E.LENS_STATE_SET, { lens = "timeline", state = { zoom = 2 } }),
    }
end

local function define_tests()
    test.describe("Roadmap Projection Worker", function()
        test.it("binds PostgreSQL parameters at the materializer boundary", function()
            local db, calls = postgres_spy()
            local value, err = materializer.raw_state(db, "roadmap")
            test.is_nil(err)
            test.not_nil(value)
            test.is_true(#calls.queries >= 6)
            for _, call in ipairs(calls.queries) do
                test.is_nil(((call.statement :: string):find("?", 1, true)))
                test.contains(call.statement, "roadmap_id = $1")
            end

            test.is_nil(materializer.delete_roadmap_rows(db, "roadmap"))
            test.eq(#calls.executions, 7)
            test.contains(calls.executions[1].statement, "roadmap_id = $1")
        end)

        test.it("folds a full batch into the normalized tables", function()
            local roadmap_id = "projection-full"
            local out, err = fold(roadmap_id, full_batch(), 9)
            test.is_nil(err)
            test.eq((out :: any).last_seq, 9)

            local value = built(roadmap_id)
            test.eq(#(value :: any).layers, 2)
            test.eq((value :: any).layers[1].id, "platform")
            test.eq((value :: any).layers[1].color, "#0ea5e9")
            test.eq(#(value :: any).outcomes, 1)
            test.eq(#(value :: any).initiatives, 2)
            test.eq((value :: any).initiatives[1].id, "a")
            test.eq((value :: any).initiatives[1].size, "L")
            test.eq((value :: any).initiatives[1].tags[1], "security")
            test.eq((value :: any).initiatives[1].properties.rice, 12)
            test.eq(#(value :: any).dependencies, 1)
            test.eq((value :: any).dependencies[1].note, "auth first")
            test.eq(#(value :: any).milestones, 1)
            test.eq(#(value :: any).milestones[1].initiative_ids, 2)
            test.eq((value :: any).settings.columns, 8)
            test.eq((value :: any).settings.default_lens, "strata")
            test.eq((value :: any).settings.lens_state.timeline.zoom, 2)
        end)

        test.it("returns table counts as cursor metadata and never the data", function()
            local roadmap_id = "projection-body"
            local out = fold(roadmap_id, full_batch(), 9)
            local body: any = (out :: any).body
            test.eq(body.materialized, "chestor_roadmap_tables")
            test.eq(body.last_seq, 9)
            test.eq(body.counts.layers, 2)
            test.eq(body.counts.outcomes, 1)
            test.eq(body.counts.initiatives, 2)
            test.eq(body.counts.dependencies, 1)
            test.eq(body.counts.milestones, 1)
            test.is_nil(body.layers)
            test.is_nil(body.initiatives)
            test.is_nil(body.dependencies)
        end)

        test.it("converges when the same batch is replayed", function()
            local roadmap_id = "projection-replay"
            fold(roadmap_id, full_batch(), 9)
            local first = built(roadmap_id)
            local out, err = fold(roadmap_id, full_batch(), 9)
            test.is_nil(err)
            test.eq((out :: any).body.counts.initiatives, 2)
            local second = built(roadmap_id)
            test.eq(#(second :: any).initiatives, #(first :: any).initiatives)
            test.eq(#(second :: any).dependencies, #(first :: any).dependencies)
            test.eq((second :: any).initiatives[1].title, (first :: any).initiatives[1].title)
            test.eq((second :: any).settings.columns, 8)
        end)

        test.it("merges a partial update onto the stored record", function()
            local roadmap_id = "projection-partial"
            fold(roadmap_id, full_batch(), 9)
            fold(roadmap_id, { ev(E.INITIATIVE_UPDATED, { id = "a", status = "active", progress = 0.5 }) }, 10)
            local initiative: any = (raw(roadmap_id) :: any).initiatives.a
            test.eq(initiative.status, "active")
            test.eq(initiative.progress, 0.5)
            test.eq(initiative.title, "Auth")
            test.eq(initiative.size, "L")
            test.eq(initiative.start_period, "2026-Q3")
        end)

        test.it("writes progress of one when an initiative is marked done", function()
            local roadmap_id = "projection-done"
            fold(roadmap_id, full_batch(), 9)
            fold(roadmap_id, { ev(E.INITIATIVE_UPDATED, { id = "a", status = "done" }) }, 10)
            test.eq((raw(roadmap_id) :: any).initiatives.a.progress, 1)
        end)

        test.it("deletes rows for every removal event", function()
            local roadmap_id = "projection-remove"
            fold(roadmap_id, full_batch(), 9)
            local out = fold(roadmap_id, {
                ev(E.MILESTONE_REMOVED, { id = "m1" }),
                ev(E.DEPENDENCY_REMOVED, { id = "d1" }),
                ev(E.INITIATIVE_REMOVED, { id = "b" }),
                ev(E.LAYER_REMOVED, { id = "product" }),
            }, 13)
            local body: any = (out :: any).body
            test.eq(body.counts.milestones, 0)
            test.eq(body.counts.dependencies, 0)
            test.eq(body.counts.initiatives, 1)
            test.eq(body.counts.layers, 1)
            local value: any = raw(roadmap_id)
            test.is_nil(value.milestones.m1)
            test.is_nil(value.initiatives.b)
            test.not_nil(value.initiatives.a)
        end)

        test.it("projects JSON string event bodies", function()
            local roadmap_id = "projection-string-body"
            local out, err = fold(roadmap_id, {
                ev(E.LAYER_ADDED, "{\"id\":\"platform\",\"title\":\"String body\"}"),
                ev(E.INITIATIVE_ADDED, "{\"id\":\"a\",\"title\":\"Auth\",\"layer_id\":\"platform\",\"span\":3}"),
            }, 2)
            test.is_nil(err)
            test.eq((out :: any).last_seq, 2)
            local value: any = raw(roadmap_id)
            test.eq(value.layers.platform.title, "String body")
            test.eq(value.initiatives.a.span, 3)
        end)

        test.it("rejects an unknown event type instead of silently skipping it", function()
            local out, err = fold("projection-unknown", { ev("chestor.roadmap.events:unknown.event", { id = "x" }) }, 4)
            test.is_nil(out)
            test.contains(tostring(err), "unknown roadmap event type")
            test.eq(#(built("projection-unknown") :: any).layers, 0)
        end)

        test.it("rejects an update for a record the read model does not hold", function()
            local out, err = fold("projection-missing", { ev(E.LAYER_UPDATED, { id = "ghost", title = "Ghost" }) }, 4)
            test.is_nil(out)
            test.contains(tostring(err), "roadmap layer not found for update")
        end)

        test.it("requires a thread id instead of silently writing nowhere", function()
            local out, err = funcs.call(WORKER, { events = {}, range = {} })
            test.is_nil(out)
            test.contains(tostring(err), "thread_id")
        end)

        test.it("keeps roadmaps isolated by their id column", function()
            fold("projection-tenant-a", { ev(E.LAYER_ADDED, { id = "platform", title = "A" }) }, 1)
            fold("projection-tenant-b", { ev(E.LAYER_ADDED, { id = "platform", title = "B" }) }, 1)
            test.eq((raw("projection-tenant-a") :: any).layers.platform.title, "A")
            test.eq((raw("projection-tenant-b") :: any).layers.platform.title, "B")
        end)

        test.it("removes every row of one roadmap on teardown", function()
            local roadmap_id = "projection-teardown"
            fold(roadmap_id, full_batch(), 9)
            local db, err = sql.get(types.db_id())
            test.is_nil(err)
            local handle = db :: any
            test.is_nil(materializer.delete_roadmap_rows(handle, roadmap_id))
            local counts, cerr = materializer.table_counts(handle, roadmap_id)
            handle:release()
            test.is_nil(cerr)
            test.eq((counts :: any).layers, 0)
            test.eq((counts :: any).outcomes, 0)
            test.eq((counts :: any).initiatives, 0)
            test.eq((counts :: any).dependencies, 0)
            test.eq((counts :: any).milestones, 0)
            local value: any = raw(roadmap_id)
            test.eq((value :: any).settings.columns, 5)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

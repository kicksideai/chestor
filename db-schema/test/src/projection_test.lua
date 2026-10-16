local test = require("test")
local funcs = require("funcs")
local sql = require("sql")
local schema_state = require("schema_state")
local materializer = require("materializer")
local types = require("types")

local WORKER = "chestor.db_schema:projection_worker"

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

local function fold(schema_id: string, events: any, to_seq: any): (any?, string?)
    return funcs.call(WORKER, { thread_id = schema_id, projection = { body = {} }, events = events, range = { to_seq = to_seq } })
end

local function raw(schema_id: string): any
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    test.not_nil(db)
    local handle = db :: any
    local state, serr = materializer.raw_state(handle, schema_id)
    handle:release()
    test.is_nil(serr)
    return state
end

local function define_tests()
    test.describe("DB Schema Projection Worker", function()
        test.it("binds PostgreSQL parameters at the materializer boundary", function()
            local db, calls = postgres_spy()
            local rows, err = materializer.list_tables(db, "schema", {
                id = "table",
                search = "account",
                limit = 25,
            })
            test.is_nil(err)
            test.eq(#rows, 0)
            test.eq(#calls.queries, 2)
            local statement = calls.queries[1].statement
            test.is_nil(statement:find("?", 1, true))
            test.contains(statement, "schema_id = $1")
            test.contains(statement, "id = $2")
            test.contains(statement, "name LIKE $3 OR description LIKE $4")
            test.contains(statement, "LIMIT $5")

            test.is_nil(materializer.delete_schema_rows(db, "schema"))
            test.eq(#calls.executions, 5)
            test.contains(calls.executions[1].statement, "schema_id = $1")
        end)

        test.it("projects table.added + column.added into normalized tables and builds the public shape", function()
            local out = fold("schema-projection-basic", {
                ev(schema_state.EVENT.TABLE_ADDED, { id = "t1", name = "users", description = "d" }),
                ev(schema_state.EVENT.COLUMN_ADDED, { id = "c1", table_id = "t1", name = "id", col_type = "uuid", primary_key = true }),
            }, 2)
            test.eq((out :: any).last_seq, 2)
            test.eq((out :: any).body.materialized, "chestor_schema_tables")
            test.is_nil((out :: any).body.tables)
            local built = schema_state.build(raw("schema-projection-basic"))
            test.eq(#(built :: any).tables, 1)
            test.eq((built :: any).tables[1].name, "users")
            test.eq(#(built :: any).tables[1].columns, 1)
        end)

        test.it("table.updated patches name in tables", function()
            local schema_id = "schema-projection-update"
            fold(schema_id, { ev(schema_state.EVENT.TABLE_ADDED, { id = "t1", name = "a" }) }, 1)
            fold(schema_id, { ev(schema_state.EVENT.TABLE_UPDATED, { id = "t1", name = "b" }) }, 2)
            test.eq((raw(schema_id) :: any).tables.t1.name, "b")
        end)

        test.it("table.removed cascades columns, relations, indexes, and layout", function()
            local schema_id = "schema-projection-cascade"
            fold(schema_id, {
                ev(schema_state.EVENT.TABLE_ADDED, { id = "t1", name = "a" }),
                ev(schema_state.EVENT.TABLE_ADDED, { id = "t2", name = "b" }),
                ev(schema_state.EVENT.COLUMN_ADDED, { id = "c1", table_id = "t1", name = "x" }),
                ev(schema_state.EVENT.COLUMN_ADDED, { id = "c2", table_id = "t2", name = "y" }),
                ev(schema_state.EVENT.RELATION_ADDED, { id = "r1", from_table_id = "t1", from_column_id = "c1", to_table_id = "t2", to_column_id = "c2", relation_type = "many_to_one" }),
                ev(schema_state.EVENT.INDEX_ADDED, { id = "i1", table_id = "t1", name = "idx", columns = { "c1" } }),
                ev(schema_state.EVENT.LAYOUT_POSITION_SET, { table_id = "t1", x = 1, y = 2 }),
            }, 7)
            fold(schema_id, { ev(schema_state.EVENT.TABLE_REMOVED, { id = "t1" }) }, 8)
            local state: any = raw(schema_id)
            test.is_nil(state.tables.t1)
            test.is_nil(state.columns.c1)
            test.is_nil(state.relations.r1)
            test.is_nil(state.indexes.i1)
            test.is_nil(state.layout.t1)
            test.not_nil(state.tables.t2)
        end)

        test.it("rejects an unknown event type instead of silently skipping it", function()
            local out, err = fold("schema-projection-unknown", { ev("bogus.kind", { id = "t1" }) }, 5)
            test.is_nil(out)
            test.contains(tostring(err), "unknown db-schema event type")
            test.is_nil(next((raw("schema-projection-unknown") :: any).tables))
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

-- Journal persistence fails with typed errors, and Journal tools return them
-- unchanged.
local test = require("test")
local ops = require("ops")
local support = require("support")
local query_tool = require("query_tool")
local journal_query = require("journal_query")
local journal_context = require("journal_context")
local journal_fact = require("journal_fact")
local journal_graph = require("journal_graph")

local function define_tests()
    test.describe("Journal typed failures", function()
        test.it("returns typed errors from journal database reads and writes", function()
            local db, open_err = ops.open()
            test.is_nil(open_err)
            local rows, query_err = ops.query(db, "SELECT id FROM chestor_journal_missing_table WHERE id = ?", { "x" })
            local exec_err = ops.exec(db, "UPDATE chestor_journal_missing_table SET id = ?", { "x" })
            local width_err = ops.insert_rows(db, "INSERT INTO chestor_journal_events (id)", { { "x" } }, 0, "", nil)
            db:release()
            test.is_nil(rows)
            test.eq(type(query_err), "userdata")
            test.eq(type(exec_err), "userdata")
            test.is_true(errors.is(width_err, errors.INTERNAL))
        end)

        test.it("returns the journal address read error unchanged", function()
            local resolve = support.resolve_journal
            local failure = errors.new({ kind = errors.UNAVAILABLE, message = "journal db unavailable: connection refused" })
            support.resolve_journal = function(): (string?, any?, any?, error?)
                return nil, nil, nil, failure
            end
            local outcomes = {
                query = { journal_query.handler({ handle = "h1" }) },
                context = { journal_context.handler({ handle = "h1" }) },
                fact = { journal_fact.handler({ handle = "h1" }) },
                graph = { journal_graph.handler({ handle = "h1" }) },
            }
            support.resolve_journal = resolve
            for name, outcome in pairs(outcomes) do
                test.is_nil(outcome[1], name)
                test.is_true(errors.is(outcome[2], errors.UNAVAILABLE), name)
                test.contains(tostring(outcome[2]), "connection refused", name)
            end
        end)

        test.it("returns a graph read typed error unchanged", function()
            local handle = query_tool.handle
            local failure = errors.new({ kind = errors.UNAVAILABLE, message = "journal graph unavailable" })
            query_tool.handle = function(): (any?, error?) return nil, failure end
            local value, err = journal_query.handler({ journal_id = "journal-graph-failure", graph_id = "map" })
            query_tool.handle = handle
            test.is_nil(value)
            test.is_true(errors.is(err, errors.UNAVAILABLE))
            test.contains(tostring(err), "graph unavailable")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(options: any): any return run_cases(options) end }

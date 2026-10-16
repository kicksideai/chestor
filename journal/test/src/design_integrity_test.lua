local test = require("test")
local embeddings = require("embeddings")
local reader = require("reader")
local judge = require("judge")
local support = require("support")
local db = require("db")
local cursors = require("cursors")
local thread_log = require("thread_log")
local maintainer = require("maintainer")
local dependencies = require("dependencies")

local modules = {
    { value = require("agent_context"), fields = { "new" } },
    { value = require("db"), fields = { "open", "query", "encode" } },
    { value = reader, fields = { "graph", "window" } },
    { value = require("journal_reader"), fields = { "decode_event", "journal_state" } },
    { value = require("jobs"), fields = { "get", "complete" } },
    { value = require("prompt"), fields = { "new" } },
    { value = require("tool_caller"), fields = { "new" } },
}

local function run_maintainer()
    local saved = {}
    for _, item in ipairs(modules) do
        for _, field in ipairs(item.fields) do
            saved[#saved + 1] = { value = item.value, field = field, previous = item.value[field] }
            item.value[field] = dependencies[field]
        end
    end
    local ok, value, err = pcall(maintainer.run, { journal_id = "journal", job_id = "job" })
    for _, item in ipairs(saved) do item.value[item.field] = item.previous end
    if not ok then error(value) end
    return value, err
end

local run_cases = test.run_cases(function()
    test.describe("Journal design integrity", function()
        test.it("rejects unsupported vector dimensions before database work", function()
            local handle: any = {
                type = function() return "postgres", nil end,
                query = function() return {}, nil end,
                execute = function() return {}, nil end,
            }
            for _, vector in ipairs({ {}, { 1, 0, 0 } }) do
                local value, err = embeddings.search(handle, "journal", vector, 10)
                test.is_nil(value)
                test.eq(err, "embedding vector dimensions do not match the index dimensions")
            end
        end)

        test.it("rejects unsupported write dimensions before selecting sources", function()
            local err = embeddings.upsert_batch({}, "journal", {}, "model", 3, "v1")
            test.is_true(errors.is(err, errors.INVALID))
            test.eq(err:message(), "embedding vector dimensions do not match the index dimensions")
        end)

        test.it("propagates handle resolution failures without inventing a missing handle", function()
            local old_open, old_resolve, old_thread = db.open, cursors.resolve, thread_log.resolve
            local failure = errors.new({ kind = errors.UNAVAILABLE, message = "thread lookup unavailable" })
            db.open = function() return { release = function() end }, nil end
            cursors.resolve = function() return { items = {{ journal_id = "journal" }} }, nil end
            thread_log.resolve = function() return nil, nil, failure end
            local ok, id, cursor, refusal, err = pcall(support.resolve_journal, { handle = "handle" })
            db.open, cursors.resolve, thread_log.resolve = old_open, old_resolve, old_thread
            if not ok then error(id) end
            test.is_nil(id)
            test.is_nil(cursor)
            test.is_nil(refusal)
            test.eq(err, failure)
        end)

        test.it("does not expose journal candidates that the actor cannot read", function()
            local old_open, old_resolve, old_thread = db.open, cursors.resolve, thread_log.resolve
            db.open = function() return { release = function() end }, nil end
            cursors.resolve = function() return { items = {{ journal_id = "private" }} }, nil end
            thread_log.resolve = function()
                return nil, nil, errors.new({ kind = errors.NOT_FOUND, message = "journal not found" })
            end
            local ok, id, cursor, refusal, err = pcall(support.resolve_journal, { handle = "handle" })
            db.open, cursors.resolve, thread_log.resolve = old_open, old_resolve, old_thread
            if not ok then error(id) end
            test.is_nil(id)
            test.is_nil(cursor)
            test.is_nil(err)
            test.eq(assert(refusal).code, "handle_not_found")
        end)

        test.it("reads cleared graph hierarchy from its migrated columns", function()
            local handle: any = {
                type = function() return "postgres", nil end,
                query = function()
                    return {{ graph_id = "graph", config_json = '{"workspace":{"parent_graph_id":"old-parent","anchor_graph_id":"old-graph","anchor_node_id":"old-node"}}' }}, nil
                end,
            }
            local graph, err = reader.graph(handle, "journal", "graph")
            test.is_nil(err)
            test.is_nil(graph.parent_graph_id)
            test.is_nil(graph.anchor)
        end)

        for _, stage in ipairs({ "load", "step", "validate", "execute" }) do
            test.it("propagates maintainer " .. stage .. " errors without completing the job", function()
                dependencies.reset()
                dependencies.stage = stage
                dependencies.failure = "maintainer " .. stage .. " refused"
                local value, err = run_maintainer()
                test.is_nil(value)
                test.eq(err, dependencies.failure)
                test.eq(#dependencies.loads, 1)
                test.eq(dependencies.loads[1], "selected-agent")
                test.eq(dependencies.completed, 0)
                test.eq(dependencies.released, 1)
            end)
        end

        test.it("completes a successful maintainer job with the configured agent", function()
            dependencies.reset()
            local value, err = run_maintainer()
            test.is_nil(err)
            test.eq(value.agent_id, "selected-agent")
            test.eq(dependencies.completed, 1)
            test.eq(dependencies.released, 2)
        end)

        test.it("rejects responses outside the normalized generation contract", function()
            for _, response in ipairs({ "answer", { content = "answer" }, { result = { content = "answer" } } }) do
                local previous = judge._llm
                judge._llm = { generate = function() return response, nil end }
                local value, err = judge.for_model("class:nano")("prompt")
                judge._llm = previous
                test.is_nil(value)
                test.eq(err, "refine model returned no text")
            end
        end)

        test.it("reads the normalized LLM result and preserves generation errors", function()
            local previous = judge._llm
            judge._llm = { generate = function() return { result = "answer", content = "other" }, nil end }
            local value, err = judge.for_model("class:nano")("prompt")
            judge._llm = previous
            test.is_nil(err)
            test.eq(value, "answer")
            judge._llm = { generate = function() return nil, "generation refused" end }
            local failed, failure = judge.for_model("class:nano")("prompt")
            judge._llm = previous
            test.is_nil(failed)
            test.eq(failure, "generation refused")
        end)
    end)
end)

return { run = run_cases }

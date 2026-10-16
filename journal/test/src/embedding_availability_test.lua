local test = require("test")
local llm = require("llm")
local scheduler = require("scheduler")
local worker = require("worker")
local recall = require("recall")
local real_recall = require("real_recall")
local thread_log = require("thread_log")

local run_cases = test.run_cases(function()
    test.describe("Journal embedding availability", function()
        test.it("coalesces checkpoints and continuations through durable reusable demand", function()
            local previous = scheduler._jobs
            local requests: { table } = {}
            scheduler._jobs = { enqueue = function(request)
                requests[#requests + 1] = request
                return { id = "embedding-slot" }, nil
            end }
            local first_err = scheduler.schedule("journal", 1)
            local second_err = scheduler.schedule("journal", 2, "graph:2")
            local continuation_err = scheduler.schedule("journal", 0, "continuation")
            scheduler._jobs = previous
            test.is_nil(first_err)
            test.is_nil(second_err)
            test.is_nil(continuation_err)
            test.eq(#requests, 3)
            for _, request in ipairs(requests) do
                test.eq(request.key, requests[1].key)
                test.is_true(request.slot == true)
                test.is_true(request.demand == true)
                test.eq(request.concurrency_key, "journal:embeddings")
                test.eq(request.immutable_payload.journal_id, "journal")
            end
        end)

        test.it("exposes an unavailable state and enqueues no work without a configured model", function()
            local previous_resolve = thread_log.resolve
            thread_log.resolve = function(): (any, string, nil) return {}, "journal", nil end
            local previous_models = llm._models
            local previous_resolver = llm._model_resolver
            local previous_jobs = scheduler._jobs
            llm._model_resolver = { resolve = function(): (nil, nil) return nil, nil end }
            llm._models = { get_by_class = function(): (any, nil) return {}, nil end }
            local calls = 0
            scheduler._jobs = { enqueue = function(): (any, nil) calls = calls + 1; return {}, nil end }
            local err, state = scheduler.schedule("journal", 1)
            local pending, pending_err = real_recall.embed_pending("journal")
            thread_log.resolve = previous_resolve
            llm._models = previous_models
            llm._model_resolver = previous_resolver
            scheduler._jobs = previous_jobs
            test.is_nil(err)
            test.not_nil(state)
            test.eq(state.status, "unavailable")
            test.eq(state.kind, errors.UNAVAILABLE)
            test.eq(calls, 0)
            test.is_nil(pending_err)
            test.eq(pending.status, "unavailable")
            test.eq(pending.processed, 0)
        end)
        test.it("preserves the Journal access gate when the embedding model is unavailable", function()
            local previous_models = llm._models
            local previous_resolver = llm._model_resolver
            local previous_resolve = thread_log.resolve
            local failure = errors.new({ kind = errors.NOT_FOUND, message = "Journal is not readable" })
            llm._model_resolver = { resolve = function(): (nil, nil) return nil, nil end }
            llm._models = { get_by_class = function(): (any, nil) return {}, nil end }
            thread_log.resolve = function(): (nil, nil, any) return nil, nil, failure end
            local result, err = real_recall.embed_pending("journal")
            thread_log.resolve = previous_resolve
            llm._models = previous_models
            llm._model_resolver = previous_resolver
            test.is_nil(result)
            test.eq(err, failure)
        end)
        test.it("parks existing embedding work when the model is unavailable", function()
            recall.result = { status = "unavailable", kind = errors.UNAVAILABLE,
                message = "no embedding model", embedded = 0, processed = 0 }
            worker._recall = recall
            local result, err = worker.execute({ journal_id = "journal" })
            worker._recall = nil
            test.is_nil(err)
            test.not_nil(result)
            test.eq(result.status, "unavailable")
            test.eq(result.kind, errors.UNAVAILABLE)
            test.eq(result.record.status, "parked")
            test.eq(result.record.error, "no embedding model")
        end)
        test.it("propagates continuation enqueue failures", function()
            recall.result = { embedded = 64, processed = 64, continuation_key = "last" }
            local previous_jobs = scheduler._jobs
            scheduler._jobs = { enqueue = function(): (nil, string) return nil, "continuation refused" end }
            worker._recall = recall
            local result, err = worker.execute({ journal_id = "journal" })
            scheduler._jobs = previous_jobs
            worker._recall = nil
            test.is_nil(result)
            test.eq(err, "continuation refused")
        end)
        test.it("schedules work once the declared model resolves and propagates enqueue failures", function()
            local previous_jobs = scheduler._jobs
            scheduler._jobs = { enqueue = function(): (nil, string) return nil, "queue refused" end }
            local err = scheduler.schedule("journal", 2)
            scheduler._jobs = previous_jobs
            test.eq(err, "queue refused")
        end)
    end)
end)
return { run = run_cases }

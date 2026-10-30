-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local test = require("test")
local time = require("time")
local sql = require("sql")
local types = require("types")
local projector = require("projector")
local graph_projector = require("graph_projector")
local graph = require("graph")
local recall = require("recall")
local reader = require("reader")
local thread_log = require("thread_log")
local embeddings = require("embeddings")

local run_cases = test.run_cases(function()
    test.describe("Journal hybrid recall during embedding", function()
        test.it("returns exact nodes promptly while a newly projected graph is partially embedded", function()
            local journal_id = "hybrid-partial-embedding"
            local events: { any } = {}
            for index = 1, 205 do
                events[#events + 1] = {
                    seq = index, type = types.EVENT.ENTRY_APPENDED,
                    body = { event_id = "finding:" .. tostring(index), ts = index,
                        event_type = "finding", title = "Recall dispatch " .. tostring(index),
                        body = "A projected finding awaiting its node embedding." },
                }
            end
            local db, open_err = sql.get(types.db_id())
            test.is_nil(open_err)
            local tx, begin_err = db:begin()
            test.is_nil(begin_err)
            local ok, failure = pcall(function()
                test.is_nil(projector.project_events(tx, journal_id, events))
                test.is_nil(graph_projector.project_events(tx, journal_id, events))
            end)
            if not ok then tx:rollback(); db:release(); error(failure) end
            local _, commit_err = tx:commit()
            test.is_nil(commit_err)
            db:release()

            local original_resolve = thread_log.resolve
            thread_log.resolve = function(): (any, string, nil) return {}, journal_id, nil end
            local writer_db, writer_tx
            ok, failure = pcall(function()
                for _ = 1, 5 do
                    local batch, batch_err = recall.embed_pending(journal_id, 64)
                    test.is_nil(batch_err, tostring(batch_err))
                    test.eq(batch.processed, 64)
                end
                db, open_err = sql.get(types.db_id())
                test.is_nil(open_err)
                local pending, pending_err = reader.pending_embeddings(db, journal_id, 64,
                    types.EMBEDDING_MODEL, types.EMBEDDING_MODEL_VERSION)
                db:release()
                test.is_nil(pending_err)
                test.is_true(#pending > 0, "the graph must still have pending embeddings")
                test.eq(pending[1].source_type, "node")

                writer_db, open_err = sql.get(types.db_id())
                test.is_nil(open_err)
                local dialect, dialect_err = writer_db:type()
                test.is_nil(dialect_err)
                if dialect == "postgres" then
                    writer_tx, begin_err = writer_db:begin()
                    test.is_nil(begin_err)
                    local sources: { any } = {}
                    local writes: { any } = {}
                    local vector: { number } = {}
                    for index = 1, types.EMBEDDING_DIMENSIONS do vector[index] = index == 1 and 1 or 0 end
                    for index = 1, 16 do
                        sources[#sources + 1] = pending[index]
                        writes[#writes + 1] = { source = pending[index], vector = vector }
                    end
                    test.is_nil(embeddings.reset_sources(writer_tx, journal_id, sources,
                        types.EMBEDDING_MODEL, types.EMBEDDING_MODEL_VERSION))
                    test.is_nil(embeddings.upsert_batch(writer_tx, journal_id, writes,
                        types.EMBEDDING_MODEL, types.EMBEDDING_DIMENSIONS, types.EMBEDDING_MODEL_VERSION))
                end

                local started = time.now()
                local result, query_err = graph.query(journal_id, "map", {
                    mode = "hybrid", query = "Recall dispatch 205", limit = 60,
                })
                local elapsed = time.now():sub(started):milliseconds()
                test.is_nil(query_err, tostring(query_err))
                test.is_true(elapsed < 5000, "hybrid recall takes " .. tostring(elapsed) .. " ms during embedding")
                test.is_true(result.semantic_available, tostring(result.semantic_error))
                local matched = false
                for _, node in ipairs(result.items) do
                    if node.label == "Recall dispatch 205" then
                        matched = true
                        test.is_true(node.recall.sources.text)
                    end
                end
                test.is_true(matched, "hybrid recall loses the unembedded exact match")
            end)
            thread_log.resolve = original_resolve
            if writer_tx then
                local _, rollback_err = writer_tx:rollback()
                test.is_nil(rollback_err)
            end
            if writer_db then writer_db:release() end
            if not ok then error(failure) end
        end)
    end)
end)
return { run = run_cases }

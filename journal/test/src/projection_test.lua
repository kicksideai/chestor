local test = require("test")
local sql = require("sql")
local ops = require("ops")
local types = require("types")
local reader = require("reader")
local cursors = require("cursors")
local writer = require("writer")
local embeddings = require("embeddings")
local projector = require("projector")
local embedding_scheduler = require("embedding_scheduler")

local function vector(x: number, y: number): { number }
    local out: { number } = {}
    for index = 1, types.EMBEDDING_DIMENSIONS do out[index] = 0 end
    out[1], out[2] = x, y
    return out
end

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

local function fold(journal_id: string, events: any, to_seq: any): (any?, string?)
    local component = { set_meta = function(_id: string, _fields: any): (boolean, nil) return true, nil end }
    return projector.run({ thread_id = journal_id, projection = { body = {} }, events = events, range = { to_seq = to_seq } }, component)
end

local function with_db(fn: (any) -> ())
    local db, err = sql.get(types.db_id())
    test.is_nil(err)
    test.not_nil(db)
    local handle = db :: any
    fn(handle)
    handle:release()
end

local function define_tests()
    test.describe("Journal Projection Worker", function()
        test.it("writes search documents in bounded batches for each event fold", function()
            for _, dialect in ipairs({ "sqlite", "postgres" }) do
                local handle, calls = postgres_spy()
                handle["type"] = function(): (string, nil) return dialect, nil end
                local events = {}
                for index = 1, 150 do
                    events[index] = ev(types.EVENT.ENTRY_APPENDED, {
                        event_id = "fts-batch-" .. tostring(index), seq = index,
                        event_type = "decision", title = "Batched search", body = "Search document", ts = index,
                    })
                end
                test.is_nil(projector.project_events(handle, "fts-batch", events))
                test.eq(#calls.executions, dialect == "postgres" and 152 or 154)
                local documents = 0
                for _, call in ipairs(calls.executions) do
                    if call.statement:find("INSERT INTO chestor_journal_fts", 1, true) then
                        test.is_true(#call.params <= 600)
                        documents = documents + #call.params / 6
                    end
                end
                test.eq(documents, 150)
            end
        end)

        test.it("materializes search batches across boundaries and preserves other journals", function()
            local journal_id = "search-batch-scope"
            with_db(function(handle)
                for _, id in ipairs({ journal_id, "search-batch-other" }) do
                    test.is_nil(ops.exec(handle, [[INSERT INTO chestor_journal_fts
                        (event_id,journal_id,event_type,title,body,tags) VALUES(?,?,?,?,?,?)]],
                        { "search-1", id, "decision", "Prior", "Prior document", "[]" }))
                end
            end)
            local events = {}
            for index = 1, 201 do
                events[index] = ev(types.EVENT.ENTRY_APPENDED, {
                    event_id = "search-" .. tostring(index), seq = index, ts = index,
                    event_type = "decision", title = "Bulk title", body = "Nebula document", tags = { "batch" },
                })
            end
            local _, err = fold(journal_id, events, 201)
            test.is_nil(err)
            local _, replay_err = fold(journal_id, events, 201)
            test.is_nil(replay_err)
            with_db(function(handle)
                local rows, read_err = ops.query(handle, [[SELECT COUNT(*) AS n,
                    MIN(title) AS title FROM chestor_journal_fts WHERE journal_id=?]], { journal_id })
                test.is_nil(read_err)
                test.eq(tonumber(rows[1].n), 201)
                test.eq(rows[1].title, "Bulk title")
                local other, other_err = ops.query(handle, [[SELECT title,body FROM chestor_journal_fts
                    WHERE journal_id=? AND event_id=?]], { "search-batch-other", "search-1" })
                test.is_nil(other_err)
                test.eq(#other, 1)
                test.eq(other[1].title, "Prior")
                test.eq(other[1].body, "Prior document")
                local hits, search_err = reader.search_text(handle, journal_id, "nebula", 10, {})
                test.is_nil(search_err)
                test.eq(#hits, 10)
            end)
        end)

        test.it("resolves each executor dialect once and retries dialect errors", function()
            for _, dialect in ipairs({ "sqlite", "postgres" }) do
                local reads = 0
                local handle: any = {}
                handle["type"] = function(): (string, nil)
                    reads = reads + 1
                    return dialect, nil
                end
                local expected = dialect == "postgres" and "SELECT $1" or "SELECT ?"
                for _ = 1, 10 do
                    local statement, err = ops.prepare(handle, "SELECT ?")
                    test.is_nil(err)
                    test.eq(statement, expected)
                end
                test.eq(reads, 1)
            end
            local reads = 0
            local handle: any = {}
            handle.db_type = function(): (string?, string?)
                reads = reads + 1
                if reads == 1 then return nil, "dialect unavailable" end
                return "postgres", nil
            end
            local statement, err = ops.prepare(handle, "SELECT ?")
            test.is_nil(statement)
            test.not_nil(err)
            test.is_true(tostring(err):find("dialect unavailable", 1, true) ~= nil)
            local retry, retry_err = ops.prepare(handle, "SELECT ?")
            test.is_nil(retry_err)
            test.eq(retry, "SELECT $1")
            test.eq(reads, 2)
        end)

        test.it("advances an existing cursor atomically and returns its stored identity in one query", function()
            with_db(function(handle)
                local initial, initial_err = cursors.advance(handle, "cursor-atomic", "position", "owner", 7, "explicit")
                test.is_nil(initial_err)
                test.not_nil(initial)
                test.is_nil(ops.exec(handle, "UPDATE chestor_journal_cursors SET state = 'closed', revision = 4, claimed_revision = 5 WHERE journal_id = ? AND cursor_id = ?", { "cursor-atomic", "position" }))
                local calls = 0
                local counted: any = {}
                counted["type"] = function(): (any, any) return handle:type() end
                counted.query = function(_: any, statement: string, params: any): (any, any)
                    calls = calls + 1
                    return handle:query(statement, params)
                end
                counted.execute = function(_: any, statement: string, params: any): (any, any)
                    calls = calls + 1
                    return handle:execute(statement, params)
                end
                local moved, move_err = cursors.advance(counted, "cursor-atomic", "position", "other", 3, "auto")
                test.is_nil(move_err)
                test.eq(moved.last_seen_seq, 7)
                test.eq(moved.agent_id, "owner")
                test.eq(moved.state, "closed")
                test.eq(moved.revision, 4)
                test.eq(moved.claimed_revision, 5)
                test.eq(calls, 1)
            end)
        end)

        test.it("writes native embedding batches with bounded database calls and rejects invalid vectors before writing", function()
            local handle, calls = postgres_spy()
            local items = {}
            local vector = {}
            for index = 1, types.EMBEDDING_DIMENSIONS do vector[index] = index == 1 and 1 or 0 end
            for index = 1, 150 do
                items[index] = { source = { id = "batch-" .. tostring(index), seq = index, title = "Fact" }, vector = vector }
            end
            test.is_nil(embeddings.upsert_batch(handle, "journal", items, "model", types.EMBEDDING_DIMENSIONS, "v1"))
            test.eq(#calls.queries, 0)
            test.eq(#calls.executions, 8)
            local invalid = {}
            for index = 1, types.EMBEDDING_DIMENSIONS do invalid[index] = vector[index] end
            invalid[3] = math.huge
            items[150].vector = invalid
            local invalid_err = embeddings.upsert_batch(handle, "journal", items, "model", types.EMBEDDING_DIMENSIONS, "v1")
            test.not_nil(invalid_err)
            test.eq(#calls.executions, 8)
            handle.execute = function(): (nil, string) return nil, "embedding write refused" end
            items[150].vector = vector
            test.eq(embeddings.upsert_batch(handle, "journal", items, "model", types.EMBEDDING_DIMENSIONS, "v1"), "embedding write refused")
        end)

        test.it("stores event chunks and graph vectors together and preserves other model versions", function()
            local journal_id = "native-embedding-batch"
            local _, fold_err = fold(journal_id, { ev(types.EVENT.ENTRY_APPENDED, { id = "event", title = "Event", seq = 1 }) }, 1)
            test.is_nil(fold_err)
            local vector = {}
            for index = 1, types.EMBEDDING_DIMENSIONS do vector[index] = index == 1 and 1 or 0 end
            local items = {
                { source = { id = "event", seq = 1, chunk_index = 0, content = "First" }, vector = vector },
                { source = { id = "event", seq = 1, chunk_index = 1, content = "Second" }, vector = vector },
                { source = { source_type = "node", source_id = "node", node_id = "node", graph_id = "map", seq = 2, content = "Node" }, vector = vector },
            }
            with_db(function(handle)
                test.is_nil(embeddings.upsert_batch(handle, journal_id, items, "model", types.EMBEDDING_DIMENSIONS, "v1"))
                test.is_nil(embeddings.upsert_batch(handle, journal_id, items, "model", types.EMBEDDING_DIMENSIONS, "v2"))
                test.is_nil(embeddings.upsert_batch(handle, journal_id, items, "model", types.EMBEDDING_DIMENSIONS, "v1"))
                local rows, read_err = ops.query(handle, "SELECT document_id, content, source_revision, model_version FROM chestor_journal_embedding_documents WHERE journal_id = ? ORDER BY model_version, document_id", { journal_id })
                test.is_nil(read_err)
                test.eq(#rows, 6)
                test.eq(rows[1].content, "First")
                test.eq(rows[2].content, "Second")
                test.eq(rows[3].content, "Node")
                test.eq(tonumber(rows[3].source_revision), 2)
                local vectors, vector_err = ops.query(handle, "SELECT COUNT(*) AS n FROM chestor_journal_embedding_vectors WHERE journal_id = ?", { journal_id })
                test.is_nil(vector_err)
                test.eq(tonumber(vectors[1].n), 6)
                local events, event_err = ops.query(handle, "SELECT embedding_status FROM chestor_journal_events WHERE journal_id = ? AND id = ?", { journal_id, "event" })
                test.is_nil(event_err)
                test.eq(events[1].embedding_status, "embedded")
            end)
        end)

        test.it("resets embedding sources in bounded batches without deleting empty source sets", function()
            local handle, calls = postgres_spy()
            local sources = {}
            for index = 1, 150 do sources[index] = { id = "source-" .. tostring(index) } end
            test.is_nil(embeddings.reset_sources(handle, "journal", sources, "model", "v1"))
            test.eq(#calls.queries, 2)
            test.eq(#calls.executions, 0)
            handle.query = function(): (nil, string) return nil, "reset read refused" end
            test.eq(embeddings.reset_sources(handle, "journal", sources, "model", "v1"), "reset read refused")
        end)

        test.it("resets native embeddings for selected sources and preserves other versions and journals", function()
            local journal_id = "journal-reset-batch"
            local _, err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "one", title = "One", ts = 1 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "two", title = "Two", ts = 2 }),
            }, 2)
            test.is_nil(err)
            local _, other_err = fold("journal-reset-other", { ev(types.EVENT.ENTRY_APPENDED, { id = "one", title = "Other", ts = 1 }) }, 1)
            test.is_nil(other_err)
            local vector = {}
            for index = 1, types.EMBEDDING_DIMENSIONS do vector[index] = index == 1 and 1 or 0 end
            with_db(function(db)
                for _, id in ipairs({ "one", "two" }) do
                    test.is_nil(embeddings.upsert(db, journal_id, id, vector, "reset-model", types.EMBEDDING_DIMENSIONS, "v1"))
                end
                test.is_nil(embeddings.upsert(db, journal_id, "one", vector, "reset-model", types.EMBEDDING_DIMENSIONS, "v2"))
                test.is_nil(embeddings.upsert(db, "journal-reset-other", "one", vector, "reset-model", types.EMBEDDING_DIMENSIONS, "v1"))
                test.is_nil(embeddings.reset_sources(db, journal_id, { { id = "one" }, { id = "two" } }, "reset-model", "v1"))
                local matches, search_err = embeddings.search(db, journal_id, vector, 10, "reset-model", "v1")
                test.is_nil(search_err)
                test.eq(#matches, 0)
                local version, version_err = embeddings.search(db, journal_id, vector, 10, "reset-model", "v2")
                test.is_nil(version_err)
                test.eq(#version, 1)
                local other, other_search_err = embeddings.search(db, "journal-reset-other", vector, 10, "reset-model", "v1")
                test.is_nil(other_search_err)
                test.eq(#other, 1)
            end)
        end)

        test.it("counts branch facts once per batch while refreshing each twenty-fifth fact in order", function()
            local journal_id = "journal-batch-fact-counts"
            local values = {}
            for index = 1, 50 do
                values[index] = { seq = index, type = types.EVENT.ENTRY_APPENDED,
                    body = { id = "work-" .. tostring(index), task_id = "branch", event_type = "observation", ts = index } }
            end
            with_db(function(db)
                test.is_nil(ops.exec(db, [[
                    INSERT INTO chestor_journal_tasks
                        (journal_id, id, title, status, sort_order, metadata, created_at, updated_at)
                    VALUES (?, 'branch', 'Branch', 'open', 0, '{}', 1, 1)
                ]], { journal_id }))
                local count_reads = 0
                local handle: any = {}
                handle["type"] = function(): any return db:type() end
                handle.query = function(_: any, statement: string, params: any): any
                    if statement:find("SELECT COUNT(*) AS n FROM chestor_journal_events", 1, true) then
                        count_reads = count_reads + 1
                    end
                    return db:query(statement, params)
                end
                handle.execute = function(_: any, statement: string, params: any): any return db:execute(statement, params) end
                test.is_nil(projector.project_events(handle, journal_id, values))
                test.is_true(count_reads <= 1, "branch counts use a batch read")
                local rows, err = ops.query(db, "SELECT source_seq FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id = ?", { journal_id, "branch" })
                test.is_nil(err)
                test.eq(tonumber(rows[1].source_seq), 50)
            end)
        end)

        test.it("deduplicates a projection batch with bounded reads and detects collisions within the batch", function()
            local handle, calls = postgres_spy()
            local values = {}
            for index = 1, 150 do
                values[index] = { seq = index, type = types.EVENT.ENTRY_APPENDED,
                    body = { id = "batch-" .. tostring(index), event_type = "note", ts = 1 } }
            end
            handle.query = function(_: any, statement: string, params: any): (any, nil)
                calls.queries[#calls.queries + 1] = statement
                local rows = {}
                for index = 2, #params do rows[#rows + 1] = { id = params[index], payload_sha256 = "" } end
                return rows, nil
            end
            test.is_nil(projector.project_events(handle, "journal", values))
            test.eq(#calls.queries, 2)
            test.eq(#calls.executions, 0)

            local journal_id = "journal-in-batch-dedupe"
            local item = ev(types.EVENT.ENTRY_APPENDED, { id = "same-batch-id", title = "Original", ts = 1 })
            local _, err = fold(journal_id, { item, item }, 2)
            test.is_nil(err)
            with_db(function(db)
                local rows, read_err = ops.query(db, "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ?", { journal_id })
                test.is_nil(read_err)
                test.eq(tonumber(rows[1].n), 1)
            end)
            local _, collision_err = fold("journal-in-batch-collision", {
                item, ev(types.EVENT.ENTRY_APPENDED, { id = "same-batch-id", title = "Changed", ts = 1 }),
            }, 2)
            test.not_nil(collision_err)
            test.contains(tostring(collision_err), "event id collision")
        end)

        test.it("reads governing ancestors with one bounded query using the supersession index predicate", function()
            local handle, calls = postgres_spy()
            local ancestors = {}
            for index = 1, 1200 do ancestors[index] = "task-" .. tostring(index) end
            local result, err = reader.governing_facts(handle, "journal", ancestors, 2)
            test.is_nil(err)
            test.eq(#result.facts, 0)
            test.eq(result.total, 0)
            test.eq(#calls.queries, 1)
            test.contains(calls.queries[1].statement, "s.supersedes_event_id IS NOT NULL")
            test.eq(#calls.queries[1].params, 3)
            handle.query = function(): (nil, string) return nil, "governing read refused" end
            local missing, read_err = reader.governing_facts(handle, "journal", ancestors, 2)
            test.is_nil(missing)
            test.eq(read_err, "governing read refused")
        end)

        test.it("preserves governing proximity, recency, supersession, lifecycle, and omission totals", function()
            local journal_id = "journal-governing-order"
            local values = {
                ev(types.EVENT.ENTRY_APPENDED, { id = "root", task_id = "root-task", event_type = "decision", ts = 1 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "near-old", task_id = "near-task", event_type = "constraint", ts = 2 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "near-new", task_id = "near-task", event_type = "observation", metadata = { scope = "subtree" }, ts = 3 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "retracted", task_id = "near-task", event_type = "decision", metadata = { lifecycle = "retracted" }, ts = 4 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "replaced", task_id = "near-task", event_type = "decision", ts = 5 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "successor", task_id = "local-task", event_type = "decision", supersedes_event_id = "replaced", ts = 6 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "local", task_id = "local-task", event_type = "decision", ts = 7 }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "unscoped", task_id = "near-task", event_type = "risk", ts = 8 }),
            }
            local _, err = fold(journal_id, values, #values)
            test.is_nil(err)
            with_db(function(db)
                local result, read_err = reader.governing_facts(db, journal_id, { "root-task", "near-task" }, 2)
                test.is_nil(read_err)
                test.eq(result.total, 3)
                test.eq(#result.facts, 2)
                test.eq(result.facts[1].id, "near-new")
                test.eq(result.facts[2].id, "near-old")
                test.eq(result.facts[1].inherited_from_task_id, "near-task")
                local complete, complete_err = reader.governing_facts(db, journal_id, { "root-task", "near-task" }, 10)
                test.is_nil(complete_err)
                test.eq(complete.facts[3].id, "root")
            end)
        end)

        test.it("binds PostgreSQL parameters at the materializer boundary", function()
            local db, calls = postgres_spy()
            local rows, err = reader.list_events(db, "journal", { limit = 25 })
            test.is_nil(err)
            test.eq(#rows, 0)
            test.eq(#calls.queries, 1)
            local statement = calls.queries[1].statement
            test.is_nil(statement:find("?", 1, true))
            test.contains(statement, "journal_id = $1")
            test.contains(statement, "LIMIT $2")

            test.is_nil(writer.delete_journal(db, "journal"))
            test.is_true(#calls.executions > 0)
            local deleted_reference_rows = false
            local deleted_reference_catalog = false
            for _, execution in ipairs(calls.executions) do
                test.is_nil(execution.statement:find("?", 1, true))
                test.contains(execution.statement, "journal_id = $1")
                if execution.statement:find("chestor_journal_node_refs", 1, true) then deleted_reference_rows = true end
                if execution.statement:find("chestor_journal_references", 1, true) then deleted_reference_catalog = true end
            end
            test.is_true(deleted_reference_rows)
            test.is_true(deleted_reference_catalog)
        end)

        test.it("projects entries, tasks, digest, checkpoints, and artifacts into normalized tables", function()
            local journal_id = "journal-projection-full"
            local out, err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "kickoff", event_type = "note", title = "Port long running research journal", body = "Kickoff." }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "e1", event_type = "observation", title = "Found renderer", body = "KickSide components use live projection reloads.", tags = { "ui", "projection" } }),
                ev(types.EVENT.TASK_UPSERTED, { id = "t1", title = "Add vector search", status = "open" }),
                ev(types.EVENT.DIGEST_UPDATED, { id = "d1", body = "Renderer and projection architecture identified." }),
                ev(types.EVENT.CHECKPOINT_CREATED, { id = "c1", title = "Compaction point", body = "Continue from package tests." }),
                ev(types.EVENT.ARTIFACT_LINKED, { artifact_id = "a1", title = "Screenshot", summary = "Agent-visible evidence", upload_id = "u1" }),
            }, 6)
            test.is_nil(err)
            test.eq((out :: any).last_seq, 6)
            test.eq((out :: any).body.materialized, "chestor_journal_tables")
            local replay, replay_err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "e1", event_type = "observation", title = "Found renderer", body = "KickSide components use live projection reloads.", tags = { "ui", "projection" } }),
            }, 6)
            test.is_nil(replay_err)
            test.not_nil(replay)

            with_db(function(db)
                local events, eerr = reader.list_events(db, journal_id, { limit = 20 })
                test.is_nil(eerr)
                test.eq(#events, 6)
                test.eq((events[1] :: any).event_type, "artifact")

                local first_page, page_err = reader.event_page(db, journal_id, { limit = 2 })
                test.is_nil(page_err)
                test.eq(#first_page.events, 2)
                test.is_true(first_page.has_more)
                test.eq(first_page.next_before_seq, 5)
                local second_page, second_err = reader.event_page(db, journal_id, { limit = 2, before_seq = first_page.next_before_seq })
                test.is_nil(second_err)
                test.eq(#second_page.events, 2)
                test.eq(second_page.events[1].seq, 4)
                local one, one_err = reader.get_event(db, journal_id, "e1")
                test.is_nil(one_err)
                test.eq(one.id, "e1")

                local delta, delta_err = reader.event_delta(db, journal_id, { after_seq = 2, limit = 2 })
                test.is_nil(delta_err)
                test.eq(#delta.events, 2)
                test.eq(delta.events[1].seq, 3)
                test.eq(delta.next_after_seq, 4)
                test.is_true(delta.has_more)
                local related, related_err = reader.related_delta(db, journal_id, 2, 4)
                test.is_nil(related_err)
                test.eq(#related.tasks, 1)
                test.eq(related.tasks[1].id, "t1")
                test.eq(#related.artifacts, 0)

                local tasks, terr = reader.list_tasks(db, journal_id, { limit = 10 })
                test.is_nil(terr)
                test.eq(#tasks, 1)
                test.eq((tasks[1] :: any).title, "Add vector search")
                local active_tasks, active_err = reader.list_tasks(db, journal_id, { status = "active", query = "vector", limit = 10 })
                test.is_nil(active_err)
                test.eq(#active_tasks, 1)

                local artifacts, aerr = reader.list_artifacts(db, journal_id, { limit = 10 })
                test.is_nil(aerr)
                test.eq(#artifacts, 1)
                test.eq((artifacts[1] :: any).upload_id, "u1")

                local matches, merr = reader.search_text(db, journal_id, "KickSide live reloads", 10)
                test.is_nil(merr)
                test.eq(#matches, 1)
                test.eq((matches[1] :: any).id, "e1")
                local observed_at = tonumber((matches[1] :: any).ts) or 0
                local temporally_scoped, scoped_err = reader.search_text(db, journal_id,
                    "KickSide live reloads", 10,
                    { from_time = observed_at, to_time = observed_at })
                test.is_nil(scoped_err)
                test.eq(#temporally_scoped, 1)
                local too_new, too_new_err = reader.search_text(db, journal_id,
                    "KickSide live reloads", 10, { from_time = observed_at + 1 })
                test.is_nil(too_new_err)
                test.eq(#too_new, 0, "text recall ignored its temporal lower bound")
            end)
        end)

        test.it("materializes and text-searches every declared Journal event type with its durable fields and links", function()
            local journal_id = "journal-all-event-search"
            local cases = {
                { types.EVENT.ENTRY_APPENDED, { id = "entry", event_type = "decision", title = "Entry title", body = "needle-entry-body", tags = { "needle-entry-tag" }, linked_file_paths = { "/work/needle-entry-path.lua" }, linked_component_ids = { "component:needle-entry" }, linked_upload_ids = { "upload:needle-entry" }, linked_task_ids = { "task:needle-entry" }, metadata = { marker = "needle-entry-metadata" } }, "needle-entry-path", "entry" },
                { types.EVENT.TASK_UPSERTED, { id = "task-update", task_id = "task-1", title = "Task title", description = "needle-task-description", status = "open" }, "needle-task-description", "task-update" },
                { types.EVENT.TASK_CLOSED, { id = "task-close", task_id = "task-1", title = "Task close", body = "needle-task-close", status = "done" }, "needle-task-close", "task-close" },
                { types.EVENT.DIGEST_UPDATED, { id = "digest", body = "needle-digest-body" }, "needle-digest-body", "digest" },
                { types.EVENT.CHECKPOINT_CREATED, { id = "checkpoint", title = "Checkpoint", body = "needle-checkpoint-body" }, "needle-checkpoint-body", "checkpoint" },
                { types.EVENT.ARTIFACT_LINKED, { id = "artifact", artifact_id = "artifact-1", title = "Artifact", summary = "needle-artifact-summary", file_path = "/work/needle-artifact.txt" }, "needle-artifact-summary", "artifact" },
                { types.EVENT.GRAPH_CONFIG_REQUESTED, { id = "graph-config", request_id = "graph-config-request", graph_id = "architecture", title = "Architecture", description = "needle-graph-configuration" }, "needle-graph-configuration", "graph-config" },
                { types.EVENT.GRAPH_OPS_REQUESTED, { id = "graph-ops", request_id = "graph-ops-request", graph_id = "architecture", origin = "human", operations = {{ op = "node.add", id = "node-1", label = "needle-graph-operation" }} }, "needle-graph-operation", "graph-ops" },
            }
            local events = {}
            for _, case in ipairs(cases) do events[#events + 1] = ev(case[1], case[2]) end
            local _, project_err = fold(journal_id, events, #events)
            test.is_nil(project_err)

            with_db(function(db)
                local materialized, list_err = reader.list_events(db, journal_id, { limit = 20 })
                test.is_nil(list_err)
                test.eq(#materialized, #cases)
                for _, case in ipairs(cases) do
                    local matches, search_err = reader.search_text(db, journal_id, case[3], 10)
                    test.is_nil(search_err)
                    test.eq(#matches, 1, "missing text-search result for " .. case[4])
                    test.eq((matches[1] :: any).id, case[4])
                end
            end)
        end)

        test.it("supports semantic ranking over stored event embeddings without requiring a live embedder", function()
            local journal_id = "journal-vector-search"
            local _, err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "stats", event_type = "note", title = "Statistical model", body = "Linear regression, residuals, and confidence intervals." }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "ui", event_type = "note", title = "Renderer cleanup", body = "Reduce clutter and improve responsive panels." }),
            }, 2)
            test.is_nil(err)

            with_db(function(db)
                test.is_nil(embeddings.upsert(db, journal_id, "stats", vector(1, 0), types.EMBEDDING_MODEL, types.EMBEDDING_DIMENSIONS, types.EMBEDDING_MODEL_VERSION))
                test.is_nil(embeddings.upsert(db, journal_id, "ui", vector(0, 1), types.EMBEDDING_MODEL, types.EMBEDDING_DIMENSIONS, types.EMBEDDING_MODEL_VERSION))
                local matches, merr = embeddings.search(db, journal_id, vector(0.98, 0.02), 2)
                test.is_nil(merr)
                test.eq(#matches, 2)
                test.eq((matches[1] :: any).id, "stats")
                test.eq(((matches[1] :: any).distance or 999) < ((matches[2] :: any).distance or 999), true)
                local observed_at = tonumber((matches[1] :: any).ts) or 0
                local too_new, time_err = embeddings.search(db, journal_id,
                    vector(0.98, 0.02), 2, nil, nil, { from_time = observed_at + 1 })
                test.is_nil(time_err)
                test.eq(#too_new, 0, "semantic recall ignored its temporal lower bound")
            end)
        end)

        test.it("defaults recall to current facts while preserving complete superseded and retracted history", function()
            local journal_id = "journal-retrieval-validity"
            local _, err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "old", event_type = "decision",
                    title = "Validity needle", body = "The first design boundary." }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "current", event_type = "decision",
                    title = "Validity needle", body = "The corrected design boundary.",
                    supersedes_event_id = "old" }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "withdrawn", event_type = "finding",
                    title = "Validity needle", body = "A withdrawn claim.",
                    metadata = { lifecycle = "retracted" } }),
            }, 3)
            test.is_nil(err)

            with_db(function(db)
                local current, current_err = reader.search_text(db, journal_id, "Validity needle", 10)
                test.is_nil(current_err)
                test.eq(#current, 1)
                test.eq(current[1].id, "current")
                test.eq(current[1].effective_state, "active")

                local all, all_err = reader.search_text(db, journal_id, "Validity needle", 10,
                    { validity = "all" })
                test.is_nil(all_err)
                test.eq(#all, 3)
                local by_id: any = {}
                for _, item in ipairs(all) do by_id[tostring((item :: any).id)] = item end
                test.eq(by_id.old.effective_state, "superseded")
                test.eq(by_id.old.superseded_by_event_id, "current")
                test.eq(by_id.withdrawn.effective_state, "retracted")

                local superseded, superseded_err = reader.search_text(db, journal_id,
                    "Validity needle", 10, { validity = "superseded" })
                test.is_nil(superseded_err)
                test.eq(#superseded, 1)
                test.eq(superseded[1].id, "old")

                for _, id in ipairs({ "old", "current", "withdrawn" }) do
                    test.is_nil(embeddings.upsert(db, journal_id, id, vector(1, 0), types.EMBEDDING_MODEL, types.EMBEDDING_DIMENSIONS, types.EMBEDDING_MODEL_VERSION))
                end
                local semantic_current, semantic_current_err = embeddings.search(db, journal_id,
                    vector(1, 0), 10)
                test.is_nil(semantic_current_err)
                test.eq(#semantic_current, 1)
                test.eq(semantic_current[1].id, "current")
                local semantic_all, semantic_all_err = embeddings.search(db, journal_id,
                    vector(1, 0), 10, nil, nil, { validity = "all" })
                test.is_nil(semantic_all_err)
                test.eq(#semantic_all, 3)
            end)
        end)

        test.it("uses sqlite-vec partitions for journal-scoped model-version top-k", function()
            local current_journal = "journal-native-vector"
            local other_journal = "journal-native-vector-other"
            local _, current_err = fold(current_journal, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "stats-native", event_type = "observation",
                    title = "Statistical runtime", body = "Regression residual analysis." }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "ui-native", event_type = "observation",
                    title = "Interface cleanup", body = "Panel rendering and layout." }),
            }, 2)
            test.is_nil(current_err)
            local _, other_err = fold(other_journal, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "other-native", event_type = "observation",
                    title = "Other journal", body = "Must never leak across the vector partition." }),
            }, 1)
            test.is_nil(other_err)
            local x, y = {}, {}
            for index = 1, types.EMBEDDING_DIMENSIONS do
                x[index] = index == 1 and 1 or 0
                y[index] = index == 2 and 1 or 0
            end
            with_db(function(db)
                test.is_nil(embeddings.upsert(db, current_journal, "stats-native", x,
                    "test-native", types.EMBEDDING_DIMENSIONS, "v1"))
                test.is_nil(embeddings.upsert(db, current_journal, "ui-native", y,
                    "test-native", types.EMBEDDING_DIMENSIONS, "v1"))
                test.is_nil(embeddings.upsert(db, current_journal, "stats-native", y,
                    "test-native", types.EMBEDDING_DIMENSIONS, "old"))
                test.is_nil(embeddings.upsert(db, other_journal, "other-native", x,
                    "test-native", types.EMBEDDING_DIMENSIONS, "v1"))
                local matches, search_err = embeddings.search(db, current_journal, x, 10,
                    "test-native", "v1")
                test.is_nil(search_err)
                test.eq(#matches, 2)
                test.eq((matches[1] :: any).id, "stats-native")
                for _, match in ipairs(matches) do
                    test.is_false((match :: any).id == "other-native", "cross-journal vector leaked")
                end
                local old, old_err = embeddings.search(db, current_journal, y, 10,
                    "test-native", "old")
                test.is_nil(old_err)
                test.eq(#old, 1)
                test.eq((old[1] :: any).id, "stats-native")
            end)
        end)

        test.it("writes native embeddings through the transactional executor used by the worker", function()
            local journal_id = "journal-native-vector-transaction"
            local _, project_err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "transactional-native", event_type = "observation",
                    title = "Transactional embedding", body = "The worker writes its batch atomically." }),
            }, 1)
            test.is_nil(project_err)

            with_db(function(db)
                local vector = {}
                for index = 1, types.EMBEDDING_DIMENSIONS do
                    vector[index] = index == 1 and 1 or 0
                end
                local tx, begin_err = db:begin()
                test.is_nil(begin_err)
                test.not_nil(tx)
                local write_err = embeddings.upsert(tx, journal_id, "transactional-native", vector,
                    "test-native", types.EMBEDDING_DIMENSIONS, "v1")
                if write_err then tx:rollback() end
                test.is_nil(write_err)
                if not write_err then
                    local _, commit_err = tx:commit()
                    test.is_nil(commit_err)
                end

                local matches, search_err = embeddings.search(db, journal_id, vector, 10,
                    "test-native", "v1")
                test.is_nil(search_err)
                test.eq(#matches, 1)
                test.eq((matches[1] :: any).id, "transactional-native")
            end)
        end)

        test.it("treats an exact projector retry as a no-op and rejects event-id payload collisions", function()
            local journal_id = "journal-event-dedupe"
            local original = ev(types.EVENT.ENTRY_APPENDED, {
                event_id = "immutable-id", event_type = "decision", title = "Original", body = "Pinned payload", ts = 100,
            })
            local _, first_err = fold(journal_id, { original }, 1)
            test.is_nil(first_err)
            local before_seq = 0
            with_db(function(db)
                local rows, err = ops.query(db, 
                    "SELECT seq FROM chestor_journal_events WHERE journal_id = ? AND id = ?",
                    { journal_id, "immutable-id" })
                test.is_nil(err)
                before_seq = tonumber(rows[1].seq) or 0
            end)
            local _, replay_err = fold(journal_id, { original }, 1)
            test.is_nil(replay_err)
            with_db(function(db)
                local rows, err = ops.query(db, 
                    "SELECT COUNT(*) AS n, MAX(seq) AS seq FROM chestor_journal_events WHERE journal_id = ?",
                    { journal_id })
                test.is_nil(err)
                test.eq(tonumber(rows[1].n), 1)
                test.eq(tonumber(rows[1].seq), before_seq)
            end)
            local _, collision_err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, {
                    event_id = "immutable-id", event_type = "decision", title = "Changed", body = "Different payload", ts = 100,
                }),
            }, 1)
            test.not_nil(collision_err)
            test.is_true(tostring(collision_err):find("event id collision", 1, true) ~= nil)
        end)

        test.it("materializes task updates, terminal closure, metadata, and sort order", function()
            local journal_id = "journal-task-lifecycle"
            local _, err = fold(journal_id, {
                ev(types.EVENT.TASK_UPSERTED, { event_id = "task-create", task_id = "task-1", title = "Profile variables", status = "open", priority = "high", sort_order = 20, metadata = { source = "csv" } }),
                ev(types.EVENT.TASK_UPSERTED, { event_id = "task-update", task_id = "task-1", title = "Profile all variables", status = "blocked", sort_order = 10, metadata = { reason = "missing dictionary" } }),
                ev(types.EVENT.TASK_CLOSED, { event_id = "task-close", task_id = "task-1", title = "Profile all variables", status = "done", sort_order = 10 }),
            }, 3)
            test.is_nil(err)

            with_db(function(db)
                local tasks, terr = reader.list_tasks(db, journal_id, { limit = 10 })
                test.is_nil(terr)
                test.eq(#tasks, 1)
                local task = tasks[1] :: any
                test.eq(task.id, "task-1")
                test.eq(task.title, "Profile all variables")
                test.eq(task.status, "done")
                test.eq(task.priority, "high")
                test.eq(tonumber(task.sort_order), 10)
                test.eq(task.closed_event_id, "task-close")
                test.eq(type(task.metadata), "table")
            end)
        end)

        test.it("upserts artifacts by artifact id instead of duplicating public evidence rows", function()
            local journal_id = "journal-artifact-upsert"
            local _, err = fold(journal_id, {
                ev(types.EVENT.ARTIFACT_LINKED, { event_id = "artifact-create", artifact_id = "plot-1", kind = "plot", title = "Raw plot", upload_id = "upload-old", metadata = { format = "png" } }),
                ev(types.EVENT.ARTIFACT_LINKED, { event_id = "artifact-update", artifact_id = "plot-1", kind = "plot", title = "Clean plot", upload_id = "upload-new", url = "/public/plot-1.png" }),
            }, 2)
            test.is_nil(err)

            with_db(function(db)
                local artifacts, aerr = reader.list_artifacts(db, journal_id, { limit = 10 })
                test.is_nil(aerr)
                test.eq(#artifacts, 1)
                local artifact = artifacts[1] :: any
                test.eq(artifact.id, "plot-1")
                test.eq(artifact.event_id, "artifact-update")
                test.eq(artifact.title, "Clean plot")
                test.eq(artifact.upload_id, "upload-new")
                test.eq(artifact.url, "/public/plot-1.png")
            end)
        end)

        test.it("keeps pending and legacy failed embeddings retryable until a background job succeeds", function()
            local journal_id = "journal-embedding-states"
            local _, err = fold(journal_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "pending", event_type = "note", title = "Needs embedding", body = "Search me later." }),
                ev(types.EVENT.ENTRY_APPENDED, { id = "skipped", event_type = "note", title = "No embedding", body = "Explicitly skipped.", embed = false }),
            }, 2)
            test.is_nil(err)

            with_db(function(db)
                local pending, perr = reader.pending_embeddings(db, journal_id, 10)
                test.is_nil(perr)
                test.eq(#pending, 1)
                test.eq((pending[1] :: any).id, "pending")

                test.is_nil(embeddings.upsert(db, journal_id, "pending", vector(0.1, 0.2), types.EMBEDDING_MODEL, types.EMBEDDING_DIMENSIONS, types.EMBEDDING_MODEL_VERSION))
                local legacy_err = ops.exec(db, 
                    "UPDATE chestor_journal_events SET embedding_status = 'failed' WHERE journal_id = ? AND id = ?",
                    { journal_id, "skipped" })
                test.is_nil(legacy_err)

                local retryable, retry_err = reader.pending_embeddings(db, journal_id, 10)
                test.is_nil(retry_err)
                test.eq(#retryable, 1)
                test.eq((retryable[1] :: any).id, "skipped")

                local events, eerr = reader.list_events(db, journal_id, { limit = 10 })
                test.is_nil(eerr)
                local by_id = {}
                for _, row in ipairs(events) do by_id[(row :: any).id] = row end
                test.eq((by_id.pending :: any).embedding_status, "embedded")
                test.eq((by_id.skipped :: any).embedding_status, "failed")
            end)
        end)

        test.it("enqueues background embedding work under its owning thread", function()
            local captured: any = nil
            local previous = embedding_scheduler._jobs
            embedding_scheduler._jobs = {
                enqueue = function(params: any): (any, nil)
                    captured = params
                    return { id = "embedding-job" }, nil
                end,
            }
            local err = embedding_scheduler.schedule("journal-owned", 17)
            embedding_scheduler._jobs = previous

            test.is_nil(err)
            test.not_nil(captured)
            test.eq(captured.namespace, "thread")
            test.eq(captured.scope, "journal-owned")
            test.eq(captured.key, "journal-embedding:journal-owned")
            test.is_true(captured.slot == true)
            test.is_true(captured.demand == true)
            test.eq(captured.thread_id, "journal-owned")
            test.eq(captured.owner_locator.kind, "thread")
            test.eq(captured.owner_locator.id, "journal-owned")
            test.eq(captured.job_type, "chestor.journal.embedding:worker")
            test.eq(captured.immutable_payload.journal_id, "journal-owned")
            test.is_nil(captured.actor_id)
            test.is_nil(captured.actor_context)
            test.is_nil(captured.worker_ref)
        end)

        test.it("keeps text search scoped to a single journal id", function()
            local left_id = "journal-search-left"
            local right_id = "journal-search-right"
            local _, lerr = fold(left_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "left-only", event_type = "note", title = "Shared phrase", body = "alpha-beta scoped result" }),
            }, 1)
            test.is_nil(lerr)
            local _, rerr = fold(right_id, {
                ev(types.EVENT.ENTRY_APPENDED, { id = "right-only", event_type = "note", title = "Shared phrase", body = "alpha-beta scoped result" }),
            }, 1)
            test.is_nil(rerr)

            with_db(function(db)
                local left, lsearch = reader.search_text(db, left_id, "alpha-beta", 10)
                test.is_nil(lsearch)
                test.eq(#left, 1)
                test.eq((left[1] :: any).id, "left-only")

                local right, rsearch = reader.search_text(db, right_id, "alpha-beta", 10)
                test.is_nil(rsearch)
                test.eq(#right, 1)
                test.eq((right[1] :: any).id, "right-only")
            end)
        end)

        test.it("projects JSON string event bodies into normalized journal tables", function()
            local journal_id = "journal-json-body"
            local body = '{"id":"json-entry","event_type":"observation","title":"JSON Body","body":"Decoded before projection.","tags":["json"]}'
            local out, err = fold(journal_id, {
                { type = types.EVENT.ENTRY_APPENDED, body = body },
            }, 1)
            test.is_nil(err)
            test.eq((out :: any).last_seq, 1)

            with_db(function(db)
                local events, eerr = reader.list_events(db, journal_id, { limit = 10 })
                test.is_nil(eerr)
                test.eq(#events, 1)
                test.eq((events[1] :: any).id, "json-entry")
                test.eq((events[1] :: any).event_type, "observation")
                test.eq((events[1] :: any).tags[1], "json")
            end)
        end)

        test.it("keeps independent durable agent cursors, bounded episodes, audit coverage, and child integration", function()
            local journal_id = "journal-agent-cursors"
            local started = 2000000000
            local events = {
                ev(types.EVENT.TASK_UPSERTED, { event_id = "task-root", task_id = "root", title = "Two month project", status = "open", ts = started }),
                ev(types.EVENT.TASK_UPSERTED, { event_id = "task-leaf", task_id = "leaf", parent_task_id = "root", title = "Deep audit", status = "open", ts = started + 1 }),
                ev(types.EVENT.CURSOR_UPDATED, {
                    event_id = "cursor-a-open", cursor_id = "cursor-a", agent_id = "agent-a", op = "open",
                    revision = 1, task_id = "leaf", episode_id = "episode-a1", episode_deadline = started + 28800,
                    purpose = "Audit the deep branch", why = "delegated by root", last_seen_seq = 0, ts = started + 2,
                }),
                ev(types.EVENT.CURSOR_UPDATED, {
                    event_id = "cursor-b-open", cursor_id = "cursor-b", agent_id = "agent-b", op = "open",
                    revision = 1, task_id = "root", episode_id = "episode-b1", episode_deadline = started + 14400,
                    purpose = "Integrate child work", last_seen_seq = 1, ts = started + 3,
                }),
                ev(types.EVENT.CURSOR_UPDATED, {
                    event_id = "cursor-a-checkpoint", cursor_id = "cursor-a", agent_id = "agent-a", op = "checkpoint",
                    revision = 2, task_id = "leaf", episode_id = "episode-a1", last_seen_seq = 4,
                    checkpoint = { completed = { "inventory" }, blockers = { "missing oracle" }, next_actions = { "verify" } },
                    ts = started + 4,
                }),
                ev(types.EVENT.CURSOR_UPDATED, {
                    event_id = "cursor-a-stale", cursor_id = "cursor-a", agent_id = "agent-a", op = "move",
                    revision = 1, task_id = "root", episode_id = "episode-a1", last_seen_seq = 99,
                    ts = started + 5,
                }),
                ev(types.EVENT.AUDIT_COVERAGE_RECORDED, {
                    event_id = "coverage-clean", audit_task_id = "leaf", task_id = "leaf", unit_key = "analysis/parser",
                    status = "checked_clean", method = "file review", cursor_id = "cursor-a", episode_id = "episode-a1",
                    evidence_event_ids = { "cursor-a-checkpoint" }, source_revision = "abc123", ts = started + 6,
                }),
                ev(types.EVENT.AUDIT_COVERAGE_RECORDED, {
                    event_id = "coverage-gap", audit_task_id = "leaf", task_id = "leaf", unit_key = "analysis/runtime",
                    status = "gap", method = "tests timed out", cursor_id = "cursor-a", episode_id = "episode-a1",
                    evidence_event_ids = {}, source_revision = "abc123", ts = started + 7,
                }),
                ev(types.EVENT.INTEGRATION_RECORDED, {
                    event_id = "integration-pending", receipt_id = "integration-1", parent_cursor_id = "cursor-b",
                    child_cursor_id = "cursor-a", task_id = "leaf", disposition = "pending",
                    source_from_seq = 3, source_to_seq = 7, evidence_event_ids = { "coverage-clean", "coverage-gap" },
                    coverage = { checked_clean = 1, gap = 1 }, unresolved = { "analysis/runtime" }, ts = started + 8,
                }),
                ev(types.EVENT.INTEGRATION_RECORDED, {
                    event_id = "integration-accepted", receipt_id = "integration-1", parent_cursor_id = "cursor-b",
                    child_cursor_id = "cursor-a", task_id = "leaf", disposition = "accepted",
                    source_from_seq = 3, source_to_seq = 8, evidence_event_ids = { "coverage-clean", "coverage-gap" },
                    coverage = { checked_clean = 1, gap = 1 }, unresolved = { "analysis/runtime" },
                    summary = "Parent accepted the audit with one explicit gap", ts = started + 9,
                }),
            }
            local _, err = fold(journal_id, events, #events)
            test.is_nil(err)
            -- Projection retry must not duplicate cursor episodes, coverage, or
            -- the immutable integration receipt.
            local _, replay_err = fold(journal_id, events, #events)
            test.is_nil(replay_err)

            with_db(function(db)
                local a, aerr = cursors.get(db, journal_id, "cursor-a")
                test.is_nil(aerr)
                test.not_nil(a)
                test.eq((a :: any).current_task_id, "leaf")
                test.eq((a :: any).revision, 2)
                test.eq((a :: any).last_seen_seq, 4)
                test.eq((a :: any).updated_event_id, "cursor-a-checkpoint")
                test.eq(((a :: any).checkpoint.blockers or {})[1], "missing oracle")

                local b, berr = cursors.get(db, journal_id, "cursor-b")
                test.is_nil(berr)
                test.eq((b :: any).current_task_id, "root")
                test.eq((b :: any).last_seen_seq, 1)

                local episode, eerr = cursors.episode(db, journal_id, "episode-a1")
                test.is_nil(eerr)
                test.eq((episode :: any).deadline_at, started + 28800)
                test.eq(((episode :: any).checkpoint.next_actions or {})[1], "verify")

                local coverage, cerr = cursors.audit_coverage(db, journal_id, "leaf")
                test.is_nil(cerr)
                test.eq((coverage :: any).total, 2)
                test.eq((coverage :: any).counts.checked_clean, 1)
                test.eq((coverage :: any).counts.gap, 1)

                local integrations, ierr = cursors.integrations(db, journal_id, "cursor-b")
                test.is_nil(ierr)
                test.eq(#integrations, 1)
                test.eq((integrations[1] :: any).disposition, "accepted")
                test.eq(((integrations[1] :: any).unresolved or {})[1], "analysis/runtime")
                test.eq(tonumber((integrations[1] :: any).recorded_seq), #events)
            end)
        end)

        test.it("rejects projection calls that do not identify a journal thread", function()
            local out, err = projector.run({ projection = { body = {} }, events = {} }, {
                set_meta = function(): (boolean, nil) return true, nil end,
            })
            test.is_nil(out)
            test.not_nil(err)
            test.eq(tostring(err):find("missing thread_id", 1, true) ~= nil, true)
        end)

        test.it("publishes real projection statistics without mutating event bodies", function()
            local body: any = {
                id = "immutable-entry",
                event_type = "decision",
                title = "Keep reads passive",
                body = "The projection runner exclusively advances the cursor.",
                tags = { "projection" },
            }
            local captured_id = ""
            local captured_meta: any = nil
            local out, err = projector.run({
                thread_id = "journal-public-meta",
                projection = { body = {} },
                events = { ev(types.EVENT.ENTRY_APPENDED, body) },
                range = { to_seq = 1 },
            }, {
                set_meta = function(id: string, fields: any): (boolean, nil)
                    captured_id = id
                    captured_meta = fields
                    return true, nil
                end,
            })
            test.is_nil(err)
            test.not_nil(out)
            test.eq(captured_id, "journal-public-meta")
            test.eq(captured_meta.status, "ready")
            test.eq(captured_meta.event_count, 1)
            test.eq(captured_meta.last_seq, 1)
            test.eq(type(captured_meta.last_event_at), "string")
            test.eq(body.id, "immutable-entry")
            test.eq(body.event_id, nil)
            test.eq(body.tags[1], "projection")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

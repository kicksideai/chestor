local test = require("test")
local sql = require("sql")
local types = require("types")
local projector = require("projector")
local assembly = require("assembly")
local deriver = require("deriver")
local refine = require("refine")
local facts = require("facts")
local reader = require("reader")
local writer = require("writer")
local ops = require("ops")

-- Automatic map assembly. Every rule here reads a field the fact already
-- carries and turns it into a relation, so these cases pin what the map is
-- expected to know about itself without anyone drawing a line by hand.
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
        return "failed to begin derivation test transaction: " .. tostring(begin_err)
    end
    local project_err = projector.project_events(tx, journal_id, events)
    if project_err then
        tx:rollback()
        return project_err
    end
    local _, commit_err = tx:commit()
    if commit_err then
        return "failed to commit derivation test transaction: " .. tostring(commit_err)
    end
    return nil
end

local function event(seq: number, kind: string, body: any): any
    return { seq = seq, type = kind, body = body }
end

local function fact(seq: number, body: any): any
    return event(seq, types.EVENT.ENTRY_APPENDED, body)
end

local function edge_set(handle: any, journal_id: string, graph_id: string): any
    local rows, err = ops.query(handle, [[
        SELECT id, from_node_id, to_node_id, edge_kind, origin, metadata
          FROM chestor_journal_graph_edges
         WHERE journal_id = ? AND graph_id = ?
         ORDER BY id ASC
    ]], { journal_id, graph_id })
    test.is_nil(err)
    local out: any = {}
    for _, raw in ipairs(rows or {}) do
        local row = raw :: any
        out[tostring(row.id)] = {
            from = tostring(row.from_node_id),
            to = tostring(row.to_node_id),
            kind = tostring(row.edge_kind),
            origin = tostring(row.origin),
            attrs = ops.decode(row.metadata, {}),
        }
    end
    return out
end

local function ids(set: any): { string }
    local out: { string } = {}
    for id, _ in pairs(set :: any) do out[#out + 1] = id end
    table.sort(out)
    return out
end

local function judge_returning(answers: { string }, seen: any): any
    local index = 0
    return function(prompt_text: string): (string?, string?)
        index = index + 1
        (seen :: any).calls = index;
        (seen :: any).prompt = prompt_text
        local answer = answers[index] or answers[#answers]
        if answer == nil then return nil, "no scripted answer" end
        if answer:find("!error", 1, true) == 1 then return nil, answer:sub(7) end
        return answer, nil
    end
end

local function define_tests()
    test.describe("Journal Map Derivation", function()
        test.it("groups projected graph element writes in one Postgres statement", function()
            local writes = 0
            local handle: any = {}
            handle["type"] = function(): (string, nil) return "postgres", nil end
            handle.execute = function(_: any, statement: string, params: any): (any, nil)
                writes = writes + 1
                test.contains(statement, "WITH journal_write_1")
                test.contains(statement, "chestor_journal_graph_changes")
                test.contains(statement, "chestor_journal_graph_evidence")
                return {}, nil
            end
            test.is_nil(writer.upsert_node(handle, "journal", "graph", { id = "node", label = "Node" }, 1,
                "projector", { event_id = "event", seq = 1 }))
            test.eq(writes, 1)
        end)

        test.it("batches graph changes and evidence with bounded writes and propagates errors", function()
            local writes = 0
            local handle: any = {}
            handle["type"] = function(): (string, nil) return "postgres", nil end
            handle.execute = function(): (any, nil) writes = writes + 1; return {}, nil end
            local changes = {}
            local evidence = {}
            for index = 1, 150 do
                changes[index] = { graph_id = "graph", revision = 1, operation = "node.upsert",
                    target_type = "node", target_id = tostring(index), payload = { id = tostring(index) } }
                evidence[index] = { graph_id = "graph", target_type = "node", target_id = tostring(index),
                    event_id = "event", seq = index }
            end
            test.is_nil(writer.add_changes(handle, "journal", changes))
            test.eq(writes, 2)
            test.is_nil(writer.add_evidence_batch(handle, "journal", evidence))
            test.eq(writes, 4)
            handle.execute = function(): (nil, string) return nil, "metadata write refused" end
            test.eq(writer.add_changes(handle, "journal", changes), "metadata write refused")
            test.eq(writer.add_evidence_batch(handle, "journal", evidence), "metadata write refused")
        end)

        test.it("uses one graph snapshot for a structural event with no agent maintenance", function()
            with_db(function(handle)
                test.is_nil(writer.ensure_defaults(handle, "journal-snapshot-reads"))
                local graph, graph_err = reader.graph(handle, "journal-snapshot-reads", "map")
                test.is_nil(graph_err)
                graph.config.maintainer.mode = "deterministic"
                local _, config_err = writer.configure(handle, "journal-snapshot-reads", graph.config)
                test.is_nil(config_err)
                local reads = 0
                local tx, begin_err = handle:begin()
                test.is_nil(begin_err)
                local proxy: any = {}
                proxy["type"] = function(): any return handle:type() end
                proxy.execute = function(_: any, statement: string, params: any): any return tx:execute(statement, params) end
                proxy.query = function(_: any, statement: string, params: any): any
                    if statement:find("SELECT * FROM chestor_journal_graphs WHERE journal_id", 1, true) then reads = reads + 1 end
                    return tx:query(statement, params)
                end
                local err = projector.project_events(proxy, "journal-snapshot-reads", {
                    fact(1, { id = "first", event_type = "observation", title = "Snapshot" }),
                })
                tx:rollback()
                test.is_nil(err)
                test.eq(reads, 1)
            end)
        end)

        test.it("validates both edge endpoints with one read including a self edge", function()
            with_db(function(handle)
                test.is_nil(writer.ensure_defaults(handle, "journal-endpoint-reads"))
                test.is_nil(writer.upsert_node(handle, "journal-endpoint-reads", "map", { id = "one", label = "One" }, 1, "test"))
                local reads = 0
                local proxy: any = {}
                proxy["type"] = function(): any return handle:type() end
                proxy.execute = function(_: any, statement: string, params: any): any return handle:execute(statement, params) end
                proxy.query = function(_: any, statement: string, params: any): any reads = reads + 1; return handle:query(statement, params) end
                test.is_nil(writer.upsert_edge(proxy, "journal-endpoint-reads", "map", { id = "self", from = "one", to = "one" }, 2, "test"))
                test.eq(reads, 1)
                test.not_nil(writer.upsert_edge(proxy, "journal-endpoint-reads", "map", { id = "missing", from = "one", to = "absent" }, 3, "test"))
            end)
        end)

        test.it("returns typed endpoint and automatic-protection errors", function()
            with_db(function(handle)
                test.is_nil(writer.ensure_defaults(handle, "journal-typed-edge-errors"))
                test.is_nil(writer.upsert_node(handle, "journal-typed-edge-errors", "map", {
                    id = "present", label = "Present",
                }, 1, "test"))

                local missing_err = writer.upsert_edge(handle, "journal-typed-edge-errors", "map", {
                    id = "missing-endpoint", from = "present", to = "absent", kind = "related",
                }, 1, "test")
                test.is_true(errors.is(missing_err, errors.NOT_FOUND))
                test.eq(missing_err:details().code, writer.ERROR.ENDPOINTS_MISSING)

                test.is_nil(writer.upsert_edge(handle, "journal-typed-edge-errors", "map", {
                    id = "locked-edge", from = "present", to = "present", kind = "related", locked = true,
                }, 1, "test"))
                local protected_err = writer.remove_edge(handle, "journal-typed-edge-errors", "map", "locked-edge", true)
                test.is_true(errors.is(protected_err, errors.PERMISSION_DENIED))
                test.eq(protected_err:details().code, writer.ERROR.PROTECTED_EDGE)

                local failing: any = {}
                failing["type"] = function(): (string, nil) return "sqlite", nil end
                local database_failure = errors.new({ message = "query access denied", kind = errors.PERMISSION_DENIED })
                failing.query = function(): (nil, any)
                    return nil, database_failure
                end
                local query_err = writer.upsert_edge(failing, "journal-typed-edge-errors", "map", {
                    id = "query-failure", from = "present", to = "present", kind = "related",
                }, 1, "test")
                test.eq(tostring(query_err), tostring(database_failure))
            end)
        end)

        test.it("records fact keys in bounded batches and propagates database failures", function()
            local calls = 0
            local handle: any = {}
            handle["type"] = function(): (string, nil) return "postgres", nil end
            handle.execute = function(_: any, statement: string, params: any): (any, nil)
                calls = calls + 1
                local unbound = statement:find("?", 1, true)
                test.is_nil(unbound)
                return {}, nil
            end
            local keys = {}
            for index = 1, 150 do keys[index] = { key_type = "tag", key_value = tostring(index) } end
            test.is_nil(facts.record(handle, "journal", "graph", "node", 5, keys))
            test.eq(calls, 2)
            handle.execute = function(): (nil, string) return nil, "write refused" end
            test.eq(facts.record(handle, "journal", "graph", "node", 5, keys), "write refused")
        end)

        test.it("finishes graph revisions and counts in one database statement", function()
            local reads = 0
            local writes = 0
            local handle: any = {}
            handle["type"] = function(): (string, nil) return "postgres", nil end
            handle.query = function(): (any, nil) reads = reads + 1; return {{ nodes = 2, edges = 1 }}, nil end
            handle.execute = function(_: any, statement: string, params: any): (any, nil)
                writes = writes + 1
                test.contains(statement, "SELECT COUNT(*)")
                return {}, nil
            end
            test.is_nil(writer.finish_revision(handle, "journal", "graph", 6, 10))
            test.eq(reads, 0)
            test.eq(writes, 1)
        end)

        test.it("links a subtask to its parent task", function()
            local journal_id = "derive-task-hierarchy"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(2, types.EVENT.TASK_UPSERTED, { event_id = "e-parent", id = "parent", title = "Parent" }),
                    event(3, types.EVENT.TASK_UPSERTED, {
                        event_id = "e-child", id = "child", title = "Child", parent_task_id = "parent",
                    }),
                }))
                local edges = edge_set(db, journal_id, "map")
                local id = deriver.edge_id(deriver.RULE.TASK_PARENT, "task:child", "task:parent")
                test.not_nil((edges :: any)[id])
                test.eq((edges :: any)[id].kind, "part_of")
                test.eq((edges :: any)[id].attrs.origin, "derived")
                test.eq((edges :: any)[id].attrs.rule, deriver.RULE.TASK_PARENT)
            end)
        end)

        test.it("attaches a fact to the task it was recorded under", function()
            local journal_id = "derive-attachment"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(2, types.EVENT.TASK_UPSERTED, { event_id = "e-task", id = "task-a", title = "Task A" }),
                    fact(3, {
                        event_id = "finding-1", event_type = "finding", title = "Reads stay bounded",
                        task_id = "task-a",
                    }),
                }))
                local edges = edge_set(db, journal_id, "map")
                local id = deriver.edge_id(deriver.RULE.FACT_TASK, "event:finding-1", "task:task-a")
                test.not_nil((edges :: any)[id])
                test.eq((edges :: any)[id].attrs.rule, deriver.RULE.FACT_TASK)
            end)
        end)

        test.it("draws causation from the fact that caused it", function()
            local journal_id = "derive-causation"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    fact(2, { event_id = "risk-1", event_type = "risk", title = "Projection stalled" }),
                    fact(3, {
                        event_id = "decision-1", event_type = "decision", title = "Restart the runner",
                        causation_id = "risk-1",
                    }),
                }))
                local edges = edge_set(db, journal_id, "map")
                local id = deriver.edge_id(deriver.RULE.CAUSATION, "event:risk-1", "event:decision-1")
                test.not_nil((edges :: any)[id])
                test.eq((edges :: any)[id].kind, "causes")
            end)
        end)

        test.it("chains a correlation to its most recent prior fact only", function()
            local journal_id = "derive-correlation"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    fact(2, { event_id = "obs-1", event_type = "observation", title = "First", correlation_id = "run-7" }),
                    fact(3, { event_id = "obs-2", event_type = "observation", title = "Second", correlation_id = "run-7" }),
                    fact(4, { event_id = "obs-3", event_type = "observation", title = "Third", correlation_id = "run-7" }),
                }))
                local edges = edge_set(db, journal_id, "map")
                local first = deriver.edge_id(deriver.RULE.CORRELATION, "event:obs-1", "event:obs-2")
                local second = deriver.edge_id(deriver.RULE.CORRELATION, "event:obs-2", "event:obs-3")
                local across = deriver.edge_id(deriver.RULE.CORRELATION, "event:obs-1", "event:obs-3")
                test.not_nil((edges :: any)[first])
                test.not_nil((edges :: any)[second])
                test.is_nil((edges :: any)[across])
            end)
        end)

        test.it("supersedes the record it replaces and cites the evidence it names", function()
            local journal_id = "derive-succession"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    fact(2, { event_id = "old", event_type = "decision", title = "Poll the projection" }),
                    fact(3, { event_id = "proof", event_type = "observation", title = "Runner emits updates" }),
                    fact(4, {
                        event_id = "new", event_type = "decision", title = "Subscribe to the projection",
                        supersedes_event_id = "old", evidence_event_ids = { "proof" },
                    }),
                }))
                local edges = edge_set(db, journal_id, "map")
                local supersedes = deriver.edge_id(deriver.RULE.SUPERSEDES, "event:new", "event:old")
                local cites = deriver.edge_id(deriver.RULE.EVIDENCE, "event:new", "event:proof")
                test.not_nil((edges :: any)[supersedes])
                test.eq((edges :: any)[supersedes].kind, "supersedes")
                test.not_nil((edges :: any)[cites])
                test.eq((edges :: any)[cites].kind, "cites")
            end)
        end)

        test.it("records what a decision selected, rejected, and merely considered", function()
            local journal_id = "derive-selection"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    fact(2, { event_id = "opt-a", event_type = "observation", title = "Relational projection" }),
                    fact(3, { event_id = "opt-b", event_type = "observation", title = "Document projection" }),
                    fact(4, { event_id = "opt-c", event_type = "observation", title = "Hybrid projection" }),
                    fact(5, {
                        event_id = "choice", event_type = "decision", title = "Choose the projection shape",
                        selection = {
                            candidate_node_ids = { "event:opt-a", "event:opt-b", "event:opt-c" },
                            selected_node_ids = { "event:opt-a" },
                            rejected_node_ids = { "event:opt-b" },
                            criteria = { "provenance" },
                            rationale = "Indexed temporal reads.",
                        },
                    }),
                }))
                local edges = edge_set(db, journal_id, "map")
                local selected = deriver.edge_id(deriver.RULE.SELECTED, "event:choice", "event:opt-a")
                local rejected = deriver.edge_id(deriver.RULE.REJECTED, "event:choice", "event:opt-b")
                local considered = deriver.edge_id(deriver.RULE.CANDIDATE, "event:opt-c", "event:choice")
                test.not_nil((edges :: any)[selected], "selected edge missing: " .. table.concat(ids(edges), ", "))
                test.eq((edges :: any)[selected].kind, "selects")
                test.not_nil((edges :: any)[rejected])
                test.eq((edges :: any)[rejected].kind, "rejects")
                test.not_nil((edges :: any)[considered])
                test.eq((edges :: any)[considered].kind, "candidate_for")
            end)
        end)

        test.it("replays to the identical edge set", function()
            local journal_id = "derive-idempotent"
            local events = {
                event(2, types.EVENT.TASK_UPSERTED, { event_id = "e-root", id = "root", title = "Root" }),
                event(3, types.EVENT.TASK_UPSERTED, {
                    event_id = "e-leaf", id = "leaf", title = "Leaf", parent_task_id = "root",
                }),
                fact(4, {
                    event_id = "note-1", event_type = "finding", title = "A finding",
                    task_id = "leaf", correlation_id = "run-1",
                }),
                fact(5, {
                    event_id = "note-2", event_type = "finding", title = "A later finding",
                    task_id = "leaf", correlation_id = "run-1", causation_id = "note-1",
                }),
            }
            with_db(function(db)
                test.is_nil(project(db, journal_id, events))
                local first = ids(edge_set(db, journal_id, "map"))
                local replay, replay_err = assembly.derive_all(journal_id, "map", events)
                test.is_nil(replay_err)
                test.not_nil(replay)
                local second = ids(edge_set(db, journal_id, "map"))
                test.eq(table.concat(second, "|"), table.concat(first, "|"))
                test.eq((replay :: any).edges_added, 0)
                test.eq((replay :: any).edges_removed, 0)
                test.is_true(#first >= 4, "replay produced too few relations: " .. table.concat(first, ", "))
            end)
        end)

        test.it("retires a derived edge its rule no longer produces and never touches an authored one", function()
            local journal_id = "derive-reconcile"
            local events = {
                event(2, types.EVENT.TASK_UPSERTED, { event_id = "e-root", id = "root", title = "Root" }),
                event(3, types.EVENT.TASK_UPSERTED, {
                    event_id = "e-leaf", id = "leaf", title = "Leaf", parent_task_id = "root",
                }),
            }
            with_db(function(db)
                test.is_nil(project(db, journal_id, events))
                local tx, begin_err = db:begin()
                test.is_nil(begin_err)
                -- A derived edge whose rule no longer produces it, and an
                -- authored edge over the very same endpoints.
                local stale_id = deriver.edge_id("retired_rule", "task:leaf", "task:root")
                test.is_nil(writer.upsert_edge(tx, journal_id, "map", {
                    id = stale_id, from = "task:leaf", to = "task:root", kind = "related",
                    metadata = { origin = deriver.ORIGIN, rule = "retired_rule" },
                }, 99, deriver.EDGE_ORIGIN))
                test.is_nil(writer.upsert_edge(tx, journal_id, "map", {
                    id = "authored:leaf:root", from = "task:leaf", to = "task:root",
                    kind = "informs", manual = true,
                }, 99, "human"))
                local _, commit_err = tx:commit()
                test.is_nil(commit_err)

                local result, err = assembly.derive_all(journal_id, "map", events)
                test.is_nil(err)
                test.eq((result :: any).edges_removed, 1)
                local edges = edge_set(db, journal_id, "map")
                test.is_nil((edges :: any)[stale_id])
                test.not_nil((edges :: any)["authored:leaf:root"])
                test.eq((edges :: any)["authored:leaf:root"].origin, "human")
                test.not_nil((edges :: any)[deriver.edge_id(deriver.RULE.TASK_PARENT, "task:leaf", "task:root")])
            end)
        end)

        test.it("gives a symmetric suggestion one identity whichever way its endpoints arrive", function()
            local forward = deriver.suggested_edge_id("event:a", "task:b")
            local backward = deriver.suggested_edge_id("task:b", "event:a")
            test.eq(forward, "derived-llm:event:a:task:b")
            test.eq(backward, forward)
        end)

        test.it("never proposes a pair of one record with itself", function()
            local journal_id = "derive-self-pair"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    event(2, types.EVENT.TASK_UPSERTED, { event_id = "e-task", id = "shared", title = "Shared task" }),
                    fact(3, { event_id = "p-1", event_type = "observation", title = "First", task_id = "shared" }),
                    fact(4, { event_id = "p-2", event_type = "observation", title = "Second", task_id = "shared" }),
                }))
                local pairs_found, err = facts.candidate_pairs(db, journal_id, "map", 50)
                test.is_nil(err)
                for _, raw in ipairs(pairs_found :: { any }) do
                    local pair = raw :: any
                    test.is_false(tostring(pair.left_id) == tostring(pair.right_id),
                        "a record was paired with itself: " .. tostring(pair.left_id))
                    test.is_true(tostring(pair.left_id) <= tostring(pair.right_id),
                        "candidate endpoints are not in a stable order")
                    test.is_true(tostring(pair.reason) == "subject" or tostring(pair.reason) == "correlation"
                        or tostring(pair.reason) == "tag" or tostring(pair.reason) == "adjacent",
                        "candidate carried an unnamed reason: " .. tostring(pair.reason))
                end
            end)
        end)

        test.it("generates candidate pairs only from a shared subject, correlation, two tags, or task adjacency", function()
            local journal_id = "derive-candidates"
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    fact(2, {
                        event_id = "c-1", event_type = "observation", title = "One",
                        subject = "Projection runner", tags = { "runner" },
                    }),
                    fact(3, {
                        event_id = "c-2", event_type = "observation", title = "Two",
                        subject = "Projection runner", tags = { "runner" },
                    }),
                    fact(4, {
                        event_id = "c-3", event_type = "observation", title = "Three",
                        subject = "Something else", tags = { "runner" },
                    }),
                }))
                local pairs_found, err = facts.candidate_pairs(db, journal_id, "map", 50)
                test.is_nil(err)
                local seen: any = {}
                for _, raw in ipairs(pairs_found :: { any }) do
                    seen[tostring((raw :: any).left_id) .. "|" .. tostring((raw :: any).right_id)] = true
                end
                test.is_true(seen["event:c-1|event:c-2"] == true, "shared subject did not become a candidate")
                test.is_nil(seen["event:c-1|event:c-3"])
                test.is_true(#(pairs_found :: { any }) <= 50)
            end)
        end)

        test.it("reads only judgments that name a pair, a vocabulary relation, and a confidence", function()
            local malformed = table.concat({
                "Sure! Here are my judgments:",
                '{"pair":1,"related":true,"relation":"invented","confidence":0.9}',
                '{"pair":9,"related":true,"relation":"relates","confidence":0.9}',
                '{"pair":2,"related":"yes","relation":"relates","confidence":0.9}',
                '{"pair":2,"related":true,"relation":"relates","confidence":7}',
                '{"pair":2,"related":true,"relation":"informs","confidence":0.71}',
            }, "\n")
            local parsed, err = refine.parse(malformed, 3)
            test.is_nil(err)
            test.eq(#(parsed :: any).judgments, 1)
            test.eq((parsed :: any).judgments[1].pair, 2)
            test.eq((parsed :: any).judgments[1].relation, "informs")
            test.is_true((parsed :: any).rejected >= 4)

            local unreadable, unreadable_err = refine.parse("I could not decide.", 3)
            test.is_nil(unreadable)
            test.not_nil(unreadable_err)
        end)

        test.it("accepts only confident judgments and never exceeds the per-node cap", function()
            local batch: { any } = {}
            for index = 1, 5 do
                batch[#batch + 1] = { left_id = "hub", right_id = "leaf-" .. tostring(index), reason = "subject" }
            end
            batch[#batch + 1] = { left_id = "hub", right_id = "weak", reason = "tag" }
            local judgments: { any } = {}
            for index = 1, 5 do
                judgments[#judgments + 1] = { pair = index, related = true, relation = "relates",
                    confidence = 0.9 - index * 0.01 }
            end
            judgments[#judgments + 1] = { pair = 6, related = true, relation = "relates", confidence = 0.4 }
            local accepted = refine.accept(batch, judgments, { minimum_confidence = 0.6, max_edges_per_node = 3 })
            test.eq(#accepted, 3)
            for _, edge in ipairs(accepted) do
                test.is_true(tostring((edge :: any).to) ~= "weak", "a judgment below the floor was accepted")
                test.eq((edge :: any).metadata.origin, deriver.ORIGIN_LLM)
            end
        end)

        test.it("survives a judge that never answers by losing only the refine pass", function()
            local seen: any = {}
            local plan, err = refine.plan({
                { left_id = "a", right_id = "b", reason = "subject", left = { label = "A" }, right = { label = "B" } },
            }, { batch_size = 4 }, judge_returning({ "!error:model unavailable" }, seen))
            test.is_nil(plan)
            test.not_nil(err)
            test.eq((seen :: any).calls, 2)
        end)

        test.it("replaces last run's suggested edges and leaves derived and authored edges alone", function()
            local journal_id = "derive-refine"
            local seen: any = {}
            with_db(function(db)
                test.is_nil(project(db, journal_id, {
                    fact(2, {
                        event_id = "s-1", event_type = "observation", title = "Runner backlog",
                        subject = "Projection runner",
                    }),
                    fact(3, {
                        event_id = "s-2", event_type = "observation", title = "Runner recovery",
                        subject = "Projection runner",
                    }),
                }))
                local options = assembly.options({ assembly = { batch_size = 8 } })
                local first, first_err = assembly.refine_all(journal_id, "map", options, {},
                    judge_returning({ '{"pair":1,"related":true,"relation":"informs","confidence":0.9}' }, seen))
                test.is_nil(first_err)
                test.eq((first :: any).suggested_added, 1)
                local edges = edge_set(db, journal_id, "map")
                local suggested = deriver.suggested_edge_id("event:s-1", "event:s-2")
                test.not_nil((edges :: any)[suggested])
                test.eq((edges :: any)[suggested].origin, deriver.EDGE_ORIGIN_LLM)
                test.eq((edges :: any)[suggested].attrs.origin, deriver.ORIGIN_LLM)
                test.eq((edges :: any)[suggested].attrs.confidence, 0.9)

                local second, second_err = assembly.refine_all(journal_id, "map", options, {},
                    judge_returning({ '{"pair":1,"related":false,"relation":"relates","confidence":0.9}' }, seen))
                test.is_nil(second_err)
                test.eq((second :: any).suggested_removed, 1)
                test.is_nil((edge_set(db, journal_id, "map") :: any)[suggested])
            end)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options: any): any
    return run_cases(options)
end

return { run = run }

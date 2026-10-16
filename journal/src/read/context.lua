local types = require("types")
local queries = require("queries")
local health_status = require("health_status")
local db_ops = require("db")
local reader = require("reader")
local cursors = require("cursors")
local graph_reader = require("graph_reader")

local M = {}

local function bounded(value: any, fallback: number, maximum: number): number
    return math.max(1, math.min(math.floor(tonumber(value) or fallback), maximum))
end

function M.pack(journal_id: string, opts: any): (any?, any?)
    opts = type(opts) == "table" and opts or {}
    local state, state_err = queries.state(journal_id)
    if not state then return nil, state_err end
    local events = (state :: any).events or {}
    local recent = {}
    for index = 1, math.min(bounded(opts.tail_limit, 12, 100), #events) do
        recent[#recent + 1] = events[index]
    end

    local open_tasks = {}
    for _, task in ipairs((state :: any).tasks or {}) do
        if not types.TERMINAL_TASK_STATUS[string.lower(tostring((task :: any).status or ""))] then
            open_tasks[#open_tasks + 1] = task
        end
        if #open_tasks >= 20 then break end
    end

    local checkpoint = nil
    for _, item in ipairs(events) do
        if not checkpoint and (item :: any).event_type == "checkpoint" then checkpoint = item end
    end
    local journal_state = (state :: any).journal_state
    local digest = nil
    if type(journal_state) == "table" and tostring((journal_state :: any).digest or "") ~= "" then
        digest = {
            body = (journal_state :: any).digest,
            ts = tonumber((journal_state :: any).digest_updated_at),
        }
    end
    return {
        success = true,
        journal_id = journal_id,
        current_digest = digest,
        latest_checkpoint = checkpoint,
        recent_events = recent,
        active_tasks = open_tasks,
        artifacts = (state :: any).artifacts,
        stats = (state :: any).stats,
        resume_prompt = "Resume from the current digest and latest checkpoint, verify active tasks, then append durable decisions and blockers as work proceeds.",
    }, nil
end

local function find_cursor(journal_id: string, opts: any): (any?, any?, any?, any?)
    local db, db_err = db_ops.open()
    if not db then return nil, nil, nil, db_err end
    local cursor, err
    local cursor_id = db_ops.trim(opts and opts.cursor_id)
    if cursor_id ~= "" then
        cursor, err = cursors.get(db, journal_id, cursor_id)
    else
        local agent_id = db_ops.trim(opts and opts.agent_id)
        if agent_id == "" then db:release(); return nil, nil, nil, errors.new({ message = "cursor_id or agent_id is required", kind = errors.INVALID }) end
        cursor, err = cursors.latest_for_agent(db, journal_id, agent_id)
    end
    if err then db:release(); return nil, nil, nil, err end
    if not cursor then db:release(); return nil, nil, nil, errors.new({ message = "journal cursor not found", kind = errors.NOT_FOUND }) end
    local episode, episode_err = cursors.episode(db, journal_id, db_ops.trim((cursor :: any).current_episode_id))
    if episode_err then db:release(); return nil, nil, nil, episode_err end
    local task_id = db_ops.trim((cursor :: any).current_task_id)
    local coverage: any = { units = {}, counts = {}, total = 0, omitted = 0, has_more = false }
    if task_id ~= "" then
        local coverage_value, coverage_err = cursors.audit_coverage(db, journal_id, task_id, 100)
        if coverage_err then db:release(); return nil, nil, nil, coverage_err end
        coverage = coverage_value
    end
    local integrations, integrations_err = cursors.integrations_page(db, journal_id,
        db_ops.trim((cursor :: any).cursor_id), 100)
    if integrations_err then db:release(); return nil, nil, nil, integrations_err end
    local graph_id = db_ops.trim((cursor :: any).current_graph_id)
    local node_id = db_ops.trim((cursor :: any).current_node_id)
    if graph_id == "" and task_id ~= "" then graph_id = "map"; node_id = "task:" .. task_id end
    local references: any = { items = {}, total = 0, offset = 0, has_more = false }
    local references_err: any? = nil
    if graph_id ~= "" and node_id ~= "" then
        references, references_err = reader.references(db, journal_id, {
            graph_id = graph_id, node_id = node_id, limit = 100,
        })
    end
    local parent: any = nil
    local parent_id = db_ops.trim((cursor :: any).parent_cursor_id)
    if parent_id ~= "" then
        local parent_row, parent_err = cursors.get(db, journal_id, parent_id)
        if parent_err then db:release(); return nil, nil, nil, parent_err end
        if parent_row then
            parent = {
                handle = (parent_row :: any).cursor_id,
                address = { graph_id = (parent_row :: any).current_graph_id,
                    node_id = (parent_row :: any).current_node_id },
                purpose = (parent_row :: any).purpose,
                assignment = (parent_row :: any).assignment,
                checkpoint = (parent_row :: any).checkpoint,
                revision = (parent_row :: any).revision,
            }
        end
    end
    db:release()
    if references_err then return nil, nil, nil, references_err end
    return cursor, episode, { audit = coverage, integrations = integrations,
        references = references, parent = parent,
        address = { graph_id = graph_id, node_id = node_id } }, nil
end

local function episode_state(episode: any): string
    local now = os.time()
    local status = "missing"
    if episode then
        local row: any = episode
        status = tostring(row.state or "active")
        if status == "active" and now > (tonumber(row.deadline_at) or 0) then
            status = "rotation_required"
        end
        row.effective_state = status
        row.remaining_s = math.max(0, (tonumber(row.deadline_at) or now) - now)
    end
    return status
end

local function generic_cursor_context(journal_id: string, cursor: any, episode: any,
    coordination: any, opts: any): (any?, any?)
    local address = (coordination :: any).address or {}
    local graph_id = db_ops.trim((address :: any).graph_id)
    local node_id = db_ops.trim((address :: any).node_id)
    if graph_id == "" or node_id == "" then
        return {
            success = true,
            journal_id = journal_id,
            cursor = cursor,
            episode = episode,
            position = { resolved = "stale_pointer", graph_id = graph_id, node_id = node_id },
            required_action = "move the cursor to a live graph node",
        }, nil
    end
    local path, graph_path, neighbors, read_err = nil, nil, nil, nil
    local attached: { any } = {}
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    path, read_err = graph_reader.path(db, journal_id, graph_id, node_id, {
        depth = bounded(opts.path_limit, 24, 64),
    })
    if not read_err then
        graph_path, read_err = graph_reader.graph_path(db, journal_id, graph_id, {
            depth = bounded(opts.graph_path_limit or opts.path_limit, 24, 64),
        })
    end
    if not read_err then
        neighbors, read_err = graph_reader.neighbors(db, journal_id, graph_id, node_id, {
            limit = bounded(opts.neighbor_limit or opts.limit, 16, 60),
        })
    end
    if not read_err then
        for _, ref in ipairs((cursor :: any).context_refs or {}) do
            local ref_graph = db_ops.trim((ref :: any).graph_id)
            local ref_node = db_ops.trim((ref :: any).node_id)
            local resolved, ref_err = graph_reader.node(db, journal_id, ref_graph, ref_node)
            if not resolved then
                attached[#attached + 1] = {
                    address = { graph_id = ref_graph, node_id = ref_node },
                    load = (ref :: any).load or "summary",
                    required = (ref :: any).required == true,
                    reason = (ref :: any).reason,
                    resolved = false,
                    error = ref_err and tostring(ref_err) or nil,
                }
            else
                local node = (resolved :: any).node or {}
                local mode = db_ops.trim((ref :: any).load)
                local preview: any = {
                    id = (node :: any).id,
                    label = (node :: any).label,
                    kind = (node :: any).kind or (node :: any).node_kind,
                    status = (node :: any).status,
                    ref_id = (node :: any).ref_id,
                    superseded_by = type((node :: any).metadata) == "table"
                        and ((node :: any).metadata :: any).superseded_by or nil,
                }
                if mode ~= "pointer" then preview.summary = (node :: any).summary end
                local item: any = {
                    address = { graph_id = ref_graph, node_id = ref_node },
                    load = mode ~= "" and mode or "summary",
                    required = (ref :: any).required == true,
                    reason = (ref :: any).reason,
                    resolved = true,
                    node = mode == "full" and node or preview,
                }
                if mode ~= "pointer" then
                    local packet, packet_err = graph_reader.context(db, journal_id, ref_graph, {
                        node_id = ref_node,
                        member_limit = bounded(opts.context_member_limit, 24, 60),
                        node_limit = bounded(opts.context_node_limit, 80, 160),
                        edge_limit = bounded(opts.context_edge_limit, 160, 480),
                        depth = bounded(opts.context_depth, 3, 4),
                    })
                    if packet and (#((packet :: any).members or {}) > 0
                        or #((packet :: any).references or {}) > 0) then
                        if mode == "summary" then
                            (packet :: any).nodes = nil
                            (packet :: any).edges = nil
                        end
                        item.packet = packet
                    elseif packet_err and (ref :: any).required == true then
                        item.packet_error = tostring(packet_err)
                    end
                end
                attached[#attached + 1] = item
            end
        end
    end
    db:release()
    if read_err then
        return {
            success = true,
            journal_id = journal_id,
            cursor = cursor,
            episode = episode,
            position = { resolved = "stale_pointer", graph_id = graph_id, node_id = node_id },
            required_action = "move the cursor to a live graph node",
            pointer_error = tostring(read_err),
        }, nil
    end
    local delta, delta_err = queries.changes(journal_id, {
        since_seq = tonumber((cursor :: any).last_seen_seq) or 0,
        scope = "journal",
        limit = bounded(opts.delta_limit, 30, 100),
        exclude_event_types = { "cursor.updated" },
    })
    if not delta then return nil, delta_err end
    local integration_page = (coordination :: any).integrations or { items = {}, total = 0, omitted = 0 }
    local reference_page = (coordination :: any).references or { items = {}, total = 0, omitted = 0 }
    local episode_status = episode_state(episode)
    local chain = (path :: any).path or {}
    local focus = chain[#chain]
    return {
        success = true,
        journal_id = journal_id,
        cursor = cursor,
        episode = episode,
        position = {
            resolved = "node",
            address = { graph_id = graph_id, node_id = node_id },
            node = focus,
            graph_chain = (graph_path :: any).path,
            graph_chain_truncated = (graph_path :: any).truncated == true,
            chain = chain,
            chain_truncated = (path :: any).truncated == true,
        },
        assignment = {
            purpose = (cursor :: any).purpose,
            assignment = (cursor :: any).assignment,
            why = (cursor :: any).why,
            close_requirements = (cursor :: any).close_requirements,
            parent_cursor_id = (cursor :: any).parent_cursor_id,
        },
        parent_context = (coordination :: any).parent,
        attached_context = attached,
        local_context = {
            nodes = (neighbors :: any).nodes,
            edges = (neighbors :: any).edges,
        },
        coordination = {
            integrations = (integration_page :: any).items,
            references = (reference_page :: any).items,
        },
        delta = delta,
        next = {
            checkpoint = {
                op = "checkpoint",
                expected_revision = tonumber((cursor :: any).revision) or 0,
                last_seen_seq = tonumber((delta :: any).next_cursor)
                    or tonumber((cursor :: any).last_seen_seq) or 0,
            },
            rotate = episode_status == "rotation_required" and {
                op = "open",
                expected_revision = tonumber((cursor :: any).revision) or 0,
            } or nil,
        },
        omissions = {
            chain = { returned = #chain, truncated = (path :: any).truncated == true,
                continuation = (path :: any).continuation },
            graph_chain = { returned = #((graph_path :: any).path or {}),
                truncated = (graph_path :: any).truncated == true,
                continuation = (graph_path :: any).continuation },
            neighborhood = { returned = #((neighbors :: any).edges or {}),
                total = tonumber((neighbors :: any).total) or 0,
                omitted = tonumber((neighbors :: any).omitted) or 0,
                continuation = (neighbors :: any).continuation },
            delta = { returned = #((delta :: any).events or {}),
                has_more = (delta :: any).has_more == true,
                continuation = (delta :: any).has_more and {
                    mode = "events", scope = "journal", since_seq = (delta :: any).next_cursor,
                } or nil },
            integrations = { returned = #((integration_page :: any).items or {}),
                total = tonumber((integration_page :: any).total) or 0,
                omitted = tonumber((integration_page :: any).omitted) or 0 },
            references = { returned = #((reference_page :: any).items or {}),
                total = tonumber((reference_page :: any).total) or 0,
                omitted = math.max(0, (tonumber((reference_page :: any).total) or 0)
                    - #((reference_page :: any).items or {})) },
        },
        provenance = {
            authoritative = "component_thread",
            cursor_updated_event_id = (cursor :: any).updated_event_id,
        },
    }, nil
end

local function inherited_governing(journal_id: string, branch: any, limit: number): (any?, any?, any?)
    local db, db_err = db_ops.open()
    if not db then return nil, nil, db_err end
    local ancestors: { string } = {}
    for _, task in ipairs(type(branch.ancestors) == "table" and branch.ancestors or {}) do
        ancestors[#ancestors + 1] = db_ops.trim((task :: any).id)
    end
    local result, read_err = reader.governing_facts(db, journal_id, ancestors, limit)
    db:release()
    if not result then return nil, nil, read_err end
    return result.facts, { total = result.total, omitted = math.max(0, result.total - #result.facts) }, nil
end

-- Cursor is the canonical recovery read. It is intentionally assembled from
-- bounded projection reads: opening it never runs or advances a projector.
function M.cursor(journal_id: string, opts: any): (any?, any?)
    opts = type(opts) == "table" and opts or {}
    local cursor, episode, coordination, cursor_err = find_cursor(journal_id, opts)
    if not cursor then return nil, cursor_err end
    local task_id = db_ops.trim((cursor :: any).current_task_id)
    if task_id == "" then
        return generic_cursor_context(journal_id, cursor, episode, coordination, opts)
    end
    local local_limit = bounded(opts.local_limit or opts.limit, 24, 60)
    local inherited_limit = bounded(opts.inherited_limit, 24, 60)
    local delta_limit = bounded(opts.delta_limit, 50, 100)
    local branch, branch_err = queries.branch(journal_id, task_id, {
        fact_limit = local_limit,
        child_limit = 50,
        dep_limit = 100,
    })
    if not branch then return nil, branch_err end
    if not (branch :: any).task then
        return {
            success = true,
            cursor = cursor,
            episode = episode,
            position = { resolved = "stale_pointer", task_id = task_id },
            required_action = "move the cursor to a live work node",
        }, nil
    end
    local governing, governing_counts, governing_err = inherited_governing(journal_id, branch, inherited_limit)
    if not governing then return nil, governing_err end
    local delta, delta_err = queries.changes(journal_id, {
        since_seq = tonumber((cursor :: any).last_seen_seq) or 0,
        scope = "journal",
        limit = delta_limit,
    })
    if not delta then return nil, delta_err end
    local episode_status = episode_state(episode)
    local facts = (branch :: any).facts or {}
    local fact_total = tonumber((branch :: any).counts and ((branch :: any).counts :: any).facts) or #facts
    local child_total = tonumber((branch :: any).counts and ((branch :: any).counts :: any).children)
        or #((branch :: any).children or {})
    local dependency_counts = type((branch :: any).deps) == "table"
        and ((branch :: any).deps :: any).counts or {}
    local dependency_omitted = type((branch :: any).deps) == "table"
        and ((branch :: any).deps :: any).omitted or {}
    local cross_counts = type((branch :: any).cross_exception_counts) == "table"
        and (branch :: any).cross_exception_counts or { total = #((branch :: any).cross_exceptions or {}), omitted = 0 }
    local coverage = (coordination :: any).audit or { units = {}, total = 0, omitted = 0 }
    local integration_page = (coordination :: any).integrations or { items = {}, total = 0, omitted = 0 }
    local reference_page = (coordination :: any).references or { items = {}, total = 0 }
    local ancestors = (branch :: any).ancestors or {}
    local first_ancestor = ancestors[1]
    local ancestor_truncated = #ancestors >= 32 and first_ancestor
        and db_ops.trim((first_ancestor :: any).parent_task_id) ~= ""
    local omissions = {
        local_facts = {
            returned = #facts,
            total = fact_total,
            omitted = math.max(0, fact_total - #facts),
            continuation = fact_total > #facts and { view = "branch", task_id = task_id, limit = 100 } or nil,
        },
        children = {
            returned = #((branch :: any).children or {}),
            total = child_total,
            omitted = math.max(0, child_total - #((branch :: any).children or {})),
            continuation = child_total > #((branch :: any).children or {})
                and { view = "tree", task_id = task_id, depth = 1, limit = 100 } or nil,
        },
        ancestors = {
            returned = #ancestors,
            truncated = ancestor_truncated == true,
            continuation = ancestor_truncated and { view = "branch", task_id = (first_ancestor :: any).parent_task_id } or nil,
        },
        governing = {
            returned = #governing,
            omitted = (governing_counts :: any).omitted,
            continuation = (governing_counts :: any).omitted > 0
                and { view = "search", query = "governing facts", task_id = task_id } or nil,
        },
        delta = {
            returned = #((delta :: any).events or {}),
            has_more = (delta :: any).has_more == true,
            continuation = (delta :: any).has_more and {
                view = "changes", scope = "journal", since_seq = (delta :: any).next_cursor,
            } or nil,
        },
        dependencies = {
            outgoing_total = tonumber((dependency_counts :: any).outgoing) or 0,
            incoming_total = tonumber((dependency_counts :: any).incoming) or 0,
            outgoing_omitted = tonumber((dependency_omitted :: any).outgoing) or 0,
            incoming_omitted = tonumber((dependency_omitted :: any).incoming) or 0,
            continuation = ((tonumber((dependency_omitted :: any).outgoing) or 0)
                + (tonumber((dependency_omitted :: any).incoming) or 0)) > 0
                and { view = "branch", task_id = task_id, limit = 100 } or nil,
        },
        blockers = {
            returned = #((branch :: any).cross_exceptions or {}),
            total = tonumber((cross_counts :: any).total) or 0,
            omitted = tonumber((cross_counts :: any).omitted) or 0,
        },
        audit = {
            returned = #((coverage :: any).units or {}),
            total = tonumber((coverage :: any).total) or 0,
            omitted = tonumber((coverage :: any).omitted) or 0,
        },
        integrations = {
            returned = #((integration_page :: any).items or {}),
            total = tonumber((integration_page :: any).total) or 0,
            omitted = tonumber((integration_page :: any).omitted) or 0,
        },
        references = {
            returned = #((reference_page :: any).items or {}),
            total = tonumber((reference_page :: any).total) or 0,
            omitted = math.max(0, (tonumber((reference_page :: any).total) or 0)
                - #((reference_page :: any).items or {})),
            continuation = (reference_page :: any).has_more and {
                view = "references",
                graph_id = ((coordination :: any).address :: any).graph_id,
                node_id = ((coordination :: any).address :: any).node_id,
                offset = (reference_page :: any).next_offset,
            } or nil,
        },
    }
    return {
        success = true,
        journal_id = journal_id,
        cursor = cursor,
        episode = episode,
        position = {
            task = (branch :: any).task,
            ancestors = ancestors,
            resolved = (branch :: any).resolved,
        },
        assignment = {
            purpose = (cursor :: any).purpose,
            assignment = (cursor :: any).assignment,
            why = (cursor :: any).why,
            close_requirements = (cursor :: any).close_requirements,
            parent_cursor_id = (cursor :: any).parent_cursor_id,
        },
        governing = governing,
        local_work = {
            facts = facts,
            children = (branch :: any).children,
            latest_checkpoint = (branch :: any).latest_checkpoint,
        },
        coordination = {
            dependencies = (branch :: any).deps,
            blockers = (branch :: any).cross_exceptions,
            integrations = (integration_page :: any).items,
            audit = coverage,
            references = (reference_page :: any).items,
        },
        delta = delta,
        closure = {
            claim = ((branch :: any).task :: any).claim,
            verifier_policy_hash = ((branch :: any).task :: any).verifier_policy_hash,
            receipt_status = (branch :: any).receipt_status,
            receipt_stale_seq = (branch :: any).receipt_stale_seq,
        },
        next = {
            protocol = (branch :: any).next,
            episode = episode_status == "rotation_required"
                and "checkpoint this cursor, then open it again to rotate the episode" or nil,
        },
        omissions = omissions,
        provenance = {
            authoritative = "component_thread",
            generated_sections = {},
            cursor_updated_event_id = (cursor :: any).updated_event_id,
        },
    }, nil
end

-- X6/I6.1: staleness is computed by the reader from heartbeat age, so a dead
-- health writer is detectable by pure absence — unknown within two intervals,
-- no backend cooperation required. Clock is injected for tests. The single
-- implementation lives in chestor.journal.health:status, shared with the
-- health read path.
M.heartbeat_status = health_status.heartbeat_status

function M.check_continuity(journal_id: string, opts: any): (any?, any?)
    local pack, pack_err = M.pack(journal_id, opts)
    if not pack then return nil, pack_err end
    local stats = (pack :: any).stats or {}
    local last_seq = tonumber(stats.last_seq) or 0
    local checkpoint_seq = tonumber((pack :: any).latest_checkpoint and (pack :: any).latest_checkpoint.seq) or 0
    local since = math.max(0, last_seq - checkpoint_seq)
    local ready = (pack :: any).current_digest ~= nil and (checkpoint_seq > 0 or last_seq <= 20)
    return {
        success = true,
        journal_id = journal_id,
        continuity_ok = ready,
        has_digest = (pack :: any).current_digest ~= nil,
        has_checkpoint = (pack :: any).latest_checkpoint ~= nil,
        events_since_checkpoint = since,
        recommendation = ready and "continuity is ready" or "update the digest and create a checkpoint before compaction or handoff",
    }, nil
end

return M

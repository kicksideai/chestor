local config = require("config")
local operations = require("operations")
local structural = require("structural")
local deriver = require("deriver")
local scheduler = require("scheduler")
local hierarchy = require("hierarchy")
local types = require("types")
local db = require("db")
local facts = require("facts")
local reader = require("reader")
local writer = require("writer")

local M = {}

local MAP_GRAPH_ID = "map"

local function trim(value: any): string
    return db.trim(value)
end

local function event_id(raw: any, body: any): string
    local id = trim(body.event_id or body.id)
    if id ~= "" then return id end
    return "seq:" .. tostring(tonumber((raw :: any).seq) or tonumber(body.seq) or 0)
end

local function same_value(left: any, right: any): boolean
    if type(left) ~= type(right) then return false end
    if type(left) ~= "table" then return left == right end
    for key, value in pairs(left :: any) do
        if not same_value(value, (right :: any)[key]) then return false end
    end
    for key, _ in pairs(right :: any) do
        if (left :: any)[key] == nil then return false end
    end
    return true
end

local function write_metadata(value: any, request: any): any
    local metadata: any = {}
    if type(value) == "table" then
        for key, item in pairs(value :: any) do metadata[key] = item end
    end
    metadata.journal_write = {
        request_id = request.request_id,
        origin = request.origin,
        provenance = request.provenance,
        source_event_ids = request.source_event_ids,
    }
    return metadata
end

local function protected_value(current: boolean, patch: any, automatic: boolean): boolean
    if automatic then return current or patch == true end
    if patch == nil then return current end
    return patch == true
end

local function merge_node(row: any, patch: any, request: any, automatic: boolean): any
    local current_metadata = db.decode(row.metadata, {})
    local next_metadata = patch.metadata ~= nil and patch.metadata or current_metadata
    if type(patch.attrs_patch) == "table" then
        next_metadata = type(next_metadata) == "table" and write_metadata(next_metadata, request) or {}
        for key, value in pairs(patch.attrs_patch :: any) do (next_metadata :: any)[key] = value end
    else
        next_metadata = write_metadata(next_metadata, request)
    end
    return {
        id = row.id,
        semantic_key = patch.semantic_key ~= nil and patch.semantic_key or row.semantic_key,
        label = patch.label ~= nil and patch.label or row.label,
        kind = patch.kind ~= nil and patch.kind or row.node_kind,
        summary = patch.summary ~= nil and patch.summary or row.summary,
        status = patch.status ~= nil and patch.status or row.status,
        ref_id = patch.ref_id ~= nil and patch.ref_id or row.ref_id,
        parent_id = patch.parent_id ~= nil and (trim(patch.parent_id) ~= "" and patch.parent_id or nil) or row.parent_id,
        child_count = tonumber(row.child_count) or 0,
        x = patch.x ~= nil and patch.x or row.x,
        y = patch.y ~= nil and patch.y or row.y,
        manual = protected_value(tonumber(row.manual) == 1, patch.manual, automatic),
        pinned = protected_value(tonumber(row.pinned) == 1, patch.pinned, automatic),
        locked = protected_value(tonumber(row.locked) == 1, patch.locked, automatic),
        metadata = next_metadata,
    }
end

-- Structural entity events are deliberately sparse. Merge absent fields from
-- the current projection so a status-only close cannot erase hierarchy,
-- summaries, layout, protection flags, or metadata.
local function merge_structural_node(row: any, patch: any): any
    if not row then
        if trim(patch.label) == "" then patch.label = patch.id end
        return patch
    end
    return {
        id = row.id,
        semantic_key = patch.semantic_key ~= nil and patch.semantic_key or row.semantic_key,
        label = trim(patch.label) ~= "" and patch.label or row.label,
        kind = patch.kind ~= nil and patch.kind or row.node_kind,
        summary = patch.summary ~= nil and patch.summary or row.summary,
        status = patch.status ~= nil and patch.status or row.status,
        ref_id = patch.ref_id ~= nil and patch.ref_id or row.ref_id,
        parent_id = patch.parent_id ~= nil and patch.parent_id or row.parent_id,
        child_count = tonumber(row.child_count) or 0,
        x = patch.x ~= nil and patch.x or row.x,
        y = patch.y ~= nil and patch.y or row.y,
        manual = tonumber(row.manual) == 1 or patch.manual == true,
        pinned = tonumber(row.pinned) == 1 or patch.pinned == true,
        locked = tonumber(row.locked) == 1 or patch.locked == true,
        metadata = patch.metadata ~= nil and patch.metadata or db.decode(row.metadata, {}),
    }
end

local function apply_change(tx: any, journal_id: string, change: any, revision: number, origin: string): error?
    local graph_id = trim(change.graph_id)
    if graph_id == "" then return errors.new({ kind = errors.INTERNAL, message = "projected graph change missing graph_id" }) end
    if change.node then
        local node: any = change.node
        local node_id = trim(node.id)
        if node_id == "" then return errors.new({ kind = errors.INTERNAL, message = "projected graph node missing id" }) end
        if change.merge_existing then
            local current, current_err = writer.node(tx, journal_id, graph_id, node_id)
            if current_err then return current_err end
            if change.existing_only and not current then return nil end
            node = merge_structural_node(current, node)
        end
        return writer.upsert_node(tx, journal_id, graph_id, node, revision, origin,
            { event_id = tostring(change.evidence or ""), seq = tonumber(change.seq) })
    end
    if change.edge then
        local edge: any = change.edge
        local edge_id = trim(edge.id)
        if edge_id == "" then return errors.new({ kind = errors.INTERNAL, message = "projected graph edge missing id" }) end
        local err = writer.upsert_edge(tx, journal_id, graph_id, edge, revision, origin,
            { event_id = tostring(change.evidence or ""), seq = tonumber(change.seq) })
        if err and change.optional and writer.is_error(err, errors.NOT_FOUND, writer.ERROR.ENDPOINTS_MISSING) then return nil end
        return err
    end
    return nil
end

-- The deriver's lookups, bound to this transaction. node_for_event resolves a
-- referenced event to the map node it projected; previous walks the derivation
-- index for the most recent record under a shared key.
local function derivation_port(tx: any, journal_id: string): any
    return {
        node_for_event = function(event_id: string): (string?, error?)
            return writer.node_for_event(tx, journal_id, MAP_GRAPH_ID, event_id)
        end,
        previous = function(key_type: string, key_value: string, seq: number, exclude: string): (string?, error?)
            return facts.previous(tx, journal_id, MAP_GRAPH_ID, key_type, key_value, seq, exclude)
        end,
    }
end

-- Indexes the map nodes this fact projected under every key later derivations
-- chain or cluster on. Recording happens after derivation so a correlation
-- chains to its predecessor rather than to itself.
local function index_facts(tx: any, journal_id: string, changes: any, body: any, source_seq: number): error?
    local nodes = deriver.map_nodes(changes, MAP_GRAPH_ID)
    if #(nodes :: { any }) == 0 then return nil end
    local keys = facts.keys_for(body, trim(body.task_id))
    if #keys == 0 then return nil end
    for _, raw in ipairs(nodes :: { any }) do
        local node = raw :: any
        local err = facts.record(tx, journal_id, MAP_GRAPH_ID, tostring(node.id), source_seq, keys)
        if err then return err end
    end
    return nil
end

local function fold_structural(tx: any, journal_id: string, raw_event: any): error?
    local changes, public_type, body, source_event_id, source_seq = structural.default_changes(raw_event)
    -- Relations the fact already carries become edges in the same pass that
    -- materializes its node, so a map arrives connected rather than as
    -- unrelated records waiting for someone to link them.
    local derived, derive_err = deriver.derive(derivation_port(tx, journal_id), MAP_GRAPH_ID,
        changes, body, source_event_id, source_seq)
    if derive_err then return derive_err end
    for _, item in ipairs(derived :: { any }) do changes[#changes + 1] = item end
    local index_err = index_facts(tx, journal_id, changes, body, source_seq)
    if index_err then return index_err end
    local touched: any = {}
    local snapshots: any = {}
    local skipped: any = {}
    for _, raw_change in ipairs(changes) do
        local change: any = raw_change
        local graph_id = trim(change.graph_id)
        if graph_id == "" then return errors.new({ kind = errors.INTERNAL, message = "projected graph change missing graph_id" }) end
        local applicable = true
        if change.existing_only and change.node then
            local existing, existing_err = writer.node(tx, journal_id, graph_id, tostring(change.node.id or ""))
            if existing_err then return existing_err end
            applicable = existing ~= nil
        end
        if applicable and not touched[graph_id] and not skipped[graph_id] then
            local current, current_err = reader.graph(tx, journal_id, graph_id)
            if not current then return current_err end
            if (tonumber(source_seq) or 0) > 0 and (tonumber(current.last_source_seq) or 0) >= (tonumber(source_seq) or 0) then
                skipped[graph_id] = true
            else
                local revision, revision_err = writer.revision_after(tonumber(current.revision) or 0, nil)
                if not revision then return revision_err end
                touched[graph_id] = revision
                snapshots[graph_id] = current
            end
        end
        if applicable and not skipped[graph_id] then
            local revision = tonumber(touched[graph_id])
            if not revision then return errors.new({ kind = errors.INTERNAL, message = "projected graph revision missing" }) end
            local err = apply_change(tx, journal_id, change, revision, "projector")
            if err then return err end
        end
    end

    local after_id = nil
    while true do
        local page, page_err = reader.active_page(tx, journal_id, { after_id = after_id, limit = 100 })
        if not page then return page_err end
        for _, raw_graph in ipairs(page.graphs or {}) do
            local graph: any = raw_graph
            local graph_id = trim(graph.id)
            if graph_id ~= "map"
                and config.matches(graph.config, tostring(public_type), body.tags) then
                if (tonumber(source_seq) or 0) > 0 and (tonumber(graph.last_source_seq) or 0) >= (tonumber(source_seq) or 0) then
                    skipped[graph_id] = true
                else
                    local revision, revision_err = writer.revision_after(tonumber(graph.revision) or 0, nil)
                    if not revision then return revision_err end
                    local change = structural.configured_change({ graph_id = graph_id }, tostring(public_type), body,
                        tostring(source_event_id), tonumber(source_seq) or 0)
                    local err = apply_change(tx, journal_id, change, revision, "projector")
                    if err then return err end
                    touched[graph_id] = revision
                    snapshots[graph_id] = graph
                end
            end
        end
        if page.has_more ~= true then break end
        local next_after_id = trim(page.next_after_id)
        if next_after_id == "" then return errors.new({ kind = errors.NOT_FOUND, message = "active graph page cursor missing" }) end
        after_id = next_after_id
    end
    for raw_graph_id, raw_revision in pairs(touched) do
        local graph_id = tostring(raw_graph_id)
        local revision = tonumber(raw_revision)
        if not revision then return errors.new({ kind = errors.INTERNAL, message = "projected graph revision missing" }) end
        local err = writer.finish_revision(tx, journal_id, graph_id, revision, tonumber(source_seq))
        if err then return err end
        local schedule_err = scheduler.schedule(tx, journal_id, snapshots[graph_id], tostring(public_type), body.tags,
            tonumber(source_seq) or 0)
        if schedule_err then return schedule_err end
    end
    return nil
end

local function fold_config(tx: any, journal_id: string, raw_event: any): error?
    local body = structural.body(raw_event)
    if trim(body.request_id) == "" then body.request_id = event_id(raw_event, body) end
    local normalized, normalize_err = config.normalize(body)
    if not normalized then return errors.new({ kind = errors.INVALID, message = "invalid graph configuration event: " .. tostring(normalize_err) }) end
    local graph_id = trim(normalized.graph_id)
    local request_id = trim(normalized.request_id)
    if request_id == "" then return errors.new({ kind = errors.INVALID, message = "invalid graph configuration event: request_id is required" }) end
    local existing, existing_err = writer.request(tx, journal_id, request_id)
    if existing_err then return existing_err end
    if existing then
        if not same_value(db.decode(existing.payload_json, {}), normalized) then
            return errors.new({ kind = errors.CONFLICT, message = "graph request id reused with different payload" })
        end
        return nil
    end
    local revision, configure_err = writer.configure(tx, journal_id, normalized)
    if not revision then
        return writer.record_request(tx, journal_id, graph_id, request_id,
            "configuration", normalized, "rejected", tostring(configure_err), nil)
    end
    return writer.record_request(tx, journal_id, graph_id, request_id,
        "configuration", normalized, "applied", nil, revision)
end

local function validate_batch(tx: any, journal_id: string, request: any, automatic: boolean): error?
    local graph_id = trim(request.graph_id)
    local graph, graph_err = writer.graph(tx, journal_id, graph_id)
    if graph_err then return graph_err end
    if not graph then return errors.new({ kind = errors.NOT_FOUND, message = "graph not found: " .. graph_id }) end
    if tostring(graph.lifecycle) == "archived" then return errors.new({ kind = errors.INVALID, message = "archived graph rejects writes" }) end
    if automatic and tostring(graph.lifecycle) == "frozen" then return errors.new({ kind = errors.INVALID, message = "frozen graph rejects automatic writes" }) end
    local current_revision = tonumber(graph.graph_revision) or 0
    if request.expected_revision and request.expected_revision ~= current_revision then
        return errors.new({ kind = errors.CONFLICT, message = "graph revision conflict: expected " .. tostring(request.expected_revision) .. ", current " .. tostring(current_revision) })
    end
    local available = {}
    for _, raw_op in ipairs(request.operations) do
        local op: any = raw_op
        if op.op == "node.add" then available[op.id] = true end
    end
    for _, raw_op in ipairs(request.operations) do
        local op: any = raw_op
        local op_id = trim(op.id)
        if op.op == "node.update" or op.op == "node.remove" or op.op:find("layout.", 1, true) == 1 then
            local row, row_err = writer.node(tx, journal_id, graph_id, op_id)
            if row_err then return row_err end
            if not row and not available[op_id] then return errors.new({ kind = errors.NOT_FOUND, message = "graph node not found: " .. op_id }) end
            if row and automatic and (tonumber(row.manual) == 1 or tonumber(row.pinned) == 1 or tonumber(row.locked) == 1) then
                return errors.new({ kind = errors.INVALID, message = "automatic operation cannot modify protected node: " .. op_id })
            end
        elseif op.op == "edge.add" then
            for _, node_id in ipairs({ op.from, op.to }) do
                local endpoint_id = tostring(node_id)
                local row, row_err = writer.node(tx, journal_id, graph_id, endpoint_id)
                if row_err then return row_err end
                if not row and not available[endpoint_id] then return errors.new({ kind = errors.NOT_FOUND, message = "graph edge endpoint not found: " .. endpoint_id }) end
            end
        elseif op.op == "edge.update" or op.op == "edge.remove" then
            local rows, row_err = db.query(tx,
                "SELECT manual, locked FROM chestor_journal_graph_edges WHERE journal_id = ? AND graph_id = ? AND id = ?",
                { journal_id, graph_id, op_id })
            if row_err then return row_err end
            local row = rows and rows[1]
            if not row then return errors.new({ kind = errors.NOT_FOUND, message = "graph edge not found: " .. op_id }) end
            if automatic and (tonumber(row.manual) == 1 or tonumber(row.locked) == 1) then
                return errors.new({ kind = errors.INVALID, message = "automatic operation cannot modify protected edge: " .. op_id })
            end
        end
    end
    return hierarchy.validate(tx, journal_id, graph_id, request.operations)
end

local function apply_batch(tx: any, journal_id: string, request: any): (number?, error?)
    local graph_id = trim(request.graph_id)
    local origin = trim(request.origin)
    if origin == "" then origin = "human" end
    local automatic = request.origin == "internal_agent" or request.origin == "projector"
    local validation_err = validate_batch(tx, journal_id, request, automatic)
    if validation_err then return nil, validation_err end
    local revision, revision_err = writer.next_revision(tx, journal_id, graph_id, tonumber(request.expected_revision))
    if not revision then return nil, revision_err end
    for _, raw_op in ipairs(request.operations) do
        local op: any = raw_op
        local op_id = trim(op.id)
        local err = nil
        local target_type = op.op:find("edge.", 1, true) == 1 and "edge" or "node"
        if op.op == "node.add" then
            local node = {
                id = op.id, semantic_key = op.semantic_key, label = op.label or op.id,
                kind = op.kind or "concept", summary = op.summary, status = op.status,
                ref_id = op.ref_id, parent_id = op.parent_id, x = op.x, y = op.y,
                manual = not automatic or op.manual == true, pinned = op.pinned, locked = op.locked,
                metadata = write_metadata(op.metadata, request),
            }
            err = writer.upsert_node(tx, journal_id, graph_id, node, revision, origin)
        elseif op.op == "node.update" then
            local row, row_err = writer.node(tx, journal_id, graph_id, op_id)
            if row_err then return nil, row_err end
            err = writer.upsert_node(tx, journal_id, graph_id, merge_node(row, op, request, automatic), revision, origin)
        elseif op.op == "node.remove" then
            err = writer.remove_node(tx, journal_id, graph_id, op_id, automatic)
        elseif op.op == "edge.add" then
            local edge = {
                id = op.id, from = op.from, to = op.to, kind = op.kind or "related", label = op.label,
                manual = not automatic or op.manual == true, locked = op.locked,
                metadata = write_metadata(op.metadata, request),
            }
            err = writer.upsert_edge(tx, journal_id, graph_id, edge, revision, origin)
        elseif op.op == "edge.update" then
            local rows, query_err = db.query(tx,
                "SELECT * FROM chestor_journal_graph_edges WHERE journal_id = ? AND graph_id = ? AND id = ?",
                { journal_id, graph_id, op_id })
            if query_err then return nil, query_err end
            local row = rows and rows[1]
            if not row then return nil, errors.new({ kind = errors.NOT_FOUND, message = "graph edge not found: " .. op_id }) end
            err = writer.upsert_edge(tx, journal_id, graph_id, {
                id = op.id, from = op.from ~= "" and op.from or row.from_node_id,
                to = op.to ~= "" and op.to or row.to_node_id,
                kind = op.kind or row.edge_kind, label = op.label ~= nil and op.label or row.label,
                manual = tonumber(row.manual) == 1 or not automatic or op.manual == true,
                locked = tonumber(row.locked) == 1 or op.locked == true,
                metadata = write_metadata(op.metadata ~= nil and op.metadata or db.decode(row.metadata, {}), request),
            }, revision, origin)
        elseif op.op == "edge.remove" then
            err = writer.remove_edge(tx, journal_id, graph_id, op_id, automatic)
        elseif op.op == "layout.position-set" then
            err = writer.set_position(tx, journal_id, graph_id, op_id, tonumber(op.x), tonumber(op.y), revision)
        elseif op.op == "layout.position-cleared" then
            err = writer.set_position(tx, journal_id, graph_id, op_id, nil, nil, revision)
        end
        if err then return nil, err end
        err = writer.add_change(tx, journal_id, graph_id, revision, tostring(op.op), target_type, op_id, {
            operation = op, request_id = request.request_id, origin = request.origin,
            provenance = request.provenance, source_event_ids = request.source_event_ids,
        })
        if err then return nil, err end
        for _, source_event_id in ipairs(request.source_event_ids or {}) do
            err = writer.add_evidence(tx, journal_id, graph_id, target_type, op_id, tostring(source_event_id), nil)
            if err then return nil, err end
        end
    end
    local finish_err = writer.finish_revision(tx, journal_id, graph_id, revision, nil)
    if finish_err then return nil, finish_err end
    return revision, nil
end

local function fold_operations(tx: any, journal_id: string, raw_event: any): error?
    local body = structural.body(raw_event)
    if trim(body.request_id or body.idempotency_key) == "" then body.request_id = event_id(raw_event, body) end
    local request, normalize_err = operations.normalize(body)
    if not request then return errors.new({ kind = errors.INVALID, message = "invalid graph operation event: " .. tostring(normalize_err) }) end
    local graph_id = trim(request.graph_id)
    local request_id = trim(request.request_id)
    local existing, existing_err = writer.request(tx, journal_id, request_id)
    if existing_err then return existing_err end
    if existing then
        if not same_value(db.decode(existing.payload_json, {}), request) then
            return errors.new({ kind = errors.CONFLICT, message = "graph request id reused with different payload" })
        end
        return nil
    end
    local savepoint_err = db.exec(tx, "SAVEPOINT chestor_journal_graph_ops", {})
    if savepoint_err then return savepoint_err end
    local revision, apply_err = apply_batch(tx, journal_id, request)
    if not revision then
        local rollback_err = db.exec(tx, "ROLLBACK TO SAVEPOINT chestor_journal_graph_ops", {})
        if rollback_err then return rollback_err end
        local release_err = db.exec(tx, "RELEASE SAVEPOINT chestor_journal_graph_ops", {})
        if release_err then return release_err end
        return writer.record_request(tx, journal_id, graph_id, request_id,
            "operations", request, "rejected", tostring(apply_err), nil)
    end
    local release_err = db.exec(tx, "RELEASE SAVEPOINT chestor_journal_graph_ops", {})
    if release_err then return release_err end
    return writer.record_request(tx, journal_id, graph_id, request_id,
        "operations", request, "applied", nil, revision)
end

function M.project_events(tx: any, journal_id: string, events: any): error?
    local defaults_err = writer.ensure_defaults(tx, journal_id)
    if defaults_err then return defaults_err end
    for _, raw_event in ipairs(type(events) == "table" and events or {}) do
        local kind = tostring((raw_event :: any).type or "")
        local err = nil
        if kind == types.EVENT.GRAPH_CONFIG_REQUESTED then
            err = fold_config(tx, journal_id, raw_event)
        elseif kind == types.EVENT.GRAPH_OPS_REQUESTED then
            err = fold_operations(tx, journal_id, raw_event)
        elseif types.EVENT_SET[kind] then
            err = fold_structural(tx, journal_id, raw_event)
        end
        if err then return err end
    end
    return nil
end

function M.run(input: any, component: any): (any?, error?)
    input = type(input) == "table" and input or {}
    local projection = type(input.projection) == "table" and input.projection or {}
    local journal_id = trim(input.thread_id)
    if journal_id == "" then journal_id = trim((projection :: any).thread_id) end
    if journal_id == "" then return nil, errors.new({ kind = errors.INTERNAL, message = "journal graph projection input missing thread_id" }) end
    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local tx, begin_err = handle:begin()
    if begin_err then handle:release(); return nil, errors.wrap(begin_err, "failed to begin journal graph transaction") end
    if not tx then handle:release(); return nil, errors.new({ kind = errors.INTERNAL, message = "journal graph transaction did not open" }) end
    local project_err = M.project_events(tx, journal_id, input.events)
    if project_err then tx:rollback(); handle:release(); return nil, project_err end
    local page, catalog_err = reader.catalog_page(tx, journal_id, { limit = 200 })
    if catalog_err then tx:rollback(); handle:release(); return nil, catalog_err end
    local catalog = page and (page :: any).items or {}
    local _, commit_err = tx:commit()
    handle:release()
    if commit_err then return nil, errors.wrap(commit_err, "failed to commit journal graph projection") end
    local dispatch_err = scheduler.dispatch(journal_id)
    if dispatch_err then return nil, errors.wrap(dispatch_err, "failed to dispatch Journal graph maintenance") end
    local max_revision = 0
    for _, graph in ipairs(catalog or {}) do max_revision = math.max(max_revision, tonumber(graph.revision) or 0) end
    local range = type(input.range) == "table" and input.range or {}
    local meta_ok, meta_err = component.set_meta(journal_id, {
        graph_count = #(catalog or {}),
        graph_revision = max_revision,
        -- max_revision is not monotonic across independent maps. The projection
        -- cursor is the reliable committed wakeup watermark for graph deltas.
        graph_last_seq = tonumber(range.to_seq) or 0,
    })
    if meta_err then return nil, errors.wrap(meta_err, "journal graph meta update failed") end
    if meta_ok ~= true then return nil, errors.new({ kind = errors.INTERNAL, message = "journal graph meta update was not applied" }) end
    return {
        body = { materialized = "chestor_journal_graph_tables", graph_count = #(catalog or {}), graph_revision = max_revision },
        last_seq = tonumber(range.to_seq),
    }, nil
end

return M

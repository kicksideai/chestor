local db = require("db")
local config_model = require("config")

local M = {}

M.ERROR = {
    ENDPOINTS_MISSING = "CHESTOR_GRAPH_ENDPOINTS_MISSING",
    PROTECTED_EDGE = "CHESTOR_GRAPH_PROTECTED_EDGE",
}

function M.is_error(err: any, kind: any, code: string): boolean
    if not errors.is(err, kind) then return false end
    local details = err:details()
    return type(details) == "table" and details.code == code
end

local CHANGE_INSERT = [[
        INSERT INTO chestor_journal_graph_changes
            (journal_id, graph_id, revision, operation, target_type, target_id, payload_json, created_at)
    ]]
local CHANGE_CONFLICT = [[
        ON CONFLICT(journal_id, graph_id, revision, operation, target_type, target_id) DO UPDATE SET
            payload_json = excluded.payload_json
    ]]
local EVIDENCE_INSERT = [[
        INSERT INTO chestor_journal_graph_evidence
            (journal_id, graph_id, target_type, target_id, event_id, source_seq, relationship, created_at)
    ]]
local EVIDENCE_CONFLICT = "ON CONFLICT(journal_id, graph_id, target_type, target_id, event_id) DO NOTHING"

local DEFAULTS = {
    { id = "map", title = "Map", description = "A durable associative map of records, relationships, provenance, and change over time." },
}

local function bool(value: any): number
    return value == true and 1 or 0
end

function M.graph(tx: any, journal_id: string, graph_id: string): (any?, error?)
    local rows, err = db.query(tx,
        "SELECT * FROM chestor_journal_graphs WHERE journal_id = ? AND graph_id = ?",
        { journal_id, graph_id })
    if err then return nil, err end
    return rows and rows[1] or nil, nil
end

function M.ensure_defaults(tx: any, journal_id: string): error?
    local now = db.now()
    for _, item in ipairs(DEFAULTS) do
        -- The config model owns every default (maintainer mode/model, schedule
        -- bounds, retention); the seeder only names the graph. Restating
        -- defaults here would create a second owner that silently diverges.
        local config, config_err = config_model.normalize({
            graph_id = item.id,
            title = item.title,
            description = item.description,
            kind = "automatic",
        })
        if not config then return config_err end
        config.expected_config_revision = nil
        config.request_id = nil
        config.execution_identity = nil
        local err = db.exec(tx, [[
            INSERT INTO chestor_journal_graphs
                (journal_id, graph_id, title, description, graph_kind, lifecycle, config_json,
                 config_revision, graph_revision, node_count, edge_count, last_source_seq,
                 health, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'automatic', 'active', ?, 1, 0, 0, 0, 0, 'ready', ?, ?)
            ON CONFLICT(journal_id, graph_id) DO NOTHING
        ]], { journal_id, item.id, item.title, item.description, db.encode(config, {}), now, now })
        if err then return err end
    end
    return nil
end

function M.configure(tx: any, journal_id: string, config: any): (number?, error?)
    local graph_id = db.trim(config.graph_id)
    if graph_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "graph_id is required" }) end
    local current, current_err = M.graph(tx, journal_id, graph_id)
    if current_err then return nil, current_err end
    local current_revision = current and (tonumber(current.config_revision) or 0) or 0
    if config.expected_config_revision and config.expected_config_revision ~= current_revision then
        return nil, errors.new({ kind = errors.CONFLICT, message = "graph config revision conflict: expected "
            .. tostring(config.expected_config_revision) .. ", current " .. tostring(current_revision) })
    end
    local workspace = type(config.workspace) == "table" and config.workspace or {}
    local parent_graph_id = db.trim(workspace.parent_graph_id)
    local anchor_graph_id = db.trim(workspace.anchor_graph_id)
    local anchor_node_id = db.trim(workspace.anchor_node_id)
    if parent_graph_id == graph_id then return nil, errors.new({ kind = errors.INVALID, message = "graph cannot be its own parent" }) end
    if (anchor_graph_id == "") ~= (anchor_node_id == "") then
        return nil, errors.new({ kind = errors.INVALID, message = "anchor_graph_id and anchor_node_id must be provided together" })
    end
    if anchor_graph_id ~= "" then
        local anchor_graph, anchor_graph_err = M.graph(tx, journal_id, anchor_graph_id)
        if anchor_graph_err then return nil, anchor_graph_err end
        if not anchor_graph then return nil, errors.new({ kind = errors.NOT_FOUND, message = "anchor graph not found: " .. anchor_graph_id }) end
        local anchor_node, anchor_node_err = M.node(tx, journal_id, anchor_graph_id, anchor_node_id)
        if anchor_node_err then return nil, anchor_node_err end
        if not anchor_node then return nil, errors.new({ kind = errors.NOT_FOUND, message = "anchor node not found: " .. anchor_node_id }) end
    end
    if parent_graph_id ~= "" then
        local seen: any = { [graph_id] = true }
        local ancestor_id = parent_graph_id
        local depth = 0
        while ancestor_id ~= "" do
            depth = depth + 1
            if depth > 64 then return nil, errors.new({ kind = errors.INVALID, message = "graph ancestry exceeds 64 levels" }) end
            if seen[ancestor_id] then return nil, errors.new({ kind = errors.INVALID, message = "graph parent cycle at: " .. ancestor_id }) end
            seen[ancestor_id] = true
            local ancestor, ancestor_err = M.graph(tx, journal_id, ancestor_id)
            if ancestor_err then return nil, ancestor_err end
            if not ancestor then return nil, errors.new({ kind = errors.NOT_FOUND, message = "parent graph not found: " .. ancestor_id }) end
            ancestor_id = db.trim(ancestor.parent_graph_id)
        end
    end
    local next_revision = current_revision + 1
    local now = db.now()
    local err = db.exec(tx, [[
        INSERT INTO chestor_journal_graphs
            (journal_id, graph_id, title, description, graph_kind, lifecycle,
             parent_graph_id, anchor_graph_id, anchor_node_id, config_json,
             config_revision, graph_revision, node_count, edge_count, last_source_seq,
             health, attention_error, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 'ready', NULL, ?, ?)
        ON CONFLICT(journal_id, graph_id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            graph_kind = excluded.graph_kind,
            lifecycle = excluded.lifecycle,
            parent_graph_id = excluded.parent_graph_id,
            anchor_graph_id = excluded.anchor_graph_id,
            anchor_node_id = excluded.anchor_node_id,
            config_json = excluded.config_json,
            config_revision = excluded.config_revision,
            health = CASE WHEN excluded.lifecycle = 'learning' THEN 'learning' ELSE 'ready' END,
            attention_error = NULL,
            updated_at = excluded.updated_at
    ]], {
        journal_id, graph_id, config.title, config.description, config.kind, config.lifecycle,
        parent_graph_id ~= "" and parent_graph_id or nil,
        anchor_graph_id ~= "" and anchor_graph_id or nil,
        anchor_node_id ~= "" and anchor_node_id or nil,
        db.encode(config, {}), next_revision, now, now,
    })
    if err then return nil, err end
    return next_revision, nil
end

function M.revision_after(current: number, expected: number?): (number?, error?)
    if expected and expected ~= current then
        return nil, errors.new({ kind = errors.CONFLICT, message = "graph revision conflict: expected " .. tostring(expected) .. ", current " .. tostring(current) })
    end
    return current + 1, nil
end

function M.next_revision(tx: any, journal_id: string, graph_id: string, expected: number?): (number?, error?)
    local row, row_err = M.graph(tx, journal_id, graph_id)
    if row_err then return nil, row_err end
    if not row then return nil, errors.new({ kind = errors.NOT_FOUND, message = "graph not found: " .. graph_id }) end
    return M.revision_after(tonumber(row.graph_revision) or 0, expected)
end

function M.node(tx: any, journal_id: string, graph_id: string, node_id: string): (any?, error?)
    local rows, err = db.query(tx,
        "SELECT * FROM chestor_journal_graph_nodes WHERE journal_id = ? AND graph_id = ? AND id = ?",
        { journal_id, graph_id, node_id })
    if err then return nil, err end
    return rows and rows[1] or nil, nil
end

-- The map node one journal event projected, if it projected one. An event that
-- upserted an entity owns the entity node ("task:<id>"); every other fact owns
-- an "event:<id>" node. Both stamp the event id into ref_id, so one indexed
-- lookup answers either shape.
function M.node_for_event(tx: any, journal_id: string, graph_id: string, event_id: string): (string?, error?)
    local id = db.trim(event_id)
    if id == "" then return nil, nil end
    local direct, direct_err = M.node(tx, journal_id, graph_id, "event:" .. id)
    if direct_err then return nil, direct_err end
    if direct then return tostring((direct :: any).id), nil end
    local rows, err = db.query(tx, [[
        SELECT id FROM chestor_journal_graph_nodes
         WHERE journal_id = ? AND ref_id = ? AND graph_id = ?
         ORDER BY id ASC LIMIT 1
    ]], { journal_id, id, graph_id })
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return nil, nil end
    return tostring((row :: any).id), nil
end

local function write_element(tx: any, statement: string, params: any, journal_id: string, graph_id: string,
    revision: number, target_type: string, target_id: string, payload: any, projection: any): error?
    local writes: { any } = { { statement = statement, params = params } }
    if projection then
        local now = db.now()
        writes[#writes + 1] = { statement = CHANGE_INSERT .. " VALUES(?,?,?,?,?,?,?,?) " .. CHANGE_CONFLICT,
            params = { journal_id, graph_id, revision, target_type .. ".upsert", target_type, target_id,
                db.encode(payload, {}), now } }
        if tostring(projection.event_id or "") ~= "" then
            writes[#writes + 1] = { statement = EVIDENCE_INSERT .. " VALUES(?,?,?,?,?,?,?,?) " .. EVIDENCE_CONFLICT,
                params = { journal_id, graph_id, target_type, target_id, projection.event_id, projection.seq,
                    "supports", now } }
        end
    end
    return db.write_group(tx, writes)
end

function M.upsert_node(tx: any, journal_id: string, graph_id: string, node: any, revision: number, origin: string, projection: any?): error?
    local now = db.now()
    local statement = [[
        INSERT INTO chestor_journal_graph_nodes
            (journal_id, graph_id, id, semantic_key, label, node_kind, summary, status,
             ref_id, parent_id, child_count, x, y, origin, manual, pinned, locked,
             metadata, created_revision, updated_revision, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, graph_id, id) DO UPDATE SET
            semantic_key = COALESCE(excluded.semantic_key, chestor_journal_graph_nodes.semantic_key),
            label = excluded.label,
            node_kind = excluded.node_kind,
            summary = excluded.summary,
            status = excluded.status,
            ref_id = COALESCE(excluded.ref_id, chestor_journal_graph_nodes.ref_id),
            parent_id = excluded.parent_id,
            child_count = excluded.child_count,
            x = COALESCE(excluded.x, chestor_journal_graph_nodes.x),
            y = COALESCE(excluded.y, chestor_journal_graph_nodes.y),
            origin = excluded.origin,
            manual = CASE WHEN chestor_journal_graph_nodes.manual = 1 THEN 1 ELSE excluded.manual END,
            pinned = CASE WHEN chestor_journal_graph_nodes.pinned = 1 THEN 1 ELSE excluded.pinned END,
            locked = CASE WHEN chestor_journal_graph_nodes.locked = 1 THEN 1 ELSE excluded.locked END,
            metadata = excluded.metadata,
            updated_revision = excluded.updated_revision,
            updated_at = excluded.updated_at
    ]]
    local params = {
        journal_id, graph_id, node.id, node.semantic_key, tostring(node.label or node.id),
        tostring(node.kind or "concept"), node.summary, node.status, node.ref_id, node.parent_id,
        tonumber(node.child_count) or 0, tonumber(node.x), tonumber(node.y), origin,
        bool(node.manual), bool(node.pinned), bool(node.locked), db.encode(node.metadata, {}),
        revision, revision, now, now,
    }
    return write_element(tx, statement, params, journal_id, graph_id, revision, "node", tostring(node.id), node, projection)
end

function M.remove_node(tx: any, journal_id: string, graph_id: string, node_id: string, automatic: boolean): error?
    local row, row_err = M.node(tx, journal_id, graph_id, node_id)
    if row_err then return row_err end
    if not row then return nil end
    if automatic and (tonumber(row.manual) == 1 or tonumber(row.pinned) == 1 or tonumber(row.locked) == 1) then
        return errors.new({ kind = errors.INVALID, message = "automatic operation cannot remove protected node: " .. node_id })
    end
    local err = db.exec(tx,
        "DELETE FROM chestor_journal_graph_edges WHERE journal_id = ? AND graph_id = ? AND (from_node_id = ? OR to_node_id = ?)",
        { journal_id, graph_id, node_id, node_id })
    if err then return err end
    err = db.exec(tx,
        "DELETE FROM chestor_journal_graph_evidence WHERE journal_id = ? AND graph_id = ? AND target_type = 'node' AND target_id = ?",
        { journal_id, graph_id, node_id })
    if err then return err end
    return db.exec(tx,
        "DELETE FROM chestor_journal_graph_nodes WHERE journal_id = ? AND graph_id = ? AND id = ?",
        { journal_id, graph_id, node_id })
end

function M.upsert_edge(tx: any, journal_id: string, graph_id: string, edge: any, revision: number, origin: string, projection: any?): any?
    local from_id = tostring(edge.from or "")
    local to_id = tostring(edge.to or "")
    local rows, read_err = db.query(tx,
        "SELECT id FROM chestor_journal_graph_nodes WHERE journal_id = ? AND graph_id = ? AND id IN (?, ?)",
        { journal_id, graph_id, from_id, to_id })
    if read_err then return read_err end
    local found: any = {}
    for _, row in ipairs(rows or {}) do found[tostring(row.id)] = true end
    if not found[from_id] or not found[to_id] then
        return errors.new({
            message = "graph edge endpoints must exist: " .. tostring(edge.id),
            kind = errors.NOT_FOUND,
            details = { code = M.ERROR.ENDPOINTS_MISSING },
        })
    end
    local now = db.now()
    local statement = [[
        INSERT INTO chestor_journal_graph_edges
            (journal_id, graph_id, id, from_node_id, to_node_id, edge_kind, label,
             origin, manual, locked, metadata, created_revision, updated_revision, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, graph_id, id) DO UPDATE SET
            from_node_id = excluded.from_node_id,
            to_node_id = excluded.to_node_id,
            edge_kind = excluded.edge_kind,
            label = excluded.label,
            origin = excluded.origin,
            manual = CASE WHEN chestor_journal_graph_edges.manual = 1 THEN 1 ELSE excluded.manual END,
            locked = CASE WHEN chestor_journal_graph_edges.locked = 1 THEN 1 ELSE excluded.locked END,
            metadata = excluded.metadata,
            updated_revision = excluded.updated_revision,
            updated_at = excluded.updated_at
    ]]
    local params = {
        journal_id, graph_id, edge.id, edge.from, edge.to, tostring(edge.kind or "related"),
        edge.label, origin, bool(edge.manual), bool(edge.locked), db.encode(edge.metadata, {}),
        revision, revision, now, now,
    }
    return write_element(tx, statement, params, journal_id, graph_id, revision, "edge", tostring(edge.id), edge, projection)
end

function M.remove_edge(tx: any, journal_id: string, graph_id: string, edge_id: string, automatic: boolean): any?
    if automatic then
        local rows, row_err = db.query(tx,
            "SELECT manual, locked FROM chestor_journal_graph_edges WHERE journal_id = ? AND graph_id = ? AND id = ?",
            { journal_id, graph_id, edge_id })
        if row_err then return row_err end
        local row = rows and rows[1]
        if row and (tonumber(row.manual) == 1 or tonumber(row.locked) == 1) then
            return errors.new({
                message = "automatic operation cannot remove protected edge: " .. edge_id,
                kind = errors.PERMISSION_DENIED,
                details = { code = M.ERROR.PROTECTED_EDGE },
            })
        end
    end
    local err = db.exec(tx,
        "DELETE FROM chestor_journal_graph_evidence WHERE journal_id = ? AND graph_id = ? AND target_type = 'edge' AND target_id = ?",
        { journal_id, graph_id, edge_id })
    if err then return err end
    return db.exec(tx,
        "DELETE FROM chestor_journal_graph_edges WHERE journal_id = ? AND graph_id = ? AND id = ?",
        { journal_id, graph_id, edge_id })
end

function M.set_position(tx: any, journal_id: string, graph_id: string, node_id: string, x: number?, y: number?, revision: number): error?
    return db.exec(tx, [[
        UPDATE chestor_journal_graph_nodes SET x = ?, y = ?, updated_revision = ?, updated_at = ?
         WHERE journal_id = ? AND graph_id = ? AND id = ?
    ]], { x, y, revision, db.now(), journal_id, graph_id, node_id })
end

function M.add_evidence_batch(tx: any, journal_id: string, evidence: { any }): error?
    local rows: { any } = {}
    local seen: any = {}
    local now = db.now()
    for _, item in ipairs(evidence) do
        if tostring(item.event_id or "") ~= "" then
            local key = db.canonical({ item.graph_id, item.target_type, item.target_id, item.event_id })
            if not seen[key] then
                seen[key] = true
                rows[#rows + 1] = { journal_id, item.graph_id, item.target_type, item.target_id, item.event_id,
                    item.seq, "supports", now }
            end
        end
    end
    return db.insert_rows(tx, EVIDENCE_INSERT, rows, 8, EVIDENCE_CONFLICT)
end

function M.add_evidence(tx: any, journal_id: string, graph_id: string, target_type: string, target_id: string, event_id: string, seq: number?): error?
    return M.add_evidence_batch(tx, journal_id, { { graph_id = graph_id, target_type = target_type,
        target_id = target_id, event_id = event_id, seq = seq } })
end

function M.add_changes(tx: any, journal_id: string, changes: { any }): error?
    local rows: { any } = {}
    local positions: any = {}
    local now = db.now()
    for _, item in ipairs(changes) do
        local key = db.canonical({ item.graph_id, item.revision, item.operation, item.target_type, item.target_id })
        local position = positions[key]
        if not position then position = #rows + 1; positions[key] = position end
        rows[position] = { journal_id, item.graph_id, item.revision, item.operation, item.target_type,
            item.target_id, db.encode(item.payload, {}), now }
    end
    return db.insert_rows(tx, CHANGE_INSERT, rows, 8, CHANGE_CONFLICT)
end

function M.add_change(tx: any, journal_id: string, graph_id: string, revision: number, operation: string, target_type: string, target_id: string, payload: any): error?
    return M.add_changes(tx, journal_id, { { graph_id = graph_id, revision = revision,
        operation = operation, target_type = target_type, target_id = target_id, payload = payload } })
end

function M.finish_revision(tx: any, journal_id: string, graph_id: string, revision: number, source_seq: number?): error?
    return db.exec(tx, [[
        UPDATE chestor_journal_graphs
           SET graph_revision = ?,
               node_count = (SELECT COUNT(*) FROM chestor_journal_graph_nodes WHERE journal_id = ? AND graph_id = ?),
               edge_count = (SELECT COUNT(*) FROM chestor_journal_graph_edges WHERE journal_id = ? AND graph_id = ?),
               last_source_seq = CASE WHEN ? > last_source_seq THEN ? ELSE last_source_seq END,
               health = 'ready', attention_error = NULL, updated_at = ?
         WHERE journal_id = ? AND graph_id = ?
    ]], {
        revision, journal_id, graph_id, journal_id, graph_id,
        tonumber(source_seq) or 0, tonumber(source_seq) or 0, db.now(), journal_id, graph_id,
    })
end

function M.record_request(tx: any, journal_id: string, graph_id: string, request_id: string, kind: string, payload: any, status: string, err: string?, revision: number?): error?
    return db.exec(tx, [[
        INSERT INTO chestor_journal_graph_requests
            (journal_id, request_id, graph_id, request_kind, payload_json, status, error, graph_revision, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(journal_id, request_id) DO NOTHING
    ]], { journal_id, request_id, graph_id, kind, db.encode(payload, {}), status, err, revision, db.now() })
end

function M.request(tx: any, journal_id: string, request_id: string): (any?, error?)
    local rows, err = db.query(tx,
        "SELECT * FROM chestor_journal_graph_requests WHERE journal_id = ? AND request_id = ?",
        { journal_id, request_id })
    if err then return nil, err end
    return rows and rows[1] or nil, nil
end

return M

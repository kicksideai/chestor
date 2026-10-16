local db = require("db")
local retrieval_state = require("retrieval_state")

local M = {}

local function bounded(value: any, fallback: number, maximum: number): number
    return math.max(1, math.min(math.floor(tonumber(value) or fallback), maximum))
end

local function decode_graph(row: any): any
    local config = db.decode(row.config_json, {})
    local parent_graph_id = db.trim(row.parent_graph_id)
    local anchor_graph_id = db.trim(row.anchor_graph_id)
    local anchor_node_id = db.trim(row.anchor_node_id)
    return {
        id = row.graph_id,
        title = row.title,
        description = row.description or "",
        kind = row.graph_kind,
        lifecycle = row.lifecycle,
        state = row.lifecycle,
        status = row.lifecycle,
        health = row.health,
        parent_graph_id = parent_graph_id ~= "" and parent_graph_id or nil,
        anchor = anchor_graph_id ~= "" and anchor_node_id ~= "" and {
            graph_id = anchor_graph_id,
            node_id = anchor_node_id,
        } or nil,
        config = config,
        config_revision = tonumber(row.config_revision) or 0,
        revision = tonumber(row.graph_revision) or 0,
        node_count = tonumber(row.node_count) or 0,
        edge_count = tonumber(row.edge_count) or 0,
        last_source_seq = tonumber(row.last_source_seq) or 0,
        attention_error = row.attention_error,
        updated_at = tonumber(row.updated_at) or 0,
    }
end

-- Root-first graph ancestry. Graph hierarchy is independent from the node
-- containment hierarchy and is bounded so corrupt historical data cannot make
-- cursor recovery unbounded.
function M.graph_path(handle: any, journal_id: string, graph_id: string, opts: any): (any?, any?)
    local maximum = bounded(opts and (opts.depth or opts.limit), 32, 64)
    local reverse_path: { any } = {}
    local seen: any = {}
    local current = db.trim(graph_id)
    local truncated = false
    while current ~= "" and #reverse_path < maximum do
        if seen[current] then return nil, errors.new({ message = "graph parent cycle at: " .. current, kind = errors.INVALID }) end
        seen[current] = true
        local rows, err = db.query(handle,
            "SELECT * FROM chestor_journal_graphs WHERE journal_id = ? AND graph_id = ?",
            { journal_id, current })
        if err then return nil, err end
        local row = rows and rows[1]
        if not row then return nil, errors.new({ message = "graph not found: " .. current, kind = errors.NOT_FOUND }) end
        local graph = decode_graph(row)
        reverse_path[#reverse_path + 1] = graph
        current = db.trim((graph :: any).parent_graph_id)
    end
    if current ~= "" then truncated = true end
    local path: { any } = {}
    for index = #reverse_path, 1, -1 do path[#path + 1] = reverse_path[index] end
    return {
        graph_id = graph_id,
        path = path,
        truncated = truncated,
        continuation = truncated and { graph_id = current, depth = maximum } or nil,
    }, nil
end

local function decode_node(row: any): any
    return {
        id = row.id,
        semantic_key = row.semantic_key,
        label = row.label,
        kind = row.node_kind,
        summary = row.summary,
        status = row.status,
        ref_id = row.ref_id,
        parent_id = row.parent_id,
        child_count = tonumber(row.child_count) or 0,
        x = tonumber(row.x),
        y = tonumber(row.y),
        origin = row.origin,
        manual = tonumber(row.manual) == 1,
        pinned = tonumber(row.pinned) == 1,
        locked = tonumber(row.locked) == 1,
        metadata = db.decode(row.metadata, {}),
        revision = tonumber(row.updated_revision) or 0,
        created_at = tonumber(row.created_at) or 0,
        updated_at = tonumber(row.updated_at) or 0,
        effective_state = db.trim(row.effective_state) ~= "" and row.effective_state or nil,
        superseded_by_event_id = row.superseded_by_event_id,
    }
end

local function decode_edge(row: any): any
    return {
        id = row.id,
        from = row.from_node_id,
        to = row.to_node_id,
        kind = row.edge_kind,
        label = row.label,
        origin = row.origin,
        manual = tonumber(row.manual) == 1,
        locked = tonumber(row.locked) == 1,
        metadata = db.decode(row.metadata, {}),
        revision = tonumber(row.updated_revision) or 0,
        created_at = tonumber(row.created_at) or 0,
        updated_at = tonumber(row.updated_at) or 0,
    }
end

local LIFECYCLE_RANK = "CASE lifecycle WHEN 'active' THEN 0 WHEN 'learning' THEN 1 WHEN 'frozen' THEN 2 ELSE 3 END"

-- How many distinct agents have work spans reaching into each graph on a page,
-- and when that presence was last seen. A fact belongs to an agent through the
-- span that stamped it, and to a graph through the node projected from it, so
-- this is one indexed aggregate over the page's graphs - never a per-graph
-- walk and never a full-journal fold.
function M.agent_counts(handle: any, journal_id: string, graph_ids: { string }): (any?, any?)
    local wanted: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, value in ipairs(graph_ids or {}) do
        local id = db.trim(value)
        if id ~= "" and not seen[id] then
            seen[id] = true
            wanted[#wanted + 1] = id
        end
    end
    local out: any = {}
    if #wanted == 0 then return out, nil end
    local marks: { string } = {}
    local params: { any } = { journal_id }
    for _, id in ipairs(wanted) do
        marks[#marks + 1] = "?"
        params[#params + 1] = id
    end
    local rows, err = db.query(handle, [[
        SELECT n.graph_id AS graph_id,
               COUNT(DISTINCT s.agent_id) AS agents,
               MAX(s.last_activity_at) AS last_activity_at
          FROM chestor_journal_graph_nodes n
          JOIN chestor_journal_events e
            ON e.journal_id = n.journal_id AND e.id = n.ref_id
          JOIN chestor_journal_spans s
            ON s.journal_id = e.journal_id AND s.span_id = e.span_id
         WHERE n.journal_id = ? AND n.graph_id IN (]] .. table.concat(marks, ",") .. [[)
         GROUP BY n.graph_id
    ]], params)
    if err then return nil, err end
    for _, row in ipairs(rows or {}) do
        out[db.trim((row :: any).graph_id)] = {
            agent_count = tonumber((row :: any).agents) or 0,
            last_agent_activity_at = tonumber((row :: any).last_activity_at) or 0,
        }
    end
    return out, nil
end

-- The catalog as one keyset page, continued on (lifecycle rank, updated_at,
-- graph_id). Every graph row carries the agent presence reaching into it.
function M.catalog_page(handle: any, journal_id: string, opts: any): (any?, any?)
    local lifecycle = db.trim(opts and opts.lifecycle)
    local query = db.trim(opts and opts.query)
    local limit = bounded(opts and opts.limit, 50, 200)
    local after_rank = tonumber(opts and (opts :: any).after_rank)
    local after_updated_at = tonumber(opts and (opts :: any).after_updated_at)
    local after_graph_id = db.trim(opts and (opts :: any).after_graph_id)
    local statement = [[
        SELECT *, ]] .. LIFECYCLE_RANK .. [[ AS lifecycle_rank FROM chestor_journal_graphs
         WHERE journal_id = ?
           AND (? = '' OR lifecycle = ?)
           AND (? = '' OR lower(title || ' ' || description) LIKE lower(?))]]
    local params: { any } = { journal_id, lifecycle, lifecycle, query, "%" .. query .. "%" }
    if after_rank ~= nil and after_updated_at ~= nil then
        statement = statement .. " AND (" .. LIFECYCLE_RANK .. " > ?"
            .. " OR (" .. LIFECYCLE_RANK .. " = ? AND updated_at < ?)"
            .. " OR (" .. LIFECYCLE_RANK .. " = ? AND updated_at = ? AND graph_id > ?))"
        params[#params + 1] = math.floor(after_rank)
        params[#params + 1] = math.floor(after_rank)
        params[#params + 1] = math.floor(after_updated_at)
        params[#params + 1] = math.floor(after_rank)
        params[#params + 1] = math.floor(after_updated_at)
        params[#params + 1] = after_graph_id
    end
    statement = statement .. " ORDER BY " .. LIFECYCLE_RANK .. ", updated_at DESC, graph_id ASC LIMIT ?"
    params[#params + 1] = limit + 1
    local rows, err = db.query(handle, statement, params)
    if err then return nil, err end
    local items: { any } = {}
    local ids: { string } = {}
    local ranks: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index > limit then break end
        local graph = decode_graph(row)
        local requested: any = {}
        for _, key in ipairs(opts and opts.fields or {}) do requested[key] = true end
        if not requested.description then graph.description = nil end
        if not requested.config then graph.config = nil end
        if not requested.attention_error then graph.attention_error = nil end
        ranks[#ranks + 1] = tonumber((row :: any).lifecycle_rank) or 3
        ids[#ids + 1] = tostring((graph :: any).id)
        items[#items + 1] = graph
    end
    local presence, presence_err = M.agent_counts(handle, journal_id, ids)
    if not presence then return nil, presence_err end
    for _, graph in ipairs(items) do
        local found = (presence :: any)[tostring((graph :: any).id)]
        ;(graph :: any).agent_count = found and (found :: any).agent_count or 0
        ;(graph :: any).last_agent_activity_at = found and (found :: any).last_agent_activity_at or nil
    end
    local has_more = #(rows or {}) > limit
    local last = items[#items]
    return {
        items = items,
        limit = limit,
        has_more = has_more,
        next_cursor = has_more and last and {
            after_rank = ranks[#ranks],
            after_updated_at = tonumber((last :: any).updated_at) or 0,
            after_graph_id = tostring((last :: any).id),
        } or nil,
    }, nil
end

-- Projection must consider every active map.  Keep that traversal separate
-- from the UI catalog: graph_id is immutable, so it provides a stable cursor
-- even while projecting a page updates revision and updated_at.
function M.active_page(handle: any, journal_id: string, opts: any): (any?, any?)
    local after_id = db.trim(opts and opts.after_id)
    local limit = bounded(opts and opts.limit, 100, 200)
    local rows, err = db.query(handle, [[
        SELECT * FROM chestor_journal_graphs
         WHERE journal_id = ? AND lifecycle = 'active' AND graph_id > ?
         ORDER BY graph_id ASC LIMIT ?
    ]], { journal_id, after_id, limit + 1 })
    if err then return nil, err end
    local out = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then out[#out + 1] = decode_graph(row) end
    end
    local has_more = #(rows or {}) > limit
    local last = out[#out]
    return {
        graphs = out,
        after_id = after_id ~= "" and after_id or nil,
        next_after_id = has_more and last and tostring(last.id) or nil,
        has_more = has_more,
    }, nil
end

function M.graph(handle: any, journal_id: string, graph_id: string): (any?, any?)
    local rows, err = db.query(handle,
        "SELECT * FROM chestor_journal_graphs WHERE journal_id = ? AND graph_id = ?",
        { journal_id, graph_id })
    if err then return nil, err end
    if not rows or not rows[1] then return nil, errors.new({ message = "graph not found: " .. graph_id, kind = errors.NOT_FOUND }) end
    return decode_graph(rows[1]), nil
end

function M.request(handle: any, journal_id: string, request_id: string): (any?, any?)
    if db.trim(request_id) == "" then return nil, errors.new({ message = "request_id is required", kind = errors.INVALID }) end
    local rows, err = db.query(handle, [[
        SELECT request_id, graph_id, request_kind, status, error,
               graph_revision, created_at
          FROM chestor_journal_graph_requests
         WHERE journal_id = ? AND request_id = ? LIMIT 1
    ]], { journal_id, request_id })
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return { request_id = request_id, status = "pending" }, nil end
    return {
        request_id = tostring((row :: any).request_id),
        graph_id = tostring((row :: any).graph_id),
        kind = tostring((row :: any).request_kind),
        status = tostring((row :: any).status),
        error = (row :: any).error,
        revision = tonumber((row :: any).graph_revision),
        recorded_at = tonumber((row :: any).created_at),
    }, nil
end

local function node_rows(handle: any, journal_id: string, graph_id: string, parent_id: string?, limit: number, offset: number?): (any?, any?)
    if parent_id == nil then
        return db.query(handle, [[
            SELECT n.*, (SELECT COUNT(*) FROM chestor_journal_graph_nodes c
                         WHERE c.journal_id = n.journal_id AND c.graph_id = n.graph_id AND c.parent_id = n.id) AS child_count
              FROM chestor_journal_graph_nodes n
             WHERE n.journal_id = ? AND n.graph_id = ? AND (n.parent_id IS NULL OR n.parent_id = '')
             ORDER BY CASE WHEN n.id LIKE 'task:%' THEN 0 ELSE 1 END ASC,
                      n.created_revision ASC, n.id ASC LIMIT ? OFFSET ?
        ]], { journal_id, graph_id, limit, offset or 0 })
    end
    return db.query(handle, [[
        SELECT n.*, (SELECT COUNT(*) FROM chestor_journal_graph_nodes c
                     WHERE c.journal_id = n.journal_id AND c.graph_id = n.graph_id AND c.parent_id = n.id) AS child_count
          FROM chestor_journal_graph_nodes n
         WHERE n.journal_id = ? AND n.graph_id = ? AND n.parent_id = ?
         ORDER BY n.created_revision ASC, n.id ASC LIMIT ?
    ]], { journal_id, graph_id, parent_id, limit })
end

local function single_node(handle: any, journal_id: string, graph_id: string, node_id: string): (any?, any?)
    local rows, err = db.query(handle, [[
        SELECT n.*, (SELECT COUNT(*) FROM chestor_journal_graph_nodes c
                     WHERE c.journal_id = n.journal_id AND c.graph_id = n.graph_id AND c.parent_id = n.id) AS child_count
          FROM chestor_journal_graph_nodes n
         WHERE n.journal_id = ? AND n.graph_id = ? AND n.id = ?
    ]], { journal_id, graph_id, node_id })
    if err then return nil, err end
    return rows and rows[1] or nil, nil
end

-- Exact address reads are the primitive used by durable agent cursors.  They
-- do not infer ontology from node kind: any graph node can be a position.
function M.node(handle: any, journal_id: string, graph_id: string, node_id: string): (any?, any?)
    local graph, graph_err = M.graph(handle, journal_id, graph_id)
    if not graph then return nil, graph_err end
    local row, row_err = single_node(handle, journal_id, graph_id, node_id)
    if row_err then return nil, row_err end
    if not row then return nil, errors.new({ message = "graph node not found: " .. node_id, kind = errors.NOT_FOUND }) end
    return { graph = graph, node = decode_node(row) }, nil
end

-- Root-first containment chain for a generic graph node.  A hard depth bound
-- protects recovery reads from malformed historical parent cycles.
function M.path(handle: any, journal_id: string, graph_id: string, node_id: string, opts: any): (any?, any?)
    local maximum = bounded(opts and (opts.depth or opts.limit), 32, 64)
    local reverse_path: { any } = {}
    local seen: any = {}
    local current = node_id
    local truncated = false
    while current ~= "" and #reverse_path < maximum do
        if seen[current] then return nil, errors.new({ message = "graph parent cycle at node: " .. current, kind = errors.INVALID }) end
        seen[current] = true
        local row, row_err = single_node(handle, journal_id, graph_id, current)
        if row_err then return nil, row_err end
        if not row then
            if #reverse_path == 0 then return nil, errors.new({ message = "graph node not found: " .. node_id, kind = errors.NOT_FOUND }) end
            return nil, errors.new({ message = "graph parent missing: " .. current, kind = errors.INVALID })
        end
        reverse_path[#reverse_path + 1] = decode_node(row)
        current = db.trim(row.parent_id)
    end
    if current ~= "" then truncated = true end
    local path: { any } = {}
    for index = #reverse_path, 1, -1 do path[#path + 1] = reverse_path[index] end
    return {
        graph_id = graph_id,
        node_id = node_id,
        path = path,
        truncated = truncated,
        continuation = truncated and { mode = "path", graph_id = graph_id,
            node_id = current, depth = maximum } or nil,
    }, nil
end

-- Incident-edge page plus its endpoint nodes.  Counts and continuation are
-- explicit so an agent never mistakes a bounded neighborhood for a complete
-- one.
function M.neighbors(handle: any, journal_id: string, graph_id: string, node_id: string, opts: any): (any?, any?)
    local focus_row, focus_err = single_node(handle, journal_id, graph_id, node_id)
    if focus_err then return nil, focus_err end
    if not focus_row then return nil, errors.new({ message = "graph node not found: " .. node_id, kind = errors.NOT_FOUND }) end
    local direction = string.lower(db.trim(opts and opts.direction))
    if direction == "" then direction = "both" end
    if direction ~= "both" and direction ~= "in" and direction ~= "out" then
        return nil, errors.new({ message = "direction must be both, in, or out", kind = errors.INVALID })
    end
    local edge_kind = db.trim(opts and opts.edge_kind)
    local limit = bounded(opts and opts.limit, 24, 100)
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local predicate
    if direction == "in" then predicate = "to_node_id = ?"
    elseif direction == "out" then predicate = "from_node_id = ?"
    else predicate = "(from_node_id = ? OR to_node_id = ?)" end
    local base_params: { any } = { journal_id, graph_id, node_id }
    if direction == "both" then base_params[#base_params + 1] = node_id end
    base_params[#base_params + 1] = edge_kind
    base_params[#base_params + 1] = edge_kind
    local count_sql = "SELECT COUNT(*) AS n FROM chestor_journal_graph_edges"
        .. " WHERE journal_id = ? AND graph_id = ? AND " .. predicate
        .. " AND (? = '' OR edge_kind = ?)"
    local counts, count_err = db.query(handle, count_sql, base_params)
    if count_err then return nil, count_err end
    local total = counts and counts[1] and tonumber((counts[1] :: any).n) or 0
    local page_params: { any } = {}
    for _, value in ipairs(base_params) do page_params[#page_params + 1] = value end
    page_params[#page_params + 1] = limit
    page_params[#page_params + 1] = offset
    local rows, rows_err = db.query(handle, "SELECT * FROM chestor_journal_graph_edges"
        .. " WHERE journal_id = ? AND graph_id = ? AND " .. predicate
        .. " AND (? = '' OR edge_kind = ?)"
        .. " ORDER BY updated_at DESC, id ASC LIMIT ? OFFSET ?", page_params)
    if rows_err then return nil, rows_err end
    local edges: { any } = {}
    local endpoint_ids: { string } = {}
    local endpoints_seen: any = { [node_id] = true }
    for _, row in ipairs(rows or {}) do
        edges[#edges + 1] = decode_edge(row)
        for _, endpoint in ipairs({ tostring(row.from_node_id), tostring(row.to_node_id) }) do
            if not endpoints_seen[endpoint] then
                endpoints_seen[endpoint] = true
                endpoint_ids[#endpoint_ids + 1] = endpoint
            end
        end
    end
    local nodes: { any } = { decode_node(focus_row) }
    for _, endpoint in ipairs(endpoint_ids) do
        local row, row_err = single_node(handle, journal_id, graph_id, endpoint)
        if row_err then return nil, row_err end
        if row then nodes[#nodes + 1] = decode_node(row) end
    end
    return {
        graph_id = graph_id,
        node_id = node_id,
        direction = direction,
        edge_kind = edge_kind ~= "" and edge_kind or nil,
        nodes = nodes,
        edges = edges,
        offset = offset,
        limit = limit,
        total = total,
        omitted = math.max(0, total - offset - #edges),
        has_more = offset + #edges < total,
        continuation = offset + #edges < total and { mode = "neighbors", graph_id = graph_id,
            node_id = node_id, direction = direction, edge_kind = edge_kind ~= "" and edge_kind or nil,
            offset = offset + #edges, limit = limit } or nil,
    }, nil
end

local function edges_for_nodes(handle: any, journal_id: string, graph_id: string, ids: any, limit: number): (any?, any?)
    if #ids == 0 then return {}, nil end
    local placeholders = {}
    local params = { journal_id, graph_id }
    for _, id in ipairs(ids) do placeholders[#placeholders + 1] = "?"; params[#params + 1] = id end
    for _, id in ipairs(ids) do params[#params + 1] = id end
    params[#params + 1] = limit
    local in_list = table.concat(placeholders, ",")
    return db.query(handle,
        "SELECT * FROM chestor_journal_graph_edges WHERE journal_id = ? AND graph_id = ?"
        .. " AND from_node_id IN (" .. in_list .. ") AND to_node_id IN (" .. in_list .. ")"
        .. " ORDER BY created_revision ASC, id ASC LIMIT ?",
        params)
end

function M.window(handle: any, journal_id: string, graph_id: string, opts: any): (any?, any?)
    local graph, graph_err = M.graph(handle, journal_id, graph_id)
    if not graph then return nil, graph_err end
    local levels = bounded(opts and opts.levels, 3, 4)
    local max_nodes = bounded(opts and opts.limit, 160, 160)
    local max_edges = bounded(opts and opts.edge_limit, 480, 480)
    local focus_id = db.trim(opts and (opts.root_id or opts.node_id))
    local nodes = {}
    local ids = {}
    local seen = {}
    local frontier = {}
    local parent_id = nil

    if focus_id ~= "" then
        local row, row_err = single_node(handle, journal_id, graph_id, focus_id)
        if row_err then return nil, row_err end
        if not row then return nil, errors.new({ message = "graph node not found: " .. focus_id, kind = errors.NOT_FOUND }) end
        nodes[#nodes + 1] = decode_node(row)
        ids[#ids + 1] = focus_id
        seen[focus_id] = true
        frontier[1] = focus_id
        parent_id = db.trim(row.parent_id)
        if parent_id == "" then parent_id = nil end
    else
        -- Cap the root seed at half the budget so descent always has room:
        -- a fact-heavy journal has more roots than the whole window and would
        -- otherwise render as a flat, treeless node list.
        local root_budget = math.max(1, math.floor(max_nodes / 2))
        local rows, rows_err = node_rows(handle, journal_id, graph_id, nil, root_budget)
        if rows_err then return nil, rows_err end
        for _, row in ipairs(rows or {}) do
            local id = tostring(row.id)
            nodes[#nodes + 1] = decode_node(row)
            ids[#ids + 1] = id
            seen[id] = true
            frontier[#frontier + 1] = id
        end
    end

    for _ = 2, levels do
        if #frontier == 0 or #nodes >= max_nodes then break end
        local next_frontier = {}
        for _, parent in ipairs(frontier) do
            if #nodes >= max_nodes then break end
            local rows, rows_err = node_rows(handle, journal_id, graph_id, parent, max_nodes - #nodes)
            if rows_err then return nil, rows_err end
            for _, row in ipairs(rows or {}) do
                local id = tostring(row.id)
                if not seen[id] then
                    seen[id] = true
                    nodes[#nodes + 1] = decode_node(row)
                    ids[#ids + 1] = id
                    next_frontier[#next_frontier + 1] = id
                end
            end
        end
        frontier = next_frontier
    end

    if focus_id == "" and #nodes < max_nodes then
        local extra, extra_err = node_rows(handle, journal_id, graph_id, nil, max_nodes - #nodes, math.max(1, math.floor(max_nodes / 2)))
        if extra_err then return nil, extra_err end
        for _, row in ipairs(extra or {}) do
            local id = tostring(row.id)
            if not seen[id] and #nodes < max_nodes then
                seen[id] = true
                nodes[#nodes + 1] = decode_node(row)
                ids[#ids + 1] = id
            end
        end
    end

    local edge_rows, edge_err = edges_for_nodes(handle, journal_id, graph_id, ids, max_edges)
    if edge_err then return nil, edge_err end
    local edges = {}
    for _, row in ipairs(edge_rows or {}) do edges[#edges + 1] = decode_edge(row) end
    return {
        graph = graph,
        root_id = focus_id ~= "" and focus_id or nil,
        parent_id = parent_id,
        levels = levels,
        nodes = nodes,
        edges = edges,
        limits = { nodes = max_nodes, edges = max_edges },
        collapsed_node_count = math.max(0, graph.node_count - #nodes),
        collapsed_edge_count = math.max(0, graph.edge_count - #edges),
        snapshot_required = false,
    }, nil
end

-- Workspace bundle: return the entire detached research/specification graph
-- in one object when it fits the server envelope. Larger workspaces return a
-- truthful manifest plus independent node/edge continuation offsets.
function M.bundle(handle: any, journal_id: string, graph_id: string, opts: any): (any?, any?)
    local graph, graph_err = M.graph(handle, journal_id, graph_id)
    if not graph then return nil, graph_err end
    local node_limit = bounded(opts and (opts.node_limit or opts.limit), 200, 500)
    local edge_limit = bounded(opts and opts.edge_limit, 500, 1000)
    local node_offset = math.max(0, math.floor(tonumber(opts and (opts.node_offset or opts.offset)) or 0))
    local edge_offset = math.max(0, math.floor(tonumber(opts and opts.edge_offset) or 0))
    local node_rows_value, node_err = db.query(handle, [[
        SELECT n.*, (SELECT COUNT(*) FROM chestor_journal_graph_nodes c
                     WHERE c.journal_id = n.journal_id AND c.graph_id = n.graph_id
                       AND c.parent_id = n.id) AS child_count
          FROM chestor_journal_graph_nodes n
         WHERE n.journal_id = ? AND n.graph_id = ?
         ORDER BY n.created_revision ASC, n.id ASC LIMIT ? OFFSET ?
    ]], { journal_id, graph_id, node_limit + 1, node_offset })
    if node_err then return nil, node_err end
    local edge_rows_value, edge_err = db.query(handle, [[
        SELECT * FROM chestor_journal_graph_edges
         WHERE journal_id = ? AND graph_id = ?
         ORDER BY created_revision ASC, id ASC LIMIT ? OFFSET ?
    ]], { journal_id, graph_id, edge_limit + 1, edge_offset })
    if edge_err then return nil, edge_err end
    local nodes: { any } = {}
    for index, row in ipairs(node_rows_value or {}) do
        if index <= node_limit then nodes[#nodes + 1] = decode_node(row) end
    end
    local edges: { any } = {}
    for index, row in ipairs(edge_rows_value or {}) do
        if index <= edge_limit then edges[#edges + 1] = decode_edge(row) end
    end
    local grouped, grouped_err = db.query(handle, [[
        SELECT node_kind, COALESCE(status, '') AS status, COUNT(*) AS n
          FROM chestor_journal_graph_nodes
         WHERE journal_id = ? AND graph_id = ?
         GROUP BY node_kind, COALESCE(status, '')
         ORDER BY node_kind ASC, status ASC
    ]], { journal_id, graph_id })
    if grouped_err then return nil, grouped_err end
    local by_kind: any = {}
    local by_status: any = {}
    for _, row in ipairs(grouped or {}) do
        local count = tonumber((row :: any).n) or 0
        local kind = tostring((row :: any).node_kind or "concept")
        local status = tostring((row :: any).status or "")
        by_kind[kind] = (tonumber(by_kind[kind]) or 0) + count
        if status ~= "" then by_status[status] = (tonumber(by_status[status]) or 0) + count end
    end
    local node_has_more = #(node_rows_value or {}) > node_limit
    local edge_has_more = #(edge_rows_value or {}) > edge_limit
    return {
        graph = graph,
        manifest = {
            node_count = graph.node_count,
            edge_count = graph.edge_count,
            by_kind = by_kind,
            by_status = by_status,
            revision = graph.revision,
        },
        nodes = nodes,
        edges = edges,
        complete = node_offset == 0 and edge_offset == 0
            and not node_has_more and not edge_has_more,
        omissions = {
            nodes = {
                returned = #nodes,
                offset = node_offset,
                omitted = math.max(0, graph.node_count - node_offset - #nodes),
                continuation = node_has_more and { mode = "bundle", graph_id = graph_id,
                    node_offset = node_offset + #nodes, edge_offset = edge_offset } or nil,
            },
            edges = {
                returned = #edges,
                offset = edge_offset,
                omitted = math.max(0, graph.edge_count - edge_offset - #edges),
                continuation = edge_has_more and { mode = "bundle", graph_id = graph_id,
                    node_offset = node_offset, edge_offset = edge_offset + #edges } or nil,
            },
        },
    }, nil
end

local function subtree_cte(handle: any): (string?, any?)
    local dialect, dialect_err
    if type(handle.type) == "function" then
        dialect, dialect_err = handle:type()
    elseif type(handle.db_type) == "function" then
        dialect, dialect_err = handle:db_type()
    else
        return nil, errors.new({ message = "journal database executor does not expose its type", kind = errors.INVALID })
    end
    if dialect_err then return nil, errors.new({ message = "failed to determine journal database type: " .. tostring(dialect_err), kind = errors.INVALID }) end

    local unseen
    if tostring(dialect) == "sqlite" then
        unseen = "instr(subtree.visited, '/' || child.id || '/') = 0"
    elseif tostring(dialect) == "postgres" then
        unseen = "strpos(subtree.visited, '/' || child.id || '/') = 0"
    else
        return nil, errors.new({ message = "unsupported journal database type: " .. tostring(dialect), kind = errors.INVALID })
    end
    return [[WITH RECURSIVE subtree(id, depth, visited) AS (
    SELECT id, 0, '/' || id || '/'
      FROM chestor_journal_graph_nodes
     WHERE journal_id = ? AND graph_id = ? AND id = ?
    UNION ALL
    SELECT child.id, subtree.depth + 1, subtree.visited || child.id || '/'
      FROM chestor_journal_graph_nodes child
      JOIN subtree ON child.parent_id = subtree.id
     WHERE child.journal_id = ? AND child.graph_id = ?
       AND subtree.depth < 255
       AND ]] .. unseen .. [[
) ]], nil
end

local function subtree_params(journal_id: string, graph_id: string, root_id: string): { any }
    return { journal_id, graph_id, root_id, journal_id, graph_id }
end

-- Complete subtree read for agent recovery retains node content, documents,
-- renderer hints, and provenance.
-- Large trees page nodes and internal edges independently with self-routing
-- continuations, so "load this whole branch" never silently truncates.
function M.subtree(handle: any, journal_id: string, graph_id: string, opts: any): (any?, any?)
    local graph, graph_err = M.graph(handle, journal_id, graph_id)
    if not graph then return nil, graph_err end
    local root_id = db.trim(opts and (opts.root_id or opts.node_id))
    if root_id == "" then return nil, errors.new({ message = "subtree root_id is required", kind = errors.INVALID }) end
    local root_value, root_err = M.node(handle, journal_id, graph_id, root_id)
    if not root_value then return nil, root_err end

    local node_limit = bounded(opts and (opts.node_limit or opts.limit), 200, 500)
    local edge_limit = bounded(opts and opts.edge_limit, 500, 1000)
    local node_offset = math.max(0, math.floor(tonumber(opts and (opts.node_offset or opts.offset)) or 0))
    local edge_offset = math.max(0, math.floor(tonumber(opts and opts.edge_offset) or 0))
    local cte, cte_err = subtree_cte(handle)
    if not cte then return nil, cte_err end

    local node_params = subtree_params(journal_id, graph_id, root_id)
    node_params[#node_params + 1] = journal_id
    node_params[#node_params + 1] = graph_id
    node_params[#node_params + 1] = node_limit + 1
    node_params[#node_params + 1] = node_offset
    local node_rows_value, node_err = db.query(handle, cte .. [[
        SELECT n.*, subtree.depth,
               (SELECT COUNT(*) FROM chestor_journal_graph_nodes child
                 WHERE child.journal_id = n.journal_id AND child.graph_id = n.graph_id
                   AND child.parent_id = n.id) AS child_count
          FROM subtree
          JOIN chestor_journal_graph_nodes n
            ON n.journal_id = ? AND n.graph_id = ? AND n.id = subtree.id
         ORDER BY subtree.depth ASC, n.created_revision ASC, n.id ASC
         LIMIT ? OFFSET ?
    ]], node_params)
    if node_err then return nil, node_err end

    local edge_params = subtree_params(journal_id, graph_id, root_id)
    edge_params[#edge_params + 1] = journal_id
    edge_params[#edge_params + 1] = graph_id
    edge_params[#edge_params + 1] = edge_limit + 1
    edge_params[#edge_params + 1] = edge_offset
    local edge_rows_value, edge_err = db.query(handle, cte .. [[
        SELECT edge.*
          FROM chestor_journal_graph_edges edge
         WHERE edge.journal_id = ? AND edge.graph_id = ?
           AND edge.from_node_id IN (SELECT id FROM subtree)
           AND edge.to_node_id IN (SELECT id FROM subtree)
         ORDER BY edge.created_revision ASC, edge.id ASC
         LIMIT ? OFFSET ?
    ]], edge_params)
    if edge_err then return nil, edge_err end

    local count_params = subtree_params(journal_id, graph_id, root_id)
    local counts, count_err = db.query(handle, cte .. [[
        SELECT COUNT(*) AS node_count, COALESCE(MAX(depth), 0) AS max_depth
          FROM subtree
    ]], count_params)
    if count_err then return nil, count_err end
    local node_count = counts and counts[1] and tonumber((counts[1] :: any).node_count) or 0
    local max_depth = counts and counts[1] and tonumber((counts[1] :: any).max_depth) or 0

    local edge_count_params = subtree_params(journal_id, graph_id, root_id)
    edge_count_params[#edge_count_params + 1] = journal_id
    edge_count_params[#edge_count_params + 1] = graph_id
    local edge_counts, edge_count_err = db.query(handle, cte .. [[
        SELECT COUNT(*) AS edge_count
          FROM chestor_journal_graph_edges edge
         WHERE edge.journal_id = ? AND edge.graph_id = ?
           AND edge.from_node_id IN (SELECT id FROM subtree)
           AND edge.to_node_id IN (SELECT id FROM subtree)
    ]], edge_count_params)
    if edge_count_err then return nil, edge_count_err end
    local edge_count = edge_counts and edge_counts[1] and tonumber((edge_counts[1] :: any).edge_count) or 0

    local grouped_params = subtree_params(journal_id, graph_id, root_id)
    grouped_params[#grouped_params + 1] = journal_id
    grouped_params[#grouped_params + 1] = graph_id
    local grouped, grouped_err = db.query(handle, cte .. [[
        SELECT n.node_kind, COALESCE(n.status, '') AS status, COUNT(*) AS n
          FROM subtree
          JOIN chestor_journal_graph_nodes n
            ON n.journal_id = ? AND n.graph_id = ? AND n.id = subtree.id
         GROUP BY n.node_kind, COALESCE(n.status, '')
         ORDER BY n.node_kind ASC, status ASC
    ]], grouped_params)
    if grouped_err then return nil, grouped_err end

    local nodes: { any } = {}
    for index, row in ipairs(node_rows_value or {}) do
        if index <= node_limit then
            local node = decode_node(row)
            node.depth = tonumber((row :: any).depth) or 0
            nodes[#nodes + 1] = node
        end
    end
    local edges: { any } = {}
    for index, row in ipairs(edge_rows_value or {}) do
        if index <= edge_limit then edges[#edges + 1] = decode_edge(row) end
    end
    local by_kind: any = {}
    local by_status: any = {}
    for _, row in ipairs(grouped or {}) do
        local count = tonumber((row :: any).n) or 0
        local kind = tostring((row :: any).node_kind or "concept")
        local status = tostring((row :: any).status or "")
        by_kind[kind] = (tonumber(by_kind[kind]) or 0) + count
        if status ~= "" then by_status[status] = (tonumber(by_status[status]) or 0) + count end
    end

    local node_has_more = #(node_rows_value or {}) > node_limit
    local edge_has_more = #(edge_rows_value or {}) > edge_limit
    return {
        graph = graph,
        root = (root_value :: any).node,
        root_id = root_id,
        manifest = {
            root_id = root_id,
            node_count = node_count,
            edge_count = edge_count,
            max_depth = max_depth,
            by_kind = by_kind,
            by_status = by_status,
            revision = graph.revision,
        },
        nodes = nodes,
        edges = edges,
        complete = node_offset == 0 and edge_offset == 0
            and not node_has_more and not edge_has_more,
        omissions = {
            nodes = {
                returned = #nodes,
                offset = node_offset,
                omitted = math.max(0, node_count - node_offset - #nodes),
                continuation = node_has_more and { mode = "subtree", graph_id = graph_id,
                    root_id = root_id, node_offset = node_offset + #nodes,
                    edge_offset = edge_offset, node_limit = node_limit, edge_limit = edge_limit } or nil,
            },
            edges = {
                returned = #edges,
                offset = edge_offset,
                omitted = math.max(0, edge_count - edge_offset - #edges),
                continuation = edge_has_more and { mode = "subtree", graph_id = graph_id,
                    root_id = root_id, node_offset = node_offset,
                    edge_offset = edge_offset + #edges, node_limit = node_limit, edge_limit = edge_limit } or nil,
            },
        },
    }, nil
end

local CONTEXT_EDGE = {
    includes = true,
    requires_context = true,
    attaches = true,
    context = true,
}

local function context_preview(node: any, load: string): any
    if load == "full" then return node end
    local out: any = {
        id = node.id,
        semantic_key = node.semantic_key,
        label = node.label,
        kind = node.kind,
        status = node.status,
        revision = node.revision,
        child_count = node.child_count,
    }
    if load ~= "pointer" then out.summary = node.summary end
    return out
end

-- Resolve any node as a reusable context root. Membership remains graph-owned:
-- ordinary typed edges carry ordering/load/required/descendant policy in attrs,
-- while the returned packet is an ephemeral bounded read, never copied state.
function M.context(handle: any, journal_id: string, graph_id: string, opts: any): (any?, any?)
    opts = type(opts) == "table" and opts or {}
    local root_id = db.trim(opts.node_id or opts.root_id)
    if root_id == "" then return nil, errors.new({ message = "context root node_id is required", kind = errors.INVALID }) end
    local member_limit = bounded(opts.member_limit or opts.limit, 32, 100)
    local node_limit = bounded(opts.node_limit, 120, 160)
    local edge_limit = bounded(opts.edge_limit, 240, 480)
    local max_depth = bounded(opts.depth, 3, 4)
    local root_value, root_err = M.node(handle, journal_id, graph_id, root_id)
    if not root_value then return nil, root_err end
    local path, path_err = M.path(handle, journal_id, graph_id, root_id, {
        depth = bounded(opts.path_limit, 24, 64),
    })
    if not path then return nil, path_err end
    local scan_limit = math.min(1000, math.max(member_limit + 1, member_limit * 8))
    local rows, rows_err = db.query(handle, [[
        SELECT * FROM chestor_journal_graph_edges
         WHERE journal_id = ? AND graph_id = ? AND from_node_id = ?
         ORDER BY created_revision ASC, id ASC LIMIT ?
    ]], { journal_id, graph_id, root_id, scan_limit })
    if rows_err then return nil, rows_err end

    local candidates: { any } = {}
    for _, row in ipairs(rows or {}) do
        local edge = decode_edge(row)
        local attrs = type(edge.metadata) == "table" and edge.metadata or {}
        if CONTEXT_EDGE[string.lower(tostring(edge.kind or ""))]
            or (attrs :: any).context == true or (attrs :: any).context_member == true then
            candidates[#candidates + 1] = { edge = edge, attrs = attrs }
        end
    end
    table.sort(candidates, function(a: any, b: any): boolean
        local ao = tonumber((a.attrs :: any).order) or math.huge
        local bo = tonumber((b.attrs :: any).order) or math.huge
        if ao ~= bo then return ao < bo end
        return tostring((a.edge :: any).id) < tostring((b.edge :: any).id)
    end)

    local members: { any } = {}
    local nodes: { any } = {}
    local edges: { any } = {}
    local seen_nodes: any = {}
    local seen_edges: any = {}
    local omitted_nodes = 0
    local omitted_edges = 0
    local scan_truncated = #(rows or {}) >= scan_limit
    local has_more = #candidates > member_limit or scan_truncated
    for index, candidate in ipairs(candidates) do
        if index > member_limit then break end
        local edge = candidate.edge :: any
        local attrs = candidate.attrs :: any
        local target_graph = db.trim(attrs.target_graph_id)
        if target_graph == "" then target_graph = graph_id end
        local target_id = db.trim(attrs.target_node_id)
        if target_id == "" then target_id = db.trim(edge.to) end
        local target, target_err = M.node(handle, journal_id, target_graph, target_id)
        local load = string.lower(db.trim(attrs.load))
        if load ~= "pointer" and load ~= "full" then load = "summary" end
        local member: any = {
            address = { graph_id = target_graph, node_id = target_id },
            relation = edge.kind,
            reason = attrs.reason,
            required = attrs.required == true,
            load = load,
            order = tonumber(attrs.order),
            resolved = target ~= nil,
            error = target_err and tostring(target_err) or nil,
        }
        if target then
            member.node = context_preview((target :: any).node, load)
            if not seen_nodes[target_graph .. "\0" .. target_id] and #nodes < node_limit then
                seen_nodes[target_graph .. "\0" .. target_id] = true
                nodes[#nodes + 1] = {
                    address = { graph_id = target_graph, node_id = target_id },
                    node = member.node,
                }
            end
            local requested_depth = tonumber(attrs.descendant_depth or attrs.depth)
            if attrs.include_descendants == true and not requested_depth then requested_depth = 2 end
            if requested_depth and requested_depth > 0 then
                local window, window_err = M.window(handle, journal_id, target_graph, {
                    root_id = target_id,
                    levels = math.min(max_depth, math.floor(requested_depth) + 1),
                    limit = math.max(1, node_limit - #nodes),
                    edge_limit = math.max(1, edge_limit - #edges),
                })
                if not window then member.descendants_error = tostring(window_err) else
                    local added_nodes = 0
                    for _, node in ipairs((window :: any).nodes or {}) do
                        local key = target_graph .. "\0" .. tostring((node :: any).id)
                        if not seen_nodes[key] and #nodes < node_limit then
                            seen_nodes[key] = true
                            nodes[#nodes + 1] = {
                                address = { graph_id = target_graph, node_id = tostring((node :: any).id) },
                                node = context_preview(node, load),
                            }
                            added_nodes = added_nodes + 1
                        end
                    end
                    local added_edges = 0
                    for _, child_edge in ipairs((window :: any).edges or {}) do
                        local key = target_graph .. "\0" .. tostring((child_edge :: any).id)
                        if not seen_edges[key] and #edges < edge_limit then
                            seen_edges[key] = true
                            edges[#edges + 1] = { graph_id = target_graph, edge = child_edge }
                            added_edges = added_edges + 1
                        end
                    end
                    member.descendants = { returned_nodes = added_nodes, returned_edges = added_edges,
                        omitted_nodes = tonumber((window :: any).collapsed_node_count) or 0,
                        omitted_edges = tonumber((window :: any).collapsed_edge_count) or 0 }
                    omitted_nodes = omitted_nodes + member.descendants.omitted_nodes
                    omitted_edges = omitted_edges + member.descendants.omitted_edges
                end
            end
        end
        members[#members + 1] = member
    end

    local refs, refs_err = db.query(handle, [[
        SELECT nr.*, r.uri, r.ref_kind, r.title, r.version, r.content_hash,
               r.attrs_json AS ref_attrs_json
          FROM chestor_journal_node_refs nr
          JOIN chestor_journal_references r
            ON r.journal_id = nr.journal_id AND r.ref_id = nr.ref_id
         WHERE nr.journal_id = ? AND nr.graph_id = ? AND nr.node_id = ? AND nr.state = 'active'
         ORDER BY nr.updated_seq DESC, nr.ref_id ASC LIMIT ?
    ]], { journal_id, graph_id, root_id, member_limit + 1 })
    if refs_err then return nil, refs_err end
    local references: { any } = {}
    for index, row in ipairs(refs or {}) do
        if index > member_limit then has_more = true; break end
        references[#references + 1] = {
            ref_id = (row :: any).ref_id,
            relation = (row :: any).relation,
            uri = (row :: any).uri,
            kind = (row :: any).ref_kind,
            title = (row :: any).title,
            version = (row :: any).version,
            content_hash = (row :: any).content_hash,
            attrs = db.decode((row :: any).attrs_json, {}),
            ref_attrs = db.decode((row :: any).ref_attrs_json, {}),
        }
    end
    return {
        graph = (root_value :: any).graph,
        address = { graph_id = graph_id, node_id = root_id },
        root = (root_value :: any).node,
        chain = (path :: any).path,
        chain_truncated = (path :: any).truncated == true,
        members = members,
        references = references,
        nodes = nodes,
        edges = edges,
        omissions = {
            members = { returned = #members, omitted = math.max(0, #candidates - #members),
                has_more = has_more, scan_truncated = scan_truncated },
            nodes = { returned = #nodes, omitted = omitted_nodes },
            edges = { returned = #edges, omitted = omitted_edges },
        },
    }, nil
end

function M.search(handle: any, journal_id: string, graph_id: string, query_text: string, opts: any): (any?, any?)
    local query = db.trim(query_text)
    local from_time = math.max(0, math.floor(tonumber(opts and opts.from_time) or 0))
    local to_time = math.max(0, math.floor(tonumber(opts and opts.to_time) or 0))
    local node_kind = db.trim(opts and opts.node_kind)
    local status = db.trim(opts and opts.status)
    if query == "" and from_time == 0 and to_time == 0 and node_kind == "" and status == "" then
        return { items = {}, offset = 0, limit = 20, has_more = false }, nil
    end
    local limit = math.max(1, math.floor(tonumber(opts and opts.limit) or 20))
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local dialect, dialect_err = handle:type()
    if dialect_err then return nil, errors.new({ message = "could not determine graph database type: " .. tostring(dialect_err), kind = errors.INVALID }) end
    local validity, validity_err = retrieval_state.normalize(opts and opts.validity)
    if not validity then return nil, validity_err end
    local state_expr = retrieval_state.event_expression(tostring(dialect), "source")
    local state_clause, state_params = retrieval_state.filter(state_expr, validity)
    local successor_expr = retrieval_state.successor_expression("source")
    local params: { any } = { journal_id, graph_id, query, "%" .. query .. "%",
        from_time, from_time, to_time, to_time, node_kind, node_kind, status, status }
    for _, value in ipairs(state_params) do params[#params + 1] = value end
    params[#params + 1] = limit + 1
    params[#params + 1] = offset
    local rows, err = db.query(handle, [[
        SELECT n.*, ]] .. state_expr .. [[ AS effective_state,
               ]] .. successor_expr .. [[ AS superseded_by_event_id,
               (SELECT COUNT(*) FROM chestor_journal_graph_nodes c
                     WHERE c.journal_id = n.journal_id AND c.graph_id = n.graph_id AND c.parent_id = n.id) AS child_count
          FROM chestor_journal_graph_nodes n
          LEFT JOIN chestor_journal_events source
            ON source.journal_id = n.journal_id AND source.id = n.ref_id
         WHERE n.journal_id = ? AND n.graph_id = ?
           AND (? = '' OR lower(n.label || ' ' || COALESCE(n.summary, '') || ' ' || COALESCE(n.status, '') || ' ' || COALESCE(n.ref_id, '') || ' ' || COALESCE(n.metadata, '')) LIKE lower(?))
           AND (? = 0 OR n.updated_at >= ?)
           AND (? = 0 OR n.updated_at <= ?)
           AND (? = '' OR n.node_kind = ?)
           AND (? = '' OR COALESCE(n.status, '') = ?)
           ]] .. state_clause .. [[
         ORDER BY n.updated_at DESC, n.id ASC LIMIT ? OFFSET ?
    ]], params)
    if err then return nil, err end
    local out = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then out[#out + 1] = decode_node(row) end
    end
    local has_more = #(rows or {}) > limit
    return { items = out, offset = offset, limit = limit, has_more = has_more,
        continuation = has_more and { mode = "search", graph_id = graph_id,
            query = query, from_time = from_time, to_time = to_time,
            validity = validity,
            node_kind = node_kind ~= "" and node_kind or nil,
            status = status ~= "" and status or nil,
            offset = offset + #out, limit = limit } or nil }, nil
end

-- Time is a first-class graph dimension. The immutable change projection is
-- the timeline authority: a completed node that is later reopened therefore
-- yields two actions instead of one mutable latest-state row.
function M.timeline(handle: any, journal_id: string, graph_id: string, opts: any): (any?, any?)
    local from_time = math.max(0, math.floor(tonumber(opts and opts.from_time) or 0))
    local to_time = math.max(0, math.floor(tonumber(opts and opts.to_time) or 0))
    local entity_type = db.trim(opts and opts.entity_type)
    local limit = bounded(opts and opts.limit, 100, 500)
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local rows, err = db.query(handle, [[
        SELECT c.target_type AS entity_type, c.target_id AS id,
               c.operation AS kind,
               COALESCE(n.label, e.label, c.target_id) AS label,
               e.from_node_id, e.to_node_id, c.payload_json AS attrs_json,
               c.created_at, c.created_at AS updated_at, c.revision
          FROM chestor_journal_graph_changes c
          LEFT JOIN chestor_journal_graph_nodes n
            ON c.target_type = 'node' AND n.journal_id = c.journal_id
           AND n.graph_id = c.graph_id AND n.id = c.target_id
          LEFT JOIN chestor_journal_graph_edges e
            ON c.target_type = 'edge' AND e.journal_id = c.journal_id
           AND e.graph_id = c.graph_id AND e.id = c.target_id
         WHERE c.journal_id = ? AND c.graph_id = ?
           AND (? = '' OR c.target_type = ?)
           AND (? = 0 OR c.created_at >= ?)
           AND (? = 0 OR c.created_at <= ?)
         ORDER BY c.revision DESC, c.operation ASC, c.target_id ASC LIMIT ? OFFSET ?
    ]], { journal_id, graph_id, entity_type, entity_type,
        from_time, from_time, to_time, to_time, limit + 1, offset })
    if err then return nil, err end
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then
            local item = row :: any
            item.attrs = db.decode(item.attrs_json, {})
            item.attrs_json = nil
            item.created_at = tonumber(item.created_at) or 0
            item.updated_at = tonumber(item.updated_at) or 0
            item.revision = tonumber(item.revision) or 0
            items[#items + 1] = item
        end
    end
    local has_more = #(rows or {}) > limit
    return { items = items, from_time = from_time, to_time = to_time,
        offset = offset, limit = limit, has_more = has_more,
        continuation = has_more and { mode = "timeline", graph_id = graph_id,
            from_time = from_time, to_time = to_time,
            entity_type = entity_type ~= "" and entity_type or nil,
            offset = offset + #items, limit = limit } or nil }, nil
end

function M.evidence(handle: any, journal_id: string, graph_id: string, opts: any): (any?, any?)
    local target_type = db.trim(opts and opts.target_type)
    local target_id = db.trim(opts and (opts.target_id or opts.node_id or opts.edge_id))
    local event_id = db.trim(opts and opts.event_id)
    local limit = bounded(opts and opts.limit, 50, 200)
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local rows, err = db.query(handle, [[
        SELECT e.*, j.event_type, j.title, j.body, j.ts
          FROM chestor_journal_graph_evidence e
          LEFT JOIN chestor_journal_events j ON j.journal_id = e.journal_id AND j.id = e.event_id
         WHERE e.journal_id = ? AND e.graph_id = ?
           AND (? = '' OR e.target_type = ?)
           AND (? = '' OR e.target_id = ?)
           AND (? = '' OR e.event_id = ?)
           ORDER BY e.source_seq DESC, e.event_id DESC LIMIT ? OFFSET ?
    ]], { journal_id, graph_id, target_type, target_type, target_id, target_id, event_id, event_id, limit + 1, offset })
    if err then return nil, err end
    local items: { any } = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then items[#items + 1] = row end
    end
    local has_more = #(rows or {}) > limit
    return { items = items, offset = offset, limit = limit, has_more = has_more,
        continuation = has_more and { mode = "evidence", graph_id = graph_id,
            target_type = target_type ~= "" and target_type or nil,
            target_id = target_id ~= "" and target_id or nil,
            event_id = event_id ~= "" and event_id or nil,
            offset = offset + #items, limit = limit } or nil }, nil
end

function M.changes(handle: any, journal_id: string, graph_id: string, since_revision: number, opts: any): (any?, any?)
    local graph, graph_err = M.graph(handle, journal_id, graph_id)
    if not graph then return nil, graph_err end
    local limit = bounded(opts and opts.limit, 200, 500)
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local rows, err = db.query(handle, [[
        SELECT * FROM chestor_journal_graph_changes
         WHERE journal_id = ? AND graph_id = ? AND revision > ?
         ORDER BY revision ASC, target_type ASC, target_id ASC, operation ASC LIMIT ? OFFSET ?
    ]], { journal_id, graph_id, math.max(0, since_revision), limit + 1, offset })
    if err then return nil, err end
    local out = {}
    for index, row in ipairs(rows or {}) do
        if index <= limit then
            out[#out + 1] = {
                revision = tonumber(row.revision) or 0,
                operation = row.operation,
                target_type = row.target_type,
                target_id = row.target_id,
                payload = db.decode(row.payload_json, {}),
            }
        end
    end
    local overflow = #(rows or {}) > limit
    return { graph = graph, changes = out, snapshot_required = false,
        limit = limit, offset = offset, has_more = overflow,
        continuation = overflow and { mode = "changes", graph_id = graph_id,
            since_revision = since_revision, limit = limit, offset = offset + #out } or nil }, nil
end

function M.event_graphs(handle: any, journal_id: string, event_id: string, limit: number?): (any?, any?)
    local rows, err = db.query(handle, [[
        SELECT DISTINCT g.* FROM chestor_journal_graph_evidence e
          JOIN chestor_journal_graphs g ON g.journal_id = e.journal_id AND g.graph_id = e.graph_id
         WHERE e.journal_id = ? AND e.event_id = ?
         ORDER BY g.updated_at DESC LIMIT ?
    ]], { journal_id, event_id, bounded(limit, 20, 50) })
    if err then return nil, err end
    local out = {}
    for _, row in ipairs(rows or {}) do out[#out + 1] = decode_graph(row) end
    return out, nil
end

-- Resolve one immutable fact to the graph node addresses projected from it.
-- This is deliberately node-only: asking for a node by event id must never
-- fall through to the graph catalog or return graph configuration.
function M.event_nodes(handle: any, journal_id: string, event_id: string,
    graph_id: string?, limit: number?, offset: number?): (any?, any?)
    local id = db.trim(event_id)
    if id == "" then return nil, errors.new({ message = "event_id is required", kind = errors.INVALID }) end
    local graph = db.trim(graph_id)
    local wanted = bounded(limit, 20, 100)
    local skipped = math.max(0, math.floor(tonumber(offset) or 0))
    local statement = [[
        SELECT n.*, e.graph_id AS address_graph_id,
               e.relationship AS evidence_relationship,
               e.source_seq AS evidence_source_seq,
               (SELECT COUNT(*) FROM chestor_journal_graph_nodes c
                 WHERE c.journal_id = n.journal_id AND c.graph_id = n.graph_id
                   AND c.parent_id = n.id) AS child_count
          FROM chestor_journal_graph_evidence e
          JOIN chestor_journal_graph_nodes n
            ON n.journal_id = e.journal_id AND n.graph_id = e.graph_id
           AND n.id = e.target_id
         WHERE e.journal_id = ? AND e.event_id = ? AND e.target_type = 'node'
    ]]
    local params: { any } = { journal_id, id }
    if graph ~= "" then
        statement = statement .. " AND e.graph_id = ?"
        params[#params + 1] = graph
    end
    statement = statement .. " ORDER BY e.source_seq DESC, e.graph_id ASC, e.target_id ASC LIMIT ? OFFSET ?"
    params[#params + 1] = wanted + 1
    params[#params + 1] = skipped
    local rows, err = db.query(handle, statement, params)
    if err then return nil, err end
    local items: { any } = {}
    local seen: any = {}
    for _, row in ipairs(rows or {}) do
        if #items >= wanted then break end
        local key = tostring((row :: any).address_graph_id) .. "\0" .. tostring((row :: any).id)
        if not seen[key] then
            seen[key] = true
            items[#items + 1] = {
                address = { graph_id = row.address_graph_id, node_id = row.id },
                node = decode_node(row),
                relationship = row.evidence_relationship,
                source_seq = tonumber(row.evidence_source_seq) or 0,
            }
        end
    end
    return {
        event_id = id,
        items = items,
        count = #items,
        has_more = #(rows or {}) > wanted,
        continuation = #(rows or {}) > wanted and {
            mode = "node", event_id = id, graph_id = graph ~= "" and graph or nil,
            limit = wanted, offset = skipped + #items,
        } or nil,
    }, nil
end

return M

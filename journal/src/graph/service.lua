local crypto = require("crypto")
local config = require("config")
local operations = require("operations")
local types = require("types")
local thread_log = require("thread_log")
local db = require("db")
local jobs = require("jobs")
local ledger = require("ledger")
local reader = require("reader")
local recall = require("recall")
local execution_identity = require("execution_identity")

local M = {}

local function new_id(prefix: string): (string?, any?)
    local value, err = crypto.random.uuid()
    if err or not value then return nil, errors.new({ message = "could not generate " .. prefix .. " request id: " .. tostring(err), kind = errors.INVALID }) end
    return prefix .. ":" .. tostring(value), nil
end

local function with_read(journal_id: string, fn: (any, string) -> (any?, any?)): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local value, err = fn(handle, thread_id)
    handle:release()
    if err then return nil, err end
    return value, nil
end

-- One keyset page of the catalog, continuation included. Callers that render a
-- list take page.items; nothing gets to see a truncated catalog without also
-- seeing that it was truncated and how to continue.
function M.catalog(journal_id: string, opts: any): (any?, any?)
    return with_read(journal_id, function(handle, thread_id)
        return reader.catalog_page(handle, thread_id, opts or {})
    end)
end

function M.describe(journal_id: string, graph_id: string): (any?, any?)
    return with_read(journal_id, function(handle, thread_id)
        return reader.graph(handle, thread_id, db.trim(graph_id))
    end)
end

function M.query(journal_id: string, graph_id: string?, opts: any): (any?, any?)
    opts = type(opts) == "table" and opts or {}
    local id = db.trim(graph_id or opts.graph_id)
    local mode = string.lower(db.trim(opts.mode))
    if mode == "request" then
        return with_read(journal_id, function(handle, thread_id)
            return reader.request(handle, thread_id, db.trim(opts.request_id))
        end)
    end
    if mode == "node" and db.trim(opts.node_id) == "" and db.trim(opts.event_id) ~= "" then
        return with_read(journal_id, function(handle, thread_id)
            return reader.event_nodes(handle, thread_id, db.trim(opts.event_id), id,
                tonumber(opts.limit), tonumber(opts.offset))
        end)
    end
    if mode == "catalog" or (mode == "" and id == "") then return M.catalog(journal_id, opts) end
    if id == "" then return nil, errors.new({ message = "graph_id is required for mode " .. (mode ~= "" and mode or "window"), kind = errors.INVALID }) end
    if mode == "hybrid" then
        local exact_opts: any = {}
        local semantic_opts: any = {}
        for key, value in pairs(opts) do exact_opts[key] = value; semantic_opts[key] = value end
        local limit = math.max(1, math.min(math.floor(tonumber(opts.limit) or 20), 100))
        local offset = math.max(0, math.floor(tonumber(opts.offset) or 0))
        local graph, graph_err = M.describe(journal_id, id)
        if not graph then return nil, graph_err end
        local wanted = math.max(1, tonumber(graph.node_count) or 0)
        exact_opts.mode = "search"
        exact_opts.offset = 0
        exact_opts.limit = wanted
        semantic_opts.mode = "semantic"
        semantic_opts.offset = nil
        semantic_opts.limit = wanted
        local exact, exact_err = M.query(journal_id, id, exact_opts)
        if not exact then return nil, exact_err end
        local semantic_items, semantic_err = recall.search_graph_nodes(journal_id, id,
            tostring(opts.query or ""), semantic_opts)
        local semantic = semantic_items and { items = semantic_items } or nil
        local ranked: any = {}
        local function add(values: any, source: string)
            for index, raw in ipairs(values or {}) do
                local node = raw :: any
                local node_id = tostring(node.id or "")
                if node_id ~= "" then
                    local item = ranked[node_id]
                    if not item then item = { node = node, score = 0, sources = {} }; ranked[node_id] = item end
                    item.score = item.score + (1 / (60 + index))
                    item.sources[source] = true
                    if source == "semantic" and node.distance ~= nil then
                        local target = item.node :: any
                        target.distance = node.distance
                        target.matched_chunk = node.matched_chunk
                        target.matched_text = node.matched_text
                    end
                end
            end
        end
        add((exact :: any).items, "text")
        if semantic then
            add((semantic :: any).items, "semantic")
        end
        local merged: { any } = {}
        for _, item in pairs(ranked) do
            local node = (item :: any).node
            node.recall = { score = (item :: any).score, sources = (item :: any).sources }
            if (item :: any).sources.text and (item :: any).sources.semantic then node.match = "hybrid"
            elseif (item :: any).sources.text then node.match = "exact"
            else node.match = "semantic" end
            merged[#merged + 1] = node
        end
        table.sort(merged, function(left, right)
            local ls = tonumber((left :: any).recall and (left :: any).recall.score) or 0
            local rs = tonumber((right :: any).recall and (right :: any).recall.score) or 0
            if ls ~= rs then return ls > rs end
            local lu = tonumber((left :: any).updated_at) or 0
            local ru = tonumber((right :: any).updated_at) or 0
            if lu ~= ru then return lu > ru end
            return tostring((left :: any).id or "") < tostring((right :: any).id or "")
        end)
        local page: { any } = {}
        for index = offset + 1, math.min(#merged, offset + limit) do page[#page + 1] = merged[index] end
        local has_more = #merged > offset + limit
        return {
            items = page,
            limit = limit,
            offset = offset,
            has_more = has_more,
            continuation = has_more and {
                mode = "hybrid", graph_id = id, query = opts.query,
                from_time = opts.from_time, to_time = opts.to_time,
                validity = opts.validity,
                node_kind = opts.node_kind, status = opts.status,
                offset = offset + #page, limit = limit,
            } or nil,
            semantic_available = semantic_err == nil,
            semantic_error = semantic_err and tostring(semantic_err) or nil,
            model = types.EMBEDDING_MODEL,
            model_version = types.EMBEDDING_MODEL_VERSION,
        }, nil
    end
    if mode == "semantic" then
        local limit = math.max(1, math.min(math.floor(tonumber(opts.limit) or 20), 100))
        local offset = math.max(0, math.floor(tonumber(opts.offset) or 0))
        local search_opts: any = {}
        for key, value in pairs(opts) do search_opts[key] = value end
        search_opts.limit = limit + 1
        search_opts.offset = offset
        local items, semantic_err = recall.search_graph_nodes(journal_id, id,
            tostring(opts.query or ""), search_opts)
        if not items then return nil, semantic_err end
        local has_more = #items > limit
        if has_more then table.remove(items) end
        local continuation: any = nil
        if has_more then
            continuation = {}
            for key, value in pairs(opts) do continuation[key] = value end
            continuation.mode = "semantic"
            continuation.graph_id = id
            continuation.offset = offset + #items
            continuation.limit = limit
        end
        return { items = items, limit = limit, offset = offset, has_more = has_more,
            continuation = continuation,
            model = types.EMBEDDING_MODEL, model_version = types.EMBEDDING_MODEL_VERSION }, nil
    end
    return with_read(journal_id, function(handle, thread_id)
        if mode == "node" then return reader.node(handle, thread_id, id, db.trim(opts.node_id)) end
        if mode == "graph_path" then return reader.graph_path(handle, thread_id, id, opts) end
        if mode == "path" then return reader.path(handle, thread_id, id, db.trim(opts.node_id), opts) end
        if mode == "neighbors" then return reader.neighbors(handle, thread_id, id, db.trim(opts.node_id), opts) end
        if mode == "context" then return reader.context(handle, thread_id, id, opts) end
        if mode == "search" then return reader.search(handle, thread_id, id, tostring(opts.query or ""), opts) end
        if mode == "timeline" then return reader.timeline(handle, thread_id, id, opts) end
        if mode == "bundle" then return reader.bundle(handle, thread_id, id, opts) end
        if mode == "subtree" then return reader.subtree(handle, thread_id, id, opts) end
        if mode == "evidence" then return reader.evidence(handle, thread_id, id, opts) end
        if mode == "changes" or opts.since_revision ~= nil then
            return reader.changes(handle, thread_id, id, tonumber(opts.since_revision) or 0, opts)
        end
        return reader.window(handle, thread_id, id, opts)
    end)
end

local function assembly_view(run: any, graph_id: string): any
    if not run then return { graph_id = graph_id, status = "never", running = false } end
    local value = run :: any
    value.graph_id = graph_id
    return value
end

-- What the last recompute of this map did, and whether one is under way. Reads
-- pass the same access gate as every other journal read.
function M.assembly_status(journal_id: string, graph_id: string): (any?, any?)
    local id = db.trim(graph_id) ~= "" and db.trim(graph_id) or "map"
    return with_read(journal_id, function(handle, thread_id)
        local run, run_err = ledger.latest(handle, thread_id, id)
        if run_err then return nil, run_err end
        return assembly_view(run, id), nil
    end)
end

-- Requests one on-demand assembly. A run already in flight for this map is the
-- answer rather than a second run: recompute is idempotent and one pass over
-- the log is enough.
function M.assemble(journal_id: string, graph_id: string): (any?, any?)
    local id = db.trim(graph_id) ~= "" and db.trim(graph_id) or "map"
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local graph, graph_err = reader.graph(handle, thread_id, id)
    if not graph then handle:release(); return nil, graph_err end
    local active, active_err = ledger.active(handle, thread_id, id)
    if active_err then handle:release(); return nil, active_err end
    if active then
        handle:release()
        return assembly_view(active, id), nil
    end
    local run_id, id_err = new_id("graph-assembly")
    if not run_id then handle:release(); return nil, id_err end
    local frozen, capture_err = execution_identity.capture(nil)
    if not frozen then handle:release(); return nil, errors.new({ message = "could not capture assembly identity: " .. tostring(capture_err), kind = errors.INVALID }) end
    local identity, row_err = execution_identity.to_row(frozen)
    if not identity then handle:release(); return nil, errors.new({ message = "could not serialize assembly identity: " .. tostring(row_err), kind = errors.INVALID }) end
    local enqueue_err = ledger.enqueue(handle, thread_id, id, run_id, identity)
    if enqueue_err then handle:release(); return nil, enqueue_err end
    local job_id, job_err = jobs.enqueue({
        namespace = "thread",
        scope = thread_id,
        key = run_id,
        owner_locator = { kind = "thread", id = thread_id },
        thread_id = thread_id,
        job_type = types.GRAPH_ASSEMBLY_JOB_TYPE,
        concurrency_key = thread_id .. ":assembly:" .. id,
        immutable_payload = { journal_id = thread_id, graph_id = id, run_id = run_id },
        max_attempts = 3,
    })
    if job_err then handle:release(); return nil, tostring(job_err) end
    if job_id then
        local dispatch_err = ledger.mark(handle, thread_id, run_id, ledger.STATUS.DISPATCHED)
        if dispatch_err then handle:release(); return nil, dispatch_err end
    end
    local run, run_err = ledger.get(handle, thread_id, run_id)
    handle:release()
    if run_err then return nil, run_err end
    return assembly_view(run, id), nil
end

function M.event_graphs(journal_id: string, event_id: string): (any?, any?)
    return with_read(journal_id, function(handle, thread_id)
        return reader.event_graphs(handle, thread_id, event_id, 50)
    end)
end

function M.event_nodes(journal_id: string, event_id: string, graph_id: string?): (any?, any?)
    return with_read(journal_id, function(handle, thread_id)
        return reader.event_nodes(handle, thread_id, event_id, graph_id, 50)
    end)
end

function M.configure(journal_id: string, input: any): (any?, any?)
    local normalized, normalize_err = config.normalize(input)
    if not normalized then return nil, normalize_err end
    local frozen, capture_err = execution_identity.capture(nil)
    if not frozen then return nil, errors.new({ message = "could not capture graph maintainer identity: " .. tostring(capture_err), kind = errors.INVALID }) end
    local identity_row, row_err = execution_identity.to_row(frozen)
    if not identity_row then return nil, errors.new({ message = "could not serialize graph maintainer identity: " .. tostring(row_err), kind = errors.INVALID }) end
    normalized.execution_identity = identity_row
    if normalized.request_id == "" then
        local generated, id_err = new_id("graph-config")
        if not generated then return nil, id_err end
        normalized.request_id = generated
    end
    local receipt, append_err = thread_log.append(journal_id, {{
        type = types.EVENT.GRAPH_CONFIG_REQUESTED,
        role = "user",
        body = normalized,
        external = {
            external_source = "chestor.journal.graph.config",
            external_id = normalized.request_id,
            external_version = "v1",
        },
    }})
    if not receipt then return nil, append_err end
    local result: any = receipt
    result.request_id = normalized.request_id
    result.graph_id = normalized.graph_id
    result.expected_config_revision = normalized.expected_config_revision
    result.status = "queued"
    return result, nil
end

function M.apply(journal_id: string, input: any): (any?, any?)
    local request: any = {}
    for key, value in pairs(type(input) == "table" and input or {}) do request[key] = value end
    if db.trim(request.request_id or request.idempotency_key) == "" then
        local generated, id_err = new_id("graph-ops")
        if not generated then return nil, id_err end
        request.request_id = generated
    end
    local normalized, normalize_err = operations.normalize(request)
    if not normalized then return nil, normalize_err end
    local receipt, append_err = thread_log.append(journal_id, {{
        type = types.EVENT.GRAPH_OPS_REQUESTED,
        role = "user",
        body = normalized,
        external = {
            external_source = "chestor.journal.graph.operations",
            external_id = normalized.request_id,
            external_version = "v1",
        },
    }})
    if not receipt then return nil, append_err end
    local result: any = receipt
    local touched: { any } = {}
    for _, operation in ipairs(normalized.operations or {}) do
        touched[#touched + 1] = { id = (operation :: any).id,
            type = tostring((operation :: any).op or ""):match("^(%w+)") }
    end
    result.request_id = normalized.request_id
    result.graph_id = normalized.graph_id
    result.expected_revision = normalized.expected_revision
    result.status = "queued"
    result.touched = touched
    return result, nil
end

return M

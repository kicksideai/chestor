local hash = require("hash")
local db_ops = require("db")
local search_text = require("search_text")
local types = require("types")
local retrieval_state = require("retrieval_state")

local M = {}

local function vector_literal(vector: any): (string?, error?)
    if type(vector) ~= "table" then return nil, errors.new({ kind = errors.INVALID, message = "embedding vector must be an array" }) end
    local values: { string } = {}
    for index, raw in ipairs(vector :: { any }) do
        local value = tonumber(raw)
        if value == nil or value ~= value or value == math.huge or value == -math.huge then
            return nil, errors.new({ kind = errors.INVALID, message = "embedding vector contains a non-finite value at index " .. tostring(index) })
        end
        values[index] = tostring(value)
    end
    return "[" .. table.concat(values, ",") .. "]", nil
end

local function dialect(db: any): (string?, error?)
    local value, err
    if type(db.type) == "function" then
        value, err = db:type()
    elseif type(db.db_type) == "function" then
        -- SQL transactions expose the owning database dialect through
        -- db_type(), while connection handles expose type(). Embedding writes
        -- intentionally run in one transaction, so both executor shapes are
        -- part of the production path.
        value, err = db:db_type()
    else
        return nil, errors.new({ kind = errors.INTERNAL, message = "embedding database executor does not expose its type" })
    end
    if err then return nil, err end
    local kind = tostring(value)
    if kind ~= "sqlite" and kind ~= "postgres" then return nil, errors.new({ kind = errors.INTERNAL, message = "unsupported vector database type: " .. kind }) end
    return kind, nil
end

local function index_key(journal_id: string, model: string, model_version: string,
    source_type: string?, graph_id: string?): string
    -- sqlite-vec partitions the KNN candidate set by this exact key. Keeping
    -- model version in the partition prevents old vectors crowding a rollout's
    -- top-k before SQL filtering is applied.
    return journal_id .. "\31" .. model .. "\31" .. model_version .. "\31"
        .. db_ops.trim(source_type) .. "\31" .. db_ops.trim(graph_id)
end

local function source_row(db: any, journal_id: string, source: any): (any?, error?)
    if type(source) == "table" then return source, nil end
    local event_id = db_ops.trim(source)
    if event_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "embedding source event id is required" }) end
    local rows, err = db_ops.query(db,
        "SELECT * FROM chestor_journal_events WHERE journal_id = ? AND id = ? LIMIT 1",
        { journal_id, event_id })
    if err then return nil, err end
    if not rows or not rows[1] then return nil, errors.new({ kind = errors.NOT_FOUND, message = "embedding source event not found: " .. event_id }) end
    return rows[1], nil
end

local function decode_event(row: any): any
    local metadata = db_ops.decode(row.metadata, {})
    local lifecycle = string.lower(db_ops.trim(type(metadata) == "table" and (metadata :: any).lifecycle or ""))
    if lifecycle == "" then lifecycle = "active" end
    return {
        id = row.id,
        seq = tonumber(row.seq) or 0,
        ts = tonumber(row.ts) or 0,
        event_type = row.event_type,
        title = row.title,
        body = row.body,
        actor_id = row.actor_id,
        actor_type = row.actor_type,
        tags = db_ops.decode(row.tags, {}),
        linked_component_ids = db_ops.decode(row.linked_component_ids, {}),
        linked_upload_ids = db_ops.decode(row.linked_upload_ids, {}),
        linked_file_paths = db_ops.decode(row.linked_file_paths, {}),
        linked_task_ids = db_ops.decode(row.linked_task_ids, {}),
        task_id = row.task_id,
        cursor_id = row.cursor_id,
        episode_id = row.episode_id,
        correlation_id = row.correlation_id,
        causation_id = row.causation_id,
        metadata = metadata,
        lifecycle = lifecycle,
        effective_state = db_ops.trim(row.effective_state) ~= "" and row.effective_state or lifecycle,
        superseded_by_event_id = row.superseded_by_event_id,
        supersedes_event_id = row.supersedes_event_id,
        embedding_status = row.embedding_status,
    }
end

function M.event_text(event: any): string
    return search_text.document(event)
end

function M.source_text(source: any): string
    if type(source) == "table" and db_ops.trim((source :: any).source_type) == "node" then
        local copy: any = {}
        for key, value in pairs(source :: any) do copy[key] = value end
        copy.fields = db_ops.decode(copy.metadata, {})
        copy.metadata = copy.fields
        return search_text.document(copy)
    end
    return search_text.document(source)
end

function M.reset_sources(db: any, journal_id: string, sources: { any }, model: string,
    model_version: string): error?
    for offset = 1, #sources, 100 do
        local values: { string } = {}
        local params: { any } = {}
        for index = offset, math.min(#sources, offset + 99) do
            local source = sources[index] :: any
            local source_type = db_ops.trim(source.source_type)
            if source_type == "" then source_type = "event" end
            values[#values + 1] = "(?, ?, ?)"
            params[#params + 1] = source_type
            params[#params + 1] = db_ops.trim(source.source_id or source.id)
            params[#params + 1] = db_ops.trim(source.graph_id)
        end
        params[#params + 1] = journal_id
        params[#params + 1] = model
        params[#params + 1] = model_version
        local identities = "WITH sources(source_type, source_id, graph_id) AS (VALUES " .. table.concat(values, ",") .. ") "
        local predicate = [[d.journal_id = ? AND d.model = ? AND d.model_version = ?
            AND EXISTS (SELECT 1 FROM sources s WHERE s.source_type = d.source_type
                AND s.source_id = d.source_id AND s.graph_id = COALESCE(d.graph_id, ''))]]
        local rows, read_err = db_ops.query(db, identities .. [[
            SELECT DISTINCT d.document_id, v.vector_id
              FROM chestor_journal_embedding_documents d
              LEFT JOIN chestor_journal_embedding_vectors v
                ON v.journal_id = d.journal_id AND v.document_id = d.document_id
               AND v.model = d.model AND v.model_version = d.model_version
             WHERE ]] .. predicate, params)
        if read_err then return read_err end
        if #(rows or {}) > 0 then
            local vector_ids: { string } = {}
            local seen: any = {}
            for _, row in ipairs(rows or {}) do
                local id = db_ops.trim((row :: any).vector_id)
                if id ~= "" and not seen[id] then vector_ids[#vector_ids + 1] = id; seen[id] = true end
            end
            for vector_offset = 1, #vector_ids, 100 do
                local marks: { string } = {}
                local ids: { any } = {}
                for index = vector_offset, math.min(#vector_ids, vector_offset + 99) do
                    marks[#marks + 1] = "?"
                    ids[#ids + 1] = vector_ids[index]
                end
                local delete_err = db_ops.exec(db,
                    "DELETE FROM chestor_journal_embedding_vectors WHERE vector_id IN (" .. table.concat(marks, ",") .. ")", ids)
                if delete_err then return delete_err end
            end
            local delete_err = db_ops.exec(db, identities ..
                "DELETE FROM chestor_journal_embedding_documents AS d WHERE " .. predicate, params)
            if delete_err then return delete_err end
        end
    end
    return nil
end

function M.reset_source(db: any, journal_id: string, source: any, model: string,
    model_version: string): error?
    return M.reset_sources(db, journal_id, { source }, model, model_version)
end

local DOCUMENT_INSERT = [[
INSERT INTO chestor_journal_embedding_documents
            (journal_id, document_id, source_type, source_id, graph_id, node_id,
             source_revision, content_hash, chunk_index, content, model, model_version,
             provider_version, dimensions, status, attempts, next_retry_at,
             created_at, updated_at)
]]
local DOCUMENT_UPDATE = [[
ON CONFLICT(journal_id, document_id, model, model_version) DO UPDATE SET
            source_type = excluded.source_type,
            source_id = excluded.source_id,
            graph_id = excluded.graph_id,
            node_id = excluded.node_id,
            source_revision = excluded.source_revision,
            content_hash = excluded.content_hash,
            chunk_index = excluded.chunk_index,
            content = excluded.content,
            provider_version = excluded.provider_version,
            dimensions = excluded.dimensions,
            status = 'embedded',
            attempts = 0,
            next_retry_at = NULL,
            updated_at = excluded.updated_at
]]
local VECTOR_INSERT = [[
    INSERT INTO chestor_journal_embedding_vectors
        (vector_id, index_key, journal_id, document_id, model, model_version, embedding)
]]
local VECTOR_UPDATE = [[
    ON CONFLICT(journal_id, document_id, model, model_version) DO UPDATE SET
        vector_id = excluded.vector_id,
        index_key = excluded.index_key,
        embedding = excluded.embedding
]]

function M.upsert_batch(db: any, journal_id: string, items: { any }, model: string,
    dimensions: number, model_version: string?, provider_version: string?): error?
    dimensions = math.floor(tonumber(dimensions) or 0)
    if dimensions ~= types.EMBEDDING_DIMENSIONS then
        return errors.new({ kind = errors.INVALID, message = "embedding vector dimensions do not match the index dimensions" })
    end
    local documents: { any } = {}
    local vectors: { any } = {}
    local events: { string } = {}
    local event_seen: any = {}
    local positions: any = {}
    local now = db_ops.now()
    for _, item in ipairs(items) do
        local vector = item.vector
        if type(vector) ~= "table" or #vector ~= dimensions then
            return errors.new({ kind = errors.INVALID, message = "embedding vector dimensions do not match the declared dimensions" })
        end
        local row, row_err = source_row(db, journal_id, item.source)
        if not row then return row_err end
        local source_type = db_ops.trim(row.source_type)
        if source_type == "" then source_type = "event" end
        local source_id = db_ops.trim(row.source_id or row.id)
        local graph_id = db_ops.trim(row.graph_id)
        local node_id = db_ops.trim(row.node_id)
        local source_revision = tonumber(row.source_revision or row.seq) or 0
        local event_id = source_type == "event" and source_id or ""
        model = db_ops.trim(model)
        model_version = db_ops.trim(model_version)
        if model == "" or model_version == "" then return errors.new({ kind = errors.INVALID, message = "embedding model and model_version are required" }) end
        local literal, literal_err = vector_literal(vector)
        if not literal then return literal_err end
        local content = tostring(row.content or "")
        if content == "" then content = M.source_text(row) end
        local chunk_index = math.max(0, math.floor(tonumber(row.chunk_index) or 0))
        local document_id = source_type .. ":" .. graph_id .. ":" .. source_id .. ":" .. tostring(chunk_index)
        local key = index_key(journal_id, model, model_version, source_type, graph_id)
        local vector_id = tostring(hash.sha256(key .. "\31" .. document_id))
        local position = positions[document_id] or (#documents + 1)
        positions[document_id] = position
        documents[position] = { journal_id, document_id, source_type, source_id,
            graph_id ~= "" and graph_id or nil, node_id ~= "" and node_id or nil,
            source_revision, tostring(hash.sha256(content)), chunk_index, content, model, model_version,
            db_ops.trim(provider_version) ~= "" and provider_version or nil,
            dimensions, "embedded", 0, nil, now, now }
        vectors[position] = { vector_id, key, journal_id, document_id, model, model_version, literal }
        if source_type == "event" and not event_seen[event_id] then
            event_seen[event_id] = true
            events[#events + 1] = event_id
        end
    end
    if #documents == 0 then return nil end
    local db_type, dialect_err = dialect(db)
    if not db_type then return dialect_err end
    local document_err = db_ops.insert_rows(db, DOCUMENT_INSERT, documents, 19, DOCUMENT_UPDATE)
    if document_err then return document_err end
    if db_type == "sqlite" then
        for offset = 1, #vectors, 100 do
            local marks: { string } = {}
            local params: { any } = {}
            for index = offset, math.min(#vectors, offset + 99) do
                marks[#marks + 1] = "?"
                params[#params + 1] = vectors[index][1]
            end
            local delete_err = db_ops.exec(db, "DELETE FROM chestor_journal_embedding_vectors WHERE vector_id IN (" .. table.concat(marks, ",") .. ")", params)
            if delete_err then return delete_err end
        end
    end
    local vector_err = db_ops.insert_rows(db, VECTOR_INSERT, vectors, 7,
        db_type == "postgres" and VECTOR_UPDATE or "",
        db_type == "postgres" and { "?", "?", "?", "?", "?", "?", "CAST(? AS vector)" } or nil)
    if vector_err then return vector_err end
    for offset = 1, #events, 100 do
        local marks: { string } = {}
        local params: { any } = { journal_id }
        for index = offset, math.min(#events, offset + 99) do
            marks[#marks + 1] = "?"
            params[#params + 1] = events[index]
        end
        local event_err = db_ops.exec(db,
            "UPDATE chestor_journal_events SET embedding_status = 'embedded' WHERE journal_id = ? AND id IN (" .. table.concat(marks, ",") .. ")", params)
        if event_err then return event_err end
    end
    return nil
end

function M.upsert(db: any, journal_id: string, source: any, vector: any, model: string,
    dimensions: number, model_version: string?, provider_version: string?): error?
    return M.upsert_batch(db, journal_id, { { source = source, vector = vector } },
        model, dimensions, model_version, provider_version)
end

local function native_search(db: any, journal_id: string, query_vector: any, limit: number,
    model: string, model_version: string, opts: any?): (any?, error?)
    local literal, literal_err = vector_literal(query_vector)
    if not literal then return nil, literal_err end
    local db_type, dialect_err = dialect(db)
    if not db_type then return nil, dialect_err end
    local from_time = math.max(0, math.floor(tonumber(opts and opts.from_time) or 0))
    local to_time = math.max(0, math.floor(tonumber(opts and opts.to_time) or 0))
    local validity, validity_err = retrieval_state.normalize(opts and opts.validity)
    if not validity then return nil, validity_err end
    local state_expr = retrieval_state.event_expression(db_type, "e")
    local state_clause, state_params = retrieval_state.filter(state_expr, validity)
    local successor_expr = retrieval_state.successor_expression("e")
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local distance = db_type == "sqlite" and "vec_distance_cosine(v.embedding, ?)"
        or "(v.embedding <=> CAST(? AS vector))"
    local params: { any } = { literal, journal_id, model, model_version,
        from_time, from_time, to_time, to_time }
    for _, value in ipairs(state_params) do params[#params + 1] = value end
    params[#params + 1] = limit
    params[#params + 1] = offset
    local rows, query_err = db_ops.query(db, [[
        WITH distances AS (
            SELECT e.*, ]] .. distance .. [[ AS distance,
                   ]] .. state_expr .. [[ AS effective_state,
                   ]] .. successor_expr .. [[ AS superseded_by_event_id
              FROM chestor_journal_embedding_vectors v
              JOIN chestor_journal_embedding_documents d
                ON d.journal_id = v.journal_id AND d.document_id = v.document_id
               AND d.model = v.model AND d.model_version = v.model_version
              JOIN chestor_journal_events e
                ON e.journal_id = d.journal_id AND e.id = d.source_id
             WHERE v.journal_id = ? AND v.model = ? AND v.model_version = ?
               AND d.status = 'embedded' AND d.source_type = 'event'
               AND (? = 0 OR e.ts >= ?) AND (? = 0 OR e.ts <= ?)
               ]] .. state_clause .. [[
        ), ranked AS (
            SELECT distances.*, ROW_NUMBER() OVER (PARTITION BY id ORDER BY distance) AS source_rank
              FROM distances
        )
        SELECT * FROM ranked WHERE source_rank = 1
         ORDER BY distance ASC, id ASC LIMIT ? OFFSET ?
    ]], params)
    if query_err then return nil, query_err end
    local out: { any } = {}
    for _, row in ipairs(rows or {}) do
        local event = decode_event(row)
        event.distance = tonumber((row :: any).distance)
        out[#out + 1] = event
    end
    return out, nil
end

function M.search_nodes(db: any, journal_id: string, graph_id: string, query_vector: any,
    limit: number, model: string, model_version: string, opts: any): (any?, error?)
    local literal, literal_err = vector_literal(query_vector)
    if not literal then return nil, literal_err end
    local db_type, dialect_err = dialect(db)
    if not db_type then return nil, dialect_err end
    local wanted = math.max(1, math.floor(tonumber(limit) or 20))
    local from_time = math.max(0, math.floor(tonumber(opts and opts.from_time) or 0))
    local to_time = math.max(0, math.floor(tonumber(opts and opts.to_time) or 0))
    local node_kind = db_ops.trim(opts and opts.node_kind)
    local status = db_ops.trim(opts and opts.status)
    local validity, validity_err = retrieval_state.normalize(opts and opts.validity)
    if not validity then return nil, validity_err end
    local state_expr = retrieval_state.event_expression(db_type, "source")
    local state_clause, state_params = retrieval_state.filter(state_expr, validity)
    local successor_expr = retrieval_state.successor_expression("source")
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local distance = db_type == "sqlite" and "vec_distance_cosine(v.embedding, ?)"
        or "(v.embedding <=> CAST(? AS vector))"
    local params: { any } = { literal, journal_id, model, model_version, graph_id,
        from_time, from_time, to_time, to_time, node_kind, node_kind, status, status }
    for _, value in ipairs(state_params) do params[#params + 1] = value end
    params[#params + 1] = wanted
    params[#params + 1] = offset
    local rows, query_err = db_ops.query(db, [[
        WITH distances AS (
            SELECT n.*, ]] .. distance .. [[ AS distance,
                   d.chunk_index AS matched_chunk_index, d.content AS matched_content,
                   ]] .. state_expr .. [[ AS effective_state,
                   ]] .. successor_expr .. [[ AS superseded_by_event_id
              FROM chestor_journal_embedding_vectors v
              JOIN chestor_journal_embedding_documents d
                ON d.journal_id = v.journal_id AND d.document_id = v.document_id
               AND d.model = v.model AND d.model_version = v.model_version
              JOIN chestor_journal_graph_nodes n
                ON n.journal_id = d.journal_id AND n.graph_id = d.graph_id AND n.id = d.node_id
              LEFT JOIN chestor_journal_events source
                ON source.journal_id = n.journal_id AND source.id = n.ref_id
             WHERE v.journal_id = ? AND v.model = ? AND v.model_version = ?
               AND d.status = 'embedded' AND d.source_type = 'node' AND d.graph_id = ?
               AND (? = 0 OR n.updated_at >= ?) AND (? = 0 OR n.updated_at <= ?)
               AND (? = '' OR n.node_kind = ?)
               AND (? = '' OR COALESCE(n.status, '') = ?)
               ]] .. state_clause .. [[
        ), ranked AS (
            SELECT distances.*, ROW_NUMBER() OVER (PARTITION BY id ORDER BY distance, matched_chunk_index) AS source_rank
              FROM distances
        )
        SELECT * FROM ranked WHERE source_rank = 1
         ORDER BY distance ASC, id ASC LIMIT ? OFFSET ?
    ]], params)
    if query_err then return nil, query_err end
    local out: { any } = {}
    for _, row in ipairs(rows or {}) do
        out[#out + 1] = {
            id = row.id, semantic_key = row.semantic_key, label = row.label,
            kind = row.node_kind, summary = row.summary, status = row.status,
            ref_id = row.ref_id, parent_id = row.parent_id,
            attrs = db_ops.decode(row.metadata, {}),
            revision = tonumber(row.updated_revision) or 0,
            created_at = tonumber(row.created_at) or 0,
            updated_at = tonumber(row.updated_at) or 0,
            distance = tonumber(row.distance),
            matched_chunk = tonumber(row.matched_chunk_index) or 0,
            matched_text = row.matched_content,
            effective_state = row.effective_state,
            superseded_by_event_id = row.superseded_by_event_id,
        }
    end
    return out, nil
end

function M.search(db: any, journal_id: string, query_vector: any, limit: number,
    model: string?, model_version: string?, opts: any?): (any?, string?)
    local wanted = math.max(1, math.floor(tonumber(limit) or 20))
    if type(query_vector) ~= "table" then return nil, "query embedding must be an array" end
    if #query_vector ~= types.EMBEDDING_DIMENSIONS then
        return nil, "embedding vector dimensions do not match the index dimensions"
    end
    model = db_ops.trim(model) ~= "" and model or types.EMBEDDING_MODEL
    model_version = db_ops.trim(model_version) ~= "" and model_version or types.EMBEDDING_MODEL_VERSION
    return native_search(db, journal_id, query_vector, wanted,
        model :: string, model_version :: string, opts)
end

return M

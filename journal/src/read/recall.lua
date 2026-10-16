local llm = require("llm")
local availability = require("availability")
local types = require("types")
local thread_log = require("thread_log")
local db_ops = require("db")
local reader = require("reader")
local embeddings = require("embeddings")

local M = {}

local function trim(value: any): string
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

local function bounded(value: any, fallback: number, maximum: number): number
    return math.max(1, math.min(math.floor(tonumber(value) or fallback), maximum))
end

local function embed_texts(texts: any): (any?, any?)
    local response, embed_err = llm.embed(
        texts,
        { model = types.EMBEDDING_MODEL, dimensions = types.EMBEDDING_DIMENSIONS }
    )
    if embed_err or not response then return nil, tostring(embed_err or "empty embedding response") end
    if type(response.result) ~= "table" or #response.result ~= #texts then
        return nil, errors.new({ message = "embedding result count does not match input count", kind = errors.INVALID })
    end
    for _, vector in ipairs(response.result) do
        if type(vector) ~= "table" or #vector ~= types.EMBEDDING_DIMENSIONS then
            return nil, errors.new({ message = "embedding vector dimensions do not match configured dimensions", kind = errors.INVALID })
        end
    end
    return response.result, nil
end

local function embed_text(text: string): (any?, any?)
    local vectors, embed_err = embed_texts({ text })
    if not vectors then return nil, embed_err end
    return vectors[1], nil
end

local CHUNK_BYTES = 6000
local CHUNK_OVERLAP = 400

local function chunk_text(text: string): { string }
    if #text <= CHUNK_BYTES then return { text } end
    local chunks: { string } = {}
    local start_at: integer = 1
    while start_at <= #text do
        local finish: integer = math.floor(math.min(#text, start_at + CHUNK_BYTES - 1))
        if finish < #text then
            while finish > start_at and (string.byte(text, finish) or 0) >= 128
                and (string.byte(text, finish) or 0) < 192 do finish = finish - 1 end
            local boundary: integer = finish
            while boundary > start_at + math.floor(CHUNK_BYTES * .72) do
                local char = text:sub(boundary, boundary)
                if char == "\n" or char == " " or char == "\t" then break end
                boundary = boundary - 1
            end
            if boundary > start_at + math.floor(CHUNK_BYTES * .72) then finish = boundary end
        end
        chunks[#chunks + 1] = text:sub(start_at, finish)
        if finish >= #text then break end
        start_at = math.floor(math.max(start_at + 1, finish - CHUNK_OVERLAP + 1))
        while start_at <= #text and (string.byte(text, start_at) or 0) >= 128
            and (string.byte(text, start_at) or 0) < 192 do start_at = start_at + 1 end
    end
    return chunks
end

local function embed_text_batches(texts: { string }): (any?, any?)
    local vectors: { any } = {}
    for offset = 1, #texts, 64 do
        local batch: { string } = {}
        for index = offset, math.min(#texts, offset + 63) do batch[#batch + 1] = texts[index] end
        local result, result_err = embed_texts(batch)
        if not result then return nil, result_err end
        for _, vector in ipairs(result) do vectors[#vectors + 1] = vector end
    end
    return vectors, nil
end

function M.embed_pending(journal_id: string, limit: number?): (any?, any?)
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local state = availability.state()
    if state.status == "unavailable" then
        state.embedded = 0
        state.processed = 0
        return state, nil
    end
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local rows, pending_err = reader.pending_embeddings(db, thread_id, bounded(limit, 16, 64),
        types.EMBEDDING_MODEL, types.EMBEDDING_MODEL_VERSION)
    if pending_err then db:release(); return nil, pending_err end
    if #(rows or {}) == 0 then db:release(); return { embedded = 0, processed = 0 }, nil end
    local texts: { string } = {}
    local work: { any } = {}
    for _, row in ipairs(rows or {}) do
        local chunks = chunk_text(embeddings.source_text(row))
        local item: any = { source = row, chunks = {} }
        for index, content in ipairs(chunks) do
            texts[#texts + 1] = content
            item.chunks[#item.chunks + 1] = { index = index - 1, content = content, vector_index = #texts }
        end
        work[#work + 1] = item
    end
    local vectors, embed_err = embed_text_batches(texts)
    if not vectors then db:release(); return nil, embed_err end
    local tx, begin_err = db:begin()
    if begin_err or not tx then db:release(); return nil, errors.new({ message = "failed to begin embedding transaction: " .. tostring(begin_err), kind = errors.INVALID }) end
    local reset_err = embeddings.reset_sources(tx, thread_id, rows,
        types.EMBEDDING_MODEL, types.EMBEDDING_MODEL_VERSION)
    if reset_err then tx:rollback(); db:release(); return nil, reset_err end
    local writes: { any } = {}
    for _, item in ipairs(work) do
        local source = (item :: any).source
        for _, chunk in ipairs((item :: any).chunks) do
            local value: any = {}
            for key, field in pairs(source) do value[key] = field end
            value.chunk_index = (chunk :: any).index
            value.content = (chunk :: any).content
            writes[#writes + 1] = { source = value, vector = vectors[(chunk :: any).vector_index] }
        end
    end
    local write_err = embeddings.upsert_batch(tx, thread_id, writes, types.EMBEDDING_MODEL,
        types.EMBEDDING_DIMENSIONS, types.EMBEDDING_MODEL_VERSION)
    if write_err then tx:rollback(); db:release(); return nil, write_err end
    local _, commit_err = tx:commit()
    if commit_err then tx:rollback(); db:release(); return nil, errors.new({ message = "failed to commit embeddings: " .. tostring(commit_err), kind = errors.INVALID }) end
    db:release()
    local last = rows and rows[#rows] or {}
    local continuation_key = table.concat({
        tostring((last :: any).source_type or "event"),
        tostring((last :: any).graph_id or ""),
        tostring((last :: any).source_id or (last :: any).id or ""),
        tostring((last :: any).seq or 0),
    }, ":")
    return { embedded = #work, processed = #(rows or {}), continuation_key = continuation_key }, nil
end

function M.search_graph_nodes(journal_id: string, graph_id: string, query_text: string, opts: any): (any?, any?)
    local query = trim(query_text)
    if query == "" then return {}, nil end
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local vector, embed_err = embed_text(query)
    if not vector then return nil, embed_err end
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local results, search_err = embeddings.search_nodes(db, thread_id, graph_id, vector,
        math.max(1, math.floor(tonumber(opts and opts.limit) or 20)), types.EMBEDDING_MODEL,
        types.EMBEDDING_MODEL_VERSION, opts or {})
    db:release()
    if search_err then return nil, search_err end
    return results, nil
end

function M.search_vector(journal_id: string, query_text: string, opts: any): (any?, any?)
    local query = trim(query_text)
    if query == "" then return {}, nil end
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local vector, embed_err = embed_text(query)
    if not vector then return nil, embed_err end
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local results, search_err = embeddings.search(db, thread_id, vector,
        math.max(1, math.floor(tonumber(opts and opts.limit) or 20)), types.EMBEDDING_MODEL,
        types.EMBEDDING_MODEL_VERSION, opts)
    db:release()
    if search_err then return nil, search_err end
    return results, nil
end

function M.search(journal_id: string, query_text: string, opts: any): (any?, any?)
    local query = trim(query_text)
    if query == "" then return { events = {}, semantic_available = false, offset = 0, limit = 20, has_more = false }, nil end
    local _, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not thread_id then return nil, resolve_err end
    local limit = bounded(opts and opts.limit, 20, 100)
    local offset = math.max(0, math.floor(tonumber(opts and opts.offset) or 0))
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local stats, stats_err = reader.stats(db, thread_id)
    if not stats then db:release(); return nil, stats_err end
    local wanted = math.max(1, tonumber(stats.total) or 0)
    local search_opts: any = {}
    for key, value in pairs(opts or {}) do search_opts[key] = value end
    search_opts.offset = 0
    local exact, exact_err = reader.search_text(db, thread_id, query, wanted, search_opts)
    db:release()
    if exact_err then return nil, exact_err end

    local semantic, semantic_err = M.search_vector(journal_id, query, {
        limit = wanted, from_time = opts and opts.from_time, to_time = opts and opts.to_time,
        validity = opts and opts.validity,
    })
    -- Reciprocal-rank fusion prevents the old exact-first concatenation from
    -- starving associative results while preserving deterministic evidence
    -- identities and exposing why each item ranked.
    local ranked: any = {}
    local function add(values: any, source: string)
        for index, event in ipairs(values or {}) do
            local id = tostring((event :: any).id or "")
            if id ~= "" then
                local item = ranked[id]
                if not item then item = { event = event, score = 0, sources = {} }; ranked[id] = item end
                item.score = item.score + (1 / (60 + index))
                item.sources[source] = true
                if source == "semantic" and (event :: any).distance ~= nil then
                    (item.event :: any).distance = (event :: any).distance
                end
            end
        end
    end
    add(exact, "text")
    if not semantic_err then
        add(semantic, "semantic")
    end
    local merged = {}
    for _, item in pairs(ranked) do
        local event = (item :: any).event
        event.recall = { score = (item :: any).score, sources = (item :: any).sources }
        merged[#merged + 1] = event
    end
    table.sort(merged, function(left, right)
        local ls = tonumber((left :: any).recall and (left :: any).recall.score) or 0
        local rs = tonumber((right :: any).recall and (right :: any).recall.score) or 0
        if ls ~= rs then return ls > rs end
        return (tonumber((left :: any).seq) or 0) > (tonumber((right :: any).seq) or 0)
    end)
    local page = {}
    for index = offset + 1, math.min(#merged, offset + limit) do page[#page + 1] = merged[index] end
    return {
        events = page,
        semantic_available = semantic_err == nil,
        temporal = {
            from_time = tonumber(opts and opts.from_time) or nil,
            to_time = tonumber(opts and opts.to_time) or nil,
        },
        validity = trim(opts and opts.validity) ~= "" and trim(opts and opts.validity) or "current",
        offset = offset,
        limit = limit,
        has_more = #merged > offset + limit,
    }, nil
end

return M

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Folds reader messages into events and a final answer. Complete and replace
-- observations carry snapshots; only append carries a delta. Retained text
-- passes the filter before the log and result limits apply.
local credentials = require("credentials")
local canonical_json = require("canonical_json")
local drivers = require("drivers")

type Kind = "assistant" | "reasoning" | "tool" | "tool_result" | "tool_error" | "system" | "error"
type Event = {kind: Kind, text: string}
type Text = {text: string, dropped: integer}
type Segment = {channel: string, text: string, dropped: integer, answer: Text?, done: boolean, ordinal: integer, message: integer,
    answer_message: integer?, answer_start: integer?, answer_dropped: integer?, position: integer, base: integer, divergent: boolean}
type Folder = {rate_limits: {[string]: unknown}?, segments: {[string]: Segment}, emitted: {[string]: integer}, order: {string}, filter: (string) -> string,
    result_bytes: integer, event_text_bytes: integer, answer: Text?, answer_ordinal: integer, partial: Text?, partial_ordinal: integer, ordinal: integer, step: integer, message: integer}

local M = {}

M.MAX_RESULT_BYTES = 1024 * 1024
local MAX_TEXT = 8000
-- Account import and credential refresh enforce this bound. Retaining this
-- overlap lets the filter see a whole credential crossing either boundary.
local CREDENTIAL_BOUND = credentials.MAX_BYTES
local MAX_OPEN_SEGMENTS = 64

local text_bytes = require("text")
local clipped = text_bytes.clipped

function M.clip(text: string, limit: integer?): string
    return clipped(text, limit or MAX_TEXT, 0)
end

function M.new(filter: (string) -> string, result_bytes: integer?, event_text_bytes: integer?): Folder
    return {segments = {}, emitted = {}, order = {}, filter = filter, ordinal = 0, answer_ordinal = 0, partial_ordinal = 0,
        step = 0, message = 0, result_bytes = result_bytes or M.MAX_RESULT_BYTES, event_text_bytes = event_text_bytes or MAX_TEXT}
end

local function shown(folder: Folder, text: string): string
    return M.clip(folder.filter(text), folder.event_text_bytes)
end

local function content_text(content: {text: string?, artifact_ref: string?}): string
    if content.text then return content.text end
    if content.artifact_ref then return "[artifact " .. content.artifact_ref .. "]" end
    return ""
end

local function grow(segment: Text, text: string, limit: integer)
    local room = limit + CREDENTIAL_BOUND - #segment.text
    local head = text_bytes.head(text, math.max(room, 0))
    segment.text = segment.text .. head
    segment.dropped = segment.dropped + #text - #head
end

local function remember(folder: Folder, segment: Segment)
    local answer = segment.answer
    if not answer or answer.text == "" then return end
    -- A replacement of an already selected answer supersedes that answer
    -- even when the codec delivers its snapshot as replace plus appends.
    if segment.done or segment.answer_message == folder.answer_ordinal then
        if segment.message < folder.answer_ordinal then return end
        if segment.message > folder.answer_ordinal then
            folder.answer = {text = "", dropped = 0}
            folder.answer_ordinal = segment.message
        end
        local combined: Text = folder.answer or {text = "", dropped = 0}
        if segment.answer_message ~= segment.message then
            if combined.text ~= "" then grow(combined, "\n", folder.result_bytes) end
            segment.answer_message = segment.message
            segment.answer_start, segment.answer_dropped = #combined.text, combined.dropped
        end
        combined.text = combined.text:sub(1, segment.answer_start or 0)
        combined.dropped = segment.answer_dropped or 0
        grow(combined, answer.text, folder.result_bytes)
        combined.dropped = combined.dropped + answer.dropped
        folder.answer = combined
    elseif segment.ordinal >= folder.partial_ordinal then
        folder.partial = {text = answer.text, dropped = answer.dropped}
        folder.partial_ordinal = segment.ordinal
    end
end

local function emit(folder: Folder, id: string, segment: Segment, out: {Event})
    remember(folder, segment)
    local identity = segment.channel .. ":" .. id
    local logged = folder.emitted[identity] or 0
    if not segment.divergent and segment.position > logged then
        local suffix = segment.text:sub(logged - segment.base + 1)
        out[#out + 1] = {kind = segment.channel == "reasoning_summary" and "reasoning" or "assistant",
            text = clipped(folder.filter(suffix), folder.event_text_bytes, segment.position - logged - #suffix)}
        folder.emitted[identity] = segment.position
    end
end

local function forget(folder: Folder, id: string, out: {Event})
    local segment: Segment? = folder.segments[id]
    if segment then emit(folder, id, segment, out) end
    folder.segments[id] = nil
    for index, held in ipairs(folder.order) do
        if held == id then table.remove(folder.order, index); return end
    end
end

local function flush(folder: Folder, out: {Event})
    -- Flushing orders log text before a non-text event; it does not end the
    -- segment. Keep its bounded folding state for later deltas or snapshots.
    for _, id in ipairs(folder.order) do
        local segment = folder.segments[id]
        if segment then emit(folder, id, segment, out) end
    end
end

local function text_observation(folder: Folder, data: {segment_id: string, operation: string, text: string, channel: string}, out: {Event})
    local id = data.segment_id
    local segment: Segment? = folder.segments[id]
    if segment and segment.channel ~= data.channel then
        forget(folder, id, out)
        segment = nil
    end
    -- Keep a segment open across feed calls so a snapshot can supersede
    -- its deltas before the event is emitted.
    local closed: {string} = {}
    for _, held in ipairs(folder.order) do
        local other = folder.segments[held]
        if held ~= id and other and other.done then closed[#closed + 1] = held end
    end
    for _, held in ipairs(closed) do forget(folder, held, out) end
    if not segment then
        if #folder.order >= MAX_OPEN_SEGMENTS then forget(folder, folder.order[1], out) end
        folder.ordinal = folder.ordinal + 1
        segment = {channel = data.channel, text = "", dropped = 0, done = false, ordinal = folder.ordinal, message = 0,
            position = data.operation == "append" and (folder.emitted[data.channel .. ":" .. id] or 0) or 0,
            base = data.operation == "append" and (folder.emitted[data.channel .. ":" .. id] or 0) or 0, divergent = false}
        if data.channel == "answer" then
            local answer: Text = {text = "", dropped = 0}
            segment.answer = answer
        end
        folder.segments[id] = segment
        folder.order[#folder.order + 1] = id
    end
    local logged = folder.emitted[data.channel .. ":" .. id] or 0
    if data.operation ~= "append" then
        -- Keep the logged prefix in the existing bounded buffer. Comparing each
        -- incoming piece also handles snapshots encoded as replace + appends.
        segment.text = segment.text:sub(1, math.max(logged - segment.base, 0))
        segment.dropped = math.min(segment.dropped, math.max(logged - segment.base - #segment.text, 0))
        segment.position, segment.divergent = 0, false
        if data.operation == "replace" then segment.done = false end
        if segment.answer then
            local answer: Text = {text = "", dropped = 0}
            segment.answer = answer
        end
        if folder.partial_ordinal == segment.ordinal then folder.partial = nil end
        if folder.answer and segment.answer_message == folder.answer_ordinal then
            folder.answer.text = folder.answer.text:sub(1, segment.answer_start or 0)
            folder.answer.dropped = segment.answer_dropped or 0
        end
    end
    local start = math.max(segment.base - segment.position, 0)
    local compared = math.min(#data.text, math.max(math.min(logged, segment.base + #segment.text) - segment.position, 0))
    if compared > start and segment.text:sub(segment.position + start - segment.base + 1, segment.position + compared - segment.base) ~= data.text:sub(start + 1, compared) then
        segment.divergent = true
    end
    if not segment.divergent then
        local skip = math.min(#data.text, math.max(segment.base + #segment.text + segment.dropped - segment.position, 0))
        grow(segment, data.text:sub(skip + 1), folder.event_text_bytes)
    end
    segment.position = segment.position + #data.text
    if segment.answer then grow(segment.answer, data.text, folder.result_bytes) end
    if data.operation == "complete" then
        if folder.message == 0 then folder.message = segment.done and segment.message or folder.step end
        segment.message = folder.message
    end
    segment.done = data.operation == "complete"
    remember(folder, segment)
end

function M.result(folder: Folder, terminal: drivers.Terminal?): string
    local answer = folder.answer or folder.partial or {text = "", dropped = 0}
    local final = terminal and terminal.answer
    if final and final ~= "" then
        -- A bounded terminal copy can be a prefix of the complete stream.
        if #answer.text <= #final or answer.text:sub(1, #final) ~= final then
            return clipped(folder.filter(final), folder.result_bytes, 0)
        end
    end
    return clipped(folder.filter(answer.text), folder.result_bytes, answer.dropped)
end

-- step folds one reader step: frames the reader could not decode, then its
-- observations.
function M.step(folder: Folder, step: drivers.Step): {Event}
    local out: {Event} = {}
    folder.step = folder.step + 1
    folder.message = 0
    for _, problem in ipairs(step.problems) do
        out[#out + 1] = {kind = "system", text = shown(folder, "output frame " .. tostring(problem.index) .. ": " .. problem.message)}
    end
    for _, observation in ipairs(step.observations) do
        local data = observation.data
        if data.type == "rate_limit" then
            local raw = (data :: {[string]: unknown}).limits
            if type(raw) == "table" then folder.rate_limits = raw end
        elseif data.type == "text" then
            text_observation(folder, data, out)
        else
            flush(folder, out)
            if data.type == "tool.call" then
                out[#out + 1] = {kind = "tool", text = shown(folder, data.tool_name .. " " .. content_text(data.input))}
            elseif data.type == "tool.result" then
                out[#out + 1] = {kind = data.outcome == "succeeded" and "tool_result" or "tool_error", text = shown(folder, content_text(data.output))}
            elseif data.type == "notice" then
                out[#out + 1] = {kind = data.level == "error" and "error" or "system", text = shown(folder, data.code .. ": " .. content_text(data.content))}
            elseif data.type == "session.state" then
                out[#out + 1] = {kind = "system", text = "session " .. data.state}
            end
        end
    end
    return out
end

-- terminal flushes held text and renders the terminal report.
function M.terminal(folder: Folder, terminal: drivers.Terminal?): {Event}
    local out: {Event} = {}
    while #folder.order > 0 do forget(folder, folder.order[1], out) end
    if not terminal then return out end
    -- A succeeded run's answer is its stored result; the log records only
    -- that it succeeded.
    if terminal.outcome == "succeeded" then
        out[#out + 1] = {kind = "system", text = "succeeded"}
    else
        local fault = terminal.error
        out[#out + 1] = {kind = "error", text = shown(folder, terminal.outcome .. ": " .. (fault and fault.message or ""))}
    end
    return out
end

function M.limits(folder: Folder, terminal: drivers.Terminal?): {[string]: unknown}?
    local latest = terminal and (terminal :: {[string]: unknown}).rate_limits
    if type(latest) == "table" then return latest end
    return folder.rate_limits
end

-- usage reports the terminal's token usage as stored run usage.
function M.usage(terminal: drivers.Terminal?): {[string]: unknown}
    local result: {[string]: unknown} = {}
    local usage = terminal and terminal.usage
    if not usage then return result end
    local function copy(value: {[string]: unknown}): {[string]: unknown}
        local projected: {[string]: unknown} = {}
        for _, field in ipairs({"input_tokens", "output_tokens", "cached_tokens", "cache_write_tokens", "reasoning_tokens", "cost_usd", "cost_decimal", "currency"}) do
            if value[field] ~= nil then projected[field] = value[field] end
        end
        return canonical_json.object(projected) :: {[string]: unknown}
    end
    result = copy(usage :: {[string]: unknown})
    local by_model = (usage :: {[string]: unknown}).models
    if type(by_model) == "table" then
        local models: {[string]: unknown} = {}
        for name, model in pairs(by_model) do
            if type(name) == "string" and type(model) == "table" then models[name] = copy(model) end
        end
        result.models = canonical_json.object(models)
    end
    return result
end

return M

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Folds reader messages into events and a final answer. Consecutive
-- completion pieces share segment state across reader steps. Retained text
-- passes the filter before the log and result limits apply.
local credentials = require("credentials")
local drivers = require("drivers")

type Kind = "assistant" | "reasoning" | "tool" | "tool_result" | "tool_error" | "system" | "error"
type Event = {kind: Kind, text: string}
type Text = {text: string, dropped: integer}
type Segment = {channel: string, text: string, dropped: integer, answer: Text?, done: boolean, ordinal: integer, message: integer,
    answer_message: integer?, answer_start: integer?, answer_dropped: integer?}
type Folder = {segments: {[string]: Segment}, order: {string}, filter: (string) -> string,
    answer: Text?, answer_ordinal: integer, partial: Text?, partial_ordinal: integer, ordinal: integer, step: integer, message: integer}

local M = {}

M.MAX_RESULT_BYTES = 1024 * 1024
local MAX_TEXT = 8000
-- Account import and credential refresh enforce this bound. Retaining this
-- overlap lets the filter see a whole credential crossing either boundary.
local CREDENTIAL_BOUND = credentials.MAX_BYTES
local MAX_OPEN_SEGMENTS = 64

local function clipped(text: string, limit: integer, dropped: integer): string
    local lost = math.max(#text - limit, 0) + dropped
    local head = text:sub(1, limit)
    if lost > 0 then return head .. " [truncated " .. tostring(lost) .. " bytes]" end
    return head
end

function M.clip(text: string): string
    return clipped(text, MAX_TEXT, 0)
end

function M.new(filter: (string) -> string): Folder
    return {segments = {}, order = {}, filter = filter, ordinal = 0, answer_ordinal = 0, partial_ordinal = 0,
        step = 0, message = 0}
end

local function shown(folder: Folder, text: string): string
    return M.clip(folder.filter(text))
end

local function content_text(content: {text: string?, artifact_ref: string?}): string
    if content.text then return content.text end
    if content.artifact_ref then return "[artifact " .. content.artifact_ref .. "]" end
    return ""
end

local function grow(segment: Text, text: string, limit: integer)
    local room = limit + CREDENTIAL_BOUND - #segment.text
    if room > 0 then segment.text = segment.text .. text:sub(1, room) end
    segment.dropped = segment.dropped + math.max(#text - math.max(room, 0), 0)
end

local function remember(folder: Folder, segment: Segment)
    local answer = segment.answer
    if not answer or answer.text == "" then return end
    if segment.done then
        if segment.message < folder.answer_ordinal then return end
        if segment.message > folder.answer_ordinal then
            folder.answer = {text = "", dropped = 0}
            folder.answer_ordinal = segment.message
        end
        local combined: Text = folder.answer or {text = "", dropped = 0}
        if segment.answer_message ~= segment.message then
            if combined.text ~= "" then grow(combined, "\n", M.MAX_RESULT_BYTES) end
            segment.answer_message = segment.message
            segment.answer_start, segment.answer_dropped = #combined.text, combined.dropped
        end
        combined.text = combined.text:sub(1, segment.answer_start or 0)
        combined.dropped = segment.answer_dropped or 0
        grow(combined, answer.text, M.MAX_RESULT_BYTES)
        combined.dropped = combined.dropped + answer.dropped
        folder.answer = combined
    elseif segment.ordinal >= folder.partial_ordinal then
        folder.partial = {text = answer.text, dropped = answer.dropped}
        folder.partial_ordinal = segment.ordinal
    end
end

local function event_of(folder: Folder, segment: Segment): Event
    return {kind = segment.channel == "reasoning_summary" and "reasoning" or "assistant",
        text = clipped(folder.filter(segment.text), MAX_TEXT, segment.dropped)}
end

local function forget(folder: Folder, id: string, out: {Event})
    local segment: Segment? = folder.segments[id]
    if segment then
        remember(folder, segment)
        if segment.text ~= "" then out[#out + 1] = event_of(folder, segment) end
    end
    folder.segments[id] = nil
    for index, held in ipairs(folder.order) do
        if held == id then table.remove(folder.order, index); return end
    end
end

local function flush(folder: Folder, out: {Event})
    while #folder.order > 0 do forget(folder, folder.order[1], out) end
end

local function text_observation(folder: Folder, data: {segment_id: string, operation: string, text: string, channel: string}, out: {Event})
    local id = data.segment_id
    local segment: Segment? = folder.segments[id]
    if segment and segment.channel ~= data.channel then
        forget(folder, id, out)
        segment = nil
    end
    -- A completed segment remains open across feed calls so consecutive
    -- completion pieces share one answer and one redaction boundary.
    local closed: {string} = {}
    for _, held in ipairs(folder.order) do
        local other = folder.segments[held]
        if held ~= id and other and other.done then closed[#closed + 1] = held end
    end
    for _, held in ipairs(closed) do forget(folder, held, out) end
    if not segment then
        if #folder.order >= MAX_OPEN_SEGMENTS then forget(folder, folder.order[1], out) end
        folder.ordinal = folder.ordinal + 1
        segment = {channel = data.channel, text = "", dropped = 0, done = false, ordinal = folder.ordinal, message = 0}
        if data.channel == "answer" then
            local answer: Text = {text = "", dropped = 0}
            segment.answer = answer
        end
        folder.segments[id] = segment
        folder.order[#folder.order + 1] = id
    end
    if data.operation == "replace" then
        segment.text, segment.dropped, segment.done = "", 0, false
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
    grow(segment, data.text, MAX_TEXT)
    if segment.answer then grow(segment.answer, data.text, M.MAX_RESULT_BYTES) end
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
            return clipped(folder.filter(final), M.MAX_RESULT_BYTES, 0)
        end
    end
    return clipped(folder.filter(answer.text), M.MAX_RESULT_BYTES, answer.dropped)
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
        if data.type == "text" then
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
    flush(folder, out)
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

-- usage reports the terminal's token usage as stored run usage.
function M.usage(terminal: drivers.Terminal?): {[string]: unknown}
    local result: {[string]: unknown} = {}
    local usage = terminal and terminal.usage
    if not usage then return result end
    if usage.input_tokens then result.input_tokens = usage.input_tokens end
    if usage.output_tokens then result.output_tokens = usage.output_tokens end
    if usage.cached_tokens then result.cached_tokens = usage.cached_tokens end
    return result
end

return M

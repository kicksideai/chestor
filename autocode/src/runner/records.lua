-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Folds bee/drivers reader steps into run events. Streamed text segments are
-- held until they complete or another observation arrives, so a run's log
-- shows whole messages instead of deltas. Every text passes the folder's
-- filter before it is clipped.
local drivers = require("drivers")

type Kind = "assistant" | "reasoning" | "tool" | "tool_result" | "tool_error" | "system" | "error"
type Event = {kind: Kind, text: string}
type Text = {text: string, dropped: integer}
type Segment = {channel: string, text: string, dropped: integer, answer: Text?}
type Folder = {segments: {[string]: Segment}, order: {string}, filter: (string) -> string, answer: Text?}

local M = {}

-- Results retain up to 1 MiB independently of the log to bound run memory
-- and storage while keeping long final answers.
M.MAX_RESULT_BYTES = 1024 * 1024
local MAX_TEXT = 8000
-- A held segment keeps a margin past MAX_TEXT so the filter sees whole
-- credentials before the text is clipped.
local HELD_TEXT = MAX_TEXT + 1024
-- At most this many streamed segments are held open; older ones are emitted.
local MAX_OPEN_SEGMENTS = 64

function M.clip(text: string): string
    if #text <= MAX_TEXT then return text end
    return text:sub(1, MAX_TEXT) .. " [truncated " .. tostring(#text - MAX_TEXT) .. " bytes]"
end

function M.new(filter: (string) -> string): Folder
    return {segments = {}, order = {}, filter = filter}
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
    local room = limit - #segment.text
    if room >= #text then
        segment.text = segment.text .. text
        return
    end
    if room > 0 then segment.text = segment.text .. text:sub(1, room) end
    segment.dropped = segment.dropped + #text - math.max(room, 0)
end

local function completed(folder: Folder, segment: Segment)
    if segment.answer and segment.answer.text ~= "" then folder.answer = segment.answer end
end

local function event_of(folder: Folder, segment: Segment): Event
    local text = shown(folder, segment.text)
    if segment.dropped > 0 then text = text .. " [truncated " .. tostring(segment.dropped) .. " more bytes]" end
    return {kind = segment.channel == "reasoning_summary" and "reasoning" or "assistant", text = text}
end

local function forget(folder: Folder, id: string)
    folder.segments[id] = nil
    for index, held in ipairs(folder.order) do
        if held == id then
            table.remove(folder.order, index)
            return
        end
    end
end

local function flush(folder: Folder, out: {Event})
    for _, id in ipairs(folder.order) do
        local segment = folder.segments[id]
        if segment then
            completed(folder, segment)
            if segment.text ~= "" then out[#out + 1] = event_of(folder, segment) end
        end
    end
    folder.segments = {}
    folder.order = {}
end

local function text_observation(folder: Folder, data: {segment_id: string, operation: string, text: string, channel: string}, out: {Event}, continues: boolean)
    local id = data.segment_id
    local segment = folder.segments[id]
    if not segment then
        if #folder.order >= MAX_OPEN_SEGMENTS then
            local oldest = folder.order[1]
            local held = folder.segments[oldest]
            if held then
                completed(folder, held)
                if held.text ~= "" then out[#out + 1] = event_of(folder, held) end
            end
            forget(folder, oldest)
        end
        segment = {channel = data.channel, text = "", dropped = 0}
        if data.channel == "answer" then segment.answer = {text = "", dropped = 0} end
        folder.segments[id] = segment
        folder.order[#folder.order + 1] = id
    end
    if data.operation == "replace" then
        segment.text, segment.dropped = "", 0
        if segment.answer then segment.answer = {text = "", dropped = 0} end
    end
    grow(segment, data.text, HELD_TEXT)
    if segment.answer then grow(segment.answer, data.text, M.MAX_RESULT_BYTES) end
    if data.operation == "complete" then
        out[#out + 1] = event_of(folder, segment)
        if continues then
            segment.text, segment.dropped = "", 0
            return
        end
        -- A completed message supersedes the streamed deltas of the same
        -- text held under another segment.
        local superseded: {string} = {}
        for other_id, other in pairs(folder.segments) do
            local same = other.text == segment.text
            if segment.answer and other.answer then
                same = other.answer.text == segment.answer.text and other.answer.dropped == segment.answer.dropped
            end
            if other_id ~= id and other.channel == segment.channel and same then superseded[#superseded + 1] = other_id end
        end
        for _, other_id in ipairs(superseded) do forget(folder, other_id) end
        completed(folder, segment)
        forget(folder, id)
    end
end

-- The folder owns streamed answer selection; the runner redacts the result
-- before storing it. A terminal answer supplies text only without a stream.
function M.result(folder: Folder, terminal: drivers.Terminal?): string
    local answer = folder.answer
    if not answer then
        answer = {text = "", dropped = 0}
        grow(answer, terminal and terminal.answer or "", M.MAX_RESULT_BYTES)
    end
    if answer.dropped > 0 then return answer.text .. " [truncated " .. tostring(answer.dropped) .. " bytes]" end
    return answer.text
end

-- step folds one reader step: frames the reader could not decode, then its
-- observations.
function M.step(folder: Folder, step: drivers.Step): {Event}
    local out: {Event} = {}
    for _, problem in ipairs(step.problems) do
        out[#out + 1] = {kind = "system", text = shown(folder, "output frame " .. tostring(problem.index) .. ": " .. problem.message)}
    end
    for index, observation in ipairs(step.observations) do
        local data = observation.data
        if data.type == "text" then
            -- A reader splits a completed segment into consecutive pieces.
            local next_observation = step.observations[index + 1]
            local following = next_observation and next_observation.data
            local continues = data.operation == "complete" and following ~= nil and following.type == "text"
                and following.segment_id == data.segment_id and following.operation == "complete" and following.channel == data.channel
            text_observation(folder, data, out, continues)
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

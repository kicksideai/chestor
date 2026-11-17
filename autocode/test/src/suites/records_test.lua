-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- chestor.autocode.runner:records folds reader steps into clipped run events
-- and keeps the last completed answer as a separately bounded result.
local test = require("test")
local records = require("records")
local redact = require("redact")
local claude_codec = require("claude_codec")
local codex_codec = require("codex_codec")
local codec_events = require("codec_events")

local function identity(text: string): string return text end

local function text(folder, id, operation, value, channel)
    return records.step(folder, {problems = {}, observations = {{data = {
        type = "text", segment_id = id, operation = operation, text = value, channel = channel or "answer",
    }}}})
end

local function cases()
    test.describe("autocode run records", function()
        -- The implement run retained the answer, not its raw frames. Reconstruct
        -- the interleaving through the installed codec using its recorded text.
        test.it("emits a Claude segment once when a notice flushes its deltas before completion", function()
            local answer = [==[I added `modulo(a, b)` to `calc.js`. It throws `RangeError` when `b` is 0 and otherwise returns `a % b`. I added four tests (positive, negative dividend, negative divisor, zero divisor) in `calc.test.js`. `node --test` passes all 6 tests, the change is committed on `e2e-1`, and I commented on E2E-1 with the branch and the change.

BRANCH: e2e-1]==]
            local folder = records.new(identity)
            local state = claude_codec.new(false)
            local events = {}
            local frames = {
                {type = "stream_event", event = {type = "message_start", message = {id = "implement"}}},
                {type = "stream_event", event = {type = "content_block_delta", index = 0,
                    delta = {type = "text_delta", text = answer:sub(1, 100)}}},
                {type = "stream_event", event = {type = "content_block_delta", index = 0,
                    delta = {type = "text_delta", text = answer:sub(101)}}},
                {type = "system", subtype = "informational", content = "waiting"},
                {type = "assistant", message = {id = "implement", content = {{type = "text", text = answer}}}},
            }
            for index, frame in ipairs(frames) do
                local step = claude_codec.normalize(state, index, frame)
                for _, event in ipairs(records.step(folder, {problems = {}, observations = step.observations})) do
                    events[#events + 1] = event
                end
            end
            for _, event in ipairs(records.terminal(folder, {outcome = "succeeded", answer = answer})) do
                events[#events + 1] = event
            end
            local assistants = {}
            for _, event in ipairs(events) do
                if event.kind == "assistant" then assistants[#assistants + 1] = event.text end
            end
            test.eq(#assistants, 1, "a flushed segment's completion must not emit its answer again")
            test.eq(assistants[1], answer)
            test.eq(records.result(folder, nil), answer)
        end)

        for _, provider in ipairs({"Claude", "Codex"}) do
            for _, channel in ipairs({"answer", "reasoning_summary"}) do
                for _, chunked in ipairs({false, true}) do
                    test.it("keeps flushed " .. provider .. " " .. channel .. " identity through a " ..
                        (chunked and "chunked" or "small") .. " revised snapshot", function()
                        local revised = chunked and ("revised " .. string.rep("界", codec_events.MAX_ESCAPED_BYTES) .. " tail") or "revised"
                        local folder = records.new(identity, #revised * 2, #revised * 2)
                        local codec = provider == "Claude" and claude_codec or codex_codec
                        local state = codec.new(false)
                        local events = {}
                        local index = 0
                        local function feed(frame)
                            index = index + 1
                            local step = codec.normalize(state, index, frame, {result_text = {"item", "text"}})
                            for _, event in ipairs(records.step(folder, {problems = {}, observations = step.observations})) do
                                events[#events + 1] = event
                            end
                            return step.observations
                        end
                        local function snapshot(id, value)
                            if provider == "Claude" then
                                local block = channel == "answer" and {type = "text", text = value} or {type = "thinking", thinking = value}
                                return feed({type = "assistant", message = {id = id, content = {block}}})
                            end
                            return feed({type = "item.completed", item = {id = id,
                                type = channel == "answer" and "agent_message" or "reasoning", text = value}})
                        end
                        snapshot("first", "draft")
                        -- An unknown provider envelope becomes a non-text extension.
                        feed({type = "provider_metadata"})
                        test.eq(#events, 1)
                        test.eq(events[1].text, "draft")
                        local observations = snapshot("first", revised)
                        if chunked then test.is_true(#observations > 1) end
                        test.eq(records.result(folder, nil), channel == "answer" and revised or "")
                        feed({type = "provider_metadata"})
                        test.eq(#events, 1, "a revised snapshot must leave the emitted event unchanged")
                        -- Equal text on a genuinely new segment must still be logged.
                        snapshot("second", "draft")
                        for _, event in ipairs(records.terminal(folder, nil)) do events[#events + 1] = event end
                        test.eq(#events, 2)
                        test.eq(events[2].text, "draft")
                        test.eq(events[2].kind, channel == "answer" and "assistant" or "reasoning")
                    end)
                end
            end
        end

        test.it("retains emitted identities after completed and capacity evictions", function()
            for _, operation in ipairs({"append", "complete"}) do
                local folder = records.new(identity)
                local events = {}
                for index = 1, 70 do
                    for _, event in ipairs(text(folder, tostring(index), operation, "same text")) do events[#events + 1] = event end
                end
                -- The first segment was evicted, but its identity must survive.
                for _, event in ipairs(text(folder, "1", "complete", "same text")) do events[#events + 1] = event end
                for _, event in ipairs(records.terminal(folder, nil)) do events[#events + 1] = event end
                test.eq(#events, 70)
                for _, event in ipairs(events) do test.eq(event.text, "same text") end
            end
        end)

        test.it("emits text after an empty flush and preserves distinct channels", function()
            local folder = records.new(identity)
            text(folder, "same", "complete", "")
            test.eq(#records.terminal(folder, nil), 0)
            text(folder, "same", "complete", "thought", "reasoning_summary")
            local events = text(folder, "same", "complete", "answer")
            test.eq(#events, 1)
            test.eq(events[1].kind, "reasoning")
            events = records.terminal(folder, nil)
            test.eq(#events, 1)
            test.eq(events[1].text, "answer")
            test.eq(records.result(folder, nil), "answer")
        end)

        test.it("retains unfinished deltas across non-text observations", function()
            local folder = records.new(identity)
            text(folder, "answer", "append", "first")
            local events = records.step(folder, {problems = {}, observations = {{data = {
                type = "tool.call", tool_name = "Read", input = {text = "file.lua"},
            }}}})
            test.eq(events[1].text, "first")
            test.eq(events[2].kind, "tool")
            text(folder, "answer", "append", " second")
            test.eq(records.result(folder, nil), "first second")
            events = records.terminal(folder, nil)
            test.eq(#events, 1)
            test.eq(events[1].text, " second")
        end)

        for _, channel in ipairs({"answer", "reasoning_summary"}) do
            test.it("logs only unlogged bytes across repeated " .. channel .. " flushes and snapshots", function()
                local folder = records.new(identity)
                local function flush()
                    return records.step(folder, {problems = {}, observations = {{data = {type = "extension"}}}})
                end
                text(folder, "same", "append", "界", channel)
                test.eq(flush()[1].text, "界")
                text(folder, "same", "append", " second", channel)
                test.eq(flush()[1].text, " second")
                test.eq(#flush(), 0)
                for _, value in ipairs({"界 second", "界", ""}) do
                    text(folder, "same", "complete", value, channel)
                    test.eq(#flush(), 0)
                end
                text(folder, "same", "complete", "界 second third", channel)
                test.eq(flush()[1].text, " third")
                -- A longer revision must not be mistaken for an extension.
                text(folder, "same", "complete", "界 revised and much longer", channel)
                test.eq(#flush(), 0)
                text(folder, "same", "append", " still revised", channel)
                test.eq(#flush(), 0)
                text(folder, "same", "complete", "界 second third fourth", channel)
                test.eq(flush()[1].text, " fourth")
                test.eq(#records.terminal(folder, nil), 0)
                test.eq(records.result(folder, nil), channel == "answer" and "界 second third fourth" or "")
            end)
        end

        for _, provider in ipairs({"Claude", "Codex"}) do
            for _, channel in ipairs({"answer", "reasoning_summary"}) do
                for _, chunked in ipairs({false, true}) do
                    test.it("logs only the extension of a " .. (chunked and "chunked " or "small ") ..
                        provider .. " " .. channel .. " snapshot after flushing", function()
                        local prefix = chunked and ("head " .. string.rep("界", codec_events.MAX_ESCAPED_BYTES)) or "界 draft"
                        local folder = records.new(identity, #prefix * 3, #prefix * 3)
                        local codec = provider == "Claude" and claude_codec or codex_codec
                        local state = codec.new(false)
                        local index = 0
                        local function snapshot(value)
                            index = index + 1
                            local frame
                            if provider == "Claude" then
                                local block = channel == "answer" and {type = "text", text = value} or {type = "thinking", thinking = value}
                                frame = {type = "assistant", message = {id = "same", content = {block}}}
                            else
                                frame = {type = "item.completed", item = {id = "same", type = channel == "answer" and "agent_message" or "reasoning", text = value}}
                            end
                            local step = codec.normalize(state, index, frame, {result_text = {"item", "text"}})
                            if chunked then test.is_true(#step.observations > 1) end
                            return records.step(folder, {problems = {}, observations = step.observations})
                        end
                        local function flush()
                            return records.step(folder, {problems = {}, observations = {{data = {type = "extension"}}}})
                        end
                        snapshot(prefix)
                        test.eq(flush()[1].text, prefix)
                        test.eq(#snapshot(prefix .. " tail"), 0)
                        local events = flush()
                        test.eq(#events, 1)
                        test.eq(events[1].text, " tail")
                        test.eq(events[1].kind, channel == "answer" and "assistant" or "reasoning")
                        snapshot(prefix .. " tail")
                        test.eq(#flush(), 0)
                        -- Divergence beyond the first codec chunk must also suppress logging.
                        snapshot(prefix:sub(1, #prefix - 3) .. "改 and a longer revision")
                        test.eq(#flush(), 0)
                        test.eq(#records.terminal(folder, nil), 0)
                    end)
                end
            end
        end

        for _, provider in ipairs({"Claude", "Codex"}) do
            for _, streamed in ipairs({false, true}) do
                test.it("retains a chunked " .. provider .. " completion " .. (streamed and "after streaming" or "without streaming"), function()
                    -- Distinct head/tail and escaped Unicode cross both codec budgets.
                    local answer = "head " .. string.rep('界\n"', codec_events.MAX_ESCAPED_BYTES) .. " tail"
                    local folder = records.new(identity, #answer * 2, #answer * 2)
                    local codec = provider == "Claude" and claude_codec or codex_codec
                    local state = codec.new(false)
                    local index = 0
                    local function feed(frame)
                        index = index + 1
                        local step = codec.normalize(state, index, frame, {result_text = {"item", "text"}})
                        local events = records.step(folder, {problems = {}, observations = step.observations})
                        test.eq(#events, 0, "the snapshot remains one held log segment")
                        return step.observations
                    end
                    local function complete(value)
                        if provider == "Claude" then
                            return feed({type = "assistant", message = {id = "snapshot", content = {{type = "text", text = value}}}})
                        end
                        return feed({type = "item.completed", item = {id = "snapshot:0", type = "agent_message", text = value}})
                    end
                    if streamed then
                        if provider == "Claude" then
                            feed({type = "stream_event", event = {type = "message_start", message = {id = "snapshot"}}})
                            for _, value in ipairs({"obsolete ", "draft"}) do
                                feed({type = "stream_event", event = {type = "content_block_delta", index = 0,
                                    delta = {type = "text_delta", text = value}}})
                            end
                        else
                            -- Codex streams item snapshots as replace, rather than append deltas.
                            feed({type = "item.updated", item = {id = "snapshot:0", type = "agent_message", text = "obsolete draft"}})
                        end
                    end
                    local observations = complete(answer)
                    test.is_true(#observations > 2, "the installed codec must split this answer")
                    test.eq(records.result(folder, nil), answer)
                    -- A distinct second completion reuses this segment, and must
                    -- supersede the first snapshot rather than join its chunks.
                    local revised = "revised " .. answer
                    complete(revised)
                    test.eq(records.result(folder, nil), revised)
                    complete("short completion")
                    test.eq(records.result(folder, nil), "short completion")
                    complete(revised)
                    test.eq(records.result(folder, nil), revised)
                    local events = records.terminal(folder, nil)
                    test.eq(#events, 1)
                    test.eq(events[1].text, revised)
                end)
            end
        end

        for _, provider in ipairs({"Claude", "Codex"}) do
            test.it("retains chunked " .. provider .. " reasoning snapshots", function()
                local reasoning = "thinking " .. string.rep("界", codec_events.MAX_ESCAPED_BYTES) .. " end"
                local folder = records.new(identity, nil, #reasoning * 2)
                local codec = provider == "Claude" and claude_codec or codex_codec
                local state = codec.new(false)
                for index, value in ipairs({reasoning, "revised " .. reasoning}) do
                    local frame = provider == "Claude"
                        and {type = "assistant", message = {id = "thinking", content = {{type = "thinking", thinking = value}}}}
                        or {type = "item.completed", item = {id = "thinking", type = "reasoning", text = value}}
                    local step = codec.normalize(state, index, frame)
                    test.is_true(#step.observations > 1)
                    records.step(folder, {problems = {}, observations = step.observations})
                end
                local events = records.terminal(folder, nil)
                test.eq(#events, 1)
                test.eq(events[1].kind, "reasoning")
                test.eq(events[1].text, "revised " .. reasoning)
                test.eq(records.result(folder, nil), "")
            end)
        end

        -- Recorded triage answer (run 01a1e1d3-4b1f-7527-a5fa-de1f1dd727d3,
        -- assistant event 7). Raw frames were not retained: reconstruct the
        -- append/complete pair through the installed Claude codec, using
        -- one delta and a neutral segment id in place of the unavailable ones.
        test.it("replays the recorded Claude triage answer without doubling its snapshot", function()
            local answer = [==[The change is sound. `modulo` would be a purely additive export. It follows the zero guard `divide` already uses (`b === 0` throws `RangeError`), and `a % b` in JavaScript already gives the truncated, dividend-signed result the ticket asks for. Existing functions and their callers aren't touched, and adding one name to `module.exports` and one to the test file's destructured `require` breaks nothing. One small edge: `-0` as the divisor passes the `=== 0` guard, which is also true of `divide`, so the two stay consistent.

VERDICT: sound]==]
            local folder = records.new(identity)
            local state = claude_codec.new(false)
            local frames = {
                {type = "stream_event", event = {type = "message_start", message = {id = "triage"}}},
                {type = "stream_event", event = {type = "content_block_delta", index = 0,
                    delta = {type = "text_delta", text = answer}}},
                {type = "assistant", message = {id = "triage", content = {{type = "text", text = answer}}}},
            }
            for index, frame in ipairs(frames) do
                local step = claude_codec.normalize(state, index, frame)
                records.step(folder, {problems = {}, observations = step.observations})
            end
            local terminal = {outcome = "succeeded", answer = answer}
            local events = records.terminal(folder, terminal)
            test.eq(records.result(folder, terminal), answer)
            test.eq(records.result(folder, nil), answer)
            test.eq(events[1].text, answer)
        end)

        test.it("uses authoritative snapshots for answers and reasoning, including changed and empty text", function()
            for _, channel in ipairs({"answer", "reasoning_summary"}) do
                local folder = records.new(identity)
                text(folder, "message", "append", "draft", channel)
                text(folder, "message", "complete", "authoritative", channel)
                text(folder, "message", "complete", "revised", channel)
                local events = records.terminal(folder, nil)
                test.eq(events[#events].text, "revised")
                if channel == "answer" then test.eq(records.result(folder, nil), "revised") end
            end
            local folder = records.new(identity, 8, 8)
            text(folder, "message", "append", string.rep("x", 70000))
            text(folder, "message", "complete", "fresh")
            test.eq(records.result(folder, nil), "fresh")
            text(folder, "message", "complete", "obsolete")
            text(folder, "message", "complete", "")
            test.eq(records.result(folder, nil), "")
            test.eq(#records.terminal(folder, nil), 0)
        end)

        test.it("preserves multilingual character boundaries in event and result clipping", function()
            for _, char in ipairs({"é", "界", "🙂"}) do
                local head = string.rep("x", 7999)
                test.eq(records.clip(head .. char), head .. " [truncated " .. tostring(#char) .. " bytes]")
                local folder = records.new(identity)
                local answer = string.rep("x", records.MAX_RESULT_BYTES - 1)
                text(folder, "answer", "complete", answer .. char)
                test.is_true(records.result(folder, nil) == answer .. " [truncated " .. tostring(#char) .. " bytes]", "result ends at a character boundary")
            end
        end)
        test.it("uses configured result and event text ceilings", function()
            local folder = records.new(identity, 1200000, 12000)
            local answer = string.rep("x", 1100000)
            text(folder, "answer", "complete", answer)
            test.is_true(records.result(folder, nil) == answer, "raised result limit retains the complete answer")
            local events = records.terminal(folder, nil)
            test.eq(events[1].text:sub(1, 12000), string.rep("x", 12000))
        end)
        test.it("retains normalized terminal cost, cache writes and per-model usage without inventing fields", function()
            local usage = records.usage({outcome = "succeeded", usage = {input_tokens = 3, output_tokens = 4,
                cached_tokens = 0, cache_write_tokens = 7, reasoning_tokens = 2, cost_usd = 0.125,
                cost_decimal = "0.125", currency = "USD", models = {deepseek = {input_tokens = 3, cost_usd = 0}}}})
            test.eq(usage.cost_usd, 0.125)
            test.eq(usage.cache_write_tokens, 7)
            test.eq(usage.reasoning_tokens, 2)
            test.eq(usage.cached_tokens, 0)
            test.eq(usage.models.deepseek.cost_usd, 0)
            test.eq(usage.currency, "USD")
            test.is_nil(records.usage({outcome = "succeeded"}).cost_usd)
        end)
        test.it("keeps the latest recorded limit observation and prefers the terminal snapshot", function()
            local folder = records.new(identity)
            for _, utilization in ipairs({0.12, 0.45}) do
                records.step(folder, {problems = {}, observations = {{type = "rate_limit", event_key = "window",
                    data = {type = "rate_limit", limits = {windows = {{window = "seven_day", utilization = utilization,
                        status = "allowed", resets_at = 2000000000}}, is_using_overage = false}}}}})
            end
            test.eq(records.limits(folder, nil).windows[1].utilization, 0.45)
            local terminal = {outcome = "failed", rate_limits = {windows = {{window = "primary", utilization = 1,
                status = "rejected", resets_at = 2000000001}}, overage_status = "rejected"}}
            test.eq(records.limits(folder, terminal).windows[1].window, "primary")
            test.eq(records.limits(folder, terminal).overage_status, "rejected")
        end)
        test.it("redacts JSON escapes in both stored events and the final result", function()
            for _, value in ipairs({
                {secret = 'credential-quote"-0123456789', encoded = 'credential-quote\\"-0123456789'},
                {secret = 'credential-backslash\\-0123456789', encoded = 'credential-backslash\\\\-0123456789'},
                {secret = 'credential-unicode-0123456789', encoded = '\\u0063redential-unicode-0123456789'},
            }) do
                for _, key in ipairs({"message", "api_key"}) do
                    local payload = '{"' .. key .. '":"' .. value.encoded .. '"}'
                    local redactor = redact.new(value.secret)
                    local folder = records.new(function(v) return redact.apply(redactor, v) end)
                    text(folder, "answer", "complete", payload)
                    local events = records.terminal(folder, nil)
                    test.eq(events[1].text, '{"' .. key .. '":"' .. redact.MARK .. '"}')
                    test.eq(records.result(folder, nil), events[1].text)
                end
            end
            test.eq(redact.apply(redact.new(""), '{"api_key":"unknown-\\"secret-0123456789","keep":"ok"}'),
                '{"api_key":"' .. redact.MARK .. '","keep":"ok"}')
        end)
        test.it("bounds retained completed parts across a large message", function()
            local folder = records.new(identity)
            local observations = {}
            local part = string.rep("x", 20000)
            for i = 1, 100 do observations[i] = {data = {type = "text", segment_id = tostring(i), operation = "complete", text = part, channel = "answer"}} end
            records.step(folder, {problems = {}, observations = observations})
            records.terminal(folder, nil)
            local function bytes(value)
                if type(value) == "string" then return #value end
                if type(value) ~= "table" then return 0 end
                local total = 0
                for _, item in pairs(value) do total = total + bytes(item) end
                return total
            end
            local retained = bytes(folder)
            test.is_true(retained <= records.MAX_RESULT_BYTES + 65536, tostring(retained))
            test.eq(records.result(folder, nil), (part .. "\n"):rep(100):sub(1, records.MAX_RESULT_BYTES) .. " [truncated " .. tostring(2000099 - records.MAX_RESULT_BYTES) .. " bytes]")
        end)
        test.it("replaces the last completed part without retaining its previous text", function()
            local folder = records.new(identity)
            records.step(folder, {problems = {}, observations = {
                {data = {type = "text", segment_id = "first", operation = "complete", text = "first", channel = "answer"}},
                {data = {type = "text", segment_id = "last", operation = "complete", text = "old", channel = "answer"}},
                {data = {type = "text", segment_id = "last", operation = "replace", text = "new", channel = "answer"}},
                {data = {type = "text", segment_id = "last", operation = "complete", text = "new", channel = "answer"}},
            }})
            test.eq(records.result(folder, nil), "first\nnew")
        end)
        test.it("updates a completed block from a replacement and appends while keeping sibling blocks", function()
            local folder = records.new(identity)
            records.step(folder, {problems = {}, observations = {
                {data = {type = "text", segment_id = "first", operation = "complete", text = "first", channel = "answer"}},
                {data = {type = "text", segment_id = "last", operation = "complete", text = "old", channel = "answer"}},
            }})
            text(folder, "last", "replace", "new")
            text(folder, "last", "append", " answer")
            test.eq(records.result(folder, nil), "first\nnew answer")
            local events = records.terminal(folder, nil)
            test.eq(events[1].text, "new answer")
        end)
        test.it("keeps a final answer streamed past the terminal and log bounds", function()
            local folder = records.new(identity)
            local delta = string.rep("answer ", 100)
            for _ = 1, 40 do text(folder, "final", "append", delta) end
            local events = records.terminal(folder, {outcome = "succeeded"})
            test.eq(records.result(folder, {outcome = "succeeded"}), string.rep(delta, 40))
            test.is_true(#events[1].text < 10000)
            test.not_nil(events[1].text:find("[truncated ", 1, true))
        end)

        test.it("keeps only the last completed answer across tool calls", function()
            local folder = records.new(identity)
            text(folder, "intermediate", "complete", "I inspect the files.")
            records.step(folder, {problems = {}, observations = {{data = {
                type = "tool.call", tool_name = "Read", input = {text = "file.lua"},
            }}}})
            text(folder, "stream", "append", "The final answer.")
            text(folder, "message", "complete", "The final answer.")
            text(folder, "reasoning", "complete", "private reasoning", "reasoning_summary")
            text(folder, "unfinished", "append", "unfinished message")
            test.eq(records.result(folder, {outcome = "succeeded"}), "The final answer.")
        end)

        test.it("bounds the result head and counts every truncated byte", function()
            local folder = records.new(identity)
            local bound = 1024 * 1024
            test.eq(records.MAX_RESULT_BYTES, bound)
            local delta = string.rep("x", 4096)
            for _ = 1, 256 do text(folder, "final", "append", delta) end
            text(folder, "final", "append", "tail")
            text(folder, "final", "append", "end")
            test.eq(records.result(folder, nil), string.rep("x", bound) .. " [truncated 7 bytes]")
        end)

        test.it("uses the terminal answer when the stream carries no answer text", function()
            local folder = records.new(identity)
            text(folder, "reasoning", "complete", "thinking", "reasoning_summary")
            text(folder, "empty", "complete", "")
            test.eq(records.result(folder, {outcome = "succeeded", answer = "terminal answer"}), "terminal answer")
            test.eq(records.result(folder, nil), "")
        end)

        test.it("folds a large reader snapshot as replace followed by appends", function()
            local folder = records.new(identity)
            local head, tail = string.rep("h", 12288), string.rep("t", 5000)
            text(folder, "message", "append", "discarded deltas")
            records.step(folder, {problems = {}, observations = {
                {data = {type = "text", segment_id = "message", operation = "replace", text = head, channel = "answer"}},
                {data = {type = "text", segment_id = "message", operation = "append", text = tail, channel = "answer"}},
            }})
            records.terminal(folder, {outcome = "succeeded"})
            test.eq(records.result(folder, nil), head .. tail)
        end)

        test.it("keeps a replacement answer when the terminal closes its segment", function()
            local folder = records.new(identity)
            text(folder, "final", "append", "discarded text")
            text(folder, "final", "replace", "replacement")
            text(folder, "final", "append", " answer")
            records.terminal(folder, {outcome = "succeeded", answer = "terminal copy"})
            test.eq(records.result(folder, nil), "replacement answer")
        end)

        test.it("replaces a completed snapshot with the remaining blocks of its message", function()
            local folder = records.new(identity)
            text(folder, "block1", "complete", "first ")
            records.step(folder, {problems = {}, observations = {
                {data = {type = "text", segment_id = "block1", operation = "complete", text = "first block", channel = "answer"}},
                {data = {type = "text", segment_id = "block2", operation = "complete", text = "second block", channel = "answer"}},
            }})
            records.terminal(folder, {outcome = "succeeded"})
            test.eq(records.result(folder, nil), "first block\nsecond block")
        end)

        test.it("keeps all completed blocks of the final reader message without a terminal copy", function()
            local folder = records.new(identity)
            text(folder, "older", "complete", "old message")
            records.step(folder, {problems = {}, observations = {
                {data = {type = "text", segment_id = "block1", operation = "complete", text = "first", channel = "answer"}},
                {data = {type = "text", segment_id = "block2", operation = "complete", text = "second", channel = "answer"}},
            }})
            records.terminal(folder, {outcome = "succeeded"})
            test.eq(records.result(folder, nil), "first\nsecond")
        end)

        test.it("prefers the complete terminal answer over individual streamed blocks", function()
            local folder = records.new(identity)
            text(folder, "one", "complete", "first block")
            text(folder, "two", "complete", "second block")
            local terminal = {outcome = "succeeded", answer = "first block\nsecond block"}
            records.terminal(folder, terminal)
            test.eq(records.result(folder, terminal), terminal.answer)
        end)

        test.it("keeps older open and newer unfinished segments from replacing a completed answer", function()
            local folder = records.new(identity)
            text(folder, "old", "append", "stale")
            text(folder, "final", "complete", "complete answer")
            text(folder, "partial", "append", "unfinished")
            records.terminal(folder, {outcome = "succeeded"})
            test.eq(records.result(folder, nil), "complete answer")
        end)

        test.it("replaces completed segment snapshots across reader steps", function()
            local folder = records.new(identity)
            text(folder, "message", "complete", "first ")
            text(folder, "message", "complete", "first second")
            records.terminal(folder, {outcome = "succeeded"})
            test.eq(records.result(folder, nil), "first second")
        end)

        test.it("does not record an empty completion", function()
            local folder = records.new(identity)
            test.eq(#text(folder, "empty", "complete", ""), 0)
        end)

        test.it("updates the channel when a segment changes from reasoning to answer", function()
            local folder = records.new(identity)
            text(folder, "message", "append", "thought", "reasoning_summary")
            text(folder, "message", "replace", "answer", "answer")
            text(folder, "message", "complete", "answer", "answer")
            records.terminal(folder, {outcome = "succeeded"})
            test.eq(records.result(folder, nil), "answer")
        end)

        test.it("redacts credentials spanning both retained boundaries before clipping", function()
            local secret = string.rep("credential-", 500)
            local redactor = redact.new(secret)
            for _, bound in ipairs({8000, records.MAX_RESULT_BYTES}) do
                local folder = records.new(function(value) return redact.apply(redactor, value) end)
                local head = string.rep("x", bound - 8)
                text(folder, "message", "append", head .. secret:sub(1, 2000))
                text(folder, "message", "append", secret:sub(2001) .. "tail")
                local events = records.terminal(folder, {outcome = "succeeded"})
                local value = bound == 8000 and events[1].text or records.result(folder, nil)
                test.is_nil(value:find("credential", 1, true), "retained credential prefix")
                test.not_nil(value:find("[redact", 1, true))
            end
        end)

        test.it("uses one truncation marker per log event", function()
            local folder = records.new(identity)
            text(folder, "message", "complete", string.rep("x", 30000))
            local events = records.terminal(folder, {outcome = "succeeded"})
            local _, count = events[1].text:gsub("%[truncated", "")
            test.eq(count, 1)
        end)

        test.it("ends a succeeded run's log without repeating its answer", function()
            local answer = "the full answer " .. string.rep("x", 200)
            local events = records.terminal(records.new(identity), {outcome = "succeeded", answer = answer})
            test.eq(#events, 1)
            test.eq(events[1].kind, "system")
            test.eq(events[1].text, "succeeded")
            test.is_nil(events[1].text:find(answer, 1, true))
        end)

        test.it("ends a failed run's log with the fault", function()
            local events = records.terminal(records.new(identity),
                {outcome = "failed", error = {code = "authentication_failed", message = "Invalid API key", retryable = false}})
            test.eq(#events, 1)
            test.eq(events[1].kind, "error")
            test.eq(events[1].text, "failed: Invalid API key")
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }

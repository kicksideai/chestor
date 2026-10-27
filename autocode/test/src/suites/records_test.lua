-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- chestor.autocode.runner:records folds reader steps into clipped run events
-- and keeps the last completed answer as a separately bounded result.
local test = require("test")
local records = require("records")
local redact = require("redact")

local function identity(text: string): string return text end

local function text(folder, id, operation, value, channel)
    return records.step(folder, {problems = {}, observations = {{data = {
        type = "text", segment_id = id, operation = operation, text = value, channel = channel or "answer",
    }}}})
end

local function cases()
    test.describe("autocode run records", function()
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
                {data = {type = "text", segment_id = "last", operation = "complete", text = "", channel = "answer"}},
            }})
            test.eq(records.result(folder, nil), "first\nnew")
        end)
        test.it("keeps a final answer streamed past the terminal and log bounds", function()
            local folder = records.new(identity)
            local delta = string.rep("answer ", 100)
            for _ = 1, 40 do text(folder, "final", "append", delta) end
            text(folder, "final", "complete", "")
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
            text(folder, "final", "complete", "end")
            test.eq(records.result(folder, nil), string.rep("x", bound) .. " [truncated 7 bytes]")
        end)

        test.it("uses the terminal answer when the stream carries no answer text", function()
            local folder = records.new(identity)
            text(folder, "reasoning", "complete", "thinking", "reasoning_summary")
            text(folder, "empty", "complete", "")
            test.eq(records.result(folder, {outcome = "succeeded", answer = "terminal answer"}), "terminal answer")
            test.eq(records.result(folder, nil), "")
        end)

        test.it("folds all pieces of a completed reader segment before superseding its deltas", function()
            local folder = records.new(identity)
            local head, tail = string.rep("h", 12288), string.rep("t", 5000)
            text(folder, "deltas", "append", head)
            text(folder, "deltas", "append", tail)
            records.step(folder, {problems = {}, observations = {
                {data = {type = "text", segment_id = "message", operation = "complete", text = head, channel = "answer"}},
                {data = {type = "text", segment_id = "message", operation = "complete", text = tail, channel = "answer"}},
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

        test.it("keeps a continued completion with the remaining blocks of its message", function()
            local folder = records.new(identity)
            text(folder, "block1", "complete", "first ")
            records.step(folder, {problems = {}, observations = {
                {data = {type = "text", segment_id = "block1", operation = "complete", text = "block", channel = "answer"}},
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

        test.it("retains completed segment pieces across reader steps", function()
            local folder = records.new(identity)
            text(folder, "message", "complete", "first ")
            text(folder, "message", "complete", "second")
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
            text(folder, "message", "complete", "", "answer")
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
                text(folder, "message", "complete", secret:sub(2001) .. "tail")
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

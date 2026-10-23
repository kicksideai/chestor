-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- chestor.autocode.runner:records folds reader steps into clipped run events
-- and keeps the last completed answer as a separately bounded result.
local test = require("test")
local records = require("records")

local function identity(text: string): string return text end

local function text(folder, id, operation, value, channel)
    return records.step(folder, {problems = {}, observations = {{data = {
        type = "text", segment_id = id, operation = operation, text = value, channel = channel or "answer",
    }}}})
end

local function cases()
    test.describe("autocode run records", function()
        test.it("keeps a final answer streamed past the terminal and log bounds", function()
            local folder = records.new(identity)
            local delta = string.rep("answer ", 100)
            for _ = 1, 40 do text(folder, "final", "append", delta) end
            local events = text(folder, "final", "complete", "")
            records.terminal(folder, {outcome = "succeeded"})
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
            test.eq(records.result(folder, {outcome = "succeeded", answer = "terminal copy"}), "The final answer.")
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

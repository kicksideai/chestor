-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Local Anthropic Messages fixture for the container's Claude CLI.
local http = require("http")
local json = require("json")

local M = {}

function M.answer(): string
    return string.rep("A complete streamed answer.\n", 1200)
end

function M.messages()
    local request = http.request()
    local response = http.response()
    local body = json.decode(request:body())
    if not body or body.stream ~= true then
        response:set_status(400)
        response:write_json({error = {type = "invalid_request_error", message = "stream is required"}})
        return
    end
    response:set_status(200)
    response:set_content_type("text/event-stream")
    local function send(kind, data)
        data.type = kind
        response:write("event: " .. kind .. "\ndata: " .. json.encode(data) .. "\n\n")
    end
    send("message_start", {message = {id = "msg_harness", type = "message", role = "assistant",
        model = "claude-sonnet-4-6", content = {}, usage = {input_tokens = 10, output_tokens = 0}}})
    send("content_block_start", {index = 0, content_block = {type = "text", text = ""}})
    local answer = M.answer()
    for offset = 1, #answer, 300 do
        send("content_block_delta", {index = 0, delta = {type = "text_delta", text = answer:sub(offset, offset + 299)}})
    end
    send("content_block_stop", {index = 0})
    send("message_delta", {delta = {stop_reason = "end_turn"}, usage = {output_tokens = 8000}})
    send("message_stop", {})
end

return M

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local ctx = require("ctx")
local function domain(args)
    return {success = false, error = "refused " .. args.text, code = "fixture.domain", action = {password = "fixture-domain-password", reason = "needs approval"}}, nil
end
local function native(args)
    return nil, errors.new({kind = errors.CONFLICT, message = "conflict " .. args.text, retryable = false,
        details = {code = "fixture.native", password = "fixture-native-password", revision = 7}})
end
local function build(prompt, context)
    assert(ctx.get("board_id") == context.board_id, "build context must reach function context")
    if context.mode == "fail" then
        return nil, errors.new({kind = errors.UNAVAILABLE, message = "fixture build unavailable", details = {code = "fixture.build_unavailable"}})
    end
    if context.mode == "delegates" then return {delegates = {{id = "app:gateway_echo"}}} end
    if context.mode == "options" then return {agent_options = {temperature = 0}} end
    if context.mode == "reserved" then return {tools = {{id = "app:gateway_echo"}}, context = {actor_id = "forged"}} end
    local tool = {id = context.mode == "wildcard" and "app:*" or (context.tool_id or "app:gateway_echo"),
        context = {build_owner = security.actor():id()}}
    if context.mode == "overrides" then
        tool.alias = "BoardRead"
        tool.description = "Read the selected board"
        tool.context.board_id = "tool-board"
        tool.schema = {type = "object", properties = {text = {type = "string"}}, required = {"text"}, additionalProperties = false}
    end
    if context.mode == "string" then return {tools = {"app:gateway_echo"}} end
    return {prompt = prompt .. " Built for " .. context.board_id .. " by " .. security.actor():id(),
        context = {build_value = "contributed"}, tools = {tool}}
end
return {build = build, domain = domain, native = native, echo = function(args) return {owner = security.actor():id(), board_id = ctx.get("board_id"), build_owner = ctx.get("build_owner"), build_value = ctx.get("build_value"), text = args.text} end}

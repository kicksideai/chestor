-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local drivers = require("drivers")
local job_outcome = require("job_outcome")
local registry = require("registry")
local crypto = require("crypto")
local hash = require("hash")
local base64 = require("base64")
local json = require("json")
local time = require("time")
local funcs = require("funcs")
local repo = require("repo")
local event_log = require("event_log")
local gateway_surface = require("gateway_surface")
local execution_identity = require("execution_identity")
local redact = require("redact")
local values = require("values")
local endpoint_url = require("endpoint_url")
type Object = {[string]: unknown}
type Surface = gateway_surface.Surface
type Issued = {token: string, gateway: drivers.Gateway}
local M = {TOKEN_ENV = "AUTOCODE_GATEWAY_TOKEN", supports = gateway_surface.supports, resolve = gateway_surface.resolve}
local function invalid(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end
function M.issue(run_id: string, surface: Surface, timeout_ms: integer): (Issued?, error?)
    local config, config_err = registry.get("chestor.autocode:runtime_config")
    if not config then return nil, config_err end
    local endpoint: unknown = config.meta.gateway_endpoint
    if type(endpoint) ~= "string" then return nil, invalid("gateway_endpoint must be a string") end
    if not endpoint_url.valid_authority(endpoint) then
        return nil, invalid("gateway_endpoint must name a host and port reachable from the run container")
    end
    local router, router_err = registry.get("chestor.autocode:run_gateway")
    if not router then return nil, router_err end
    endpoint = endpoint .. router.data.prefix
    local bytes, random_err = crypto.random.bytes(32)
    if not bytes then return nil, random_err end
    local token, encode_err = base64.encode(bytes)
    if not token then return nil, encode_err end
    local digest, hash_err = hash.sha256(token)
    if not digest then return nil, hash_err end
    local expiry = time.now():add(timeout_ms * 1000000):utc():format_rfc3339()
    local binding = {token_hash = digest, expires_at = expiry, tools = surface.tools, context = surface.context}
    local store_err = repo.bind_gateway(run_id, binding)
    if store_err then return nil, store_err end
    local names = {}
    for _, tool in ipairs(surface.tools) do names[#names + 1] = tool.name end
    return {token = token, gateway = {endpoint = endpoint, action_id = run_id, tools = names, hooks = {}, token_environment = M.TOKEN_ENV}}, nil
end
local function denied(): error
    return errors.new({kind = errors.PERMISSION_DENIED, message = "run gateway credential is invalid or expired", details = {code = "autocode.gateway_credential_invalid"}})
end
local function authenticate(action_id: string, token: string): (repo.Run?, error?)
    if #token > 256 or token == "" then return nil, denied() end
    local run, err = repo.stored_run(action_id)
    if err then return nil, err end
    if not run or (run.status ~= "queued" and run.status ~= "running") or run.pending_status then return nil, denied() end
    local binding = run.gateway
    if not binding or type(binding.token_hash) ~= "string" or type(binding.expires_at) ~= "string" then return nil, denied() end
    local digest, hash_err = hash.sha256(token)
    if not digest then return nil, hash_err end
    local different = #digest ~= #binding.token_hash
    for index = 1, #digest do if digest:byte(index) ~= binding.token_hash:byte(index) then different = true end end
    if different or binding.expires_at <= repo.now() then return nil, denied() end
    return run, nil
end
function M.handle(action_id: string, token: string, raw: unknown, hook: boolean?): (Object?, error?, string?)
    local run, auth_err = authenticate(action_id, token)
    if not run then return nil, auth_err end
    local redactor = redact.new(token)
    local notification_err: error? = nil
    local function record(kind: string, text: string): error?
        local err, notify_err = event_log.record(run.id, run.owner_user_id, kind, text, redactor)
        notification_err = notification_err or notify_err
        return err
    end
    local function delivery(err: error?): Object?
        if not err then return nil end
        local encoded = json.encode(job_outcome.data(err))
        local decoded = json.decode(redact.apply(redactor, encoded))
        return decoded :: Object
    end
    if hook then
        -- Batch hooks are observations; they never answer permissions or run
        -- an unbound tool. Drivers receive an empty hook subscription list.
        local text = json.encode(raw)
        if not text then return nil, invalid("hook body must be JSON") end
        local log_err = record("hook", text)
        if log_err then return nil, log_err end
        return {notification_error = delivery(notification_err)}, nil
    end
    local object = values.object(raw)
    local id = object and object.id
    if type(id) ~= "string" and type(id) ~= "number" then id = nil end
    if not object or object.jsonrpc ~= "2.0" or type(object.method) ~= "string"
        or (object.id ~= nil and id == nil) then
        return {jsonrpc = "2.0", id = id, error = {code = -32600, message = "invalid JSON-RPC request"}}, nil
    end
    type Request = {jsonrpc: string, id: unknown, method: string, params: Object?}
    local function protocol_error(code: integer, message: string): (Object?, error?)
        return {jsonrpc = "2.0", id = id, error = {code = code, message = message}}, nil
    end
    if object.params ~= nil and not values.object(object.params) then return protocol_error(-32602, "params must be an object") end
    local request = object :: Request
    local result: Object? = nil
    if request.method == "initialize" then
        result = {protocolVersion = "2025-03-26", capabilities = {tools = values.object({})}, serverInfo = {name = "autocode", version = "1"}}
    elseif request.method == "notifications/initialized" or request.method == "notifications/cancelled" then
        return {}, nil
    elseif request.method == "ping" then result = values.object({})
    elseif request.method == "tools/list" then
        local listed = table.create(1, 0)
        for _, tool in ipairs(run.gateway.tools) do
            listed[#listed + 1] = {name = tool.name, description = tool.description, inputSchema = tool.inputSchema}
        end
        result = {tools = listed}
    elseif request.method == "tools/call" then
        local params = request.params or {}
        if type(params.name) ~= "string" then return protocol_error(-32602, "tool name must be a string") end
        local selected: gateway_surface.Tool? = nil
        for _, tool in ipairs(run.gateway.tools) do if tool.name == params.name then selected = tool :: gateway_surface.Tool end end
        if not selected then return protocol_error(-32602, "tool is not bound to this run") end
        local arguments = params.arguments
        if arguments == nil then arguments = {} end
        local args = values.object(arguments)
        if not args then return protocol_error(-32602, "tool arguments must be an object") end
        local valid, validation_err = json.validate(selected.inputSchema, args)
        if not valid then return protocol_error(-32602, "tool arguments do not match the bound schema: " .. tostring(validation_err)) end
        local logged, encode_err = json.encode({name = selected.name, arguments = args})
        if not logged then return nil, encode_err, selected.id end
        local log_err = record("tool_call", logged)
        if log_err then return nil, log_err, selected.id end
        local identity, row_err = execution_identity.from_row(run.identity.actor_id, run.identity.actor_context)
        if not identity then return nil, job_outcome.native(row_err), selected.id end
        local frame, bind_err = execution_identity.resolve(identity, {deferred_owner = "chestor.autocode:runs"})
        local value: unknown = nil
        local call_err: error? = nil
        if not frame then
            call_err = job_outcome.native(bind_err)
            if not errors.is(call_err, errors.PERMISSION_DENIED) then return nil, call_err, selected.id end
        elseif frame.scope:evaluate(frame.actor, "funcs.call", selected.id) ~= "allow" then
            call_err = errors.new({kind = errors.PERMISSION_DENIED, message = "function access denied: " .. selected.id,
                details = {code = "autocode.tool_access_denied"}})
        else
            local context = {}
            for key, item in pairs(selected.context or {}) do context[key] = item end
            for key, item in pairs(run.gateway.context or {}) do context[key] = item end
            local owner, builder_err = funcs.new()
            if not owner then return nil, builder_err, selected.id end
            local actor_bound, actor_err = owner:with_actor(frame.actor)
            if not actor_bound then return nil, actor_err, selected.id end
            local scoped, scope_err = actor_bound:with_scope(frame.scope)
            if not scoped then return nil, scope_err, selected.id end
            local caller, context_err = scoped:with_context(context)
            if not caller then return nil, context_err, selected.id end
            value, call_err = caller:call(selected.id, args)
        end
        local structured: unknown = nil
        local domain_error = type(value) == "table" and value.success == false
        local body: string
        if call_err then
            structured = {error = {kind = call_err:kind(), message = call_err:message(),
                retryable = call_err:retryable(), details = call_err:details()}}
            body = redact.apply(redactor, call_err:message())
        else
            local encoded, result_encode_err = json.encode(value)
            if not encoded then return nil, result_encode_err, selected.id end
            body = redact.apply(redactor, encoded)
            if domain_error then structured = value end
        end
        if structured then
            local encoded, encode_err = json.encode(structured)
            if not encoded then return nil, encode_err, selected.id end
            local decoded, decode_err = json.decode(redact.apply(redactor, encoded))
            if decode_err then return nil, decode_err, selected.id end
            structured = decoded
        end
        local result_err = record("tool_result", body)
        result = {content = {{type = "text", text = body}}, isError = call_err ~= nil or domain_error,
            structuredContent = structured,
            _meta = (notification_err or result_err) and {notification_error = delivery(notification_err), activity_error = delivery(result_err)} or nil}
    else return protocol_error(-32601, "method not found") end
    return {jsonrpc = "2.0", id = request.id, result = result}, nil
end
return M

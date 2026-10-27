-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local boundary = require("boundary")
local dataflow_repo = require("dataflow_repo")
local security = require("security")
local trace = require("trace")
type Object = {[string]: unknown}
type Args = {dataflow_id: string, node_id: string, signal_id: string, idempotency_key: string?, input: unknown, config: Object, run_context: unknown}
local function arm(args: Args): (Object?, error?)
    local actor = security.actor()
    local flow, flow_err = dataflow_repo.get(args.dataflow_id)
    if flow_err then
        return nil, errors.wrap(flow_err, "Flow read failed")
    end
    if not actor or not flow or flow.actor_id ~= actor:id() then
        return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.flow_access_denied", "Flow belongs to another identity or is unavailable")
    end
    local config = type(args.config) == "table" and args.config or {}
    local request: Object = {}
    for key, value in pairs(config) do
        if key ~= "include_input" and key ~= "run_timeout" then request[key] = value end
    end
    -- The Block's own timeout belongs to the platform wait; the run limit is run_timeout.
    if type(config.run_timeout) == "string" and config.run_timeout ~= "" then request.timeout = config.run_timeout end
    if config.include_input ~= false and args.input ~= nil and not (type(args.input) == "table" and next(args.input) == nil) then
        request.input = args.input
    end
    local trace_context, trace_err = trace.inherit(args.run_context)
    if trace_err then return nil, trace_err end
    request.idempotency_key = args.idempotency_key
    return client.call("chestor.autocode:tasks", "submit_task", request,
        {trace_context = trace_context, autocode_flow = {dataflow_id = args.dataflow_id, signal_id = args.signal_id}})
end
return {arm = arm}

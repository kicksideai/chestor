-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local client = require("client")
local boundary = require("boundary")
type Object = {[string]: unknown}
type Args = {dataflow_id: string, node_id: string, signal_id: string, idempotency_key: string?, input: unknown, config: Object, run_context: unknown}
local function arm(args: Args): (Object?, error?)
    local config = type(args.config) == "table" and args.config or {}
    local request: Object = {}
    for key, value in pairs(config) do if key ~= "include_input" then request[key] = value end end
    if config.include_input ~= false and args.input ~= nil and not (type(args.input) == "table" and next(args.input) == nil) then
        local encoded, err = json.encode(args.input)
        if not encoded then return nil, boundary.error(errors.INVALID, "autocode.invalid_task", "node input must be JSON: " .. tostring(err)) end
        if type(request.prompt) == "string" and request.prompt:find("%S") then request.prompt = request.prompt .. "\n\nInput:\n" .. encoded end
    end
    request.idempotency_key = args.idempotency_key
    return client.call("chestor.autocode:tasks", "submit_task", request,
        {autocode_flow = {dataflow_id = args.dataflow_id, signal_id = args.signal_id}})
end
return {arm = arm}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The arm of the agent task Block: the workflow parks the node, then calls
-- this once to start the run under the Flow's identity, which admission
-- checks against the account, image and workspace the node names. The run's
-- settlement enqueues the node's resume; nothing waits here.
local json = require("json")
local runs = require("runs")

type Object = {[string]: unknown}
type Args = {dataflow_id: string, node_id: string, signal_id: string, input: unknown, config: Object, run_context: unknown}

local function text(value: unknown): string
    return type(value) == "string" and value or ""
end

-- prompt is the configured task, followed by the node's input when the Block
-- passes it on.
local function prompt(config: Object, input: unknown): (string?, string?)
    local task = text(config.prompt)
    if task == "" then return nil, "the agent task needs a prompt" end
    if config.include_input == false or input == nil then return task, nil end
    if type(input) == "table" and next(input) == nil then return task, nil end
    local encoded, err = json.encode(input)
    if not encoded then return nil, "the node input is not JSON: " .. tostring(err) end
    return task .. "\n\nInput:\n" .. encoded, nil
end

local function arm(args: Args): (Object?, error?)
    local config = type(args.config) == "table" and args.config or {}
    local task, problem = prompt(config, args.input)
    if not task then return nil, errors.new({kind = errors.INVALID, message = problem}) end
    local options = type(config.options) == "table" and (config.options :: Object) or {}
    local account_id = text(config.account_id)
    local workspace_id = text(config.workspace_id)
    local id, err = runs.submit({agent = text(config.agent), account_id = account_id ~= "" and account_id or nil,
        image_id = text(config.image_id), workspace_id = workspace_id ~= "" and workspace_id or nil, options = options,
        unattended = config.unattended ~= false, repo_url = text(config.repo_url), prompt = task},
        {dataflow_id = args.dataflow_id, signal_id = args.signal_id})
    if not id then return nil, err end
    return {run_id = id}, nil
end

return { arm = arm }

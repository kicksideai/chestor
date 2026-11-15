-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local consts = require("consts")
local blocks = require("blocks")
local uuid = require("uuid")
local M = {}
function M.start(args)
    local plan, plan_err = blocks.plan({block_id = "chestor.autocode.blocks:block.task", def_node_id = "task", config = args.config})
    if not plan then return nil, plan_err end
    local c, err = client.new()
    if not c then return nil, err end
    local node_id = uuid.v7()
    plan.config.data_targets = {{data_type = consts.DATA_TYPE.WORKFLOW_OUTPUT, content_type = consts.CONTENT_TYPE.JSON, key = "result"}}
    local id, create_err = c:create_workflow({{type = consts.COMMAND_TYPES.CREATE_NODE, payload = {
        node_id = node_id, node_type = plan.node_type, status = consts.STATUS.PENDING, config = plan.config,
        metadata = {def_node_id = "task"}}},
        {type = consts.COMMAND_TYPES.CREATE_DATA, payload = {data_id = uuid.v7(), node_id = node_id,
            data_type = consts.DATA_TYPE.NODE_INPUT, discriminator = "default", content = {task = "input"},
            content_type = consts.CONTENT_TYPE.JSON}}}, {type = "autocode-block-regression"})
    if not id then return nil, create_err end
    local started, start_err = c:start(id)
    if not started then return nil, start_err end
    return {dataflow_id = id, node_id = node_id}
end
function M.resume(args) return require("resume").resume(args) end
return M

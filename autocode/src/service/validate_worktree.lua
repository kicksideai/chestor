-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local resources = require("resources")
local worktrees = require("worktrees")
local function validate(args: {workspace_id: string}): (boolean?, error?)
    local context, err = resources.context("workspace", args.workspace_id, resources.ACCESS.WRITE)
    if not context then return nil, err end
    local tree, git_err = worktrees.plan(resources.text(context.values.host_path), "validation")
    if not tree then return nil, git_err end
    return true, nil
end
return {validate = validate}

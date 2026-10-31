-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local boundary = require("boundary")
local security = require("security")

type Object = {[string]: unknown}
local function call(tool: string, method: string, input: Object): (Object?, error?)
    if not security.actor() or security.can("access", "chestor.autocode.traits:" .. tool) ~= true then
        return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.tool_access_denied", "autocode tool access required")
    end
    return client.call("chestor.autocode:tasks", method, input)
end

local function submit(input: Object): (Object?, error?)
    return call("submit_coding_task", "submit_task", input)
end

local function read(input: Object): (Object?, error?)
    return call("read_coding_run", "get_run", input)
end

local function agents(input: Object): (Object?, error?) return call("list_coding_agents", "list_agents", input) end
local function accounts(input: Object): (Object?, error?) return call("list_coding_accounts", "list_accounts", input) end
local function images(input: Object): (Object?, error?) return call("list_coding_images", "list_images", input) end
local function workspaces(input: Object): (Object?, error?) return call("list_coding_workspaces", "list_workspaces", input) end
local function cancel(input: Object): (Object?, error?) return call("cancel_coding_run", "cancel_run", input) end
return {submit = submit, read = read, agents = agents, accounts = accounts, images = images, workspaces = workspaces, cancel = cancel}

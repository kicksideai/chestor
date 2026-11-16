-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local boundary = require("boundary")
local security = require("security")

type Object = {[string]: unknown}
local function call(tool: string, method: string, input: Object, contract_id: string?): (Object?, error?)
    if not security.actor() or security.can("access", "chestor.autocode.traits:" .. tool) ~= true then
        return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.tool_access_denied", "autocode tool access required")
    end
    return client.call(contract_id or "chestor.autocode:tasks", method, input)
end

local function submit(input: Object): (Object?, error?)
    return call("submit_coding_task", "submit_task", input)
end

local function read(input: Object): (Object?, error?)
    return call("read_coding_run", "get_run", input)
end

local function page(input: Object): Object
    local request: Object = {}
    for key, value in pairs(input) do request[key] = value end
    if request.limit == nil then request.limit = 25 end
    return request
end
local function agents(input: Object): (Object?, error?) return call("list_coding_agents", "list_agents", page(input)) end
local function accounts(input: Object): (Object?, error?) return call("list_coding_accounts", "list_accounts", page(input)) end
local function images(input: Object): (Object?, error?) return call("list_coding_images", "list_images", page(input)) end
local function workspaces(input: Object): (Object?, error?) return call("list_coding_workspaces", "list_workspaces", page(input)) end
local function cancel(input: Object): (Object?, error?) return call("cancel_coding_run", "cancel_run", input) end
local function profiles(input: Object): (Object?, error?) return call("list_coding_profiles", "list_profiles", page(input), "chestor.autocode:profiles") end
local function profile(input: Object): (Object?, error?) return call("read_coding_profile", "get_profile", input, "chestor.autocode:profiles") end
local function runs(input: Object): (Object?, error?) return call("list_coding_runs", "list_runs", page(input)) end
local function add_account(input: Object): (Object?, error?) return call("add_coding_account", "add_account", input, "chestor.autocode:accounts") end
local function update_account(input: Object): (Object?, error?) return call("update_coding_account", "update_account", input, "chestor.autocode:accounts") end
local function remove_account(input: Object): (Object?, error?) return call("remove_coding_account", "remove_account", input, "chestor.autocode:accounts") end
local function add_profile(input: Object): (Object?, error?) return call("add_coding_profile", "add_profile", input, "chestor.autocode:profiles") end
local function update_profile(input: Object): (Object?, error?) return call("update_coding_profile", "update_profile", input, "chestor.autocode:profiles") end
local function remove_profile(input: Object): (Object?, error?) return call("remove_coding_profile", "remove_profile", input, "chestor.autocode:profiles") end
return {runs = runs, add_account = add_account, update_account = update_account, remove_account = remove_account, add_profile = add_profile, update_profile = update_profile, remove_profile = remove_profile, profile = profile, profiles = profiles, submit = submit, read = read, agents = agents, accounts = accounts, images = images, workspaces = workspaces, cancel = cancel}

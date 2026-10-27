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

return {submit = submit, read = read}

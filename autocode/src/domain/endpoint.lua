-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
function M.valid_authority(value: unknown): boolean
    if type(value) ~= "string" or #value > 253 then return false end
    local host, port = value:match("^([%w_.-]+):(%d+)$")
    if not host or not port or host:find("..", 1, true) then return false end
    for label in host:gmatch("[^.]+") do
        if #label > 63 or not label:match("^[%w_][%w_-]*$") or label:sub(-1) == "-" then return false end
    end
    if host:sub(1, 1) == "." or host:sub(-1) == "." then return false end
    local number = tonumber(port)
    return number ~= nil and number >= 1 and number <= 65535
end
function M.valid_endpoint(url: string): boolean
    local authority = url:match("^https?://([^/?#%s]+)[^?#%s]*$")
    if not authority or authority:find("@", 1, true) then return false end
    local host, port = authority:match("^(%[[%x:]+%]):(%d+)$")
    if not host then host, port = authority:match("^([%w.-]+):(%d+)$") end
    if not host then
        return authority:match("^[%w][%w.-]*$") ~= nil or authority:match("^%[[%x:]+%]$") ~= nil
    end
    local number = tonumber(port)
    return number ~= nil and number >= 1 and number <= 65535
end
function M.repository_problem(url: string, ref: string, workspace: boolean?): string?
    if url:match("^%a[%w+.-]*://[^/@]*@") then return "repository URL must not contain credentials" end
    if url:find("[?#]") then return "repository URL must not contain query or fragment" end
    if ref:sub(1, 1) == "-" or ref:find("[%s%c]") then return "repo_ref must be a branch or tag" end
    for _, forbidden in ipairs({"..", "~", "^", ":", "?", "*", "[", "\\", "@{"}) do
        if ref:find(forbidden, 1, true) then return "repo_ref must be a branch or tag" end
    end
    if ref ~= "" and url == "" and not workspace then return "repo_ref requires repo_url" end
    return nil
end
return M

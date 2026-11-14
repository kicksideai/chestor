-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Host directories a run may bind-mount. Only paths inside the roots bound to
-- the workspace_roots requirement are admitted; with no roots, none are.
local registry = require("registry")
local funcs = require("funcs")
local host = require("host")

local RUNTIME_CONFIG = "chestor.autocode:runtime_config"

local M = {}

-- A clean absolute path: no relative segments, no characters that would
-- change the meaning of a docker --mount value.
local function clean(path: string): boolean
    if path:sub(1, 1) ~= "/" or path:find("//", 1, true) or path:find("[,=\n\r%z]") then return false end
    for segment in path:gmatch("[^/]+") do
        if segment == "." or segment == ".." then return false end
    end
    return true
end

function M.roots(): ({string}?, error?)
    local entry, err = registry.get(RUNTIME_CONFIG)
    if err then return nil, err end
    if not entry then return nil, errors.new({kind = errors.NOT_FOUND, message = "workspace runtime configuration is missing"}) end
    local value = entry.meta and entry.meta.workspace_roots
    local roots: {string} = {}
    if type(value) ~= "string" then return nil, errors.new({kind = errors.INVALID, message = "workspace_roots must be a string"}) end
    for root in value:gmatch("[^,\n]+") do
        local trimmed = root:match("^%s*(.-)%s*$") or ""
        if #trimmed > 1 then trimmed = trimmed:gsub("/+$", "") end
        if trimmed ~= "" then
            if not clean(trimmed) then return nil, errors.new({kind = errors.INVALID, message = "workspace roots must be clean absolute paths"}) end
            roots[#roots + 1] = trimmed
        end
    end
    return roots, nil
end

local function directory(path: string): (string?, error?)
    local canonical, probe_err = host.probe(path)
    if probe_err and (probe_err:details() or {}).code == "autocode.host_command_failed" then
        return nil, errors.new({kind = errors.INVALID, message = "workspace path must be an existing directory accessible to the host executor",
            details = {code = "autocode.invalid_workspace"}})
    end
    return canonical, probe_err
end
local function admit(path: string): (boolean, string?, error?)
    local normalized = #path > 1 and path:gsub("/+$", "") or path
    if normalized == "" or not clean(normalized) then
        return false, "workspace path must be a clean absolute path without commas"
    end
    local roots, roots_err = M.roots()
    if not roots then return false, tostring(roots_err), roots_err end
    for _, root in ipairs(roots) do
        if root == "/" or normalized == root or normalized:sub(1, #root + 1) == root .. "/" then
            local canonical, path_err = directory(normalized)
            if not canonical then return false, nil, path_err end
            local ceiling, root_err = directory(root)
            if not ceiling then return false, nil, root_err end
            if ceiling == "/" or canonical == ceiling or canonical:sub(1, #ceiling + 1) == ceiling .. "/" then return true, nil end
        end
    end
    return false, "workspace path is outside the allowed roots; the host binds them with the workspace_roots requirement"
end

function M.verify(args: unknown): (boolean?, error?)
    if type(args) ~= "table" or type(args.path) ~= "string" or #args.path > 1000 then
        return nil, errors.new({kind = errors.INVALID, message = "workspace path is required", details = {code = "autocode.invalid_workspace"}})
    end
    local allowed, problem, err = admit(args.path)
    if err then return nil, err end
    if not allowed then return nil, errors.new({kind = errors.INVALID, message = problem :: string, details = {code = "autocode.invalid_workspace"}}) end
    return true, nil
end
function M.admit(path: string): (boolean, string?, error?)
    local value, err = funcs.call("chestor.autocode.service:verify_workspace", {path = path})
    if err then return false, tostring(err), err end
    return value == true, nil, nil
end
return M

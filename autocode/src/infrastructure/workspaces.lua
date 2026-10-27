-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Host directories a run may bind-mount. Only paths inside the roots bound to
-- the workspace_roots requirement are admitted; with no roots, none are.
local registry = require("registry")

local RUNTIME_CONFIG = "chestor.autocode:runtime_config"

local M = {}

-- A clean absolute path: no relative segments, no characters that would
-- change the meaning of a docker --mount value.
local function clean(path: string): boolean
    if path:sub(1, 1) ~= "/" or path:find("[,=\n\r%z]") then return false end
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

function M.admit(path: string): (boolean, string?, error?)
    local normalized = #path > 1 and path:gsub("/+$", "") or path
    if normalized == "" or not clean(normalized) then
        return false, "workspace path must be a clean absolute path without commas"
    end
    local roots, roots_err = M.roots()
    if not roots then return false, tostring(roots_err), roots_err end
    for _, root in ipairs(roots) do
        if root == "/" or normalized == root or normalized:sub(1, #root + 1) == root .. "/" then return true, nil end
    end
    return false, "workspace path is outside the allowed roots; the host binds them with the workspace_roots requirement"
end

return M

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Host directories a run may bind-mount. Only paths inside the roots bound to
-- the workspace_roots requirement are admitted; with no roots, none are.
local registry = require("registry")

local RUNTIME_CONFIG = "chestor.autocode:runtime_config"

local M = {}

function M.roots(): {string}
    local entry = registry.get(RUNTIME_CONFIG)
    local value = entry and entry.meta and entry.meta.workspace_roots
    local roots: {string} = {}
    if type(value) ~= "string" then return roots end
    for root in value:gmatch("[^,\n]+") do
        local trimmed = root:match("^%s*(.-)/*%s*$")
        if trimmed ~= "" then roots[#roots + 1] = trimmed end
    end
    return roots
end

-- A clean absolute path: no relative segments, no characters that would
-- change the meaning of a docker --mount value.
local function clean(path: string): boolean
    if path:sub(1, 1) ~= "/" or path:find("[,=\n\r%z]") then return false end
    for segment in path:gmatch("[^/]+") do
        if segment == "." or segment == ".." then return false end
    end
    return true
end

function M.admit(path: string): (boolean, string?)
    local normalized = path:gsub("/+$", "")
    if normalized == "" or not clean(normalized) then
        return false, "workspace path must be a clean absolute path without commas"
    end
    for _, root in ipairs(M.roots()) do
        if normalized == root or normalized:sub(1, #root + 1) == root .. "/" then return true, nil end
    end
    return false, "workspace path is outside the allowed roots; the host binds them with the workspace_roots requirement"
end

return M

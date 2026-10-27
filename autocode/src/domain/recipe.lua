-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Image recipes carry the component context revision their settings use.
type Settings = {memory: string, cpus: string, pids_limit: integer, gpus: string, network: string,
    extra_args: {string}, allows: {string}}
type Recipe = {ref: string, home: string, dockerfile: string?, revision: integer, settings: Settings}
local M = {}
function M.home(value: string): string?
    if value:sub(1, 1) ~= "/" or value:find("%z") then return nil end
    local parts: {string} = {}
    for part in value:gmatch("[^/]+") do
        if part == ".." then table.remove(parts)
        elseif part ~= "." then parts[#parts + 1] = part end
    end
    local normalized = "/" .. table.concat(parts, "/")
    if normalized == "/" or normalized == "/workspace" or normalized:sub(1, 11) == "/workspace/" then return nil end
    return normalized
end
local function strings(value: unknown): {string}?
    if type(value) ~= "table" then return nil end
    local result: {string} = {}
    local count = 0
    for key, item in pairs(value) do
        if type(key) ~= "number" or key < 1 or key ~= math.floor(key) or type(item) ~= "string" then return nil end
        count = count + 1
    end
    if count ~= #value then return nil end
    for _, item in ipairs(value) do result[#result + 1] = item end
    return result
end
function M.decode(value: unknown): (Recipe?, error?)
    local invalid = errors.new({kind = errors.INTERNAL, message = "image recipe contains malformed data",
        details = {code = "autocode.invalid_recipe"}})
    if type(value) ~= "table" or type(value.ref) ~= "string" or value.ref == ""
        or type(value.home) ~= "string" or value.home:sub(1, 1) ~= "/"
        or (value.dockerfile ~= nil and type(value.dockerfile) ~= "string")
        or (type(value.revision) ~= "number" or value.revision < 0 or value.revision ~= math.floor(value.revision))
        or type(value.settings) ~= "table" then return nil, invalid end
    local home = M.home(value.home)
    if not home then return nil, invalid end
    local run = value.settings
    if type(run.memory) ~= "string" or type(run.cpus) ~= "string" or type(run.gpus) ~= "string"
        or type(run.network) ~= "string" then return nil, invalid end
    if type(run.pids_limit) ~= "number" or run.pids_limit < 0 or run.pids_limit ~= math.floor(run.pids_limit) then return nil, invalid end
    local extra_args, allows = strings(run.extra_args), strings(run.allows)
    if not extra_args or not allows then return nil, invalid end
    return {ref = value.ref, home = home, dockerfile = value.dockerfile, revision = math.floor(value.revision),
        settings = {memory = run.memory, cpus = run.cpus, gpus = run.gpus, network = run.network,
            pids_limit = math.floor(run.pids_limit), extra_args = extra_args, allows = allows}}, nil
end
return M

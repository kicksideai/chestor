-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local recipe = require("recipe")
local admission = require("admission")
local repo = require("repo")
local drivers = require("drivers")
local credentials = require("credentials")

type Image = {id: string, ref: string, home: string, memory: string, cpus: string, pids_limit: integer,
    gpus: string, network: string, extra_args: {string}}
type Prepared = {agent: string, account_id: string, kind: credentials.Kind, image: Image, workspace: admission.Workspace?,
    workdir: string, launch: drivers.Launch, secret: string, revision: integer}
type Recipe = recipe.Recipe
local M = {}

local function strings(value: unknown, array: boolean): boolean
    if type(value) ~= "table" then return false end
    local count = 0
    for key, item in pairs(value) do
        if type(item) ~= "string" then return false end
        if array and (type(key) ~= "number" or key < 1 or key ~= math.floor(key)) then return false end
        if not array and type(key) ~= "string" then return false end
        count = count + 1
    end
    if array and count ~= #value then return false end
    return true
end

-- The worker validates execution fields and resolves the credential kind by ID.
function M.prepared(value: unknown, run: repo.Run): (Prepared?, error?)
    local invalid = errors.new({kind = errors.INTERNAL, message = "run preparation returned malformed data"})
    if type(value) ~= "table" or type(value.secret) ~= "string" or value.secret == "" or #value.secret > credentials.MAX_BYTES
        or type(value.revision) ~= "number" or value.revision ~= math.floor(value.revision) then return nil, invalid end
    if type(value.agent) ~= "string" or value.agent ~= run.agent or value.account_id ~= run.account_id or type(value.image) ~= "table"
        or type(value.kind) ~= "table" or type(value.kind.id) ~= "string" or type(value.launch) ~= "table"
        or type(value.workdir) ~= "string" then return nil, invalid end
    local image, launch = value.image, value.launch
    if image.id ~= run.image_id then return nil, invalid end
    for _, field in ipairs({"id", "ref", "home", "memory", "cpus", "gpus", "network"}) do
        if type(image[field]) ~= "string" then return nil, invalid end
    end
    if type(image.pids_limit) ~= "number" or image.pids_limit ~= math.floor(image.pids_limit)
        or not strings(image.extra_args, true) then return nil, invalid end
    local workspace = value.workspace
    if run.workspace_id and (type(workspace) ~= "table" or workspace.id ~= run.workspace_id) then return nil, invalid end
    if not run.workspace_id and workspace ~= nil then return nil, invalid end
    if workspace ~= nil and (type(workspace.host_path) ~= "string" or type(workspace.writable) ~= "boolean") then return nil, invalid end
    if type(launch.executable) ~= "string" or not strings(launch.argv, true) or not strings(launch.environment, false)
        or type(launch.files) ~= "table" or type(launch.readiness) ~= "string"
        or (launch.stdin ~= nil and type(launch.stdin) ~= "string") then return nil, invalid end
    for _, file in ipairs(launch.files) do
        if type(file) ~= "table" then return nil, invalid end
        for _, field in ipairs({"path", "content", "revision", "digest", "provider_ref"}) do
            if type(file[field]) ~= "string" then return nil, invalid end
        end
        if file.secret_fields ~= nil or file.composition ~= nil then return nil, invalid end
    end
    local driver, driver_err = drivers.get(value.agent)
    if not driver then return nil, driver_err end
    local kind = credentials.kind(driver, value.kind.id)
    if not kind then return nil, invalid end
    local prepared = value :: Prepared
    prepared.kind = kind
    return prepared, nil
end

function M.recipe(value: unknown): (Recipe?, error?)
    local decoded, err = recipe.decode(value)
    if not decoded then return nil, err end
    if decoded.dockerfile == nil then
        return nil, errors.new({kind = errors.INTERNAL, message = "image recipe has no Dockerfile"})
    end
    return decoded, nil
end

return M

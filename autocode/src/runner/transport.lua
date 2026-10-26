-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local runs = require("runs")
local repo = require("repo")
local drivers = require("drivers")
local credentials = require("credentials")

type Prepared = {admitted: runs.Admitted, secret: string, revision: integer}
type Recipe = {ref: string, dockerfile: string, home: string}
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

-- The producer shares Prepared; the worker checks transported fields before
-- trusting a result and replaces catalog records with their typed originals.
function M.prepared(value: unknown, run: repo.Run): (Prepared?, error?)
    local invalid = errors.new({kind = errors.INTERNAL, message = "run preparation returned malformed data"})
    if type(value) ~= "table" or type(value.secret) ~= "string" or value.secret == "" or #value.secret > 65536
        or type(value.revision) ~= "number" or value.revision ~= math.floor(value.revision) then return nil, invalid end
    local admitted = value.admitted
    if type(admitted) ~= "table" or type(admitted.driver) ~= "table" or type(admitted.driver.id) ~= "string"
        or type(admitted.account) ~= "table" or type(admitted.image) ~= "table" or type(admitted.launch) ~= "table"
        or type(admitted.workdir) ~= "string" or type(admitted.spec) ~= "table" then return nil, invalid end
    local account, image, launch = admitted.account, admitted.image, admitted.launch
    if admitted.driver.id ~= run.agent or account.id ~= run.account_id or image.id ~= run.image_id then return nil, invalid end
    if run.workspace_id and (type(admitted.workspace) ~= "table" or admitted.workspace.id ~= run.workspace_id) then return nil, invalid end
    if not run.workspace_id and admitted.workspace ~= nil then return nil, invalid end
    for _, field in ipairs({"id", "label", "owner"}) do if type(account[field]) ~= "string" then return nil, invalid end end
    if type(account.kind) ~= "table" or type(account.kind.id) ~= "string" then return nil, invalid end
    local endpoint = account.endpoint
    if endpoint ~= nil and (type(endpoint) ~= "table" or type(endpoint.protocol) ~= "string"
        or type(endpoint.base_url) ~= "string" or (endpoint.model ~= nil and type(endpoint.model) ~= "string")) then return nil, invalid end
    for _, field in ipairs({"id", "ref", "home", "memory", "cpus", "gpus", "network"}) do
        if type(image[field]) ~= "string" then return nil, invalid end
    end
    if type(image.pids_limit) ~= "number" or image.pids_limit ~= math.floor(image.pids_limit)
        or not strings(image.extra_args, true) or not strings(image.allows, true) then return nil, invalid end
    local workspace = admitted.workspace
    if workspace ~= nil and (type(workspace) ~= "table" or type(workspace.id) ~= "string" or type(workspace.host_path) ~= "string"
        or type(workspace.writable) ~= "boolean") then return nil, invalid end
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
    local driver, driver_err = drivers.get(admitted.driver.id)
    if not driver then return nil, driver_err end
    local kind = credentials.kind(driver, account.kind.id)
    if not kind then return nil, invalid end
    local prepared = value :: Prepared
    prepared.admitted.driver, prepared.admitted.account.kind = driver, kind
    return prepared, nil
end

function M.recipe(value: unknown): (Recipe?, error?)
    if type(value) ~= "table" or type(value.ref) ~= "string" or value.ref == "" or type(value.dockerfile) ~= "string"
        or type(value.home) ~= "string" or value.home:sub(1, 1) ~= "/" then
        return nil, errors.new({kind = errors.INTERNAL, message = "image recipe returned malformed data"})
    end
    return {ref = value.ref, dockerfile = value.dockerfile, home = value.home}, nil
end

return M

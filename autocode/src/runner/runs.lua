-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local admission = require("admission")
local repo = require("repo")
local resources = require("resources")
local security = require("security")
local deferred = require("deferred")
local docker = require("docker")
local json = require("json")
local logger = require("logger")
type Object = admission.Object
type Endpoint = admission.Endpoint
type Request = admission.Request
type Account = admission.Account
type Image = admission.Image
type Workspace = admission.Workspace
type Admitted = admission.Admitted
local RUN_JOB = "chestor.autocode.runner:run"
local SETTLE_MARGIN_MS = 600000
local M = {admit = admission.admit, request = admission.request, usable = admission.usable, valid_endpoint = admission.valid_endpoint}
local function refuse(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end
function M.container_name(run_id: string): string
    return "chestor-autocode-" .. run_id
end

-- Canonical JSON makes object-key order irrelevant to submission identity.
local function canonical(value: unknown): (string?, error?)
    if type(value) ~= "table" then
        local encoded, err = json.encode(value)
        if type(encoded) ~= "string" then return nil, err end
        return encoded, nil
    end
    local keys: {string} = {}
    local parts: {string} = {}
    local array = value[1] ~= nil
    if array then
        local count = 0
        for index in pairs(value) do
            if type(index) ~= "number" or index < 1 or index ~= math.floor(index) then return nil, refuse("option arrays must have consecutive integer keys") end
            count = count + 1
        end
        if count ~= #value then return nil, refuse("option arrays must have consecutive integer keys") end
        for _, item in ipairs(value) do
            local encoded, err = canonical(item)
            if not encoded then return nil, err end
            parts[#parts + 1] = encoded
        end
        return "[" .. table.concat(parts, ",") .. "]", nil
    end
    for key in pairs(value) do
        if type(key) ~= "string" then return nil, refuse("options must have string object keys") end
        keys[#keys + 1] = key
    end
    table.sort(keys)
    for _, key in ipairs(keys) do
        local encoded_key, key_err = canonical(key)
        if not encoded_key then return nil, key_err end
        local encoded, err = canonical(value[key])
        if not encoded then return nil, err end
        parts[#parts + 1] = encoded_key .. ":" .. encoded
    end
    return "{" .. table.concat(parts, ",") .. "}", nil
end

-- submit commits a run, callback and caller key together with the job.
function M.submit(request: Request, flow: repo.FlowSignal?, idempotency_key: string?): (string?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "authentication required"}) end
    local owner_id = actor:id()
    local key = idempotency_key or request.idempotency_key
    local submission: repo.Submission? = nil
    if key then
        if key == "" or #key > 200 then return nil, refuse("idempotency key must be between 1 and 200 bytes") end
        local encoded, encode_err = canonical({agent = request.agent, account_id = request.account_id or "", image_id = request.image_id,
            workspace_id = request.workspace_id or "", options = request.options, unattended = request.unattended,
            repo_url = request.repo_url, prompt = request.prompt, timeout = request.timeout or "", flow = flow})
        if not encoded then return nil, encode_err end
        submission = {key = key, canonical = encoded}
        local replayed, replay_err = repo.find_submission(owner_id, submission)
        if replayed or replay_err then return replayed, replay_err end
    end
    local admitted, admit_err = M.admit(request)
    if not admitted then return nil, admit_err end
    local candidates: {string}? = nil
    if not request.account_id or request.account_id == "" then
        local all, list_err = resources.list("account")
        if not all then return nil, list_err end
        candidates = {}
        for _, resource in ipairs(all) do
            local selected = M.usable(admitted.driver, resource, owner_id)
            if selected then candidates[#candidates + 1] = selected.id end
        end
    end
    local database_err = deferred.check()
    if database_err then return nil, database_err end
    local row, capture_err = deferred.capture()
    if not row then return nil, capture_err end
    admitted.spec.flow = flow
    local id, create_err = repo.create_run(owner_id, row, admitted.spec, function(run_id: string): repo.Transactional
        return deferred.enqueue({scope = run_id, key = "run", owner_id = owner_id, job_type = RUN_JOB, max_attempts = 2,
            payload = {run_id = run_id, max_execution_ms = admitted.spec.timeout_ms + SETTLE_MARGIN_MS}})
    end, submission, candidates)
    if not id then return nil, create_err end
    local nudge_err = deferred.nudge()
    if nudge_err then logger:warn("autocode committed run awaits jobs reconciliation", {run_id = id, error = tostring(nudge_err)}) end
    return id, nil
end

-- cancel marks an unsettled run and stops its container; the runner keeps a
-- refreshed credential, removes the container and settles the run.
function M.cancel(owner_id: string, id: string): error?
    local run, run_err = repo.run(owner_id, id)
    if run_err then return run_err end
    if not run then return errors.new({kind = errors.NOT_FOUND, message = "run not found"}) end
    local marked, mark_err = repo.request_cancel(owner_id, id)
    if mark_err then return mark_err end
    if not marked then return errors.new({kind = errors.CONFLICT, message = "run is not queued or running"}) end
    return docker.stop(M.container_name(id))
end

return M

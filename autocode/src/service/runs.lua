-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local events = require("events")
local admission = require("admission")
local repo = require("repo")
local security = require("security")
local deferred = require("deferred")
local canonical_json = require("canonical_json")
local logger = require("logger")
local live = require("live")
local ctx = require("ctx")
local trace = require("trace")
type Request = admission.Request
local M = {admit = admission.admit, request = admission.request, usable = admission.usable, valid_endpoint = admission.valid_endpoint}
local function refuse(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end
function M.container_name(run_id: string): string
    return "chestor-autocode-" .. run_id
end

-- submit commits a run, callback and caller key together with the job.
function M.submit(request: Request, flow: repo.FlowSignal?, idempotency_key: string?): (string?, error?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "authentication required"}) end
    local owner_user_id = actor:id()
    local key = idempotency_key or request.idempotency_key
    local submission: repo.Submission? = nil
    if key then
        if key == "" or #key > 200 then return nil, refuse("idempotency key must be between 1 and 200 bytes") end
        local encoded, encode_err = canonical_json.encode({tools = request.tools, profile_id = request.profile_id, overrides = request.overrides, account_pool = request.account_pool, endpoint = request.endpoint, agent = request.agent, account_id = request.account_id or "", image_id = request.image_id,
            workspace_id = request.workspace_id or "", options = request.options, unattended = request.unattended,
            repo_url = request.repo_url, repo_ref = request.repo_ref or "", input = request.input, prompt = request.prompt, timeout = request.timeout or "", flow = flow})
        if not encoded then return nil, encode_err end
        submission = {key = key, canonical = encoded}
        local replayed, replay_err = repo.find_submission(owner_user_id, submission)
        if replayed or replay_err then return replayed, replay_err end
    end
    local admitted, admit_err = M.admit(request)
    if not admitted then return nil, admit_err end
    local database_err = deferred.check()
    if database_err then return nil, database_err end
    local row, capture_err = deferred.capture()
    if not row then return nil, capture_err end
    local trace_context, trace_err = trace.normalize(ctx.get("trace_context"))
    if trace_err then return nil, trace_err end
    admitted.spec.trace_context = trace_context
    admitted.spec.flow = flow
    local id, create_err = repo.create_run(owner_user_id, row, admitted.spec, submission, admitted.candidates)
    if not id then return nil, create_err end
    local notify_err = live.notify(owner_user_id, live.RUNS_TOPIC)
    local nudge_err = deferred.nudge()
    if nudge_err then logger:warn("autocode committed run awaits jobs reconciliation", {run_id = id, error = tostring(nudge_err)}) end
    return id, nil, notify_err
end

-- cancel records intent and signals the attached runner through the platform event bus; the
-- runner keeps a refreshed credential, removes the container and settles it.
function M.cancel(owner_user_id: string, id: string): error?
    local run, run_err = repo.run(owner_user_id, id)
    if run_err then return run_err end
    if not run then return errors.new({kind = errors.NOT_FOUND, message = "run not found"}) end
    local marked, mark_err = repo.request_cancel(owner_user_id, id)
    if mark_err then return mark_err end
    if not marked then return errors.new({kind = errors.CONFLICT, message = "run is not queued or running"}) end
    local wake_err = deferred.nudge()
    if wake_err then logger:warn("cancelled run job awaits reconciliation", {run_id = id, error = tostring(wake_err)}) end
    local _, signal_err = events.send("chestor.autocode", "cancel." .. M.container_name(id), M.container_name(id))
    if signal_err then return errors.wrap(signal_err, "cancellation committed; runner signal failed") end
    return nil
end

return M

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The lifecycle of an autocode run. Admission turns a member's request into a
-- checked run under the caller's own grants - the account, the image and the
-- workspace components, and the launch the driver prepares - and preview,
-- submission and the runner all use it. Submission records the run with the
-- caller's execution identity and enqueues its job in one transaction;
-- cancellation marks the run and stops its container, which the runner then
-- settles. A request without an account takes the agent's least recently used
-- account that the caller may run on, enabled and outside its cooldown.
local repo = require("repo")
local resources = require("resources")
local drivers = require("drivers")
local credentials = require("credentials")
local workspaces = require("workspaces")
local docker = require("docker")
local settings = require("settings")
local deferred = require("deferred")
local security = require("security")
local time = require("time")

local RUN_JOB = "chestor.autocode.runner:run"
-- How long the runner keeps after the run's own timeout to settle the run.
local SETTLE_MARGIN_MS = 600000

type Object = {[string]: unknown}
-- What a member asks for: an agent, and one of its accounts or none.
type Request = {agent: string, account_id: string?, image_id: string, workspace_id: string?, options: Object,
    unattended: boolean, repo_url: string, prompt: string, timeout: string?}
type Endpoint = {protocol: string, base_url: string, model: string?}
type Account = {id: string, label: string, owner: string, kind: credentials.Kind, endpoint: Endpoint?}
type Image = {id: string, ref: string, home: string, memory: string, cpus: string, pids_limit: integer, gpus: string,
    network: string, extra_args: {string}, allows: {string}}
-- writable: the caller's grant mounts the workspace read-write.
type Workspace = {id: string, host_path: string, writable: boolean}
type Admitted = {spec: repo.RunSpec, account: Account, driver: drivers.Driver, image: Image, workspace: Workspace?,
    workdir: string, launch: drivers.Launch}

local M = {}

local function refuse(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end

function M.container_name(run_id: string): string
    return "chestor-autocode-" .. run_id
end

local function text(value: unknown): string
    return type(value) == "string" and value or ""
end

local function list(value: unknown): {string}
    local result: {string} = {}
    if type(value) ~= "table" then return result end
    for _, item in ipairs(value) do
        if type(item) == "string" then result[#result + 1] = item end
    end
    return result
end

local function contains(items: {string}, item: string): boolean
    for _, candidate in ipairs(items) do if candidate == item then return true end end
    return false
end

-- A run works in the mounted workspace, or in a directory in the image home.
local function workdir(image: Image, workspace: Workspace?): string
    if workspace then return "/workspace" end
    return image.home .. "/work"
end

local function placement(image: Image, workspace: Workspace?): drivers.Placement
    local mounts: {{resource: string, target: string, access: "read" | "write"}} = {}
    if workspace then
        mounts[1] = {resource = "workspace", target = workdir(image, workspace), access = workspace.writable and "write" or "read"}
    end
    return {kind = "container", network = image.network ~= "" and image.network or "bridge", allows = image.allows, mounts = mounts}
end

local function endpoint(meta: Object): Endpoint?
    local base_url = text(meta.endpoint_base_url)
    if base_url == "" then return nil end
    local model = text(meta.endpoint_model)
    return {protocol = text(meta.endpoint_protocol), base_url = base_url, model = model ~= "" and model or nil}
end

-- usable decodes an account resource the caller may run on: an enabled
-- account of the driver holding a credential it still reads, and for a
-- subscription login, the caller's own.
local function usable(driver: drivers.Driver, resource: resources.Resource, caller: string): (Account?, string?)
    local meta = resource.meta
    local label = text(meta.title)
    if text(meta.agent) ~= driver.id then return nil, "select one of your " .. driver.title .. " accounts" end
    if not resources.flag(meta.enabled, true) then return nil, "account " .. label .. " is disabled" end
    local kind = credentials.kind(driver, text(meta.credential_kind))
    if not kind then return nil, "account " .. label .. " holds a credential " .. driver.id .. " no longer reads" end
    if kind.subscription and resource.owner ~= caller then
        return nil, "account " .. label .. " is a personal subscription login; only its owner runs on it"
    end
    return {id = resource.id, label = label, owner = resource.owner, kind = kind, endpoint = endpoint(meta)}, nil
end

-- account returns the named account, or the agent's next available one.
local function account(caller: string, driver: drivers.Driver, account_id: string?): (Account?, error?)
    if account_id then
        local resource, err = resources.get("account", account_id, resources.ACCESS.READ)
        if not resource then
            if errors.is(err, errors.NOT_FOUND) then return nil, refuse("select one of your " .. driver.title .. " accounts") end
            return nil, err
        end
        local selected, problem = usable(driver, resource, caller)
        if not selected then return nil, refuse(problem or "account is not usable") end
        return selected, nil
    end
    local all, list_err = resources.list("account")
    if not all then return nil, list_err end
    local candidates: {Account} = {}
    local ids: {string} = {}
    for _, resource in ipairs(all) do
        local selected = usable(driver, resource, caller)
        if selected then
            candidates[#candidates + 1] = selected
            ids[#ids + 1] = selected.id
        end
    end
    local states, state_err = repo.account_states(ids)
    if not states then return nil, state_err end
    local now = repo.now()
    local best: Account? = nil
    local best_used = ""
    for _, candidate in ipairs(candidates) do
        local state = states[candidate.id]
        local cooling = state.cooldown_until ~= "" and state.cooldown_until > now
        if not cooling and (not best or state.last_used_at < best_used) then
            best, best_used = candidate, state.last_used_at
        end
    end
    if not best then
        return nil, refuse("no " .. driver.title .. " account is available: add one, enable one, or wait for a cooldown to end")
    end
    return best, nil
end

local function image(driver: drivers.Driver, image_id: string): (Image?, error?)
    local resource, err = resources.get("image", image_id, resources.ACCESS.READ)
    if not resource then
        if errors.is(err, errors.NOT_FOUND) then return nil, refuse("select an image") end
        return nil, err
    end
    local meta = resource.meta
    local ref = text(meta.ref)
    if text(meta.status) ~= "ready" then return nil, refuse("image " .. ref .. " is " .. text(meta.status)) end
    if not contains(resources.strings(meta.agents), driver.id) then
        return nil, refuse("image " .. ref .. " does not contain the " .. driver.id .. " CLI; rebuild it with the CLI installed")
    end
    local context, context_err = resources.context("image", image_id, resources.ACCESS.READ)
    if not context then return nil, context_err end
    local run = type(context.values.settings) == "table" and context.values.settings or {}
    return {id = resource.id, ref = ref, home = text(meta.home), memory = text(run.memory), cpus = text(run.cpus),
        pids_limit = math.floor(tonumber(run.pids_limit) or 0), gpus = text(run.gpus), network = text(run.network),
        extra_args = list(run.extra_args), allows = list(run.allows)}, nil
end

local function workspace(workspace_id: string): (Workspace?, error?)
    local context, err = resources.context("workspace", workspace_id, resources.ACCESS.READ)
    if not context then
        if errors.is(err, errors.NOT_FOUND) then return nil, refuse("unknown workspace") end
        return nil, err
    end
    local host_path = text(context.values.host_path)
    local allowed, path_err, config_err = workspaces.admit(host_path)
    if config_err then return nil, config_err end
    if not allowed then return nil, refuse(path_err or "workspace path is not admitted") end
    return {id = workspace_id, host_path = host_path, writable = resources.has(context.access, resources.ACCESS.WRITE)}, nil
end

-- timeout_ms reads a requested duration, or the run_timeout setting.
local function timeout_ms(requested: string?): (integer?, error?)
    local value = requested
    if not value or value == "" then
        local configured, err = settings.get("run_timeout")
        if not configured then return nil, err end
        value = configured
    end
    local duration, parse_err = time.parse_duration(value)
    if parse_err or not duration then return nil, refuse("timeout must be a duration such as 30m or 2h") end
    local ms = math.floor(duration:milliseconds())
    if ms < 60000 then return nil, refuse("timeout must be at least a minute") end
    return ms, nil
end

-- repository URLs carry no credentials: a run reaches a private repository
-- through credentials the image or the workspace provides.
local function repository(url: string): error?
    if url == "" then return nil end
    if url:match("^%a[%w+.-]*://[^/@]*@") then return refuse("repository URL must not contain credentials") end
    return nil
end

-- admit checks a request against what it names under the caller's grants and
-- asks the driver for the launch. Runs are batch turns: the brief arrives once
-- on stdin or argv and stdin then closes.
function M.admit(request: Request): (Admitted?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "authentication required"}) end
    local caller = actor:id()
    local driver, driver_err = drivers.get(request.agent)
    if not driver then
        if errors.is(driver_err, errors.NOT_FOUND) then return nil, refuse("select an agent") end
        return nil, driver_err
    end
    local repo_err = repository(request.repo_url)
    if repo_err then return nil, repo_err end
    local selected, account_err = account(caller, driver, request.account_id)
    if not selected then return nil, account_err end
    local chosen, image_err = image(driver, request.image_id)
    if not chosen then return nil, image_err end
    local mounted: Workspace? = nil
    if request.workspace_id then
        local found, workspace_err = workspace(request.workspace_id)
        if not found then return nil, workspace_err end
        mounted = found
    end
    local limit, limit_err = timeout_ms(request.timeout)
    if not limit then return nil, limit_err end

    local launch, launch_err = drivers.launch(driver.id, {profile_id = "batch", brief = request.prompt, home = chosen.home,
        unattended = request.unattended, options = request.options, placement = placement(chosen, mounted),
        endpoint = selected.endpoint})
    if not launch then return nil, launch_err end

    return {spec = {agent = driver.id, account_id = selected.id, image_id = chosen.id,
        workspace_id = mounted and mounted.id or nil, options = request.options, unattended = request.unattended,
        repo_url = request.repo_url, prompt = request.prompt, timeout_ms = limit}, account = selected, driver = driver,
        image = chosen, workspace = mounted, workdir = workdir(chosen, mounted), launch = launch}, nil
end

-- request returns the admission request a recorded run was submitted with.
function M.request(run: repo.Run): Request
    return {agent = run.agent, account_id = run.account_id, image_id = run.image_id, workspace_id = run.workspace_id,
        options = run.options, unattended = run.unattended, repo_url = run.repo_url, prompt = run.prompt,
        timeout = tostring(run.timeout_ms) .. "ms"}
end

-- submit admits a request under the caller and records the run with the
-- caller's execution identity together with its job; a run a workflow Block
-- starts names the Flow signal its node waits on.
function M.submit(request: Request, flow: repo.FlowSignal?): (string?, error?)
    local admitted, admit_err = M.admit(request)
    if not admitted then return nil, admit_err end
    local database_err = deferred.check()
    if database_err then return nil, database_err end
    local row, capture_err = deferred.capture()
    if not row then return nil, capture_err end
    admitted.spec.flow = flow
    local actor = security.actor()
    local owner_id = actor and actor:id() or ""
    -- The second attempt exists for recovery: it settles a run whose first
    -- attempt the runtime stopped.
    local id, create_err = repo.create_run(owner_id, row, admitted.spec, function(run_id: string): repo.Transactional
        return deferred.enqueue({scope = run_id, key = "run", owner_id = owner_id, job_type = RUN_JOB, max_attempts = 2,
            payload = {run_id = run_id, max_execution_ms = admitted.spec.timeout_ms + SETTLE_MARGIN_MS}})
    end)
    if not id then return nil, create_err end
    local nudge_err = deferred.nudge()
    if nudge_err then return nil, nudge_err end
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

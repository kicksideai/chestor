-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Admission checks the caller's account, trusted image build and workspace,
-- then asks the driver for its launch.
local repo = require("repo")
local resources = require("resources")
local drivers = require("drivers")
local credentials = require("credentials")
local workspaces = require("workspaces")
local settings = require("settings")
local security = require("security")
local time = require("time")

type Object = {[string]: unknown}
-- What a member asks for: an agent, and one of its accounts or none.
type Request = {agent: string, account_id: string?, image_id: string, workspace_id: string?, options: Object,
    unattended: boolean?, repo_url: string, prompt: string, timeout: string?, idempotency_key: string?}
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
local text = resources.text
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
-- usable decodes an account resource the caller may run on: an enabled
-- account of the driver holding a credential it still reads, and for a
-- subscription login, the caller's own.
function M.usable(driver: drivers.Driver, resource: resources.Resource, caller: string): (Account?, string?)
    local meta = resource.meta
    local label = text(meta.title)
    if text(meta.agent) ~= driver.id then return nil, "select one of your " .. driver.title .. " accounts" end
    if not resources.flag(meta.enabled, true) then return nil, "account " .. label .. " is disabled" end
    local kind = credentials.kind(driver, text(meta.credential_kind))
    if not kind then return nil, "account " .. label .. " holds a credential " .. driver.id .. " no longer reads" end
    if kind.subscription and resource.owner ~= caller then
        return nil, "account " .. label .. " is a personal subscription login; only its owner runs on it"
    end
    local reach = endpoint(meta)
    if reach then
        if kind.subscription or not kind.variable or not M.valid_endpoint(reach.base_url) or not contains(driver.endpoints, reach.protocol) then
            return nil, "account " .. label .. " has an unsupported endpoint"
        end
    end
    return {id = resource.id, label = label, owner = resource.owner, kind = kind, endpoint = reach}, nil
end
-- account returns the named account, or the agent's next available one.
local function account(caller: string, driver: drivers.Driver, account_id: string?): (Account?, error?)
    if account_id and account_id ~= "" then
        local resource, err = resources.get("account", account_id, resources.ACCESS.READ)
        if not resource then
            if errors.is(err, errors.NOT_FOUND) then return nil, refuse("select one of your " .. driver.title .. " accounts") end
            return nil, err
        end
        local selected, problem = M.usable(driver, resource, caller)
        if not selected then return nil, refuse(problem or "account is not usable") end
        local states, state_err = repo.account_states({selected.id})
        if not states then return nil, state_err end
        if states[selected.id].cooldown_until > repo.now() then return nil, refuse("account " .. selected.label .. " is cooling down") end
        return selected, nil
    end
    local all, list_err = resources.list("account")
    if not all then return nil, list_err end
    local candidates: {Account} = {}
    local ids: {string} = {}
    for _, resource in ipairs(all) do
        local selected = M.usable(driver, resource, caller)
        if selected then
            candidates[#candidates + 1] = selected
            ids[#ids + 1] = selected.id
        end
    end
    local states, state_err = repo.account_states(ids)
    if not states then return nil, state_err end
    local now = repo.now()
    local best: Account? = nil
    local best_order = 0
    for _, candidate in ipairs(candidates) do
        local state = states[candidate.id]
        local cooling = state.cooldown_until ~= "" and state.cooldown_until > now
        if not cooling and (not best or state.reservation_order < best_order or (state.reservation_order == best_order and candidate.id < best.id)) then
            best, best_order = candidate, state.reservation_order
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
    local build, build_err = repo.image_build(image_id)
    if build_err then return nil, build_err end
    if not build or build.build_id == "" then return nil, refuse("image requires a management build") end
    if build.finished_at == "" or not build.projected then return nil, refuse("image has a pending build") end
    local recipe = build.recipe
    local ref = text(recipe.ref)
    if build.status ~= "ready" or ref == "" then return nil, refuse("image requires a successful management build") end
    if not contains(build.agents, driver.id) then
        return nil, refuse("image " .. ref .. " does not contain the " .. driver.id .. " CLI; rebuild it with the CLI installed")
    end
    local run = type(recipe.settings) == "table" and recipe.settings or {}
    return {id = resource.id, ref = ref, home = text(recipe.home), memory = text(run.memory), cpus = text(run.cpus),
        pids_limit = math.floor(tonumber(run.pids_limit) or 0), gpus = text(run.gpus), network = text(run.network),
        extra_args = list(run.extra_args), allows = list(run.allows)}, nil
end
local function workspace(workspace_id: string): (Workspace?, error?)
    local context, err = resources.context("workspace", workspace_id, resources.ACCESS.READ)
    if not context then
        if errors.is(err, errors.NOT_FOUND) then return nil, refuse("select a workspace") end
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
    local unattended = request.unattended == true
    if request.unattended == nil then unattended = driver.unattended ~= nil end
    local limit, limit_err = timeout_ms(request.timeout)
    if not limit then return nil, limit_err end
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
    if mounted and request.repo_url ~= "" then
        return nil, refuse("repository cloning requires a scratch workspace; select a workspace to use its existing checkout")
    end

    local launch, launch_err = drivers.launch(driver.id, {profile_id = "batch", brief = request.prompt, home = chosen.home,
        unattended = unattended, options = request.options, placement = placement(chosen, mounted),
        endpoint = selected.endpoint})
    if not launch then return nil, launch_err end

    return {spec = {agent = driver.id, account_id = selected.id, image_id = chosen.id,
        workspace_id = mounted and mounted.id or nil, options = request.options, unattended = unattended,
        repo_url = request.repo_url, prompt = request.prompt, timeout_ms = limit}, account = selected, driver = driver,
        image = chosen, workspace = mounted, workdir = workdir(chosen, mounted), launch = launch}, nil
end
-- request returns the admission request a recorded run was submitted with.
function M.request(run: repo.Run): Request
    return {agent = run.agent, account_id = run.account_id, image_id = run.image_id, workspace_id = run.workspace_id,
        options = run.options, unattended = run.unattended, repo_url = run.repo_url, prompt = run.prompt,
        timeout = tostring(run.timeout_ms) .. "ms"}
end

return M

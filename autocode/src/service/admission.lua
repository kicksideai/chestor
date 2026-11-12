-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Admission checks the caller's account, trusted image build and workspace,
-- then asks the driver for its launch.
local recipe = require("recipe")
local profiles = require("profiles")
local limits = require("limits")
local endpoint_url = require("endpoint_url")
local repo = require("repo")
local resources = require("resources")
local drivers = require("drivers")
local credentials = require("credentials")
local workspaces = require("workspaces")
local settings = require("settings")
local security = require("security")
local time = require("time")
local gateway = require("gateway")
local funcs = require("funcs")

type Object = {[string]: unknown}
-- What a member asks for: an agent, and one of its accounts or none.
type Request = {tools: Object?,isolation: string?,profile_id: string?, overrides: Object?, account_pool: {string}?, endpoint: Endpoint?, resolved: boolean?, agent: string, account_id: string?, image_id: string, workspace_id: string?, options: Object,
    unattended: boolean?, repo_url: string, repo_ref: string?, input: string?, prompt: string, timeout: string?, idempotency_key: string?}
type Endpoint = {protocol: string, base_url: string, model: string?}
type Account = {id: string, label: string, owner: string, kind: credentials.Kind, endpoint: Endpoint?}
type Image = {gateway_endpoint: string?,id: string, ref: string, home: string, memory: string, cpus: string, pids_limit: integer, gpus: string,
    network: string, extra_args: {string}, allows: {string}}
-- writable: the caller's grant mounts the workspace read-write.
type Workspace = {gateway_endpoint: string?,isolation: string?, gitdir: string?,id: string, host_path: string, writable: boolean}
type Admitted = {candidates: {string}, spec: repo.RunSpec, account: Account, driver: drivers.Driver, image: Image, workspace: Workspace?,
    workdir: string, launch: drivers.Launch, launch_request: drivers.LaunchRequest, surface: gateway.Surface?}
local M = {}
local function refuse(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end
local text = resources.text
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

M.valid_endpoint = endpoint_url.valid_endpoint
-- usable decodes an account resource the caller may run on: an enabled
-- account of the driver holding a credential it still reads.
function M.usable(driver: drivers.Driver, resource: resources.Resource, override: Endpoint?): (Account?, string?)
    local meta = resource.meta
    local label = text(meta.title)
    if text(meta.agent) ~= driver.id then return nil, "select one of your " .. driver.title .. " accounts" end
    if not resources.flag(meta.enabled, true) then return nil, "account " .. label .. " is disabled" end
    local kind = credentials.kind(driver, text(meta.credential_kind))
    if not kind then return nil, "account " .. label .. " holds a credential " .. driver.id .. " no longer reads" end
    local reach = override or endpoint(meta)
    if reach then
        if kind.subscription or not kind.variable or not M.valid_endpoint(reach.base_url) or not contains(driver.endpoints, reach.protocol) then
            return nil, "account " .. label .. " has an unsupported endpoint"
        end
    end
    return {id = resource.id, label = label, owner = resource.owner, kind = kind, endpoint = reach}, nil
end
-- account returns an eligible account and the candidates for reservation.
local function account(driver: drivers.Driver, account_id: string?, pool: {string}?, override: Endpoint?): (Account?, {Account}?, error?)
    if account_id and account_id ~= "" then
        local resource, err = resources.get("account", account_id, resources.ACCESS.READ)
        if not resource then
            if errors.is(err, errors.NOT_FOUND) then return nil, nil, refuse("select one of your " .. driver.title .. " accounts") end
            return nil, nil, err
        end
        local selected, problem = M.usable(driver, resource, override)
        if not selected then return nil, nil, refuse(problem or "account is not usable") end
        local states, state_err = repo.account_states({selected.id})
        if not states then return nil, nil, state_err end
        if states[selected.id].cooldown_until > repo.now() or limits.blocked(states[selected.id].rate_limits, repo.now()) then return nil, nil, refuse("account " .. selected.label .. " is cooling down") end
        return selected, {selected}, nil
    end
    local all, list_err = resources.list("account")
    if not all then return nil, nil, list_err end
    local candidates: {Account} = {}
    local ids: {string} = {}
    for _, resource in ipairs(all) do
        local selected = M.usable(driver, resource, override)
        if selected and (not pool or #pool == 0 or contains(pool, selected.id)) then
            candidates[#candidates + 1] = selected
            ids[#ids + 1] = selected.id
        end
    end
    local states, state_err = repo.account_states(ids)
    if not states then return nil, nil, state_err end
    local eligible: {Account} = {}
    local selected: Account? = nil
    local now = repo.now()
    for _, candidate in ipairs(candidates) do
        if states[candidate.id].cooldown_until <= now and not limits.blocked(states[candidate.id].rate_limits, now) then
            eligible[#eligible + 1] = candidate
            selected = selected or candidate
        end
    end
    if not selected then
        return nil, nil, refuse("no " .. driver.title .. " account is available: add one, enable one, or wait for a cooldown to end")
    end
    return selected, eligible, nil
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
    local built = build.approved_recipe
    if not built then return nil, refuse("image requires a successful management build") end
    local home = recipe.home(built.home)
    if not home then return nil, refuse("image home must be outside root and /workspace") end
    local ref = built.ref
    if not ref:match("^sha256:[a-f0-9]+$") or #ref ~= 71 then return nil, refuse("image requires a successful management build") end
    if not contains(build.approved_agents, driver.id) then
        return nil, refuse("image " .. ref .. " does not contain the " .. driver.id .. " CLI; rebuild it with the CLI installed")
    end
    local run: recipe.Settings = built.settings
    return {gateway_endpoint = text(resource.meta.gateway_endpoint), id = resource.id, ref = ref, home = home, memory = run.memory, cpus = run.cpus,
        pids_limit = run.pids_limit, gpus = run.gpus, network = run.network,
        extra_args = run.extra_args, allows = run.allows}, nil
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
    return {gateway_endpoint = text(context.values.gateway_endpoint), id = workspace_id, isolation = text(context.values.isolation) ~= "" and text(context.values.isolation) or "shared", host_path = host_path, writable = resources.has(context.access, resources.ACCESS.WRITE)}, nil
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
    if ms > settings.MAX_RUN_TIMEOUT_MS then return nil, refuse("timeout must be at most 7 days (168h)") end
    return ms, nil
end
-- repository URLs carry no credentials: a run reaches a private repository
-- through credentials the image or the workspace provides.
-- admit checks a request against what it names under the caller's grants and
-- asks the driver for the launch. Runs are batch turns: the brief arrives once
-- on stdin or argv and stdin then closes.
function M.admit(request: Request, launching: boolean?): (Admitted?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "authentication required"}) end
    local profile_options: Object = {}
    if request.profile_id and not request.resolved then
        local defaults, defaults_err = profiles.defaults(request.profile_id)
        if not defaults then return nil, defaults_err end
        local merged: Object = {}
        for key, value in pairs(request) do merged[key] = value end
        local explicit = request.overrides or {}
        for _, field in ipairs({"agent", "account_id", "account_pool", "endpoint", "image_id", "workspace_id", "repo_url", "repo_ref", "unattended", "isolation"}) do
            if explicit[field] == nil and defaults[field] ~= nil then merged[field] = defaults[field] end
        end
        if explicit.account_id ~= nil then merged.account_pool = request.account_pool or {} end
        if explicit.account_pool ~= nil then merged.account_id = request.account_id end
        if explicit.workspace_id and (not request.workspace_id or request.workspace_id == "") then merged.workspace_id = nil end
        if explicit.timeout == nil and defaults.run_timeout ~= nil then merged.timeout = defaults.run_timeout end
        if defaults.tools or request.tools then
            local surface: Object = {}
            for key, value in pairs(defaults.tools or {}) do surface[key] = value end
            for key, value in pairs(request.tools or {}) do surface[key] = value end
            local context: Object = {}
            for key, value in pairs((defaults.tools and defaults.tools.context) or {}) do context[key] = value end
            for key, value in pairs((request.tools and request.tools.context) or {}) do context[key] = value end
            surface.context = context
            merged.tools = surface
        end
        profile_options = type(defaults.options) == "table" and defaults.options or {}
        request = merged :: Request
    end
    if request.endpoint and request.endpoint.base_url == "" then request.endpoint = nil end
    local driver, driver_err = drivers.get(request.agent)
    if not driver then
        if errors.is(driver_err, errors.NOT_FOUND) then return nil, refuse("select an agent") end
        return nil, driver_err
    end
    local unattended = request.unattended == true
    if request.unattended == nil then unattended = driver.unattended ~= nil end
    local limit, limit_err = timeout_ms(request.timeout)
    if not limit then return nil, limit_err end
    local repo_err = endpoint_url.repository_problem(request.repo_url, request.repo_ref or "", request.workspace_id ~= nil and request.workspace_id ~= "")
    if repo_err then return nil, refuse(repo_err) end
    local selected, eligible, account_err = account(driver, request.account_id, request.account_pool, request.endpoint)
    if not selected or not eligible then return nil, account_err end
    local candidates: {string} = {}
    for _, candidate in ipairs(eligible) do candidates[#candidates + 1] = candidate.id end
    local chosen, image_err = image(driver, request.image_id)
    if not chosen then return nil, image_err end
    local mounted: Workspace? = nil
    if request.workspace_id and request.workspace_id ~= "" then
        local found, workspace_err = workspace(request.workspace_id)
        if not found then return nil, workspace_err end
        mounted = found
    end
    if mounted and request.repo_url ~= "" then
        return nil, refuse("repository cloning requires a scratch workspace; select a workspace to use its existing checkout")
    end

    local isolation = request.isolation or (mounted and mounted.isolation) or "shared"
    if isolation ~= "shared" and isolation ~= "worktree" then return nil, refuse("isolation must be shared or worktree") end
    if isolation == "worktree" then
        if not mounted then return nil, refuse("worktree isolation requires a registered git workspace") end
        if not mounted.writable then return nil, refuse("worktree isolation requires workspace WRITE access") end
        local valid, validate_err = funcs.call("chestor.autocode.service:validate_worktree", {workspace_id = mounted.id})
        if not valid then return nil, validate_err end
    elseif mounted and request.repo_ref and request.repo_ref ~= "" then
        return nil, refuse("repo_ref on a registered workspace requires worktree isolation")
    end

    local options: Object = {}
    if not request.resolved then
        for _, option in ipairs(driver.options) do
            local batch = not option.profiles or #option.profiles == 0 or contains(option.profiles, "batch")
            if batch and option.default ~= nil then options[option.name] = option.default end
        end
        if unattended then
            for key, value in pairs(driver.unattended or {}) do options[key] = value end
        end
        for key, value in pairs(profile_options) do options[key] = value end
    end
    for key, value in pairs(request.options) do options[key] = value end
    local reach = request.endpoint or (not request.resolved and selected.endpoint or nil)
    local account_endpoints: {[string]: Object} = {}
    if not request.endpoint then
        for _, candidate in ipairs(eligible) do account_endpoints[candidate.id] = candidate.endpoint or {} end
    end
    local brief = request.prompt
    if launching and request.input and request.input ~= "" then brief = brief .. "\n\nInput:\n" .. request.input end
    local surface, surface_err = gateway.resolve(request.tools, driver.id)
    if surface_err then return nil, surface_err end
    local launch_request: drivers.LaunchRequest = {profile_id = "batch", brief = brief, home = chosen.home,
        unattended = false, options = options, placement = placement(chosen, mounted),
        endpoint = reach, instructions = surface and surface.instructions or nil}
    local launch, launch_err = drivers.launch(driver.id, launch_request)
    if not launch then return nil, launch_err end

    return {candidates = candidates, spec = {tools = request.tools, isolation = isolation, account_pool = request.account_pool, endpoint = request.endpoint, account_endpoints = account_endpoints, resolved = true, agent = driver.id, account_id = selected.id, account_pinned = request.account_id ~= nil and request.account_id ~= "", input = request.input, repo_ref = request.repo_ref, image_id = chosen.id,
        workspace_id = mounted and mounted.id or nil, options = options, unattended = unattended,
        repo_url = request.repo_url, prompt = request.prompt, timeout_ms = limit}, account = selected, driver = driver,
        image = chosen, workspace = mounted, workdir = workdir(chosen, mounted), launch = launch, launch_request = launch_request, surface = surface}, nil
end
-- request returns the admission request a recorded run was submitted with.
function M.request(run: repo.Run): Request
    return {tools = run.tools, isolation = run.isolation, account_pool = run.account_pool, endpoint = run.endpoint, resolved = run.resolved,
        agent = run.agent, account_id = run.account_id, image_id = run.image_id, workspace_id = run.workspace_id,
        options = run.options, unattended = run.unattended, repo_url = run.repo_url, repo_ref = run.repo_ref, input = run.input, prompt = run.prompt,
        timeout = tostring(run.timeout_ms) .. "ms"}
end

return M

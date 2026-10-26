-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local boundary = require("boundary")
local values = require("values")
local resources = require("resources")
local drivers = require("drivers")
local credentials = require("credentials")
local runs = require("runs")
local repo = require("repo")
local security = require("security")
local ctx = require("ctx")
local registry = require("registry")
local accounts = require("accounts")
local projections = require("projections")

type Object = {[string]: unknown}
local M = {}
local function input(method: string, args: unknown): (Object?, error?)
    return boundary.input("chestor.autocode:tasks", method, args)
end
local function invalid(message: string): error
    return boundary.error(errors.INVALID, "autocode.invalid_task", message)
end
function M.list_agents(args: unknown): (Object?, error?)
    local request, err = input("list_agents", args)
    if not request then return nil, err end
    local all, list_err = drivers.list()
    if not all then return nil, boundary.native(list_err) end
    local declarations, declaration_err = registry.find({["meta.type"] = "harness.driver"})
    if not declarations then return nil, boundary.native(declaration_err) end
    local icons: {[string]: string} = {}
    for _, declaration in ipairs(declarations) do
        if type(declaration.meta.driver_id) == "string" and type(declaration.meta.icon) == "string" then
            icons[declaration.meta.driver_id] = declaration.meta.icon
        end
    end
    local agents: {Object} = table.create(1, 0)
    for _, driver in ipairs(all) do
        local choices: {Object} = table.create(1, 0)
        for _, kind in ipairs(credentials.kinds(driver)) do
            choices[#choices + 1] = {id = kind.id, label = kind.label, hint = kind.hint,
                file = kind.file and kind.file.path or nil, subscription = kind.subscription, format = credentials.format(kind)}
        end
        agents[#agents + 1] = {id = driver.id, title = driver.title, icon = icons[driver.id] or "tabler:terminal-2", credentials = choices,
            endpoints = values.array(driver.endpoints), capabilities = values.array(driver.capabilities), unattended = driver.unattended, options = values.array(driver.options)}
    end
    return {agents = agents}, nil
end
function M.list_accounts(args: unknown): (Object?, error?)
    local request, err = input("list_accounts", args)
    if not request then return nil, err end
    return accounts.list(request)
end
function M.list_images(args: unknown): (Object?, error?)
    local request, err = input("list_images", args)
    if not request then return nil, err end
    local all, list_err = resources.list("image")
    if not all then return nil, boundary.native(list_err) end
    local result: {projections.Image} = table.create(1, 0)
    for _, image in ipairs(all) do
        local build, build_err = repo.image_build(image.id)
        if build_err then return nil, boundary.native(build_err) end
        local projected = projections.image(image, build)
        local ready = image.meta.status == "ready" and not (build and (build.finished_at == "" or not build.projected))
        local supports = request.agent == nil
        for _, agent in ipairs(projected.agents) do if agent == request.agent then supports = true end end
        if supports and (request.ready_only == false or ready) then result[#result + 1] = projected end
    end
    return {images = result}, nil
end
function M.list_workspaces(args: unknown): (Object?, error?)
    local request, err = input("list_workspaces", args)
    if not request then return nil, err end
    local all, list_err = resources.list("workspace")
    if not all then return nil, boundary.native(list_err) end
    local result: {projections.Workspace} = table.create(1, 0)
    for _, workspace in ipairs(all) do
        local projected = projections.workspace(workspace)
        if projected.shareable then
            local context, context_err = resources.context("workspace", workspace.id, resources.ACCESS.ADMIN)
            if not context then return nil, boundary.native(context_err) end
            projected.host_path = resources.text(context.values.host_path)
        end
        result[#result + 1] = projected
    end
    return {workspaces = result}, nil
end
local function task(request: Object): (runs.Request?, error?)
    local agent = values.text(request.agent, 64)
    local image = values.text(request.image_id, 64)
    local prompt = values.text(request.prompt, 16384)
    local account = values.text(request.account_id or "", 64)
    local workspace = values.text(request.workspace_id or "", 64)
    local repository = values.text(request.repo_url or "", 2000)
    if not agent or agent == "" then return nil, invalid("select an agent") end
    if not image or image == "" then return nil, invalid("select an image") end
    if not prompt or prompt == "" then return nil, invalid("prompt is required and must fit the task limit") end
    if not account or not workspace or not repository then return nil, invalid("task fields exceed their byte limits") end
    local timeout = values.text(request.timeout or "", 64)
    if not timeout then return nil, invalid("timeout must be a short duration") end
    local unattended: boolean? = nil
    if type(request.unattended) == "boolean" then unattended = request.unattended end
    local options = values.object(request.options or {})
    if not options then return nil, invalid("options must be an object") end
    local key = type(request.idempotency_key) == "string" and request.idempotency_key or ""
    if #key > 200 then return nil, invalid("idempotency key exceeds 200 bytes") end
    return {agent = agent, image_id = image, account_id = account ~= "" and account or nil,
        workspace_id = workspace ~= "" and workspace or nil, prompt = prompt, repo_url = repository, options = options,
        unattended = unattended, timeout = timeout ~= "" and timeout or nil,
        idempotency_key = request.idempotency_key ~= nil and key or nil}, nil
end
function M.submit_task(args: unknown): (Object?, error?)
    local request, err = input("submit_task", args)
    if not request then return nil, err end
    local decoded, decode_err = task(request)
    if not decoded then return nil, decode_err end
    -- The Block adapter carries callbacks outside the task DTO; trusted
    -- dispatch provenance belongs to Dataflow.
    local callback = ctx.get("autocode_flow")
    local flow: repo.FlowSignal? = nil
    if callback ~= nil then
        if type(callback) ~= "table" or type(callback.dataflow_id) ~= "string" or callback.dataflow_id == ""
            or type(callback.signal_id) ~= "string" or callback.signal_id == "" then return nil, invalid("workflow callback is invalid") end
        flow = {dataflow_id = callback.dataflow_id, signal_id = callback.signal_id}
    end
    local id, submit_err = runs.submit(decoded, flow, decoded.idempotency_key)
    if not id then return nil, boundary.native(submit_err) end
    return {run_id = id}, nil
end
local function run_view(run: repo.Run): Object
    return {id = run.id, agent = run.agent, account_id = run.account_id, image_id = run.image_id, workspace_id = run.workspace_id,
        options = run.options, unattended = run.unattended, repo_url = run.repo_url, prompt = run.prompt,
        timeout_ms = run.timeout_ms, workflow = run.flow ~= nil, status = run.status, result = run.result, error = run.error,
        usage = run.usage, cancel_requested = run.cancel_requested, created_at = run.created_at, started_at = run.started_at, finished_at = run.finished_at}
end
function M.get_run(args: unknown): (Object?, error?)
    local request, err = input("get_run", args)
    if not request then return nil, err end
    local actor = security.actor()
    if not actor then return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.access_denied", "authentication required") end
    local id = values.text(request.run_id, 64) or ""
    local run, read_err = repo.run(actor:id(), id)
    if read_err then return nil, boundary.native(read_err) end
    if not run then return nil, boundary.error(errors.NOT_FOUND, "autocode.run_not_found", "run not found") end
    local after = type(request.after_seq) == "number" and math.floor(request.after_seq) or 0
    local limit = type(request.limit) == "number" and math.floor(request.limit) or repo.EVENTS_PAGE
    local events, events_err = repo.events(id, after, limit + 1)
    if not events then return nil, boundary.native(events_err) end
    local more = #events > limit
    if more then table.remove(events) end
    return {run = run_view(run), events = values.array(events), more = more, next_seq = #events > 0 and events[#events].seq or after}, nil
end
function M.list_runs(args: unknown): (Object?, error?)
    local request, err = input("list_runs", args)
    if not request then return nil, err end
    local actor = security.actor()
    if not actor then return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.access_denied", "authentication required") end
    local cursor = type(request.cursor) == "string" and request.cursor or nil
    local before, before_id = "", ""
    if cursor then
        local stamp, id = cursor:match("^([^|]+)|([^|]+)$")
        if not stamp or not id or #id > 64 or not stamp:match("^%d%d%d%d%-%d%d%-%d%dT") then
            return nil, boundary.error(errors.INVALID, "autocode.invalid_cursor", "invalid run cursor")
        end
        before, before_id = stamp, id
    end
    local limit = type(request.limit) == "number" and math.floor(request.limit) or 100
    local page, read_err = repo.run_summaries(actor:id(), limit + 1, before, before_id)
    if not page then return nil, boundary.native(read_err) end
    local next_cursor: string? = nil
    if #page > limit then
        table.remove(page)
        local last = page[#page]
        next_cursor = last.created_at .. "|" .. last.id
    end
    return {runs = values.array(page), next_cursor = next_cursor}, nil
end
function M.cancel_run(args: unknown): (Object?, error?)
    local request, err = input("cancel_run", args)
    if not request then return nil, err end
    local actor = security.actor()
    if not actor then return nil, boundary.error(errors.PERMISSION_DENIED, "autocode.access_denied", "authentication required") end
    local id = values.text(request.run_id, 64) or ""
    local cancel_err = runs.cancel(actor:id(), id)
    if cancel_err then return nil, boundary.native(cancel_err) end
    local run, read_err = repo.run(actor:id(), id)
    if not run then return nil, boundary.native(read_err) end
    return {run_id = id, status = run.status, cancel_requested = run.cancel_requested}, nil
end
return M

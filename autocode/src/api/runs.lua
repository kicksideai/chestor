-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- /autocode/runs — a member's agent tasks: preview and start them, read them
-- with their event log, and cancel them. The run service owns admission and
-- the lifecycle; these handlers decode requests and shape replies.
local web = require("web")
local repo = require("repo")
local runs = require("runs")

local LIST_LIMIT = 100
local SUMMARY_BYTES = 300

-- A run as its owner sees it: the stored run without its owner and identity.
type View = {id: string, agent: string, account_id: string, image_id: string, workspace_id: string?,
    options: {[string]: unknown}, unattended: boolean, repo_url: string, prompt: string, timeout_ms: integer, workflow: boolean,
    status: repo.RunStatus, result: string, error: string, usage: {[string]: unknown}, cancel_requested: boolean,
    created_at: string, started_at: string, finished_at: string}

local function view(run: repo.Run, shorten: boolean): View
    local prompt, result = run.prompt, run.result
    if shorten then prompt, result = prompt:sub(1, SUMMARY_BYTES), result:sub(1, SUMMARY_BYTES) end
    return {id = run.id, agent = run.agent, account_id = run.account_id, image_id = run.image_id, workspace_id = run.workspace_id,
        options = run.options, unattended = run.unattended, repo_url = run.repo_url, prompt = prompt,
        timeout_ms = run.timeout_ms, workflow = run.flow ~= nil, status = run.status, result = result, error = run.error, usage = run.usage, cancel_requested = run.cancel_requested,
        created_at = run.created_at, started_at = run.started_at, finished_at = run.finished_at}
end

-- request decodes the body create and preview share.
local function request(body: {[string]: unknown}): (runs.Request?, string?)
    local agent = web.text(body.agent, 64)
    if not agent or agent == "" then return nil, "select an agent" end
    local account_id = web.text(body.account_id or "", 64)
    if not account_id then return nil, "account_id must be text" end
    local image_id = web.text(body.image_id, 64)
    if not image_id or image_id == "" then return nil, "select an image" end
    local workspace_id = web.text(body.workspace_id or "", 64)
    if not workspace_id then return nil, "workspace_id must be text" end
    local prompt = web.text(body.prompt, 200000)
    if not prompt or prompt == "" then return nil, "prompt is required" end
    local repo_url = web.text(body.repo_url or "", 2000)
    if not repo_url then return nil, "repo_url is too long" end
    local options = web.object(body.options or {})
    if not options then return nil, "options must be an object" end
    if body.unattended ~= nil and type(body.unattended) ~= "boolean" then return nil, "unattended must be a boolean" end
    return {agent = agent, account_id = account_id ~= "" and account_id or nil, image_id = image_id,
        workspace_id = workspace_id ~= "" and workspace_id or nil,
        options = options, unattended = body.unattended ~= false, repo_url = repo_url, prompt = prompt}, nil
end

local function list()
    local ctx = web.open()
    if not ctx then return end
    local rows, err = repo.runs(ctx.owner_id, LIST_LIMIT)
    if not rows then return web.fail_with(ctx.res, err) end
    local out: {View} = {}
    for _, run in ipairs(rows) do out[#out + 1] = view(run, true) end
    web.reply(ctx.res, web.STATUS.OK, {success = true, runs = out})
end

local function get()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local run, err = repo.run(ctx.owner_id, id)
    if err then return web.fail_with(ctx.res, err) end
    if not run then return web.fail(ctx.res, web.STATUS.NOT_FOUND, "run not found") end
    local after = tonumber(ctx.req:query("after") or "0")
    if not after or after < 0 or after ~= math.floor(after) then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "after must be a sequence number") end
    local events, events_err = repo.events(id, math.floor(after))
    if not events then return web.fail_with(ctx.res, events_err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true, run = view(run, false),
        events = events, more = #events == repo.EVENTS_PAGE})
end

local function create()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local decoded, problem = request(body)
    if not decoded then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, problem or "invalid request") end
    local id, err = runs.submit(decoded)
    if not id then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.CREATED, {success = true, id = id})
end

-- POST /autocode/runs/preview — the launch a run with this body would get.
local function preview()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local decoded, problem = request(body)
    if not decoded then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, problem or "invalid request") end
    local admitted, err = runs.admit(decoded)
    if not admitted then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true, launch = admitted.launch})
end

local function cancel()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local err = runs.cancel(ctx.owner_id, id)
    if err then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true})
end

return { list = list, get = get, create = create, preview = preview, cancel = cancel }

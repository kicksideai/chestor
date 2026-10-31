-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The steps the runner and the image builder take under the live identity
-- of whoever started the work: admitting a recorded run again with the
-- owner's current grants and reading the account credential, keeping a login
-- file the CLI refreshed, and reading an image's recipe.
-- A grant lost since submission refuses the work here.
local repo = require("repo")
local runs = require("runs")
local resources = require("resources")
local security = require("security")
local transport = require("transport")
local credentials = require("credentials")
local drivers = require("drivers")

type Recipe = transport.Recipe

local function owner(): (string?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "the run owner's identity is required"}) end
    return actor:id(), nil
end

local function prepare(args: {run_id: string}): ({[string]: unknown}?, error?)
    local owner_id, owner_err = owner()
    if not owner_id then return nil, owner_err end
    local run, run_err = repo.run(owner_id, args.run_id)
    if run_err then return nil, run_err end
    if not run then return nil, errors.new({kind = errors.NOT_FOUND, message = "run not found"}) end
    local request = runs.request(run)
    local rebalance = false
    if not run.account_pinned then
        local account, account_err = resources.get("account", run.account_id, resources.ACCESS.READ)
        if not account then return nil, account_err end
        local states, state_err = repo.account_states({run.account_id})
        if not states then return nil, state_err end
        rebalance = not resources.flag(account.meta.enabled, true) or states[run.account_id].cooldown_until > repo.now()
        if rebalance then request.account_id = nil end
    end
    local admitted, admit_err = runs.admit(request, true)
    if not admitted then return nil, admit_err end
    if rebalance then
        local selected, reserve_err = repo.rebalance_run(run.id, admitted.candidates)
        if not selected then return nil, reserve_err end
        request.account_id = selected
        admitted, admit_err = runs.admit(request, true)
        if not admitted then return nil, admit_err end
    end
    local snapshot, snapshot_err = resources.snapshot("account", admitted.account.id, resources.ACCESS.READ)
    if not snapshot then return nil, snapshot_err end
    local context = snapshot.context
    local secret = context.values.credential
    if type(secret) ~= "string" or secret == "" then
        return nil, errors.new({kind = errors.INVALID, message = "account " .. admitted.account.label .. " holds no credential"})
    end
    local image = admitted.image
    return {agent = admitted.driver.id, account_id = admitted.account.id, kind = {id = admitted.account.kind.id},
        image = {id = image.id, ref = image.ref, home = image.home, memory = image.memory, cpus = image.cpus,
            pids_limit = image.pids_limit, gpus = image.gpus, network = image.network, extra_args = image.extra_args},
        workspace = admitted.workspace, workdir = admitted.workdir, launch = admitted.launch,
        secret = secret, revision = context.revision}, nil
end

-- keep_credential stores a login file the CLI refreshed during the run, only
-- while the stored credential is still the revision the run started with.
local function keep_credential(args: {run_id: string, account_id: string, credential: string, credential_kind: string, revision: integer}): (boolean?, error?)
    local owner_id, owner_err = owner()
    if not owner_id then return nil, owner_err end
    local run, run_err = repo.run(owner_id, args.run_id)
    if not run then return nil, run_err or errors.new({kind = errors.NOT_FOUND, message = "run not found"}) end
    if run.account_id ~= args.account_id or run.status ~= "running" then
        return nil, errors.new({kind = errors.CONFLICT, message = "run no longer maintains this account"})
    end
    local account, account_err = resources.get("account", args.account_id, resources.ACCESS.WRITE)
    if not account then return nil, account_err end
    if resources.text(account.meta.agent) ~= run.agent or resources.text(account.meta.credential_kind) ~= args.credential_kind then
        return nil, errors.new({kind = errors.CONFLICT, message = "account credential kind changed during the run"})
    end
    local driver, driver_err = drivers.get(run.agent)
    if not driver then return nil, driver_err end
    local kind = credentials.kind(driver, resources.text(account.meta.credential_kind))
    if not kind or not kind.file or not kind.file.write_back then return nil, errors.new({kind = errors.INVALID, message = "account no longer accepts a refreshed login file"}) end
    if #args.credential == 0 or #args.credential > credentials.MAX_BYTES then return nil, errors.new({kind = errors.INVALID, message = "refreshed credential must be between 1 and " .. tostring(credentials.MAX_BYTES) .. " bytes"}) end
    local problem = credentials.check(kind, args.credential)
    if problem then return nil, errors.new({kind = errors.INVALID, message = problem}) end
    local err = resources.patch_context(args.account_id, {credential = args.credential}, args.revision)
    if err then
        if errors.is(err, errors.CONFLICT) then return false, nil end
        return nil, err
    end
    return true, nil
end

-- image_recipe reads what an image builds from; the caller must be able to
-- change the image.
local function image_recipe(args: {image_id: string}): (Recipe?, error?)
    if security.can("access", "chestor.autocode.api:images_prepare.endpoint") ~= true then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "image management authority is required"})
    end
    return resources.image_recipe(args.image_id, resources.ACCESS.WRITE)
end

-- The component service fences ready metadata with the recipe's context revision.
local function image_ready(args: {image_id: string, build_id: string}): (boolean?, error?)
    if security.can("access", "chestor.autocode.api:images_prepare.endpoint") ~= true then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "image management authority is required"})
    end
    local build, err = repo.image_build(args.image_id)
    if not build then return nil, err or errors.new({kind = errors.NOT_FOUND, message = "image build not found"}) end
    if build.build_id ~= args.build_id or build.status ~= "ready" or not build.recipe then
        return nil, errors.new({kind = errors.CONFLICT, message = "image build is no longer ready"})
    end
    local write_err = resources.replace(args.image_id, {status = "ready", agents = build.agents, last_error = build.last_error}, nil, build.recipe.revision)
    if write_err then return nil, write_err end
    return true, nil
end

return { image_ready = image_ready, prepare = prepare, keep_credential = keep_credential, image_recipe = image_recipe }

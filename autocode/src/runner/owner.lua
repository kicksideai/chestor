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

type Prepared = {admitted: runs.Admitted, secret: string, revision: integer}
type Recipe = {ref: string, dockerfile: string}

local function owner(): (string?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "the run owner's identity is required"}) end
    return actor:id(), nil
end

local function prepare(args: {run_id: string}): (Prepared?, error?)
    local owner_id, owner_err = owner()
    if not owner_id then return nil, owner_err end
    local run, run_err = repo.run(owner_id, args.run_id)
    if run_err then return nil, run_err end
    if not run then return nil, errors.new({kind = errors.NOT_FOUND, message = "run not found"}) end
    local admitted, admit_err = runs.admit(runs.request(run))
    if not admitted then return nil, admit_err end
    local context, context_err = resources.context("account", run.account_id, resources.ACCESS.READ)
    if not context then return nil, context_err end
    local secret = context.values.credential
    if type(secret) ~= "string" or secret == "" then
        return nil, errors.new({kind = errors.INVALID, message = "account " .. admitted.account.label .. " holds no credential"})
    end
    return {admitted = admitted, secret = secret, revision = context.revision}, nil
end

-- keep_credential stores a login file the CLI refreshed during the run, only
-- while the stored credential is still the revision the run started with.
local function keep_credential(args: {account_id: string, credential: string, revision: integer}): (boolean?, error?)
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
    local image, image_err = resources.get("image", args.image_id, resources.ACCESS.WRITE)
    if not image then return nil, image_err end
    local context, context_err = resources.context("image", args.image_id, resources.ACCESS.WRITE)
    if not context then return nil, context_err end
    local dockerfile = context.values.dockerfile
    return {ref = tostring(image.meta.ref or ""), dockerfile = type(dockerfile) == "string" and dockerfile or ""}, nil
end

return { prepare = prepare, keep_credential = keep_credential, image_recipe = image_recipe }

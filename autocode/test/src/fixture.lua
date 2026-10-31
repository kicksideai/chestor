-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component fixtures the suites call as a given user, so every write goes
-- through the component service under that user's grants.
local resources = require("resources")
local images = require("images")
local runs = require("runs")

local function register(kind: string, meta: {[string]: unknown}, private: {[string]: unknown}): (string?, error?)
    if kind == "image" then
        local decoded, err = images.decode(private.settings or {})
        if not decoded then return nil, err end
        private.settings = decoded.settings
        private.dockerfile = private.dockerfile or ""
    end
    return resources.register(kind, meta, private)
end

local function admit(request: {[string]: unknown}): ({[string]: unknown}?, error?)
    local admitted, err = runs.admit({agent = request.agent, account_id = request.account_id, image_id = request.image_id,
        workspace_id = request.workspace_id, options = {}, unattended = true, repo_url = request.repo_url or "",
        prompt = "harness task", timeout = request.timeout})
    if not admitted then return nil, err end
    local workspace = admitted.workspace
    local writable: boolean? = nil
    if workspace then writable = workspace.writable end
    return {account_id = admitted.account.id, image_id = admitted.image.id, image = admitted.image, workspace_writable = writable,
        timeout_ms = admitted.spec.timeout_ms}, nil
end

local function prune(before: string): (integer?, error?)
    local repo = require("repo")
    return repo.prune_runs(before, 500)
end

local function image_revision(id: string): (integer?, error?)
    local context, err = resources.context("image", id, resources.ACCESS.WRITE)
    if not context then return nil, err end
    return context.revision, nil
end
return { image_revision = image_revision, register = register, admit = admit, prune = prune }

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component fixtures the suites call as a given user, so every write goes
-- through the component service under that user's grants.
local resources = require("resources")
local runs = require("runs")

local function register(kind: string, meta: {[string]: any}, private: {[string]: any}): (string?, error?)
    return resources.register(kind, meta, private)
end

local function admit(request: {[string]: any}): ({[string]: any}?, error?)
    local admitted, err = runs.admit({agent = request.agent, account_id = request.account_id, image_id = request.image_id,
        workspace_id = request.workspace_id, options = {}, unattended = true, repo_url = request.repo_url or "",
        prompt = "harness task"})
    if not admitted then return nil, err end
    local workspace = admitted.workspace
    local writable: boolean? = nil
    if workspace then writable = workspace.writable end
    return {account_id = admitted.account.id, image_id = admitted.image.id, workspace_writable = writable,
        timeout_ms = admitted.spec.timeout_ms}, nil
end

local function prune(before: string): (integer?, error?)
    local repo = require("repo")
    return repo.prune_runs(before, 500)
end

return { register = register, admit = admit, prune = prune }

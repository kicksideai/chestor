-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local resources = require("resources")
local repo = require("repo")
type Image = {id: string, ref: string, label: string, home: string, status: string, agents: {string}, last_error: string,
    owner: string, writable: boolean, deletable: boolean, shareable: boolean}
type Workspace = {id: string, name: string, writable: boolean, deletable: boolean, shareable: boolean, host_path: string?}
local M = {}
local text = resources.text
function M.image(image: resources.Resource, build: repo.ImageBuild?): Image
    local meta = image.meta
    local status = text(meta.status)
    if build and (build.finished_at == "" or not build.projected) then status = "preparing" end
    return {id = image.id, ref = text(meta.ref), label = text(meta.title), home = text(meta.home), status = status,
        agents = resources.strings(meta.agents), last_error = text(meta.last_error), owner = image.owner,
        writable = resources.has(image.access, resources.ACCESS.WRITE), deletable = resources.has(image.access, resources.ACCESS.DELETE),
        shareable = resources.has(image.access, resources.ACCESS.ADMIN)}
end
function M.workspace(workspace: resources.Resource): Workspace
    return {id = workspace.id, name = text(workspace.meta.title), writable = resources.has(workspace.access, resources.ACCESS.WRITE),
        deletable = resources.has(workspace.access, resources.ACCESS.DELETE), shareable = resources.has(workspace.access, resources.ACCESS.ADMIN)}
end
return M

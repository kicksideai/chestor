-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local resources = require("resources")
type Image = {id: string, ref: string, label: string, home: string, status: string, usable: boolean, agents: {string}, last_error: string,
    owner_user_id: string, owner: string, writable: boolean, deletable: boolean, shareable: boolean}
type Workspace = {conflicts: {{id: string, host_path: string}}?, unavailable_reason: string?,id: string, name: string, writable: boolean, deletable: boolean, shareable: boolean, host_path: string?}
local M = {}
local text = resources.text
function M.image(image: resources.Resource): Image
    local meta = image.meta
    return {id = image.id, ref = text(meta.ref), label = text(meta.title), home = text(meta.home), status = text(meta.status), usable = resources.flag(meta.usable, false),
        agents = resources.strings(meta.agents), last_error = text(meta.last_error), owner_user_id = image.owner_user_id, owner = image.owner_user_id,
        writable = resources.has(image.access, resources.ACCESS.WRITE), deletable = resources.has(image.access, resources.ACCESS.DELETE),
        shareable = resources.has(image.access, resources.ACCESS.ADMIN)}
end
function M.workspace(workspace: resources.Resource): Workspace
    return {id = workspace.id, name = text(workspace.meta.title), writable = resources.has(workspace.access, resources.ACCESS.WRITE),
        deletable = resources.has(workspace.access, resources.ACCESS.DELETE), shareable = resources.has(workspace.access, resources.ACCESS.ADMIN)}
end
return M

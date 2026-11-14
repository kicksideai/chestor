-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local image_state = require("image_state")
local repo = require("repo")
local images = require("images")
local uuid = require("uuid")
local function ready(id, owner, home, settings, revision, agents)
    local decoded = images.decode(settings)
    settings = decoded.settings
    local generation = uuid.v7()
    local err = repo.request_image_build(id, {actor_id = owner, actor_context = "{}"}, "initial", generation)
    if err then error(tostring(err)) end
    err = repo.finish_image_build(id, "fixture", generation, "ready", agents or {"claude"}, "", {ref = "sha256:" .. string.rep("a", 64), home = home, settings = settings, revision = revision})
    if err then error(tostring(err)) end
    err = repo.project_image_build(id, generation, function(build) local _, err = component.set_runtime_meta(id, image_state.fields(build, true)); return err end)
    if err then error(tostring(err)) end
    return generation
end
return {ready = ready}

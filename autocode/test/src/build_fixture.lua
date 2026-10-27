-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local uuid = require("uuid")
local function ready(id, owner, ref, home, settings)
    local generation = uuid.v7()
    local err = repo.request_image_build(id, {actor_id = owner, actor_context = "{}"}, "initial", function() return nil end, generation)
    if err then error(tostring(err)) end
    err = repo.finish_image_build(id, "fixture", generation, "ready", {"claude"}, "", {ref = ref, home = home, settings = settings})
    if err then error(tostring(err)) end
    err = repo.project_image_build(id, generation, function() return nil end)
    if err then error(tostring(err)) end
end
return {ready = ready}

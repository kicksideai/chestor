-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The teardown of the account, image and workspace kinds: each removes the
-- module rows its component owns before the component service unregisters it.
local ctx = require("ctx")
local repo = require("repo")

local function teardown(remove: ((string) -> error?)?): {[string]: unknown}
    local id = ctx.get("component_id")
    if type(id) ~= "string" or id == "" then return {success = false, error = "component_id is required"} end
    if remove then
        local err = remove(id)
        if err then return {success = false, error = tostring(err)} end
    end
    return {success = true}
end

-- Runs an account served keep their history.
local function delete_account(): {[string]: unknown}
    return teardown(repo.delete_account_state)
end

-- The Docker image stays on the host unless the administrator removes it.
local function delete_image(): {[string]: unknown}
    return teardown(repo.delete_image_build)
end

-- A workspace owns no module rows; its host directory is never removed.
local function delete_workspace(): {[string]: unknown}
    return teardown(nil)
end

return { delete_account = delete_account, delete_image = delete_image, delete_workspace = delete_workspace }

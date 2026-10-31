-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The teardown of the account, image and workspace kinds: each removes the
-- module rows its component owns before the component service unregisters it.
local ctx = require("ctx")
local repo = require("repo")
local image_tags = require("image_tags")

local function teardown(remove: ((string) -> error?)?): {[string]: unknown}
    local id = ctx.get("component_id")
    if type(id) ~= "string" or id == "" then return {success = false, error = errors.new({kind = errors.INVALID, message = "component_id is required"})} end
    if remove then
        local err = remove(id)
        if err then return {success = false, error = err} end
    end
    return {success = true}
end

-- Runs an account served keep their history.
local function delete_account(): {[string]: unknown}
    return teardown(repo.delete_account_state)
end

-- Teardown drains the build and releases its retained generation tags.
local function delete_image(): {[string]: unknown}
    return teardown(function(id: string): error?
        local err = repo.delete_image_build(id)
        if err then return err end
        return image_tags.retire(id)
    end)
end

-- A workspace owns no module rows; its host directory is never removed.
local function delete_workspace(): {[string]: unknown}
    return teardown(nil)
end

return { delete_account = delete_account, delete_image = delete_image, delete_workspace = delete_workspace }

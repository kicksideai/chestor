-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /autocode/catalog — the activated agent drivers with the credentials
-- each reads, the default agent image recipe, and management capabilities.
local security = require("security")
local web = require("web")
local drivers = require("drivers")
local credentials = require("credentials")
local images = require("images")

local function allowed(endpoints: {string}): boolean
    for _, endpoint in ipairs(endpoints) do
        if security.can("access", "chestor.autocode.api:" .. endpoint .. ".endpoint") ~= true then return false end
    end
    return true
end

-- file: the login file's path under HOME; subscription: a person's own login.
type Choice = {id: string, label: string, hint: string, file: string?, subscription: boolean}
-- endpoints: the protocols of custom endpoints the agent's CLI can reach.
type Agent = {id: string, title: string, credentials: {Choice}, endpoints: {string}}

local function handler()
    local ctx = web.open()
    if not ctx then return end
    local list, err = drivers.list()
    if not list then return web.fail_with(ctx.res, err) end
    local agents: {Agent} = {}
    for _, driver in ipairs(list) do
        local choices: {Choice} = {}
        for _, kind in ipairs(credentials.kinds(driver)) do
            choices[#choices + 1] = {id = kind.id, label = kind.label, hint = kind.hint, file = kind.file and kind.file.path or nil,
                subscription = kind.subscription}
        end
        agents[#agents + 1] = {id = driver.id, title = driver.title, credentials = choices, endpoints = driver.endpoints}
    end
    web.reply(ctx.res, web.STATUS.OK, {success = true, agents = agents, default_image = images.DEFAULT,
        can_images = allowed({"images_create", "images_update", "images_delete", "images_prepare"}),
        can_workspaces = allowed({"workspaces_create", "workspaces_delete"}),
        can_prune = allowed({"maintenance_prune"})})
end

return { handler = handler }

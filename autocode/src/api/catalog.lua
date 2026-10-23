-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /autocode/catalog — the activated agent drivers with the credentials
-- each reads, the default agent image recipe, and whether the caller
-- manages images and workspaces.
local security = require("security")
local web = require("web")
local drivers = require("drivers")
local credentials = require("credentials")
local images = require("images")

-- An administrator is a caller the image management endpoint admits.
local MANAGE_ENDPOINT = "chestor.autocode.api:images_create.endpoint"

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
        manage = security.can("access", MANAGE_ENDPOINT) == true})
end

return { handler = handler }

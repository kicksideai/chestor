-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local function list(): ()
    local ctx = web.open()
    if ctx then web.dispatch(ctx, "chestor.autocode:profiles", "list_profiles", {}, web.STATUS.OK) end
end
local function create(): ()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if body then web.dispatch(ctx, "chestor.autocode:profiles", "add_profile", body, web.STATUS.CREATED) end
end
local function update(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local body = web.body(ctx)
    if not body then return end
    body.id = id
    web.dispatch(ctx, "chestor.autocode:profiles", "update_profile", body, web.STATUS.OK)
end
local function delete(): ()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if id then web.dispatch(ctx, "chestor.autocode:profiles", "remove_profile", {id = id}, web.STATUS.OK) end
end
return {list = list, create = create, update = update, delete = delete}

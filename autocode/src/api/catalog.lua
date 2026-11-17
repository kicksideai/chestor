-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local web = require("web")
local catalog = require("catalog")
local function handler(): ()
    local ctx = web.open()
    if not ctx then return end
    local result, err = catalog.get()
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
local function preview(): ()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local result, err = catalog.preview(body)
    web.respond(ctx.res, result, err, web.STATUS.OK)
end
return {handler = handler, preview = preview}

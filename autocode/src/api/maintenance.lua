-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /autocode/maintenance/prune — reclaim Docker space: stopped autocode
-- containers, dangling image layers, and build cache older than a day.
local web = require("web")
local docker = require("docker")

local STEPS = {
    {"container", "prune", "--force", "--filter", "label=chestor.autocode.run"},
    {"image", "prune", "--force"},
    {"builder", "prune", "--force", "--filter", "until=24h"},
}

local function prune()
    local ctx = web.open()
    if not ctx then return end
    local output: {string} = {}
    for _, args in ipairs(STEPS) do
        output[#output + 1] = "$ docker " .. table.concat(args, " ")
        local code, err = docker.run(args, {on_line = function(line: string) output[#output + 1] = line end})
        if err then return web.fail_with(ctx.res, err) end
        if code ~= 0 then
            return web.fail(ctx.res, web.STATUS.INTERNAL_ERROR, table.concat(output, "\n"))
        end
    end
    web.reply(ctx.res, web.STATUS.OK, {success = true, output = table.concat(output, "\n")})
end

return { prune = prune }

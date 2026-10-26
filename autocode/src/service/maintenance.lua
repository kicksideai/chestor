-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /autocode/maintenance/prune — reclaim Docker space: stopped autocode
-- containers, dangling image layers, and build cache older than a day.
local docker = require("docker")

local STEPS = {
    {"container", "prune", "--force", "--filter", "label=chestor.autocode.run"},
    {"image", "prune", "--force"},
    {"builder", "prune", "--force", "--filter", "until=24h"},
}

local function prune()
    local output: {string} = {}
    for _, args in ipairs(STEPS) do
        output[#output + 1] = "$ docker " .. table.concat(args, " ")
        local code, err = docker.run(args, {on_line = function(line: string) output[#output + 1] = line end})
        if err then return nil, err end
        if code ~= 0 then
            return nil, errors.new({kind = errors.INTERNAL, message = "Docker cleanup failed", retryable = false, details = {code = "autocode.cleanup_failed", output = table.concat(output, "\n")}})
        end
    end
    return {output = table.concat(output, "\n")}, nil
end

return { prune = prune }

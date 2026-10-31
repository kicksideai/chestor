-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local docker = require("docker")
local M = {}

function M.name(image_id: string, build_id: string): string
    return "chestor-autocode/" .. image_id .. ":" .. build_id
end

-- Failed generations release only their own tag after their probe stops.
function M.remove(tag: string, deadline: string?): error?
    local present = false
    local code, err = docker.run({"image", "ls", "--format", "{{.Repository}}:{{.Tag}}", "--filter", "reference=" .. tag},
        {deadline = deadline, on_line = function(line: string) if line == tag then present = true end end})
    if err then return err end
    if code ~= 0 then return errors.new({kind = errors.UNAVAILABLE, message = "generation tag listing failed"}) end
    if not present then return nil end
    local removed, remove_err = docker.run({"image", "rm", "--force", tag}, {deadline = deadline})
    if remove_err then return remove_err end
    if removed ~= 0 then return errors.new({kind = errors.UNAVAILABLE, message = "generation tag removal failed: " .. tag}) end
    return nil
end

-- Each component retains its approved generation until replacement or deletion.
function M.retire(image_id: string, keep: string?, deadline: string?): error?
    local prefix = "chestor-autocode/" .. image_id .. ":"
    local tags: {string} = {}
    local code, err = docker.run({"image", "ls", "--format", "{{.Repository}}:{{.Tag}}", "--filter", "reference=" .. prefix .. "*"},
        {deadline = deadline, on_line = function(line: string) if line:sub(1, #prefix) == prefix and line ~= keep then tags[#tags + 1] = line end end})
    if err then return err end
    if code ~= 0 then return errors.new({kind = errors.UNAVAILABLE, message = "generation tag listing failed"}) end
    for _, tag in ipairs(tags) do
        local removed, remove_err = docker.run({"image", "rm", "--force", tag}, {deadline = deadline})
        if remove_err then return remove_err end
        if removed ~= 0 then return errors.new({kind = errors.UNAVAILABLE, message = "generation tag removal failed: " .. tag}) end
    end
    return nil
end

return M

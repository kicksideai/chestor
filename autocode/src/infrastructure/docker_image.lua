-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local docker = require("docker")
type Object = {[string]: unknown}
local function docker_output(args: {string}): ({string}?, error?)
    local lines: {string} = {}
    local code, err = docker.run(args, {on_line = function(line: string) lines[#lines + 1] = line end})
    if err then return nil, err end
    if code ~= 0 then return nil, errors.new({kind = errors.UNAVAILABLE, message = "Docker command failed", retryable = true,
        details = {code = "autocode.docker_failed", exit_code = code, output = table.concat(lines, "\n")}}) end
    return lines, nil
end

-- Docker lists confirm absence and container use independently of CLI language.
local function remove(ref: string): error?
    local output: {string} = {}
    local code, err = docker.run({"image", "rm", ref}, {on_line = function(line: string) output[#output + 1] = line end})
    if err then return err end
    if code == 0 then return nil end
    local details: Object = {code = "autocode.docker_failed", exit_code = code, output = table.concat(output, "\n")}
    local failure = errors.new({kind = errors.UNAVAILABLE, message = "Docker image removal failed", retryable = true, details = details})
    local images, list_err = docker_output({"image", "ls", "--all", "--digests", "--no-trunc", "--format", "{{.ID}} {{.Repository}} {{.Tag}} {{.Digest}}"})
    if not images then return list_err and errors.wrap(list_err, "Docker image removal failed: " .. table.concat(output, "\n")) or failure end
    local image_id: string? = nil
    local references: {[string]: integer} = {}
    local by_id = ref:match("^sha256:[a-f0-9]+$") ~= nil or ref:match("^[a-f0-9]+$") ~= nil
    local short_id = ref:gsub("^sha256:", "")
    for _, line in ipairs(images) do
        local id, repository, tag, digest = line:match("^(%S+) (%S+) (%S+) (%S+)$")
        if type(id) ~= "string" or type(repository) ~= "string" or type(tag) ~= "string" or type(digest) ~= "string" then return failure end
        references[id] = (references[id] or 0) + 1
        if ref == repository .. ":" .. tag or (ref == repository and tag == "latest")
            or ref == repository .. "@" .. digest or ref == id
            or (by_id and id:sub(8, 7 + #short_id) == short_id) then image_id = id end
    end
    if not image_id then return nil end
    local boxes, boxes_err = docker_output({"ps", "--all", "--quiet", "--filter", "ancestor=" .. image_id})
    if not boxes then return boxes_err and errors.wrap(boxes_err, "Docker image removal failed: " .. table.concat(output, "\n")) or failure end
    local used = by_id and (references[image_id] or 0) > 1
    if #boxes > 0 then
        local args = {"container", "inspect", "--format", "{{.Image}}"}
        for _, id in ipairs(boxes) do args[#args + 1] = id end
        local ids, inspect_err = docker_output(args)
        if not ids then return inspect_err and errors.wrap(inspect_err, "Docker image removal failed: " .. table.concat(output, "\n")) or failure end
        for _, id in ipairs(ids) do if id == image_id then used = true end end
    end
    if used then
        details.code = "autocode.image_in_use"
        return errors.new({kind = errors.CONFLICT, message = "Docker image is in use", retryable = false, details = details})
    end
    return failure
end

return {remove = remove}

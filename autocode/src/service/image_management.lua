-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local resources = require("resources")
local images = require("images")
local projections = require("projections")
local values = require("values")
local boundary = require("boundary")
local docker = require("docker")
type Object = {[string]: unknown}
local text = resources.text
local view = projections.image
local function get(args: Object)
    local id = values.text(args.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local image, err = resources.get("image", id, resources.ACCESS.READ)
    if not image then return nil, boundary.native(err) end
    local build, build_err = repo.image_build(id)
    if build_err then return nil, boundary.native(build_err) end
    local body: Object = {image = view(image, build), build_log = build and build.log or ""}
    if resources.has(image.access, resources.ACCESS.WRITE) then
        local context, context_err = resources.context("image", id, resources.ACCESS.WRITE)
        if not context then return nil, boundary.native(context_err) end
        body.dockerfile = text(context.values.dockerfile)
        body.settings = context.values.settings
    end
    return body, nil
end

local function create(body: Object)
    local ref = values.text(body.ref, 300)
    if not ref or ref == "" or ref:find("%s") then
        return nil, boundary.error(errors.INVALID, "autocode.invalid_image", "ref must be an image reference such as name:tag")
    end
    local dockerfile = values.text(body.dockerfile or "", 65536)
    if not dockerfile then return nil, boundary.error(errors.INVALID, "autocode.invalid_image", "dockerfile is too large") end
    local decoded, decode_err = images.decode(body)
    if not decoded then return nil, boundary.native(decode_err) end
    local id, err = resources.register("image", {title = decoded.label ~= "" and decoded.label or ref, ref = ref, home = decoded.home,
        status = "unprepared", agents = {}, last_error = ""}, {dockerfile = dockerfile, settings = decoded.settings})
    if not id then return nil, boundary.native(err) end
    local build_err = images.request_build(id, "initial")
    if build_err then
        local failure = boundary.native(build_err) or build_err
        return {id = id,
            build_error = {message = failure:message(), kind = failure:kind(), retryable = failure:retryable(), details = failure:details()}}, nil
    end
    return {id = id}, nil
end

-- PUT /autocode/images/{id} — change the label, home and run settings; the
-- next run uses them, without a rebuild.
local function update(body: Object)
    local id = values.text(body.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local decoded, decode_err = images.decode(body)
    if not decoded then return nil, boundary.native(decode_err) end
    local image, err = resources.get("image", id, resources.ACCESS.WRITE)
    if not image then return nil, boundary.native(err) end
    local context, context_err = resources.context("image", id, resources.ACCESS.WRITE)
    if not context then return nil, boundary.native(context_err) end
    local update_err = resources.replace(id, {title = decoded.label ~= "" and decoded.label or text(image.meta.ref), home = decoded.home},
        {settings = decoded.settings}, context.revision)
    if update_err then return nil, boundary.native(update_err) end
    return {}, nil
end

-- POST /autocode/images/{id}/prepare — rebuild from the stored Dockerfile,
-- or pull the reference again even when a local copy exists.
local function prepare(args: Object)
    local id = values.text(args.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local image, err = resources.get("image", id, resources.ACCESS.WRITE)
    if not image then return nil, boundary.native(err) end
    local build_err = images.request_build(id, "refresh")
    if build_err then return nil, boundary.native(build_err) end
    return {}, nil
end

-- ?remove=1 also removes the Docker image from the host first; the image
-- stays when Docker refuses, for example while a container still uses it.
local function delete(args: Object)
    local id = values.text(args.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local image, find_err = resources.get("image", id, resources.ACCESS.DELETE)
    if not image then return nil, boundary.native(find_err) end
    if args.remove == true then
        local output: {string} = {}
        local code, docker_err = docker.run({"image", "rm", text(image.meta.ref)}, {on_line = function(line: string) output[#output + 1] = line end})
        if docker_err then return nil, boundary.native(docker_err) end
        local result = table.concat(output, "\n")
        if code ~= 0 and not result:find("No such image", 1, true) then return nil, errors.new({kind = errors.CONFLICT, message = "Docker cannot remove the image", retryable = false, details = {code = "autocode.image_in_use", output = result}}) end
    end
    local err = resources.delete(id)
    if err then return nil, boundary.native(err) end
    return {}, nil
end

return {get = get, create = create, update = update, prepare = prepare, delete = delete}

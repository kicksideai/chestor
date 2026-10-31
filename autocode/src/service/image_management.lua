-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local resources = require("resources")
local images = require("images")
local resource_dto = require("resource_dto")
local values = require("values")
local boundary = require("boundary")
local docker_image = require("docker_image")
type Object = {[string]: unknown}
local text = resources.text
local view = resource_dto.image
type Detail = {image: resource_dto.Image, build_log: string, dockerfile: string?, settings: images.Settings?}
type Created = {id: string, build_error: boundary.Failure?}
local function get(args: Object): (Detail?, error?)
    local id = values.text(args.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local image, err = resources.get("image", id, resources.ACCESS.READ)
    if not image then return nil, boundary.native(err) end
    local build, build_err = repo.image_build(id)
    if build_err then return nil, boundary.native(build_err) end
    local body: Detail = {image = view(image, build), build_log = build and build.log or ""}
    if resources.has(image.access, resources.ACCESS.WRITE) then
        local decoded, decode_err = resources.image_recipe(id, resources.ACCESS.WRITE)
        if not decoded then return nil, decode_err end
        body.dockerfile = decoded.dockerfile or ""
        body.settings = (values.object(decoded.settings) :: images.Settings)
    end
    return body, nil
end

local function create(body: Object): (Created?, error?)
    local ref = values.text(body.ref, 300)
    if not ref or ref == "" or ref:find("%s") then
        return nil, boundary.error(errors.INVALID, "autocode.invalid_image", "ref must be an image reference such as name:tag")
    end
    local dockerfile = values.text(body.dockerfile or "", 65536)
    if not dockerfile then return nil, boundary.error(errors.INVALID, "autocode.invalid_image", "dockerfile is too large") end
    local decoded, decode_err = images.decode(body)
    if not decoded then return nil, boundary.native(decode_err) end
    local id, err = resources.register("image", {title = decoded.label ~= "" and decoded.label or ref, ref = ref, home = decoded.home,
        status = "preparing", agents = {}, last_error = ""}, {dockerfile = dockerfile, settings = decoded.settings})
    if not id then return nil, boundary.native(err) end
    local build_err = images.request_build(id, "initial")
    if build_err then
        local context, context_err = resources.context("image", id, resources.ACCESS.WRITE)
        local reset_err = context_err
        if context then reset_err = resources.replace(id, {status = "unprepared", last_error = build_err:message()}, nil, context.revision) end
        return {id = id, build_error = boundary.partial(reset_err or build_err)}, nil
    end
    return {id = id}, nil
end

-- PUT /autocode/images/{id} saves the recipe and requests its build under the manager.
local function update(body: Object): (Created?, error?)
    local id = values.text(body.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local decoded, decode_err = images.decode(body)
    if not decoded then return nil, boundary.native(decode_err) end
    local snapshot, snapshot_err = resources.snapshot("image", id, resources.ACCESS.WRITE)
    if not snapshot then return nil, boundary.native(snapshot_err) end
    local context, image = snapshot.context, snapshot.resource
    local requested_ref = body.ref
    if requested_ref == nil then requested_ref = image.meta.ref end
    local ref = values.text(requested_ref, 300)
    if not ref or ref == "" or ref:find("%s") then return nil, boundary.error(errors.INVALID, "autocode.invalid_image", "ref must be an image reference such as name:tag") end
    local requested_dockerfile = body.dockerfile
    if requested_dockerfile == nil then requested_dockerfile = context.values.dockerfile or "" end
    local dockerfile = values.text(requested_dockerfile, 65536)
    if not dockerfile then return nil, boundary.error(errors.INVALID, "autocode.invalid_image", "dockerfile is too large") end
    local fields: Object = {title = decoded.label ~= "" and decoded.label or ref, home = decoded.home}
    local previous = context.values.settings
    local ref_changed = ref ~= text(image.meta.ref)
    local dockerfile_changed = dockerfile ~= text(context.values.dockerfile)
    local changed = ref_changed or dockerfile_changed or decoded.home ~= text(image.meta.home)
    if ref_changed then fields.ref = ref end
    if type(previous) ~= "table" then changed = true
    else
        for key, value in pairs(decoded.settings) do
            local old = previous[key]
            if type(value) == "table" then
                if type(old) ~= "table" or #old ~= #value then changed = true
                else for i, item in ipairs(value) do if old[i] ~= item then changed = true end end end
            elseif old ~= value then changed = true end
        end
    end
    -- An unprepared image has settings no build recorded yet, so a save that
    -- repeats them still requests the preparation they need.
    local prepares = changed or text(image.meta.status) == "unprepared"
    if prepares then
        local build, build_err = repo.image_build(id)
        if build_err then return nil, boundary.native(build_err) end
        if not build or not build.approved_recipe then fields.status = "unprepared" end
        local _, admit_err = images.admit_build(id)
        if admit_err then return nil, boundary.native(admit_err) end
    end
    local update_err = resources.replace(id, fields, changed and {settings = decoded.settings, dockerfile = dockerfile} or nil, context.revision)
    if update_err then return nil, boundary.native(update_err) end
    if prepares then
        local build_err = images.request_build(id, (ref_changed or dockerfile_changed) and dockerfile == "" and "refresh" or "initial")
        if build_err then
            return {id = id, build_error = boundary.partial(build_err)}, nil
        end
    end
    return {id = id}, nil
end

-- POST /autocode/images/{id}/prepare — rebuild from the stored Dockerfile,
-- pull a registry reference, or re-probe a local-only image without pulling.
local function prepare(args: Object): ({}?, error?)
    local id = values.text(args.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local image, err = resources.get("image", id, resources.ACCESS.WRITE)
    if not image then return nil, boundary.native(err) end
    local build_err = images.request_build(id, "refresh")
    if build_err then return nil, boundary.native(build_err) end
    return {}, nil
end

-- Component deletion drains the build before Docker reference removal.
local function delete(args: Object): ({docker_error: boundary.Failure?}?, error?)
    local id = values.text(args.id, 64)
    if not id or id == "" then return nil, boundary.error(errors.INVALID, "autocode.invalid_request", "image id is required") end
    local image, find_err = resources.get("image", id, resources.ACCESS.DELETE)
    if not image then return nil, boundary.native(find_err) end
    local err = resources.delete(id)
    if err then return nil, boundary.native(err) end
    if args.remove == true then
        local remove_err = docker_image.remove(text(image.meta.ref))
        if remove_err then
            return {docker_error = boundary.partial(remove_err)}, nil
        end
    end
    return {}, nil
end

return {get = get, create = create, update = update, prepare = prepare, delete = delete}

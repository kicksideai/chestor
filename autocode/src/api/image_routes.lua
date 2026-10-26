-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- /autocode/images — agent image components with their container run
-- settings. Listing and reading show the images the caller can see; creating,
-- changing, preparing and deleting are management endpoints, and each also
-- needs the matching grant on the image.
local web = require("web")
local repo = require("repo")
local resources = require("resources")
local images = require("images")
local docker = require("docker")

type View = {id: string, ref: string, label: string, home: string, status: string, agents: {string}, last_error: string,
    owner: string, writable: boolean, deletable: boolean, shareable: boolean}

local function text(value: unknown): string
    return type(value) == "string" and value or ""
end

local function view(image: resources.Resource): View
    local meta = image.meta
    return {id = image.id, ref = text(meta.ref), label = text(meta.title), home = text(meta.home), status = text(meta.status),
        agents = resources.strings(meta.agents), last_error = text(meta.last_error), owner = image.owner,
        writable = resources.has(image.access, resources.ACCESS.WRITE),
        deletable = resources.has(image.access, resources.ACCESS.DELETE),
        shareable = resources.has(image.access, resources.ACCESS.ADMIN)}
end

local function list()
    local ctx = web.open()
    if not ctx then return end
    local all, err = resources.list("image")
    if not all then return web.fail_with(ctx.res, err) end
    local views: {View} = {}
    for _, image in ipairs(all) do views[#views + 1] = view(image) end
    web.reply(ctx.res, web.STATUS.OK, {success = true, images = views})
end

-- GET /autocode/images/{id} — the image with its last build log; a caller
-- who may change it also reads its Dockerfile and run settings.
local function get()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local image, err = resources.get("image", id, resources.ACCESS.READ)
    if not image then return web.fail_with(ctx.res, err) end
    local build, build_err = repo.image_build(id)
    if build_err then return web.fail_with(ctx.res, build_err) end
    local body: {[string]: unknown} = {success = true, image = view(image), build_log = build and build.log or ""}
    if resources.has(image.access, resources.ACCESS.WRITE) then
        local context, context_err = resources.context("image", id, resources.ACCESS.WRITE)
        if not context then return web.fail_with(ctx.res, context_err) end
        body.dockerfile = text(context.values.dockerfile)
        body.settings = context.values.settings
    end
    web.reply(ctx.res, web.STATUS.OK, body)
end

local function create()
    local ctx = web.open()
    if not ctx then return end
    local body = web.body(ctx)
    if not body then return end
    local ref = web.text(body.ref, 300)
    if not ref or ref == "" or ref:find("%s") then
        return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "ref must be an image reference such as name:tag")
    end
    local dockerfile = web.text(body.dockerfile or "", 65536)
    if not dockerfile then return web.fail(ctx.res, web.STATUS.BAD_REQUEST, "dockerfile is too large") end
    local decoded, decode_err = images.decode(body)
    if not decoded then return web.fail_with(ctx.res, decode_err) end
    local id, err = resources.register("image", {title = decoded.label ~= "" and decoded.label or ref, ref = ref, home = decoded.home,
        status = "preparing", agents = {}, last_error = ""}, {dockerfile = dockerfile, settings = decoded.settings})
    if not id then return web.fail_with(ctx.res, err) end
    local build_err = images.request_build(id, "initial")
    if build_err then return web.fail_with(ctx.res, build_err) end
    web.reply(ctx.res, web.STATUS.CREATED, {success = true, id = id})
end

-- PUT /autocode/images/{id} — change the label, home and run settings; the
-- next run uses them, without a rebuild.
local function update()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local body = web.body(ctx)
    if not body then return end
    local decoded, decode_err = images.decode(body)
    if not decoded then return web.fail_with(ctx.res, decode_err) end
    local image, err = resources.get("image", id, resources.ACCESS.WRITE)
    if not image then return web.fail_with(ctx.res, err) end
    local meta_err = resources.set_meta(id, {title = decoded.label ~= "" and decoded.label or text(image.meta.ref), home = decoded.home})
    if meta_err then return web.fail_with(ctx.res, meta_err) end
    local context_err = resources.patch_context(id, {settings = decoded.settings}, nil)
    if context_err then return web.fail_with(ctx.res, context_err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true})
end

-- POST /autocode/images/{id}/prepare — rebuild from the stored Dockerfile,
-- or pull the reference again even when a local copy exists.
local function prepare()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local image, err = resources.get("image", id, resources.ACCESS.WRITE)
    if not image then return web.fail_with(ctx.res, err) end
    if image.meta.status == "preparing" then return web.fail(ctx.res, web.STATUS.CONFLICT, "image is already being prepared") end
    local build_err = images.request_build(id, "refresh")
    if build_err then return web.fail_with(ctx.res, build_err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true})
end

-- ?remove=1 also removes the Docker image from the host first; the image
-- stays when Docker refuses, for example while a container still uses it.
local function delete()
    local ctx = web.open()
    if not ctx then return end
    local id = web.param(ctx, "id")
    if not id then return end
    local image, find_err = resources.get("image", id, resources.ACCESS.DELETE)
    if not image then return web.fail_with(ctx.res, find_err) end
    if ctx.req:query("remove") == "1" then
        local output: {string} = {}
        local code, docker_err = docker.run({"image", "rm", text(image.meta.ref)}, {on_line = function(line: string) output[#output + 1] = line end})
        if docker_err then return web.fail_with(ctx.res, docker_err) end
        local result = table.concat(output, "\n")
        if code ~= 0 and not result:find("No such image", 1, true) then return web.fail(ctx.res, web.STATUS.CONFLICT, result) end
    end
    local err = resources.delete(id)
    if err then return web.fail_with(ctx.res, err) end
    web.reply(ctx.res, web.STATUS.OK, {success = true})
end

return { list = list, get = get, create = create, update = update, prepare = prepare, delete = delete }

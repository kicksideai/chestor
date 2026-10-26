-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("database")
local sql = require("sql")
local json = require("json")

type Columns = db.Columns
type ImageBuild = db.ImageBuild
type BuildMode = db.BuildMode
type Identity = db.Identity
type Transactional = db.Transactional
local query = db.query
local execute = db.execute
local mismatch = db.mismatch
local text = db.text
local flag = db.flag
local first = db.first
local encoded = db.encoded
local transaction = db.transaction
local repo = {}

-- Image builds. One row holds the latest build of an image: the identity and
-- mode it was requested with, then its log once it finished.

local function image_build(row: Columns): ImageBuild
    local agents: {string} = {}
    local decoded = json.decode(text(row, "agents"))
    if type(decoded) ~= "table" then mismatch(row, "agents", "a JSON array")
    else
        for _, value in ipairs(decoded) do
            if type(value) ~= "string" then mismatch(row, "agents", "strings") else agents[#agents + 1] = value end
        end
    end
    return {projected = flag(row, "projected"), build_id = text(row, "build_id"), status = text(row, "status"), agents = agents, last_error = text(row, "last_error"),
        identity = {actor_id = text(row, "actor_id"), actor_context = text(row, "actor_context")},
        mode = text(row, "mode") == "refresh" and "refresh" or "initial", log = text(row, "log"),
        requested_at = text(row, "requested_at"), finished_at = text(row, "finished_at")}
end

function repo.image_build(image_id: string): (ImageBuild?, error?)
    local rows, err = query([[SELECT actor_id, actor_context, mode, log, requested_at, finished_at, build_id, status, agents, last_error, projected
        FROM chestor_autocode_image_builds WHERE image_id = $1]], {image_id})
    return first(rows, err, image_build)
end

-- request_image_build records a build request under `identity` in one
-- transaction with `work`, which enqueues the build job.
function repo.request_image_build(image_id: string, identity: Identity, mode: BuildMode, work: Transactional, build_id: string?): error?
    if not build_id or build_id == "" then return errors.new({kind = errors.INVALID, message = "build generation is required"}) end
    return transaction({}, function(tx: sql.Transaction, dbtype: string): error?
        local result, err = tx:execute([[INSERT INTO chestor_autocode_image_builds
            (image_id, actor_id, actor_context, mode, log, requested_at, finished_at, build_id, status, agents, last_error, projected)
            VALUES ($1, $2, $3, $4, '', $5, '', $6, 'preparing', '[]', '', 0)
            ON CONFLICT (image_id) DO UPDATE SET actor_id = excluded.actor_id, actor_context = excluded.actor_context,
            mode = excluded.mode, log = '', requested_at = excluded.requested_at, finished_at = '', build_id = excluded.build_id,
            status = 'preparing', agents = '[]', last_error = '', projected = 0 WHERE chestor_autocode_image_builds.finished_at <> '' AND chestor_autocode_image_builds.projected = 1
            AND chestor_autocode_image_builds.build_id <> excluded.build_id]],
            {image_id, identity.actor_id, identity.actor_context, mode, db.now(), build_id})
        if err then return err end
        if not result or result.rows_affected ~= 1 then
            local rows, read_err = tx:query("SELECT build_id, actor_id, actor_context, mode FROM chestor_autocode_image_builds WHERE image_id = $1", {image_id})
            if read_err then return read_err end
            local current = rows and rows[1]
            if current and current.build_id == build_id and current.actor_id == identity.actor_id
                and current.actor_context == identity.actor_context and current.mode == mode then return nil end
            return errors.new({kind = errors.CONFLICT, message = "image already has an active build"})
        end
        return work(tx, dbtype)
    end)
end

function repo.finish_image_build(image_id: string, log: string, build_id: string, status: string, agents: {string}, problem: string): error?
    local agents_json, json_err = encoded(agents, "agents")
    if not agents_json then return json_err end
    local count, err = execute([[UPDATE chestor_autocode_image_builds SET log = $1, finished_at = $2,
        status = $3, agents = $4, last_error = $5 WHERE image_id = $6 AND build_id = $7 AND finished_at = '']],
        {log, db.now(), status, agents_json, problem, image_id, build_id})
    if err then return err end
    if count ~= 1 then return errors.new({kind = errors.CONFLICT, message = "image build generation is no longer active"}) end
    return nil
end

-- An unfinished projection keeps the build slot claimed. A retry projects
-- that same generation until it succeeds; projected generations never write
-- again, even when a newer build starts.
function repo.project_image_build(image_id: string, build_id: string, project: (ImageBuild) -> error?): error?
    local build, read_err = repo.image_build(image_id)
    if not build then return read_err or errors.new({kind = errors.NOT_FOUND, message = "image build not found"}) end
    if build.build_id ~= build_id then return errors.new({kind = errors.CONFLICT, message = "stale image build generation"}) end
    if build.projected then return nil end
    local err = project(build)
    if err then return err end
    if build.finished_at == "" then return nil end
    local _, write_err = execute("UPDATE chestor_autocode_image_builds SET projected = 1 WHERE image_id = $1 AND build_id = $2", {image_id, build_id})
    return write_err
end

function repo.delete_image_build(image_id: string): error?
    local _, err = execute("DELETE FROM chestor_autocode_image_builds WHERE image_id = $1", {image_id})
    return err
end

return repo

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local recipe = require("recipe")
local db = require("database")
local sql = require("sql")
local json = require("json")
local jobs = require("jobs")
local trace = require("trace")
local settings = require("settings")
local time = require("time")

type Columns = db.Columns
type ImageBuild = db.ImageBuild
type BuildMode = db.BuildMode
type Identity = db.Identity
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
    local approved_agents: {string} = {}
    local approved = json.decode(text(row, "approved_agents"))
    if type(approved) ~= "table" then mismatch(row, "approved_agents", "a JSON array")
    else
        for _, value in ipairs(approved) do
            if type(value) ~= "string" then mismatch(row, "approved_agents", "strings") else approved_agents[#approved_agents + 1] = value end
        end
    end
    local approved_recipe: recipe.Recipe? = nil
    local prior = db.object(row, "approved_recipe")
    if next(prior) ~= nil then
        local value, err = recipe.decode(prior)
        if err then row.problem = err end
        approved_recipe = value
    end
    local stored = db.object(row, "recipe")
    local decoded_recipe: recipe.Recipe? = nil
    if next(stored) ~= nil then
        local value, err = recipe.decode(stored)
        if err then row.problem = err end
        decoded_recipe = value
    end
    return {approved_recipe = approved_recipe, approved_agents = approved_agents, recipe = decoded_recipe, projected = flag(row, "projected"), build_id = text(row, "build_id"), job_id = text(row, "job_id"), status = text(row, "status"), agents = agents, last_error = text(row, "last_error"),
        identity = {actor_id = text(row, "actor_id"), actor_context = text(row, "actor_context")},
        mode = text(row, "mode") == "refresh" and "refresh" or "initial", log = text(row, "log"),
        requested_at = text(row, "requested_at"), finished_at = text(row, "finished_at")}
end

function repo.image_build(image_id: string): (ImageBuild?, error?)
    local rows, err = query([[SELECT actor_id, actor_context, mode, log, requested_at, finished_at, build_id, job_id, status, agents, last_error, projected, recipe, approved_recipe, approved_agents
        FROM chestor_autocode_image_builds WHERE image_id = $1]], {image_id})
    local build, read_err = first(rows, err, image_build)
    if not build or read_err then return build, read_err end
    if (build.finished_at == "" or not build.projected) and build.job_id ~= "" then
        local job, job_err = jobs.get_job(build.job_id)
        if job_err then return nil, job_err end
        build.job_live = job ~= nil and (job.status == "pending" or job.status == "running")
    end
    return build, nil
end

-- The build request and its job commit in one transaction.
function repo.request_image_build(image_id: string, identity: Identity, mode: BuildMode, build_id: string?, replaces: string?, trace_context: {[string]: unknown}?): error?
    local normalized, trace_err = trace.normalize(trace_context)
    if trace_err then return trace_err end
    normalized = normalized or trace.begin("autocode.build")
    if not build_id or build_id == "" then return errors.new({kind = errors.INVALID, message = "build generation is required"}) end
    local configured, setting_err = settings.get("image_build_timeout")
    if not configured then return setting_err end
    local duration, duration_err = time.parse_duration(configured)
    if not duration then return duration_err end
    local timeout_ms = math.floor(duration:milliseconds())
    if timeout_ms < 60000 or timeout_ms > settings.MAX_RUN_TIMEOUT_MS then
        return errors.new({kind = errors.INVALID, message = "image build timeout must be between 1m and 168h"})
    end
    return transaction({}, function(tx: sql.Transaction, dbtype: string): error?
        local result, err = tx:execute([[INSERT INTO chestor_autocode_image_builds
            (image_id, actor_id, actor_context, mode, log, requested_at, finished_at, build_id, status, agents, last_error, projected)
            VALUES ($1, $2, $3, $4, '', $5, '', $6, 'preparing', '[]', '', 0)
            ON CONFLICT (image_id) DO UPDATE SET actor_id = excluded.actor_id, actor_context = excluded.actor_context,
            mode = excluded.mode, log = '', requested_at = excluded.requested_at, finished_at = '', build_id = excluded.build_id,
            status = 'preparing', agents = '[]', last_error = '', projected = 0, recipe = '{}', job_id = '' WHERE ((chestor_autocode_image_builds.finished_at <> '' AND chestor_autocode_image_builds.projected = 1)
            OR chestor_autocode_image_builds.build_id = $7)
            AND chestor_autocode_image_builds.build_id <> excluded.build_id]],
            {image_id, identity.actor_id, identity.actor_context, mode, db.now(), build_id, replaces or ""})
        if err then return err end
        if not result or result.rows_affected ~= 1 then
            local rows, read_err = tx:query("SELECT build_id, actor_id, actor_context, mode FROM chestor_autocode_image_builds WHERE image_id = $1", {image_id})
            if read_err then return read_err end
            local current = rows and rows[1]
            if current and current.build_id == build_id and current.actor_id == identity.actor_id
                and current.actor_context == identity.actor_context and current.mode == mode then return nil end
            return errors.new({kind = errors.CONFLICT, message = "image already has an active build"})
        end
        local job, job_err = jobs.enqueue_tx(tx, dbtype, {namespace = "chestor.autocode", scope = image_id,
            key = "build:" .. build_id, owner_locator = {kind = "user", id = identity.actor_id},
            job_type = "chestor.autocode.runner:image", max_attempts = 3, trace_context = normalized,
            immutable_payload = {image_id = image_id, build_id = build_id, max_execution_ms = timeout_ms}})
        if job_err then return job_err end
        if not job or type(job.id) ~= "string" or job.id == "" then
            return errors.new({kind = errors.INTERNAL, message = "image build enqueue returns no job ID"})
        end
        local _, write_err = tx:execute("UPDATE chestor_autocode_image_builds SET job_id = $1 WHERE image_id = $2 AND build_id = $3", {job.id, image_id, build_id})
        return write_err
    end)
end

function repo.finish_image_build(image_id: string, log: string, build_id: string, status: string, agents: {string}, problem: string, recipe: recipe.Recipe?): error?
    local agents_json, json_err = encoded(agents, "agents")
    if not agents_json then return json_err end
    local recipe_json, recipe_err = db.encode_object(recipe or {}, "recipe")
    if not recipe_json then return recipe_err end
    local count, err = execute([[UPDATE chestor_autocode_image_builds SET log = $1, finished_at = $2,
        status = $3, agents = $4, last_error = $5, recipe = $6 WHERE image_id = $7 AND build_id = $8 AND finished_at = '']],
        {log, db.now(), status, agents_json, problem, recipe_json, image_id, build_id})
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
    local _, write_err = execute([[UPDATE chestor_autocode_image_builds SET projected = 1,
        approved_recipe = CASE WHEN status = 'ready' THEN recipe ELSE approved_recipe END,
        approved_agents = CASE WHEN status = 'ready' THEN agents ELSE approved_agents END
        WHERE image_id = $1 AND build_id = $2]], {image_id, build_id})
    return write_err
end

function repo.delete_image_build(image_id: string): error?
    local build, read_err = repo.image_build(image_id)
    if read_err then return read_err end
    if not build then return nil end
    if build.job_id == "" and (build.finished_at == "" or not build.projected) then
        return errors.new({kind = errors.CONFLICT, message = "image build has no recorded job ID; termination is unconfirmed"})
    end
    if build.job_id ~= "" then
        local _, cancel_err = jobs.cancel(build.job_id)
        if cancel_err then return cancel_err end
        local job, job_err = jobs.get_job(build.job_id)
        if job_err then return job_err end
        if job and (job.status == "pending" or job.status == "running") then
            return errors.new({kind = errors.UNAVAILABLE, message = "image build cancellation awaits worker termination", retryable = true})
        end
    end
    local count, err = execute("DELETE FROM chestor_autocode_image_builds WHERE image_id = $1 AND build_id = $2", {image_id, build.build_id})
    if err then return err end
    if count ~= 1 then return errors.new({kind = errors.CONFLICT, message = "image build changes during teardown"}) end
    return nil
end

return repo

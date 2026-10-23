-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The default agent image recipe, the decoder of image run settings, and the
-- build request every image change goes through.
local web = require("web")
local repo = require("repo")
local resources = require("resources")
local drivers = require("drivers")
local deferred = require("deferred")
local security = require("security")
local uuid = require("uuid")

local BUILD_JOB = "chestor.autocode.runner:image"

type Settings = {memory: string, cpus: string, pids_limit: integer, gpus: string, network: string, extra_args: {string},
    allows: {string}}
type Decoded = {label: string, home: string, settings: Settings}

local M = {}

M.DEFAULT = {
    ref = "chestor-autocode-agent:latest",
    label = "Agent image (Claude Code, Codex, Antigravity, Muse)",
    home = "/opt/agent",
    -- Antigravity installs with its own checksum-verifying installer; Muse
    -- installs its launcher, which fetches the Muse binary for the account's
    -- login when a run first starts it.
    dockerfile = table.concat({
        "FROM node:22-bookworm-slim",
        "RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates curl ripgrep \\",
        "    && rm -rf /var/lib/apt/lists/*",
        "RUN npm install -g @anthropic-ai/claude-code @openai/codex && npm cache clean --force",
        "RUN curl -fsSL https://antigravity.google/cli/install.sh | bash -s -- --dir /usr/local/bin && rm -rf /root/.cache/antigravity",
        "RUN curl -fsSL https://api.meta.ai/muse-launcher.sh -o /usr/local/bin/muse && chmod 0755 /usr/local/bin/muse",
        "RUN mkdir -p /opt/agent/.claude /opt/agent/.codex /opt/agent/.gemini /opt/agent/.config/muse /opt/agent/work \\",
        "    && chown -R node:node /opt/agent",
        "USER node",
        "ENV HOME=/opt/agent",
        "WORKDIR /opt/agent/work",
        "",
    }, "\n"),
}

-- default_allows admits every capability the activated drivers declare: the
-- container is the sandbox until an administrator narrows it.
local function default_allows(): ({string}?, error?)
    local list, err = drivers.list()
    if not list then return nil, err end
    local seen: {[string]: boolean} = {}
    local result: {string} = {}
    for _, driver in ipairs(list) do
        for _, capability in ipairs(driver.capabilities) do
            if not seen[capability] then
                seen[capability] = true
                result[#result + 1] = capability
            end
        end
    end
    table.sort(result)
    return result, nil
end

local function refuse(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end

-- decode reads the label, home and container run settings of a request body.
function M.decode(body: {[string]: unknown}): (Decoded?, error?)
    local label = web.text(body.label or "", 200)
    local home = web.text(body.home or M.DEFAULT.home, 300)
    local memory = web.text(body.memory or "4g", 32)
    local cpus = web.text(body.cpus or "2", 16)
    local gpus = web.text(body.gpus or "", 200)
    local network = web.text(body.network or "bridge", 200)
    if not label or not home or not memory or not cpus or not gpus or not network then
        return nil, refuse("label, home, memory, cpus, gpus, and network must be short strings")
    end
    if home:sub(1, 1) ~= "/" then return nil, refuse("home must be an absolute path inside the image") end
    local pids = body.pids_limit or 1024
    if type(pids) ~= "number" or pids < 0 or pids ~= math.floor(pids) then return nil, refuse("pids_limit must be a non-negative integer") end
    local extra_args = web.strings(body.extra_args or {}, 64, 1024)
    if not extra_args then return nil, refuse("extra_args must be an array of strings") end
    local allows: {string}? = nil
    if body.allows == nil then
        local defaults, defaults_err = default_allows()
        if not defaults then return nil, defaults_err end
        allows = defaults
    else
        allows = web.strings(body.allows, 32, 64)
        for _, capability in ipairs(allows or {}) do
            if not capability:match("^[a-z][a-z-]*$") then allows = nil; break end
        end
        if not allows then return nil, refuse("allows must be an array of capability names") end
    end
    return {label = label, home = home, settings = {memory = memory, cpus = cpus, pids_limit = math.floor(pids), gpus = gpus,
        network = network, extra_args = extra_args, allows = allows}}, nil
end

-- request_build records a build of the image under the caller's identity
-- and enqueues its job; the image shows as preparing until the job settles
-- it. "initial" uses a local copy of a registry reference; "refresh" pulls it.
function M.request_build(image_id: string, mode: repo.BuildMode): error?
    local database_err = deferred.check()
    if database_err then return database_err end
    local row, capture_err = deferred.capture()
    if not row then return capture_err end
    local meta_err = resources.set_meta(image_id, {status = "preparing", last_error = ""})
    if meta_err then return meta_err end
    local actor = security.actor()
    local err = repo.request_image_build(image_id, row, mode, deferred.enqueue({scope = image_id, key = "build:" .. uuid.v7(),
        owner_id = actor and actor:id() or "", job_type = BUILD_JOB, max_attempts = 3, payload = {image_id = image_id}}))
    if err then return err end
    return deferred.nudge()
end

return M

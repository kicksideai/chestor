-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The default agent image recipe, the decoder of image run settings, and the
-- build request every image change goes through.
local values = require("values")
local logger = require("logger")
local repo = require("repo")
local drivers = require("drivers")
local deferred = require("deferred")
local security = require("security")
local uuid = require("uuid")

local BUILD_JOB = "chestor.autocode.runner:image"

type Settings = {memory: string, cpus: string, pids_limit: integer, gpus: string, network: string, extra_args: {string},
    allows: {string}}
type Decoded = {label: string, home: string, settings: Settings}

local M = {}

local PRESET = {
    ref = "chestor-autocode-agent:latest",
    label = "Curated preset: Claude Code, Codex, Antigravity, Muse",
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

local RUN_DEFAULTS = {memory = "4g", cpus = "2", pids_limit = 1024, gpus = "", network = "bridge", extra_args = {}}
function M.defaults(): ({[string]: unknown}?, error?)
    local allows, err = default_allows()
    if not allows then return nil, err end
    return {ref = PRESET.ref, label = PRESET.label, home = PRESET.home, dockerfile = PRESET.dockerfile,
        settings = {memory = RUN_DEFAULTS.memory, cpus = RUN_DEFAULTS.cpus, pids_limit = RUN_DEFAULTS.pids_limit,
            gpus = RUN_DEFAULTS.gpus, network = RUN_DEFAULTS.network, extra_args = RUN_DEFAULTS.extra_args, allows = allows}}, nil
end

local function refuse(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end

-- decode reads the label, home and container run settings of a request body.
function M.decode(body: {[string]: unknown}): (Decoded?, error?)
    local label = values.text(body.label or "", 200)
    local home = values.text(body.home or PRESET.home, 300)
    local memory = values.text(body.memory or RUN_DEFAULTS.memory, 32)
    local cpus = values.text(body.cpus or RUN_DEFAULTS.cpus, 16)
    local gpus = values.text(body.gpus or RUN_DEFAULTS.gpus, 200)
    local network = values.text(body.network or RUN_DEFAULTS.network, 200)
    if not label or not home or not memory or not cpus or not gpus or not network then
        return nil, refuse("label, home, memory, cpus, gpus, and network must be short strings")
    end
    if home:sub(1, 1) ~= "/" then return nil, refuse("home must be an absolute path inside the image") end
    local pids = body.pids_limit or RUN_DEFAULTS.pids_limit
    if type(pids) ~= "number" or pids < 0 or pids ~= math.floor(pids) then return nil, refuse("pids_limit must be a non-negative integer") end
    local extra_args = values.strings(body.extra_args or RUN_DEFAULTS.extra_args, 64, 1024)
    if not extra_args then return nil, refuse("extra_args must be an array of strings") end
    local allows: {string}? = nil
    if body.allows == nil then
        local defaults, defaults_err = default_allows()
        if not defaults then return nil, defaults_err end
        allows = defaults
    else
        allows = values.strings(body.allows, 32, 64)
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
    local actor = security.actor()
    local build_id = uuid.v7()
    local err = repo.request_image_build(image_id, row, mode, deferred.enqueue({scope = image_id, key = "build:" .. build_id,
        owner_id = actor and actor:id() or "", job_type = BUILD_JOB, max_attempts = 3, payload = {image_id = image_id, build_id = build_id}}), build_id)
    if err then return err end
    local wake_err = deferred.nudge()
    if wake_err then logger:warn("autocode committed image build awaits jobs reconciliation", {image_id = image_id, build_id = build_id, error = tostring(wake_err)}) end
    return nil
end

return M

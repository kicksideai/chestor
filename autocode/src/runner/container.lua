-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The script an autocode run's container executes: write the account
-- credential and the driver's files into a fresh HOME, enter the working
-- directory, clone the optional repository, and exec the driver's command
-- under the run's timeout. Each step is fatal on failure. Every value the
-- script needs arrives through the container environment, never through argv.
local drivers = require("drivers")
local credentials = require("credentials")
local quote = require("quote")

type Script = {env: {[string]: string}}

local KILL_GRACE_SECONDS = 30
local M = {}

-- timeout_seconds bounds the CLI: timeout stops it, then kills it 30 seconds
-- later, and the container exits with code 124.
function M.script(kind: credentials.Kind, secret: string, home: string, workdir: string, repo_url: string,
                  launch: drivers.Launch, timeout_seconds: integer): (Script?, error?)
    local env: {[string]: string} = {HOME = home}
    for name, value in pairs(launch.environment) do env[name] = value end
    local lines: {string} = {"exec 2>&1", "set -e", "umask 077"}

    local function write(variable: string, value: string, relative: string)
        local path = home .. "/" .. relative
        env[variable] = value
        lines[#lines + 1] = "mkdir -p \"$(dirname " .. quote.posix(path) .. ")\""
        lines[#lines + 1] = "printf %s \"$" .. variable .. "\" > " .. quote.posix(path)
        lines[#lines + 1] = "unset " .. variable
    end

    if kind.file then
        write("AUTOCODE_CREDENTIAL", secret, kind.file.path)
        for index, item in ipairs(kind.file.initialize) do write("AUTOCODE_INITIALIZE_" .. tostring(index), item.content, item.path) end
    elseif kind.variable then
        env[kind.variable] = secret
    end
    for index, file in ipairs(launch.files) do
        if file.secret_fields or file.composition then
            return nil, errors.new({kind = errors.INVALID,
                message = "driver file " .. file.path .. " needs secret injection or composition, which autocode runs do not apply"})
        end
        write("AUTOCODE_FILE_" .. tostring(index), file.content, file.path)
    end

    lines[#lines + 1] = "umask 022"
    lines[#lines + 1] = "mkdir -p " .. quote.posix(workdir)
    lines[#lines + 1] = "cd " .. quote.posix(workdir)
    if repo_url ~= "" then
        env.AUTOCODE_REPO = repo_url
        lines[#lines + 1] = 'git clone --quiet --depth 50 "$AUTOCODE_REPO" repo'
        lines[#lines + 1] = "cd repo"
    end

    local command: {string} = {"timeout", "-k", tostring(KILL_GRACE_SECONDS), tostring(timeout_seconds), launch.executable}
    for _, argument in ipairs(launch.argv) do command[#command + 1] = argument end
    lines[#lines + 1] = "exec " .. quote.line(command)

    env.AUTOCODE_SCRIPT = table.concat(lines, "\n")
    return {env = env}, nil
end

return M

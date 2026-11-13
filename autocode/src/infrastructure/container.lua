-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The script an autocode run's container executes: write the account
-- credential and the driver's files into a fresh HOME, enter the working
-- directory, clone the optional repository, and exec the driver's command
-- under the run's timeout. Each step is fatal on failure. Every value the
-- script needs arrives through the container environment, never through argv.
local json = require("json")
local drivers = require("drivers")
local credentials = require("credentials")
local quote = require("quote")

type Script = {env: {[string]: string}}

local KILL_GRACE_SECONDS = 30
local M = {CLONE_DEPTH = 50}
M.entrypoint = [=[
AUTOCODE_TRANSFER_ITEM=0
for AUTOCODE_TRANSFER_NAME in $AUTOCODE_TRANSFER_NAMES; do
    eval 'AUTOCODE_TRANSFER_COUNT=$AUTOCODE_PAYLOAD_'"$AUTOCODE_TRANSFER_ITEM"_COUNT
    AUTOCODE_TRANSFER_INDEX=0
    AUTOCODE_TRANSFER_ENCODED=
    while test "$AUTOCODE_TRANSFER_INDEX" -lt "$AUTOCODE_TRANSFER_COUNT"; do
        eval 'AUTOCODE_TRANSFER_PART=$AUTOCODE_PAYLOAD_'"$AUTOCODE_TRANSFER_ITEM"_"$AUTOCODE_TRANSFER_INDEX"
        AUTOCODE_TRANSFER_ENCODED=$AUTOCODE_TRANSFER_ENCODED$AUTOCODE_TRANSFER_PART
        unset "AUTOCODE_PAYLOAD_${AUTOCODE_TRANSFER_ITEM}_$AUTOCODE_TRANSFER_INDEX"
        AUTOCODE_TRANSFER_INDEX=$((AUTOCODE_TRANSFER_INDEX + 1))
    done
    AUTOCODE_TRANSFER_VALUE=$(printf '%b' "$AUTOCODE_TRANSFER_ENCODED"; printf .)
    export "$AUTOCODE_TRANSFER_NAME=${AUTOCODE_TRANSFER_VALUE%.}" || exit 1
    unset "AUTOCODE_PAYLOAD_${AUTOCODE_TRANSFER_ITEM}_COUNT"
    AUTOCODE_TRANSFER_ITEM=$((AUTOCODE_TRANSFER_ITEM + 1))
done
unset AUTOCODE_TRANSFER_ITEM AUTOCODE_TRANSFER_NAMES AUTOCODE_TRANSFER_NAME AUTOCODE_TRANSFER_VALUE AUTOCODE_TRANSFER_COUNT AUTOCODE_TRANSFER_INDEX AUTOCODE_TRANSFER_ENCODED AUTOCODE_TRANSFER_PART
eval "$AUTOCODE_SCRIPT"
]=]

type Limits = {memory: string?, cpus: string?, pids_limit: integer?, extra_args: {string}?}
function M.limits(value: Limits?): {string}
    local args: {string} = {}
    if not value then return args end
    if value.memory and value.memory ~= "" then args[#args + 1] = "--memory"; args[#args + 1] = value.memory end
    if value.cpus and value.cpus ~= "" then args[#args + 1] = "--cpus"; args[#args + 1] = value.cpus end
    if value.pids_limit and value.pids_limit ~= 0 then args[#args + 1] = "--pids-limit"; args[#args + 1] = tostring(value.pids_limit) end
    return args
end

-- timeout_seconds bounds the CLI: timeout stops it, then kills it 30 seconds
-- later, and the container exits with code 124.
function M.script(kind: credentials.Kind, secret: string, home: string, workdir: string, repo_url: string,
                  launch: drivers.Launch, timeout_seconds: integer, repo_ref: string?): (Script?, error?)
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
        if file.composition then
            return nil, errors.new({kind = errors.INVALID,
                message = "driver file " .. file.path .. " needs secret injection or composition, which autocode runs do not apply"})
        end
        write("AUTOCODE_FILE_" .. tostring(index), file.content, file.path)
        if file.secret_fields then
            local variable = "AUTOCODE_SECRET_FIELDS_" .. tostring(index)
            local fields, fields_err = json.encode(file.secret_fields)
            if not fields then return nil, fields_err end
            env[variable] = fields
            -- Only the container reads the named secret environment variable.
            -- This code and the delivered configuration contain no token bytes.
            local inject = [=[const fs = require('fs'); const p = process.argv[1]; const fields = JSON.parse(process.env[process.argv[2]]); const data = JSON.parse(fs.readFileSync(p, 'utf8')); for (const f of fields) { const token = process.env[f.environment]; if (!token) throw new Error('missing gateway credential'); let obj = data; for (const key of f.path.slice(0, -1)) { if (!Object.hasOwn(obj, key) || typeof obj[key] !== 'object') throw new Error('invalid gateway configuration path'); obj = obj[key]; } obj[f.path.at(-1)] = f.prefix + token; } fs.writeFileSync(p, JSON.stringify(data), {mode: 0o600});]=]
            lines[#lines + 1] = quote.line({"node", "-e", inject, home .. "/" .. file.path, variable})
            lines[#lines + 1] = "unset " .. variable
        end
    end

    lines[#lines + 1] = "umask 022"
    lines[#lines + 1] = "mkdir -p " .. quote.posix(workdir)
    lines[#lines + 1] = "cd " .. quote.posix(workdir)
    if repo_url ~= "" then
        env.AUTOCODE_REPO = repo_url
        local branch = ""
        if repo_ref and repo_ref ~= "" then
            env.AUTOCODE_REPO_REF = repo_ref
            branch = ' --branch "$AUTOCODE_REPO_REF"'
        end
        lines[#lines + 1] = 'git clone --quiet --depth ' .. tostring(M.CLONE_DEPTH) .. branch .. ' -- "$AUTOCODE_REPO" repo'
        lines[#lines + 1] = "cd repo"
    end

    local command: {string} = {"timeout", "-k", tostring(KILL_GRACE_SECONDS), tostring(timeout_seconds), launch.executable}
    for _, argument in ipairs(launch.argv) do command[#command + 1] = argument end
    lines[#lines + 1] = "exec " .. quote.line(command)

    env.AUTOCODE_SCRIPT = table.concat(lines, "\n")
    return {env = env}, nil
end

return M

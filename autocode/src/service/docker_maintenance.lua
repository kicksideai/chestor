-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local docker = require("docker")
local repo = require("repo")
type Result = {output: string}

local function prune(retention: string): (Result?, error?)
    local steps = {
        {"image", "prune", "--force"},
        {"builder", "prune", "--force", "--filter", "until=" .. retention},
    }
    local output: {string} = {}
    local candidates: {{id: string, run_id: string}} = {}
    local code, list_err = docker.run({"ps", "-a", "--filter", "label=chestor.autocode.run",
        "--filter", "status=created", "--filter", "status=exited", "--filter", "status=dead",
        "--format", '{{.ID}} {{.Label "chestor.autocode.run"}}'}, {on_line = function(line: string)
            local id, run_id = line:match("^(%S+) (%S+)$")
            if id and run_id then candidates[#candidates + 1] = {id = id, run_id = run_id} end
        end})
    if list_err then return nil, list_err end
    if code ~= 0 then return nil, errors.new({kind = errors.UNAVAILABLE, message = "Docker container listing failed"}) end
    for _, candidate in ipairs(candidates) do
        local run, read_err = repo.stored_run(candidate.run_id)
        if read_err then return nil, read_err end
        if not run or run.status == "succeeded" or run.status == "failed" or run.status == "cancelled" then
            local remove_err = docker.remove(candidate.id)
            if remove_err then return nil, remove_err end
            output[#output + 1] = "$ docker rm -f " .. candidate.id
        end
    end
    local probes: {{id: string, image_id: string, build_id: string}} = {}
    local probe_code, probe_err = docker.run({"ps", "-a", "--filter", "label=chestor.autocode.probe",
        "--format", '{{.ID}} {{.Label "chestor.autocode.image"}} {{.Label "chestor.autocode.probe"}}'},
        {on_line = function(line: string)
            local id, image_id, build_id = line:match("^(%S+) (%S+) (%S+)$")
            if id and image_id and build_id then probes[#probes + 1] = {id = id, image_id = image_id, build_id = build_id} end
        end})
    if probe_err then return nil, probe_err end
    if probe_code ~= 0 then return nil, errors.new({kind = errors.UNAVAILABLE, message = "Docker probe listing failed"}) end
    for _, probe in ipairs(probes) do
        local build, read_err = repo.image_build(probe.image_id)
        if read_err then return nil, read_err end
        if not build or build.build_id ~= probe.build_id or build.finished_at ~= "" or build.job_live == false then
            local remove_err = docker.remove(probe.id)
            if remove_err then return nil, remove_err end
            output[#output + 1] = "$ docker rm -f " .. probe.id
        end
    end
    for _, args in ipairs(steps) do
        output[#output + 1] = "$ docker " .. table.concat(args, " ")
        local code, err = docker.run(args, {on_line = function(line: string) output[#output + 1] = line end})
        if err then return nil, err end
        if code ~= 0 then
            return nil, errors.new({kind = errors.INTERNAL, message = "Docker cleanup failed", retryable = false, details = {code = "autocode.cleanup_failed", output = table.concat(output, "\n")}})
        end
    end
    return {output = table.concat(output, "\n")}, nil
end

return {prune = prune}

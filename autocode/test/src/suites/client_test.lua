-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local exec = require("exec")
local quote = require("quote")
local stubs = require("stubs")
local uuid = require("uuid")
local docker = require("docker")
local json = require("json")
local function shell(script)
    local executor = exec.get("app:docker")
    local proc, err = executor:exec(quote.line({"/bin/sh", "-ec", script}), {})
    if not proc then error(tostring(err)) end
    local stream = proc:stdout_stream()
    assert(proc:start()); proc:close_stdin()
    local text = ""
    while true do local chunk = stream:read(4096); if not chunk then break end; text = text .. chunk end
    local code = proc:wait()
    stream:close(); proc:close(); executor:release()
    test.eq(code, 0, text)
    return (text:gsub("\n$", ""))
end
local function cases()
    test.describe("autocode shared Docker client", function()
        local root = shell("pwd") .. "/.wippy/client-workspace"
        local image_ref = "chestor-autocode-client-test:" .. uuid.v7()
        test.before_all(function()
            shell("mkdir -p " .. quote.posix(root))
            local code, err = docker.run({"build", "-t", image_ref, "-"}, {stdin = "FROM debian:bookworm-slim\n"})
            test.is_nil(err); test.eq(code, 0)
        end)
        test.before_each(function() stubs.reset() end)
        test.after_all(function()
            test.eq(docker.run({"image", "rm", image_ref}), 0)
            shell("rm -rf -- " .. quote.posix(root))
        end)
        test.it("reports missing directories and symlink traversal at the workspace boundary", function()
            stubs.state.executor, stubs.state.roots = "app:docker", root
            shell("ln -s / " .. quote.posix(root .. "/escape"))
            local paths = require("paths")
            for _, path in ipairs({root .. "/missing", root .. "/escape"}) do
                local value, err = paths.verify({path = path})
                test.is_nil(value); test.is_true(errors.is(err, errors.INVALID))
                test.eq(err:details().code, "autocode.invalid_workspace")
            end
            test.is_true(paths.verify({path = root}))
        end)
        test.it("runs shared scratch and image operations with an unwritable HOME", function()
            local native = require("native_docker")
            local home = shell("pwd") .. "/.wippy/readonly-home"
            local client_config = shell("pwd") .. "/.wippy/readonly-client-config"
            local built = "chestor-autocode-readonly-test:" .. uuid.v7()
            shell("mkdir -m 500 " .. quote.posix(home) .. " && mkdir -m 700 " .. quote.posix(client_config))
            stubs.state.executor = "app:docker_readonly_home"
            local ok, failure = pcall(function()
                local output = {}
                local code, err = native.run({"build", "-t", built, "-"}, {stdin = "FROM " .. image_ref .. "\n", on_line = function(line) output[#output + 1] = line end})
                test.is_nil(err); test.eq(code, 0, table.concat(output, "\n"))
                for _, shared in ipairs({false, true}) do
                    local prepared = stubs.preparation(stubs.state.run)
                    prepared.image.ref, prepared.workdir = built, "/workspace"
                    if shared then prepared.workspace = {id = "workspace", host_path = root, writable = true} end
                    local payload = "multi\nline\n" .. string.rep("x", 20000) .. "\n"
                    local env = {TOKEN = payload, HOME = "/opt/agent", DOCKER_CONFIG = "/container-only", AUTOCODE_SCRIPT = 'test "${#TOKEN}" = 20012 && test "$DOCKER_CONFIG" = /container-only && printf transport-survived'}
                    local box = require("io").build(uuid.v7(), prepared, env)
                    box.create[1] = "run"; table.insert(box.create, 2, "--rm")
                    local lines = {}
                    code, err = native.run(box.create, {env = box.env, on_line = function(line) lines[#lines + 1] = line end})
                    test.is_nil(err); test.eq(code, 0, table.concat(lines, "\n"))
                    test.eq(table.concat(lines, ""), "transport-survived")
                end
                local code, err = native.run({"image", "inspect", built})
                test.is_nil(err); test.eq(code, 0)
                shell("test -z \"$(find " .. quote.posix(home) .. " -mindepth 1 -print)\"")
            end)
            local code, err = native.run({"image", "rm", built})
            shell("chmod 700 " .. quote.posix(home) .. " && rmdir " .. quote.posix(home) .. " && rm -rf -- " .. quote.posix(client_config))
            test.is_true(ok, tostring(failure)); test.is_nil(err); test.eq(code, 0)
        end)
        for _, endpoint in ipairs({"default", "explicit"}) do
            test.it("uses the host " .. endpoint .. " Unix endpoint through the real Docker CLI", function()
                stubs.state.executor = "app:docker_" .. endpoint .. "_endpoint"
                local lines = {}
                local code, err = require("native_docker").run({"image", "inspect", "--format", "{{.Id}}", image_ref},
                    {on_line = function(line) lines[#lines + 1] = line end})
                test.is_nil(err); test.eq(code, 0, table.concat(lines, "\n"))
                test.not_nil(table.concat(lines, ""):match("^sha256:[a-f0-9]+$"))
            end)
        end
        test.it("keeps a planted image HOME Docker configuration out of the host client", function()
            local planted = root .. "/client-home"
            shell("mkdir -p " .. quote.posix(planted .. "/.docker"))
            shell("printf %s " .. quote.posix('{"currentContext":"attacker-context"}') .. " > " .. quote.posix(planted .. "/.docker/config.json"))
            local lines = {}
            local code, err = docker.run({"context", "show"}, {env = {HOME = planted}, on_line = function(line) lines[#lines + 1] = line end})
            test.is_nil(err); test.eq(code, 0)
            test.eq(table.concat(lines, ""), "default")
        end)
        test.it("inherits an existing host context authentication and CLI plugin with an image HOME planted", function()
            local key = "autocode-" .. uuid.v7()
            local home = shell("pwd") .. "/.wippy/executor-home"
            local configuration = home .. "/.docker/config.json"
            local saved = shell("if test -f " .. quote.posix(configuration) .. "; then cat " .. quote.posix(configuration) .. "; else printf '{}'; fi")
            local plugin = home .. "/.docker/cli-plugins/docker-autocodeconfigtest"
            local endpoint = shell("docker context inspect default --format '{{.Endpoints.docker.Host}}'")
            shell("mkdir -p " .. quote.posix(home .. "/.docker/cli-plugins") .. " && docker context create " .. quote.posix(key) .. " --docker " .. quote.posix("host=" .. endpoint) .. " >/dev/null && docker context use " .. quote.posix(key) .. " >/dev/null")
            local program = "#!/bin/sh\nif test \"$1\" = docker-cli-plugin-metadata; then printf '%s' '{\"SchemaVersion\":\"0.1.0\",\"Vendor\":\"Autocode tests\",\"Version\":\"1\",\"ShortDescription\":\"Host configuration probe\"}'; exit; fi\n" ..
                "exec python3 -c 'import os,json; p=os.environ.get(\"DOCKER_CONFIG\",os.path.join(os.environ[\"HOME\"],\".docker\")); d=json.load(open(p+\"/config.json\")); assert d[\"auths\"][\"registry.example\"][\"auth\"]==\"eDp5\"; print(\"host-auth-preserved\")'\n"
            shell("printf %s " .. quote.posix(program) .. " > " .. quote.posix(plugin) .. " && chmod 700 " .. quote.posix(plugin))
            shell("python3 -c " .. quote.posix("import json,sys; p=sys.argv[1]; d=json.load(open(p)); d['auths']={'registry.example':{'auth':'eDp5'}}; json.dump(d,open(p,'w'))") .. " " .. quote.posix(configuration))
            local ok, problem = pcall(function()
                local lines = {}
                local code, err = docker.run({"context", "show"}, {env = {HOME = root, DOCKER_CONFIG = root, DOCKER_CONTEXT = "attacker"}, on_line = function(line) lines[#lines + 1] = line end})
                test.is_nil(err); test.eq(code, 0); test.eq(table.concat(lines, ""), key)
                lines = {}
                code, err = docker.run({"autocodeconfigtest"}, {env = {HOME = root, DOCKER_CONFIG = root}, on_line = function(line) lines[#lines + 1] = line end})
                test.is_nil(err); test.eq(code, 0, table.concat(lines, "\n")); test.eq(table.concat(lines, ""), "host-auth-preserved")
            end)
            shell("docker context use default >/dev/null && docker context rm " .. quote.posix(key) .. " >/dev/null && rm " .. quote.posix(plugin) .. " && printf %s " .. quote.posix(saved) .. " > " .. quote.posix(configuration))
            test.is_true(ok, tostring(problem))
        end)
        test.it("delivers multiline container values without selecting host Docker configuration", function()
            local state = stubs.state
            local prepared = stubs.preparation(state.run)
            prepared.image.ref = image_ref
            prepared.workdir = "/workspace"
            prepared.workspace = {id = "transport", host_path = root, writable = true}
            local value = "line one\n'$(false)'\n\n"
            local env = {NAMES = "literal-names", PAIR = "first", PAIR_0 = "second", HOME = root .. "/client-home", PATH = "/container-only-path", DOCKER_CONFIG = "/container-config", DOCKER_CONTEXT = "attacker-context", DOCKER_HOST = "unix:///absent-attacker.sock", VALUE = value, EXTRA = string.rep("\'", 65536),
                AUTOCODE_SCRIPT = 'test "$PATH" = /container-only-path && test "$NAMES" = literal-names && test "$PAIR" = first && test "$PAIR_0" = second && test "$HOME" = ' .. quote.posix(root .. "/client-home") .. ' && test "$DOCKER_CONFIG" = /container-config && test "$DOCKER_CONTEXT" = attacker-context && test "$DOCKER_HOST" = unix:///absent-attacker.sock && test "$VALUE" = ' .. quote.posix(value) .. ' && test "${#EXTRA}" -eq 65536 && echo container-values-preserved'}
            local box = require("io").build(uuid.v7(), prepared, env)
            box.create[1] = "run"; table.insert(box.create, 2, "--rm")
            local lines = {}
            local code, err = docker.run(box.create, {env = box.env, on_line = function(line) lines[#lines + 1] = line end})
            test.is_nil(err); test.eq(code, 0, table.concat(lines, "\n"))
            test.eq(table.concat(lines, ""), "container-values-preserved")
        end)
        test.it("rejects Docker-normalized host networks before a created container can start", function()
            for _, mode in ipairs({"NAME=HOST", "name=HOST", "name=host "}) do
                local prepared = stubs.preparation(stubs.state.run)
                prepared.image.ref, prepared.image.network = image_ref, ""
                prepared.image.extra_args = {"--network", mode}
                local box = require("io").build(uuid.v7(), prepared, {})
                local code, err = docker.run(box.create, {isolation = box.isolation})
                local lines = {}
                docker.run({"ps", "-aq", "--filter", "name=^" .. box.name .. "$"},
                    {on_line = function(line) lines[#lines + 1] = line end})
                docker.remove(box.name)
                test.not_nil(err, mode .. ": " .. table.concat(lines, " "))
                test.is_nil(code)
                test.not_nil(tostring(err):find("NetworkMode", 1, true), tostring(err))
                test.eq(table.concat(lines, ""), "", "refused container must be removed")
            end
        end)
        test.it("verifies Docker-parsed isolation spellings and accepts harmless values", function()
            local target = "autocode-target-" .. uuid.v7()
            local custom_network = "autocode-net-" .. uuid.v7()
            test.eq(docker.run({"create", "--name", target, "--network", "none", image_ref, "true"}), 0)
            test.eq(docker.run({"network", "create", custom_network}), 0)
            local ok, failure = pcall(function()
                for _, case in ipairs({
                    {args = {"--network", "NAME=CONTAINER:" .. target}, field = "NetworkMode"},
                    {args = {"--network", "name=container:" .. target .. " "}, field = "NetworkMode"},
                    {args = {"--network=container:" .. target}, field = "NetworkMode"},
                    {args = {"--network", custom_network}, field = "NetworkMode"},
                    {args = {"-v", root .. ":/extra"}, field = "Binds"},
                    {args = {"-v=" .. root .. ":/extra"}, field = "Binds"},
                    {args = {"-v" .. root .. ":/extra"}, field = "Binds"},
                    {args = {"-itv" .. root .. ":/extra"}, field = "Binds"},
                    {args = {"--volume=" .. root .. ":/extra:ro"}, field = "Binds"},
                    {args = {"--mount", "type=bind,source=" .. root .. ",target=/extra"}, field = "Mounts"},
                    {args = {"--security-opt=systempaths=unconfined"}, field = "MaskedPaths"},
                    {args = {"--security-opt", "systempaths=unconfined"}, field = "MaskedPaths"},
                    {args = {"--security-opt=systempaths:unconfined"}, native = true},
                    {args = {"--privileged=true"}, field = "Privileged"},
                    {args = {"--oom-score-adj=-1000"}, field = "OomScoreAdj"},
                    {args = {"--restart=always"}, field = "RestartPolicy"},
                    {args = {"--cap-add=SYS_ADMIN"}, field = "CapAdd"},
                    {args = {"--device=/dev/null"}, field = "Devices"},
                    {args = {"--device-cgroup-rule=a *:* rwm"}, field = "DeviceCgroupRules"},
                    {args = {"--pid=host"}, field = "PidMode"},
                    {args = {"--ipc=host"}, field = "IpcMode"},
                    {args = {"--uts=host"}, field = "UTSMode"},
                    {args = {"--userns=host"}, field = "UsernsMode"},
                    {args = {"--cgroupns=host"}, field = "CgroupnsMode"},
                    {args = {"--security-opt=seccomp=unconfined"}, field = "SecurityOpt"},
                    {args = {"--security-opt=no-new-privileges=false"}, field = "SecurityOpt"},
                    {args = {"--cgroup-parent=autocode.slice"}, field = "CgroupParent"},
                    {args = {"--sysctl=net.ipv4.ip_forward=1"}, field = "Sysctls"},
                    {args = {"--volumes-from=" .. target}, field = "VolumesFrom"},
                    {args = {"--privileged=false"}}, {args = {"--cap-drop=ALL"}},
                    {args = {"--label", "--env-file=/definitely-absent/autocode.env"}},
                    {args = {"--label", "--label-file=/definitely-absent/labels"}},
                    {args = {"--label", "--privileged=true"}}, {args = {"-il--env-file=/absent"}},
                    {args = {"--security-opt=no-new-privileges"}},
                    {args = {"--security-opt=no-new-privileges=true"}},
                    {args = {"--tmpfs=/cache:rw,size=16m"}},
                }) do
                    local prepared = stubs.preparation(stubs.state.run)
                    prepared.image.ref, prepared.image.network = image_ref, ""
                    prepared.image.extra_args = case.args
                    local box = require("io").build(uuid.v7(), prepared, {AUTOCODE_SCRIPT = "printf accepted"})
                    local lines = {}
                    local code, err = docker.run(box.create, {env = box.env, isolation = box.isolation,
                        on_line = function(line) lines[#lines + 1] = line end})
                    local checked, problem = pcall(function()
                        if case.field or case.native then
                            if case.native then test.is_true(err ~= nil or code ~= 0, table.concat(case.args, " "))
                            else
                                test.is_nil(code, table.concat(case.args, " ") .. ": " .. table.concat(lines, " "))
                                test.not_nil(err, table.concat(case.args, " "))
                                test.not_nil(tostring(err):find("isolation mismatch: " .. case.field, 1, true), tostring(err))
                            end
                            local remaining = {}
                            test.eq(docker.run({"ps", "-aq", "--filter", "name=^" .. box.name .. "$"},
                                {on_line = function(line) remaining[#remaining + 1] = line end}), 0)
                            test.eq(#remaining, 0, "mismatched container must be removed before returning")
                        else
                            test.is_nil(err, tostring(err)); test.eq(code, 0, table.concat(lines, " "))
                            if not table.concat(case.args, " "):find("-il", 1, true) then
                                lines = {}
                                test.eq(docker.run({"start", "-a", box.name}, {on_line = function(line) lines[#lines + 1] = line end}), 0)
                                test.eq(table.concat(lines, ""), "accepted")
                            end
                        end
                    end)
                    docker.ensure_removed(box.name)
                    test.is_true(checked, tostring(problem))
                end
            end)
            docker.remove(target)
            docker.run({"network", "rm", custom_network})
            test.is_true(ok, tostring(failure))
        end)
        test.it("accepts the approved network by name and by ID through Docker", function()
            local name = "autocode-approved-" .. uuid.v7()
            local lines = {}
            test.eq(docker.run({"network", "create", name}, {on_line = function(line) lines[#lines + 1] = line end}), 0)
            local id = table.concat(lines, "")
            local ok, failure = pcall(function()
                for _, reference in ipairs({name, id}) do
                    local prepared = stubs.preparation(stubs.state.run)
                    prepared.image.ref, prepared.image.network = image_ref, reference
                    local box = require("io").build(uuid.v7(), prepared, {AUTOCODE_SCRIPT = "echo approved"})
                    local checked, problem = pcall(function()
                        local code, err = docker.run(box.create, {isolation = box.isolation, env = box.env})
                        test.is_nil(err, tostring(err)); test.eq(code, 0)
                        local output = {}
                        test.eq(docker.run({"start", "-a", box.name}, {on_line = function(line) output[#output + 1] = line end}), 0)
                        test.eq(table.concat(output, ""), "approved")
                    end)
                    docker.ensure_removed(box.name)
                    test.is_true(checked, tostring(problem))
                end
            end)
            test.eq(docker.run({"network", "rm", name}), 0)
            test.is_true(ok, tostring(failure))
        end)
        test.it("uses effective approved resource controls through the real Docker CLI", function()
            local prepared = stubs.preparation(stubs.state.run)
            prepared.image.ref = image_ref
            prepared.image.memory, prepared.image.cpus, prepared.image.pids_limit = "4g", "2", 1024
            prepared.image.extra_args = {"--memory", "128m", "-m=64m", "--cpus=0.25", "--pids-limit=16", "--memory-swap=-1", "-c256", "--ulimit", "nofile=512:1024", "--oom-kill-disable=false"}
            local box = require("io").build(uuid.v7(), prepared, {})
            local ok, failure = pcall(function()
                test.eq(docker.run(box.create, {isolation = box.isolation}), 0)
                local lines = {}
                test.eq(docker.run({"inspect", "--format", "{{json .HostConfig}}", box.name}, {on_line = function(line) lines[#lines + 1] = line end}), 0)
                local config = json.decode(table.concat(lines, ""))
                test.eq(config.Memory, 67108864); test.eq(config.NanoCpus, 250000000); test.eq(config.PidsLimit, 16)
                test.eq(config.MemorySwap, -1); test.eq(config.CpuShares, 256)
                test.is_false(config.OomKillDisable)
                test.eq(config.Ulimits[1].Name, "nofile"); test.eq(config.Ulimits[1].Soft, 512); test.eq(config.Ulimits[1].Hard, 1024)
            end)
            test.eq(docker.run({"rm", "-f", box.name}), 0)
            test.is_true(ok, tostring(failure))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

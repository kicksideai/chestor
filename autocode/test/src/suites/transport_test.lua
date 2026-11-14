-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local transport = require("transport")
local function cases()
    test.describe("autocode transported preparation", function()
        test.it("keeps gateway secret injection in the container's named environment", function()
            local launch = {executable = "agent", argv = {}, environment = {}, readiness = "none", files = {{path = "mcp.json", content = '{"headers":{}}', secret_fields = {{path = {"headers", "Authorization"}, environment = "AUTOCODE_GATEWAY_TOKEN", prefix = "Bearer "}}}}}
            local script, err = require("container").script({id = "env:KEY", variable = "KEY"}, "account", "/opt/agent", "/work", "", launch, 60)
            test.is_nil(err, tostring(err))
            test.not_nil(script.env.AUTOCODE_SECRET_FIELDS_1)
            test.not_nil(script.env.AUTOCODE_SCRIPT:find("node -e", 1, true))
            test.is_nil(script.env.AUTOCODE_GATEWAY_TOKEN)
        end)
        test.it("clones the named branch through a quoted environment variable and named depth", function()
            local container = require("container")
            local launch = {executable = "agent", argv = {}, environment = {}, files = {}, readiness = "none"}
            local script, err = container.script({id = "env:KEY", variable = "KEY"}, "key", "/opt/agent", "/work", "https://example.com/repo", launch, 60, "release/v1")
            test.is_nil(err)
            test.eq(container.CLONE_DEPTH, 50)
            test.eq(script.env.AUTOCODE_REPO_REF, "release/v1")
            test.not_nil(script.env.AUTOCODE_SCRIPT:find('--branch "$AUTOCODE_REPO_REF"', 1, true))
        end)
        test.it("accepts execution fields and rejects mismatched identities and malformed launches", function()
            local run = {agent = "claude", account_id = "account", image_id = "image"}
            local value = require("stubs").preparation(run)
            local prepared, err = transport.prepared(value, run)
            test.is_nil(err)
            test.eq(prepared.agent, "claude")
            test.eq(prepared.kind.variable, "ANTHROPIC_API_KEY")
            test.is_nil(prepared.spec)
            value.account_id = "other"
            test.is_nil(transport.prepared(value, run))
            value.account_id = "account"
            value.launch.readiness = nil
            test.is_nil(transport.prepared(value, run))
        end)
        test.it("accepts Docker log rotation in separate and inline forms", function()
            for _, args in ipairs({{"--log-opt", "max-size=10m"}, {"--log-opt=max-file=3"}}) do
                local value = require("stubs").recipe_fixture()
                value.settings.extra_args = args
                local decoded, err = transport.recipe(value)
                test.is_nil(err, table.concat(args, " ") .. ": " .. tostring(err))
                test.not_nil(decoded)
            end
        end)
        test.it("preserves the remaining documented safe Docker networking and logging options", function()
            for _, option in ipairs({{"--log-driver", "json-file"}, {"--ip", "172.30.0.2"}, {"--ip6", "2001:db8::2"},
                {"--link-local-ip", "169.254.1.2"}, {"--mac-address", "92:d0:c6:0a:29:33"}, {"--network-alias", "worker"}}) do
                for _, args in ipairs({option, {option[1] .. "=" .. option[2]}}) do
                    local value = require("stubs").recipe_fixture()
                    value.settings.extra_args = args
                    test.not_nil(transport.recipe(value), table.concat(args, " "))
                end
            end
        end)
        test.it("passes Docker boolean shorthand clusters and options outside the former allowlist", function()
            for _, args in ipairs({{"-t=false"}, {"-i=true"}, {"-q=true"}, {"-it"}, {"-ti=false"},
                {"-itqm=64m"}, {"-eVALUE=volume"}, {"--name", "worker"}, {"--restart=no"}, {"--rm=false"},
                {"--future-docker-option=enabled"}, {"--user"}, {"--network=none"}, {"--ipc=private"},
                {"--pid=private"}, {"--cgroupns=private"}, {"--tmpfs=/cache:rw,size=16m"}}) do
                local value = require("stubs").recipe_fixture()
                value.settings.extra_args = args
                test.not_nil(transport.recipe(value), table.concat(args, " "))
            end
        end)
        test.it("preserves flag-looking Docker values without interpreting them as options or limits", function()
            local value = require("stubs").recipe_fixture()
            value.settings.extra_args = {"--label", "--volume", "--env", "-m64m", "--hostname", "-worker"}
            test.not_nil(transport.recipe(value))
            test.eq(#require("container").limits(value.settings), 0)
        end)
        test.it("keeps safe historical Docker options executable without recipe conversion", function()
            local settings = {memory = "4g", cpus = "2", pids_limit = 1024, gpus = "", network = "none", extra_args = {}, allows = {}}
            local value = {ref = "image", home = "/home/agent", dockerfile = "", revision = 7, settings = settings}
            for _, args in ipairs({{"--env-file", "./legacy.env"}, {"--label-file", "labels"}, {"--expose", "3000"}, {"--group-add", "1000"}, {"--quiet"}, {"--disable-content-trust"}, {"--entrypoint="}, {"--label=-team=dev"}, {"--label", "com.example.team=dev"}, {"--env", "DEBUG=1"}, {"-eDEBUG=1"}, {"--workdir", "/workspace"}, {"--hostname", "worker"}, {"--memory-swap", "-1"}, {"--cpus=0.5"}, {"--user", "1000:1000"}, {"--user=1000:1000"}, {"-u", "1000"}, {"-u1000:1000"}, {"--read-only"},
                {"--add-host", "local:127.0.0.1"}, {"--tmpfs", "/cache:rw,size=64m"}, {"--cap-drop=ALL"},
                {"--security-opt", "no-new-privileges"}, {"--ulimit", "nofile=1024:4096"},
                {"--init", "--read-only", "--user", "1000:1000"}}) do
                settings.extra_args = args
                test.not_nil(transport.recipe(value), table.concat(args, " "))
            end
        end)
        test.it("leaves Docker grammar and isolation decisions to creation and inspection", function()
            for _, args in ipairs({{"--network", "NAME=HOST"}, {"--network", "name=host "},
                {"--network", "NAME=CONTAINER:other"}, {"-itv/:/host"}, {"--privileged=true"},
                {"--device", "/dev/null"}, {"--cap-add=SYS_ADMIN"}, {"--security-opt=seccomp=unconfined"},
                {"--label", "--env-file=/absent/file"}, {"--label", "--label-file=/absent/file"},
                {"--read-only", "other-image"}, {"--"}, {"--future-option", "--volume"}}) do
                local value = require("stubs").recipe_fixture()
                value.settings.extra_args = args
                test.not_nil(transport.recipe(value), table.concat(args, " "))
            end
            local value = require("stubs").recipe_fixture()
            value.settings.extra_args = {"--label=bad\0value"}
            test.is_nil(transport.recipe(value))
        end)
        test.it("rejects malformed recipe settings instead of supplying zero defaults", function()
            local settings = {memory = "4g", cpus = "2", pids_limit = 1024, gpus = "", network = "none", extra_args = {}, allows = {}}
            local recipe = {ref = "image", home = "/home/agent", dockerfile = "", revision = 7, settings = settings}
            test.not_nil(transport.recipe(recipe))
            for _, invalid in ipairs({"1024", -1, 0.5, false}) do
                settings.pids_limit = invalid
                local value, err = transport.recipe(recipe)
                test.is_nil(value)
                test.is_true(errors.is(err, errors.INTERNAL))
            end
            settings.pids_limit = 1024
            settings.allows = {"network", 12}
            test.is_nil(transport.recipe(recipe))
            settings.allows = {}
            settings.extra_args = {unexpected = "--privileged"}
            test.is_nil(transport.recipe(recipe))
            settings.extra_args = {}
            settings.memory = nil
            test.is_nil(transport.recipe(recipe))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

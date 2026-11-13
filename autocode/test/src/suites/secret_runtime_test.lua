-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local docker = require("docker")
local repo = require("repo")
local uuid = require("uuid")
local time = require("time")
local json = require("json")
local sql = require("sql")
local funcs = require("funcs")

local SECRET = "autocode-runtime-credential-sentinel"
local REFRESHED = "autocode-runtime-refreshed-sentinel"
return {run = test.run_cases(function()
    test.describe("member credential runtime", function()
        local users, images, containers, components = {}, {}, {}, {}
        test.after_each(function()
            for _, name in ipairs(containers) do test.is_nil(docker.ensure_removed(name)) end
            containers = {}
            for _, item in ipairs(components) do
                local removed = identity.request(item.owner, "DELETE", "/autocode/images/" .. item.id .. "?remove=1")
                test.eq(removed.status, 200, removed.body)
            end
            components = {}
            for _, ref in ipairs(images) do
                local code, err = docker.run({"image", "rm", "--force", ref})
                test.is_nil(err); test.eq(code, 0)
            end
            images = {}
            for _, user in ipairs(users) do identity.release(user) end
            users = {}
        end)
        test.it("runs as a member, refuses direct secrets, and keeps Docker surfaces credential-free", function()
            local admin, member = identity.admin(), identity.member()
            users = {admin, member}
            local ref = "autocode-secret-test:" .. uuid.v7()
            images[#images + 1] = ref
            local lines = {}
            local code, build_err = docker.run({"build", "-t", ref, "-"}, {stdin = [[
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
RUN printf '%s\n' '#!/bin/sh' 'if [ "$1" = "--version" ]; then echo "Claude Code 1.0"; exit 0; fi' 'while [ ! -e /dev/shm/credential-audit-release ]; do sleep 0.1; done' 'if [ -n "$ANTHROPIC_API_KEY" ]; then test "$ANTHROPIC_API_KEY" = autocode-runtime-credential-sentinel || exit 4; else grep -q autocode-runtime-credential-sentinel "$HOME/.claude/.credentials.json" || exit 5; printf "{\"token\":\"autocode-runtime-refreshed-sentinel\"}" > "$HOME/.claude/.credentials.json"; fi' 'printf '\''%s\n'\'' '\''{"type":"result","subtype":"success","is_error":false,"result":"credential accepted","usage":{"input_tokens":1,"output_tokens":1}}'\''' > /usr/local/bin/claude && chmod +x /usr/local/bin/claude
]], on_line = function(line) lines[#lines + 1] = line end})
            test.is_nil(build_err); test.eq(code, 0, table.concat(lines, "\n"))
            local created = identity.request(admin, "POST", "/autocode/images", {ref = ref, home = "/opt/agent", network = "none"})
            test.eq(created.status, 201, created.body)
            local image_id = created.json.id
            components[#components + 1] = {owner = admin, id = image_id}
            local deadline = time.now():add("180s")
            while true do
                local build = repo.image_build(image_id)
                if build and build.finished_at ~= "" and build.projected then
                    test.eq(build.status, "ready", build.log); break
                end
                test.is_false(time.now():after(deadline), "image preparation does not finish")
                time.sleep("100ms")
            end
            local shared = identity.request(admin, "POST", "/component-access/share/" .. image_id,
                {subject_id = member.id, subject_type = "user", access_mask = 1})
            test.eq(shared.status, 200, shared.body)
            for _, kind in ipairs({"env:ANTHROPIC_API_KEY", "file:.claude/.credentials.json"}) do
                local file = kind:sub(1, 5) == "file:"
                local original = file and assert(json.encode({token = SECRET})) or SECRET
                local account = identity.request(member, "POST", "/autocode/accounts",
                    {agent = "claude", credential_kind = kind, label = "runtime", secret = file and '{"token":"old-key"}' or "old-key"})
                test.eq(account.status, 201, account.body)
                local replaced = identity.request(member, "PUT", "/autocode/accounts/" .. account.json.id, {secret = original})
                test.eq(replaced.status, 200, replaced.body)
                local direct, denied = identity.call(member, "kickside.component.system:read_private_context", {component_id = account.json.id})
                test.is_nil(denied)
                test.is_true(direct.credential.set)
                test.is_nil(assert(json.encode(direct)):find(SECRET, 1, true))
                local secrets, secret_err = identity.call(member, "kickside.component.binding:get_secrets_func", {component_id = account.json.id})
                test.is_nil(secret_err)
                test.is_false(secrets.success); test.eq(secrets.kind, errors.PERMISSION_DENIED)
                local submitted = identity.request(member, "POST", "/autocode/runs",
                    {agent = "claude", image_id = image_id, account_id = account.json.id, prompt = "test credential"})
                test.eq(submitted.status, 201, submitted.body)
                local id = submitted.json.run_id
                local name = "chestor-autocode-" .. id
                containers[#containers + 1] = name
                deadline = time.now():add("90s")
                while repo.stored_run(id).status == "queued" do
                    test.is_false(time.now():after(deadline), "worker does not launch")
                    time.sleep("50ms")
                end
                while true do
                    local running = false
                    local inspect_code, inspect_err = docker.run({"inspect", "--format", "{{.State.Running}}", name},
                        {on_line = function(line) running = line == "true" end})
                    test.is_nil(inspect_err); test.eq(inspect_code, 0)
                    if running then break end
                    test.is_false(time.now():after(deadline), "container does not start")
                    time.sleep("50ms")
                end
                for _, args in ipairs({{"inspect", name}, {"exec", name, "env"}, {"logs", name}}) do
                    local output = {}
                    local status, err = docker.run(args, {on_line = function(line) output[#output + 1] = line end})
                    test.is_nil(err); test.eq(status, 0, table.concat(output, "\n"))
                    local text = table.concat(output, "\n")
                    test.is_nil(text:find(SECRET, 1, true)); test.is_nil(text:find(REFRESHED, 1, true))
                end
                local released, release_err = docker.run({"exec", name, "touch", "/dev/shm/credential-audit-release"})
                test.is_nil(release_err); test.eq(released, 0)
                local result
                while true do
                    result = identity.request(member, "GET", "/autocode/runs/" .. id)
                    test.eq(result.status, 200, result.body)
                    if result.json.run.status ~= "queued" and result.json.run.status ~= "running" then break end
                    test.is_false(time.now():after(deadline), "worker does not settle")
                    time.sleep("100ms")
                end
                test.eq(result.json.run.status, "succeeded", result.body)
                test.eq(result.json.run.result, "credential accepted")
                test.is_nil(result.body:find(SECRET, 1, true)); test.is_nil(result.body:find(REFRESHED, 1, true))
                if file then
                    local rows = assert(sql.get("app:db"))
                    local row = assert(rows:query("SELECT private_context,encrypted_secrets FROM kickside_components WHERE component_id=$1", {account.json.id}))[1]
                    local secrets = assert(funcs.call("kickside.component.system:open_secrets", account.json.id, row.encrypted_secrets,
                        assert(rows:query("SELECT secrets_generation FROM kickside_components WHERE component_id=$1", {account.json.id}))[1].secrets_generation))
                    test.eq(assert(json.decode(secrets.credential)).token, REFRESHED)
                    test.is_nil(select(2, rows:release()))
                    local listed = identity.request(member, "GET", "/autocode/accounts")
                    test.is_nil(listed.body:find(REFRESHED, 1, true))
                end
            end
        end)
    end)
end)}

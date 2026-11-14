-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local funcs = require("funcs")
local uuid = require("uuid")
local json = require("json")
local repo = require("repo")
local identity = require("identity")
local workspace_store = require("workspace_store")
local runner = require("runner")
local stubs = require("stubs")
local docker = require("docker")
local registry = require("registry")
local component = require("component")
local function migration(id)
    local result, err = funcs.call(id, {database_id = "app:upgrade_db", direction = "up", id = "test:" .. id})
    test.is_nil(err, tostring(err))
    test.eq(result.status, "complete", tostring(result.error))
end
local function cases()
    test.describe("autocode populated release upgrade", function()
        local f = require("contract_fixture").new()
        test.after_each(f.release)
        test.it("upgrades populated release data and automatically approves only workspaces whose current writers are workspace managers", function()
            local admin, member = identity.admin(), f.member()
            f.users[#f.users + 1] = admin
            local published_runs = {}
            local path = identity.directory(admin, "legacy-admin")
            local admin_id = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "legacy admin"}, {host_path = path}))
            local duplicate_id = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "legacy duplicate"}, {host_path = path}))
            local manager = identity.user({identity.SIGNED_IN, identity.MEMBERS, "app:workspace_managers"})
            f.users[#f.users + 1] = manager
            local manager_id = assert(identity.call(manager, "app:fixture_register", "workspace", {title = "live manager"}, {host_path = identity.directory(manager, "legacy-manager")}))
            local patched_id = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "member-patched admin"}, {host_path = identity.directory(admin, "legacy-patched")}))
            local share = identity.request(admin, "POST", "/component-access/share/" .. patched_id, {subject_id = member.id, subject_type = "user", access_mask = 3})
            test.eq(share.status, 200, share.body)
            test.is_true(identity.call(member, "app:fixture_patch", {kind = "workspace", id = patched_id, context = {host_path = identity.directory(admin, "legacy-member-path")}}))
            local write_grant = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "member write only"}, {host_path = identity.directory(admin, "member-write-only")}))
            test.eq(identity.request(admin, "POST", "/component-access/share/" .. write_grant,
                {subject_id = member.id, subject_type = "user", access_mask = 2}).status, 200)
            local admin_grant = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "member admin only"}, {host_path = identity.directory(admin, "member-admin-only")}))
            test.eq(identity.request(admin, "POST", "/component-access/share/" .. admin_grant,
                {subject_id = member.id, subject_type = "user", access_mask = 8}).status, 200)
            local group_grant = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "group writers"}, {host_path = identity.directory(admin, "group-writers")}))
            test.eq(identity.request(admin, "POST", "/component-access/share/" .. group_grant,
                {subject_id = identity.MEMBERS, subject_type = "group", access_mask = 2}).status, 200)
            local read_grant = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "member read only"}, {host_path = identity.directory(admin, "member-read-only")}))
            test.eq(identity.request(admin, "POST", "/component-access/share/" .. read_grant,
                {subject_id = member.id, subject_type = "user", access_mask = 1}).status, 200)
            local malformed_id = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "malformed legacy"}, {}))
            local bad_path = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "invalid path"}, {host_path = false}))
            local restored_path = identity.directory(admin, "restored-context")
            local restored = assert(identity.call(admin, "app:fixture_register", "workspace", {title = "restored"}, {host_path = restored_path}))
            test.is_true(identity.call(admin, "app:fixture_patch", {kind = "workspace", id = restored, context = {host_path = path}}))
            test.is_true(identity.call(admin, "app:fixture_patch", {kind = "workspace", id = restored, context = {host_path = restored_path}}))
            local tag = "chestor-autocode-upgrade:" .. uuid.v7()
            local output = {}
            local built, build_err = docker.run({"build", "-t", tag, "-"}, {stdin = "FROM node:22-bookworm-slim\nRUN mkdir -p /opt/agent\n", on_line = function(line) output[#output + 1] = line end})
            test.is_nil(build_err, tostring(build_err)); test.eq(built, 0, table.concat(output, "\n"))
            local refs = {}
            test.eq(docker.run({"image", "inspect", "--format", "{{.Id}}", tag}, {on_line = function(line) refs[#refs + 1] = line end}), 0)
            local host_files = identity.directory(admin, "legacy-host-files")
            local _, file_err = require("host").run({"sh", "-ec", 'printf "com.example.team=dev\\n" > "$1/labels"; printf "HISTORICAL_FILE=1\\n" > "$1/environment"', "host-files", host_files})
            test.is_nil(file_err, tostring(file_err))
            local cwd = assert(require("host").run({"pwd"}))
            local relative_files = host_files:sub(#cwd + 2)
            local legacy_images = {}
            for _, image in ipairs({{safe = true}, {safe = true, args = {"--label-file", relative_files .. "/labels", "--env-file=./" .. relative_files .. "/environment", "--log-driver", "json-file", "--log-opt", "max-size=10m", "--log-opt=max-file=3", "--mac-address=92:d0:c6:0a:29:33", "--expose", "3000", "--group-add", "1000", "-t=false", "-i=true", "-q=true", "--quiet", "--disable-content-trust", "--entrypoint=", "--label=-team=dev", "--label", "com.example.team=dev", "--env", "DEBUG=1", "--workdir", "/workspace", "--hostname", "upgrade-worker", "--user", "0:0", "--read-only", "--tmpfs", "/opt/agent:rw,size=16m", "--cap-drop", "ALL", "--security-opt", "no-new-privileges", "--ulimit", "nofile=1024:4096", "--cpus", "0.5", "--memory", "128m"}}, {safe = false}, {safe = true, unprojected = true}}) do
                image.id = assert(identity.call(admin, "app:fixture_register", "image",
                    {title = "legacy image", ref = "old:tag", home = "/opt/agent", status = "ready", agents = {"claude"}}, {}))
                legacy_images[#legacy_images + 1] = image
            end
            local member_id = assert(identity.call(member, "app:fixture_register", "workspace", {title = "legacy member", role = "admin"}, {host_path = identity.directory(member, "legacy-member")}))
            -- Invalid legacy field types must be refused without aborting the migration.
            local malformed = {}
            for _, value in ipairs({23, {"/"}, {path = "/"}, "relative/path"}) do
                malformed[#malformed + 1] = assert(identity.call(admin, "app:fixture_register", "workspace",
                    {title = "malformed value"}, {host_path = value}))
            end
            -- 44e804a (released main): exact 01 schema, before migrations 03-08.
            migration("app:previous_schema")
            local db = assert(sql.get("app:upgrade_db"))
            for _, status in ipairs({"queued", "running", "succeeded"}) do
                local _, err = db:execute([[INSERT INTO chestor_autocode_runs
                    (id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id, prompt, timeout_ms, status)
                    VALUES ($1, 'legacy-owner', 'legacy-owner', '{}', 'claude', 'account', 'image', 'legacy-workspace', 'legacy task', 60000, $2)]], {status, status})
                test.is_nil(err, tostring(err))
            end
            for _, workspace in ipairs({{id = admin_id, path = path}, {id = restored, path = restored_path}}) do
                local run_id = "published-shared-" .. uuid.v7()
                published_runs[#published_runs + 1] = {run_id = run_id, id = workspace.id, path = workspace.path}
                assert(db:execute([[INSERT INTO chestor_autocode_runs
                    (id, owner_id, actor_id, actor_context, agent, account_id, image_id, workspace_id, prompt, timeout_ms, status)
                    VALUES ($1, $2, $2, '{}', 'claude', 'released-account', 'released-image', $3, 'shared upgrade task', 60000, 'queued')]], {run_id, admin.id, workspace.id}))
            end
            assert(db:execute("INSERT INTO chestor_autocode_account_state (account_id, last_used_at) VALUES ('legacy-account', '2026-10-01T00:00:00Z')"))
            assert(db:execute("INSERT INTO chestor_autocode_image_builds (image_id, actor_id, actor_context, mode, requested_at, status) VALUES ('legacy-image', 'legacy-owner', '{}', 'initial', '2026-10-01T00:00:00Z', 'ready')"))
            for _, image in ipairs(legacy_images) do
                local recipe = {ref = refs[1], home = "/opt/agent", revision = 1, dockerfile = "", settings = {memory = "4g", cpus = "2", pids_limit = 1024, gpus = "", network = "none", allows = {}, extra_args = image.safe and (image.args or {}) or {"--privileged"}}}
                assert(db:execute([[INSERT INTO chestor_autocode_image_builds (image_id, actor_id, actor_context, mode, requested_at, finished_at,
                    status, agents, projected, recipe, approved_recipe, approved_agents) VALUES ($1, $2, '{}', 'initial', '2026-10-01T00:00:00Z', '2026-10-01T00:01:00Z', 'ready', '["claude"]', $3, $4, $5, '["claude"]')]], {image.id, admin.id, image.unprojected and 0 or 1, json.encode(recipe), image.unprojected and '{}' or json.encode(recipe)}))
            end
            assert(db:execute("INSERT INTO chestor_autocode_run_events (run_id, seq, kind, text) VALUES ('succeeded', 1, 'result', 'kept result')"))
            assert(db:execute("INSERT INTO chestor_autocode_submissions (owner_id, key, canonical, run_id) VALUES ('legacy-owner', 'key', '{}', 'succeeded')"))
            db:release()
            for _, id in ipairs({"02_run_retention_index", "03_profiles_and_limits", "04_run_gateway", "05_run_account_health", "06_workspace_admission", "07_image_snapshots", "08_workspace_provenance"}) do
                migration("chestor.autocode.migrations:" .. id)
                migration("chestor.autocode.migrations:" .. id) -- restart/reapplication is a no-op
            end
            local upgraded = assert(sql.get("app:upgrade_db"))
            local account = assert(upgraded:query("SELECT last_used_at, rate_limits FROM chestor_autocode_account_state WHERE account_id = 'legacy-account'"))
            local image = assert(upgraded:query("SELECT status, requested_at FROM chestor_autocode_image_builds WHERE image_id = 'legacy-image'"))
            test.eq(account[1].last_used_at, "2026-10-01T00:00:00Z"); test.eq(account[1].rate_limits, "{}")
            test.eq(image[1].status, "ready"); test.eq(image[1].requested_at, "2026-10-01T00:00:00Z")
            test.eq(assert(upgraded:query("SELECT text FROM chestor_autocode_run_events WHERE run_id = 'succeeded'"))[1].text, "kept result")
            test.eq(assert(upgraded:query("SELECT run_id FROM chestor_autocode_submissions WHERE key = 'key'"))[1].run_id, "succeeded")
            upgraded:release()
            local manager, manager_err = workspace_store.admitted_workspace(admin_id)
            test.is_nil(manager_err, tostring(manager_err)); test.not_nil(manager)
            test.eq(manager.host_path, path)
            test.is_nil(workspace_store.admitted_workspace(write_grant), "a member WRITE-only grant prevents approval")
            test.is_nil(workspace_store.admitted_workspace(admin_grant), "a member ADMIN-only grant prevents approval")
            test.is_nil(workspace_store.admitted_workspace(group_grant), "group writers must be resolved through the directory")
            test.not_nil(workspace_store.admitted_workspace(restored), "administrator changes must not require an upgrade action")
            test.not_nil(workspace_store.admitted_workspace(read_grant), "read-only members are not writers")
            test.is_nil(workspace_store.admitted_workspace(patched_id))
            test.is_nil(workspace_store.admitted_workspace(malformed_id))
            test.is_nil(workspace_store.admitted_workspace(bad_path))
            for _, id in ipairs(malformed) do test.is_nil(workspace_store.admitted_workspace(id)) end
            local components = assert(component.list_system({component_ids = {write_grant, group_grant, bad_path}, include = {meta = true}}))
            local reasons = {}
            for _, row in ipairs(components) do reasons[row.component_id] = row.meta.unavailable_reason end
            test.not_nil(reasons[write_grant]:find("WRITE or ADMIN", 1, true))
            test.not_nil(reasons[group_grant]:find("WRITE or ADMIN", 1, true))
            test.not_nil(reasons[bad_path]:find("malformed", 1, true))
            test.is_nil(workspace_store.admitted_workspace(duplicate_id))
            test.not_nil(workspace_store.admitted_workspace(manager_id))
            test.is_nil(workspace_store.admitted_workspace(member_id))
            local listing = f.call(admin, "list_images", {ready_only = false})
            for _, image in ipairs(legacy_images) do
                local found = false
                for _, current in ipairs(listing.images) do
                    if current.id == image.id then found = true; test.eq(current.usable, not image.unprojected); test.eq(current.status, "ready") end
                end
                test.is_true(found)
            end
            local account = f.call(admin, "add_account", {agent = "claude", label = "legacy", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local image_id = f.image_for(admin)
            local ready, ready_err = identity.call(admin, "app:upgrade_admit", {agent = "claude", account_id = account.id, image_id = image_id, workspace_id = admin_id, options = {}, prompt = "legacy", repo_url = ""})
            test.is_nil(ready_err, tostring(ready_err)); test.eq(ready.workspace.host_path, path)
            local edited, edited_err = identity.call(admin, "app:upgrade_admit", {agent = "claude", account_id = account.id, image_id = image_id, workspace_id = restored, options = {}, prompt = "edited legacy", repo_url = ""})
            test.is_nil(edited_err, tostring(edited_err)); test.eq(edited.workspace.host_path, restored_path)
            -- A current manager may read a member-owned component, but it has no upgrade provenance.
            local share = identity.request(member, "POST", "/component-access/share/" .. member_id, {subject_id = admin.id, subject_type = "user", access_mask = 3})
            test.eq(share.status, 200, share.body)
            local refused, refusal = identity.call(admin, "app:upgrade_admit", {agent = "claude", account_id = account.id, image_id = image_id, workspace_id = member_id, options = {}, prompt = "legacy", repo_url = ""})
            test.is_nil(refused); test.not_nil(tostring(refusal):find("approve", 1, true))
            local approved, approval_err = workspace_store.admitted_workspace("legacy-workspace")
            test.is_nil(approval_err); test.is_nil(approved)
            for _, status in ipairs({"queued", "running", "succeeded"}) do
                local row, err = repo.stored_run(status)
                test.is_nil(err, tostring(err))
                test.eq(row.status, status)
                test.is_false(row.resolved)
                test.eq(row.workspace_id, "legacy-workspace")
                test.eq(#row.account_pool, 0)
                test.is_nil(row.tools); test.is_nil(row.gateway)
                local state = stubs.reset()
                -- Recovery must settle old active rows without decoding failures or relaunching them.
                local outcome = runner.main({payload = {run_id = status}, job = {attempt_no = 2}})
                test.is_true(outcome.ok, tostring(outcome.error))
                test.eq(repo.stored_run(status).status, status == "succeeded" and "succeeded" or "failed")
                test.is_nil(state.attached)
            end
            -- Execute a row created with the released schema and no new runtime bindings.
            for _, workspace in ipairs(published_runs) do
                local published = repo.stored_run(workspace.run_id)
                local state = stubs.reset()
                state.prepared = stubs.preparation(published)
                state.prepared.image.ref = refs[1]
                state.prepared.image.extra_args = legacy_images[2].args
                state.prepared.workspace = {id = workspace.id, host_path = workspace.path, writable = true}
                state.prepared.workdir = "/workspace"
                state.prepared.launch = {executable = "sh", argv = {"-c", "printf upgraded > /workspace/upgrade-result; printf '%s\n' '{\"type\":\"result\",\"subtype\":\"success\",\"result\":\"shared upgrade completed\"}'"}, environment = {}, files = {}, readiness = "none"}
                local outcome = require("docker_runner").main({payload = {run_id = workspace.run_id}})
                test.is_true(outcome.ok, tostring(outcome.error_native))
                local completed = repo.stored_run(workspace.run_id)
                test.eq(completed.status, "succeeded", completed.error)
                test.eq(completed.result, "shared upgrade completed")
                test.eq(completed.workspace_id, workspace.id)
            end
            for _, image in ipairs(legacy_images) do
                if not image.unprojected then
                    local stored = assert(sql.get("app:upgrade_db"))
                    local rows = assert(stored:query("SELECT approved_recipe FROM chestor_autocode_image_builds WHERE image_id = $1", {image.id}))
                    stored:release()
                    local recipe = assert(json.decode(rows[1].approved_recipe))
                    test.eq(recipe.ref, refs[1])
                    local name = "autocode-upgrade-image-" .. uuid.v7()
                    local args = {"create", "--cap-drop=NET_RAW", "--name", name, "--network", recipe.settings.network}
                    for _, value in ipairs(recipe.settings.extra_args) do args[#args + 1] = value end
                    args[#args + 1] = recipe.ref
                    args[#args + 1] = "sh"; args[#args + 1] = "-ec"
                    args[#args + 1] = image.args and 'test "$HISTORICAL_FILE" = 1 && test "$DEBUG" = 1 && test "$(hostname)" = upgrade-worker' or "true"
                    local code, execute_err = docker.run(args, {isolation = {name = name, image = recipe.ref, network = recipe.settings.network, mounts = {}}})
                    if image.safe then
                        test.is_nil(execute_err, tostring(execute_err)); test.eq(code, 0, json.encode(recipe.settings.extra_args))
                        local code, start_err = docker.run({"start", "-a", name})
                        docker.ensure_removed(name)
                        test.is_nil(start_err, tostring(start_err)); test.eq(code, 0)
                    else
                        test.is_nil(code); test.not_nil(execute_err)
                        test.not_nil(tostring(execute_err):find("isolation mismatch: Privileged", 1, true), tostring(execute_err))
                        local remaining = {}
                        test.eq(docker.run({"ps", "-aq", "--filter", "name=^" .. name .. "$"}, {on_line = function(line) remaining[#remaining + 1] = line end}), 0)
                        test.eq(#remaining, 0)
                    end
                end
            end
            test.eq(docker.run({"image", "rm", tag}), 0)
            test.is_nil(workspace_store.approve_workspace("active-shared", "/active-shared"))
            local active = assert(sql.get("app:upgrade_db"))
            assert(active:execute("UPDATE chestor_autocode_runs SET workspace_id = 'active-shared', status = 'running' WHERE id = 'running'"))
            local active_err = workspace_store.delete_workspace("active-shared")
            test.is_true(errors.is(active_err, errors.CONFLICT), tostring(active_err))
            test.not_nil(workspace_store.admitted_workspace("active-shared"))
            assert(active:execute("UPDATE chestor_autocode_runs SET status = 'failed' WHERE id = 'running'"))
            active:release()
            test.is_nil(workspace_store.delete_workspace("active-shared"))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

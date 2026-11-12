-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local repo = require("repo")
local gateway = require("gateway")
local json = require("json")
local sql = require("sql")
local drivers = require("drivers")
local container = require("container")
local http_client = require("http_client")
local function cases()
    test.describe("autocode per-run gateway", function()
        local f = require("contract_fixture").new()
        test.after_each(f.release)
        local function run_for(user, tools)
            local account = f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local submitted, err = identity.call(user, "app:gateway_seed", {account_id = account.id, image_id = f.image_for(user), tools = tools})
            test.is_nil(err, tostring(err))
            local prepared, prepare_err = identity.call(user, "chestor.autocode.service:prepare", {run_id = submitted.run_id})
            test.is_nil(prepare_err, tostring(prepare_err))
            return submitted.run_id, prepared
        end
        test.it("returns protocol errors for malformed JSON-RPC parameter envelopes", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
            for _, params in ipairs({42, "text", true, {1, 2}, {name = 42}, {name = "gateway_echo", arguments = 42}}) do
                local reply, err = gateway.handle(id, prepared.gateway_token, {jsonrpc = "2.0", id = 7, method = "tools/call", params = params})
                test.is_nil(err, tostring(err))
                test.eq(reply.id, 7)
                test.eq(reply.error.code, -32602)
            end
            local events = repo.events(id, 0)
            test.eq(#events, 0)
        end)
        test.it("validates frozen tool arguments before dispatch or activity writes", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
            for _, arguments in ipairs({{text = 42}, {extra = "undeclared"}, false}) do
                local reply, err = gateway.handle(id, prepared.gateway_token, {jsonrpc = "2.0", id = 7, method = "tools/call", params = {name = "gateway_echo", arguments = arguments}})
                test.is_nil(err, tostring(err)); test.eq(reply.error.code, -32602)
            end
            test.eq(#repo.events(id, 0), 0)
        end)
        test.it("bounds stored gateway activity while returning the complete tool reply", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
            local text = string.rep("payload", 3000)
            local reply, err = gateway.handle(id, prepared.gateway_token, {jsonrpc = "2.0", id = 1, method = "tools/call", params = {name = "gateway_echo", arguments = {text = text}}})
            test.is_nil(err, tostring(err))
            test.eq(json.decode(reply.result.content[1].text).text, text)
            local events = repo.events(id, 0)
            test.eq(#events, 2)
            local db = sql.get("app:db")
            local notices = db:query("SELECT topic FROM autocode_test_notify WHERE owner_id = $1 AND topic = $2", {user.id, "chestor.autocode.run." .. id})
            db:release()
            test.eq(#notices, 2)
            for _, event in ipairs(events) do
                test.is_true(#event.text < 8100)
                test.not_nil(event.text:find("truncated", 1, true))
            end
        end)
        test.it("dispatches under an administrator identity captured against a profile component", function()
            local user = identity.admin()
            f.users[#f.users + 1] = user
            local account = f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local image_id = f.image_for(user)
            local profile = f.call(user, "add_profile", {title = "Host profile", agent = "claude", image_id = image_id}, "chestor.autocode:profiles")
            local seeded, seed_err = identity.call(user, "app:gateway_seed", {account_id = account.id, image_id = image_id,
                component_id = profile.id, tools = {tools = {"app:gateway_echo"}, context = {board_id = "host-board"}}})
            test.is_nil(seed_err, tostring(seed_err))
            local prepared, prepare_err = identity.call(user, "chestor.autocode.service:prepare", {run_id = seeded.run_id})
            test.is_nil(prepare_err, tostring(prepare_err))
            local response, http_err = http_client.request("POST", identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/mcp/" .. seeded.run_id,
                {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. prepared.gateway_token},
                    body = json.encode({jsonrpc = "2.0", id = 1, method = "tools/call", params = {name = "gateway_echo", arguments = {text = "host"}}})})
            test.is_nil(http_err, tostring(http_err))
            test.eq(response.status_code, 200, response.body)
            local reply = json.decode(response.body)
            test.is_false(reply.result.isError, response.body)
            local echoed = json.decode(reply.result.content[1].text)
            test.eq(echoed.owner, user.id); test.eq(echoed.board_id, "host-board")
        end)
        for _, grant in ipairs({"user", "group"}) do
            test.it("dispatches for a foreign board with " .. grant .. " ADMIN through HTTP", function()
                local admin = identity.admin()
                f.users[#f.users + 1] = admin
                local user = grant == "user" and admin or f.member()
                local registered, board_err = identity.call(admin, "app:task_probe", {contract = "kickside.component:component_service", method = "register",
                    input = {impl_id = "app:gateway_foreign", meta = {title = "Foreign identity"}}})
                local board = {board_id = registered and registered.component_id}
                test.is_nil(board_err, tostring(board_err))
                if grant == "group" then
                    local shared = identity.request(admin, "POST", "/component-access/share/" .. board.board_id,
                        {subject_id = identity.MEMBERS, subject_type = "group", access_mask = 15})
                    test.eq(shared.status, 200, shared.body)
                end
                local db = sql.get("app:db")
                local dialect, dialect_err = db:type()
                test.is_nil(dialect_err, tostring(dialect_err))
                local root_path = dialect == sql.type.POSTGRES and board.board_id:gsub("%-", "") or "/" .. board.board_id .. "/"
                local roots, root_err = db:query("SELECT impl_id, parent_id, path FROM kickside_components WHERE component_id = $1", {board.board_id})
                local grants, grant_err = db:query("SELECT subject_type, subject_id, access_mask FROM kickside_component_access WHERE component_id = $1", {board.board_id})
                db:release()
                test.is_nil(root_err, tostring(root_err)); test.is_nil(grant_err, tostring(grant_err))
                test.eq(roots[1].impl_id, "app:gateway_foreign")
                test.is_nil(roots[1].parent_id); test.eq(roots[1].path, root_path)
                local found = false
                for _, row in ipairs(grants) do
                    if row.subject_type == grant and row.subject_id == (grant == "user" and user.id or identity.MEMBERS) then
                        test.eq(row.access_mask, 15); found = true
                    end
                    if grant == "group" then test.is_false(row.subject_type == "user" and row.subject_id == user.id) end
                end
                test.is_true(found)
                local account = f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
                local image_id = f.image_for(user)
                local seeded, seed_err = identity.call(user, "app:gateway_seed", {account_id = account.id, image_id = image_id,
                    component_id = board.board_id, tools = {tools = {"app:gateway_echo"}, context = {board_id = board.board_id}}})
                test.is_nil(seed_err, tostring(seed_err))
                local captured = json.decode(repo.stored_run(seeded.run_id).identity.actor_context)
                test.eq(captured.version, 2); test.eq(captured.component_id, board.board_id)
                test.eq(captured.authorized_by.kind, "user"); test.eq(captured.authorized_by.id, user.id)
                local prepared, prepare_err = identity.call(user, "chestor.autocode.service:prepare", {run_id = seeded.run_id})
                test.is_nil(prepare_err, tostring(prepare_err))
                local response, http_err = http_client.request("POST", identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/mcp/" .. seeded.run_id,
                    {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. prepared.gateway_token},
                        body = json.encode({jsonrpc = "2.0", id = 1, method = "tools/call", params = {name = "gateway_echo", arguments = {text = "foreign"}}})})
                test.is_nil(http_err, tostring(http_err))
                test.eq(response.status_code, 200, response.body)
                local reply = json.decode(response.body)
                test.is_false(reply.result.isError, response.body)
                local echoed = json.decode(reply.result.content[1].text)
                test.eq(echoed.owner, user.id)
                test.eq(echoed.board_id, board.board_id)
                local events = repo.events(seeded.run_id, 0)
                test.eq(#events, 2); test.eq(events[1].kind, "tool_call"); test.eq(events[2].kind, "tool_result")
                test.eq(json.decode(events[2].text).owner, user.id)
            end)
        end
        test.it("returns an MCP tool error when the recorded authorizer loses root ADMIN", function()
            local user, other = f.member(), f.member()
            local account = f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local image_id = f.image_for(user)
            local profile = f.call(other, "add_profile", {title = "Revoked authorizer", agent = "claude", image_id = f.image_for(other)}, "chestor.autocode:profiles")
            local shared = identity.request(other, "POST", "/component-access/share/" .. profile.id,
                {subject_id = user.id, subject_type = "user", access_mask = 15})
            test.eq(shared.status, 200, shared.body)
            local seeded, seed_err = identity.call(user, "app:gateway_seed", {account_id = account.id, image_id = image_id,
                component_id = profile.id, tools = {tools = {"app:gateway_echo"}}})
            test.is_nil(seed_err, tostring(seed_err))
            local prepared, prepare_err = identity.call(user, "chestor.autocode.service:prepare", {run_id = seeded.run_id})
            test.is_nil(prepare_err, tostring(prepare_err))
            local downgraded = identity.request(other, "POST", "/component-access/share/" .. profile.id,
                {subject_id = user.id, subject_type = "user", access_mask = 7})
            test.eq(downgraded.status, 200, downgraded.body)
            local response, http_err = http_client.request("POST", identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/mcp/" .. seeded.run_id,
                {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. prepared.gateway_token},
                    body = json.encode({jsonrpc = "2.0", id = 17, method = "tools/call", params = {name = "gateway_echo", arguments = {}}})})
            test.is_nil(http_err, tostring(http_err))
            test.eq(response.status_code, 200, response.body)
            local reply = json.decode(response.body)
            test.eq(reply.id, 17); test.is_true(reply.result.isError)
            test.not_nil(reply.result.content[1].text:find("recorded authorizer no longer has root ADMIN", 1, true))
            local events = repo.events(seeded.run_id, 0)
            test.eq(#events, 2); test.eq(events[1].kind, "tool_call"); test.eq(events[2].kind, "tool_result")
            test.is_nil(events[2].text:find('"owner"', 1, true))
        end)
        test.it("dispatches local trait tools only for owners with the live tool grant", function()
            local admin = identity.admin()
            f.users[#f.users + 1] = admin
            local granted = identity.user({identity.SIGNED_IN, identity.MEMBERS, "app:gateway_tools"})
            f.users[#f.users + 1] = granted
            for _, owner in ipairs({{user = admin, allowed = true}, {user = granted, allowed = true}, {user = f.member(), allowed = false}}) do
                local caller = owner.user
                local account = f.call(caller, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
                local image_id = f.image_for(caller)
                local profile = f.call(caller, "add_profile", {title = "Host profile", agent = "claude", image_id = image_id}, "chestor.autocode:profiles")
                local declaration = {traits = {"app:gateway_privileged_trait"}, context = {board_id = "local-context"}}
                local seeded, seed_err = identity.call(caller, "app:gateway_seed", {account_id = account.id, image_id = image_id,
                    component_id = profile.id, tools = declaration})
                test.is_nil(seed_err, tostring(seed_err))
                local captured = json.decode(repo.stored_run(seeded.run_id).identity.actor_context)
                test.eq(captured.component_id, profile.id); test.eq(captured.authorized_by.id, caller.id)
                local token
                if owner.allowed then
                    local prepared, prepare_err = identity.call(caller, "chestor.autocode.service:prepare", {run_id = seeded.run_id})
                    test.is_nil(prepare_err, tostring(prepare_err)); token = prepared.gateway_token
                else
                    local surface, surface_err = gateway.resolve(declaration, "claude")
                    test.is_nil(surface_err, tostring(surface_err))
                    local issued, issue_err = gateway.issue(seeded.run_id, surface, nil, 60000)
                    test.is_nil(issue_err, tostring(issue_err)); token = issued.token
                end
                local response, http_err = http_client.request("POST", identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/mcp/" .. seeded.run_id,
                    {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. token},
                        body = json.encode({jsonrpc = "2.0", id = 1, method = "tools/call", params = {name = "gateway_privileged_echo", arguments = {text = "local fixture"}}})})
                test.is_nil(http_err, tostring(http_err)); test.eq(response.status_code, 200, response.body)
                local reply = json.decode(response.body)
                test.eq(reply.result.isError, not owner.allowed, response.body)
                if owner.allowed then
                    local echoed = json.decode(reply.result.content[1].text)
                    test.eq(echoed.owner, caller.id); test.eq(echoed.board_id, "local-context")
                else test.not_nil(reply.result.content[1].text:find("function access denied", 1, true)) end
                local events = repo.events(seeded.run_id, 0)
                test.eq(#events, 2); test.eq(events[1].kind, "tool_call"); test.eq(events[2].kind, "tool_result")
            end
        end)
        test.it("accepts owner tool calls throughout the real runner lifecycle and revokes at outcome", function()
            local user = f.member()
            local account = f.call(user, "add_account", {agent = "claude", label = "key", credential_kind = "env:ANTHROPIC_API_KEY", secret = "private-key"}, "chestor.autocode:accounts")
            local seeded, seed_err = identity.call(user, "app:gateway_seed", {account_id = account.id, image_id = f.image_for(user), tools = {tools = {"app:gateway_echo"}, context = {board_id = "live-board"}}})
            test.is_nil(seed_err, tostring(seed_err))
            local id, token = seeded.run_id, nil
            local state = require("stubs").reset()
            local stages = {}
            local function check(stage, status, pending)
                stages[#stages + 1] = stage
                local stored = repo.stored_run(id)
                test.eq(stored.status, status, stage)
                test.eq(stored.pending_status, pending, stage)
                for _, method in ipairs({"initialize", "tools/list", "tools/call"}) do
                    local response, err = http_client.request("POST", identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/mcp/" .. id,
                        {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. token}, body = json.encode({jsonrpc = "2.0", id = 1, method = method, params = {name = "gateway_echo", arguments = {text = stage}}})})
                    test.is_nil(err, tostring(err))
                    test.eq(response.status_code, pending and 401 or 200, stage .. " " .. method .. ": " .. response.body)
                    if method == "tools/call" and not pending then
                        local reply = json.decode(response.body)
                        test.is_false(reply.result.isError, response.body)
                        test.eq(json.decode(reply.result.content[1].text).owner, user.id)
                    end
                end
            end
            state.on_create = function(opts) token = opts.env.AUTOCODE_GATEWAY_TOKEN; check("prepared", "queued", nil) end
            state.on_attach = function() check("before output", "running", nil) end
            state.after_output = function() check("during tools", "running", nil) end
            state.terminal = {outcome = "succeeded", answer = "done"}
            state.on_health = function()
                if #state.health_topics == 2 then
                    local observed = false
                    for _, event in ipairs(repo.events(id, 0)) do
                        if event.kind == "system" and event.text == "succeeded" then observed = true end
                    end
                    test.is_true(observed, "the runner has folded the terminal answer before this call")
                    check("after answer", "running", nil)
                end
            end
            state.on_remove = function() check("settlement", "running", "succeeded") end
            local outcome = require("runner").main({payload = {run_id = id}})
            test.is_true(outcome.ok, json.encode(outcome))
            check("settled", "succeeded", "succeeded")
            test.eq(repo.stored_run(id).result, "done")
            test.eq(#stages, 6)
        end)
        test.it("distinguishes credential failures, tool denials and infrastructure failures over HTTP", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_refused"}})
            local function request(run_id, token, method)
                local response, err = http_client.request("POST", identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/mcp/" .. run_id,
                    {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. token}, body = json.encode({jsonrpc = "2.0", id = 1, method = method or "tools/list", params = {name = "gateway_refused", arguments = {}}})})
                test.is_nil(err, tostring(err))
                return response.status_code, json.decode(response.body)
            end
            for _, credentials in ipairs({{"unknown", prepared.gateway_token}, {id, "wrong"}, {id, ""}}) do
                local status, body = request(credentials[1], credentials[2])
                test.eq(status, 401)
                test.eq(body.code, "autocode.gateway_credential_invalid")
            end
            local status, body = request(id, prepared.gateway_token, "tools/call")
            test.eq(status, 200)
            test.is_true(body.result.isError)
            test.not_nil(body.result.content[1].text:find("fixture tool permission denied", 1, true))
            local db = sql.get("app:db")
            local _, write_err = db:execute("UPDATE chestor_autocode_runs SET actor_context = 'malformed' WHERE id = $1", {id})
            db:release(); test.is_nil(write_err, tostring(write_err))
            status, body = request(id, prepared.gateway_token, "tools/call")
            test.eq(status, 500)
            test.eq(body.code, "autocode.gateway_unavailable")
            test.is_nil(repo.record_run_outcome(id, "succeeded", "", "", {}))
            status, body = request(id, prepared.gateway_token)
            test.eq(status, 401); test.eq(body.code, "autocode.gateway_credential_invalid")
            test.is_true(repo.finish_run(id, "succeeded", "", "", {}))
            test.eq(request(id, prepared.gateway_token), 401)
            local expired_id, expired = run_for(user, {tools = {"app:gateway_echo"}})
            local binding = repo.stored_run(expired_id).gateway
            binding.expires_at = "2000-01-01T00:00:00Z"
            db = sql.get("app:db")
            db:execute("UPDATE chestor_autocode_runs SET gateway = $1 WHERE id = $2", {json.encode(binding), expired_id}); db:release()
            status, body = request(expired_id, expired.gateway_token)
            test.eq(status, 401); test.eq(body.code, "autocode.gateway_credential_invalid")
        end)
        test.it("uses the same UTC second precision for expiry and now and refuses at the expiry second", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
            local binding = repo.stored_run(id).gateway
            local format = "^%d%d%d%d%-%d%d%-%d%dT%d%d:%d%d:%d%dZ$"
            test.not_nil(binding.expires_at:match(format)); test.not_nil(repo.now():match(format))
            binding.expires_at = repo.now()
            local db = sql.get("app:db")
            local _, err = db:execute("UPDATE chestor_autocode_runs SET gateway = $1 WHERE id = $2", {json.encode(binding), id}); db:release()
            test.is_nil(err, tostring(err))
            local reply, expired = gateway.handle(id, prepared.gateway_token, {jsonrpc = "2.0", id = 1, method = "tools/list"})
            test.is_nil(reply); test.eq(expired:details().code, "autocode.gateway_credential_invalid")
        end)
        test.it("renders native gateway configuration for every activated MCP batch harness", function()
            local all, list_err = drivers.list()
            test.is_nil(list_err)
            local checked = 0
            for _, driver in ipairs(all) do
                if gateway.supports(driver.id) then
                    local launch, launch_err = drivers.launch(driver.id, {profile_id = "batch", brief = "recorded fixture", home = "/opt/agent", options = {}, unattended = false,
                        placement = {kind = "container", network = "bridge", allows = driver.capabilities, mounts = {}},
                        gateway = {endpoint = "host.docker.internal:19347/autocode-gateway", action_id = "fixture", tools = {"gateway_echo"}, hooks = {}, token_environment = "AUTOCODE_GATEWAY_TOKEN"}})
                    test.is_nil(launch_err, driver.id .. ": " .. tostring(launch_err))
                    local script, script_err = container.script({id = "env:KEY", variable = "KEY"}, "fixture", "/opt/agent", "/work", "", launch, 60)
                    test.is_nil(script_err, driver.id .. ": " .. tostring(script_err))
                    checked = checked + 1
                end
            end
            test.is_true(checked >= 2)
        end)
        test.it("refuses tool surfaces on a batch profile without MCP support", function()
            local resolved, err = gateway.resolve({tools = {"app:gateway_echo"}}, "pi")
            test.is_nil(resolved)
            test.is_true(errors.is(err, errors.INVALID), tostring(err))
        end)
        test.it("appends the router prefix to configured and overridden gateway authorities", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
            test.not_nil(json.encode(prepared.launch):find("http://host.docker.internal:19347/autocode-gateway/mcp/" .. id, 1, true), "prepared driver URL must include the module router prefix")
            for _, endpoint in ipairs({"", "image.example:8080", "workspace.example:9090"}) do
                local seeded, seed_err = identity.call(user, "app:gateway_seed", {account_id = prepared.account_id, image_id = prepared.image.id, tools = {}})
                test.is_nil(seed_err, tostring(seed_err))
                local issued, err = gateway.issue(seeded.run_id, {tools = {}, context = {}}, endpoint, 60000)
                test.is_nil(err, tostring(err))
                local authority = endpoint == "" and "host.docker.internal:19347" or endpoint
                test.eq(issued.gateway.endpoint, authority .. "/autocode-gateway")
            end
            for _, endpoint in ipairs({"host.example:8080/autocode-gateway", "http://host.example:8080"}) do
                local issued, err = gateway.issue(id, {tools = {}, context = {}}, endpoint, 60000)
                test.is_nil(issued)
                test.is_true(errors.is(err, errors.INVALID), tostring(err))
                test.not_nil(tostring(err):find("host and port", 1, true))
            end
        end)
        test.it("lists exactly bound tools, dispatches as owner with context and logs tool events", function()
            local user = f.member()
            local id, prepared = run_for(user, {traits = {"app:gateway_trait"}, tools = {"app:gateway_denied"}, context = {board_id = "board-a"}})
            local token = prepared.gateway_token
            test.not_nil(token)
            local stored = repo.stored_run(id)
            test.eq(stored.status, "queued", stored.error)
            test.is_nil(stored.pending_status)
            test.not_nil(stored.gateway)
            test.eq(stored.gateway.token_hash, require("hash").sha256(token))
            test.is_true(stored.gateway.expires_at > repo.now(), stored.gateway.expires_at .. " vs " .. repo.now())
            local init, init_err = gateway.handle(id, token, {jsonrpc = "2.0", id = 1, method = "initialize", params = {protocolVersion = "2025-03-26", capabilities = {}, clientInfo = {name = "fixture", version = "1"}}})
            test.not_nil(init, tostring(init_err))
            test.eq(init.result.protocolVersion, "2025-03-26")
            local response, http_err = http_client.request("POST", identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/mcp/" .. id,
                {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. token}, body = json.encode({jsonrpc = "2.0", id = 2, method = "tools/list"})})
            test.is_nil(http_err, tostring(http_err))
            test.eq(response.status_code, 200, response.body)
            test.eq(#json.decode(response.body).result.tools, 2)
            local listed = gateway.handle(id, token, {jsonrpc = "2.0", id = 2, method = "tools/list", params = {}})
            test.eq(#listed.result.tools, 2)
            test.eq(listed.result.tools[1].name, "gateway_echo")
            local called, call_err = gateway.handle(id, token, {jsonrpc = "2.0", id = 3, method = "tools/call", params = {name = "gateway_echo", arguments = {text = "hello"}}})
            test.is_nil(call_err, tostring(call_err))
            local result = json.decode(called.result.content[1].text)
            test.eq(result.owner, user.id); test.eq(result.board_id, "board-a")
            local denied = gateway.handle(id, token, {jsonrpc = "2.0", id = 4, method = "tools/call", params = {name = "NotBound", arguments = {}}})
            test.not_nil(denied.error)
            local events = repo.events(id, 0)
            test.eq(#events, 2); test.eq(events[1].kind, "tool_call"); test.eq(events[2].kind, "tool_result")
            local db = sql.get("app:db")
            local rows = db:query("SELECT options, tools, gateway FROM chestor_autocode_runs WHERE id = $1", {id})
            db:release()
            test.is_nil(json.encode(rows):find(token, 1, true))
            test.not_nil(json.encode(prepared.launch):find("Use the bound board", 1, true))
            test.is_nil(json.encode(prepared.launch):find(token, 1, true))
        end)
        test.it("records bearer-authenticated hooks beneath the module prefix", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
            local url = identity.container_url():gsub("host%.docker%.internal", "127.0.0.1") .. "/autocode-gateway/hook/" .. id
            local response, err = http_client.request("POST", url,
                {headers = {["Content-Type"] = "application/json", Authorization = "Bearer " .. prepared.gateway_token}, body = json.encode({event = "observed"})})
            test.is_nil(err, tostring(err))
            test.eq(response.status_code, 200, response.body)
            local events = repo.events(id, 0)
            test.eq(#events, 1)
            test.eq(events[1].kind, "hook")
            local denied, denied_err = http_client.request("POST", url,
                {headers = {["Content-Type"] = "application/json"}, body = json.encode({event = "observed"})})
            test.is_nil(denied_err, tostring(denied_err))
            test.eq(denied.status_code, 401, denied.body)
            test.eq(#repo.events(id, 0), 1)
        end)
        test.it("refuses a tool beyond the owner grant and never stores or returns a bearer", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_denied", "app:gateway_echo"}, context = {board_id = "board-b"}})
            local token = prepared.gateway_token
            local response = gateway.handle(id, token, {jsonrpc = "2.0", id = 1, method = "tools/call", params = {name = "gateway_denied", arguments = {}}})
            test.is_true(response.result.isError)
            test.is_nil(response.result.content[1].text:find("entered a denied tool", 1, true), response.result.content[1].text)
            local echoed = gateway.handle(id, token, {jsonrpc = "2.0", id = 2, method = "tools/call", params = {name = "gateway_echo", arguments = {text = token}}})
            test.is_nil(json.encode(echoed):find(token, 1, true))
            test.is_nil(json.encode(repo.events(id, 0)):find(token, 1, true))
        end)
        test.it("allocates one ordered log across concurrent runner and tool writes", function()
            local user = f.member()
            local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
            local done = channel.new(12)
            for index = 1, 12 do
                coroutine.spawn(function()
                    if index % 2 == 0 then
                        local _, err = gateway.handle(id, prepared.gateway_token, {jsonrpc = "2.0", id = index, method = "tools/call", params = {name = "gateway_echo", arguments = {text = "test"}}})
                        done:send({error = err})
                    else done:send({error = repo.append_event(id, "log", "runner output")}) end
                end)
            end
            for _ = 1, 12 do test.is_nil(done:receive().error) end
            local events = repo.events(id, 0)
            test.eq(#events, 18)
            for index, event in ipairs(events) do test.eq(event.seq, index) end
        end)
        test.it("revokes every terminal status", function()
            local user = f.member()
            for _, status in ipairs({"succeeded", "failed", "cancelled"}) do
                local id, prepared = run_for(user, {tools = {"app:gateway_echo"}})
                test.is_true(repo.finish_run(id, status, "", "", {}))
                test.is_nil(gateway.handle(id, prepared.gateway_token, {jsonrpc = "2.0", id = 1, method = "tools/list"}))
            end
        end)
        test.it("fences tokens to one live run and its expiry and revokes at durable outcome", function()
            local user = f.member()
            local a, first = run_for(user, {tools = {"app:gateway_echo"}})
            local b, second = run_for(user, {tools = {"app:gateway_echo"}})
            local request = {jsonrpc = "2.0", id = 1, method = "tools/list"}
            test.is_nil(gateway.handle(b, first.gateway_token, request))
            test.not_nil(gateway.handle(b, second.gateway_token, request))
            test.is_nil(repo.record_run_outcome(a, "succeeded", "", "", {}))
            test.is_nil(gateway.handle(a, first.gateway_token, request))
            local db = sql.get("app:db")
            local binding = repo.stored_run(b).gateway
            binding.expires_at = "2000-01-01T00:00:00Z"
            db:execute("UPDATE chestor_autocode_runs SET gateway = $1 WHERE id = $2", {json.encode(binding), b}); db:release()
            test.is_nil(gateway.handle(b, second.gateway_token, request))
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

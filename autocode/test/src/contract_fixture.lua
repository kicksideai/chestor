-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local identity = require("identity")
local build_fixture = require("build_fixture")
local registry = require("registry")
local json = require("json")
local sql = require("sql")
local uuid = require("uuid")
local function new()
    local users = {}
    local function member()
        local user = identity.member()
        users[#users + 1] = user
        return user
    end
    local function call(user, method, input, contract)
        local result, err = identity.call(user, "app:task_probe", {method = method, input = input, contract = contract})
        if result then
            local definition = registry.get(contract or "chestor.autocode:tasks")
            for _, declared in ipairs(definition.data.methods) do
                if declared.name == method then
                    local valid, problem = json.validate(declared.output_schemas[1].definition, result)
                    test.eq(valid, true, tostring(problem))
                end
            end
        end
        return result, err
    end
    local function image_for(user)
        local admin = identity.admin()
        users[#users + 1] = admin
        local list = call(user, "list_agents", {})
        local allows
        for _, agent in ipairs(list.agents) do if agent.id == "claude" then allows = agent.capabilities end end
        local image, err = identity.call(admin, "app:fixture_register", "image", {title = "fixture", ref = "chestor-autocode-harness:missing", home = "/opt/agent", agents = {"claude"}, status = "ready"}, {settings = {network = "none", allows = allows}})
        test.is_nil(err)
        build_fixture.ready(image, admin.id, "chestor-autocode-harness:missing", "/opt/agent", {network = "none", allows = allows})
        local shared = identity.request(admin, "POST", "/component-access/share/" .. image, {subject_id = user.id, subject_type = "user", access_mask = 1})
        test.eq(shared.status, 200, shared.body)
        return image
    end
    local function flow_for(user)
        local id = uuid.v7()
        local db = sql.get("app:db")
        local _, err = db:execute([[INSERT INTO dataflows
            (dataflow_id, actor_id, type, status, created_at, updated_at)
            VALUES ($1, $2, 'test', 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)]], {id, user.id})
        db:release()
        test.is_nil(err)
        return id
    end
    return {users = users, member = member, call = call, image_for = image_for, flow_for = flow_for,
        release = function()
            while #users > 0 do identity.release(table.remove(users)) end
        end}
end
return {new = new}

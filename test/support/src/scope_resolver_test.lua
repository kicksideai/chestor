local funcs = require("funcs")
local security = require("security")
local registry = require("registry")
local errors = require("errors")
local test = require("test")
local identity = require("execution_identity")
local resolver = require("resolver")
local CONFIG = "chestor.test_support:config"
local TARGET = "chestor.test_support:scope_resolver"

local function resolve(args: any, actor: any?): (any, any)
    local execute = funcs.new()
    if actor then execute = execute:with_actor(actor) end
    return execute:call(TARGET, args)
end
local function check(principal: any, ambient: boolean)
    local key = identity.actor_key(principal)
    local actor = assert(security.new_actor(key, {}))
    local value, err = resolve(ambient and {} or { principal = principal }, actor)
    test.is_nil(err)
    test.not_nil(value)
    test.eq(value.principal.kind, principal.kind)
    test.eq(value.principal.id, principal.id)
    test.eq(value.actor_id, key)
    test.eq(value.scope_name, "wippy.security:process")
    test.eq(#value.groups, 1)
    local config = assert(registry.get(CONFIG))
    local config_meta: any = config.meta
    test.eq(value.groups[1], config_meta.group)
    test.eq(value.meta.status, "active")
    test.eq(value.meta.user_id, principal.kind == identity.KIND.USER and principal.id or nil)
end

local function define()
    test.describe("Shared scope resolver contract", function()
        test.it("resolves explicit USER, GROUP and SERVICE principals exactly", function()
            for _, kind in ipairs({ identity.KIND.USER, identity.KIND.GROUP, identity.KIND.SERVICE }) do
                check({ kind = kind, id = "principal-id" }, false)
            end
        end)
        test.it("derives the principal from the ambient actor key", function()
            for _, kind in ipairs({ identity.KIND.USER, identity.KIND.GROUP, identity.KIND.SERVICE }) do
                check({ kind = kind, id = "ambient-id" }, true)
            end
        end)
        test.it("preserves typed invalid-principal failures", function()
            for _, principal in ipairs({ false, "user", {}, {kind="robot",id="id"},
                {kind="user",id=""}, {kind="user",id=23}, {kind="user",id="a:b"}, {kind="user",id="a b"} }) do
                local expected, expected_err = identity.check_principal(principal, "principal")
                test.is_nil(expected)
                local value, err = resolve({ principal = principal })
                test.is_nil(value)
                test.is_true(errors.is(err, errors.INVALID))
                test.eq(err:message(), expected_err:message())
                test.eq(err:retryable(), expected_err:retryable())
            end
        end)
        test.it("exposes an invalid or missing ambient actor", function()
            local value, err = resolve({}, assert(security.new_actor("service:", {})))
            test.is_nil(value)
            test.is_true(errors.is(err, errors.INVALID))
        end)

        test.it("preserves identity and registry errors and refuses an absent actor", function()
            local failure = errors.new({ kind = errors.UNAVAILABLE, message = "opaque fixture failure", retryable = true })
            local fixture = resolver.new({
                security = { actor = function() return nil end },
                registry = { get = function() return { meta = { group = "fixture" } }, nil end },
                execution_identity = identity,
            })
            local value, err = fixture.resolve({})
            test.is_nil(value)
            test.is_true(errors.is(err, errors.INVALID))
            local registry_fault = resolver.new({ registry = { get = function() return nil, failure end } })
            local missing, registry_err = registry_fault.resolve({ principal = { kind = "user", id = "id" } })
            test.is_nil(missing)
            test.eq(registry_err, failure)
            local check_fault = resolver.new({
                registry = { get = function() return { meta = { group = "fixture" } }, nil end },
                execution_identity = { check_principal = function() return nil, failure end },
            })
            local invalid, check_err = check_fault.resolve({ principal = { kind = "user", id = "id" } })
            test.is_nil(invalid)
            test.eq(check_err, failure)
            local key_fault = resolver.new({
                registry = { get = function() return { meta = { group = "fixture" } }, nil end },
                security = { actor = function() return nil end },
                execution_identity = { principal_of_key = function() return nil, failure end },
            })
            local absent, key_err = key_fault.resolve({})
            test.is_nil(absent)
            test.eq(key_err, failure)
        end)

        test.it("uses the injected group and owns the only default scope binding", function()
            local config, err = registry.get(CONFIG)
            test.is_nil(err)
            local meta: any = config.meta
            test.is_true(type(meta.group) == "string" and meta.group ~= "")
            local value, resolve_err = funcs.new():call(TARGET, { principal = { kind = "user", id = "shared-user" } })
            test.is_nil(resolve_err)
            test.eq(#value.groups, 1)
            test.eq(value.groups[1], meta.group)
            local bindings, find_err = registry.find({ [".kind"] = "contract.binding" })
            test.is_nil(find_err)
            local count = 0
            for _, entry in ipairs(bindings or {}) do
                local data: any = entry.data or entry
                for _, binding in ipairs(data.contracts or {}) do
                    if binding.contract == "kickside.contract:scope_resolver" and binding.default then
                        count = count + 1
                        test.eq(entry.id, "chestor.test_support:scope_resolver_binding")
                        test.eq(binding.methods.resolve, TARGET)
                    end
                end
            end
            test.eq(count, 1)
        end)

        test.it("returns a typed error for missing, empty or malformed group configuration", function()
            local original, get_err = registry.get(CONFIG)
            test.is_nil(get_err)
            local original_meta: any = original.meta
            for _, group in ipairs({ false, "", "   ", 19, {} }) do
                local snapshot = assert(registry.snapshot())
                local changes = snapshot:changes()
                local config_meta: any = { group = group }
                if group == false then config_meta.group = nil end
                changes:update({ id = CONFIG, kind = "registry.entry", meta = config_meta, data = {} })
                local _, apply_err = changes:apply()
                test.is_nil(apply_err)
                local value, err = funcs.new():call(TARGET, { principal = { kind = "user", id = "shared-user" } })
                local restore_snapshot = assert(registry.snapshot())
                local restore = restore_snapshot:changes()
                restore:update({ id = CONFIG, kind = "registry.entry", meta = original_meta, data = {} })
                local _, restore_err = restore:apply()
                test.is_nil(restore_err)
                test.is_nil(value)
                test.is_true(errors.is(err, errors.INVALID))
            end
        end)
    end)
end
return { run = test.run_cases(define) }

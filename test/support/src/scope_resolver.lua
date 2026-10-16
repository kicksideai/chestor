local security = require("security")
local registry = require("registry")
local errors = require("errors")
local execution_identity = require("execution_identity")

local function construct(dependencies: any): any
    local resolver_security = dependencies.security or security
    local resolver_registry = dependencies.registry or registry
    local identity = dependencies.execution_identity or execution_identity
    local M = {}

    function M.resolve(args: any): (any?, error?)
        local config, config_err = resolver_registry.get("chestor.test_support:config")
        if config_err then return nil, config_err end
        local config_meta: any = config and config.meta or nil
        local group: any = type(config_meta) == "table" and config_meta.group or nil
        if type(group) ~= "string" or group:match("^%s*$") then
            return nil, errors.new({ kind = errors.INVALID, message = "test-support group must be a nonempty string", retryable = false })
        end
        local principal: any = nil
        if type(args) == "table" then principal = (args :: any).principal end
        if principal == nil then
            local actor = resolver_security.actor()
            local keyed, key_err = identity.principal_of_key(actor and actor:id() or nil)
            if key_err or not keyed then return nil, key_err end
            principal = keyed
        end
        local checked, check_err = identity.check_principal(principal, "principal")
        if check_err or not checked then return nil, check_err end
        local meta: { [string]: any } = { status = "active" }
        if (checked :: any).kind == identity.KIND.USER then meta.user_id = (checked :: any).id end
        return {
            principal = checked,
            actor_id = identity.actor_key(checked :: any),
            groups = { group },
            scope_name = "wippy.security:process",
            meta = meta,
        }, nil
    end

    return M
end

local M = construct({})
M.new = construct
return M

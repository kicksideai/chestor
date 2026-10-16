-- Test-only v2 kickside.contract:scope_resolver. It answers the requested
-- principal as live and active with the harness process scope. The Users
-- module owns the real admission rules; Journal tests exercise Core's handling
-- of the resolved principal.
local security = require("security")
local execution_identity = require("execution_identity")

local M = {}

function M.resolve(args: any): (any?, error?)
    local principal: any = type(args) == "table" and (args :: any).principal or nil
    if principal == nil then
        local actor = security.actor()
        local keyed, key_err = execution_identity.principal_of_key(actor and actor:id() or nil)
        if key_err or not keyed then return nil, key_err end
        principal = keyed
    end
    local checked, check_err = execution_identity.check_principal(principal, "principal")
    if check_err or not checked then return nil, check_err end
    local meta: { [string]: any } = { status = "active" }
    if (checked :: any).kind == execution_identity.KIND.USER then meta.user_id = (checked :: any).id end
    return {
        principal = checked,
        actor_id = execution_identity.actor_key(checked :: any),
        groups = { "journal_test" },
        scope_name = "wippy.security:process",
        meta = meta,
    }, nil
end

return M

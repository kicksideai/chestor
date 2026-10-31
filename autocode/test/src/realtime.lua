-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Apply the production authorization check without needing connected relay clients.
local policy = require("policy")
local security = require("security")
local sql = require("sql")
local uuid = require("uuid")
local json = require("json")
local function notify(args)
    local actor = security.actor()
    local allowed = policy.can_notify(args.user_id)
    local policies = {}
    for _, item in ipairs(security.scope():policies()) do policies[#policies + 1] = item:id() end
    local db = sql.get("app:db")
    local _, write_err = db:execute([[INSERT INTO autocode_test_notify
        (id, owner_id, actor_id, topic, policies, allowed, user_notify, service_notify)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)]], {uuid.v7(), args.user_id, actor and actor:id() or "",
        args.topic, json.encode(policies), allowed and 1 or 0,
        security.can("realtime.notify", "kickside.realtime:user:" .. args.user_id) and 1 or 0,
        security.can("realtime.notify", "kickside.realtime:notify") and 1 or 0})
    local faults, read_err = db:query("SELECT mode FROM autocode_test_notify_fault WHERE owner_id = $1", {args.user_id})
    db:release()
    if write_err or read_err then return nil, write_err or read_err end
    if not allowed then return {success = false, error = "access denied"} end
    if faults[1] and args.topic == "chestor.autocode.runs" then
        if faults[1].mode == "denied" then return {success = false, error = "access denied"} end
        return nil, errors.new({kind = errors.UNAVAILABLE, message = "injected realtime delivery failure", retryable = true})
    end
    return {success = true}
end
return {notify = notify}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Live run updates for the owner's open autocode views over
-- kickside.contract:realtime. The topic names what changed; the view reads
-- the committed state from the module endpoints. Account, image and
-- workspace changes reach views on their component topics.
local contract = require("contract")
local funcs = require("funcs")
local component = require("component")

local M = {}

-- A run's status changed: the run list refreshes.
M.RUNS_TOPIC = "chestor.autocode.runs"

-- A run recorded events or changed status: its open view reads them.
function M.run_topic(run_id: string): string
    return "chestor.autocode.run." .. run_id
end

-- notify tells the owner's connected clients that topic changed. Delivery is
-- a no-op when the owner has no open client.
type Realtime = {notify: (self: Realtime, {user_id: string, topic: string, data: {[string]: unknown}}) -> (unknown, error?)}
local function realtime(): (Realtime?, error?)
    -- Opened contracts retain their actor and scope. A pooled Lua worker can
    -- serve another Flow owner next, so never cache an execution-bound instance.
    local definition, definition_err = contract.get("kickside.contract:realtime")
    if definition_err or not definition then return nil, definition_err end
    local instance, open_err = definition:open()
    if open_err or not instance then return nil, open_err end
    if (type(instance) ~= "table" and type(instance) ~= "userdata") or type(instance.notify) ~= "function" then
        return nil, errors.new({kind = errors.INTERNAL, message = "realtime contract has no notify method"})
    end
    return instance :: Realtime, nil
end

-- The component service resolves the current READ audience, including group
-- and inherited grants; no worker selects notification recipients.
function M.account(account_id: string): error?
    local _, project_err = funcs.call("chestor.autocode.persist:project_account", {account_id = account_id})
    if project_err then
        if errors.is(project_err, errors.NOT_FOUND) then return nil end
        return errors.wrap(project_err, "account state projection")
    end
    local result, err = component.notify_access(account_id, nil, {event = "autocode.account.changed"})
    if err then return err end
    if not result or result.success ~= true then
        return errors.new({kind = errors.UNAVAILABLE, message = "account notification refused", retryable = true,
            details = {code = "autocode.account_notification_failed"}})
    end
    return nil
end

function M.notify(owner_id: string, topic: string): error?
    local service, open_err = realtime()
    if not service then return open_err end
    local result, notify_err = service:notify({user_id = owner_id, topic = topic, data = {}})
    if notify_err then return errors.wrap(notify_err, "realtime notify") end
    if type(result) ~= "table" or result.success ~= true then
        return errors.new({message = "realtime notify refused: " .. tostring(type(result) == "table" and result.error or "no result"),
            kind = errors.PERMISSION_DENIED})
    end
    return nil
end

return M

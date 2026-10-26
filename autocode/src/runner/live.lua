-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Live run updates for the owner's open autocode views over
-- kickside.contract:realtime. The topic names what changed; the view reads
-- the committed state from the module endpoints. Account, image and
-- workspace changes reach views as component meta changes.
local contract = require("contract")

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
local opened: Realtime? = nil

local function realtime(): (Realtime?, error?)
    if opened then return opened, nil end
    local definition, definition_err = contract.get("kickside.contract:realtime")
    if definition_err or not definition then return nil, definition_err end
    local instance, open_err = definition:open()
    if open_err or not instance then return nil, open_err end
    if (type(instance) ~= "table" and type(instance) ~= "userdata") or type(instance.notify) ~= "function" then
        return nil, errors.new({kind = errors.INTERNAL, message = "realtime contract has no notify method"})
    end
    opened = instance :: Realtime
    return opened, nil
end

function M.notify(owner_id: string, topic: string): error?
    local service, open_err = realtime()
    if not service then return open_err end
    local result, notify_err = service:notify({user_id = owner_id, topic = topic, data = {}})
    if notify_err then return errors.new({kind = errors.UNAVAILABLE, message = "realtime notify: " .. tostring(notify_err)}) end
    if type(result) ~= "table" or result.success ~= true then
        return errors.new({message = "realtime notify refused: " .. tostring(type(result) == "table" and result.error or "no result"),
            kind = errors.PERMISSION_DENIED})
    end
    return nil
end

return M

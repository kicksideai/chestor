-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stubs = require("stubs")

local function notify(change)
    local state = stubs.state
    state.retention_changes = state.retention_changes or {}
    table.insert(state.retention_changes, change)
    if state.retention_notify_error then return nil, state.retention_notify_error end
    return true, nil
end

return {notify = notify}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local process = require("process")
local function run(input)
    local pid = process.registry.lookup("app:idle_queue_probe", process.registry.CONSISTENT)
    if pid then
        assert(process.send(pid, "idle_queue_pass", {kind = input and input.change and input.change.kind or "deadline"}))
    end
    return {success = true, deleted = 0}
end
return {run = run}

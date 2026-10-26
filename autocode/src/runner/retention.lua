-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Run retention on the Core retention tick: runs that settled longer ago
-- than the run_retention setting are deleted with their event logs, a
-- bounded batch per tick.
local repo = require("repo")
local settings = require("settings")
local time = require("time")

local BATCH = 500

local function run(): {[string]: unknown}
    local retention, setting_err = settings.get("run_retention")
    if not retention then return {success = false, error = setting_err} end
    local duration, parse_err = time.parse_duration(retention)
    if parse_err or not duration then
        return {success = false, error = errors.new({kind = errors.INVALID, message = "run_retention is not a duration: " .. retention})}
    end
    if duration:seconds() <= 0 then
        return {success = false, error = errors.new({kind = errors.INVALID, message = "run_retention must be positive: " .. retention})}
    end
    local before = time.now():add(-duration:nanoseconds()):utc():format_rfc3339()
    local deleted, err = repo.prune_runs(before, BATCH)
    if err then return {success = false, error = err} end
    return {success = true, deleted = deleted}
end

return { run = run }

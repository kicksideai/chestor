-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Core continues full pages and wakes again at the next run expiry.
local prune = require("prune")
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
    local deleted, err, progress = prune.prune_runs(before, BATCH)
    if err then return {success = false, error = err} end
    if deleted == nil or not progress then
        return {success = false, error = errors.new({kind = errors.INTERNAL, message = "run retention returns no progress"})}
    end
    local deadline_ms: integer? = nil
    if progress.next_finished_at then
        local finished, time_err = time.parse(time.RFC3339, progress.next_finished_at)
        if time_err or not finished then
            return {success = false, error = time_err or errors.new({kind = errors.INTERNAL, message = "run retention has an invalid finished time"})}
        end
        -- Stored run timestamps and the strict cutoff have second precision.
        deadline_ms = (finished:unix() * 1000 + duration:milliseconds() + 1000) :: integer
    end
    return {success = true, deleted = deleted, needs_continue = progress.needs_continue,
        deadline_ms = deadline_ms}
end

return { run = run }

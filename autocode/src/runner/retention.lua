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
    local queue_window, queue_err = settings.get("queue_timeout")
    if not queue_window then return {success = false, error = queue_err} end
    local queue_duration, queue_parse_err = time.parse_duration(queue_window)
    if not queue_duration or queue_duration:nanoseconds() <= 0 then
        return {success = false, error = queue_parse_err or errors.new({kind = errors.INVALID, message = "queue_timeout must be a positive duration"})}
    end
    local queue_before = time.now():add(-queue_duration:nanoseconds()):utc():format_rfc3339()
    local queue_more, expire_err, next_queued = prune.expire_queued(queue_before, BATCH)
    if expire_err then return {success = false, error = expire_err} end
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
    if next_queued then
        local created, created_err = time.parse(time.RFC3339, next_queued)
        if not created then return {success = false, error = created_err} end
        local queue_deadline = (created:unix() * 1000 + queue_duration:milliseconds() + 1000) :: integer
        deadline_ms = deadline_ms and math.min(deadline_ms, queue_deadline) or queue_deadline
    end
    return {success = true, deleted = deleted, needs_continue = progress.needs_continue or queue_more,
        deadline_ms = deadline_ms}
end

return { run = run }

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reads the autocode settings administrators edit on the Settings page; each
-- one is declared with its default in the module root.
local contract = require("contract")
local time = require("time")

local SETTINGS = "kickside.settings:settings"
local NAMESPACE = "chestor.autocode"

type Key = "run_timeout" | "image_build_timeout" | "account_cooldown" | "run_retention" | "build_cache_retention" | "workflow_delivery_timeout" | "queue_timeout"

local job_outcome = require("job_outcome")

-- Seven days fit the run timeout INTEGER column on both database engines.
local M = {MAX_RUN_TIMEOUT_MS = 604800000}
M.INTEGER_BOUNDS = {
    run_event_count = {4, 100000}, run_event_bytes = {1024, 1073741824},
    pending_runs_per_owner = {1, 100000}, pending_runs_global = {1, 1000000},
    result_bytes = {1024, 67108864}, event_text_bytes = {256, 1048576},
    build_log_bytes = {1024, 16777216}, clone_depth = {0, 1000000},
}

-- get returns a duration setting as the string an administrator stored, or
-- its declared default.
function M.get(key: Key): (string?, error?)
    local definition, definition_err = contract.get(SETTINGS)
    if not definition then return nil, definition_err end
    local instance, open_err = definition:open()
    if not instance then return nil, open_err end
    local result, get_err = instance:get({namespace = NAMESPACE, key = key})
    if get_err then return nil, job_outcome.native(get_err) end
    if type(result) ~= "table" or result.success ~= true or type(result.value) ~= "string" then
        return nil, errors.new({kind = errors.INTERNAL, message = "setting " .. NAMESPACE .. "." .. key .. " has no duration value"})
    end
    return result.value, nil
end

local function integer_setting(key: string): (integer?, error?)
    local definition, err = contract.get(SETTINGS)
    if not definition then return nil, err end
    local instance, open_err = definition:open()
    if not instance then return nil, open_err end
    local result, get_err = instance:get({namespace = NAMESPACE, key = key})
    if get_err then return nil, job_outcome.native(get_err) end
    if type(result) ~= "table" or result.success ~= true or type(result.value) ~= "number"
        or result.value % 1 ~= 0 then
        return nil, errors.new({kind = errors.INTERNAL, message = "setting " .. key .. " has no integer value"})
    end
    local bounds = M.INTEGER_BOUNDS[key]
    if not bounds or result.value < bounds[1] or result.value > bounds[2] then
        return nil, errors.new({kind = errors.INVALID, message = "setting " .. key .. " is out of range"})
    end
    return result.value :: integer, nil
end

M.integer = integer_setting

function M.event_limits(): (integer?, integer?, error?)
    local count, err = integer_setting("run_event_count")
    if not count then return nil, nil, err end
    local bytes, bytes_err = integer_setting("run_event_bytes")
    if not bytes then return nil, nil, bytes_err end
    if count < 4 or count > 100000 or bytes < 1024 or bytes > 1073741824 then
        return nil, nil, errors.new({kind = errors.INVALID, message = "run event limits are out of range"})
    end
    return count, bytes, nil
end

-- Workers enforce the same window before preparation or container effects.
function M.check_queue(created_at: string): error?
    local value, err = M.get("queue_timeout")
    if not value then return err end
    local window, window_err = time.parse_duration(value)
    if not window or window:nanoseconds() <= 0 then
        return window_err or errors.new({kind = errors.INVALID, message = "queue_timeout must be a positive duration"})
    end
    local created, created_err = time.parse(time.RFC3339, created_at)
    if not created then return created_err end
    if not time.now():before(created:add(window:nanoseconds())) then
        return errors.new({kind = errors.UNAVAILABLE, message = "run queue window expired before execution started",
            retryable = false, details = {code = "autocode.queue_expired"}})
    end
    return nil
end
return M

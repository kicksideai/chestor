-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /autocode/maintenance/prune — reclaim Docker space: stopped autocode
-- containers, dangling image layers, and expired build cache.
local maintenance = require("maintenance")
local settings = require("settings")
local time = require("time")

local function cache_retention(): (string?, error?)
    local value, err = settings.get("build_cache_retention")
    if not value then return nil, err end
    local duration, parse_err = time.parse_duration(value)
    if not duration or duration:nanoseconds() <= 0 then
        return nil, errors.new({kind = errors.INVALID, message = "build cache retention must be a positive duration"})
    end
    return value:gsub("^%+", ""), nil
end

local function prune(): (maintenance.Result?, error?)
    local retention, retention_err = cache_retention()
    if not retention then return nil, retention_err end
    return maintenance.prune(retention)
end

return {prune = prune, cache_retention = cache_retention}

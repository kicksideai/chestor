-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local settings = require("settings")
type Input = {key: string, value: unknown}
local function validate(input: Input): (boolean?, error?)
    if input.key == "run_event_count" or input.key == "run_event_bytes" then
        local minimum = input.key == "run_event_count" and 4 or 1024
        local maximum = input.key == "run_event_count" and 100000 or 1073741824
        if type(input.value) ~= "number" or input.value % 1 ~= 0 or input.value < minimum or input.value > maximum then
            return nil, errors.new({kind = errors.INVALID, message = input.key .. " must be an integer between " .. tostring(minimum) .. " and " .. tostring(maximum)})
        end
        return true, nil
    end
    if type(input.value) ~= "string" then
        return nil, errors.new({kind = errors.INVALID, message = "setting must be a duration"})
    end
    local duration, err = time.parse_duration(input.value)
    if not duration then return nil, err end
    if input.key == "run_timeout" or input.key == "image_build_timeout" then
        if duration:milliseconds() < 60000 then
            return nil, errors.new({kind = errors.INVALID, message = input.key .. " must be at least a minute"})
        end
        if duration:milliseconds() > settings.MAX_RUN_TIMEOUT_MS then
            return nil, errors.new({kind = errors.INVALID, message = input.key .. " must be at most 7 days (168h)"})
        end
        return true, nil
    end
    if duration:nanoseconds() <= 0 then
        return nil, errors.new({kind = errors.INVALID, message = input.key .. " must be a positive duration"})
    end
    return true, nil
end
return {validate = validate}

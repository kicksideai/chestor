-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local settings = require("settings")
type Input = {key: string, value: unknown}
local function validate(input: Input): (boolean?, error?)
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

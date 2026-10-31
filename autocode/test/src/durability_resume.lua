-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stubs = require("stubs")
local resume = require("resume")
local function run(input)
    local state = stubs.reset()
    state.resume_error = input.job.attempt_no <= 5
    return resume.run(input)
end
return {run = run}

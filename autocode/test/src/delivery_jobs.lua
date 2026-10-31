-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local jobs = require("jobs")
local function enqueue_tx(tx, dbtype, params)
    if params.key == "run" then params.job_type = "app:durability_probe" end
    if params.key == "resume" then params.job_type = "app:durability_resume" end
    if params.key:sub(1, 6) == "build:" then params.job_type = "app:active_build_probe" end
    return jobs.enqueue_tx(tx, dbtype, params)
end
return {enqueue_tx = enqueue_tx}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local runs = require("runs")
local builds = require("builds")
local result = {}
for key, value in pairs(repo) do result[key] = value end
result.create_run = runs.create_run
result.finish_run = runs.finish_run
result.request_image_build = builds.request_image_build
return result

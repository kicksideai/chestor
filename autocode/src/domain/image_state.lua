-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local recipe = require("recipe")
local json = require("json")
type Build = {finished_at: string, status: string, projected: boolean, recipe: recipe.Recipe?, approved_recipe: recipe.Recipe?,
    agents: {string}, approved_agents: {string}, last_error: string, error_native: {[string]: unknown}?}
local M = {}
function M.fields(build: Build?, approving: boolean?): {[string]: unknown}
    if not build then return {status = "unprepared", usable = false, agents = {}, last_error = "", error_native = "{}"} end
    local ready = approving == true and build.finished_at ~= "" and build.status == "ready" and not build.projected
    local approved = ready and build.recipe or build.approved_recipe
    local usable = approved ~= nil and recipe.valid_extra_args(approved.settings.extra_args)
    return {status = build.finished_at == "" and "preparing" or build.status,
        usable = usable, agents = usable and (ready and build.agents or build.approved_agents) or {},
        last_error = build.last_error, error_native = json.encode(build.error_native or {})}
end
return M

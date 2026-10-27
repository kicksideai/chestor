-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local stubs = require("stubs")
local repo = require("repo")
local runner = require("runner")
local function main(input)
    local state = stubs.reset()
    state.run = repo.stored_run(input.payload.run_id)
    state.prepared = stubs.preparation(state.run)
    state.terminal = {outcome = "succeeded", answer = "complete answer", usage = {input_tokens = 42}}
    state.remove_error = input.job.attempt_no <= 2
    return runner.main(input)
end
local function build(input)
    local db = require("sql").get("app:db")
    local _, err = db:execute("UPDATE chestor_autocode_image_builds SET log = 'active' WHERE image_id = $1", {input.payload.image_id})
    db:release()
    if err then error(err) end
    require("time").sleep("120s")
    return {ok = true}
end
return {main = main, build = build}

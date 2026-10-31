-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local docker = require("docker")
local stubs = require("stubs")
return {remove = docker.remove, ensure_removed = docker.ensure_removed, run = function(args, options)
    local code, err = docker.run(args, options)
    local after = stubs.state.after_build
    if args[1] == "build" and code == 0 and not err and after then
        stubs.state.after_build = nil
        after()
    end
    return code, err
end}

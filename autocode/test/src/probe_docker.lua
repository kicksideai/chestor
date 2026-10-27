-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The harness exercises container reconciliation without pruning unrelated images and caches.
local docker = require("docker")
return {remove = docker.remove, run = function(args, options)
    if args[2] == "prune" then return 0 end
    return docker.run(args, options)
end}

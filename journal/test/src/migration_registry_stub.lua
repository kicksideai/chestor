local clock = require("clock")
local M = {}
function M.find(_criteria: any): (any?, string?)
    if clock.failure == "registry" then return nil, "registry unavailable" end
    return { { id = "first" }, { id = "last" } }, nil
end
return M

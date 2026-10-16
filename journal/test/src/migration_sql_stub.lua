local clock = require("clock")
local M = {}
function M.get(_id: string): (any?, string?)
    local handle: any = {}
    handle.release = function() end
    handle["type"] = function(): (string, nil) return "sqlite", nil end
    handle.query = function(_: any, statement: string): (any?, string?)
        if clock.failure == "database" then return nil, "database unavailable" end
        if statement:find("sqlite_master", 1, true) then return { { name = "_migrations" } }, nil end
        if statement:find("FROM _migrations", 1, true) then
            if clock.sleeps == 0 then return { { id = "first" } }, nil end
            return { { id = "first" }, { id = "last" } }, nil
        end
        return {}, nil
    end
    return handle, nil
end
return M

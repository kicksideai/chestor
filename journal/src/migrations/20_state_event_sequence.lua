local ops = require("ops")

local function apply_up(db: any, dialect: string)
    local err = ops.up(db, dialect)
    if err then error(err) end
end

return require("migration").define(function()
    migration("Chestor journal state event sequence", function()
        database("postgres", function()
            up(function(db) apply_up(db, "postgres") end)
            down(function() end)
        end)
        database("sqlite", function()
            up(function(db) apply_up(db, "sqlite") end)
            down(function() end)
        end)
    end)
end)

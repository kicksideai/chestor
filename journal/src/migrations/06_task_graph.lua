local ops = require("ops")

local function apply_up(db: any, dialect: string)
    local err = ops.up(db, dialect)
    if err then error(err) end
end

local function apply_down(db: any, dialect: string)
    local err = ops.down(db, dialect)
    if err then error(err) end
end

return require("migration").define(function()
    migration("Chestor journal task graph model", function()
        database("postgres", function()
            up(function(db) apply_up(db, "postgres") end)
            down(function(db) apply_down(db, "postgres") end)
        end)

        database("sqlite", function()
            up(function(db) apply_up(db, "sqlite") end)
            down(function(db) apply_down(db, "sqlite") end)
        end)
    end)
end)

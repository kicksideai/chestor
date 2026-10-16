local ops = require("ops")

local function create_tables(db: any)
    local err = ops.create_tables(db)
    if err then error(err) end
end

local function drop_tables(db: any)
    local err = ops.drop_tables(db)
    if err then error(err) end
end

return require("migration").define(function()
    migration("Create database schema materialized tables", function()
        database("postgres", function()
            up(function(db) create_tables(db) end)
            down(function(db) drop_tables(db) end)
        end)

        database("sqlite", function()
            up(function(db) create_tables(db) end)
            down(function(db) drop_tables(db) end)
        end)
    end)
end)

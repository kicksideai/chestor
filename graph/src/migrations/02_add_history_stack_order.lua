local ops = require("ops")

local function apply(db: any, operation: any)
    local err = operation(db)
    if err then error(err) end
end

return require("migration").define(function()
    migration("Add portable graph history stack ordering", function()
        database("postgres", function()
            up(function(db) apply(db, ops.add_postgres) end)
            down(function(db) apply(db, ops.drop_postgres) end)
        end)

        database("sqlite", function()
            up(function(db) apply(db, ops.add_sqlite) end)
            down(function(db) apply(db, ops.drop_sqlite) end)
        end)
    end)
end)

local ops = require("ops")

return require("migration").define(function()
    migration("Create Chestor journal graph projections", function()
        database("postgres", function()
            up(function(db)
                local err = ops.create_tables(db)
                if err then error(err) end
            end)
            down(function(db)
                local err = ops.drop_tables(db)
                if err then error(err) end
            end)
        end)
        database("sqlite", function()
            up(function(db)
                local err = ops.create_tables(db)
                if err then error(err) end
            end)
            down(function(db)
                local err = ops.drop_tables(db)
                if err then error(err) end
            end)
        end)
    end)
end)

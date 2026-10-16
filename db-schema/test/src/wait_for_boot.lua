local sql = require("sql")
local time = require("time")

local function run()
    for _ = 1, 300 do
        local db, err = sql.get("app:db")
        if not err and db then
            local _, query_err = db:query("SELECT 1 FROM chestor_schema_layout LIMIT 1")
            db:release()
            if not query_err then return true end
        end
        time.sleep("100ms")
    end
    error("database-schema migrations did not complete within 30s")
end

return { run = run }

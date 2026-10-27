-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("Record realtime authority and delivery faults", function()
        local function up_tables(db)
            local _, err = db:execute([[CREATE TABLE autocode_test_notify (
                id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, actor_id TEXT NOT NULL,
                topic TEXT NOT NULL, policies TEXT NOT NULL, allowed INTEGER NOT NULL,
                user_notify INTEGER NOT NULL, service_notify INTEGER NOT NULL)]])
            if err then error(err) end
            local _, fault_err = db:execute("CREATE TABLE autocode_test_notify_fault (owner_id TEXT PRIMARY KEY, mode TEXT NOT NULL)")
            if fault_err then error(fault_err) end
        end
        local function down_tables(db)
            db:execute("DROP TABLE autocode_test_notify_fault")
            db:execute("DROP TABLE autocode_test_notify")
        end
        database("postgres", function() up(up_tables); down(down_tables) end)
        database("sqlite", function() up(up_tables); down(down_tables) end)
    end)
end)

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local function apply(db: sql.DB)
    local _, err = db:execute("ALTER TABLE chestor_autocode_runs ADD COLUMN account_health TEXT NOT NULL DEFAULT '{}'")
    if err then error(err) end
end
return require("migration").define(function()
    migration("Retain account health settlement with the run outcome", function()
        database("postgres", function() up(apply) end)
        database("sqlite", function() up(apply) end)
    end)
end)

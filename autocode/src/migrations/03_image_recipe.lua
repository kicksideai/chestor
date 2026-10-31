-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local function apply(db: sql.DB)
    local _, err = db:execute("ALTER TABLE chestor_autocode_image_builds ADD COLUMN recipe TEXT NOT NULL DEFAULT '{}'")
    if err then error(tostring(err)) end
end
local function revert(db: sql.DB)
    local _, err = db:execute("ALTER TABLE chestor_autocode_image_builds DROP COLUMN recipe")
    if err then error(tostring(err)) end
end
return require("migration").define(function()
    migration("Store the trusted image recipe", function()
        database("postgres", function() up(apply); down(revert) end)
        database("sqlite", function() up(apply); down(revert) end)
    end)
end)

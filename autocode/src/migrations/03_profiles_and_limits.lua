-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local function apply(db: sql.DB)
    for _, statement in ipairs({
        "ALTER TABLE chestor_autocode_runs ADD COLUMN account_pool TEXT NOT NULL DEFAULT '[]'",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN endpoint TEXT NOT NULL DEFAULT '{}'",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN resolved INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE chestor_autocode_account_state ADD COLUMN rate_limits TEXT NOT NULL DEFAULT '{}'",
    }) do
        local _, err = db:execute(statement)
        if err then error(errors.wrap(err, "autocode profile and limit snapshots")) end
    end
end
return require("migration").define(function()
    migration("Snapshot profile defaults and account limit windows", function()
        database("postgres", function() up(apply) end)
        database("sqlite", function() up(apply) end)
    end)
end)

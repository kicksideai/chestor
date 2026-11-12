-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local function apply(db: sql.DB)
    for _, statement in ipairs({
        "ALTER TABLE chestor_autocode_runs ADD COLUMN isolation TEXT NOT NULL DEFAULT 'shared'",
        "ALTER TABLE chestor_autocode_runs ADD COLUMN worktree TEXT NOT NULL DEFAULT '{}'",
    }) do
        local _, err = db:execute(statement)
        if err then error(err) end
    end
end
return require("migration").define(function()
    migration("Snapshot run isolation and cleanup intent", function()
        database("postgres", function() up(apply) end)
        database("sqlite", function() up(apply) end)
    end)
end)

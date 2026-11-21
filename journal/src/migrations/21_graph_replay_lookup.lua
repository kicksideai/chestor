local function apply_up(db: any)
    local _, err = db:execute([[
        CREATE INDEX IF NOT EXISTS idx_cjournal_gchanges_target
            ON chestor_journal_graph_changes (journal_id, graph_id, target_type, target_id, revision DESC, operation DESC)
    ]], {})
    if err then error(err) end
end

local function apply_down(db: any)
    local _, err = db:execute("DROP INDEX IF EXISTS idx_cjournal_gchanges_target", {})
    if err then error(err) end
end

return require("migration").define(function()
    migration("Chestor journal graph replay lookup", function()
        database("postgres", function()
            up(apply_up)
            down(apply_down)
        end)
        database("sqlite", function()
            up(apply_up)
            down(apply_down)
        end)
    end)
end)

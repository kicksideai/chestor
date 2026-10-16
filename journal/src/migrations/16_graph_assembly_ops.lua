local M = {}

local function exec(db: any, statement: string): string?
    local _, err = db:execute(statement, {})
    if err then return tostring(err) end
    return nil
end

-- chestor_journal_graph_fact_keys is the derivation index: one row per
-- (graph node, key) the deterministic deriver can chain or cluster on. It is
-- written inside the same transaction that projects the node, so correlation
-- chains and affinity candidates read a consistent view during both live
-- projection and full replay.
--
-- chestor_journal_graph_assembly is the on-demand assembly ledger: one row per
-- recompute run with its accounting, mirroring the queued/dispatched/completed
-- vocabulary the graph maintenance jobs already use.
function M.up(db: any, _db_type: string?): string?
    for _, statement in ipairs({
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_fact_keys (
                journal_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                key_type TEXT NOT NULL,
                key_value TEXT NOT NULL,
                source_seq INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, graph_id, node_id, key_type, key_value)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gfkeys_lookup ON chestor_journal_graph_fact_keys(journal_id, graph_id, key_type, key_value, source_seq)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gfkeys_node ON chestor_journal_graph_fact_keys(journal_id, graph_id, node_id, source_seq)",
        [[
            CREATE TABLE IF NOT EXISTS chestor_journal_graph_assembly (
                journal_id TEXT NOT NULL,
                run_id TEXT NOT NULL,
                graph_id TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'queued',
                events_replayed INTEGER NOT NULL DEFAULT 0,
                edges_added INTEGER NOT NULL DEFAULT 0,
                edges_removed INTEGER NOT NULL DEFAULT 0,
                suggested_added INTEGER NOT NULL DEFAULT 0,
                suggested_removed INTEGER NOT NULL DEFAULT 0,
                candidates_judged INTEGER NOT NULL DEFAULT 0,
                model TEXT,
                refine_error TEXT,
                error TEXT,
                execution_identity TEXT NOT NULL DEFAULT '{}',
                started_at INTEGER NOT NULL,
                finished_at INTEGER,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (journal_id, run_id)
            )
        ]],
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gassembly_latest ON chestor_journal_graph_assembly(journal_id, graph_id, started_at)",
        "CREATE INDEX IF NOT EXISTS idx_cjournal_gassembly_status ON chestor_journal_graph_assembly(journal_id, status, started_at)",
    }) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.down(db: any, _db_type: string?): string?
    for _, statement in ipairs({
        "DROP INDEX IF EXISTS idx_cjournal_gassembly_status",
        "DROP INDEX IF EXISTS idx_cjournal_gassembly_latest",
        "DROP TABLE IF EXISTS chestor_journal_graph_assembly",
        "DROP INDEX IF EXISTS idx_cjournal_gfkeys_node",
        "DROP INDEX IF EXISTS idx_cjournal_gfkeys_lookup",
        "DROP TABLE IF EXISTS chestor_journal_graph_fact_keys",
    }) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

return M

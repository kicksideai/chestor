local db_ops = require("db")

local M = {}

function M.delete_journal(db: any, journal_id: string): error?
    for _, statement in ipairs({
        "DELETE FROM chestor_journal_embedding_vectors WHERE journal_id = ?",
        "DELETE FROM chestor_journal_embedding_documents WHERE journal_id = ?",
        "DELETE FROM chestor_journal_node_refs WHERE journal_id = ?",
        "DELETE FROM chestor_journal_references WHERE journal_id = ?",
        "DELETE FROM chestor_journal_integrations WHERE journal_id = ?",
        "DELETE FROM chestor_journal_audit_coverage WHERE journal_id = ?",
        "DELETE FROM chestor_journal_episodes WHERE journal_id = ?",
        "DELETE FROM chestor_journal_cursors WHERE journal_id = ?",
        "DELETE FROM chestor_journal_graph_jobs WHERE journal_id = ?",
        "DELETE FROM chestor_journal_graph_changes WHERE journal_id = ?",
        "DELETE FROM chestor_journal_graph_requests WHERE journal_id = ?",
        "DELETE FROM chestor_journal_graph_evidence WHERE journal_id = ?",
        "DELETE FROM chestor_journal_graph_edges WHERE journal_id = ?",
        "DELETE FROM chestor_journal_graph_nodes WHERE journal_id = ?",
        "DELETE FROM chestor_journal_graphs WHERE journal_id = ?",
        "DELETE FROM chestor_journal_commands WHERE journal_id = ?",
        "DELETE FROM chestor_journal_branch_digests WHERE journal_id = ?",
        "DELETE FROM chestor_journal_receipts WHERE journal_id = ?",
        "DELETE FROM chestor_journal_task_fencing WHERE journal_id = ?",
        "DELETE FROM chestor_journal_leases WHERE journal_id = ?",
        "DELETE FROM chestor_journal_state WHERE journal_id = ?",
        "DELETE FROM chestor_journal_fts WHERE journal_id = ?",
        "DELETE FROM chestor_journal_embeddings WHERE journal_id = ?",
        "DELETE FROM chestor_journal_artifacts WHERE journal_id = ?",
        "DELETE FROM chestor_journal_task_deps WHERE journal_id = ?",
        "DELETE FROM chestor_journal_tasks WHERE journal_id = ?",
        "DELETE FROM chestor_journal_events WHERE journal_id = ?",
    }) do
        local delete_err = db_ops.exec(db, statement, { journal_id })
        if delete_err then return delete_err end
    end
    return nil
end

function M.destroy(journal_id: string): (boolean?, error?)
    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local tx, begin_err = db:begin()
    if begin_err then db:release(); return nil, errors.wrap(begin_err, "journal delete transaction failed") end
    if not tx then db:release(); return nil, errors.new({ kind = errors.INTERNAL, message = "journal delete transaction did not open" }) end
    local delete_err = M.delete_journal(tx, journal_id)
    if delete_err then tx:rollback(); db:release(); return nil, delete_err end
    local _, commit_err = tx:commit()
    db:release()
    if commit_err then return nil, errors.wrap(commit_err, "journal delete commit failed") end
    return true, nil
end

return M

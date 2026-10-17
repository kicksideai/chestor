local M = {}

local function exec(db: any, statement: string): string?
    local _, err = db:execute(statement, {})
    if err then return tostring(err) end
    return nil
end

function M.up(db: any, dialect: string): string?
    local columns: any = {}
    if dialect == "sqlite" then
        local rows, err = db:query("PRAGMA table_info(chestor_journal_state)", {})
        if err then return tostring(err) end
        for _, row in ipairs(rows or {}) do columns[row.name] = true end
    end
    for _, column in ipairs({ "active_task_seq", "digest_event_seq" }) do
        if not columns[column] then
            local err = exec(db, "ALTER TABLE chestor_journal_state ADD COLUMN "
                .. (dialect == "postgres" and "IF NOT EXISTS " or "") .. column .. " INTEGER")
            if err then return err end
        end
    end
    -- source_seq describes the digest's inputs, independently of the event
    -- that publishes it. Backfill provenance without changing stored values.
    return exec(db, [[
        UPDATE chestor_journal_state AS s SET
            active_task_seq = COALESCE(s.active_task_seq, (
                SELECT MAX(e.seq) FROM chestor_journal_events e
                 WHERE e.journal_id = s.journal_id AND e.event_type = 'task.focused'
                   AND e.task_id = s.active_task_id)),
            digest_event_seq = COALESCE(s.digest_event_seq, (
                SELECT MAX(e.seq) FROM chestor_journal_events e
                 WHERE e.journal_id = s.journal_id AND e.event_type = 'digest.updated'
                   AND e.ts = s.digest_updated_at))
        WHERE active_task_seq IS NULL OR digest_event_seq IS NULL
    ]])
end

return M

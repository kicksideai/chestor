local M = {}

local function exec(db: any, sql: string): string?
    local _, err = db:execute(sql, {})
    if err then return tostring(err) end
    return nil
end

-- An identity holds exactly one automatic position per journal. Two concurrent
-- first writes each looked the position up, each found none, and each
-- allocated a handle; nothing in the schema could decide between them, so the
-- agent ended up with two positions that split its watermark. The partial
-- unique index is that decision: only one automatic active cursor per
-- (journal_id, agent_id) can exist, and the losing insert adopts the winner.
--
-- Journals written before the index folds first: every group keeps its newest
-- automatic position by the same (updated_at, cursor_id) order the runtime
-- resolves with, that survivor takes the group's highest watermark, and the
-- superseded rows close.
local NEWER_IN_GROUP = [[
    SELECT 1 FROM chestor_journal_cursors n
     WHERE n.journal_id = c.journal_id AND n.agent_id = c.agent_id
       AND n.origin = 'auto' AND n.state = 'active'
       AND (n.updated_at > c.updated_at
            OR (n.updated_at = c.updated_at AND n.cursor_id > c.cursor_id))
]]

function M.up(db: any, db_type: string?): string?
    local statements = {
        [[
            UPDATE chestor_journal_cursors AS c
               SET last_seen_seq = (
                    SELECT MAX(d.last_seen_seq) FROM chestor_journal_cursors d
                     WHERE d.journal_id = c.journal_id AND d.agent_id = c.agent_id
                       AND d.origin = 'auto' AND d.state = 'active')
             WHERE c.origin = 'auto' AND c.state = 'active'
               AND NOT EXISTS (]] .. NEWER_IN_GROUP .. [[)
        ]],
        [[
            UPDATE chestor_journal_cursors AS c
               SET state = 'closed'
             WHERE c.origin = 'auto' AND c.state = 'active'
               AND EXISTS (]] .. NEWER_IN_GROUP .. [[)
        ]],
        [[
            CREATE UNIQUE INDEX IF NOT EXISTS idx_cjournal_cursors_auto_identity
                ON chestor_journal_cursors(journal_id, agent_id)
             WHERE origin = 'auto' AND state = 'active'
        ]],
    }
    for _, statement in ipairs(statements) do
        local err = exec(db, statement)
        if err then return err end
    end
    return nil
end

function M.down(db: any, db_type: string?): string?
    return exec(db, "DROP INDEX IF EXISTS idx_cjournal_cursors_auto_identity")
end

return M

local db = require("db")
local types = require("types")
local execution_identity = require("execution_identity")

local M = {}

function M.run(journal_id: string, owner: string, target: string, args: any): (any?, error?)
    local handle, open_err = db.open()
    if not handle then return nil, open_err end
    local rows, query_err = db.query(handle, [[
        SELECT c.actor_id, c.execution_identity_json
          FROM kickside_projection_cursor c
          JOIN kickside_projection p ON p.id = c.projection_id
         WHERE c.thread_id = ? AND p.kind = ? AND c.cursor_key = 'state'
    ]], { journal_id, types.PROJECTION_KIND })
    local _, release_err = handle:release()
    if release_err then return nil, release_err end
    if query_err then return nil, query_err end
    if not rows or #rows ~= 1 then return nil, errors.new({ kind = errors.NOT_FOUND, message = "journal state execution identity not found: " .. journal_id }) end
    local identity, identity_err = execution_identity.from_row(rows[1].actor_id, rows[1].execution_identity_json)
    if not identity then return nil, identity_err end
    local result, run_err = execution_identity.run_as(identity, target, args, { deferred_owner = owner })
    if run_err then return nil, run_err end
    return result, nil
end

return M

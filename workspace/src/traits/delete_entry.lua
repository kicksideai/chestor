local handlers = require("handlers")

-- DeleteWorkspaceEntry tool: delete an entry and its component-owned thread.
-- Access-checked (ACCESS.DELETE) and refused for pinned entries or subtrees
-- containing a pinned entry; irreversible. Deletion runs as a durable job, so the
-- answer is the component deletion receipt: in_progress with the job_id while
-- cleanup continues, deleted once the entry is gone.
local function trim(v)
    return type(v) == "string" and (v:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local id = trim(args.id)
    if id == "" then return { success = false, error = "id is required" } end
    local result, err = handlers.delete(id)
    if err then return nil, err end
    return { success = true, deleted = result.deleted == true, in_progress = result.in_progress == true,
        status = result.status, cleanup_pending = result.cleanup_pending, job_id = result.job_id }
end

return { handle = handle }

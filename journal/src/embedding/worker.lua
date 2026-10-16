local executor = require("executor")
local background_identity = require("background_identity")

local M = {}

function M.execute(args: any): (any?, error?)
    return executor.execute(args)
end

function M.run(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if type(args.payload) == "table" then args = args.payload end
    local journal_id = tostring(args.journal_id or "")
    if journal_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "journal_id is required" }) end
    return background_identity.run(journal_id, "chestor.journal.embedding:worker", "chestor.journal.embedding:embed_pending", { journal_id = journal_id })
end

return M

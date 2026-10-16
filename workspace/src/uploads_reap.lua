-- Universal upload-pipeline DELETE stage, dropped into kickside.uploads declaratively
-- (see the upload.delete_stage registry entry). It runs as the deleting user whenever
-- an upload is deleted, and reaps any chestor.workspace:file component that pointed at
-- that upload -- so deleting the blob never leaves a dangling file entry whose renderer
-- would 404. The forward direction is deliberately asymmetric: deleting a file entry
-- leaves the (content-hash deduplicated, possibly shared) upload alone.

local handlers = require("handlers")

local M = {}

function M.process(params)
    params = type(params) == "table" and params or {}
    local upload_id = tostring(params.upload_id or "")
    if upload_id ~= "" then handlers.delete_by_upload(upload_id) end
    return { success = true }
end

return M

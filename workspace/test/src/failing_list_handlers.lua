-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local M = {}

function M.find_by_upload()
    return nil
end

function M.list()
    return nil, errors.new({ kind = errors.UNAVAILABLE, message = "folder listing unavailable" })
end

function M.materialize()
    error("materialize must not run after a folder-list failure")
end

return M

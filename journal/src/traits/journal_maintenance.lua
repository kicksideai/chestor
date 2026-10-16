-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local embedding = require("embedding")

local function trim(value)
    return type(value) == "string" and (value:gsub("^%s*(.-)%s*$", "%1")) or ""
end

local function handle(args)
    args = type(args) == "table" and args or {}
    local action = trim(args.action)

    if action == "reembed" then
        local ids = type(args.journal_ids) == "table" and args.journal_ids or {}
        local report = {}
        for index, journal_id in ipairs(ids) do
            local err, state = embedding.schedule(tostring(journal_id), 0, tostring(os.time()) .. ":" .. tostring(index))
            report[#report + 1] = { journal_id = journal_id, error = err and tostring(err) or nil, embedding = state }
        end
        return { success = true, fired = #ids, report = report }
    end

    return { success = false, error = "action must be reembed" }
end

return { handle = handle }

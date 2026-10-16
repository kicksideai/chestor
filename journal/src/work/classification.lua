local db = require("db")

local M = {}

-- Fact kinds that default to non-work under the optional receipt-freshness
-- policy. The generic Journal graph never interprets these kinds.
local NON_WORK_TYPES = {
    note = true, observation = true, risk = true, decision = true, checkpoint = true,
}

local NON_WORK_PREFIXES = { "task%.", "digest%.", "graph%.", "verification%." }

local function lower(value: any): string
    return string.lower(db.trim(value))
end

function M.is_work_fact(event_type: any, tags: any): boolean
    local kind = lower(event_type)
    if type(tags) == "table" then
        for _, tag in ipairs(tags :: { any }) do
            local name = lower(tag)
            if name == "work" then return true end
            if name == "note" then return false end
        end
    end
    if NON_WORK_TYPES[kind] then return false end
    for _, prefix in ipairs(NON_WORK_PREFIXES) do
        if kind:match("^" .. prefix) then return false end
    end
    return kind ~= ""
end

return M

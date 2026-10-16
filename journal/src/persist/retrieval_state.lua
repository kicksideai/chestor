local M = {}

local ALLOWED = {
    current = true,
    active = true,
    resolved = true,
    superseded = true,
    retracted = true,
    all = true,
}

local function trim(value: any): string
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

function M.normalize(value: any): (string?, error?)
    local state = string.lower(trim(value))
    if state == "" then state = "current" end
    if not ALLOWED[state] then
        return nil, errors.new({ kind = errors.INVALID, message = "validity must be current, active, resolved, superseded, retracted, or all" })
    end
    return state, nil
end

-- Immutable records never lose their stored lifecycle. Effective state also
-- accounts for a later event that explicitly supersedes this event, allowing
-- current-truth reads and complete historical reads to share one event log.
function M.event_expression(dialect: string, alias: string): string
    local lifecycle
    if tostring(dialect) == "postgres" then
        lifecycle = "lower(COALESCE(" .. alias .. ".metadata::jsonb ->> 'lifecycle', 'active'))"
    else
        lifecycle = "lower(COALESCE(json_extract(" .. alias .. ".metadata, '$.lifecycle'), 'active'))"
    end
    return "(CASE"
        .. " WHEN " .. lifecycle .. " = 'retracted' THEN 'retracted'"
        .. " WHEN " .. lifecycle .. " = 'superseded' OR EXISTS ("
        .. "SELECT 1 FROM chestor_journal_events state_successor"
        .. " WHERE state_successor.journal_id = " .. alias .. ".journal_id"
        .. " AND state_successor.supersedes_event_id = " .. alias .. ".id) THEN 'superseded'"
        .. " WHEN " .. lifecycle .. " = 'resolved' THEN 'resolved'"
        .. " ELSE 'active' END)"
end

function M.successor_expression(alias: string): string
    return "(SELECT state_successor.id FROM chestor_journal_events state_successor"
        .. " WHERE state_successor.journal_id = " .. alias .. ".journal_id"
        .. " AND state_successor.supersedes_event_id = " .. alias .. ".id"
        .. " ORDER BY state_successor.seq DESC LIMIT 1)"
end

function M.filter(expression: string, state: string): (string, { any })
    if state == "all" then return "", {} end
    if state == "current" then
        return " AND " .. expression .. " IN ('active','resolved')", {}
    end
    return " AND " .. expression .. " = ?", { state }
end

return M

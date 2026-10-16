local contract = require("contract")
local security = require("security")
local types = require("types")

local function new(dependencies: any?): any
local deps = dependencies or {}
local M = {}

local function trim(value: any): string
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

local function open_threads(): (any?, any?)
    if deps.open_threads then return deps.open_threads() end
    local definition, get_err = contract.get(types.THREADS)
    if get_err or not definition then
        return nil, errors.wrap(get_err or errors.new({ message = "unavailable", kind = errors.UNAVAILABLE }), "threads contract unavailable")
    end
    local opened, open_err = definition
        :with_actor(security.actor())
        :with_scope(security.scope())
        :open()
    if open_err or not opened then
        return nil, errors.wrap(open_err or errors.new({ message = "no result", kind = errors.INTERNAL }), "threads open failed")
    end
    return opened, nil
end

-- Resolve is the sole Journal access gate. kickside.core:threads.find returns
-- nil both for an absent thread and for one the ambient actor cannot read.
function M.resolve(journal_id: string): (any?, string?, any?)
    local id = trim(journal_id)
    if id == "" then return nil, nil, errors.new({ message = "journal_id is required", kind = errors.INVALID }) end
    local threads, open_err = open_threads()
    if not threads then return nil, nil, open_err end
    local found, find_err = threads:find({ thread_id = id })
    if find_err then return nil, nil, errors.wrap(find_err, "thread resolve failed") end
    if not found then return nil, nil, errors.new({ message = "journal thread not found: " .. id, kind = errors.NOT_FOUND }) end
    return threads, id, nil
end

-- Ascending page over the durable thread log, through the same access gate as
-- resolve. from_seq is inclusive.
function M.events(journal_id: string, from_seq: number, limit: number): (any?, any?)
    local threads, thread_id, resolve_err = M.resolve(journal_id)
    if not threads or not thread_id then return nil, resolve_err end
    local listed, list_err = threads:list_events({
        thread_id = thread_id,
        ascending = true,
        from_seq = from_seq,
        limit = limit,
    })
    if list_err or not listed then return nil, errors.wrap(list_err or errors.new({ message = "no result", kind = errors.INTERNAL }), "thread log read failed") end
    return (listed :: any).events or {}, nil
end

function M.append(journal_id: string, events: { any }): (any?, any?)
    if type(events) ~= "table" or #events == 0 then return nil, errors.new({ message = "events array required", kind = errors.INVALID }) end
    local threads, thread_id, resolve_err = M.resolve(journal_id)
    if not threads or not thread_id then return nil, resolve_err end
    local result, append_err = threads:append_events({ thread_id = thread_id, events = events })
    if append_err then return nil, append_err end
    return {
        success = true,
        accepted = true,
        journal_id = journal_id,
        thread_id = thread_id,
        inserted = tonumber(result and (result :: any).inserted) or 0,
        duplicates = tonumber(result and (result :: any).duplicates) or 0,
        max_seq = tonumber(result and (result :: any).max_seq),
    }, nil
end

return M
end

local default = new()
default.new = new
return default

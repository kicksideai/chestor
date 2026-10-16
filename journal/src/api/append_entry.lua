local commands = require("commands")
local support = require("support")

local function handler()
    local req, res = support.context()
    if not req or not res then return nil, "no http context" end
    local id, id_err = support.journal_id(req)
    if not id then return support.write(res, "journal", nil, id_err) end
    local body, body_err = support.body(req)
    if not body then return support.write(res, "journal", nil, body_err) end
    -- A fact written over HTTP belongs to the writer's work span exactly as a
    -- fact written through a tool does; a span that cannot be opened never
    -- stops the append.
    local attached, attach_err = commands.attach_span(id, {
        cursor_id = (body :: any).cursor_id,
        agent_id = (body :: any).agent_id,
        working_on = (body :: any).working_on,
    })
    if attached then (body :: any).span_id = (attached :: any).span_id end
    ;(body :: any).working_on = nil
    local value, err = commands.append_entry(id, body)
    if value and attached then
        local _, advance_err = commands.advance_cursor(id, {
            cursor_id = (attached :: any).cursor_id,
            agent_id = (attached :: any).agent_id,
            seq = tonumber((value :: any).max_seq) or 0,
            span_id = (attached :: any).span_id,
        })
        ;(value :: any).span_id = (attached :: any).span_id
        if advance_err then (value :: any).cursor_error = tostring(advance_err) end
    end
    if value and attach_err then (value :: any).span_error = tostring(attach_err) end
    support.write(res, "journal", value, err)
end

return { handler = handler }

local state
local fixture = {
    CONTENT = { JSON = "application/json" },
    STATUS = { BAD_REQUEST = 400, INTERNAL_SERVER_ERROR = 500 },
    request = function()
        return {
            body = function() return state.body, state.err end,
            param = function() return "schema-id" end,
        }
    end,
    response = function()
        return {
            set_content_type = function(_, value) state.content_type = value end,
            set_status = function(_, value) state.status = value end,
            write_json = function(_, value) state.response = value end,
        }
    end,
}
package.preload.http = function() return fixture end
package.preload.json = function()
    return { decode = function(...)
        state.decodes = state.decodes + 1
        assert(select("#", ...) == 1, "decoder receives only the body")
        local body = ...
        if body == "{invalid" then return nil, "invalid json" end
        return { commands = { { type = "node.added" } } }, nil
    end }
end
package.preload.materializer = function() return { open_db = function()
    if state.db_error then return nil, state.db_error end
    return { release = function() state.releases = (state.releases or 0) + 1 end }, nil
end } end
package.preload.thread_access = function() return {
    WRITE = 2,
    gate_thread_access = function(_, id, mask)
        assert(id == "schema-id" and mask == 2)
        if state.access_error then return false, state.access_status, state.access_error end
        return true, 200, nil
    end,
} end
package.preload.schema_state = function()
    return { apply = function(id, commands)
        state.writes = state.writes + 1
        assert(id == "schema-id")
        assert(commands[1].type == "node.added")
        return { thread_id = id }, nil
    end }
end
package.preload.support = function() return { context = function() return fixture.request(), fixture.response() end } end
local handler = dofile("src/api/apply_schema.lua")
state = { body = '{"commands":[]}', err = "body read failed", decodes = 0, writes = 0 }
handler.handler()
assert(state.status == 400)
assert(state.response.success == false)
assert(state.response.error == "body read failed")
assert(state.decodes == 0)
assert(state.writes == 0)
state = { body = "{invalid", decodes = 0, writes = 0 }
handler.handler()
assert(state.status == 400)
assert(state.response.error == "invalid json")
assert(state.writes == 0)
state = { body = '{"commands":[{"type":"node.added"}]}', decodes = 0, writes = 0 }
handler.handler()
assert(state.response.success == true)
assert(state.decodes == 1)
assert(state.writes == 1)
for _, status in ipairs({ 403, 404, 500 }) do
    state = { body = '{"commands":[{"type":"node.added"}]}', access_error = "access lookup fails",
        access_status = status, decodes = 0, writes = 0 }
    handler.handler()
    assert(state.status == status, "expected " .. status .. ", got " .. tostring(state.status))
    assert(state.response.success == false and state.response.error == state.access_error)
    assert(state.writes == 0 and state.decodes == 0)
    assert(state.releases == 1)
end
state = { db_error = "database unavailable", decodes = 0, writes = 0 }
handler.handler()
assert(state.status == 500 and state.response.error == state.db_error)
assert(state.writes == 0 and state.decodes == 0)
print("Schema apply HTTP: 7 passed")

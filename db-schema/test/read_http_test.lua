local state
local http = {
    CONTENT = { JSON = "application/json" },
    STATUS = { NOT_FOUND = 404, FORBIDDEN = 403, BAD_REQUEST = 400, INTERNAL_ERROR = 500, INTERNAL_SERVER_ERROR = 500 },
    request = function() return { param = function() return "private-component" end } end,
    response = function() return {
        set_content_type = function() end,
        set_status = function(_, status) state.status = status end,
        write_json = function(_, body) state.body = body end,
    } end,
}
package.preload.http = function() return http end
package.preload.materializer = function() return { open_db = function()
    if state.db_error then return nil, state.db_error end
    return { release = function() state.releases = state.releases + 1 end }, nil
end } end
package.preload.thread_access = function() return {
    READ = 1,
    gate_thread_access = function(_, id, mask)
        assert(id == "private-component" and mask == 1)
        if state.access_error then
            return false, state.access_status, state.access_error
        end
        return true, 200, nil
    end,
} end
package.preload.schema_state = function() return { state = function(id)
    state.reads = state.reads + 1
    if state.access_error then return nil, "db-schema thread not found: " .. id end
    if state.read_error then return nil, state.read_error end
    return { thread_id = id }, nil
end } end
package.preload.support = function() return { context = function() return http.request(), http.response() end } end
local handler = dofile("src/api/get_schema.lua")
for _, case in ipairs({
    { status = 403, message = "permission denied" },
    { status = 404, message = "thread not found" },
    { status = 500, message = "access lookup failure" },
}) do
    state = { access_error = case.message, access_status = case.status, reads = 0, releases = 0 }
    handler.handler()
    local expected = case.status
    assert(state.status == expected, "expected " .. expected .. ", got " .. tostring(state.status))
    assert(state.body.success == false and state.body.error == case.message)
    assert(state.reads == 0, "inaccessible state must not be read")
    assert(state.releases == 1, "preflight releases its database connection")
end
state = { reads = 0, releases = 0 }
handler.handler()
assert(state.body.success == true and state.body.schema.thread_id == "private-component")
assert(state.reads == 1 and state.releases == 1)
state = { reads = 0, releases = 0, read_error = "storage failure" }
handler.handler()
assert(state.status == 500 and state.body.error == "storage failure")
state = { reads = 0, releases = 0, db_error = "database unavailable" }
handler.handler()
assert(state.status == 500 and state.body.error == "database unavailable")
assert(state.reads == 0 and state.releases == 0)
print("db-schema read HTTP: 6 passed")

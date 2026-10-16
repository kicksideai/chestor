local captured
local getter
package.preload.http = function() return { STATUS = { NOT_FOUND = 404, INTERNAL_ERROR = 500 } } end
package.preload.handlers = function() return { get = function() return getter() end } end
package.preload.support = function() return {
    context = function() return { param = function() return "entry-id" end }, { write_json = function(_, value) captured = value end } end,
    fail = function(_, failure) captured = { status = 500, error = failure } end,
    respond_error = function(_, status, message) captured = { status = status, error = message } end,
} end
local handler = dofile("src/api/get_entry.lua")
getter = function() return nil, "database unavailable" end
handler.handler()
assert(captured.status == 500, "entry read errors reach HTTP as failures")
assert(captured.error == "database unavailable")
getter = function() return nil end
handler.handler()
assert(captured.status == 404)
getter = function() return { id = "entry-id" } end
handler.handler()
assert(captured.success == true and captured.entry.id == "entry-id")
print("get_entry HTTP tests pass")

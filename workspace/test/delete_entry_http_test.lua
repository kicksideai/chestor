local captured
local status
local deleter
package.preload.http = function() return { STATUS = { OK = 200, ACCEPTED = 202, INTERNAL_ERROR = 500 } } end
package.preload.handlers = function() return { delete = function(id)
    assert(id == "entry-id")
    return deleter()
end } end
package.preload.support = function() return {
    context = function() return { param = function() return "entry-id" end }, {
        set_status = function(_, value) status = value end,
        write_json = function(_, value) captured = value end,
    } end,
    fail = function(_, failure) captured = { status = 500, error = failure } end,
} end
local handler = dofile("src/api/delete_entry.lua")

deleter = function() return { id = "entry-id", deleted = true } end
status, captured = nil, nil
handler.handler()
assert(status == 200, "a completed delete answers 200")
assert(captured.success == true and captured.deleted == true and captured.in_progress == false)

deleter = function() return { id = "entry-id", deleted = true, in_progress = true, status = "in_progress",
    cleanup_pending = true, retryable = true, details = { needs_continue = true } } end
status, captured = nil, nil
handler.handler()
assert(status == 202, "a delete with pending cleanup answers 202 Accepted")
assert(captured.success == true and captured.in_progress == true and captured.status == "in_progress")
assert(captured.cleanup_pending == true and captured.details.needs_continue == true)

deleter = function() return nil, "delete failed" end
status, captured = nil, nil
handler.handler()
assert(captured.status == 500 and captured.error == "delete failed")
print("delete_entry HTTP tests pass")

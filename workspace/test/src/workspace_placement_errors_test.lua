local test = require("test")
local handlers = require("handlers")
local component = require("component")
local support = require("support")

local function rejects_failure(operation)
    local saved_service = component.get_service
    local saved_access = component.validate_access
    component.validate_access = function() return 15, nil end
    component.get_service = function()
        return {
            get = function() return { component_id = "northwind", meta = {} } end,
            set_placement = function() return { success = false, error = "Northwind placement is unavailable.", kind = errors.UNAVAILABLE }, nil end,
        }, nil
    end
    local ok, failure = pcall(function()
        local entry, err = operation()
        test.is_nil(entry)
        test.is_true(errors.is(err, errors.UNAVAILABLE))
        test.eq(tostring(err), "Northwind placement is unavailable.")
    end)
    component.get_service = saved_service
    component.validate_access = saved_access
    if not ok then error(failure) end
end

return test.run_cases(function()
    test.describe("workspace placement errors", function()
        test.it("maps typed access denials to HTTP 403", function()
            local status, body
            local res = {
                set_status = function(_, value) status = value end,
                write_json = function(_, value) body = value end,
            }
            support.fail(res, errors.new({ message = "no write access", kind = errors.PERMISSION_DENIED }))
            test.eq(status, 403)
            test.eq(body.error, "no write access")
            test.is_false(body.success)
        end)
        test.it("reports a rejected move without presenting the unchanged entry as success", function()
            rejects_failure(function() return handlers.move("northwind", "studio") end)
        end)
        test.it("reports a rejected reorder without presenting the unchanged entry as success", function()
            rejects_failure(function() return handlers.reorder("northwind", "a") end)
        end)
    end)
end)

local test = require("test")
local support = require("support")
local canonical_json = require("canonical_json")
local function encode(value: any): string
    local encoded, err = canonical_json.encode(value)
    test.is_nil(err)
    test.not_nil(encoded)
    return encoded :: string
end
return test.run_cases(function()
    test.describe("HTTP error envelope", function()
        local function exercise(failure, expected_status)
            local status, response
            local res = { set_status = function(_, v) status = v end,
                write_json = function(_, v) response = v end }
            support.write(res, "items", nil, failure)
            test.eq(status, expected_status)
            test.eq(encode(response), encode({ success = false, error = tostring(failure) }))
        end
        for _, row in ipairs({ { errors.INVALID, 400 }, { errors.PERMISSION_DENIED, 403 }, { errors.NOT_FOUND, 404 },
            { errors.CONFLICT, 409 }, { errors.ALREADY_EXISTS, 409 }, { errors.UNAVAILABLE, 503 },
            { errors.RATE_LIMITED, 429 }, { errors.TIMEOUT, 504 }, { errors.CANCELED, 500 },
            { errors.INTERNAL, 500 }, { errors.UNKNOWN, 500 } }) do
            test.it("classifies " .. row[1] .. " before rendering", function()
                exercise(errors.new({ kind = row[1], message = "opaque" }), row[2])
                exercise(errors.wrap(errors.new({ kind = row[1], message = "not found permission denied" }), "context"), row[2])
            end)
        end
        test.it("leaves plain string failures internal", function()
            exercise("not_found", 500)
            exercise("permission denied invalid not found", 500)
        end)
    end)
end)

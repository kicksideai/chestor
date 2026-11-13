-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local job_types = require("job_types")
type Outcome = {ok: boolean, output: {[string]: unknown}?, error_native: unknown?}
local M = {data = job_types.error_to_data}
-- The module's private TEXT columns retain old messages and tagged native envelopes.
function M.store_error(message: string, native: {[string]: unknown}?): (string?, error?)
    if not native then return message, nil end
    return json.encode({format = "autocode.error/v1", message = message, error_native = native})
end
function M.read_error(stored: string): (string?, {[string]: unknown}?, error?)
    local data = json.decode(stored)
    if type(data) ~= "table" or data.format ~= "autocode.error/v1" then return stored, nil, nil end
    local native, err = job_types.error_from_data(data.error_native)
    if err then return nil, nil, err end
    if not native or type(data.message) ~= "string" then
        return nil, nil, errors.new({kind = errors.INTERNAL, message = "invalid stored native error"})
    end
    return data.message, job_types.error_to_data(native), nil
end
function M.failure(message: string, kind: string, cause: error?): Outcome
    local err = cause and errors.wrap(cause, message) or errors.new({kind = kind, message = message})
    return {ok = false, error_native = job_types.error_to_data(err)}
end
function M.native(value: unknown): error
    for _, kind in ipairs({errors.INVALID, errors.NOT_FOUND, errors.CONFLICT, errors.PERMISSION_DENIED,
        errors.UNAVAILABLE, errors.INTERNAL, errors.CANCELED, errors.ALREADY_EXISTS, errors.UNKNOWN, errors.TIMEOUT, errors.RATE_LIMITED}) do
        if errors.is(value, kind) then return value :: error end
    end
    local native, decode_err = job_types.error_from_data(value)
    if native then return native end
    if decode_err then return errors.wrap(decode_err, "malformed transported error") end
    return errors.new({kind = errors.INTERNAL, message = "malformed transported error"})
end
return M

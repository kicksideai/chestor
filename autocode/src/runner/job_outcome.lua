-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local job_types = require("job_types")
type Outcome = {ok: boolean, output: {[string]: unknown}?, error_native: unknown?}
local M = {}
function M.failure(message: string, kind: string): Outcome
    return {ok = false, error_native = job_types.error_to_data(errors.new({kind = kind, message = message}))}
end
function M.native(value: unknown): error
    for _, kind in ipairs({errors.INVALID, errors.NOT_FOUND, errors.CONFLICT, errors.PERMISSION_DENIED,
        errors.UNAVAILABLE, errors.INTERNAL, errors.CANCELED, errors.ALREADY_EXISTS, errors.UNKNOWN, errors.TIMEOUT, errors.RATE_LIMITED}) do
        if errors.is(value, kind) then return value :: error end
    end
    local native, decode_err = job_types.error_from_data(value)
    if native then return native end
    return errors.new({kind = errors.INTERNAL, message = "malformed transported error: " .. tostring(decode_err)})
end
return M

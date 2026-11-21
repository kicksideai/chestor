-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local device = require("device")
local http = require("http_client")
local json = require("json")
local process = require("process")
local time = require("time")

type Object = {[string]: unknown}
local M = {}
M.kind = device.kind

function M.request(path: string, body: string): (number, Object, Object)
    local is_form = body:sub(1, 1) ~= "{"
    local response, err = http.post(device.origin .. path, {
        headers = {["Content-Type"] = is_form and "application/x-www-form-urlencoded" or "application/json",
            Accept = "application/json"},
        timeout = "15s", max_response_body = 65536, body = body,
    })
    if err or not response then return 0, {}, {} end
    local decoded = json.decode(response.body or "")
    local headers: Object = {}
    for name, value in pairs(response.headers) do
        if type(name) == "string" and name:lower() == "retry-after" then
            headers["Retry-After"] = type(value) == "table" and value[1] or value
        end
    end
    return response.status_code, type(decoded) == "table" and decoded :: Object or {}, headers
end

-- A private lock scoped to the sign-in owner or the rotating account cache.
function M.lock<T>(name: string, work: () -> (T?, error?), wait_ms: integer?): (T?, error?)
    local acquired, err = process.registry.register(name, nil, process.registry.CONSISTENT)
    local deadline = wait_ms and time.now():add(tostring(wait_ms) .. "ms") or nil
    while not acquired and deadline and errors.is(err, errors.ALREADY_EXISTS) and time.now():before(deadline) do
        time.sleep("100ms")
        acquired, err = process.registry.register(name, nil, process.registry.CONSISTENT)
    end
    if not acquired then return nil, err end
    local ok, result, work_err = pcall(work)
    local _, release_err = process.registry.unregister(name, process.registry.CONSISTENT)
    if not ok then error(result) end
    if work_err then return nil, work_err end
    if result == nil and release_err then return nil, release_err end
    return result, nil
end

return M

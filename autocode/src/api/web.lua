-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Endpoint plumbing: the authenticated owner, typed request fields, JSON
-- replies, and the HTTP status each error kind maps to.
local http = require("http")
local security = require("security")

type Body = {[string]: unknown}
type Context = {req: http.Request, res: http.Response, owner_id: string}

local M = {}

M.STATUS = http.STATUS

function M.reply(res: http.Response, status: number, body: {[string]: unknown})
    res:set_status(status)
    res:write_json(body)
end

function M.fail(res: http.Response, status: number, message: string)
    M.reply(res, status, {success = false, error = message})
end

-- fail_with answers with the status an error's kind maps to.
function M.fail_with(res: http.Response, err: error?)
    local status = M.STATUS.INTERNAL_ERROR
    if errors.is(err, errors.INVALID) then status = M.STATUS.BAD_REQUEST
    elseif errors.is(err, errors.NOT_FOUND) then status = M.STATUS.NOT_FOUND
    elseif errors.is(err, errors.CONFLICT) then status = M.STATUS.CONFLICT
    elseif errors.is(err, errors.PERMISSION_DENIED) then status = M.STATUS.FORBIDDEN end
    M.fail(res, status, tostring(err))
end

-- Opens the request; nil means the reply is already written.
function M.open(): Context?
    local req = http.request()
    local res = http.response()
    if not req or not res then return nil end
    res:set_content_type(http.CONTENT.JSON)
    local actor = security.actor()
    if not actor then
        M.fail(res, M.STATUS.UNAUTHORIZED, "authentication required")
        return nil
    end
    return {req = req, res = res, owner_id = actor:id()}
end

-- param returns a required path parameter; nil means the reply is written.
function M.param(ctx: Context, name: string): string?
    local value = ctx.req:param(name)
    if not value or value == "" then
        M.fail(ctx.res, M.STATUS.BAD_REQUEST, name .. " is required")
        return nil
    end
    return value
end

-- body returns the JSON object body; nil means the reply is written.
function M.body(ctx: Context): Body?
    local data, err = ctx.req:body_json()
    if err or type(data) ~= "table" then
        M.fail(ctx.res, M.STATUS.BAD_REQUEST, "request body must be a JSON object")
        return nil
    end
    local body: Body = {}
    for key, value in pairs(data) do
        if type(key) == "string" then body[key] = value end
    end
    return body
end

-- Field readers for request bodies: each returns nil when the field is not
-- what it should be, and the caller refuses the request.

function M.text(value: unknown, max: integer): string?
    if type(value) ~= "string" then return nil end
    local trimmed = value:match("^%s*(.-)%s*$")
    if #trimmed > max then return nil end
    return trimmed
end

function M.strings(value: unknown, max_items: integer, max_bytes: integer): {string}?
    if type(value) ~= "table" then return nil end
    local result: {string} = {}
    for _, item in ipairs(value) do
        if type(item) ~= "string" or #item > max_bytes then return nil end
        result[#result + 1] = item
    end
    if #result > max_items then return nil end
    return result
end

function M.object(value: unknown): {[string]: unknown}?
    if type(value) ~= "table" then return nil end
    local result: {[string]: unknown} = {}
    for key, item in pairs(value) do
        if type(key) ~= "string" then return nil end
        result[key] = item
    end
    return result
end

return M

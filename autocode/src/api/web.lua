-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local boundary = require("boundary")
local http = require("http")
local json = require("json")
local security = require("security")

type NumberQuery = number | string
type Body = {[string]: unknown}
type Context = {req: http.Request, res: http.Response}

local M = {}

M.STATUS = http.STATUS

function M.reply(res: http.Response, status: number, body: {[string]: unknown})
    res:set_status(status)
    res:write_json(body)
end

function M.fail(res: http.Response, status: number, message: string)
    local kind = status == M.STATUS.UNAUTHORIZED and errors.PERMISSION_DENIED or errors.INVALID
    local err = boundary.error(kind, "autocode.invalid_request", message)
    M.reply(res, status, {success = false, error = message, kind = err:kind(), retryable = false, details = err:details()})
end

function M.fail_with(res: http.Response, err: error?)
    local status = M.STATUS.INTERNAL_ERROR
    if errors.is(err, errors.INVALID) then status = M.STATUS.BAD_REQUEST
    elseif errors.is(err, errors.NOT_FOUND) then status = M.STATUS.NOT_FOUND
    elseif errors.is(err, errors.CONFLICT) then status = M.STATUS.CONFLICT
    elseif errors.is(err, errors.PERMISSION_DENIED) then status = M.STATUS.FORBIDDEN
    elseif errors.is(err, errors.UNAVAILABLE) then status = M.STATUS.SERVICE_UNAVAILABLE
    elseif errors.is(err, errors.TIMEOUT) then status = M.STATUS.GATEWAY_TIMEOUT
    elseif errors.is(err, errors.RATE_LIMITED) then status = M.STATUS.TOO_MANY_REQUESTS end
    local native = boundary.native(err) or boundary.error(errors.INTERNAL, "autocode.internal", "request failed")
    M.reply(res, status, {success = false, error = native:message(), kind = native:kind(),
        retryable = native:retryable(), details = native:details()})
end

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
    return {req = req, res = res}
end

function M.param(ctx: Context, name: string): string?
    local value = ctx.req:param(name)
    if not value or value == "" then
        M.fail(ctx.res, M.STATUS.BAD_REQUEST, name .. " is required")
        return nil
    end
    return value
end

function M.body(ctx: Context): Body?
    local raw, read_err = ctx.req:body()
    if read_err or type(raw) ~= "string" or not raw:match("^%s*{") then
        M.fail(ctx.res, M.STATUS.BAD_REQUEST, "request body must be a JSON object")
        return nil
    end
    local data, err = json.decode(raw)
    if err or type(data) ~= "table" then
        M.fail(ctx.res, M.STATUS.BAD_REQUEST, "request body must be a JSON object")
        return nil
    end
    local body: Body = {}
    for key, value in pairs(data) do
        if type(key) ~= "string" then
            M.fail(ctx.res, M.STATUS.BAD_REQUEST, "request body must be a JSON object")
            return nil
        end
        body[key] = value
    end
    return body
end

function M.number_query(ctx: Context, name: string): NumberQuery?
    local value = ctx.req:query(name)
    return value and (tonumber(value) or value) or nil
end

return M

-- Period arithmetic is server-side and pure. Canonical keys sort lexically inside
-- one kind, and every lens reads the same integer index space, so the browser never
-- performs calendar math.

local types = require("types")
local util = require("util")

local M = {}

local QUARTER_PATTERN = "^(%d%d%d%d)%-Q([1-4])$"
local MONTH_PATTERN = "^(%d%d%d%d)%-(%d%d)$"
local DATE_PATTERN = "^(%d%d%d%d)%-(%d%d)"
local DAY_PATTERN = "^%d%d%d%d%-%d%d%-(%d%d)"

local function units_per_year(kind: string): number
    return kind == types.PERIOD_MONTH and 12 or 4
end

local MONTH_DAYS = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 }

local function is_leap_year(year: number): boolean
    return year % 4 == 0 and (year % 100 ~= 0 or year % 400 == 0)
end

local function days_in_month(year: number, month: number): number
    if month == 2 and is_leap_year(year) then return 29 end
    return tonumber(MONTH_DAYS[month]) or 0
end

function M.is_kind(kind: any): boolean
    return util.allows(types.PERIOD_KIND, kind)
end

-- Parse a canonical key into its calendar parts. unit is 1..4 for quarters and
-- 1..12 for months.
function M.parse(key: any, kind: any): (any?, error?)
    if not M.is_kind(kind) then return nil, errors.new({ message = "unknown period kind: " .. tostring(kind), kind = errors.INVALID }) end
    local text = tostring(key or "")
    if kind == types.PERIOD_QUARTER then
        local year, quarter = text:match(QUARTER_PATTERN)
        if not year then return nil, errors.new({ message = "period key must look like YYYY-Qn: " .. text, kind = errors.INVALID }) end
        return { year = tonumber(year), unit = tonumber(quarter) }, nil
    end
    local year, month = text:match(MONTH_PATTERN)
    if not year then return nil, errors.new({ message = "period key must look like YYYY-MM: " .. text, kind = errors.INVALID }) end
    local unit = tonumber(month)
    if unit < 1 or unit > 12 then return nil, errors.new({ message = "period month must be 01..12: " .. text, kind = errors.INVALID }) end
    return { year = tonumber(year), unit = unit }, nil
end

function M.format(year: any, unit: any, kind: any): (string?, error?)
    if not M.is_kind(kind) then return nil, errors.new({ message = "unknown period kind: " .. tostring(kind), kind = errors.INVALID }) end
    local y = math.floor(tonumber(year) or 0)
    local u = math.floor(tonumber(unit) or 0)
    local limit = units_per_year(tostring(kind))
    if u < 1 or u > limit then return nil, errors.new({ message = "period unit out of range: " .. tostring(unit), kind = errors.INVALID }) end
    if kind == types.PERIOD_QUARTER then return string.format("%04d-Q%d", y, u), nil end
    return string.format("%04d-%02d", y, u), nil
end

function M.validate(key: any, kind: any ): error?
    local _, err = M.parse(key, kind)
    return err
end

function M.period_index(key: any, kind: any): (number?, error?)
    local parts, err = M.parse(key, kind)
    if err or not parts then return nil, err end
    local index = (parts :: any).year * units_per_year(tostring(kind)) + ((parts :: any).unit - 1)
    return tonumber(index), nil
end

function M.index_to_key(index: any, kind: any): (string?, error?)
    if not M.is_kind(kind) then return nil, errors.new({ message = "unknown period kind: " .. tostring(kind), kind = errors.INVALID }) end
    local limit = units_per_year(tostring(kind))
    local i = math.floor(tonumber(index) or 0)
    local year = math.floor(i / limit)
    return M.format(year, i - year * limit + 1, kind)
end

function M.add(key: any, offset: any, kind: any): (string?, error?)
    local index, err = M.period_index(key, kind)
    if err or not index then return nil, err end
    return M.index_to_key(index + math.floor(tonumber(offset) or 0), kind)
end

-- now is optional so tests pin the clock: a { year, month, day? } table, an RFC3339
-- or YYYY-MM-DD string, otherwise the UTC wall clock. day defaults to the first of
-- the month, which is the only reading that leaves the period unchanged.
local function calendar_now(now: any): (any?, error?)
    if type(now) == "table" then
        local year = tonumber((now :: any).year)
        local month = tonumber((now :: any).month)
        if not year or not month then return nil, errors.new({ message = "injected now requires year and month", kind = errors.INVALID }) end
        if month < 1 or month > 12 then return nil, errors.new({ message = "injected now month must be 1..12", kind = errors.INVALID }) end
        local day = tonumber((now :: any).day) or 1
        if day < 1 or day > days_in_month(year, month) then return nil, errors.new({ message = "injected now day is out of range for its month", kind = errors.INVALID }) end
        return { year = year, month = month, day = day }, nil
    end
    if type(now) == "string" then
        local year, month = (now :: string):match(DATE_PATTERN)
        if not year then return nil, errors.new({ message = "injected now must start with YYYY-MM: " .. now, kind = errors.INVALID }) end
        local day = tonumber((now :: string):match(DAY_PATTERN)) or 1
        if day < 1 or day > days_in_month(tonumber(year) :: number, tonumber(month) :: number) then
            return nil, errors.new({ message = "injected now day is out of range for its month: " .. now, kind = errors.INVALID })
        end
        return { year = tonumber(year), month = tonumber(month), day = day }, nil
    end
    if now ~= nil then return nil, errors.new({ message = "injected now must be a table or a string", kind = errors.INVALID }) end
    local stamp: any = os.date("!*t")
    return { year = tonumber(stamp.year), month = tonumber(stamp.month), day = tonumber(stamp.day) }, nil
end

function M.current_period(kind: any, now: any): (string?, error?)
    if not M.is_kind(kind) then return nil, errors.new({ message = "unknown period kind: " .. tostring(kind), kind = errors.INVALID }) end
    local stamp, err = calendar_now(now)
    if err or not stamp then return nil, err end
    local month = (stamp :: any).month
    if kind == types.PERIOD_QUARTER then
        return M.format((stamp :: any).year, math.floor((month - 1) / 3) + 1, kind)
    end
    return M.format((stamp :: any).year, month, kind)
end

-- How far the moment sits inside its own period, as a fraction of that period's
-- length: the today marker needs an offset within the column, and calendar month
-- lengths (leap February included) differ, so the browser is never handed the date.
-- The first day of a period reads 0; the last day reads just short of 1.
function M.current_position(kind: any, now: any): (number?, error?)
    if not M.is_kind(kind) then return nil, errors.new({ message = "unknown period kind: " .. tostring(kind), kind = errors.INVALID }) end
    local stamp, err = calendar_now(now)
    if err or not stamp then return nil, err end
    local year: number = tonumber((stamp :: any).year) or 0
    local month: number = tonumber((stamp :: any).month) or 1
    local first_month: number = month
    local span: number = 1
    if kind == types.PERIOD_QUARTER then
        first_month = math.floor((month - 1) / 3) * 3 + 1
        span = 3
    end
    local elapsed: number = (tonumber((stamp :: any).day) or 1) - 1
    local total: number = 0
    for offset = 0, span - 1 do
        local m = first_month + offset
        if m < month then elapsed = elapsed + days_in_month(year, m) end
        total = total + days_in_month(year, m)
    end
    return elapsed / total, nil
end

-- Horizon is derived from status and schedule, never stored: a finished or
-- abandoned bet is behind us, an unscheduled one sits beyond the planning window.
function M.horizon(initiative: any, current_key: any, kind: any): (string?, error?)
    local item = type(initiative) == "table" and initiative or {}
    local status = tostring((item :: any).status or "")
    if status == types.STATUS_DONE or status == types.STATUS_DROPPED then return types.HORIZON.PAST, nil end

    local start_period = tostring((item :: any).start_period or "")
    if start_period == "" then return types.HORIZON.LATER, nil end

    local current, cerr = M.period_index(current_key, kind)
    if cerr or not current then return nil, cerr end
    local start_index, serr = M.period_index(start_period, kind)
    if serr or not start_index then return nil, serr end

    if start_index > current + types.HORIZON_LATER_OFFSET then return types.HORIZON.LATER, nil end
    if start_index <= current then return types.HORIZON.NOW, nil end
    return types.HORIZON.NEXT, nil
end

return M

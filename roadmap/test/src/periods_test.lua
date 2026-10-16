local test = require("test")
local periods = require("periods")
local types = require("types")

local QUARTER = types.PERIOD_QUARTER
local MONTH = types.PERIOD_MONTH

-- Period position is a fraction, so equality is asserted within one ulp of the
-- same division the implementation performs.
local function close(actual: any, expected: number): boolean
    return math.abs((tonumber(actual) or -1) - expected) < 1e-9
end

local function define_tests()
    test.describe("Roadmap Periods", function()
        test.it("parses a canonical quarter key into calendar parts", function()
            local parts, err = periods.parse("2026-Q3", QUARTER)
            test.is_nil(err)
            test.eq((parts :: any).year, 2026)
            test.eq((parts :: any).unit, 3)
        end)

        test.it("parses a canonical month key into calendar parts", function()
            local parts, err = periods.parse("2026-09", MONTH)
            test.is_nil(err)
            test.eq((parts :: any).year, 2026)
            test.eq((parts :: any).unit, 9)
        end)

        test.it("rejects a quarter outside 1..4", function()
            local _, err = periods.parse("2026-Q5", QUARTER)
            test.contains(tostring(err), "YYYY-Qn")
        end)

        test.it("rejects a month outside 01..12", function()
            local _, err = periods.parse("2026-13", MONTH)
            test.contains(tostring(err), "01..12")
        end)

        test.it("rejects a quarter key read as a month key", function()
            test.contains(tostring(periods.validate("2026-Q3", MONTH)), "YYYY-MM")
        end)

        test.it("rejects a month key read as a quarter key", function()
            test.contains(tostring(periods.validate("2026-09", QUARTER)), "YYYY-Qn")
        end)

        test.it("rejects an unknown period kind", function()
            local _, err = periods.parse("2026-Q3", "week")
            test.contains(tostring(err), "unknown period kind")
        end)

        test.it("accepts a well-formed key of each kind", function()
            test.is_nil(periods.validate("2026-Q1", QUARTER))
            test.is_nil(periods.validate("2026-01", MONTH))
        end)

        test.it("orders quarters across a year boundary by index", function()
            local q4 = select(1, periods.period_index("2026-Q4", QUARTER))
            local q1 = select(1, periods.period_index("2027-Q1", QUARTER))
            test.eq((q1 :: any) - (q4 :: any), 1)
        end)

        test.it("orders months across a year boundary by index", function()
            local december = select(1, periods.period_index("2026-12", MONTH))
            local january = select(1, periods.period_index("2027-01", MONTH))
            test.eq((january :: any) - (december :: any), 1)
        end)

        test.it("round-trips an index back to its key", function()
            local index = select(1, periods.period_index("2026-Q3", QUARTER))
            test.eq(select(1, periods.index_to_key(index, QUARTER)), "2026-Q3")
            local month_index = select(1, periods.period_index("2026-09", MONTH))
            test.eq(select(1, periods.index_to_key(month_index, MONTH)), "2026-09")
        end)

        test.it("adds quarters across a year boundary", function()
            test.eq(select(1, periods.add("2026-Q3", 3, QUARTER)), "2027-Q2")
            test.eq(select(1, periods.add("2026-Q1", -1, QUARTER)), "2025-Q4")
        end)

        test.it("adds months across a year boundary", function()
            test.eq(select(1, periods.add("2026-11", 3, MONTH)), "2027-02")
            test.eq(select(1, periods.add("2026-01", -1, MONTH)), "2025-12")
        end)

        test.it("maps every month of the year onto its quarter", function()
            local expected = { "Q1", "Q1", "Q1", "Q2", "Q2", "Q2", "Q3", "Q3", "Q3", "Q4", "Q4", "Q4" }
            for month = 1, 12 do
                local key = select(1, periods.current_period(QUARTER, { year = 2026, month = month }))
                test.eq(key, "2026-" .. expected[month])
            end
        end)

        test.it("formats the injected month as a month key", function()
            test.eq(select(1, periods.current_period(MONTH, { year = 2026, month = 7 })), "2026-07")
        end)

        test.it("accepts an RFC3339 instant as the injected clock", function()
            test.eq(select(1, periods.current_period(QUARTER, "2026-04-01T00:00:00Z")), "2026-Q2")
            test.eq(select(1, periods.current_period(MONTH, "2026-04-01T00:00:00Z")), "2026-04")
        end)

        test.it("rejects an injected clock without a calendar month", function()
            local _, err = periods.current_period(QUARTER, { year = 2026 })
            test.contains(tostring(err), "year and month")
        end)

        test.it("reads the live UTC clock into a well-formed key", function()
            local key, err = periods.current_period(QUARTER, nil)
            test.is_nil(err)
            test.is_nil(periods.validate(key, QUARTER))
        end)

        test.it("places a finished or abandoned initiative behind the window", function()
            test.eq(select(1, periods.horizon({ status = "done", start_period = "2030-Q1" }, "2026-Q3", QUARTER)), types.HORIZON.PAST)
            test.eq(select(1, periods.horizon({ status = "dropped", start_period = "2026-Q3" }, "2026-Q3", QUARTER)), types.HORIZON.PAST)
        end)

        test.it("places an unscheduled initiative beyond the window", function()
            test.eq(select(1, periods.horizon({ status = "idea" }, "2026-Q3", QUARTER)), types.HORIZON.LATER)
        end)

        test.it("buckets scheduled initiatives at every horizon boundary", function()
            local function horizon_at(start_period: string): any
                return select(1, periods.horizon({ status = "planned", start_period = start_period }, "2026-Q3", QUARTER))
            end
            test.eq(horizon_at("2026-Q2"), types.HORIZON.NOW)
            test.eq(horizon_at("2026-Q3"), types.HORIZON.NOW)
            test.eq(horizon_at("2026-Q4"), types.HORIZON.NEXT)
            test.eq(horizon_at("2027-Q1"), types.HORIZON.NEXT)
            test.eq(horizon_at("2027-Q2"), types.HORIZON.LATER)
        end)

        test.it("places the first day of a quarter at the start of its column", function()
            test.is_true(close(select(1, periods.current_position(QUARTER, "2026-07-01")), 0))
        end)

        test.it("places the last day of a quarter just short of its end", function()
            -- 2026 Q3 is 31 + 31 + 30 days; the last day has 91 of 92 days behind it.
            test.is_true(close(select(1, periods.current_position(QUARTER, "2026-09-30")), 91 / 92))
        end)

        test.it("measures a month against its own length in a leap year", function()
            test.is_true(close(select(1, periods.current_position(MONTH, "2024-02-01")), 0))
            test.is_true(close(select(1, periods.current_position(MONTH, "2024-02-29")), 28 / 29))
        end)

        test.it("measures a short February against twenty-eight days", function()
            test.is_true(close(select(1, periods.current_position(MONTH, "2023-02-28")), 27 / 28))
        end)

        test.it("counts the whole months already elapsed inside a leap-year quarter", function()
            -- 2024 Q1 is 31 + 29 + 31 days; 1 March has 60 of 91 days behind it.
            test.is_true(close(select(1, periods.current_position(QUARTER, "2024-03-01")), 60 / 91))
        end)

        test.it("rejects an unknown period kind for the position", function()
            local value, err = periods.current_position("week", "2026-07-01")
            test.is_nil(value)
            test.contains(tostring(err), "unknown period kind")
        end)

        test.it("reads the live UTC clock into a fraction inside the current period", function()
            local value, err = periods.current_position(QUARTER, nil)
            test.is_nil(err)
            test.is_true((tonumber(value) or -1) >= 0)
            test.is_true((tonumber(value) or 1) < 1)
        end)

        test.it("surfaces a start period that does not match the period kind", function()
            local value, err = periods.horizon({ status = "planned", start_period = "2026-Q3" }, "2026-09", MONTH)
            test.is_nil(value)
            test.contains(tostring(err), "YYYY-MM")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

local test = require("test")
local json = require("json")
local materializer = require("materializer")
local types = require("types")

local function database(table_name, row)
    local calls = { writes = 0 }
    local db: any = {
        type = function() return "postgres", nil end,
        query = function(_, statement)
            if table_name and statement:find("FROM " .. table_name .. " ", 1, true) then
                return { row }, nil
            end
            return {}, nil
        end,
        execute = function() calls.writes = calls.writes + 1; return {}, nil end,
    }
    return db, calls
end

local run_cases = test.run_cases(function()
    test.describe("Roadmap materializer JSON integrity", function()
        for _, field in ipairs({ "tags", "properties", "initiative_ids", "lens_state" }) do
            test.it("rejects corrupt stored " .. field .. " on reads and updates", function()
                local table_name, kind = "chestor_roadmap_initiatives", types.EVENT.INITIATIVE_UPDATED
                if field == "initiative_ids" then
                    table_name, kind = "chestor_roadmap_milestones", types.EVENT.MILESTONE_UPDATED
                elseif field == "lens_state" then
                    table_name, kind = "chestor_roadmap_settings", types.EVENT.SETTINGS_UPDATED
                end
                for _, raw in ipairs({ "{broken", "7" }) do
                    local row: any = { id = "item", tags = "[]", properties = "{}",
                        initiative_ids = "[]", lens_state = "{}" }
                    row[field] = raw
                    local db, calls = database(table_name, row)
                    local value, err = materializer.raw_state(db, "roadmap")
                    test.is_nil(value)
                    test.not_nil(err)
                    local write_err = materializer.project_event(db, "roadmap", {
                        type = kind, body = { id = "item", title = "Updated" },
                    })
                    test.not_nil(write_err)
                    test.eq(calls.writes, 0)
                end
            end)
        end

        test.it("preserves a malformed event-body decode error", function()
            local db, calls = database(nil, nil)
            local _, expected = json.decode("{broken")
            local err = materializer.project_event(db, "roadmap", {
                type = types.EVENT.INITIATIVE_ADDED, body = "{broken",
            })
            test.eq(tostring(err), tostring(expected))
            test.eq(calls.writes, 0)
        end)
    end)
end)

return { run = run_cases }

local sql = require("sql")
local time = require("time")
local registry = require("registry")

local function run()
    local entries, find_err = registry.find({ ["meta.type"] = "migration", ["meta.target_db"] = "app:db" })
    if find_err then error("migration discovery failed: " .. tostring(find_err)) end
    if not entries or #entries == 0 then error("no migrations target the harness database") end
    local pending: { string } = {}
    for _ = 1, 300 do
        local db, open_err = sql.get("app:db")
        if open_err or not db then error("migration database unavailable: " .. tostring(open_err)) end
        local dialect, type_err = db:type()
        if type_err then db:release(); error(tostring(type_err)) end
        local statement: string
        if dialect == "postgres" then
            statement = "SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public' AND tablename = '_migrations'"
        elseif dialect == "sqlite" then
            statement = "SELECT name FROM sqlite_master WHERE type = 'table' AND name = '_migrations'"
        else
            db:release()
            error("unsupported migration database type: " .. tostring(dialect))
        end
        local tables, table_err = db:query(statement)
        if table_err then db:release(); error(tostring(table_err)) end
        local applied: { [string]: boolean } = {}
        if tables and #tables > 0 then
            local rows, query_err = db:query("SELECT id FROM _migrations")
            if query_err then db:release(); error(tostring(query_err)) end
            for _, row in ipairs(rows or {}) do applied[tostring(row.id)] = true end
        end
        db:release()
        pending = {}
        for _, entry in ipairs(entries) do
            if not applied[tostring(entry.id)] then pending[#pending + 1] = tostring(entry.id) end
        end
        if #pending == 0 then return true end
        time.sleep("100ms")
    end
    error("journal migrations did not complete within 30s: " .. table.concat(pending, ", "))
end

return { run = run }

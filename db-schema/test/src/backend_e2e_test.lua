local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")
local contract = require("contract")
local sql = require("sql")
local json = require("json")

local PROBE = "app:schema_probe"
local READ = "chestor.db_schema.lifecycle:read"
local DB_KIND = "chestor.db_schema:database"
local THREADS = "kickside.core:threads"
local DELETE = "chestor.db_schema.binding:delete_schema"
local GET_TOOL = "chestor.db_schema.traits:get_schema_tool"
local EDIT_TOOL = "chestor.db_schema.traits:edit_schema_tool"

local EVENT = {
    TABLE_ADDED = "chestor.db_schema.events:table.added",
    TABLE_UPDATED = "chestor.db_schema.events:table.updated",
    TABLE_REMOVED = "chestor.db_schema.events:table.removed",
    COLUMN_ADDED = "chestor.db_schema.events:column.added",
    COLUMN_UPDATED = "chestor.db_schema.events:column.updated",
    COLUMN_REMOVED = "chestor.db_schema.events:column.removed",
    COLUMNS_REORDERED = "chestor.db_schema.events:columns.reordered",
    RELATION_ADDED = "chestor.db_schema.events:relation.added",
    RELATION_UPDATED = "chestor.db_schema.events:relation.updated",
    RELATION_REMOVED = "chestor.db_schema.events:relation.removed",
    INDEX_ADDED = "chestor.db_schema.events:index.added",
    INDEX_UPDATED = "chestor.db_schema.events:index.updated",
    INDEX_REMOVED = "chestor.db_schema.events:index.removed",
    LAYOUT_POSITION_SET = "chestor.db_schema.events:layout.position-set",
    LAYOUT_POSITION_CLEARED = "chestor.db_schema.events:layout.position-cleared",
    LAYOUT_VIEWPORT_SET = "chestor.db_schema.events:layout.viewport-set",
}

local function uuid(): string
    local id, err = crypto.random.uuid()
    test.is_nil(err)
    return id
end

local function executor(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "db_schema_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local function executor_with_groups(user_id: string, groups: { string }): any
    local actor: any = security.new_actor(user_id, { security_groups = groups })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local threads

local function schema_component(user_id: string, title: string): string
    local inst = threads(user_id)
    local reg, rerr = inst:create({
        impl_id = DB_KIND,
        thread_class = "workspace.schema",
        title = title,
    })
    test.is_nil(rerr)
    test.not_nil(reg)
    test.not_nil((reg :: any).component_id or (reg :: any).thread_id)
    return tostring((reg :: any).component_id or (reg :: any).thread_id)
end

function threads(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "db_schema_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    local svc, cerr = contract.get(THREADS)
    test.is_nil(cerr)
    test.not_nil(svc)
    local inst, oerr = svc:with_actor(actor):with_scope(scope):open()
    test.is_nil(oerr)
    test.not_nil(inst)
    return inst
end

local function command(etype: string, body: any): any
    return { type = etype, body = body }
end

local function call_probe(user_id: string, op: string, input: any): any
    local result, err = executor(user_id):call(PROBE, { op = op, input = input })
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function call_read(user_id: string, entry_id: string, name: string): any
    local result, err = executor(user_id):call(READ, { entry = { id = entry_id, name = name } })
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function count_rows(table_name: string, schema_id: string): number
    local db, err = sql.get("app:db")
    test.is_nil(err)
    test.not_nil(db)
    local db_type, type_err = db:type()
    test.is_nil(type_err)
    local statement = "SELECT COUNT(*) AS count FROM " .. table_name .. " WHERE schema_id = ?"
    if tostring(db_type) == "postgres" then statement = statement:gsub("%?", "$1") end
    local rows, qerr = db:query(statement, { schema_id })
    db:release()
    test.is_nil(qerr)
    return tonumber(rows and rows[1] and rows[1].count) or 0
end

local function projection_body(user_id: string, thread_id: string): any
    local c = threads(user_id)
    local listed, err = c:list_projections({ thread_id = thread_id, limit = 50 })
    test.is_nil(err)
    for _, p in ipairs((listed and listed.projections) or {}) do
        if tostring((p :: any).kind) == "chestor.db_schema:state" then
            local body = (p :: any).body
            if type(body) == "string" then body = json.decode(body :: string) end
            return body
        end
    end
    return nil
end

local function call_delete(user_id: string, component_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "db_schema_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    local result, err = funcs.new()
        :with_actor(actor)
        :with_scope(scope)
        :with_context({ component_id = component_id })
        :call(DELETE, {})
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function define_tests()
    test.describe("DB Schema backend E2E", function()
        test.it("appends through the real thread contract and reads normalized schema tables", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Customer DB")
            local commands = {
                command(EVENT.TABLE_ADDED, { id = "users", name = "users", description = string.rep("évidence ", 40) }),
                command(EVENT.TABLE_ADDED, { id = "orgs", name = "orgs" }),
                command(EVENT.COLUMN_ADDED, { id = "users_id", table_id = "users", name = "id", col_type = "uuid", primary_key = true }),
                command(EVENT.COLUMN_ADDED, { id = "users_org", table_id = "users", name = "org_id", col_type = "uuid" }),
                command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid", primary_key = true }),
                command(EVENT.RELATION_ADDED, { id = "r1", from_table_id = "users", from_column_id = "users_org", to_table_id = "orgs", to_column_id = "orgs_id", relation_type = "many_to_one" }),
                command(EVENT.INDEX_ADDED, { id = "idx_users_org", table_id = "users", name = "idx_users_org", columns = { "users_org" } }),
                command(EVENT.LAYOUT_POSITION_SET, { table_id = "users", x = 10, y = 20 }),
            }

            local applied = call_probe(user_id, "apply", { entry_id = entry_id, commands = commands })
            test.is_true(applied.ok, tostring(applied.err))
            test.eq(applied.schema.thread_id, entry_id)
            test.eq(#applied.schema.tables, 2)
            test.eq(#applied.schema.relations, 1)
            test.eq(#applied.schema.indexes, 1)
            test.eq(count_rows("chestor_schema_tables", entry_id), 2)
            test.eq(count_rows("chestor_schema_columns", entry_id), 3)
            test.eq(count_rows("chestor_schema_relations", entry_id), 1)
            test.eq(count_rows("chestor_schema_indexes", entry_id), 1)

            local read, read_err = executor(user_id):call(GET_TOOL, { entry_id = entry_id })
            test.is_nil(read_err)
            test.is_true((read :: any).success, tostring((read :: any).error))
            local schema = (read :: any).schema
            test.eq(#schema.tables, 2)
            test.eq(#schema.relations, 1)
            test.eq(#schema.indexes, 1)
            test.eq(schema.relations[1].relation_type, "many_to_one")
            local users_row
            for _, row in ipairs(schema.tables) do if row.id == "users" then users_row = row end end
            test.eq(users_row.description, string.rep("évidence ", 40))
            test.eq(#users_row.columns, 2)
            test.eq(users_row.columns[2].col_type, "uuid")

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.eq(#tables.result.tables, 1)
            test.eq(tables.result.tables[1].id, "users")
            test.eq(#tables.result.tables[1].columns, 2)

            local relations = call_probe(user_id, "relations", { entry_id = entry_id, options = { table_id = "users" } })
            test.is_true(relations.ok, tostring(relations.err))
            test.eq(#relations.result.relations, 1)
            test.eq(relations.result.relations[1].id, "r1")

            local indexes = call_probe(user_id, "indexes", { entry_id = entry_id, options = { table_id = "users" } })
            test.is_true(indexes.ok, tostring(indexes.err))
            test.eq(#indexes.result.indexes, 1)
            test.eq(indexes.result.indexes[1].id, "idx_users_org")

            local body = projection_body(user_id, entry_id)
            test.eq(body.materialized, "chestor_schema_tables")
            test.is_nil(body.tables)
            test.is_nil(body.columns)

            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, #commands)

            local rendered = call_read(user_id, entry_id, "Customer DB")
            test.is_true(rendered.success, tostring(rendered.error))
            test.contains(rendered.text, "# Customer DB")
            test.contains(rendered.text, "## users")
            test.contains(rendered.text, "org_id")

            local denied, denied_err = executor_with_groups("schema-denied-" .. uuid(), {})
                :call(READ, { entry = { id = entry_id, name = "Customer DB" } })
            test.is_nil(denied)
            test.is_true(errors.is(denied_err, errors.NOT_FOUND))
        end)

        test.it("keeps a large schema in normalized tables instead of projection JSON", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Large Schema")
            local commands = {}
            for i = 1, 250 do
                commands[#commands + 1] = command(EVENT.TABLE_ADDED, {
                    id = "table_" .. tostring(i),
                    name = "table_" .. tostring(i),
                })
            end

            local applied = call_probe(user_id, "apply", { entry_id = entry_id, commands = commands })
            test.is_true(applied.ok, tostring(applied.err))
            test.eq(#applied.schema.tables, 250)
            test.eq(count_rows("chestor_schema_tables", entry_id), 250)

            local body = projection_body(user_id, entry_id)
            test.eq(body.materialized, "chestor_schema_tables")
            test.is_nil(body.tables)
            test.eq(tonumber(body.counts.tables), 250)
        end)

        test.it("returns the applied schema read model from the EditDatabaseSchema tool", function()
            local user_id = "schema-tool-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Shipping DB")
            local edited, edit_err = executor(user_id):call(EDIT_TOOL, {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "orders", name = "orders" }),
                    command(EVENT.TABLE_ADDED, { id = "shipments", name = "shipments" }),
                },
            })
            test.is_nil(edit_err)
            test.is_true((edited :: any).success, tostring((edited :: any).error))
            local names = {}
            for _, table_row in ipairs((edited :: any).schema.tables) do names[tostring(table_row.id)] = table_row.name end
            test.eq(names.orders, "orders")
            test.eq(names.shipments, "shipments")
        end)

        test.it("rejects duplicate table creates without replacing existing facts", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Duplicate Table Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.TABLE_ADDED, { id = "users", name = "users" }) },
            })
            test.is_true(created.ok, tostring(created.err))

            local duplicate = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.TABLE_ADDED, { id = "users", name = "shadow_users" }) },
            })
            test.is_false(duplicate.ok)
            test.contains(tostring(duplicate.err), "table already exists")

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.eq(#tables.result.tables, 1)
            test.eq(tables.result.tables[1].name, "users")

            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 1)
        end)

        test.it("rejects an invalid batch without appending partial schema events", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Invalid Batch Schema")
            local invalid = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.COLUMN_ADDED, { id = "missing_col", table_id = "missing", name = "missing_id", col_type = "uuid" }),
                },
            })
            test.is_false(invalid.ok)
            test.contains(tostring(invalid.err), "column table not found")

            test.eq(count_rows("chestor_schema_tables", entry_id), 0)
            test.eq(count_rows("chestor_schema_columns", entry_id), 0)
            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 0)
        end)

        test.it("rejects relations and indexes that reference missing schema facts", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Reference Validation Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.TABLE_ADDED, { id = "orgs", name = "orgs" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_id", table_id = "users", name = "id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local bad_relation = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.RELATION_ADDED, {
                        id = "r_bad",
                        from_table_id = "users",
                        from_column_id = "missing",
                        to_table_id = "orgs",
                        to_column_id = "orgs_id",
                        relation_type = "many_to_one",
                    }),
                },
            })
            test.is_false(bad_relation.ok)
            test.contains(tostring(bad_relation.err), "relation column not found")

            local bad_index = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.INDEX_ADDED, { id = "idx_bad", table_id = "users", name = "idx_bad", columns = { "missing" } }),
                },
            })
            test.is_false(bad_index.ok)
            test.contains(tostring(bad_index.err), "index column not found")

            test.eq(count_rows("chestor_schema_relations", entry_id), 0)
            test.eq(count_rows("chestor_schema_indexes", entry_id), 0)
            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 4)
        end)

        test.it("removing a column clears dependent relations and indexes from normalized tables", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Column Cascade Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.TABLE_ADDED, { id = "orgs", name = "orgs" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_id", table_id = "users", name = "id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_org", table_id = "users", name = "org_id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid" }),
                    command(EVENT.RELATION_ADDED, { id = "r_org", from_table_id = "users", from_column_id = "users_org", to_table_id = "orgs", to_column_id = "orgs_id", relation_type = "many_to_one" }),
                    command(EVENT.INDEX_ADDED, { id = "idx_users_org", table_id = "users", name = "idx_users_org", columns = { "users_org" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local removed = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.COLUMN_REMOVED, { id = "users_org" }) },
            })
            test.is_true(removed.ok, tostring(removed.err))
            test.eq(count_rows("chestor_schema_columns", entry_id), 2)
            test.eq(count_rows("chestor_schema_relations", entry_id), 0)
            test.eq(count_rows("chestor_schema_indexes", entry_id), 0)
        end)

        test.it("reorders columns through normalized table reads", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Column Order Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.COLUMN_ADDED, { id = "a", table_id = "users", name = "a", col_type = "text" }),
                    command(EVENT.COLUMN_ADDED, { id = "b", table_id = "users", name = "b", col_type = "text" }),
                    command(EVENT.COLUMN_ADDED, { id = "c", table_id = "users", name = "c", col_type = "text" }),
                    command(EVENT.COLUMNS_REORDERED, { table_id = "users", order = { "c", "a", "b" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.eq(tables.result.tables[1].columns[1].id, "c")
            test.eq(tables.result.tables[1].columns[2].id, "a")
            test.eq(tables.result.tables[1].columns[3].id, "b")
        end)

        test.it("updates relation and index rows while keeping exact-id queries coherent", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Update Query Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.TABLE_ADDED, { id = "orgs", name = "orgs" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_id", table_id = "users", name = "id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_org", table_id = "users", name = "org_id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid" }),
                    command(EVENT.RELATION_ADDED, { id = "r_org", from_table_id = "users", from_column_id = "users_org", to_table_id = "orgs", to_column_id = "orgs_id", relation_type = "many_to_one" }),
                    command(EVENT.INDEX_ADDED, { id = "idx_users_org", table_id = "users", name = "idx_users_org", columns = { "users_org" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.RELATION_UPDATED, { id = "r_org", name = "org owner", relation_type = "one_to_one" }),
                    command(EVENT.INDEX_UPDATED, { id = "idx_users_org", name = "idx_users_org_unique", unique_idx = true }),
                },
            })
            test.is_true(updated.ok, tostring(updated.err))

            local relations = call_probe(user_id, "relations", { entry_id = entry_id, options = { id = "r_org" } })
            test.is_true(relations.ok, tostring(relations.err))
            test.eq(#relations.result.relations, 1)
            test.eq(relations.result.relations[1].name, "org owner")
            test.eq(relations.result.relations[1].relation_type, "one_to_one")

            local indexes = call_probe(user_id, "indexes", { entry_id = entry_id, options = { id = "idx_users_org" } })
            test.is_true(indexes.ok, tostring(indexes.err))
            test.eq(#indexes.result.indexes, 1)
            test.eq(indexes.result.indexes[1].name, "idx_users_org_unique")
            test.is_true(indexes.result.indexes[1].unique_idx)
        end)

        test.it("returns layout in exact table queries", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Table Layout Query Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.LAYOUT_POSITION_SET, { table_id = "users", x = 160, y = 240, width = 300, height = 120 }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.eq(#tables.result.tables, 1)
            test.eq(tables.result.tables[1].layout.x, 160)
            test.eq(tables.result.tables[1].layout.y, 240)
            test.eq(tables.result.tables[1].layout.width, 300)
        end)

        test.it("rejects invalid column retargets without mutating the original row", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Column Retarget Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_name", table_id = "users", name = "name", col_type = "text" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local invalid = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.COLUMN_UPDATED, { id = "users_name", table_id = "missing" }) },
            })
            test.is_false(invalid.ok)
            test.contains(tostring(invalid.err), "column table not found")

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.eq(#tables.result.tables[1].columns, 1)
            test.eq(tables.result.tables[1].columns[1].id, "users_name")
            test.eq(tables.result.tables[1].columns[1].table_id, "users")
        end)

        test.it("rejects duplicate column order without changing persisted order", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Duplicate Order Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.COLUMN_ADDED, { id = "a", table_id = "users", name = "a", col_type = "text" }),
                    command(EVENT.COLUMN_ADDED, { id = "b", table_id = "users", name = "b", col_type = "text" }),
                    command(EVENT.COLUMNS_REORDERED, { table_id = "users", order = { "b", "a" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local invalid = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.COLUMNS_REORDERED, { table_id = "users", order = { "a", "a" } }) },
            })
            test.is_false(invalid.ok)
            test.contains(tostring(invalid.err), "duplicate column")

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.eq(tables.result.tables[1].columns[1].id, "b")
            test.eq(tables.result.tables[1].columns[2].id, "a")
        end)

        test.it("removes relation and index rows through declared remove events", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Remove Rows Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.TABLE_ADDED, { id = "orgs", name = "orgs" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_org", table_id = "users", name = "org_id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid" }),
                    command(EVENT.RELATION_ADDED, { id = "r_org", from_table_id = "users", from_column_id = "users_org", to_table_id = "orgs", to_column_id = "orgs_id", relation_type = "many_to_one" }),
                    command(EVENT.INDEX_ADDED, { id = "idx_users_org", table_id = "users", name = "idx_users_org", columns = { "users_org" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local removed = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.RELATION_REMOVED, { id = "r_org" }),
                    command(EVENT.INDEX_REMOVED, { id = "idx_users_org" }),
                },
            })
            test.is_true(removed.ok, tostring(removed.err))

            local relations = call_probe(user_id, "relations", { entry_id = entry_id, options = { id = "r_org" } })
            test.is_true(relations.ok, tostring(relations.err))
            test.eq(#relations.result.relations, 0)
            local indexes = call_probe(user_id, "indexes", { entry_id = entry_id, options = { id = "idx_users_org" } })
            test.is_true(indexes.ok, tostring(indexes.err))
            test.eq(#indexes.result.indexes, 0)
        end)

        test.it("clears layout rows and preserves viewport state", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Layout Clear Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.LAYOUT_POSITION_SET, { table_id = "users", x = 10, y = 20 }),
                    command(EVENT.LAYOUT_VIEWPORT_SET, { x = 100, y = 200, zoom = 1.5 }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local cleared = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.LAYOUT_POSITION_CLEARED, { table_id = "users" }) },
            })
            test.is_true(cleared.ok, tostring(cleared.err))

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.is_nil(tables.result.tables[1].layout)
            local state = call_probe(user_id, "state", { entry_id = entry_id })
            test.is_true(state.ok, tostring(state.err))
            test.eq(state.schema.viewport.x, 100)
            test.eq(state.schema.viewport.y, 200)
            test.eq(state.schema.viewport.zoom, 1.5)
        end)

        test.it("filters table reads by search and limit without dropping columns", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Search Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users", description = "application people" }),
                    command(EVENT.TABLE_ADDED, { id = "orgs", name = "organizations", description = "accounts" }),
                    command(EVENT.TABLE_ADDED, { id = "audit", name = "audit_log", description = "events" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_id", table_id = "users", name = "id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))

            local searched = call_probe(user_id, "tables", { entry_id = entry_id, options = { search = "app", limit = 1 } })
            test.is_true(searched.ok, tostring(searched.err))
            test.eq(#searched.result.tables, 1)
            test.eq(searched.result.tables[1].id, "users")
            test.eq(#searched.result.tables[1].columns, 1)
        end)

        test.it("rejects duplicate relation and index creates without appending events", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Duplicate Relation Index Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.TABLE_ADDED, { id = "orgs", name = "orgs" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_org", table_id = "users", name = "org_id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid" }),
                    command(EVENT.RELATION_ADDED, { id = "r_org", from_table_id = "users", from_column_id = "users_org", to_table_id = "orgs", to_column_id = "orgs_id", relation_type = "many_to_one" }),
                    command(EVENT.INDEX_ADDED, { id = "idx_users_org", table_id = "users", name = "idx_users_org", columns = { "users_org" } }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local duplicate_relation = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.RELATION_ADDED, { id = "r_org", from_table_id = "users", to_table_id = "orgs", relation_type = "many_to_one" }) },
            })
            test.is_false(duplicate_relation.ok)
            test.contains(tostring(duplicate_relation.err), "relation already exists")
            local duplicate_index = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.INDEX_ADDED, { id = "idx_users_org", table_id = "users", name = "idx_users_org", columns = { "users_org" } }) },
            })
            test.is_false(duplicate_index.ok)
            test.contains(tostring(duplicate_index.err), "index already exists")

            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 6)
        end)

        test.it("destroys schema components by purging threads and normalized rows", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Destroyed Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_id", table_id = "users", name = "id", col_type = "uuid" }),
                    command(EVENT.LAYOUT_POSITION_SET, { table_id = "users", x = 1, y = 2 }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            test.eq(count_rows("chestor_schema_tables", entry_id), 1)

            local destroyed = call_probe(user_id, "destroy", { entry_id = entry_id })
            test.is_true(destroyed.ok, tostring(destroyed.err))
            test.eq(count_rows("chestor_schema_tables", entry_id), 0)
            test.eq(count_rows("chestor_schema_columns", entry_id), 0)
            test.eq(count_rows("chestor_schema_layout", entry_id), 0)

            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_false(events.ok)
        end)

        test.it("deletable.delete reports the real destroy outcome instead of a hardcoded success", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Deletable Binding Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            test.eq(count_rows("chestor_schema_tables", entry_id), 1)

            local deleted = call_delete(user_id, entry_id)
            test.is_true((deleted :: any).success, tostring((deleted :: any).error))
            test.is_nil((deleted :: any).error)
            test.eq(count_rows("chestor_schema_tables", entry_id), 0)

            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_false(events.ok)
        end)

        test.it("updates table and column scalar fields in normalized reads", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Scalar Update Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users", description = "old" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_email", table_id = "users", name = "email", col_type = "text", nullable = true }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local updated = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_UPDATED, { id = "users", name = "people", description = "new", properties = { owner = "crm" }, sort_order = 50 }),
                    command(EVENT.COLUMN_UPDATED, { id = "users_email", name = "email_address", col_type = "varchar", nullable = false, unique_col = true, default_value = "n/a" }),
                },
            })
            test.is_true(updated.ok, tostring(updated.err))

            local tables = call_probe(user_id, "tables", { entry_id = entry_id, options = { id = "users" } })
            test.is_true(tables.ok, tostring(tables.err))
            test.eq(tables.result.tables[1].name, "people")
            test.eq(tables.result.tables[1].description, "new")
            test.eq(tables.result.tables[1].properties.owner, "crm")
            test.eq(tables.result.tables[1].columns[1].name, "email_address")
            test.eq(tables.result.tables[1].columns[1].col_type, "varchar")
            test.is_false(tables.result.tables[1].columns[1].nullable)
            test.is_true(tables.result.tables[1].columns[1].unique_col)
            test.eq(tables.result.tables[1].columns[1].default_value, "n/a")
        end)

        test.it("rejects missing-fact removals without appending events", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Missing Remove Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = { command(EVENT.TABLE_ADDED, { id = "users", name = "users" }) },
            })
            test.is_true(created.ok, tostring(created.err))

            for _, spec in ipairs({
                { event = EVENT.TABLE_REMOVED, body = { id = "missing" }, text = "table not found" },
                { event = EVENT.COLUMN_REMOVED, body = { id = "missing" }, text = "column not found" },
                { event = EVENT.RELATION_REMOVED, body = { id = "missing" }, text = "relation not found" },
                { event = EVENT.INDEX_REMOVED, body = { id = "missing" }, text = "index not found" },
                { event = EVENT.LAYOUT_POSITION_CLEARED, body = { table_id = "missing" }, text = "layout table not found" },
            }) do
                local invalid = call_probe(user_id, "apply", {
                    entry_id = entry_id,
                    commands = { command(spec.event, spec.body) },
                })
                test.is_false(invalid.ok)
                test.contains(tostring(invalid.err), spec.text)
            end

            local events = call_probe(user_id, "list_events", { thread_id = entry_id })
            test.is_true(events.ok, tostring(events.err))
            test.eq(#events.result.events, 1)
        end)

        test.it("rejects relation retargets to columns owned by another table", function()
            local user_id = "schema-owner-" .. uuid()
            local entry_id = schema_component(user_id, "Relation Retarget Schema")
            local created = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.TABLE_ADDED, { id = "users", name = "users" }),
                    command(EVENT.TABLE_ADDED, { id = "orgs", name = "orgs" }),
                    command(EVENT.TABLE_ADDED, { id = "teams", name = "teams" }),
                    command(EVENT.COLUMN_ADDED, { id = "users_org", table_id = "users", name = "org_id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "orgs_id", table_id = "orgs", name = "id", col_type = "uuid" }),
                    command(EVENT.COLUMN_ADDED, { id = "teams_id", table_id = "teams", name = "id", col_type = "uuid" }),
                    command(EVENT.RELATION_ADDED, { id = "r_org", from_table_id = "users", from_column_id = "users_org", to_table_id = "orgs", to_column_id = "orgs_id", relation_type = "many_to_one" }),
                },
            })
            test.is_true(created.ok, tostring(created.err))
            local invalid = call_probe(user_id, "apply", {
                entry_id = entry_id,
                commands = {
                    command(EVENT.RELATION_UPDATED, { id = "r_org", to_table_id = "teams", to_column_id = "orgs_id" }),
                },
            })
            test.is_false(invalid.ok)
            test.contains(tostring(invalid.err), "relation column not found")

            local relations = call_probe(user_id, "relations", { entry_id = entry_id, options = { id = "r_org" } })
            test.is_true(relations.ok, tostring(relations.err))
            test.eq(relations.result.relations[1].to_table_id, "orgs")
            test.eq(relations.result.relations[1].to_column_id, "orgs_id")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

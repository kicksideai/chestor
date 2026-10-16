local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")
local contract = require("contract")
local sql = require("sql")
local json = require("json")
local http_client = require("http_client")
local registry = require("registry")
local types = require("types")

local PROBE = "app:roadmap_probe"
local MINT = "app:mint_token"
local READ = "chestor.roadmap.binding:read"
local GET_TOOL = "chestor.roadmap.traits:get_roadmap_tool"
local QUERY_TOOL = "chestor.roadmap.traits:query_roadmap_tool"
local APPLY_TOOL = "chestor.roadmap.traits:apply_roadmap_tool"
local COMPONENT_SERVICE = "kickside.component:component_service"
local function endpoint(path: string): string
    local gateway = assert(registry.get("app:gateway"))
    local port = assert(tostring(gateway.data.addr):match(":(%d+)$"))
    return "http://127.0.0.1:" .. port .. "/api/workspace/roadmaps/" .. path
end
local GROUPS = { "roadmap_test" }
local E = types.EVENT

local function uuid(): string
    local id, err = crypto.random.uuid()
    test.is_nil(err)
    return id
end

local function executor(user_id: string, groups: { string }): any
    local actor: any = security.new_actor(user_id, { security_groups = groups })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local function opened(user_id: string, groups: { string }, contract_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = groups })
    local scope: any = security.named_scope("wippy.security:process")
    local def, cerr = contract.get(contract_id)
    test.is_nil(cerr)
    test.not_nil(def)
    local inst, oerr = def:with_actor(actor):with_scope(scope):open()
    test.is_nil(oerr)
    test.not_nil(inst)
    return inst
end

local function threads(user_id: string): any
    return opened(user_id, GROUPS, types.THREADS)
end

local function components(user_id: string): any
    return opened(user_id, GROUPS, COMPONENT_SERVICE)
end

local function roadmap_component(user_id: string, title: string): string
    local registration, err = threads(user_id):create({
        impl_id = types.IMPL_ID,
        thread_class = types.THREAD_CLASS,
        title = title,
    })
    test.is_nil(err)
    test.not_nil(registration)
    return tostring((registration :: any).component_id or (registration :: any).thread_id)
end

local function catch_up(user_id: string, entry_id: string)
    -- Production reads serve the latest committed projection and never drive its
    -- cursor. A test that asserts read-model contents advances the async worker
    -- explicitly, at the harness boundary.
    local caught, err = threads(user_id):catch_up_projection({
        thread_id = entry_id,
        kind = types.PROJECTION_KIND,
        max_ticks = 1000,
    })
    test.is_nil(err)
    test.not_nil(caught)
end

local function probe(user_id: string, op: string, input: any): any
    local result, err = executor(user_id, GROUPS):call(PROBE, { op = op, input = input })
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function command(etype: string, body: any): any
    return { type = etype, body = body }
end

local function token_for(user_id: string, groups: { string }): string
    local minted, err = executor(user_id, groups):call(MINT, { user_id = user_id, groups = groups })
    test.is_nil(err)
    test.not_nil(minted)
    return tostring((minted :: any).token)
end

local function decode(response: any): any
    test.not_nil(response)
    local body, err = json.decode(tostring((response :: any).body or ""))
    test.is_nil(err, "undecodable response: " .. tostring((response :: any).body))
    test.not_nil(body)
    return body
end

local function headers(token: string?): any
    local out: any = { ["Content-Type"] = "application/json" }
    if token then out.Authorization = "Bearer " .. token end
    return out
end

local function http_get(path: string, token: string?): (any, any)
    local response, err = http_client.get(endpoint(path), { headers = headers(token) })
    test.is_nil(err)
    return decode(response), response
end

local function http_post(path: string, token: string?, body: any): (any, any)
    local response, err = http_client.post(endpoint(path), {
        headers = headers(token),
        body = json.encode(body or {}),
    })
    test.is_nil(err)
    return decode(response), response
end

local function app_db(): any
    local db, err = sql.get("app:db")
    test.is_nil(err)
    test.not_nil(db)
    return db
end

local function statement_for(db: any, statement: string): string
    local db_type, err = db:type()
    test.is_nil(err)
    if tostring(db_type) ~= "postgres" then return statement end
    local position = 0
    return (statement:gsub("%?", function(): string
        position = position + 1
        return "$" .. tostring(position)
    end))
end

local function count_rows(table_name: string, roadmap_id: string): number
    local db = app_db()
    local rows, err = db:query(statement_for(db, "SELECT COUNT(*) AS count FROM " .. table_name .. " WHERE roadmap_id = ?"), { roadmap_id })
    db:release()
    test.is_nil(err)
    return tonumber(rows and rows[1] and rows[1].count) or 0
end

-- The smallest roadmap that exercises every entity and every referential rule.
local function seed_commands(): { any }
    return {
        command(E.SETTINGS_UPDATED, { settings = { period_kind = "quarter", origin = "2026-Q3", columns = 4, default_lens = "timeline" } }),
        command(E.LAYER_ADDED, { id = "platform", title = "Platform", sort_order = 0, color = "#0ea5e9" }),
        command(E.LAYER_ADDED, { id = "product", title = "Product", sort_order = 1 }),
        command(E.OUTCOME_ADDED, { id = "retention", title = "Retention", sort_order = 0 }),
        command(E.INITIATIVE_ADDED, { id = "auth", title = "Auth", description = "Agent-visible detail", layer_id = "platform", outcome_id = "retention", start_period = "2026-Q3", size = "L", confidence = "high", status = "active", progress = 0.5, tags = { "priority" }, properties = { source = "test" } }),
        command(E.INITIATIVE_ADDED, { id = "billing", title = "Billing", layer_id = "platform", start_period = "2026-Q4" }),
        command(E.INITIATIVE_ADDED, { id = "console", title = "Console", layer_id = "product" }),
        command(E.DEPENDENCY_ADDED, { id = "auth-billing", from_id = "auth", to_id = "billing", note = "tokens first" }),
        command(E.MILESTONE_ADDED, { id = "ga", title = "GA", period = "2026-Q4", layer_id = "platform", initiative_ids = { "auth", "billing" } }),
    }
end

local function seeded_roadmap(user_id: string, title: string): string
    local entry_id = roadmap_component(user_id, title)
    local applied = probe(user_id, "apply", { entry_id = entry_id, commands = seed_commands() })
    test.is_true((applied :: any).ok, tostring((applied :: any).err))
    catch_up(user_id, entry_id)
    return entry_id
end

local function define_tests()
    test.describe("Roadmap backend E2E", function()
        test.it("appends through the real thread, materializes the read model, and serves it over http", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = roadmap_component(user_id, "Platform Roadmap")
            local commands = seed_commands()

            local applied = probe(user_id, "apply", { entry_id = entry_id, commands = commands })
            test.is_true((applied :: any).ok, tostring((applied :: any).err))
            test.eq((applied :: any).roadmap.thread_id, entry_id)
            test.eq((applied :: any).roadmap.counts.layers, 2)
            test.eq((applied :: any).roadmap.counts.initiatives, 3)
            test.eq((applied :: any).roadmap.counts.dependencies, 1)
            test.eq((applied :: any).roadmap.counts.milestones, 1)

            local events = probe(user_id, "list_events", { thread_id = entry_id })
            test.is_true((events :: any).ok, tostring((events :: any).err))
            test.eq(#(events :: any).result.events, #commands)
            test.eq((events :: any).result.events[1].type, E.SETTINGS_UPDATED)

            catch_up(user_id, entry_id)
            test.eq(count_rows("chestor_roadmap_layers", entry_id), 2)
            test.eq(count_rows("chestor_roadmap_initiatives", entry_id), 3)
            test.eq(count_rows("chestor_roadmap_dependencies", entry_id), 1)
            test.eq(count_rows("chestor_roadmap_milestones", entry_id), 1)

            local body, response = http_get(entry_id, token_for(user_id, GROUPS))
            test.eq((response :: any).status_code, 200)
            test.is_true((body :: any).success, tostring((body :: any).error))
            local state: any = (body :: any).roadmap
            test.eq(state.entry_id, entry_id)
            test.eq(state.thread_id, entry_id)
            test.eq(state.settings.origin, "2026-Q3")
            test.eq(state.settings.columns, 4)
            test.eq(#state.layers, 2)
            test.eq(#state.initiatives, 3)
            -- sort_order, then start_period, then title: an unscheduled bet has no
            -- key on the axis, so it leads the list.
            test.eq(state.initiatives[1].id, "console")
            test.eq(state.initiatives[2].id, "auth")
            test.eq(state.initiatives[3].id, "billing")
            test.eq(#state.dependencies, 1)
            test.eq(#state.milestones, 1)
            test.is_true(state.can_undo)
            test.is_false(state.can_redo)
            test.is_true(tonumber(state.current_position) >= 0)
            test.is_true(tonumber(state.current_position) < 1)
            test.matches(tostring(state.current_period), "^%d%d%d%d%-Q%d$")
        end)

        test.it("serves every map-typed field to the browser as a JSON object", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Encoded Roadmap")
            local token = token_for(user_id, GROUPS)

            -- The assertion is on the response text, not the decoded value: Lua
            -- collapses an empty object and an empty array to the same table, so
            -- only the wire form proves which one the browser receives.
            local _, response = http_get(entry_id, token)
            local text = tostring((response :: any).body)
            test.contains(text, "\"lens_state\":{")
            for _, lens in ipairs(types.LENS) do
                test.contains(text, "\"" .. lens .. "\":{}")
            end
            test.contains(text, "\"properties\":{}")
            test.contains(text, "\"tags\":[]")
            test.is_nil((text:find("\"lens_state\":[", 1, true)))
            test.is_nil((text:find("\"properties\":[]", 1, true)))

            -- The apply response is folded in memory rather than read back, so it
            -- is a second encoding path and needs the same guarantee.
            local _, applied = http_post(entry_id .. "/apply", token, {
                commands = { command(E.LENS_STATE_SET, { lens = "timeline", state = { zoom = 3 } }) },
            })
            local applied_text = tostring((applied :: any).body)
            test.contains(applied_text, "\"timeline\":{\"zoom\":3}")
            test.contains(applied_text, "\"strata\":{}")
            test.contains(applied_text, "\"properties\":{}")
            -- This batch touches no initiative, so its records reach the response
            -- through the batch's own deep copy: the list-typed fields must survive
            -- that copy as lists.
            test.contains(applied_text, "\"tags\":[]")
            test.contains(applied_text, "\"initiative_ids\":[\"auth\",\"billing\"]")

            catch_up(user_id, entry_id)
            local _, reread = http_get(entry_id, token)
            local reread_text = tostring((reread :: any).body)
            test.contains(reread_text, "\"timeline\":{\"zoom\":3}")
            test.contains(reread_text, "\"horizons\":{}")
            test.contains(reread_text, "\"properties\":{}")
        end)

        test.it("serves the filtered, derived, and vocabulary endpoints over http", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Queryable Roadmap")
            local token = token_for(user_id, GROUPS)

            local listed = http_get(entry_id .. "/initiatives?layer=platform", token)
            test.is_true((listed :: any).success, tostring((listed :: any).error))
            test.eq(#(listed :: any).initiatives.initiatives, 2)

            local windowed = http_get(entry_id .. "/initiatives?period_from=2026-Q4&period_to=2027-Q1", token)
            test.eq(#(windowed :: any).initiatives.initiatives, 1)
            test.eq((windowed :: any).initiatives.initiatives[1].id, "billing")

            local chain = http_get(entry_id .. "/dependencies?of=auth&direction=unlocks&transitive=1", token)
            test.is_true((chain :: any).success, tostring((chain :: any).error))
            test.eq(#(chain :: any).dependencies.unlocks, 1)
            test.eq((chain :: any).dependencies.unlocks[1].id, "billing")
            test.eq((chain :: any).dependencies.unlocks_chain[1], "billing")

            local needs = http_get(entry_id .. "/dependencies?of=billing&direction=needs", token)
            test.eq(#(needs :: any).dependencies.needs, 1)
            test.eq((needs :: any).dependencies.needs[1].id, "auth")

            local ranked = http_get(entry_id .. "/critical?top=1", token)
            test.is_true((ranked :: any).success, tostring((ranked :: any).error))
            test.eq(#(ranked :: any).critical.critical, 1)
            test.eq((ranked :: any).critical.critical[1].id, "auth")
            test.eq((ranked :: any).critical.critical[1].blocking_score, 1)

            local schema = http_get(entry_id .. "/schema", token)
            test.is_true((schema :: any).success, tostring((schema :: any).error))
            test.eq(#(schema :: any).schema.status, 5)
            test.eq(#(schema :: any).schema.lens, 4)
            test.eq((schema :: any).schema.period_rules.quarter.pattern, "YYYY-Qn")
        end)

        test.it("reports a bad request for a malformed query rather than a server error", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Strict Roadmap")
            local token = token_for(user_id, GROUPS)

            local body, response = http_get(entry_id .. "/dependencies?of=auth&direction=sideways", token)
            test.eq((response :: any).status_code, 400)
            test.is_false((body :: any).success)
            test.contains(tostring((body :: any).error), "direction must be")

            local missing, missing_response = http_get(entry_id .. "/dependencies?of=nothing", token)
            test.eq((missing_response :: any).status_code, 400)
            test.contains(tostring((missing :: any).error), "initiative not found")
        end)

        test.it("applies, undoes, and redoes over the http endpoints", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = roadmap_component(user_id, "Reversible Roadmap")
            local token = token_for(user_id, GROUPS)

            local applied, applied_response = http_post(entry_id .. "/apply", token, { commands = seed_commands() })
            test.eq((applied_response :: any).status_code, 200)
            test.is_true((applied :: any).success, tostring((applied :: any).error))
            test.eq((applied :: any).roadmap.counts.initiatives, 3)

            local refused, refused_response = http_post(entry_id .. "/apply", token, {
                commands = { command(E.INITIATIVE_ADDED, { id = "orphan", title = "Orphan", layer_id = "nowhere" }) },
            })
            test.eq((refused_response :: any).status_code, 400)
            test.is_false((refused :: any).success)
            test.contains(tostring((refused :: any).error), "layer not found")

            local undone = http_post(entry_id .. "/undo", token, {})
            test.is_true((undone :: any).success, tostring((undone :: any).error))
            test.eq((undone :: any).roadmap.counts.initiatives, 0)
            test.is_true((undone :: any).roadmap.can_redo)

            local redone = http_post(entry_id .. "/redo", token, {})
            test.is_true((redone :: any).success, tostring((redone :: any).error))
            test.eq((redone :: any).roadmap.counts.initiatives, 3)
            test.is_false((redone :: any).roadmap.can_redo)

            local exhausted, exhausted_response = http_post(entry_id .. "/redo", token, {})
            test.eq((exhausted_response :: any).status_code, 409)
            test.contains(tostring((exhausted :: any).error), "nothing to redo")
        end)

        test.it("rejects a body that is not a command envelope", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = roadmap_component(user_id, "Guarded Envelope")
            local token = token_for(user_id, GROUPS)
            local response, err = http_client.post(endpoint(entry_id .. "/apply"), {
                headers = headers(token),
                body = "not json",
            })
            test.is_nil(err)
            test.eq((response :: any).status_code, 400)
            test.contains(tostring(decode(response).error), "invalid json body")
        end)

        test.it("refuses every endpoint for an actor with no grant on the roadmap", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Private Roadmap")
            -- Both shapes of stranger: one carrying the application group and one
            -- carrying no group at all. Neither holds a grant on this roadmap, and
            -- the grant is what the engine answers to.
            local tokens = {
                token_for("roadmap-stranger-" .. uuid(), GROUPS),
                token_for("roadmap-groupless-" .. uuid(), {}),
            }

            for _, token in ipairs(tokens) do
                for _, path in ipairs({ "", "/initiatives", "/dependencies", "/critical", "/schema" }) do
                    local body, response = http_get(entry_id .. path, token)
                    test.eq((response :: any).status_code, 403, "read not refused: " .. path)
                    test.is_false((body :: any).success)
                    test.contains(tostring((body :: any).error), "roadmap access denied")
                end
                for _, path in ipairs({ "/apply", "/undo", "/redo" }) do
                    local body, response = http_post(entry_id .. path, token, { commands = seed_commands() })
                    test.eq((response :: any).status_code, 403, "write not refused: " .. path)
                    test.contains(tostring((body :: any).error), "roadmap access denied")
                end
            end
        end)

        test.it("refuses every endpoint for a caller carrying no token at all", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Anonymous Roadmap")

            for _, path in ipairs({ "", "/initiatives", "/dependencies", "/critical", "/schema" }) do
                local body, response = http_get(entry_id .. path, nil)
                test.eq((response :: any).status_code, 403, "anonymous read not refused: " .. path)
                test.is_false((body :: any).success)
            end
            local applied, applied_response = http_post(entry_id .. "/apply", nil, { commands = seed_commands() })
            test.eq((applied_response :: any).status_code, 403)
            test.is_false((applied :: any).success)
        end)

        test.it("renders the roadmap as markdown for an agent and refuses a groupless reader", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Readable Roadmap")

            local rendered, err = executor(user_id, GROUPS):call(READ, { entry = { id = entry_id, name = "Readable Roadmap" } })
            test.is_nil(err)
            test.is_true((rendered :: any).success, tostring((rendered :: any).error))
            local text = tostring((rendered :: any).text)
            test.contains(text, "# Readable Roadmap")
            test.contains(text, "Type: roadmap")
            test.contains(text, "Periods: quarter, origin 2026-Q3, 4 columns")
            test.contains(text, "### Platform (platform)")
            test.contains(text, "Auth (auth) · [active] · 2026-Q3 · size L · confidence high · progress 50% · outcome Retention")
            test.contains(text, "Auth → Billing (requires) — tokens first")
            test.contains(text, "GA — 2026-Q4: Auth, Billing")
            test.contains(text, "Retention — 50% over 1 initiatives")

            local denied, derr = executor("roadmap-denied-" .. uuid(), {}):call(READ, { entry = { id = entry_id, name = "Readable Roadmap" } })
            test.is_nil(denied)
            test.contains(tostring(derr), "roadmap access denied")
        end)

        test.it("drives the roadmap through the agent trait tools", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Agent Roadmap")
            local run = executor(user_id, GROUPS)

            local read, read_err = run:call(GET_TOOL, { entry_id = entry_id })
            test.is_nil(read_err)
            test.is_true((read :: any).success, tostring((read :: any).error))
            test.eq((read :: any).roadmap.counts.initiatives, 3)
            test.is_nil((read :: any).roadmap.view)
            local auth_row
            for _, item in ipairs((read :: any).roadmap.initiatives) do if item.id == "auth" then auth_row = item end end
            test.eq(auth_row.description, "Agent-visible detail")
            test.eq(auth_row.properties.source, "test")

            local timeline, timeline_err = run:call(GET_TOOL, { entry_id = entry_id, lens = "timeline" })
            test.is_nil(timeline_err)
            test.is_true((timeline :: any).success, tostring((timeline :: any).error))
            local view: any = (timeline :: any).roadmap.view
            test.eq(view.lens, "timeline")
            test.eq(#view.periods, 4)
            test.eq((view.periods[1] :: any).key, "2026-Q3")
            test.eq(#view.rows, 2)
            test.eq(#(view.rows[1] :: any).bars, 2)
            test.eq(#view.unscheduled, 1)
            test.eq(#view.milestones, 1)

            local outcomes, outcomes_err = run:call(GET_TOOL, { entry_id = entry_id, lens = "outcomes", filter = { layer = "platform" } })
            test.is_nil(outcomes_err)
            test.eq(((outcomes :: any).roadmap.view.ledger[1] :: any).outcome.id, "retention")
            test.eq(#(outcomes :: any).roadmap.view.unfiled, 1)

            local unknown_lens, lens_err = run:call(GET_TOOL, { entry_id = entry_id, lens = "gantt" })
            test.is_nil(unknown_lens)
            test.contains(tostring(lens_err), "lens must be one of")

            local unlocks, unlocks_err = run:call(QUERY_TOOL, { entry_id = entry_id, question = "unlocks", id = "auth" })
            test.is_nil(unlocks_err)
            test.is_true((unlocks :: any).success, tostring((unlocks :: any).error))
            test.eq(#(unlocks :: any).answer.unlocks, 1)
            test.eq((unlocks :: any).answer.unlocks_chain[1], "billing")

            local critical = run:call(QUERY_TOOL, { entry_id = entry_id, question = "critical", top = 1 })
            test.eq(#(critical :: any).answer.critical, 1)
            test.eq((critical :: any).answer.critical[1].id, "auth")

            local horizon = run:call(QUERY_TOOL, { entry_id = entry_id, question = "horizon", horizon = types.HORIZON.LATER })
            test.is_true((horizon :: any).success, tostring((horizon :: any).error))
            test.is_true(#(horizon :: any).answer.initiatives >= 1)

            local first = run:call(QUERY_TOOL, { entry_id = entry_id, question = "horizon", limit = 1 })
            test.eq(#(first :: any).answer.initiatives, 1)
            test.is_nil((first :: any).answer.initiatives[1].description)
            test.is_nil((first :: any).answer.initiatives[1].properties)
            test.not_nil((first :: any).next_cursor)
            local second = run:call(QUERY_TOOL, {
                entry_id = entry_id, question = "horizon", limit = 1, cursor = (first :: any).next_cursor,
            })
            test.eq(#(second :: any).answer.initiatives, 1)
            test.is_true((first :: any).answer.initiatives[1].id ~= (second :: any).answer.initiatives[1].id)

            local overloaded = run:call(QUERY_TOOL, { entry_id = entry_id, question = "overloaded" })
            test.is_true((overloaded :: any).success, tostring((overloaded :: any).error))
            test.eq(#(overloaded :: any).answer.load, 2)
            test.eq(((overloaded :: any).answer.load[1] :: any).period, "2026-Q3")

            local unknown_question, question_err = run:call(QUERY_TOOL, { entry_id = entry_id, question = "vibes" })
            test.is_nil(unknown_question)
            test.contains(tostring(question_err), "unknown question")

            local without_id, id_err = run:call(QUERY_TOOL, { entry_id = entry_id, question = "needs" })
            test.is_nil(without_id)
            test.contains(tostring(id_err), "requires an initiative id")

            local written, written_err = run:call(APPLY_TOOL, {
                entry_id = entry_id,
                commands = { command(E.INITIATIVE_UPDATED, { id = "console", start_period = "2027-Q1", status = "planned" }) },
            })
            test.is_nil(written_err)
            test.is_true((written :: any).success, tostring((written :: any).error))
            test.eq((written :: any).roadmap.counts.initiatives, 3)
            local written_periods = {}
            for _, initiative in ipairs((written :: any).roadmap.initiatives) do
                written_periods[tostring((initiative :: any).id)] = (initiative :: any).start_period
            end
            test.eq(written_periods.console, "2027-Q1")
            test.eq(written_periods.auth, "2026-Q3")
            catch_up(user_id, entry_id)
            local after = probe(user_id, "state", { entry_id = entry_id })
            test.is_true((after :: any).ok, tostring((after :: any).err))
            for _, initiative in ipairs((after :: any).roadmap.initiatives) do
                if tostring((initiative :: any).id) == "console" then
                    test.eq(tostring((initiative :: any).start_period), "2027-Q1")
                end
            end
        end)

        test.it("refuses every trait tool for an actor with no grant on the roadmap", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Sealed Roadmap")
            local strangers = {
                executor("roadmap-stranger-" .. uuid(), GROUPS),
                executor("roadmap-groupless-" .. uuid(), {}),
            }

            for _, stranger in ipairs(strangers) do
                local read, read_err = stranger:call(GET_TOOL, { entry_id = entry_id })
                test.is_nil(read)
                test.contains(tostring(read_err), "roadmap access denied")

                local queried, query_err = stranger:call(QUERY_TOOL, { entry_id = entry_id, question = "critical" })
                test.is_nil(queried)
                test.contains(tostring(query_err), "roadmap access denied")

                local written, write_err = stranger:call(APPLY_TOOL, {
                    entry_id = entry_id,
                    commands = { command(E.LAYER_ADDED, { id = "sneak", title = "Sneak" }) },
                })
                test.is_nil(written)
                test.contains(tostring(write_err), "roadmap access denied")
            end
        end)

        test.it("rejects a trait call that names no roadmap before any thread work", function()
            local run = executor("roadmap-owner-" .. uuid(), GROUPS)
            test.contains(tostring((run:call(GET_TOOL, {}) :: any).error), "entry_id is required")
            test.contains(tostring((run:call(QUERY_TOOL, { question = "critical" }) :: any).error), "entry_id is required")
            test.contains(tostring((run:call(APPLY_TOOL, { commands = {} }) :: any).error), "entry_id is required")
            local empty = run:call(APPLY_TOOL, { entry_id = "some-roadmap", commands = {} })
            test.is_false((empty :: any).success)
            test.contains(tostring((empty :: any).error), "non-empty array")
        end)

        test.it("purges the thread and the read model when the component delete cascade runs", function()
            local user_id = "roadmap-owner-" .. uuid()
            local entry_id = seeded_roadmap(user_id, "Doomed Roadmap")
            test.eq(count_rows("chestor_roadmap_initiatives", entry_id), 3)

            local deleted = components(user_id):delete({ component_id = entry_id })
            test.not_nil(deleted)
            test.is_true((deleted :: any).success, tostring((deleted :: any).error))

            test.eq(count_rows("chestor_roadmap_initiatives", entry_id), 0)
            test.eq(count_rows("chestor_roadmap_layers", entry_id), 0)
            test.eq(count_rows("chestor_roadmap_history", entry_id), 0)

            local events = probe(user_id, "list_events", { thread_id = entry_id })
            test.is_false((events :: any).ok)
            test.contains(tostring((events :: any).err), "thread not found")
        end)

        test.it("tears the roadmap down for a holder of delete access who cannot write", function()
            local owner_id = "roadmap-owner-" .. uuid()
            local deleter_id = "roadmap-deleter-" .. uuid()
            local entry_id = seeded_roadmap(owner_id, "Delegated Roadmap")

            -- READ | DELETE is the mask the host's own delete cascade authorizes:
            -- delete_component_func gates on DELETE, then invokes the kind's
            -- deletable under the same actor. A teardown that demanded WRITE would
            -- refuse this caller after the host had already allowed the delete.
            local granted = components(owner_id):grant_subtree({
                root_component_id = entry_id,
                subject = { subject_id = deleter_id, subject_type = "user" },
                access_mask = 5,
            })
            test.not_nil(granted)
            test.is_true((granted :: any).success, tostring((granted :: any).error))

            local blocked = probe(deleter_id, "apply", {
                entry_id = entry_id,
                commands = { command(E.LAYER_ADDED, { id = "sneak", title = "Sneak" }) },
            })
            test.is_false((blocked :: any).ok)
            test.contains(tostring((blocked :: any).err), "roadmap access denied")

            local destroyed = probe(deleter_id, "destroy", { entry_id = entry_id })
            test.is_true((destroyed :: any).ok, tostring((destroyed :: any).err))
            test.eq(count_rows("chestor_roadmap_initiatives", entry_id), 0)

            local events = probe(owner_id, "list_events", { thread_id = entry_id })
            test.is_false((events :: any).ok)
            test.contains(tostring((events :: any).err), "thread not found")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

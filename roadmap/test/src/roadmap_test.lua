local test = require("test")
local json = require("json")
local records = require("records")
local state = require("state")
local queries = require("queries")
local history = require("history")
local types = require("types")

local E = types.EVENT

local function ev(etype: string, body: any): any
    return { type = etype, body = body }
end

local function copy(value: any): any
    if type(value) ~= "table" then return value end
    local out: any = {}
    for k, v in pairs(value :: { [any]: any }) do out[k] = copy(v) end
    return out
end

local function deep_equal(a: any, b: any): boolean
    if type(a) ~= type(b) then return false end
    if type(a) ~= "table" then return a == b end
    for k, v in pairs(a :: { [any]: any }) do
        if not deep_equal(v, (b :: any)[k]) then return false end
    end
    for k in pairs(b :: { [any]: any }) do
        if (a :: any)[k] == nil then return false end
    end
    return true
end

local function fold(events: any, base: any): any
    local raw, err = state.validate_and_fold(base or records.empty_state(), events)
    test.is_nil(err)
    test.not_nil(raw)
    return raw
end

local function refuse(events: any, base: any): string
    local raw, err = state.validate_and_fold(base or records.empty_state(), events)
    test.is_nil(raw)
    test.not_nil(err)
    return tostring(err)
end

-- Two layers, one outcome, three initiatives and one dependency: the smallest
-- roadmap that exercises every referential rule.
local function seeded(): any
    return fold({
        ev(E.LAYER_ADDED, { id = "platform", title = "Platform", sort_order = 0 }),
        ev(E.LAYER_ADDED, { id = "product", title = "Product", sort_order = 1 }),
        ev(E.OUTCOME_ADDED, { id = "retention", title = "Retention" }),
        ev(E.INITIATIVE_ADDED, { id = "a", title = "Auth", layer_id = "platform", outcome_id = "retention", start_period = "2026-Q3" }),
        ev(E.INITIATIVE_ADDED, { id = "b", title = "Billing", layer_id = "platform", start_period = "2026-Q4" }),
        ev(E.INITIATIVE_ADDED, { id = "c", title = "Console", layer_id = "product" }),
        ev(E.DEPENDENCY_ADDED, { id = "d1", from_id = "a", to_id = "b" }),
    }, nil)
end

local function built(raw: any): any
    local value, err = state.build(raw)
    test.is_nil(err)
    test.not_nil(value)
    return value
end

local function define_tests()
    test.describe("Roadmap Commands", function()
        test.it("adds a layer with every field present", function()
            local raw = fold({ ev(E.LAYER_ADDED, { id = "platform", title = "Platform", color = "#0ea5e9" }) }, nil)
            local layer = (raw :: any).layers.platform
            test.eq(layer.title, "Platform")
            test.eq(layer.color, "#0ea5e9")
            test.eq(layer.description, "")
            test.eq(layer.icon, "")
            test.eq(layer.sort_order, 0)
        end)

        test.it("keeps untouched layer fields on a partial update", function()
            local raw = fold({ ev(E.LAYER_UPDATED, { id = "platform", title = "Foundation" }) }, seeded())
            test.eq((raw :: any).layers.platform.title, "Foundation")
            test.eq((raw :: any).layers.platform.sort_order, 0)
        end)

        test.it("adds and updates an outcome", function()
            local raw = fold({
                ev(E.OUTCOME_ADDED, { id = "growth", title = "Growth", sort_order = 2 }),
                ev(E.OUTCOME_UPDATED, { id = "growth", description = "New logos" }),
            }, seeded())
            test.eq((raw :: any).outcomes.growth.description, "New logos")
            test.eq((raw :: any).outcomes.growth.sort_order, 2)
        end)

        test.it("applies initiative defaults on add", function()
            local raw = fold({ ev(E.INITIATIVE_ADDED, { id = "n", title = "New", layer_id = "platform" }) }, seeded())
            local initiative = (raw :: any).initiatives.n
            test.eq(initiative.status, "planned")
            test.eq(initiative.confidence, "med")
            test.eq(initiative.size, "M")
            test.eq(initiative.span, 1)
            test.eq(initiative.progress, 0)
            test.eq(initiative.start_period, "")
            test.eq(initiative.owner, "")
            test.eq(#initiative.tags, 0)
        end)

        test.it("keeps untouched initiative fields on a partial update", function()
            local raw = fold({
                ev(E.INITIATIVE_UPDATED, { id = "a", status = "active", progress = 0.4 }),
            }, seeded())
            local initiative = (raw :: any).initiatives.a
            test.eq(initiative.status, "active")
            test.eq(initiative.progress, 0.4)
            test.eq(initiative.title, "Auth")
            test.eq(initiative.layer_id, "platform")
            test.eq(initiative.start_period, "2026-Q3")
        end)

        test.it("forces progress to one when an initiative is done", function()
            local raw = fold({
                ev(E.INITIATIVE_UPDATED, { id = "a", status = "active", progress = 0.3 }),
                ev(E.INITIATIVE_UPDATED, { id = "a", status = "done" }),
            }, seeded())
            test.eq((raw :: any).initiatives.a.progress, 1)
        end)

        test.it("adds a dependency with the default requires kind", function()
            local raw = fold({ ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "c" }) }, seeded())
            test.eq((raw :: any).dependencies.d2.kind, "requires")
            test.eq((raw :: any).dependencies.d2.note, "")
        end)

        test.it("updates and removes a dependency", function()
            local raw = fold({
                ev(E.DEPENDENCY_UPDATED, { id = "d1", kind = "informs", note = "context only" }),
            }, seeded())
            test.eq((raw :: any).dependencies.d1.kind, "informs")
            test.eq((raw :: any).dependencies.d1.note, "context only")
            test.eq((raw :: any).dependencies.d1.from_id, "a")

            raw = fold({ ev(E.DEPENDENCY_REMOVED, { id = "d1" }) }, raw)
            test.is_nil((raw :: any).dependencies.d1)
            test.eq(#(raw :: any).dependency_order, 0)
        end)

        test.it("adds, updates, and removes a milestone", function()
            local raw = fold({
                ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-Q4", layer_id = "platform", initiative_ids = { "a" } }),
                ev(E.MILESTONE_UPDATED, { id = "m1", description = "Public beta" }),
            }, seeded())
            test.eq((raw :: any).milestones.m1.description, "Public beta")
            test.eq((raw :: any).milestones.m1.period, "2026-Q4")
            test.eq(#(raw :: any).milestones.m1.initiative_ids, 1)

            raw = fold({ ev(E.MILESTONE_REMOVED, { id = "m1" }) }, raw)
            test.is_nil((raw :: any).milestones.m1)
        end)

        test.it("merges a settings patch and keeps lens state", function()
            local raw = fold({
                ev(E.LENS_STATE_SET, { lens = "timeline", state = { zoom = 2 } }),
                ev(E.SETTINGS_UPDATED, { settings = { columns = 8, default_lens = "strata" } }),
            }, seeded())
            test.eq((raw :: any).settings.columns, 8)
            test.eq((raw :: any).settings.default_lens, "strata")
            test.eq((raw :: any).settings.period_kind, "quarter")
            test.eq((raw :: any).settings.lens_state.timeline.zoom, 2)
        end)

        test.it("stores lens state per lens", function()
            local raw = fold({
                ev(E.LENS_STATE_SET, { lens = "timeline", state = { zoom = 2 } }),
                ev(E.LENS_STATE_SET, { lens = "strata", state = { critical = true } }),
            }, seeded())
            test.eq((raw :: any).settings.lens_state.timeline.zoom, 2)
            test.is_true((raw :: any).settings.lens_state.strata.critical)
        end)

        test.it("lets a later command reference a fact created earlier in the batch", function()
            local raw = fold({
                ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud" }),
                ev(E.INITIATIVE_ADDED, { id = "x", title = "Regions", layer_id = "cloud" }),
                ev(E.INITIATIVE_ADDED, { id = "y", title = "Failover", layer_id = "cloud" }),
                ev(E.DEPENDENCY_ADDED, { id = "dx", from_id = "x", to_id = "y" }),
                ev(E.MILESTONE_ADDED, { id = "mx", title = "GA", period = "2027-Q1", initiative_ids = { "x", "y" } }),
            }, nil)
            test.not_nil((raw :: any).dependencies.dx)
            test.eq(#(raw :: any).milestones.mx.initiative_ids, 2)
        end)
    end)

    test.describe("Roadmap Invariants", function()
        test.it("rejects an unknown event type", function()
            test.contains(refuse({ ev("chestor.roadmap.events:unknown.event", { id = "x" }) }, nil), "unknown event type")
        end)

        test.it("names the failing command position", function()
            test.contains(refuse({
                ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud" }),
                ev(E.LAYER_ADDED, { title = "Nameless" }),
            }, nil), "at [2]")
        end)

        test.it("requires a layer id and a title", function()
            test.contains(refuse({ ev(E.LAYER_ADDED, { title = "Platform" }) }, nil), "layer id required")
            test.contains(refuse({ ev(E.LAYER_ADDED, { id = "platform" }) }, nil), "layer title required")
        end)

        test.it("rejects a duplicate layer and an update of a missing one", function()
            test.contains(refuse({ ev(E.LAYER_ADDED, { id = "platform", title = "Again" }) }, seeded()), "layer already exists")
            test.contains(refuse({ ev(E.LAYER_UPDATED, { id = "missing", title = "Ghost" }) }, seeded()), "layer not found")
        end)

        test.it("refuses to remove a layer an initiative stands on", function()
            test.contains(refuse({ ev(E.LAYER_REMOVED, { id = "platform" }) }, seeded()), "layer is referenced by initiative")
        end)

        test.it("refuses to remove a layer a milestone points at", function()
            local raw = fold({
                ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud" }),
                ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-Q4", layer_id = "cloud" }),
            }, seeded())
            test.contains(refuse({ ev(E.LAYER_REMOVED, { id = "cloud" }) }, raw), "layer is referenced by milestone")
        end)

        test.it("removes a layer once nothing references it", function()
            local raw = fold({ ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud" }) }, seeded())
            raw = fold({ ev(E.LAYER_REMOVED, { id = "cloud" }) }, raw)
            test.is_nil((raw :: any).layers.cloud)
        end)

        test.it("refuses to remove an outcome an initiative is filed under", function()
            test.contains(refuse({ ev(E.OUTCOME_REMOVED, { id = "retention" }) }, seeded()), "outcome is referenced by initiative")
        end)

        test.it("requires an existing layer on an initiative", function()
            test.contains(refuse({ ev(E.INITIATIVE_ADDED, { id = "n", title = "New" }) }, seeded()), "initiative layer_id required")
            test.contains(refuse({ ev(E.INITIATIVE_ADDED, { id = "n", title = "New", layer_id = "missing" }) }, seeded()), "layer not found")
        end)

        test.it("requires an existing outcome on an initiative", function()
            test.contains(refuse({
                ev(E.INITIATIVE_ADDED, { id = "n", title = "New", layer_id = "platform", outcome_id = "missing" }),
            }, seeded()), "outcome not found")
        end)

        test.it("closes the initiative vocabularies", function()
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", status = "shipping" }) }, seeded()), "initiative status must be one of")
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", confidence = "certain" }) }, seeded()), "initiative confidence must be one of")
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", size = "XXL" }) }, seeded()), "initiative size must be one of")
        end)

        test.it("bounds span and progress", function()
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", span = 0 }) }, seeded()), "span must be an integer of at least 1")
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", span = 1.5 }) }, seeded()), "span must be an integer of at least 1")
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", progress = 1.2 }) }, seeded()), "progress must be between 0 and 1")
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", progress = -0.1 }) }, seeded()), "progress must be between 0 and 1")
        end)

        test.it("checks a start period against the roadmap period kind", function()
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", start_period = "2026-09" }) }, seeded()), "does not match period kind quarter")
            local monthly = fold({ ev(E.SETTINGS_UPDATED, { settings = { period_kind = "month" } }) }, seeded())
            test.contains(refuse({ ev(E.INITIATIVE_UPDATED, { id = "a", start_period = "2026-Q3" }) }, monthly), "does not match period kind month")
        end)

        test.it("refuses to remove an initiative a dependency touches", function()
            test.contains(refuse({ ev(E.INITIATIVE_REMOVED, { id = "a" }) }, seeded()), "initiative is referenced by dependency")
        end)

        test.it("refuses to remove an initiative a milestone lists", function()
            local raw = fold({ ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-Q4", initiative_ids = { "c" } }) }, seeded())
            test.contains(refuse({ ev(E.INITIATIVE_REMOVED, { id = "c" }) }, raw), "initiative is referenced by milestone")
        end)

        test.it("removes an initiative once its edges are gone", function()
            local raw = fold({
                ev(E.DEPENDENCY_REMOVED, { id = "d1" }),
                ev(E.INITIATIVE_REMOVED, { id = "a" }),
            }, seeded())
            test.is_nil((raw :: any).initiatives.a)
        end)

        test.it("requires two distinct existing endpoints on a dependency", function()
            test.contains(refuse({ ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "a", to_id = "missing" }) }, seeded()), "initiative not found")
            test.contains(refuse({ ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "a", to_id = "a" }) }, seeded()), "endpoints must differ")
            test.contains(refuse({ ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "a" }) }, seeded()), "from_id and to_id required")
        end)

        test.it("keeps one edge per ordered pair regardless of kind", function()
            test.contains(refuse({
                ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "a", to_id = "b", kind = "informs" }),
            }, seeded()), "dependency already exists between a and b")
        end)

        test.it("closes the dependency kind vocabulary", function()
            test.contains(refuse({
                ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "c", kind = "blocks" }),
            }, seeded()), "dependency kind must be one of")
        end)

        test.it("names the cycle path when a requires edge would close a loop", function()
            local raw = fold({ ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "c" }) }, seeded())
            local err = refuse({ ev(E.DEPENDENCY_ADDED, { id = "d3", from_id = "c", to_id = "a" }) }, raw)
            test.contains(err, "dependency cycle refused")
            test.contains(err, "c -> a -> b -> c")
        end)

        test.it("refuses a two-node requires loop", function()
            test.contains(refuse({
                ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "a" }),
            }, seeded()), "dependency cycle refused")
        end)

        test.it("lets an informs edge close a loop the critical path ignores", function()
            local raw = fold({ ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "a", kind = "informs" }) }, seeded())
            test.eq((raw :: any).dependencies.d2.kind, "informs")
        end)

        test.it("refuses promoting an informs edge that would close a loop", function()
            local raw = fold({ ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "a", kind = "informs" }) }, seeded())
            test.contains(refuse({ ev(E.DEPENDENCY_UPDATED, { id = "d2", kind = "requires" }) }, raw), "dependency cycle refused")
        end)

        test.it("validates milestone period, layer, and initiative references", function()
            test.contains(refuse({ ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta" }) }, seeded()), "milestone period required")
            test.contains(refuse({ ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-09" }) }, seeded()), "does not match period kind quarter")
            test.contains(refuse({ ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-Q4", layer_id = "missing" }) }, seeded()), "layer not found")
            test.contains(refuse({ ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-Q4", initiative_ids = { "missing" } }) }, seeded()), "initiative not found")
        end)

        test.it("closes the settings vocabularies and bounds columns", function()
            test.contains(refuse({ ev(E.SETTINGS_UPDATED, { settings = { period_kind = "week" } }) }, seeded()), "period_kind must be one of")
            test.contains(refuse({ ev(E.SETTINGS_UPDATED, { settings = { default_lens = "gantt" } }) }, seeded()), "default_lens must be one of")
            test.contains(refuse({ ev(E.SETTINGS_UPDATED, { settings = { columns = 0 } }) }, seeded()), "columns must be an integer of at least 1")
        end)

        test.it("checks a new origin against the period kind set in the same command", function()
            test.contains(refuse({ ev(E.SETTINGS_UPDATED, { settings = { origin = "2026-09" } }) }, seeded()), "origin does not match period kind quarter")
            local raw = fold({ ev(E.SETTINGS_UPDATED, { settings = { period_kind = "month", origin = "2026-09" } }) }, seeded())
            test.eq((raw :: any).settings.origin, "2026-09")
        end)

        test.it("closes the lens vocabulary", function()
            test.contains(refuse({ ev(E.LENS_STATE_SET, { lens = "gantt", state = {} }) }, seeded()), "lens must be one of")
        end)

        test.it("leaves the state untouched when any command in the batch fails", function()
            local base = seeded()
            local before = copy(base)
            local _, err = state.validate_and_fold(base, {
                ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud" }),
                ev(E.INITIATIVE_ADDED, { id = "n", title = "New", layer_id = "nowhere" }),
            })
            test.not_nil(err)
            test.is_nil((base :: any).layers.cloud)
            test.is_true(deep_equal(base, before))
        end)
    end)

    test.describe("Roadmap Build", function()
        test.it("returns every collection and scalar on an empty roadmap", function()
            local value = built(records.empty_state())
            test.eq(#(value :: any).layers, 0)
            test.eq(#(value :: any).outcomes, 0)
            test.eq(#(value :: any).initiatives, 0)
            test.eq(#(value :: any).dependencies, 0)
            test.eq(#(value :: any).milestones, 0)
            test.eq((value :: any).counts.layers, 0)
            test.eq((value :: any).counts.initiatives, 0)
            test.eq((value :: any).settings.period_kind, "quarter")
            test.eq((value :: any).settings.columns, 5)
            test.eq((value :: any).settings.default_lens, "timeline")
            test.eq((value :: any).settings.origin, (value :: any).current_period)
            test.not_nil((value :: any).settings.lens_state.timeline)
            test.not_nil((value :: any).settings.lens_state.horizons)
            test.not_nil((value :: any).settings.lens_state.strata)
            test.not_nil((value :: any).settings.lens_state.outcomes)
            test.is_false((value :: any).can_undo)
            test.is_false((value :: any).can_redo)
            test.eq((value :: any).entry_id, "")
            test.eq((value :: any).thread_id, "")
            local position = tonumber((value :: any).current_position)
            test.not_nil(position)
            test.is_true((position :: number) >= 0)
            test.is_true((position :: number) < 1)
        end)

        test.it("encodes every map-typed field as a JSON object when it is empty", function()
            local value = built(fold({
                ev(E.LAYER_ADDED, { id = "platform", title = "Platform" }),
                ev(E.INITIATIVE_ADDED, { id = "a", title = "Auth", layer_id = "platform" }),
            }, nil))
            -- Lua has one table type: an empty map and an empty array are the same
            -- value, so the read shape has to carry the encoder's object marker or
            -- the contract's objects reach the browser as arrays.
            test.eq(json.encode((value :: any).settings.lens_state):sub(1, 1), "{")
            for _, lens in ipairs(types.LENS) do
                test.eq(json.encode((value :: any).settings.lens_state[lens]), "{}", "lens state is not an object: " .. lens)
            end
            test.eq(json.encode((value :: any).initiatives[1].properties), "{}")
            test.eq(json.encode((value :: any).initiatives[1].tags), "[]")
        end)

        test.it("keeps remembered lens state and properties as objects through the fold", function()
            local value = built(fold({
                ev(E.LAYER_ADDED, { id = "platform", title = "Platform" }),
                ev(E.INITIATIVE_ADDED, { id = "a", title = "Auth", layer_id = "platform", properties = { risk = "high" } }),
                ev(E.LENS_STATE_SET, { lens = "timeline", state = { zoom = 3 } }),
                ev(E.LENS_STATE_SET, { lens = "strata", state = {} }),
            }, nil))
            test.eq((value :: any).settings.lens_state.timeline.zoom, 3)
            test.eq(json.encode((value :: any).settings.lens_state.strata), "{}")
            test.eq((value :: any).initiatives[1].properties.risk, "high")
        end)

        test.it("keeps a stored origin instead of the current period", function()
            local raw = fold({ ev(E.SETTINGS_UPDATED, { settings = { origin = "2025-Q1" } }) }, seeded())
            test.eq((built(raw) :: any).settings.origin, "2025-Q1")
        end)

        test.it("orders layers and outcomes by sort order then title", function()
            local raw = fold({
                ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud", sort_order = 0 }),
                ev(E.OUTCOME_ADDED, { id = "growth", title = "Growth", sort_order = 0 }),
            }, seeded())
            local value = built(raw)
            test.eq((value :: any).layers[1].id, "cloud")
            test.eq((value :: any).layers[2].id, "platform")
            test.eq((value :: any).layers[3].id, "product")
            test.eq((value :: any).outcomes[1].id, "growth")
            test.eq((value :: any).outcomes[2].id, "retention")
        end)

        test.it("orders initiatives by sort order, start period, then title", function()
            local raw = fold({
                ev(E.INITIATIVE_UPDATED, { id = "c", start_period = "2026-Q1" }),
            }, seeded())
            local value = built(raw)
            test.eq((value :: any).initiatives[1].id, "c")
            test.eq((value :: any).initiatives[2].id, "a")
            test.eq((value :: any).initiatives[3].id, "b")
        end)

        test.it("orders milestones by period then title", function()
            local raw = fold({
                ev(E.MILESTONE_ADDED, { id = "m2", title = "GA", period = "2027-Q1" }),
                ev(E.MILESTONE_ADDED, { id = "m1", title = "Beta", period = "2026-Q4" }),
            }, seeded())
            local value = built(raw)
            test.eq((value :: any).milestones[1].id, "m1")
            test.eq((value :: any).milestones[2].id, "m2")
        end)

        test.it("keeps dependencies in the order they were declared", function()
            local raw = fold({
                ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "c" }),
            }, seeded())
            local value = built(raw)
            test.eq((value :: any).dependencies[1].id, "d1")
            test.eq((value :: any).dependencies[2].id, "d2")
            test.eq((value :: any).counts.dependencies, 2)
        end)
    end)

    test.describe("Roadmap History", function()
        local function round_trip(batch: any)
            local base = seeded()
            local before = copy(base)
            local after = fold(batch, base)
            local inverse = history.build_inverse(before, batch)
            local restored, err = state.validate_and_fold(after, inverse)
            test.is_nil(err)
            test.is_true(deep_equal(restored, before))
        end

        test.it("inverts every add back to the pre-batch state", function()
            round_trip({
                ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud" }),
                ev(E.OUTCOME_ADDED, { id = "growth", title = "Growth" }),
                ev(E.INITIATIVE_ADDED, { id = "x", title = "Regions", layer_id = "cloud" }),
                ev(E.DEPENDENCY_ADDED, { id = "dx", from_id = "c", to_id = "x" }),
                ev(E.MILESTONE_ADDED, { id = "mx", title = "GA", period = "2027-Q1", initiative_ids = { "x" } }),
            })
        end)

        test.it("inverts an update to the pre-image of every touched key", function()
            round_trip({
                ev(E.LAYER_UPDATED, { id = "platform", title = "Foundation", color = "#111111" }),
                ev(E.INITIATIVE_UPDATED, { id = "a", status = "active", progress = 0.6, owner = "kim" }),
                ev(E.DEPENDENCY_UPDATED, { id = "d1", kind = "informs", note = "soft" }),
            })
        end)

        test.it("inverts a removal by recreating the full prior record", function()
            round_trip({
                ev(E.DEPENDENCY_REMOVED, { id = "d1" }),
                ev(E.INITIATIVE_REMOVED, { id = "a" }),
                ev(E.OUTCOME_REMOVED, { id = "retention" }),
            })
        end)

        test.it("inverts a batch that adds and removes the same record", function()
            round_trip({
                ev(E.INITIATIVE_ADDED, { id = "x", title = "Regions", layer_id = "product" }),
                ev(E.INITIATIVE_REMOVED, { id = "x" }),
            })
        end)

        test.it("inverts a settings change to the previous settings", function()
            round_trip({
                ev(E.SETTINGS_UPDATED, { settings = { columns = 9, default_lens = "outcomes" } }),
            })
        end)

        test.it("keeps lens state out of the history stack", function()
            local batch = {
                ev(E.LENS_STATE_SET, { lens = "timeline", state = { zoom = 3 } }),
                ev(E.LAYER_ADDED, { id = "cloud", title = "Cloud" }),
            }
            local forward = history.forward_events(batch)
            test.eq(#forward, 1)
            test.eq((forward[1] :: any).type, E.LAYER_ADDED)

            local inverse = history.build_inverse(seeded(), batch)
            test.eq(#inverse, 1)
            test.eq((inverse[1] :: any).type, E.LAYER_REMOVED)
        end)

        test.it("returns no history events for a lens-only batch", function()
            local batch = { ev(E.LENS_STATE_SET, { lens = "strata", state = { critical = true } }) }
            test.eq(#history.forward_events(batch), 0)
            test.eq(#history.build_inverse(seeded(), batch), 0)
        end)
    end)

    test.describe("Roadmap Queries", function()
        -- a -> b -> d and a -> c, plus an informs edge that never carries schedule
        -- pressure, so the requires chain of a is exactly { b, d }.
        local function chained(): any
            local raw = fold({
                ev(E.INITIATIVE_ADDED, { id = "d", title = "Dashboards", layer_id = "product" }),
                ev(E.DEPENDENCY_ADDED, { id = "d2", from_id = "b", to_id = "d" }),
                ev(E.DEPENDENCY_ADDED, { id = "d3", from_id = "a", to_id = "c" }),
                ev(E.DEPENDENCY_ADDED, { id = "d4", from_id = "c", to_id = "d", kind = "informs" }),
            }, seeded())
            return built(raw)
        end

        test.it("reads the immediate needs and unlocks of an initiative", function()
            local value = chained()
            local needs = queries.needs(value, "b")
            test.eq(#needs, 1)
            test.eq((needs[1] :: any).id, "a")
            local unlocks = queries.unlocks(value, "a")
            test.eq(#unlocks, 2)
        end)

        test.it("follows requires edges only through a transitive chain", function()
            local value = chained()
            local chain = queries.transitive(value, "a", "unlocks")
            test.eq(#chain, 3)
            local upstream = queries.transitive(value, "d", "needs")
            test.eq(#upstream, 2)
        end)

        test.it("scores blocking by the size of the requires chain below", function()
            local value = chained()
            test.eq(queries.blocking_score(value, "a"), 3)
            test.eq(queries.blocking_score(value, "b"), 1)
            test.eq(queries.blocking_score(value, "d"), 0)
        end)

        test.it("ranks the critical path by blocking score", function()
            local ranked = queries.critical(chained(), 2)
            test.eq(#ranked, 2)
            test.eq((ranked[1] :: any).id, "a")
            test.eq((ranked[1] :: any).blocking_score, 3)
            test.eq((ranked[2] :: any).id, "b")
        end)

        test.it("returns every initiative when no top is given", function()
            test.eq(#queries.critical(chained(), nil), 4)
        end)

        test.it("averages outcome progress and excludes dropped bets", function()
            local raw = fold({
                ev(E.INITIATIVE_UPDATED, { id = "a", status = "done" }),
                ev(E.INITIATIVE_UPDATED, { id = "b", outcome_id = "retention", status = "active", progress = 0.5 }),
                ev(E.INITIATIVE_UPDATED, { id = "c", outcome_id = "retention", status = "idea" }),
            }, seeded())
            local progress, counted = queries.outcome_progress(built(raw), "retention")
            test.eq(counted, 3)
            test.eq(progress, 0.5)

            raw = fold({ ev(E.INITIATIVE_UPDATED, { id = "c", status = "dropped" }) }, raw)
            local dropped_progress, dropped_counted = queries.outcome_progress(built(raw), "retention")
            test.eq(dropped_counted, 2)
            test.eq(dropped_progress, 0.75)
        end)

        test.it("reports zero progress for an outcome with no live bets", function()
            local progress, counted = queries.outcome_progress(built(seeded()), "unknown")
            test.eq(progress, 0)
            test.eq(counted, 0)
        end)

        test.it("filters initiatives by layer, outcome, and status", function()
            local value = built(seeded())
            test.eq(#select(1, queries.filter_initiatives(value, { layer = "platform" })), 2)
            test.eq(#select(1, queries.filter_initiatives(value, { outcome = "retention" })), 1)
            test.eq(#select(1, queries.filter_initiatives(value, { status = "planned" })), 3)
        end)

        test.it("filters initiatives by a period window", function()
            local value = built(seeded())
            local windowed = select(1, queries.filter_initiatives(value, { period_from = "2026-Q4", period_to = "2027-Q1" }))
            test.eq(#(windowed :: any), 1)
            test.eq(((windowed :: any)[1] :: any).id, "b")
        end)

        test.it("filters unscheduled initiatives into the later horizon", function()
            local value = built(seeded())
            local later = select(1, queries.filter_initiatives(value, { horizon = types.HORIZON.LATER }))
            local ids: { string } = {}
            for _, initiative in ipairs(later :: { any }) do ids[#ids + 1] = tostring((initiative :: any).id) end
            test.is_true(#ids >= 1)
            local found = false
            for _, id in ipairs(ids) do
                if id == "c" then found = true end
            end
            test.is_true(found)
        end)

        test.it("surfaces a period window that does not match the period kind", function()
            local value, err = queries.filter_initiatives(built(seeded()), { period_from = "2026-09" })
            test.is_nil(value)
            test.contains(tostring(err), "YYYY-Qn")
        end)
    end)

    test.describe("Roadmap Lenses", function()
        -- A pinned origin keeps every column offset independent of the wall clock.
        local function pinned(): any
            return built(fold({ ev(E.SETTINGS_UPDATED, { settings = { origin = "2026-Q3", columns = 3 } }) }, seeded()))
        end

        local function view(value: any, lens: string, filter: any): any
            local shaped, err = queries.lens_view(value, lens, filter)
            test.is_nil(err)
            test.not_nil(shaped)
            return shaped
        end

        test.it("refuses a lens outside the closed vocabulary", function()
            local shaped, err = queries.lens_view(pinned(), "gantt", nil)
            test.is_nil(shaped)
            test.contains(tostring(err), "lens must be one of")
        end)

        test.it("lays a timeline out as visible columns, lane rows, and offsets from the origin", function()
            local shaped = view(pinned(), "timeline", nil)
            test.eq(shaped.origin, "2026-Q3")
            test.eq(#shaped.periods, 3)
            test.eq((shaped.periods[1] :: any).key, "2026-Q3")
            test.eq((shaped.periods[3] :: any).key, "2027-Q1")
            test.eq(#shaped.rows, 2)
            test.eq((shaped.rows[1] :: any).layer.id, "platform")
            test.eq(#(shaped.rows[1] :: any).bars, 2)
            test.eq(((shaped.rows[1] :: any).bars[1] :: any).id, "a")
            test.eq(((shaped.rows[1] :: any).bars[1] :: any).offset, 0)
            test.eq(((shaped.rows[1] :: any).bars[2] :: any).offset, 1)
            test.eq(#(shaped.rows[2] :: any).bars, 0)
            test.eq(#shaped.unscheduled, 1)
            test.eq((shaped.unscheduled[1] :: any).id, "c")
        end)

        test.it("places milestones on the timeline rail at their own offset", function()
            local raw = fold({
                ev(E.SETTINGS_UPDATED, { settings = { origin = "2026-Q3", columns = 3 } }),
                ev(E.MILESTONE_ADDED, { id = "ga", title = "GA", period = "2026-Q4", initiative_ids = { "a" } }),
            }, seeded())
            local shaped = view(built(raw), "timeline", nil)
            test.eq(#shaped.milestones, 1)
            test.eq((shaped.milestones[1] :: any).offset, 1)
            test.eq((shaped.milestones[1] :: any).id, "ga")
        end)

        test.it("narrows a lens to the filtered initiatives", function()
            local shaped = view(pinned(), "timeline", { layer = "platform" })
            test.eq(#shaped.rows, 2)
            test.eq(#(shaped.rows[1] :: any).bars, 2)
            test.eq(#(shaped.rows[2] :: any).bars, 0)
            test.eq(#shaped.unscheduled, 0)
        end)

        test.it("groups horizons into ordered columns that partition the initiatives", function()
            local shaped = view(pinned(), "horizons", nil)
            test.eq(#shaped.columns, 4)
            test.eq((shaped.columns[1] :: any).horizon, types.HORIZON.NOW)
            test.eq((shaped.columns[2] :: any).horizon, types.HORIZON.NEXT)
            test.eq((shaped.columns[3] :: any).horizon, types.HORIZON.LATER)
            test.eq((shaped.columns[4] :: any).horizon, types.HORIZON.PAST)

            local seen: { [string]: number } = {}
            local total = 0
            for _, column in ipairs(shaped.columns) do
                for _, group in ipairs((column :: any).layers) do
                    for _, initiative in ipairs((group :: any).initiatives) do
                        local id = tostring((initiative :: any).id)
                        seen[id] = (seen[id] or 0) + 1
                        total = total + 1
                    end
                end
            end
            test.eq(total, 3)
            test.eq(seen.a, 1)
            test.eq(seen.b, 1)
            test.eq(seen.c, 1)
        end)

        test.it("files an unscheduled bet in the later horizon column", function()
            local shaped = view(pinned(), "horizons", nil)
            local found = false
            for _, group in ipairs((shaped.columns[3] :: any).layers) do
                for _, initiative in ipairs((group :: any).initiatives) do
                    if tostring((initiative :: any).id) == "c" then found = true end
                end
            end
            test.is_true(found)
        end)

        test.it("stacks strata bottom to top and carries every edge with its lanes", function()
            local shaped = view(pinned(), "strata", nil)
            test.eq(#shaped.bands, 2)
            test.eq((shaped.bands[1] :: any).layer.id, "platform")
            test.eq((shaped.bands[2] :: any).layer.id, "product")
            test.eq(#(shaped.bands[1] :: any).initiatives, 2)
            test.eq(((shaped.bands[1] :: any).initiatives[1] :: any).blocking_score, 1)
            test.eq(#shaped.edges, 1)
            test.eq((shaped.edges[1] :: any).from_layer_id, "platform")
            test.eq((shaped.edges[1] :: any).to_layer_id, "platform")
        end)

        test.it("ledgers outcomes with their progress and collects the unfiled bets", function()
            local shaped = view(pinned(), "outcomes", nil)
            test.eq(#shaped.ledger, 1)
            test.eq((shaped.ledger[1] :: any).outcome.id, "retention")
            test.eq((shaped.ledger[1] :: any).counted, 1)
            test.eq((shaped.ledger[1] :: any).progress, 0)
            test.eq(#(shaped.ledger[1] :: any).initiatives, 1)
            test.eq(#shaped.unfiled, 2)
        end)

        test.it("ranks periods by the weight of the work in flight", function()
            local raw = fold({
                ev(E.INITIATIVE_UPDATED, { id = "c", start_period = "2026-Q3", span = 2, size = "XL" }),
            }, seeded())
            local rows = queries.period_load(built(raw), nil)
            test.eq(#rows, 2)
            test.eq((rows[1] :: any).period, "2026-Q3")
            test.eq((rows[1] :: any).count, 2)
            test.eq((rows[1] :: any).weight, 7)
            test.eq((rows[2] :: any).period, "2026-Q4")
            test.eq((rows[2] :: any).count, 2)
        end)

        test.it("keeps finished and abandoned bets out of the load", function()
            local raw = fold({ ev(E.INITIATIVE_UPDATED, { id = "a", status = "done" }) }, seeded())
            local rows = queries.period_load(built(raw), nil)
            test.eq(#rows, 1)
            test.eq((rows[1] :: any).period, "2026-Q4")
        end)

        test.it("limits the ranked periods to the requested top", function()
            test.eq(#queries.period_load(built(seeded()), 1), 1)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

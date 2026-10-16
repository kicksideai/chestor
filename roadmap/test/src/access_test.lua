local test = require("test")
local funcs = require("funcs")
local security = require("security")
local contract = require("contract")
local types = require("types")

local PROBE = "app:roadmap_probe"
local OWNER = "roadmap-owner"
local STRANGER = "roadmap-stranger"

local function framed(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "roadmap_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local function threads_for(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "roadmap_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    local svc, cerr = contract.get(types.THREADS)
    test.is_nil(cerr)
    test.not_nil(svc)
    local inst, oerr = svc:with_actor(actor):with_scope(scope):open()
    test.is_nil(oerr)
    test.not_nil(inst)
    return inst
end

local function probe(user_id: string, op: string, input: any): any
    local result, err = framed(user_id):call(PROBE, { op = op, input = input })
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function roadmap_component(user_id: string, title: string): string
    local inst = threads_for(user_id)
    local registration, err = inst:create({
        impl_id = types.IMPL_ID,
        thread_class = types.THREAD_CLASS,
        title = title,
    })
    test.is_nil(err)
    test.not_nil(registration)
    return tostring((registration :: any).component_id or (registration :: any).thread_id)
end

local function catch_up(user_id: string, entry_id: string)
    probe(user_id, "catch_up", { thread_id = entry_id, max_ticks = 200 })
end

local function define_tests()
    test.describe("Roadmap Access", function()
        test.it("serves an empty roadmap to the owner of a fresh component", function()
            local entry_id = roadmap_component(OWNER, "Fresh roadmap")
            local result = probe(OWNER, "state", { entry_id = entry_id })
            test.is_true((result :: any).ok)
            local roadmap: any = (result :: any).roadmap
            test.eq(roadmap.entry_id, entry_id)
            test.eq(roadmap.thread_id, entry_id)
            test.eq(roadmap.counts.layers, 0)
            test.is_false(roadmap.can_undo)
            test.is_false(roadmap.can_redo)
        end)

        test.it("refuses a read from an actor with no grant on the component", function()
            local entry_id = roadmap_component(OWNER, "Private roadmap")
            local result = probe(STRANGER, "state", { entry_id = entry_id })
            test.is_false((result :: any).ok)
            test.contains(tostring((result :: any).err), "roadmap access denied")
        end)

        test.it("refuses a write from an actor with no grant on the component", function()
            local entry_id = roadmap_component(OWNER, "Guarded roadmap")
            local result = probe(STRANGER, "apply", {
                entry_id = entry_id,
                commands = { { type = types.EVENT.LAYER_ADDED, body = { id = "platform", title = "Platform" } } },
            })
            test.is_false((result :: any).ok)
            test.contains(tostring((result :: any).err), "roadmap access denied")
        end)

        test.it("refuses an entry id that names no component", function()
            local result = probe(OWNER, "state", { entry_id = "roadmap-that-was-never-created" })
            test.is_false((result :: any).ok)
            test.not_nil((result :: any).err)
        end)

        test.it("requires an entry id", function()
            local result = probe(OWNER, "state", { entry_id = "" })
            test.is_false((result :: any).ok)
            test.contains(tostring((result :: any).err), "entry_id is required")
        end)

        test.it("appends a validated batch and materializes it into the read model", function()
            local entry_id = roadmap_component(OWNER, "Planned roadmap")
            local applied = probe(OWNER, "apply", {
                entry_id = entry_id,
                commands = {
                    { type = types.EVENT.LAYER_ADDED, body = { id = "platform", title = "Platform" } },
                    { type = types.EVENT.INITIATIVE_ADDED, body = { id = "a", title = "Auth", layer_id = "platform", start_period = "2026-Q3" } },
                },
            })
            test.is_true((applied :: any).ok)
            test.eq((applied :: any).roadmap.counts.initiatives, 1)
            test.is_true((applied :: any).roadmap.can_undo)

            local events = probe(OWNER, "list_events", { thread_id = entry_id })
            test.eq(#(events :: any).result.events, 2)

            catch_up(OWNER, entry_id)
            local read = probe(OWNER, "state", { entry_id = entry_id })
            test.is_true((read :: any).ok)
            test.eq((read :: any).roadmap.counts.initiatives, 1)
            test.eq((read :: any).roadmap.initiatives[1].title, "Auth")
        end)

        test.it("appends nothing when the batch fails validation", function()
            local entry_id = roadmap_component(OWNER, "Refused roadmap")
            local refused = probe(OWNER, "apply", {
                entry_id = entry_id,
                commands = {
                    { type = types.EVENT.LAYER_ADDED, body = { id = "platform", title = "Platform" } },
                    { type = types.EVENT.INITIATIVE_ADDED, body = { id = "a", title = "Auth", layer_id = "nowhere" } },
                },
            })
            test.is_false((refused :: any).ok)
            test.contains(tostring((refused :: any).err), "layer not found")

            local events = probe(OWNER, "list_events", { thread_id = entry_id })
            test.eq(#(events :: any).result.events, 0)
        end)

        test.it("rejects a command type the binding does not declare", function()
            local entry_id = roadmap_component(OWNER, "Typed roadmap")
            local refused = probe(OWNER, "apply", {
                entry_id = entry_id,
                commands = { { type = "chestor.roadmap.events:layer.invented", body = { id = "x" } } },
            })
            test.is_false((refused :: any).ok)
            test.contains(tostring((refused :: any).err), "unknown event type at [1]")
        end)

        test.it("undoes and redoes a batch through the durable history stack", function()
            local entry_id = roadmap_component(OWNER, "Reversible roadmap")
            probe(OWNER, "apply", {
                entry_id = entry_id,
                commands = { { type = types.EVENT.LAYER_ADDED, body = { id = "platform", title = "Platform" } } },
            })

            local undone = probe(OWNER, "undo", { entry_id = entry_id })
            test.is_true((undone :: any).ok)
            test.eq((undone :: any).roadmap.counts.layers, 0)
            test.is_false((undone :: any).roadmap.can_undo)
            test.is_true((undone :: any).roadmap.can_redo)

            local redone = probe(OWNER, "redo", { entry_id = entry_id })
            test.is_true((redone :: any).ok)
            test.eq((redone :: any).roadmap.counts.layers, 1)
            test.is_true((redone :: any).roadmap.can_undo)
            test.is_false((redone :: any).roadmap.can_redo)
        end)

        test.it("reports nothing to undo on an untouched roadmap", function()
            local entry_id = roadmap_component(OWNER, "Untouched roadmap")
            local result = probe(OWNER, "undo", { entry_id = entry_id })
            test.is_false((result :: any).ok)
            test.contains(tostring((result :: any).err), "nothing to undo")
        end)

        test.it("answers derived queries over the materialized roadmap", function()
            local entry_id = roadmap_component(OWNER, "Wired roadmap")
            probe(OWNER, "apply", {
                entry_id = entry_id,
                commands = {
                    { type = types.EVENT.LAYER_ADDED, body = { id = "platform", title = "Platform" } },
                    { type = types.EVENT.INITIATIVE_ADDED, body = { id = "a", title = "Auth", layer_id = "platform" } },
                    { type = types.EVENT.INITIATIVE_ADDED, body = { id = "b", title = "Billing", layer_id = "platform" } },
                    { type = types.EVENT.DEPENDENCY_ADDED, body = { id = "d1", from_id = "a", to_id = "b" } },
                },
            })
            catch_up(OWNER, entry_id)

            local listed = probe(OWNER, "initiatives", { entry_id = entry_id, options = { layer = "platform" } })
            test.is_true((listed :: any).ok)
            test.eq(#(listed :: any).result.initiatives, 2)

            local chain = probe(OWNER, "dependencies", { entry_id = entry_id, options = { of = "a", direction = "unlocks", transitive = true } })
            test.is_true((chain :: any).ok)
            test.eq(#(chain :: any).result.unlocks, 1)
            test.eq((chain :: any).result.unlocks_chain[1], "b")

            local ranked = probe(OWNER, "critical", { entry_id = entry_id, top = 1 })
            test.is_true((ranked :: any).ok)
            test.eq((ranked :: any).result.critical[1].id, "a")
            test.eq((ranked :: any).result.critical[1].blocking_score, 1)
        end)

        test.it("refuses a derived query from an actor with no grant", function()
            local entry_id = roadmap_component(OWNER, "Closed roadmap")
            local result = probe(STRANGER, "initiatives", { entry_id = entry_id, options = {} })
            test.is_false((result :: any).ok)
            test.contains(tostring((result :: any).err), "roadmap access denied")
        end)

        test.it("serves the closed vocabularies without a roadmap", function()
            local result = probe(OWNER, "schema", {})
            test.is_true((result :: any).ok)
            local schema: any = (result :: any).result
            test.eq(#schema.status, 5)
            test.eq(#schema.confidence, 3)
            test.eq(#schema.size, 4)
            test.eq(#schema.dependency_kind, 2)
            test.eq(#schema.lens, 4)
            test.eq(schema.period_rules.quarter.pattern, "YYYY-Qn")
        end)

        test.it("purges the thread and the read model on destroy", function()
            local entry_id = roadmap_component(OWNER, "Doomed roadmap")
            probe(OWNER, "apply", {
                entry_id = entry_id,
                commands = { { type = types.EVENT.LAYER_ADDED, body = { id = "platform", title = "Platform" } } },
            })
            catch_up(OWNER, entry_id)

            local destroyed = probe(OWNER, "destroy", { entry_id = entry_id })
            test.is_true((destroyed :: any).ok)

            local read = probe(OWNER, "state", { entry_id = entry_id })
            test.is_false((read :: any).ok)
        end)

        test.it("fails destroy for an actor without DELETE with only the access error", function()
            local entry_id = roadmap_component(OWNER, "Guarded roadmap")
            local refused = probe(STRANGER, "destroy", { entry_id = entry_id })
            test.is_nil((refused :: any).ok)
            test.not_nil((refused :: any).err)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

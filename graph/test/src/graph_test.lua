local test = require("test")
local graph = require("graph")

local function ev(etype: string, body: any): any
    return { type = etype, body = body }
end

local function define_tests()
    test.describe("Graph Validation", function()
        test.it("accepts a batch where later facts reference earlier facts", function()
            local raw, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Actor" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "Helper", parent_id = "a" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "b" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "edge", target_id = "e", kind = "decision", title = "Why" }),
            })
            test.is_nil(err)
            test.not_nil((raw :: any).nodes.a)
            test.not_nil((raw :: any).nodes.b)
            test.not_nil((raw :: any).edges.e)
            test.not_nil((raw :: any).materials.m)
        end)

        test.it("rejects an edge whose node endpoint does not exist", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Actor" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "missing" }),
            })
            test.contains(tostring(err), "edge target node not found")
        end)

        test.it("rejects node creation without an id", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { type = "actor", name = "Actor" }),
            })
            test.contains(tostring(err), "node id required")
        end)

        test.it("rejects node creation without a name", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor" }),
            })
            test.contains(tostring(err), "node name required")
        end)

        test.it("rejects a missing parent", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Actor", parent_id = "missing" }),
            })
            test.contains(tostring(err), "parent node not found")
        end)

        test.it("rejects duplicate node creation", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Actor" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Replacement" }),
            })
            test.contains(tostring(err), "node already exists")
        end)

        test.it("rejects duplicate node creation in the same batch", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Actor" }),
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Replacement" }),
            })
            test.contains(tostring(err), "node already exists")
        end)

        test.it("rejects a parent cycle", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "scope", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "scope", name = "B", parent_id = "a" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.NODE_UPDATED, { id = "a", parent_id = "b" }),
            })
            test.contains(tostring(err), "node parent cycle refused")
        end)

        test.it("rejects update of a missing node", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_UPDATED, { id = "missing", name = "Nope" }),
            })
            test.contains(tostring(err), "node not found")
        end)

        test.it("rejects node update to an empty name", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Actor" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.NODE_UPDATED, { id = "a", name = "" }),
            })
            test.contains(tostring(err), "node name required")
        end)

        test.it("rejects removal of a missing node", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_REMOVED, { id = "missing" }),
            })
            test.contains(tostring(err), "node not found")
        end)

        test.it("rejects edge creation without an id", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "B" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_ADDED, { type = "calls", source_id = "a", target_id = "b" }),
            })
            test.contains(tostring(err), "edge id required")
        end)

        test.it("rejects edge creation without a type", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "B" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_ADDED, { id = "e", source_id = "a", target_id = "b" }),
            })
            test.contains(tostring(err), "edge type required")
        end)

        test.it("rejects edge creation without a source node id", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "B" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", target_id = "b" }),
            })
            test.contains(tostring(err), "edge source node required")
        end)

        test.it("rejects edge creation without a target node id", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "A" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a" }),
            })
            test.contains(tostring(err), "edge target node required")
        end)

        test.it("rejects an edge whose source node does not exist", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "B" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "missing", target_id = "b" }),
            })
            test.contains(tostring(err), "edge source node not found")
        end)

        test.it("rejects duplicate edge creation", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "B" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "b" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "b", target_id = "a" }),
            })
            test.contains(tostring(err), "edge already exists")
        end)

        test.it("rejects update of a missing edge", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.EDGE_UPDATED, { id = "missing", label = "Nope" }),
            })
            test.contains(tostring(err), "edge not found")
        end)

        test.it("rejects edge update to an empty type", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "B" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "b" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_UPDATED, { id = "e", type = "" }),
            })
            test.contains(tostring(err), "edge type required")
        end)

        test.it("rejects edge update to a missing endpoint", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "A" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "actor", name = "B" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "b" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_UPDATED, { id = "e", target_id = "missing" }),
            })
            test.contains(tostring(err), "edge target node not found")
        end)

        test.it("rejects removal of a missing edge", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.EDGE_REMOVED, { id = "missing" }),
            })
            test.contains(tostring(err), "edge not found")
        end)

        test.it("rejects materials for missing node targets", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "node", target_id = "missing", kind = "upload" }),
            })
            test.contains(tostring(err), "unknown material target")
        end)

        test.it("rejects material attach without an id", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_ATTACHED, { target_type = "graph", kind = "brief" }),
            })
            test.contains(tostring(err), "material id required")
        end)

        test.it("rejects material attach without a kind", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "graph" }),
            })
            test.contains(tostring(err), "material kind required")
        end)

        test.it("rejects duplicate material attachment", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "graph", kind = "note", title = "Original" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "graph", kind = "note", title = "Replacement" }),
            })
            test.contains(tostring(err), "material already exists")
        end)

        test.it("rejects duplicate material attachment in the same batch", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "graph", kind = "note", title = "Original" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "graph", kind = "note", title = "Replacement" }),
            })
            test.contains(tostring(err), "material already exists")
        end)

        test.it("rejects update of a missing material", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_UPDATED, { id = "missing", title = "Nope" }),
            })
            test.contains(tostring(err), "material not found")
        end)

        test.it("rejects material update to an empty kind", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "graph", kind = "note", title = "Note" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.MATERIAL_UPDATED, { id = "m", kind = "" }),
            })
            test.contains(tostring(err), "material kind required")
        end)

        test.it("rejects material retarget to a missing edge", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "A" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "node", target_id = "a", kind = "note" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.MATERIAL_UPDATED, { id = "m", target_type = "edge", target_id = "missing" }),
            })
            test.contains(tostring(err), "unknown material target")
        end)

        test.it("rejects detach of a missing material", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_DETACHED, { id = "missing" }),
            })
            test.contains(tostring(err), "material not found")
        end)

        test.it("retargets a material to graph without retaining a stale target id", function()
            local raw, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "actor", name = "Actor" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "node", target_id = "a", kind = "note", title = "Note" }),
                ev(graph.EVENT.MATERIAL_UPDATED, { id = "m", target_type = "graph" }),
            })
            test.is_nil(err)
            test.eq((raw :: any).materials.m.target_type, "graph")
            test.is_nil((raw :: any).materials.m.target_id)
            local built = graph.build(raw)
            test.eq(#(built :: any).materials, 1)
            test.eq((built :: any).materials[1].id, "m")
        end)

        test.it("rejects layout for a missing node", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.LAYOUT_POSITION_SET, { node_id = "missing", x = 1, y = 2 }),
            })
            test.contains(tostring(err), "layout node not found")
        end)

        test.it("rejects type registration without a title", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_TYPE_REGISTERED, { id = "actor" }),
            })
            test.contains(tostring(err), "type title required")
        end)

        test.it("rejects duplicate type registration", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_TYPE_REGISTERED, { id = "actor", title = "Actor" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.NODE_TYPE_REGISTERED, { id = "actor", title = "Replacement" }),
            })
            test.contains(tostring(err), "type already exists")
        end)

        test.it("rejects duplicate edge and material type registrations", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.EDGE_TYPE_REGISTERED, { id = "calls", title = "Calls" }),
                ev(graph.EVENT.MATERIAL_TYPE_REGISTERED, { id = "upload", title = "Upload" }),
            }))
            local _, edge_err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.EDGE_TYPE_REGISTERED, { id = "calls", title = "Replacement" }),
            })
            test.contains(tostring(edge_err), "type already exists")
            local _, material_err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.MATERIAL_TYPE_REGISTERED, { id = "upload", title = "Replacement" }),
            })
            test.contains(tostring(material_err), "type already exists")
        end)

        test.it("rejects update of a missing type", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_TYPE_UPDATED, { id = "missing", title = "Missing" }),
            })
            test.contains(tostring(err), "type not found")
        end)

        test.it("rejects type update to an empty title", function()
            local raw = select(1, graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_TYPE_REGISTERED, { id = "actor", title = "Actor" }),
            }))
            local _, err = graph.validate_and_fold(raw, {
                ev(graph.EVENT.NODE_TYPE_UPDATED, { id = "actor", title = "" }),
            })
            test.contains(tostring(err), "type title required")
        end)

        test.it("rejects type removal without an id", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.EDGE_TYPE_REMOVED, {}),
            })
            test.contains(tostring(err), "type id required")
        end)

        test.it("rejects removal of a missing type", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_TYPE_REMOVED, { id = "missing" }),
            })
            test.contains(tostring(err), "type not found")
        end)

        test.it("rejects layout clear for a missing node", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.LAYOUT_POSITION_CLEARED, { node_id = "missing" }),
            })
            test.contains(tostring(err), "layout node not found")
        end)

        test.it("allows graph-level materials without a target id", function()
            local raw, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "graph", kind = "brief", title = "Overview" }),
            })
            test.is_nil(err)
            local built = graph.build(raw)
            test.eq(#(built :: any).materials, 1)
        end)

        test.it("keeps existing fields on partial node edge material and type updates", function()
            local raw, err = graph.validate_and_fold(graph.empty_state(), {
                ev(graph.EVENT.NODE_TYPE_REGISTERED, { id = "service", title = "Service", color = "#111" }),
                ev(graph.EVENT.NODE_ADDED, { id = "a", type = "service", name = "A", description = "old" }),
                ev(graph.EVENT.NODE_ADDED, { id = "b", type = "service", name = "B" }),
                ev(graph.EVENT.EDGE_ADDED, { id = "e", type = "calls", source_id = "a", target_id = "b", label = "old" }),
                ev(graph.EVENT.MATERIAL_ATTACHED, { id = "m", target_type = "node", target_id = "a", kind = "note", title = "Old", summary = "keep" }),
                ev(graph.EVENT.NODE_TYPE_UPDATED, { id = "service", color = "#fff" }),
                ev(graph.EVENT.NODE_UPDATED, { id = "a", name = "A2" }),
                ev(graph.EVENT.EDGE_UPDATED, { id = "e", label = "new" }),
                ev(graph.EVENT.MATERIAL_UPDATED, { id = "m", title = "New" }),
            })
            test.is_nil(err)
            test.eq((raw :: any).node_types.service.title, "Service")
            test.eq((raw :: any).node_types.service.color, "#fff")
            test.eq((raw :: any).nodes.a.description, "old")
            test.eq((raw :: any).edges.e.source_id, "a")
            test.eq((raw :: any).edges.e.target_id, "b")
            test.eq((raw :: any).materials.m.summary, "keep")
            test.eq((raw :: any).materials.m.target_id, "a")
        end)

        test.it("rejects an unknown event type on a direct validate_and_fold call", function()
            local _, err = graph.validate_and_fold(graph.empty_state(), {
                ev("chestor.graph.events:unknown.event", { id = "x" }),
            })
            test.contains(tostring(err), "unknown event type")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }

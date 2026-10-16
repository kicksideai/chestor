local db = require("db")

local M = {}

local ALLOWED_LIFECYCLE = { active = true, learning = true, frozen = true, archived = true }
local ALLOWED_MAINTAINER = { deterministic = true, agent = true, ["deterministic+agent"] = true }

-- The class the on-demand refine pass judges candidate relations with. It is a
-- class ref, never a card name: which model answers the class is the
-- deployment's knob, and a graph may name a different tier in its config.
local DEFAULT_ASSEMBLY_MODEL = "class:nano"

local function trim(value: any): string
    return db.trim(value)
end

local function copy(value: any): any
    local out = {}
    if type(value) ~= "table" then return out end
    for key, item in pairs(value :: any) do out[key] = item end
    return out
end

local function string_array(value: any): any
    local out = {}
    if type(value) ~= "table" then return out end
    for _, item in ipairs(value :: any) do
        local normalized = trim(item)
        if normalized ~= "" then out[#out + 1] = normalized end
    end
    return out
end

function M.normalize(input: any): (any?, any?)
    local value = copy(input)
    local graph_id = trim(value.graph_id or value.id)
    if graph_id == "" then return nil, errors.new({ message = "graph_id is required", kind = errors.INVALID }) end
    if not graph_id:match("^[%w][%w%._:%-]*$") then return nil, errors.new({ message = "invalid graph_id", kind = errors.INVALID }) end
    local title = trim(value.title)
    if title == "" then return nil, errors.new({ message = "graph title is required", kind = errors.INVALID }) end
    local graph_kind = trim(value.kind)
    if graph_kind == "" then graph_kind = "curated" end
    if #graph_kind > 96 then return nil, errors.new({ message = "graph kind is too long", kind = errors.INVALID }) end
    local lifecycle = trim(value.lifecycle)
    if lifecycle == "" then lifecycle = "active" end
    if not ALLOWED_LIFECYCLE[lifecycle] then return nil, errors.new({ message = "invalid graph lifecycle", kind = errors.INVALID }) end
    local maintainer = type(value.maintainer) == "table" and copy(value.maintainer) or {}
    -- Automatic graphs default to running the semantic maintainer agent on top of
    -- the deterministic per-event projection, so maps cluster by meaning (concept
    -- nodes, coherent branches) as they grow instead of staying a flat per-event
    -- list. Requires an available maintainer model (class:fast).
    local mode = trim(maintainer.mode or value.maintainer_mode)
    if mode == "" then mode = graph_kind == "automatic" and "deterministic+agent" or "deterministic" end
    if not ALLOWED_MAINTAINER[mode] then return nil, errors.new({ message = "invalid graph maintainer mode", kind = errors.INVALID }) end
    maintainer.mode = mode
    maintainer.model = trim(maintainer.model) ~= "" and trim(maintainer.model) or "class:fast"
    maintainer.agent_id = trim(maintainer.agent_id)
    maintainer.prompt = trim(maintainer.prompt)
    maintainer.trait_ids = string_array(maintainer.trait_ids)
    maintainer.maximum_iterations = math.max(1, math.min(math.floor(tonumber(maintainer.maximum_iterations) or 8), 20))
    local schedule = type(value.schedule) == "table" and copy(value.schedule) or {}
    schedule.min_nodes = math.max(4, math.min(math.floor(tonumber(schedule.min_nodes) or 24), 10000))
    schedule.growth_nodes = math.max(1, math.min(math.floor(tonumber(schedule.growth_nodes) or 16), 10000))
    schedule.max_roots = math.max(2, math.min(math.floor(tonumber(schedule.max_roots) or 12), 1000))
    schedule.max_siblings = math.max(2, math.min(math.floor(tonumber(schedule.max_siblings) or 12), 1000))
    -- Assembly is the on-demand recompute: a deterministic replay of every
    -- derivable relation, then a bounded refine pass that asks a small model
    -- about candidate pairs the rules cannot see. Refine is on unless a graph
    -- turns it off.
    local assembly = type(value.assembly) == "table" and copy(value.assembly) or {}
    assembly.refine = assembly.refine ~= false
    assembly.model = trim(assembly.model) ~= "" and trim(assembly.model) or DEFAULT_ASSEMBLY_MODEL
    assembly.minimum_confidence = math.max(0, math.min(tonumber(assembly.minimum_confidence) or 0.6, 1))
    assembly.max_edges_per_node = math.max(1, math.min(math.floor(tonumber(assembly.max_edges_per_node) or 3), 8))
    assembly.max_candidates = math.max(1, math.min(math.floor(tonumber(assembly.max_candidates) or 120), 600))
    assembly.batch_size = math.max(1, math.min(math.floor(tonumber(assembly.batch_size) or 12), 40))
    local sources = type(value.sources) == "table" and copy(value.sources) or {}
    sources.event_types = string_array(sources.event_types)
    sources.tags = string_array(sources.tags)
    local retention = type(value.retention) == "table" and copy(value.retention) or {}
    retention.policy = trim(retention.policy) ~= "" and trim(retention.policy) or "keep"
    local workspace = type(value.workspace) == "table" and copy(value.workspace) or {}
    workspace.detached = workspace.detached == true
    workspace.parent_graph_id = trim(workspace.parent_graph_id)
    workspace.anchor_graph_id = trim(workspace.anchor_graph_id)
    workspace.anchor_node_id = trim(workspace.anchor_node_id)
    workspace.research_question = trim(workspace.research_question)
    workspace.expected_outputs = string_array(workspace.expected_outputs)
    workspace.closure_criteria = string_array(workspace.closure_criteria)
    workspace.integration_policy = trim(workspace.integration_policy) ~= ""
        and trim(workspace.integration_policy) or "explicit"
    if workspace.detached and workspace.integration_policy ~= "explicit" then
        return nil, errors.new({ message = "detached workspaces require explicit integration_policy", kind = errors.INVALID })
    end
    return {
        graph_id = graph_id,
        title = title,
        description = trim(value.description or value.purpose),
        kind = graph_kind,
        lifecycle = lifecycle,
        sources = sources,
        shape = type(value.shape) == "table" and copy(value.shape) or {},
        maintainer = maintainer,
        assembly = assembly,
        schedule = schedule,
        retention = retention,
        write_policy = type(value.write_policy) == "table" and copy(value.write_policy) or {},
        layout = type(value.layout) == "table" and copy(value.layout) or {},
        workspace = workspace,
        expected_config_revision = tonumber(value.expected_config_revision),
        request_id = trim(value.request_id),
        execution_identity = value.execution_identity,
    }, nil
end

function M.matches(config: any, event_type: string, tags: any): boolean
    local sources = type(config) == "table" and type((config :: any).sources) == "table" and (config :: any).sources or {}
    local event_types = type(sources.event_types) == "table" and sources.event_types or {}
    local source_tags = type(sources.tags) == "table" and sources.tags or {}
    if #event_types == 0 and #source_tags == 0 then return false end
    for _, candidate in ipairs(event_types) do
        if tostring(candidate) == event_type or event_type:find(tostring(candidate), 1, true) then return true end
    end
    local tag_set = {}
    for _, tag in ipairs(type(tags) == "table" and tags or {}) do tag_set[string.lower(tostring(tag))] = true end
    for _, candidate in ipairs(source_tags) do
        if tag_set[string.lower(tostring(candidate))] then return true end
    end
    return false
end

return M

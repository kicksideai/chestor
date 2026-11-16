-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local funcs = require("funcs")
local client = require("client")
local traits = require("traits")
local values = require("values")
type Object = {[string]: unknown}
type Declaration = {traits: {string}?, context: Object?}
type Tool = {id: string, name: string, description: string, inputSchema: Object, context: Object}
type Surface = {tools: {Tool}, instructions: string?}
type TraitTool = {id: string, context: Object?, alias: string?, description: string?, schema: Object?}
type Contribution = {prompt: string?, tools: {string | TraitTool}?, context: Object?, delegates: {Object}?, agent_options: Object?}
local function merge(base: Object?, overrides: Object?): Object
    local result = {}
    for key, value in pairs(base or {}) do result[key] = value end
    for key, value in pairs(overrides or {}) do result[key] = value end
    return result
end
local function populated(value: unknown): boolean
    return value ~= nil and (type(value) ~= "table" or next(value) ~= nil)
end
local function context_problem(context: Object): string?
    for _, key in ipairs({"autocode_flow", "trace_context", "_execution_identity", "component_id", "actor_id", "actor_context"}) do
        if context[key] ~= nil then return "tool context reserves " .. key .. " for transport" end
    end
    return nil
end
-- Bee driver configuration bounds request.gateway.tools to 32 members.
local MAX_GATEWAY_TOOLS = 32
local M = {}
local function invalid(message: string): error
    return errors.new({kind = errors.INVALID, message = message})
end
-- Read the MCP declaration on the batch profile, rather than infer support
-- from a CLI name or from the presence of unrelated driver options.
function M.supports(agent: string): (boolean?, error?)
    local bindings, err = registry.find({[".kind"] = "contract.binding", ["meta.type"] = "harness.driver", ["meta.driver_id"] = agent})
    if not bindings then return nil, err end
    for _, binding in ipairs(bindings) do
        local ref = binding.meta and binding.meta.profiles_ref
        if type(ref) == "string" then
            local entry, read_err = registry.get(ref)
            if not entry then return nil, read_err end
            local driver = entry.data and entry.data.driver
            for _, profile in ipairs(driver and driver.profiles or {}) do
                if profile.id == "batch" then
                    local mcp = profile.mcp or {}
                    for _, transport in ipairs(mcp.client_transports or {}) do
                        if transport == "streamable_http" or mcp.bridge_ref then return true, nil end
                    end
                end
            end
        end
    end
    return false, nil
end
function M.resolve(surface: unknown, agent: string): (Surface?, error?)
    if surface == nil then return nil, nil end
    local supported, support_err = M.supports(agent)
    if support_err then return nil, support_err end
    if not supported then return nil, invalid("this harness batch profile does not declare MCP support") end
    if type(surface) ~= "table" then return nil, invalid("tools must be an object") end
    for key in pairs(surface) do
        if key ~= "traits" and key ~= "context" then return nil, invalid("unknown tools field: " .. tostring(key)) end
    end
    local declaration = surface :: Declaration
    local context = values.object(declaration.context or {})
    if not context then return nil, invalid("tool context must be an object") end
    local problem = context_problem(context)
    if problem then return nil, invalid(problem) end
    local encoded, context_err = values.json(context, 65536)
    if not encoded then return nil, context_err end
    local catalog, catalog_err = client.call("kickside.agents:tools", "list", {})
    if not catalog then return nil, catalog_err end
    type Descriptor = {id: string, public: boolean, llm_alias: string, llm_description: string, input_schema: Object}
    local public: {[string]: Descriptor} = {}
    for _, tool in ipairs(catalog :: {Descriptor}) do public[tool.id] = tool end
    local tools: {Tool} = {}
    local prompts: {string} = {}
    local seen, names = {}, {}
    local function add(id: string, defaults: Object?, capability: boolean?, spec: TraitTool?): error?
        local problem = context_problem(defaults or {})
        if problem then return invalid(problem) end
        if seen[id] then return nil end
        local tool = public[id]
        if not tool and capability then
            local found, find_err = client.call("kickside.agents:tools", "find", {id = id})
            if find_err then return find_err end
            tool = found :: Descriptor?
        end
        if not tool then return invalid("tool is not in the actor-visible catalog: " .. id) end
        local alias = spec and spec.alias or (tool.llm_alias ~= "" and tool.llm_alias or id:match("[^:]+$") or id)
        local name = alias:gsub("[^%w]", "_"):gsub("([A-Z])", function(c: string): string return "_" .. c:lower() end)
            :gsub("__+", "_"):gsub("^_", ""):gsub("[^a-z_]", "_")
        if name == "" then return invalid("tool has no usable MCP name: " .. id) end
        if names[name] then return invalid("bound tools have a duplicate MCP name: " .. name) end
        names[name], seen[id] = true, true
        tools[#tools + 1] = {id = id, name = name, description = spec and spec.description or tool.llm_description or "", inputSchema = spec and spec.schema or tool.input_schema, context = defaults or {}}
        return nil
    end
    local trait_contexts: {[string]: Object} = {}
    local accepted: {[string]: boolean} = {}
    for _, id in ipairs(declaration.traits or {}) do
        local entry, read_err = registry.get(id)
        if not entry then return nil, read_err end
        local schema = entry.meta and entry.meta.context_schema
        local selected: Object = {}
        for key in pairs(schema and schema.properties or {}) do
            accepted[key] = true
            if context[key] ~= nil then selected[key] = context[key] end
        end
        trait_contexts[id] = selected
    end
    for key in pairs(context) do
        if not accepted[key] then return nil, invalid("tool context field is not declared by any selected trait: " .. key) end
    end
    if #(declaration.traits or {}) > 0 then
        local capability_context = require("capability_context")
        local validation, validation_err = capability_context.validate_trait_contexts(declaration.traits, trait_contexts, registry.get)
        if validation_err then return nil, validation_err end
        if not validation.ok then return nil, invalid("trait context invalid: " .. capability_context.error_message(validation)) end
    end
    for _, id in ipairs(declaration.traits or {}) do
        local trait, trait_err = traits.get_by_id(id)
        if not trait then return nil, invalid("trait cannot be resolved: " .. id .. ": " .. tostring(trait_err)) end
        -- These hooks need the internal agent's messages and per-turn session state;
        -- the external harness owns that lifecycle and exposes no hook invocation.
        if trait.prompt_func_id or trait.step_func_id then
            return nil, invalid("trait requires internal agent turn hooks: " .. id)
        end
        -- Bindings, behaviours and wrappers run inside the agent's execution pipeline.
        -- Publishing only their tools would bypass their execution/checkpoint semantics.
        if populated(trait.bindings) or populated(trait.behaviors) or populated(trait.tool_wrappers) then
            return nil, invalid("trait requires the internal agent execution pipeline: " .. id)
        end
        -- Internal model/session options cannot configure a separate harness driver.
        if populated(trait.agent_options) then return nil, invalid("trait requires internal agent options: " .. id) end
        local selected_context = trait_contexts[id]
        local trait_context = merge(trait.context, selected_context)
        local problem = context_problem(trait_context)
        if problem then return nil, invalid(problem) end
        local members: {TraitTool} = {}
        for _, tool in ipairs(trait.tools or {}) do members[#members + 1] = tool end
        if trait.prompt and trait.prompt ~= "" then prompts[#prompts + 1] = trait.prompt end
        if trait.build_func_id then
            -- The Wippy trait build contract: (prompt, context), with the same
            -- context attached to funcs. Inherit the caller's actor and scope.
            local build_context = merge(trait_context, {agent_id = agent})
            local executor, executor_err = funcs.new()
            if not executor then return nil, executor_err end
            local caller, caller_err = executor:with_context(build_context)
            if not caller then return nil, caller_err end
            local built, build_err = caller:call(trait.build_func_id, trait.prompt, build_context)
            if build_err then return nil, build_err end
            local contribution = built :: Contribution?
            if contribution then
                -- Delegates need the internal agent router; driver options are a
                -- different contract from the internal agent's model/session options.
                if populated(contribution.delegates) or populated(contribution.agent_options) then
                    return nil, invalid("trait build requires internal agent delegates or options: " .. id)
                end
                if contribution.prompt and contribution.prompt ~= "" then prompts[#prompts + 1] = contribution.prompt end
                trait_context = merge(trait_context, contribution.context)
                for _, tool in ipairs(contribution.tools or {}) do
                    members[#members + 1] = type(tool) == "string" and {id = tool} or tool
                end
            end
        end
        for _, tool in ipairs(members) do
            -- Wippy precedence: trait defaults/build context, declaration, tool.
            local defaults = merge(merge(trait_context, selected_context), tool.context)
            defaults.agent_id = agent
            if tool.id:sub(-2) == ":*" then
                local namespace = tool.id:sub(1, -2)
                for _, entry in ipairs(catalog :: {Descriptor}) do
                    if entry.id:sub(1, #namespace) == namespace then
                        local err = add(entry.id, defaults, nil, tool); if err then return nil, err end
                    end
                end
            else
                local err = add(tool.id, defaults, true, tool); if err then return nil, err end
            end
        end
    end
    if #tools > MAX_GATEWAY_TOOLS then
        return nil, errors.new({kind = errors.INVALID, message = "tool surface exceeds driver bound of " .. tostring(MAX_GATEWAY_TOOLS),
            retryable = false, details = {code = "autocode.tool_limit_exceeded", limit = MAX_GATEWAY_TOOLS, count = #tools}})
    end
    return {tools = tools, instructions = #prompts > 0 and table.concat(prompts, "\n\n") or nil}, nil
end
return M

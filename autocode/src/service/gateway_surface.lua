-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local client = require("client")
local traits = require("traits")
local values = require("values")
type Object = {[string]: unknown}
type Declaration = {traits: {string}?, tools: {string}?, context: Object?}
type Tool = {id: string, name: string, description: string, inputSchema: Object, context: Object}
type Surface = {tools: {Tool}, context: Object, instructions: string?}
type Trait = {prompt: string?, tools: {{id: string, context: Object?}}}
local function context_problem(context: Object): string?
    for _, key in ipairs({"autocode_flow", "trace_context", "_execution_identity", "component_id", "actor_id", "actor_context"}) do
        if context[key] ~= nil then return "tool context reserves " .. key .. " for transport" end
    end
    return nil
end
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
    local function add(id: string, defaults: Object?, capability: boolean?): error?
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
        local alias = tool.llm_alias ~= "" and tool.llm_alias or id:match("[^:]+$") or id
        local name = alias:gsub("[^%w]", "_"):gsub("([A-Z])", function(c: string): string return "_" .. c:lower() end)
            :gsub("__+", "_"):gsub("^_", ""):gsub("[^a-z_]", "_")
        if name == "" then return invalid("tool has no usable MCP name: " .. id) end
        if names[name] then return invalid("bound tools have a duplicate MCP name: " .. name) end
        names[name], seen[id] = true, true
        tools[#tools + 1] = {id = id, name = name, description = tool.llm_description or "", inputSchema = tool.input_schema, context = defaults or {}}
        if #tools > 128 then return invalid("tool surface exceeds 128 tools") end
        return nil
    end
    for _, id in ipairs(declaration.traits or {}) do
        local entry, entry_err = registry.get(id)
        if not entry then return nil, entry_err end
        local data, meta = entry.data or {}, entry.meta or {}
        for _, field in ipairs({"build_func_id", "prompt_func_id", "step_func_id", "behaviors", "binding", "bindings",
            "tool_wrapper", "tool_wrappers", "options", "agent_options", "context"}) do
            local value = data[field]
            if value ~= nil and (type(value) ~= "table" or next(value) ~= nil) then
                return nil, invalid("unsupported trait feature " .. id .. ": " .. field)
            end
        end
        if meta.context_schema ~= nil or meta.web_component ~= nil then
            return nil, invalid("unsupported trait configuration: " .. id)
        end
        for _, tool in ipairs(data.tools or {}) do
            if type(tool) == "table" and (tool.alias ~= nil or tool.description ~= nil) then
                return nil, invalid("unsupported trait tool alias or description: " .. id)
            end
        end
        local loaded, trait_err = traits.get_by_id(id)
        local trait = loaded :: Trait?
        if not trait then return nil, invalid("trait cannot be resolved: " .. id .. ": " .. tostring(trait_err)) end
        if trait.prompt and trait.prompt ~= "" then prompts[#prompts + 1] = trait.prompt end
        for _, tool in ipairs(trait.tools or {}) do
            if tool.id:sub(-2) == ":*" then
                local namespace = tool.id:sub(1, -2)
                for _, entry in ipairs(catalog :: {Descriptor}) do
                    if entry.id:sub(1, #namespace) == namespace then
                        local err = add(entry.id, tool.context); if err then return nil, err end
                    end
                end
            else
                local err = add(tool.id, tool.context, true); if err then return nil, err end
            end
        end
    end
    for _, id in ipairs(declaration.tools or {}) do local err = add(id, nil); if err then return nil, err end end
    return {tools = tools, context = context, instructions = #prompts > 0 and table.concat(prompts, "\n\n") or nil}, nil
end
return M

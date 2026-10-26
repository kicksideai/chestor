-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Typed access to the account, image and workspace components. Every call
-- runs under the caller's frame: the component service checks the caller's
-- grants, so a resource the caller cannot read is absent. Public meta holds
-- flat render fields only.
local component = require("component")
local envelope = require("envelope")
local json = require("json")
local component_types = require("component_types")

type Object = {[string]: unknown}
type Kind = "account" | "image" | "workspace"
-- access: the caller's effective mask on the resource; owner: the creating user.
type Resource = {id: string, kind: Kind, meta: Object, access: integer, owner: string}
-- revision: the private context revision a compare-and-set write expects.
type Context = {values: Object, revision: integer, access: integer}

local M = {}

M.ACCESS = component.ACCESS

M.KINDS = {
    account = "chestor.autocode.components:account",
    image = "chestor.autocode.components:image",
    workspace = "chestor.autocode.components:workspace",
}

local PAGE = 200

local function service(): (any, error?)
    local svc, err = component.get_service()
    if err or not svc then return nil, envelope.call_error(err, "component_service") end
    return svc, nil
end

local function object(value: unknown): Object
    local result: Object = {}
    if type(value) ~= "table" then return result end
    for key, item in pairs(value) do
        if type(key) == "string" then result[key] = item end
    end
    return result
end

local function resource(kind: Kind, row: any): Resource
    local meta = object(row.meta)
    local owner = meta.owner
    return {id = tostring(row.component_id), kind = kind, meta = meta, access = math.floor(tonumber(row.access_level) or 0),
        owner = type(owner) == "string" and owner or ""}
end

-- Public meta stores flat strings: a boolean reads back as "true" or
-- "false" and a list as its JSON text. These read them back typed.

function M.flag(value: unknown, default: boolean): boolean
    if value == true or value == "true" then return true end
    if value == false or value == "false" then return false end
    return default
end

function M.strings(value: unknown): {string}
    local result: {string} = table.create(1, 0)
    local decoded = type(value) == "string" and json.decode(value) or value
    if type(decoded) ~= "table" then return result end
    for _, item in ipairs(decoded) do
        if type(item) == "string" then result[#result + 1] = item end
    end
    return result
end

function M.text(value: unknown): string
    return type(value) == "string" and value or ""
end

function M.has(access: integer, required: integer): boolean
    return math.floor(access / required) % 2 == 1
end

-- list returns every resource of the kind the caller can read.
function M.list(kind: Kind): ({Resource}?, error?)
    local result: {Resource} = {}
    local offset = 0
    while true do
        local rows, err = component.query({impl_ids = {M.KINDS[kind]}, include = {meta = true, access = true},
            order_by = {field = "created_at", direction = "ASC"}, limit = PAGE, offset = offset})
        if err then return nil, err end
        for _, row in ipairs(rows or {}) do result[#result + 1] = resource(kind, row) end
        if #(rows or {}) < PAGE then return result, nil end
        offset = offset + PAGE
    end
end

-- get returns the resource when the caller holds the required access; a
-- resource the caller cannot reach is not found, never told apart.
function M.get(kind: Kind, id: string, required: integer): (Resource?, error?)
    local rows, err = component.query({component_ids = {id}, impl_ids = {M.KINDS[kind]}, include = {meta = true, access = true}, limit = 1})
    if err then return nil, err end
    local row = rows and rows[1]
    if not row then return nil, errors.new({kind = errors.NOT_FOUND, message = kind .. " not found"}) end
    local found = resource(kind, row)
    if not M.has(found.access, required) then return nil, errors.new({kind = errors.NOT_FOUND, message = kind .. " not found"}) end
    return found, nil
end

-- context returns the private context of a resource the caller holds the
-- required access on, with the revision a write-back expects.
function M.context(kind: Kind, id: string, required: integer): (Context?, error?)
    local found, find_err = M.get(kind, id, required)
    if not found then return nil, find_err end
    local svc, svc_err = service()
    if not svc then return nil, svc_err end
    local result, call_err = svc:get_access_context({component_id = id, access_mask = required, include_context = true})
    if call_err then return nil, envelope.call_error(call_err, "get_access_context") end
    local result_err = envelope.error_of(result :: component_types.ServiceEnvelope, "get_access_context")
    if result_err then return nil, result_err end
    return {values = object(result.context), revision = math.floor(tonumber(result.context_revision) or 0),
        access = math.floor(tonumber(result.access_level) or 0)}, nil
end

-- register creates a resource the caller owns.
function M.register(kind: Kind, meta: Object, private: Object): (string?, error?)
    local svc, svc_err = service()
    if not svc then return nil, svc_err end
    meta.class = "chestor.autocode." .. kind
    local result, call_err = svc:register({impl_id = M.KINDS[kind], meta = meta, private_context = private})
    if call_err then return nil, envelope.call_error(call_err, "register_component") end
    local result_err = envelope.error_of(result :: component_types.ServiceEnvelope, "register_component")
    if result_err then return nil, result_err end
    return tostring(result.component_id), nil
end

-- set_meta changes public fields of a resource the caller may write.
function M.set_meta(id: string, fields: Object): error?
    local _, err = component.set_meta(id, fields)
    return err
end

-- patch_context merges keys into the private context; with a revision the
-- write applies only when nothing changed the context since it was read.
function M.patch_context(id: string, patch: Object, expected_revision: integer?): error?
    local _, err = component.update(id, {{type = "PATCH_CONTEXT", payload = {component_id = id, patch = patch}}},
        expected_revision and {expected_revision = expected_revision} or nil)
    return err
end

-- Related metadata and private-context changes share one component revision.
function M.replace(id: string, fields: Object, patch: Object?, revision: integer): error?
    local commands: {{type: string, payload: Object}} = {}
    if next(fields) ~= nil then commands[#commands + 1] = {type = "SET_META", payload = {component_id = id, fields = fields}} end
    if patch then commands[#commands + 1] = {type = "PATCH_CONTEXT", payload = {component_id = id, patch = patch}} end
    local _, err = component.update(id, commands, {expected_revision = revision})
    return err
end

-- delete removes a resource the caller may delete, running its teardown.
function M.delete(id: string): error?
    local svc, svc_err = service()
    if not svc then return svc_err end
    local result, call_err = svc:delete({component_id = id})
    if call_err then return envelope.call_error(call_err, "delete_component") end
    return envelope.error_of(result :: component_types.ServiceEnvelope, "delete_component")
end

return M

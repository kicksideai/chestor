-- Kind discovery. A workspace kind is just a component impl (contract.binding) whose
-- meta self-describes its UI through ONE canonical block -- capability-by-presence:
--
--   meta.component:
--     create: { view, surface: popup|page }            -- how the user makes one
--     manage: { view, surface: page|popup, deep_link }  -- how it is viewed / edited
--
-- `view` is a view.component entry id (resolved to its tag_name) or a literal
-- web-component tag. `surface` says whether the shell mounts it in a popup or a full
-- page (default: create=popup, manage=page). `deep_link` marks a manage view that is
-- reachable by route = component id.
--
-- Rules, no flags:
--   * The tree renders EVERY component by its manage view (generic fallback when none),
--     hiding only internal event-log threads (the kind-less thread impl).
--   * Creatable ⇔ manageable: the create picker ("+") offers any kind that can be managed
--     HERE -- it declares a manage view, or is a container (a folder needs no editor). The
--     generic name dialog creates it unless the kind also declares a `create` UI (a custom
--     popup/page). A kind with only a create UI and no manage (an automation, managed on
--     its own surface) stays visible in the tree but out of "+".
-- There is no `creatable`, no `renderer`, no `picker_excluded`, no nesting allow-list.
-- Every kind declares its UI through the nested `component` block; there is no flat
-- `component.{create_ui_id,manage_ui_id}`.

local registry = require("registry")

local M = {}

-- The generic, kind-less thread impl. Internal event-log threads (chat/session,
-- KB ingest, lifecycle) are registered under it and are never tree entries.
local GENERIC_THREAD_IMPL = "kickside.core:thread"
-- The canonical default create popup. A kind whose component.create declares no custom
-- view falls back to this web component (name + icon -> the create API), so EVERY
-- creatable kind resolves to a real popup web component, never an ad-hoc shell dialog.
local GENERIC_CREATE_TAG = "wc-entry-create"

local function meta_of(entry)
    return entry.meta or (entry.data and entry.data.meta) or {}
end

-- Resolve a web-component tag from a `view` value: a view.component entry id -> its
-- tag_name, else the value used as a literal tag.
local function tag_of(view)
    if type(view) ~= "string" or view == "" then return nil end
    local e = registry.get(view)
    if e then
        local m = meta_of(e)
        return (type(m.tag_name) == "string" and m.tag_name ~= "") and m.tag_name or nil
    end
    return view
end

-- The manage UI a kind mounts in the tree, or nil. Reads nested component.manage.view.
local function manage_ui(meta)
    local comp = type(meta.component) == "table" and meta.component or {}
    local block = type(comp.manage) == "table" and comp.manage or nil
    local view = block and block.view
    local tag = tag_of(view)
    if not tag then return nil end
    return {
        view = tag,
        surface = (block and type(block.surface) == "string" and block.surface ~= "" and block.surface) or "page",
        deep_link = (block and block.deep_link == true) or nil,
    }
end

-- The create UI for a kind, or nil when it declares no workspace create. A declared but
-- viewless `component.create: {}` resolves to the canonical generic create popup; a block
-- with a view names a custom create popup/page. Either way the result is a web-component
-- tag the shell mounts -- there is no ad-hoc fallback. Legacy FLAT component.create_ui_id
-- is NOT read here on purpose: a create UI that belongs to another surface (an
-- automation's own create) must not pull the kind into the workspace "+".
local function create_ui(meta)
    local comp = type(meta.component) == "table" and meta.component or {}
    local block = comp.create
    if type(block) ~= "table" then return nil end
    return {
        view = tag_of(block.view) or GENERIC_CREATE_TAG,
        surface = (type(block.surface) == "string" and block.surface ~= "" and block.surface) or "popup",
    }
end

local function first_class(raw)
    if type(raw) == "table" then
        local v = raw[1]
        return (type(v) == "string" and v ~= "") and v or nil
    end
    if type(raw) == "string" and raw ~= "" then return raw end
    return nil
end

local function label_of(meta)
    if type(meta.title) == "string" and meta.title ~= "" then return meta.title end
    local c = tostring(first_class(meta.class) or "")
    return c:sub(1, 1):upper() .. c:sub(2)
end

-- A kind belongs in the workspace "+" when it declares a workspace create UI
-- (component.create -- viewless = generic dialog, a view = custom popup/page) or is a
-- container (a folder needs no editor). Manageable-but-not-here kinds (file via upload,
-- link via reference, automation on its own surface) declare no component.create: they
-- stay visible in the tree but out of "+". This is the whole gate -- no creatable/picker
-- flags.
local function creatable(meta)
    -- Installable automation types (meta.type = kickside.automation) are offered
    -- inside the aggregate "Automation" create popup (one "+" entry), never as their
    -- own "+" kinds. They stay in the tree (their instances render by impl).
    if meta.type == "kickside.automation" then return false end
    return meta.container == true or create_ui(meta) ~= nil
end

local function all_kinds()
    -- registry.find is version-aware: the runtime caches a query within one registry
    -- version and invalidates that cache when a changeset is applied. Do not retain a
    -- second, process-lifetime cache here or bindings installed at runtime never become
    -- visible to an already-loaded workspace library.
    local entries, err = registry.find({ [".kind"] = "contract.binding" })
    if err then return nil, err end
    local out = {}
    for _, e in ipairs(entries or {}) do
        local meta = meta_of(e)
        if meta.class then
            out[#out + 1] = { id = e.id, meta = meta }
        end
    end
    return out, nil
end

-- Public kinds for the create picker + tree chips.
function M.list(opts)
    opts = opts or {}
    local kinds, err = all_kinds()
    if err then return nil, err end
    local out = {}
    for _, k in ipairs(kinds) do
        local m = k.meta
        local can_create = creatable(m)
        if not opts.creatable_only or can_create then
            local create = create_ui(m)
            local manage = manage_ui(m)
            out[#out + 1] = {
                value = first_class(m.class),
                label = label_of(m),
                icon = m.icon or "tabler:file",
                color = m.color or "var(--km-muted)",
                description = m.comment or "",
                creatable = can_create,
                container = m.container == true,
                create = create or nil,
                manage = manage or nil,
                -- Back-compat: the shell still reads `renderer` (the manage tag) until
                -- it switches to `manage.view`.
                renderer = manage and manage.view or nil,
            }
        end
    end
    table.sort(out, function(a, b) return tostring(a.label) < tostring(b.label) end)
    return out, nil
end

-- Resolve a kind by class -> { impl = <binding id>, meta }. Used by create + read.
function M.kind_for(class)
    if not class or class == "" then return nil, errors.new({ kind = errors.INVALID, message = "class required" }) end
    local kinds, err = all_kinds()
    if err then return nil, err end
    for _, k in ipairs(kinds) do
        if first_class(k.meta.class) == class then return { impl = k.id, meta = k.meta }, nil end
    end
    return nil, errors.new({ kind = errors.INVALID, message = "unknown kind: " .. tostring(class) })
end

-- A component's kind meta, resolved from its impl id (the contract.binding). Every
-- component renders in the tree EXCEPT the generic thread impl, which returns nil so
-- the tree skips it.
function M.kind_by_impl(impl_id)
    if not impl_id or impl_id == "" then return nil end
    if impl_id == GENERIC_THREAD_IMPL then return nil end
    local e = registry.get(impl_id)
    if not e then return nil end
    local meta = meta_of(e)
    local km = {}
    for k, v in pairs(meta) do km[k] = v end
    km.class = first_class(meta.class) or (tostring(impl_id):match(":([%w_%-%.]+)$") or tostring(impl_id))
    local manage = manage_ui(meta)
    km.manage = manage or nil
    km.renderer = manage and manage.view or nil
    return km
end

function M.require_creatable(class)
    local k, err = M.kind_for(class)
    if err then return err end
    if not creatable(k.meta) then
        return errors.new({ message = "kind is not creatable: " .. tostring(class), kind = errors.INVALID })
    end
    -- A kind that declares its own create view bootstraps module-owned state on
    -- create (schema, provisioning). The generic path would mint a bare component
    -- that bypasses that bootstrap, so creation stays with the kind's own surface.
    local ui = create_ui((k :: table).meta)
    if ui and ui.view ~= GENERIC_CREATE_TAG then
        return errors.new({ message = "kind '" .. tostring(class)
            .. "' owns its creation flow; create it through its own create surface", kind = errors.INVALID })
    end
    return nil
end

-- A kind whose meta carries a provision block is pinned: the workspace provisions and
-- owns its instance, so the tree must not move or delete it.
function M.is_pinned(meta)
    return type(meta) == "table" and type(meta.provision) == "table"
end

return M

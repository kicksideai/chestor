-- Generic workspace tree logic over the component service. There is no
-- "workspace.entry" class and no per-type dispatch: an entry is just a component,
-- its KIND is its impl's contract.binding meta (icon/renderer/container), and the
-- tree shows every component, rendered by its kind's renderer. Tree + access are
-- the component system's; each kind cleans itself up through the deletable contract
-- on delete, and a deleted component is reaped through the lifecycle reaper, never a
-- bespoke hook. Adding a kind is a binding declaration, never a change here.

local component = require("component")
local contract = require("contract")
local funcs = require("funcs")
local security = require("security")
local kinds = require("entry_types")
local consts = require("consts")

local M = {}
local ACCESS = consts.ACCESS

-- Normalize the user-supplied parent hint for placement operations.
-- parent_id is a tree placement relation; it is not component ownership and it does
-- not define subscriptions.
local function normalize_parent_placement(parent_id: any): (string?, boolean, error?)
    if parent_id == nil then
        return nil, false, nil
    end

    -- Explicitly clear placement target (move to root) with null/false/empty.
    if parent_id == false or parent_id == "" then
        return nil, true, nil
    end

    if type(parent_id) == "string" then
        return parent_id, true, nil
    end

    return nil, false, errors.new({ kind = errors.INVALID, message = "parent_id must be a string, false, null, or omitted" })
end

local function svc()
    local s, err = component.get_service()
    if err then return nil, errors.wrap(err, consts.ERROR.SERVICE) end
    if not s then return nil, errors.new({ kind = errors.UNAVAILABLE, message = consts.ERROR.SERVICE }) end
    return s
end

local function threads()
    local def, err = contract.get("kickside.core:threads")
    if not def then return nil, err end
    local c, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if not c then return nil, oerr end
    return c
end

local function thread_backed_kind(kind: any): boolean
    local meta = type(kind) == "table" and (kind :: any).meta or nil
    if type(meta) ~= "table" then return false end
    local thread_class = (meta :: any).thread_class
    return type(thread_class) == "string" and thread_class ~= "" and type((meta :: any).projections) == "table"
end

-- A component row + its kind meta -> the entry shape the shell speaks. type is the
-- kind class; renderer/container come from the kind, name/icon from the instance.
local function entry_of(comp, km)
    if not comp then return nil end
    local meta = comp.meta or {}
    return {
        id = comp.component_id or comp.id,
        parent_id = comp.parent_id,
        type = (km and tostring(km.class)) or meta.type or "unknown",
        name = meta.title or "Untitled",
        icon = meta.icon or (km and km.icon),
        renderer = km and type(km.renderer) == "string" and km.renderer ~= "" and km.renderer or nil,
        container = km ~= nil and km.container == true,
        sort_order = comp.position,
        status = meta.status or "active",
        meta = meta,
        access_level = comp.access_level,
        created_at = comp.created_at,
        updated_at = comp.updated_at,
    }
end

function M.get(id)
    local rows, err = component.query({
        component_ids = { id },
        access_mask = ACCESS.READ,
        include = { meta = true, placement = true, access = true },
        limit = 1,
    })
    if err then return nil, err end
    local comp = rows and rows[1]
    if not comp then return nil end
    local km = kinds.kind_by_impl(comp.impl_id)
    return entry_of(comp, km)
end

-- Children of a parent (root when nil). list_children is access-filtered; we
-- additionally keep only workspace-nestable kinds (other modules' root components
-- -- inbox, etc. -- aren't tree kinds and are skipped).
function M.list(parent_id, options)
    local s, err = svc()
    if not s then return nil, err end
    local paged = type(options) == "table"
    options = paged and options or {}
    -- list_children caps each raw component page at 100. Legacy callers retain
    -- the complete workspace-entry array. Paged callers resume at the raw
    -- component position after the final visible entry (the cursor), so skipped
    -- internal rows cannot repeat or omit a workspace entry on the next page.
    local PAGE = 100
    local offset = paged and (tonumber(options.cursor) or 0) or 0
    local limit = paged and tonumber(options.limit) or nil
    if limit and limit < 1 then limit = nil end
    local out = {}
    local resume_offset = offset
    while true do
        local req = { pagination = { limit = PAGE, offset = offset } }
        if parent_id and parent_id ~= "" then req.parent_id = parent_id end
        local result, lerr = s:list_children(req)
        if lerr then return nil, lerr end
        local rows = (result and (result.children or result.components or result.items)) or result or {}
        for index, comp in ipairs(rows) do
            local km = kinds.kind_by_impl(comp.impl_id)
            if km then
                if limit and #out >= limit then
                    return { entries = out, next_cursor = tostring(resume_offset) }
                end
                out[#out + 1] = entry_of(comp, km)
                resume_offset = offset + index
            end
        end
        if #rows < PAGE then break end
        offset = offset + PAGE
    end
    if paged then return { entries = out } end
    return out
end

function M.breadcrumbs(id)
    local trail = {}
    local cursor = id
    local guard = 0
    while cursor and cursor ~= "" and guard < 64 do
        local entry = M.get(cursor)
        if not entry then break end
        table.insert(trail, 1, { id = entry.id, name = entry.name, type = entry.type })
        cursor = entry.parent_id
        guard = guard + 1
    end
    return trail
end

local function register_entry(input, opts)
    input = input or {}
    opts = opts or {}
    local etype = tostring(input.type or "folder")
    local kind, kerr = kinds.kind_for(etype)
    if kerr then return nil, kerr end
    if opts.require_creatable ~= false then
        local cerr = kinds.require_creatable(etype)
        if cerr then return nil, cerr end
    end
    if not input.name or input.name == "" then return nil, errors.new({ kind = errors.INVALID, message = consts.ERROR.NAME_REQUIRED }) end

    local parent_id, _, perr = normalize_parent_placement(input.parent_id)
    if perr then return nil, perr end

    if parent_id then
        local plevel, perr = component.validate_access(parent_id, ACCESS.WRITE)
        if perr then return nil, perr end
        if not plevel or (plevel & ACCESS.WRITE) ~= ACCESS.WRITE then
            return nil, errors.new({ message = "no write access to the destination folder", kind = errors.PERMISSION_DENIED })
        end
    end

    local meta = { title = input.name, icon = input.icon, status = input.status or "active" }
    -- File-like kinds carry a flat pointer to their blob so the renderer previews it.
    if type(input.meta) == "table" then
        for _, k in ipairs({ "upload_id", "content_type", "file_size", "extension", "color" }) do
            if input.meta[k] ~= nil then meta[k] = input.meta[k] end
        end
    end

    if thread_backed_kind(kind) then
        local c, terr = threads()
        if not c then return nil, terr end
        local created, cerr = c:create({
            impl_id = kind.impl,
            thread_class = kind.meta.thread_class,
            parent_id = parent_id,
            title = input.name,
            icon = input.icon,
        })
        if not created then return nil, cerr end
        return M.get(tostring((created :: any).component_id or (created :: any).thread_id))
    end

    local s, serr = svc()
    if not s then return nil, serr end
    local reg, rerr = s:register({
        impl_id = kind.impl,
        parent_id = parent_id,
        meta = meta,
    })
    if rerr then return nil, rerr end
    if not reg or not reg.success or not reg.component_id then
        return nil, errors.new({ kind = reg and (reg :: any).kind or errors.INTERNAL,
            message = "create failed: " .. tostring(reg and (reg :: any).error), details = reg and (reg :: any).details })
    end
    return M.get(tostring(reg.component_id))
end

-- Create = user-facing entry creation. It is limited to workspace-creatable kinds:
-- folders/custom kinds in the "+" picker, not file blobs owned by upload materialization.
function M.create(input)
    return register_entry(input, { require_creatable = true })
end

-- Materialize = trusted component-backed producers filing an already-created resource
-- into the workspace tree. It bypasses only the UI creatability gate; it still requires
-- a declared workspace kind and write access to the destination parent.
function M.materialize(input)
    return register_entry(input, { require_creatable = false })
end

-- True if a component the actor can read already carries this upload_id, i.e. the
-- blob is already filed as a workspace component. Lets the upload stage stay
-- idempotent across pipeline re-runs.
function M.find_by_upload(upload_id)
    if not upload_id or upload_id == "" then return false end
    local ctx = select(1, component.get_context_by_meta({ upload_id = tostring(upload_id) }, ACCESS.READ))
    return ctx ~= nil
end

-- The per-user Uploads container: the actor's provisioned `kickside.uploads` component (the
-- uploads store). Untargeted workspace uploads file under it instead of the tree root.
-- Resolved by CLASS, not a hardcoded uploads-module id, so the workspace stays decoupled
-- from whoever provides kickside.uploads. Returns nil if the actor has none provisioned.
function M.uploads_container_id(): string?
    local k = select(1, kinds.kind_for("kickside.uploads"))
    if not k or not k.impl then return nil end
    local rows = select(1, component.query({
        impl_ids = { k.impl },
        access_mask = ACCESS.WRITE,
        limit = 1,
    }))
    local r = rows and (rows :: { any })[1]
    if not r then return nil end
    return tostring((r :: any).id or (r :: any).component_id)
end

-- Delete every `file` component that points at this upload. Runs when the underlying
-- upload is deleted, so the blob's disappearance can't leave a dangling file entry.
-- Returns the count reaped.
function M.delete_by_upload(upload_id)
    if not upload_id or upload_id == "" then return 0 end
    local rows = select(1, component.query({
        impl_ids = { "chestor.workspace:file" },
        include = { meta = true },
        access_mask = ACCESS.DELETE,
        limit = 1000,
    }))
    local n = 0
    for _, r in ipairs((rows or {}) :: { any }) do
        local m = (r :: any).meta or {}
        if tostring(m.upload_id) == tostring(upload_id) then
            local id = (r :: any).id or (r :: any).component_id
            if id then
                local _, derr = M.delete(tostring(id))
                if not derr then n = n + 1 end
            end
        end
    end
    return n
end

-- Public render meta (title/icon/color/status) is a partial upsert through the
-- component service's set_meta seam -- the generic update path carries only
-- private context commands, so meta written there never persists. An empty
-- icon/color clears the override (delete the key) so the entry falls back to its
-- kind default, matching the picker's reset.
function M.update(id, fields)
    local level, err = component.validate_access(id, ACCESS.WRITE)
    if err then return nil, err end
    if not level or (level & ACCESS.WRITE) ~= ACCESS.WRITE then
        return nil, errors.new({ message = "no write access", kind = errors.PERMISSION_DENIED })
    end
    local set = {}
    local del = {}
    if fields.name ~= nil then set.title = fields.name end
    if fields.status ~= nil then set.status = fields.status end
    for _, k in ipairs({ "icon", "color" }) do
        if fields[k] ~= nil then
            if fields[k] == "" then del[#del + 1] = k else set[k] = fields[k] end
        end
    end
    if next(set) ~= nil or #del > 0 then
        local ok, serr = component.set_meta(id, set, #del > 0 and { delete_keys = del } or nil)
        if not ok then return nil, serr end
    end
    return M.get(id)
end

-- A component is pinned when its kind binding carries a provision block (the
-- workspace owns the instance: inbox/uploads/etc.). pinned move/delete is rejected and
-- the delete cascade skips pinned descendants.
local function is_pinned(comp: any)
    if not comp then return false end
    local km = kinds.kind_by_impl(comp.impl_id)
    return kinds.is_pinned(km)
end

local function pinned_by_id(s, id)
    local comp = s:get({ component_id = id })
    return is_pinned(comp)
end

function M.move(id, new_parent_id, position)
    local level, err = component.validate_access(id, ACCESS.WRITE)
    if err then return nil, err end
    if not level or (level & ACCESS.WRITE) ~= ACCESS.WRITE then
        return nil, errors.new({ message = "no write access", kind = errors.PERMISSION_DENIED })
    end

    local parent_id, has_parent_arg, perr = normalize_parent_placement(new_parent_id)
    if perr then return nil, perr end

    if has_parent_arg and parent_id then
        local plevel, perr = component.validate_access(new_parent_id, ACCESS.WRITE)
        if perr then return nil, perr end
        if not plevel or (plevel & ACCESS.WRITE) ~= ACCESS.WRITE then
            return nil, errors.new({ message = "no write access to the destination folder", kind = errors.PERMISSION_DENIED })
        end
    end
    local s, serr = svc()
    if not s then return nil, serr end
    if pinned_by_id(s, id) then
        return nil, errors.new({ message = "this entry is pinned and cannot be moved", kind = errors.PERMISSION_DENIED })
    end
    -- set_placement derives has_parent_arg from the field's presence, and a nil
    -- table value is absent; false is its documented move-to-root marker.
    local req = { component_id = id, parent_id = parent_id }
    if has_parent_arg and parent_id == nil then req.parent_id = false end
    if position then req.position = position end
    local placed, merr = s:set_placement(req)
    if merr then return nil, merr end
    if not placed or placed.success ~= true then
        return nil, errors.new({ kind = placed and (placed :: any).kind or errors.INTERNAL,
            message = tostring(placed and placed.error or "Component placement returns no result."), details = placed and (placed :: any).details })
    end
    return M.get(id)
end

function M.reorder(id, position)
    local s, serr = svc()
    if not s then return nil, serr end
    local placed, err = s:set_placement({ component_id = id, position = position })
    if err then return nil, err end
    if not placed or placed.success ~= true then
        return nil, errors.new({ kind = placed and (placed :: any).kind or errors.INTERNAL,
            message = tostring(placed and placed.error or "Component placement returns no result."), details = placed and (placed :: any).details })
    end
    return M.get(id)
end

-- Delete the entry and its subtree, deepest-first. Each component's own deletable
-- contract runs during svc:delete -- that is where a kind tears down its storage
-- (a schema drops its thread). A pinned entry (its kind carries provision) is rejected
-- as the target or as a descendant before any delete starts. The workspace stays
-- type-agnostic.
function M.delete(id)
    local level, err = component.validate_access(id, ACCESS.DELETE)
    if err then return nil, err end
    if not level or (level & ACCESS.DELETE) ~= ACCESS.DELETE then
        return nil, errors.new({ message = "no delete access", kind = errors.PERMISSION_DENIED })
    end
    local s, serr = svc()
    if not s then return nil, serr end
    if pinned_by_id(s, id) then
        return nil, errors.new({ message = "this entry is pinned and cannot be deleted", kind = errors.PERMISSION_DENIED })
    end

    local order = {}
    local function walk(node_id): any?
        local children, lerr = M.list(node_id)
        if lerr then return lerr end
        for _, k in ipairs(children or {}) do
            local child, gerr = s:get({ component_id = k.id })
            if gerr then return gerr end
            if not child then
                return errors.new({ kind = errors.NOT_FOUND, message = "failed to inspect child " .. tostring(k.id) .. ": not found" })
            end
            if is_pinned(child) then
                return errors.new({ message = "cannot delete subtree because pinned entry '" .. tostring(k.name or k.id) .. "' is inside it",
                    kind = errors.PERMISSION_DENIED })
            end
            local werr = walk(k.id)
            if werr then return werr end
        end
        order[#order + 1] = node_id
        return nil
    end
    local walk_err = walk(id)
    if walk_err then return nil, walk_err end
    local pending: any = nil
    for _, cur in ipairs(order) do
        local res, derr = s:delete({ component_id = cur })
        -- The component row is unregistered even when a kind's deletable cleanup
        -- soft-fails (teardown of a minimally-configured component is idempotent), so a
        -- result that removed the row is a successful delete; only a transport error or a
        -- row that survived is a real failure.
        if derr then return nil, derr end
        if not res then
            return nil, errors.new({ kind = errors.INTERNAL, message = "delete failed for " .. tostring(cur) .. ": no result" })
        end
        if not res.success and not (res :: any).deleted then
            return nil, errors.new({ kind = (res :: any).kind or errors.INTERNAL,
                message = "delete failed for " .. tostring(cur) .. ": " .. tostring((res :: any).error or "no result"),
                details = (res :: any).details })
        end
        -- Bounded thread cleanup continues durably after the component is released;
        -- the first pending outcome reports the accepted progress.
        if (res :: any).in_progress == true and not pending then pending = res end
    end
    if not pending then return { id = id, deleted = true, in_progress = false } end
    return {
        id = id,
        deleted = true,
        in_progress = true,
        status = pending.status,
        cleanup_pending = pending.cleanup_pending,
        kind = pending.kind,
        retryable = pending.retryable,
        details = pending.details,
    }
end

function M.grant_access(id, subject, access_mask)
    local level, err = component.validate_access(id, ACCESS.ADMIN)
    if err then return nil, err end
    if not level or (level & ACCESS.ADMIN) ~= ACCESS.ADMIN then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "admin access required to share" })
    end
    local s, serr = svc()
    if not s then return nil, serr end
    local res, e = s:grant_subtree({ root_component_id = id, subject = subject, access_mask = access_mask or ACCESS.READ })
    if e then return nil, e end
    if not (res and res.success) then
        return nil, errors.new({ kind = res and (res :: any).kind or errors.INTERNAL,
            message = "grant failed: " .. tostring(res and (res :: any).error), details = res and (res :: any).details })
    end
    return { id = id, granted = true }
end

function M.revoke_access(id, subject)
    local level, err = component.validate_access(id, ACCESS.ADMIN)
    if err then return nil, err end
    if not level or (level & ACCESS.ADMIN) ~= ACCESS.ADMIN then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "admin access required to share" })
    end
    local s, serr = svc()
    if not s then return nil, serr end
    local res, e = s:revoke_subtree({ root_component_id = id, subject = subject })
    if e then return nil, e end
    if not (res and res.success) then
        return nil, errors.new({ kind = res and (res :: any).kind or errors.INTERNAL,
            message = "revoke failed: " .. tostring(res and (res :: any).error), details = res and (res :: any).details })
    end
    return { id = id, revoked = true }
end

-- Agent-facing markdown: delegate to the kind's declared read formatter, else a
-- generic summary.
function M.read(id)
    local entry = M.get(id)
    if not entry then return nil, errors.new({ kind = errors.NOT_FOUND, message = consts.ERROR.NOT_FOUND }) end
    local kind = select(1, kinds.kind_for(entry.type))
    local read_fn = kind and kind.meta and kind.meta.read
    if type(read_fn) == "string" and read_fn ~= "" then
        local result, err = funcs.new():call(read_fn, { entry = entry })
        if err then return nil, err end
        return result
    end
    return { success = true, type = entry.type, text = "# " .. entry.name .. "\nType: " .. entry.type }
end

return M

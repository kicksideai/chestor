-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

-- Universal upload-pipeline stage, dropped into kickside.uploads declaratively (see the
-- upload.stage registry entry). It runs as the uploading user on every completed upload.
-- When the upload was directed at the workspace (metadata.target_parent_id is present), it
-- materializes the blob as a chestor.workspace:file COMPONENT -- there is no entries
-- table, the component IS the file. Uploads with no workspace target (KB sources, agent
-- attachments) pass through untouched.
--
-- Two placements keep the tree clean:
--   * A target of "" (a root workspace upload) files under the actor's provisioned Uploads
--     component (the `uploads` store), not the tree root -- so direct uploads never pollute
--     root, and the upload tree lives under the same component that already tracks them.
--   * A zip member carries its in-archive path (metadata.archive_path); the stage recreates
--     that directory hierarchy as folder components and files the member under the deepest
--     one, so an unpacked archive renders as a canonical nested folder/file subtree.
-- Every node it makes is an ordinary component (folders + files), so the workspace renders,
-- moves, shares, and cascade-deletes the result like anything else.

local handlers = require("handlers")

local M = {}

-- Resolve the current folder title and placement; folder identity survives edits.
local function ensure_folder(parent_id, name)
    local children, list_err = handlers.list(parent_id)
    if not children then return nil, list_err end
    for _, child in ipairs(children) do
        if child.type == "folder" and child.name == name then return child.id end
    end
    local f, err = handlers.materialize({ type = "folder", name = name, parent_id = parent_id })
    if not f then return nil, err end
    return f.id
end

-- Walk `segments` from parent_id, ensuring a folder per segment; returns the deepest id.
local function ensure_path(parent_id, segments, resolved)
    local pid = parent_id
    for _, seg in ipairs(segments) do
        local key = pid .. "/" .. seg
        local id = resolved and resolved[key]
        if not id then
            local err
            id, err = ensure_folder(pid, seg)
            if not id then return nil, err end
            if resolved then resolved[key] = id end
        end
        pid = id
    end
    return pid
end

-- Split "a/b/c.txt" into ({ "a", "b" }, "c.txt"). Empty segments (leading/trailing/double
-- slashes) are dropped by the pattern.
local function split_archive_path(p): ({ string }, string?)
    local segs: { string } = {}
    for seg in tostring(p):gmatch("[^/]+") do segs[#segs + 1] = seg end
    local name = table.remove(segs)
    return segs, name
end

-- The grouping folder name for an archive: its filename with a trailing archive extension
-- stripped ("project.zip" -> "project").
local ARCHIVE_EXT = { zip = true, tar = true, gz = true, tgz = true, rar = true, ["7z"] = true }
local function archive_folder_name(name)
    local base, ext = tostring(name):match("^(.-)%.([%w]+)$")
    if base and base ~= "" and ext and ARCHIVE_EXT[ext:lower()] then return base end
    return tostring(name)
end

local function target_parent(target)
    if type(target) == "string" and target ~= "" then return target end
    local id = handlers.uploads_container_id()
    if not id then return nil, "uploads container unavailable" end
    return id
end

-- The archive owner calls this stage with its manifest before admitting members.
local function prepare_archive(meta, paths)
    local members = {}
    if #paths == 0 then return { success = true, members = members } end
    local parent_id, parent_err = target_parent(meta.target_parent_id)
    if not parent_id then return nil, parent_err end
    local folder_id = meta.archive_folder_id
    if type(folder_id) ~= "string" or folder_id == "" then
        local name = meta.archive_root or meta.filename
        if type(name) == "string" and name ~= "" then
            local err
            folder_id, err = ensure_folder(parent_id, archive_folder_name(name))
            if not folder_id then return nil, err end
        else
            folder_id = parent_id
        end
    end
    local resolved = {}
    for _, path in ipairs(paths) do
        local dirs = split_archive_path(path)
        local deep, err = ensure_path(folder_id, dirs, resolved)
        if not deep then return nil, err end
        members[path] = { archive_folder_id = folder_id, archive_parent_id = deep }
    end
    return { success = true, members = members }
end

function M.process(params)
    params = type(params) == "table" and params or {}
    local meta = type(params.metadata) == "table" and params.metadata or {}

    -- Transfer bundles are consumed by kickside.transfer before workspace filing. The
    -- imported components get placed by the transfer orchestrator, so no file entry is
    -- created for the envelope upload.
    if meta.transfer_imported == true then
        return { success = true, skipped = "transfer_imported" }
    end

    -- Absent target = not a workspace upload: pass through.
    local target = meta.target_parent_id
    if target == nil then return { success = true } end
    if type(params.archive_members) == "table" then
        return prepare_archive(meta, params.archive_members)
    end

    -- An archive container (zip) is unpacked by the archive stage into its members, each
    -- re-uploaded with an archive_path and filed below as a nested folder/file subtree; the
    -- container itself yields no workspace file. A member inherits the container's
    -- `archive` flag, so identify the CONTAINER as archive=true WITHOUT an archive_path of
    -- its own, and skip only that.
    local has_archive_path = type(meta.archive_path) == "string" and meta.archive_path ~= ""
    if meta.archive == true and not has_archive_path then
        return { success = true, skipped = "archive_container" }
    end

    local upload_id = tostring(params.upload_id or "")
    if upload_id == "" then return nil, "upload_id required" end

    -- Idempotent: a re-run of the stage finds the file already filed and skips.
    if handlers.find_by_upload(upload_id) then return { success = true, skipped = "exists" } end

    -- Destination parent: an explicit folder id files there; a root upload ("") files under
    -- the actor's provisioned Uploads component so root stays clean.
    local parent_id, parent_err = target_parent(target)
    if not parent_id then return nil, parent_err end

    -- A zip member is filed under a folder named after the source archive, then its in-zip
    -- directory chain: Uploads/<archive>/a/b/c.txt. Non-archive uploads (no archive_path)
    -- skip this and file directly under the parent.
    local filename = tostring(meta.filename or "Uploaded file")
    local archive_path = meta.archive_path
    if type(archive_path) == "string" and archive_path ~= "" then
        local dirs, base = split_archive_path(archive_path)
        if type(meta.archive_parent_id) == "string" and meta.archive_parent_id ~= "" then
            parent_id = meta.archive_parent_id
            dirs = {}
        end
        local archive_root = meta.archive_root
        if not meta.archive_parent_id and type(archive_root) == "string" and archive_root ~= "" then
            table.insert(dirs, 1, archive_folder_name(archive_root))
        end
        if #dirs > 0 then
            local deep, derr = ensure_path(parent_id, dirs)
            if not deep then return nil, derr end
            parent_id = deep
        end
        if base and base ~= "" then filename = base end
    end

    local ext = filename:match("%.([%w]+)$")
    local entry, err = handlers.materialize({
        type = "file",
        name = filename,
        parent_id = parent_id,
        meta = {
            upload_id = upload_id,
            content_type = tostring(params.mime_type or ""),
            file_size = tonumber(params.size) or 0,
            extension = ext,
        },
    })
    if err or not entry then return nil, "create file entry failed: " .. tostring(err) end
    return { success = true, entry_id = entry.id }
end

return M

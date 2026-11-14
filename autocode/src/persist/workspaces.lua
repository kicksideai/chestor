-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
type Workspace = {component_id: string, host_path: string, provenance: {[string]: unknown}}
local function admitted(id: string): (Workspace?, error?)
    local found: Workspace? = nil
    local err = database.transaction({}, function(tx, engine)
        local lock_err = database.lock_workspaces(tx, engine)
        if lock_err then return lock_err end
        local rows, read_err = tx:query("SELECT component_id, host_path, provenance FROM chestor_autocode_workspaces WHERE component_id = $1", {id})
        local decode_err: error? = nil
        found, decode_err = database.first(rows, read_err, function(row: database.Columns): Workspace
            return {component_id = database.text(row, "component_id"), host_path = database.text(row, "host_path"), provenance = database.object(row, "provenance")}
        end)
        return decode_err
    end)
    return found, err
end
local function check(rows: {{[string]: unknown}}, path: string, except_id: string?): error?
    local conflicts: {{id: string, host_path: string}} = {}
    for _, row in ipairs(rows) do
        local other = row.host_path :: string
        if row.component_id ~= except_id and
            (path == other or path == "/" or other == "/" or path:sub(1, #other + 1) == other .. "/" or other:sub(1, #path + 1) == path .. "/") then
            conflicts[#conflicts + 1] = {id = row.component_id :: string, host_path = other}
        end
    end
    if #conflicts > 0 then return errors.new({kind = errors.INVALID, message = "workspace paths must not overlap any other workspace",
        details = {code = "autocode.invalid_workspace", conflicts = conflicts}}) end
    return nil
end
local function paths(): ({string}?, error?)
    local rows, err = database.query("SELECT host_path FROM chestor_autocode_workspaces", {})
    if not rows then return nil, err end
    local result: {string} = {}
    for _, row in ipairs(rows) do result[#result + 1] = row.host_path :: string end
    return result, nil
end
local function overlap(path: string, except_id: string?): error?
    local rows, err = database.query("SELECT component_id, host_path FROM chestor_autocode_workspaces", {})
    if not rows then return err end
    return check(rows, path, except_id)
end
local function approve(id: string, path: string, provenance: {[string]: unknown}?): error?
    local encoded, encode_err = database.encode_object(provenance or {}, "workspace provenance")
    if not encoded then return encode_err end
    return database.transaction({}, function(tx, engine)
        local lock_err = database.lock_workspaces(tx, engine)
        if lock_err then return lock_err end
        local rows, read_err = tx:query("SELECT component_id, host_path FROM chestor_autocode_workspaces", {})
        if not rows then return read_err end
        local overlap_err = check(rows :: {{[string]: unknown}}, path, nil)
        if overlap_err then return overlap_err end
        local _, write_err = tx:execute("INSERT INTO chestor_autocode_workspaces (component_id, host_path, provenance) VALUES ($1, $2, $3)", {id, path, encoded})
        if write_err then return write_err end
        return nil
    end)
end
local function remove(id: string): error?
    return database.transaction({}, function(tx, engine)
        local lock_err = database.lock_workspaces(tx, engine)
        if lock_err then return lock_err end
        local rows, read_err = tx:query("SELECT id FROM chestor_autocode_runs WHERE workspace_id = $1 AND status IN ('queued', 'running') LIMIT 1", {id})
        if not rows then return read_err end
        if #rows > 0 then return errors.new({kind = errors.CONFLICT, message = "workspace is retained by active runs; settle runs before deleting the workspace"}) end
        local _, err = tx:execute("DELETE FROM chestor_autocode_workspaces WHERE component_id = $1", {id})
        return err
    end)
end
return {workspace_paths = paths, workspace_conflict = check, admitted_workspace = admitted, workspace_overlap = overlap, approve_workspace = approve, delete_workspace = remove}

-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local workspaces = require("workspaces")
local approvals = require("approvals")
local contract = require("contract")
local security = require("security")
local component = require("component")
local execution_identity = require("execution_identity")
type LegacyWorkspace = {component_id: string, host_path: string}
type Subject = {active: boolean, groups: {string}}
type Directory = {
    groups: (self: Directory, {id: string}) -> (Subject?, error?),
    search: (self: Directory, {kinds: {string}, limit: integer, cursor: string?}) -> ({principals: {{id: string}}, has_more: boolean, cursor: string?}?, error?)
}
local function subject(directory: Directory, id: string): Subject
    local value, err = directory:groups({id = id})
    if not value then error(err) end
    return value
end
local function manages(id: string, value: Subject): boolean
    if not value.active or #value.groups == 0 then return false end
    local scope, scope_err = execution_identity.scope_from_groups(value.groups)
    if not scope then error(scope_err) end
    local actor, actor_err = security.new_actor(id, {user_id = id, security_groups = value.groups})
    if not actor then error(actor_err) end
    return scope:evaluate(actor, "access", "chestor.autocode.api:workspaces_create.endpoint") == "allow"
end
local function group_manages(directory: Directory, group: string): boolean
    local cursor: string? = nil
    while true do
        local page, err = directory:search({kinds = {"user"}, limit = 100, cursor = cursor})
        if not page then error(err) end
        for _, principal in ipairs(page.principals) do
            local value = subject(directory, principal.id)
            for _, membership in ipairs(value.groups) do
                if membership == group and not manages(principal.id, value) then return false end
            end
        end
        if not page.has_more then return true end
        cursor = page.cursor
    end
end
local function trusted_writers(directory: Directory, id: string): boolean
    -- Workspace kinds are fixed at root; their effective grants are direct grants.
    local grants, err = component.list_grants_system(id)
    if not grants then error(err) end
    local writers = false
    for _, grant in ipairs(grants) do
        local mask = grant.access_mask
        if mask % 4 >= 2 or math.floor(mask / 8) % 2 == 1 then
            writers = true
            if grant.subject_type == "user" then
                if not manages(grant.subject_id, subject(directory, grant.subject_id)) then return false end
            elseif grant.subject_type == "group" then
                if not group_manages(directory, grant.subject_id) then return false end
            else return false end
        end
    end
    return writers
end
local function existing(): {LegacyWorkspace}
    local approved: {LegacyWorkspace} = {}
    local definition, definition_err = contract.get("kickside.contract:directory")
    if not definition then error(definition_err) end
    local opened, open_err = definition:open()
    if not opened then error(open_err) end
    local directory = opened :: Directory
    local offset = 0
    while true do
        local rows, read_err = component.list_system({impl_ids = {"chestor.autocode.components:workspace"},
            include = {private_context = true}, order_by = {field = "created_at", direction = "ASC"}, limit = 200, offset = offset})
        if not rows then error(read_err) end
        for _, row in ipairs(rows) do
            local reason = "A current WRITE or ADMIN holder lacks workspace-management authority; re-register this workspace through Autocode."
            if trusted_writers(directory, row.component_id) then
                local context = row.private_context
                local path = type(context) == "table" and context.host_path or nil
                reason = "The legacy workspace path is malformed; re-register this workspace through Autocode."
                if type(path) == "string" and #path > 0 and #path <= 1000 then
                    if #path > 1 then path = path:gsub("/+$", "") end
                    reason = "The legacy workspace path overlaps another workspace; re-register it with a non-overlapping path through Autocode."
                    if not approvals.workspace_conflict(approved, path, nil) then
                        local allowed, problem, path_err = workspaces.admit(path)
                        if path_err and not errors.is(path_err, errors.INVALID) then error(path_err) end
                        reason = problem or tostring(path_err)
                        if allowed then
                            approved[#approved + 1] = {component_id = row.component_id, host_path = path}
                            reason = ""
                        end
                    end
                end
            end
            local _, write_err = component.set_runtime_meta(row.component_id, {unavailable_reason = reason})
            if write_err then error(write_err) end
        end
        if #rows < 200 then return approved end
        offset = offset + #rows
    end
end
local function apply(db: sql.DB, approved: {LegacyWorkspace})
    local _, err = db:execute([[CREATE TABLE chestor_autocode_workspaces (
        component_id TEXT PRIMARY KEY, host_path TEXT NOT NULL
    )]])
    if err then error(err) end
    for _, row in ipairs(approved) do
        local _, write_err = db:execute("INSERT INTO chestor_autocode_workspaces (component_id, host_path) VALUES ($1, $2)",
            {row.component_id, row.host_path})
        if write_err then error(write_err) end
    end
end
local framework = require("migration")
return function(options)
    -- Platform reads use their own connections; resolve before the migration transaction.
    local approved = existing()
    return framework.run(function()
        migration("Record workspace admission for only live workspace managers holding WRITE or ADMIN", function()
            database("postgres", function() up(function(db) apply(db, approved) end) end)
            database("sqlite", function() up(function(db) apply(db, approved) end) end)
        end)
    end, options)
end

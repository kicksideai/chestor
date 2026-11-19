-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local execution_identity = require("execution_identity")
local security = require("security")
local uuid = require("uuid")

local PAGE_SIZE = 100

local function run(input: any): (any?, error?)
    local actor = security.actor()
    if not actor or not execution_identity.is_maintenance_key(actor:id()) then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "upload owner cleanup requires a lifecycle actor"})
    end
    local upload_id = type(input) == "table" and input.upload_id
    local owner_id = type(input) == "table" and input.owner_id
    if type(upload_id) ~= "string" or not uuid.validate(upload_id)
        or type(owner_id) ~= "string" or owner_id == "" then
        return nil, errors.new({kind = errors.INVALID, message = "upload id and owner id are required"})
    end

    local after: string? = nil
    while true do
        local rows, read_err = component.list_system({
            impl_ids = {"chestor.workspace:file"},
            -- Start with the indexed upload ID. An owner metadata filter would
            -- collect every file of this owner for each upload being erased.
            meta = {upload_id = upload_id},
            include = {meta = true},
            order_by = {field = "component_id", direction = "ASC"},
            after_component_id = after,
            limit = PAGE_SIZE,
        })
        if read_err then return nil, read_err end
        if not rows then
            return nil, errors.new({kind = errors.INTERNAL, message = "Workspace file scan returned no rows"})
        end
        for _, row in ipairs(rows) do
            local id = row.component_id
            if row.meta and row.meta.owner == owner_id then
                local deleted, delete_err = component.system_delete(id, "reparent_root")
                if not deleted then
                    local details = delete_err and delete_err:details()
                    if not details or details.cleanup_pending ~= true or details.wait_for ~= "deletion_job" then
                        return nil, delete_err or errors.new({kind = errors.INTERNAL, message = "Workspace file deletion was not accepted"})
                    end
                end
            end
            after = id
        end
        if #rows < PAGE_SIZE then return {success = true} end
    end
end

return {run = run}

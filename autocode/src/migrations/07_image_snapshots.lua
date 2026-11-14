-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local component = require("component")
local builds = require("builds")
local image_state = require("image_state")
local framework = require("migration")
return function(options: {database_id: string, direction: string?, force: boolean?, id: string?})
    local db, db_err = sql.get(options.database_id)
    if not db then error(db_err) end
    local snapshots, offset = {}, 0
    while true do
        local images, read_err = component.list_system({impl_ids = {"chestor.autocode.components:image"},
            include = {meta = true}, limit = 200, offset = offset, order_by = {field = "created_at", direction = "ASC"}})
        if not images then db:release(); error(read_err) end
        for _, image in ipairs(images) do
            if image.meta and image.meta.usable ~= nil then goto complete end
            local rows, query_err = db:query("SELECT * FROM chestor_autocode_image_builds WHERE image_id = $1", {image.component_id})
            if not rows then db:release(); error(query_err) end
            local build = nil
            if rows[1] then
                local columns = {row = rows[1]}
                build = builds.decode_build(columns)
                if columns.problem then db:release(); error(columns.problem) end
            end
            snapshots[#snapshots + 1] = {id = image.component_id, fields = image_state.fields(build)}
            ::complete::
        end
        if #images < 200 then break end
        offset = offset + #images
    end
    db:release()
    -- Component owns its transaction; finish its idempotent backfill before the tracking transaction.
    for _, snapshot in ipairs(snapshots) do
        local _, err = component.set_runtime_meta(snapshot.id, snapshot.fields)
        if err then error(err) end
    end
    return framework.run(function()
        migration("Publish complete image render snapshots for existing components", function()
            database("sqlite", function() up(function() end) end)
            database("postgres", function() up(function() end) end)
        end)
    end, options)
end

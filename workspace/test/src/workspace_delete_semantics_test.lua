local deletion_worker = require("deletion_worker")
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")
local contract = require("contract")
local sql = require("sql")

local PROBE = "app:workspace_probe"
local DB = "app:db"
local THREADS = "kickside.core:threads"
local DELETE_TOOL = "chestor.workspace.traits:delete_entry_tool"

local function uuid(): string
    local id, err = crypto.random.uuid()
    test.is_nil(err)
    return id
end

local function executor(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "workspace_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    return funcs.new():with_actor(actor):with_scope(scope)
end

local function call_probe(user_id: string, op: string, input: any): any
    local result, err = executor(user_id):call(PROBE, { op = op, input = input })
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function count_rows(table_name: string, component_id: string): integer
    local d, err = sql.get(DB)
    if err then error(tostring(err)) end
    local rows, qerr = sql.builder.select("COUNT(*) AS n")
        :from(table_name)
        :where("component_id = ?", component_id)
        :run_with(d):query()
    d:release()
    if qerr then error(tostring(qerr)) end
    return (tonumber(rows and rows[1] and (rows[1] :: any).n) or 0) :: integer
end

local function assert_component_exists(component_id: string)
    test.eq(count_rows("kickside_components", component_id), 1)
    test.is_true(count_rows("kickside_component_access", component_id) > 0)
end

local function assert_component_purged(component_id: string)
    test.eq(count_rows("kickside_components", component_id), 0)
    test.eq(count_rows("kickside_component_meta", component_id), 0)
    test.eq(count_rows("kickside_component_access", component_id), 0)
end

local function create_entry(user_id: string, typ: string, name: string, parent_id: string?): any
    local res = call_probe(user_id, "create", {
        type = typ,
        name = name,
        parent_id = parent_id,
    })
    test.is_true(res.ok, tostring(res.err))
    test.not_nil(res.entry.id)
    return res.entry :: { [string]: any }
end

local function materialize_file(user_id: string, name: string, parent_id: string?, upload_id: string): any
    local res = call_probe(user_id, "materialize", {
        type = "file",
        name = name,
        parent_id = parent_id,
        meta = {
            upload_id = upload_id,
            content_type = "text/plain",
            file_size = 10,
            extension = "txt",
        },
    })
    test.is_true(res.ok, tostring(res.err))
    test.not_nil(res.entry.id)
    return res.entry :: { [string]: any }
end

local function threads(user_id: string): any
    local actor: any = security.new_actor(user_id, { security_groups = { "workspace_test" } })
    local scope: any = security.named_scope("wippy.security:process")
    local svc, cerr = contract.get(THREADS)
    test.is_nil(cerr)
    test.not_nil(svc)
    local inst, oerr = svc:with_actor(actor):with_scope(scope):open()
    test.is_nil(oerr)
    test.not_nil(inst)
    return inst
end

local function define_tests()
    test.describe("workspace delete semantics", function()
        test.it("reports absent, private and deleted entries as missing", function()
            local owner = "workspace-owner-" .. uuid()
            local other = "workspace-other-" .. uuid()
            local entry = create_entry(owner, "folder", "Private", nil)
            local visible = call_probe(owner, "get", { id = entry.id })
            test.is_true(visible.ok)
            test.eq(visible.entry.id, entry.id)
            for _, id in ipairs({ uuid(), tostring(entry.id) }) do
                local missing = call_probe(other, "get", { id = id })
                test.is_false(missing.ok)
                test.is_nil(missing.entry)
            end
            local deleted = call_probe(owner, "delete", { id = entry.id })
            test.is_true(deleted.ok, tostring(deleted.err))
            local final, worker_err = deletion_worker.run(tostring(entry.id))
            test.is_nil(worker_err, tostring(worker_err))
            test.is_true(final.deleted)
            local missing = call_probe(owner, "get", { id = entry.id })
            test.is_false(missing.ok)
            test.is_nil(missing.entry)
        end)

        test.it("creates thread-backed workspace kinds through their primary thread declaration", function()
            local user_id = "workspace-threaded-" .. uuid()
            local entry = create_entry(user_id, "thread_backed_test", "Threaded", nil)
            local entry_id = tostring(entry.id)
            local c = threads(user_id)

            local thread, ferr = c:find({ thread_id = entry_id })
            test.is_nil(ferr)
            test.not_nil(thread)
            test.eq((thread :: any).thread_class, "workspace.thread_backed_test")

            local projections, perr = c:list_projections({ thread_id = entry_id, limit = 10 })
            test.is_nil(perr)
            test.not_nil(projections)
            local rows = (projections :: any).projections or {}
            test.eq(#rows, 1)
            test.eq((rows[1] :: any).kind, "workspace.thread_backed_test.state")
        end)

        test.it("reports a thread-backed delete with bounded cleanup still pending as in progress", function()
            local user_id = "workspace-large-" .. uuid()
            local entry = create_entry(user_id, "thread_backed_test", "Large", nil)
            local entry_id = tostring(entry.id)
            local d, err = sql.get(DB)
            test.is_nil(err)
            for i = 1, 305 do
                local _, insert_err = d:execute("INSERT INTO kickside_projection"
                    .. " (id,thread_id,kind,projection_key,body,state,last_event_seq,created_at,updated_at)"
                    .. " VALUES ($1,$2,$3,'default','{}','valid',0,$4,$4)",
                    { uuid(), entry_id, "large-" .. tostring(i), "2026-01-01T00:00:00Z" })
                test.is_nil(insert_err, tostring(insert_err))
            end
            d:release()

            local del = call_probe(user_id, "delete", { id = entry_id })
            test.is_true(del.ok, tostring(del.err))
            test.is_false(del.entry.deleted)
            test.is_true(del.entry.in_progress)
            test.eq(del.entry.status, "in_progress")
            test.is_true(del.entry.cleanup_pending)
            test.not_nil(del.entry.job_id)
            test.eq(count_rows("kickside_components", entry_id), 1)
            local final
            for _ = 1, 8 do
                local worker_err
                final, worker_err = deletion_worker.run(entry_id)
                test.is_nil(worker_err, tostring(worker_err))
                if final.deleted then break end
            end
            test.is_true(final.deleted)
            assert_component_purged(entry_id)
            local missing = call_probe(user_id, "get", { id = entry_id })
            test.is_false(missing.ok)
        end)

        test.it("deletes a folder subtree children-first and purges component rows", function()
            local user_id = "workspace-delete-" .. uuid()
            local root = create_entry(user_id, "folder", "Root", nil)
            local root_id = tostring(root.id)
            local child_file = materialize_file(user_id, "one.txt", root_id, "upload-" .. uuid())
            local nested = create_entry(user_id, "folder", "Nested", root_id)
            local nested_id = tostring(nested.id)
            local nested_file = materialize_file(user_id, "two.txt", nested_id, "upload-" .. uuid())

            local del = call_probe(user_id, "delete", { id = root_id })
            test.is_true(del.ok, tostring(del.err))
            test.is_false(del.entry.deleted)
            test.is_true(del.entry.in_progress)
            test.not_nil(del.entry.job_id)
            local d = assert(sql.get(DB))
            local jobs = assert(d:query("SELECT owner_id FROM kickside_job WHERE id=$1", {del.entry.job_id}))
            assert(d:release())
            test.eq(jobs[1].owner_id, root_id)
            for _, id in ipairs({ tostring(child_file.id), tostring(nested_file.id), nested_id, root_id }) do
                local final, worker_err = deletion_worker.run(id)
                test.is_nil(worker_err, tostring(worker_err))
                test.is_true(final.deleted)
            end

            assert_component_purged(root_id)
            assert_component_purged(tostring(child_file.id))
            assert_component_purged(nested_id)
            assert_component_purged(tostring(nested_file.id))
        end)

        test.it("DeleteWorkspaceEntry answers the deletion receipt that tracks its job", function()
            local user_id = "workspace-delete-tool-" .. uuid()
            local entry = create_entry(user_id, "folder", "Tool deleted", nil)
            local entry_id = tostring(entry.id)

            local receipt, err = executor(user_id):call(DELETE_TOOL, { id = entry_id })
            test.is_nil(err)
            test.not_nil(receipt)
            test.is_true(receipt.success)
            test.is_false(receipt.deleted)
            test.is_true(receipt.in_progress)
            test.eq(receipt.status, "in_progress")
            test.is_true(receipt.cleanup_pending)
            test.not_nil(receipt.job_id)
            local d = assert(sql.get(DB))
            local jobs = assert(d:query("SELECT owner_id FROM kickside_job WHERE id=$1", { receipt.job_id }))
            assert(d:release())
            test.eq(jobs[1].owner_id, entry_id)

            local final, worker_err = deletion_worker.run(entry_id)
            test.is_nil(worker_err, tostring(worker_err))
            test.is_true(final.deleted)
            assert_component_purged(entry_id)
        end)

        test.it("lists and reads an accepted deletion with the job that tracks it", function()
            local user_id = "workspace-delete-state-" .. uuid()
            local parent = create_entry(user_id, "folder", "Parent", nil)
            local parent_id = tostring(parent.id)
            local entry = create_entry(user_id, "folder", "Deleting", parent_id)
            local entry_id = tostring(entry.id)

            local del = call_probe(user_id, "delete", { id = entry_id })
            test.is_true(del.ok, tostring(del.err))
            test.is_true(del.entry.in_progress)
            test.not_nil(del.entry.job_id)

            local listed = call_probe(user_id, "list", { parent_id = parent_id })
            test.is_true(listed.ok, tostring(listed.err))
            test.eq(#listed.entries, 1)
            local row = listed.entries[1]
            test.eq(row.id, entry_id)
            test.not_nil(row.deleting_at)
            test.eq(row.deletion_job_id, del.entry.job_id)
            test.not_nil(row.deletion_job)
            test.eq(row.deletion_job.status, "pending")
            test.eq(row.deletion_job.attempts, 0)

            local read = call_probe(user_id, "get", { id = entry_id })
            test.is_true(read.ok, tostring(read.err))
            test.eq(read.entry.deleting_at, row.deleting_at)
            test.eq(read.entry.deletion_job_id, del.entry.job_id)

            local final, worker_err = deletion_worker.run(entry_id)
            test.is_nil(worker_err, tostring(worker_err))
            test.is_true(final.deleted)
            local remaining = call_probe(user_id, "list", { parent_id = parent_id })
            test.is_true(remaining.ok, tostring(remaining.err))
            test.eq(#remaining.entries, 0)
        end)

        test.it("refuses pinned move and delete with a typed permission denial", function()
            local user_id = "workspace-pinned-root-" .. uuid()
            local entry = create_entry(user_id, "pinned_test_folder", "Pinned", nil)
            local parent = create_entry(user_id, "folder", "Destination", nil)
            local moved = call_probe(user_id, "move", { id = entry.id, parent_id = parent.id })
            test.is_false(moved.ok)
            test.is_true(moved.denied)
            local deleted = call_probe(user_id, "delete", { id = entry.id })
            test.is_false(deleted.ok)
            test.is_true(deleted.denied)
            local current = call_probe(user_id, "get", { id = entry.id })
            test.is_true(current.ok)
            test.is_nil(current.entry.parent_id)
            assert_component_exists(tostring(entry.id))
        end)

        test.it("refuses a subtree with a pinned descendant before deleting anything", function()
            local user_id = "workspace-pinned-" .. uuid()
            local root = create_entry(user_id, "folder", "Root", nil)
            local root_id = tostring(root.id)
            local normal = materialize_file(user_id, "normal.txt", root_id, "upload-" .. uuid())
            local pinned = create_entry(user_id, "pinned_test_folder", "Pinned Child", root_id)

            local del = call_probe(user_id, "delete", { id = root_id })
            test.is_false(del.ok)
            test.is_true(del.denied)
            test.contains(tostring(del.err), "Pinned Child")

            assert_component_exists(root_id)
            assert_component_exists(tostring(normal.id))
            assert_component_exists(tostring(pinned.id))
        end)

        test.it("deleting a file entry removes only the workspace pointer", function()
            local user_id = "workspace-file-" .. uuid()
            local upload_id = "upload-" .. uuid()
            local file = materialize_file(user_id, "linked.txt", nil, upload_id)

            local before = call_probe(user_id, "find_by_upload", { upload_id = upload_id })
            test.is_true(before.found)

            local file_id = tostring(file.id)
            local del = call_probe(user_id, "delete", { id = file_id })
            test.is_true(del.ok, tostring(del.err))
            test.is_false(del.entry.deleted)
            test.is_true(del.entry.in_progress)
            local final, worker_err = deletion_worker.run(file_id)
            test.is_nil(worker_err, tostring(worker_err))
            test.is_true(final.deleted)
            assert_component_purged(file_id)

            local after = call_probe(user_id, "find_by_upload", { upload_id = upload_id })
            test.is_false(after.found)
        end)

        test.it("upload delete reaps file entries that point at the upload", function()
            local user_id = "workspace-reap-" .. uuid()
            local upload_id = "upload-" .. uuid()
            local file = materialize_file(user_id, "gone.txt", nil, upload_id)

            local reap = call_probe(user_id, "delete_by_upload", { upload_id = upload_id })
            test.is_true(reap.ok)
            test.eq(reap.count, 1)
            local final, worker_err = deletion_worker.run(tostring(file.id))
            test.is_nil(worker_err, tostring(worker_err))
            test.is_true(final.deleted)
            assert_component_purged(tostring(file.id))
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }

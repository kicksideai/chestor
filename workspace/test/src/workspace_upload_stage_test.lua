local test = require("test")
local funcs = require("funcs")
local security = require("security")
local crypto = require("crypto")
local channel = require("channel")
local failing_list_stage = require("failing_list_stage")

local PROBE = "app:workspace_probe"
local STAGE = "chestor.workspace:file_stage"

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

local function call_stage(user_id: string, params: any): any
    local result, err = executor(user_id):call(STAGE, params)
    test.is_nil(err)
    test.not_nil(result)
    return result
end

local function define_tests()
    test.describe("workspace upload file materialization", function()
        test.it("keeps file out of the public create path", function()
            local res = call_probe("workspace-owner-" .. uuid(), "create", {
                type = "file",
                name = "manual.txt",
            })
            test.is_false(res.ok)
            test.contains(res.err, "kind is not creatable: file")
        end)

        test.it("lets trusted producers materialize file entries", function()
            local user_id = "workspace-owner-" .. uuid()
            local upload_id = "upload-" .. uuid()
            local res = call_probe(user_id, "materialize", {
                type = "file",
                name = "direct.md",
                meta = {
                    upload_id = upload_id,
                    content_type = "text/markdown",
                    file_size = 42,
                    extension = "md",
                },
            })

            test.is_true(res.ok, tostring(res.err))
            test.eq(res.entry.type, "file")
            test.eq(res.entry.name, "direct.md")
            test.eq(res.entry.meta.upload_id, upload_id)
            test.eq(res.entry.meta.content_type, "text/markdown")
        end)

        test.it("files targeted uploads under the requested workspace folder", function()
            local user_id = "workspace-owner-" .. uuid()
            local folder = call_probe(user_id, "create", {
                type = "folder",
                name = "Incoming",
            })
            test.is_true(folder.ok, tostring(folder.err))
            test.not_nil(folder.entry.id)

            local upload_id = "upload-" .. uuid()
            local first = call_stage(user_id, {
                upload_id = upload_id,
                mime_type = "text/markdown",
                size = 128,
                metadata = {
                    target_parent_id = folder.entry.id,
                    filename = "spec.md",
                },
            })
            test.is_true(first.success)
            test.not_nil(first.entry_id)

            local filed = call_probe(user_id, "get", { id = first.entry_id })
            test.is_true(filed.ok, tostring(filed.err))
            test.eq(filed.entry.type, "file")
            test.eq(filed.entry.name, "spec.md")
            test.eq(filed.entry.parent_id, folder.entry.id)
            test.eq(filed.entry.meta.upload_id, upload_id)
            test.eq(filed.entry.meta.content_type, "text/markdown")
            test.eq(tostring(filed.entry.meta.file_size), "128")
            test.eq(filed.entry.meta.extension, "md")

            local second = call_stage(user_id, {
                upload_id = upload_id,
                mime_type = "text/markdown",
                size = 128,
                metadata = {
                    target_parent_id = folder.entry.id,
                    filename = "spec.md",
                },
            })
            test.is_true(second.success)
            test.eq(second.skipped, "exists")
        end)

        test.it("propagates a target-folder listing failure without materializing a file", function()
            local result, err = failing_list_stage.process({
                upload_id = "upload-" .. uuid(),
                mime_type = "text/plain",
                size = 16,
                metadata = {
                    target_parent_id = "folder-id",
                    filename = "private.txt",
                    archive_path = "private.txt",
                    archive_root = "private.zip",
                },
            })
            test.is_nil(result)
            test.is_true(errors.is(err, errors.UNAVAILABLE))
        end)

        test.it("files concurrent archive members in one folder per parent and name", function()
            local user_id = "workspace-owner-" .. uuid()
            local root = call_probe(user_id, "create", { type = "folder", name = "Imports" })
            test.is_true(root.ok, tostring(root.err))
            local paths = {}
            for member = 1, 8 do paths[member] = "nested/member-" .. tostring(member) .. ".txt" end
            local prepared = call_stage(user_id, {
                metadata = { target_parent_id = root.entry.id, filename = "bundle.zip" },
                archive_members = paths,
            })
            test.is_true(prepared.success)
            for _, path in ipairs(paths) do test.not_nil(prepared.members[path]) end
            local ready, start, results = channel.new(8), channel.new(8), channel.new(8)
            for member = 1, 8 do
                coroutine.spawn(function()
                    ready:send(true)
                    start:receive()
                    local metadata = prepared.members[paths[member]]
                    metadata.target_parent_id = root.entry.id
                    metadata.archive_root = "bundle.zip"
                    metadata.archive_path = paths[member]
                    local result, err = executor(user_id):call(STAGE, {
                        upload_id = "upload-" .. uuid(), mime_type = "text/plain", size = 16,
                        metadata = metadata,
                    })
                    results:send({ result = result, err = err })
                end)
            end
            for _ = 1, 8 do ready:receive() end
            for _ = 1, 8 do start:send(true) end
            local completed = {}
            for _ = 1, 8 do completed[#completed + 1] = results:receive() end
            for _, item in ipairs(completed) do
                test.is_nil(item.err)
                test.is_true(item.result.success)
            end
            local bundles = call_probe(user_id, "list", { parent_id = root.entry.id })
            test.is_true(bundles.ok, tostring(bundles.err))
            test.eq(#bundles.entries, 1)
            test.eq(bundles.entries[1].name, "bundle")
            local nested = call_probe(user_id, "list", { parent_id = bundles.entries[1].id })
            test.eq(#nested.entries, 1)
            test.eq(nested.entries[1].name, "nested")
            local files = call_probe(user_id, "list", { parent_id = nested.entries[1].id })
            test.eq(#files.entries, 8)
            local retry = call_stage(user_id, {
                metadata = { target_parent_id = root.entry.id, filename = "bundle.zip" },
                archive_members = paths,
            })
            for _, path in ipairs(paths) do
                test.eq(retry.members[path].archive_folder_id, prepared.members[path].archive_folder_id)
                test.eq(retry.members[path].archive_parent_id, prepared.members[path].archive_parent_id)
            end
        end)

        test.it("resolves current folder names and placement after rename and move", function()
            local user_id = "workspace-owner-" .. uuid()
            local root = call_probe(user_id, "create", { type = "folder", name = "Imports" })
            local destination = call_probe(user_id, "create", { type = "folder", name = "Destination" })
            local function prepare()
                return call_stage(user_id, {
                    metadata = { target_parent_id = root.entry.id, filename = "bundle.zip" },
                    archive_members = { "member.txt" },
                }).members["member.txt"].archive_folder_id
            end
            local original = prepare()
            test.is_true(call_probe(user_id, "update", { id = original, name = "Renamed" }).ok)
            local renamed = prepare()
            test.is_true(renamed ~= original)
            test.eq(call_probe(user_id, "get", { id = original }).entry.name, "Renamed")
            test.is_true(call_probe(user_id, "move", { id = renamed, parent_id = destination.entry.id }).ok)
            local moved = prepare()
            test.is_true(moved ~= renamed)
            test.eq(call_probe(user_id, "get", { id = renamed }).entry.parent_id, destination.entry.id)
            test.eq(call_probe(user_id, "get", { id = moved }).entry.parent_id, root.entry.id)
        end)

        test.it("propagates archive preparation listing failures", function()
            local result, err = failing_list_stage.process({
                metadata = { target_parent_id = "folder-id", filename = "private.zip" },
                archive_members = { "nested/private.txt" },
            })
            test.is_nil(result)
            test.is_true(errors.is(err, errors.UNAVAILABLE))
        end)

        test.it("ignores uploads without a workspace target", function()
            local result = call_stage("workspace-owner-" .. uuid(), {
                upload_id = "upload-" .. uuid(),
                mime_type = "text/plain",
                size = 10,
                metadata = {
                    filename = "notes.txt",
                },
            })
            test.is_true(result.success)
            test.is_nil(result.entry_id)
        end)

        test.it("does not file transfer bundles already consumed by transfer import", function()
            local user_id = "workspace-owner-" .. uuid()
            local folder = call_probe(user_id, "create", {
                type = "folder",
                name = "Imports",
            })
            test.is_true(folder.ok, tostring(folder.err))

            local result = call_stage(user_id, {
                upload_id = "upload-" .. uuid(),
                mime_type = "application/octet-stream",
                size = 256,
                metadata = {
                    target_parent_id = folder.entry.id,
                    filename = "bundle.kxb",
                    transfer_imported = true,
                },
            })

            test.is_true(result.success)
            test.eq("transfer_imported", result.skipped)
            test.is_nil(result.entry_id)

            local children = call_probe(user_id, "list", { parent_id = folder.entry.id })
            test.is_true(children.ok, tostring(children.err))
            test.eq(0, #children.entries)
        end)

        test.it("files root workspace uploads under the canonical kickside.uploads container", function()
            local user_id = "workspace-owner-" .. uuid()
            local uploads = call_probe(user_id, "create", {
                type = "kickside.uploads",
                name = "Uploads",
            })
            test.is_true(uploads.ok, tostring(uploads.err))
            test.eq(uploads.entry.type, "kickside.uploads")

            local result = call_stage(user_id, {
                upload_id = "upload-" .. uuid(),
                mime_type = "text/markdown",
                size = 64,
                metadata = {
                    target_parent_id = "",
                    filename = "root.md",
                },
            })

            test.is_true(result.success)
            test.not_nil(result.entry_id)

            local filed = call_probe(user_id, "get", { id = result.entry_id })
            test.is_true(filed.ok, tostring(filed.err))
            test.eq(filed.entry.type, "file")
            test.eq(filed.entry.name, "root.md")
            test.eq(filed.entry.parent_id, uploads.entry.id)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }

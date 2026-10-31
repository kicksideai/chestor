-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")
local stubs = require("stubs")
local function setup()
    local state = stubs.reset()
    state.run.agent, state.run.status = "claude", "running"
    state.account = {meta = {agent = "claude", credential_kind = "file:.login.json"}}
    return state, {run_id = "run", account_id = "account", credential_kind = "file:.login.json", credential = '{"token":"refreshed"}', revision = 1}
end
local function cases()
    test.describe("autocode credential refresh", function()
        test.it("validates refreshed JSON before replacing the stored credential", function()
            local state, args = setup()
            args.credential = "malformed"
            local kept, err = subject.keep_credential(args)
            test.is_nil(kept)
            test.is_true(errors.is(err, errors.INVALID))
            test.is_nil(state.patched)
        end)
        test.it("enforces the credential byte bound on refresh", function()
            local state, args = setup()
            args.credential = string.rep("x", 65537)
            local kept, err = subject.keep_credential(args)
            test.is_nil(kept)
            test.is_true(errors.is(err, errors.INVALID))
            test.is_nil(state.patched)
        end)
        test.it("keeps whitespace-prefixed JSON bytes with the original revision", function()
            local state, args = setup()
            args.credential = ' \t\r\n {"token":"refreshed"}\n'
            args.revision = 7
            local kept, err = subject.keep_credential(args)
            test.is_nil(err)
            test.is_true(kept)
            test.eq(state.patched_values.credential, args.credential)
            test.eq(state.patched_revision, 7)
            state.patch_conflict = true
            test.eq(subject.keep_credential(args), false)
        end)
        test.it("rejects whitespace-prefixed JSON arrays", function()
            local state, args = setup()
            args.credential = ' \t\r\n []'
            local kept, err = subject.keep_credential(args)
            test.is_nil(kept)
            test.is_true(errors.is(err, errors.INVALID))
            test.is_nil(state.patched)
        end)
        test.it("rejects an account whose driver changes during the run", function()
            local state, args = setup()
            state.account.meta.agent = "other"
            local kept, err = subject.keep_credential(args)
            test.is_nil(kept)
            test.is_true(errors.is(err, errors.CONFLICT))
            test.is_nil(state.patched)
        end)
        test.it("keeps a valid refresh and preserves revision conflicts", function()
            local state, args = setup()
            local kept, err = subject.keep_credential(args)
            test.is_nil(err)
            test.is_true(kept)
            test.is_true(state.patched)
            state.patch_conflict = true
            local replayed, conflict = subject.keep_credential(args)
            test.eq(replayed, false)
            test.is_nil(conflict)
        end)
        test.it("reads recipe metadata after the context revision snapshot", function()
            local state = stubs.reset()
            state.change_on_context = true
            local recipe, err = subject.image_recipe({image_id = "image"})
            test.is_nil(err)
            test.eq(recipe.home, "/new-home")
        end)
        test.it("does not publish ready over a recipe revision invalidation", function()
            local state = stubs.reset()
            state.build.recipe = {revision = 7}
            state.build.status, state.build.finished_at = "ready", "finished"
            state.replace_conflict = true
            local result, err = subject.image_ready({image_id = "image", build_id = "generation"})
            test.is_nil(result)
            test.is_true(errors.is(err, errors.CONFLICT))
            test.is_nil(state.public)
            test.eq(state.replaced.revision, 7)
        end)
    end)
end
local run_cases = test.run_cases(cases)
return {run = function(options) return run_cases(options) end}

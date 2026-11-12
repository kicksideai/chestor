-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local host = require("host")
local workspaces = require("workspaces")
type Tree = {repository: string, path: string, gitdir: string, removed: boolean?}
local M = {}
-- Git operations use the same host as Docker and have their own short bound,
-- including cleanup after the run's execution deadline has elapsed.
local function git(path: string, args: {string}): (string?, error?)
    local argv = {"git", "-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", "-C", path}
    for _, arg in ipairs(args) do argv[#argv + 1] = arg end
    return host.run(argv)
end
function M.plan(path: string, id: string): (Tree?, error?)
    if not id:match("^[%w-]+$") then return nil, errors.new({kind = errors.INVALID, message = "invalid run id"}) end
    local allowed, problem, root_err = workspaces.admit(path)
    if not allowed then return nil, root_err or errors.new({kind = errors.INVALID, message = problem}) end
    local top, top_err = git(path, {"rev-parse", "--show-toplevel"})
    if not top then
        local cause = top_err :: error
        return nil, errors.new({kind = cause:kind(), message = "worktree isolation requires a git repository with a committed HEAD",
            retryable = cause:retryable(), details = cause:details()})
    end
    if top ~= path:gsub("/+$", "") then return nil, errors.new({kind = errors.INVALID, message = "worktree isolation requires the git repository root"}) end
    local gitdir, dir_err = git(path, {"rev-parse", "--path-format=absolute", "--git-common-dir"})
    if not gitdir then return nil, dir_err end
    local admitted, dir_problem, config_err = workspaces.admit(gitdir)
    if not admitted then return nil, config_err or errors.new({kind = errors.INVALID, message = dir_problem}) end
    local head, head_err = git(path, {"rev-parse", "--verify", "HEAD^{commit}"})
    if not head then
        local cause = head_err :: error
        return nil, errors.new({kind = cause:kind(), message = "worktree isolation requires a committed HEAD",
            retryable = cause:retryable(), details = cause:details()})
    end
    local destination = top .. "/.autocode-runs/" .. id
    local path_err = workspaces.no_symlinks(destination)
    if path_err then return nil, path_err end
    return {repository = top, gitdir = gitdir, path = destination}, nil
end
function M.create(tree: Tree, ref: string?): error?
    for _, path in ipairs({tree.repository, tree.gitdir, tree.path}) do
        local err = workspaces.no_symlinks(path)
        if err then return err end
    end
    local selected = ref and ref ~= "" and ref or "HEAD"
    local commit, ref_err = git(tree.repository, {"rev-parse", "--verify", "--end-of-options", selected .. "^{commit}"})
    if not commit then
        if ref_err and (ref_err:details() or {}).code == "autocode.host_command_failed" then
            return errors.new({kind = errors.INVALID, message = "repository ref must resolve to an existing commit", details = {code = "autocode.invalid_repo_ref"}})
        end
        return ref_err
    end
    local _, err = git(tree.repository, {"worktree", "add", "--detach", "--", tree.path, commit})
    return err
end
function M.remove(tree: Tree): error?
    for _, path in ipairs({tree.repository, tree.gitdir, tree.path}) do
        local err = workspaces.no_symlinks(path)
        if err then return err end
    end
    -- Removal is idempotent and never prunes another run's metadata or branch.
    local listed, list_err = git(tree.repository, {"worktree", "list", "--porcelain"})
    if not listed then return list_err end
    if not ("\n" .. listed .. "\n"):find("\nworktree " .. tree.path .. "\n", 1, true) then return nil end
    local selected = false
    local head: string? = nil
    for line in (listed .. "\n"):gmatch("([^\n]*)\n") do
        if line:sub(1, 9) == "worktree " then selected = line:sub(10) == tree.path
        elseif selected then
            local commit = line:match("^HEAD (%x+)$")
            if commit then head = commit end
        end
    end
    if not head then return errors.new({kind = errors.INVALID, message = "worktree metadata has no committed HEAD"}) end
    local id = tree.path:match("([^/]+)$") :: string
    local preservation = "refs/heads/autocode/" .. id
    -- Capture source files through host-owned metadata, never the run's .git.
    local index = tree.gitdir .. "/autocode-" .. id .. ".index"
    local configuration, configuration_err = git(tree.repository, {"config", "--list", "--name-only"})
    if not configuration then return configuration_err end
    local filters: {[string]: boolean} = {}
    for key in (configuration .. "\n"):gmatch("([^\n]+)\n") do
        local name = key:match("^(filter%..+)%.%w+$")
        if name then filters[name] = true end
    end
    local function capture(args: {string}): (string?, error?)
        local argv = {"env", "GIT_INDEX_FILE=" .. index, "git", "-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false",
            "-c", "user.name=Autocode", "-c", "user.email=autocode@localhost", "-C", tree.path, "--git-dir=" .. tree.gitdir, "--work-tree=" .. tree.path}
        for name in pairs(filters) do
            for _, setting in ipairs({".clean=", ".process=", ".required=false"}) do
                argv[#argv + 1] = "-c"; argv[#argv + 1] = name .. setting
            end
        end
        for _, arg in ipairs(args) do argv[#argv + 1] = arg end
        return host.run(argv)
    end
    local _, read_err = capture({"read-tree", head})
    if read_err then return read_err end
    local _, add_err = capture({"add", "--all", "--", "."})
    if add_err then return add_err end
    local snapshot, snapshot_err = capture({"write-tree"})
    if not snapshot then return snapshot_err end
    local original, original_err = git(tree.repository, {"rev-parse", head .. "^{tree}"})
    if not original then return original_err end
    if snapshot ~= original then
        local commit, commit_err = capture({"commit-tree", snapshot, "-p", head, "-m", "Autocode run " .. id})
        if not commit then return commit_err end
        head = commit
    end
    local _, index_err = host.run({"rm", "-f", "--", index})
    if index_err then return index_err end
    local branches, branches_err = git(tree.repository, {"for-each-ref", "--contains=" .. head, "--format=%(refname)", "refs/heads/", "refs/remotes/"})
    if not branches then return branches_err end
    local reachable = false
    for branch in (branches .. "\n"):gmatch("([^\n]+)\n") do
        if branch ~= preservation then reachable = true end
    end
    local _, retain_err = git(tree.repository, reachable and {"update-ref", "-d", preservation} or {"update-ref", preservation, head})
    if retain_err then return retain_err end
    local _, err = git(tree.repository, {"worktree", "remove", "--force", "--force", "--", tree.path})
    return err
end
function M.forget(repository: string, id: string): error?
    local path_err = workspaces.no_symlinks(repository)
    if path_err then return path_err end
    if not id:match("^[%w-]+$") then return errors.new({kind = errors.INVALID, message = "invalid run id"}) end
    local _, err = git(repository, {"update-ref", "-d", "refs/heads/autocode/" .. id})
    return err
end
return M

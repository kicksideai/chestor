-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local accounts = require("accounts")
local builds = require("builds")
local runs = require("runs")
local events = require("events")
local workspaces = require("workspaces")

type Object = database.Object
type AccountState = database.AccountState
type ImageBuild = database.ImageBuild
type BuildMode = database.BuildMode
type Identity = database.Identity
type Submission = database.Submission
type RunSpec = database.RunSpec
type RunStatus = database.RunStatus
type Run = database.Run
type RunEvent = database.RunEvent
type Transactional = database.Transactional
type FlowSignal = database.FlowSignal

local repo = {EVENTS_PAGE = database.EVENTS_PAGE, now = database.now, db_id = database.db_id}
repo.account_states = accounts.account_states
repo.record_account_limits = accounts.record_account_limits
repo.settle_account = accounts.settle_account
repo.record_account_error = accounts.record_account_error
repo.clear_cooldown = accounts.clear_cooldown
repo.delete_account_state = accounts.delete_account_state
repo.image_build = builds.image_build
repo.request_image_build = builds.request_image_build
repo.finish_image_build = builds.finish_image_build
repo.project_image_build = builds.project_image_build
repo.delete_image_build = builds.delete_image_build
repo.run_summaries = runs.run_summaries
repo.run = runs.run
repo.stored_run = runs.stored_run
repo.find_submission = runs.find_submission
repo.bind_gateway = runs.bind_gateway
repo.create_run = runs.create_run
repo.acknowledge_delivery = runs.acknowledge_delivery
repo.rebalance_run = runs.rebalance_run
repo.cancel_requested = runs.cancel_requested
repo.start_run = runs.start_run
repo.finish_run = runs.finish_run
repo.record_run_outcome = runs.record_run_outcome
repo.request_cancel = runs.request_cancel
repo.append_event = events.append_event
repo.events = events.events
repo.admitted_workspace = workspaces.admitted_workspace
repo.workspace_paths = workspaces.workspace_paths
repo.workspace_overlap = workspaces.workspace_overlap
repo.approve_workspace = workspaces.approve_workspace
repo.delete_workspace = workspaces.delete_workspace
return repo

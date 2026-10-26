-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local accounts = require("accounts")
local builds = require("builds")
local runs = require("runs")
local events = require("events")

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
repo.runs = runs.runs
repo.run = runs.run
repo.stored_run = runs.stored_run
repo.find_submission = runs.find_submission
repo.create_run = runs.create_run
repo.acknowledge_delivery = runs.acknowledge_delivery
repo.start_run = runs.start_run
repo.finish_run = runs.finish_run
repo.request_cancel = runs.request_cancel
repo.prune_runs = runs.prune_runs
repo.append_event = events.append_event
repo.next_seq = events.next_seq
repo.events = events.events
return repo

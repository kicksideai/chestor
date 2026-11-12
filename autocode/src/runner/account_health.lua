-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local limits = require("limits")
local drivers = require("drivers")
local redact = require("redact")
local settings = require("settings")
local time = require("time")
type Intent = {terminal: drivers.Terminal?, refresh_error: string?, windows: {[string]: unknown}?, observed_at: string}
local function capture(terminal: drivers.Terminal?, refresh_error: string?, redactor: redact.Redactor, windows: {[string]: unknown}?): Intent
    local retained: drivers.Terminal? = nil
    if terminal then
        local fault = terminal.error
        retained = {outcome = terminal.outcome, error = fault and {code = fault.code, message = redact.apply(redactor, fault.message), retryable = fault.retryable} or nil}
    end
    return {terminal = retained, refresh_error = refresh_error and redact.apply(redactor, refresh_error) or nil,
        windows = windows, observed_at = time.now():utc():format_rfc3339()}
end
local function apply(run: repo.Run, raw: unknown): error?
    local invalid = errors.new({kind = errors.INTERNAL, message = "stored account health intent is malformed", details = {code = "autocode.invalid_stored_data"}})
    if type(raw) ~= "table" or type(raw.observed_at) ~= "string" or (raw.refresh_error ~= nil and type(raw.refresh_error) ~= "string")
        or (raw.windows ~= nil and type(raw.windows) ~= "table") then return invalid end
    local terminal = raw.terminal
    if terminal ~= nil then
        if type(terminal) ~= "table" or (terminal.outcome ~= "succeeded" and terminal.outcome ~= "failed" and terminal.outcome ~= "uncertain") then return invalid end
        local fault = terminal.error
        if fault ~= nil and (type(fault) ~= "table" or type(fault.code) ~= "string" or type(fault.message) ~= "string"
            or (fault.retryable ~= nil and type(fault.retryable) ~= "boolean")) then return invalid end
    end
    local intent = raw :: Intent
    local observed_at, time_err = time.parse(time.RFC3339, intent.observed_at)
    if not observed_at or time_err then return invalid end
    local terminal, refresh_error = intent.terminal, intent.refresh_error
    -- A success clears the account's last refusal; a retryable provider fault
    -- cools it down. Other failures belong to the task, not the account.
    local windows = intent.windows
    if windows then
        local limits_err = repo.record_account_limits(run.account_id, windows)
        if limits_err then return limits_err end
    end
    local reset = limits.reset(windows)
    local fault = terminal and terminal.error
    local account_err: error? = nil
    if terminal and terminal.outcome == "succeeded" then
        account_err = repo.settle_account(run.account_id, "", "", run.started_at)
    elseif fault and fault.retryable and fault.code == "rate_limit" and reset then
        account_err = repo.settle_account(run.account_id, fault.code .. ": " .. fault.message, reset, run.started_at)
    elseif fault and fault.retryable then
        local cooldown, cooldown_err = settings.get("account_cooldown")
        if not cooldown then
            account_err = cooldown_err
        else
            local duration, duration_err = time.parse_duration(cooldown)
            if not duration or duration:nanoseconds() <= 0 then
                account_err = duration_err or errors.new({kind = errors.INVALID, message = "account cooldown must be a positive duration", details = {code = "autocode.invalid_cooldown"}})
            else
                account_err = repo.settle_account(run.account_id, fault.code .. ": " .. fault.message,
                    observed_at:add(duration):utc():format_rfc3339(), run.started_at)
            end
        end
    end
    if account_err then return account_err end
    if refresh_error then
        local health_err = repo.record_account_error(run.account_id, refresh_error)
        if health_err then return health_err end
    end
end
return {capture = capture, apply = apply}

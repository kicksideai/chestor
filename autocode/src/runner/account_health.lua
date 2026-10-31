-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local drivers = require("drivers")
local redact = require("redact")
local settings = require("settings")
local time = require("time")
type Emit = (string, string) -> ()

local function settle_account(run: repo.Run, terminal: drivers.Terminal?, refresh_error: string?, redactor: redact.Redactor, emit: Emit)
    -- A success clears the account's last refusal; a retryable provider fault
    -- cools it down. Other failures belong to the task, not the account.
    local fault = terminal and terminal.error
    local account_err: error? = nil
    if terminal and terminal.outcome == "succeeded" then
        account_err = repo.settle_account(run.account_id, "", "", run.started_at)
    elseif fault and fault.retryable then
        local cooldown, cooldown_err = settings.get("account_cooldown")
        if not cooldown then
            account_err = cooldown_err
        else
            local duration, duration_err = time.parse_duration(cooldown)
            if not duration or duration:nanoseconds() <= 0 then
                account_err = duration_err or errors.new({kind = errors.INVALID, message = "account cooldown must be a positive duration"})
            else
                account_err = repo.settle_account(run.account_id, redact.apply(redactor, fault.code .. ": " .. fault.message),
                    time.now():add(duration):utc():format_rfc3339(), run.started_at)
            end
        end
    end
    if account_err then emit("system", "account status: " .. tostring(account_err)) end
    if refresh_error then
        local health_err = repo.record_account_error(run.account_id, redact.apply(redactor, refresh_error))
        if health_err then emit("system", "account health write: " .. tostring(health_err)) end
    end
end

return {settle = settle_account}

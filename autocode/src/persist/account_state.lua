-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- One owner projects the account's internal balancing/read model into its public card snapshot.
local repo = require("repo")
local component = require("component")
local json = require("json")
local function project(args: {account_id: string}): (boolean?, error?)
    local states, read_err = repo.account_states({args.account_id})
    if not states then return nil, read_err end
    local state = states[args.account_id]
    local encoded = ""
    if state.rate_limits and next(state.rate_limits) ~= nil then
        local snapshot, encode_err = json.encode(state.rate_limits)
        if not snapshot then return nil, encode_err end
        encoded = snapshot
    end
    return component.set_runtime_meta(args.account_id, {rate_limits = encoded, last_used_at = state.last_used_at,
        cooldown_until = state.cooldown_until, last_error = state.last_error})
end
return {project = project}

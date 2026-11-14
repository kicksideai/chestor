-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local ctx = require("ctx")
local function domain(args)
    return {success = false, error = "refused " .. args.text, code = "fixture.domain", action = {password = "fixture-domain-password", reason = "needs approval"}}, nil
end
local function native(args)
    return nil, errors.new({kind = errors.CONFLICT, message = "conflict " .. args.text, retryable = false,
        details = {code = "fixture.native", password = "fixture-native-password", revision = 7}})
end
return {domain = domain, native = native, echo = function(args) return {owner = security.actor():id(), board_id = ctx.get("board_id"), text = args.text} end}

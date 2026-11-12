-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local ctx = require("ctx")
return {echo = function(args) return {owner = security.actor():id(), board_id = ctx.get("board_id"), text = args.text} end}

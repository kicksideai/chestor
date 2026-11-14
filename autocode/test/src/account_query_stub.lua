-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local stubs = require("stubs")
return {object = database.object, text = database.text, int = database.int, execute = database.execute,
    query = function()
        return stubs.state.account_rows or {}
    end}

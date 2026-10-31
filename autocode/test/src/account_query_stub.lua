-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local stubs = require("stubs")
return {text = database.text, int = database.int, execute = database.execute,
    query = function(statement, params)
        stubs.state.account_query = statement
        stubs.state.account_params = params
        return stubs.state.account_rows or {}
    end}

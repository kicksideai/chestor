-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local M = setmetatable({}, {__index = database})
local paused, resume
function M.arm()
    paused, resume = channel.new(1), channel.new(1)
end
function M.await_read() paused:receive() end
function M.release_read() resume:send(true) end
local function after_read(statement, rows, err)
    if statement:find("SELECT id FROM chestor_autocode_runs WHERE workspace_id", 1, true) then
        paused:send(true)
        resume:receive()
    end
    return rows, err
end
function M.query(statement, params)
    return after_read(statement, database.query(statement, params))
end
function M.transaction(statements, work)
    return database.transaction(statements, function(tx, engine)
        local proxy = {
            execute = function(_, statement, params) return tx:execute(statement, params) end,
            query = function(_, statement, params) return after_read(statement, tx:query(statement, params)) end,
        }
        return work(proxy, engine)
    end)
end
return M

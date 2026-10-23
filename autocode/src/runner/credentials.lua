-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The credential choices a driver offers an account: each login file it
-- keeps, then each variable an API key or token reaches it through. Account
-- import, the catalog and the runner all read the same choices.
local drivers = require("drivers")
local json = require("json")

-- A login file goes to `file` under HOME with the files it initializes beside
-- it; a key or token goes to `variable`. A subscription credential is a
-- person's own login - a login file, or a variable the driver declares as one -
-- rather than an API key.
type Kind = {id: string, label: string, hint: string, file: drivers.CredentialFile?, variable: string?, subscription: boolean}

local M = {}

function M.kinds(driver: drivers.Driver): {Kind}
    local result: {Kind} = {}
    for _, file in ipairs(driver.credentials.files) do
        result[#result + 1] = {id = "file:" .. file.path, label = "Login file ~/" .. file.path,
            hint = "Drop or paste ~/" .. file.path .. " from a machine where the CLI is logged in.", file = file, subscription = true}
    end
    for _, name in ipairs(driver.credentials.variables) do
        local subscription = false
        for _, declared in ipairs(driver.credentials.subscriptions) do
            if declared == name then subscription = true end
        end
        result[#result + 1] = {id = "env:" .. name, label = (subscription and "Subscription token " or "API key ") .. name,
            hint = "The value the CLI reads from " .. name .. ".", variable = name, subscription = subscription}
    end
    return result
end

-- check returns why a secret cannot be the credential `kind` holds: a login
-- file the driver reads as JSON must be a JSON object, and a key or token is
-- one line.
function M.check(kind: Kind, secret: string): string?
    if kind.file and kind.file.content_format == "json" then
        local decoded = json.decode(secret)
        if type(decoded) ~= "table" or decoded[1] ~= nil then return "~/" .. kind.file.path .. " must be a JSON object" end
    end
    if kind.variable and secret:find("[\r\n]") then return kind.variable .. " must be a single line" end
    return nil
end

function M.kind(driver: drivers.Driver, id: string): Kind?
    for _, kind in ipairs(M.kinds(driver)) do
        if kind.id == id then return kind end
    end
    return nil
end

return M

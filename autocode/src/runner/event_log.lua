-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local records = require("records")
local redact = require("redact")
local live = require("live")
local function record(run_id: string, owner_id: string, kind: string, text: string, redactor: redact.Redactor): (error?, error?)
    local err = repo.append_event(run_id, kind, records.clip(redact.apply(redactor, text)))
    if err then return err end
    return nil, live.notify(owner_id, live.run_topic(run_id))
end
return {record = record}

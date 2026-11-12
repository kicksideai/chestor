-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local execution_identity = require("execution_identity")
local sql = require("sql")
local json = require("json")
local uuid = require("uuid")
local function seed(args)
    local captured, err = execution_identity.capture(args.component_id and {component_id = args.component_id} or nil)
    if not captured then return nil, err end
    local identity, row_err = execution_identity.to_row(captured)
    if row_err then return nil, row_err end
    if not identity then return nil, err end
    local id = uuid.v7()
    local db = sql.get("app:db")
    local _, write_err = db:execute([[INSERT INTO chestor_autocode_runs
        (id, owner_id, actor_id, actor_context, agent, account_id, image_id, prompt, timeout_ms, status, tools, resolved)
        VALUES ($1, $2, $2, $3, 'claude', $4, $5, 'recorded run fixture', 60000, 'queued', $6, 1)]],
        {id, identity.actor_id, identity.actor_context, args.account_id, args.image_id, json.encode(args.tools)})
    db:release()
    if write_err then return nil, write_err end
    return {run_id = id}, nil
end
return {seed = seed}

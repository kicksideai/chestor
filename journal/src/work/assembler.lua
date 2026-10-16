local assembly = require("assembly")
local judge = require("judge")
local db = require("db")
local ledger = require("ledger")
local execution_identity = require("execution_identity")

-- The maintainer work item behind "recompute the map". The shared leased-job
-- engine dispatches it exactly the way it dispatches graph maintenance; the
-- assembly ledger carries the queued/dispatched/running accounting a reader
-- polls. A failed run is recorded as failed rather than left running, so the
-- control never sticks.
local M = {}

local function run_framed(journal_id: string, graph_id: string, run_id: string): (any?, error?)
    local owner_handle, owner_err = db.open()
    if not owner_handle then return nil, owner_err end
    local stored, stored_err = ledger.identity(owner_handle, journal_id, run_id)
    owner_handle:release()
    if not stored then return nil, stored_err end
    if graph_id ~= "" and graph_id ~= stored.graph_id then
        return nil, errors.new({ kind = errors.INVALID, message = "assembly graph does not match the stored run" })
    end
    local identity, identity_err = execution_identity.from_row(stored.row.actor_id, stored.row.actor_context)
    if not identity then return nil, identity_err end
    local result, run_err = execution_identity.run_as(identity, "chestor.journal.work:assembly_run", {
        journal_id = journal_id, graph_id = stored.graph_id, run_id = run_id,
    }, { deferred_owner = "chestor.journal.work:assembler" })
    if run_err then return nil, run_err end
    if not result then return nil, errors.new({ kind = errors.INTERNAL, message = "assembly execution returned no result" }) end
    return result, nil
end

function M.run(args: any): (any?, error?)
    local input = type(args) == "table" and args or {}
    if type((input :: any).payload) == "table" then input = (input :: any).payload end
    local journal_id = db.trim((input :: any).journal_id)
    local run_id = db.trim((input :: any).run_id)
    local graph_id = db.trim((input :: any).graph_id)
    if journal_id == "" or run_id == "" then
        return nil, errors.new({ kind = errors.INVALID, message = "journal_id and run_id are required" })
    end

    local result, err = run_framed(journal_id, graph_id, run_id)
    if result then return result, nil end

    local handle, open_err = db.open()
    if not handle then return nil, errors.wrap(err :: error, "assembly run failed; recording the failure: " .. tostring(open_err)) end
    local fail_err = ledger.fail(handle, journal_id, run_id, tostring(err))
    handle:release()
    if fail_err then return nil, errors.wrap(err :: error, "assembly run failed; recording the failure: " .. tostring(fail_err)) end
    return nil, err
end

function M.execute(args: any): (any?, error?)
    return assembly.run(args.journal_id, args.graph_id, args.run_id, judge.for_model)
end

return M

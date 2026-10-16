local db_ops = require("db")
local reader = require("reader")

-- Per-branch digest state (X7): the deterministic det-1 generator distills a
-- branch from its projected facts and children statuses; no generated text
-- ever replaces events. The upsert enforces the same guards the journal
-- digest carries: source_seq is monotonic per branch (I7.1) and never claims
-- a seq beyond the last folded event (I7.2). The projector recomputes on
-- checkpoint/complete/fold/gate-pass and every 25 facts on a branch.
local M = {}

M.GENERATOR_VERSION = "det-1"

local function refusal(code: string, detail: string?): any
    return { success = false, refused = true, code = code, detail = detail }
end

local function placeholders(count: number): string
    local parts: { string } = {}
    for _ = 1, count do parts[#parts + 1] = "?" end
    return table.concat(parts, ",")
end

function M.get(db: any, journal_id: string, task_id: string): (any?, error?)
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id = ? LIMIT 1",
        { journal_id, db_ops.trim(task_id) }
    )
    if query_err then return nil, query_err end
    return rows and rows[1] or nil, nil
end

-- Batch fetch for lens decoration: task_id -> digest row.
function M.for_tasks(db: any, journal_id: string, task_ids: { string }): (any?, error?)
    local out: any = {}
    if #task_ids == 0 then return out, nil end
    local params: { any } = { journal_id }
    for _, id in ipairs(task_ids) do params[#params + 1] = id end
    local rows, query_err = db_ops.query(db,
        "SELECT * FROM chestor_journal_branch_digests WHERE journal_id = ? AND task_id IN ("
            .. placeholders(#task_ids) .. ")",
        params
    )
    if query_err then return nil, query_err end
    for _, row in ipairs(rows or {}) do
        out[db_ops.trim((row :: any).task_id)] = row
    end
    return out, nil
end

local function latest_titled(db: any, journal_id: string, task_id: string, event_type: string): (any?, error?)
    local rows, query_err = db_ops.query(db, [[
        SELECT id, seq, title FROM chestor_journal_events
         WHERE journal_id = ? AND task_id = ? AND event_type = ?
         ORDER BY seq DESC LIMIT 1
    ]], { journal_id, task_id, event_type })
    if query_err then return nil, query_err end
    return rows and rows[1] or nil, nil
end

-- det-1: counts plus the latest checkpoint and decision titles, composed in a
-- fixed order so replaying the same log always yields the same text.
function M.generate(db: any, journal_id: string, task_id: string, projected_fact_count: number?): (any?, error?)
    local id = db_ops.trim(task_id)
    local task, task_err = reader.task(db, journal_id, id)
    if task_err then return nil, task_err end
    if not task then return nil, errors.new({ kind = errors.NOT_FOUND, message = "task not found: " .. id }) end
    local counts, count_err = db_ops.query(db, [[
        SELECT lower(status) AS status, COUNT(*) AS n FROM chestor_journal_tasks
         WHERE journal_id = ? AND parent_task_id = ? GROUP BY lower(status) ORDER BY lower(status) ASC
    ]], { journal_id, id })
    if count_err then return nil, count_err end
    local fact_count = projected_fact_count
    if fact_count == nil then
        local facts, fact_err = db_ops.query(db,
            "SELECT COUNT(*) AS n FROM chestor_journal_events WHERE journal_id = ? AND task_id = ?",
            { journal_id, id }
        )
        if fact_err then return nil, fact_err end
        fact_count = facts and facts[1] and tonumber((facts[1] :: any).n) or 0
    end
    local checkpoint, checkpoint_err = latest_titled(db, journal_id, id, "checkpoint")
    if checkpoint_err then return nil, checkpoint_err end
    local decision, decision_err = latest_titled(db, journal_id, id, "decision")
    if decision_err then return nil, decision_err end

    local parts: { string } = {
        tostring((task :: any).title or id) .. " [" .. db_ops.trim((task :: any).status) .. "]",
        "facts: " .. tostring(fact_count),
    }
    local rollup: { string } = {}
    for _, row in ipairs(counts or {}) do
        rollup[#rollup + 1] = tostring((row :: any).status) .. "=" .. tostring(tonumber((row :: any).n) or 0)
    end
    if #rollup > 0 then parts[#parts + 1] = "children: " .. table.concat(rollup, " ") end
    if db_ops.trim((task :: any).folded_outcome) ~= "" then
        parts[#parts + 1] = "folded(" .. db_ops.trim((task :: any).folded_outcome) .. ")"
    end
    if checkpoint then
        parts[#parts + 1] = "checkpoint: " .. db_ops.trim((checkpoint :: any).title)
    end
    if decision then
        parts[#parts + 1] = "decision: " .. db_ops.trim((decision :: any).title)
    end
    return {
        digest = table.concat(parts, "; "),
        provenance = {
            fact_count = fact_count,
            checkpoint_event_id = checkpoint and (checkpoint :: any).id or nil,
            decision_event_id = decision and (decision :: any).id or nil,
        },
    }, nil
end

-- Guarded write path: refuses a source_seq regression (I7.1) and a source_seq
-- past the last folded event (I7.2); a refused write leaves the previous
-- digest row untouched.
function M.upsert(db: any, journal_id: string, task_id: string, row: any): (any?, error?)
    local id = db_ops.trim(task_id)
    local source_seq = tonumber((row :: any).source_seq) or 0
    local last_rows, last_err = db_ops.query(db,
        "SELECT COALESCE(MAX(seq), 0) AS n FROM chestor_journal_events WHERE journal_id = ?",
        { journal_id }
    )
    if last_err then return nil, last_err end
    local last_seq = last_rows and last_rows[1] and tonumber((last_rows[1] :: any).n) or 0
    if source_seq > last_seq then
        return refusal("provenance",
            "branch digest claims seq " .. tostring(source_seq) .. " beyond last folded event " .. tostring(last_seq)), nil
    end
    local stored, stored_err = M.get(db, journal_id, id)
    if stored_err then return nil, stored_err end
    local stored_seq = stored and tonumber((stored :: any).source_seq) or 0
    if stored and source_seq <= stored_seq then
        return refusal("monotonic",
            "branch digest source_seq " .. tostring(source_seq) .. " does not advance past " .. tostring(stored_seq)), nil
    end
    local write_err = db_ops.exec(db, [[
        INSERT INTO chestor_journal_branch_digests
            (journal_id, task_id, digest, source_seq, generator_version, computed_at, stale, provenance_json)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?)
        ON CONFLICT(journal_id, task_id) DO UPDATE SET
            digest = excluded.digest,
            source_seq = excluded.source_seq,
            generator_version = excluded.generator_version,
            computed_at = excluded.computed_at,
            stale = 0,
            provenance_json = excluded.provenance_json
    ]], { journal_id, id, (row :: any).digest, source_seq, M.GENERATOR_VERSION,
        tonumber((row :: any).computed_at), db_ops.encode((row :: any).provenance, {}) })
    if write_err then return nil, write_err end
    return { success = true, task_id = id, source_seq = source_seq }, nil
end

-- Projector trigger entry: regenerates the branch digest at the triggering
-- event's seq and timestamp. A monotonic refusal is the idempotent no-op for
-- a refolded duplicate event; provenance refusals cannot arise here because
-- the trigger seq is an already-folded event.
function M.recompute(db: any, journal_id: string, task_id: string, source_seq: number, computed_at: number, projected_fact_count: number?): error?
    local generated, generate_err = M.generate(db, journal_id, task_id, projected_fact_count)
    if generate_err then return generate_err end
    local result, upsert_err = M.upsert(db, journal_id, task_id, {
        digest = (generated :: any).digest,
        source_seq = source_seq,
        computed_at = computed_at,
        provenance = (generated :: any).provenance,
    })
    if upsert_err then return upsert_err end
    if (result :: any).refused and tostring((result :: any).code) ~= "monotonic" then
        return errors.new({ kind = errors.CONFLICT, message = tostring((result :: any).detail or (result :: any).code) })
    end
    return nil
end

return M

local component = require("component")
local types = require("types")
local thread_log = require("thread_log")
local db_ops = require("db")
local reader = require("reader")
local graph_jobs = require("graph_jobs")
local commands = require("commands")
local status = require("status")
local scheduler = require("scheduler")

local background_identity = require("background_identity")

local M = {}

local function trim(value: any): string
    return db_ops.trim(value)
end

-- Projection cursor states for the journal thread through the threads
-- contract control-plane view: active cursors advance, while paused or invalid
-- cursors are degraded with the cursor error surfaced (F6). Lag is measured
-- against the cursor's own stamped target.
local function projection_states(threads: any, thread_id: string): (any?, error?)
    local listed, listed_err = threads:list_projections({ thread_id = thread_id })
    if listed_err then return nil, errors.wrap(listed_err, "projection cursor read failed") end
    if not listed then return nil, errors.new({ kind = errors.INTERNAL, message = "projection cursor read returned no result" }) end
    local cursors: { any } = {}
    local degraded = false
    local first_error: string? = nil
    for _, row in ipairs((listed :: any).cursors or {}) do
        local cursor = row :: any
        local state = string.lower(trim(cursor.status))
        local last_seq = tonumber(cursor.last_seq) or 0
        local target_seq = tonumber(cursor.target_seq) or last_seq
        local cursor_error = trim(cursor.last_error)
        cursors[#cursors + 1] = {
            cursor_key = cursor.cursor_key,
            kind = cursor.kind,
            status = state,
            last_seq = last_seq,
            target_seq = target_seq,
            lag = math.max(0, target_seq - last_seq),
            error = cursor_error ~= "" and cursor_error or nil,
        }
        if state == "paused" or state == "invalid" then
            degraded = true
            if not first_error then
                first_error = "projection cursor " .. trim(cursor.cursor_key) .. " " .. state
                    .. (cursor_error ~= "" and (": " .. cursor_error) or "")
            end
        end
    end
    return { cursors = cursors, degraded = degraded, error = first_error }, nil
end

-- One heartbeat: every component state the journal's health rests on,
-- computed fresh. Runs the lease reaper (I9.4 operational wiring) before
-- reading, so an expired lease is already folded into the beat it surfaces on.
function M.snapshot(journal_id: string): (any?, error?)
    local threads, thread_id, resolve_err = thread_log.resolve(journal_id)
    if not threads or not thread_id then return nil, resolve_err end

    local reaped, reap_err = commands.reap_expired(thread_id)
    if not reaped then return nil, reap_err end
    local abandoned = 0
    local snapshots = 0
    for _, entry in ipairs((reaped :: any).reaped or {}) do
        if (entry :: any).abandoned then abandoned = abandoned + 1 end
        if (entry :: any).snapshot then snapshots = snapshots + 1 end
    end

    local previous, previous_err = status.snapshot_meta(thread_id)
    if previous_err then return nil, previous_err end
    local previously_violated = type(previous) == "table"
        and type((previous :: any).components) == "table"
        and type(((previous :: any).components :: any).digest_sla) == "table"
        and (((previous :: any).components :: any).digest_sla :: any).violated == true
    local sla, sla_err = commands.digest_sla_check(thread_id, { emit = not previously_violated })
    if not sla then return nil, sla_err end

    local projections, projections_err = projection_states(threads, thread_id)
    if not projections then return nil, projections_err end

    -- Implicit work spans seal themselves on this beat: the maintainer already
    -- runs once per interval per active journal, so an identity that went
    -- quiet has its span closed at its last activity without a scheduler of
    -- its own.
    local swept, sweep_err = commands.sweep_spans(thread_id, nil)
    if not swept then return nil, sweep_err end

    local db, db_err = db_ops.open()
    if not db then return nil, db_err end
    local function fail(err: error?): (any?, error?)
        db:release()
        return nil, err
    end
    local backlog, backlog_err = reader.embedding_backlog(db, thread_id,
        types.EMBEDDING_MODEL, types.EMBEDDING_MODEL_VERSION)
    if backlog == nil then return fail(backlog_err) end
    local maintainer, maintainer_err = graph_jobs.counts(db, thread_id)
    if not maintainer then return fail(maintainer_err) end
    -- Dead-lettered maintenance jobs live in the shared jobs engine table
    -- (kickside/jobs owns leases, retries, and terminal states); the engine
    -- shares the app database with the journal by wiring.
    local dead_rows, dead_err = db_ops.query(db,
        "SELECT COUNT(*) AS n FROM kickside_job WHERE thread_id = ? AND job_type = ? AND status = 'dead'",
        { thread_id, types.GRAPH_MAINTENANCE_JOB_TYPE }
    )
    if dead_err then return fail(dead_err) end
    (maintainer :: any).dead = dead_rows and dead_rows[1] and tonumber((dead_rows[1] :: any).n) or 0
    local lease_rows, lease_err = db_ops.query(db,
        "SELECT COUNT(*) AS n FROM chestor_journal_leases WHERE journal_id = ? AND revoked = 0 AND expires_at > ?",
        { thread_id, db_ops.now() }
    )
    if lease_err then return fail(lease_err) end
    local ts_rows, ts_err = db_ops.query(db,
        "SELECT MAX(ts) AS last_ts FROM chestor_journal_events WHERE journal_id = ?",
        { thread_id }
    )
    db:release()
    if ts_err then return nil, ts_err end
    local last_ts = ts_rows and ts_rows[1] and tonumber((ts_rows[1] :: any).last_ts) or 0

    return {
        heartbeat_at = os.time(),
        interval_s = types.HEALTH.INTERVAL_S,
        active = last_ts >= os.time() - types.HEALTH.ACTIVE_WINDOW_S,
        components = {
            projections = projections,
            embeddings = { pending = backlog },
            maintainer = maintainer,
            digest_sla = { violated = (sla :: any).violated == true, lag = tonumber((sla :: any).lag) or 0 },
            leases = {
                active = lease_rows and lease_rows[1] and tonumber((lease_rows[1] :: any).n) or 0,
                reaped = #((reaped :: any).reaped or {}),
                abandoned = abandoned,
                snapshots = snapshots,
            },
            spans = {
                open = tonumber((swept :: any).open) or 0,
                total = tonumber((swept :: any).total) or 0,
                sealed = tonumber((swept :: any).sealed) or 0,
                saturated = (swept :: any).saturated == true,
                idle_s = tonumber((swept :: any).idle_s) or 0,
            },
        },
    }, nil
end

-- The health writer beat: compute the snapshot, publish it out-of-band to the
-- workspace component meta (X6/D5), and chain the next beat one interval out
-- while the journal stays active (events inside the 24h window). An inactive
-- journal lets the chain lapse; the next projected event re-primes it.
function M.execute(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if type(args.payload) == "table" then args = args.payload end
    local journal_id = trim(args.journal_id)
    if journal_id == "" then return nil, errors.new({ kind = errors.INVALID, message = "journal_id is required" }) end
    local snapshot, snapshot_err = M.snapshot(journal_id)
    if not snapshot then return nil, snapshot_err end
    local meta_ok, meta_err = component.set_meta(journal_id, { health = snapshot })
    if meta_err then return nil, errors.wrap(meta_err, "journal health meta update failed") end
    if meta_ok ~= true then return nil, errors.new({ kind = errors.INTERNAL, message = "journal health meta update was not applied" }) end
    if (snapshot :: any).active then
        local schedule_err = scheduler.schedule(journal_id)
        if schedule_err then return nil, errors.new({ kind = errors.INTERNAL, message = "failed to chain Journal health beat: " .. schedule_err }) end
    end
    return { success = true, health = snapshot }, nil
end

function M.run(args: any): (any?, string?)
    args = type(args) == "table" and args or {}
    if type(args.payload) == "table" then args = args.payload end
    local journal_id = tostring(args.journal_id or "")
    if journal_id == "" then return nil, "journal_id is required" end
    return background_identity.run(journal_id, "chestor.journal.health:writer", "chestor.journal.health:writer_tick", { journal_id = journal_id })
end

return M

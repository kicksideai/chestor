local component = require("component")
local types = require("types")
local db_ops = require("db")

local M = {}

-- X6/I6.1: staleness is computed by the reader from heartbeat age, so a dead
-- health writer is detectable by pure absence — unknown within two intervals,
-- no backend cooperation required. Clock is injected for tests.
function M.heartbeat_status(last_beat_ts: any, interval_s: any, now_ts: any): any
    local interval = tonumber(interval_s) or types.HEALTH.INTERVAL_S
    local now = tonumber(now_ts) or os.time()
    local last = tonumber(last_beat_ts) or 0
    if last <= 0 then
        return { status = "unknown", since = nil, age_s = nil }
    end
    local age = now - last
    if age >= 2 * interval then
        return { status = "unknown", since = last, age_s = age }
    end
    return { status = "ok", since = last, age_s = age }
end

-- The stored heartbeat snapshot from the workspace component meta — the
-- out-of-band channel per X6/D5, deliberately outside the journal read
-- models. Returns nil when the writer has never beaten for this journal.
function M.snapshot_meta(thread_id: string): (any?, error?)
    local rows, err = component.list_system({
        component_ids = { thread_id },
        include = { meta = true },
        limit = 1,
    })
    if err then return nil, errors.wrap(err, "journal component meta read failed") end
    local meta = rows and rows[1] and (rows[1] :: any).meta
    if type(meta) ~= "table" then return nil, nil end
    local snapshot = db_ops.decode((meta :: any).health, nil)
    if type(snapshot) ~= "table" then return nil, nil end
    return snapshot, nil
end

-- Folds the writer's per-component states and the reader-side heartbeat age
-- into the health verdict: unknown dominates (stale data cannot attest to
-- anything), any degraded component reads degraded with its reason surfaced
-- (F6: the journal must not lie), otherwise ok.
function M.derive(snapshot: any, now_ts: any): any
    local interval = type(snapshot) == "table" and tonumber((snapshot :: any).interval_s)
        or types.HEALTH.INTERVAL_S
    local beat = M.heartbeat_status(
        type(snapshot) == "table" and (snapshot :: any).heartbeat_at or nil, interval, now_ts)
    local components = type(snapshot) == "table" and (snapshot :: any).components or nil
    local reasons: { string } = {}
    if type(components) == "table" then
        local c = components :: any
        if type(c.projections) == "table" and (c.projections :: any).degraded then
            reasons[#reasons + 1] = tostring((c.projections :: any).error or "projection cursor degraded")
        end
        if type(c.digest_sla) == "table" and (c.digest_sla :: any).violated then
            reasons[#reasons + 1] = "digest SLA violated: lag "
                .. tostring((c.digest_sla :: any).lag)
        end
        if type(c.maintainer) == "table" and (tonumber((c.maintainer :: any).dead) or 0) > 0 then
            reasons[#reasons + 1] = tostring((c.maintainer :: any).dead)
                .. " dead graph maintenance jobs"
        end
    end
    local status = "ok"
    if beat.status ~= "ok" then
        status = "unknown"
    elseif #reasons > 0 then
        status = "degraded"
    end
    return {
        status = status,
        heartbeat_at = beat.since,
        age_s = beat.age_s,
        interval_s = interval,
        reasons = #reasons > 0 and reasons or nil,
        components = components,
    }
end

-- One line for the brief view: enough to notice, never enough to drown it.
function M.summary(health: any): string
    local status = tostring((health :: any).status)
    if status == "ok" then
        return "health ok (heartbeat " .. tostring((health :: any).age_s) .. "s ago)"
    end
    if status == "degraded" then
        local reasons = (health :: any).reasons
        return "health degraded: " .. tostring(type(reasons) == "table" and (reasons :: any)[1] or "see components")
    end
    local since = tonumber((health :: any).heartbeat_at)
    if since then
        return "health unknown since " .. tostring(since) .. " (heartbeat stale)"
    end
    return "health unknown (no heartbeat recorded)"
end

return M

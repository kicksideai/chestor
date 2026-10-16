local registry = require("registry")

type JournalEventConstants = {
    ENTRY_APPENDED: string,
    TASK_UPSERTED: string,
    TASK_CLOSED: string,
    TASK_FOCUSED: string,
    DIGEST_UPDATED: string,
    CHECKPOINT_CREATED: string,
    ARTIFACT_LINKED: string,
    TASK_LINKED: string,
    TASK_UNLINKED: string,
    TASK_TRANSITIONED: string,
    VERIFICATION_REQUESTED: string,
    VERIFICATION_RECEIPT: string,
    CURSOR_UPDATED: string,
    AUDIT_COVERAGE_RECORDED: string,
    INTEGRATION_RECORDED: string,
    REFERENCE_LINKED: string,
    REFERENCE_UNLINKED: string,
    GRAPH_CONFIG_REQUESTED: string,
    GRAPH_OPS_REQUESTED: string,
}

local EVENT_NS = "chestor.journal.events:"

local M = {
    DB_CONFIG = "chestor.journal:db_config",
    _registry = registry,
    THREADS = "kickside.core:threads",
    THREAD_CLASS = "workspace.journal",
    JOURNAL_IMPL = "chestor.journal:journal_kind",
    PROJECTION_KIND = "chestor.journal:state",
    GRAPH_PROJECTION_KIND = "chestor.journal:graph_state",
    EMBEDDING_MODEL = "class:embed",
    -- This is the semantic-index contract version, not a display label. Bump
    -- it whenever the class mapping, normalization, chunking, or dimensions
    -- change; old vectors remain addressable under their original version.
    EMBEDDING_MODEL_VERSION = "journal-content-v2",
    EMBEDDING_DIMENSIONS = 512,
    EVENT_NS = EVENT_NS,
    EVENT = {
        ENTRY_APPENDED = EVENT_NS .. "entry.appended",
        TASK_UPSERTED = EVENT_NS .. "task.upserted",
        TASK_CLOSED = EVENT_NS .. "task.closed",
        TASK_FOCUSED = EVENT_NS .. "task.focused",
        DIGEST_UPDATED = EVENT_NS .. "digest.updated",
        CHECKPOINT_CREATED = EVENT_NS .. "checkpoint.created",
        ARTIFACT_LINKED = EVENT_NS .. "artifact.linked",
        TASK_LINKED = EVENT_NS .. "task.linked",
        TASK_UNLINKED = EVENT_NS .. "task.unlinked",
        TASK_TRANSITIONED = EVENT_NS .. "task.transitioned",
        VERIFICATION_REQUESTED = EVENT_NS .. "verification.requested",
        VERIFICATION_RECEIPT = EVENT_NS .. "verification.receipt",
        CURSOR_UPDATED = EVENT_NS .. "cursor.updated",
        AUDIT_COVERAGE_RECORDED = EVENT_NS .. "audit.coverage.recorded",
        INTEGRATION_RECORDED = EVENT_NS .. "integration.recorded",
        REFERENCE_LINKED = EVENT_NS .. "reference.linked",
        REFERENCE_UNLINKED = EVENT_NS .. "reference.unlinked",
        GRAPH_CONFIG_REQUESTED = EVENT_NS .. "graph.configuration.requested",
        GRAPH_OPS_REQUESTED = EVENT_NS .. "graph.operations.requested",
    },
    TERMINAL_TASK_STATUS = { done = true, closed = true, canceled = true, cancelled = true, folded = true },
    -- X6/F8 health cadence: the writer beats every 60s per active journal
    -- (events inside the 24h window); the reader reports unknown past two
    -- intervals. Job identities live here so the writer, its scheduler, and
    -- the dead-job counters share one vocabulary.
    HEALTH = {
        INTERVAL_S = 60,
        ACTIVE_WINDOW_S = 86400,
        JOB_TYPE = "chestor.journal.health:writer",
        WORKER_REF = "func://chestor.journal.health:writer",
    },
    GRAPH_MAINTENANCE_JOB_TYPE = "chestor.journal.graph:maintainer",
    GRAPH_ASSEMBLY_JOB_TYPE = "chestor.journal.work:assembler",
    GRAPH_ASSEMBLY_WORKER_REF = "func://chestor.journal.work:assembler",
    -- Implicit work spans: an identity's first write opens one, every fact it
    -- writes extends it, and this much inactivity seals it at its last
    -- activity. The host application overrides the idle bound through the
    -- db_config meta; the sweep bound keeps one heartbeat's work bounded.
    SPAN = {
        IDLE_S = 2 * 60 * 60,
        SWEEP_LIMIT = 200,
    },
}

-- Protocol events are the journal talking to itself: where a position sits and
-- how a graph is configured. They stay durable and addressable by id, but they
-- are never work an agent did, so user-facing streams and last-touch
-- resolution derive their filter from this one declared set. An authored graph
-- change (graph.operations.requested) is work and stays visible.
M.PROTOCOL_EVENT_TYPES = {
    "cursor.updated",
    "graph.configuration.requested",
}

M.PROTOCOL_EVENT_TYPE_SET = {}
for _, event_type in ipairs(M.PROTOCOL_EVENT_TYPES) do
    (M.PROTOCOL_EVENT_TYPE_SET :: any)[event_type] = true
end

function M.is_protocol_event_type(value: any): boolean
    return (M.PROTOCOL_EVENT_TYPE_SET :: any)[tostring(value or "")] == true
end

M.EVENT_SET = {
    [M.EVENT.ENTRY_APPENDED] = true,
    [M.EVENT.TASK_UPSERTED] = true,
    [M.EVENT.TASK_CLOSED] = true,
    [M.EVENT.TASK_FOCUSED] = true,
    [M.EVENT.DIGEST_UPDATED] = true,
    [M.EVENT.CHECKPOINT_CREATED] = true,
    [M.EVENT.ARTIFACT_LINKED] = true,
    [M.EVENT.TASK_LINKED] = true,
    [M.EVENT.TASK_UNLINKED] = true,
    [M.EVENT.TASK_TRANSITIONED] = true,
    [M.EVENT.VERIFICATION_REQUESTED] = true,
    [M.EVENT.VERIFICATION_RECEIPT] = true,
    [M.EVENT.CURSOR_UPDATED] = true,
    [M.EVENT.AUDIT_COVERAGE_RECORDED] = true,
    [M.EVENT.INTEGRATION_RECORDED] = true,
    [M.EVENT.REFERENCE_LINKED] = true,
    [M.EVENT.REFERENCE_UNLINKED] = true,
    [M.EVENT.GRAPH_CONFIG_REQUESTED] = true,
    [M.EVENT.GRAPH_OPS_REQUESTED] = true,
}

function M.db_id(): string
    local entry, err = M._registry.get(M.DB_CONFIG)
    if not err and type(entry) == "table" then
        local meta: any = (entry :: any).meta or {}
        if type(meta.db_id) == "string" and meta.db_id ~= "" then
            return meta.db_id
        end
    end
    error("chestor.journal:target_db was not bound by the host application", 2)
end

-- How long an identity may stay silent before its open span seals itself. The
-- host application tunes it on the same config entry that binds the database;
-- an unbound or unusable value answers with the module default.
function M.span_idle_s(): number
    local entry, err = M._registry.get(M.DB_CONFIG)
    if not err and type(entry) == "table" then
        local meta: any = (entry :: any).meta or {}
        local configured = tonumber(meta.span_idle_s)
        if configured and configured >= 60 then return math.floor(configured) end
    end
    return M.SPAN.IDLE_S
end

return M

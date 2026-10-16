export interface JournalGraph {
  id: string
  title: string
  description?: string
  kind: string
  lifecycle: string
  health?: string
  parent_graph_id?: string
  anchor?: { graph_id: string; node_id: string }
  revision: number
  node_count: number
  edge_count: number
  updated_at: number
  /** How many agent identities have touched this graph, from the catalog read. */
  agent_count?: number
  last_agent_activity_at?: number
  config?: Record<string, unknown>
}

/**
 * Journal records carry many kinds, but every kind plays one of a small number
 * of epistemic roles. The family is what the presentation reads.
 */
export type NodeFamily = 'anchor' | 'rule' | 'decision' | 'evidence' | 'risk' | 'open' | 'agent' | 'note'

export type SearchMode = 'search' | 'semantic' | 'hybrid'

export interface GraphNode {
  id: string
  semantic_key?: string
  label: string
  kind: string
  summary?: string
  status?: string
  parent_id?: string
  child_count: number
  x?: number
  y?: number
  pinned?: boolean
  locked?: boolean
  metadata?: Record<string, unknown>
  attrs?: Record<string, unknown>
  revision: number
  created_at: number
  updated_at: number
  distance?: number
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  kind: string
  label?: string
  metadata?: Record<string, unknown>
  revision: number
  created_at: number
  updated_at: number
}

export interface GraphWindow {
  graph: JournalGraph
  root_id?: string
  parent_id?: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  levels: number
  limits: { nodes: number; edges: number }
  collapsed_node_count: number
  collapsed_edge_count: number
}

export interface TimelineItem {
  entity_type: 'node' | 'edge'
  id: string
  kind: string
  label?: string
  from_node_id?: string
  to_node_id?: string
  attrs?: Record<string, unknown>
  revision: number
  created_at: number
  updated_at: number
}

/** One unit of work a task carries, as the journal projects it. */
export interface JournalTask {
  id: string
  title: string
  description?: string
  status: string
  parent_task_id?: string
  work_kind?: string
  sort_order?: number
  gate?: number
  passed?: number
  revision: number
  created_at: number
  updated_at: number
}

/** One fact as the journal stores it. */
export interface JournalEvent {
  id: string
  seq: number
  event_type: string
  title?: string
  body?: string
  ts: number
  actor_id?: string
  actor_type?: string
  span_id?: string
  tags?: string[]
  linked_task_ids?: string[]
}

/** The record a fact left on the span or cursor that wrote it. */
export interface FactTouch {
  seq: number
  event_id: string
  event_type?: string
  title?: string
  ts?: number
}

/**
 * One implicit work span: it opens at an identity's first write and seals
 * itself after inactivity, so it says what an agent did rather than what it
 * declared it would do.
 */
export interface WorkSpan {
  span_id: string
  agent_id?: string
  cursor_id?: string
  task_id?: string
  origin?: 'auto' | 'explicit'
  state: 'open' | 'sealed'
  started_at: number
  last_activity_at: number
  ended_at?: number
  started_seq?: number
  last_seq?: number
  fact_count?: number
  duration_s?: number
  working_on?: { text?: string; kind?: string }
  last_fact?: FactTouch
  closed_reason?: string
}

export interface SpanPage {
  items: WorkSpan[]
  limit?: number
  has_more?: boolean
  counts?: { open?: number; sealed?: number; total?: number }
  idle_s?: number
  journal_id?: string
  next_cursor?: unknown
}

/** One server-side time bucket; a bucket with no agent is the journal-wide row. */
export interface ActivityBucket {
  bucket_at: number
  agent_id?: string
  events: number
  first_seq?: number
  last_seq?: number
  last_ts?: number
}

export interface ActivityPage {
  buckets: ActivityBucket[]
  width_s: number
  bucket: string
  limit?: number
  since?: number
  has_more?: boolean
  next_cursor?: { after_bucket_at?: number; after_agent_id?: string }
  journal_id?: string
}

export interface KeysetPage {
  limit?: number
  has_more?: boolean
  next_cursor?: unknown
}

/** A currently valid mutation lease, distinct from an agent's presence/span. */
export interface WorkLease {
  lease_id: string
  agent_id: string
  task_id: string
  task_title?: string
  task_status?: string
  capability: 'WRITE' | 'PLANNING'
  fencing_token?: number
  issued_at: number
  expires_at: number
  remaining_s: number
  task_updated_at?: number
}

/** Started work that has no live authority and can be reclaimed in place. */
export interface ResumableWork {
  task_id: string
  task_title?: string
  task_status: string
  task_updated_at?: number
  next?: { tool?: string; verb?: string; task_id?: string }
}

export interface WorkControlState {
  now: number
  leases: WorkLease[]
  resumable: ResumableWork[]
  counts: { active: number; write: number; planning: number; resumable: number }
  limit: number
  has_more: boolean
}

/** The journal state read: counts, pages, catalog, cursor roll and open spans. */
export interface JournalState {
  journal_id: string
  thread_id?: string
  stats?: {
    total?: number
    last_seq?: number
    last_ts?: number
    task_count?: number
    open_task_count?: number
    artifact_count?: number
    by_type?: Record<string, number>
  }
  tasks?: JournalTask[]
  task_page?: KeysetPage
  graphs?: JournalGraph[]
  graph_page?: KeysetPage
  cursors?: { items?: JournalCursor[] } & KeysetPage
  spans?: { items?: WorkSpan[] } & KeysetPage
  work_control?: WorkControlState
  events?: JournalEvent[]
  event_page?: KeysetPage
}

/** What a whole-graph load is doing, in the words the reader is shown. */
export interface WholeGraphLoad {
  running: boolean
  loaded: number
  total: number
  chunks: number
  done: boolean
  cancelled: boolean
  error: string
}

export interface HealthState {
  status?: 'ok' | 'degraded' | 'unknown'
  age_s?: number
  reasons?: string[]
  components?: Record<string, unknown>
}

/**
 * The bounds a rendered record occupies. The mark is centred on the node
 * position and the label hangs beneath it, so the vertical extents are not
 * symmetric and are carried separately.
 */
export interface NodeBox {
  /** Radius of the family mark drawn at the node position. */
  radius: number
  /** Measured label lines hanging under the mark. */
  lines: string[]
  halfWidth: number
  /** Distance from the node position to the top of the mark. */
  top: number
  /** Distance from the node position to the bottom of the last label line. */
  bottom: number
}

export interface PositionedNode extends GraphNode {
  px: number
  py: number
  vx: number
  vy: number
  color: string
  family: NodeFamily
  degree: number
  box: NodeBox
  /** True when a reader placed this node by hand in the current session. */
  held: boolean
}

/** Where the cursor store says a graph-addressed cursor stands. */
export interface CursorAddress {
  graph_id: string
  node_id: string
  label?: string
}

/** The record one agent's consumption watermark last landed on. */
export interface CursorTouch {
  seq: number
  event_id: string
  event_type?: string
  title?: string
  ts?: number
  positions?: CursorAddress[]
}

/** The shape of the recovery state an agent stored, never the blob itself. */
export interface CursorCheckpointSummary {
  keys: string[]
  entries: number
  headline?: string
}

/**
 * One durable cursor as the journal publishes it. Automatic cursors are
 * maintained for an agent as it works and carry no graph address; explicit
 * cursors are opened by the protocol and hold one.
 */
export interface JournalCursor {
  cursor_id: string
  agent_id: string
  origin: 'auto' | 'explicit'
  state: string
  purpose?: string
  last_seen_seq: number
  checkpoint_seq: number
  created_at: number
  updated_at: number
  parent_cursor_id?: string
  position?: CursorAddress
  checkpoint?: CursorCheckpointSummary
  last_touch?: CursorTouch
}

export interface JournalCursorPage {
  journal_id?: string
  items: JournalCursor[]
  total: number
  limit: number
  omitted: number
  has_more: boolean
}

/**
 * One agent's recorded position, from the projected agent record, from the
 * cursor store, or from both when they name the same presence.
 */
export interface AgentPresence {
  id: string
  label: string
  initials: string
  purpose: string
  status: string
  next?: string
  exitCondition?: string
  /** Node id the agent is standing on, when that node is inside the window. */
  positionId?: string
  positionLabel?: string
  updated_at: number
  source: 'graph' | 'cursor' | 'both'
  origin?: 'auto' | 'explicit'
  cursorId?: string
  agentId?: string
  lastSeenSeq?: number
  /** Record the watermark last landed on, when it is inside this window. */
  touchNodeId?: string
  touchLabel?: string
  /** Idle beyond the presence threshold; rendered quietly, never dropped. */
  stale: boolean
}

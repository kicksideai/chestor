/** One unit of work, as the journal's task tree carries it. */
export interface JournalTask {
  id: string
  title: string
  description?: string
  status: string
  parent_task_id?: string
  work_kind?: string
  sort_order?: number
  revision: number
  created_at: number
  updated_at: number
  /** Branch reads only: the distilled summary of the subtree. */
  digest?: string
  /** Branch reads only: open tasks anywhere under this one. */
  open_count?: number
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
  task_id?: string
  span_id?: string
  tags?: string[]
  lifecycle?: string
  effective_state?: string
  supersedes_event_id?: string
  superseded_by_event_id?: string
  /** Recall reads only: semantic distance when the match was by meaning. */
  distance?: number
}

/** One identity's stretch of work: it opens at a first write and seals after inactivity. */
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
  last_seq?: number
  fact_count?: number
  working_on?: { text?: string; kind?: string; task_id?: string }
  last_fact?: { seq: number; event_id: string; title?: string; ts?: number; task_id?: string }
}

/** A live editing session on one task. */
export interface WorkLease {
  lease_id: string
  agent_id: string
  task_id: string
  task_title?: string
  task_status?: string
  capability: 'WRITE' | 'PLANNING'
  issued_at: number
  expires_at: number
  remaining_s: number
}

/** Started work that nobody holds an editing session on. */
export interface ResumableWork {
  task_id: string
  task_title?: string
  task_status: string
  task_updated_at?: number
}

export interface WorkControlState {
  now: number
  leases: WorkLease[]
  resumable: ResumableWork[]
  counts: { active: number; write: number; planning: number; resumable: number }
  limit: number
  has_more: boolean
}

/** One durable position an agent holds in the journal. */
export interface JournalCursor {
  cursor_id: string
  agent_id: string
  origin: 'auto' | 'explicit'
  state: string
  purpose?: string
  last_seen_seq: number
  created_at: number
  updated_at: number
  checkpoint?: { headline?: string }
  last_touch?: { seq: number; event_id: string; title?: string; ts?: number }
}

interface KeysetPage { limit?: number; has_more?: boolean }

/** The journal state read: counts, recent facts, agent positions, open spans and editing sessions. */
export interface JournalState {
  journal_id: string
  stats?: { total?: number; last_seq?: number; last_ts?: number; task_count?: number; open_task_count?: number }
  events?: JournalEvent[]
  event_page?: KeysetPage & { next_before_seq?: number }
  cursors?: { items?: JournalCursor[] } & KeysetPage
  spans?: { items?: WorkSpan[] } & KeysetPage
  work_control?: WorkControlState
}

/** One task with its surroundings, from the branch read. */
export interface BranchView {
  task: JournalTask | null
  ancestors: JournalTask[]
  children: JournalTask[]
  facts: JournalEvent[]
  deps?: {
    outgoing: Array<{ from_task_id: string; to_task_id: string; kind: string }>
    incoming: Array<{ from_task_id: string; to_task_id: string; kind: string }>
  }
}

export interface HealthState {
  status?: 'ok' | 'degraded' | 'unknown'
  reasons?: string[]
}

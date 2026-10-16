import { api } from '@wippy-fe/proxy'
import type { AssemblyRun } from './assembly'
import type { GraphBundlePage } from './load-all'
import type {
  ActivityPage, GraphNode, GraphWindow, HealthState, JournalCursor, JournalGraph, JournalState,
  JournalTask, SpanPage, TimelineItem,
} from './types'

function query(values: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) if (value !== undefined && value !== '') p.set(key, String(value))
  const encoded = p.toString()
  return encoded ? `?${encoded}` : ''
}

function errorMessage(err: unknown, fallback: string): string {
  const value = err as { response?: { data?: { error?: unknown } }; data?: { error?: unknown }; message?: unknown }
  const server = value?.response?.data?.error ?? value?.data?.error
  if (typeof server === 'string' && server) return server
  if (typeof value?.message === 'string' && value.message && !/status code|request failed/i.test(value.message)) return value.message
  return fallback
}

/** One page of a whole-graph read; 500 records is the server's own ceiling. */
export const BUNDLE_NODE_PAGE = 500
export const BUNDLE_EDGE_PAGE = 1000

export class JournalApi {
  constructor(private readonly journalId: string) {}

  private base() { return `/api/v1/workspace/journals/${this.journalId}` }

  /**
   * The journal itself: counts, the task page, the graph catalog, the cursor
   * roll and the open work spans. Every collection in it is a keyset page.
   */
  async state(): Promise<JournalState> {
    try {
      const { data } = await api.get(this.base())
      if (!data.success) throw new Error(data.error || 'failed to read the journal')
      return data.journal
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t read this Journal.')) }
  }

  /**
   * The whole task tree. The journal snapshot carries one pinned page of tasks
   * and no usable continuation, so a count taken over it would be a count over
   * a page; the tree read honours its own bounds and answers with the work the
   * journal actually holds.
   */
  async tasks(limit = 5000, depth = 6): Promise<{ tasks: JournalTask[]; bounded: boolean }> {
    try {
      const { data } = await api.get(`${this.base()}/tree${query({ depth, limit })}`)
      if (!data.success) throw new Error(data.error || 'failed to read the task tree')
      const flat: JournalTask[] = []
      const walk = (rows: Array<JournalTask & { children?: JournalTask[] }>, parent?: string) => {
        for (const row of rows || []) {
          const { children, ...task } = row
          flat.push({ ...task, parent_task_id: task.parent_task_id || parent })
          if (children?.length) walk(children as Array<JournalTask & { children?: JournalTask[] }>, task.id)
        }
      }
      walk(data.tree?.children || [])
      return { tasks: flat, bounded: flat.length >= limit }
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t read this Journal’s work.')) }
  }

  async graphs(): Promise<JournalGraph[]> {
    try {
      const { data } = await api.get(`${this.base()}/graphs?limit=100`)
      if (!data.success) throw new Error(data.error || 'failed to list graphs')
      return data.graphs || []
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t load Journal graphs.')) }
  }

  async window(graphId: string, nodeId?: string): Promise<GraphWindow> {
    try {
      const suffix = query({ mode: 'window', node_id: nodeId, levels: 4, limit: 160, edge_limit: 480 })
      const { data } = await api.get(`${this.base()}/graphs/${encodeURIComponent(graphId)}${suffix}`)
      if (!data.success) throw new Error(data.error || 'failed to load graph window')
      return data.result
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t load the graph focus window.')) }
  }

  /**
   * One page of the whole graph. The server states the real totals in the
   * manifest and routes the next page in its own continuation, so a reader is
   * never told a count the graph does not hold.
   */
  async bundle(graphId: string, nodeOffset: number, edgeOffset: number): Promise<GraphBundlePage> {
    try {
      const suffix = query({
        mode: 'bundle',
        node_limit: BUNDLE_NODE_PAGE,
        edge_limit: BUNDLE_EDGE_PAGE,
        node_offset: nodeOffset,
        edge_offset: edgeOffset,
      })
      const { data } = await api.get(`${this.base()}/graphs/${encodeURIComponent(graphId)}${suffix}`)
      if (!data.success) throw new Error(data.error || 'failed to load the graph')
      return data.result
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t load the whole graph.')) }
  }

  /** A branch as its own canvas: the complete subtree under one record. */
  async subtree(graphId: string, rootId: string, nodeOffset = 0, edgeOffset = 0): Promise<GraphBundlePage> {
    try {
      const suffix = query({
        mode: 'subtree',
        root_id: rootId,
        node_limit: BUNDLE_NODE_PAGE,
        edge_limit: BUNDLE_EDGE_PAGE,
        node_offset: nodeOffset,
        edge_offset: edgeOffset,
      })
      const { data } = await api.get(`${this.base()}/graphs/${encodeURIComponent(graphId)}${suffix}`)
      if (!data.success) throw new Error(data.error || 'failed to load the branch')
      return data.result
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t open this branch.')) }
  }

  async search(graphId: string, text: string, mode: 'search' | 'semantic' | 'hybrid' = 'search'): Promise<GraphNode[]> {
    try {
      const suffix = query({ mode, query: text, limit: 60 })
      const { data } = await api.get(`${this.base()}/graphs/${encodeURIComponent(graphId)}${suffix}`)
      if (!data.success) throw new Error(data.error || 'search failed')
      return data.result?.items || []
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t search this graph.')) }
  }

  async timeline(graphId: string): Promise<TimelineItem[]> {
    try {
      const suffix = query({ mode: 'timeline', limit: 200 })
      const { data } = await api.get(`${this.base()}/graphs/${encodeURIComponent(graphId)}${suffix}`)
      if (!data.success) throw new Error(data.error || 'timeline failed')
      return data.result?.items || []
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t load the graph timeline.')) }
  }

  /** The cursor store itself: every agent that holds a position in this journal. */
  async cursors(limit = 200): Promise<JournalCursor[]> {
    try {
      const { data } = await api.get(`${this.base()}/cursors${query({ limit })}`)
      if (!data.success) throw new Error(data.error || 'failed to list cursors')
      return data.cursors?.items || []
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t load agent positions.')) }
  }

  /**
   * Work spans, journal-wide. A span begins at an identity's first write and
   * seals itself after inactivity, so this is what an agent actually did rather
   * than what it declared.
   */
  async spans(options: { state?: string; agentId?: string; taskId?: string; limit?: number; afterActivityAt?: number; afterSpanId?: string } = {}): Promise<SpanPage> {
    try {
      const suffix = query({
        state: options.state,
        agent_id: options.agentId,
        task_id: options.taskId,
        limit: options.limit ?? 200,
        after_activity_at: options.afterActivityAt,
        after_span_id: options.afterSpanId,
      })
      const { data } = await api.get(`${this.base()}/spans${suffix}`)
      if (!data.success) throw new Error(data.error || 'failed to list work spans')
      return data.spans
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t load work spans.')) }
  }

  /** Server-bucketed activity, so a lane at scale is counted rather than folded. */
  async activity(options: { bucket?: 'minute' | 'hour' | 'day'; agentId?: string; since?: number; limit?: number; afterBucketAt?: number; afterAgentId?: string } = {}): Promise<ActivityPage> {
    try {
      const suffix = query({
        bucket: options.bucket || 'hour',
        agent_id: options.agentId,
        since: options.since,
        limit: options.limit ?? 400,
        after_bucket_at: options.afterBucketAt,
        after_agent_id: options.afterAgentId,
      })
      const { data } = await api.get(`${this.base()}/activity${suffix}`)
      if (!data.success) throw new Error(data.error || 'failed to read activity')
      return data.activity
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t load journal activity.')) }
  }

  /** What the last on-demand assembly of this map did. */
  async assembly(graphId: string): Promise<AssemblyRun | null> {
    try {
      const { data } = await api.get(`${this.base()}/graphs/${encodeURIComponent(graphId)}/assemble`)
      if (!data.success) return null
      return data.assembly || null
    } catch { return null }
  }

  /** Requests one assembly pass; a pass already under way is the answer. */
  async assemble(graphId: string): Promise<AssemblyRun> {
    try {
      const { data } = await api.post(`${this.base()}/graphs/${encodeURIComponent(graphId)}/assemble`, {})
      if (!data.success) throw new Error(data.error || 'failed to start the assembly')
      return data.assembly
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t recompute this map.')) }
  }

  async health(): Promise<HealthState> {
    try {
      const { data } = await api.get(`${this.base()}/health`)
      return data.success ? (data.health || {}) : { status: 'unknown' }
    } catch { return { status: 'unknown' } }
  }
}

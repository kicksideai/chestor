import { api } from '@wippy-fe/proxy'
import type { BranchView, HealthState, JournalEvent, JournalState, JournalTask } from './types'

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

/** The newest facts the page reads; the server's own ceiling for one state read. */
export const RECENT_FACTS = 200

export class JournalApi {
  constructor(private readonly journalId: string) {}

  private base() { return `/api/v1/workspace/journals/${this.journalId}` }

  /** Counts, the newest facts, agent positions, open spans and live editing sessions. */
  async state(): Promise<JournalState> {
    try {
      // Tasks come from the tree read and graphs and artifacts are not shown,
      // so their pages in this read are held to one row.
      const suffix = query({ limit: RECENT_FACTS, cursor_limit: 200, span_limit: 200, task_limit: 1, graph_limit: 1, artifact_limit: 1 })
      const { data } = await api.get(`${this.base()}${suffix}`)
      if (!data.success) throw new Error(data.error || 'failed to read the journal')
      return data.journal
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t read this journal.')) }
  }

  /**
   * The whole task tree, flattened. The state read carries one page of tasks,
   * so counts and searches are taken over the tree read instead.
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
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t read this journal’s work.')) }
  }

  /** One task with its parents, children, dependencies and the facts recorded on it. */
  async branch(taskId: string, factLimit = 100): Promise<BranchView> {
    try {
      const { data } = await api.get(`${this.base()}/branch${query({ task_id: taskId, fact_limit: factLimit })}`)
      if (!data.success) throw new Error(data.error || 'failed to read the task')
      return data.branch
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t open this task.')) }
  }

  async event(eventId: string): Promise<JournalEvent> {
    try {
      const { data } = await api.get(`${this.base()}/events/${encodeURIComponent(eventId)}`)
      if (!data.success) throw new Error(data.error || 'failed to read the fact')
      return data.event
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t open this fact.')) }
  }

  /** Facts across the whole journal that match by text or, when available, by meaning. */
  async recall(text: string, limit = 30): Promise<JournalEvent[]> {
    try {
      const { data } = await api.post(`${this.base()}/search`, { query: text, limit })
      if (!data.success) throw new Error(data.error || 'search failed')
      return data.events || []
    } catch (err) { throw new Error(errorMessage(err, 'Couldn’t search this journal.')) }
  }

  async health(): Promise<HealthState> {
    try {
      const { data } = await api.get(`${this.base()}/health`)
      return data.success ? (data.health || {}) : { status: 'unknown' }
    } catch { return { status: 'unknown' } }
  }
}

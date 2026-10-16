/**
 * The map assembles itself from what the records already state. This module
 * holds the reading of one assembly run: whether a pass is under way, and the
 * one line that tells a reader what the last pass changed.
 */
export interface AssemblyRun {
  run_id?: string
  graph_id?: string
  status: string
  running?: boolean
  events_replayed?: number
  edges_added?: number
  edges_removed?: number
  suggested_added?: number
  suggested_removed?: number
  candidates_judged?: number
  model?: string
  refine_error?: string | null
  error?: string | null
  started_at?: number
  finished_at?: number
}

const ACTIVE = new Set(['queued', 'dispatched', 'running'])

export function isAssemblyRunning(run: AssemblyRun | null | undefined): boolean {
  if (!run) return false
  return run.running === true || ACTIVE.has(String(run.status || ''))
}

/** Whole units only: an age is context, not a measurement. */
export function relativeAge(then: number | undefined, nowSeconds: number): string {
  if (!then) return ''
  const seconds = Math.max(0, Math.floor(nowSeconds - then))
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function count(value: number | undefined): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0
}

/**
 * What the last pass did, in the vocabulary the map uses: structural relations
 * the rules derived, and the suggested ones a model proposed. A pass that
 * changed nothing says so rather than showing three zeroes.
 */
export function assemblySummary(run: AssemblyRun | null | undefined, nowSeconds: number): string {
  if (!run || run.status === 'never') return 'Not assembled yet'
  if (isAssemblyRunning(run)) return 'Assembling the map…'
  if (run.status === 'failed') return 'Last assembly failed'
  const parts: string[] = []
  const added = count(run.edges_added)
  const removed = count(run.edges_removed)
  const suggested = count(run.suggested_added)
  if (added) parts.push(`+${added} structural`)
  if (removed) parts.push(`−${removed} retired`)
  if (suggested) parts.push(`+${suggested} suggested`)
  if (!parts.length) parts.push('No change')
  const age = relativeAge(run.finished_at || run.started_at, nowSeconds)
  return age ? `${parts.join(' · ')} · ${age}` : parts.join(' · ')
}

/** The long form, for the control's title: the reasons behind the short line. */
export function assemblyDetail(run: AssemblyRun | null | undefined): string {
  if (!run || run.status === 'never') return 'Derive every relation the records already state.'
  if (isAssemblyRunning(run)) return 'Replaying the journal and reconciling the map.'
  if (run.status === 'failed') return run.error ? String(run.error) : 'The last assembly did not finish.'
  const lines: string[] = [`Replayed ${count(run.events_replayed)} records.`]
  if (count(run.candidates_judged)) lines.push(`Judged ${count(run.candidates_judged)} candidate pairs on ${run.model || 'the configured class'}.`)
  if (count(run.suggested_removed)) lines.push(`Replaced ${count(run.suggested_removed)} earlier suggestions.`)
  if (run.refine_error) lines.push(`Suggestions unavailable: ${run.refine_error}`)
  return lines.join(' ')
}

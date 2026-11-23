// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

/** Whole units only: an age is context, not a measurement. */
export function relativeAge(then: number | undefined, nowS: number): string {
  if (!then) return ''
  const seconds = Math.max(0, Math.floor(nowS - then))
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function absoluteTime(then: number | undefined): string {
  return then ? new Date(then * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : ''
}

/** The day heading a fact is listed under. */
export function dayLabel(then: number, nowS: number): string {
  const day = new Date(then * 1000)
  const today = new Date(nowS * 1000)
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000
  if (then >= midnight) return 'Today'
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).getTime() / 1000
  if (then >= yesterday) return 'Yesterday'
  return day.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
}

function words(value: string): string {
  const text = value.replace(/^.*:/, '').replace(/[._-]+/g, ' ').trim()
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

export function kindLabel(eventType: string): string { return words(eventType) || 'Note' }

export function statusLabel(status: string): string { return words(status) || 'Open' }

export type Severity = 'danger' | 'warn' | 'info' | 'success' | 'secondary'

/** The theme severity a task status reads as. */
export function statusSeverity(status: string): Severity {
  const value = String(status || '').toLowerCase()
  if (value === 'blocked') return 'danger'
  if (value === 'in_progress') return 'info'
  if (['done', 'closed', 'completed', 'resolved'].includes(value)) return 'success'
  return 'secondary'
}

/** The theme severity a fact kind reads as: what asks for a decision stands out. */
export function kindSeverity(eventType: string): Severity {
  const value = eventType.replace(/^.*:/, '').toLowerCase()
  if (value === 'blocker' || value === 'risk') return 'danger'
  if (value === 'question' || value === 'handoff') return 'warn'
  if (value === 'decision' || value === 'milestone') return 'success'
  return 'secondary'
}

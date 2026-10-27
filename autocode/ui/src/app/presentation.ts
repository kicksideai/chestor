// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Account, AgentInfo, Run } from './dto.ts'
import { onUnmounted, readonly, ref } from 'vue'

export type AccountState = 'ready' | 'cooling' | 'disabled' | 'unavailable'
export function accountState(a: Account, now = Date.now()): AccountState {
  if (!a.enabled) return 'disabled'
  if (a.cooldown_until && Date.parse(a.cooldown_until) > now) return 'cooling'
  return a.usable ? 'ready' : 'unavailable'
}

export function shortTime(value: string): string {
  if (!value) return ''
  const at = new Date(value)
  return Number.isNaN(at.getTime()) ? value : at.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}

export function errorText(e: unknown, fallback: string): string {
  return e instanceof Error && e.message ? e.message : fallback
}

const clock = ref(Date.now())
let clockUsers = 0
let clockTimer: ReturnType<typeof setInterval> | undefined
export function useRunClock() {
  clockUsers++
  if (clockTimer === undefined) {
    clock.value = Date.now()
    clockTimer = setInterval(() => { clock.value = Date.now() }, 1000)
  }
  onUnmounted(() => {
    clockUsers--
    if (!clockUsers) { clearInterval(clockTimer); clockTimer = undefined }
  })
  return readonly(clock)
}

export function agentIcon(id: string, agents: Pick<AgentInfo, 'id' | 'icon'>[]) {
  return agents.find(agent => agent.id === id)?.icon || 'tabler:terminal-2'
}

export function relativeTime(value: string, now = Date.now()) {
  const seconds = Math.max(0, Math.floor((now - Date.parse(value)) / 1000))
  if (!Number.isFinite(seconds)) return ''
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return '—'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${String(seconds % 60).padStart(2, '0')}s`
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
}

export function duration(run: Pick<Run, 'started_at' | 'finished_at' | 'status'>, now = Date.now()) {
  if (!run.started_at) return '—'
  const running = run.status === 'running' || run.status === 'queued'
  const ms = running ? now - Date.parse(run.started_at)
    : Date.parse(run.finished_at) - Date.parse(run.started_at)
  return formatDuration(ms)
}

export function timeout(ms: number) {
  return `${formatDuration(ms).replace(/ 00[ms]$/, '')} timeout`
}

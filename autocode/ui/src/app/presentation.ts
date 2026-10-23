// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Run } from './api.ts'
import { onUnmounted, ref } from 'vue'

export function useRunClock() {
  const now = ref(Date.now())
  const timer = window.setInterval(() => { now.value = Date.now() }, 1000)
  onUnmounted(() => window.clearInterval(timer))
  return now
}

export function agentIcon(id: string) {
  return ({ claude: 'simple-icons:claude', codex: 'simple-icons:openai', agy: 'simple-icons:googlegemini', muse: 'tabler:sparkles' } as Record<string, string>)[id] ?? 'tabler:terminal-2'
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

export function duration(run: Run, now = Date.now()) {
  if (!run.started_at) return '—'
  const running = run.status === 'running' || run.status === 'queued'
  const ms = running ? now - Date.parse(run.started_at)
    : typeof run.usage?.duration_ms === 'number' ? run.usage.duration_ms
    : Date.parse(run.finished_at) - Date.parse(run.started_at)
  return formatDuration(ms)
}

export function timeout(ms: number) {
  return `${formatDuration(ms).replace(/ 00[ms]$/, '')} timeout`
}

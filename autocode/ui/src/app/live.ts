// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onUnmounted, watch } from 'vue'
import { on } from '@wippy-fe/proxy'

// Topics announce changes for views to refetch.
export const live = {
  runs: (handler: () => void) => on('chestor.autocode.runs', handler),
  run: (id: string, handler: () => void) => on(`chestor.autocode.run.${id}`, handler),
  component: (id: string, handler: () => void) => on(`component.${id}`, handler),
}

// Concurrent refresh requests queue one follow-up pass.
export function serial(task: () => Promise<void>, active: () => boolean = () => true): () => Promise<void> {
  let current: Promise<void> | null = null
  let again = false
  const run = async () => {
    try {
      do { again = false; await task() } while (again && active())
    } finally {
      current = null
    }
  }
  return () => {
    if (!active()) return Promise.resolve()
    if (current) { again = true; return current }
    current = run()
    return current
  }
}

// Component subscriptions follow the listed ids and end on unmount.
export function useComponentTopics(ids: () => string[], handler: () => void) {
  const subscribed = new Map<string, () => void>()
  watch(ids, (next) => {
    const wanted = new Set(next)
    for (const [id, off] of subscribed) {
      if (!wanted.has(id)) { off(); subscribed.delete(id) }
    }
    for (const id of wanted) {
      if (!subscribed.has(id)) subscribed.set(id, live.component(id, handler))
    }
  }, { immediate: true })
  onUnmounted(() => {
    for (const off of subscribed.values()) off()
    subscribed.clear()
  })
}

// Pending responses and queued reads belong to the mounted component.
export function useAlive() {
  let alive = true
  onUnmounted(() => { alive = false })
  return () => alive
}

// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onUnmounted, watch } from 'vue'
import { live } from './api.ts'

// useComponentTopics keeps one subscription per component id the view lists:
// ids that join subscribe, ids that leave unsubscribe, and unmounting drops
// them all. Each message calls handler, which refetches the list.
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

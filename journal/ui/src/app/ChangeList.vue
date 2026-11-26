<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ItemRow from './ItemRow.vue'
import type { ItemRef } from './attention'
import { authorOf, changeCounts, changeSentence, factTitle } from './facts'
import type { FeedEntry } from './facts'
import { absoluteTime, kindLabel, kindSeverity, relativeAge } from './format'

/**
 * Facts as rows and each task's bookkeeping as one quiet line that opens into
 * plain sentences. `showTask` names the task on each row; a task's own history
 * leaves it out.
 */
const props = defineProps<{
  entries: FeedEntry[]
  taskTitle: (id?: string) => string
  showTask: boolean
  now: number
}>()
defineEmits<{ open: [target: ItemRef] }>()

const expanded = ref(new Set<string>())
function toggle(key: string) {
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}

function factDetail(entry: Extract<FeedEntry, { kind: 'fact' }>): string {
  return [authorOf(entry.event), props.showTask ? props.taskTitle(entry.event.task_id) : ''].filter(Boolean).join(' · ')
}
function foldTitle(entry: Extract<FeedEntry, { kind: 'changes' }>): string {
  if (!props.showTask) return changeCounts(entry.events)
  return props.taskTitle(entry.taskId) || 'Other updates'
}
</script>

<template>
  <template v-for="entry in entries" :key="entry.key">
    <ItemRow
      v-if="entry.kind === 'fact'"
      :title="factTitle(entry.event, taskTitle)" :detail="factDetail(entry)"
      :at="entry.at" :now="now" :tag="kindLabel(entry.event.event_type)" :severity="kindSeverity(entry.event.event_type)"
      :fresh="entry.fresh"
      @open="$emit('open', { kind: 'fact', id: entry.event.id })"
    />
    <div v-else class="jr-fold" :class="{ open: expanded.has(entry.key) }">
      <button type="button" class="jr-row jr-fold-head" :class="{ fresh: entry.fresh }" :aria-expanded="expanded.has(entry.key)" @click="toggle(entry.key)">
        <Icon icon="tabler:chevron-right" class="jr-fold-chev" aria-hidden="true" />
        <span class="jr-row-main">
          <span class="jr-row-line">
            <span class="jr-row-detail">
              <template v-if="showTask"><span class="jr-fold-task">{{ foldTitle(entry) }}</span> · {{ changeCounts(entry.events) }}</template>
              <template v-else>{{ foldTitle(entry) }}</template>
            </span>
            <time class="jr-row-time" :title="absoluteTime(entry.at)">{{ relativeAge(entry.at, now) }}</time>
          </span>
        </span>
      </button>
      <ul v-if="expanded.has(entry.key)" class="jr-fold-list">
        <li v-for="event in entry.events" :key="event.id">
          <span>{{ changeSentence(event, taskTitle) }}</span>
          <small>{{ [authorOf(event), relativeAge(event.ts, now)].filter(Boolean).join(' · ') }}</small>
        </li>
        <li v-if="showTask && entry.taskId && taskTitle(entry.taskId)">
          <button type="button" class="jr-link" @click="$emit('open', { kind: 'task', id: entry.taskId })">Open {{ taskTitle(entry.taskId) }}</button>
        </li>
      </ul>
    </div>
  </template>
</template>

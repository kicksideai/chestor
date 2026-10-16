<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { DORMANT_AFTER_S, dormantSubtrees } from './staleness'
import { relativeAge } from './assembly'
import type { Subtree } from './staleness'
import type { JournalTask } from './types'

/**
 * Cleanup, one decision per program.
 *
 * A subtree is dormant only when nothing anywhere inside it has moved for days,
 * so a live child always keeps its parent out of this list. Each entry states
 * what folding it would settle, and the whole subtree is one decision rather
 * than thirty clicks.
 */
const props = defineProps<{ tasks: JournalTask[]; now: number; taskBound: { loaded: number; total: number; hasMore: boolean } }>()
const emit = defineEmits<{ task: [id: string]; close: [] }>()

const subtrees = computed(() => dormantSubtrees(props.tasks, props.now))

/**
 * A program that still has one live child cannot be folded whole, so its
 * dormant work comes back as many small subtrees. Grouping them under the
 * program they belong to puts the decision back where a person makes it: one
 * program, one judgement, with the dormant parts of it listed underneath.
 */
const programs = computed(() => {
  const byId = new Map(props.tasks.map(task => [task.id, task]))
  const rootOf = (id: string): JournalTask | undefined => {
    let current = byId.get(id)
    const seen = new Set<string>()
    while (current?.parent_task_id && byId.has(current.parent_task_id) && !seen.has(current.id)) {
      seen.add(current.id)
      current = byId.get(current.parent_task_id)
    }
    return current
  }
  const groups = new Map<string, { root: JournalTask; parts: Subtree[] }>()
  for (const subtree of subtrees.value) {
    const root = rootOf(subtree.root.id) || (subtree.root as JournalTask)
    const existing = groups.get(root.id)
    if (existing) existing.parts.push(subtree)
    else groups.set(root.id, { root, parts: [subtree] })
  }
  return [...groups.values()]
    .map(group => ({
      root: group.root,
      parts: group.parts.sort((a, b) => a.lastActivityAt - b.lastActivityAt),
      tasks: group.parts.reduce((sum, part) => sum + part.members.length + 1, 0),
      open: group.parts.reduce((sum, part) => sum + part.openCount, 0),
      blocked: group.parts.reduce((sum, part) => sum + part.blockedCount, 0),
      settled: group.parts.reduce((sum, part) => sum + part.doneCount, 0),
      lastActivityAt: Math.max(...group.parts.map(part => part.lastActivityAt)),
      whole: group.parts.length === 1 && group.parts[0].root.id === group.root.id,
    }))
    .sort((a, b) => a.lastActivityAt - b.lastActivityAt)
})

const expanded = ref(new Set<string>())

const totals = computed(() => ({
  programs: programs.value.length,
  tasks: programs.value.reduce((sum, item) => sum + item.tasks, 0),
  open: programs.value.reduce((sum, item) => sum + item.open, 0),
}))

function toggle(id: string) {
  const next = new Set(expanded.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expanded.value = next
}

</script>

<template>
  <section class="jr-stale" aria-label="Stale review">
    <div class="jr-lens-meta">
      <span class="jr-lens-title">Stale review</span>
      <span class="jr-lens-facts">
        <b class="jr-numeric">{{ totals.programs }}</b> dormant program{{ totals.programs === 1 ? '' : 's' }}
        <i aria-hidden="true"></i>
        <b class="jr-numeric">{{ totals.tasks }}</b> tasks
        <i aria-hidden="true"></i>
        <b class="jr-numeric">{{ totals.open }}</b> still open
      </span>
      <span v-if="taskBound.hasMore" class="jr-lens-bound" :title="`The journal task read returns one page; ${(taskBound.total - taskBound.loaded).toLocaleString()} more tasks exist and this review does not see them`">
        <Icon icon="tabler:alert-circle" aria-hidden="true" />
        over {{ taskBound.loaded.toLocaleString() }} of {{ taskBound.total.toLocaleString() }} tasks
      </span>
      <button class="jr-lens-advice" @click="emit('close')"><Icon icon="tabler:x" aria-hidden="true" /> Done</button>
    </div>

    <div v-if="!subtrees.length" class="jr-empty-state">
      <Icon icon="tabler:mood-check" aria-hidden="true" />
      <h3>Nothing has gone dormant</h3>
      <p>Every program in this journal has been touched inside the last {{ Math.round(DORMANT_AFTER_S / 86400) }} days.</p>
    </div>

    <ol v-else class="jr-stale-list">
      <li v-for="item in programs" :key="item.root.id" class="jr-stale-item">
        <div class="jr-stale-head">
          <button
            class="jr-stale-fold"
            :aria-label="expanded.has(item.root.id) ? `Collapse ${item.root.title}` : `Expand ${item.root.title}`"
            :aria-expanded="expanded.has(item.root.id)"
            @click="toggle(item.root.id)"
          >
            <Icon :icon="expanded.has(item.root.id) ? 'tabler:chevron-down' : 'tabler:chevron-right'" aria-hidden="true" />
          </button>
          <button class="jr-stale-title" @click="emit('task', item.root.id)">
            <b>{{ item.root.title }}</b>
            <small>
              <span v-if="item.whole" class="jr-numeric">dormant whole</span>
              <span v-else class="jr-numeric">{{ item.parts.length }} dormant part{{ item.parts.length === 1 ? '' : 's' }}</span>
              <span class="jr-numeric">{{ item.tasks }} task{{ item.tasks === 1 ? '' : 's' }}</span>
              <span class="jr-numeric">{{ item.open }} open</span>
              <span v-if="item.blocked" class="jr-numeric">{{ item.blocked }} blocked</span>
              <span class="jr-numeric">{{ item.settled }} settled</span>
            </small>
          </button>
          <time class="jr-numeric dormant">{{ relativeAge(item.lastActivityAt, now) }}</time>
        </div>
        <ul v-if="expanded.has(item.root.id)" class="jr-stale-members">
          <template v-for="part in item.parts" :key="part.root.id">
            <li>
              <button @click="emit('task', part.root.id)">
                <span :class="['jr-state-chip', `state-${part.root.status}`]">{{ part.root.status.replace(/_/g, ' ') }}</span>
                <span><b>{{ part.root.title }}</b></span>
                <time class="jr-numeric">{{ relativeAge(part.lastActivityAt, now) }}</time>
              </button>
            </li>
            <li v-for="member in part.members" :key="member.id" class="nested">
              <button @click="emit('task', member.id)">
                <span :class="['jr-state-chip', `state-${member.status}`]">{{ member.status.replace(/_/g, ' ') }}</span>
                <span>{{ member.title }}</span>
                <time class="jr-numeric">{{ relativeAge(member.updated_at, now) }}</time>
              </button>
            </li>
          </template>
        </ul>
      </li>
    </ol>

    <p class="jr-stale-note">
      This is a review surface. Settling work remains a guarded agent action with a live task lease,
      evidence, and the transition-specific fields required by the work protocol.
    </p>
  </section>
</template>

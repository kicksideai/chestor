<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import ChangeList from './ChangeList.vue'
import ItemRow from './ItemRow.vue'
import type { ItemRef } from './attention'
import { authorOf, factTitle, foldChanges } from './facts'
import { absoluteTime, kindLabel, kindSeverity, relativeAge, statusLabel, statusSeverity, UNLOADED_TASK } from './format'
import type { Detail } from './useJournal'

/**
 * One item: a task with its place, links, parts and history, or one fact with
 * its task. The path sits above the title and the state beside it, once.
 */
const props = defineProps<{
  detail: Detail | null
  loading: boolean
  error: string
  canBack: boolean
  /** One column: the reader replaces the list, so leaving it is always a step back. */
  compact: boolean
  taskTitle: (id?: string) => string
  now: number
}>()
const emit = defineEmits<{ open: [target: ItemRef]; back: []; close: [] }>()

const branch = computed(() => props.detail?.kind === 'task' ? props.detail.branch : null)
const fact = computed(() => props.detail?.kind === 'fact' ? props.detail.event : null)
const task = computed(() => branch.value?.task || null)

const waitingOn = computed(() => (branch.value?.deps?.incoming || []).filter(dep => dep.kind === 'blocks').map(dep => dep.from_task_id))
const holdsUp = computed(() => (branch.value?.deps?.outgoing || []).filter(dep => dep.kind === 'blocks').map(dep => dep.to_task_id))
const related = computed(() => [
  ...(branch.value?.deps?.outgoing || []).filter(dep => dep.kind !== 'blocks').map(dep => ({ id: dep.to_task_id, kind: dep.kind })),
  ...(branch.value?.deps?.incoming || []).filter(dep => dep.kind !== 'blocks').map(dep => ({ id: dep.from_task_id, kind: dep.kind })),
])
const history = computed(() => foldChanges(branch.value?.facts || [], 'history'))

const title = computed(() => task.value?.title || (fact.value ? factTitle(fact.value, props.taskTitle) : ''))
const summary = computed(() => task.value?.description || task.value?.digest || '')
const factBody = computed(() => {
  const body = (fact.value?.body || '').trim()
  return body && body !== title.value ? body : ''
})
const lifecycle = computed(() => {
  const state = String(fact.value?.effective_state || fact.value?.lifecycle || 'active').toLowerCase()
  return state === 'active' ? '' : statusLabel(state)
})

function named(id?: string): string { return props.taskTitle(id) || UNLOADED_TASK }
function follow(target: ItemRef) { emit('open', target) }
function leave() { if (props.canBack) emit('back'); else emit('close') }
</script>

<template>
  <article class="jr-detail" aria-live="polite">
    <header class="jr-detail-head">
      <button v-if="compact || canBack" type="button" class="kx-iconbtn" aria-label="Back" title="Back" @click="leave">
        <Icon icon="tabler:arrow-left" aria-hidden="true" />
      </button>
      <div class="jr-detail-titles">
        <nav v-if="branch && branch.ancestors.length" class="jr-path" aria-label="Part of">
          <template v-for="(item, index) in branch.ancestors" :key="item.id">
            <Icon v-if="index" icon="tabler:chevron-right" aria-hidden="true" />
            <button type="button" @click="follow({ kind: 'task', id: item.id })">{{ item.title }}</button>
          </template>
        </nav>
        <nav v-else-if="fact?.task_id" class="jr-path" aria-label="Task">
          <button type="button" @click="follow({ kind: 'task', id: fact.task_id })">{{ named(fact.task_id) }}</button>
        </nav>
        <div class="jr-title-line">
          <h1>{{ loading && !detail ? 'Opening…' : title }}</h1>
          <Tag v-if="task" :value="statusLabel(task.status)" :severity="statusSeverity(task.status)" class="kx-tag-sm" />
          <Tag v-else-if="fact" :value="kindLabel(fact.event_type)" :severity="kindSeverity(fact.event_type)" class="kx-tag-sm" />
        </div>
        <p v-if="fact" class="jr-meta">{{ [authorOf(fact), absoluteTime(fact.ts)].filter(Boolean).join(' · ') }}</p>
        <p v-else-if="task" class="jr-meta">Updated {{ relativeAge(task.updated_at, now) }}</p>
      </div>
      <button v-if="!compact" type="button" class="kx-iconbtn" aria-label="Close" title="Close" @click="emit('close')">
        <Icon icon="tabler:x" aria-hidden="true" />
      </button>
    </header>

    <EmptyState v-if="error" icon="tabler:alert-triangle" title="This item could not be opened" :hint="error" />
    <div v-else-if="loading && !detail" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…</div>

    <template v-else-if="branch && task">
      <p v-if="summary" class="jr-body">{{ summary }}</p>
      <section v-if="waitingOn.length" class="jr-block">
        <h2>Waiting on</h2>
        <ItemRow v-for="id in waitingOn" :key="id" :title="named(id)" :now="now" @open="follow({ kind: 'task', id })" />
      </section>
      <section v-if="holdsUp.length" class="jr-block">
        <h2>Holds up</h2>
        <ItemRow v-for="id in holdsUp" :key="id" :title="named(id)" :now="now" @open="follow({ kind: 'task', id })" />
      </section>
      <section v-if="related.length" class="jr-block">
        <h2>Related</h2>
        <ItemRow v-for="item in related" :key="`${item.kind}:${item.id}`" :title="named(item.id)" :tag="statusLabel(item.kind)" :now="now" @open="follow({ kind: 'task', id: item.id })" />
      </section>
      <section v-if="branch.children.length" class="jr-block">
        <h2>Parts <span class="jr-count">{{ branch.children.length }}</span></h2>
        <ItemRow
          v-for="child in branch.children" :key="child.id"
          :title="child.title" :at="child.updated_at" :now="now"
          :tag="statusLabel(child.status)" :severity="statusSeverity(child.status)"
          :detail="child.open_count ? `${child.open_count} open inside` : ''"
          @open="follow({ kind: 'task', id: child.id })"
        />
      </section>
      <section class="jr-block">
        <h2>History</h2>
        <p v-if="!history.length" class="jr-list-empty">Nothing has been recorded on this task yet.</p>
        <ChangeList :entries="history" :task-title="taskTitle" :show-task="false" :now="now" @open="follow" />
      </section>
    </template>

    <EmptyState v-else-if="branch" icon="tabler:file-unknown" title="This task is no longer in the journal" />

    <template v-else-if="fact">
      <div v-if="lifecycle || fact.tags?.length" class="jr-tags">
        <Tag v-if="lifecycle" :value="lifecycle" severity="secondary" class="kx-tag-sm" />
        <Tag v-for="tag in fact.tags || []" :key="tag" :value="tag" severity="secondary" class="kx-tag-sm" />
      </div>
      <p v-if="factBody" class="jr-body">{{ factBody }}</p>
    </template>
  </article>
</template>
